'use strict';

const express = require('express');
const controller = require('../controllers/section.controller');

const router = express.Router();

router.post('/', controller.createSection);
router.get('/:id', controller.getSectionById);
router.get('/', controller.getSections);
router.put('/:id', controller.updateSection);
router.delete('/:id', controller.deleteSection);

module.exports = router;


