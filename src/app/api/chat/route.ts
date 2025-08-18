import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { getSpaceMCPTools } from '@/lib/mcp/client'

export async function POST(req: Request) {
  const { messages } = await req.json()

  let mcpClient: any = null

  try {
    // Get MCP tools for space data
    const { tools, client } = await getSpaceMCPTools()
    mcpClient = client

    const result = await streamText({
      model: openai('gpt-4o'),
      messages,
      tools,
      system: `You are Galactic Grid AI, an expert space mission tracking assistant. You have access to real-time space data through specialized tools.

Available capabilities:
- Real-time ISS (International Space Station) position tracking
- Space mission details and information
- Upcoming rocket launch schedules
- Live space data from NASA, SpaceX, and other agencies

When users ask about space-related topics, use the appropriate tools to provide accurate, up-to-date information. Present data in a clear, engaging way with relevant emojis and formatting.

For ISS tracking, always include current position, altitude, speed, and orbital period. For launches, include countdown information, rocket details, and live stream links when available.

Be enthusiastic about space exploration and help users discover the wonders of space missions and technology!`,
      maxTokens: 1000,
      onFinish: async () => {
        // Close MCP client when done
        if (mcpClient) {
          try {
            await mcpClient.close()
          } catch (error) {
            console.warn('Failed to close MCP client:', error)
          }
        }
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Clean up MCP client on error
    if (mcpClient) {
      try {
        await mcpClient.close()
      } catch (closeError) {
        console.warn('Failed to close MCP client on error:', closeError)
      }
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}