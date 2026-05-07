import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, Loader2, ArrowLeft, MessageCircle, ChevronRight, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "wouter";
import { cn } from "@/lib/utils";
import { MessageContent } from "@/lib/format-message";

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

interface ModulData {
  id: string;
  name: string;
  description: string;
  purpose: string;
  seriesName: string;
  chatbots: ChatbotInfo[];
  pricing?: {
    monthlyPrice: number;
    trialEnabled: boolean;
    trialDays: number;
    requireRegistration: boolean;
  };
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ModulChat() {
  const params = useParams<{ bigIdeaId: string }>();
  const [modul, setModul] = useState<ModulData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBot, setSelectedBot] = useState<ChatbotInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef<string>(`modul_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  const [hasAccess, setHasAccess] = useState(true);
  const [accessChecked, setAccessChecked] = useState(false);
  const [showUpgradeWall, setShowUpgradeWall] = useState(false);
  const [subName, setSubName] = useState("");
  const [subEmail, setSubEmail] = useState("");
  const [subPhone, setSubPhone] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("subscribed") === "true") {
      setHasAccess(true);
      setAccessChecked(true);
    }
  }, []);

  useEffect(() => {
    fetch(`/api/public/modul/${params.bigIdeaId}`)
      .then(r => {
        if (!r.ok) throw new Error("Modul tidak ditemukan");
        return r.json();
      })
      .then((data: ModulData) => {
        setModul(data);
        setLoading(false);
        const urlParams = new URLSearchParams(window.location.search);
        const justSubscribed = urlParams.get("subscribed") === "true";
        if (justSubscribed) {
          setHasAccess(true);
          setAccessChecked(true);
          return;
        }
        if (data.pricing && data.pricing.monthlyPrice > 0) {
          const savedToken = localStorage.getItem(`modul_access_${params.bigIdeaId}`);
          const savedEmail = localStorage.getItem(`modul_email_${params.bigIdeaId}`);
          fetch(`/api/modul/${params.bigIdeaId}/access?${savedEmail ? `email=${encodeURIComponent(savedEmail)}` : ""}${savedToken ? `&token=${encodeURIComponent(savedToken)}` : ""}`)
            .then(r => r.json())
            .then(result => {
              setHasAccess(result.hasAccess);
              setAccessChecked(true);
            })
            .catch(() => {
              setHasAccess(false);
              setAccessChecked(true);
            });
        } else {
          setAccessChecked(true);
        }
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
    sessionIdRef.current = `modul_${bot.agentId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
      // Retrieve stored access token for this modul (sent by server via client subscription)
      const storedToken = localStorage.getItem(`modul_access_${params.bigIdeaId}`) ||
                          localStorage.getItem(`modul_token_${params.bigIdeaId}`);

      const streamHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (storedToken) streamHeaders["x-client-token"] = storedToken;

      const res = await fetch("/api/messages/stream", {
        method: "POST",
        headers: streamHeaders,
        body: JSON.stringify({
          agentId: String(selectedBot.agentId),
          content: messageContent,
          role: "user",
          sessionId: sessionIdRef.current,
          clientToken: storedToken || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const reason = errData.reason;
        if (reason === "registration_required" || reason === "no_active_subscription") {
          setShowUpgradeWall(true);
          setMessages(prev => prev.filter(m => m.id !== assistantId));
          setIsStreaming(false);
          return;
        }
        if (reason === "guest_limit_reached") {
          setMessages(prev => prev.map(m => m.id === assistantId
            ? { ...m, content: "Batas pesan gratis tercapai. Silakan daftar untuk melanjutkan." }
            : m
          ));
          setIsStreaming(false);
          return;
        }
        throw new Error(errData.error || "Failed to send message");
      }

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

  const handleSubscribe = useCallback(async (plan: string) => {
    if (!subName.trim() || !subEmail.trim()) return;
    setSubscribing(true);
    try {
      const res = await fetch(`/api/modul/${params.bigIdeaId}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: subName.trim(),
          customerEmail: subEmail.trim(),
          customerPhone: subPhone.trim(),
          plan,
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      if (data.subscription) {
        localStorage.setItem(`modul_access_${params.bigIdeaId}`, data.subscription.accessToken || data.accessToken || "");
        localStorage.setItem(`modul_email_${params.bigIdeaId}`, subEmail.trim());
        setHasAccess(true);
        setShowUpgradeWall(false);
      }
    } catch (err) {
      console.error("Subscribe error:", err);
    } finally {
      setSubscribing(false);
    }
  }, [subName, subEmail, subPhone, params.bigIdeaId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat Modul...</p>
        </div>
      </div>
    );
  }

  if (error || !modul) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardContent className="p-8 text-center">
            <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Modul Tidak Ditemukan</h2>
            <p className="text-muted-foreground">{error || "Halaman yang Anda cari tidak tersedia."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedBot) {
    return (
      <div className="min-h-screen bg-background" data-testid="modul-chat-page">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="text-center mb-8">
            {modul.seriesName && (
              <Badge variant="secondary" className="mb-3" data-testid="badge-series-name">
                {modul.seriesName}
              </Badge>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" data-testid="text-modul-name">
              {modul.name}
            </h1>
            {modul.description && (
              <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-modul-description">
                {modul.description}
              </p>
            )}
            {modul.purpose && (
              <p className="text-sm text-muted-foreground mt-2">
                {modul.purpose}
              </p>
            )}
          </div>

          {accessChecked && !hasAccess && modul.pricing && modul.pricing.monthlyPrice > 0 ? (
            <Card data-testid="modul-upgrade-wall">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <Lock className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Akses Premium</h3>
                  <p className="text-muted-foreground text-sm">
                    Langganan bundle untuk mengakses semua {modul.chatbots.length} chatbot dalam Modul ini.
                  </p>
                </div>
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold">
                    Rp {modul.pricing.monthlyPrice.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-muted-foreground">per bulan</p>
                </div>
                {!showUpgradeWall ? (
                  <div className="flex flex-col items-center gap-3">
                    {modul.pricing.trialEnabled && (
                      <Button onClick={() => setShowUpgradeWall(true)} className="w-full max-w-xs" data-testid="button-start-trial">
                        Coba Gratis {modul.pricing.trialDays} Hari
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setShowUpgradeWall(true)} className="w-full max-w-xs" data-testid="button-subscribe">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Langganan Sekarang
                    </Button>
                  </div>
                ) : (
                  <div className="max-w-sm mx-auto space-y-3">
                    <Input
                      placeholder="Nama Lengkap"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      data-testid="input-sub-name"
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      data-testid="input-sub-email"
                    />
                    <Input
                      placeholder="No. WhatsApp (opsional)"
                      value={subPhone}
                      onChange={(e) => setSubPhone(e.target.value)}
                      data-testid="input-sub-phone"
                    />
                    <div className="flex flex-col gap-2">
                      {modul.pricing.trialEnabled && (
                        <Button
                          onClick={() => handleSubscribe("trial")}
                          disabled={subscribing || !subName.trim() || !subEmail.trim()}
                          className="w-full"
                          data-testid="button-confirm-trial"
                        >
                          {subscribing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Mulai Trial {modul.pricing.trialDays} Hari
                        </Button>
                      )}
                      {modul.pricing.monthlyPrice > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => handleSubscribe("monthly")}
                          disabled={subscribing || !subName.trim() || !subEmail.trim()}
                          className="w-full"
                          data-testid="button-confirm-monthly"
                        >
                          Bayar Rp {modul.pricing.monthlyPrice.toLocaleString("id-ID")}/bulan
                        </Button>
                      )}
                    </div>
                    <Button variant="ghost" onClick={() => setShowUpgradeWall(false)} className="w-full" size="sm">
                      Kembali
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {modul.chatbots.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Belum Ada Chatbot</h3>
                    <p className="text-muted-foreground text-sm">Modul ini belum memiliki chatbot aktif.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {modul.chatbots.map((bot) => (
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
            </>
          )}

          <div className="text-center mt-8 text-xs text-muted-foreground">
            Powered by Gustafta
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background" data-testid="modul-chat-conversation">
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
          {modul.name}
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
                "rounded-lg px-4 py-2.5 text-sm break-words",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground whitespace-pre-wrap"
                  : "bg-muted"
              )}
            >
              {msg.role === "user" ? (
                msg.content
              ) : msg.content ? (
                <MessageContent text={msg.content} />
              ) : isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
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
                  if (!selectedBot || isStreaming) return;
                  const userMsg: Message = {
                    id: `user_${Date.now()}`,
                    role: "user",
                    content: starter,
                    timestamp: new Date(),
                  };
                  setMessages(prev => [...prev, userMsg]);
                  setInput("");

                  const assistantId = `assistant_${Date.now()}`;
                  setMessages(prev => [...prev, {
                    id: assistantId,
                    role: "assistant",
                    content: "",
                    timestamp: new Date(),
                  }]);
                  setIsStreaming(true);

                  fetch("/api/messages/stream", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      agentId: String(selectedBot.agentId),
                      content: starter,
                      role: "user",
                      sessionId: sessionIdRef.current,
                    }),
                  }).then(async (res) => {
                    if (!res.ok) throw new Error("Failed");
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
                  }).catch(() => {
                    setMessages(prev => prev.map(m =>
                      m.id === assistantId ? { ...m, content: "Maaf, terjadi kesalahan. Silakan coba lagi." } : m
                    ));
                  }).finally(() => {
                    setIsStreaming(false);
                  });
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