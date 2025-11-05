# Google Cloud Speech-to-Text & Text-to-Speech Setup Guide

This guide will help you set up Google Cloud APIs for the voice agent.

## Prerequisites

1. A Google account
2. A Google Cloud project (free tier available)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name (e.g., "news-agent-voice")
5. Click "Create"

## Step 2: Enable APIs

1. Go to [API Library](https://console.cloud.google.com/apis/library)
2. Search for "Cloud Speech-to-Text API" and click "Enable"
3. Search for "Cloud Text-to-Speech API" and click "Enable"

## Step 3: Create Service Account

1. Go to [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click "Create Service Account"
3. Enter name: "voice-agent-service"
4. Click "Create and Continue"
5. Grant role: "Cloud Speech Client" and "Cloud TTS Client"
6. Click "Continue" then "Done"

## Step 4: Create and Download Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create"
6. The JSON file will download automatically

## Step 5: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key or use existing one
4. Copy the API key

## Step 6: Set Up Credentials

You need to set up two things:

### 1. Google Cloud Service Account (for STT & TTS)

**Option A: Environment Variable (Recommended)**

1. Move the downloaded JSON file to your backend folder
2. Rename it to `google-credentials.json` (or keep original name)
3. Set environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/google-credentials.json"
```

Or add to your `.env` file:
```
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/google-credentials.json
```

**Option B: Add to .env file**

1. Move the JSON file to `backend/google-credentials.json`
2. The code will automatically look for it in the backend folder

### 2. Gemini API Key (for AI responses)

Add to your `.env` file:
```
GOOGLE_API_KEY=your_gemini_api_key_here
```

Or:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Step 7: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 8: Test

Run the backend server:

```bash
python main.py
```

If you see:
- "✅ Google Cloud Speech and TTS clients initialized"
- "✅ Google Gemini AI initialized"

You're all set!

## Free Tier Limits

- **Speech-to-Text**: 60 minutes per month
- **Text-to-Speech**: 1 million characters per month
- **Gemini AI**: 15 requests per minute (generous for development)

These are generous limits for development and testing.

## Troubleshooting

### Error: "Could not automatically determine credentials"

**Solution**: Make sure `GOOGLE_APPLICATION_CREDENTIALS` is set correctly:
```bash
echo $GOOGLE_APPLICATION_CREDENTIALS
```

### Error: "Permission denied" or "API not enabled"

**Solution**: 
1. Make sure both APIs are enabled in your project
2. Make sure the service account has the correct roles

### Error: "Billing required"

**Solution**: 
- Free tier works without billing, but you may need to enable billing if you exceed free limits
- For development, free tier should be sufficient

## Security Note

⚠️ **Never commit `google-credentials.json` to git!**

Add to `.gitignore`:
```
google-credentials.json
*.json
!package.json
!tsconfig.json
```

