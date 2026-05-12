import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  FileSearch,
  FileCheck,
  BarChart3,
  Target,
  ChevronRight,
  Database,
  ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface SubAgentStatus {
  agentId: number;
  role: string;
  status: "waiting" | "running" | "done" | "error";
  elapsed?: number;
  preview?: string;
}

interface SirupFetch {
  count: number;
  total: number;
  keyword: string;
  kualifikasi: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  subAgents?: SubAgentStatus[];
  sirupFetch?: SirupFetch;
  orchestrationMs?: number;
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
  "AGENT-FINDER": <FileSearch className="h-3.5 w-3.5" />,
  "AGENT-DOKUMEN": <FileCheck className="h-3.5 w-3.5" />,
  "AGENT-SCORER": <BarChart3 className="h-3.5 w-3.5" />,
  "AGENT-STRATEGI": <Target className="h-3.5 w-3.5" />,
};

const ROLE_COLORS: Record<string, string> = {
  "AGENT-FINDER": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "AGENT-DOKUMEN": "bg-green-500/20 text-green-300 border-green-500/30",
  "AGENT-SCORER": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "AGENT-STRATEGI": "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const SAMPLE_PROMPTS = [
  "Cari tender konstruksi jalan untuk Usaha Kecil di Jawa Timur",
  "Tender gedung pemerintah nilai Rp 5–20 miliar untuk Menengah",
  "Proyek drainase atau irigasi deadline bulan ini",
  "Tender konsultansi pengawasan konstruksi untuk CV",
];

