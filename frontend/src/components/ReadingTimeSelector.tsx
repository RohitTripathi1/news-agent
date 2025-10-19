import { useState } from 'react'
import { BookOpen, Zap, Coffee, Book } from 'lucide-react'

interface ReadingTime {
  id: string
  label: string
  duration: string
  icon: string
  description: string
  wordCount: string
}

const readingTimes: ReadingTime[] = [
  {
    id: 'all',
    label: 'All Lengths',
    duration: 'Any duration',
    icon: '📚',
    description: 'No filter',
    wordCount: 'All articles'
  },
  {
    id: 'quick',
    label: 'Quick Read',
    duration: '< 3 min',
    icon: '⚡',
    description: 'Short articles',
    wordCount: '< 500 words'
  },
  {
    id: 'medium',
    label: 'Medium Read',
    duration: '3-7 min',
    icon: '☕',
    description: 'Standard articles',
    wordCount: '500-1500 words'
  },
  {
    id: 'long',
    label: 'In-Depth Read',
    duration: '> 7 min',
    icon: '📖',
    description: 'Detailed articles',
    wordCount: '> 1500 words'
  },
]

export default function ReadingTimeSelector() {
  const [selectedTime, setSelectedTime] = useState<ReadingTime>(readingTimes[0]) // Default: All

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Article Length
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Prefer quick updates or in-depth reads?
        </p>
      </div>

      <div className="space-y-3">
        {/* Reading Time Options */}
        {readingTimes.map((time) => (
          <button
            key={time.id}
            onClick={() => setSelectedTime(time)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedTime.id === time.id
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`text-3xl ${
                selectedTime.id === time.id ? 'scale-110' : ''
              } transition-transform`}>
                {time.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${
                    selectedTime.id === time.id
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {time.label}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedTime.id === time.id
                      ? 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {time.duration}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {time.description} • {time.wordCount}
                </p>
              </div>
              {selectedTime.id === time.id && (
                <div className="text-green-500 font-bold text-xl">✓</div>
              )}
            </div>
          </button>
        ))}

        {/* Info Box */}
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-2">
            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Reading Preference: {selectedTime.label}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {selectedTime.id === 'all' 
                  ? 'Showing articles of all lengths'
                  : `Filtering for ${selectedTime.duration} articles (${selectedTime.wordCount})`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Reading Time Calculator */}
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Based on average reading speed of 200-250 words/minute
          </p>
        </div>
      </div>
    </div>
  )
}

