import { openai } from "@ai-sdk/openai";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  type UIMessage,
} from "ai";
import { getSpaceMCPTools } from "@/lib/mcp/client";

export const maxDuration = 60;

export async function POST(req: Request) {
  let mcpClient: any = null;

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Get MCP tools for agentic tool use
    const { tools, client } = await getSpaceMCPTools();
    mcpClient = client;

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const result = streamText({
          // Tool-capable model
          model: openai("gpt-4.1-nano"),
          messages: convertToModelMessages(messages),
          tools,
          toolChoice: "auto",
          stopWhen: [stepCountIs(10)],
          system: `
You are Galactic Grid AI, a space mission tracking assistant.
Use tools when relevant:
- getUpcomingLaunches for launch schedules/countdowns
- getISSPosition for real-time ISS data
- getMissionDetails for mission info

Respond clearly and concisely; avoid fluff. If you call tools, synthesize results for the user.`,
          onError({ error }) {
            console.error("Agent stream error:", error);
          },
        });

        // Pipe the model's UI stream to the response
        writer.merge(result.toUIMessageStream());

        // Ensure MCP client is closed after the run completes
        (async () => {
          for await (const _ of result.fullStream) {
            // drain
          }
          if (mcpClient) await mcpClient.close();
        })().catch(async (e) => {
          console.error("Stream drain/cleanup error:", e);
          if (mcpClient) {
            try {
              await mcpClient.close();
            } catch {}
          }
        });
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.error("Chat API error:", error);

    if (mcpClient) {
      try {
        await mcpClient.close();
      } catch {}
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
