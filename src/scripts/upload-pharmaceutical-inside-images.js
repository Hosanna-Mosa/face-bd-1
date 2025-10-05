'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const cloudinaryService = require('../services/cloudinary');
const Section = require('../models/Section');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

// Pharmaceutical services mapping
const PHARMACEUTICAL_SERVICES = {
  inspection: [
    {
      sectionId: 'pharmaceutical-products-inspection-ppi',
      folderName: 'pharmaceutical-products-inspection-ppi',
      title: 'Pharmaceutical Products Inspection (PPI)'
    },
    {
      sectionId: 'pharmaceutical-plant-equipment-inspection-ppei',
      folderName: 'pharmaceutical-plant-equipment-inspection-ppei',
      title: 'Pharmaceutical Plant Equipment Inspection (PPEI)'
    }
  ],
  'verification-certification': [
    {
      sectionId: 'pharmaceutical-plant-refinery-fitness-verification-certification',
      folderName: 'pharmaceutical-plant-refinery-fitness-verification-certification',
      title: 'Pharmaceutical Plant & Refinery Fitness Verification & Certification'
    }
  ]
};

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

async function uploadInsideImagesForService(serviceType, serviceData) {
  const { sectionId, folderName, title } = serviceData;
  const uploadDir = path.join(__dirname, '../../uploads', serviceType, folderName, 'images');
  
  console.log(`📁 Processing ${title}...`);
  
  if (!fs.existsSync(uploadDir)) {
    console.log(`⚠️  Images directory not found: ${uploadDir}`);
    return [];
  }

  const files = fs.readdirSync(uploadDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (files.length === 0) {
    console.log(`⚠️  No images found in ${uploadDir}`);
    return [];
  }

  console.log(`📸 Found ${files.length} image(s) to upload`);

  const uploadedImages = [];

  for (const file of files) {
    const filePath = path.join(uploadDir, file);
    
    try {
      // Upload to Cloudinary
      const result = await cloudinaryService.uploadImage(
        filePath,
        serviceType,
        folderName,
        null // Let Cloudinary generate the name
      );

      uploadedImages.push(result.url);
      console.log(`✅ Uploaded: ${file} -> ${result.url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
    }
  }

  return uploadedImages;
}

async function updateSectionImages(sectionId, imageUrls) {
  if (!imageUrls || imageUrls.length === 0) return;

  try {
    const section = await Section.findOne({ sectionId });
    if (!section) {
      console.log(`⚠️  Section not found: ${sectionId}`);
      return;
    }

    // Merge with existing images (avoid duplicates)
    const existingImages = section.images || [];
    const newImages = imageUrls.filter(url => !existingImages.includes(url));
    
    if (newImages.length > 0) {
      section.images = [...existingImages, ...newImages];
      await section.save();
      console.log(`✅ Updated section with ${newImages.length} new images: ${section.title}`);
    } else {
      console.log(`ℹ️  No new images to add for: ${section.title}`);
    }
  } catch (error) {
    console.error(`❌ Failed to update section ${sectionId}:`, error.message);
  }
}

async function uploadAllPharmaceuticalInsideImages() {
  try {
    await connectToDatabase();
    
    console.log('🚀 Starting pharmaceutical inside images upload...\n');

    let totalUploaded = 0;

    // Process inspection services
    console.log('📋 Processing Inspection Services...');
    for (const serviceData of PHARMACEUTICAL_SERVICES.inspection) {
      const imageUrls = await uploadInsideImagesForService('inspection', serviceData);
      await updateSectionImages(serviceData.sectionId, imageUrls);
      totalUploaded += imageUrls.length;
      console.log('');
    }

    // Process verification-certification services
    console.log('🏆 Processing Verification & Certification Services...');
    for (const serviceData of PHARMACEUTICAL_SERVICES['verification-certification']) {
      const imageUrls = await uploadInsideImagesForService('verification-certification', serviceData);
      await updateSectionImages(serviceData.sectionId, imageUrls);
      totalUploaded += imageUrls.length;
      console.log('');
    }

    console.log(`🎉 Successfully uploaded ${totalUploaded} pharmaceutical inside images!`);
    
    if (totalUploaded === 0) {
      console.log('\n📝 Next steps:');
      console.log('1. Add your inside images to the respective folders:');
      console.log('   - backend/uploads/inspection/pharmaceutical-products-inspection-ppi/images/');
      console.log('   - backend/uploads/inspection/pharmaceutical-plant-equipment-inspection-ppei/images/');
      console.log('   - backend/uploads/verification-certification/pharmaceutical-plant-refinery-fitness-verification-certification/images/');
      console.log('2. Run this script again to upload them to Cloudinary');
    }

  } catch (error) {
    console.error('❌ Failed to upload pharmaceutical inside images:', error.message);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  uploadAllPharmaceuticalInsideImages()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { uploadAllPharmaceuticalInsideImages };
