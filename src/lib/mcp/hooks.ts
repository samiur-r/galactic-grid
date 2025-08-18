'use client'

import { useState, useCallback, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { createSpaceMCPClient, getSpaceMCPTools } from './client'

export function useSpaceChat() {
  const [mcpClient, setMcpClient] = useState<any>(null)
  const [mcpTools, setMcpTools] = useState<any>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Initialize MCP client and tools
  const initializeMCP = useCallback(async () => {
    if (mcpClient && mcpTools) return { tools: mcpTools, client: mcpClient }
    
    setIsConnecting(true)
    setConnectionError(null)
    
    try {
      const { tools, client } = await getSpaceMCPTools()
      setMcpClient(client)
      setMcpTools(tools)
      setIsConnecting(false)
      return { tools, client }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to MCP server'
      setConnectionError(errorMessage)
      setIsConnecting(false)
      throw error
    }
  }, [mcpClient, mcpTools])

  // Chat with AI using MCP tools
  const chat = useChat({
    api: '/api/chat',
    onFinish: async () => {
      // Close MCP client after chat completion
      if (mcpClient) {
        try {
          await mcpClient.close()
        } catch (error) {
          console.warn('Failed to close MCP client:', error)
        }
      }
    },
  })

  // Enhanced send message that includes MCP tools
  const sendMessageWithMCP = useCallback(async (message: string) => {
    try {
      const { tools } = await initializeMCP()
      
      // Send message with MCP tools available
      chat.append({
        role: 'user',
        content: message,
      })
    } catch (error) {
      console.error('Failed to send message with MCP:', error)
      setConnectionError('Failed to connect to space data services')
    }
  }, [chat, initializeMCP])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mcpClient) {
        mcpClient.close().catch(console.warn)
      }
    }
  }, [mcpClient])

  return {
    ...chat,
    sendMessageWithMCP,
    isConnecting,
    connectionError,
    mcpConnected: !!mcpClient && !!mcpTools,
    initializeMCP,
  }
}

export function useSpaceData() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchISSPosition = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const client = await createSpaceMCPClient()
      
      // Call ISS position tool directly
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'getISSPosition',
            arguments: { include_passes: true }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ISS data: ${response.status}`)
      }

      const text = await response.text()
      // Parse SSE response
      const lines = text.split('\n')
      const dataLine = lines.find(line => line.startsWith('data: '))
      
      if (dataLine) {
        const jsonStr = dataLine.replace('data: ', '')
        const result = JSON.parse(jsonStr)
        setData(result.result)
      }
      
      await client.close()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ISS data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUpcomingLaunches = useCallback(async (days: number = 30) => {
    setLoading(true)
    setError(null)
    
    try {
      const client = await createSpaceMCPClient()
      
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'getUpcomingLaunches',
            arguments: { days }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch launch data: ${response.status}`)
      }

      const text = await response.text()
      const lines = text.split('\n')
      const dataLine = lines.find(line => line.startsWith('data: '))
      
      if (dataLine) {
        const jsonStr = dataLine.replace('data: ', '')
        const result = JSON.parse(jsonStr)
        setData(result.result)
      }
      
      await client.close()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch launch data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    data,
    loading,
    error,
    fetchISSPosition,
    fetchUpcomingLaunches,
  }
}