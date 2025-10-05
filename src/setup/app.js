'use strict';

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { notFoundHandler, errorHandler } = require('../utils/error');
const { uploadsDir } = require('../utils/paths');
const sectionRoutes = require('../routes/section.routes');
const pageRoutes = require('../routes/page.routes');
const translateRoutes = require('../routes/translate.routes');
const imageRoutes = require('../routes/image.routes');
const careerRoutes = require('../routes/career.routes');
const contactRoutes = require('../routes/contact.routes');
const inquiryRoutes = require('../routes/inquiry.routes');
const adminAuthRoutes = require('../routes/admin-auth.routes');
const blogRoutes = require('../routes/blog.routes');


function createApp() {
  const app = express();

  // Config
  app.set('trust proxy', 1);

  const allowedOrigins = [
      "http://localhost:8080", // React development server
      "http://localhost:8081",
      "http://localhost:3000", // Fallback for development
      "http://localhost:5175", // Vite development server
      // Add your production frontend URL here
      // "https://yourdomain.com",
      // "https://www.yourdomain.com",
    ];
  // Middlewares
  app.use(helmet());
  app.use(cors({  origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Global request duration middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      // eslint-disable-next-line no-console
      if (duration > 1000) {
        console.warn(`⚠️ Slow API: ${req.method} ${req.originalUrl} took ${duration}ms`);
      } else {
        console.log(`${req.method} ${req.originalUrl} took ${duration}ms`);
      }
    });
    next();
  });

  // Logging: METHOD PATH STATUS(response code colored) DURATION
  const colorizeStatus = (status) => {
    if (status >= 500) return `\x1b[31m${status}\x1b[0m`; // red
    if (status >= 400) return `\x1b[33m${status}\x1b[0m`; // yellow
    if (status >= 300) return `\x1b[36m${status}\x1b[0m`; // cyan
    return `\x1b[32m${status}\x1b[0m`; // green
  };
  app.use(morgan((tokens, req, res) => {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = Number(tokens.status(req, res)) || 0;
    const time = tokens['response-time'](req, res) || '0.0';
    return `${method} ${url} ${colorizeStatus(status)} ${time} ms`;
  }));

  // Rate limiting basic safe defaults
  const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
  app.use('/api', limiter);

  // Static: serve uploaded images
  app.use('/uploads', express.static(uploadsDir));

  // Routes
  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use('/api/sections', sectionRoutes);
  app.use('/api/pages', pageRoutes);
  app.use('/api/translate', translateRoutes);
  app.use('/api/images', imageRoutes);
  app.use('/api/careers', careerRoutes);
  app.use('/api/contact-offices', contactRoutes);
  app.use('/api', inquiryRoutes);
  app.use('/api/admin/auth', adminAuthRoutes);
  app.use('/api/blogs', blogRoutes);


  // 404 and error handler
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };


