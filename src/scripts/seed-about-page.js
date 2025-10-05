'use strict';

const { connectToDatabase } = require('../setup/database');
const DataSeeder = require('../utils/seeder');
const { logger } = require('../setup/logger');

function generateSectionId(title) {
  return (title || '')
    .replace(/\(.*?\)/g, '')
    .replace(/&/g, ' and ')
    .replace(/[\/,]/g, ' ')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

const aboutPageData = {
  title: 'About',
  description: 'CBM 360 TIV – Global Leader in Testing, Inspection & Verification',
  slug: 'about',
  language: 'en',
  pageNumber: 1,
  isActive: true,
  metadata: {
    keywords: [
      'about',
      'cbm-360-tiv',
      'testing',
      'inspection',
      'verification',
      'monitoring',
      'certification'
    ],
    author: 'Seed Script',
    lastModified: new Date()
  }
};

const aboutSections = [
  {
    title: 'CBM 360 TIV – Global Leader in Testing, Inspection & Verification',
    bodyText: 'Founded in 1992 in the United Kingdom, CBM 360 TIV has grown into a trusted global partner in Testing, Inspection, Certification, Condition-Based Monitoring, and Verification services. With regional headquarters in Dubai (Middle East & Africa), Hong Kong (Asia), and Brazil (North & South America), we support industries across 72 countries, driven by a commitment to safety, quality, and sustainability.',
  },
  {
    title: 'Global Team & Network',
    bodyText: 'Our team of 7,000 professionals, backed by a network of 23 advanced laboratories and 72 branch offices worldwide, works closely with clients to enhance operational performance, extend asset life, and ensure compliance with international standards and regulations.',
  },
  {
    title: 'Industry Coverage',
    bodyText: 'At CBM 360 TIV, we go beyond compliance — delivering innovative solutions that address the evolving challenges of industries including Oil & Gas (Onshore/Offshore), Mining, Power Generation, Petrochemicals, Manufacturing, Marine, and Infrastructure Development.',
  },
  {
    title: 'Our Brand Values',
    bodyText: 'Our brand is built on trust, integrity, and technical excellence. By combining global expertise with local presence, we help organizations achieve the highest standards of quality, safety, environmental protection, and social responsibility.',
  },
  {
    title: 'Tagline',
    bodyText: 'CBM 360 TIV – Ensuring Reliability. Driving Innovation. Building Confidence.',
  },
].map((s, idx) => ({
  ...s,
  images: [],
  language: 'en',
  pageNumber: idx + 1,
  sectionId: generateSectionId(s.title),
  page: 'about',
  isActive: true,
  translations: {}
}));

async function seedAboutPage() {
  try {
    await connectToDatabase();
    logger.info('🔌 Connected to database');

    const seeder = new DataSeeder();

    logger.info('📝 Creating About sections...');
    const createdSections = await seeder.createSections(aboutSections);
    if (createdSections.some(r => r.error)) {
      logger.error('❌ Some sections failed to create');
      createdSections.forEach((r, i) => r.error && logger.error(`   Section ${i + 1}: ${r.error}`));
      throw new Error('Section creation failed');
    }

    const sectionIds = createdSections.map(s => s._id);
    const pagePayload = { ...aboutPageData, sections: sectionIds };

    logger.info('📄 Creating About page...');
    const page = await seeder.createPage(pagePayload);
    logger.info(`✅ Page created: ${page.title} (${page.slug}) with ${page.sections.length} sections`);

    await verifyAbout();
    logger.info('🎉 About page and sections seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding About failed:', error.message);
    process.exit(1);
  }
}

async function verifyAbout() {
  const Section = require('../models/Section');
  const Page = require('../models/Page');

  const sectionsCount = await Section.countDocuments({ page: 'about' });
  logger.info(`   ✅ Found ${sectionsCount} sections for about`);

  const page = await Page.findOne({ slug: 'about' }).populate('sections');
  if (page) {
    logger.info(`   ✅ Found page: "${page.title}" with ${page.sections.length} sections`);
  } else {
    logger.error('   ❌ About page not found');
  }
}

async function clearAboutPage() {
  try {
    await connectToDatabase();
    logger.info('🔌 Connected to database');

    const Section = require('../models/Section');
    const Page = require('../models/Page');

    await Page.deleteMany({ slug: 'about' });
    const res = await Section.deleteMany({ page: 'about' });
    logger.info(`🗑️ Cleared About page and ${res.deletedCount} sections`);
    process.exit(0);
  } catch (error) {
    logger.error('❌ Failed to clear About data:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('clear')) {
    logger.info('🧹 Clearing About data...');
    clearAboutPage();
  } else {
    logger.info('🌱 Seeding About page...');
    seedAboutPage();
  }
}

module.exports = { seedAboutPage, clearAboutPage };




