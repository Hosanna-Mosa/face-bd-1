'use strict';

const Blog = require('../models/Blog');
const cloudinaryService = require('../services/cloudinary');
const { translateText, translateArraySafely, SUPPORTED } = require('../services/translation');

/**
 * Get all published blogs with pagination and filtering
 */
const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      featured,
      tag,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    if (req.query.includeUnpublished !== 'true') query.isPublished = true;
    if (featured === 'true') query.isFeatured = true;
    if (tag) query.tags = { $in: [new RegExp(tag, 'i')] };
    if (search) query.title = { $regex: search, $options: 'i' };

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const selectFields = req.query.includeUnpublished === 'true' ? '' : '-content';

    const blogs = await Blog.find(query)
      .select(selectFields)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

/**
 * Get single blog by ID or slug
 */
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang } = req.query;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let blog = isObjectId
      ? await Blog.findById(id)
      : await Blog.findOne({ slug: id });

    if (!blog || !blog.isPublished) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    await blog.incrementViewCount();

    // Handle translation
    if (lang && lang !== 'en' && blog.translations?.get(lang)) {
      const translation = blog.translations.get(lang);
      blog = {
        ...blog.toObject(),
        ...translation,
        translations: blog.translations
      };
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
};

/**
 * Get featured blogs
 */
const getFeaturedBlogs = async (req, res) => {
  try {
    const limitNum = parseInt(req.query.limit || 5);
    const blogs = await Blog.getFeatured()
      .select('-content')
      .limit(limitNum)
      .lean();

    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured blogs',
      error: error.message
    });
  }
};

/**
 * Get blogs by tag
 */
const getBlogsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const pageNum = parseInt(req.query.page || 1);
    const limitNum = parseInt(req.query.limit || 10);
    const skip = (pageNum - 1) * limitNum;

    const blogs = await Blog.find({
      isPublished: true,
      tags: { $in: [new RegExp(tag, 'i')] }
    })
      .select('-content')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Blog.countDocuments({
      isPublished: true,
      tags: { $in: [new RegExp(tag, 'i')] }
    });
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        blogs,
        tag,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs by tag',
      error: error.message
    });
  }
};

/**
 * Search blogs
 */
const searchBlogs = async (req, res) => {
  try {
    const { q: query, page = 1, limit = 10 } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Search query is required' });

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const blogs = await Blog.search(query)
      .select('-content')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Blog.countDocuments({
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    });

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        blogs,
        query,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching blogs',
      error: error.message
    });
  }
};

/**
 * Get all unique tags
 */
const getAllTags = async (req, res) => {
  try {
    const tags = await Blog.distinct('tags', { isPublished: true });
    res.json({ success: true, data: tags.sort() });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tags',
      error: error.message
    });
  }
};

/**
 * Create new blog (Admin only) with auto translations
 */
