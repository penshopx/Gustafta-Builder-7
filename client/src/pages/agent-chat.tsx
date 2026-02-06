import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, ArrowLeft, Share2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

function processInlineText(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const m = match[0];
    if (m.startsWith("**") && m.endsWith("**")) {
      parts.push(<strong key={match.index}>{m.slice(2, -2)}</strong>);
    } else if (m.startsWith("__") && m.endsWith("__")) {
      parts.push(<strong key={match.index}>{m.slice(2, -2)}</strong>);
    } else if (m.startsWith("`") && m.endsWith("`")) {
      parts.push(<code key={match.index} className="bg-muted px-1 rounded text-xs">{m.slice(1, -1)}</code>);
    }
    lastIndex = match.index + m.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
}

function formatMessageContent(text: string) {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" = "ul";
  let inList = false;

  const flushList = () => {
    if (listItems.length > 0) {
      const Tag = listType;
      elements.push(
        <Tag key={`list-${elements.length}`} className={cn("space-y-1 text-sm", listType === "ol" ? "list-decimal pl-5" : "list-disc pl-5")}>
          {listItems.map((item, i) => (
            <li key={i}>{processInlineText(item)}</li>
          ))}
        </Tag>
      );
      listItems = [];
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      flushList();
      elements.push(
        <p key={`h-${elements.length}`} className="font-semibold text-sm mt-1">
          {headingMatch[1]}
        </p>
      );
      continue;
    }

    const ulMatch = trimmed.match(/^[-*+]\s+(.+)/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        flushList();
        inList = true;
        listType = "ul";
      }
      listItems.push(ulMatch[1]);
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (!inList || listType !== "ol") {
        flushList();
        inList = true;
        listType = "ol";
      }
      listItems.push(olMatch[1]);
      continue;
    }

    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="text-sm">{processInlineText(trimmed)}</p>
    );
  }

  flushList();
  return <div className="space-y-1.5">{elements}</div>;
}

