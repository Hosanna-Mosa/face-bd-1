'use strict';

/**
 * Production Translation Script for Contact Offices
 *
 * Translates contact office fields and stores them in translations Map.
 *
 * Usage:
 *  node src/scripts/translate-contact-offices.js translate-all
 *  node src/scripts/translate-contact-offices.js list
 *  node src/scripts/translate-contact-offices.js status-all
 */

const mongoose = require('mongoose');
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

const ContactOffice = require('../models/ContactOffice');

const TARGET_LANGUAGES = ['fr', 'pt', 'es', 'ru'];

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

function initializeTranslationClient() {
  try {
    const config = { projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-project-id' };
    if ('AIzaSyAWiR1KCKcclqjPUQrBxmTEFgjtV3cv5CY'||process.env.GOOGLE_CLOUD_API_KEY) {
        config.key = 'AIzaSyAWiR1KCKcclqjPUQrBxmTEFgjtV3cv5CY' || process.env.GOOGLE_CLOUD_API_KEY;
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

async function translateText(translateClient, text, targetLanguage, sourceLanguage = 'en') {
  try {
    if (!text || (typeof text === 'string' && text.trim() === '')) return text || '';
    const [translation] = await translateClient.translate(text, { from: sourceLanguage, to: targetLanguage });
    return translation;
  } catch (error) {
    console.error(`❌ Translation error (${sourceLanguage} → ${targetLanguage}):`, error.message);
    throw error;
  }
}

async function fetchOffices() {
  const offices = await ContactOffice.find({}).sort({ region_order: 1, office_order: 1 });
  return offices;
}

async function translateOffice(office, translateClient) {
  const translations = {};
  for (const lang of TARGET_LANGUAGES) {
    try {
      const [region_name, region, country, office_name, address, notes] = await Promise.all([
        translateText(translateClient, office.region_name, lang),
        translateText(translateClient, office.region, lang),
        translateText(translateClient, office.country, lang),
        translateText(translateClient, office.office_name, lang),
        translateText(translateClient, office.address, lang),
        translateText(translateClient, office.notes || '', lang),
      ]);
      translations[lang] = { region_name, region, country, office_name, address, notes };
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.error(`   ❌ Failed to translate office ${office.office_name} to ${lang}:`, e.message);
    }
  }
  office.translations = translations;
  return office;
}

async function saveTranslatedOffice(office) {
  return ContactOffice.findByIdAndUpdate(
    office._id,
    { translations: office.translations, updatedAt: new Date() },
    { new: true }
  );
}

async function translateAllOffices() {
  console.log('\n🚀 Translating contact offices');
  const translateClient = initializeTranslationClient();
  const offices = await fetchOffices();
  let success = 0, failed = 0;
  for (let i = 0; i < offices.length; i++) {
    const office = offices[i];
    console.log(`\n📋 Processing ${i + 1}/${offices.length}: ${office.office_name}`);
    try {
      const trOffice = await translateOffice(office, translateClient);
      await saveTranslatedOffice(trOffice);
      success++;
      if (i < offices.length - 1) {
        console.log('⏳ Waiting 1.5s...');
        await new Promise(r => setTimeout(r, 1500));
      }
    } catch (e) {
      failed++;
      console.error('❌ Failed:', e.message);
    }
  }
  console.log('\n📊 Summary');
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
}

async function listOffices() {
  const offices = await fetchOffices();
  offices.forEach((o, i) => console.log(`${i + 1}. ${o.region_name} - ${o.office_name} (${o.country})`));
  console.log(`\n✅ Total: ${offices.length}`);
}

async function statusAll() {
  const offices = await fetchOffices();
  const expected = TARGET_LANGUAGES.length;
  let fully = 0, partial = 0, none = 0;
  offices.forEach((o, i) => {
    const c = Object.keys(o.translations || {}).length;
    if (c === expected) fully++; else if (c > 0) partial++; else none++;
    console.log(`${i + 1}. ${o.office_name} - ${c === expected ? '✅ Full' : c > 0 ? '⚠️ Partial' : '❌ None'} (${c}/${expected})`);
  });
  console.log(`\n📈 Fully: ${fully} | ⚠️ Partial: ${partial} | ❌ None: ${none}`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  try {
    await connectDB();
    switch (command) {
      case 'translate-all':
        await translateAllOffices();
        break;
      case 'list':
        await listOffices();
        break;
      case 'status-all':
        await statusAll();
        break;
      default:
        console.log('🚀 Contact Offices Translation Script');
        console.log('=====================================');
        console.log('\nUsage:');
        console.log('  node translate-contact-offices.js translate-all');
        console.log('  node translate-contact-offices.js list');
        console.log('  node translate-contact-offices.js status-all');
        console.log('\nTarget Languages: fr, pt, es, ru');
        break;
    }
  } catch (e) {
    console.error('\n❌ Script failed:', e.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  translateAllOffices,
  translateOffice,
  saveTranslatedOffice,
  listOffices,
  statusAll,
};


