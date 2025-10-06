'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

const PAGE_SLUG = 'testing';
const SECTION_ID = 'liquid-penetrant-testing';

const DATA = {
  service: 'Liquid Penetrant Testing (PT)',
  sections: [
    {
      heading: 'Liquid Penetrant Testing (PT)',
      content:
        'From CBM 360 TIV - Known as Condition Based Monitoring 360° Technical Industrial Verification – Deliver precise liquid penetrant testing services for Mining and Metal Plants, Oil & Gas Facilities, FPSO/FSO Vessels, Industrial Plants, and Power & Utility Infrastructure.\n\nLiquid Penetrant Testing (PT) is a widely used non-destructive testing method that detects surface-breaking defects in non-porous materials. It uses capillary action to draw penetrant into surface discontinuities, making them visible for inspection.'
    },
    {
      heading: 'Why Choose PT from CBM 360 TIV?',
      content: [
        'Detects surface-breaking defects in non-porous materials',
        'Simple and cost-effective inspection method',
        'Applicable to a wide range of materials and geometries',
        'Portable and suitable for field inspections',
        'Provides immediate visual results',
        'Non-hazardous and environmentally friendly'
      ]
    },
    {
      heading: 'Key Features and Benefits of PT:',
      content: [
        'High sensitivity to surface discontinuities',
        'Can detect very fine cracks and defects',
        'Applicable to complex geometries',
        'Relatively simple equipment requirements',
        'Cost-effective for large surface areas',
        'Immediate visual indication of defects'
      ]
    },
    {
      heading: 'Our PT Inspection Services Include:',
      content: [
        'Pre-cleaning of components',
        'Application of dye penetrant (visible or fluorescent)',
        'Dwell time monitoring based on material/defect type',
        'Excess penetrant removal (water-washable or solvent-based)',
        'Application of developer for indication bleed-out',
        'Visual examination under white or UV light',
        'Classification and recording of indications',
        'Defect mapping and photographic reporting'
      ]
    },
    {
      heading: 'We Can Help You With:',
      content: [
        'Detecting surface cracks in welds and castings',
        'Identifying porosity and lack of fusion in materials',
        'Inspecting critical components for surface defects',
        'Quality control during manufacturing processes',
        'In-service inspection of equipment and structures'
      ]
    },
    {
      heading: 'Trusted PT by Industry Experts',
      content:
        'CBM 360 TIV\'s certified PT technicians utilize advanced penetrant systems and proper procedures to ensure accurate defect detection. Our PT services deliver reliable results with detailed reporting and documentation.'
    },
    {
      heading: 'Applications Across Industries',
      content: [
        'Mining & Metals – Weld inspection, casting quality assessment',
        'Industrial Plants – Pressure vessels, heat exchangers, piping',
        'Oil & Gas – Pipeline welds, storage tanks, offshore structures',
        'FPSO/FSO Vessels – Hull welds, deck structures, cargo tanks',
        'Power & Utilities – Turbine components, boiler welds, high-pressure systems'
      ]
    },
    {
      heading: 'Standards & Certification',
      content: [
        'ASME BPVC Section V Article 6 – PT procedures and acceptance',
        'ASTM E165 / ASTM E1417 – Standard practices for PT',
        'ISO 3452 Series – Non-destructive testing — PT methods',
        'EN ISO 9712 / ASNT SNT-TC-1A / NAS 410 – Personnel qualification & certification',
        'API 510 / 570 / 653, AWS D1.1, project-specific specifications'
      ]
    },
    {
      heading: 'Ready to Ensure Surface Integrity?',
      content:
        'CBM 360 TIV offers rapid mobilization and full documentation for all Liquid Penetrant Testing activities worldwide. Contact us today to schedule your inspection campaign and secure the reliability of your critical components.'
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
    console.log('✅ Liquid Penetrant Testing section upserted');
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
