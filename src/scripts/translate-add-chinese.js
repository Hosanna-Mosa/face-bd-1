/**
 * Add Chinese (zh) translations for Pages and Page Sections
 *
 * This script mirrors existing translation scripts but targets only Chinese.
 * It preserves existing translations and only adds/updates the 'zh' entry.
 *
 * Usage:
 *   node src/scripts/translate-add-chinese.js pages                # Translate all English pages (title/description) to zh
 *   node src/scripts/translate-add-chinese.js page <slug>         # Translate a single English page to zh
 *   node src/scripts/translate-add-chinese.js sections <slug>     # Translate all English sections of a page to zh
 *   node src/scripts/translate-add-chinese.js sections-all        # Translate all English sections across all pages to zh
 */

const mongoose = require('mongoose');
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

// Models
const Page = require('../models/Page');
const Section = require('../models/Section');

// Target language
const TARGET_LANGUAGE = 'zh';

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// Initialize Google Cloud Translation client (same pattern as existing scripts)
function initializeTranslationClient() {
  try {
    const config = {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-project-id',
    };

    if ('AIzaSyAWiR1KCKcclqjPUQrBxmTEFgjtV3cv5CY'||process.env.GOOGLE_CLOUD_API_KEY) {
        config.key = 'AIzaSyAWiR1KCKcclqjPUQrBxmTEFgjtV3cv5CY' || process.env.GOOGLE_CLOUD_API_KEY;
        console.log('✅ Using Google Cloud API Key for authentication');
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      config.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      console.log('✅ Using Google Cloud service account key file');
    } else if (process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
      config.credentials = {
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
      };
      console.log('✅ Using Google Cloud service account credentials');
    } else {
      throw new Error('No Google Cloud credentials found');
    }

    return new Translate(config);
  } catch (error) {
    console.error('❌ Error initializing Google Cloud Translation:', error.message);
    process.exit(1);
  }
}

async function translateText(translateClient, text, targetLanguage, sourceLanguage = 'en') {
  try {
    if (!text || text.trim() === '') return '';
    const [translation] = await translateClient.translate(text, {
      from: sourceLanguage,
      to: targetLanguage,
    });
    return translation;
  } catch (error) {
    console.error(`❌ Translation error (${sourceLanguage} → ${targetLanguage}):`, error.message);
    throw error;
  }
}

// --------------- Pages (title/description) ---------------

async function fetchEnglishPages() {
  const pages = await Page.find({ language: 'en', isActive: true }).sort({ pageNumber: 1, title: 1 });
  return pages;
}

async function fetchEnglishPage(slug) {
  const page = await Page.findOne({ slug, language: 'en', isActive: true });
  return page;
}

async function translatePageToZh(page, translateClient) {
  console.log(`\n🔄 Translating page to zh: "${page.title}"`);
  try {
    const translatedTitle = await translateText(translateClient, page.title, TARGET_LANGUAGE);
    const translatedDescription = await translateText(translateClient, page.description || '', TARGET_LANGUAGE);

    const merged = Object.assign({}, page.translations || {});
    merged[TARGET_LANGUAGE] = {
      title: translatedTitle,
      description: translatedDescription,
    };

    // Persist using atomic $set to avoid Map serialization issues
    const updatedPage = await Page.findByIdAndUpdate(
      page._id,
      { 
        $set: { [`translations.${TARGET_LANGUAGE}`]: merged[TARGET_LANGUAGE] },
        updatedAt: new Date() 
      },
      { new: true }
    );

    console.log(`   ✅ zh: "${translatedTitle}"`);
    await new Promise(r => setTimeout(r, 500));
    return updatedPage;
  } catch (error) {
    console.error('   ❌ Failed page zh translation:', error.message);
    throw error;
  }
}

