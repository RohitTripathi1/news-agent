import feedparser
import requests
from datetime import datetime
from newspaper import Article

class NewsScraper:
    def __init__(self):
        self.indian_sources = {
            "times_of_india": "https://timesofindia.indiatimes.com/rssfeeds/1221656.cms",
            "hindustan_times": "https://www.hindustantimes.com/rss/topnews/rssfeed.xml",
            "the_hindu": "https://www.thehindu.com/news/national/feeder/default.rss",
            "indian_express": "https://indianexpress.com/section/india/feed/",
            "ndtv": "https://feeds.feedburner.com/ndtvnews-top-stories",
            "business_standard": "https://www.business-standard.com/rss/home_page_top_stories.cms"
        }
        
        # Location-specific keywords for Indian cities and states
        self.location_keywords = {
            "kanpur": ["kanpur", "kanpur nagar", "uttar pradesh", "up", "uttar pradesh"],
            "mumbai": ["mumbai", "maharashtra", "maharashtra", "bombay"],
            "delhi": ["delhi", "new delhi", "nct", "national capital"],
            "bangalore": ["bangalore", "bengaluru", "karnataka", "karnataka"],
            "chennai": ["chennai", "madras", "tamil nadu", "tamilnadu"],
            "kolkata": ["kolkata", "calcutta", "west bengal", "west bengal"],
            "hyderabad": ["hyderabad", "telangana", "andhra pradesh"],
            "pune": ["pune", "maharashtra", "maharashtra"],
            "ahmedabad": ["ahmedabad", "gujarat", "gujarat"],
            "jaipur": ["jaipur", "rajasthan", "rajasthan"],
            "lucknow": ["lucknow", "uttar pradesh", "up", "uttar pradesh"],
            "bhopal": ["bhopal", "madhya pradesh", "mp", "madhya pradesh"],
            "patna": ["patna", "bihar", "bihar"],
            "chandigarh": ["chandigarh", "punjab", "punjab", "haryana"],
            "kochi": ["kochi", "cochin", "kerala", "kerala"],
            "indore": ["indore", "madhya pradesh", "mp", "madhya pradesh"],
            "coimbatore": ["coimbatore", "tamil nadu", "tamilnadu"],
            "vadodara": ["vadodara", "baroda", "gujarat", "gujarat"],
            "nagpur": ["nagpur", "maharashtra", "maharashtra"],
            "visakhapatnam": ["visakhapatnam", "vizag", "andhra pradesh"],
            # International locations
            "santa clara": ["santa clara", "california", "san francisco bay area", "silicon valley", "bay area"],
            "san francisco": ["san francisco", "sf", "california", "bay area"],
            "new york": ["new york", "nyc", "manhattan", "brooklyn", "queens", "bronx", "staten island"],
            "los angeles": ["los angeles", "la", "california", "hollywood", "beverly hills"],
            "chicago": ["chicago", "illinois", "windy city"],
            "london": ["london", "england", "uk", "united kingdom", "britain"],
            "paris": ["paris", "france", "french"],
            "tokyo": ["tokyo", "japan", "japanese"],
            "sydney": ["sydney", "australia", "australian"],
            "toronto": ["toronto", "canada", "canadian", "ontario"],
            "berlin": ["berlin", "germany", "german"],
            "singapore": ["singapore", "singaporean"],
            "dubai": ["dubai", "uae", "united arab emirates"],
            "mumbai": ["mumbai", "maharashtra", "bombay", "india"],
            "delhi": ["delhi", "new delhi", "nct", "national capital", "india"]
        }
        self.global_sources = {
            "bbc_world": "http://feeds.bbci.co.uk/news/world/rss.xml",
            "cnn": "http://rss.cnn.com/rss/edition.rss",
            "reuters": "https://feeds.reuters.com/reuters/topNews",
            "guardian_world": "https://www.theguardian.com/world/rss",
            "aljazeera": "https://www.aljazeera.com/xml/rss/all.xml",
            "nyt_world": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
            "fox_news": "https://moxie.foxnews.com/google-publisher/world.xml",
            "dw_world": "https://rss.dw.com/rdf/rss-en-all",
            # US-specific sources
            "bbc_us": "http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
            "cnn_us": "http://rss.cnn.com/rss/edition_us.rss",
            "reuters_us": "https://feeds.reuters.com/reuters/domesticNews",
            "guardian_us": "https://www.theguardian.com/us-news/rss",
            "nyt_us": "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
            "npr_us": "https://feeds.npr.org/1001/rss.xml",
            "abc_us": "https://abcnews.go.com/abcnews/topstories",
            "cbs_us": "https://www.cbsnews.com/latest/rss/main",
            "nbc_us": "https://feeds.nbcnews.com/nbcnews/public/news",
            "usa_today": "https://rssfeeds.usatoday.com/usatoday-NewsTopStories"
        }
        # Removed Google News feeds as they're being blocked
        # Using alternative reliable sources instead
        self.alternative_sources = {
            "newsapi_india": "https://newsapi.org/v2/top-headlines?country=in&apiKey=YOUR_API_KEY",  # Requires API key
            "indian_news_aggregator": "https://feeds.feedburner.com/ndtvnews-india",
            "reuters_india": "https://feeds.reuters.com/reuters/INtopNews",
        }
        
        # Location-specific RSS feeds
        self.location_specific_feeds = {
            "uttar_pradesh": "https://timesofindia.indiatimes.com/rssfeeds/2886704.cms",  # UP news
            "kanpur": "https://timesofindia.indiatimes.com/rssfeeds/2886704.cms",  # UP news (covers Kanpur)
            "maharashtra": "https://timesofindia.indiatimes.com/rssfeeds/2886704.cms",  # Maharashtra news
            "mumbai": "https://timesofindia.indiatimes.com/rssfeeds/2886704.cms",  # Mumbai news
            "delhi": "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Delhi news
            "bangalore": "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Bangalore news
            "chennai": "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Chennai news
            "kolkata": "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Kolkata news
        }
        
        # Additional local news sources for better coverage
        self.local_news_sources = {
            "kanpur": [
                "https://timesofindia.indiatimes.com/rssfeeds/2886704.cms",  # UP news
                "https://www.hindustantimes.com/rss/india/rssfeed.xml",  # Hindustan Times India
                "https://indianexpress.com/section/india/feed/",  # Indian Express India
                "https://www.dailypioneer.com/rss/rss.xml",  # Pioneer (UP coverage)
                "https://www.amarujala.com/rss/uttar-pradesh.xml",  # Amar Ujala UP
                "https://www.jagran.com/rss/uttar-pradesh.xml",  # Dainik Jagran UP
                "https://www.bhaskar.com/rss/uttar-pradesh.xml",  # Dainik Bhaskar UP
                "https://feeds.feedburner.com/ndtvnews-india",  # NDTV India
                "https://feeds.reuters.com/reuters/INtopNews",  # Reuters India
            ],
            "mumbai": [
                "https://timesofindia.indiatimes.com/rssfeeds/2886704.cms",  # Maharashtra news
                "https://www.hindustantimes.com/rss/mumbai/rssfeed.xml",  # Mumbai specific
                "https://www.mid-day.com/rss.xml",  # Mid Day Mumbai
                "https://www.dnaindia.com/rss/mumbai.xml",  # DNA Mumbai
                "https://www.freepressjournal.in/rss/mumbai.xml",  # Free Press Journal Mumbai
            ],
            "delhi": [
                "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Delhi news
                "https://www.hindustantimes.com/rss/delhi/rssfeed.xml",  # Delhi specific
                "https://www.dnaindia.com/rss/delhi.xml",  # DNA Delhi
                "https://www.mid-day.com/rss.xml",  # Mid Day Delhi
                "https://www.thehindu.com/news/cities/Delhi/rssfeeds/2886704.cms",  # Hindu Delhi
            ],
            "bangalore": [
                "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Bangalore news
                "https://www.hindustantimes.com/rss/bangalore/rssfeed.xml",  # Bangalore specific
                "https://www.deccanherald.com/rss.xml",  # Deccan Herald
                "https://www.thehindu.com/news/cities/bangalore/rssfeeds/2886704.cms",  # Hindu Bangalore
            ],
            "chennai": [
                "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Chennai news
                "https://www.hindustantimes.com/rss/chennai/rssfeed.xml",  # Chennai specific
                "https://www.thehindu.com/news/cities/chennai/rssfeeds/2886704.cms",  # Hindu Chennai
                "https://www.dtnext.in/rss.xml",  # DT Next Chennai
            ],
            "kolkata": [
                "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Kolkata news
                "https://www.hindustantimes.com/rss/kolkata/rssfeed.xml",  # Kolkata specific
                "https://www.telegraphindia.com/rss.xml",  # Telegraph Kolkata
                "https://www.anandabazar.com/rss.xml",  # Anandabazar Patrika
            ],
            "hyderabad": [
                "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Hyderabad news
                "https://www.hindustantimes.com/rss/hyderabad/rssfeed.xml",  # Hyderabad specific
                "https://www.thehindu.com/news/cities/hyderabad/rssfeeds/2886704.cms",  # Hindu Hyderabad
                "https://www.deccanchronicle.com/rss.xml",  # Deccan Chronicle
            ],
            "pune": [
                "https://timesofindia.indiatimes.com/rssfeeds/2886704.cms",  # Maharashtra news
                "https://www.hindustantimes.com/rss/pune/rssfeed.xml",  # Pune specific
                "https://www.sakaltimes.com/rss.xml",  # Sakal Times Pune
                "https://www.loksatta.com/rss.xml",  # Loksatta Pune
            ],
            "ahmedabad": [
                "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Ahmedabad news
                "https://www.hindustantimes.com/rss/ahmedabad/rssfeed.xml",  # Ahmedabad specific
                "https://www.gujaratsamachar.com/rss.xml",  # Gujarat Samachar
                "https://www.divyabhaskar.co.in/rss.xml",  # Divya Bhaskar Gujarat
            ],
            "jaipur": [
                "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",  # Jaipur news
                "https://www.hindustantimes.com/rss/jaipur/rssfeed.xml",  # Jaipur specific
                "https://www.patrika.com/rss.xml",  # Rajasthan Patrika
                "https://www.dainikbhaskar.com/rss/rajasthan.xml",  # Dainik Bhaskar Rajasthan
            ]
        }

    async def scrape_news(self, location=None, topics=None, start_time=None, end_time=None):
        """Main method to scrape news based on location, topics, and time range"""
        print("Starting news scraping...")
        
        # Include location-specific feeds if location is provided
        if location and location.city:
            city_lower = location.city.lower().strip()
            print(f"Fetching location-specific news for: {city_lower}")
            
            # Check if we have local sources for this location
            if city_lower in self.local_news_sources:
                articles = self.fetch_all_articles(max_articles_per_source=3, include_location_feeds=True, location=city_lower)
            else:
                # For international locations, use global sources with more articles
                print(f"No local sources for {city_lower}, using global sources")
                articles = self.fetch_all_articles(max_articles_per_source=5)
        else:
            articles = self.fetch_all_articles(max_articles_per_source=3)
        
        print(f"Fetched {len(articles)} articles from RSS feeds")
        
        # Filter articles based on time range if provided
        if start_time and end_time:
            filtered_articles = []
            for article in articles:
                try:
                    # Parse published date
                    published_str = article.get('published', '')
                    if published_str:
                        # Try to parse various date formats
                        from dateutil import parser
                        published_date = parser.parse(published_str)
                        if start_time <= published_date <= end_time:
                            filtered_articles.append(article)
                except:
                    # If date parsing fails, include the article
                    filtered_articles.append(article)
            articles = filtered_articles
            print(f"After time filtering: {len(articles)} articles")
        else:
            print("No time range provided, skipping time filtering")
        
        # Filter by topics if provided
        if topics and len(topics) > 0:
            topic_filtered = []
            for article in articles:
                title_lower = (article.get('title') or '').lower()
                summary_lower = (article.get('summary') or '').lower()
                content_lower = (article.get('full_content') or '').lower()
                
                # Check if any topic matches
                for topic in topics:
                    if topic and topic.strip():  # Check if topic is not None/empty
                        topic_lower = topic.lower().strip()
                        
                        # Special handling for "General News" - include all articles
                        if topic_lower in ['general news', 'general']:
                            topic_filtered.append(article)
                            break
                        # For other topics, check if they appear in title/summary/content
                        elif (topic_lower in title_lower or 
                              topic_lower in summary_lower or 
                              topic_lower in content_lower):
                            topic_filtered.append(article)
                            break
            articles = topic_filtered
            print(f"After topic filtering: {len(articles)} articles")
        else:
            print("No topics provided, returning all articles")
        
        # Filter by location if provided
        if location and location.city:
            location_filtered = []
            city_lower = location.city.lower().strip()
            
            # Get location keywords for the city
            location_keywords = self.location_keywords.get(city_lower, [city_lower])
            
            # For international locations, be more lenient with filtering
            is_international = city_lower not in self.local_news_sources
            
            for article in articles:
                title_lower = (article.get('title') or '').lower()
                summary_lower = (article.get('summary') or '').lower()
                content_lower = (article.get('full_content') or '').lower()
                
                # Check if any location keyword appears in the article
                keyword_found = False
                for keyword in location_keywords:
                    if (keyword.lower() in title_lower or 
                        keyword.lower() in summary_lower or 
                        keyword.lower() in content_lower):
                        location_filtered.append(article)
                        keyword_found = True
                        break
                
                # For international locations, if no specific keywords found, 
                # include articles that might be relevant (less strict filtering)
                if is_international and not keyword_found:
                    # Include articles that mention the country or general region
                    country_keywords = []
                    if 'california' in city_lower or 'santa clara' in city_lower:
                        country_keywords = ['california', 'california', 'us', 'usa', 'united states', 'america']
                    elif 'new york' in city_lower:
                        country_keywords = ['new york', 'ny', 'us', 'usa', 'united states', 'america']
                    elif 'london' in city_lower:
                        country_keywords = ['london', 'england', 'uk', 'britain', 'united kingdom']
                    elif 'paris' in city_lower:
                        country_keywords = ['paris', 'france', 'french']
                    elif 'tokyo' in city_lower:
                        country_keywords = ['tokyo', 'japan', 'japanese']
                    
                    for country_keyword in country_keywords:
                        if (country_keyword in title_lower or 
                            country_keyword in summary_lower or 
                            country_keyword in content_lower):
                            location_filtered.append(article)
                            break
            
            articles = location_filtered
            print(f"After location filtering: {len(articles)} articles")
        else:
            print("No location provided, skipping location filtering")
        
        # Convert to the format expected by the API
        formatted_articles = []
        for article in articles:
            formatted_articles.append({
                'title': article.get('title', 'No title'),
                'url': article.get('url', ''),
                'source': article.get('source', 'Unknown'),
                'published_at': article.get('published', ''),
                'summary': article.get('summary', ''),
                'content': article.get('full_content', '')
            })
        
        print(f"Returning {len(formatted_articles)} formatted articles")
        return formatted_articles

    def fetch_all_articles(self, max_articles_per_source=5, include_location_feeds=False, location=None):
        all_sources = {**self.indian_sources, **self.global_sources}
        
        # Add location-specific feeds if requested
        if include_location_feeds and location:
            # Add local news sources for the location
            local_sources = self.local_news_sources.get(location.lower(), [])
            for i, feed_url in enumerate(local_sources):
                all_sources[f"{location}_local_{i}"] = feed_url
                print(f"Added local news source {i+1} for {location}")
            
            # Also add single location-specific feed if available
            location_feeds = self.location_specific_feeds.get(location.lower(), {})
            if location_feeds:
                all_sources[f"{location}_specific"] = location_feeds
                print(f"Added location-specific feed for {location}")
        
        articles = []
        for source_name, feed_url in all_sources.items():
            try:
                feed = feedparser.parse(feed_url)
                for entry in feed.entries[:max_articles_per_source]:
                    article_data = {
                        'source': source_name,
                        'title': entry.get('title', ''),
                        'url': entry.get('link', ''),
                        'published': entry.get('published', ''),
                        'summary': entry.get('summary', ''),
                        'full_content': entry.get('summary', '')  # Use summary as content for speed
                    }
                    articles.append(article_data)
            except Exception as e:
                print(f"Error fetching from {source_name}: {e}")
                continue
        return articles
