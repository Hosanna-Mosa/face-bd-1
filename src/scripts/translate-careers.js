/**
 * Production Translation Script for Career Data
 * 
 * This script translates English career listings to 4 languages (fr, pt, es, ru)
 * and saves them in the translations Map object of each career.
 * 
 * Usage:
 * node src/scripts/translate-careers.js translate
 * node src/scripts/translate-careers.js list
 * node src/scripts/translate-careers.js status
 * 
 * Example:
 * node src/scripts/translate-careers.js translate
 */

const mongoose = require('mongoose');
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

// Import models and translation utilities
const Career = require('../models/Career');
const { 
  translateEmploymentType, 
  translateSeniorityLevel, 
  translateWorkArrangement,
  translateDepartment,
  translateLocation 
} = require('./career-translations');

// Target languages for translation
const TARGET_LANGUAGES = ['fr', 'pt', 'es', 'ru'];

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// Initialize Google Cloud Translation client
function initializeTranslationClient() {
  try {
    const config = {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-project-id',
    };
    
    if (process.env.GOOGLE_CLOUD_API_KEY) {
      config.key = process.env.GOOGLE_CLOUD_API_KEY;
      console.log('✅ Using Google Cloud API Key for authentication');
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      config.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      console.log('✅ Using Google Cloud service account key file');
    } else if (process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
      config.credentials = {
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
      };
      console.log('✅ Using Google Cloud service account credentials');
    } else {
      throw new Error('No Google Cloud credentials found');
    }
    
    return new Translate(config);
  } catch (error) {
    console.error('❌ Error initializing Google Cloud Translation:', error.message);
    process.exit(1);
  }
}

/**
 * Fetch all active English careers
 * @returns {Promise<Array>} - Array of active careers
 */
async function fetchActiveCareers() {
  try {
    console.log('\n📋 Fetching active careers for translation');
    
    const careers = await Career.find({
      isActive: true
    }).sort({ postedAt: -1, createdAt: -1 });
    
    console.log(`✅ Found ${careers.length} active careers`);
    
    if (careers.length === 0) {
      console.log('⚠️  No active careers found');
      return [];
    }
    
    // Display careers
    careers.forEach((career, index) => {
      console.log(`  ${index + 1}. ${career.title} - ${career.department} (${career.location})`);
    });
    
    return careers;
  } catch (error) {
    console.error('❌ Error fetching careers:', error.message);
    throw error;
  }
}

/**
 * Translate text using Google Cloud Translation API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (default: 'en')
 * @returns {Promise<string>} - Translated text
 */
async function translateText(translateClient, text, targetLanguage, sourceLanguage = 'en') {
  try {
    if (!text || text.trim() === '') return text;
    
    const [translation] = await translateClient.translate(text, {
      from: sourceLanguage,
      to: targetLanguage,
    });
    return translation;
  } catch (error) {
    console.error(`❌ Translation error (${sourceLanguage} → ${targetLanguage}):`, error.message);
    throw error;
  }
}

/**
 * Translate an array of strings
 * @param {Array} array - Array of strings to translate
 * @param {string} targetLanguage - Target language code
 * @param {Object} translateClient - Google Cloud Translation client
 * @returns {Promise<Array>} - Array of translated strings
 */
async function translateArray(translateClient, array, targetLanguage) {
  if (!array || array.length === 0) return [];
  
  const translatedArray = [];
  for (const item of array) {
    if (item && item.trim() !== '') {
      const translated = await translateText(translateClient, item, targetLanguage);
      translatedArray.push(translated);
    } else {
      translatedArray.push(item);
    }
  }
  return translatedArray;
}

/**
 * Translate a single career to all target languages
 * @param {Object} career - Career object from database
 * @param {Object} translateClient - Google Cloud Translation client
 * @returns {Promise<Object>} - Updated career with translations
 */
