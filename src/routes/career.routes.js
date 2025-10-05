'use strict';

const express = require('express');
const multer = require('multer');
const {
  submitJobApplication,
  getApplicationStatus,
  listCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer
} = require('../controllers/career.controller');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.fileValidationError = 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.';
      cb(null, false);
    }
  }
}).single('resume');

/**
 * @route POST /api/careers/apply
 * @desc Submit a job application with resume
 * @access Public
 */
router.post('/apply', (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        req.fileSizeError = true;
      }
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    // Handle multer errors
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError
      });
    }
    
    if (req.fileSizeError) {
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 5MB'
      });
    }
    
    next();
  });
}, submitJobApplication);

/**
 * @route GET /api/careers/status
 * @desc Get application status
 * @access Public
 */
router.get('/status', getApplicationStatus);

/**
 * @route GET /api/careers
 * @desc List careers
 * @access Public
 */
router.get('/', listCareers);

/**
 * @route GET /api/careers/:id
 * @desc Get one career by id
 * @access Public
 */
router.get('/:id', getCareerById);

/**
 * @route POST /api/careers
 * @desc Create a career (admin usage)
 * @access Public for now (consider auth later)
 */
router.post('/', createCareer);

/**
 * @route PUT /api/careers/:id
 * @desc Update a career (admin usage)
 * @access Public for now (consider auth later)
 */
router.put('/:id', updateCareer);

/**
 * @route DELETE /api/careers/:id
 * @desc Delete a career (admin usage)
 * @access Public for now (consider auth later)
 */
router.delete('/:id', deleteCareer);

module.exports = router;
