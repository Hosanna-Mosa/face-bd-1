'use strict';

const emailService = require('../services/email');
const { logger } = require('../setup/logger');
const Career = require('../models/Career');
const { translateText } = require('../services/translation');

/**
 * Submit a job application
 */
async function submitJobApplication(req, res) {
  try {
    const applicationData = req.body;
    const resumeFile = req.file;

    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'position', 'department', 'experience', 'coverLetter'
    ];
    const missingFields = requiredFields.filter(f => !applicationData[f]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: 'Resume/CV file is required'
      });
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(resumeFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload PDF, DOC, or DOCX files only.'
      });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (resumeFile.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 5MB'
      });
    }

    // Send email to admin
    const adminEmailResult = await emailService.sendJobApplication(
      applicationData,
      resumeFile.buffer,
      resumeFile.originalname
    );

    // Send confirmation email
    const confirmationResult = await emailService.sendApplicationConfirmation(applicationData);

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
 * Get application status (placeholder)
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

/**
 * List all active careers (with optional filters and language support)
 */
async function listCareers(req, res) {
  try {
    const { department, location, level, type, active, lang } = req.query;
    const query = {};
    if (department) query.department = department;
    if (location) query.location = location;
    if (level) query.level = level;
    if (type) query.type = type;
    if (typeof active !== 'undefined') query.isActive = active === 'true';

    const careers = await Career.find(query).sort({ postedAt: -1, createdAt: -1 });

    // Handle language translation
    if (lang && lang !== 'en' && ['fr', 'pt', 'es', 'ru', 'zh'].includes(lang)) {
      const translatedCareers = careers.map(career => {
        const careerObj = career.toObject();
        const translations = career.translations?.get(lang);

        if (translations) {
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
            translations: careerObj.translations
          };
        }
        return careerObj;
      });

      res.json({ success: true, data: translatedCareers });
    } else {
      res.json({ success: true, data: careers });
    }
  } catch (error) {
    logger.error('Error listing careers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch careers' });
  }
}

/**
 * Get a single career by ID (with translation)
 */
async function getCareerById(req, res) {
  try {
    const { id } = req.params;
    const { lang } = req.query;
    const career = await Career.findById(id);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found' });

    const careerObj = career.toObject();

    if (lang && lang !== 'en' && ['fr', 'pt', 'es', 'ru', 'zh'].includes(lang)) {
      const translations = career.translations?.get(lang);
      if (translations) {
        return res.json({
          success: true,
          data: {
            ...careerObj,
            ...translations,
            translations: careerObj.translations
          }
        });
      }
    }

    res.json({ success: true, data: careerObj });
  } catch (error) {
    logger.error('Error getting career:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch career' });
  }
}

/**
 * Create a new career (auto-translates content)
 */
async function createCareer(req, res) {
  try {
    const payload = req.body;
    console.log("🟢 createCareer called. Fields:", Object.keys(payload));

    const TARGET_LANGUAGES = ['fr', 'pt', 'es', 'ru', 'zh'];
    const translations = {};

    async function translateArraySafely(values, lang) {
      if (!Array.isArray(values) || values.length === 0) return [];
      console.log(`🔹 Translating array for ${lang} (${values.length} items)`);
      return await Promise.all(values.map(item => translateText(item, lang)));
    }

    for (const lang of TARGET_LANGUAGES) {
      console.log(`🌍 Translating to ${lang}...`);
      try {
        const [
          titleT, descriptionT, departmentT, locationT,
          typeT, levelT, workArrangementT,
          responsibilitiesT, requirementsT, benefitsT, tagsT
        ] = await Promise.all([
          translateText(payload.title, lang),
          translateText(payload.description, lang),
          translateText(payload.department, lang),
          translateText(payload.location, lang),
          translateText(payload.type, lang),
          translateText(payload.level, lang),
          translateText(payload.workArrangement, lang),
          translateArraySafely(payload.responsibilities, lang),
          translateArraySafely(payload.requirements, lang),
          translateArraySafely(payload.benefits, lang),
          translateArraySafely(payload.tags, lang)
        ]);

        translations[lang] = {
          title: titleT,
          description: descriptionT,
          department: departmentT,
          location: locationT,
          type: typeT,
          level: levelT,
          workArrangement: workArrangementT,
          responsibilities: responsibilitiesT,
          requirements: requirementsT,
          benefits: benefitsT,
          tags: tagsT
        };

        console.log(`✅ Translation completed for ${lang}`);
      } catch (e) {
        logger.warn(`❌ Failed to translate career to ${lang}: ${e.message}`);
      }
    }

    console.log("🧩 Final translations:", Object.keys(translations));
    if (Object.keys(translations).length > 0) {
      payload.translations = translations;
    }

    const created = await Career.create(payload);
    res.status(201).json({ success: true, data: created });

  } catch (error) {
    logger.error('Error creating career:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to create career' });
  }
}

