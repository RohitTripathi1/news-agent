# 🤖 News Agent
**Agentic AI News Application with Voice Interface**

An intelligent news aggregation platform that uses AI agents to scrape, process, and deliver personalized news experiences.

---

## 🎯 Project Overview

This project combines web scraping with AI agents to create a personalized news experience. Users select their preferences (location, topics, time range, reading length) and the system delivers curated news with AI-powered insights.

---

## 🏗️ Tech Stack

### Frontend
- **React** + TypeScript + Vite
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

### Backend (To be implemented)
- **FastAPI** (Python)
- **LangChain** for AI agents
- **OpenAI API** (GPT-4o-mini)
- **Newspaper3k** for web scraping
- **SQLite/PostgreSQL** for data storage

---

## 🔄 Agentic AI Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                          │
│  [Location] [Topics] [Time Range] [Reading Time] [🎤 Voice] │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (React + TypeScript)                   │
│                                                              │
│  POST /api/search                                            │
│  {                                                           │
│    location: "Kanpur, UP, India",                           │
│    topics: ["AI", "Technology"],                            │
│    timeRange: "last_24h",                                   │
│    readingTime: "medium"                                    │
│  }                                                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API (FastAPI)                       │
│                                                              │
│  • Receive user preferences                                 │
│  • Initialize web scraping                                  │
│  • Pass to AI agent pipeline                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  WEB SCRAPING LAYER                          │
│                                                              │
│  Sources:                                                    │
│  ✓ NewsAPI.org                                              │
│  ✓ Google News RSS                                          │
│  ✓ Custom scrapers (Newspaper3k)                            │
│                                                              │
│  Output: 50-100 raw articles                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│             🤖 AI AGENT PIPELINE (LangChain)                 │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │  AGENT 1: Article Processing Agent           │           │
│  │  ────────────────────────────────────────    │           │
│  │  Input: 100 raw articles                     │           │
│  │                                               │           │
│  │  Tasks:                                       │           │
│  │  • Extract clean content (title, text, etc)  │           │
│  │  • Remove ads, navigation, popups            │           │
│  │  • Detect duplicates (same story)            │           │
│  │  • Filter spam/low-quality content           │           │
│  │  • Extract metadata (author, date, source)   │           │
│  │                                               │           │
│  │  Output: 40 clean, unique articles           │           │
│  └──────────────────┬───────────────────────────┘           │
│                     │                                        │
│                     ↓                                        │
│  ┌──────────────────────────────────────────────┐           │
│  │  AGENT 2: Recommendation Agent               │           │
│  │  ────────────────────────────────────────    │           │
│  │  Input: 40 clean articles + User Profile     │           │
│  │                                               │           │
│  │  Tasks:                                       │           │
│  │  • Score relevance (0-100) per article       │           │
│  │  • Compare with user preferences             │           │
│  │  • Check against reading history             │           │
│  │  • Apply personalization weights             │           │
│  │  • Rank articles by score                    │           │
│  │  • Suggest new topics                        │           │
│  │                                               │           │
│  │  Decision Making:                             │           │
│  │  - IF article score > 70 → Keep              │           │
│  │  - IF article score < 40 → Discard           │           │
│  │  - SORT by: relevance × quality × recency    │           │
│  │                                               │           │
│  │  Output: 15 highly relevant articles         │           │
│  └──────────────────┬───────────────────────────┘           │
│                     │                                        │
│                     ↓                                        │
│  ┌──────────────────────────────────────────────┐           │
│  │  AGENT 3: Voice Agent                        │           │
│  │  ────────────────────────────────────────    │           │
│  │  Input: 15 articles + Voice Commands         │           │
│  │                                               │           │
│  │  Tasks:                                       │           │
│  │  • Speech-to-Text (Whisper API)              │           │
│  │  • Parse voice queries                       │           │
│  │  • Generate audio summaries                  │           │
│  │  • Text-to-Speech (OpenAI TTS)               │           │
│  │  • Handle voice navigation                   │           │
│  │                                               │           │
│  │  Voice Commands:                              │           │
│  │  - "Read the top 3 articles"                 │           │
│  │  - "Summarize this article"                  │           │
│  │  - "Find news about [topic]"                 │           │
│  │  - "What's trending today?"                  │           │
│  │                                               │           │
│  │  Output: Audio briefing + Transcripts        │           │
│  └──────────────────────────────────────────────┘           │
│                                                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE STORAGE                          │
│                                                              │
│  Tables:                                                     │
│  • articles (cached scraped content)                        │
│  • user_preferences (location, topics, etc)                │
│  • user_interactions (clicks, reads, saves)                │
│  • recommendations (ML-generated suggestions)               │
│  • voice_history (transcripts, queries)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  RESPONSE TO FRONTEND                        │
│                                                              │
│  {                                                           │
│    "articles": [                                             │
│      {                                                       │
│        "id": 1,                                              │
│        "title": "AI Startup in Kanpur Raises $2M",          │
│        "summary": "...",                                     │
│        "source": "TechCrunch",                              │
│        "relevance_score": 95,                               │
│        "reading_time": "5 min",                             │
│        "audio_url": "/audio/article-1.mp3"                  │
│      },                                                      │
│      ...                                                     │
│    ],                                                        │
│    "briefing": "Today's top AI news from Kanpur...",       │
│    "recommendations": ["Machine Learning", "Startups"],     │
│    "total_found": 15                                         │
│  }                                                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    USER DISPLAY                              │
│                                                              │
│  📰 News Cards (with summaries)                             │
│  📊 Personalized Briefing                                   │
│  🎤 Voice Playback                                          │
│  💬 Chat Interface                                          │
│  🔖 Save/Share Options                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Agents Implementation Plan