async function translateAllPagesToZh() {
  console.log('\n🚀 Starting zh translation for all English pages');
  const translateClient = initializeTranslationClient();
  const pages = await fetchEnglishPages();
  if (pages.length === 0) {
    console.log('⚠️  No English pages found');
    return;
  }
  let success = 0, failed = 0;
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    console.log(`\n📋 Page ${i + 1}/${pages.length}: ${page.title}`);
    try {
      await translatePageToZh(page, translateClient);
      success++;
      if (i < pages.length - 1) {
        console.log('⏳ Waiting 2 seconds before next page...');
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (_) {
      failed++;
    }
  }
  console.log('\n📊 Pages zh Translation Summary');
  console.log('===============================');
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📄 Total: ${pages.length}`);
}

async function translateSinglePageToZh(slug) {
  console.log(`\n🚀 Starting zh translation for page: ${slug}`);
  const translateClient = initializeTranslationClient();
  const page = await fetchEnglishPage(slug);
  if (!page) {
    console.log('⚠️  English page not found');
    return;
  }
  await translatePageToZh(page, translateClient);
  console.log('\n🎉 Completed zh translation for page');
}

// --------------- Sections (title/bodyText) ---------------

async function fetchEnglishSectionsByPage(slug) {
  const sections = await Section.find({ page: slug, language: 'en', isActive: true }).sort({ pageNumber: 1, sectionId: 1 });
  return sections;
}

async function fetchAllEnglishSections() {
  const sections = await Section.find({ language: 'en', isActive: true }).sort({ page: 1, pageNumber: 1, sectionId: 1 });
  return sections;
}

async function translateSectionToZh(section, translateClient) {
  console.log(`\n🔄 Translating section to zh: "${section.title}"`);
  try {
    const translatedTitle = await translateText(translateClient, section.title || '', TARGET_LANGUAGE);
    const translatedBodyText = await translateText(translateClient, section.bodyText || '', TARGET_LANGUAGE);

    const merged = Object.assign({}, section.translations || {});
    merged[TARGET_LANGUAGE] = {
      title: translatedTitle,
      bodyText: translatedBodyText,
    };

    // Persist using atomic $set to avoid Map serialization issues
    const updatedSection = await Section.findByIdAndUpdate(
      section._id,
      { 
        $set: { [`translations.${TARGET_LANGUAGE}`]: merged[TARGET_LANGUAGE] },
        updatedAt: new Date() 
      },
      { new: true }
    );

    console.log(`   ✅ zh: "${translatedTitle}"`);
    await new Promise(r => setTimeout(r, 500));
    return updatedSection;
  } catch (error) {
    console.error('   ❌ Failed section zh translation:', error.message);
    throw error;
  }
}

async function translatePageSectionsToZh(slug) {
  console.log(`\n🚀 Starting zh translation for sections of page: ${slug}`);
  const translateClient = initializeTranslationClient();
  const sections = await fetchEnglishSectionsByPage(slug);
  if (sections.length === 0) {
    console.log('⚠️  No English sections found for this page');
    return;
  }
  let success = 0, failed = 0;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    console.log(`\n📋 Section ${i + 1}/${sections.length}: ${section.title}`);
    try {
      await translateSectionToZh(section, translateClient);
      success++;
      if (i < sections.length - 1) {
        console.log('⏳ Waiting 2 seconds before next section...');
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (_) {
      failed++;
    }
  }
  console.log('\n📊 Sections zh Translation Summary');
  console.log('==================================');
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📄 Total: ${sections.length}`);
}

