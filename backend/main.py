from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from ai_agent_simple import NewsAIAgent

app = FastAPI(title="News Agent API", version="1.0.0")

# Initialize AI Agent
ai_agent = NewsAIAgent()

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
