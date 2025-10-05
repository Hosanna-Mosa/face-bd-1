'use strict';

const crypto = require('crypto');
const emailService = require('./email');
const { logger } = require('../setup/logger');

// In-memory store; consider Redis for production
const otpStore = new Map(); // key: email, value: { code, expiresAt }

function generateOtp(length = 6) {
	const digits = '0123456789';
	let code = '';
	for (let i = 0; i < length; i++) code += digits[Math.floor(Math.random() * 10)];
	return code;
}

async function sendOtp(email) {
	const code = generateOtp(6);
	const ttlMs = 5 * 60 * 1000; // 5 minutes
	const expiresAt = Date.now() + ttlMs;
	const hashed = crypto.createHash('sha256').update(code).digest('hex');
	otpStore.set(email, { code: hashed, expiresAt });

	const html = `
	  <div style="font-family: Arial, sans-serif;">
	    <h2>CBM Admin Login Code</h2>
	    <p>Your one-time verification code is:</p>
	    <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</div>
	    <p>This code will expire in 5 minutes.</p>
	  </div>
	`;

	try {
		await emailService.transporter.sendMail({
			from: `CBM Admin <${process.env.SMTP_USER}>`,
			to: email,
			subject: 'Your CBM Admin OTP Code',
			html,
		});
		logger.info('OTP email sent', { email });
		return { success: true };
	} catch (error) {
		logger.error('Failed to send OTP email', error);
		throw new Error('Failed to send OTP');
	}
}

function verifyOtp(email, code) {
	const entry = otpStore.get(email);
	if (!entry) return { success: false, message: 'No OTP requested' };
	if (Date.now() > entry.expiresAt) {
		otpStore.delete(email);
		return { success: false, message: 'OTP expired' };
	}
	const hashed = crypto.createHash('sha256').update(code).digest('hex');
	if (hashed !== entry.code) return { success: false, message: 'Invalid OTP' };
	otpStore.delete(email);
	return { success: true };
}

module.exports = { sendOtp, verifyOtp };



