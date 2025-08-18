import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Simple chat without MCP for now - we'll add MCP tools later
    const result = streamText({
      model: openai('gpt-4o'),
      messages,
      system: `You are Galactic Grid AI, an expert space mission tracking assistant.

You provide information about:
- Space missions and rocket launches
- International Space Station (ISS)
- Space agencies like NASA, SpaceX, ESA
- Astronomy and space exploration

Be enthusiastic about space exploration and provide detailed, engaging responses about space topics!`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)

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