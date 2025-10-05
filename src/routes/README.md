# Page API Documentation

## Overview
The Page API provides comprehensive functionality for managing pages with sections and multi-language support. Pages can contain multiple sections and support 5 languages: English (en), French (fr), Portuguese (pt), Spanish (es), and Russian (ru).

## Base URL
```
/api/pages
```

## Endpoints

### 1. Create a Page
**POST** `/api/pages`

**Body:**
```json
{
  "title": "Home Page",
  "description": "Welcome to our website",
  "slug": "home-page",
  "language": "en",
  "pageNumber": 1,
  "isActive": true,
  "sections": ["sectionId1", "sectionId2"],
  "translations": {
    "fr": {
      "title": "Page d'accueil",
      "description": "Bienvenue sur notre site"
    }
  },
  "metadata": {
    "keywords": ["home", "welcome"],
    "author": "John Doe"
  }
}
```

### 2. Get All Pages
**GET** `/api/pages`

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `lang` (string): Language code for translation (default: 'en')
- `populate` (boolean): Include sections data (default: false)
- `isActive` (boolean): Filter by active status
- `language` (string): Filter by primary language
- `search` (string): Search in title and description

**Example:**
```
GET /api/pages?page=1&limit=10&lang=fr&populate=true&isActive=true
```

### 3. Get Page by ID
**GET** `/api/pages/:id`

**Query Parameters:**
- `populate` (boolean): Include sections data (default: true)

**Example:**
```
GET /api/pages/507f1f77bcf86cd799439011?populate=true
```

### 4. Get Page by Slug
**GET** `/api/pages/slug/:slug`

**Query Parameters:**
- `populate` (boolean): Include sections data (default: true)
- `lang` (string): Language code for translation

**Example:**
```
GET /api/pages/slug/home-page?lang=fr&populate=true
```

### 5. Update Page
**PUT** `/api/pages/:id`

**Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "slug": "updated-slug",
  "language": "en",
  "pageNumber": 2,
  "isActive": true,
  "sections": ["newSectionId1", "newSectionId2"],
  "translations": {
    "fr": {
      "title": "Titre mis à jour",
      "description": "Description mise à jour"
    }
  }
}
```

### 6. Delete Page
**DELETE** `/api/pages/:id`

### 7. Add Section to Page
**POST** `/api/pages/:id/sections`

**Body:**
```json
{
  "sectionId": "507f1f77bcf86cd799439012"
}
```

### 8. Remove Section from Page
**DELETE** `/api/pages/:id/sections/:sectionId`

### 9. Search Page with Sections by Name
**GET** `/api/pages/search/:pageName`

**GET** `/api/pages/search/:pageName/:sectionName`

**Query Parameters:**
- `lang` (string): Language code for translation

**Examples:**
```
GET /api/pages/search/home?lang=fr
GET /api/pages/search/home/introduction?lang=fr
```

## Response Format

All endpoints return responses in the following format:

```json
{
  "success": true,
  "data": {
    // Page or array of pages
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "lang": "en"
}
```

## Language Support

The API supports 5 languages:
- `en` - English (default)
- `fr` - French
- `pt` - Portuguese
- `es` - Spanish
- `ru` - Russian

When requesting content in a different language:
1. First checks for pre-stored translations in the database
2. If not found, dynamically translates the content using the translation service
3. Returns the translated content with the requested language code

## Error Responses

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

## Usage Examples

### Creating a page with sections
```bash
curl -X POST http://localhost:4000/api/pages \
  -H "Content-Type: application/json" \
  -d '{
    "title": "About Us",
    "description": "Learn more about our company",
    "slug": "about-us",
    "sections": ["section1", "section2"]
  }'
```

### Fetching a page with sections in French
```bash
curl "http://localhost:4000/api/pages/slug/about-us?lang=fr&populate=true"
```

### Searching for a page by name
```bash
curl "http://localhost:4000/api/pages/search/about?lang=es"
```

