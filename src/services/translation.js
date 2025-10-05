'use strict';

const { Translate } = require('@google-cloud/translate').v2;

// Supported languages
const SUPPORTED = ['en', 'fr', 'pt', 'es', 'ru', 'zh'];

// Lazy-initialized Google Translate client
let translateClient;

function getTranslateClient() {
  if (translateClient) return translateClient;

  const config = {};

  // Use API key or service account
  if ('AIzaSyAWiR1KCKcclqjPUQrBxmTEFgjtV3cv5CY' || process.env.GOOGLE_CLOUD_API_KEY) {
    config.key = 'AIzaSyAWiR1KCKcclqjPUQrBxmTEFgjtV3cv5CY' || process.env.GOOGLE_CLOUD_API_KEY;
    console.log('✅ Using Google Cloud API key');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    config.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    console.log('✅ Using Google Application Credentials file');
  } else if (process.env.GOOGLE_CLOUD_PRIVATE_KEY && process.env.GOOGLE_CLOUD_CLIENT_EMAIL) {
    config.credentials = {
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    };
    console.log('✅ Using Google Cloud service account credentials');
  } else {
    console.warn('⚠️ No Google Cloud credentials found. Translation may fail.');
  }

  translateClient = new Translate(config);
  return translateClient; 
}

async function translateText(text, targetLang) {
  if (!text || !targetLang || targetLang === 'en') return text;
  if (!SUPPORTED.includes(targetLang)) return text;

  const client = getTranslateClient();
  try {
    const [translation] = await client.translate(text, { to: targetLang, from: 'en' });
    console.log(`🌍 Translated (${targetLang}): "${text}" → "${translation}"`);
    return translation;
  } catch (err) {
    console.error(`❌ Translation failed for "${text}" → ${targetLang}: ${err.message}`);
    return text;
  }
}

/**
 * Safely translates an array of strings
 * @param {string[]} values - Array of strings to translate
 * @param {string} lang - Target language code
 * @returns {Promise<string[]>} - Array of translated strings
 */
async function translateArraySafely(values, lang) {
  if (!Array.isArray(values) || values.length === 0) return [];
  console.log(`🔹 Translating array to ${lang} (${values.length} items)`);
  const translated = await Promise.all(values.map(item => translateText(item, lang)));
  return translated;
}

module.exports = { translateText, translateArraySafely, SUPPORTED };
