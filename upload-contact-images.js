const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Path to the contact-offices.ts file
const CONTACT_OFFICES_FILE = path.join(__dirname, '../frontend/src/data/contact-offices.ts');
const UPLOADS_DIR = path.join(__dirname, '../uploads/contact-offices');

// Office name to folder mapping
const officeFolderMap = {
  // Corporate Office
  'CBM 360 TIV – UK': '01-Corporate-Office/UK',
  
  // Europe
  'CBM 360 TIV - Germany GmbH & Co. KG': '02-Europe/Germany',
  'CBM 360 TIV - France SARL': '02-Europe/France',
  'CBM 360 TIV - Portugal Lda': '02-Europe/Portugal',
  'CBM 360 TIV - Spain S. L': '02-Europe/Spain',
  'CBM 360 TIV – Russia Ltd OOO': '02-Europe/Russia',
  'CBM 360 TIV – Ukraine LLC/TOV': '02-Europe/Ukraine',
  
  // Emirates
  'CBM 360 TIV Emirates - Dubai – UAE': '03-Emirates-Dubai-UAE/UAE',
  
  // Middle East & Africa
  'CBM 360 TIV - South Africa Pty Ltd': '04-Middle-East-Africa/South-Africa',
  'CBM 360 TIV - Namibia Pty Ltd': '04-Middle-East-Africa/Namibia',
  'CBM 360 TIV - Botswana Pty Ltd': '04-Middle-East-Africa/Botswana',
  'CBM 360 TIV - Zimbabwe LLC': '04-Middle-East-Africa/Zimbabwe',
  'CBM 360 TIV - Angola SA': '04-Middle-East-Africa/Angola',
  'CBM 360 TIV - DR Congo SARL': '04-Middle-East-Africa/DR-Congo',
  'CBM 360 TIV - Madagascar SARL': '04-Middle-East-Africa/Madagascar',
  'CBM 360 TIV - Mozambique SA': '04-Middle-East-Africa/Mozambique',
  'CBM 360 TIV - Zambia PVT LTD': '04-Middle-East-Africa/Zambia',
  'CBM 360 TIV - Malawi PVT LTD': '04-Middle-East-Africa/Malawi',
  'CBM 360 TIV - Tanzania LLC': '04-Middle-East-Africa/Tanzania',
  'CBM 360 TIV - Rwanda LLC': '04-Middle-East-Africa/Rwanda',
  'CBM 360 TIV - Republic of Congo SARL': '04-Middle-East-Africa/Republic-of-Congo',
  'CBM 360 TIV - Gabon SARL': '04-Middle-East-Africa/Gabon',
  'CBM 360 TIV - Uganda LTD': '04-Middle-East-Africa/Uganda',
  'CBM 360 TIV - Kenya LTD': '04-Middle-East-Africa/Kenya',
  'CBM 360 TIV - Ethiopia PLC': '04-Middle-East-Africa/Ethiopia',
  'CBM 360 TIV - Eritrea LLC': '04-Middle-East-Africa/Eritrea',
  'CBM 360 TIV - South Sudan LLC': '04-Middle-East-Africa/South-Sudan',
  'CBM 360 TIV - Chad SARL': '04-Middle-East-Africa/Chad',
  'CBM 360 TIV - Cameroon SARL': '04-Middle-East-Africa/Cameroon',
  'CBM 360 TIV - Equatorial Guinea SARL': '04-Middle-East-Africa/Equatorial-Guinea',
  'CBM 360 TIV - Nigeria LLC': '04-Middle-East-Africa/Nigeria',
  'CBM 360 TIV - Niger PVT': '04-Middle-East-Africa/Niger',
  'CBM 360 TIV - Ghana LTD': '04-Middle-East-Africa/Ghana',
  'CBM 360 TIV - Burkina Faso SARL': '04-Middle-East-Africa/Burkina-Faso',
  'CBM 360 TIV - Benin SARL LLC': '04-Middle-East-Africa/Benin',
  'CBM 360 TIV - Togo SARL': '04-Middle-East-Africa/Togo',
  'CBM 360 TIV - Côte d\'Ivoire SARL': '04-Middle-East-Africa/Cote-dIvoire',
  'CBM 360 TIV - Mali SARL': '04-Middle-East-Africa/Mali',
  'CBM 360 TIV - Sierra Leone PVT LTD': '04-Middle-East-Africa/Sierra-Leone',
  'CBM 360 TIV - Guinea SARL': '04-Middle-East-Africa/Guinea',
  'CBM 360 TIV - Senegal SARL': '04-Middle-East-Africa/Senegal',
  'CBM 360 TIV – Mauritania SARL': '04-Middle-East-Africa/Mauritania',
  
  // Hong Kong
  'CBM 360 TIV - Hong Kong': '05-Hong-Kong/Hong-Kong',
  
  // Asia-Pacific
  'CBM 360 TIV - China LLC': '06-Asia-Pacific/China',
  'CBM 360 TIV - Kazakhstan LLP': '06-Asia-Pacific/Kazakhstan',
  'CBM 360 TIV - Mongolia LLC': '06-Asia-Pacific/Mongolia',
  'CBM 360 TIV - India PVT LTD': '06-Asia-Pacific/India',
  'CBM 360 TIV - South Korea LLC': '06-Asia-Pacific/South-Korea',
  'CBM 360 TIV - Myanmar PLC': '06-Asia-Pacific/Myanmar',
  'CBM 360 TIV - Malaysia PLC': '06-Asia-Pacific/Malaysia',
  'CBM 360 TIV - Thailand PLC': '06-Asia-Pacific/Thailand',
  'CBM 360 TIV - Indonesia PT': '06-Asia-Pacific/Indonesia',
  'CBM 360 TIV - Philippines LLC': '06-Asia-Pacific/Philippines',
  'CBM 360 TIV - Australia Pty LTD': '06-Asia-Pacific/Australia',
  'CBM 360 TIV - Papua New Guinea LLC': '06-Asia-Pacific/Papua-New-Guinea',
  
  // Brazil
  'CBM 360 TIV – Brazil Ltda': '07-Brazil/Brazil',
  
  // North & South America
  'CBM 360 TIV - USA LLC': '08-North-South-America/USA',
  'CBM 360 TIV – Canada Inc': '08-North-South-America/Canada',
  'CBM 360 TIV - México S. de R. L': '08-North-South-America/Mexico',
  'CBM 360 TIV – Dominican Republic SRL': '08-North-South-America/Dominican-Republic',
  'CBM 360 TIV - Venezuela PLC (S.A.)': '08-North-South-America/Venezuela',
  'CBM 360 TIV – Trinidad & Tobago (Ltd.)': '08-North-South-America/Trinidad-and-Tobago',
  'CBM 360 TIV - French Guiana SARL': '08-North-South-America/French-Guiana',
  'CBM 360 TIV – Suriname NV': '08-North-South-America/Suriname',
  'CBM 360 TIV - Guyana (PLLC)': '08-North-South-America/Guyana',
  'CBM 360 TIV – Colombia (SAS)': '08-North-South-America/Colombia',
  'CBM 360 TIV - Peru (S.R.L.)': '08-North-South-America/Peru',
  'CBM 360 TIV – Bolivia (SRL)': '08-North-South-America/Bolivia',
  'CBM 360 TIV - Ecuador (Cia. Ltda.)': '08-North-South-America/Ecuador',
  'CBM 360 TIV – Chile SRL': '08-North-South-America/Chile',
  'CBM 360 TIV - Argentina SA': '08-North-South-America/Argentina',
  'CBM 360 TIV – Paraguay SRL': '08-North-South-America/Paraguay',
  'CBM 360 TIV – Uruguay SRL': '08-North-South-America/Uruguay'
};

