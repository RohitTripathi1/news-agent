import { useState, useEffect } from 'react'
import { Search, Newspaper, TrendingUp } from 'lucide-react'

export interface Topic {
  id: string
  name: string
  icon: string
}

interface TopicSelectorProps {
  onSelectionChange: (topics: Topic[]) => void
}

const newsTopics: Topic[] = [
  { id: 'general', name: 'General News', icon: '📰' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'stocks', name: 'Stock Market', icon: '📈' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'politics', name: 'Politics', icon: '🏛️' },
  { id: 'world', name: 'World News', icon: '🌍' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'crime', name: 'Crime', icon: '🚨' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'environment', name: 'Environment', icon: '🌱' },
  { id: 'energy', name: 'Energy', icon: '⚡' },
  { id: 'space', name: 'Space', icon: '🚀' },
  { id: 'weather', name: 'Weather', icon: '🌤️' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'food', name: 'Food & Dining', icon: '🍽️' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠' },
  { id: 'cryptocurrency', name: 'Cryptocurrency', icon: '₿' },
  { id: 'startups', name: 'Startups', icon: '🚀' },
]

export default function TopicSelector({ onSelectionChange }: TopicSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Notify parent when selection changes
  useEffect(() => {
    onSelectionChange(selectedTopics)
  }, [selectedTopics, onSelectionChange])

  // Filter topics based on search query
  const filteredTopics = newsTopics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle topic selection
  const handleSelectTopic = (topic: Topic) => {
    if (!selectedTopics.find(t => t.id === topic.id)) {
      setSelectedTopics([...selectedTopics, topic])
    }
    setSearchQuery('')
    setIsDropdownOpen(false)
  }

  // Remove selected topic
  const handleRemoveTopic = (topicId: string) => {
    setSelectedTopics(selectedTopics.filter(t => t.id !== topicId))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Search the news topic you are interested in
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select topics to personalize your news feed
        </p>
      </div>

      <div className="space-y-4">
        {/* Search Dropdown */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsDropdownOpen(true)
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search topics... (e.g., AI, stocks, politics)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Dropdown List */}
          {isDropdownOpen && (
            <div className="absolute w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
              {filteredTopics.length > 0 ? (
                <div className="py-2">
                  {filteredTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic)}
                      disabled={selectedTopics.some(t => t.id === topic.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                    >
                      <span className="text-2xl">{topic.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {topic.name}
                        </p>
                      </div>
                      {selectedTopics.some(t => t.id === topic.id) && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          ✓ Selected
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">
                  No topics found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Popular Topics (Quick Select) */}
        {selectedTopics.length === 0 && !searchQuery && (
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              POPULAR TOPICS
            </p>
            <div className="flex flex-wrap gap-2">
              {newsTopics.slice(0, 6).map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <span>{topic.icon}</span>
                  <span>{topic.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Topics Display */}
        {selectedTopics.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                SELECTED TOPICS ({selectedTopics.length})
              </p>
              <button
                onClick={() => setSelectedTopics([])}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="group relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-3"
                >
                  <span className="text-2xl">{topic.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {topic.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Active
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveTopic(topic.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    title="Remove topic"
                  >
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Newspaper className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Your personalized feed is ready!
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    We'll show you news about: {selectedTopics.map(t => t.name).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

