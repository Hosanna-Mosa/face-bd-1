'use strict';

const nodemailer = require('nodemailer');
const { logger } = require('../setup/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Send contact inquiry to admin
   * @param {Object} inquiryData - Contact form data
   * @returns {Promise<Object>} Email send result
   */
  async sendContactInquiry(inquiryData) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@cbm.com';

      const emailContent = this.generateContactEmail(inquiryData);

      const mailOptions = {
        from: `"CBM Contact" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        replyTo: inquiryData.email,
        subject: `New Contact Inquiry from ${inquiryData.firstName} ${inquiryData.lastName} (${inquiryData.company})`,
        html: emailContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info('Contact inquiry email sent successfully', {
        messageId: result.messageId,
        from: inquiryData.email,
      });

      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Failed to send contact inquiry email:', error);
      throw new Error('Failed to send contact inquiry email');
    }
  }

  /**
   * Generate HTML email content for contact inquiry
   * @param {Object} inquiryData - Contact form data
   * @returns {string} HTML email content
   */
  generateContactEmail(inquiryData) {
    const safe = (v) => (v ? String(v) : '—');
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Inquiry</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.7; color: #0f172a; background: #f8fafc; }
          .container { max-width: 680px; margin: 24px auto; padding: 0; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08); }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: #ffffff; padding: 28px 32px; }
          .header h1 { margin: 0; font-size: 22px; letter-spacing: 0.3px; }
          .meta { color: #e2e8f0; font-size: 13px; margin-top: 6px; }
          .content { padding: 28px 32px; background: #ffffff; }
          .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
          .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; }
          .label { font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; }
          .value { font-size: 15px; color: #0f172a; font-weight: 600; }
          .message { background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #1e40af; border-radius: 8px; padding: 16px; white-space: pre-wrap; color: #0f172a; }
          .footer { background: #f1f5f9; color: #475569; font-size: 12px; padding: 20px 28px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Inquiry</h1>
            <div class="meta">Submitted on ${new Date().toLocaleString()}</div>
          </div>
          <div class="content">
            <div class="grid">
              <div class="row">
                <div class="card">
                  <div class="label">First Name</div>
                  <div class="value">${safe(inquiryData.firstName)}</div>
                </div>
                <div class="card">
                  <div class="label">Last Name</div>
                  <div class="value">${safe(inquiryData.lastName)}</div>
                </div>
              </div>
              <div class="row">
                <div class="card">
                  <div class="label">Email</div>
                  <div class="value">${safe(inquiryData.email)}</div>
                </div>
                <div class="card">
                  <div class="label">Phone</div>
                  <div class="value">${safe(inquiryData.phone)}</div>
                </div>
              </div>
              <div class="row">
                <div class="card">
                  <div class="label">Company</div>
                  <div class="value">${safe(inquiryData.company)}</div>
                </div>
                <div class="card">
                  <div class="label">Industry</div>
                  <div class="value">${safe(inquiryData.industry)}</div>
                </div>
              </div>
              <div class="row">
                <div class="card">
                  <div class="label">Service Needed</div>
                  <div class="value">${safe(inquiryData.service)}</div>
                </div>
                <div class="card">
                  <div class="label">Consent Given</div>
                  <div class="value">${inquiryData.consent ? 'Yes' : 'No'}</div>
                </div>
              </div>
              <div>
                <div class="label">Message</div>
                <div class="message">${safe(inquiryData.message)}</div>
              </div>
            </div>
          </div>
          <div class="footer">
            This inquiry was submitted from the CBM website contact form. Please respond directly to the sender by replying to this email.
          </div>
        </div>
      </body>
      </html>
    `;
  }

initializeTransporter() {
  this.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 465,
  secure: true, 
      auth: {
        user: 'cbm360tiv@gmail.com',
        pass: 'lyopbpaiupdinnpf',
      },
  });

  console.log("✅ Transporter created");

  // Skip verify in production to avoid hanging on Render
 
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email service configuration error:', error);
      } else {
        console.log('Email service is ready to send messages');
      }
    });

}

  /**
   * Send job application notification to admin
   * @param {Object} applicationData - Application form data
   * @param {Buffer} resumeBuffer - Resume file buffer
   * @param {string} resumeFileName - Original resume filename
   * @returns {Promise<Object>} Email send result
   */
  async sendJobApplication(applicationData, resumeBuffer, resumeFileName) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@cbm.com';
      
      const emailContent = this.generateApplicationEmail(applicationData);
      
      const mailOptions = {
        from: `"CBM Careers" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Job Application: ${applicationData.position}`,
        html: emailContent,
        attachments: [
          {
            filename: resumeFileName,
            content: resumeBuffer,
            contentType: this.getContentType(resumeFileName)
          }
        ]
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info('Job application email sent successfully', { 
        messageId: result.messageId,
        position: applicationData.position,
        applicant: `${applicationData.firstName} ${applicationData.lastName}`
      });

      return {
        success: true,
        messageId: result.messageId
      };

    } catch (error) {
      logger.error('Failed to send job application email:', error);
      throw new Error('Failed to send application email');
    }
  }

  /**
   * Generate HTML email content for job application
   * @param {Object} applicationData - Application form data
   * @returns {string} HTML email content
   */
  generateApplicationEmail(applicationData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Job Application</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; color: #374151; }
          .value { margin-left: 10px; }
          .cover-letter { background-color: white; padding: 15px; border-left: 4px solid #1e40af; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Job Application</h1>
            <p>Position: ${applicationData.position}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>Applicant Information</h2>
              <p><span class="label">Name:</span><span class="value">${applicationData.firstName} ${applicationData.lastName}</span></p>
              <p><span class="label">Email:</span><span class="value">${applicationData.email}</span></p>
              <p><span class="label">Phone:</span><span class="value">${applicationData.phone}</span></p>
            </div>
            
            <div class="section">
              <h2>Position Details</h2>
              <p><span class="label">Position:</span><span class="value">${applicationData.position}</span></p>
              <p><span class="label">Department:</span><span class="value">${applicationData.department}</span></p>
              <p><span class="label">Experience Level:</span><span class="value">${applicationData.experience} years</span></p>
            </div>
            
            <div class="section">
              <h2>Cover Letter</h2>
              <div class="cover-letter">
                ${applicationData.coverLetter.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div class="section">
              <h2>Resume/CV</h2>
              <p>The applicant's resume is attached to this email.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This application was submitted through the CBM Careers portal.</p>
            <p>Application received on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get content type based on file extension
   * @param {string} fileName - File name with extension
   * @returns {string} MIME content type
   */
  getContentType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const contentTypes = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    return contentTypes[extension] || 'application/octet-stream';
  }

  /**
   * Send confirmation email to applicant
   * @param {Object} applicationData - Application form data
   * @returns {Promise<Object>} Email send result
   */
  async sendApplicationConfirmation(applicationData) {
    try {
      const emailContent = this.generateConfirmationEmail(applicationData);
      
      const mailOptions = {
        from: `"CBM Careers" <${process.env.SMTP_USER}>`,
        to: applicationData.email,
        subject: 'Application Received - CBM Careers',
        html: emailContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info('Application confirmation email sent', { 
        messageId: result.messageId,
        applicant: applicationData.email
      });

      return {
        success: true,
        messageId: result.messageId
      };

    } catch (error) {
      logger.error('Failed to send confirmation email:', error);
      // Don't throw error for confirmation email failure
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate confirmation email content
   * @param {Object} applicationData - Application form data
   * @returns {string} HTML email content
   */
  generateConfirmationEmail(applicationData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Application Received</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Received</h1>
          </div>
          
          <div class="content">
            <p>Dear ${applicationData.firstName} ${applicationData.lastName},</p>
            
            <p>Thank you for your interest in joining the CBM team! We have successfully received your application for the <strong>${applicationData.position}</strong> position.</p>
            
            <p>Our talent team will review your application and qualifications against the role requirements. You can expect to hear from us within 5-7 business days.</p>
            
            <p>If you have any questions about your application, please don't hesitate to contact our HR team.</p>
            
            <p>Best regards,<br>
            The CBM Careers Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
