import { useState } from 'react'
import Header from './components/Header'
import WelcomeGuide from './components/WelcomeGuide'
import LocationSelector from './components/LocationSelector'
import TopicSelector from './components/TopicSelector'
import TimeRangeSelector from './components/TimeRangeSelector'
import ReadingTimeSelector from './components/ReadingTimeSelector'
import GenerateNewsButton from './components/GenerateNewsButton'
import ScrapingRobot from './components/ScrapingRobot'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [isScrapingVisible, setIsScrapingVisible] = useState(true) // Always visible
  const [isRobotAnimating, setIsRobotAnimating] = useState(false) // Control animation state
  
  // Track form completion state
  const [isLocationSelected, setIsLocationSelected] = useState(false)
  const [isTopicSelected, setIsTopicSelected] = useState(false)
  const [isTimeRangeSelected, setIsTimeRangeSelected] = useState(false)
  const [isReadingTimeSelected, setIsReadingTimeSelected] = useState(false)

  const handleGenerateNews = () => {
    setIsRobotAnimating(true) // Start robot animation
    // TODO: Add actual news generation logic here
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Welcome Guide - Robot Helper */}
          <WelcomeGuide />

          <div className="space-y-6">
            {/* First Row: Location and Topics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LocationSelector onSelectionChange={setIsLocationSelected} />
              <TopicSelector onSelectionChange={setIsTopicSelected} />
            </div>

            {/* Second Row: Time Range and Reading Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeRangeSelector onSelectionChange={setIsTimeRangeSelected} />
              <ReadingTimeSelector onSelectionChange={setIsReadingTimeSelected} />
            </div>

            {/* Generate News Button */}
            <div className="mt-8">
              <GenerateNewsButton
                isLocationSelected={isLocationSelected}
                isTopicSelected={isTopicSelected}
                isTimeRangeSelected={isTimeRangeSelected}
                isReadingTimeSelected={isReadingTimeSelected}
                onGenerateNews={handleGenerateNews}
              />
            </div>

            {/* Scraping Robot + News Results - Combined Section */}
            <ScrapingRobot isVisible={isScrapingVisible} isAnimating={isRobotAnimating} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
