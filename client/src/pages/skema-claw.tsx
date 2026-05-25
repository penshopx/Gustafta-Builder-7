import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageContent } from "@/lib/format-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft, Send, Loader2, Zap, CheckCircle2, Clock, AlertCircle,
  ChevronDown, ChevronUp, Scale, FileText, Users, ShieldCheck,
  Wrench, ClipboardList, RefreshCw, Database, AlertTriangle, BookOpen,
} from "lucide-react";
import { Link } from "wouter";

interface SubAgentStatus {
  agentId: number; role: string;
  status: "waiting" | "running" | "done" | "error";
  elapsed?: number; preview?: string;
}
interface Message {
  role: "user" | "assistant"; content: string;
  isStreaming?: boolean; subAgents?: SubAgentStatus[]; orchestrationMs?: number;
}

const ROLE_META: Record<string, { icon: React.ReactNode; label: string; color: string; code: string }> = {
  "REG":      { icon: <Scale className="h-3 w-3" />,         label: "Regulasi & Kerangka Hukum",     color: "bg-blue-500/20 text-blue-300 border-blue-500/30",      code: "REG" },
  "KUAL":     { icon: <ClipboardList className="h-3 w-3" />, label: "Kualifikasi & 4 Kriteria",      color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30", code: "KUAL" },
  "KEU":      { icon: <FileText className="h-3 w-3" />,      label: "Kemampuan Keuangan",            color: "bg-violet-500/20 text-violet-300 border-violet-500/30", code: "KEU" },
  "TKK":      { icon: <Users className="h-3 w-3" />,         label: "Tenaga Kerja Konstruksi",       color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",       code: "TKK" },
  "ALAT":     { icon: <Wrench className="h-3 w-3" />,        label: "Peralatan Konstruksi",          color: "bg-sky-500/20 text-sky-300 border-sky-500/30",          code: "ALAT" },
  "PROSES":   { icon: <ClipboardList className="h-3 w-3" />, label: "Alur Sertifikasi 10 Tahap",    color: "bg-blue-400/20 text-blue-200 border-blue-400/30",       code: "PROSES" },
  "KONVERSI": { icon: <RefreshCw className="h-3 w-3" />,     label: "Konversi SBU & KBLI 2025",     color: "bg-teal-500/20 text-teal-300 border-teal-500/30",       code: "KONVERSI" },
  "SIJKT":    { icon: <Database className="h-3 w-3" />,      label: "Sistem Informasi SIJKT/OSS",   color: "bg-slate-400/20 text-slate-300 border-slate-400/30",    code: "SIJKT" },
  "SANKSI":   { icon: <AlertTriangle className="h-3 w-3" />, label: "Kewajiban & Sanksi",           color: "bg-rose-500/20 text-rose-300 border-rose-500/30",       code: "SANKSI" },
};

const AGENT_LEGEND = ["REG","KUAL","KEU","TKK","ALAT","PROSES","KONVERSI","SIJKT","SANKSI"];

function getRoleMeta(role: string) {
  for (const key of Object.keys(ROLE_META)) {
    if (role === key || role.toUpperCase().includes(key)) return ROLE_META[key];
  }
  return { icon: <BookOpen className="h-3 w-3" />, label: role, color: "bg-white/10 text-white/60 border-white/20", code: "AGT" };
}
function statusIcon(s: SubAgentStatus["status"]) {
  if (s === "running") return <Loader2 className="h-3 w-3 animate-spin text-yellow-400" />;
  if (s === "done")    return <CheckCircle2 className="h-3 w-3 text-green-400" />;
  if (s === "error")   return <AlertCircle className="h-3 w-3 text-red-400" />;
  return <Clock className="h-3 w-3 text-white/30" />;
}

function SubAgentPanel({ agents }: { agents: SubAgentStatus[] }) {
  const [expanded, setExpanded] = useState(false);
  const running = agents.filter(a => a.status === "running").length;
  const done = agents.filter(a => a.status === "done").length;
  return (
    <div className="mt-2 rounded-lg border border-blue-800/40 bg-blue-950/20 text-xs overflow-hidden">
      <button className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5 transition-colors" onClick={() => setExpanded(!expanded)} data-testid="button-expand-subagents">
        <Scale className="h-3 w-3 text-blue-400 shrink-0" />
        <span className="text-blue-300 font-medium">{running > 0 ? `${running} spesialis menganalisis…` : `${done}/${agents.length} spesialis selesai`}</span>
        <div className="flex gap-1 ml-auto flex-wrap">
          {agents.map((a, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${a.status==="done"?"bg-green-400":a.status==="running"?"bg-yellow-400 animate-pulse":a.status==="error"?"bg-red-400":"bg-white/20"}`} />)}
        </div>
        {expanded ? <ChevronUp className="h-3 w-3 text-white/30 shrink-0" /> : <ChevronDown className="h-3 w-3 text-white/30 shrink-0" />}
      </button>
      {expanded && (
        <div className="border-t border-blue-800/30 px-3 py-2 grid grid-cols-2 gap-1.5">
          {agents.map((a, i) => {
            const meta = getRoleMeta(a.role);
            return (
              <div key={i} className="flex items-center gap-1.5">
                {statusIcon(a.status)}
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-xs ${meta.color}`}>{meta.icon}<span className="font-mono text-[10px]">{meta.code}</span></div>
                <span className="text-white/40 text-[10px] truncate">{meta.label}</span>
                {a.elapsed && <span className="text-white/25 ml-auto text-[10px]">{(a.elapsed/1000).toFixed(1)}s</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChatMessage({ msg }: { msg: Message }) {
  if (msg.role === "user") return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 bg-blue-950/60 text-white text-sm">{msg.content}</div>
    </div>
  );
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-blue-900/60 border border-blue-700/40 flex items-center justify-center text-base shrink-0 mt-0.5">⚖️</div>
      <div className="flex-1 min-w-0">
        {msg.subAgents && msg.subAgents.length > 0 && <SubAgentPanel agents={msg.subAgents} />}
        <div className="mt-2" style={{ wordBreak: "break-word" }}>
          {msg.isStreaming && !msg.content ? <span className="animate-pulse text-white/60">▋</span> : <MessageContent text={msg.content} className="text-sm text-white/90 leading-relaxed" />}
        </div>
        {msg.orchestrationMs && msg.subAgents && msg.subAgents.length > 0 && !msg.isStreaming && (
          <div className="flex items-center gap-1 text-xs text-white/30 px-1 mt-1"><Zap className="h-2.5 w-2.5" /><span>{msg.subAgents.length} spesialis paralel · {(msg.orchestrationMs/1000).toFixed(1)}s</span></div>
        )}
      </div>
    </div>
  );
}

const SAMPLE_PROMPTS = [
  { icon: "📋", text: "Perusahaan kami saat ini masih memiliki SBU lama (Grade 5 Bangunan Gedung). Apa yang harus kami lakukan untuk konversi ke kualifikasi baru Permen PU 6/2025? Apa risikonya jika kami terlambat?" },
  { icon: "💰", text: "BUJK K2 kami memiliki ekuitas Rp 2,5 miliar dan penjualan tahunan Rp 4 miliar. Apakah sudah memenuhi syarat naik ke K3? Dokumen keuangan apa yang harus disiapkan untuk LSBU?" },
  { icon: "👥", text: "Direktur teknik kami saat ini juga menjabat sebagai PJTBU di BUJK lain. Apakah ini melanggar Permen PU 6/2025? Apa sanksinya dan bagaimana solusinya?" },
  { icon: "🔄", text: "Jelaskan perbedaan mendasar antara status SBU di PP 5/2021 (sebagai PB-UMKU) dengan status SBU di PP 28/2025. Apa implikasi hukumnya bagi BUJK kami?" },
  { icon: "⚠️", text: "LSBU kami belum terakreditasi KAN. Apakah SBU yang diterbitkan sebelum akreditasi selesai tetap valid? Apa posisi hukum LSBU yang belum terakreditasi menurut Permen PU 6/2025?" },
  { icon: "🏗️", text: "Kami BUJK Menengah ingin mengerjakan proyek senilai Rp 150 miliar. Apakah segmentasi pasar berdasarkan Permen PU 6/2025 mengizinkan ini? Subklasifikasi apa yang relevan?" },
];

const SKEMA_TAGS = [
  { label: "Kualifikasi K1/K2/K3/M/B" },
  { label: "Konversi SBU & KBLI 2025" },
  { label: "Proses Sertifikasi 10 Tahap" },
  { label: "PJBU/PJTBU/PJKBU & SKK" },
  { label: "Sanksi & Kewajiban BUJK" },
  { label: "SIJKT/SIMPAN/SIMPK/OSS" },
  { label: "Akreditasi KAN ISO 17065" },
];

export default function SkemaClawChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [agentId, setAgentId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: agentData, isLoading: agentLoading } = useQuery<{ id: number; name: string }>({
    queryKey: ["/api/skema-claw/orchestrator"],
    queryFn: async () => {
      const res = await fetch("/api/skema-claw/orchestrator");
      if (!res.ok) throw new Error("SkemaClaw not found");
      return res.json();
    },
    retry: 3, retryDelay: 2000,
  });

  useEffect(() => { if (agentData?.id) setAgentId(agentData.id); }, [agentData]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || streaming || !agentId) return;
    setInput(""); setStreaming(true);
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setMessages(prev => [...prev, { role: "assistant", content: "", isStreaming: true, subAgents: [] }]);
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const orchStart = Date.now();
    try {
      const res = await fetch("/api/messages/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: String(agentId), role: "user", content: text, conversationHistory: history }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader(); const decoder = new TextDecoder();
      let buffer = "", fullContent = "";
      const subAgentMap = new Map<number, SubAgentStatus>();
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n"); buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6); if (raw === "[DONE]") break;
          try {
            const evt = JSON.parse(raw);
            if (evt.type === "orchestrating_start") {
              const subs: SubAgentStatus[] = (evt.subAgents ?? []).map((sa: any) => ({ agentId: sa.agentId, role: sa.role, status: "waiting" as const }));
              subs.forEach(s => subAgentMap.set(s.agentId, s));
              setMessages(prev => { const u=[...prev]; const l=u[u.length-1]; if(l.role==="assistant") u[u.length-1]={...l,subAgents:Array.from(subAgentMap.values())}; return u; });
            } else if (evt.type === "sub_agent_start") {
              const s=subAgentMap.get(evt.agentId); if(s){s.status="running";subAgentMap.set(evt.agentId,{...s});}
              setMessages(prev => { const u=[...prev]; const l=u[u.length-1]; if(l.role==="assistant") u[u.length-1]={...l,subAgents:Array.from(subAgentMap.values())}; return u; });
            } else if (evt.type === "sub_agent_done") {
              const s=subAgentMap.get(evt.agentId); if(s){s.status="done";s.elapsed=evt.elapsed;s.preview=evt.preview;subAgentMap.set(evt.agentId,{...s});}
              setMessages(prev => { const u=[...prev]; const l=u[u.length-1]; if(l.role==="assistant") u[u.length-1]={...l,subAgents:Array.from(subAgentMap.values())}; return u; });
            } else if (evt.type === "chunk") {
              fullContent+=evt.content??"";
              setMessages(prev => { const u=[...prev]; const l=u[u.length-1]; if(l.role==="assistant") u[u.length-1]={...l,content:fullContent,subAgents:Array.from(subAgentMap.values())}; return u; });
            } else if (evt.type === "complete") {
              if(evt.message?.content) fullContent=evt.message.content;
            }
          } catch {}
        }
      }
      const orchMs = Date.now()-orchStart;
      setMessages(prev => { const u=[...prev]; const l=u[u.length-1]; if(l.role==="assistant") u[u.length-1]={...l,isStreaming:false,subAgents:Array.from(subAgentMap.values()),orchestrationMs:orchMs}; return u; });
    } catch {
      setMessages(prev => { const u=[...prev]; const l=u[u.length-1]; if(l.role==="assistant") u[u.length-1]={...l,content:"Maaf, terjadi kesalahan. Silakan coba lagi.",isStreaming:false}; return u; });
    } finally { setStreaming(false); inputRef.current?.focus(); }
  }

  const ready = !agentLoading && agentId !== null;

  return (
    <div className="flex flex-col h-screen bg-[#060a14] text-white">
      {/* Header */}
      <div className="shrink-0 border-b border-white/10 px-4 py-3 flex items-center gap-3 bg-[#070c1a]/80 backdrop-blur">
        <Link href="/dashboard"><Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white" data-testid="button-back"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="w-9 h-9 rounded-full bg-blue-900/60 border border-blue-700/40 flex items-center justify-center text-lg">⚖️</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">SkemaClaw — Konsultan Cerdas Sertifikasi BUJK</div>
          <div className="text-xs text-white/40 flex items-center gap-1"><Scale className="h-2.5 w-2.5 text-blue-400" /><span>9 Spesialis Paralel · Permen PU 6/2025 · Kualifikasi · Konversi · SIJKT · Sanksi</span></div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-blue-500/40 text-blue-300 hidden sm:flex">SkemaClaw · 9 Agen</Badge>
          {agentLoading && <Loader2 className="h-4 w-4 animate-spin text-white/40" />}
          {ready && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
        </div>
      </div>

      {/* Legend strip */}
      <div className="shrink-0 border-b border-white/5 px-3 py-2 flex items-center gap-1 overflow-x-auto bg-[#070c1a]/60">
        <span className="text-xs text-white/30 shrink-0 mr-1">9 Spesialis:</span>
        {AGENT_LEGEND.map(role => { const meta = getRoleMeta(role); return (
          <div key={role} className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded border shrink-0 ${meta.color}`}>
            {meta.icon}<span className="font-mono text-[10px] ml-0.5">{meta.code}</span>
          </div>
        ); })}
        <span className="text-xs text-white/20 ml-2 shrink-0 hidden lg:inline">REG · KUAL · KEU · TKK · ALAT · PROSES · KONVERSI · SIJKT · SANKSI</span>
      </div>

      {/* Chat area */}
      <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef as any}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-5 text-center px-4">
            <div className="text-5xl">⚖️</div>
            <div>
              <div className="font-semibold text-xl mb-1 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                SkemaClaw — Konsultan Cerdas Permen PU No. 6 Tahun 2025
              </div>
              <div className="text-sm text-white/50 max-w-2xl leading-relaxed">
                <span className="text-blue-300">REG</span> (regulasi & hierarki hukum) ·{" "}
                <span className="text-indigo-300">KUAL</span> (kualifikasi K1/K2/K3/M/B & 4 kriteria) ·{" "}
                <span className="text-violet-300">KEU</span> (kemampuan keuangan & audit KAP) ·{" "}
                <span className="text-cyan-300">TKK</span> (PJBU/PJTBU/PJKBU & SKK) ·{" "}
                <span className="text-sky-300">ALAT</span> (peralatan & SIMPK) ·{" "}
                <span className="text-blue-200">PROSES</span> (10 tahap sertifikasi LSBU) ·{" "}
                <span className="text-teal-300">KONVERSI</span> (konversi 349K SBU & KBLI 2025) ·{" "}
                <span className="text-slate-300">SIJKT</span> (sistem informasi terintegrasi) ·{" "}
                <span className="text-rose-300">SANKSI</span> (kewajiban BUJK & sanksi administratif)
              </div>
              <div className="text-xs text-white/25 mt-3 space-y-0.5">
                <div>Mode: Konsultasi · Audit · Simulasi · Ujian · Debat Regulasi · Strategis</div>
                <div>Adaptif untuk: Pemula · BUJK · LSBU · Asosiasi · Auditor · Pemerintah · Akademisi</div>
                <div>Regulasi: PP 28/2025 · Permen PU 6/2025 · SNI ISO/IEC 17065 · SNI ISO 37001</div>
              </div>
            </div>

            {/* Mode selector badges */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {[
                { label: "📚 Konsultasi Regulasi", mode: "Saya ingin memulai sesi KONSULTASI tentang Permen PU 6/2025. Bantu saya memahami perubahan utama dari regulasi sebelumnya." },
                { label: "🔍 Audit Kepatuhan", mode: "Masuk MODE AUDIT. Saya ingin mengecek apakah kondisi BUJK saya sudah memenuhi persyaratan Permen PU 6/2025." },
                { label: "🎯 Simulasi Sertifikasi", mode: "Masuk MODE SIMULASI. Berikan saya studi kasus BUJK yang harus naik kualifikasi dari K2 ke K3." },
                { label: "📝 Uji Pemahaman", mode: "Masuk MODE UJIAN. Uji pemahaman saya tentang 4 kriteria penilaian SBU dalam Permen PU 6/2025." },
                { label: "⚡ Debat Regulasi", mode: "Masuk MODE DEBAT. Saya ingin mendiskusikan secara kritis: apakah penerapan audit KAP untuk semua BUJK kecil sudah tepat?" },
                { label: "🌐 Analisis Strategis", mode: "Masuk MODE STRATEGIS. Analisis dampak kebijakan Permen PU 6/2025 terhadap daya saing BUJK kecil di Indonesia." },
              ].map((m, i) => (
                <button key={i} onClick={() => sendMessage(m.mode)} disabled={!ready || streaming}
                  className="text-xs px-3 py-1.5 rounded-full border border-blue-800/50 bg-blue-950/30 hover:border-blue-500/60 hover:bg-blue-900/30 transition-all disabled:opacity-40 text-blue-300/80"
                  data-testid={`mode-${i}`}>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Tag pills */}
            <div className="flex flex-wrap justify-center gap-1.5 text-xs">
              {SKEMA_TAGS.map(c => <span key={c.label} className="px-2 py-0.5 rounded border border-blue-800/40 bg-blue-950/20 text-blue-300/70">{c.label}</span>)}
            </div>

            {/* Sample prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
              {SAMPLE_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => sendMessage(p.text)} disabled={!ready || streaming}
                  className="text-left text-xs px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-950/20 transition-all disabled:opacity-40 text-white/70"
                  data-testid={`prompt-${i}`}>
                  <span className="mr-1">{p.icon}</span>{p.text}
                </button>
              ))}
            </div>
          </div>
        ) : <div>{messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}</div>}
      </ScrollArea>

      {/* Input */}
      <div className="shrink-0 border-t border-white/10 px-4 py-3 bg-[#070c1a]/80">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input);} }}
            placeholder={ready ? "Tanya tentang sertifikasi BUJK, konversi SBU, kualifikasi K1-K3, PJBU/TKK, sanksi, SIJKT…" : "Menghubungkan ke SkemaClaw…"}
            disabled={!ready || streaming}
            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-blue-500/40 text-sm h-10"
            data-testid="input-message" />
          <Button onClick={() => sendMessage(input)} disabled={!ready || streaming || !input.trim()}
            className="bg-blue-900 hover:bg-blue-800 text-white h-10 px-4 shrink-0" data-testid="button-send">
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-center mt-2 text-xs text-white/20">
          SkemaClaw v1 · 9 Spesialis · REG·KUAL·KEU·TKK·ALAT·PROSES·KONVERSI·SIJKT·SANKSI · Permen PU 6/2025
        </div>
      </div>
    </div>
  );
}
