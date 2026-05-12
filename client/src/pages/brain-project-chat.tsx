import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft, Send, Loader2, Zap, CheckCircle2, Clock, AlertCircle,
  HardHat, ClipboardList, ShieldCheck, Brain, ChevronDown, ChevronUp,
} from "lucide-react";
import { Link } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubAgentStatus {
  agentId: number;
  role: string;
  status: "waiting" | "running" | "done" | "error";
  elapsed?: number;
  preview?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  subAgents?: SubAgentStatus[];
  orchestrationMs?: number;
}

// ─── Agent Metadata ───────────────────────────────────────────────────────────

const ROLE_META: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  "BRAIN-KONSULTAN": {
    icon: <ClipboardList className="h-3 w-3" />,
    label: "Konsultan",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  "BRAIN-MK": {
    icon: <HardHat className="h-3 w-3" />,
    label: "Pengawas/MK",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  "BRAIN-K3": {
    icon: <ShieldCheck className="h-3 w-3" />,
    label: "K3 & Lingkungan",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
};

const AGENT_LEGEND = ["BRAIN-KONSULTAN", "BRAIN-MK", "BRAIN-K3"];

function getRoleMeta(role: string) {
  for (const key of Object.keys(ROLE_META)) {
    if (role.includes(key)) return ROLE_META[key];
  }
  return { icon: <Brain className="h-3 w-3" />, label: role, color: "bg-white/10 text-white/60 border-white/20" };
}

function statusIcon(status: SubAgentStatus["status"]) {
  if (status === "running") return <Loader2 className="h-3 w-3 animate-spin text-yellow-400" />;
  if (status === "done") return <CheckCircle2 className="h-3 w-3 text-green-400" />;
  if (status === "error") return <AlertCircle className="h-3 w-3 text-red-400" />;
  return <Clock className="h-3 w-3 text-white/30" />;
}

// ─── Sub-Agent Panel ──────────────────────────────────────────────────────────

function SubAgentPanel({ agents }: { agents: SubAgentStatus[] }) {
  const [expanded, setExpanded] = useState(false);
  const running = agents.filter(a => a.status === "running").length;
  const done = agents.filter(a => a.status === "done").length;

  return (
    <div className="mt-2 rounded-lg border border-indigo-800/40 bg-indigo-950/40 text-xs overflow-hidden">
      <button
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <Brain className="h-3 w-3 text-indigo-400 shrink-0" />
        <span className="text-indigo-300 font-medium">
          {running > 0 ? `${running} topi aktif…` : `${done}/${agents.length} topi selesai`}
        </span>
        <div className="flex gap-1 ml-auto">
          {agents.map((a, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${
              a.status === "done" ? "bg-green-400" :
              a.status === "running" ? "bg-yellow-400 animate-pulse" :
              a.status === "error" ? "bg-red-400" : "bg-white/20"
            }`} />
          ))}
        </div>
        {expanded ? <ChevronUp className="h-3 w-3 text-white/30" /> : <ChevronDown className="h-3 w-3 text-white/30" />}
      </button>
      {expanded && (
        <div className="border-t border-indigo-800/30 px-3 py-2 space-y-1.5">
          {agents.map((a, i) => {
            const meta = getRoleMeta(a.role);
            return (
              <div key={i} className="flex items-start gap-2">
                {statusIcon(a.status)}
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-xs ${meta.color}`}>
                  {meta.icon}
                  <span>{meta.label}</span>
                </div>
                {a.elapsed && <span className="text-white/30 ml-auto">{(a.elapsed / 1000).toFixed(1)}s</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Message Renderer ─────────────────────────────────────────────────────────

function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 bg-indigo-700/70 text-white text-sm">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-700/40 flex items-center justify-center text-base shrink-0 mt-0.5">
        🧠
      </div>
      <div className="flex-1 min-w-0">
        {msg.subAgents && msg.subAgents.length > 0 && (
          <SubAgentPanel agents={msg.subAgents} />
        )}
        <div
          className="mt-2 text-sm text-white/90 leading-relaxed whitespace-pre-wrap"
          style={{ wordBreak: "break-word" }}
        >
          {msg.content || (msg.isStreaming ? <span className="animate-pulse">▋</span> : "")}
        </div>
        {!isUser && msg.orchestrationMs && (
          <div className="flex items-center gap-1 text-xs text-white/30 px-1 mt-1">
            <Zap className="h-2.5 w-2.5" />
            <span>
              {msg.subAgents?.length ?? 0} topi paralel · {(msg.orchestrationMs / 1000).toFixed(1)}s
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sample Prompts ───────────────────────────────────────────────────────────

const SAMPLE_PROMPTS = [
  { icon: "📊", text: "Review LHP proyek gedung kantor Rp 8 M — deviasi kurva-S −7%, cuaca hujan 3 hari terakhir" },
  { icon: "⚠️", text: "Hitung SPI/CPI: PV Rp 3,2 M | EV Rp 2,8 M | AC Rp 3,5 M | BAC Rp 10 M. Analisis EAC & rekomendasi" },
  { icon: "🦺", text: "Near miss: pekerja hampir jatuh dari scaffold lantai 5. Ini ke-2 kalinya. Buat investigasi 5-Why dan CAPA" },
  { icon: "📋", text: "Kuat tekan beton kolom hasil test cube 24 MPa, spesifikasi f'c 30 MPa. Langkah NCR dan klaim kontrak?" },
  { icon: "⏱️", text: "VO kumulatif sudah 9,5% nilai kontrak (Rp 850 jt dari Rp 8,9 M). Risiko kontrak dan langkah formal FIDIC?" },
  { icon: "💰", text: "Cuaca ekstrem 5 hari menyebabkan pekerjaan pondasi terhenti. Bagaimana prosedur klaim EOT? Dokumen apa yang diperlukan?" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BrainProjectChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [agentId, setAgentId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: agentData, isLoading: agentLoading } = useQuery<{
    id: number;
    name: string;
    tagline?: string;
    avatar?: string;
  }>({
    queryKey: ["/api/brain-project/orchestrator"],
    queryFn: async () => {
      const res = await fetch("/api/brain-project/orchestrator");
      if (!res.ok) throw new Error("Brain Project agent not found");
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
    setMessages(prev => [...prev, userMsg]);

    const assistantMsg: Message = {
      role: "assistant",
      content: "",
      isStreaming: true,
      subAgents: [],
    };
    setMessages(prev => [...prev, assistantMsg]);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const orchStart = Date.now();

    try {
      const res = await fetch("/api/messages/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          content: text,
          conversationHistory: history,
        }),
      });

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";
      const subAgentMap: Map<number, SubAgentStatus> = new Map();

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

            if (evt.type === "orchestrating_start") {
              const subs: SubAgentStatus[] = (evt.subAgents ?? []).map((sa: any) => ({
                agentId: sa.agentId,
                role: sa.role,
                status: "waiting",
              }));
              subs.forEach(s => subAgentMap.set(s.agentId, s));
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = { ...last, subAgents: [...subAgentMap.values()] };
                }
                return updated;
              });
            } else if (evt.type === "sub_agent_start") {
              const s = subAgentMap.get(evt.agentId);
              if (s) { s.status = "running"; subAgentMap.set(evt.agentId, { ...s }); }
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = { ...last, subAgents: [...subAgentMap.values()] };
                }
                return updated;
              });
            } else if (evt.type === "sub_agent_done") {
              const s = subAgentMap.get(evt.agentId);
              if (s) { s.status = "done"; s.elapsed = evt.elapsed; s.preview = evt.preview; subAgentMap.set(evt.agentId, { ...s }); }
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = { ...last, subAgents: [...subAgentMap.values()] };
                }
                return updated;
              });
            } else if (evt.type === "content" && evt.text) {
              fullContent += evt.text;
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: fullContent,
                    subAgents: [...subAgentMap.values()],
                  };
                }
                return updated;
              });
            }
          } catch {}
        }
      }

      const orchMs = Date.now() - orchStart;
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            isStreaming: false,
            subAgents: [...subAgentMap.values()],
            orchestrationMs: orchMs,
          };
        }
        return updated;
      });
    } catch {
      setMessages(prev => {
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
    <div className="flex flex-col h-screen bg-[#0a0b14] text-white">

      {/* Header */}
      <div className="shrink-0 border-b border-white/10 px-4 py-3 flex items-center gap-3 bg-[#0d0e1e]/80 backdrop-blur">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="w-9 h-9 rounded-full bg-indigo-900/60 border border-indigo-600/40 flex items-center justify-center text-lg">
          🧠
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">
            {agentData?.name ?? "BRAIN-ORCHESTRATOR"}
          </div>
          <div className="text-xs text-white/40 flex items-center gap-1">
            <Zap className="h-2.5 w-2.5 text-indigo-400" />
            <span>3 Topi Paralel: Konsultan · Pengawas/MK · K3 & Lingkungan · ABD-7</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-indigo-500/40 text-indigo-300 hidden sm:flex">
            Brain Project
          </Badge>
          <Badge variant="outline" className="text-xs border-white/20 text-white/50">
            ABD v1.1
          </Badge>
          {agentLoading && <Loader2 className="h-4 w-4 animate-spin text-white/40" />}
          {ready && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
        </div>
      </div>

      {/* Agent legend strip */}
      <div className="shrink-0 border-b border-white/5 px-3 py-2 flex items-center gap-2 overflow-x-auto bg-[#0b0c1a]/60">
        <span className="text-xs text-white/30 shrink-0">3 Topi:</span>
        {AGENT_LEGEND.map(role => {
          const meta = getRoleMeta(role);
          return (
            <div key={role} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded border shrink-0 ${meta.color}`}>
              {meta.icon}
              <span>{meta.label}</span>
            </div>
          );
        })}
        <span className="text-xs text-white/20 ml-2 shrink-0">Output: ABD-7 · Early Warning · Confidence Score</span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef as any}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-5 text-center px-4">
            <div className="text-5xl">🧠</div>
            <div>
              <div className="font-semibold text-xl mb-1 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Brain Project — Pendamping Proyek Konstruksi
              </div>
              <div className="text-sm text-white/50 max-w-md">
                3 topi bekerja paralel: <span className="text-blue-300">Konsultan</span> (kontrak/FIDIC/VO) · <span className="text-emerald-300">Pengawas/MK</span> (EVM/SPI/CPI/NCR) · <span className="text-amber-300">K3 & Lingkungan</span> (SMK3/JSA/insiden). Output selalu ABD-7 dengan early warning dan confidence score.
              </div>
            </div>

            {/* Early Warning Legend */}
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {[
                { icon: "⚠️", label: "Watch (SPI/CPI < 0,95)" },
                { icon: "🔴", label: "Alert (SPI/CPI < 0,85)" },
                { icon: "🚨", label: "Kritis (LTI/Fatality)" },
              ].map(c => (
                <span key={c.label} className="px-2 py-1 rounded border border-white/10 bg-white/5 text-white/60">
                  {c.icon} {c.label}
                </span>
              ))}
            </div>

            {/* Sample prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
              {SAMPLE_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p.text)}
                  disabled={!ready || streaming}
                  className="text-left text-xs px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-indigo-500/40 hover:bg-indigo-900/20 transition-all disabled:opacity-40 text-white/70"
                  data-testid={`prompt-${i}`}
                >
                  <span className="mr-1">{p.icon}</span>
                  {p.text}
                </button>
              ))}
            </div>

            {!ready && !agentLoading && (
              <div className="text-xs text-red-300/70 bg-red-900/10 border border-red-800/30 rounded-lg px-4 py-2">
                Brain Project agent belum diinisialisasi. Restart server diperlukan.
              </div>
            )}
          </div>
        ) : (
          <div>
            {messages.map((msg, i) => (
              <ChatMessage key={i} msg={msg} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="shrink-0 border-t border-white/10 px-4 py-3 bg-[#0d0e1e]/80">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder={ready ? "Ceritakan kondisi proyek atau tanya tentang kontrak, EVM, K3…" : "Menghubungkan ke Brain Project…"}
            disabled={!ready || streaming}
            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-indigo-500/40 text-sm h-10"
            data-testid="input-message"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!ready || streaming || !input.trim()}
            className="bg-indigo-700 hover:bg-indigo-600 text-white h-10 px-4 shrink-0"
            data-testid="button-send"
          >
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-center mt-2 text-xs text-white/20">
          Brain Project · 3 topi spesialis paralel · ABD-7 · Standar FIDIC · PP 50/2012 SMK3 · Permen PUPR 10/2021
        </div>
      </div>

    </div>
  );
}
