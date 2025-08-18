import { experimental_createMCPClient as createMCPClient } from 'ai'

export async function createSpaceMCPClient() {
  const mcpClient = await createMCPClient({
    transport: {
      type: 'sse',
      url: process.env.NODE_ENV === 'production' 
        ? `${process.env.VERCEL_URL || 'https://galactic-grid.vercel.app'}/api/mcp`
        : 'http://localhost:3000/api/mcp',
      headers: {
        'Content-Type': 'application/json',
      },
    },
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