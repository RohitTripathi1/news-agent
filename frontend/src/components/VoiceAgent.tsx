import { useState } from 'react'
import { Mic, MicOff, X } from 'lucide-react'

interface VoiceAgentProps {
  isVoiceSessionActive: boolean
  setIsVoiceSessionActive: (active: boolean) => void
}

export default function VoiceAgent({ isVoiceSessionActive, setIsVoiceSessionActive }: VoiceAgentProps) {
  const handleVoiceToggle = () => {
    setIsVoiceSessionActive(!isVoiceSessionActive)
  }

  const handleStopSession = () => {
    setIsVoiceSessionActive(false)
  }

  return (
    <div className="absolute bottom-4 right-4">
      {/* Voice Agent Robot - Matching Main Robot Design */}
      <div className="relative">
        <button
          onClick={handleVoiceToggle}
          className={`transition-all duration-300 hover:scale-105 ${isVoiceSessionActive ? 'animate-pulse' : ''}`}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Antenna */}
            <line x1="60" y1="15" x2="60" y2="25" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="12" r="4" fill="#FBBF24" className={isVoiceSessionActive ? 'animate-pulse-slow' : ''} />
            
            {/* Head - Only this part shakes when voice is active */}
            <g className={isVoiceSessionActive ? 'animate-head-shake' : ''}>
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
              <linearGradient id="voiceChestGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="85" r="8" fill="url(#voiceChestGradient)" stroke="#EC4899" strokeWidth="2" />
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
        </button>

        {/* Onboarding Message */}
        {!isVoiceSessionActive && (
          <div className="absolute -top-12 right-0 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            Click me to start your voice session
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}

        {/* Stop Button */}
        {isVoiceSessionActive && (
          <button
            onClick={handleStopSession}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}