function AgentAvatar({ config, size = "md", color }: { config: AgentConfig; size?: "sm" | "md" | "lg"; color: string }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-20 h-20",
  };
  const textClasses = {
    sm: "text-xs",
    md: "text-sm font-semibold",
    lg: "text-2xl font-bold",
  };

  return (
    <Avatar className={cn(sizeClasses[size], "shrink-0 border-2")} style={{ borderColor: `${color}40` }}>
      {config.avatar ? (
        <AvatarImage src={config.avatar} alt={config.name} className="object-cover" />
      ) : null}
      <AvatarFallback
        className={textClasses[size]}
        style={{ backgroundColor: `${color}15`, color }}
      >
        {config.name.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
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
          document.title = `${data.name} - Chat`;
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
      const resolvedAgentId = config.agentId || params.agentId;
      const response = await fetch("/api/messages/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: resolvedAgentId,
          role: "user",
          content: content.trim(),
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
      if (voiceMode && assistantContent.trim()) {
        speakText(assistantContent, assistantMessage.id);
      }
    } catch (err) {
      console.error("Chat error:", err);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: config?.name || "Chat",
          text: config?.tagline || "Chat with AI assistant",
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = "id-ID";
      recognition.continuous = false;
      recognition.interimResults = true;

      let finalTranscript = "";

      recognition.onstart = () => {
        setIsListening(true);
        finalTranscript = "";
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interim += transcript;
          }
        }
        setInput(finalTranscript + interim);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (finalTranscript.trim()) {
          sendMessageRef.current(finalTranscript.trim());
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const [voiceMode, setVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakingMessageIdRef = useRef<string | null>(null);

  const speakText = (text: string, messageId?: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/#{1,6}\s*/g, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^[-*+]\s+/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      .replace(/^>\s*/gm, "")
      .replace(/---+/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "id-ID";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      speakingMessageIdRef.current = messageId || null;
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      speakingMessageIdRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      speakingMessageIdRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    speakingMessageIdRef.current = null;
  };

  const toggleSpeech = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setVoiceMode(true);
      setInput("");
      recognitionRef.current.start();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center" data-testid="chat-loading">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">Memuat chatbot...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center p-4" data-testid="chat-error">
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
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden" data-testid="agent-chat-page">
      <header
        className="border-b px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 sticky top-0 z-50"
        style={{ backgroundColor: color }}
        data-testid="chat-header"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href="/">
            <Button size="icon" variant="ghost" className="text-white shrink-0" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </a>
          <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-white/30 shrink-0">
            {config.avatar ? (
              <AvatarImage src={config.avatar} alt={config.name} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-white/20 text-white font-semibold text-sm">
              {config.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-white font-semibold text-sm sm:text-base truncate" data-testid="text-agent-name">
              {config.name}
            </h1>
            {config.tagline && (
              <p className="text-white/70 text-[10px] sm:text-xs truncate max-w-[180px] sm:max-w-none">{config.tagline}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Badge variant="outline" className="text-white border-white/30 text-[10px] hidden sm:inline-flex">
            Online
          </Badge>
          <Button
            size="icon"
            variant="ghost"
            className={cn("text-white shrink-0 toggle-elevate", voiceMode && "toggle-elevated")}
            onClick={() => {
              setVoiceMode(!voiceMode);
              if (voiceMode) stopSpeaking();
            }}
            data-testid="button-voice-mode"
          >
            {voiceMode ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button size="icon" variant="ghost" className="text-white shrink-0" onClick={handleShare} data-testid="button-share">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!hasMessages && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto" data-testid="chat-welcome">
            <AgentAvatar config={config} size="lg" color={color} />

            <div className="text-center space-y-1.5 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold" data-testid="text-welcome-name">{config.name}</h2>
              {config.tagline && (
                <p className="text-muted-foreground text-sm sm:text-base">{config.tagline}</p>
              )}
              {config.philosophy && (
                <p className="text-xs sm:text-sm text-muted-foreground/80 italic max-w-md px-4">
                  "{config.philosophy}"
                </p>
              )}
            </div>

            <div
              className="rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm max-w-md text-center"
              style={{ backgroundColor: `${color}10`, color }}
            >
              {config.greetingMessage}
            </div>

            {config.conversationStarters.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-w-lg px-2" data-testid="conversation-starters">
                {config.conversationStarters.slice(0, 5).map((starter, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-[11px] sm:text-xs"
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
          <div className="flex-1 overflow-y-auto px-3 sm:px-4" ref={scrollRef}>
            <div className="py-3 sm:py-4 space-y-3 sm:space-y-4 max-w-2xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-2 sm:gap-3", message.role === "user" && "flex-row-reverse")}
                  data-testid={`message-${message.id}`}
                >
                  {message.role === "assistant" ? (
                    <AgentAvatar config={config} size="sm" color={color} />
                  ) : (
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="text-xs bg-muted">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "flex flex-col gap-0.5 sm:gap-1 max-w-[85%] sm:max-w-[75%]",
                      message.role === "user" && "items-end"
                    )}
                  >
                    <span className="text-[10px] text-muted-foreground px-1">
                      {message.role === "user" ? "Anda" : config.name}
                    </span>
                    <div
                      className={cn(
                        "rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 whitespace-pre-wrap break-words",
                        message.role === "user"
                          ? "rounded-tr-sm text-white"
                          : "bg-muted rounded-tl-sm"
                      )}
                      style={
                        message.role === "user" ? { backgroundColor: color } : {}
                      }
                    >
                      {message.role === "user"
                        ? <span className="text-sm">{message.content}</span>
                        : formatMessageContent(message.content)}
                    </div>
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[10px] text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.role === "assistant" && message.content && (
                        <button
                          onClick={() => {
                            if (isSpeaking && speakingMessageIdRef.current === message.id) {
                              stopSpeaking();
                            } else {
                              speakText(message.content, message.id);
                            }
                          }}
                          className="text-muted-foreground/60 hover-elevate rounded-full p-0.5"
                          data-testid={`button-speak-${message.id}`}
                        >
                          {isSpeaking && speakingMessageIdRef.current === message.id ? (
                            <VolumeX className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 sm:gap-3">
                  <AgentAvatar config={config} size="sm" color={color} />
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2.5 sm:py-3">
                    <div className="flex gap-1.5 items-center">
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Mengetik...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-2.5 sm:p-4 border-t bg-background safe-area-bottom">
          {isListening && (
            <div className="flex items-center justify-center gap-2 pb-2 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs text-destructive font-medium">Mendengarkan... bicara sekarang</span>
              </div>
            </div>
          )}
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
              placeholder={isListening ? "Mendengarkan suara Anda..." : `Ketik atau tekan mikrofon...`}
              className="resize-none text-sm rounded-xl"
              rows={1}
              disabled={isTyping || isListening}
              data-testid="input-chat-message"
            />
            {speechSupported && (
              <Button
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleSpeech}
                disabled={isTyping}
                className="shrink-0 rounded-xl"
                data-testid="button-voice-input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
            <Button
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping || isListening}
              className="shrink-0 rounded-xl"
              style={{ backgroundColor: color }}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1.5 sm:mt-2">
            Powered by <a href="/" className="font-medium hover:underline">Gustafta</a>
          </p>
        </div>
      </div>
    </div>
  );
}
