import { useState, useEffect } from 'react'
import { Clock, Calendar } from 'lucide-react'

interface TimeRange {
  id: string
  label: string
  value: string
  description: string
}

interface TimeRangeSelectorProps {
  onSelectionChange: (isSelected: boolean) => void
}

const timeRanges: TimeRange[] = [
  { id: '1h', label: 'Last Hour', value: '1h', description: 'Breaking news' },
  { id: '24h', label: 'Last 24 Hours', value: '24h', description: 'Today\'s news' },
  { id: '7d', label: 'Last Week', value: '7d', description: 'Weekly roundup' },
  { id: '30d', label: 'Last Month', value: '30d', description: 'Monthly digest' },
  { id: 'custom', label: 'Custom Range', value: 'custom', description: 'Choose dates' },
]

export default function TimeRangeSelector({ onSelectionChange }: TimeRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(timeRanges[1]) // Default: 24h
  const [showCustom, setShowCustom] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Notify parent when selection changes
  useEffect(() => {
    const isSelected = selectedRange.id !== 'custom' || (startDate && endDate)
    onSelectionChange(isSelected)
  }, [selectedRange, startDate, endDate, onSelectionChange])

  const handleSelectRange = (range: TimeRange) => {
    setSelectedRange(range)
    if (range.id === 'custom') {
      setShowCustom(true)
    } else {
      setShowCustom(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Time Range
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select how recent you want the news
        </p>
      </div>

      <div className="space-y-3">
        {/* Time Range Options */}
        {timeRanges.map((range) => (
          <button
            key={range.id}
            onClick={() => handleSelectRange(range)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedRange.id === range.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                selectedRange.id === range.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${
                  selectedRange.id === range.id
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {range.label}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {range.description}
                </p>
              </div>
              {selectedRange.id === range.id && (
                <div className="text-blue-500 font-bold text-xl">✓</div>
              )}
            </div>
          </button>
        ))}

        {/* Custom Date Range */}
        {showCustom && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <p className="font-semibold text-gray-900 dark:text-white">
                Custom Date Range
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Selected Display */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {showCustom && startDate && endDate
                  ? `Custom: ${startDate} to ${endDate}`
                  : `Showing news from: ${selectedRange.label.toLowerCase()}`
                }
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Agent will filter articles by this timeframe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

