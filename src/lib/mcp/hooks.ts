"use client";

import { useState, useCallback, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { createSpaceMCPClient, getSpaceMCPTools } from "./client";
import type { Launch } from "@/types/space";

/** Inferred types from your MCP client/tool factories */
type SpaceMCPClient = Awaited<ReturnType<typeof createSpaceMCPClient>>;
type SpaceMCPTools = Awaited<ReturnType<typeof getSpaceMCPTools>>["tools"];

/** Minimal JSON-RPC tool call wire shape we expect back from /api/mcp */
interface JsonRpcSuccess<T> {
  jsonrpc?: "2.0";
  id?: number | string | null;
  result: T;
}

/** Extracts the first `data: ...` payload from a text/event-stream response */
function parseSSEFirstData<T>(sseText: string): T | null {
  const line = sseText.split("\n").find((l) => l.startsWith("data: "));
  if (!line) return null;
  const jsonStr = line.slice("data: ".length);
  try {
    const parsed = JSON.parse(jsonStr) as JsonRpcSuccess<T>;
    return parsed.result ?? null;
  } catch {
    return null;
  }
}

/* ------------------------- useSpaceChat ------------------------- */

export function useSpaceChat() {
  const [mcpClient, setMcpClient] = useState<SpaceMCPClient | null>(null);
  const [mcpTools, setMcpTools] = useState<SpaceMCPTools | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Initialize MCP client and tools
  const initializeMCP = useCallback(async (): Promise<{
    tools: SpaceMCPTools;
    client: SpaceMCPClient;
  }> => {
    if (mcpClient && mcpTools) return { tools: mcpTools, client: mcpClient };

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const { tools, client } = await getSpaceMCPTools();
      setMcpClient(client);
      setMcpTools(tools);
      setIsConnecting(false);
      return { tools, client };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to connect to MCP server";
      setConnectionError(errorMessage);
      setIsConnecting(false);
      throw error;
    }
  }, [mcpClient, mcpTools]);

  // Chat with AI using MCP tools
  const chat = useChat<UIMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish: async () => {
      if (mcpClient) {
        try {
          await mcpClient.close();
        } catch (error) {
          console.warn("Failed to close MCP client:", error);
        }
      }
    },
  });

  // Enhanced send message that initializes MCP first (tools are available server-side)
  const sendMessageWithMCP = useCallback(
    async (message: string) => {
      try {
        await initializeMCP();
        chat.sendMessage({ text: message });
      } catch (error) {
        console.error("Failed to send message with MCP:", error);
        setConnectionError("Failed to connect to space data services");
      }
    },
    [chat, initializeMCP]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mcpClient) {
        mcpClient.close().catch((e) => {
          // eslint-disable-next-line no-console
          console.warn(e);
        });
      }
    };
  }, [mcpClient]);

  return {
    ...chat,
    sendMessageWithMCP,
    isConnecting,
    connectionError,
    mcpConnected: Boolean(mcpClient) && Boolean(mcpTools),
    initializeMCP,
  };
}

/* ------------------------- useSpaceData ------------------------- */

type SpaceData = { content: Array<{ type: string; text: string }> } | Launch[] | null;

export function useSpaceData() {
  const [data, setData] = useState<SpaceData>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchISSPosition = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = await createSpaceMCPClient();

      // Call ISS position tool directly
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: "getISSPosition",
            arguments: { include_passes: true },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ISS data: ${response.status}`);
      }

      const text = await response.text();
      const result = parseSSEFirstData<{ content: Array<{ type: string; text: string }> }>(text);
      if (result) setData(result);

      await client.close();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch ISS data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUpcomingLaunches = useCallback(async (days: number = 30) => {
    setLoading(true);
    setError(null);

    try {
      const client = await createSpaceMCPClient();

      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: "getUpcomingLaunches",
            arguments: { days },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch launch data: ${response.status}`);
      }

      const text = await response.text();
      const result = parseSSEFirstData<Launch[]>(text);
      if (result) setData(result);

      await client.close();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch launch data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchISSPosition,
    fetchUpcomingLaunches,
  };
}