### 1. 🧹 Article Processing Agent (Priority: MEDIUM)

**What it does:**
- Extracts clean data from scraped HTML
- Removes ads, popups, navigation elements
- Extracts: title, author, date, main content, images
- Detects and removes duplicate articles
- Filters out spam/low-quality content

**Implementation:**
```python
# backend/agents/processing_agent.py
from newspaper import Article
from langchain_openai import ChatOpenAI
from difflib import SequenceMatcher

class ArticleProcessingAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o-mini")
    
    def extract_article(self, url):
        """Extract clean article from URL"""
        article = Article(url)
        article.download()
        article.parse()
        
        return {
            'title': article.title,
            'author': article.authors,
            'date': article.publish_date,
            'content': article.text,
            'images': article.images,
            'summary': article.summary
        }
    
    def detect_duplicates(self, articles):
        """Find duplicate articles (same story, different source)"""
        seen = []
        unique = []
        
        for article in articles:
            is_duplicate = False
            for seen_article in seen:
                similarity = SequenceMatcher(
                    None, 
                    article['title'], 
                    seen_article['title']
                ).ratio()
                
                if similarity > 0.85:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                unique.append(article)
                seen.append(article)
        
        return unique
    
    def assess_quality(self, article):
        """Score article quality (0-100)"""
        prompt = f"""
        Assess article quality (0-100):
        - Well-written?
        - Credible sources?
        - Factual vs opinion?
        - Clickbait/sensationalism?
        
        Title: {article['title']}
        Content: {article['content'][:500]}
        
        Return just a number.
        """
        score = self.llm.invoke(prompt)
        return int(score)
```

---

### 2. 🎯 Recommendation Agent (Priority: HIGH)

**What it does:**
- Learns user preferences over time
- Suggests relevant topics/sources
- Personalizes news feed based on reading history
- Predicts what user will find interesting

