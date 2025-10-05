'use strict';

const Redis = require('ioredis');

let client = null;
let memoryCache = new Map();

function getRedisClient() {
  if (client) return client;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  client = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 2 });
  client.on('error', () => {});
  return client;
}

async function get(key) {
  const redis = getRedisClient();
  if (redis) {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (_) {
      // Fallback to memory cache
    }
  }
  
  // Fallback to memory cache
  const cached = memoryCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.value;
  }
  if (cached) {
    memoryCache.delete(key);
  }
  return null;
}

async function set(key, value, ttlSeconds = 3600) {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return true;
    } catch (_) {
      // Fallback to memory cache
    }
  }
  
  // Fallback to memory cache
  memoryCache.set(key, {
    value,
    expires: Date.now() + (ttlSeconds * 1000)
  });
  
  // Clean up expired entries periodically
  if (memoryCache.size > 1000) {
    for (const [k, v] of memoryCache.entries()) {
      if (v.expires <= Date.now()) {
        memoryCache.delete(k);
      }
    }
  }
  
  return true;
}

module.exports = { get, set };