const createBlog = async (req, res) => {
  try {
    console.log('🟢 Create blog request received:', {
      body: req.body,
      file: req.file ? 'File present' : 'No file',
      headers: req.headers
    });

    const blogData = req.body;

    // Handle featured image upload
    if (req.file) {
      try {
        const timestamp = Date.now();
        const publicId = `blog-${timestamp}`;
        console.log('🔹 Uploading featured image to Cloudinary with publicId:', publicId);

        const uploadResult = await cloudinaryService.uploadFromBuffer(req.file.buffer, {
          folder: 'cbm/blog/featured-images',
          public_id: publicId,
          transformation: [{ width: 800, height: 600, crop: 'fit', quality: 'auto' }],
          tags: ['blog', 'featured-image', 'cbm']
        });

        console.log('✅ Featured image uploaded:', uploadResult.url);
        blogData.featuredImage = uploadResult.url;
      } catch (uploadError) {
        console.warn('❌ Cloudinary upload failed:', uploadError);
      }
    }

    // Parse JSON fields
    if (blogData.tags && typeof blogData.tags === 'string') {
      try {
        blogData.tags = JSON.parse(blogData.tags);
        console.log('🔹 Parsed tags:', blogData.tags);
      } catch (e) {
        console.warn('❌ Failed to parse tags JSON:', e);
        blogData.tags = [];
      }
    }

    if (blogData.images && typeof blogData.images === 'string') {
      try {
        blogData.images = JSON.parse(blogData.images);
        console.log('🔹 Parsed images:', blogData.images);
      } catch (e) {
        console.warn('❌ Failed to parse images JSON:', e);
        blogData.images = [];
      }
    }

    // Generate slug if missing
    if (!blogData.slug && blogData.title) {
      blogData.slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      console.log('🔹 Generated slug:', blogData.slug);
    }

    // Initialize translations map
    blogData.translations = {};
    const TARGET_LANGUAGES = SUPPORTED.filter(l => l !== 'en');

    for (const lang of TARGET_LANGUAGES) {
      try {
        console.log(`🌍 Translating blog to ${lang}...`);

        const [titleT, excerptT, contentT, tagsT, metaT] = await Promise.all([
          translateText(blogData.title, lang),
          translateText(blogData.excerpt, lang),
          translateText(blogData.content, lang),
          translateArraySafely(blogData.tags || [], lang),
          blogData.metaDescription ? translateText(blogData.metaDescription, lang) : ''
        ]);

        blogData.translations[lang] = {
          title: titleT,
          excerpt: excerptT,
          content: contentT,
          tags: tagsT,
          metaDescription: metaT
        };

        console.log(`✅ Successfully translated blog to ${lang}`);
      } catch (e) {
        console.warn(`❌ Failed to translate blog to ${lang}:`, e.message);
      }
    }

    console.log('🟢 Saving blog to database...');
    const blog = new Blog(blogData);
    await blog.save();
    console.log('✅ Blog saved successfully with ID:', blog._id);

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
};


/**
 * Update blog (Admin only)
 */
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(`🔹 Update blog request received for ID: ${id}`);
    console.log('Update payload:', updateData);

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      console.warn(`❌ Blog not found for ID: ${id}`);
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Handle uploaded featured image
    if (req.file) {
      try {
        const timestamp = Date.now();
        const publicId = `blog-${timestamp}`;
        console.log(`🔹 Uploading featured image to Cloudinary with publicId: ${publicId}`);

        const uploadResult = await cloudinaryService.uploadFromBuffer(req.file.buffer, {
          folder: 'cbm/blog/featured-images',
          public_id: publicId,
          transformation: [{ width: 800, height: 600, crop: 'fit', quality: 'auto' }],
          tags: ['blog', 'featured-image', 'cbm']
        });

        updateData.featuredImage = uploadResult.url;
        console.log(`✅ Featured image uploaded: ${updateData.featuredImage}`);
      } catch (uploadError) {
        console.warn('⚠️ Cloudinary upload failed:', uploadError);
      }
    }

    // Parse JSON fields if needed
    if (updateData.tags && typeof updateData.tags === 'string') {
      try { updateData.tags = JSON.parse(updateData.tags); console.log('🔹 Parsed tags:', updateData.tags); } 
      catch { updateData.tags = []; console.warn('⚠️ Failed to parse tags, resetting to empty array'); }
    }
    if (updateData.images && typeof updateData.images === 'string') {
      try { updateData.images = JSON.parse(updateData.images); console.log('🔹 Parsed images:', updateData.images); } 
      catch { updateData.images = []; console.warn('⚠️ Failed to parse images, resetting to empty array'); }
    }

    // Initialize translations map if not present
    if (!existingBlog.translations) existingBlog.translations = new Map();

    const TARGET_LANGUAGES = SUPPORTED.filter(l => l !== 'en');

    for (const lang of TARGET_LANGUAGES) {
      try {
        const [titleT, excerptT, contentT, tagsT, metaT] = await Promise.all([
          updateData.title ? translateText(updateData.title, lang) : existingBlog.translations?.get(lang)?.title || existingBlog.title,
          updateData.excerpt ? translateText(updateData.excerpt, lang) : existingBlog.translations?.get(lang)?.excerpt || existingBlog.excerpt,
          updateData.content ? translateText(updateData.content, lang) : existingBlog.translations?.get(lang)?.content || existingBlog.content,
          updateData.tags ? translateArraySafely(updateData.tags, lang) : existingBlog.translations?.get(lang)?.tags || existingBlog.tags,
          updateData.metaDescription ? translateText(updateData.metaDescription, lang) : existingBlog.translations?.get(lang)?.metaDescription || existingBlog.metaDescription
        ]);

        if (!updateData.translations) updateData.translations = {};
        updateData.translations[lang] = { title: titleT, excerpt: excerptT, content: contentT, tags: tagsT, metaDescription: metaT };
        console.log(`✅ Translated blog to ${lang}`);
      } catch (e) {
        console.warn(`❌ Failed to translate blog to ${lang}:`, e.message);
      }
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    console.log(`✅ Blog updated successfully: ID ${blog._id}`);

    res.json({ success: true, data: blog, message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('❌ Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
};


/**
 * Delete blog (Admin only)
 */
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });

    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting blog post', error: error.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  getFeaturedBlogs,
  getBlogsByTag,
  searchBlogs,
  getAllTags,
  createBlog,
  updateBlog,
  deleteBlog
};
