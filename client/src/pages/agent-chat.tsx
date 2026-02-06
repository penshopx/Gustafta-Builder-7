import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useParams } from "wouter";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentConfig {
  agentId: string;
  name: string;
  avatar: string;
  tagline: string;
  greetingMessage: string;
  welcomeMessage: string;
  conversationStarters: string[];
  personality: string;
  philosophy: string;
  category: string;
  subcategory: string;
  color: string;
  isActive: boolean;
  isPublic: boolean;
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s*/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^>\s*/gm, "")
    .replace(/---+/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .trim();
}

export default function AgentChat() {
  const params = useParams<{ agentId: string }>();
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef(`chat_${params.agentId}_${Date.now()}`);

  useEffect(() => {
    if (params.agentId) {
      fetch(`/api/widget/config/${params.agentId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Agent not found");
          return res.json();
        })
        .then((data) => {
          setConfig(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [params.agentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping || !config) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/messages/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: params.agentId,
          message: content.trim(),
          sessionId: sessionIdRef.current,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (updated[lastIdx]?.role === "assistant") {
                    updated[lastIdx] = {
                      ...updated[lastIdx],
                      content: assistantContent,
                    };
                  }
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="chat-loading">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Memuat chatbot...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="chat-error">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <Bot className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Chatbot Tidak Ditemukan</h2>
          <p className="text-muted-foreground text-sm">
            Chatbot ini mungkin tidak aktif, tidak publik, atau link-nya tidak valid.
          </p>
          <a href="/">
            <Button variant="outline" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </a>
        </Card>
      </div>
    );
  }

  const color = config.color || "#6366f1";
  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="agent-chat-page">
      <header
        className="border-b px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-50"
        style={{ backgroundColor: color }}
        data-testid="chat-header"
      >
        <div className="flex items-center gap-3 min-w-0">
          <a href="/">
            <Button size="icon" variant="ghost" className="text-white shrink-0" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </a>
          <Avatar className="w-10 h-10 border-2 border-white/30 shrink-0">
            {config.avatar ? (
              <AvatarImage src={config.avatar} alt={config.name} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-white/20 text-white font-semibold">
              {config.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-white font-semibold truncate" data-testid="text-agent-name">
              {config.name}
            </h1>
            {config.tagline && (
              <p className="text-white/70 text-xs truncate">{config.tagline}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Badge variant="outline" className="text-white border-white/30 text-[10px]">
            Online
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto">
        {!hasMessages && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6" data-testid="chat-welcome">
            <Avatar className="w-20 h-20 border-4" style={{ borderColor: `${color}40` }}>
              {config.avatar ? (
                <AvatarImage src={config.avatar} alt={config.name} className="object-cover" />
              ) : null}
              <AvatarFallback
                className="text-2xl font-bold"
                style={{ backgroundColor: `${color}15`, color }}
              >
                {config.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold" data-testid="text-welcome-name">{config.name}</h2>
              {config.tagline && (
                <p className="text-muted-foreground">{config.tagline}</p>
              )}
              {config.philosophy && (
                <p className="text-sm text-muted-foreground/80 italic max-w-md">
                  "{config.philosophy}"
                </p>
              )}
            </div>

            <div
              className="rounded-xl px-5 py-3 text-sm max-w-md text-center"
              style={{ backgroundColor: `${color}10`, color }}
            >
              {config.greetingMessage}
            </div>

            {config.conversationStarters.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-w-lg" data-testid="conversation-starters">
                {config.conversationStarters.slice(0, 5).map((starter, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => sendMessage(starter)}
                    data-testid={`button-starter-${idx}`}
                  >
                    {starter}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {hasMessages && (
          <ScrollArea className="flex-1 px-4" ref={scrollRef}>
            <div className="py-4 space-y-4 max-w-2xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
                  data-testid={`message-${message.id}`}
                >
                  <Avatar className="w-8 h-8 shrink-0">
                    {message.role === "assistant" && config.avatar ? (
                      <AvatarImage src={config.avatar} alt={config.name} className="object-cover" />
                    ) : null}
                    <AvatarFallback
                      className="text-xs"
                      style={
                        message.role === "assistant"
                          ? { backgroundColor: `${color}20`, color }
                          : {}
                      }
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        config.name.substring(0, 2).toUpperCase()
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "flex flex-col gap-1 max-w-[80%]",
                      message.role === "user" && "items-end"
                    )}
                  >
                    <span className="text-[10px] text-muted-foreground">
                      {message.role === "user" ? "Anda" : config.name}
                    </span>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words",
                        message.role === "user"
                          ? "rounded-tr-sm text-white"
                          : "bg-muted rounded-tl-sm"
                      )}
                      style={
                        message.role === "user" ? { backgroundColor: color } : {}
                      }
                    >
                      {message.role === "user"
                        ? message.content
                        : cleanMarkdown(message.content)}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    {config.avatar ? (
                      <AvatarImage src={config.avatar} alt={config.name} className="object-cover" />
                    ) : null}
                    <AvatarFallback
                      className="text-xs"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {config.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Mengetik...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
          <div className="flex gap-2 items-end max-w-2xl mx-auto">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Ketik pesan ke ${config.name}...`}
              className="min-h-[44px] max-h-[120px] resize-none text-sm rounded-xl"
              rows={1}
              disabled={isTyping}
              data-testid="input-chat-message"
            />
            <Button
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="shrink-0 rounded-xl"
              style={{ backgroundColor: color }}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Powered by <a href="/" className="font-medium hover:underline">Gustafta</a>
          </p>
        </div>
      </div>
    </div>
  );
}
