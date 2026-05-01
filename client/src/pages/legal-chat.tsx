import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Scale, Send, Loader2, ArrowLeft, Plus, Trash2, Bot, User, ChevronRight, Copy, Check, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { MessageContent } from "@/lib/format-message";

interface LegalAgent {
  id: string;
  name: string;
  personaName: string;
  emoji: string;
  domain: string;
  tagline: string;
  greetingMessage?: string | null;
  starters: string[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentId?: string;
  timestamp: Date;
}

interface Session {
  id: number;
  agentType: string;
  title: string;
  messageCount: number;
  updatedAt: string;
}

const ORCHESTRATOR_AGENT: LegalAgent = {
  id: "auto",
  name: "LEX-ORCHESTRATOR",
  personaName: "Lex",
  emoji: "⚖️",
  domain: "Semua Domain Hukum",
  tagline: "Routing otomatis ke 12 spesialis hukum — pidana, perdata, korporasi & lebih.",
  greetingMessage: "Selamat datang di **LexCom**. Saya **Lex**, asisten konsultasi hukum Anda. Saya akan menghubungkan Anda dengan agen spesialis yang tepat — pidana, perdata, korporasi, ketenagakerjaan, pertanahan, pajak, yurisprudensi, drafter, litigasi, atau kepailitan.\n\nSebelum mulai, boleh saya tahu: Anda bertanya sebagai **(a) individu/masyarakat**, **(b) perwakilan perusahaan**, atau **(c) profesional hukum**? Dan domain hukum apa yang ingin dibahas?",
  starters: [
    "Saya kena somasi atas wanprestasi kontrak — apa langkah saya?",
    "Bantu saya analisis risiko hukum sebelum tanda tangan MoU dengan vendor.",
    "Tolong cari yurisprudensi MA tentang PMH terkait kebocoran data pribadi.",
    "Saya butuh draft gugatan perdata wanprestasi senilai Rp 500 juta.",
  ],
};

export default function LegalChat() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialAgent = searchParams.get("agent") || "auto";

  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [selectedAgentId, setSelectedAgentId] = useState(initialAgent);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [guestLimitReached, setGuestLimitReached] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { data: agents = [] } = useQuery<LegalAgent[]>({
    queryKey: ["/api/legal/agents"],
  });

  const { data: sessions = [], refetch: refetchSessions } = useQuery<Session[]>({
    queryKey: ["/api/legal/sessions"],
    enabled: isAuthenticated,
  });

