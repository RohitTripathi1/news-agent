from scraper import NewsScraper

scraper = NewsScraper()
print("Fetching news articles (this may take a while)...")
articles = scraper.fetch_all_articles(max_articles_per_source=3)  # Limit for fast testing

print(f"Total articles fetched: {len(articles)}\n")
for i, article in enumerate(articles[:5], 1):  # Just show a few for preview
    print(f"{i}. {article['title']}")
    print(f"Source: {article['source']}")
    print(f"URL: {article['url']}")
    print(f"Published: {article['published']}")
    print(f"Summary: {article['summary'][:140]}...")
    print(f"Full Content (first 300 chars): {article['full_content'][:300] if article['full_content'] else '[None]'}\n")
    print("="*80)
