'use strict';

const express = require('express');
const { ApiError } = require('../utils/error');
const emailService = require('../services/email');

const router = express.Router();

// POST /api/contact - send contact inquiry email
router.post('/contact', async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      industry,
      service,
      message,
      consent,
    } = req.body || {};

    if (!firstName || !lastName || !email || !company || !message) {
      throw new ApiError(400, 'firstName, lastName, email, company and message are required');
    }

    const consentBool = Boolean(consent);

    await emailService.sendContactInquiry({
      firstName,
      lastName,
      email,
      phone,
      company,
      industry,
      service,
      message,
      consent: consentBool,
    });

    res.status(200).json({ success: true, message: 'Inquiry sent successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


