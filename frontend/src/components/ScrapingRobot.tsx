import { useState } from 'react'
import { Loader2, Newspaper, ChevronRight, ChevronDown, MapPin, Calendar } from 'lucide-react'
import VoiceAgent from './VoiceAgent'

interface Article {
  title: string;
  url: string;
  source: string;
  published_at: string;
  summary: string;
  content: string;
}

interface NewsResults {
  articles: Article[];
  total_count: number;
  message: string;
}

interface ScrapingRobotProps {
  isVisible: boolean;
  isAnimating?: boolean;
  newsResults?: NewsResults | null;
}

export default function ScrapingRobot({ isVisible, isAnimating = false, newsResults }: ScrapingRobotProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState(false)

  if (!isVisible) return null

  // News list logic below...
  return (
    <div className="mt-8 space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors relative">
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📰 Generated News
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your personalized news articles will appear here
            </p>
          </div>

          {/* Robot Head Animation Section */}
          <div className="flex flex-col items-center mb-8">
            {/* Robot SVG - Matching WelcomeGuide Design */}
            <div className="relative mb-4">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl"
              >
                {/* Antenna */}
                <line x1="60" y1="15" x2="60" y2="25" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
                <circle cx="60" cy="12" r="4" fill="#FBBF24" className={isAnimating ? 'animate-pulse-slow' : ''} />
                
                {/* Head - Only this part shakes */}
                <g className={isAnimating ? 'animate-head-shake' : ''}>
                  <rect x="40" y="25" width="40" height="35" rx="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
                  
                  {/* Eyes */}
                  <circle cx="50" cy="42" r="6" fill="#60A5FA" />
                  <circle cx="70" cy="42" r="6" fill="#60A5FA" />
                  <circle cx="52" cy="40" r="2" fill="#FFF" />
                  <circle cx="72" cy="40" r="2" fill="#FFF" />
                  
                  {/* Smile */}
                  <path d="M 48 52 Q 60 58 72 52" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" />
                </g>
                
                {/* Body - Static */}
                <rect x="35" y="65" width="50" height="40" rx="6" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
                
                {/* Chest Circle - Pink/Purple Gradient */}
                <defs>
                  <linearGradient id="chestGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="85" r="8" fill="url(#chestGradient)" stroke="#EC4899" strokeWidth="2" />
                <circle cx="60" cy="85" r="4" fill="#8B5CF6" />
                
                {/* Arms */}
                <rect x="20" y="70" width="12" height="25" rx="6" fill="#9CA3AF" />
                <rect x="88" y="70" width="12" height="25" rx="6" fill="#9CA3AF" />
                <circle cx="26" cy="97" r="5" fill="#60A5FA" />
                <circle cx="94" cy="97" r="5" fill="#60A5FA" />
                
                {/* Legs */}
                <rect x="45" y="105" width="12" height="8" rx="4" fill="#9CA3AF" />
                <rect x="63" y="105" width="12" height="8" rx="4" fill="#9CA3AF" />
                <ellipse cx="51" cy="115" rx="7" ry="4" fill="#FBBF24" />
                <ellipse cx="69" cy="115" rx="7" ry="4" fill="#FBBF24" />
              </svg>
              
              {/* Sparkle Effect */}
              <div className="absolute -top-2 -right-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-300 animate-pulse">
                  <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor"/>
                  <path d="M20 4L21 6L23 7L21 8L20 10L19 8L17 7L19 6L20 4Z" fill="currentColor"/>
                  <path d="M4 16L5 18L7 19L5 20L4 22L3 20L1 19L3 18L4 16Z" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* Status Text */}
            {isAnimating ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-lg text-blue-700 dark:text-blue-500 font-medium">
                  🤖 Scanning news sources...
                </span>
                <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-progress-bar"></div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                  🤖 Ready to scan news sources
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Click "Generate News" to start scanning
                </p>
              </div>
            )}
          </div>

          {/* Main News Results List Style */}
          <div className="mt-4">
            {!isAnimating && newsResults?.articles && newsResults.articles.length > 0 && (
              <div className="divide-y divide-blue-100 dark:divide-gray-700 rounded-lg overflow-hidden text-left max-w-2xl mx-auto">
                {newsResults.articles.slice(0, 30).map((article, idx) => (
                  <div key={idx} className="group">
                    <button
                      className="flex w-full items-center justify-between gap-2 px-6 py-4 bg-transparent hover:bg-blue-50 dark:hover:bg-gray-900 transition-colors"
                      onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                      aria-expanded={expandedIndex === idx}
                    >
                      <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                        {article.title || `News ${idx + 1}`}
                      </span>
                      {expandedIndex === idx ? (
                        <ChevronDown className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      )}
                    </button>
                    {/* Expanded detailed content */}
                    {expandedIndex === idx && (
                      <div className="bg-blue-50 dark:bg-gray-900 border-t border-blue-100 dark:border-gray-700 p-5">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-700 dark:text-blue-400">Original link</a>
                          <Calendar className="w-4 h-4 inline-block ml-2" />
                          <span>{article.published_at?.slice(0, 16)}</span>
                          <MapPin className="w-4 h-4 inline-block ml-4" />
                          <span>{article.source}</span>
                        </div>
                        <div className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line">
                          {(article.content && article.content.trim().length > 0)
                            ? article.content.slice(0, 4000)
                            : article.summary?.replace(/<[^>]+>/g, '') || '(No content available)'}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!isAnimating && newsResults?.articles && newsResults.articles.length === 0 && (
              <div className="text-gray-500 dark:text-gray-400 text-center py-12 text-lg">
                <Newspaper className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <span>No articles found for your search.</span>
              </div>
            )}
            {!isAnimating && !newsResults && (
              <div className="text-gray-400 italic text-center py-8">
                Click "Generate News" to discover personalized news here!
              </div>
            )}
          </div>
        </div>
        
        {/* Voice Agent Robot - Bottom Right */}
        <VoiceAgent 
          isVoiceSessionActive={isVoiceSessionActive} 
          setIsVoiceSessionActive={setIsVoiceSessionActive} 
        />
      </div>
    </div>
  )
}

