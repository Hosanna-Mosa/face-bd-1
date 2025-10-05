'use strict';

const Section = require('../models/Section');
const Page = require('../models/Page');
const { logger } = require('../setup/logger');

class DataSeeder {
  constructor() {
    this.createdSections = new Map();
    this.createdPages = new Map();
  }

  /**
   * Create a single section with validation
   */
  async createSection(sectionData) {
    try {
      const section = await Section.create(sectionData);
      this.createdSections.set(section.sectionId || section._id.toString(), section);
      logger.info(`✅ Section created: ${section.title} (${section.sectionId})`);
      return section;
    } catch (error) {
      logger.error(`❌ Failed to create section: ${sectionData.title}`, error.message);
      throw error;
    }
  }

  /**
   * Create multiple sections in batch
   */
  async createSections(sectionsData) {
    logger.info(`🔄 Creating ${sectionsData.length} sections...`);
    const results = [];
    
    for (const sectionData of sectionsData) {
      try {
        const section = await this.createSection(sectionData);
        results.push(section);
      } catch (error) {
        logger.error(`Failed to create section: ${sectionData.title}`);
        results.push({ error: error.message, data: sectionData });
      }
    }
    
    logger.info(`✅ Created ${results.filter(r => !r.error).length}/${sectionsData.length} sections`);
    return results;
  }

  /**
   * Create a single page with sections
   */
  async createPage(pageData) {
    try {
      // Validate that all referenced sections exist
      if (pageData.sections && pageData.sections.length > 0) {
        const sectionIds = pageData.sections.map(s => typeof s === 'string' ? s : s._id);
        const existingSections = await Section.find({
          $or: [
            { _id: { $in: sectionIds } },
            { sectionId: { $in: sectionIds } }
          ]
        });
        
        if (existingSections.length !== sectionIds.length) {
          const foundIds = existingSections.map(s => s.sectionId || s._id.toString());
          const missingIds = sectionIds.filter(id => !foundIds.includes(id));
          throw new Error(`Sections not found: ${missingIds.join(', ')}`);
        }
        
        // Replace section references with actual ObjectIds
        pageData.sections = existingSections.map(s => s._id);
      }

      const page = await Page.create(pageData);
      this.createdPages.set(page.slug, page);
      logger.info(`✅ Page created: ${page.title} (${page.slug})`);
      return page;
    } catch (error) {
      logger.error(`❌ Failed to create page: ${pageData.title}`, error.message);
      throw error;
    }
  }

  /**
   * Create multiple pages in batch
   */
  async createPages(pagesData) {
    logger.info(`🔄 Creating ${pagesData.length} pages...`);
    const results = [];
    
    for (const pageData of pagesData) {
      try {
        const page = await this.createPage(pageData);
        results.push(page);
      } catch (error) {
        logger.error(`Failed to create page: ${pageData.title}`);
        results.push({ error: error.message, data: pageData });
      }
    }
    
    logger.info(`✅ Created ${results.filter(r => !r.error).length}/${pagesData.length} pages`);
    return results;
  }

  /**
   * Add sections to an existing page
   */
  async addSectionsToPage(pageSlug, sectionIds) {
    try {
      const page = await Page.findOne({ slug: pageSlug });
      if (!page) {
        throw new Error(`Page not found: ${pageSlug}`);
      }

      // Find sections by sectionId or ObjectId
      const sections = await Section.find({
        $or: [
          { _id: { $in: sectionIds } },
          { sectionId: { $in: sectionIds } }
        ]
      });

      if (sections.length !== sectionIds.length) {
        const foundIds = sections.map(s => s.sectionId || s._id.toString());
        const missingIds = sectionIds.filter(id => !foundIds.includes(id));
        throw new Error(`Sections not found: ${missingIds.join(', ')}`);
      }

      // Add sections to page
      const sectionObjectIds = sections.map(s => s._id);
      const updatedPage = await Page.findByIdAndUpdate(
        page._id,
        { $addToSet: { sections: { $each: sectionObjectIds } } },
        { new: true }
      ).populate('sections');

      logger.info(`✅ Added ${sections.length} sections to page: ${pageSlug}`);
      return updatedPage;
    } catch (error) {
      logger.error(`❌ Failed to add sections to page: ${pageSlug}`, error.message);
      throw error;
    }
  }

  /**
   * Get all created sections
   */
  getCreatedSections() {
    return Array.from(this.createdSections.values());
  }

  /**
   * Get all created pages
   */
  getCreatedPages() {
    return Array.from(this.createdPages.values());
  }

  /**
   * Clear all created data (for testing)
   */
  async clearAllData() {
    try {
      await Section.deleteMany({});
      await Page.deleteMany({});
      this.createdSections.clear();
      this.createdPages.clear();
      logger.info('🗑️ All data cleared');
    } catch (error) {
      logger.error('❌ Failed to clear data', error.message);
      throw error;
    }
  }

  /**
   * Get summary of created data
   */
  getSummary() {
    return {
      sections: {
        count: this.createdSections.size,
        items: Array.from(this.createdSections.keys())
      },
      pages: {
        count: this.createdPages.size,
        items: Array.from(this.createdPages.keys())
      }
    };
  }

  /**
   * Clear sections by sectionIds
   */
  async clearSectionsBySectionIds(sectionIds) {
    try {
      const result = await Section.deleteMany({ sectionId: { $in: sectionIds } });
      logger.info(`🗑️ Cleared ${result.deletedCount} sections with sectionIds: ${sectionIds.join(', ')}`);
      return result;
    } catch (error) {
      logger.error('❌ Failed to clear sections by sectionIds', error.message);
      throw error;
    }
  }

  /**
   * Clear pages by slug
   */
  async clearPagesBySlug(slug) {
    try {
      const result = await Page.deleteMany({ slug });
      logger.info(`🗑️ Cleared ${result.deletedCount} pages with slug: ${slug}`);
      return result;
    } catch (error) {
      logger.error('❌ Failed to clear pages by slug', error.message);
      throw error;
    }
  }
}

module.exports = DataSeeder;

