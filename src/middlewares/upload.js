'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logger } = require('../setup/logger');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for different service types
const createStorage = (serviceType, subService) => {
  const serviceDir = path.join(uploadsDir, serviceType);
  const subServiceDir = path.join(serviceDir, subService);
  
  // Create directories if they don't exist
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }
  if (!fs.existsSync(subServiceDir)) {
    fs.mkdirSync(subServiceDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, subServiceDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const extension = path.extname(originalName);
      const nameWithoutExt = path.basename(originalName, extension);
      
      const filename = `${subService}-${nameWithoutExt}-${timestamp}${extension}`;
      cb(null, filename);
    }
  });
};

// File filter to allow only images
const imageFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${allowedMimes.join(', ')} are allowed.`), false);
  }
};

// Create upload middleware for specific service and sub-service
const createUploadMiddleware = (serviceType, subService, maxFiles = 10) => {
  const storage = createStorage(serviceType, subService);
  
  return multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
      files: maxFiles
    }
  });
};

// Predefined upload middlewares for each service
const uploadMiddlewares = {
  // Testing Services
  testing: {
    'visual-testing': createUploadMiddleware('testing', 'visual-testing'),
    'drone-inspection': createUploadMiddleware('testing', 'drone-inspection'),
    'borescope-inspection': createUploadMiddleware('testing', 'borescope-inspection'),
    'ultrasonic-testing': createUploadMiddleware('testing', 'ultrasonic-testing'),
    'phased-array-ut': createUploadMiddleware('testing', 'phased-array-ut'),
    'guided-wave-lrut': createUploadMiddleware('testing', 'guided-wave-lrut'),
    'liquid-penetrant-testing': createUploadMiddleware('testing', 'liquid-penetrant-testing'),
    'radiographic-testing': createUploadMiddleware('testing', 'radiographic-testing'),
    'magnetic-particle-testing': createUploadMiddleware('testing', 'magnetic-particle-testing'),
    'eddy-current-testing': createUploadMiddleware('testing', 'eddy-current-testing'),
    'time-of-flight-diffraction': createUploadMiddleware('testing', 'time-of-flight-diffraction'),
    'hardness-testing': createUploadMiddleware('testing', 'hardness-testing'),
    'lifting-gear-load-testing': createUploadMiddleware('testing', 'lifting-gear-load-testing'),
    'leak-testing': createUploadMiddleware('testing', 'leak-testing'),
    'positive-material-identification': createUploadMiddleware('testing', 'positive-material-identification')
  },
  
  // Inspection Services
  inspection: {
    'third-party-inspection': createUploadMiddleware('inspection', 'third-party-inspection'),
    'asset-integrity-inspection': createUploadMiddleware('inspection', 'asset-integrity-inspection'),
    'environmental-monitoring-inspection': createUploadMiddleware('inspection', 'environmental-monitoring-inspection'),
    'risk-based-inspection': createUploadMiddleware('inspection', 'risk-based-inspection'),
    'welding-inspection': createUploadMiddleware('inspection', 'welding-inspection'),
    'electrical-instrumentation-inspection': createUploadMiddleware('inspection', 'electrical-instrumentation-inspection'),
    'painting-inspection': createUploadMiddleware('inspection', 'painting-inspection'),
    'gearbox-inspection': createUploadMiddleware('inspection', 'gearbox-inspection'),
    'hse-inspection': createUploadMiddleware('inspection', 'hse-inspection'),
    'topside-fitness-inspection': createUploadMiddleware('inspection', 'topside-fitness-inspection'),
    'marine-inspection': createUploadMiddleware('inspection', 'marine-inspection'),
    'pre-shipment-inspection': createUploadMiddleware('inspection', 'pre-shipment-inspection'),
    'underground-mine-shaft-safety-inspection': createUploadMiddleware('inspection', 'underground-mine-shaft-safety-inspection'),
    'on-site-laboratory-sampling': createUploadMiddleware('inspection', 'on-site-laboratory-sampling'),
    'pharmaceutical-products-inspection-ppi': createUploadMiddleware('inspection', 'pharmaceutical-products-inspection-ppi'),
    'pharmaceutical-plant-equipment-inspection-ppei': createUploadMiddleware('inspection', 'pharmaceutical-plant-equipment-inspection-ppei')
  },
  
  // Blog uploads
  blog: {
    'featured-images': createUploadMiddleware('blog', 'featured-images', 1)
  },
  
  // Other services (to be expanded)
  auditing: {},
  cbm: {},
  'verification-certification': {
    'pharmaceutical-plant-refinery-fitness-verification-certification': createUploadMiddleware('verification-certification', 'pharmaceutical-plant-refinery-fitness-verification-certification')
  }
};

// Helper function to get upload middleware
const getUploadMiddleware = (serviceType, subService, fieldName = 'images', maxFiles = 10) => {
  if (!uploadMiddlewares[serviceType]) {
    throw new Error(`Service type '${serviceType}' not supported`);
  }
  
  if (!uploadMiddlewares[serviceType][subService]) {
    throw new Error(`Sub-service '${subService}' not found in service '${serviceType}'`);
  }
  
  return uploadMiddlewares[serviceType][subService].array(fieldName, maxFiles);
};

// Cleanup temporary files after upload
const cleanupTempFiles = (files) => {
  if (!files || !Array.isArray(files)) return;
  
  files.forEach(file => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        logger.info(`Cleaned up temporary file: ${file.path}`);
      }
    } catch (error) {
      logger.error(`Failed to cleanup file ${file.path}: ${error.message}`);
    }
  });
};

module.exports = {
  uploadMiddlewares,
  getUploadMiddleware,
  createUploadMiddleware,
  cleanupTempFiles,
  imageFilter
};


