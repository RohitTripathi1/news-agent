import { useState } from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'

interface GenerateNewsButtonProps {
  isLocationSelected: boolean
  isTopicSelected: boolean
  isTimeRangeSelected: boolean
  isReadingTimeSelected: boolean
  onGenerateNews: () => void
}

export default function GenerateNewsButton({
  isLocationSelected,
  isTopicSelected,
  isTimeRangeSelected,
  isReadingTimeSelected,
  onGenerateNews
}: GenerateNewsButtonProps) {
  const [showError, setShowError] = useState(false)

  const allFieldsSelected = isLocationSelected && isTopicSelected && isTimeRangeSelected && isReadingTimeSelected

  const handleClick = () => {
    if (allFieldsSelected) {
      setShowError(false)
      onGenerateNews()
    } else {
      setShowError(true)
      // Hide error after 3 seconds
      setTimeout(() => setShowError(false), 3000)
    }
  }

  const getMissingFields = () => {
    const missing = []
    if (!isLocationSelected) missing.push('Location')
    if (!isTopicSelected) missing.push('Topics')
    if (!isTimeRangeSelected) missing.push('Time Range')
    if (!isReadingTimeSelected) missing.push('Reading Time')
    return missing
  }

  return (
    <div className="relative">
      {/* Generate News Button */}
      <button
        onClick={handleClick}
        className={`
          w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform
          ${allFieldsSelected 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
          }
          flex items-center justify-center gap-3
        `}
      >
        <Sparkles className={`w-6 h-6 ${allFieldsSelected ? 'animate-pulse' : ''}`} />
        Generate News
      </button>

      {/* Error Message */}
      {showError && (
        <div className="absolute top-full left-0 right-0 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Please select all fields above to generate news:</p>
              <p className="text-red-600 text-sm mt-1">
                Missing: {getMissingFields().join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

