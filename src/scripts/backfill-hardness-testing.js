'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

const PAGE_SLUG = 'testing';
const SECTION_ID = 'hardness-testing';

const DATA = {
  service: 'Hardness Testing Services',
  sections: [
    {
      heading: 'Hardness Testing Services',
      content:
        'CBM 360 TIV provides advanced Hardness Testing services to evaluate the mechanical strength and durability of materials and components. Our testing solutions ensure compliance with global standards and help prevent failures by verifying that materials meet required hardness specifications.'
    },
    {
      heading: 'Why Choose Hardness Testing from CBM 360 TIV?',
      content: [
        'Accurate and repeatable measurement of material hardness',
        'Wide range of portable and laboratory-based testing methods',
        'Ensures compliance with ASTM, ISO, and other international standards',
        'Ideal for metals, alloys, welds, heat-treated materials, and coatings',
        'Supports quality assurance, failure analysis, and asset integrity programs'
      ]
    },
    {
      heading: 'Global Support Across All Industries',
      content: [
        'Oil & Gas – Testing pipelines, pressure vessels, and drilling equipment',
        'Mining & Metals – Ensuring hardness consistency in castings and structural parts',
        'Power Generation – Turbines, shafts, and boiler components',
        'Aerospace & Automotive – Heat-treated alloys, gears, and fasteners',
        'Manufacturing – Welds, forgings, and fabricated parts'
      ]
    },
    {
      heading: 'Our Hardness Testing Services Include:',
      content: [
        'Brinell Hardness Testing (BHN) – Suitable for coarse or uneven surfaces',
        'Rockwell Hardness Testing (HRB/HRC) – Quick and widely used for metals',
        'Vickers Hardness Testing (VHN) – High precision for thin materials and coatings',
        'Portable Hardness Testing – On-site measurements for large components and assets'
      ]
    },
    {
      heading: 'Expert Hardness Testing by Certified Professionals',
      content:
        'CBM 360 TIV employs certified inspectors trained in multiple hardness testing techniques. Our team ensures compliance with ASME, ASTM, and ISO standards, delivering reliable results to support your operational needs.'
    },
    {
      heading: 'Standards & Certification',
      content: [
        'ASTM E10 – Standard Test Method for Brinell Hardness',
        'ASTM E18 – Standard Test Method for Rockwell Hardness',
        'ASTM E92 – Standard Test Method for Vickers Hardness',
        'ISO 6506 / 6507 / 6508 – International standards for hardness testing',
        'ASME Section V – Nondestructive Examination requirements'
      ]
    },
    {
      heading: 'Ready to Ensure Material Reliability?',
      content:
        'Trust CBM 360 TIV\'s Hardness Testing services to validate the durability and performance of your critical assets. Contact us today to schedule your inspection and ensure compliance with global standards.'
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
    console.log('✅ Hardness Testing Services section upserted');
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
