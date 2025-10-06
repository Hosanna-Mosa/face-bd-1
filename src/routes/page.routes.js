'use strict';

const express = require('express');
const controller = require('../controllers/page.controller');

const router = express.Router();

// Basic CRUD operations
router.post('/', controller.createPage);
router.get('/', controller.getPages);

// Special routes for fetching by slug
router.get('/slug/:slug', controller.getPageBySlug);

// Section management routes
router.post('/:id/sections', controller.addSectionToPage);
router.delete('/:id/sections/:sectionId', controller.removeSectionFromPage);

// Advanced search routes - fetch page with sections by name
router.get('/search/:pageName', controller.getPageWithSectionsByName);
router.get('/search/:pageName/:sectionName', controller.getPageWithSectionsByName);

// Generic id-based routes (placed after specific routes)
router.get('/:id', controller.getPageById);
router.put('/:id', controller.updatePage);
router.delete('/:id', controller.deletePage);

module.exports = router;

