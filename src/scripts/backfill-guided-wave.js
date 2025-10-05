'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

const PAGE_SLUG = 'testing';
const SECTION_ID = 'guided-wave-lrut';

const DATA = {
  service: 'Guided Wave Ultrasonic Testing (GWUT) / Long Range Ultrasonic Testing (LRUT)',
  sections: [
    {
      heading: 'Guided Wave Ultrasonic Testing (GWUT) / Long Range Ultrasonic Testing (LRUT)',
      content:
        'From CBM 360 TIV - Known as Condition Based Monitoring 360° Technical Industrial Verification – Deliver long-range ultrasonic inspection solutions for Mining and Metal Plants, Oil & Gas Facilities, FPSO/FSO Vessels, Industrial Plants, and Power & Utility Infrastructure.\n\nGuided Wave Ultrasonic Testing (GWUT), also known as Long Range Ultrasonic Testing (LRUT), uses low-frequency ultrasonic waves that travel along the length of a pipe or structure to detect corrosion, wall thinning, and other defects over long distances from a single inspection point.'
    },
    {
      heading: 'Why Choose GWUT/LRUT from CBM 360 TIV?',
      content: [
        'Covers up to 100 meters of pipe in a single test',
        'Minimizes the need for insulation or coating removal',
        'Detects corrosion under insulation (CUI), wall loss, and cracks',
        'Non-intrusive inspection with minimal surface preparation',
        'Cost-effective for screening large pipeline networks'
      ]
    },
    {
      heading: 'Key Features and Benefits of GWUT/LRUT:',
      content: [
        'Rapid screening of long lengths of pipelines',
        'Inspection possible on buried, insulated, or coated pipelines',
        'Detects both internal and external wall loss',
        'Reduces inspection costs by limiting excavation and insulation removal',
        'Provides quantitative data for integrity management programs',
        'Enhances safety by reducing exposure to hazardous areas'
      ]
    },
    {
      heading: 'GWUT/LRUT Inspection Services Include:',
      content: [
        'Screening of aboveground and underground pipelines',
        'Detection of corrosion under insulation (CUI)',
        'Inspection of risers, road crossings, and cased crossings',
        'Screening inaccessible or hazardous pipelines',
        'Baseline inspection for new pipelines',
        'Integrity assessment for aging pipeline systems'
      ]
    },
    {
      heading: 'We Can Help You With:',
      content: [
        'Pipeline corrosion screening under insulation, coatings, and at road crossings',
        'Inspection of inaccessible areas such as risers, jetty lines, and subsea pipelines',
        'Reducing excavation costs by targeting only suspect areas',
        'Providing baseline condition data for pipeline integrity programs',
        'Supporting life-extension studies for critical pipelines'
      ]
    },
    {
      heading: 'Trusted GWUT/LRUT by Industry Experts',
      content:
        'CBM 360 TIV\'s certified inspectors utilize state-of-the-art GWUT/LRUT systems with advanced data analysis software to provide accurate detection of wall loss and defects, supporting predictive maintenance and integrity management.'
    },
    {
      heading: 'Applications Across Industries',
      content: [
        'Mining & Metals – Slurry pipelines, transfer lines, and buried piping',
        'Industrial Plants – Process pipelines, storage tank piping, road crossings',
        'Oil & Gas – Subsea pipelines, offshore risers, and insulated pipelines',
        'FPSO/FSO Vessels – Cargo lines, deck piping, and subsea risers',
        'Power & Utilities – Steam lines, buried high-energy piping systems'
      ]
    },
    {
      heading: 'Global Experience in All Major Sectors',
      content: [
        'Mining & Metal Facilities – Slurry lines, tailings pipelines, remote conveyor piping',
        'Industrial Manufacturing & Process Plants – Steam lines, chemical delivery pipes',
        'Onshore/Offshore Oil & Gas Facilities – Insulated flowlines, risers, subsea tie-ins',
        'FPSO & FSO Vessels – Deck piping, cargo offloading lines, ballast systems',
        'Power & Utility Plants – Condensate lines, superheated steam lines, buried pipelines'
      ]
    },
    {
      heading: 'Our GWUT Services Include:',
      content: [
        'Selection of test collars and rings for various pipe diameters',
        'Signal interpretation by qualified GWUT analysts',
        'Identification of potential corrosion anomalies or weld defects',
        'Reporting with location, amplitude, and severity classification',
        'Follow-up inspection recommendations for localized areas'
      ]
    },
    {
      heading: 'Standards We Follow:',
      content: [
        'ASNT SNT-TC-1A – Personnel qualification and certification',
        'ISO 18211 – Long-range ultrasonic testing (LRUT) of pipelines',
        'ASME BPVC Section V – Ultrasonic examination',
        'API 570 – Piping inspection code'
      ]
    },
    {
      heading: 'Ready to Inspect with GWUT/LRUT?',
      content:
        'Trust CBM 360 TIV\'s Guided Wave / Long Range Ultrasonic Testing services to deliver efficient, safe, and reliable pipeline inspection solutions.\n\nContact CBM 360 TIV today to schedule a GWUT/LRUT inspection.'
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
    console.log('✅ Guided Wave Ultrasonic Testing section upserted');
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
