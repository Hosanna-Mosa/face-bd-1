#!/usr/bin/env node

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function debugCloudinary() {
  console.log('🔍 Debugging Cloudinary Images...\n');

  try {
    // Get all resources to see what's there
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 50
    });

    console.log(`📊 Total images found: ${result.resources.length}\n`);

    if (result.resources.length > 0) {
      console.log('📋 All images in Cloudinary:');
      result.resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.public_id}`);
        console.log(`   URL: ${resource.secure_url}`);
        console.log(`   Size: ${resource.width}x${resource.height}`);
        console.log(`   Format: ${resource.format}`);
        console.log(`   Created: ${resource.created_at}`);
        console.log('');
      });
    } else {
      console.log('❌ No images found in Cloudinary');
    }

    // Try to get images with specific prefix
    console.log('🔍 Trying to get images with cbm prefix...');
    const cbmResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'cbm',
      max_results: 50
    });

    console.log(`📊 Images with 'cbm' prefix: ${cbmResult.resources.length}\n`);

    if (cbmResult.resources.length > 0) {
      console.log('📋 Images with cbm prefix:');
      cbmResult.resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.public_id}`);
        console.log(`   URL: ${resource.secure_url}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugCloudinary().catch(console.error);
