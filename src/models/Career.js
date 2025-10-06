'use strict';

const mongoose = require('mongoose');

const EmploymentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];
const SeniorityLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager', 'Director'];
const WorkArrangements = ['Onsite', 'Remote', 'Hybrid'];
const SupportedLanguages = ['en', 'fr', 'pt', 'es', 'ru', 'zh'];

// Translation schema for career fields
const CareerTranslationSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    department: { type: String },
    location: { type: String },
    type: { type: String },
    level: { type: String },
    workArrangement: { type: String },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    tags: [{ type: String }]
  },
  { _id: false }
);

const CareerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    location: { type: String, required: true, index: true },
    type: { type: String, enum: EmploymentTypes, default: 'Full-time', index: true },
    level: { type: String, enum: SeniorityLevels, required: true, index: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    tags: [{ type: String }],
    workArrangement: { type: String, enum: WorkArrangements, default: 'Onsite', index: true },
    isActive: { type: Boolean, default: true, index: true },
    postedAt: { type: Date, default: Date.now, index: true },
    closingAt: { type: Date },
    applicationUrl: { type: String },
    translations: {
      // Pre-stored translations for career content
      type: Map,
      of: CareerTranslationSchema,
      default: {},
    }
  },
  { timestamps: true }
);

CareerSchema.index({ title: 'text', description: 'text', department: 'text', tags: 'text' });
CareerSchema.index({ location: 1, department: 1, level: 1, type: 1 });

module.exports = mongoose.model('Career', CareerSchema);


