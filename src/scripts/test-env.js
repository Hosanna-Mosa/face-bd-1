#!/usr/bin/env node

require('dotenv').config();

console.log('🔍 Testing Environment Variables...\n');

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('MONGODB_DB:', process.env.MONGODB_DB);
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

console.log('\n📋 Checking if Cloudinary vars are defined:');
console.log('CLOUDINARY_CLOUD_NAME defined:', !!process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY defined:', !!process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET defined:', !!process.env.CLOUDINARY_API_SECRET);

console.log('\n📁 Current working directory:', process.cwd());
console.log('📄 .env file exists:', require('fs').existsSync('.env'));
