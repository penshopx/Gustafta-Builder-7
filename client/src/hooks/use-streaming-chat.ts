import { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Message } from "@shared/schema";

interface StreamingChatOptions {
  agentId: string;
  onChunk?: (chunk: string) => void;
  onComplete?: (message: Message) => void;
  onError?: (error: string) => void;
}

interface StreamingChatState {
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
}

export function useStreamingChat() {
  const queryClient = useQueryClient();
  const [state, setState] = useState<StreamingChatState>({
    isStreaming: false,
    streamingContent: "",
    error: null,
  });
  const abortControllerRef = useRef<AbortController | null>(null);
  const bufferRef = useRef<string>("");

  const parseSSEEvents = useCallback((buffer: string): { events: any[]; remaining: string; parseErrors: string[] } => {
    const events: any[] = [];
    const parseErrors: string[] = [];
    const eventBlocks = buffer.split("\n\n");
    
    for (let i = 0; i < eventBlocks.length - 1; i++) {
      const eventBlock = eventBlocks[i];
      if (!eventBlock.trim()) continue;
      
      const lines = eventBlock.split("\n");
      let dataContent = "";
      
      for (const line of lines) {
        if (line.startsWith(":")) continue;
        if (line.startsWith("data: ")) {
          dataContent += line.slice(6);
        } else if (line.startsWith("data:")) {
          dataContent += line.slice(5);
        }
      }
      
      if (dataContent) {
        try {
          const data = JSON.parse(dataContent);
          events.push(data);
        } catch (parseError) {
          const errorMsg = `SSE parse error: ${parseError instanceof Error ? parseError.message : "Unknown"}`;
          console.warn(errorMsg, dataContent);
          parseErrors.push(errorMsg);
        }
      }
    }
    
    return {
      events,
      remaining: eventBlocks[eventBlocks.length - 1] || "",
      parseErrors,
    };
  }, []);

  const sendStreamingMessage = useCallback(async (
    content: string,
    options: StreamingChatOptions
  ): Promise<Message | null> => {
    const { agentId, onChunk, onComplete, onError } = options;

    setState({ isStreaming: true, streamingContent: "", error: null });
    bufferRef.current = "";
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/messages/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId,
          content,
          role: "user",
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        let errorMessage = "Failed to send message";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullContent = "";
      let aiMessage: Message | null = null;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          if (bufferRef.current.trim()) {
            const { events, parseErrors } = parseSSEEvents(bufferRef.current + "\n\n");
            if (parseErrors.length > 0 && !aiMessage) {
              console.error("SSE final parse errors:", parseErrors);
            }
            for (const data of events) {
              if (data.type === "complete") {
                aiMessage = data.message;
                onComplete?.(data.message);
              }
            }
          }
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        bufferRef.current += chunk;
        
        const { events, remaining, parseErrors } = parseSSEEvents(bufferRef.current);
        bufferRef.current = remaining;
        
        if (parseErrors.length > 0) {
          console.error("SSE parse errors during streaming:", parseErrors);
          if (parseErrors.length > 3) {
            setState(prev => ({
              ...prev,
              isStreaming: false,
              error: "Multiple parse errors occurred during streaming",
            }));
            onError?.("Streaming response corrupted");
            return null;
          }
        }

        for (const data of events) {
          if (data.type === "user_message") {
            queryClient.invalidateQueries({ queryKey: ["/api/messages", agentId] });
          } else if (data.type === "chunk") {
            fullContent += data.content;
            setState(prev => ({
              ...prev,
              streamingContent: fullContent,
            }));
            onChunk?.(data.content);
          } else if (data.type === "complete") {
            aiMessage = data.message;
            setState(prev => ({
              ...prev,
              isStreaming: false,
              streamingContent: "",
            }));
            queryClient.invalidateQueries({ queryKey: ["/api/messages", agentId] });
            onComplete?.(data.message);
          } else if (data.type === "error") {
            throw new Error(data.error);
          } else if (data.type === "ping") {
          }
        }
      }

      setState(prev => ({
        ...prev,
        isStreaming: false,
      }));

      return aiMessage;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setState(prev => ({
          ...prev,
          isStreaming: false,
          error: null,
        }));
        return null;
      }
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: errorMessage,
      }));
      onError?.(errorMessage);
      return null;
    }
  }, [queryClient, parseSSEEvents]);

  const cancelStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      bufferRef.current = "";
      setState(prev => ({
        ...prev,
        isStreaming: false,
      }));
    }
  }, []);

  return {
    ...state,
    sendStreamingMessage,
    cancelStreaming,
  };
}
