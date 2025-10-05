'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

// Pharmaceutical services with their expected Cloudinary URLs
const PHARMACEUTICAL_COVER_URLS = {
  'pharmaceutical-products-inspection-ppi': 'https://res.cloudinary.com/docyipoze/image/upload/v1756657796/cbm/inspection/pharmaceutical-products-inspection-ppi/cover-photo.jpg',
  'pharmaceutical-plant-equipment-inspection-ppei': 'https://res.cloudinary.com/docyipoze/image/upload/v1756657796/cbm/inspection/pharmaceutical-plant-equipment-inspection-ppei/cover-photo.jpg',
  'pharmaceutical-plant-refinery-fitness-verification-certification': 'https://res.cloudinary.com/docyipoze/image/upload/v1756657796/cbm/verification-certification/pharmaceutical-plant-refinery-fitness-verification-certification/cover-photo.jpg'
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

async function updateCoverUrls() {
  try {
    await connectToDatabase();
    
    console.log('🚀 Updating pharmaceutical service cover URLs...\n');

    for (const [sectionId, coverUrl] of Object.entries(PHARMACEUTICAL_COVER_URLS)) {
      try {
        const section = await Section.findOne({ sectionId });
        
        if (!section) {
          console.log(`⚠️  Section not found: ${sectionId}`);
          continue;
        }

        section.coverPhoto = coverUrl;
        await section.save();
        
        console.log(`✅ Updated ${section.title}`);
        console.log(`   Cover URL: ${coverUrl}\n`);
      } catch (error) {
        console.error(`❌ Failed to update ${sectionId}:`, error.message);
      }
    }

    console.log('🎉 Successfully updated all pharmaceutical cover URLs!');

  } catch (error) {
    console.error('❌ Failed to update cover URLs:', error.message);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  updateCoverUrls()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { updateCoverUrls };
