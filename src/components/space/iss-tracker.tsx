'use client'

import { useState, useEffect } from 'react'
import { useSpaceData } from '@/lib/mcp/hooks'

export function ISSTracker() {
  const { data, loading, error, fetchISSPosition } = useSpaceData()
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    // Initial fetch
    fetchISSPosition()

    // Auto-refresh every 10 seconds
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchISSPosition()
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [fetchISSPosition, autoRefresh])

  const issData = data?.content?.[0]?.text
  
  // Parse ISS data from the text response
  const parseISSData = (text: string) => {
    if (!text) return null
    
    const locationMatch = text.match(/Location:\*\* ([0-9.-]+)°N, ([0-9.-]+)°E/)
    const altitudeMatch = text.match(/Altitude:\*\* ([0-9.]+) km/)
    const speedMatch = text.match(/Speed:\*\* ([0-9,]+) km\/h/)
    const updatedMatch = text.match(/Last Updated:\*\* (.+)(?:\n|$)/)
    
    return {
      latitude: locationMatch ? parseFloat(locationMatch[1]) : 0,
      longitude: locationMatch ? parseFloat(locationMatch[2]) : 0,
      altitude: altitudeMatch ? parseFloat(altitudeMatch[1]) : 0,
      speed: speedMatch ? speedMatch[1] : '0',
      lastUpdated: updatedMatch ? updatedMatch[1] : 'Unknown'
    }
  }

  const parsedData = issData ? parseISSData(issData) : null

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🛰️</div>
          <div>
            <h3 className="text-xl font-semibold">International Space Station</h3>
            <p className="text-gray-400 text-sm">Live Position Tracking</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              autoRefresh 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {autoRefresh ? '🔄 Auto' : '⏸️ Manual'}
          </button>
          
          <button
            onClick={fetchISSPosition}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
          >
            {loading ? '⏳' : '🔄'}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        {loading && (
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Fetching live ISS data...</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center space-x-2 text-red-400">
            <span>⚠️</span>
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {!loading && !error && parsedData && (
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live data • Updated {parsedData.lastUpdated}</span>
          </div>
        )}
      </div>

      {/* ISS Data */}
      {parsedData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Position */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-400">📍 Current Position</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Latitude:</span>
                <span className="font-mono">{parsedData.latitude.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Longitude:</span>
                <span className="font-mono">{parsedData.longitude.toFixed(4)}°</span>
              </div>
            </div>
          </div>

          {/* Orbital Data */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-green-400">🚀 Orbital Data</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Altitude:</span>
                <span className="font-mono">{parsedData.altitude} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="font-mono">{parsedData.speed} km/h</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map placeholder */}
      {parsedData && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-purple-400">🗺️ Position Map</h4>
          <div className="h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-2xl mb-2">🌍</div>
              <p className="text-sm">ISS Position: {parsedData.latitude.toFixed(2)}°, {parsedData.longitude.toFixed(2)}°</p>
              <p className="text-xs text-gray-500 mt-1">Interactive map coming soon</p>
            </div>
          </div>
        </div>
      )}

      {/* Fun Facts */}
      <div className="mt-4 bg-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold mb-2 text-yellow-400">✨ Did You Know?</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• The ISS orbits Earth every ~93 minutes</p>
          <p>• It travels at about 27,600 km/h (17,150 mph)</p>
          <p>• The station is about the size of a football field</p>
          <p>• It's home to 6-7 astronauts from different countries</p>
        </div>
      </div>
    </div>
  )
}