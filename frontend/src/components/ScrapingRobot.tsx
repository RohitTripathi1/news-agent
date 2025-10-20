import { useState } from 'react'
import { Loader2, Newspaper, Calendar, Clock, MapPin, Sparkles } from 'lucide-react'

interface ScrapingRobotProps {
  isVisible: boolean
  isAnimating?: boolean // NEW: Control animation state
}

export default function ScrapingRobot({ isVisible, isAnimating = false }: ScrapingRobotProps) {
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive)
    if (!isVoiceActive) {
      setIsListening(true)
      // TODO: Start voice recognition
    } else {
      setIsListening(false)
      setIsSpeaking(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="mt-8 space-y-8">
      {/* Robot Section */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-2xl shadow-2xl p-8 transition-all">
      <div className="text-center mb-6">
        <h3 className={`text-2xl font-bold text-white mb-2 ${isAnimating ? 'animate-pulse' : ''}`}>
          {isAnimating ? '🔍 Searching Across the Web...' : '🤖 Ready to Search'}
        </h3>
        <p className={`text-indigo-100 text-sm ${isAnimating ? 'animate-pulse' : ''}`}>
          {isAnimating 
            ? 'Scanning thousands of sources • Finding relevant articles • Analyzing content'
            : 'Fill the fields above and click Generate News to start searching'
          }
        </p>
      </div>

      {/* Robot with Head Rotation */}
      <div className="relative">
        {/* Scanning pulse effect - only when animating */}
        {isAnimating && (
          <>
            <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-pulse"></div>
          </>
        )}
        
        <svg
          width="150"
          height="150"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Antenna */}
          <line x1="60" y1="15" x2="60" y2="25" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="12" r="4" fill="#FBBF24" className={isAnimating ? 'animate-antenna-signal' : ''} />
          {isAnimating && <circle cx="60" cy="12" r="8" fill="#FBBF24" opacity="0.3" className="animate-ping" />}
          
          {/* Head with Rotation Animation - only when animating */}
          <g className={isAnimating ? 'animate-head-shake' : ''} style={{ transformOrigin: '60px 42.5px' }}>
            {/* Head */}
            <rect x="40" y="25" width="40" height="35" rx="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
            
            {/* Eyes */}
            <circle cx="50" cy="42" r="6" fill="#60A5FA" />
            <circle cx="70" cy="42" r="6" fill="#60A5FA" />
            <circle cx="52" cy="40" r="2" fill="#FFF" />
            <circle cx="72" cy="40" r="2" fill="#FFF" />
            
            {/* Smile */}
            <path d="M 48 52 Q 60 58 72 52" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
          
          {/* Body */}
          <rect x="35" y="65" width="50" height="40" rx="6" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
          
          {/* Chest Circle with Fast Pulse - only when animating */}
          <circle cx="60" cy="85" r="8" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" className={isAnimating ? 'animate-antenna-signal' : ''} />
          <circle cx="60" cy="85" r="4" fill="#F59E0B" className={isAnimating ? 'animate-pulse' : ''} />
          
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
      </div>

      {/* Loading Dots - only when animating */}
      {isAnimating && (
        <div className="mt-6 flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '0.6s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.15s', animationDuration: '0.6s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.6s' }}></div>
        </div>
      )}

      {/* Progress Bar - only when animating */}
      {isAnimating && (
        <div className="mt-6 w-full max-w-md">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="bg-white h-full animate-progress-bar"></div>
          </div>
        </div>
      )}
      </div>

      {/* News Results Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors relative">
        <div className="text-center">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📰 Generated News
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your personalized news articles will appear here
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 border-2 border-dashed border-blue-200 dark:border-gray-500">
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              {/* Main Message */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Generated news will be displayed here
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                  Once you click "Generate News", AI-powered articles will be scraped, processed, and displayed in this section with summaries, analysis, and insights.
                </p>
              </div>

              {/* Feature Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 w-full max-w-2xl">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location-based</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">News from your selected city</p>
                </div>
                
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time-filtered</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Articles from your time range</p>
                </div>
                
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reading optimized</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Matched to your reading time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
              🚀 Coming Soon: AI-Powered News Analysis
            </span>
          </div>
        </div>

        {/* Voice Agent Robot - Bottom Right of News Section */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center">
        {/* Status Badges */}
        {isVoiceActive && (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-white mb-2">
            {isListening && (
              <span className="bg-blue-500 px-2 py-1 rounded-full animate-pulse-slow">
                👂 Listening...
              </span>
            )}
            {isSpeaking && (
              <span className="bg-yellow-500 px-2 py-1 rounded-full animate-pulse-slow">
                🗣️ Speaking...
              </span>
            )}
            {!isListening && !isSpeaking && (
              <span className="bg-gray-500 px-2 py-1 rounded-full">
                Inactive
              </span>
            )}
          </div>
        )}

        {/* Clickable Robot SVG with Sparkle */}
        <button
          onClick={handleVoiceToggle}
          className={`relative p-0 rounded-full transition-transform duration-300
            ${isVoiceActive ? 'scale-110' : ''}
            focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75
          `}
          style={{ width: '60px', height: '60px' }} // Ensure button size matches SVG
        >
          {/* Sparkle Effect */}
          <Sparkles className={`absolute -top-2 -right-2 w-6 h-6 text-yellow-300 ${isVoiceActive ? 'animate-pulse' : ''}`} />
          
          <svg
            width="60"
            height="60"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg" // Add shadow for better visual
          >
            {/* Antenna */}
            <line x1="60" y1="15" x2="60" y2="25" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="12" r="4" fill="#FBBF24" className={`${isVoiceActive ? 'animate-antenna-signal' : ''}`} />
            
            {/* Head */}
            <g className={`${isSpeaking ? 'animate-pulse-slow' : ''}`} style={{ transformOrigin: '60px 42.5px' }}>
              {/* Head */}
              <rect x="40" y="25" width="40" height="35" rx="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
              
              {/* Eyes */}
              <circle cx="50" cy="42" r="6" fill="#60A5FA" />
              <circle cx="70" cy="42" r="6" fill="#60A5FA" />
              <circle cx="52" cy="40" r="2" fill="#FFF" />
              <circle cx="72" cy="40" r="2" fill="#FFF" />
              
              {/* Mouth - Lip-syncing */}
              {isSpeaking ? (
                <path d="M 48 52 Q 60 60 72 52" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" /> // Open mouth
              ) : isListening ? (
                <path d="M 48 52 Q 60 56 72 52" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" /> // Slightly open
              ) : (
                <path d="M 48 52 Q 60 52 72 52" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" /> // Smile
              )}
            </g>
            
            {/* Body */}
            <rect x="35" y="65" width="50" height="40" rx="6" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
            
            {/* Chest Circle */}
            <circle cx="60" cy="85" r="8" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" className={`${isVoiceActive ? 'animate-pulse' : ''}`} /> {/* Changed fill to #F59E0B */}
            
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
        </button>
        </div>
      </div>
    </div>
  )
}

