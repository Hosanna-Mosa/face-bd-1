const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');
const { getUploadMiddleware } = require('../middlewares/upload');

// Apply upload middleware for specific service and sub-service
const applyUploadMiddleware = (serviceType, subService) => {
  return (req, res, next) => {
    try {
      const middleware = getUploadMiddleware(serviceType, subService, 'images', 10);
      middleware(req, res, next);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Invalid service or sub-service',
        error: error.message
      });
    }
  };
};

// Testing Service Routes
router.post('/testing/:subService/upload', 
  (req, res, next) => applyUploadMiddleware('testing', req.params.subService)(req, res, next),
  imageController.uploadImages
);

router.get('/testing/:subService/images', imageController.getImages);

// Inspection Service Routes
router.post('/inspection/:subService/upload',
  (req, res, next) => applyUploadMiddleware('inspection', req.params.subService)(req, res, next),
  imageController.uploadImages
);

router.get('/inspection/:subService/images', imageController.getImages);

// Auditing Service Routes (placeholder)
router.post('/auditing/:subService/upload',
  (req, res, next) => applyUploadMiddleware('auditing', req.params.subService)(req, res, next),
  imageController.uploadImages
);

router.get('/auditing/:subService/images', imageController.getImages);

// CBM Service Routes (placeholder)
router.post('/cbm/:subService/upload',
  (req, res, next) => applyUploadMiddleware('cbm', req.params.subService)(req, res, next),
  imageController.uploadImages
);

router.get('/cbm/:subService/images', imageController.getImages);

// Verification & Certification Service Routes (placeholder)
router.post('/verification-certification/:subService/upload',
  (req, res, next) => applyUploadMiddleware('verification-certification', req.params.subService)(req, res, next),
  imageController.uploadImages
);

router.get('/verification-certification/:subService/images', imageController.getImages);

// Industries Service Routes
router.post('/industries/:subService/upload',
  (req, res, next) => applyUploadMiddleware('industries', req.params.subService)(req, res, next),
  imageController.uploadImages
);

router.get('/industries/:subService/images', imageController.getImages);

// Industry Cover Images Routes
router.post('/industries/:subService/cover-upload',
  (req, res, next) => applyUploadMiddleware('industries', `${req.params.subService}/covers`)(req, res, next),
  imageController.uploadImages
);

router.get('/industries/:subService/cover-images', imageController.getImages);

// Generic image management routes
router.delete('/image/:publicId', imageController.deleteImage);
router.get('/usage-stats', imageController.getUsageStats);
router.post('/bulk-upload', imageController.bulkUploadFromFolder);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Image service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
