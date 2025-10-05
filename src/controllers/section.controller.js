'use strict';

const Section = require('../models/Section');
const { ApiError } = require('../utils/error');

async function createSection(req, res, next) {
  try {
    const { title, bodyText, pageNumber, sectionId, language = 'en', translations = {}, coverPhoto } = req.body;
    if (!title || !bodyText) throw new ApiError(400, 'title and bodyText are required');

    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const section = await Section.create({ title, bodyText, images, coverPhoto, pageNumber, sectionId, language, translations });
    res.status(201).json({ success: true, data: section });
  } catch (err) {
    next(err);
  }
}

async function getSectionById(req, res, next) {
  try {
    const { id } = req.params;
    const section = await Section.findById(id);
    if (!section) throw new ApiError(404, 'Section not found');
    res.json({ success: true, data: section });
  } catch (err) {
    next(err);
  }
}

const { translateText } = require('../services/translation');

async function getSections(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Math.min(Number(req.query.limit || 10), 100);
    const skip = (page - 1) * limit;
    const lang = (req.query.lang || 'en').toLowerCase();
    const sectionId = req.query.sectionId;
    const pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : undefined;

    const filter = {};
    if (sectionId) filter.sectionId = sectionId;
    if (pageNumber !== undefined) filter.pageNumber = pageNumber;

    const [items, total] = await Promise.all([
      Section.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Section.countDocuments(filter),
    ]);

    if (lang && lang !== 'en') {
      for (const item of items) {
        const fromDb = item.translations && item.translations[lang];
        if (fromDb && (fromDb.title || fromDb.bodyText)) {
          item.title = fromDb.title || item.title;
          item.bodyText = fromDb.bodyText || item.bodyText;
          item.language = lang;
          continue;
        }
        // dynamic translation for variable content
        const [tTitle, tBody] = await Promise.all([
          translateText(item.title, lang),
          translateText(item.bodyText, lang),
        ]);
        item.title = tTitle;
        item.bodyText = tBody;
        item.language = lang;
      }
    }

    res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) }, lang });
  } catch (err) {
    next(err);
  }
}

async function updateSection(req, res, next) {
  try {
    const { id } = req.params;
    const { title, bodyText, pageNumber, sectionId, translations, coverPhoto } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (bodyText !== undefined) updates.bodyText = bodyText;
    if (pageNumber !== undefined) updates.pageNumber = pageNumber;
    if (sectionId !== undefined) updates.sectionId = sectionId;
    if (translations !== undefined) updates.translations = translations;
    if (coverPhoto !== undefined) updates.coverPhoto = coverPhoto;

    if (req.files && req.files.length > 0) {
      updates.$push = { images: { $each: req.files.map((f) => `/uploads/${f.filename}`) } };
    }

    const section = await Section.findByIdAndUpdate(id, updates, { new: true });
    if (!section) throw new ApiError(404, 'Section not found');
    res.json({ success: true, data: section });
  } catch (err) {
    next(err);
  }
}

async function deleteSection(req, res, next) {
  try {
    const { id } = req.params;
    const section = await Section.findByIdAndDelete(id);
    if (!section) throw new ApiError(404, 'Section not found');
    res.json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSection, getSectionById, getSections, updateSection, deleteSection };


