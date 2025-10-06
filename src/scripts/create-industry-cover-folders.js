'use strict';

// This script reads frontend/src/images.js and creates corresponding
// cover image folders under frontend/uploads as "<Original Name> cover images".

const path = require('path');
const fs = require('fs');

async function readIndustryList(imagesJsPath) {
  const mod = await import(imagesJsPath);
  const images = mod.default || mod.industryImages || {};
  const entries = Object.entries(images);
  return entries.map(([key, val]) => val?.name || key);
}

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function main() {
  const repoRoot = path.resolve(__dirname, '../../..');
  const imagesJsFile = path.join(repoRoot, 'frontend', 'src', 'images.js');

  // Convert to file URL for dynamic import
  const imagesJsUrl = pathToFileURL(imagesJsFile).href;

  // Validate file exists
  await fs.promises.access(imagesJsFile, fs.constants.R_OK);

  const industryNames = await readIndustryList(imagesJsUrl);
  const uploadsRoot = path.join(repoRoot, 'frontend', 'uploads');

  for (const name of industryNames) {
    const folderName = `${name} cover images`;
    const targetPath = path.join(uploadsRoot, folderName);
    await ensureDir(targetPath);
    // eslint-disable-next-line no-console
    console.log('Created:', targetPath);
  }
}

function pathToFileURL(p) {
  const { pathToFileURL: toURL } = require('url');
  return toURL(p);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


