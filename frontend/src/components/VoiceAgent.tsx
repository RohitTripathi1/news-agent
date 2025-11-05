import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, X, Loader2 } from 'lucide-react'

interface VoiceAgentProps {
  isVoiceSessionActive: boolean
  setIsVoiceSessionActive: (active: boolean) => void
}

interface ConversationMessage {
  user: string
  assistant: string
  timestamp: Date
}

// TypeScript declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function VoiceAgent({ isVoiceSessionActive, setIsVoiceSessionActive }: VoiceAgentProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [error, setError] = useState<string>('')
  const [currentTranscript, setCurrentTranscript] = useState<string>('')
  
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const finalTranscriptRef = useRef<string>('')

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.')
    }
    synthRef.current = window.speechSynthesis
  }, [])

  const startListening = () => {
    let timeoutId: NodeJS.Timeout | null = null
    
    try {
      setError('')
      finalTranscriptRef.current = '' // Reset transcript
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported')
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = false // Stop after first final result
      recognition.interimResults = true // Show interim results
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1
      
      // Add timeout to prevent infinite listening
      timeoutId = setTimeout(() => {
        if (recognitionRef.current === recognition) {
          console.log('⏱️  Recognition timeout, stopping...')
          recognition.stop()
        }
      }, 10000) // 10 second timeout

      // Update transcript as user speaks
      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        // Store final transcript
        if (finalTranscript) {
          finalTranscriptRef.current += finalTranscript
        }

        // Show interim or final transcript
        setCurrentTranscript(finalTranscriptRef.current || interimTranscript)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'no-speech') {
          // User didn't speak, restart listening
          console.log('🔄 No speech detected, will restart...')
          finalTranscriptRef.current = ''
          if (isVoiceSessionActive && !isProcessing) {
            setTimeout(() => {
              if (isVoiceSessionActive && !isProcessing) {
                startListening()
              }
            }, 1000)
          }
        } else if (event.error === 'aborted') {
          // Recognition was stopped, that's fine
          console.log('ℹ️  Recognition aborted')
        } else {
          console.error('❌ Speech recognition error:', event.error)
          setError(`Speech recognition error: ${event.error}`)
          setIsListening(false)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        
        // Clear timeout if it exists
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        
        // Check if we have a final transcript to process
        const transcriptToProcess = finalTranscriptRef.current.trim()
        
        console.log('🔚 Recognition ended. Final transcript:', transcriptToProcess)
        
        if (transcriptToProcess) {
          console.log('📝 Processing transcript:', transcriptToProcess)
          // Reset for next time
          const transcript = transcriptToProcess
          finalTranscriptRef.current = ''
          setCurrentTranscript('')
          // Process the transcript
          processTranscript(transcript)
        } else if (isVoiceSessionActive && !isProcessing) {
          // No speech detected, restart listening
          console.log('🔄 No speech detected, will restart listening...')
          finalTranscriptRef.current = ''
          setTimeout(() => {
            if (isVoiceSessionActive && !isProcessing) {
              console.log('🔄 Restarting listening...')
              startListening()
            }
          }, 1000)
        }
      }

      recognition.onstart = () => {
        setIsListening(true)
        console.log('🎤 Listening...')
      }

      recognitionRef.current = recognition
      recognition.start()
      
    } catch (err) {
      console.error('Error starting speech recognition:', err)
      setError('Failed to start speech recognition. Please check browser permissions.')
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
    setCurrentTranscript('')
    finalTranscriptRef.current = ''
  }

  const processTranscript = async (transcript: string) => {
    if (!transcript || !transcript.trim()) {
      console.log('⚠️  Empty transcript, skipping...')
      return
    }

    try {
      setIsProcessing(true)
      setError('')
      setCurrentTranscript('')
      
      console.log('📤 Sending transcript to backend:', transcript)
      
      // Send transcript to backend for AI response
      const response = await fetch('http://localhost:8002/api/voice/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: transcript }),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Backend error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('📥 Response data:', data)
      
      const aiResponse = data.response || data.message || 'Sorry, I could not generate a response.'
      
      console.log('✅ AI Response:', aiResponse)
      
      // Add to conversation
      setConversation(prev => [...prev, {
        user: transcript,
        assistant: aiResponse,
        timestamp: new Date()
      }])
      
      // Speak the response using browser TTS
      speakText(aiResponse)
      
      console.log('✅ Response received and spoken')
      
    } catch (err) {
      console.error('❌ Error processing transcript:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to process voice query'
      setError(errorMessage)
      
      // Still add to conversation with error
      setConversation(prev => [...prev, {
        user: transcript,
        assistant: `Error: ${errorMessage}`,
        timestamp: new Date()
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const speakText = (text: string) => {
    if (!synthRef.current) {
      console.error('Speech synthesis not available')
      return
    }

    // Stop any ongoing speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onend = () => {
      console.log('🔊 Finished speaking, continuing to listen...')
      // Auto-continue listening after speech finishes
      if (isVoiceSessionActive && !isProcessing) {
        setTimeout(() => {
          if (isVoiceSessionActive && !isProcessing) {
            startListening()
          }
        }, 500)
      }
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      setError('Failed to speak response')
    }

    synthRef.current.speak(utterance)
  }

  const handleVoiceToggle = () => {
    if (!isVoiceSessionActive) {
      // Start voice session
      setIsVoiceSessionActive(true)
      setConversation([])
      setError('')
      setCurrentTranscript('')
      // Start listening immediately
      setTimeout(() => startListening(), 300)
    } else {
      // Stop voice session
      stopListening()
      setIsVoiceSessionActive(false)
      setConversation([])
      setError('')
      setCurrentTranscript('')
      // Stop any ongoing speech
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }

  const handleStopSession = () => {
    stopListening()
    setIsVoiceSessionActive(false)
    setConversation([])
    setError('')
    setCurrentTranscript('')
    // Stop any ongoing speech
    if (synthRef.current) {
      synthRef.current.cancel()
    }
  }

  // Auto-start listening when voice session becomes active
  useEffect(() => {
    if (isVoiceSessionActive && !isListening && !isProcessing) {
      const timer = setTimeout(() => {
        if (isVoiceSessionActive && !isListening && !isProcessing) {
          startListening()
        }
      }, 300)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceSessionActive, isProcessing])

  return (
    <div className="absolute bottom-4 right-4 z-50">
      {/* Voice Agent Robot */}
      <div className="relative">
        <button
          onClick={handleVoiceToggle}
          disabled={isProcessing}
          className={`transition-all duration-300 hover:scale-105 ${isVoiceSessionActive ? 'animate-pulse' : ''} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            
            {/* Head */}
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
            
            {/* Body */}
            <rect x="35" y="65" width="50" height="40" rx="6" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
            
            {/* Chest Circle */}
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

        {/* Status Indicator */}
        {isListening && (
          <div className="absolute -top-12 right-0 bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Listening...
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute -top-12 right-0 bg-blue-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing...
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
          </div>
        )}

        {/* Onboarding Message */}
        {!isVoiceSessionActive && !isListening && !isProcessing && (
          <div className="absolute -top-12 right-0 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            Click to start conversation
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}

        {/* Stop Button */}
        {isVoiceSessionActive && !isProcessing && (
          <button
            onClick={handleStopSession}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            title="Stop conversation"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Current Transcript */}
      {currentTranscript && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-xl p-3 border border-gray-200">
          <div className="text-xs font-semibold text-gray-500 mb-1">You're saying:</div>
          <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded italic">{currentTranscript}</div>
        </div>
      )}

      {/* Conversation Display */}
      {conversation.length > 0 && (
        <div className="absolute bottom-20 right-0 w-96 bg-white rounded-lg shadow-xl p-4 border border-gray-200 max-h-96 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 mb-3">Conversation</div>
          
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="space-y-3">
            {conversation.map((msg, idx) => (
              <div key={idx} className="space-y-2">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">You:</div>
                  <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{msg.user}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">Assistant:</div>
                  <div className="text-sm text-gray-800 bg-blue-50 p-2 rounded">{msg.assistant}</div>
                </div>
                {idx < conversation.length - 1 && (
                  <div className="border-t border-gray-200 my-2"></div>
                )}
              </div>
            ))}
          </div>
          
          {isVoiceSessionActive && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 italic">
                {isListening ? '🎤 Listening... (speak now)' : 
                 isProcessing ? '🤖 Processing your question...' :
                 '💬 Waiting...'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
