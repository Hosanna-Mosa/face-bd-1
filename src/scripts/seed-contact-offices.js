'use strict';

require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const ContactOffice = require('../models/ContactOffice');

async function run() {
  const frontendDataPath = path.join(__dirname, '../../../frontend/src/data/contact-offices.ts');
  const file = require('fs').readFileSync(frontendDataPath, 'utf8');

  // Transform TS module to CommonJS JS and evaluate without touching string contents
  let transformed = file
    // remove interfaces entirely
    .replace(/export interface[\s\S]*?\}\s*/g, '')
    // replace the exported const with module.exports
    .replace(/export const contactOfficesData[\s\S]*?=\s*/, 'module.exports = ');

  // Execute transformed code in isolated module scope
  const vm = require('vm');
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.runInNewContext(transformed, sandbox, { filename: 'contact-offices.ts' });
  const data = sandbox.module.exports;

  await mongoose.connect(process.env.MONGODB_URI);
  await ContactOffice.deleteMany({});

  const docs = [];
  let regionIndex = 0;
  for (const group of data) {
    regionIndex++;
    let officeIndex = 0;
    for (const office of group.offices) {
      officeIndex++;
      docs.push({
        ...office,
        region_name: group.region_name,
        region_order: regionIndex,
        office_order: officeIndex
      });
    }
  }
  await ContactOffice.insertMany(docs);
  console.log(`Seeded ${docs.length} contact offices.`);
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });


