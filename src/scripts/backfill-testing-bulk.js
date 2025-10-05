'use strict';

// Bulk backfill for Testing services.
// Usage:
//   node src/scripts/backfill-testing-bulk.js path/to/data.json
// If no path is provided, it looks for src/scripts/testing-bulk.json

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';
const PAGE_SLUG = 'testing';

// Map human-friendly service names to route slugs used on the frontend
const NAME_TO_SLUG = {
  'Visual Testing (VT)': 'visual-testing',
  'Borescope Inspection': 'borescope-inspection',
  'Drone Inspection': 'drone-inspection',
  'Ultrasonic Testing (UT)': 'ultrasonic-testing',
  'Phased Array Ultrasonic Testing (PAUT)': 'phased-array-ut',
  'Guided Wave Ultrasonic Testing (GWUT / LRUT)': 'guided-wave-lrut',
  'Time of Flight Diffraction (TOFD)': 'time-of-flight-diffraction',
  'Radiographic Testing (RT)': 'radiographic-testing'
};

// Already migrated sections – will be skipped
const SKIP_SECTION_IDS = new Set(['borescope-inspection', 'drone-inspection']);

function kebabCase(str) {
  return String(str)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function resolveSectionId(serviceName){
  return NAME_TO_SLUG[serviceName] || kebabCase(serviceName);
}

function toMarkdown(service) {
  const lines = [];
  if (service.service) lines.push(`# ${service.service}`);
  for (const section of service.sections || []) {
    if (section.heading) lines.push(`\n## ${section.heading}`);
    if (Array.isArray(section.content)) {
      for (const bullet of section.content) lines.push(`- ${bullet}`);
    } else if (typeof section.content === 'string') {
      lines.push(section.content);
    }
  }
  return lines.join('\n\n');
}

async function ensureTestingPage() {
  let page = await Page.findOne({ slug: PAGE_SLUG });
  if (!page) {
    page = await Page.create({ title: 'Testing & Inspection', slug: PAGE_SLUG, language: 'en', isActive: true });
    console.log(`✅ Created page '${PAGE_SLUG}'`);
  }
  return page;
}

async function upsertService(service) {
  const sectionId = resolveSectionId(service.service);
  if (SKIP_SECTION_IDS.has(sectionId)) {
    console.log(`⏭️  Skipping ${service.service} (${sectionId}) – already migrated`);
    return null;
  }

  const bodyText = toMarkdown(service);
  const title = service.service;
  const existing = await Section.findOne({ sectionId, language: 'en' });
  const update = { title, bodyText, page: PAGE_SLUG, isActive: true };
  if (existing) {
    await Section.updateOne({ _id: existing._id }, { $set: update });
    console.log(`🔄 Updated ${sectionId}`);
    return existing._id;
  }
  const created = await Section.create({ ...update, sectionId, language: 'en' });
  console.log(`✅ Created ${sectionId}`);
  return created._id;
}

async function linkSection(sectionObjectId) {
  if (!sectionObjectId) return;
  const page = await Page.findOne({ slug: PAGE_SLUG }).populate('sections');
  const already = (page.sections || []).some((s) => String(s._id) === String(sectionObjectId));
  if (!already) {
    page.sections = [...(page.sections || []).map((s) => s._id), sectionObjectId];
    await page.save();
    console.log('🔗 Linked to page');
  }
}

async function main() {
  const inputPathArg = process.argv[2] || path.join(__dirname, 'testing-bulk.json');
  const absolutePath = path.isAbsolute(inputPathArg) ? inputPathArg : path.join(process.cwd(), inputPathArg);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Data file not found: ${absolutePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(absolutePath, 'utf8');
  let data;
  try { data = JSON.parse(raw); } catch (e) { console.error('❌ Invalid JSON:', e.message); process.exit(1); }
  if (!Array.isArray(data)) { console.error('❌ Expected an array of services'); process.exit(1); }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');
  try {
    await ensureTestingPage();
    for (const svc of data) {
      try {
        const id = await upsertService(svc);
        await linkSection(id);
      } catch (e) {
        console.error(`❌ Failed for service '${svc.service}':`, e.message);
      }
    }
    console.log('🏁 Bulk update completed');
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };


