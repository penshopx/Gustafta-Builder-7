import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, Send, Loader2, ArrowLeft, Plus, Trash2, Bot, User, ChevronRight, Copy, Check, Menu, X, FileDown, FileText, ChevronDown, ChevronUp } from "lucide-react";
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

async function exportMessageToPdf(content: string, agentName: string, agentId?: string, onError?: (msg: string) => void) {
  try {
    const res = await fetch("/api/legal/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, agentName, agentId }),
    });
    if (res.status === 413) {
      onError?.("Konten terlalu panjang untuk diekspor sebagai PDF.");
      return;
    }
    if (!res.ok) throw new Error(`Export failed: ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LexCom-${(agentId || "legal").replace(/[^a-z0-9]/gi, "-")}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("[LexCom] PDF export failed", err);
    onError?.("Gagal mengekspor PDF. Silakan coba lagi.");
  }
}

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

  const [showLegalOpinionForm, setShowLegalOpinionForm] = useState(false);
  const [legalOpinionForm, setLegalOpinionForm] = useState({ clientName: "", facts: "", legalIssues: "", requestedBy: "" });
  const [isGeneratingOpinion, setIsGeneratingOpinion] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

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
    setShowLegalOpinionForm(false);
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

  const generateLegalOpinion = async () => {
    if (!legalOpinionForm.facts.trim() || isGeneratingOpinion) return;

    setShowLegalOpinionForm(false);
    setIsGeneratingOpinion(true);
    setSelectedAgentId("drafter");

    const userContent = `[Permintaan Legal Opinion]\nKlien: ${legalOpinionForm.clientName || "N/A"}\nFakta: ${legalOpinionForm.facts}\nIsu Hukum: ${legalOpinionForm.legalIssues || "Sesuai fakta"}`;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: userContent,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    const assistantId = `a-${Date.now()}`;
    let assistantContent = "";

    const streamMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      agentId: "drafter",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, streamMsg]);

    try {
      const res = await fetch("/api/legal/legal-opinion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(legalOpinionForm),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setGuestLimitReached(true);
        const limitMsg = data.message || "Mode tamu dibatasi. Silakan login untuk akses penuh.";
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: limitMsg } : m));
        return;
      }

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
                prev.map(m => m.id === assistantId ? { ...m, content: assistantContent, agentId: "drafter" } : m)
              );
            }
            if (data.done && data.sessionId) {
              setCurrentSessionId(data.sessionId);
              refetchSessions();
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, content: "Maaf, terjadi kesalahan saat membuat legal opinion. Silakan coba lagi." } : m)
      );
    } finally {
      setIsGeneratingOpinion(false);
      setLegalOpinionForm({ clientName: "", facts: "", legalIssues: "", requestedBy: "" });
    }
  };

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
                  setShowLegalOpinionForm(false);
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
          <div className="flex items-center gap-2 flex-shrink-0">
            {selectedAgentId === "drafter" && (
              <Button
                onClick={() => setShowLegalOpinionForm(prev => !prev)}
                size="sm"
                variant="ghost"
                className="gap-1.5 text-pink-300 border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 hover:text-pink-200 text-xs px-3"
                data-testid="button-toggle-legal-opinion"
              >
                <FileText className="w-3.5 h-3.5" />
                Legal Opinion
                {showLegalOpinionForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            )}
            {isStreaming && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Memproses...
              </Badge>
            )}
          </div>
        </header>

        {selectedAgentId === "drafter" && showLegalOpinionForm && (
          <div className="border-b border-white/10 p-4" style={{ background: "#0d1225" }}>
            <div className="max-w-4xl mx-auto">
              <div className="rounded-xl border border-pink-500/30 bg-pink-500/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-pink-300" />
                  <h3 className="text-pink-200 font-semibold text-sm">Generate Legal Opinion</h3>
                  <span className="text-white/40 text-xs ml-1">— Struktur formal PERADI/HKLI</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label className="text-white/60 text-xs mb-1.5 block">Nama Klien / Perusahaan</Label>
                    <Input
                      value={legalOpinionForm.clientName}
                      onChange={e => setLegalOpinionForm(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="PT. Contoh Maju Tbk"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 text-sm h-9"
                      data-testid="input-opinion-client-name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs mb-1.5 block">Diminta oleh (opsional)</Label>
                    <Input
                      value={legalOpinionForm.requestedBy}
                      onChange={e => setLegalOpinionForm(prev => ({ ...prev, requestedBy: e.target.value }))}
                      placeholder="Nama pengacara / tim legal"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 text-sm h-9"
                      data-testid="input-opinion-requested-by"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <Label className="text-white/60 text-xs mb-1.5 block">Fakta & Kronologi <span className="text-pink-400">*</span></Label>
                  <Textarea
                    value={legalOpinionForm.facts}
                    onChange={e => setLegalOpinionForm(prev => ({ ...prev, facts: e.target.value }))}
                    placeholder="Jelaskan fakta-fakta yang relevan secara kronologis. Misalnya: tanggal kejadian, para pihak yang terlibat, peristiwa hukum, dokumen yang ada..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/30 text-sm min-h-[80px] resize-none"
                    data-testid="input-opinion-facts"
                  />
                </div>
                <div className="mb-4">
                  <Label className="text-white/60 text-xs mb-1.5 block">Permasalahan Hukum yang Diminta (opsional)</Label>
                  <Input
                    value={legalOpinionForm.legalIssues}
                    onChange={e => setLegalOpinionForm(prev => ({ ...prev, legalIssues: e.target.value }))}
                    placeholder="Mis: Apakah PHK sah? Apakah klausa kontrak mengikat?"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/30 text-sm h-9"
                    data-testid="input-opinion-legal-issues"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={generateLegalOpinion}
                    disabled={!legalOpinionForm.facts.trim() || isGeneratingOpinion}
                    className="gap-2 text-white border-0 text-sm"
                    style={{ background: "linear-gradient(135deg, #be185d, #9333ea)" }}
                    data-testid="button-generate-legal-opinion"
                  >
                    {isGeneratingOpinion ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Membuat Opinion...</>
                    ) : (
                      <><FileText className="w-4 h-4" /> Generate Legal Opinion</>
                    )}
                  </Button>
                  <button
                    onClick={() => setShowLegalOpinionForm(false)}
                    className="text-white/40 hover:text-white/70 text-xs transition-colors"
                    data-testid="button-close-legal-opinion-form"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
              {selectedAgentId === "drafter" && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowLegalOpinionForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20 hover:text-pink-200 transition-all text-sm font-medium mb-4"
                    data-testid="button-drafter-legal-opinion-shortcut"
                  >
                    <FileText className="w-4 h-4" />
                    Generate Legal Opinion Formal
                  </button>
                </div>
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
                  <div className="flex items-center gap-1 ml-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="text-white/40 hover:text-white/70 transition-colors p-1 rounded"
                      title="Salin teks"
                      data-testid={`button-copy-${msg.id}`}
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setExportError(null);
                        exportMessageToPdf(msg.content, allAgents.find(a => a.id === msg.agentId)?.name || "LexCom AI", msg.agentId, (err) => {
                          setExportError(err);
                          setTimeout(() => setExportError(null), 5000);
                        });
                      }}
                      className="text-white/40 hover:text-purple-400 transition-colors p-1 rounded"
                      title="Export sebagai PDF"
                      data-testid={`button-export-pdf-${msg.id}`}
                    >
                      <FileDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
            {exportError && (
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-red-500/40 bg-red-500/10 mb-3 text-sm">
                <span className="text-red-300">{exportError}</span>
                <button onClick={() => setExportError(null)} className="text-red-400 hover:text-red-200 flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
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
