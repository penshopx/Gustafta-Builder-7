import { useState, useRef, useEffect } from "react";
import { Send, X, RefreshCw, Share2, ShoppingBag, ChevronRight, Sparkles, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ProfilAwal {
  bidang: string;
  tantangan: string;
  potensi: string;
  rekomendasiChatbot: string;
}

interface Blueprint {
  judul: string;
  ringkasan: string;
  langkahAwal: string[];
  namaChatbot: string;
  persona: string;
  targetPengguna: string;
}

type Stage = "chat" | "gate1-loading" | "gate1" | "chat2" | "gate2-loading" | "gate2";

const GREETING = `Halo! Saya Dialog Gustafta — Teman Berpikir kamu. 🌟

Saya hadir bukan untuk menjawab, tapi untuk *menggali* — karena saya yakin kamu punya potensi dan pengalaman yang luar biasa yang belum sempat diartikulasikan.

Ceritakan padaku — kamu bekerja di bidang apa, atau ada tantangan apa yang ingin kamu selesaikan?`;

const GATE1_THRESHOLD = 4;
const GATE2_THRESHOLD = 4;

const waUrl = "https://wa.me/6282299417818?text=Halo%2C%20saya%20sudah%20coba%20Dialog%20Gustafta%20dan%20ingin%20beli%20Starter%20Kit";

export default function DialogGustaftaPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<Stage>("chat");
  const [profil, setProfil] = useState<ProfilAwal | null>(null);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [userCount1, setUserCount1] = useState(0);
  const [userCount2, setUserCount2] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isGate1Passed = stage === "chat2" || stage === "gate2-loading" || stage === "gate2";
  const isGate2Reached = stage === "gate2-loading" || stage === "gate2";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, stage]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    const newCount1 = isGate1Passed ? userCount1 : userCount1 + 1;
    const newCount2 = isGate1Passed ? userCount2 + 1 : 0;
    if (!isGate1Passed) setUserCount1(newCount1);
    if (isGate1Passed) setUserCount2(newCount2);

    try {
      const res = await fetch("/api/dialog-gustafta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, userMessageCount: newMessages.filter(m => m.role === "user").length }),
      });
      const data = await res.json();
      const replyMsg: ChatMessage = { role: "assistant", content: data.reply || "Maaf, ada gangguan." };
      setMessages([...newMessages, replyMsg]);

      if (!isGate1Passed && newCount1 >= GATE1_THRESHOLD) {
        setTimeout(() => triggerGate1([...newMessages, replyMsg]), 600);
      } else if (isGate1Passed && newCount2 >= GATE2_THRESHOLD) {
        setTimeout(() => triggerGate2([...newMessages, replyMsg]), 600);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Koneksi terganggu, coba lagi ya!" }]);
    } finally {
      setLoading(false);
    }
  };

  const triggerGate1 = async (msgs: ChatMessage[]) => {
    setStage("gate1-loading");
    try {
      const res = await fetch("/api/dialog-gustafta/profil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      });
      const data = await res.json();
      setProfil(data.profil);
      setStage("gate1");
    } catch {
      setStage("gate1");
      setProfil({ bidang: "Bidang yang sedang Anda tekuni", tantangan: "Tantangan yang dihadapi", potensi: "Potensi besar yang belum diartikulasikan", rekomendasiChatbot: "Chatbot spesialis di bidang Anda" });
    }
  };

  const triggerGate2 = async (msgs: ChatMessage[]) => {
    setStage("gate2-loading");
    try {
      const res = await fetch("/api/dialog-gustafta/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      });
      const data = await res.json();
      setBlueprint(data.blueprint);
      setStage("gate2");
    } catch {
      setStage("gate2");
      setBlueprint({ judul: "Blueprint Ekosistem AI Anda", ringkasan: "Berdasarkan dialog kita, Anda memiliki fondasi yang kuat untuk membangun ekosistem AI yang relevan.", langkahAwal: ["Daftarkan akun di Gustafta", "Konfigurasi chatbot pertama Anda", "Upload knowledge base dari pengalaman Anda"], namaChatbot: "Chatbot Spesialis", persona: "Konsultan yang hangat dan informatif", targetPengguna: "Profesional di bidang Anda" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Dialog Gustafta", text: "Gali potensimu bersama Dialog Gustafta — Teman Berpikir AI", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleReset = () => {
    setMessages([{ role: "assistant", content: GREETING }]);
    setStage("chat");
    setProfil(null);
    setBlueprint(null);
    setUserCount1(0);
    setUserCount2(0);
    setInput("");
  };

  const isInputDisabled = loading || stage === "gate1-loading" || stage === "gate1" || stage === "gate2-loading" || stage === "gate2";

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-b from-[#0a1628] to-[#0d1f3c] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a1628]/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center">
            <img src="/logo-gustafta.png" alt="Gustafta" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">DIALOG GUSTAFTA</h1>
            <p className="text-[10px] text-cyan-300/70">Teman Berpikir · Gali Potensimu</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={handleReset} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/">
            <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex-shrink-0 px-4 py-2 flex items-center gap-2">
        <div className={cn("h-1 flex-1 rounded-full transition-all", isGate1Passed ? "bg-cyan-400" : "bg-white/10")}>
          <div className={cn("h-full rounded-full bg-cyan-400 transition-all", { "w-full": isGate1Passed, [`w-[${Math.min(100, (userCount1 / GATE1_THRESHOLD) * 100)}%]`]: !isGate1Passed })}
            style={{ width: isGate1Passed ? "100%" : `${Math.min(100, (userCount1 / GATE1_THRESHOLD) * 100)}%` }} />
        </div>
        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all", isGate1Passed ? "bg-cyan-400 border-cyan-400 text-[#0a1628]" : "border-white/20 text-white/40")}>1</div>
        <div className={cn("h-1 flex-1 rounded-full transition-all", isGate2Reached ? "bg-emerald-400" : "bg-white/10")}>
          <div className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: isGate2Reached ? "100%" : isGate1Passed ? `${Math.min(100, (userCount2 / GATE2_THRESHOLD) * 100)}%` : "0%" }} />
        </div>
        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all", isGate2Reached ? "bg-emerald-400 border-emerald-400 text-[#0a1628]" : "border-white/20 text-white/40")}>2</div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === "user" && "flex-row-reverse")}>
            <div className={cn("w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold", msg.role === "assistant" ? "bg-gradient-to-br from-cyan-500 to-blue-700" : "bg-white/20 text-white")}>
              {msg.role === "assistant" ? <img src="/logo-gustafta.png" alt="" className="w-5 h-5 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : "U"}
            </div>
            <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words", msg.role === "assistant" ? "bg-white/10 text-white rounded-tl-sm" : "bg-gradient-to-br from-cyan-500 to-blue-700 text-white rounded-tr-sm")}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shrink-0">
              <img src="/logo-gustafta.png" alt="" className="w-5 h-5 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.12s" }} />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.24s" }} />
              </div>
            </div>
          </div>
        )}

        {/* Gate 1 Loading */}
        {stage === "gate1-loading" && (
          <div className="flex flex-col items-center gap-3 py-6 animate-in fade-in duration-500">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <p className="text-sm text-cyan-300 text-center">Menyusun Profil Awal Anda...</p>
          </div>
        )}

        {/* Gate 1 Card */}
        {stage === "gate1" && profil && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Checkpoint 1</div>
                  <div className="text-sm font-bold text-white">Profil Awal Anda</div>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex gap-2">
                  <span className="text-cyan-400 shrink-0">🎯</span>
                  <div><span className="text-white/50 text-xs">Bidang:</span><br /><span className="text-white">{profil.bidang}</span></div>
                </div>
                <div className="flex gap-2">
                  <span className="text-orange-400 shrink-0">⚡</span>
                  <div><span className="text-white/50 text-xs">Tantangan:</span><br /><span className="text-white">{profil.tantangan}</span></div>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400 shrink-0">💡</span>
                  <div><span className="text-white/50 text-xs">Potensi teridentifikasi:</span><br /><span className="text-white">{profil.potensi}</span></div>
                </div>
                <div className="flex gap-2">
                  <span className="text-violet-400 shrink-0">🤖</span>
                  <div><span className="text-white/50 text-xs">Rekomendasi chatbot:</span><br /><span className="text-white">{profil.rekomendasiChatbot}</span></div>
                </div>
              </div>

              <p className="text-xs text-white/60 border-t border-white/10 pt-3">Mau saya bantu rumuskan blueprint lengkap ekosistem AI Anda?</p>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm gap-2"
                  onClick={() => { setStage("chat2"); setMessages(prev => [...prev, { role: "assistant", content: "Bagus! Mari kita lanjutkan dan rumuskan blueprint ekosistem AI Anda yang lebih konkret. Ceritakan — dari semua yang sudah kita diskusikan, mana yang paling ingin Anda wujudkan pertama?" }]); }}
                  data-testid="button-gate1-lanjut"
                >
                  <ArrowRight className="w-4 h-4" /> Lanjut ke Blueprint
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/20 text-white/70 hover:bg-white/10 text-sm"
                  onClick={() => { setStage("chat2"); setMessages(prev => [...prev, { role: "assistant", content: "Tidak masalah! Sesi ini tetap berguna. Kalau kapan-kapan mau melanjutkan, dialog kita bisa dimulai lagi dari sini. Sampai jumpa! 🙏" }]); }}
                  data-testid="button-gate1-selesai"
                >
                  Cukup di sini
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Gate 2 Loading */}
        {stage === "gate2-loading" && (
          <div className="flex flex-col items-center gap-3 py-6 animate-in fade-in duration-500">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <p className="text-sm text-emerald-300 text-center">Menyusun Blueprint Ekosistem AI Anda...</p>
          </div>
        )}

        {/* Gate 2 — Blueprint + CTA */}
        {stage === "gate2" && blueprint && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Blueprint Siap</div>
                  <div className="text-sm font-bold text-white">{blueprint.judul}</div>
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed">{blueprint.ringkasan}</p>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">Chatbot yang direkomendasikan</div>
                <div className="bg-white/5 rounded-xl p-3 space-y-1.5 text-xs">
                  <div><span className="text-white/50">Nama:</span> <span className="text-white font-medium">{blueprint.namaChatbot}</span></div>
                  <div><span className="text-white/50">Persona:</span> <span className="text-white">{blueprint.persona}</span></div>
                  <div><span className="text-white/50">Target:</span> <span className="text-white">{blueprint.targetPengguna}</span></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">Langkah pertama</div>
                <ul className="space-y-1.5">
                  {blueprint.langkahAwal.map((l, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="rounded-xl bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-500/30 p-3 text-center">
                  <div className="text-xs text-amber-300 font-semibold mb-1">🎁 Blueprint ini jadi milik Anda saat beli</div>
                  <div className="text-base font-bold text-white">Starter Kit Gustafta — Rp 245.000</div>
                  <div className="text-[10px] text-white/50 mt-0.5">Lisensi platform + 3 Panduan Digital + 7 hari trial</div>
                </div>
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold gap-2 h-11" data-testid="button-gate2-beli">
                    <ShoppingBag className="w-4 h-4" /> Beli Starter Kit — Rp 245.000
                  </Button>
                </a>
                <Button variant="ghost" className="w-full text-white/50 hover:text-white text-xs" onClick={handleReset}>
                  Mulai dialog baru
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 pb-6 pt-3 border-t border-white/10 bg-[#0a1628]/80 backdrop-blur">
        {isInputDisabled && stage !== "gate1-loading" && stage !== "gate2-loading" ? null : (
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={isGate1Passed ? "Ceritakan lebih dalam..." : "Ceritakan sesuatu tentang dirimu..."}
              className="min-h-[48px] max-h-[120px] resize-none text-sm rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-cyan-500"
              rows={1}
              disabled={isInputDisabled}
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={!input.trim() || isInputDisabled}
              className="shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 hover:from-cyan-600 hover:to-blue-800 border-0 disabled:opacity-40"
              data-testid="button-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
        <p className="text-[10px] text-white/30 text-center mt-2">
          Dialog Gustafta · Teman Berpikir AI · <Link href="/" className="hover:text-white/60">gustafta.my.id</Link>
        </p>
      </div>
    </div>
  );
}
