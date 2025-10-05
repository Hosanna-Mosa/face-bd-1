'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

const PAGE_SLUG = 'testing';
const SECTION_ID = 'radiographic-testing';

const DATA = {
  service: 'Radiographic Testing (RT)',
  sections: [
    {
      heading: 'Radiographic Testing (RT)',
      content:
        'From CBM 360 TIV - Known as Condition Based Monitoring 360° Technical Industrial Verification – Deliver precise radiographic testing services for Mining and Metal Plants, Oil & Gas Facilities, FPSO/FSO Vessels, Industrial Plants, and Power & Utility Infrastructure.\n\nRadiographic Testing (RT) uses X-rays or gamma rays to produce images of the internal structure of materials, welds, and components. It reveals volumetric flaws such as porosity, inclusions, cracks, and lack of fusion, ensuring the integrity of critical assets.'
    },
    {
      heading: 'Why Choose RT from CBM 360 TIV?',
      content: [
        'Detects both surface and subsurface volumetric defects',
        'Provides permanent inspection records through radiographic film or digital images',
        'Capable of inspecting a wide range of materials and thicknesses',
        'Highly reliable for weld quality assessment',
        'Non-destructive and widely accepted by industry codes and standards'
      ]
    },
    {
      heading: 'Key Features and Benefits of RT:',
      content: [
        'Visual representation of internal defects',
        'Permanent record for quality assurance and audits',
        'Detects porosity, inclusions, cracks, and incomplete penetration',
        'Applicable to ferrous and non-ferrous materials',
        'Digital RT improves speed and reduces radiation exposure',
        'Supports compliance with international codes'
      ]
    },
    {
      heading: 'RT Inspection Services Include:',
      content: [
        'Conventional film-based radiography',
        'Digital radiography (DR) for faster results and lower exposure',
        'Gamma radiography using isotopes (Ir-192, Co-60)',
        'X-ray radiography for welds and castings',
        'Pipeline girth weld inspection',
        'Casting and forging inspection'
      ]
    },
    {
      heading: 'We Can Help You With:',
      content: [
        'Ensuring weld integrity in pipelines, boilers, and pressure vessels',
        'Detecting porosity and inclusions in castings',
        'Assessing internal quality of forgings and composite materials',
        'Providing radiographic evidence for regulatory compliance',
        'Supporting manufacturing quality control and in-service inspections'
      ]
    },
    {
      heading: 'Trusted RT by Industry Experts',
      content:
        'CBM 360 TIV\'s certified radiographers utilize advanced X-ray and gamma-ray systems, ensuring safe, efficient, and compliant inspections. Our RT services deliver high-quality radiographs with detailed interpretation reports.'
    },
    {
      heading: 'Applications Across Industries',
      content: [
        'Mining & Metals – Welded joints, crushers, and heavy equipment components',
        'Industrial Plants – Boilers, heat exchangers, reactors',
        'Oil & Gas – Pipelines, storage tanks, offshore structures',
        'FPSO/FSO Vessels – Cargo tanks, structural welds, risers',
        'Power & Utilities – Turbine components, boiler tubes, high-pressure systems'
      ]
    },
    {
      heading: 'Global Experience in All Major Sectors',
      content: [
        'Mining & Metal Facilities – Weld inspections, conveyor structures, slurry pipelines',
        'Industrial Manufacturing & Process Plants – Reactor vessels, pressure piping',
        'Onshore/Offshore Oil & Gas Facilities – Subsea welds, risers, and flowlines',
        'FPSO & FSO Vessels – Hull welds, storage tanks, deck piping',
        'Power & Utility Plants – Steam piping, turbine housings, boiler welds'
      ]
    },
    {
      heading: 'Our RT Services Include:',
      content: [
        'Film radiography for detailed defect detection',
        'Digital radiography (DR) for real-time inspection',
        'Isotope-based gamma radiography for field use',
        'X-ray inspection for critical welds and materials',
        'Image interpretation and reporting by certified experts',
        'Archiving and traceability for regulatory compliance'
      ]
    },
    {
      heading: 'Standards We Follow:',
      content: [
        'ASNT SNT-TC-1A – Personnel qualification and certification',
        'ISO 17636 – Radiographic testing of welds',
        'ASTM E1742 – Radiographic examination',
        'ASME BPVC Section V – RT methods',
        'API 1104 – Welding of pipelines and related facilities'
      ]
    },
    {
      heading: 'Ready to Inspect with RT?',
      content:
        'Trust CBM 360 TIV\'s Radiographic Testing services to provide accurate, reliable, and standards-compliant inspection results.\n\nContact CBM 360 TIV today to schedule a radiographic inspection.'
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
    console.log('✅ Radiographic Testing section upserted');
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
