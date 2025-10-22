import { useState } from 'react'
import Header from './components/Header'
import WelcomeGuide from './components/WelcomeGuide'
import LocationSelector, { Location } from './components/LocationSelector'
import TopicSelector, { Topic } from './components/TopicSelector'
import TimeRangeSelector, { TimeRange } from './components/TimeRangeSelector'
import ReadingTimeSelector from './components/ReadingTimeSelector'
import GenerateNewsButton from './components/GenerateNewsButton'
import ScrapingRobot from './components/ScrapingRobot'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [isScrapingVisible] = useState(true)
  const [isRobotAnimating, setIsRobotAnimating] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange | null>(null)
  const [isLocationSelected, setIsLocationSelected] = useState(false)
  const [isTopicSelected, setIsTopicSelected] = useState(false)
  const [isTimeRangeSelected, setIsTimeRangeSelected] = useState(false)
  const [isReadingTimeSelected, setIsReadingTimeSelected] = useState(false)
  const [newsResults, setNewsResults] = useState<any>(null)

  const handleGenerateNews = async () => {
    setIsRobotAnimating(true)
    const payload = {
      location: selectedLocation,
      topics: selectedTopics,
      timeRange: selectedTimeRange
    }
    try {
      const res = await fetch('http://localhost:8002/api/get-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setNewsResults(data)
      setIsRobotAnimating(false)
    } catch (err) {
      setNewsResults(null)
      setIsRobotAnimating(false)
    }
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <WelcomeGuide />
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LocationSelector onSelectionChange={(location: Location | null) => {
                setSelectedLocation(location)
                setIsLocationSelected(!!location)
              }} />
              <TopicSelector onSelectionChange={(topics: Topic[]) => {
                setSelectedTopics(topics)
                setIsTopicSelected(topics.length > 0)
              }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeRangeSelector onSelectionChange={(range: TimeRange) => {
                setSelectedTimeRange(range)
                setIsTimeRangeSelected(!!range)
              }} />
              <ReadingTimeSelector onSelectionChange={setIsReadingTimeSelected} />
            </div>
            <div className="mt-8">
              <GenerateNewsButton
                isLocationSelected={isLocationSelected}
                isTopicSelected={isTopicSelected}
                isTimeRangeSelected={isTimeRangeSelected}
                isReadingTimeSelected={isReadingTimeSelected}
                onGenerateNews={handleGenerateNews}
              />
            </div>
            <ScrapingRobot isVisible={isScrapingVisible} isAnimating={isRobotAnimating} newsResults={newsResults} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
