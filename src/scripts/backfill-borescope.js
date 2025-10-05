'use strict';

// One-off backfill for Testing → Borescope Inspection only
// - Upserts a Section with sectionId 'borescope-inspection'
// - Sets page to 'testing' and bodyText to Markdown-like structured content

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Load models (relative to backend/src)
const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

// Canonical identifiers
const PAGE_SLUG = 'testing';
const SECTION_ID = 'borescope-inspection';

// Source content from user JSON → convert to Markdown-like text
const BORO_DATA = {
  service: 'Borescope Inspection',
  sections: [
    {
      heading: 'Borescope Inspection',
      content:
        'From CBM 360 TIV - Known as Condition Based Monitoring 360° Technical Industrial Verification –  Deliver precise internal visual inspections of critical components for Mining and Metal Plants, Oil & Gas Facilities, FPSO/FSO Vessels, Industrial Plants, and Power & Utility Infrastructure.\n\nBorescope inspection enables direct visual access to hard-to-reach internal areas such as pipes, turbines, engines, and pressure vessels without disassembly. CBM 360 TIV’s Borescope Inspection Services help detect internal defects, corrosion, deposits, and wear — ensuring asset integrity and minimizing costly downtime.'
    },
    {
      heading: 'Why Choose Borescope Inspection from CBM 360 TIV?',
      content: [
        'Inspect internal surfaces of pipes, boilers, engines, turbines, and vessels where direct visual access is impossible',
        'Identify corrosion, cracking, deposits, erosion, and foreign objects inside components',
        'Support preventive maintenance and condition monitoring by detecting early-stage internal defects',
        'Reduce downtime and costs by avoiding unnecessary disassembly and enabling targeted repairs',
        'Provide high-resolution imagery and detailed inspection reports for accurate assessment and documentation',
        'Comply with industry standards and client specifications for internal inspections'
      ]
    },
    {
      heading: 'Trusted Borescope Inspection by Industry Experts',
      content:
        'CBM 360 TIV deploys advanced video borescopes and fiberscopes operated by certified inspectors trained to assess internal component conditions accurately. Our services ensure comprehensive internal inspection and quality assurance — both on-site and offshore.'
    },
    {
      heading: 'Global Support Across All Industries',
      content: [
        'Mining and Metal Plants – Inspecting crushers, conveyors, slurry pipelines',
        'Industrial Manufacturing & Processing Plants – Reactors, pressure vessels, heat exchangers',
        'Oil & Gas Onshore/Offshore Facilities – Pipelines, risers, pressure vessels, compressors',
        'FPSO & FSO Vessels – Internal hull areas, ballast tanks, cargo tanks',
        'Power & Utilities (Hydro, Thermal, Coal, Gas, Geo Thermal) – Turbine blades, boiler tubes, generator internals'
      ]
    },
    {
      heading: 'Our Borescope Inspection Services Include:',
      content: [
        'Visual inspection of internal welds, corrosion, cracks, deposits, and mechanical wear',
        'Remote visual inspection using flexible and rigid borescopes with lighting and video recording',
        'Condition assessment for turbines, engines, compressors, and pipes',
        'Verification of cleanliness and internal surface condition prior to maintenance or repair',
        'Detailed photographic and video documentation with expert reporting'
      ]
    },
    {
      heading: 'Standards We Follow:',
      content: [
        'ASNT SNT-TC-1A – Personnel qualification and certification',
        'API 570, API 653, API 510 – Inspection of piping, tanks, and pressure vessels',
        'ISO 17637 – Visual testing including remote visual methods',
        'BS ISO 19232 – Industrial video borescope usage standards',
        'Project-specific OEM or EPC client inspection protocols'
      ]
    },
    {
      heading: 'Ready to Inspect Internal Assets?',
      content:
        'Trust CBM 360 TIV’s borescope inspection services to provide precise internal assessments that enhance asset reliability and safety while minimizing operational disruptions.\n\nTo learn how our Borescope Inspection Services can support your projects across mining, oil & gas, FPSO/FSO, and power sectors, contact CBM 360 TIV today.'
    }
  ]
};

function toMarkdown(data) {
  const lines = [];
  lines.push(`# ${data.service || 'Borescope Inspection'}`);
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

const BOROSCOPE_TITLE = BORO_DATA.service || 'Borescope Inspection';
const BOROSCOPE_MD = toMarkdown(BORO_DATA);

async function ensureTestingPage() {
  let page = await Page.findOne({ slug: PAGE_SLUG });
  if (!page) {
    page = await Page.create({
      title: 'Testing & Inspection',
      description: 'Testing & Inspection services',
      slug: PAGE_SLUG,
      language: 'en',
      isActive: true
    });
    // eslint-disable-next-line no-console
    console.log(`✅ Created page '${PAGE_SLUG}'`);
  }
  return page;
}

async function upsertBorescopeSection() {
  const page = await ensureTestingPage();

  const existing = await Section.findOne({ sectionId: SECTION_ID, language: 'en' });
  if (existing) {
    const update = {
      title: BOROSCOPE_TITLE,
      bodyText: BOROSCOPE_MD,
      page: PAGE_SLUG,
      isActive: true
    };
    await Section.updateOne({ _id: existing._id }, { $set: update });
    // eslint-disable-next-line no-console
    console.log('🔄 Updated existing borescope section');
    return existing._id;
  }

  const created = await Section.create({
    title: BOROSCOPE_TITLE,
    bodyText: BOROSCOPE_MD,
    images: [],
    language: 'en',
    pageNumber: 1,
    sectionId: SECTION_ID,
    page: PAGE_SLUG,
    isActive: true
  });
  // eslint-disable-next-line no-console
  console.log('✅ Created borescope section');
  return created._id;
}

async function linkSectionToPage(sectionId) {
  const page = await Page.findOne({ slug: PAGE_SLUG }).populate('sections');
  if (!page) return;

  const alreadyLinked = (page.sections || []).some((s) => String(s._id) === String(sectionId));
  if (alreadyLinked) {
    // eslint-disable-next-line no-console
    console.log('ℹ️ Section already linked to page');
    return;
  }

  page.sections = [...(page.sections || []).map((s) => s._id), sectionId];
  await page.save();
  // eslint-disable-next-line no-console
  console.log('🔗 Linked section to testing page');
}

async function main() {
  // eslint-disable-next-line no-console
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  // eslint-disable-next-line no-console
  console.log('✅ Connected');

  try {
    const sectionId = await upsertBorescopeSection();
    await linkSectionToPage(sectionId);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Backfill failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    // eslint-disable-next-line no-console
    console.log('🔌 Disconnected');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };


