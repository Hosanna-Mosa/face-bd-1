'use strict';

const express = require('express');
const ContactOffice = require('../models/ContactOffice');
const { 
  createContactOffice,
  getContactOffices,
  getContactOfficeById,
  updateContactOffice,
  deleteContactOffice,
  getContactOfficesGrouped
} = require('../controllers/contactOffice.controller');
const multer = require('multer');

// Create a simple upload middleware for contact offices
const upload = multer({
  storage: multer.memoryStorage(), // Store in memory for Cloudinary upload
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  }
});

const router = express.Router();

// GET all grouped by region_name (for frontend)
router.get('/', getContactOfficesGrouped);

// Admin routes for contact offices management
router.get('/admin', getContactOffices);
router.get('/admin/:id', getContactOfficeById);
router.post('/admin', upload.single('image'), createContactOffice);
router.put('/admin/:id', upload.single('image'), updateContactOffice);
router.delete('/admin/:id', deleteContactOffice);

module.exports = router;


