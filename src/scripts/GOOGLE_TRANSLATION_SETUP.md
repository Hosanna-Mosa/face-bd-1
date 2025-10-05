# Google Cloud Translation Setup Guide

This guide will help you set up Google Cloud Translation API for the CBM translation script.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Cloud project
3. Billing enabled on your Google Cloud project

## Step 1: Enable the Cloud Translation API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to "APIs & Services" > "Library"
4. Search for "Cloud Translation API"
5. Click on it and press "Enable"

## Step 2: Create a Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Enter a name (e.g., "cbm-translation-service")
4. Add a description (optional)
5. Click "Create and Continue"
6. Grant the following roles:
   - "Cloud Translation API User"
   - "Cloud Translation API Editor" (if you need to manage translations)
7. Click "Continue" and then "Done"

## Step 3: Generate and Download Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Click "Create"
6. The key file will be downloaded automatically
7. **Important**: Keep this file secure and never commit it to version control

## Step 4: Configure Your Environment

### Option 1: Using Service Account Key File (Recommended for Development)

1. Place the downloaded JSON key file in your project root as `google-cloud-key.json`
2. Add the following to your `.env` file:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   ```

### Option 2: Using Environment Variables (Recommended for Production)

1. Open the downloaded JSON key file
2. Extract the following values:
   - `project_id`
   - `private_key`
   - `client_email`
   - `client_id`
3. Add them to your environment variables:
   ```
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   GOOGLE_CLOUD_CLIENT_ID=your-client-id
   ```

## Step 5: Install Dependencies

```bash
npm install @google-cloud/translate
```

## Step 6: Test the Setup

Run the test script to verify everything is working:

```bash
# Run all tests
npm run test:translation

# Or run the script directly
node src/scripts/test-google-translation.js test
```

## Usage Examples

### Basic Translation
```bash
node src/scripts/test-google-translation.js test
```

### Translate Static Translations
```bash
# Translate to German
npm run translate:static de

# Translate to Italian
npm run translate:static it
```

### Detect Language
```bash
node src/scripts/test-google-translation.js detect "Hello world"
```

### List Supported Languages
```bash
node src/scripts/test-google-translation.js languages
```

## Supported Languages

The Google Cloud Translation API supports over 100 languages. Common language codes include:

- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `zh` - Chinese
- `ja` - Japanese
- `ko` - Korean
- `ar` - Arabic
- `hi` - Hindi

## Pricing

Google Cloud Translation API pricing (as of 2024):
- First 500,000 characters per month: Free
- Additional characters: $20 per 1M characters

## Security Best Practices

1. **Never commit service account keys to version control**
2. **Use environment variables in production**
3. **Restrict service account permissions to minimum required**
4. **Regularly rotate service account keys**
5. **Monitor API usage and set up billing alerts**

## Troubleshooting

### Common Issues

1. **"Could not load the default credentials"**
   - Check that `GOOGLE_APPLICATION_CREDENTIALS` points to the correct file
   - Verify the service account key file is valid JSON
   - Ensure the file has proper read permissions

2. **"Permission denied"**
   - Verify the service account has the "Cloud Translation API User" role
   - Check that the Cloud Translation API is enabled

3. **"Project not found"**
   - Verify the `GOOGLE_CLOUD_PROJECT_ID` is correct
   - Ensure the project ID matches the one in your service account key

4. **"Billing not enabled"**
   - Enable billing on your Google Cloud project
   - Note: The free tier should still work without billing

### Getting Help

- [Google Cloud Translation Documentation](https://cloud.google.com/translate/docs)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Service Account Documentation](https://cloud.google.com/iam/docs/service-accounts)