  const deleteSession = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/legal/sessions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/legal/sessions"] });
      if (currentSessionId) {
        setMessages([]);
        setCurrentSessionId(null);
      }
    },
  });

  const allAgents: LegalAgent[] = [ORCHESTRATOR_AGENT, ...agents];
  const selectedAgent = allAgents.find(a => a.id === selectedAgentId) || ORCHESTRATOR_AGENT;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadSession = async (session: Session) => {
    try {
      const res = await fetch(`/api/legal/sessions/${session.id}`);
      if (!res.ok) return;
      const data = await res.json();
      const msgs: ChatMessage[] = (data.messages || []).map((m: any) => ({
        id: String(m.id),
        role: m.role as "user" | "assistant",
        content: m.content,
        agentId: m.agentSelected || m.agentType,
        timestamp: new Date(m.createdAt),
      }));
      setMessages(msgs);
      setCurrentSessionId(session.id);
      setSelectedAgentId(session.agentType || "auto");
      setSidebarOpen(false);
    } catch {}
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setSidebarOpen(false);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isStreaming) return;
    if (guestLimitReached && !isAuthenticated) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: msg,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const assistantId = `a-${Date.now()}`;
    let assistantContent = "";
    let resolvedAgentId = selectedAgentId;

    const streamMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      agentId: resolvedAgentId,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, streamMsg]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/legal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSessionId,
          agentType: selectedAgentId,
          message: msg,
        }),
        signal: abortRef.current.signal,
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setGuestLimitReached(true);
        const limitMsg = data.message || `Mode tamu dibatasi ${data.limit || 5} pesan per hari. Silakan login untuk akses penuh tanpa batas.`;
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: limitMsg } : m)
        );
        setIsStreaming(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Server error");
      }

      const agentFromHeader = res.headers.get("X-Agent-Selected");
      if (agentFromHeader) resolvedAgentId = agentFromHeader;

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No stream");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const raw = decoder.decode(value);
        const lines = raw.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              assistantContent += data.text;
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: assistantContent, agentId: resolvedAgentId } : m
                )
              );
            }
            if (data.done) {
              if (data.sessionId) {
                setCurrentSessionId(data.sessionId);
                refetchSessions();
              }
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: "Maaf, terjadi kesalahan. Silakan coba lagi." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, selectedAgentId, currentSessionId, refetchSessions, guestLimitReached, isAuthenticated]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getAgentColor = (agentId?: string) => {
    if (!agentId || agentId === "auto") return "#7c3aed";
    const colors: Record<string, string> = {
      pidana: "#dc2626",
      perdata: "#2563eb",
      korporasi: "#059669",
      ketenagakerjaan: "#d97706",
      pertanahan: "#7c3aed",
      pajak: "#0891b2",
      yurisprudensi: "#4f46e5",
      drafter: "#be185d",
      litigasi: "#dc2626",
      kepailitan: "#7c2d12",
      multiclaw: "#1d4ed8",
      openclaw: "#7c3aed",
    };
    return colors[agentId] || "#7c3aed";
  };

  const agentEmoji = (id?: string) => {
    const agent = allAgents.find(a => a.id === id);
    return agent?.emoji || "⚖️";
  };

  return (
    <div className="h-screen flex" style={{ background: "#0a0f1e" }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-30 w-72 flex flex-col border-r border-white/10 transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ background: "#080d1a" }}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link href="/legal">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm">LexCom AI</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3">
          <Button
            onClick={startNewChat}
            className="w-full gap-2 text-white border border-white/20 bg-white/5 hover:bg-white/10"
            variant="ghost"
            size="sm"
            data-testid="button-new-chat"
          >
            <Plus className="w-4 h-4" />
            Chat Baru
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pb-2">
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider px-2 mb-2">Agen Spesialis</p>
            {allAgents.map(agent => (
              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgentId(agent.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all mb-1",
                  selectedAgentId === agent.id
                    ? "bg-purple-500/20 border border-purple-500/40"
                    : "hover:bg-white/5 border border-transparent"
                )}
                data-testid={`button-agent-${agent.id}`}
              >
                <span className="text-xl leading-none">{agent.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{agent.name}</div>
                  <div className="text-white/40 text-xs truncate">{agent.domain}</div>
                </div>
              </button>
            ))}
          </div>

          {isAuthenticated && sessions.length > 0 && (
            <div className="px-3 pb-2 mt-2">
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider px-2 mb-2">Riwayat Chat</p>
              {sessions.slice(0, 20).map(session => (
                <div
                  key={session.id}
                  className={cn(
                    "group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all mb-1",
                    currentSessionId === session.id ? "bg-white/10" : "hover:bg-white/5"
                  )}
                  onClick={() => loadSession(session)}
                  data-testid={`session-item-${session.id}`}
                >
                  <span className="text-sm">{agentEmoji(session.agentType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/70 text-xs truncate">{session.title}</div>
                    <div className="text-white/30 text-xs">{session.messageCount} pesan</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteSession.mutate(session.id); }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                    data-testid={`button-delete-session-${session.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/10">
          <p className="text-white/25 text-xs text-center leading-relaxed">
            ⚠️ Bersifat edukatif, bukan pendapat hukum mengikat
          </p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 p-4 border-b border-white/10" style={{ background: "#080d1a" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/60 hover:text-white"
            data-testid="button-menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl">{selectedAgent.emoji}</span>
            <div className="min-w-0">
              <div className="text-white font-semibold text-sm truncate">{selectedAgent.name}</div>
              <div className="text-white/50 text-xs truncate">{selectedAgent.tagline}</div>
            </div>
          </div>
          {isStreaming && (
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Memproses...
            </Badge>
          )}
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">{selectedAgent.emoji}</div>
              <h2 className="text-xl font-bold text-white mb-2">{selectedAgent.personaName}</h2>
              {selectedAgent.greetingMessage ? (
                <div className="max-w-xl mb-8 text-left rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80 leading-relaxed">
                  <MessageContent text={selectedAgent.greetingMessage} />
                </div>
              ) : (
                <p className="text-white/50 text-sm max-w-md mb-8">{selectedAgent.tagline}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {selectedAgent.starters.map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(starter)}
                    className="p-4 rounded-xl border border-white/10 hover:border-purple-500/40 bg-white/5 hover:bg-white/10 text-left text-sm text-white/70 hover:text-white transition-all group"
                    data-testid={`starter-${i}`}
                  >
                    <ChevronRight className="w-4 h-4 text-purple-400 inline mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
              data-testid={`message-${msg.id}`}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-sm"
                  style={{ background: `${getAgentColor(msg.agentId)}22`, border: `1px solid ${getAgentColor(msg.agentId)}44` }}
                >
                  {agentEmoji(msg.agentId)}
                </div>
              )}
              <div className={cn("max-w-[80%] group", msg.role === "user" ? "items-end" : "items-start", "flex flex-col gap-1")}>
                {msg.role === "assistant" && msg.agentId && msg.agentId !== "auto" && (
                  <div className="text-xs text-white/40 ml-1">
                    {allAgents.find(a => a.id === msg.agentId)?.name || msg.agentId}
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm",
                    msg.role === "user"
                      ? "text-white rounded-tr-sm"
                      : "text-white/90 rounded-tl-sm border border-white/10"
                  )}
                  style={
                    msg.role === "user"
                      ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }
                      : { background: "#111827" }
                  }
                >
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : msg.content ? (
                    <MessageContent text={msg.content} className="text-sm" />
                  ) : (
                    <div className="flex items-center gap-2 text-white/40">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sedang menulis...</span>
                    </div>
                  )}
                </div>
                {msg.role === "assistant" && msg.content && (
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="opacity-0 group-hover:opacity-100 ml-1 text-white/40 hover:text-white/70 transition-all"
                    data-testid={`button-copy-${msg.id}`}
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-purple-500/20 border border-purple-500/40">
                  <User className="w-4 h-4 text-purple-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10" style={{ background: "#080d1a" }}>
          <div className="max-w-4xl mx-auto">
            {guestLimitReached && !isAuthenticated ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-purple-500/40 bg-purple-500/10 mb-3">
                <div>
                  <p className="text-purple-200 font-semibold text-sm">Batas pesan tamu tercapai</p>
                  <p className="text-purple-300/70 text-xs mt-0.5">Login untuk lanjut berkonsultasi tanpa batas dengan 12 agen hukum spesialis</p>
                </div>
                <Link href="/api/login">
                  <Button
                    className="text-white border-0 text-sm whitespace-nowrap flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                    data-testid="button-guest-login-cta"
                  >
                    Masuk / Daftar
                  </Button>
                </Link>
              </div>
            ) : null}
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={guestLimitReached && !isAuthenticated ? "Login untuk melanjutkan percakapan..." : `Tanyakan tentang ${selectedAgent.domain}...`}
                  className="resize-none border-white/20 bg-white/5 text-white placeholder:text-white/40 rounded-xl pr-4 focus:border-purple-500/50 focus:ring-purple-500/20 min-h-[52px] max-h-32"
                  rows={1}
                  disabled={isStreaming || (guestLimitReached && !isAuthenticated)}
                  data-testid="input-message"
                />
              </div>
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isStreaming || (guestLimitReached && !isAuthenticated)}
                className="text-white border-0 h-[52px] px-4 rounded-xl"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                data-testid="button-send"
              >
                {isStreaming ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-white/25 text-xs text-center mt-2">
              ⚠️ Bersifat edukatif — bukan pendapat hukum mengikat. Tekan Enter untuk kirim.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