function SubAgentPanel({ agents, sirupFetch }: { agents: SubAgentStatus[]; sirupFetch?: SirupFetch }) {
  if (agents.length === 0) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3 mb-3 space-y-2">
      {sirupFetch && (
        <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 rounded px-2 py-1.5 border border-amber-500/20">
          <Database className="h-3.5 w-3.5 shrink-0" />
          <span>
            SIRUP LKPP: <strong>{sirupFetch.count}</strong> tender ditemukan
            {sirupFetch.keyword ? ` · keyword "${sirupFetch.keyword}"` : ""}
            {sirupFetch.kualifikasi ? ` · kualifikasi ${sirupFetch.kualifikasi}` : ""}
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-1.5">
        {agents.map((agent) => (
          <div
            key={agent.agentId}
            className={`flex items-center gap-1.5 rounded px-2 py-1.5 border text-xs ${ROLE_COLORS[agent.role] ?? "bg-white/5 text-white/60 border-white/10"}`}
          >
            {agent.status === "running" ? (
              <Loader2 className="h-3 w-3 animate-spin shrink-0" />
            ) : agent.status === "done" ? (
              <CheckCircle2 className="h-3 w-3 shrink-0" />
            ) : agent.status === "error" ? (
              <AlertCircle className="h-3 w-3 shrink-0" />
            ) : (
              <Clock className="h-3 w-3 shrink-0 opacity-50" />
            )}
            <span className="font-medium truncate">{agent.role}</span>
            {agent.elapsed && (
              <span className="ml-auto opacity-60 shrink-0">{(agent.elapsed / 1000).toFixed(1)}s</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-sm">
          🏗️
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {!isUser && (msg.subAgents?.length ?? 0) > 0 && (
          <SubAgentPanel agents={msg.subAgents!} sirupFetch={msg.sirupFetch} />
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-amber-500/20 text-amber-100 border border-amber-500/30"
              : "bg-white/5 text-white/90 border border-white/10"
          }`}
        >
          {msg.content || (msg.isStreaming ? <span className="animate-pulse">▋</span> : "")}
        </div>
        {!isUser && msg.orchestrationMs && (
          <div className="flex items-center gap-1 text-xs text-white/30 px-1">
            <Zap className="h-2.5 w-2.5" />
            <span>4 agen paralel · {(msg.orchestrationMs / 1000).toFixed(1)}s</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TenderAiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [agentId, setAgentId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: agentData, isLoading: agentLoading } = useQuery<{ id: number; name: string }>({
    queryKey: ["/api/tender-ai/orchestrator"],
    queryFn: async () => {
      const res = await fetch("/api/tender-ai/orchestrator");
      if (!res.ok) throw new Error("Agent not found");
      return res.json();
    },
    retry: 3,
    retryDelay: 2000,
  });

  useEffect(() => {
    if (agentData?.id) setAgentId(agentData.id);
  }, [agentData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || streaming || !agentId) return;
    setInput("");
    setStreaming(true);

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    const assistantMsg: Message = {
      role: "assistant",
      content: "",
      isStreaming: true,
      subAgents: [],
    };
    setMessages((prev) => [...prev, assistantMsg]);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const orchStart = Date.now();

    try {
      const res = await fetch("/api/messages/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, content: text, conversationHistory: history }),
      });

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";
      let subAgentMap: Map<number, SubAgentStatus> = new Map();
      let sirupFetch: SirupFetch | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6);
          if (raw === "[DONE]") break;
          try {
            const evt = JSON.parse(raw);
            if (evt.type === "sirup_fetched") {
              sirupFetch = { count: evt.count, total: evt.total, keyword: evt.keyword, kualifikasi: evt.kualifikasi };
            } else if (evt.type === "orchestrating_start") {
              const subs: SubAgentStatus[] = (evt.subAgents ?? []).map((s: any) => ({
                agentId: s.agentId,
                role: s.role,
                status: "waiting",
              }));
              subs.forEach((s) => subAgentMap.set(s.agentId, s));
            } else if (evt.type === "sub_agent_start") {
              const s = subAgentMap.get(evt.agentId);
              if (s) s.status = "running";
            } else if (evt.type === "sub_agent_done") {
              const s = subAgentMap.get(evt.agentId);
              if (s) { s.status = "done"; s.elapsed = evt.elapsed; s.preview = evt.preview; }
            } else if (evt.type === "chunk") {
              fullContent += evt.content ?? "";
            } else if (evt.type === "done") {
              fullContent = evt.fullContent ?? fullContent;
            }
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last.role === "assistant") {
                updated[updated.length - 1] = {
                  ...last,
                  content: fullContent,
                  isStreaming: true,
                  subAgents: Array.from(subAgentMap.values()),
                  sirupFetch,
                };
              }
              return updated;
            });
          } catch {}
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content: fullContent,
            isStreaming: false,
            subAgents: Array.from(subAgentMap.values()),
            sirupFetch,
            orchestrationMs: subAgentMap.size > 0 ? Date.now() - orchStart : undefined,
          };
        }
        return updated;
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
            isStreaming: false,
          };
        }
        return updated;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  const ready = !agentLoading && agentId !== null;

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-white">
      {/* Header */}
      <div className="shrink-0 border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <Link href="/tender-monitor">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-lg">
          🏗️
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">KONSTRA-TENDER-ORCHESTRATOR</div>
          <div className="text-xs text-white/40 flex items-center gap-1">
            <Zap className="h-2.5 w-2.5 text-amber-400" />
            <span>4 sub-agen paralel · SIRUP LKPP real-time</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-300">
            Agentic AI
          </Badge>
          {agentLoading && <Loader2 className="h-4 w-4 animate-spin text-white/40" />}
          {ready && (
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* Sub-agent legend */}
      <div className="shrink-0 border-b border-white/5 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {[
          { role: "AGENT-FINDER", label: "Pencari Tender", icon: <FileSearch className="h-3 w-3" /> },
          { role: "AGENT-DOKUMEN", label: "Cek Dokumen", icon: <FileCheck className="h-3 w-3" /> },
          { role: "AGENT-SCORER", label: "Win Probability", icon: <BarChart3 className="h-3 w-3" /> },
          { role: "AGENT-STRATEGI", label: "Strategi Bid", icon: <Target className="h-3 w-3" /> },
        ].map((a) => (
          <div
            key={a.role}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border shrink-0 ${ROLE_COLORS[a.role]}`}
          >
            {a.icon}
            <span>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef as any}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-6 text-center px-4">
            <div className="text-5xl">🏗️</div>
            <div>
              <div className="font-semibold text-lg mb-1">Agentic AI Tender Monitor</div>
              <div className="text-sm text-white/50 max-w-sm">
                Tanya apa saja soal tender konstruksi — sistem akan mengerahkan 4 agen AI secara paralel untuk memberikan analisis komprehensif.
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  disabled={!ready}
                  className="text-left text-xs px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/30 transition-all text-white/70 hover:text-white disabled:opacity-40"
                  data-testid={`prompt-${p.slice(0, 20)}`}
                >
                  <ChevronRight className="h-3 w-3 inline mr-1 text-amber-400" />
                  {p}
                </button>
              ))}
            </div>
            {!ready && agentLoading && (
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Menginisialisasi agen AI...</span>
              </div>
            )}
            {!ready && !agentLoading && !agentId && (
              <Card className="border-red-500/30 bg-red-500/10 max-w-sm w-full">
                <CardContent className="pt-4 text-sm text-red-300 text-center">
                  <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                  Agen AI belum diinisialisasi. Coba refresh halaman.
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {streaming && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content === "" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-sm shrink-0">
                  🏗️
                </div>
                <div className="flex items-center gap-1 text-white/40 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Mendispatch 4 agen paralel...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="shrink-0 border-t border-white/10 px-4 py-3">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder={ready ? "Tanya tentang tender konstruksi, dokumen BUJK, atau strategi penawaran..." : "Menginisialisasi..."}
            disabled={!ready || streaming}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-amber-500/50"
            data-testid="input-chat"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!ready || streaming || !input.trim()}
            className="bg-amber-500 hover:bg-amber-600 text-black shrink-0"
            data-testid="button-send"
          >
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-3 mt-2 px-1">
          <span className="text-xs text-white/30">
            {streaming ? "🟡 Sedang memproses 4 agen paralel..." : ready ? "🟢 Siap · Data SIRUP real-time" : "🔴 Menginisialisasi..."}
          </span>
        </div>
      </div>
    </div>
  );
}
