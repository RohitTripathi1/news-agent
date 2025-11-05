# Hugging Face Models Setup Guide

## Overview

Hugging Face provides free STT/TTS models that can be used:
1. **Locally** (free, no API key needed)
2. **Via Inference API** (free tier, requires token but no billing)

## Option 1: Local Hugging Face Models (Recommended - Free)

### Step 1: Install Dependencies

```bash
cd backend
pip install transformers torch torchaudio soundfile
```

### Step 2: Use Models

Models are automatically downloaded on first use. No API key needed!

### Available Models

**STT (Speech-to-Text):**
- `openai/whisper-small` - Lightweight, fast
- `openai/whisper-base` - Better accuracy
- `facebook/wav2vec2-base-960h` - Alternative option

**TTS (Text-to-Speech):**
- `microsoft/speecht5_tts` - Lightweight
- `coqui/XTTS-v2` - High quality (larger)
- `facebook/mms-tts-eng` - Alternative option

## Option 2: Hugging Face Inference API (Free Tier)

### Step 1: Get Free API Token

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up (free account)
3. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Click "New token"
5. Name it (e.g., "news-agent")
6. Select "Read" permissions
7. Copy the token

### Step 2: Set Up Token

Add to your `.env` file:

```bash
HUGGINGFACE_API_TOKEN=your_token_here
```

### Step 3: Install Package

```bash
pip install huggingface-hub
```

### Free Tier Limits

- **1000 requests/month** - Free tier
- **No billing required** for free tier
- After free tier: Pay-as-you-go

## How It Works

The code automatically tries:
1. **Hugging Face Inference API** (if token provided)
2. **Hugging Face Local Models** (if transformers installed)
3. **Whisper** (fallback)
4. **pyttsx3** (fallback)

## Example Usage

### Local Models (No Token Needed)

```python
from voice_agent import VoiceAgent

agent = VoiceAgent()
# Models auto-download on first use
transcript = agent.transcribe_audio(audio_file)
audio = agent.text_to_speech("Hello world")
```

### Inference API (Requires Token)

```python
# Set HUGGINGFACE_API_TOKEN in .env
agent = VoiceAgent()
# Uses API automatically
```

## Model Selection

You can modify models in `voice_agent.py`:

```python
# Change STT model
self.hf_stt_pipeline = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-small",  # Change this
    device=device
)

# Change TTS model  
self.hf_tts_pipeline = pipeline(
    "text-to-speech",
    model="microsoft/speecht5_tts",  # Change this
    device=device
)
```

## Troubleshooting

### Error: "CUDA out of memory"

**Solution**: Models will use CPU if GPU unavailable. For smaller models:
- Use `openai/whisper-small` instead of `whisper-base`
- Use `microsoft/speecht5_tts` for TTS

### Error: "Model not found"

**Solution**: Check model name on [Hugging Face Model Hub](https://huggingface.co/models)

### Slow performance

**Solution**: 
- Use smaller models (`tiny`, `small`)
- Use Inference API (faster, but requires token)

## Cost

- **Local models**: Completely free (downloads once)
- **Inference API**: Free tier (1000 requests/month), no billing required