async function translateCareer(career, translateClient) {
  try {
    console.log(`\n🔄 Translating career: "${career.title}"`);
    
    const translations = {};
    
    // Translate to each target language
    for (const lang of TARGET_LANGUAGES) {
      console.log(`   📝 Translating to ${lang.toUpperCase()}...`);
      
      try {
        // Translate all text fields
        const [
          translatedTitle,
          translatedDescription,
          translatedResponsibilities,
          translatedRequirements,
          translatedBenefits,
          translatedTags
        ] = await Promise.all([
          translateText(translateClient, career.title, lang),
          translateText(translateClient, career.description, lang),
          translateArray(translateClient, career.responsibilities || [], lang),
          translateArray(translateClient, career.requirements || [], lang),
          translateArray(translateClient, career.benefits || [], lang),
          translateArray(translateClient, career.tags || [], lang)
        ]);

        // Use predefined translations for enums and common values
        const translatedDepartment = translateDepartment(career.department, lang);
        const translatedLocation = translateLocation(career.location, lang);
        const translatedType = translateEmploymentType(career.type, lang);
        const translatedLevel = translateSeniorityLevel(career.level, lang);
        const translatedWorkArrangement = translateWorkArrangement(career.workArrangement, lang);
        
        translations[lang] = {
          title: translatedTitle,
          description: translatedDescription,
          department: translatedDepartment,
          location: translatedLocation,
          type: translatedType,
          level: translatedLevel,
          workArrangement: translatedWorkArrangement,
          responsibilities: translatedResponsibilities,
          requirements: translatedRequirements,
          benefits: translatedBenefits,
          tags: translatedTags
        };
        
        console.log(`   ✅ ${lang.toUpperCase()}: "${translatedTitle}"`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`   ❌ Failed to translate to ${lang}:`, error.message);
        // Continue with other languages
      }
    }
    
    // Update the career with translations
    career.translations = translations;
    
    console.log(`✅ Completed translations for career: "${career.title}"`);
    return career;
    
  } catch (error) {
    console.error('❌ Error translating career:', error.message);
    throw error;
  }
}

/**
 * Save translated career to database
 * @param {Object} career - Career with translations
 * @returns {Promise<Object>} - Updated career from database
 */
