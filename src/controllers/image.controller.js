const cloudinaryService = require('../services/cloudinary');
const { getUploadMiddleware, cleanupTempFiles } = require('../middlewares/upload');
const { logger } = require('../setup/logger');

class ImageController {
  /**
   * Upload images for a specific service and sub-service
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async uploadImages(req, res) {
    try {
      const { serviceType, subService } = req.params;
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images provided for upload'
        });
      }

      logger.info(`Starting upload of ${req.files.length} images for ${serviceType}/${subService}`);

      // Upload images to Cloudinary
      const uploadResults = await cloudinaryService.uploadMultipleImages(
        req.files, 
        serviceType, 
        subService
      );

      // Clean up temporary files
      cleanupTempFiles(req.files);

      res.status(200).json({
        success: true,
        message: `Successfully uploaded ${uploadResults.length} images`,
        data: {
          serviceType,
          subService,
          images: uploadResults,
          totalImages: uploadResults.length
        }
      });

    } catch (error) {
      logger.error(`Image upload failed: ${error.message}`);
      
      // Clean up files on error
      if (req.files) {
        cleanupTempFiles(req.files);
      }

      res.status(500).json({
        success: false,
        message: 'Image upload failed',
        error: error.message
      });
    }
  }

  /**
   * Get all images for a specific service and sub-service
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getImages(req, res) {
    try {
      const { serviceType, subService } = req.params;
      const { maxResults = 50 } = req.query;

      logger.info(`Fetching images for ${serviceType}/${subService}`);

      const images = await cloudinaryService.getImagesFromFolder(
        serviceType, 
        subService, 
        parseInt(maxResults)
      );

      res.status(200).json({
        success: true,
        data: {
          serviceType,
          subService,
          images,
          totalImages: images.length
        }
      });

    } catch (error) {
      logger.error(`Failed to fetch images: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch images',
        error: error.message
      });
    }
  }

  /**
   * Delete a specific image
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteImage(req, res) {
    try {
      const { publicId } = req.params;

      logger.info(`Deleting image: ${publicId}`);

      const result = await cloudinaryService.deleteImage(publicId);

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        data: result
      });

    } catch (error) {
      logger.error(`Failed to delete image: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: error.message
      });
    }
  }

  /**
   * Get Cloudinary usage statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUsageStats(req, res) {
    try {
      logger.info('Fetching Cloudinary usage statistics');

      const stats = await cloudinaryService.getUsageStats();

      res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      logger.error(`Failed to fetch usage stats: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch usage statistics',
        error: error.message
      });
    }
  }

  /**
   * Bulk upload images from local folders
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkUploadFromFolder(req, res) {
    try {
      const { serviceType, subService, folderPath } = req.body;

      if (!serviceType || !subService || !folderPath) {
        return res.status(400).json({
          success: false,
          message: 'serviceType, subService, and folderPath are required'
        });
      }

      logger.info(`Starting bulk upload from folder: ${folderPath}`);

      // This would require additional implementation to read from local folders
      // For now, we'll return a placeholder response
      res.status(200).json({
        success: true,
        message: 'Bulk upload endpoint ready for implementation',
        data: {
          serviceType,
          subService,
          folderPath
        }
      });

    } catch (error) {
      logger.error(`Bulk upload failed: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Bulk upload failed',
        error: error.message
      });
    }
  }

  /**
   * Get upload middleware for a specific service and sub-service
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getUploadMiddleware(req, res, next) {
    try {
      const { serviceType, subService } = req.params;
      const { fieldName = 'images', maxFiles = 10 } = req.query;

      const middleware = getUploadMiddleware(serviceType, subService, fieldName, parseInt(maxFiles));
      middleware(req, res, next);

    } catch (error) {
      logger.error(`Failed to get upload middleware: ${error.message}`);
      res.status(400).json({
        success: false,
        message: 'Invalid service or sub-service',
        error: error.message
      });
    }
  }
}

module.exports = new ImageController();
