'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'

export function ChatInterface() {
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading
  } = useChat({
    api: '/api/chat'
  })
  
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickQuestions = [
    "Where is the ISS right now?",
    "What rockets are launching soon?", 
    "Tell me about SpaceX missions",
    "Show me upcoming NASA launches"
  ]

  const sendQuickMessage = (message: string) => {
    handleSubmit(undefined, {
      data: { content: message }
    })
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-semibold">🚀 Galactic Grid AI</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          {isConnecting ? (
            <span className="animate-pulse">Connecting to space data...</span>
          ) : (
            <span className="text-green-400">🛰️ Live data connected</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🌌</div>
            <h3 className="text-xl font-semibold mb-2">Welcome to Galactic Grid</h3>
            <p className="text-gray-400 mb-6">
              Ask me anything about space missions, rocket launches, or the International Space Station!
            </p>
            
            {/* Quick Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendQuickMessage(question)}
                  disabled={isLoading}
                  className="p-3 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-400">🤖</span>
                  <span className="text-sm font-medium text-blue-400">Galactic Grid AI</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-gray-400 text-sm ml-2">Fetching space data...</span>
              </div>
            </div>
          </div>
        )}

        {connectionError && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span className="font-medium">Connection Error</span>
            </div>
            <p className="text-sm mt-1">{connectionError}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask about space missions, ISS location, or upcoming launches..."
              disabled={isLoading}
              className={`w-full p-3 bg-gray-800 text-white rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isFocused ? 'border-blue-500' : 'border-gray-600'
              }`}
            />
            <div className={`absolute inset-0 rounded-lg pointer-events-none transition-all ${
              isFocused ? 'ring-2 ring-blue-500/20' : ''
            }`} />
          </div>
          <button
            type="submit"
            disabled={!input?.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? '🚀' : '⬆️'}
          </button>
        </form>
      </div>
    </div>
  )
}