**Implementation:**
```python
# backend/agents/recommendation_agent.py
from langchain.agents import create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

class RecommendationAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o-mini")
    
    def score_relevance(self, article, user_prefs):
        """Score article relevance (0-100)"""
        prompt = f"""
        Score this article's relevance (0-100) for the user.
        
        User Preferences:
        - Location: {user_prefs['location']}
        - Topics: {user_prefs['topics']}
        - Time Range: {user_prefs['time_range']}
        
        Article:
        Title: {article['title']}
        Content: {article['content'][:300]}
        
        Consider:
        - Geographic relevance
        - Topic match
        - Timeliness
        - User's past reading habits
        
        Return just a number 0-100.
        """
        score = self.llm.invoke(prompt)
        return int(score)
    
    def rank_articles(self, articles, user_profile):
        """Rank articles by relevance"""
        scored = []
        for article in articles:
            score = self.score_relevance(article, user_profile)
            if score > 70:  # Keep only highly relevant
                article['relevance_score'] = score
                scored.append(article)
        
        # Sort by score (highest first)
        return sorted(scored, key=lambda x: x['relevance_score'], reverse=True)
    
    def suggest_topics(self, user_history):
        """Recommend new topics based on reading history"""
        prompt = f"""
        User has read articles about: {user_history['topics']}
        
        Suggest 5 new related topics they might enjoy.
        Return as comma-separated list.
        """
        suggestions = self.llm.invoke(prompt)
        return suggestions.split(',')
```

**Database Schema:**
```sql
CREATE TABLE user_interactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    article_id INTEGER,
    action VARCHAR(50),  -- 'view', 'read', 'save', 'share'
    timestamp DATETIME,
    reading_time_seconds INTEGER
);

CREATE TABLE recommendations (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    recommended_topic VARCHAR(100),
    score FLOAT,
    created_at DATETIME
);
```

---

### 3. 🎤 Voice Agent (Priority: HIGH)

**What it does:**
- Speech-to-Text: User speaks their news preferences
- Text-to-Speech: Reads news articles aloud
- Voice commands for navigation
- Voice-based news briefings

**Implementation:**
```python
# backend/agents/voice_agent.py
from langchain_openai import ChatOpenAI
from openai import OpenAI
import os

class VoiceAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.llm = ChatOpenAI(model="gpt-4o-mini")
    
    def transcribe_voice(self, audio_file):
        """Convert speech to text using Whisper"""
        transcript = self.client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="en"
        )
        return transcript.text
    
    def parse_voice_query(self, transcript):
        """Extract user preferences from voice input"""
        prompt = f"""
        Extract search parameters from this voice query:
        "{transcript}"
        
        Return JSON:
        {{
          "location": "city, state, country or null",
          "topics": ["topic1", "topic2"],
          "time_range": "last_hour|last_24h|last_week|last_month",
          "intent": "search|read|summarize"
        }}
        """
        result = self.llm.invoke(prompt)
        return result  # Parse JSON
    
    def text_to_speech(self, text, voice="alloy"):
        """Convert text to speech"""
        response = self.client.audio.speech.create(
            model="tts-1",
            voice=voice,  # alloy, echo, fable, onyx, nova, shimmer
            input=text
        )
        return response.content
    
    def create_audio_briefing(self, articles):
        """Generate voice briefing from articles"""
        briefing_text = f"Here are your top {len(articles)} news stories. "
        
        for i, article in enumerate(articles[:5], 1):
            briefing_text += f"Story {i}: {article['title']}. "
            briefing_text += f"{article['summary']}. "
        
        audio = self.text_to_speech(briefing_text)
        return audio
```

**API Endpoints:**
```python
# backend/main.py
from fastapi import FastAPI, UploadFile, File

app = FastAPI()

@app.post("/api/voice/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Upload audio, get text transcript"""
    voice_agent = VoiceAgent()
    transcript = voice_agent.transcribe_voice(audio.file)
    return {"transcript": transcript}

@app.post("/api/voice/query")
async def voice_search(audio: UploadFile = File(...)):
    """Voice search for news"""
    voice_agent = VoiceAgent()
    transcript = voice_agent.transcribe_voice(audio.file)
    params = voice_agent.parse_voice_query(transcript)
    # Use params to search news
    return {"params": params}

@app.post("/api/voice/read-article")
async def text_to_speech(article_id: int):
    """Convert article to speech"""
    # Fetch article from database
    voice_agent = VoiceAgent()
    audio = voice_agent.text_to_speech(article['content'])
    return {"audio_url": "/audio/article-{}.mp3"}
```

