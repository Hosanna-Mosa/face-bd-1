const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Section = require('./src/models/Section');

// Configure MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

/**
 * Find duplicate sections by sectionId
 * @returns {Promise<Object>} Object with duplicates grouped by sectionId
 */
async function findDuplicateSections() {
  try {
    console.log('🔍 Finding duplicate sections...\n');
    
    // Aggregate to find duplicates
    const duplicates = await Section.aggregate([
      {
        $group: {
          _id: '$sectionId',
          count: { $sum: 1 },
          sections: { $push: '$$ROOT' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    if (duplicates.length === 0) {
      console.log('✅ No duplicate sections found!');
      return {};
    }

    console.log(`❌ Found ${duplicates.length} section IDs with duplicates:\n`);
    
    const duplicateGroups = {};
    
    duplicates.forEach(group => {
      const sectionId = group._id;
      const count = group.count;
      const sections = group.sections;
      
      duplicateGroups[sectionId] = sections;
      
      console.log(`📁 ${sectionId}: ${count} duplicates`);
      sections.forEach((section, index) => {
        console.log(`   ${index + 1}. ID: ${section._id}`);
        console.log(`      Title: ${section.title}`);
        console.log(`      Language: ${section.language}`);
        console.log(`      Page: ${section.page || 'MISSING'}`);
        console.log(`      Page Number: ${section.pageNumber}`);
        console.log(`      Created: ${section.createdAt}`);
        console.log('');
      });
    });

    return duplicateGroups;

  } catch (error) {
    console.error('❌ Error finding duplicates:', error.message);
    throw error;
  }
}

/**
 * Remove duplicate sections, keeping the most recent one
 * @param {Object} duplicateGroups - Groups of duplicate sections
 * @returns {Promise<Object>} Summary of removal operation
 */
async function removeDuplicateSections(duplicateGroups) {
  try {
    console.log('🧹 Removing duplicate sections...\n');
    
    let totalRemoved = 0;
    let totalGroups = Object.keys(duplicateGroups).length;
    
    for (const [sectionId, sections] of Object.entries(duplicateGroups)) {
      console.log(`🔄 Processing duplicates for: ${sectionId}`);
      
      // Sort by creation date, keep the most recent
      const sortedSections = sections.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      const sectionToKeep = sortedSections[0];
      const sectionsToRemove = sortedSections.slice(1);
      
      console.log(`   ✅ Keeping: ${sectionToKeep._id} (created: ${sectionToKeep.createdAt})`);
      console.log(`   🗑️  Removing: ${sectionsToRemove.length} duplicates`);
      
      // Remove duplicate sections
      for (const section of sectionsToRemove) {
        try {
          await Section.deleteOne({ _id: section._id });
          console.log(`      ❌ Removed: ${section._id}`);
          totalRemoved++;
        } catch (error) {
          console.error(`      ❌ Error removing ${section._id}:`, error.message);
        }
      }
      
      console.log('');
    }

    return {
      totalGroups,
      totalRemoved,
      success: true
    };

  } catch (error) {
    console.error('❌ Error removing duplicates:', error.message);
    throw error;
  }
}

/**
 * Show current section count by page
 */
async function showSectionCounts() {
  try {
    console.log('📊 Current section counts by page:\n');
    
    const sections = await Section.find({}, 'sectionId page');
    
    // Group by page
    const sectionsByPage = {};
    sections.forEach(section => {
      const page = section.page || 'unknown';
      if (!sectionsByPage[page]) {
        sectionsByPage[page] = [];
      }
      sectionsByPage[page].push(section.sectionId);
    });

    // Show counts
    Object.keys(sectionsByPage).forEach(page => {
      const uniqueSections = [...new Set(sectionsByPage[page])];
      console.log(`📄 ${page.toUpperCase()}: ${uniqueSections.length} unique sections`);
    });

    console.log(`\n📊 Total sections: ${sections.length}`);
    console.log(`📊 Total unique section IDs: ${new Set(sections.map(s => s.sectionId)).size}`);

  } catch (error) {
    console.error('❌ Error showing section counts:', error.message);
  }
}

/**
 * Show detailed duplicate analysis
 */
async function showDuplicateAnalysis() {
  try {
    console.log('🔍 Detailed duplicate analysis...\n');
    
    const duplicates = await findDuplicateSections();
    
    if (Object.keys(duplicates).length === 0) {
      return;
    }

    // Show summary by page
    console.log('📋 DUPLICATE SUMMARY BY PAGE:');
    console.log('='.repeat(60));
    
    const pageDuplicates = {};
    
    Object.entries(duplicates).forEach(([sectionId, sections]) => {
      sections.forEach(section => {
        const page = section.page || 'unknown';
        if (!pageDuplicates[page]) {
          pageDuplicates[page] = [];
        }
        pageDuplicates[page].push(sectionId);
      });
    });

    Object.keys(pageDuplicates).forEach(page => {
      const uniqueDuplicates = [...new Set(pageDuplicates[page])];
      console.log(`📄 ${page.toUpperCase()}: ${uniqueDuplicates.length} duplicate section IDs`);
      uniqueDuplicates.forEach(sectionId => {
        const count = duplicates[sectionId].length;
        console.log(`   - ${sectionId}: ${count} copies`);
      });
    });

    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error in duplicate analysis:', error.message);
  }
}

/**
 * Dry run - show what would be removed without actually removing
 */
async function dryRunRemoval() {
  try {
    console.log('🔍 DRY RUN - Showing what would be removed:\n');
    
    const duplicates = await findDuplicateSections();
    
    if (Object.keys(duplicates).length === 0) {
      console.log('✅ No duplicates to remove');
      return;
    }

    let totalWouldRemove = 0;
    
    Object.entries(duplicates).forEach(([sectionId, sections]) => {
      const sectionsToRemove = sections.slice(1); // Keep first, remove rest
      totalWouldRemove += sectionsToRemove.length;
      
      console.log(`📁 ${sectionId}: Would remove ${sectionsToRemove.length} duplicates`);
      sectionsToRemove.forEach((section, index) => {
        console.log(`   ${index + 1}. ${section._id} - ${section.title}`);
      });
      console.log('');
    });

    console.log(`📋 DRY RUN SUMMARY:`);
    console.log(`📊 Would remove: ${totalWouldRemove} duplicate sections`);
    console.log(`📊 Would keep: ${Object.keys(duplicates).length} original sections`);

  } catch (error) {
    console.error('❌ Error in dry run:', error.message);
  }
}

// Main execution
async function main() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully\n');

    // Check command line arguments
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      // No arguments - show help
      console.log('🆘 Duplicate Section Removal Script Help\n');
      console.log('Usage:');
      console.log('  node remove-duplicate-sections.js --find          # Find duplicates (dry run)');
      console.log('  node remove-duplicate-sections.js --remove        # Remove duplicates');
      console.log('  node remove-duplicate-sections.js --counts        # Show section counts');
      console.log('  node remove-duplicate-sections.js --analysis      # Detailed duplicate analysis');
      console.log('  node remove-duplicate-sections.js --dry-run       # Show what would be removed');
      console.log('  node remove-duplicate-sections.js --help          # Show this help\n');
      console.log('Examples:');
      console.log('  node remove-duplicate-sections.js --find');
      console.log('  node remove-duplicate-sections.js --remove');
      console.log('  node remove-duplicate-sections.js --counts');
    } else if (args[0] === '--find' || args[0] === '-f') {
      // Find duplicates
      await findDuplicateSections();
    } else if (args[0] === '--remove' || args[0] === '-r') {
      // Remove duplicates
      const duplicates = await findDuplicateSections();
      if (Object.keys(duplicates).length > 0) {
        const result = await removeDuplicateSections(duplicates);
        console.log('\n📋 REMOVAL SUMMARY:');
        console.log('='.repeat(60));
        console.log(`📊 Duplicate groups processed: ${result.totalGroups}`);
        console.log(`🗑️  Total sections removed: ${result.totalRemoved}`);
        console.log('='.repeat(60));
      }
    } else if (args[0] === '--counts' || args[0] === '-c') {
      // Show section counts
      await showSectionCounts();
    } else if (args[0] === '--analysis' || args[0] === '-a') {
      // Show detailed analysis
      await showDuplicateAnalysis();
    } else if (args[0] === '--dry-run' || args[0] === '-d') {
      // Dry run
      await dryRunRemoval();
    } else if (args[0] === '--help' || args[0] === '-h') {
      // Show help
      console.log('🆘 Duplicate Section Removal Script Help\n');
      console.log('Usage:');
      console.log('  node remove-duplicate-sections.js --find          # Find duplicates (dry run)');
      console.log('  node remove-duplicate-sections.js --remove        # Remove duplicates');
      console.log('  node remove-duplicate-sections.js --counts        # Show section counts');
      console.log('  node remove-duplicate-sections.js --analysis      # Detailed duplicate analysis');
      console.log('  node remove-duplicate-sections.js --dry-run       # Show what would be removed');
      console.log('  node remove-duplicate-sections.js --help          # Show this help\n');
      console.log('Examples:');
      console.log('  node remove-duplicate-sections.js --find');
      console.log('  node remove-duplicate-sections.js --remove');
      console.log('  node remove-duplicate-sections.js --counts');
    } else {
      console.log('❌ Unknown argument. Use --help for usage information.');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  } finally {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
    }
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  findDuplicateSections,
  removeDuplicateSections,
  showSectionCounts,
  showDuplicateAnalysis,
  dryRunRemoval
};
