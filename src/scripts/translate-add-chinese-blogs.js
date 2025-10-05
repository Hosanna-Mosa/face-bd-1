/**
 * Add Chinese (zh) translations for Blogs
 *
 * Usage:
 *   node src/scripts/translate-add-chinese-blogs.js all
 *   node src/scripts/translate-add-chinese-blogs.js one <slug>
 *   node src/scripts/translate-add-chinese-blogs.js verify-all
 *   node src/scripts/translate-add-chinese-blogs.js verify <slug>
 */

const mongoose = require('mongoose');
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

const Blog = require('../models/Blog');

const TARGET_LANGUAGE = 'zh';

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

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
  

async function t(translateClient, text) {
  if (!text || String(text).trim() === '') return '';
  const [translation] = await translateClient.translate(text, { from: 'en', to: TARGET_LANGUAGE });
  return translation;
}

async function translateBlogDoc(translateClient, blog) {
  const translated = {
    title: await t(translateClient, blog.title),
    excerpt: await t(translateClient, blog.excerpt),
    content: await t(translateClient, blog.content),
    tags: Array.isArray(blog.tags) ? await Promise.all(blog.tags.map(x => t(translateClient, x))) : [],
    metaDescription: await t(translateClient, blog.metaDescription || ''),
  };
  await Blog.findByIdAndUpdate(blog._id, { $set: { [`translations.${TARGET_LANGUAGE}`]: translated }, updatedAt: new Date() });
}

async function translateAllBlogs() {
  console.log('\n🚀 Translating ALL blogs to zh');
  const translateClient = initializeTranslationClient();
  const blogs = await Blog.find({}).sort({ publishedAt: -1 });
  let success = 0, failed = 0;
  for (const b of blogs) {
    try {
      await translateBlogDoc(translateClient, b);
      success++;
      await new Promise(r => setTimeout(r, 300));
    } catch (_) { failed++; }
  }
  console.log(`\n📊 Blogs zh: success=${success}, failed=${failed}, total=${blogs.length}`);
}

async function translateOneBlog(slug) {
  const translateClient = initializeTranslationClient();
  const blog = await Blog.findOne({ slug });
  if (!blog) { console.log('⚠️  Blog not found'); return; }
  await translateBlogDoc(translateClient, blog);
  console.log('✅ Blog translated to zh');
}

async function verifyBlog(slug) {
  const blog = await Blog.findOne({ slug });
  if (!blog) { console.log('⚠️  Blog not found'); return; }
  const fresh = await Blog.findById(blog._id);
  const tr = fresh.translations && fresh.translations.get ? fresh.translations.get(TARGET_LANGUAGE) : (fresh.translations || {})[TARGET_LANGUAGE];
  const has = !!tr;
  console.log(`\nBlog: ${blog.title} (${blog.slug})`);
  console.log(`  zh present: ${has ? 'yes' : 'no'}`);
  if (has) {
    console.log(`  zh.title: ${tr.title ? 'ok' : 'missing'}`);
    console.log(`  zh.excerpt: ${tr.excerpt ? 'ok' : 'missing'}`);
    console.log(`  zh.content: ${tr.content ? 'ok' : 'missing'}`);
  }
}

async function verifyAllBlogs() {
  const blogs = await Blog.find({}).sort({ publishedAt: -1 });
  let withZh = 0, missing = 0;
  const miss = [];
  for (const b of blogs) {
    const fresh = await Blog.findById(b._id);
    const tr = fresh.translations && fresh.translations.get ? fresh.translations.get(TARGET_LANGUAGE) : (fresh.translations || {})[TARGET_LANGUAGE];
    if (tr && (tr.title || tr.excerpt || tr.content)) withZh++; else { missing++; miss.push(b.slug); }
  }
  console.log(`\n📊 Blogs zh: withZh=${withZh}, missing=${missing}, total=${blogs.length}`);
  if (miss.length) console.log('Missing slugs:', miss.slice(0, 50).join(', '), miss.length > 50 ? `...(+${miss.length-50})` : '');
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  try {
    await connectDB();
    switch (cmd) {
      case 'all':
        await translateAllBlogs();
        break;
      case 'one':
        if (!args[1]) { console.error('Usage: one <slug>'); process.exit(1); }
        await translateOneBlog(args[1]);
        break;
      case 'verify-all':
        await verifyAllBlogs();
        break;
      case 'verify':
        if (!args[1]) { console.error('Usage: verify <slug>'); process.exit(1); }
        await verifyBlog(args[1]);
        break;
      default:
        console.log('Usage:');
        console.log('  node translate-add-chinese-blogs.js all');
        console.log('  node translate-add-chinese-blogs.js one <slug>');
        console.log('  node translate-add-chinese-blogs.js verify-all');
        console.log('  node translate-add-chinese-blogs.js verify <slug>');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

if (require.main === module) {
  main().catch(err => { console.error('❌', err.message); process.exit(1); });
}

module.exports = { translateAllBlogs, translateOneBlog, verifyAllBlogs, verifyBlog };


