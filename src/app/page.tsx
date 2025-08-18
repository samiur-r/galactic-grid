import { ChatInterface } from '@/components/space/chat-interface'
import { ISSTracker } from '@/components/space/iss-tracker'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🌌</div>
              <div>
                <h1 className="text-3xl font-bold text-white">Galactic Grid</h1>
                <p className="text-gray-400">Real-time Space Mission Tracking Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>MCP Server Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🛰️</span>
                <span>Live Space Data</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/70 backdrop-blur rounded-xl border border-gray-700 h-full">
              <ChatInterface />
            </div>
          </div>

          {/* ISS Tracker */}
          <div className="space-y-6">
            <ISSTracker />
            
            {/* Quick Stats */}
            <div className="bg-gray-900/70 backdrop-blur border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🚀 Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Astronauts</span>
                  <span className="text-white font-medium">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Upcoming Launches</span>
                  <span className="text-green-400 font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Space Agencies</span>
                  <span className="text-blue-400 font-medium">5+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ISS Orbit Time</span>
                  <span className="text-purple-400 font-medium">93 min</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-900/70 backdrop-blur border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">✨ Features</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Real-time ISS tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>AI-powered space chat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Launch schedules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>MCP protocol integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">⏳</span>
                  <span>3D orbit visualization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/50 backdrop-blur mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Powered by Model Context Protocol (MCP) • Real-time space data
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>🌌 Galactic Grid v1.0</span>
              <span>•</span>
              <span>Built with Next.js & AI SDK</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
