'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testingSubServices = [
  'visual-testing',
  'drone-inspection',
  'borescope-inspection',
  'ultrasonic-testing',
  'phased-array-ut',
  'guided-wave-lrut',
  'radiographic-testing',
  'eddy-current-testing',
  'liquid-penetrant-testing',
  'magnetic-particle-testing',
  'time-of-flight-diffraction',
  'hardness-testing',
  'lifting-gear-load-testing',
  'leak-testing',
  'positive-material-identification'
];

async function listImages(prefix) {
  let nextCursor = undefined;
  const urls = [];
  do {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: `cbm/testing/${prefix}`,
      max_results: 500,
      next_cursor: nextCursor
    });
    urls.push(...res.resources.map(r => r.secure_url));
    nextCursor = res.next_cursor;
  } while (nextCursor);
  return urls;
}

(async () => {
  for (const sub of testingSubServices) {
    const urls = await listImages(sub);
    console.log(`\n=== ${sub} (${urls.length}) ===`);
    urls.forEach((u, i) => console.log(`${i + 1}. ${u}`));
  }
})();


