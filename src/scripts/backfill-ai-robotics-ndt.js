'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = "mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster" || 'mongodb://localhost:27017/cbm';

const PAGE_SLUG = 'about';
const SECTION_ID = 'about-main';

const DATA = {
  about: 'CBM 360 TIV – Global Leader in Testing, Inspection & Verification',
  sections: [
    {
      heading: 'CBM 360 TIV – Global Leader in Testing, Inspection & Verification',
      content: 'Founded in 1992 in the United Kingdom, CBM 360 TIV has grown into a trusted global partner in Testing, Inspection, Certification, Condition-Based Monitoring, and Verification services. With regional headquarters in Dubai (Middle East & Africa), Hong Kong (Asia), and Brazil (North & South America), we support industries across 72 countries, driven by a commitment to safety, quality, and sustainability.'
    },
    {
      heading: 'Global Team & Network',
      content: 'Our team of 7,000 professionals, backed by a network of 23 advanced laboratories and 72 branch offices worldwide, works closely with clients to enhance operational performance, extend asset life, and ensure compliance with international standards and regulations.'
    },
    {
      heading: 'Industry Coverage',
      content: 'At CBM 360 TIV, we go beyond compliance — delivering innovative solutions that address the evolving challenges of industries including Oil & Gas (Onshore/Offshore), Mining, Power Generation, Petrochemicals, Manufacturing, Marine, and Infrastructure Development.'
    },
    {
      heading: 'Our Brand Values',
      content: 'Our brand is built on trust, integrity, and technical excellence. By combining global expertise with local presence, we help organizations achieve the highest standards of quality, safety, environmental protection, and social responsibility.'
    },
    {
      heading: 'Tagline',
      content: 'CBM 360 TIV – Ensuring Reliability. Driving Innovation. Building Confidence.'
    }
  ]
};

function generateSectionId(title) {
  return (title || '')
    .replace(/\(.*?\)/g, '')
    .replace(/&/g, ' and ')
    .replace(/[\/,]/g, ' ')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

function toMarkdown(data) {
  const lines = [];
  if (data.about) lines.push(`# ${data.about}`);
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
    page = await Page.create({
      title: 'About',
      description: DATA.about,
      slug: PAGE_SLUG,
      language: 'en',
      isActive: true
    });
  }
  return page;
}

async function upsertMainSection() {
  await ensurePage();
  const existing = await Section.findOne({ sectionId: SECTION_ID, language: 'en' });
  const update = {
    title: DATA.about,
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
    const args = process.argv.slice(2);
    if (args.includes('clear')) {
      const page = await Page.findOne({ slug: PAGE_SLUG });
      await Section.deleteMany({ page: PAGE_SLUG });
      if (page) {
        await Page.deleteOne({ _id: page._id });
      }
      console.log('🗑️ Deleted about page and its sections');
    } else {
      const sectionId = await upsertMainSection();
      await linkSectionToPage(sectionId);
      console.log('✅ About page updated with main section');
    }
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
