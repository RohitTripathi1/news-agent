import { useState, useEffect } from 'react'
import { MapPin, Search, Loader2, AlertCircle } from 'lucide-react'

interface Location {
  city: string
  state: string
  country: string
}

interface LocationSelectorProps {
  onSelectionChange: (isSelected: boolean) => void
}

export default function LocationSelector({ onSelectionChange }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Location[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Notify parent when selection changes
  useEffect(() => {
    onSelectionChange(selectedLocation !== null)
  }, [selectedLocation, onSelectionChange])

  // Search cities using OpenStreetMap Nominatim API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const searchCities = async () => {
      setIsSearching(true)
      try {
        // Using Nominatim API to search for cities worldwide
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(searchQuery)}&` +
          `format=json&` +
          `addressdetails=1&` +
          `limit=20&` +
          `featuretype=city`
        )
        const data = await response.json()
        
        // Transform results to our Location format
        const locations: Location[] = data
          .filter((item: any) => item.address && (item.address.city || item.address.town || item.address.village))
          .map((item: any) => ({
            city: item.address.city || item.address.town || item.address.village || item.name,
            state: item.address.state || item.address.region || '',
            country: item.address.country || ''
          }))
          // Remove duplicates
          .filter((location: Location, index: number, self: Location[]) =>
            index === self.findIndex((l) => 
              l.city === location.city && 
              l.state === location.state && 
              l.country === location.country
            )
          )
        
        setSearchResults(locations)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchCities, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Handle location selection
  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location)
    setIsDropdownOpen(false)
    setSearchQuery('')
  }

  // Get current location using browser geolocation
  const handleGetCurrentLocation = () => {
    setLocationError(null)
    setIsLoadingLocation(true)

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Reverse geocoding using OpenStreetMap Nominatim API (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          
          const location: Location = {
            city: data.address.city || data.address.town || data.address.village || 'Unknown',
            state: data.address.state || data.address.region || '',
            country: data.address.country || 'Unknown'
          }
          
          setSelectedLocation(location)
          setIsLoadingLocation(false)
        } catch (error) {
          setLocationError('Failed to get location details')
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        setIsLoadingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location in your browser settings.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable')
            break
          case error.TIMEOUT:
            setLocationError('Location request timed out')
            break
          default:
            setLocationError('An error occurred while getting location')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Select Your Location
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose your city or use current location
        </p>
      </div>

      <div className="space-y-4">
        {/* Location Button */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={isLoadingLocation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          {isLoadingLocation ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Getting your location...</span>
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5" />
              <span>Use My Current Location</span>
            </>
          )}
        </button>

        {/* Location Error */}
        {locationError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-200">{locationError}</p>
              {locationError.includes('denied') && (
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                  To enable location: Click the lock icon in your browser's address bar → Allow location access
                </p>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              or search manually
            </span>
          </div>
        </div>

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
              placeholder="Search city, state, or country..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Dropdown List */}
          {isDropdownOpen && searchQuery && (
            <div className="absolute w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
              {isSearching ? (
                <div className="px-4 py-3 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Searching cities...</span>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectLocation(city)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {city.city}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {city.state && `${city.state}, `}{city.country}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {searchQuery.length < 2 ? 'Type at least 2 characters...' : 'No cities found'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Selected Location:
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedLocation.city}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedLocation.state && `${selectedLocation.state}, `}
                  {selectedLocation.country}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

