# Seed Page with Sections Script

This script creates an Innovation & R&D page with 3 sections in the database, following the established schema patterns.

## What it creates

- **1 Page**: Innovation & Research and Development (R&D) with slug "innovation-rd"
- **3 Sections**: Three comprehensive sections covering advanced technologies
  - Section 1: "CBM 360° – IoT & AI Condition Monitoring Systems" with page number 1
  - Section 2: "AI & Robotics in NDT Testing & Inspection" with page number 2
  - Section 3: "Future Roadmap – Smart Industry 4.0 Transformation" with page number 3

## Features

- ✅ Creates sections first, then the page with proper references
- ✅ Includes multilingual translations (EN, FR, PT, ES, RU)
- ✅ Follows the established database schema
- ✅ Includes proper error handling and validation
- ✅ Provides detailed logging and verification
- ✅ Includes cleanup functionality

## Usage

### Run the seed script
```bash
npm run seed:page
```

### Clear the seeded data
```bash
npm run seed:page:clear
```

### Run directly with Node
```bash
# Seed data
node src/scripts/seed-page-with-sections.js

# Clear data
node src/scripts/seed-page-with-sections.js clear
```

## Database Schema Compliance

The script creates data that follows the established schemas:

### Page Schema
- `title`: String (required, indexed)
- `description`: String
- `slug`: String (required, unique, indexed)
- `language`: String (enum: en, fr, pt, es, ru)
- `pageNumber`: Number (indexed)
- `isActive`: Boolean (default: true, indexed)
- `sections`: Array of ObjectIds (references to Section model)
- `metadata`: Object with keywords, author, lastModified
- `timestamps`: Created and updated timestamps

### Section Schema
- `title`: String (required, indexed)
- `bodyText`: String (required)
- `images`: Array of strings
- `language`: String (enum: en, fr, pt, es, ru)
- `pageNumber`: Number (indexed)
- `sectionId`: String (indexed)
- `page`: String (page slug, indexed)
- `isActive`: Boolean (default: true, indexed)
- `translations`: Map of language codes to translated content
- `timestamps`: Created and updated timestamps

## Sample Data Created

### Page
- **Title**: Innovation & Research and Development (R&D)
- **Slug**: innovation-rd
- **Description**: We are pioneers in Condition-Based Monitoring (CBM), Technical Industrial Verification (TIV), and advanced R&D services, delivering next-generation solutions powered by IoT, AI, Robotics, and Industry 4.0 technologies.
- **Language**: English (en)
- **Page Number**: 1
- **Keywords**: ['innovation', 'rd', 'iot', 'ai', 'robotics', 'industry-4-0']
- **Author**: Seed Script

### Sections
1. **CBM 360° – IoT & AI Condition Monitoring Systems** (section-1)
   - Page Number: 1
   - Content: IoT and AI-powered condition monitoring solutions
   - Covers wireless sensors, edge computing, and cloud infrastructure

2. **AI & Robotics in NDT Testing & Inspection** (section-2)
   - Page Number: 2
   - Content: AI-powered NDT and robotic inspection technologies
   - Includes digital twin and augmented reality solutions

3. **Future Roadmap – Smart Industry 4.0 Transformation** (section-3)
   - Page Number: 3
   - Content: Future technology roadmap and value proposition
   - Covers 5G, digital twins, and sustainability initiatives

## Verification

The script automatically verifies the created data by:
- Counting created sections and pages
- Checking that the page references the correct sections
- Displaying a summary of all created content
- Showing sample data preview

## Error Handling

The script includes comprehensive error handling:
- Database connection failures
- Section creation failures
- Page creation failures
- Data validation errors
- Proper cleanup on failures

## Dependencies

- `../setup/database` - Database connection
- `../utils/seeder` - Data seeding utilities
- `../setup/logger` - Logging functionality
- `../models/Page` - Page model
- `../models/Section` - Section model

## Notes

- The script creates sections first, then creates the page with references to those sections
- All data is created with `isActive: true` by default
- The script uses the existing DataSeeder utility for consistency
- Multilingual translations are pre-populated for all supported languages
- The script can be run multiple times safely (it will create new data each time)


