# Career Translation System

This guide explains how to use the career translation system for CBM.

## Overview

The career translation system automatically translates English career listings to 4 languages:
- **French (fr)**
- **Portuguese (pt)** 
- **Spanish (es)**
- **Russian (ru)**

## Translation Object Structure

Each career document includes a `translations` Map that stores translated versions of the following fields:

### Translatable Fields
- `title` - Job title
- `description` - Job description
- `department` - Department name
- `location` - Job location
- `responsibilities` - Array of job responsibilities
- `requirements` - Array of job requirements
- `benefits` - Array of job benefits
- `tags` - Array of job tags

### Translation Structure Example

```javascript
{
  "fr": {
    "title": "Ingénieur de Test Senior - Automobile",
    "description": "Diriger des projets de test automobile...",
    "department": "Ingénierie",
    "location": "Détroit, MI",
    "responsibilities": ["Diriger des projets...", "Collaborer avec..."],
    "requirements": ["Diplôme en ingénierie...", "5+ années d'expérience..."],
    "benefits": ["Assurance santé complète...", "Plan de retraite 401k..."],
    "tags": ["automobile", "test", "sécurité", "ingénierie"]
  },
  "pt": {
    "title": "Engenheiro de Testes Sênior - Automotivo",
    // ... Portuguese translations
  },
  "es": {
    "title": "Ingeniero de Pruebas Senior - Automotriz", 
    // ... Spanish translations
  },
  "ru": {
    "title": "Старший инженер по тестированию - Автомобильная промышленность",
    // ... Russian translations
  }
}
```

## Usage

### Prerequisites

1. **Google Cloud Translation API** setup (see `TRANSLATION_SETUP.md`)
2. **Environment variables** configured:
   ```env
   GOOGLE_CLOUD_API_KEY=your-api-key-here
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   ```

### Commands

#### 1. Translate All Careers
```bash
npm run translate:careers
```
Translates all active career listings to all 4 target languages.

#### 2. List Active Careers
```bash
npm run list:careers
```
Lists all active career listings with basic information.

#### 3. Check Translation Status
```bash
npm run check:career-translations
```
Shows translation status for all careers (fully translated, partially translated, or not translated).

### Direct Script Usage

```bash
# Translate all careers
node src/scripts/translate-careers.js translate

# List careers
node src/scripts/translate-careers.js list

# Check status
node src/scripts/translate-careers.js status
```

## How It Works

1. **Fetches Active Careers**: Retrieves all careers where `isActive: true`
2. **Translates Content**: Uses Google Cloud Translation API to translate each field
3. **Handles Arrays**: Translates array fields (responsibilities, requirements, benefits, tags) element by element
4. **Rate Limiting**: Includes delays to prevent API rate limiting
5. **Saves Translations**: Stores translations in the `translations` Map of each career document
6. **Error Handling**: Continues processing other careers if one fails

## Rate Limiting

The script includes built-in rate limiting:
- **500ms delay** between language translations
- **2 seconds delay** between careers
- This prevents hitting Google Cloud API limits

## Error Handling

- Continues processing other careers if one fails
- Logs detailed error information
- Provides summary of successful/failed translations
- Preserves original English content

## Cost Considerations

Google Cloud Translation API pricing:
- **First 500,000 characters per month: FREE**
- Additional characters: $20 per 1M characters

For typical career listings, you'll likely stay within the free tier.

## Database Schema Changes

The Career model has been updated to include:

```javascript
translations: {
  // Pre-stored translations for career content
  type: Map,
  of: CareerTranslationSchema,
  default: {},
}
```

## API Integration

When serving career data, you can now include translations:

```javascript
// Get career with translations
const career = await Career.findById(careerId);

// Access translated content
const frenchTitle = career.translations.get('fr')?.title;
const spanishDescription = career.translations.get('es')?.description;
```

## Troubleshooting

### Common Issues

1. **No Google Cloud credentials found**
   - Ensure environment variables are set correctly
   - Check `TRANSLATION_SETUP.md` for setup instructions

2. **Translation API errors**
   - Verify API key has proper permissions
   - Check API quota limits
   - Ensure billing is enabled for the project

3. **Database connection errors**
   - Verify `MONGODB_URI` is set correctly
   - Check database connectivity

### Debug Mode

For debugging, you can modify the script to add more verbose logging or test with a single career first.

## Sample Files

- `career-translation-object.sample.js` - Shows example translation structure
- `translate-careers.js` - Main translation script
- `README-career-translations.md` - This documentation

## Related Files

- `models/Career.js` - Updated Career model with translation support
- `services/translation.js` - Core translation service
- `TRANSLATION_SETUP.md` - Google Cloud setup guide
