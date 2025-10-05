# Blog API Documentation

## Overview
The Blog API provides endpoints for managing blog posts with features like pagination, search, filtering, and image management.

## Base URL
```
/api/blogs
```

## Endpoints

### Public Endpoints

#### GET /api/blogs
Get all published blog posts with pagination and filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Number of posts per page
- `featured` (boolean) - Filter featured posts only
- `tag` (string) - Filter by tag
- `search` (string) - Search in title, excerpt, content, and tags
- `sortBy` (string, default: 'publishedAt') - Sort field
- `sortOrder` (string, default: 'desc') - Sort order ('asc' or 'desc')

**Response:**
```json
{
  "success": true,
  "data": {
    "blogs": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### GET /api/blogs/featured
Get featured blog posts.

**Query Parameters:**
- `limit` (number, default: 5) - Number of featured posts

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

#### GET /api/blogs/tags
Get all unique tags from published blogs.

**Response:**
```json
{
  "success": true,
  "data": ["ai", "ndt", "testing", ...]
}
```

#### GET /api/blogs/search
Search blog posts.

**Query Parameters:**
- `q` (string, required) - Search query
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Number of posts per page

**Response:**
```json
{
  "success": true,
  "data": {
    "blogs": [...],
    "query": "search term",
    "pagination": {...}
  }
}
```

#### GET /api/blogs/tag/:tag
Get blog posts by specific tag.

**Path Parameters:**
- `tag` (string) - Tag name

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Number of posts per page

**Response:**
```json
{
  "success": true,
  "data": {
    "blogs": [...],
    "tag": "ndt",
    "pagination": {...}
  }
}
```

#### GET /api/blogs/:id
Get a single blog post by ID or slug.

**Path Parameters:**
- `id` (string) - Blog post ID or slug

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "excerpt": "...",
    "content": "...",
    "publishedAt": "2024-03-15T00:00:00.000Z",
    "tags": ["ai", "ndt"],
    "featuredImage": "...",
    "images": [...],
    "viewCount": 1250,
    "readingTime": 8,
    "slug": "blog-post-slug",
    "metaDescription": "...",
    "formattedPublishedAt": "March 15, 2024"
  }
}
```

### Admin Endpoints (Authentication Required)

#### POST /api/blogs
Create a new blog post.

**Request Body:**
```json
{
  "title": "Blog Post Title",
  "excerpt": "Short description...",
  "content": "Full blog content...",
  "publishedAt": "2024-03-15T00:00:00.000Z",
  "tags": ["ai", "ndt"],
  "featuredImage": "https://example.com/image.jpg",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "alt": "Image description",
      "caption": "Image caption",
      "order": 1
    }
  ],
  "isPublished": true,
  "isFeatured": false,
  "readingTime": 8,
  "metaDescription": "SEO description..."
}
```

#### PUT /api/blogs/:id
Update an existing blog post.

**Path Parameters:**
- `id` (string) - Blog post ID

**Request Body:** Same as POST

#### DELETE /api/blogs/:id
Delete a blog post.

**Path Parameters:**
- `id` (string) - Blog post ID

## Blog Schema

```javascript
{
  title: String (required, max 200 chars),
  excerpt: String (required, max 500 chars),
  content: String (required),
  publishedAt: Date (required),
  tags: [String] (lowercase),
  featuredImage: String (required),
  images: [{
    url: String (required),
    alt: String,
    caption: String,
    order: Number (default: 0)
  }],
  isPublished: Boolean (default: true),
  isFeatured: Boolean (default: false),
  viewCount: Number (default: 0),
  slug: String (auto-generated, unique),
  metaDescription: String (max 160 chars),
  readingTime: Number (default: 5, in minutes),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Features

- **Pagination**: All list endpoints support pagination
- **Search**: Full-text search across title, excerpt, content, and tags
- **Filtering**: Filter by featured status, tags, and publication status
- **Sorting**: Sort by any field in ascending or descending order
- **Image Management**: Support for multiple images with metadata
- **SEO Friendly**: Auto-generated slugs and meta descriptions
- **View Tracking**: Automatic view count increment
- **Tag Management**: Automatic tag normalization and deduplication

## Usage Examples

### Get all published blogs
```bash
GET /api/blogs
```

### Get featured blogs only
```bash
GET /api/blogs?featured=true
```

### Search for blogs about AI
```bash
GET /api/blogs/search?q=artificial intelligence
```

### Get blogs by tag
```bash
GET /api/blogs/tag/ndt
```

### Get a specific blog post
```bash
GET /api/blogs/future-ndt-ai-machine-learning
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error





