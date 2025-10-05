# CBM Backend Email Integration

This document explains how to set up the email functionality for job applications in the CBM backend.

## Email Service Setup

The email service uses Nodemailer to send job application notifications to admin and confirmation emails to applicants.

### Required Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Email (where job applications will be sent)
ADMIN_EMAIL=admin@cbm.com
```

### Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASS`

### Other Email Providers

You can use other SMTP providers by changing the `SMTP_HOST` and `SMTP_PORT`:

- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's SMTP settings

## API Endpoints

### POST `/api/careers/apply`
Submit a job application with resume.

**Request Body (multipart/form-data):**
- `firstName` (string, required)
- `lastName` (string, required)
- `email` (string, required)
- `phone` (string, required)
- `position` (string, required)
- `department` (string, required)
- `experience` (string, required)
- `coverLetter` (string, required)
- `resume` (file, required) - PDF, DOC, or DOCX (max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "adminEmailSent": true,
    "confirmationEmailSent": true,
    "applicationId": "message-id"
  }
}
```

### GET `/api/careers/status`
Get application status (placeholder for future implementation).

**Query Parameters:**
- `email` (string, required)
- `applicationId` (string, required)

## Email Templates

The service generates two types of emails:

### 1. Admin Notification Email
- Sent to `ADMIN_EMAIL`
- Contains all application details
- Includes resume as attachment
- Professional HTML formatting

### 2. Applicant Confirmation Email
- Sent to applicant's email
- Confirms application receipt
- Provides next steps information
- Professional HTML formatting

## File Upload Configuration

- **Supported Formats**: PDF, DOC, DOCX
- **Maximum Size**: 5MB
- **Storage**: In-memory (for email attachment)
- **Validation**: File type and size validation

## Error Handling

The service includes comprehensive error handling:

- **Validation Errors**: Missing fields, invalid email, file type/size
- **Email Errors**: SMTP connection issues, invalid credentials
- **File Errors**: Upload failures, processing errors

## Logging

All email operations are logged with:
- Success/failure status
- Message IDs
- Applicant information
- Error details (if any)

## Testing

To test the email functionality:

1. Set up environment variables
2. Start the backend server
3. Submit an application through the frontend
4. Check admin email for notification
5. Check applicant email for confirmation

## Troubleshooting

### Common Issues:

1. **SMTP Authentication Failed**
   - Check SMTP credentials
   - Ensure 2FA is enabled for Gmail
   - Use app password, not regular password

2. **Email Not Received**
   - Check spam folder
   - Verify email addresses
   - Check SMTP configuration

3. **File Upload Issues**
   - Ensure file is PDF, DOC, or DOCX
   - Check file size (max 5MB)
   - Verify form data format

## Security Considerations

- Email credentials are stored in environment variables
- File uploads are validated for type and size
- Rate limiting is applied to prevent abuse
- Error messages don't expose sensitive information


