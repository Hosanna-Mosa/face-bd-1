'use strict';

const { connectToDatabase } = require('../setup/database');
const { logger } = require('../setup/logger');
const Page = require('../models/Page');

async function updatePageCategories() {
  try {
    await connectToDatabase();
    logger.info('🔌 Connected to database');

    const dryRun = process.argv.includes('--dry-run');

    // Set Industries page category to "Industries"
    const industriesFilter = { slug: 'industries' };
    const industriesUpdate = { $set: { category: 'Industries' } };

    // Set remaining pages category to "services"
    const servicesFilter = { slug: { $ne: 'industries' } };
    const servicesUpdate = { $set: { category: 'services' } };

    // Collect target counts first
    const industriesTarget = await Page.countDocuments(industriesFilter);
    const servicesTarget = await Page.countDocuments(servicesFilter);

    logger.info(`📊 Target pages → Industries: ${industriesTarget}, Services: ${servicesTarget}`);

    if (dryRun) {
      logger.info('🧪 Dry-run enabled. No changes will be written.');
      return process.exit(0);
    }

    const indRes = await Page.updateMany(industriesFilter, industriesUpdate);
    const srvRes = await Page.updateMany(servicesFilter, servicesUpdate);

    logger.info(`✅ Updated Industries pages: matched=${indRes.matchedCount || indRes.n}, modified=${indRes.modifiedCount || indRes.nModified}`);
    logger.info(`✅ Updated Services pages: matched=${srvRes.matchedCount || srvRes.n}, modified=${srvRes.modifiedCount || srvRes.nModified}`);

    // Show a brief summary of a few pages
    const sample = await Page.find({}, { title: 1, slug: 1, category: 1 }).limit(10).lean();
    logger.info('🧾 Category sample (first 10 pages):');
    sample.forEach(p => logger.info(` - ${p.title} [${p.slug}] → ${p.category || '(unset)'}`));

    logger.info('🎉 Page categories update completed!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Failed to update page categories:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  updatePageCategories();
}

module.exports = { updatePageCategories };
