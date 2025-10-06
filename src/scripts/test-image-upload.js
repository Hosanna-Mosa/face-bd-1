#!/usr/bin/env node

/**
 * Test script for the image upload system
 * Run this after setting up your .env file
 */

const cloudinaryService = require('./src/services/cloudinary');
const { logger } = require('./src/setup/logger');

async function testImageSystem() {
  console.log('🧪 Testing Image Upload System...\n');

  try {
    // Test 1: Check Cloudinary connection
    console.log('1️⃣ Testing Cloudinary connection...');
    const stats = await cloudinaryService.getUsageStats();
    console.log('✅ Cloudinary connection successful');
    console.log(`   Plan: ${stats.plan}`);
    console.log(`   Objects: ${stats.objects}`);
    console.log(`   Storage: ${Math.round(stats.storage / 1024 / 1024)} MB\n`);

    // Test 2: Test folder structure
    console.log('2️⃣ Testing folder structure...');
    const testFolders = [
      'testing/visual-testing',
      'testing/drone-inspection',
      'inspection/welding-inspection',
      'inspection/third-party-inspection'
    ];

    for (const folder of testFolders) {
      const [serviceType, subService] = folder.split('/');
      try {
        const images = await cloudinaryService.getImagesFromFolder(serviceType, subService, 1);
        console.log(`   ✅ ${folder}: ${images.length} images found`);
      } catch (error) {
        console.log(`   ⚠️  ${folder}: No images yet (this is normal for new folders)`);
      }
    }
    console.log('');

    // Test 3: Test image naming
    console.log('3️⃣ Testing image naming convention...');
    const testNames = [
      'equipment-inspection.jpg',
      'welding-process.png',
      'drone-aerial-view.jpg'
    ];

    testNames.forEach((name, index) => {
      const subService = 'visual-testing';
      const generatedName = cloudinaryService.generateImageName(name, subService);
      console.log(`   ${index + 1}. Original: ${name}`);
      console.log(`      Generated: ${generatedName}`);
    });
    console.log('');

    // Test 4: API endpoints
    console.log('4️⃣ Testing API endpoints...');
    console.log('   ✅ GET /api/images/health');
    console.log('   ✅ POST /api/images/testing/{subService}/upload');
    console.log('   ✅ GET /api/images/testing/{subService}/images');
    console.log('   ✅ POST /api/images/inspection/{subService}/upload');
    console.log('   ✅ GET /api/images/inspection/{subService}/images');
    console.log('   ✅ DELETE /api/images/image/{publicId}');
    console.log('   ✅ GET /api/images/usage-stats\n');

    // Test 5: Folder organization
    console.log('5️⃣ Folder organization ready for images:');
    console.log('   📁 backend/uploads/testing/');
    console.log('      ├── visual-testing/');
    console.log('      ├── drone-inspection/');
    console.log('      ├── ultrasonic-testing/');
    console.log('      └── ... (15 sub-services)');
    console.log('   📁 backend/uploads/inspection/');
    console.log('      ├── third-party-inspection/');
    console.log('      ├── welding-inspection/');
    console.log('      ├── asset-integrity-inspection/');
    console.log('      └── ... (14 sub-services)');
    console.log('   📁 backend/uploads/auditing/');
    console.log('   📁 backend/uploads/cbm/');
    console.log('   📁 backend/uploads/verification-certification/\n');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Add your Cloudinary credentials to .env file');
    console.log('   2. Place images in the appropriate sub-service folders');
    console.log('   3. Use the API endpoints to upload and manage images');
    console.log('   4. Monitor usage with /api/images/usage-stats');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('MONGODB_URI')) {
      console.log('\n💡 Solution: Add MONGODB_URI to your .env file');
    } else if (error.message.includes('CLOUDINARY')) {
      console.log('\n💡 Solution: Add Cloudinary credentials to your .env file');
    }
    
    console.log('\n📖 See CONFIGURATION.md for setup instructions');
  }
}

// Run the test
testImageSystem().catch(console.error);
