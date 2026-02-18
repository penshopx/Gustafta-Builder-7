import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, Loader2, ArrowLeft, MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "wouter";
import { cn } from "@/lib/utils";

interface ChatbotInfo {
  agentId: string;
  name: string;
  avatar: string;
  description: string;
  tagline: string;
  greetingMessage: string;
  conversationStarters: string[];
  color: string;
  category: string;
  subcategory: string;
  toolboxName: string;
  toolboxId: string;
  slug: string;
}

interface PerspektifData {
  id: string;
  name: string;
  description: string;
  purpose: string;
  seriesName: string;
  chatbots: ChatbotInfo[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function PerspektifChat() {
  const params = useParams<{ bigIdeaId: string }>();
  const [perspektif, setPerspektif] = useState<PerspektifData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBot, setSelectedBot] = useState<ChatbotInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef<string>(`perspektif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    fetch(`/api/public/perspektif/${params.bigIdeaId}`)
      .then(r => {
        if (!r.ok) throw new Error("Perspektif tidak ditemukan");
        return r.json();
      })
      .then((data: PerspektifData) => {
        setPerspektif(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.bigIdeaId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectBot = useCallback((bot: ChatbotInfo) => {
    setSelectedBot(bot);
    setMessages([{
      id: "greeting",
      role: "assistant",
      content: bot.greetingMessage || "Halo! Ada yang bisa saya bantu?",
      timestamp: new Date(),
    }]);
    sessionIdRef.current = `perspektif_${bot.agentId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  const goBack = useCallback(() => {
    setSelectedBot(null);
    setMessages([]);
    setInput("");
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !selectedBot || isStreaming) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    const messageContent = input.trim();
    setInput("");
    setIsStreaming(true);

    const assistantId = `assistant_${Date.now()}`;
    setMessages(prev => [...prev, {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }]);

    try {
      const res = await fetch("/api/messages/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: Number(selectedBot.agentId),
          content: messageContent,
          role: "user",
          sessionId: sessionIdRef.current,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulated = "";
        while (true) {
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
                  accumulated += parsed.content;
                  const cleaned = accumulated
                    .replace(/\[SAVE_MEMORY\][\s\S]*?\[\/SAVE_MEMORY\]/g, "")
                    .replace(/\[DELETE_MEMORY\][\s\S]*?\[\/DELETE_MEMORY\]/g, "");
                  setMessages(prev => prev.map(m =>
                    m.id === assistantId ? { ...m, content: cleaned } : m
                  ));
                }
              } catch {}
            }
          }
        }
      }
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, content: "Maaf, terjadi kesalahan. Silakan coba lagi." } : m
      ));
    } finally {
      setIsStreaming(false);
    }
  }, [input, selectedBot, isStreaming]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat Perspektif...</p>
        </div>
      </div>
    );
  }

  if (error || !perspektif) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardContent className="p-8 text-center">
            <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Perspektif Tidak Ditemukan</h2>
            <p className="text-muted-foreground">{error || "Halaman yang Anda cari tidak tersedia."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedBot) {
    return (
      <div className="min-h-screen bg-background" data-testid="perspektif-chat-page">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="text-center mb-8">
            {perspektif.seriesName && (
              <Badge variant="secondary" className="mb-3" data-testid="badge-series-name">
                {perspektif.seriesName}
              </Badge>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" data-testid="text-perspektif-name">
              {perspektif.name}
            </h1>
            {perspektif.description && (
              <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-perspektif-description">
                {perspektif.description}
              </p>
            )}
            {perspektif.purpose && (
              <p className="text-sm text-muted-foreground mt-2">
                {perspektif.purpose}
              </p>
            )}
          </div>

          {perspektif.chatbots.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">Belum Ada Chatbot</h3>
                <p className="text-muted-foreground text-sm">Perspektif ini belum memiliki chatbot aktif.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {perspektif.chatbots.map((bot) => (
                <Card
                  key={bot.agentId}
                  className="cursor-pointer hover-elevate transition-all"
                  onClick={() => selectBot(bot)}
                  data-testid={`card-chatbot-${bot.agentId}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 shrink-0">
                        <AvatarImage src={bot.avatar} alt={bot.name} />
                        <AvatarFallback style={{ backgroundColor: bot.color }}>
                          <Bot className="w-6 h-6 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate" data-testid={`text-bot-name-${bot.agentId}`}>
                            {bot.name}
                          </h3>
                          {bot.category && (
                            <Badge variant="secondary" className="text-xs">
                              {bot.category}
                            </Badge>
                          )}
                        </div>
                        {bot.tagline && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {bot.tagline}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{bot.toolboxName}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8 text-xs text-muted-foreground">
            Powered by Gustafta
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background" data-testid="perspektif-chat-conversation">
      <header className="flex items-center gap-3 p-3 border-b shrink-0">
        <Button variant="ghost" size="icon" onClick={goBack} data-testid="button-back-to-list">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-9 h-9">
          <AvatarImage src={selectedBot.avatar} alt={selectedBot.name} />
          <AvatarFallback style={{ backgroundColor: selectedBot.color }}>
            <Bot className="w-4 h-4 text-white" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-sm truncate" data-testid="text-active-bot-name">{selectedBot.name}</h2>
          <p className="text-xs text-muted-foreground truncate">{selectedBot.tagline || selectedBot.toolboxName}</p>
        </div>
        <Badge variant="secondary" className="text-xs shrink-0">
          {perspektif.name}
        </Badge>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
            data-testid={`message-${msg.id}`}
          >
            {msg.role === "assistant" && (
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={selectedBot.avatar} alt={selectedBot.name} />
                <AvatarFallback style={{ backgroundColor: selectedBot.color }}>
                  <Bot className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {msg.content || (msg.role === "assistant" && isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null)}
            </div>
          </div>
        ))}

        {selectedBot.conversationStarters && selectedBot.conversationStarters.length > 0 && messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {selectedBot.conversationStarters.map((starter, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(starter);
                  setTimeout(() => sendMessage(), 0);
                }}
                data-testid={`button-starter-${i}`}
              >
                {starter}
              </Button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 shrink-0">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan..."
            className="resize-none min-h-[44px] max-h-[120px]"
            rows={1}
            disabled={isStreaming}
            data-testid="input-chat-message"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            size="icon"
            data-testid="button-send-message"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}