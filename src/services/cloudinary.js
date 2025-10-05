const cloudinary = require('cloudinary').v2;
const { logger } = require('../setup/logger');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
  /**
   * Upload image to Cloudinary with organized folder structure
   * @param {string} filePath - Local file path
   * @param {string} serviceType - Main service (testing, inspection, etc.)
   * @param {string} subService - Sub-service folder name
   * @param {string} imageName - Custom name for the image
   * @returns {Promise<Object>} Upload result with URL and public_id
   */
  async uploadImage(filePath, serviceType, subService, imageName = null) {
    try {
      const folderPath = `cbm/${serviceType}/${subService}`;
      const publicId = imageName ? `${folderPath}/${imageName}` : undefined;
      
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folderPath,
        public_id: publicId,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        tags: [serviceType, subService, 'cbm']
      });

      logger.info(`Image uploaded successfully: ${result.secure_url}`);
      
      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        folder: folderPath
      };
    } catch (error) {
      logger.error(`Image upload failed: ${error.message}`);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  /**
   * Upload image from buffer (for multer memory storage)
   * @param {Buffer} buffer - Image buffer
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result with URL and public_id
   */
  async uploadFromBuffer(buffer, options = {}) {
    try {
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${buffer.toString('base64')}`,
        {
          folder: options.folder || 'cbm/contact-offices',
          public_id: options.public_id,
          resource_type: 'auto',
          transformation: options.transformation || [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
          tags: options.tags || ['contact-offices', 'cbm']
        }
      );

      logger.info(`Image uploaded from buffer successfully: ${result.secure_url}`);
      
      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      };
    } catch (error) {
      logger.error(`Image upload from buffer failed: ${error.message}`);
      throw new Error(`Image upload from buffer failed: ${error.message}`);
    }
  }

  /**
   * Upload multiple images for a service
   * @param {Array} files - Array of file objects
   * @param {string} serviceType - Main service
   * @param {string} subService - Sub-service
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultipleImages(files, serviceType, subService) {
    try {
      const uploadPromises = files.map(async (file) => {
        const imageName = this.generateImageName(file.originalname, subService);
        return await this.uploadImage(file.path, serviceType, subService, imageName);
      });

      const results = await Promise.all(uploadPromises);
      logger.info(`Uploaded ${results.length} images for ${serviceType}/${subService}`);
      
      return results;
    } catch (error) {
      logger.error(`Multiple image upload failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      logger.info(`Image deleted successfully: ${publicId}`);
      
      return {
        success: true,
        result: result
      };
    } catch (error) {
      logger.error(`Image deletion failed: ${error.message}`);
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }

  /**
   * Get images from a specific folder
   * @param {string} serviceType - Main service
   * @param {string} subService - Sub-service
   * @param {number} maxResults - Maximum number of results
   * @returns {Promise<Array>} Array of image resources
   */
  async getImagesFromFolder(serviceType, subService, maxResults = 50) {
    try {
      // Use the correct path with the duplicate structure
      const folderPath = `cbm/${serviceType}/${subService}/cbm/${serviceType}/${subService}`;
      
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderPath,
        max_results: maxResults
      });

      return result.resources.map(resource => ({
        url: resource.secure_url,
        public_id: resource.public_id,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        created_at: resource.created_at,
        tags: resource.tags
      }));
    } catch (error) {
      logger.error(`Failed to get images from folder: ${error.message}`);
      throw new Error(`Failed to get images from folder: ${error.message}`);
    }
  }

  /**
   * Generate organized image name
   * @param {string} originalName - Original filename
   * @param {string} subService - Sub-service name
   * @returns {string} Generated image name
   */
  generateImageName(originalName, subService) {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const cleanSubService = subService.replace(/[^a-zA-Z0-9]/g, '-');
    
    return `${cleanSubService}-${timestamp}.${extension}`;
  }

  /**
   * Get Cloudinary usage statistics
   * @returns {Promise<Object>} Usage statistics
   */
  async getUsageStats() {
    try {
      const result = await cloudinary.api.usage();
      return {
        plan: result.plan,
        objects: result.objects,
        bandwidth: result.bandwidth,
        storage: result.storage,
        requests: result.requests
      };
    } catch (error) {
      logger.error(`Failed to get usage stats: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new CloudinaryService();
