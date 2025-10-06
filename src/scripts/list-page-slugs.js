'use strict';

/*
  Usage:
    node src/scripts/list-page-slugs.js                 # list all slugs
    node src/scripts/list-page-slugs.js --active        # only active pages
    node src/scripts/list-page-slugs.js --inactive      # only inactive pages
    node src/scripts/list-page-slugs.js --match testing # case-insensitive contains match
*/

require('dotenv').config();

const mongoose = require('mongoose');
const Page = require('../models/Page');

async function main() {
  const args = process.argv.slice(2);
  const onlyActive = args.includes('--active');
  const onlyInactive = args.includes('--inactive');
  const matchIndex = args.indexOf('--match');
  const matchValue = matchIndex !== -1 ? (args[matchIndex + 1] || '') : '';
  const dbIndex = args.indexOf('--db');
  const cliDbName = dbIndex !== -1 ? (args[dbIndex + 1] || '') : '';
  const uriIndex = args.indexOf('--uri');
  const cliUri = uriIndex !== -1 ? (args[uriIndex + 1] || '') : '';

  const uri = cliUri || process.env.MONGODB_URI || "mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const dbName = (cliDbName || process.env.MONGODB_DB || '').trim() || undefined;

  if (!uri) {
    // eslint-disable-next-line no-console
    console.error('MONGODB_URI is not set. Create a .env file or set the env var.');
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 15000 });

  const filter = {};
  if (onlyActive) filter.isActive = true;
  if (onlyInactive) filter.isActive = false;
  if (matchValue) filter.slug = { $regex: matchValue, $options: 'i' };

  const pages = await Page.find(filter).select('slug isActive _id language').sort({ slug: 1 }).lean();

  if (pages.length === 0) {
    // eslint-disable-next-line no-console
    console.log('No pages found with current filters.');
  } else {
    // eslint-disable-next-line no-console
    console.log(`Found ${pages.length} page(s):`);
    for (const p of pages) {
      // eslint-disable-next-line no-console
      console.log(`- slug="${p.slug}"\tactive=${p.isActive}\tid=${p._id}\tlanguage=${p.language}`);
    }
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error listing slugs:', err && err.message);
  process.exit(1);
});


