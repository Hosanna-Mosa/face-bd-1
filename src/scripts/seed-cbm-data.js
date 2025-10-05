'use strict';

const mongoose = require('mongoose');
const DataSeeder = require('../utils/seeder');
const cbmSections = require('../data/cbm-sections');
const cbmPages = require('../data/cbm-pages');

// Connect to MongoDB with better error handling
const MONGODB_URI = 'mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔌 Attempting to connect to MongoDB...');
console.log(`📍 Connection string: ${MONGODB_URI.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas'}`);

// Wait for connection before proceeding
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });
    console.log('✅ Successfully connected to MongoDB');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('  1. If using local MongoDB: Make sure MongoDB is running locally');
    console.log('  2. If using Atlas: Check your IP whitelist and credentials');
    console.log('  3. Try setting MONGODB_URI environment variable');
    console.log('\n🔧 To use local MongoDB:');
    console.log('  - Install MongoDB Community Server');
    console.log('  - Start MongoDB service');
    console.log('  - Run: npm run seed:cbm');
    return false;
  }
}

const seeder = new DataSeeder();

async function seedCBMData() {
  try {
    // First, ensure MongoDB is connected
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      console.log('❌ Cannot proceed without database connection');
      process.exit(1);
    }

    console.log('🌱 Starting CBM Data Seeding...\n');

    // Step 1: Create all CBM sections first
    console.log('📋 Creating CBM Sections...');
    const sectionIds = [];
    
    for (const [category, sections] of Object.entries(cbmSections)) {
      console.log(`  Creating ${category} sections...`);
      const createdSections = await seeder.createSections(sections);
      sectionIds.push(...createdSections.map(s => s.sectionId));
      console.log(`  ✅ Created ${createdSections.length} ${category} sections`);
    }

    // Step 2: Create CBM pages that reference the sections
    console.log('\n📄 Creating CBM Pages...');
    const createdPages = await seeder.createPages(cbmPages);
    console.log(`  ✅ Created ${createdPages.length} CBM pages`);

    // Step 3: Get summary
    const summary = seeder.getSummary();
    console.log('\n📊 Seeding Summary:');
    console.log(`  Sections: ${summary.sections.count}`);
    console.log(`  Pages: ${summary.pages.count}`);

    console.log('\n🎉 CBM Data Seeding Completed Successfully!');
    console.log('\n📝 What was created:');
    console.log('  • 5 CBM Sections (Vibration Analysis, Laser Alignment, IoT Monitoring, etc.)');
    console.log('  • 1 CBM Page with all sections');
    console.log('\n🔗 You can now access:');
    console.log('  • GET /api/sections - All sections');
    console.log('  • GET /api/pages - All pages');
    console.log('  • GET /api/pages/slug/cbm - CBM page with sections');
    console.log('  • GET /api/pages/search/cbm - Search CBM page');

  } catch (error) {
    console.error('❌ Error seeding CBM data:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

// Function to clear CBM data
async function clearCBMData() {
  try {
    // First, ensure MongoDB is connected
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      console.log('❌ Cannot proceed without database connection');
      process.exit(1);
    }

    console.log('🧹 Clearing CBM Data...');
    
    // Clear sections that match CBM sectionIds
    const cbmSectionIds = [
      'vibration-analysis-balancing',
      'laser-shaft-alignment',
      'remote-cbm-iot-cloud',
      'infrared-thermography',
      'lubrication-oil-analysis'
    ];
    
    await seeder.clearSectionsBySectionIds(cbmSectionIds);
    
    // Clear pages with CBM slug
    await seeder.clearPagesBySlug('cbm');
    
    console.log('✅ CBM data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing CBM data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Export functions for use in other scripts
module.exports = {
  seedCBMData,
  clearCBMData
};

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'clear') {
    clearCBMData();
  } else {
    seedCBMData();
  }
}
