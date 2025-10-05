'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');

const MONGODB_URI = 'mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster' || 'mongodb://localhost:27017/cbm';

// Paths to frontend data files containing slug and image pairs
const FRONTEND_DATA_DIR = path.join(__dirname, '../../..', 'frontend', 'src', 'data');
const FILES = [
  { file: 'testing.ts', page: 'testing' },
  { file: 'inspection.ts', page: 'inspection' },
  { file: 'auditing.ts', page: 'auditing' },
  { file: 'verification-certification.ts', page: 'verification-certification' },
  { file: 'cbm.ts', page: 'cbm' },
  { file: 'innovation-rd.ts', page: 'innovation-rd' },
];

function extractSlugImagePairs(fileContent) {
  const pairs = [];
  // Match objects with slug: '...', ... image: '...'
  const objectRegex = /\{[\s\S]*?slug:\s*'([^']+)'[\s\S]*?image:\s*'([^']+)'[\s\S]*?\}/g;
  let match;
  while ((match = objectRegex.exec(fileContent)) !== null) {
    const slug = match[1];
    const image = match[2];
    if (slug && image) {
      pairs.push({ slug, image });
    }
  }
  return pairs;
}

async function backfill() {
  const results = [];
  for (const { file } of FILES) {
    const fullPath = path.join(FRONTEND_DATA_DIR, file);
    if (!fs.existsSync(fullPath)) {
      results.push({ file, status: 'skipped', reason: 'file not found' });
      continue;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const pairs = extractSlugImagePairs(content);
    let updated = 0;
    for (const { slug, image } of pairs) {
      const res = await Section.updateMany({ sectionId: slug }, { $set: { coverPhoto: image } });
      updated += res.modifiedCount || 0;
    }
    results.push({ file, itemsParsed: pairs.length, updated });
  }
  return results;
}

async function main() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');
  try {
    const results = await backfill();
    console.table(results);
  } catch (err) {
    console.error('❌ Backfill failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, extractSlugImagePairs };


