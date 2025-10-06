'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

const PAGE_SLUG = 'testing';
const SECTION_ID = 'eddy-current-testing';

const DATA = {
  service: 'Eddy Current Testing (ET)',
  sections: [
    {
      heading: 'Eddy Current Testing',
      content:
        'From CBM 360 TIV - Known as Condition Based Monitoring 360° Technical Industrial Verification – Ensure the integrity of conductive components with advanced Eddy Current Testing across Mining & Metal Plants, Oil & Gas Facilities, FPSO/FSO Vessels, Industrial Plants, and Power Utilities.\n\nEddy Current Testing (ET) is a highly sensitive electromagnetic NDT method used to detect surface and near-surface flaws in conductive materials. At CBM 360 TIV, we use this technology to inspect components without removing coatings or insulation, making it ideal for fast, cost-effective in-service inspection.'
    },
    {
      heading: 'Why Choose Eddy Current Testing from CBM 360 TIV?',
      content: [
        'Detect cracks, corrosion, and pitting in metal components without the need for surface preparation',
        'Evaluate coating thickness and conductivity changes',
        'Perform rapid scanning of complex geometries, including bolt holes and welds',
        'Access difficult-to-reach areas without disassembly',
        'Minimize downtime with non-intrusive, high-speed inspection',
        'Ensure compliance with industry-specific standards and regulatory requirements',
        'Receive digital signal output and analysis for immediate evaluation and reporting'
      ]
    },
    {
      heading: 'Trusted Eddy Current Testing by Certified Experts',
      content:
        'CBM 360 TIV provides Level II & III ET certified technicians with expertise in signal analysis, calibration, and real-time interpretation. Whether for routine asset management or shutdown inspections, our ET services deliver precision, speed, and confidence across sectors.'
    },
    {
      heading: 'Applications Across Key Industries',
      content: [
        'Mining and Metal Plants – Inspect structural beams, wire ropes, metal panels, and equipment like crushers and hoists for fatigue cracks and localized corrosion.',
        'Industrial Manufacturing & Processing Plants – Extensively to assess raw material integrity and in-process fabricated parts such as tubes, rods, and fasteners for inclusions, cracks, or laps.',
        'Oil & Gas Fields (Onshore/Offshore) and Chemical Facilities – Examine piping systems, exchangers, and heat exchanger tubes for wall thinning, corrosion under insulation (CUI), or fatigue cracking without stripping coatings.',
        'FPSO & FSO Vessels – Inspect hull welds, piping systems, and deck structures for stress corrosion cracking or pitting — including areas under non-conductive coatings.',
        'Power & Utilities (Hydro, Thermal, Coal, Geo Thermal, and Gas) – Detect stress corrosion cracking, flow-accelerated corrosion (FAC), or micro cracks in turbine blades, generator windings, and boiler tubes.'
      ]
    },
    {
      heading: 'Key Features and Benefits',
      content: [
        'High sensitivity to surface and near-surface defects in conductive materials',
        'No need for couplant – dry method, no contamination risk',
        'Effective through coatings and thin insulation layers',
        'Portable and fast scanning, ideal for field inspections',
        'Data logging and real-time digital defect imaging',
        'Compatible with tube inspection probes, pencil probes, and array probes'
      ]
    },
    {
      heading: 'Standards We Follow',
      content: [
        'ASTM E376 / ASTM E243 / ASTM E571 – Eddy current examination procedures',
        'ASME Section V, Article 8 – Eddy current method',
        'EN ISO 15548-1 / ISO 15549 – General principles for eddy current testing',
        'NADCAP / API / ASNT SNT-TC-1A / ISO 9712 / EN 4179 – Personnel qualifications and industry-specific compliance'
      ]
    },
    {
      heading: 'Ready to Detect Critical Flaws with Precision?',
      content:
        'Let our expert Eddy Current Testing (ET/ECT) services ensure your components are free from critical defects – protecting life, assets, and compliance.\n\nTo discuss how our ET/ECT services can support your inspection strategy, contact CBM 360 TIV today.'
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
    console.log('✅ Eddy Current Testing section upserted');
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
