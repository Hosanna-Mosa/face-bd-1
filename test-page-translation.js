/**
 * Test script to demonstrate page translation functionality
 * This script shows how the updated page controller handles translations
 */

const mongoose = require('mongoose');
const Page = require('./src/models/Page');
require('dotenv').config();

async function testPageTranslation() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster');
    console.log('✅ Connected to MongoDB');

    // Find a page with translations
    const page = await Page.findOne({
      language: 'en',
      isActive: true,
      translations: { $exists: true, $ne: {} }
    });

    if (!page) {
      console.log('⚠️  No pages with translations found. Please run the translation script first.');
      return;
    }

    console.log('\n📋 Original Page (English):');
    console.log(`Title: ${page.title}`);
    console.log(`Description: ${page.description}`);
    console.log(`Language: ${page.language}`);

    // Show available translations
    console.log('\n🌍 Available Translations:');
    if (page.translations) {
      if (page.translations instanceof Map) {
        for (const [lang, translation] of page.translations) {
          console.log(`  ${lang.toUpperCase()}:`);
          console.log(`    Title: ${translation.title}`);
          console.log(`    Description: ${translation.description}`);
        }
      } else if (typeof page.translations === 'object') {
        for (const [lang, translation] of Object.entries(page.translations)) {
          console.log(`  ${lang.toUpperCase()}:`);
          console.log(`    Title: ${translation.title}`);
          console.log(`    Description: ${translation.description}`);
        }
      }
    }

    // Simulate the controller logic for different languages
    const testLanguages = ['fr', 'pt', 'es', 'ru'];
    
    for (const lang of testLanguages) {
      console.log(`\n🔄 Simulating translation to ${lang.toUpperCase()}:`);
      
      // Simulate the controller translation logic
      let pageFromDb = null;
      if (page.translations) {
        if (page.translations instanceof Map) {
          pageFromDb = page.translations.get(lang);
        } else if (typeof page.translations === 'object') {
          pageFromDb = page.translations[lang];
        }
      }
      
      if (pageFromDb && (pageFromDb.title || pageFromDb.description)) {
        const translatedTitle = pageFromDb.title || page.title;
        const translatedDescription = pageFromDb.description || page.description;
        
        console.log(`  Title: ${translatedTitle}`);
        console.log(`  Description: ${translatedDescription}`);
        console.log(`  Language: ${lang}`);
      } else {
        console.log(`  ❌ No translation available for ${lang.toUpperCase()}`);
      }
    }

    console.log('\n✅ Page translation test completed!');
    console.log('\n💡 To test with actual API calls:');
    console.log('  GET /api/pages/slug/testing?lang=fr');
    console.log('  GET /api/pages/slug/testing?lang=pt');
    console.log('  GET /api/pages/slug/testing?lang=es');
    console.log('  GET /api/pages/slug/testing?lang=ru');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
if (require.main === module) {
  testPageTranslation().catch(console.error);
}

module.exports = { testPageTranslation };

