async function translateAllSectionsToZh() {
  console.log('\n🚀 Starting zh translation for ALL English sections');
  const translateClient = initializeTranslationClient();
  const sections = await fetchAllEnglishSections();
  if (sections.length === 0) {
    console.log('⚠️  No English sections found');
    return;
  }
  let success = 0, failed = 0;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    console.log(`\n📋 Section ${i + 1}/${sections.length}: ${section.title}`);
    try {
      await translateSectionToZh(section, translateClient);
      success++;
      if (i < sections.length - 1) {
        console.log('⏳ Waiting 500ms before next section...');
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (_) {
      failed++;
    }
  }
  console.log('\n📊 All Sections zh Translation Summary');
  console.log('=====================================');
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📄 Total: ${sections.length}`);
}

// --------------- Verification (zh) ---------------

function getZhSectionStatus(section) {
  const zh = (section.translations && section.translations.get)
    ? section.translations.get(TARGET_LANGUAGE)
    : (section.translations || {})[TARGET_LANGUAGE];
  const hasZh = !!zh;
  const hasTitle = !!(zh && zh.title);
  const hasBody = !!(zh && zh.bodyText);
  return { hasZh, hasTitle, hasBody };
}

async function verifyZhForPage(pageSlug) {
  console.log(`\n🔍 Verifying zh translations for page: ${pageSlug}`);
  const page = await fetchEnglishPage(pageSlug);
  if (!page) {
    console.log('⚠️  English page not found');
    return;
  }
  // Re-read to ensure we see latest stored Map/object
  const fresh = await Page.findById(page._id);
  const translations = fresh ? fresh.translations : page.translations;
  const zh = (translations && translations.get)
    ? translations.get(TARGET_LANGUAGE)
    : (translations || {})[TARGET_LANGUAGE];
  const hasZh = !!zh;
  const hasTitle = !!(zh && zh.title);
  const hasDesc = !!(zh && zh.description);
  console.log(`\nPage: ${page.title} (${page.slug})`);
  console.log(`  zh present: ${hasZh ? 'yes' : 'no'}`);
  if (hasZh) {
    console.log(`  zh.title: ${hasTitle ? 'ok' : 'missing'}`);
    console.log(`  zh.description: ${hasDesc ? 'ok' : 'missing'}`);
  }
}

async function verifyZhForSections(pageSlug) {
  console.log(`\n🔍 Verifying zh translations for sections of page: ${pageSlug}`);
  const sections = await fetchEnglishSectionsByPage(pageSlug);
  if (sections.length === 0) {
    console.log('⚠️  No English sections found for this page');
    return;
  }
  let complete = 0;
  let missing = 0;
  const problems = [];
  sections.forEach((s) => {
    const status = getZhSectionStatus(s);
    const ok = status.hasZh && status.hasTitle && status.hasBody;
    if (ok) complete++; else {
      missing++;
      const which = [];
      if (!status.hasZh) which.push('zh');
      else {
        if (!status.hasTitle) which.push('zh.title');
        if (!status.hasBody) which.push('zh.bodyText');
      }
      problems.push({ title: s.title, sectionId: s.sectionId || s._id.toString(), fields: which });
    }
  });
  console.log(`\n📊 zh Sections Status: complete=${complete}, missing=${missing}, total=${sections.length}`);
  if (problems.length) {
    console.log('\n⚠️  Sections missing zh fields:');
    problems.forEach((p, idx) => {
      console.log(`  ${idx + 1}. ${p.title} (ID: ${p.sectionId}) -> missing: ${p.fields.join(', ')}`);
    });
  }
}

async function verifyZhForAllPages() {
  console.log('\n🔍 Verifying zh translations for ALL English pages');
  const pages = await fetchEnglishPages();
  if (pages.length === 0) {
    console.log('⚠️  No English pages found');
    return;
  }
  let withZh = 0;
  let withoutZh = 0;
  const missing = [];
  for (const p of pages) {
    const fresh = await Page.findById(p._id);
    const translations = fresh ? fresh.translations : p.translations;
    const zh = (translations && translations.get)
      ? translations.get(TARGET_LANGUAGE)
      : (translations || {})[TARGET_LANGUAGE];
    if (zh && (zh.title || zh.description)) {
      withZh++;
    } else {
      withoutZh++;
      missing.push({ title: p.title, slug: p.slug });
    }
  }
  console.log(`\n📊 zh Pages Status: withZh=${withZh}, missing=${withoutZh}, total=${pages.length}`);
  if (missing.length) {
    console.log('\n⚠️  Pages missing zh:');
    missing.forEach((m, idx) => console.log(`  ${idx + 1}. ${m.title} (${m.slug})`));
  }
}

async function verifyZhForAllSections() {
  console.log('\n🔍 Verifying zh translations for ALL English sections');
  const sections = await fetchAllEnglishSections();
  if (sections.length === 0) {
    console.log('⚠️  No English sections found');
    return;
  }
  let complete = 0;
  let missing = 0;
  const problems = [];
  sections.forEach((s) => {
    const status = getZhSectionStatus(s);
    const ok = status.hasZh && status.hasTitle && status.hasBody;
    if (ok) complete++; else {
      missing++;
      const which = [];
      if (!status.hasZh) which.push('zh');
      else {
        if (!status.hasTitle) which.push('zh.title');
        if (!status.hasBody) which.push('zh.bodyText');
      }
      problems.push({ page: s.page, title: s.title, sectionId: s.sectionId || s._id.toString(), fields: which });
    }
  });
  console.log(`\n📊 zh Sections Status: complete=${complete}, missing=${missing}, total=${sections.length}`);
  if (problems.length) {
    console.log('\n⚠️  Sections missing zh fields (first 50):');
    problems.slice(0, 50).forEach((p, idx) => {
      console.log(`  ${idx + 1}. [${p.page}] ${p.title} (ID: ${p.sectionId}) -> missing: ${p.fields.join(', ')}`);
    });
    if (problems.length > 50) console.log(`  ... and ${problems.length - 50} more`);
  }
}

// ---------------------- CLI ----------------------

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    await connectDB();

    switch (command) {
      case 'pages':
        await translateAllPagesToZh();
        break;
      case 'page': {
        const slug = args[1];
        if (!slug) {
          console.error('❌ Please provide page slug. Usage: node translate-add-chinese.js page <slug>');
          process.exit(1);
        }
        await translateSinglePageToZh(slug);
        break;
      }
      case 'sections': {
        const slug = args[1];
        if (!slug) {
          console.error('❌ Please provide page slug. Usage: node translate-add-chinese.js sections <slug>');
          process.exit(1);
        }
        await translatePageSectionsToZh(slug);
        break;
      }
      case 'sections-all':
        await translateAllSectionsToZh();
        break;
      case 'verify-pages-all':
        await verifyZhForAllPages();
        break;
      case 'verify-sections-all':
        await verifyZhForAllSections();
        break;
      case 'verify-page': {
        const slug = args[1];
        if (!slug) {
          console.error('❌ Please provide page slug. Usage: node translate-add-chinese.js verify-page <slug>');
          process.exit(1);
        }
        await verifyZhForPage(slug);
        break;
      }
      case 'verify-sections': {
        const slug = args[1];
        if (!slug) {
          console.error('❌ Please provide page slug. Usage: node translate-add-chinese.js verify-sections <slug>');
          process.exit(1);
        }
        await verifyZhForSections(slug);
        break;
      }
      default:
        console.log('🚀 Add Chinese Translations');
        console.log('===========================');
        console.log('\nUsage:');
        console.log('  node translate-add-chinese.js pages                # Translate all English pages (title/description) to zh');
        console.log('  node translate-add-chinese.js page <slug>         # Translate one English page to zh');
        console.log('  node translate-add-chinese.js sections <slug>     # Translate all English sections of a page to zh');
        console.log('  node translate-add-chinese.js sections-all        # Translate all English sections across pages to zh');
        console.log('  node translate-add-chinese.js verify-pages-all    # Verify zh on all English pages');
        console.log('  node translate-add-chinese.js verify-sections-all # Verify zh on all English sections');
        console.log('  node translate-add-chinese.js verify-page <slug>  # Verify zh on a page (title/description)');
        console.log('  node translate-add-chinese.js verify-sections <slug> # Verify zh on sections for a page');
        break;
    }
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  translateAllPagesToZh,
  translateSinglePageToZh,
  translatePageSectionsToZh,
  translateAllSectionsToZh,
};


