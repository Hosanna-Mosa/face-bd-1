/**
 * Add Chinese (zh) translations for Careers
 *
 * Usage:
 *   node src/scripts/translate-add-chinese-careers.js all
 *   node src/scripts/translate-add-chinese-careers.js verify-all
 */

const mongoose = require('mongoose');
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

const Career = require('../models/Career');

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

async function translateCareerDoc(client, c) {
  const translated = {
    title: await t(client, c.title),
    description: await t(client, c.description),
    department: await t(client, c.department),
    location: await t(client, c.location),
    type: await t(client, c.type),
    level: await t(client, c.level),
    workArrangement: await t(client, c.workArrangement),
    responsibilities: Array.isArray(c.responsibilities) ? await Promise.all(c.responsibilities.map(x => t(client, x))) : [],
    requirements: Array.isArray(c.requirements) ? await Promise.all(c.requirements.map(x => t(client, x))) : [],
    benefits: Array.isArray(c.benefits) ? await Promise.all(c.benefits.map(x => t(client, x))) : [],
    tags: Array.isArray(c.tags) ? await Promise.all(c.tags.map(x => t(client, x))) : [],
  };
  await Career.findByIdAndUpdate(c._id, { $set: { [`translations.${TARGET_LANGUAGE}`]: translated }, updatedAt: new Date() });
}

async function translateAllCareers() {
  console.log('\n🚀 Translating ALL careers to zh');
  const client = initializeTranslationClient();
  const careers = await Career.find({ isActive: true }).sort({ postedAt: -1 });
  let success = 0, failed = 0;
  for (const c of careers) {
    try {
      await translateCareerDoc(client, c);
      success++;
      await new Promise(r => setTimeout(r, 200));
    } catch (_) { failed++; }
  }
  console.log(`\n📊 Careers zh: success=${success}, failed=${failed}, total=${careers.length}`);
}

async function verifyAllCareers() {
  const careers = await Career.find({ isActive: true }).sort({ postedAt: -1 });
  let withZh = 0, missing = 0;
  for (const c of careers) {
    const fresh = await Career.findById(c._id);
    const tr = fresh.translations && fresh.translations.get ? fresh.translations.get(TARGET_LANGUAGE) : (fresh.translations || {})[TARGET_LANGUAGE];
    if (tr && (tr.title || tr.description)) withZh++; else missing++;
  }
  console.log(`\n📊 Careers zh: withZh=${withZh}, missing=${missing}, total=${careers.length}`);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  try {
    await connectDB();
    switch (cmd) {
      case 'all':
        await translateAllCareers();
        break;
      case 'verify-all':
        await verifyAllCareers();
        break;
      default:
        console.log('Usage:');
        console.log('  node translate-add-chinese-careers.js all');
        console.log('  node translate-add-chinese-careers.js verify-all');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

if (require.main === module) {
  main().catch(err => { console.error('❌', err.message); process.exit(1); });
}

module.exports = { translateAllCareers, verifyAllCareers };