// Function to upload image to Cloudinary
async function uploadImageToCloudinary(imagePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      folder: 'cbm-contact-offices',
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${imagePath}:`, error.message);
    return null;
  }
}

// Function to find image files in a directory
function findImageFiles(dirPath) {
  const files = fs.readdirSync(dirPath);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  });
}

// Function to update contact-offices.ts with image URLs
function updateContactOfficesFile(imageUrls) {
  try {
    let content = fs.readFileSync(CONTACT_OFFICES_FILE, 'utf8');
    
    // Add image field to OfficeData interface if not exists
    if (!content.includes('image_url: string;')) {
      content = content.replace(
        'export interface OfficeData {',
        'export interface OfficeData {\n  image_url?: string;'
      );
    }
    
    // Update each office with its image URL
    Object.entries(imageUrls).forEach(([officeName, imageUrl]) => {
      if (imageUrl) {
        const regex = new RegExp(
          `(office_name: "${officeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?)(\\s+notes: "[^"]*"\\s*})`,
          'g'
        );
        content = content.replace(regex, `$1\n        image_url: "${imageUrl}",$2`);
      }
    });
    
    fs.writeFileSync(CONTACT_OFFICES_FILE, content, 'utf8');
    console.log('✅ Successfully updated contact-offices.ts with image URLs');
  } catch (error) {
    console.error('❌ Error updating contact-offices.ts:', error.message);
  }
}

// Main function
async function uploadAllImages() {
  console.log('🚀 Starting image upload process...');
  
  const imageUrls = {};
  let uploadedCount = 0;
  let skippedCount = 0;
  
  // Process each office
  for (const [officeName, folderPath] of Object.entries(officeFolderMap)) {
    const fullPath = path.join(UPLOADS_DIR, folderPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Folder not found: ${folderPath}`);
      skippedCount++;
      continue;
    }
    
    const imageFiles = findImageFiles(fullPath);
    
    if (imageFiles.length === 0) {
      console.log(`⚠️  No images found in: ${folderPath}`);
      skippedCount++;
      continue;
    }
    
    // Use the first image found
    const imageFile = imageFiles[0];
    const imagePath = path.join(fullPath, imageFile);
    const publicId = `cbm-contact-offices/${officeName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    
    console.log(`📤 Uploading: ${officeName}...`);
    const imageUrl = await uploadImageToCloudinary(imagePath, publicId);
    
    if (imageUrl) {
      imageUrls[officeName] = imageUrl;
      uploadedCount++;
      console.log(`✅ Uploaded: ${officeName} - ${imageUrl}`);
    } else {
      console.log(`❌ Failed to upload: ${officeName}`);
      skippedCount++;
    }
  }
  
  // Update the contact-offices.ts file
  updateContactOfficesFile(imageUrls);
  
  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successfully uploaded: ${uploadedCount} images`);
  console.log(`⚠️  Skipped: ${skippedCount} offices`);
  console.log(`📁 Total processed: ${Object.keys(officeFolderMap).length} offices`);
  
  console.log('\n🎉 Image upload process completed!');
}

// Run the script
uploadAllImages().catch(console.error);
