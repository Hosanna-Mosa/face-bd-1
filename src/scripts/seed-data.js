'use strict';

const { connectToDatabase } = require('../setup/database');
const DataSeeder = require('../utils/seeder');
const sampleSections = require('../data/sample-sections');
const samplePages = require('../data/sample-pages');
const { logger } = require('../setup/logger');

async function seedData() {
  try {
    // Connect to database
    await connectToDatabase();
    logger.info('🔌 Connected to database');

    // Initialize seeder
    const seeder = new DataSeeder();

    // Step 1: Create all sections first
    logger.info('📝 Step 1: Creating sections...');
    
    // Flatten all sections from different categories
    const allSections = [
      ...sampleSections.home,
      ...sampleSections.about,
      ...sampleSections.services,
      ...sampleSections.contact
    ];

    const sectionsResult = await seeder.createSections(allSections);
    logger.info(`✅ Created ${sectionsResult.filter(r => !r.error).length} sections`);

    // Step 2: Create pages with references to sections
    logger.info('📄 Step 2: Creating pages with sections...');
    const pagesResult = await seeder.createPages(samplePages);
    logger.info(`✅ Created ${pagesResult.filter(r => !r.error).length} pages`);

    // Step 3: Display summary
    const summary = seeder.getSummary();
    logger.info('📊 Seeding Summary:');
    logger.info(`   Sections: ${summary.sections.count}`);
    logger.info(`   Pages: ${summary.pages.count}`);

    // Step 4: Verify the data
    logger.info('🔍 Step 3: Verifying data...');
    await verifyData();

    logger.info('🎉 Data seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    logger.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

async function verifyData() {
  const Section = require('../models/Section');
  const Page = require('../models/Page');

  // Check sections
  const sectionsCount = await Section.countDocuments();
  logger.info(`   ✅ Found ${sectionsCount} sections in database`);

  // Check pages
  const pagesCount = await Page.countDocuments();
  logger.info(`   ✅ Found ${pagesCount} pages in database`);

  // Check pages with populated sections
  const pagesWithSections = await Page.find().populate('sections');
  const totalSectionsInPages = pagesWithSections.reduce((sum, page) => sum + page.sections.length, 0);
  logger.info(`   ✅ Pages contain ${totalSectionsInPages} section references`);

  // Display sample data
  logger.info('\n📋 Sample Data Preview:');
  
  const samplePage = await Page.findOne({ slug: 'home' }).populate('sections');
  if (samplePage) {
    logger.info(`   Home Page: "${samplePage.title}" with ${samplePage.sections.length} sections`);
    samplePage.sections.forEach((section, index) => {
      logger.info(`     Section ${index + 1}: "${section.title}" (${section.sectionId})`);
    });
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData };

