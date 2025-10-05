/**
 * Translation Verification Script
 * 
 * This script checks all pages and sections to verify if translations are complete.
 * It reports which sections are missing translations and provides a detailed status.
 * 
 * Usage:
 * node src/scripts/verify-translations.js
 * node src/scripts/verify-translations.js --detailed
 * node src/scripts/verify-translations.js --page <page-slug>
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Section = require('../models/Section');
const Page = require('../models/Page');

// Target languages for translation
const TARGET_LANGUAGES = ['fr', 'pt', 'es', 'ru', 'zh'];

// Database connection
async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

/**
 * Check translation status for a single section
 * @param {Object} section - Section object
 * @returns {Object} - Translation status object
 */
function checkSectionTranslationStatus(section) {
  const translations = section.translations || {};
  const translationCount = Object.keys(translations).length;
  const expectedCount = TARGET_LANGUAGES.length;
  
  const missingLanguages = TARGET_LANGUAGES.filter(lang => !translations[lang]);
  const hasTranslations = translationCount > 0;
  const isComplete = translationCount === expectedCount;
  
  return {
    sectionId: section.sectionId || section._id.toString(),
    title: section.title,
    page: section.page,
    pageNumber: section.pageNumber,
    translationCount,
    expectedCount,
    isComplete,
    hasTranslations,
    missingLanguages,
    translations: translations
  };
}

/**
 * Verify translations for all pages and sections
 * @param {boolean} detailed - Show detailed information
 * @param {string} specificPage - Check only specific page (optional)
 */
