'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

const PAGE_SLUG = 'testing';
const SECTION_ID = 'magnetic-particle-testing';

const DATA = {
  service: 'Magnetic Particle Testing (MT) & Fluorescent Magnetic Particle Testing (FMPT)',
  sections: [
    {
      heading: 'Magnetic Particle Testing & Fluorescent Magnetic Particle Testing',
      content:
        'CBM 360 TIV provides Magnetic Particle Testing (MT) and Fluorescent Magnetic Particle Testing (FMPT) solutions to identify surface and near-surface discontinuities in ferromagnetic materials. These methods are widely applied to ensure safety, reliability, and compliance across critical industries.'
    },
    {
      heading: 'Why Choose MT & FMPT from CBM 360 TIV?',
      content: [
        'Highly effective in detecting cracks, seams, laps, and other discontinuities on or near the surface',
        'Fluorescent MT provides enhanced visibility under UV light for more accurate detection',
        'Quick and cost-effective technique for ferromagnetic components',
        'Applicable to complex shapes and geometries',
        'Supports compliance with global standards and codes'
      ]
    },
    {
      heading: 'Expert Magnetic Particle Inspection by Certified Professionals',
      content:
        'CBM 360 TIV employs Level II and III MT/FMPT certified professionals who deliver accurate flaw detection and precise evaluations. Our experts ensure compliance with ASME, ASTM, and ISO standards while supporting shutdown inspections, routine maintenance, and asset integrity programs.'
    },
    {
      heading: 'Global Experience Across Multiple Industries',
      content: [
        'Mining and Metal Industries – Structural welds, heavy machinery, and castings',
        'Oil & Gas (Onshore/Offshore) – Pipelines, pressure vessels, storage tanks, and drilling equipment',
        'Power Generation – Turbine components, generator shafts, and boiler parts',
        'Shipbuilding & Marine – Hull structures, deck equipment, and critical welds',
        'Aerospace & Manufacturing – Landing gear, fasteners, and safety-critical components'
      ]
    },
    {
      heading: 'Our MT/FMPT Services Include:',
      content: [
        'Surface preparation of test components',
        'Application of magnetic field and detection media (dry powder or wet fluorescent)',
        'Inspection under visible or UV light conditions',
        'Recording and classification of detected indications',
        'Defect mapping with photographic evidence',
        'Comprehensive inspection reporting'
      ]
    },
    {
      heading: 'Standards & Certification',
      content: [
        'ASME BPVC Section V, Article 7 – MT procedures',
        'ASTM E1444 / ASTM E709 – Standard practices for Magnetic Particle Testing',
        'EN ISO 9934 series – Non-destructive testing – Magnetic Particle Testing',
        'ISO 3059 – Non-destructive testing – MT – Viewing conditions',
        'EN ISO 9712 / ASNT SNT-TC-1A / NAS 410 – Personnel qualification & certification'
      ]
    },
    {
      heading: 'Ready to Detect Surface and Sub-Surface Defects?',
      content:
        'CBM 360 TIV\'s MT and FMPT solutions ensure accurate detection of surface and near-surface flaws, safeguarding your components and systems against critical failures. Contact us today to plan your magnetic testing inspection campaign.'
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
    console.log('✅ Magnetic Particle Testing section upserted');
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
