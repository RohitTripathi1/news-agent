import os
import tempfile
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import Whisper for STT (free, local)
try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    print("⚠️  openai-whisper not installed. STT will not work.")

# Try to import pyttsx3 for TTS (free, uses OS TTS)
try:
    import pyttsx3
    PYTTSX3_AVAILABLE = True
except ImportError:
    PYTTSX3_AVAILABLE = False
    print("⚠️  pyttsx3 not installed. TTS will not work.")

# Try to import Hugging Face for STT/TTS (free, local or API)
try:
    from transformers import pipeline
    import torch
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False
    print("⚠️  transformers not installed. Hugging Face models will not work.")

# Try to import Hugging Face Inference API (free tier, no billing)
try:
    from huggingface_hub import InferenceClient
    HF_API_AVAILABLE = True
except ImportError:
    HF_API_AVAILABLE = False
    print("⚠️  huggingface_hub not installed. HF Inference API will not work.")

class VoiceAgent:
    """Voice agent with free local STT/TTS models and Hugging Face AI"""
    
    def __init__(self):
        """Initialize Whisper (STT), pyttsx3 (TTS), and Hugging Face models"""
        self.whisper_model = None
        self.tts_engine = None
        self.hf_stt_pipeline = None
        self.hf_tts_pipeline = None
        self.hf_text_generation_pipeline = None  # For generating clean answers
        self.hf_api_client = None
        
        # Use Hugging Face models if available (free, local)
        self.use_hf_models = False
        
        # Initialize Hugging Face Inference API (free tier, optional token)
        if HF_API_AVAILABLE:
            try:
                hf_token = os.getenv('HUGGINGFACE_API_TOKEN')
                if hf_token:
                    self.hf_api_client = InferenceClient(token=hf_token)
                    print("✅ Hugging Face Inference API initialized (free tier)")
                    self.use_hf_models = True
                else:
                    print("ℹ️  No HUGGINGFACE_API_TOKEN found. Using local models.")
            except Exception as e:
                print(f"⚠️  Failed to initialize HF API: {e}")
        
        # Initialize Hugging Face local models (free, no API key needed)
        if HF_AVAILABLE and not self.use_hf_models:
            try:
                print("📥 Loading Hugging Face models (this may take a moment on first run)...")
                # Using OpenAI Whisper Small from Hugging Face
                # Model: openai/whisper-small (free, lightweight, good accuracy)
                device = "cuda" if torch.cuda.is_available() else "cpu"
                print(f"   Using device: {device}")
                
                # Load STT pipeline with OpenAI Whisper Small
                try:
                    print("   Loading OpenAI Whisper Small model from Hugging Face...")
                    self.hf_stt_pipeline = pipeline(
                        "automatic-speech-recognition",
                        model="openai/whisper-small",  # OpenAI Whisper Small from Hugging Face
                        device=device,
                        chunk_length_s=30,  # Process in 30s chunks for better performance
                    )
                    print("✅ OpenAI Whisper Small (Hugging Face) STT model loaded")
                except Exception as e:
                    print(f"⚠️  Failed to load Whisper Small model: {e}")
                
                # Try to load TTS pipeline
                try:
                    self.hf_tts_pipeline = pipeline(
                        "text-to-speech",
                        model="microsoft/speecht5_tts",  # Free, lightweight
                        device=device
                    )
                    print("✅ Hugging Face TTS model loaded")
                except Exception as e:
                    print(f"⚠️  Failed to load HF TTS: {e}")
                
                # Try to load text generation model for synthesizing answers
                try:
                    print("   Loading Hugging Face text generation model...")
                    # Use FLAN-T5-small for fast, good quality text generation
                    self.hf_text_generation_pipeline = pipeline(
                        "text2text-generation",
                        model="google/flan-t5-small",  # Small, fast, good for Q&A
                        device=device
                    )
                    print("✅ Hugging Face text generation model loaded")
                except Exception as e:
                    print(f"⚠️  Failed to load HF text generation model: {e}")
                
                if self.hf_stt_pipeline or self.hf_tts_pipeline or self.hf_text_generation_pipeline:
                    self.use_hf_models = True
                    
            except Exception as e:
                print(f"⚠️  Failed to initialize HF models: {e}")
        
        # Initialize Whisper for STT (free, local) - fallback
        if not self.use_hf_models and WHISPER_AVAILABLE:
            try:
                print("📥 Loading Whisper model (this may take a moment on first run)...")
                # Use base model (smaller, faster) - options: tiny, base, small, medium, large
                self.whisper_model = whisper.load_model("base")
                print("✅ Whisper STT model loaded")
            except Exception as e:
                print(f"⚠️  Failed to load Whisper model: {e}")
        
        # Initialize pyttsx3 for TTS (free, uses OS TTS) - fallback
        if not self.use_hf_models and PYTTSX3_AVAILABLE:
            try:
                self.tts_engine = pyttsx3.init()
                # Set properties
                self.tts_engine.setProperty('rate', 150)  # Speed
                self.tts_engine.setProperty('volume', 0.9)  # Volume
                print("✅ pyttsx3 TTS engine initialized")
            except Exception as e:
                print(f"⚠️  Failed to initialize pyttsx3: {e}")
        
    def transcribe_audio(self, audio_file) -> str:
        """
        Transcribe audio to text using Hugging Face or Whisper (free, local)
        
        Args:
            audio_file: File-like object or path to audio file
            
        Returns:
            str: Transcribed text
        """
        try:
            # Save audio to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as tmp_file:
                if hasattr(audio_file, 'read'):
                    tmp_file.write(audio_file.read())
                else:
                    tmp_file.write(audio_file)
                tmp_path = tmp_file.name
            
            # Try Hugging Face Inference API first (if available)
            if self.hf_api_client:
                try:
                    print("🎤 Transcribing using Hugging Face Inference API...")
                    with open(tmp_path, 'rb') as f:
                        audio_data = f.read()
                    result = self.hf_api_client.automatic_speech_recognition(audio_data)
                    # Handle different return formats
                    if isinstance(result, dict):
                        transcript = result.get('text', '').strip()
                    else:
                        transcript = str(result).strip()
                    os.unlink(tmp_path)
                    print(f"✅ Transcribed (HF API): {transcript}")
                    return transcript
                except Exception as e:
                    print(f"⚠️  HF API error: {e}. Trying local models...")
            
            # Try Hugging Face local model (OpenAI Whisper Small)
            if self.hf_stt_pipeline:
                try:
                    print("🎤 Transcribing using OpenAI Whisper Small (Hugging Face)...")
                    result = self.hf_stt_pipeline(tmp_path)
                    # Handle different return formats
                    if isinstance(result, dict):
                        transcript = result.get('text', '').strip()
                    else:
                        transcript = str(result).strip()
                    os.unlink(tmp_path)
                    print(f"✅ Transcribed (Whisper Small from HF): {transcript}")
                    return transcript
                except Exception as e:
                    print(f"⚠️  Whisper Small (HF) error: {e}. Trying fallback...")
            
            # Fallback to Whisper
            if self.whisper_model:
                print("🎤 Transcribing using Whisper...")
                result = self.whisper_model.transcribe(tmp_path, language="en")
                transcript = result["text"].strip()
                os.unlink(tmp_path)
                print(f"✅ Transcribed (Whisper): {transcript}")
                return transcript
            
            # Clean up if not processed
            os.unlink(tmp_path)
            raise Exception("No STT model available. Please install openai-whisper or transformers.")
            
        except Exception as e:
            print(f"❌ Transcription error: {e}")
            raise Exception(f"Failed to transcribe audio: {str(e)}")
    
    def text_to_speech(self, text: str) -> bytes:
        """
        Convert text to speech using Hugging Face or pyttsx3 (free)
        Returns audio as bytes (WAV format)
        
        Args:
            text: Text to convert to speech
            
        Returns:
            bytes: Audio data in WAV format
        """
        try:
            print(f"🔊 Converting text to speech: {text[:50]}...")
            
            # Try Hugging Face Inference API first (if available)
            if self.hf_api_client:
                try:
                    print("   Using Hugging Face Inference API...")
                    result = self.hf_api_client.text_to_speech(text)
                    # HF API returns audio bytes (or base64 encoded)
                    if isinstance(result, bytes):
                        audio_data = result
                    elif isinstance(result, dict):
                        audio_data = result.get('audio', result.get('data', b''))
                    else:
                        # If it's a string, might be base64
                        import base64
                        audio_data = base64.b64decode(result)
                    print(f"✅ Generated audio (HF API) ({len(audio_data)} bytes)")
                    return audio_data
                except Exception as e:
                    print(f"⚠️  HF API TTS error: {e}. Trying local models...")
            
            # Try Hugging Face local model
            if self.hf_tts_pipeline:
                try:
                    print("   Using Hugging Face local TTS model...")
                    # Hugging Face TTS pipeline returns audio array and sampling rate
                    result = self.hf_tts_pipeline(text)
                    # Handle different return formats
                    if isinstance(result, dict):
                        audio_array = result.get("audio", result.get("raw"))
                        sampling_rate = result.get("sampling_rate", 16000)
                    elif isinstance(result, tuple):
                        audio_array, sampling_rate = result
                    else:
                        audio_array = result
                        sampling_rate = 16000
                    
                    # Convert to WAV bytes
                    import soundfile as sf
                    import io
                    import numpy as np
                    wav_buffer = io.BytesIO()
                    # Ensure audio is numpy array
                    if not isinstance(audio_array, np.ndarray):
                        audio_array = np.array(audio_array)
                    sf.write(wav_buffer, audio_array, sampling_rate, format='WAV')
                    audio_data = wav_buffer.getvalue()
                    print(f"✅ Generated audio (HF local) ({len(audio_data)} bytes)")
                    return audio_data
                except Exception as e:
                    print(f"⚠️  HF local TTS error: {e}. Trying pyttsx3...")
            
            # Fallback to pyttsx3
            if self.tts_engine:
                # Save to temporary WAV file
                with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
                    tmp_path = tmp_file.name
                
                # Generate speech and save to file
                self.tts_engine.save_to_file(text, tmp_path)
                self.tts_engine.runAndWait()
                
                # Read the generated audio file
                with open(tmp_path, 'rb') as f:
                    audio_data = f.read()
                
                # Clean up temp file
                os.unlink(tmp_path)
                
                print(f"✅ Generated audio (pyttsx3) ({len(audio_data)} bytes)")
                return audio_data
            
            raise Exception("No TTS engine available. Please install pyttsx3 or transformers.")
            
        except Exception as e:
            print(f"❌ TTS error: {e}")
            raise Exception(f"Failed to convert text to speech: {str(e)}")
    
    def generate_response(self, user_query: str) -> str:
        """
        Generate response to user query
        
        Tries: Hugging Face Text Generation -> Hugging Face API -> Simple responses
        
        Args:
            user_query: User's question/query as text
            
        Returns:
            str: AI-generated or simple response
        """
        # Try Hugging Face local text generation model (if available)
        if self.hf_text_generation_pipeline:
            try:
                print(f"🤖 Generating AI response using Hugging Face text generation model...")
                
                # Use FLAN-T5 to generate direct answer
                prompt = f"Question: {user_query}\nAnswer:"
                
                generated = self.hf_text_generation_pipeline(
                    prompt,
                    max_length=150,
                    do_sample=False,
                    num_beams=2,
                    early_stopping=True
                )
                
                answer = generated[0]['generated_text'].strip()
                if answer and len(answer) > 10:
                    # Clean up the answer
                    import re
                    answer = re.sub(r'^Answer:\s*', '', answer, flags=re.IGNORECASE)
                    answer = answer.strip()
                    if answer:
                        ai_response = answer
                        print(f"✅ Generated answer using HF text generation: {ai_response[:100]}...")
                        return ai_response
                        
            except Exception as e:
                print(f"⚠️  Hugging Face text generation error: {e}. Trying Hugging Face API...")
                # Fall through to Hugging Face API
        
        # Try Hugging Face Inference API for text generation (if available)
        if self.hf_api_client:
            try:
                print(f"🤖 Generating AI response using Hugging Face...")
                
                prompt = f"You are a helpful AI assistant. Answer questions clearly and concisely.\n\nUser: {user_query}\n\nAssistant:"
                
                # Use a free text generation model from Hugging Face
                response = self.hf_api_client.text_generation(
                    prompt,
                    max_new_tokens=200,
                    temperature=0.7,
                    return_full_text=False
                )
                
                ai_response = response.strip()
                print(f"✅ Generated AI response (Hugging Face): {ai_response[:100]}...")
                return ai_response
                
            except Exception as e:
                print(f"⚠️  Hugging Face API error: {e}. Falling back to simple response.")
                # Fall through to simple response
        
        # Simple fallback responses (no API needed, no billing)
        print(f"💬 Generating simple response for: {user_query}")
        return self._generate_simple_response(user_query)
    
    def _generate_simple_response(self, user_query: str) -> str:
        """
        Generate simple responses without any AI API
        (No billing required)
        """
        query_lower = user_query.lower()
        
        # Greeting responses
        if any(word in query_lower for word in ['hello', 'hi', 'hey', 'greetings']):
            return "Hello! How can I help you today?"
        
        # Question about the system
        if any(word in query_lower for word in ['what', 'who', 'how', 'where', 'when', 'why']):
            if 'you' in query_lower or 'your' in query_lower:
                return "I'm a voice assistant for the news agent application. I can help you with questions, though my responses are simple without an AI API key."
            return f"You asked: {user_query}. I'm a simple voice assistant. For AI-powered responses, I use Hugging Face models (free and local)."
        
        # News-related queries
        if any(word in query_lower for word in ['news', 'article', 'story', 'headline']):
            return "For news articles, please use the news search feature on the main page. I can help with general questions!"
        
        # Math queries
        if any(word in query_lower for word in ['calculate', 'math', 'plus', 'minus', 'times', 'divide']):
            return "I can help with basic questions, but for calculations, please use a calculator. I'm designed to be a simple conversational assistant."
        
        # Time/date queries
        if any(word in query_lower for word in ['time', 'date', 'today', 'now']):
            from datetime import datetime
            now = datetime.now()
            return f"The current date and time is {now.strftime('%B %d, %Y at %I:%M %p')}."
        
        # Default response
        return f"I heard you say: '{user_query}'. I'm a simple voice assistant. For AI-powered responses, I use Hugging Face models (free and local)."
