'use strict';

const emailService = require('../services/email');
const { logger } = require('../setup/logger');
const Career = require('../models/Career');

/**
 * Submit a job application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function submitJobApplication(req, res) {
  try {
    const applicationData = req.body;
    const resumeFile = req.file;

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'position', 'department', 'experience', 'coverLetter'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if resume file is provided
    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: 'Resume/CV file is required'
      });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resumeFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload PDF, DOC, or DOCX files only.'
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (resumeFile.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 5MB'
      });
    }

    // Send application email to admin
    const adminEmailResult = await emailService.sendJobApplication(
      applicationData,
      resumeFile.buffer,
      resumeFile.originalname
    );

    // Send confirmation email to applicant
    const confirmationResult = await emailService.sendApplicationConfirmation(applicationData);

    // Log the application
    logger.info('Job application submitted successfully', {
      position: applicationData.position,
      applicant: `${applicationData.firstName} ${applicationData.lastName}`,
      email: applicationData.email,
      adminEmailSent: adminEmailResult.success,
      confirmationEmailSent: confirmationResult.success
    });

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        adminEmailSent: adminEmailResult.success,
        confirmationEmailSent: confirmationResult.success,
        applicationId: adminEmailResult.messageId
      }
    });

  } catch (error) {
    logger.error('Error submitting job application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again later.'
    });
  }
}

/**
 * Get application status (placeholder for future implementation)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getApplicationStatus(req, res) {
  try {
    const { email, applicationId } = req.query;

    if (!email || !applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Email and application ID are required'
      });
    }

    // This is a placeholder - in a real implementation, you would query a database
    // to get the actual application status
    res.status(200).json({
      success: true,
      message: 'Application status retrieved',
      data: {
        status: 'Under Review',
        submittedDate: new Date().toISOString(),
        estimatedResponseTime: '5-7 business days'
      }
    });

  } catch (error) {
    logger.error('Error getting application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve application status'
    });
  }
}

module.exports = {
  submitJobApplication,
  getApplicationStatus,
  // List all active careers (with optional filters and language support)
  async listCareers(req, res) {
    try {
      const { department, location, level, type, active, lang } = req.query;
      const query = {};
      if (department) query.department = department;
      if (location) query.location = location;
      if (level) query.level = level;
      if (type) query.type = type;
      if (typeof active !== 'undefined') query.isActive = active === 'true';
      
      const careers = await Career.find(query).sort({ postedAt: -1, createdAt: -1 });
      
      // If language is specified and not English, return translated data
      if (lang && lang !== 'en' && ['fr', 'pt', 'es', 'ru'].includes(lang)) {
        const translatedCareers = careers.map(career => {
          const careerObj = career.toObject();
          const translations = career.translations?.get(lang);
          
          if (translations) {
            // Return translated fields if available, fallback to original
            return {
              ...careerObj,
              title: translations.title || careerObj.title,
              description: translations.description || careerObj.description,
              department: translations.department || careerObj.department,
              location: translations.location || careerObj.location,
              type: translations.type || careerObj.type,
              level: translations.level || careerObj.level,
              workArrangement: translations.workArrangement || careerObj.workArrangement,
              responsibilities: translations.responsibilities || careerObj.responsibilities,
              requirements: translations.requirements || careerObj.requirements,
              benefits: translations.benefits || careerObj.benefits,
              tags: translations.tags || careerObj.tags,
              // Keep original translations object for reference
              translations: careerObj.translations
            };
          }
          
          // If no translations available, return original data
          return careerObj;
        });
        
        res.json({ success: true, data: translatedCareers });
      } else {
        // Return original English data
        res.json({ success: true, data: careers });
      }
    } catch (error) {
      logger.error('Error listing careers:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch careers' });
    }
  },
  // Get a single career by id (with language support)
  async getCareerById(req, res) {
    try {
      const { id } = req.params;
      const { lang } = req.query;
      const career = await Career.findById(id);
      if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
      
      // If language is specified and not English, return translated data
      if (lang && lang !== 'en' && ['fr', 'pt', 'es', 'ru'].includes(lang)) {
        const careerObj = career.toObject();
        const translations = career.translations?.get(lang);
        
        if (translations) {
          // Return translated fields if available, fallback to original
          const translatedCareer = {
            ...careerObj,
            title: translations.title || careerObj.title,
            description: translations.description || careerObj.description,
            department: translations.department || careerObj.department,
            location: translations.location || careerObj.location,
            type: translations.type || careerObj.type,
            level: translations.level || careerObj.level,
            workArrangement: translations.workArrangement || careerObj.workArrangement,
            responsibilities: translations.responsibilities || careerObj.responsibilities,
            requirements: translations.requirements || careerObj.requirements,
            benefits: translations.benefits || careerObj.benefits,
            tags: translations.tags || careerObj.tags,
            // Keep original translations object for reference
            translations: careerObj.translations
          };
          
          res.json({ success: true, data: translatedCareer });
        } else {
          // If no translations available, return original data
          res.json({ success: true, data: careerObj });
        }
      } else {
        // Return original English data
        res.json({ success: true, data: career });
      }
    } catch (error) {
      logger.error('Error getting career:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch career' });
    }
  },
  // Create a new career
  async createCareer(req, res) {
    try {
      const payload = req.body;
      const created = await Career.create(payload);
      res.status(201).json({ success: true, data: created });
    } catch (error) {
      logger.error('Error creating career:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to create career' });
    }
  },
  // Update a career
  async updateCareer(req, res) {
    try {
      const { id } = req.params;
      const updated = await Career.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Career not found' });
      res.json({ success: true, data: updated });
    } catch (error) {
      logger.error('Error updating career:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to update career' });
    }
  },
  // Delete a career
  async deleteCareer(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Career.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Career not found' });
      res.json({ success: true, data: { id } });
    } catch (error) {
      logger.error('Error deleting career:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to delete career' });
    }
  }
};


