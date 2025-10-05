'use strict';

const ContactOffice = require('../models/ContactOffice');
const { ApiError } = require('../utils/error');
const cloudinaryService = require('../services/cloudinary');

async function createContactOffice(req, res, next) {
  try {
    const {
      region_name,
      region,
      country,
      office_name,
      address,
      phone,
      emails = [],
      is_lab_facility = false,
      notes = '',
      image_url = '',
      region_order = 0,
      office_order = 0
    } = req.body;

    // Validate required fields
    if (!region_name || !region || !country || !office_name || !address || !phone) {
      throw new ApiError(400, 'region_name, region, country, office_name, address, and phone are required');
    }

    // Handle image upload if provided
    let finalImageUrl = image_url;
    if (req.file) {
      try {
        const publicId = `${region.toLowerCase().replace(/\s+/g, '-')}-${country.toLowerCase().replace(/\s+/g, '-')}-${office_name.toLowerCase().replace(/\s+/g, '-')}`;
        const uploadResult = await cloudinaryService.uploadFromBuffer(req.file.buffer, {
          folder: 'cbm/contact-offices',
          public_id: publicId,
          transformation: [
            { width: 400, height: 300, crop: 'fit', quality: 'auto' }
          ]
        });
        finalImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // If Cloudinary is not configured, just skip image upload
        console.warn('Cloudinary not configured, skipping image upload');
        finalImageUrl = image_url; // Keep existing image URL or empty
      }
    }

    const contactOffice = await ContactOffice.create({
      region_name,
      region,
      country,
      office_name,
      address,
      phone,
      emails: Array.isArray(emails) ? emails : emails.split(',').map(e => e.trim()).filter(e => e),
      is_lab_facility,
      notes,
      image_url: finalImageUrl,
      region_order,
      office_order
    });

    res.status(201).json({ success: true, data: contactOffice });
  } catch (err) {
    next(err);
  }
}

async function getContactOffices(req, res, next) {
  try {
    const { region_name, region, country, is_lab_facility } = req.query;
    
    const filter = {};
    if (region_name) filter.region_name = region_name;
    if (region) filter.region = region;
    if (country) filter.country = country;
    if (is_lab_facility !== undefined) filter.is_lab_facility = is_lab_facility === 'true';

    const offices = await ContactOffice.find(filter)
      .sort({ region_order: 1, office_order: 1, createdAt: -1 })
      .lean();

    res.json({ success: true, data: offices });
  } catch (err) {
    next(err);
  }
}

async function getContactOfficeById(req, res, next) {
  try {
    const { id } = req.params;
    const office = await ContactOffice.findById(id);
    
    if (!office) {
      throw new ApiError(404, 'Contact office not found');
    }

    res.json({ success: true, data: office });
  } catch (err) {
    next(err);
  }
}

async function updateContactOffice(req, res, next) {
  try {
    const { id } = req.params;
    const {
      region_name,
      region,
      country,
      office_name,
      address,
      phone,
      emails,
      is_lab_facility,
      notes,
      image_url,
      region_order,
      office_order
    } = req.body;

    // Validate required fields
    if (!region_name || !region || !country || !office_name || !address || !phone) {
      throw new ApiError(400, 'region_name, region, country, office_name, address, and phone are required');
    }

    const updates = {
      region_name,
      region,
      country,
      office_name,
      address,
      phone,
      emails: Array.isArray(emails) ? emails : emails.split(',').map(e => e.trim()).filter(e => e),
      is_lab_facility,
      notes,
      region_order,
      office_order
    };

    // Handle image upload if provided
    if (req.file) {
      try {
        const publicId = `${region.toLowerCase().replace(/\s+/g, '-')}-${country.toLowerCase().replace(/\s+/g, '-')}-${office_name.toLowerCase().replace(/\s+/g, '-')}`;
        const uploadResult = await cloudinaryService.uploadFromBuffer(req.file.buffer, {
          folder: 'cbm/contact-offices',
          public_id: publicId,
          transformation: [
            { width: 400, height: 300, crop: 'fit', quality: 'auto' }
          ]
        });
        updates.image_url = uploadResult.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // If Cloudinary is not configured, just skip image upload
        console.warn('Cloudinary not configured, skipping image upload');
        // Don't update image_url if upload fails
      }
    } else if (image_url !== undefined) {
      updates.image_url = image_url;
    }

    const updatedOffice = await ContactOffice.findByIdAndUpdate(id, updates, { new: true });
    
    if (!updatedOffice) {
      throw new ApiError(404, 'Contact office not found');
    }

    res.json({ success: true, data: updatedOffice });
  } catch (err) {
    next(err);
  }
}

async function deleteContactOffice(req, res, next) {
  try {
    const { id } = req.params;
    const office = await ContactOffice.findByIdAndDelete(id);
    
    if (!office) {
      throw new ApiError(404, 'Contact office not found');
    }

    res.json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
}

async function getContactOfficesGrouped(req, res, next) {
  try {
    const offices = await ContactOffice.find()
      .sort({ region_order: 1, office_order: 1 })
      .lean();
    
    const grouped = offices.reduce((acc, o) => {
      if (!acc[o.region_name]) acc[o.region_name] = [];
      acc[o.region_name].push(o);
      return acc;
    }, {});
    
    const response = Object.entries(grouped).map(([region_name, offices]) => ({ region_name, offices }));
    res.json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createContactOffice,
  getContactOffices,
  getContactOfficeById,
  updateContactOffice,
  deleteContactOffice,
  getContactOfficesGrouped
};
