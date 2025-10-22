import os
import json
from typing import List, Dict, Any
from datetime import datetime, timedelta
from openai import OpenAI
from tavily import TavilyClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class NewsAIAgent:
    def __init__(self):
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Initialize Tavily client
        self.tavily_client = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))
        
        # AI model to use
        self.model = "gpt-3.5-turbo"
    
    def create_search_query(self, location: Dict, topics: List[Dict], time_range: Dict) -> str:
        """Create an intelligent search query based on user input"""
        
        # Extract location info
        location_str = ""
        if location:
            city = location.get('city', '')
            state = location.get('state', '')
            country = location.get('country', '')
            if city and state:
                location_str = f"{city}, {state}"
            elif city:
                location_str = city
            elif country:
                location_str = country
        
        # Extract topics
        topic_names = [topic.get('name', '') for topic in topics if topic.get('name')]
        topics_str = ", ".join(topic_names) if topic_names else "news"
        
        # Extract time range
        time_str = ""
        if time_range:
            time_value = time_range.get('value', '')
            if time_value == '1h':
                time_str = "last hour"
            elif time_value == '24h':
                time_str = "last 24 hours"
            elif time_value == '7d':
                time_str = "last week"
            elif time_value == '30d':
                time_str = "last month"
        
        # Create the search query
        query_parts = []
        if location_str:
            query_parts.append(f"{location_str}")
        if topics_str:
            query_parts.append(f"{topics_str}")
        if time_str:
            query_parts.append(f"{time_str}")
        
        query = " ".join(query_parts) + " news"
        return query
    
    def search_news(self, query: str, max_results: int = 20) -> List[Dict]:
        """Search for news using Tavily API"""
        try:
            print(f"🔍 Searching for: {query}")
            
            # Search using Tavily
            search_results = self.tavily_client.search(
                query=query,
                search_depth="basic",
                max_results=max_results,
                include_domains=[],
                exclude_domains=[]
            )
            
            print(f"✅ Found {len(search_results.get('results', []))} search results")
            return search_results.get('results', [])
            
        except Exception as e:
            print(f"❌ Tavily search error: {e}")
            return []
    
    def process_articles_with_ai(self, articles: List[Dict], user_preferences: Dict) -> List[Dict]:
        """Process articles using AI to filter, score, and summarize"""
        
        if not articles:
            return []
        
        try:
            # Prepare articles for AI processing
            articles_text = ""
            for i, article in enumerate(articles[:10]):  # Limit to first 10 for AI processing
                articles_text += f"""
Article {i+1}:
Title: {article.get('title', 'No title')}
Content: {article.get('content', 'No content')[:500]}...
URL: {article.get('url', 'No URL')}
Published: {article.get('published_date', 'Unknown')}
---
"""
            
            # Create AI prompt
            prompt = f"""
You are a news processing AI agent. Process these articles and return ONLY the most relevant, high-quality news articles.

User Preferences:
- Location: {user_preferences.get('location', 'Any')}
- Topics: {user_preferences.get('topics', 'Any')}
- Time Range: {user_preferences.get('time_range', 'Any')}

Articles to process:
{articles_text}

Instructions:
1. Filter out low-quality, irrelevant, or spam articles
2. Keep only recent, relevant news articles
3. For each article, provide:
   - title: Clean, readable title
   - summary: 2-3 sentence summary
   - relevance_score: 0.0 to 1.0 (how relevant to user)
   - published_at: Clean date format
   - source: Clean source name
   - url: Original URL
   - content: First 200 words of content

Return ONLY a JSON array of processed articles. No other text.
"""
            
            # Call OpenAI
            response = self.openai_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a news processing AI agent. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.3
            )
            
            # Parse AI response
            ai_response = response.choices[0].message.content.strip()
            
            # Try to extract JSON from response
            try:
                # Find JSON array in the response
                start_idx = ai_response.find('[')
                end_idx = ai_response.rfind(']') + 1
                if start_idx != -1 and end_idx != -1:
                    json_str = ai_response[start_idx:end_idx]
                    processed_articles = json.loads(json_str)
                    print(f"✅ AI processed {len(processed_articles)} articles")
                    return processed_articles
                else:
                    print("❌ No JSON array found in AI response")
                    return []
            except json.JSONDecodeError as e:
                print(f"❌ JSON parsing error: {e}")
                print(f"AI Response: {ai_response}")
                return []
                
        except Exception as e:
            print(f"❌ AI processing error: {e}")
            return []
    
    def get_news(self, location: Dict, topics: List[Dict], time_range: Dict) -> Dict:
        """Main method to get processed news"""
        
        try:
            print("🤖 AI Agent starting news processing...")
            
            # Step 1: Create intelligent search query
            query = self.create_search_query(location, topics, time_range)
            print(f"📝 Generated query: {query}")
            
            # Step 2: Search for news using Tavily
            search_results = self.search_news(query, max_results=20)
            
            if not search_results:
                print("❌ No search results found")
                return {
                    "articles": [],
                    "total_count": 0,
                    "message": "No articles found"
                }
            
            # Step 3: Process articles with AI
            user_preferences = {
                "location": location,
                "topics": topics,
                "time_range": time_range
            }
            
            processed_articles = self.process_articles_with_ai(search_results, user_preferences)
            
            # Step 4: Format response
            return {
                "articles": processed_articles,
                "total_count": len(processed_articles),
                "message": f"Found {len(processed_articles)} relevant articles using AI processing"
            }
            
        except Exception as e:
            print(f"❌ AI Agent error: {e}")
            return {
                "articles": [],
                "total_count": 0,
                "message": f"Error: {str(e)}"
            }

# Test the AI agent
if __name__ == "__main__":
    agent = NewsAIAgent()
    
    # Test data
    test_location = {"city": "santa clara", "state": "California", "country": "USA"}
    test_topics = [{"id": "tech", "name": "Technology"}]
    test_time_range = {"value": "7d", "label": "Last Week"}
    
    print("🧪 Testing AI Agent...")
    result = agent.get_news(test_location, test_topics, test_time_range)
    print(f"📊 Result: {result['total_count']} articles found")