async function verifyAllTranslations(detailed = false, specificPage = null) {
  console.log('\n🔍 Translation Verification Report');
  console.log('==================================');
  
  try {
    let sections = [];
    
    if (specificPage) {
      // Get page first, then get sections by page reference
      const page = await Page.findOne({ slug: specificPage, isActive: true });
      if (!page) {
        console.log(`❌ Page '${specificPage}' not found or not active`);
        return;
      }
      
      console.log(`📄 Checking page: ${page.title} (${page.slug})`);
      console.log(`📋 Page has ${page.sections.length} section references`);
      
      // Get sections by their IDs from the page
      sections = await Section.find({
        _id: { $in: page.sections },
        language: 'en',
        isActive: true
      }).sort({ pageNumber: 1, sectionId: 1 });
      
      console.log(`✅ Found ${sections.length} English sections for this page`);
    } else {
      // Build query for all sections
      const sectionQuery = {
        language: 'en',
        isActive: true
      };
      
      // Fetch all English sections
      sections = await Section.find(sectionQuery)
        .populate('page', 'title slug')
        .sort({ page: 1, pageNumber: 1, sectionId: 1 });
    }
    
    if (sections.length === 0) {
      console.log('⚠️  No English sections found');
      return;
    }
    
    // Check translation status for each section
    const sectionStatuses = sections.map(section => checkSectionTranslationStatus(section));
    
    // Group by page
    const pageGroups = {};
    sectionStatuses.forEach(status => {
      const pageSlug = status.page || 'unknown';
      if (!pageGroups[pageSlug]) {
        pageGroups[pageSlug] = [];
      }
      pageGroups[pageSlug].push(status);
    });
    
    // Calculate overall statistics
    const totalSections = sectionStatuses.length;
    const completeSections = sectionStatuses.filter(s => s.isComplete).length;
    const partialSections = sectionStatuses.filter(s => s.hasTranslations && !s.isComplete).length;
    const untranslatedSections = sectionStatuses.filter(s => !s.hasTranslations).length;
    
    // Display summary
    console.log(`\n📊 Overall Statistics:`);
    console.log(`Total sections: ${totalSections}`);
    console.log(`✅ Complete translations: ${completeSections} (${((completeSections/totalSections)*100).toFixed(1)}%)`);
    console.log(`⚠️  Partial translations: ${partialSections} (${((partialSections/totalSections)*100).toFixed(1)}%)`);
    console.log(`❌ No translations: ${untranslatedSections} (${((untranslatedSections/totalSections)*100).toFixed(1)}%)`);
    
    // Display page-by-page breakdown
    console.log(`\n📄 Page-by-Page Breakdown:`);
    console.log('========================');
    
    Object.entries(pageGroups).forEach(([pageSlug, pageSections]) => {
      const pageComplete = pageSections.filter(s => s.isComplete).length;
      const pagePartial = pageSections.filter(s => s.hasTranslations && !s.isComplete).length;
      const pageUntranslated = pageSections.filter(s => !s.hasTranslations).length;
      const pageTotal = pageSections.length;
      
      console.log(`\n📄 ${pageSlug} (${pageTotal} sections)`);
      console.log(`   ✅ Complete: ${pageComplete} | ⚠️  Partial: ${pagePartial} | ❌ None: ${pageUntranslated}`);
      
      if (detailed) {
        pageSections.forEach((status, index) => {
          const statusIcon = status.isComplete ? '✅' : status.hasTranslations ? '⚠️' : '❌';
          console.log(`   ${index + 1}. ${statusIcon} ${status.title}`);
          
          if (!status.isComplete) {
            if (status.missingLanguages.length > 0) {
              console.log(`      Missing: ${status.missingLanguages.join(', ')}`);
            }
            if (detailed && status.translations) {
              Object.entries(status.translations).forEach(([lang, trans]) => {
                console.log(`      ${lang}: "${trans.title}"`);
              });
            }
          }
        });
      }
    });
    
    // Show missing translations summary
    console.log(`\n🔍 Missing Translations Summary:`);
    console.log('===============================');
    
    const missingByLanguage = {};
    TARGET_LANGUAGES.forEach(lang => {
      missingByLanguage[lang] = sectionStatuses.filter(s => s.missingLanguages.includes(lang)).length;
    });
    
    TARGET_LANGUAGES.forEach(lang => {
      const missingCount = missingByLanguage[lang];
      const percentage = ((missingCount / totalSections) * 100).toFixed(1);
      console.log(`${lang.toUpperCase()}: ${missingCount} sections missing (${percentage}%)`);
    });
    
    // Show sections that need attention
    const needsAttention = sectionStatuses.filter(s => !s.isComplete);
    if (needsAttention.length > 0) {
      console.log(`\n⚠️  Sections Needing Attention (${needsAttention.length}):`);
      console.log('==========================================');
      
      needsAttention.forEach((status, index) => {
        console.log(`${index + 1}. ${status.page} - ${status.title}`);
        console.log(`   Missing: ${status.missingLanguages.join(', ')}`);
        console.log(`   Current: ${Object.keys(status.translations).join(', ') || 'None'}`);
      });
    }
    
    // Generate recommendations
    console.log(`\n💡 Recommendations:`);
    console.log('==================');
    
    if (untranslatedSections > 0) {
      console.log(`• Run translation for ${untranslatedSections} untranslated sections`);
    }
    
    if (partialSections > 0) {
      console.log(`• Complete translations for ${partialSections} partially translated sections`);
    }
    
    if (completeSections === totalSections) {
      console.log('🎉 All sections are fully translated!');
    } else {
      const completionRate = ((completeSections / totalSections) * 100).toFixed(1);
      console.log(`• Overall completion rate: ${completionRate}%`);
    }
    
    // Return summary data
    return {
      totalSections,
      completeSections,
      partialSections,
      untranslatedSections,
      completionRate: ((completeSections / totalSections) * 100).toFixed(1),
      pageGroups,
      missingByLanguage
    };
    
  } catch (error) {
    console.error('❌ Error verifying translations:', error.message);
    throw error;
  }
}

/**
 * Verify translations for a specific page
 * @param {string} pageSlug - Page slug to check
 * @param {boolean} detailed - Show detailed information
 */