/**
 * Update a career
 */
async function updateCareer(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;

    console.log(`🔹 Update career request received for ID: ${id}`);
    console.log('Payload:', payload);

    const career = await Career.findById(id);
    if (!career) {
      console.warn(`❌ Career not found for ID: ${id}`);
      return res.status(404).json({ success: false, message: 'Career not found' });
    }

    // Merge updates
    Object.assign(career, payload);

    // Prepare translations if any field is updated
    const TARGET_LANGUAGES = ['fr', 'pt', 'es', 'ru', 'zh'];
    if (!career.translations) career.translations = new Map();

    async function translateArraySafely(values, lang) {
      if (!Array.isArray(values) || values.length === 0) return [];
      console.log(`🔹 Translating array for ${lang} (${values.length} items)`);
      return await Promise.all(values.map(item => translateText(item, lang)));
    }

    for (const lang of TARGET_LANGUAGES) {
      try {
        const [titleT, descriptionT, departmentT, locationT, typeT, levelT, workArrangementT,
          responsibilitiesT, requirementsT, benefitsT, tagsT
        ] = await Promise.all([
          payload.title ? translateText(payload.title, lang) : career.translations?.get(lang)?.title || career.title,
          payload.description ? translateText(payload.description, lang) : career.translations?.get(lang)?.description || career.description,
          payload.department ? translateText(payload.department, lang) : career.translations?.get(lang)?.department || career.department,
          payload.location ? translateText(payload.location, lang) : career.translations?.get(lang)?.location || career.location,
          payload.type ? translateText(payload.type, lang) : career.translations?.get(lang)?.type || career.type,
          payload.level ? translateText(payload.level, lang) : career.translations?.get(lang)?.level || career.level,
          payload.workArrangement ? translateText(payload.workArrangement, lang) : career.translations?.get(lang)?.workArrangement || career.workArrangement,
          payload.responsibilities ? translateArraySafely(payload.responsibilities, lang) : career.translations?.get(lang)?.responsibilities || career.responsibilities,
          payload.requirements ? translateArraySafely(payload.requirements, lang) : career.translations?.get(lang)?.requirements || career.requirements,
          payload.benefits ? translateArraySafely(payload.benefits, lang) : career.translations?.get(lang)?.benefits || career.benefits,
          payload.tags ? translateArraySafely(payload.tags, lang) : career.translations?.get(lang)?.tags || career.tags
        ]);

        if (!career.translations) career.translations = {};
        career.translations[lang] = {
          title: titleT,
          description: descriptionT,
          department: departmentT,
          location: locationT,
          type: typeT,
          level: levelT,
          workArrangement: workArrangementT,
          responsibilities: responsibilitiesT,
          requirements: requirementsT,
          benefits: benefitsT,
          tags: tagsT
        };

        console.log(`✅ Translated career to ${lang}`);
      } catch (e) {
        console.warn(`❌ Failed to translate career to ${lang}: ${e.message}`);
      }
    }

    const updatedCareer = await career.save();
    console.log(`✅ Career updated successfully: ID ${updatedCareer._id}`);

    res.json({ success: true, data: updatedCareer, message: 'Career updated successfully' });

  } catch (error) {
    logger.error('Error updating career:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update career' });
  }
}


/**
 * Delete a career
 */
async function deleteCareer(req, res) {
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

module.exports = {
  submitJobApplication,
  getApplicationStatus,
  listCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer
};