async function saveTranslatedCareer(career) {
  try {
    const updatedCareer = await Career.findByIdAndUpdate(
      career._id,
      { 
        translations: career.translations,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    console.log(`💾 Saved translations for career: "${career.title}"`);
    return updatedCareer;
    
  } catch (error) {
    console.error('❌ Error saving career:', error.message);
    throw error;
  }
}

/**
 * Translate all active careers
 */
async function translateAllCareers() {
  console.log('\n🚀 Starting translation for all active careers');
  console.log('==============================================');
  
  try {
    // Initialize translation client
    const translateClient = initializeTranslationClient();
    
    // Fetch active careers
    const careers = await fetchActiveCareers();
    
    if (careers.length === 0) {
      console.log('⚠️  No careers to translate');
      return;
    }
    
    // Translate each career
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < careers.length; i++) {
      const career = careers[i];
      console.log(`\n📋 Processing career ${i + 1}/${careers.length}: ${career.title}`);
      
      try {
        // Translate the career
        const translatedCareer = await translateCareer(career, translateClient);
        
        // Save to database
        await saveTranslatedCareer(translatedCareer);
        
        successCount++;
        
        // Add delay between careers to avoid rate limiting
        if (i < careers.length - 1) {
          console.log('⏳ Waiting 2 seconds before next career...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`❌ Failed to process career "${career.title}":`, error.message);
        errorCount++;
        // Continue with other careers
      }
    }
    
    // Display summary
    console.log('\n📊 Translation Summary');
    console.log('======================');
    console.log(`✅ Successfully translated: ${successCount} careers`);
    console.log(`❌ Failed translations: ${errorCount} careers`);
    console.log(`📄 Total careers processed: ${careers.length}`);
    
    if (successCount > 0) {
      console.log('\n🎉 Translation completed successfully!');
      console.log('💡 Translations are now available in the database');
    }
    
  } catch (error) {
    console.error('\n❌ Translation process failed:', error.message);
    throw error;
  }
}

/**
 * List all active careers
 */
async function listActiveCareers() {
  console.log('\n📋 Active Careers');
  console.log('=================');
  
  try {
    const careers = await Career.find({ 
      isActive: true
    }).select('title department location level type postedAt').sort({ postedAt: -1 });
    
    if (careers.length === 0) {
      console.log('⚠️  No active careers found');
      return;
    }
    
    careers.forEach((career, index) => {
      console.log(`  ${index + 1}. ${career.title}`);
      console.log(`     Department: ${career.department}`);
      console.log(`     Location: ${career.location}`);
      console.log(`     Level: ${career.level} | Type: ${career.type}`);
      console.log(`     Posted: ${career.postedAt.toLocaleDateString()}`);
      console.log('');
    });
    
    console.log(`✅ Found ${careers.length} active careers`);
    
  } catch (error) {
    console.error('❌ Error listing careers:', error.message);
    throw error;
  }
}

/**
 * Check translation status for all careers
 */
async function checkTranslationStatus() {
  console.log('\n🔍 Translation Status for All Careers');
  console.log('=====================================');
  
  try {
    const careers = await Career.find({
      isActive: true
    }).sort({ postedAt: -1 });
    
    if (careers.length === 0) {
      console.log('⚠️  No active careers found');
      return;
    }
    
    console.log(`\n📊 Translation Status:`);
    console.log(`Total careers: ${careers.length}`);
    
    const statusCounts = {
      fullyTranslated: 0,
      partiallyTranslated: 0,
      notTranslated: 0
    };
    
    careers.forEach((career, index) => {
      const translationCount = Object.keys(career.translations || {}).length;
      const expectedCount = TARGET_LANGUAGES.length;
      
      let status;
      if (translationCount === expectedCount) {
        status = '✅ Fully translated';
        statusCounts.fullyTranslated++;
      } else if (translationCount > 0) {
        status = '⚠️  Partially translated';
        statusCounts.partiallyTranslated++;
      } else {
        status = '❌ Not translated';
        statusCounts.notTranslated++;
      }
      
      console.log(`  ${index + 1}. ${career.title} - ${status} (${translationCount}/${expectedCount})`);
    });
    
    console.log(`\n📈 Summary:`);
    console.log(`  ✅ Fully translated: ${statusCounts.fullyTranslated}`);
    console.log(`  ⚠️  Partially translated: ${statusCounts.partiallyTranslated}`);
    console.log(`  ❌ Not translated: ${statusCounts.notTranslated}`);
    
  } catch (error) {
    console.error('❌ Error checking translation status:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    // Connect to database
    await connectDB();
    
    switch (command) {
      case 'translate':
        await translateAllCareers();
        break;
        
      case 'list':
        await listActiveCareers();
        break;
        
      case 'status':
        await checkTranslationStatus();
        break;
        
      default:
        console.log('🚀 Career Translation Script');
        console.log('============================');
        console.log('\nUsage:');
        console.log('  node translate-careers.js translate  # Translate all active careers');
        console.log('  node translate-careers.js list       # List all active careers');
        console.log('  node translate-careers.js status     # Check translation status');
        console.log('\nExamples:');
        console.log('  node translate-careers.js translate');
        console.log('  node translate-careers.js list');
        console.log('  node translate-careers.js status');
        console.log('\nTarget Languages: fr, pt, es, ru');
        console.log('\nTranslated Fields:');
        console.log('  - title');
        console.log('  - description');
        console.log('  - department');
        console.log('  - location');
        console.log('  - responsibilities (array)');
        console.log('  - requirements (array)');
        console.log('  - benefits (array)');
        console.log('  - tags (array)');
        break;
    }
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  translateAllCareers,
  listActiveCareers,
  checkTranslationStatus,
  fetchActiveCareers,
  translateCareer,
  saveTranslatedCareer
};
