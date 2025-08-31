"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

/** Parts we actually render */
type TextPart = {
  type: "text";
  text: string;
};

/** Minimal message shape we need for the UI */
type BaseMessage = {
  id?: string;
  role: "user" | "assistant" | "system" | "tool";
};

/**
 * We only render text parts (agentic stream produces many part types,
 * but we ignore non-text types on purpose).
 * `content` is kept for legacy/simple messages.
 */
type ChatMessage =
  | (BaseMessage & { parts?: ReadonlyArray<TextPart>; content?: string })
  | (BaseMessage & { parts?: undefined; content?: string });

export function ChatInterface() {
  // Agentic/Data Stream transport to match server's createUIMessageStreamResponse
  const { messages, sendMessage, status, error } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickQuestions = useMemo<string[]>(
    () => [
      "Where is the ISS right now?",
      "What rockets are launching soon?",
      "Tell me about SpaceX missions",
      "Show me upcoming NASA launches",
    ],
    []
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    sendMessage({ text: trimmed });
  };

  const sendQuick = (q: string) => sendMessage({ text: q });

  const renderMessageText = (m: ChatMessage): string => {
    // Prefer text parts (agentic / data-stream)
    if (Array.isArray(m.parts) && m.parts.length > 0) {
      const texts = m.parts
        .filter(
          (p): p is TextPart => p?.type === "text" && typeof p.text === "string"
        )
        .map((p) => p.text)
        .join("");
      if (texts) return texts;
    }
    // Fallback to legacy content
    if (typeof m.content === "string") return m.content;
    return "";
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        <div className="text-sm text-green-400">🛰️ MCP space tools ready</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🌌</div>
            <h3 className="text-xl font-semibold mb-2">
              Welcome to Galactic Grid
            </h3>
            <p className="text-gray-400 mb-6">
              Ask me anything about space missions, rocket launches, or the
              International Space Station!
            </p>

            {/* Quick Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendQuick(q)}
                  disabled={isBusy}
                  className="p-3 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, idx) => {
          const text = renderMessageText(m);
          if (!text && m.role !== "user") return null; // hide non-text assistant step messages
          return (
            <div
              key={m.id ?? idx}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-400">🤖</span>
                    <span className="text-sm font-medium text-blue-400">
                      Galactic Grid AI
                    </span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">
                  {m.role === "user" ? m.content ?? text : text}
                </div>
              </div>
            </div>
          );
        })}

        {isBusy && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full animate-bounce bg-blue-400" />
                <div
                  className="w-2 h-2 rounded-full animate-bounce bg-blue-400"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce bg-blue-400"
                  style={{ animationDelay: "0.2s" }}
                />
                <span className="text-gray-400 text-sm ml-2">
                  🛰️ Fetching live space data…
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span className="font-medium">Connection Error</span>
            </div>
            <p className="text-sm mt-1 break-words">{String(error)}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={onSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask about space missions, ISS location, or upcoming launches..."
              disabled={isBusy}
              className={`w-full p-3 bg-gray-800 text-white rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isFocused ? "border-blue-500" : "border-gray-600"
              }`}
            />
            <div
              className={`absolute inset-0 rounded-lg pointer-events-none transition-all ${
                isFocused ? "ring-2 ring-blue-500/20" : ""
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isBusy}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isBusy ? "🚀" : "⬆️"}
          </button>
        </form>
      </div>
    </div>
  );
}
