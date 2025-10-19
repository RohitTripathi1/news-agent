import { Loader2 } from 'lucide-react'

interface ScrapingRobotProps {
  isVisible: boolean
}

export default function ScrapingRobot({ isVisible }: ScrapingRobotProps) {
  if (!isVisible) return null

  return (
    <div className="mt-8 flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-2xl shadow-2xl p-8 transition-all">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">
          🔍 Searching Across the Web...
        </h3>
        <p className="text-indigo-100 text-sm animate-pulse">
          Scanning thousands of sources • Finding relevant articles • Analyzing content
        </p>
      </div>

      {/* Robot with Head Rotations*/} 
      <div className="relative">
        {/* Scanning pulse effect */}
        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-pulse"></div>
        
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
          <circle cx="60" cy="12" r="4" fill="#FBBF24" className="animate-antenna-signal" />
          <circle cx="60" cy="12" r="8" fill="#FBBF24" opacity="0.3" className="animate-ping" />
          
          {/* Head with Rotation Animation */}
          <g className="animate-head-shake" style={{ transformOrigin: '60px 42.5px' }}>
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
          
          {/* Chest Circle with Fast Pulse */}
          <circle cx="60" cy="85" r="8" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" className="animate-antenna-signal" />
          <circle cx="60" cy="85" r="4" fill="#F59E0B" className="animate-pulse" />
          
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

      {/* Loading Dots - Fast bounce */}
      <div className="mt-6 flex items-center gap-2">
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '0.6s' }}></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.15s', animationDuration: '0.6s' }}></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.6s' }}></div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 w-full max-w-md">
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="bg-white h-full animate-progress-bar"></div>
        </div>
      </div>
    </div>
  )
}

