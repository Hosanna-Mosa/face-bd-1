'use strict';

const mongoose = require('mongoose');

const SupportedLanguages = ['en', 'fr', 'pt', 'es', 'ru', 'zh'];

const TranslationSchema = new mongoose.Schema(
  {
    title: { type: String },
    bodyText: { type: String },
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    bodyText: { type: String, required: true },
    images: [{ type: String }],
    coverPhoto: { type: String },
    language: { type: String, enum: SupportedLanguages, default: 'en', index: true },
    pageNumber: { type: Number, index: true },
    sectionId: { type: String, index: true },
    page: { type: String, index: true }, // Page slug (e.g., 'cbm', 'testing', 'inspection')
    isActive: { type: Boolean, default: true, index: true },
    translations: {
      // Pre-stored translations for static content
      type: Map,
      of: TranslationSchema,
      default: {},
    },
  },
  { timestamps: true }
);

SectionSchema.index({ pageNumber: 1, sectionId: 1 });
SectionSchema.index({ page: 1, sectionId: 1 });
SectionSchema.index({ createdAt: -1 });
SectionSchema.index({ title: 'text', bodyText: 'text' });
SectionSchema.index({ isActive: 1, pageNumber: 1 }); // For populate queries
SectionSchema.index({ isActive: 1, page: 1 }); // For page-based section queries

module.exports = mongoose.model('Section', SectionSchema);


