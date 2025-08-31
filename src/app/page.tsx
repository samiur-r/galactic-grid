import { ChatInterface } from "@/components/space/chat-interface";
import { ISSTracker } from "@/components/space/iss-tracker";

export default function Home() {
  return (
    <div className="min-h-screen lg:h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex flex-col lg:overflow-hidden relative">
      {/* Large Earth Space Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Space Background */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-950/20 to-black"></div>

        {/* Large Earth */}
        <div className="earth-large">
          <div className="earth-sphere">
            <div className="earth-atmosphere"></div>
            <div className="earth-surface"></div>
            <div className="earth-clouds"></div>
          </div>
        </div>

        {/* Space Stars Field */}
        <div className="stars-field">
          <div className="star-field star-field-1"></div>
          <div className="star-field star-field-2"></div>
          <div className="star-field star-field-3"></div>
        </div>

        {/* Twinkling Stars */}
        <div className="stars">
          <div className="star star-1">✨</div>
          <div className="star star-2">⭐</div>
          <div className="star star-3">✨</div>
          <div className="star star-4">⭐</div>
          <div className="star star-5">✨</div>
          <div className="star star-6">✨</div>
          <div className="star star-7">⭐</div>
          <div className="star star-8">✨</div>
        </div>
      </div>
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-700 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🌌</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Galactic Grid</h1>
                <p className="text-gray-400 text-xs md:text-sm">
                  Real-time Space Mission Tracking Platform
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>MCP Server Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🛰️</span>
                <span>Live Space Data</span>
              </div>
            </div>
            <div className="md:hidden flex items-center space-x-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>🛰️</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4 lg:overflow-hidden mb-4 lg:mb-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-full pb-4 lg:pb-0">
          {/* Chat Interface */}
          <div className="lg:col-span-2 h-[600px] lg:h-full">
            <div className="bg-gray-900/70 backdrop-blur rounded-xl border border-gray-700 h-full">
              <ChatInterface />
            </div>
          </div>

          {/* ISS Tracker & Stats */}
          <div className="space-y-4 lg:h-full lg:overflow-y-auto custom-scrollbar">
            <ISSTracker />

            {/* Quick Stats */}
            <div className="bg-gray-900/70 backdrop-blur border border-gray-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                🚀 Quick Stats
              </h3>
              <div className="space-y-2 text-sm">
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
            <div className="bg-gray-900/70 backdrop-blur border border-gray-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                ✨ Features
              </h3>
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
      <footer className="flex-shrink-0 border-t border-gray-700 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div>AI-powered space mission tracking platform</div>
            <div className="flex items-center space-x-2">
              <span>🌌 Galactic Grid v1.0</span>
              <span>•</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
