import { Sparkles, ArrowDown } from 'lucide-react'

export default function WelcomeGuide() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl shadow-2xl p-6 mb-8 transition-all">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Robot Character */}
        <div className="flex-shrink-0">
          <div className="relative">
            {/* Robot SVG */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-2xl animate-bounce-slow"
            >
              {/* Antenna */}
              <line x1="60" y1="15" x2="60" y2="25" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
              <circle cx="60" cy="12" r="4" fill="#FBBF24" />
              
              {/* Head */}
              <rect x="40" y="25" width="40" height="35" rx="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
              
              {/* Eyes */}
              <circle cx="50" cy="42" r="6" fill="#60A5FA" />
              <circle cx="70" cy="42" r="6" fill="#60A5FA" />
              <circle cx="52" cy="40" r="2" fill="#FFF" />
              <circle cx="72" cy="40" r="2" fill="#FFF" />
              
              {/* Smile */}
              <path d="M 48 52 Q 60 58 72 52" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" />
              
              {/* Body */}
              <rect x="35" y="65" width="50" height="40" rx="6" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
              
              {/* Chest Circle */}
              <circle cx="60" cy="85" r="8" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="60" cy="85" r="4" fill="#F59E0B" />
              
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
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
        </div>

        {/* Guide Text */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Fill the fields below for personalized news
          </h2>
        </div>

        {/* Arrow Down Indicator */}
        <div className="hidden md:flex flex-col items-center">
          <ArrowDown className="w-8 h-8 text-white animate-bounce" />
          <span className="text-white text-sm font-medium mt-2">Start Here</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          {/* Step 1 */}
          <div className="text-white text-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg">
              1
            </div>
            <p className="text-sm text-blue-50">Choose Location</p>
          </div>
          
          {/* Arrow 1→2 */}
          <div className="hidden md:block text-white text-2xl font-bold mt-[-20px] animate-pulse">
            →
          </div>
          
          {/* Step 2 */}
          <div className="text-white text-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg">
              2
            </div>
            <p className="text-sm text-blue-50">Select Topics</p>
          </div>
          
          {/* Arrow 2→3 */}
          <div className="hidden md:block text-white text-2xl font-bold mt-[-20px] animate-pulse">
            →
          </div>
          
          {/* Step 3 */}
          <div className="text-white text-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg">
              3
            </div>
            <p className="text-sm text-blue-50">Set Time Range</p>
          </div>
          
          {/* Arrow 3→4 */}
          <div className="hidden md:block text-white text-2xl font-bold mt-[-20px] animate-pulse">
            →
          </div>
          
          {/* Step 4 */}
          <div className="text-white text-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg">
              4
            </div>
            <p className="text-sm text-blue-50">Choose Length</p>
          </div>
        </div>
      </div>
    </div>
  )
}

