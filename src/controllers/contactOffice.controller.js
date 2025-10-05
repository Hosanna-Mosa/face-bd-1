'use strict';

const ContactOffice = require('../models/ContactOffice');
const { ApiError } = require('../utils/error');
const cloudinaryService = require('../services/cloudinary');
const { translateText, SUPPORTED, translateArraySafely } = require('../services/translation');

function parseEmails(emails) {
  if (!emails) return [];
  if (Array.isArray(emails)) return emails;
  return emails.split(',').map(e => e.trim()).filter(e => e);
}

async function createContactOffice(req, res, next) {
  try {
    console.log('🔹 Create contact office request received:', req.body);

    const {
      region_name,
      region,
      country,
      office_name,
      address,
      phone,
      emails,
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
        console.log(`🔹 Uploading image to Cloudinary with publicId: ${publicId}`);
        const uploadResult = await cloudinaryService.uploadFromBuffer(req.file.buffer, {
          folder: 'cbm/contact-offices',
          public_id: publicId,
          transformation: [{ width: 400, height: 300, crop: 'fit', quality: 'auto' }]
        });
        finalImageUrl = uploadResult.url;
        console.log(`✅ Featured image uploaded: ${finalImageUrl}`);
      } catch (uploadError) {
        console.warn('❌ Cloudinary upload failed, using provided image_url or empty:', uploadError);
      }
    }

    // Prepare initial office data
    const officeData = {
      region_name,
      region,
      country,
      office_name,
      address,
      phone,
      emails: parseEmails(emails),
      is_lab_facility,
      notes,
      image_url: finalImageUrl,
      region_order,
      office_order,
      translations: {}
    };

    // Translate fields into other languages
    const TARGET_LANGUAGES = SUPPORTED.filter(l => l !== 'en');
    for (const lang of TARGET_LANGUAGES) {
      try {
        const [regionT, regionNameT, countryT, officeT, addressT, notesT] = await Promise.all([
          translateText(region, lang),
          translateText(region_name, lang),
          translateText(country, lang),
          translateText(office_name, lang),
          translateText(address, lang),
          translateText(notes, lang)
        ]);

        officeData.translations[lang] = {
          region_name: regionNameT,
          region: regionT,
          country: countryT,
          office_name: officeT,
          address: addressT,
          notes: notesT
        };

        console.log(`✅ Translated contact office to ${lang}`);
      } catch (e) {
        console.warn(`❌ Failed to translate contact office to ${lang}: ${e.message}`);
      }
    }

    const contactOffice = await ContactOffice.create(officeData);
    console.log(`✅ Contact office created successfully: ID ${contactOffice._id}`);

    res.status(201).json({ success: true, data: contactOffice });

  } catch (err) {
    console.error('❌ Error creating contact office:', err);
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
    console.log(`🔹 Update contact office request received for ID: ${id}`, req.body);

    const existingOffice = await ContactOffice.findById(id);
    if (!existingOffice) throw new ApiError(404, 'Contact office not found');

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
      emails: parseEmails(emails),
      is_lab_facility,
      notes,
      region_order,
      office_order,
      translations: existingOffice.translations || {}
    };

    // Handle image upload
    if (req.file) {
      try {
        const publicId = `${region.toLowerCase().replace(/\s+/g, '-')}-${country.toLowerCase().replace(/\s+/g, '-')}-${office_name.toLowerCase().replace(/\s+/g, '-')}`;
        console.log(`🔹 Uploading updated image to Cloudinary with publicId: ${publicId}`);
        const uploadResult = await cloudinaryService.uploadFromBuffer(req.file.buffer, {
          folder: 'cbm/contact-offices',
          public_id: publicId,
          transformation: [{ width: 400, height: 300, crop: 'fit', quality: 'auto' }]
        });
        updates.image_url = uploadResult.url;
        console.log(`✅ Updated featured image: ${updates.image_url}`);
      } catch (uploadError) {
        console.warn('❌ Cloudinary upload failed, keeping existing image:', uploadError);
      }
    } else if (image_url !== undefined) {
      updates.image_url = image_url;
    }

    // Translate updated fields
    const TARGET_LANGUAGES = SUPPORTED.filter(l => l !== 'en');
    for (const lang of TARGET_LANGUAGES) {
      try {
        const [regionT, regionNameT, countryT, officeT, addressT, notesT] = await Promise.all([
          translateText(region, lang),
          translateText(region_name, lang),
          translateText(country, lang),
          translateText(office_name, lang),
          translateText(address, lang),
          translateText(notes, lang)
        ]);

        updates.translations[lang] = {
          region_name: regionNameT,
          region: regionT,
          country: countryT,
          office_name: officeT,
          address: addressT,
          notes: notesT
        };

        console.log(`✅ Translated updated contact office to ${lang}`);
      } catch (e) {
        console.warn(`❌ Failed to translate updated contact office to ${lang}: ${e.message}`);
      }
    }

    const updatedOffice = await ContactOffice.findByIdAndUpdate(id, updates, { new: true });
    console.log(`✅ Contact office updated successfully: ID ${updatedOffice._id}`);

    res.json({ success: true, data: updatedOffice });

  } catch (err) {
    console.error('❌ Error updating contact office:', err);
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
