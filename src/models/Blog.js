'use strict';

const mongoose = require('mongoose');

// Translation schema for blog fields
const BlogTranslationSchema = new mongoose.Schema(
  {
    title: { type: String },
    excerpt: { type: String },
    content: { type: String },
    tags: [{ type: String }],
    metaDescription: { type: String }
  },
  { _id: false }
);

const BlogSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      index: true,
      trim: true,
      maxlength: 200
    },
    excerpt: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 500
    },
    content: { 
      type: String, 
      required: true,
      trim: true
    },
    publishedAt: { 
      type: Date, 
      required: true, 
      index: true,
      default: Date.now
    },
    tags: [{ 
      type: String, 
      trim: true,
      lowercase: true
    }],
    featuredImage: { 
      type: String, 
      required: true,
      trim: true
    },
    images: [{
      url: { 
        type: String, 
        required: true,
        trim: true
      },
      alt: { 
        type: String, 
        trim: true
      },
      caption: { 
        type: String, 
        trim: true
      },
      order: { 
        type: Number, 
        default: 0
      }
    }],
    isPublished: { 
      type: Boolean, 
      default: true, 
      index: true 
    },
    isFeatured: { 
      type: Boolean, 
      default: false, 
      index: true 
    },
    viewCount: { 
      type: Number, 
      default: 0,
      index: true
    },
    slug: { 
      type: String, 
      unique: true, 
      index: true,
      trim: true,
      lowercase: true
    },
    metaDescription: { 
      type: String, 
      trim: true,
      maxlength: 160
    },
    readingTime: { 
      type: Number, 
      default: 5 // in minutes
    },
    translations: {
      // Pre-stored translations for blog content
      type: Map,
      of: BlogTranslationSchema,
      default: {},
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for better query performance
BlogSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });
BlogSchema.index({ publishedAt: -1, isPublished: 1 });
BlogSchema.index({ isFeatured: 1, isPublished: 1 });
BlogSchema.index({ tags: 1, isPublished: 1 });
BlogSchema.index({ viewCount: -1 });

// Virtual for formatted published date
BlogSchema.virtual('formattedPublishedAt').get(function() {
  return this.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save middleware to generate slug from title
BlogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

// Method to increment view count
BlogSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Static method to get published blogs
BlogSchema.statics.getPublished = function() {
  return this.find({ isPublished: true }).sort({ publishedAt: -1 });
};

// Static method to get featured blogs
BlogSchema.statics.getFeatured = function() {
  return this.find({ isPublished: true, isFeatured: true }).sort({ publishedAt: -1 });
};

// Static method to search blogs
BlogSchema.statics.search = function(query) {
  return this.find({
    $and: [
      { isPublished: true },
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { excerpt: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  }).sort({ publishedAt: -1 });
};

module.exports = mongoose.model('Blog', BlogSchema);