**Voice Commands:**
- "Find me news about AI in my city"
- "Read the top 3 articles"
- "Summarize this article"
- "What's trending today?"
- "Show me technology news from last week"

---

## 📊 Agent Decision Flow

```
USER INPUT
    │
    ↓
┌───────────────────────────────────────┐
│  Is this a voice query?               │
│  ├─ YES → Voice Agent (transcribe)    │
│  └─ NO  → Use form inputs             │
└───────────┬───────────────────────────┘
            │
            ↓
┌───────────────────────────────────────┐
│  Scrape Articles (100 results)        │
└───────────┬───────────────────────────┘
            │
            ↓
┌───────────────────────────────────────┐
│  Processing Agent                     │
│  DECISIONS:                           │
│  • Quality score > 60? → Keep         │
│  • Duplicate? → Remove                │
│  • Has content? → Process             │
│  • Spam? → Discard                    │
└───────────┬───────────────────────────┘
            │ (40 articles)
            ↓
┌───────────────────────────────────────┐
│  Recommendation Agent                 │
│  DECISIONS:                           │
│  • Relevance score > 70? → Keep       │
│  • Matches user topics? → Boost score │
│  • In user location? → Boost score    │
│  • Recent history match? → Boost      │
└───────────┬───────────────────────────┘
            │ (15 articles)
            ↓
┌───────────────────────────────────────┐
│  Voice Agent (if requested)           │
│  DECISIONS:                           │
│  • "Read" command? → Generate audio   │
│  • "Summarize"? → Short summary       │
│  • "Briefing"? → Multi-article audio  │
└───────────┬───────────────────────────┘
            │
            ↓
      RETURN TO USER
```

---

## 🚀 Implementation Phases

### ✅ Phase 1: Frontend (COMPLETED)
- [x] Location selector with real-time search
- [x] Topic selector with multi-select
- [x] Time range selector
- [x] Reading time filter
- [x] Scraping robot animation
- [x] Welcome guide

### 🔄 Phase 2: Backend Setup (NEXT)
- [ ] FastAPI project setup
- [ ] Database schema (SQLite)
- [ ] Basic API routes
- [ ] Web scraping integration (Newspaper3k + NewsAPI)

### 🎯 Phase 3: AI Agents
- [ ] Article Processing Agent
- [ ] Recommendation Agent
- [ ] Voice Agent

### 🎨 Phase 4: Polish
- [ ] News cards display
- [ ] Recommendation UI
- [ ] Voice interface UI
- [ ] Testing & optimization

---

## 🛠️ Setup Instructions

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend (To be implemented)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

---

## 📝 Environment Variables

Create `.env` file in backend directory:

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# News Sources
NEWS_API_KEY=your_news_api_key

# Database
DATABASE_URL=sqlite:///./news.db

# Optional
GOOGLE_NEWS_RSS=https://news.google.com/rss
```

---

## 🎯 Core Features

1. **Smart News Aggregation** - Scrape from multiple sources
2. **AI-Powered Filtering** - Remove duplicates and spam  
3. **Personalized Recommendations** - Learn user preferences
4. **Voice Interface** - Speak your query, listen to results
5. **Quality Scoring** - Only show credible sources
6. **Reading Time Optimization** - Match user's available time

---

## 📚 Tech Resources

- [LangChain Documentation](https://python.langchain.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Newspaper3k](https://newspaper.readthedocs.io/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [NewsAPI](https://newsapi.org/docs)

---

## 📄 License

MIT License - Feel free to use for personal projects!

---

**Built with ❤️ by Rohit**
