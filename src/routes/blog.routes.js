const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllBlogs,
  getBlogById,
  getFeaturedBlogs,
  getBlogsByTag,
  searchBlogs,
  getAllTags,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blog.controller');

// Create upload middleware for blog images using memory storage for Cloudinary
const upload = multer({
  storage: multer.memoryStorage(), // Store in memory for Cloudinary upload
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  }
});

// Public routes
router.get('/', getAllBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/tags', getAllTags);
router.get('/search', searchBlogs);
router.get('/tag/:tag', getBlogsByTag);
router.get('/:id', getBlogById);

// Admin routes (you can add authentication middleware here)
router.post('/', upload.single('featuredImageFile'), createBlog);
router.put('/:id', upload.single('featuredImageFile'), updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
