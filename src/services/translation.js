'use strict';

const fetch = require('node-fetch');
const { cacheGet, cacheSet } = require('./cache');

const SUPPORTED = ['en', 'fr', 'pt', 'es', 'ru', 'zh'];

async function translateText(text, targetLang) {
  if (!text || !targetLang || targetLang === 'en') return text;
  if (!SUPPORTED.includes(targetLang)) return text;

  const cacheKey = `t:v1:${targetLang}:${Buffer.from(text).toString('base64').slice(0, 80)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const provider = (process.env.TRANSLATION_PROVIDER || 'google').toLowerCase();
  let translated = text;

  if (provider === 'deepl' && process.env.DEEPL_API_KEY) {
    translated = await translateWithDeepL(text, targetLang);
  } else if (process.env.GOOGLE_TRANSLATE_API_KEY) {
    translated = await translateWithGoogle(text, targetLang);
  } else {
    // Fallback: mock translation tag (for local dev without keys)
    translated = `[${targetLang}] ` + text;
  }

  await cacheSet(cacheKey, translated, 24 * 3600);
  return translated;
}

async function translateWithGoogle(text, targetLang) {
  // Using Google Cloud Translate v2 REST
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  const url = `https://translation.googleapis.com/language/translate/v2?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, target: targetLang, source: 'en', format: 'text' }),
  });
  if (!res.ok) throw new Error('Google Translate API error');
  const data = await res.json();
  return data.data.translations[0].translatedText;
}

async function translateWithDeepL(text, targetLang) {
  const key = process.env.DEEPL_API_KEY;
  const isFree = key && key.endsWith(':fx');
  const host = isFree ? 'api-free.deepl.com' : 'api.deepl.com';
  const url = `https://${host}/v2/translate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ auth_key: key, text, target_lang: targetLang.toUpperCase(), source_lang: 'EN' }),
  });
  if (!res.ok) throw new Error('DeepL API error');
  const data = await res.json();
  return data.translations[0].text;
}

module.exports = { translateText };


