import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getSpaceMCPTools } from "@/lib/mcp/client";

export async function POST(req: Request) {
  let mcpClient: any = null;

  try {
    const { messages } = await req.json();

    // Get MCP tools for real-time space data
    const { tools, client } = await getSpaceMCPTools();
    mcpClient = client;

    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages,
      tools,
      system: `You are Galactic Grid AI, an expert space mission tracking assistant with access to real-time space data.

You have access to live space tracking tools:
- getMissionDetails: Get detailed information about specific space missions
- getISSPosition: Get real-time International Space Station position and orbital data
- getUpcomingLaunches: Get upcoming rocket launches within a specified time period

When users ask about space topics, use these tools to provide accurate, up-to-date information:
- For ISS questions: Use getISSPosition to get current location and orbital data
- For mission questions: Use getMissionDetails to get comprehensive mission information
- For launch questions: Use getUpcomingLaunches to get scheduled launches and countdowns

Be enthusiastic about space exploration and provide detailed, engaging responses with live data!`,
      onFinish: async () => {
        // Clean up MCP client after response
        if (mcpClient) {
          await mcpClient.close();
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    // Clean up MCP client on error
    if (mcpClient) {
      try {
        await mcpClient.close();
      } catch (cleanupError) {
        console.error("Error cleaning up MCP client:", cleanupError);
      }
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
