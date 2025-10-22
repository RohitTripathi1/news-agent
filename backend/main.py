from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import asyncio
from scraper import NewsScraper

app = FastAPI(title="News Agent API", version="1.0.0")

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

# Initialize scraper
scraper = NewsScraper()

@app.get("/")
async def root():
    return {"message": "News Agent API is running!"}

@app.post("/api/get-news", response_model=NewsResponse)
async def get_news(request: NewsRequest):
    try:
        # Extract parameters
        location = request.location
        topics = [topic.name for topic in request.topics]
        
        # Parse time range from value field (e.g., "24h", "7d", "30d")
        time_range_hours = 24  # default
        if request.timeRange:
            value = request.timeRange.value
            if value.endswith('h'):
                time_range_hours = int(value[:-1])
            elif value.endswith('d'):
                time_range_hours = int(value[:-1]) * 24
            elif value.endswith('w'):
                time_range_hours = int(value[:-1]) * 24 * 7
        
        # Calculate time range
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=time_range_hours)
        
        print(f"Scraping news for location: {location.city if location else 'Global'}, topics: {topics}, time range: {time_range_hours}h")
        
        # Scrape news
        articles = await scraper.scrape_news(
            location=location,
            topics=topics,
            start_time=start_time,
            end_time=end_time
        )
        
        # Convert to response format
        news_articles = []
        for article in articles:
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
            total_count=len(news_articles),
            message=f"Found {len(news_articles)} articles"
        )
        
    except Exception as e:
        print(f"Error in get_news: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching news: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
