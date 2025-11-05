from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Optional
from ai_agent_simple import NewsAIAgent
from voice_agent import VoiceAgent

app = FastAPI(title="News Agent API", version="1.0.0")

# Initialize AI Agent
ai_agent = NewsAIAgent()

# Initialize Voice Agent
voice_agent = VoiceAgent()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class Location(BaseModel):
    city: str
    state: str
    country: str

class Topic(BaseModel):
    id: str
    name: str
    icon: str

class TimeRange(BaseModel):
    id: str
    label: str
    value: str
    description: str

class NewsRequest(BaseModel):
    location: Optional[Location] = None
    topics: List[Topic] = []
    timeRange: Optional[TimeRange] = None

class NewsArticle(BaseModel):
    title: str
    url: str
    source: str
    published_at: str
    summary: str
    content: str

class NewsResponse(BaseModel):
    articles: List[NewsArticle]
    total_count: int
    message: str

class VoiceQueryRequest(BaseModel):
    query: str


@app.get("/")
async def root():
    return {"message": "News Agent API is running!"}

@app.post("/api/get-news", response_model=NewsResponse)
async def get_news(request: NewsRequest):
    try:
        print("🚀 Starting AI-powered news search...")
        
        # Extract parameters and convert to dicts for AI agent
        location = request.location.dict() if request.location else None
        topics = [topic.dict() for topic in request.topics]
        time_range = request.timeRange.dict() if request.timeRange else None
        
        print(f"📍 Location: {location.get('city') if location else 'Global'}")
        print(f"📰 Topics: {[topic.get('name') for topic in topics]}")
        print(f"⏰ Time Range: {time_range.get('value') if time_range else 'Any'}")
        
        # Use AI Agent (Tavily + processing)
        print("🤖 Using AI Agent (Tavily search)...")
        ai_result = ai_agent.get_news(location, topics, time_range)
        
        if ai_result['total_count'] > 0:
            print(f"✅ AI Agent found {ai_result['total_count']} articles")
            
            # Convert AI result to NewsArticle objects
            news_articles = []
            for article in ai_result['articles']:
                news_articles.append(NewsArticle(
                    title=article.get('title', 'No title'),
                    url=article.get('url', ''),
                    source=article.get('source', 'Unknown'),
                    published_at=article.get('published_at', ''),
                    summary=article.get('summary', ''),
                    content=article.get('content', '')
                ))
            
            return NewsResponse(
                articles=news_articles,
                total_count=ai_result['total_count'],
                message=ai_result['message']
            )
        else:
            print("⚠️ AI Agent found no articles")
            return NewsResponse(
                articles=[],
                total_count=0,
                message="No articles found for your search criteria"
            )
        
    except Exception as e:
        print(f"❌ Error fetching news: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching news: {str(e)}")


# Voice Agent Endpoints

@app.post("/api/voice/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Transcribe audio to text using Whisper (free, local model)
    
    Args:
        audio: Audio file (webm, mp3, wav, etc.)
        
    Returns:
        JSON with transcript text
    """
    try:
        print(f"🎤 Transcribing audio using Whisper: {audio.filename}")
        
        transcript = voice_agent.transcribe_audio(audio.file)
        
        return {
            "success": True,
            "transcript": transcript
        }
        
    except Exception as e:
        print(f"❌ Transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


@app.post("/api/voice/tts")
async def text_to_speech(request: dict):
    """
    Convert text to speech using pyttsx3 (free, uses OS TTS)
    
    Args:
        request: JSON with 'text' field
        
    Returns:
        Audio file (WAV format)
    """
    try:
        text = request.get('text', '')
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        print(f"🔊 Converting text to speech: {text[:50]}...")
        
        audio_data = voice_agent.text_to_speech(text)
        
        return Response(
            content=audio_data,
            media_type="audio/wav"
        )
        
    except Exception as e:
        print(f"❌ TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")


@app.post("/api/voice/generate-response")
async def generate_voice_response(request: VoiceQueryRequest):
    """
    Generate AI response to user query (text)
    
    Can use browser Web Speech API (frontend) OR backend Whisper/pyttsx3
    This endpoint generates AI responses using Hugging Face models or simple fallback
    
    Args:
        request: VoiceQueryRequest with 'query' field containing user's text
        
    Returns:
        JSON with AI response text
    """
    try:
        user_query = request.query
        if not user_query:
            raise HTTPException(status_code=400, detail="Query is required")
        
        print(f"🤖 Generating AI response for: {user_query}")
        
        # Generate AI response (Hugging Face models or simple fallback)
        ai_response = voice_agent.generate_response(user_query)
        
        return {
            "success": True,
            "response": ai_response
        }
        
    except Exception as e:
        print(f"❌ Error generating response: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")


@app.post("/api/voice/complete-pipeline")
async def complete_voice_pipeline(audio: UploadFile = File(...)):
    """
    Complete voice pipeline: STT -> AI Response -> TTS
    Uses Whisper (STT) and pyttsx3 (TTS) - all free, local models
    
    Args:
        audio: Audio file with user's question
        
    Returns:
        Audio file (WAV) with AI response
    """
    try:
        print(f"🎤 Processing complete voice pipeline: {audio.filename}")
        
        # Step 1: Transcribe (Whisper)
        transcript = voice_agent.transcribe_audio(audio.file)
        
        # Step 2: Generate AI response
        ai_response = voice_agent.generate_response(transcript)
        
        # Step 3: Convert to speech (pyttsx3)
        audio_data = voice_agent.text_to_speech(ai_response)
        
        return Response(
            content=audio_data,
            media_type="audio/wav",
            headers={
                "X-Transcript": transcript,
                "X-Response": ai_response[:200]
            }
        )
        
    except Exception as e:
        print(f"❌ Voice pipeline error: {e}")
        raise HTTPException(status_code=500, detail=f"Voice pipeline failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
