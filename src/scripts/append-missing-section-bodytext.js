'use strict';

/**
 * Script: Append missing text to Section.bodyText records
 *
 * Usage examples:
 *   node src/scripts/append-missing-section-bodytext.js --append "\n\nAdditional info." --dry-run
 *   node src/scripts/append-missing-section-bodytext.js --page cbm --language en --append "\nFooter text"
 *   node src/scripts/append-missing-section-bodytext.js --mapping ./section-append-map.json
 *   node src/scripts/append-missing-section-bodytext.js --mapping ./section-append-map.json --only-mapped
 *
 * Mapping file format (JSON):
 * {
 *   "byId": { "<mongodb _id>": "text to append" },
 *   "bySectionId": { "<sectionId>": "text to append" },
 *   "byPageSection": { "cbm::intro": "text for page 'cbm' sectionId 'intro'" },
 *   "defaultAppend": "\n\nDefault text if nothing else matched"
 * }
 */

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { connectToDatabase } = require('../setup/database');
const Section = require('../models/Section');

function parseArgs(argv) {
  const args = {
    page: null,
    language: null,
    append: null,
    mapping: null,
    onlyMapped: false,
    dryRun: false,
    containsCheck: null, // if provided, skip append if body already contains this substring
    limit: null,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--page') args.page = argv[++i];
    else if (a === '--language') args.language = argv[++i];
    else if (a === '--append') args.append = argv[++i];
    else if (a === '--mapping') args.mapping = argv[++i];
    else if (a === '--only-mapped') args.onlyMapped = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--contains-check') args.containsCheck = argv[++i];
    else if (a === '--limit') args.limit = Number(argv[++i]) || null;
    else if (a === '--help' || a === '-h') {
      printHelpAndExit();
    }
  }
  return args;
}

function printHelpAndExit(code = 0) {
  console.log(`\nAppend missing text to Section.bodyText\n\n` +
    `Options:\n` +
    `  --page <slug>           Filter by page slug (e.g., cbm, testing)\n` +
    `  --language <code>       Filter by language (en, fr, pt, es, ru)\n` +
    `  --append <text>         Default text to append when not using mapping\n` +
    `  --mapping <file.json>   JSON mapping file for per-section text\n` +
    `  --only-mapped           Only update sections present in mapping\n` +
    `  --contains-check <txt>  Skip append if body already contains this substring\n` +
    `  --limit <n>             Process at most n sections (for testing)\n` +
    `  --dry-run               Show intended changes without saving\n` +
    `  -h, --help              Show this help\n`);
  process.exit(code);
}

function loadMapping(mappingPath) {
  if (!mappingPath) return null;
  const abs = path.isAbsolute(mappingPath) ? mappingPath : path.join(process.cwd(), mappingPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Mapping file not found: ${abs}`);
  }
  const raw = fs.readFileSync(abs, 'utf8');
  const data = JSON.parse(raw);
  return {
    byId: data.byId || {},
    bySectionId: data.bySectionId || {},
    byPageSection: data.byPageSection || {},
    defaultAppend: data.defaultAppend || null,
  };
}

function buildQuery(filters) {
  const q = {};
  if (filters.page) q.page = filters.page;
  if (filters.language) q.language = filters.language;
  return q;
}

function getAppendTextForSection(section, mapping, cliAppend) {
  if (mapping) {
    if (mapping.byId && mapping.byId[String(section._id)]) {
      return mapping.byId[String(section._id)];
    }
    if (mapping.bySectionId && section.sectionId && mapping.bySectionId[section.sectionId]) {
      return mapping.bySectionId[section.sectionId];
    }
    const pageKey = section.page ? String(section.page) : '';
    const secKey = section.sectionId ? String(section.sectionId) : '';
    const composite = `${pageKey}::${secKey}`;
    if (mapping.byPageSection && mapping.byPageSection[composite]) {
      return mapping.byPageSection[composite];
    }
    if (!cliAppend && mapping.defaultAppend) {
      return mapping.defaultAppend;
    }
  }
  return cliAppend || null;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.append && !args.mapping) {
    console.error('Error: provide --append or --mapping');
    printHelpAndExit(1);
  }

  const mapping = loadMapping(args.mapping);

  await connectToDatabase();

  const query = buildQuery({ page: args.page, language: args.language });
  let cursor = Section.find(query).sort({ createdAt: 1 }).cursor();

  let processed = 0;
  let updated = 0;
  for await (const section of cursor) {
    if (args.limit && processed >= args.limit) break;
    processed++;

    const appendText = getAppendTextForSection(section, mapping, args.append);
    if (!appendText) {
      if (args.onlyMapped) {
        continue;
      }
      // Nothing to append for this section
      continue;
    }

    const currentBody = section.bodyText || '';
    const containsAlready = args.containsCheck
      ? currentBody.includes(args.containsCheck)
      : currentBody.includes(appendText.trim());

    if (containsAlready) {
      // Skip if already present
      continue;
    }

    const nextBody = currentBody ? `${currentBody}${appendText}` : appendText;

    if (args.dryRun) {
      console.log(`[DRY] Would update section _id=${section._id} page=${section.page || ''} sectionId=${section.sectionId || ''}`);
      continue;
    }

    section.bodyText = nextBody;
    await section.save();
    updated++;
  }

  console.log(`\nProcessed: ${processed}`);
  console.log(`Updated:   ${updated}`);

  await mongoose.connection.close();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.connection.close();
  } catch (_) {}
  process.exit(1);
});





