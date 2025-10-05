# Translation System Usage Guide

This guide covers all the translation scripts and how to use them effectively.

## 🚀 Available Scripts

### 1. Translation Scripts

#### Translate Page Sections
```bash
# Translate all English sections of a page to fr, pt, es, ru
npm run translate:page <page-slug>

# Examples:
npm run translate:page testing
npm run translate:page inspection
npm run translate:page certification
```

#### List Available Pages
```bash
# List all pages available for translation
npm run list:pages
```

#### Check Translation Status (Basic)
```bash
# Check translation status for a specific page
npm run check:translations <page-slug>

# Example:
npm run check:translations testing
```

### 2. Verification Scripts

#### Verify All Translations
```bash
# Check all pages and sections for translation completeness
npm run verify:translations

# Detailed verification with section-by-section breakdown
npm run verify:detailed
```

#### Verify Specific Page
```bash
# Check translation status for a specific page
npm run verify:page <page-slug>

# Example:
npm run verify:page testing
```

#### List Section IDs for a Page
```bash
# Get all section IDs and details for a specific page
npm run list:sections <page-slug>

# Example:
npm run list:sections testing
```

## 📊 What Each Script Does

### Translation Script (`translate-page-sections.js`)
- **Purpose**: Translates English sections to 4 languages
- **Input**: Page slug
- **Output**: Updates sections with translations in `translations` Map
- **Languages**: French (fr), Portuguese (pt), Spanish (es), Russian (ru)

### Verification Script (`verify-translations.js`)
- **Purpose**: Checks translation completeness across all pages
- **Features**:
  - Overall statistics (complete/partial/untranslated)
  - Page-by-page breakdown
  - Missing translations by language
  - Sections needing attention
  - Recommendations

## 🔍 Understanding the Output

### Translation Status Icons
- ✅ **Complete**: All 4 languages translated
- ⚠️ **Partial**: Some languages translated, some missing
- ❌ **None**: No translations at all

### Statistics Explained
- **Total sections**: All English sections found
- **Complete translations**: Sections with all 4 languages
- **Partial translations**: Sections with some languages missing
- **No translations**: Sections with no translations at all
- **Completion rate**: Percentage of fully translated sections

## 📋 Typical Workflow

### 1. Initial Setup
```bash
# Check what pages are available
npm run list:pages

# See current translation status
npm run verify:translations
```

### 2. Translate Pages
```bash
# Translate pages one by one
npm run translate:page testing
npm run translate:page inspection
npm run translate:page certification
```

### 3. Verify Progress
```bash
# Check overall progress
npm run verify:translations

# Check specific page
npm run verify:page testing
```

### 4. Detailed Analysis
```bash
# Get detailed breakdown
npm run verify:detailed
```

## 🎯 Translation Structure

Each section will have a `translations` object:

```javascript
{
  "fr": {
    "title": "Titre en français",
    "bodyText": "Contenu en français..."
  },
  "pt": {
    "title": "Título em português", 
    "bodyText": "Conteúdo em português..."
  },
  "es": {
    "title": "Título en español",
    "bodyText": "Contenido en español..."
  },
  "ru": {
    "title": "Заголовок на русском",
    "bodyText": "Содержимое на русском..."
  }
}
```

## ⚙️ Configuration

### Environment Variables Required
```env
GOOGLE_CLOUD_API_KEY=your-api-key-here
GOOGLE_CLOUD_PROJECT_ID=your-project-id
MONGODB_URI=your-mongodb-connection-string
```

## 🚨 Error Handling

### Common Issues
1. **No Google Cloud credentials**: Check your `.env` file
2. **Page not found**: Verify the page slug exists
3. **No English sections**: Ensure the page has English content
4. **API rate limits**: Script includes built-in delays

### Troubleshooting
- Check database connection
- Verify page slugs are correct
- Ensure Google Cloud API key is valid
- Check if Cloud Translation API is enabled

## 📈 Monitoring Progress

### Quick Status Check
```bash
npm run verify:translations
```

### Detailed Analysis
```bash
npm run verify:detailed
```

### Page-Specific Check
```bash
npm run verify:page <page-slug>
```

## 💡 Best Practices

1. **Start with verification** to see current status
2. **Translate pages systematically** one by one
3. **Verify after each page** to catch issues early
4. **Use detailed verification** for thorough analysis
5. **Check specific pages** when troubleshooting

## 🔄 Complete Workflow Example

```bash
# 1. Check current status
npm run verify:translations

# 2. List available pages
npm run list:pages

# 3. Translate a page
npm run translate:page testing

# 4. Verify the translation
npm run verify:page testing

# 5. Continue with other pages
npm run translate:page inspection
npm run translate:page certification

# 6. Final verification
npm run verify:translations
```

This system provides complete visibility into your translation status and helps you manage the translation process effectively!




