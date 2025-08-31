import { experimental_createMCPClient as createMCPClient } from 'ai'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

export async function createSpaceMCPClient() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'galactic-grid.vercel.app'}`
    : 'http://localhost:3000'
    
  const mcpClient = await createMCPClient({
    transport: new StreamableHTTPClientTransport(
      new URL(`${baseUrl}/api/mcp`)
    )
  })

  return mcpClient
}

export async function getSpaceMCPTools() {
  const client = await createSpaceMCPClient()
  
  try {
    const tools = await client.tools()
    return { tools, client }
  } catch (error) {
    console.error('Failed to get MCP tools:', error)
    await client.close()
    throw error
  }
}