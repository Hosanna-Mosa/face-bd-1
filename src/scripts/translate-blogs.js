'use strict';

/**
 * Production Translation Script for Blogs
 *
 * Translates blog fields (title, excerpt, content, tags, metaDescription)
 * into target languages and stores them in the Blog.translations Map.
 *
 * Usage:
 *  node src/scripts/translate-blogs.js translate-all
 *  node src/scripts/translate-blogs.js translate <slug>
 *  node src/scripts/translate-blogs.js list
 *  node src/scripts/translate-blogs.js status <slug>
 *  node src/scripts/translate-blogs.js status-all
 */

const mongoose = require('mongoose');
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

const Blog = require('../models/Blog');

const TARGET_LANGUAGES = ['fr', 'pt', 'es', 'ru'];

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

async function translateText(translateClient, text, targetLanguage, sourceLanguage = 'en') {
  try {
    if (!text || (typeof text === 'string' && text.trim() === '')) return text || '';

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

async function translateArray(translateClient, array, targetLanguage) {
  if (!array || array.length === 0) return [];
  const translated = [];
  for (const item of array) {
    if (typeof item === 'string' && item.trim() !== '') {
      translated.push(await translateText(translateClient, item, targetLanguage));
    } else {
      translated.push(item);
    }
  }
  return translated;
}

async function fetchEnglishBlogs() {
  try {
    console.log('\n📋 Fetching English blogs');
    const blogs = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 });
    console.log(`✅ Found ${blogs.length} blogs`);
    return blogs;
  } catch (error) {
    console.error('❌ Error fetching blogs:', error.message);
    throw error;
  }
}

async function fetchBlogBySlug(slug) {
  try {
    console.log(`\n📋 Fetching blog: ${slug}`);
    const blog = await Blog.findOne({ slug, isPublished: true });
    if (!blog) {
      console.log('⚠️  No blog found with this slug');
      return null;
    }
    console.log(`✅ Found blog: ${blog.title}`);
    return blog;
  } catch (error) {
    console.error('❌ Error fetching blog:', error.message);
    throw error;
  }
}

async function translateBlog(blog, translateClient) {
  try {
    console.log(`\n🔄 Translating blog: "${blog.title}"`);

    const translations = {};

    for (const lang of TARGET_LANGUAGES) {
      console.log(`   📝 Translating to ${lang.toUpperCase()}...`);
      try {
        const [translatedTitle, translatedExcerpt, translatedContent, translatedTags, translatedMeta] = await Promise.all([
          translateText(translateClient, blog.title, lang),
          translateText(translateClient, blog.excerpt, lang),
          translateText(translateClient, blog.content, lang),
          translateArray(translateClient, blog.tags || [], lang),
          translateText(translateClient, blog.metaDescription || '', lang),
        ]);

        translations[lang] = {
          title: translatedTitle,
          excerpt: translatedExcerpt,
          content: translatedContent,
          tags: translatedTags,
          metaDescription: translatedMeta,
        };

        console.log(`   ✅ ${lang.toUpperCase()}: "${translatedTitle}"`);

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`   ❌ Failed to translate to ${lang}:`, error.message);
      }
    }

    blog.translations = translations;
    console.log(`✅ Completed translations for blog: "${blog.title}"`);
    return blog;
  } catch (error) {
    console.error('❌ Error translating blog:', error.message);
    throw error;
  }
}

async function saveTranslatedBlog(blog) {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blog._id,
      {
        translations: blog.translations,
        updatedAt: new Date(),
      },
      { new: true }
    );
    console.log(`💾 Saved translations for blog: "${blog.title}"`);
    return updatedBlog;
  } catch (error) {
    console.error('❌ Error saving blog:', error.message);
    throw error;
  }
}

