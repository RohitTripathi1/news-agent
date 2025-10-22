import os
import json
from typing import List, Dict, Any
from datetime import datetime, timedelta
from tavily import TavilyClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class NewsAIAgent:
    def __init__(self):
        # Initialize Tavily client
        self.tavily_client = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))
    
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
    
    def process_articles_simple(self, articles: List[Dict]) -> List[Dict]:
        """Simple processing without AI - just clean and format articles"""
        
        processed_articles = []
        
        for article in articles:
            try:
                # Clean and format article
                processed_article = {
                    "title": article.get('title', 'No title'),
                    "url": article.get('url', ''),
                    "source": self.extract_source_name(article.get('url', '')),
                    "published_at": article.get('published_date', ''),
                    "summary": article.get('content', '')[:200] + "..." if len(article.get('content', '')) > 200 else article.get('content', ''),
                    "content": article.get('content', ''),
                    "relevance_score": 0.8  # Default score
                }
                
                processed_articles.append(processed_article)
                
            except Exception as e:
                print(f"❌ Error processing article: {e}")
                continue
        
        print(f"✅ Processed {len(processed_articles)} articles")
        return processed_articles
    
    def extract_source_name(self, url: str) -> str:
        """Extract source name from URL"""
        try:
            if not url:
                return "Unknown"
            
            # Remove protocol and www
            domain = url.replace('https://', '').replace('http://', '').replace('www.', '')
            
            # Get the main domain
            domain_parts = domain.split('/')[0].split('.')
            
            if len(domain_parts) >= 2:
                return domain_parts[-2].title()
            else:
                return domain_parts[0].title()
                
        except:
            return "Unknown"
    
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
            
            # Step 3: Process articles (simple version)
            processed_articles = self.process_articles_simple(search_results)
            
            # Step 4: Format response
            return {
                "articles": processed_articles,
                "total_count": len(processed_articles),
                "message": f"Found {len(processed_articles)} relevant articles using web search"
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
    
    if result['articles']:
        print(f"📰 First article: {result['articles'][0]['title']}")