async function verifyPageTranslations(pageSlug, detailed = false) {
  console.log(`\n🔍 Translation Verification for Page: ${pageSlug}`);
  console.log('==========================================');
  
  try {
    // Check if page exists
    const page = await Page.findOne({ slug: pageSlug, isActive: true });
    if (!page) {
      console.log(`❌ Page '${pageSlug}' not found or not active`);
      return;
    }
    
    console.log(`📄 Page: ${page.title} (${page.slug})`);
    console.log(`📋 Page has ${page.sections.length} section references`);
    
    // Get sections by their IDs from the page
    const sections = await Section.find({
      _id: { $in: page.sections },
      language: 'en',
      isActive: true
    }).sort({ pageNumber: 1, sectionId: 1 });
    
    console.log(`✅ Found ${sections.length} English sections for this page`);
    
    if (sections.length === 0) {
      console.log('⚠️  No English sections found for this page');
      return;
    }
    
    // Check translation status for each section
    const sectionStatuses = sections.map(section => checkSectionTranslationStatus(section));
    
    // Calculate statistics
    const totalSections = sectionStatuses.length;
    const completeSections = sectionStatuses.filter(s => s.isComplete).length;
    const partialSections = sectionStatuses.filter(s => s.hasTranslations && !s.isComplete).length;
    const untranslatedSections = sectionStatuses.filter(s => !s.hasTranslations).length;
    
    // Display summary
    console.log(`\n📊 Page Statistics:`);
    console.log(`Total sections: ${totalSections}`);
    console.log(`✅ Complete translations: ${completeSections} (${((completeSections/totalSections)*100).toFixed(1)}%)`);
    console.log(`⚠️  Partial translations: ${partialSections} (${((partialSections/totalSections)*100).toFixed(1)}%)`);
    console.log(`❌ No translations: ${untranslatedSections} (${((untranslatedSections/totalSections)*100).toFixed(1)}%)`);
    
    // Display sections
    console.log(`\n📋 Sections:`);
    console.log('============');
    
    sectionStatuses.forEach((status, index) => {
      const statusIcon = status.isComplete ? '✅' : status.hasTranslations ? '⚠️' : '❌';
      console.log(`\n${index + 1}. ${statusIcon} ${status.title}`);
      console.log(`   Section ID: ${status.sectionId}`);
      console.log(`   Page Number: ${status.pageNumber}`);
      
      if (!status.isComplete) {
        if (status.missingLanguages.length > 0) {
          console.log(`   Missing: ${status.missingLanguages.join(', ')}`);
        }
        if (status.translations && Object.keys(status.translations).length > 0) {
          console.log(`   Current: ${Object.keys(status.translations).join(', ')}`);
        }
      } else {
        console.log(`   All languages: ${TARGET_LANGUAGES.join(', ')}`);
      }
      
      if (detailed && status.translations) {
        Object.entries(status.translations).forEach(([lang, trans]) => {
          console.log(`   ${lang}: "${trans.title}"`);
        });
      }
    });
    
    // Show missing translations summary
    console.log(`\n🔍 Missing Translations Summary:`);
    console.log('===============================');
    
    const missingByLanguage = {};
    TARGET_LANGUAGES.forEach(lang => {
      missingByLanguage[lang] = sectionStatuses.filter(s => s.missingLanguages.includes(lang)).length;
    });
    
    TARGET_LANGUAGES.forEach(lang => {
      const missingCount = missingByLanguage[lang];
      const percentage = ((missingCount / totalSections) * 100).toFixed(1);
      console.log(`${lang.toUpperCase()}: ${missingCount} sections missing (${percentage}%)`);
    });
    
    // Show sections that need attention
    const needsAttention = sectionStatuses.filter(s => !s.isComplete);
    if (needsAttention.length > 0) {
      console.log(`\n⚠️  Sections Needing Attention (${needsAttention.length}):`);
      console.log('==========================================');
      
      needsAttention.forEach((status, index) => {
        console.log(`${index + 1}. ${status.title} (ID: ${status.sectionId})`);
        console.log(`   Missing: ${status.missingLanguages.join(', ')}`);
        console.log(`   Current: ${Object.keys(status.translations).join(', ') || 'None'}`);
      });
    }
    
    // Generate recommendations
    console.log(`\n💡 Recommendations:`);
    console.log('==================');
    
    if (untranslatedSections > 0) {
      console.log(`• Run translation for ${untranslatedSections} untranslated sections`);
    }
    
    if (partialSections > 0) {
      console.log(`• Complete translations for ${partialSections} partially translated sections`);
    }
    
    if (completeSections === totalSections) {
      console.log('🎉 All sections are fully translated!');
    } else {
      const completionRate = ((completeSections / totalSections) * 100).toFixed(1);
      console.log(`• Overall completion rate: ${completionRate}%`);
    }
    
    return {
      totalSections,
      completeSections,
      partialSections,
      untranslatedSections,
      completionRate: ((completeSections / totalSections) * 100).toFixed(1),
      sectionStatuses,
      missingByLanguage
    };
    
  } catch (error) {
    console.error('❌ Error verifying page translations:', error.message);
    throw error;
  }
}

