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

async function countImagesFor(folder) {
  const prefix = `cbm/testing/${folder}`;
  const res = await cloudinary.api.resources({ type: 'upload', prefix, max_results: 500 });
  return res.resources.length;
}

(async () => {
  const results = [];
  for (const sub of testingSubServices) {
    const count = await countImagesFor(sub);
    results.push({ sub, count });
  }
  console.table(results);
  const phased = results.find(r => r.sub === 'phased-array-ut');
  if (phased) {
    console.log(`Phased Array UT images: ${phased.count}`);
  }
})();


