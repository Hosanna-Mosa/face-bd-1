'use strict';

const path = require('path');
const fs = require('fs');
require('dotenv').config();

const rootDir = path.resolve(__dirname, '../../');
const uploadsDir = path.join(rootDir, process.env.UPLOAD_DIR || 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

module.exports = { rootDir, uploadsDir };