/**
 * Get section IDs for a specific page
 * @param {string} pageSlug - Page slug to get section IDs for
 */
async function getPageSectionIds(pageSlug) {
  console.log(`\n📋 Section IDs for Page: ${pageSlug}`);
  console.log('=====================================');
  
  try {
    // Check if page exists
    const page = await Page.findOne({ slug: pageSlug, isActive: true });
    if (!page) {
      console.log(`❌ Page '${pageSlug}' not found or not active`);
      return;
    }
    
    console.log(`📄 Page: ${page.title} (${page.slug})`);
    console.log(`📋 Page has ${page.sections.length} section references`);
    
    // Get all sections by their IDs from the page (any language, any status)
    const allSections = await Section.find({
      _id: { $in: page.sections }
    }).sort({ pageNumber: 1, sectionId: 1 });
    
    // Get only English active sections
    const sections = allSections.filter(s => s.language === 'en' && s.isActive === true);
    
    console.log(`📊 Section Analysis:`);
    console.log(`   Total section references: ${page.sections.length}`);
    console.log(`   Found in database: ${allSections.length}`);
    console.log(`   English & active: ${sections.length}`);
    
    if (allSections.length < page.sections.length) {
      const missingIds = page.sections.filter(id => !allSections.some(s => s._id.toString() === id.toString()));
      console.log(`   Missing from database: ${missingIds.length}`);
      if (missingIds.length > 0) {
        console.log(`   Missing IDs: ${missingIds.join(', ')}`);
      }
    }
    
    if (allSections.length > sections.length) {
      const nonEnglishOrInactive = allSections.filter(s => s.language !== 'en' || s.isActive !== true);
      console.log(`   Non-English or inactive: ${nonEnglishOrInactive.length}`);
      nonEnglishOrInactive.forEach(s => {
        console.log(`     - ${s.title} (${s.language}, active: ${s.isActive})`);
      });
    }
    
    console.log(`✅ Found ${sections.length} English sections for this page`);
    
    if (sections.length === 0) {
      console.log('⚠️  No English sections found for this page');
      return;
    }
    
    // Display section IDs and details
    console.log(`\n📋 Section Details:`);
    console.log('==================');
    
    sections.forEach((section, index) => {
      console.log(`\n${index + 1}. Section ID: ${section.sectionId || section._id}`);
      console.log(`   Title: ${section.title}`);
      console.log(`   Page Number: ${section.pageNumber}`);
      console.log(`   MongoDB ID: ${section._id}`);
      console.log(`   Has Translations: ${Object.keys(section.translations || {}).length > 0 ? 'Yes' : 'No'}`);
      
      if (section.translations && Object.keys(section.translations).length > 0) {
        console.log(`   Languages: ${Object.keys(section.translations).join(', ')}`);
      }
    });
    
    // Return section IDs for programmatic use
    const sectionIds = sections.map(s => s.sectionId || s._id.toString());
    console.log(`\n📝 Section IDs Array:`);
    console.log(JSON.stringify(sectionIds, null, 2));
    
    return {
      page: {
        title: page.title,
        slug: page.slug,
        totalSections: page.sections.length
      },
      sections: sections.map(s => ({
        sectionId: s.sectionId || s._id.toString(),
        title: s.title,
        pageNumber: s.pageNumber,
        mongoId: s._id.toString(),
        hasTranslations: Object.keys(s.translations || {}).length > 0,
        translationLanguages: Object.keys(s.translations || {})
      })),
      sectionIds: sectionIds
    };
    
  } catch (error) {
    console.error('❌ Error getting page section IDs:', error.message);
    throw error;
  }
}

