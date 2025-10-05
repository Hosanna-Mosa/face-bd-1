
'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = "mongodb+srv://cbm360tiv_db_user:ghtVDlZZEZRwzGOW@cluster0.wizvkjv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || 'mongodb://localhost:27017/cbm';

const PAGE_SLUG = 'service';
const SECTION_ID = 'Recruitment & Selection';

const RECRUITMENT_SELECTION = {
  service: 'Recruitment & Selection',
  sections: [
    {
      heading: 'INSPECTORS 360 – Global Inspector Recruitment & Selection Services',
      content: 'At INSPECTORS 360 we specialize in providing highly qualified and experienced inspectors for the world\'s most demanding industries. Our recruitment and selection process ensures that every professional we place is equipped with the skills, certifications, and field experience to deliver exceptional inspection services, even in the most challenging environments.'
    },
    {
      heading: 'Our Approach',
      content: 'We understand that inspection is more than just compliance—it\'s about ensuring safety, reliability, and operational excellence. That\'s why we connect clients with inspectors who not only meet international standards but also have hands-on expertise with state-of-the-art working equipment.'
    },
    {
      heading: 'Industries We Serve',
      content: [
        'Oil & Gas – Onshore and Offshore',
        'FPSO / FSO Vessels',
        'Mining & Metals'
      ]
    },
    {
      heading: 'Inspection Roles We Provide',
      content: [
        'Import / Export Audit – Ensuring quality, compliance, and documentation for global trade.',
        'Asset Integrity Audit (Topside) – Evaluating structural, mechanical, and operational integrity for offshore and industrial assets.',
        'NDT/Mechanical Audit Inspectors – Assessing machinery, rotating equipment, and critical components for performance and safety.',
        'Welding Inspectors – Certified experts for weld quality control, testing, and compliance with global welding codes.',
        'Paint Inspectors – Coating and corrosion control specialists to ensure protective systems meet specifications.',
        'Electrical & Instrumentation Inspectors – Verifying electrical systems, instrumentation, and automation for reliability and safety.'
      ]
    },
    {
      heading: 'Why Choose INSPECTORS 360?',
      content: [
        'Global talent pool of certified inspectors.',
        'Experience across diverse industries and harsh environments.',
        'Commitment to safety, quality, and compliance.',
        'Fast and reliable recruitment process.'
      ]
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
    page = await Page.create({ title: 'CBM', slug: PAGE_SLUG, language: 'en', isActive: true });
  }
  return page;
}

async function upsertSection() {
  await ensurePage();
  const existing = await Section.findOne({ sectionId: SECTION_ID, language: 'en' });
  const update = {
    title: RECRUITMENT_SELECTION.service,
    bodyText: toMarkdown(RECRUITMENT_SELECTION),
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
    console.log(`✅ ${RECRUITMENT_SELECTION.service} section upserted`);
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