async function translateAllBlogs() {
  console.log('\n🚀 Starting translation for all blogs');
  console.log('===================================');
  try {
    const translateClient = initializeTranslationClient();
    const blogs = await fetchEnglishBlogs();
    if (!blogs || blogs.length === 0) return;

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      console.log(`\n📋 Processing blog ${i + 1}/${blogs.length}: ${blog.title}`);
      try {
        const translatedBlog = await translateBlog(blog, translateClient);
        await saveTranslatedBlog(translatedBlog);
        successCount++;
        if (i < blogs.length - 1) {
          console.log('⏳ Waiting 2 seconds before next blog...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ Failed to process blog "${blog.title}":`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Translation Summary');
    console.log('======================');
    console.log(`✅ Successfully translated: ${successCount} blogs`);
    console.log(`❌ Failed translations: ${errorCount} blogs`);
    console.log(`📄 Total blogs processed: ${blogs.length}`);
  } catch (error) {
    console.error('\n❌ Translation process failed:', error.message);
    throw error;
  }
}

async function listBlogs() {
  console.log('\n📋 Available Blogs');
  console.log('==================');
  try {
    const blogs = await Blog.find({ isPublished: true }).select('title slug publishedAt').sort({ publishedAt: -1 });
    if (!blogs || blogs.length === 0) {
      console.log('⚠️  No blogs found');
      return;
    }
    blogs.forEach((b, i) => {
      console.log(`  ${i + 1}. ${b.title} (${b.slug || 'no-slug'}) - ${b.publishedAt ? b.publishedAt.toISOString().slice(0,10) : 'N/A'}`);
    });
    console.log(`\n✅ Found ${blogs.length} blogs`);
  } catch (error) {
    console.error('❌ Error listing blogs:', error.message);
    throw error;
  }
}

async function checkBlogStatus(slug) {
  console.log(`\n🔍 Translation Status for Blog: ${slug}`);
  console.log('=====================================');
  try {
    const blog = await Blog.findOne({ slug, isPublished: true });
    if (!blog) {
      console.log('⚠️  No blog found with this slug');
      return;
    }
    const translationCount = Object.keys(blog.translations || {}).length;
    const expectedCount = TARGET_LANGUAGES.length;
    let status;
    if (translationCount === expectedCount) status = '✅ Fully translated';
    else if (translationCount > 0) status = '⚠️  Partially translated';
    else status = '❌ Not translated';
    console.log(`Status: ${status} (${translationCount}/${expectedCount})`);
    if (translationCount > 0) {
      console.log('\nAvailable translations:');
      Object.keys(blog.translations).forEach(lang => {
        const tr = blog.translations[lang];
        console.log(`  ${lang.toUpperCase()}: "${tr.title}"`);
      });
    }
    const missing = TARGET_LANGUAGES.filter(l => !blog.translations || !blog.translations[l]);
    if (missing.length > 0) console.log(`\nMissing translations: ${missing.join(', ').toUpperCase()}`);
  } catch (error) {
    console.error('❌ Error checking translation status:', error.message);
    throw error;
  }
}

async function checkAllBlogsStatus() {
  console.log('\n🔍 Translation Status for All Blogs');
  console.log('==================================');
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 });
    if (!blogs || blogs.length === 0) {
      console.log('⚠️  No blogs found');
      return;
    }
    const statusCounts = { fully: 0, partial: 0, none: 0 };
    blogs.forEach((blog, index) => {
      const translationCount = Object.keys(blog.translations || {}).length;
      const expectedCount = TARGET_LANGUAGES.length;
      let status;
      if (translationCount === expectedCount) { status = '✅ Fully translated'; statusCounts.fully++; }
      else if (translationCount > 0) { status = '⚠️  Partially translated'; statusCounts.partial++; }
      else { status = '❌ Not translated'; statusCounts.none++; }
      console.log(`  ${index + 1}. ${blog.title} - ${status} (${translationCount}/${expectedCount})`);
    });
    console.log(`\n📈 Summary:`);
    console.log(`  ✅ Fully translated: ${statusCounts.fully}`);
    console.log(`  ⚠️  Partially translated: ${statusCounts.partial}`);
    console.log(`  ❌ Not translated: ${statusCounts.none}`);
  } catch (error) {
    console.error('❌ Error checking blogs status:', error.message);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  try {
    await connectDB();
    switch (command) {
      case 'translate-all':
        await translateAllBlogs();
        break;
      case 'translate':
        const slug = args[1];
        if (!slug) {
          console.error('❌ Please provide blog slug. Usage: node translate-blogs.js translate <slug>');
          process.exit(1);
        }
        {
          const translateClient = initializeTranslationClient();
          const blog = await fetchBlogBySlug(slug);
          if (!blog) break;
          const translatedBlog = await translateBlog(blog, translateClient);
          await saveTranslatedBlog(translatedBlog);
          console.log('\n🎉 Translation completed successfully!');
        }
        break;
      case 'list':
        await listBlogs();
        break;
      case 'status':
        const statusSlug = args[1];
        if (!statusSlug) {
          console.error('❌ Please provide blog slug. Usage: node translate-blogs.js status <slug>');
          process.exit(1);
        }
        await checkBlogStatus(statusSlug);
        break;
      case 'status-all':
        await checkAllBlogsStatus();
        break;
      default:
        console.log('🚀 Blog Translation Script');
        console.log('==========================');
        console.log('\nUsage:');
        console.log('  node translate-blogs.js translate-all            # Translate all blogs');
        console.log('  node translate-blogs.js translate <slug>        # Translate a specific blog');
        console.log('  node translate-blogs.js list                    # List available blogs');
        console.log('  node translate-blogs.js status <slug>           # Check translation status for a blog');
        console.log('  node translate-blogs.js status-all              # Check translation status for all blogs');
        console.log('\nTarget Languages: fr, pt, es, ru');
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
  translateAllBlogs,
  translateBlog,
  saveTranslatedBlog,
  fetchEnglishBlogs,
  fetchBlogBySlug,
  listBlogs,
  checkBlogStatus,
  checkAllBlogsStatus,
};