/**
 * Generate translation report in JSON format
 */
async function generateTranslationReport() {
  console.log('\n📋 Generating Translation Report...');
  
  try {
    const sections = await Section.find({
      language: 'en',
      isActive: true
    }).populate('page', 'title slug').sort({ page: 1, pageNumber: 1 });
    
    const report = {
      generatedAt: new Date().toISOString(),
      totalSections: sections.length,
      targetLanguages: TARGET_LANGUAGES,
      pages: {},
      summary: {
        complete: 0,
        partial: 0,
        untranslated: 0
      }
    };
    
    // Group by page and analyze
    sections.forEach(section => {
      const pageSlug = section.page?.slug || 'unknown';
      if (!report.pages[pageSlug]) {
        report.pages[pageSlug] = {
          pageTitle: section.page?.title || 'Unknown',
          sections: []
        };
      }
      
      const status = checkSectionTranslationStatus(section);
      report.pages[pageSlug].sections.push(status);
      
      // Update summary
      if (status.isComplete) {
        report.summary.complete++;
      } else if (status.hasTranslations) {
        report.summary.partial++;
      } else {
        report.summary.untranslated++;
      }
    });
    
    // Calculate completion rate
    report.summary.completionRate = ((report.summary.complete / report.totalSections) * 100).toFixed(1);
    
    console.log('✅ Translation report generated');
    console.log(`📊 Summary: ${report.summary.complete}/${report.totalSections} complete (${report.summary.completionRate}%)`);
    
    return report;
    
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const detailed = args.includes('--detailed');
  
  // Parse page slug from different argument formats
  let pageSlug = null;
  const pageArg = args.find(arg => arg.startsWith('--page='));
  if (pageArg) {
    pageSlug = pageArg.split('=')[1];
  } else {
    // Also check for page slug as a separate argument
    const pageIndex = args.indexOf('--page');
    if (pageIndex !== -1 && args[pageIndex + 1]) {
      pageSlug = args[pageIndex + 1];
    } else if (args.length > 1 && !args[1].startsWith('--')) {
      // If second argument doesn't start with --, treat it as page slug
      pageSlug = args[1];
    }
  }
  
  try {
    // Connect to database
    await connectDB();
    
    switch (command) {
      case 'verify':
        if (pageSlug) {
          await verifyPageTranslations(pageSlug, detailed);
        } else {
          await verifyAllTranslations(detailed);
        }
        break;
        
      case 'sections':
        if (!pageSlug) {
          console.error('❌ Please provide page slug. Usage: node verify-translations.js sections --page=<page-slug>');
          console.error('   Or: node verify-translations.js sections <page-slug>');
          process.exit(1);
        }
        await getPageSectionIds(pageSlug);
        break;
        
      case 'report':
        await generateTranslationReport();
        break;
        
      default:
        // Default: verify all translations
        await verifyAllTranslations(detailed);
        break;
    }
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  verifyAllTranslations,
  verifyPageTranslations,
  getPageSectionIds,
  checkSectionTranslationStatus,
  generateTranslationReport
};
