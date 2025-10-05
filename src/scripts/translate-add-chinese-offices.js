/**
 * Add Chinese (zh) translations for Contact Offices
 *
 * Usage:
 *   node src/scripts/translate-add-chinese-offices.js all
 *   node src/scripts/translate-add-chinese-offices.js verify-all
 */

const mongoose = require('mongoose');
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

const ContactOffice = require('../models/ContactOffice');

const TARGET_LANGUAGE = 'zh';

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
      const config = {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-project-id',
      };
  
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
  

async function t(client, text) {
  if (!text || String(text).trim() === '') return '';
  const [translation] = await client.translate(text, { from: 'en', to: TARGET_LANGUAGE });
  return translation;
}

async function translateOfficeDoc(client, o) {
  const translated = {
    region_name: await t(client, o.region_name),
    region: await t(client, o.region),
    country: await t(client, o.country),
    office_name: await t(client, o.office_name),
    address: await t(client, o.address),
    notes: await t(client, o.notes || ''),
  };
  await ContactOffice.findByIdAndUpdate(o._id, { $set: { [`translations.${TARGET_LANGUAGE}`]: translated }, updatedAt: new Date() });
}

async function translateAllOffices() {
  console.log('\n🚀 Translating ALL contact offices to zh');
  const client = initializeTranslationClient();
  const offices = await ContactOffice.find({}).sort({ region_order: 1, office_order: 1 });
  let success = 0, failed = 0;
  for (const o of offices) {
    try {
      await translateOfficeDoc(client, o);
      success++;
      await new Promise(r => setTimeout(r, 150));
    } catch (_) { failed++; }
  }
  console.log(`\n📊 Offices zh: success=${success}, failed=${failed}, total=${offices.length}`);
}

async function verifyAllOffices() {
  const offices = await ContactOffice.find({}).sort({ region_order: 1, office_order: 1 });
  let withZh = 0, missing = 0;
  for (const o of offices) {
    const fresh = await ContactOffice.findById(o._id);
    const tr = fresh.translations && fresh.translations.get ? fresh.translations.get(TARGET_LANGUAGE) : (fresh.translations || {})[TARGET_LANGUAGE];
    if (tr && (tr.office_name || tr.address)) withZh++; else missing++;
  }
  console.log(`\n📊 Offices zh: withZh=${withZh}, missing=${missing}, total=${offices.length}`);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  try {
    await connectDB();
    switch (cmd) {
      case 'all':
        await translateAllOffices();
        break;
      case 'verify-all':
        await verifyAllOffices();
        break;
      default:
        console.log('Usage:');
        console.log('  node translate-add-chinese-offices.js all');
        console.log('  node translate-add-chinese-offices.js verify-all');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

if (require.main === module) {
  main().catch(err => { console.error('❌', err.message); process.exit(1); });
}

module.exports = { translateAllOffices, verifyAllOffices };


