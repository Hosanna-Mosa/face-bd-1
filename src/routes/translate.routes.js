'use strict';

const express = require('express');
const controller = require('../controllers/translate.controller');

const router = express.Router();

// Get all static translations
router.get('/static', controller.getAllStaticTranslations);

// Get static translations for a specific language
router.get('/static/:lang', controller.getStaticTranslations);

// Get slides data for a specific language
router.get('/slides/:lang', controller.getSlidesData);

// Get section translations (existing route) - this should be last
router.get('/:id', controller.translateSection);

module.exports = router;


