'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

const PAGE_SLUG = 'testing';
const SECTION_ID = 'ultrasonic-testing';

const DATA = {
  service: 'Ultrasonic Testing (UT)',
  sections: [
    {
      heading: 'Ultrasonic Testing (UT)',
      content:
        'From CBM 360 TIV - Known as Condition Based Monitoring 360° Technical Industrial Verification – Deliver precise ultrasonic testing solutions for Mining and Metal Plants, Oil & Gas Facilities, FPSO/FSO Vessels, Industrial Plants, and Power & Utility Infrastructure.\n\nUltrasonic Testing (UT) uses high-frequency sound waves to detect internal flaws, measure thickness, and evaluate material properties. It is widely applied to ensure weld quality, detect cracks, corrosion, laminations, and inclusions.'
    },
    {
      heading: 'Why Choose UT from CBM 360 TIV?',
      content: [
        'Detects both surface and subsurface defects',
        'Provides accurate flaw depth and size measurements',
        'Non-hazardous and portable for on-site inspections',
        'Thickness gauging for corrosion monitoring',
        'Applicable to a wide range of materials and geometries'
      ]
    },
    {
      heading: 'Key Features and Benefits of Conventional UT:',
      content: [
        'Accurate detection of internal discontinuities',
        'Capable of sizing flaws and determining depth',
        'Immediate results during inspection',
        'Minimal surface preparation required',
        'Non-hazardous and safe for operators',
        'Portable equipment suitable for field inspections'
      ]
    },
    {
      heading: 'UT Inspection Services Include:',
      content: [
        'Weld inspection for cracks, lack of fusion, porosity',
        'Thickness gauging for corrosion monitoring',
        'Lamination checks in plates and forgings',
        'Detection of inclusions and voids in castings',
        'Inspection of composite materials',
        'In-service inspection of pressure vessels, storage tanks, pipelines'
      ]
    },
    {
      heading: 'Trusted UT by Industry Experts',
      content:
        'CBM 360 TIV\'s certified inspectors use advanced UT equipment and techniques including straight-beam, angle-beam, and immersion testing, delivering reliable inspection results with detailed reporting.'
    },
    {
      heading: 'Applications Across Industries',
      content: [
        'Mining & Metals – Crushers, pipelines, and weld integrity',
        'Industrial Plants – Boilers, pressure vessels, reactors',
        'Oil & Gas – Subsea structures, risers, storage tanks',
        'FPSO/FSO Vessels – Hull integrity, cargo tanks',
        'Power & Utilities – Turbine blades, boiler tubes, pipelines'
      ]
    },
    {
      heading: 'Standards We Follow:',
      content: [
        'ASNT SNT-TC-1A – Personnel qualification and certification',
        'ISO 16810 – General principles of ultrasonic testing',
        'ISO 17640 – Ultrasonic testing of welds',
        'ASME BPVC Section V – UT methods'
      ]
    },
    {
      heading: 'Ready to Inspect with UT?',
      content:
        'Trust CBM 360 TIV\'s Ultrasonic Testing services to enhance your asset integrity, reliability, and compliance.\n\nContact CBM 360 TIV today to schedule an ultrasonic inspection.'
    }
  ]
};

function toMarkdown(data) {
  const lines = [];
  lines.push(`# ${data.service}`);
  for (const section of data.sections) {
    if (section.heading) lines.push(`\n## ${section.heading}`);
    if (Array.isArray(section.content)) {
      for (const bullet of section.content) {
        lines.push(`- ${bullet}`);
      }
    } else if (typeof section.content === 'string') {
      lines.push(section.content);
    }
  }
  return lines.join('\n\n');
}

async function ensurePage() {
  let page = await Page.findOne({ slug: PAGE_SLUG });
  if (!page) {
    page = await Page.create({ title: 'Testing & Inspection', slug: PAGE_SLUG, language: 'en', isActive: true });
  }
  return page;
}

async function upsertSection() {
  await ensurePage();
  const existing = await Section.findOne({ sectionId: SECTION_ID, language: 'en' });
  const update = {
    title: DATA.service,
    bodyText: toMarkdown(DATA),
    page: PAGE_SLUG,
    isActive: true
  };
  if (existing) {
    await Section.updateOne({ _id: existing._id }, { $set: update });
    return existing._id;
  }
  const created = await Section.create({ ...update, sectionId: SECTION_ID, language: 'en' });
  return created._id;
}

async function linkSectionToPage(sectionId) {
  const page = await Page.findOne({ slug: PAGE_SLUG }).populate('sections');
  const already = (page.sections || []).some((s) => String(s._id) === String(sectionId));
  if (!already) {
    page.sections = [...(page.sections || []).map((s) => s._id), sectionId];
    await page.save();
  }
}

async function main() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');
  try {
    const sectionId = await upsertSection();
    await linkSectionToPage(sectionId);
    console.log('✅ Ultrasonic testing section upserted');
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
