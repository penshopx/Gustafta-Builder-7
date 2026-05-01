import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Scale, Send, Loader2, X, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { MessageContent } from "@/lib/format-message";

interface WidgetMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface GuestStatus {
  isGuest: boolean;
  messagesUsed: number;
  limit: number;
  limitReached: boolean;
}

export function ChaesaWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  const { data: guestStatus } = useQuery<GuestStatus>({
    queryKey: ["/api/legal/guest-status"],
  });

  const isGuest = guestStatus?.isGuest ?? true;
  const guestCount = guestStatus?.messagesUsed ?? 0;
  const MAX_GUEST = guestStatus?.limit ?? 5;
  const limitReached = isGuest && (guestStatus?.limitReached ?? false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isStreaming) return;
    if (limitReached) return;

    setInput("");

    const userMsg: WidgetMessage = { id: `u-${Date.now()}`, role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const assistantId = `a-${Date.now()}`;
    let assistantContent = "";
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/legal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentType: "auto", message: msg }),
        signal: abortRef.current.signal,
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const errMsg = data.message || "Batas pesan tamu tercapai. Silakan login untuk akses penuh.";
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: errMsg } : m));
        queryClient.invalidateQueries({ queryKey: ["/api/legal/guest-status"] });
        return;
      }

      if (!res.ok) throw new Error("Server error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No stream");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const raw = decoder.decode(value);
        for (const line of raw.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              assistantContent += data.text;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m));
            }
          } catch {}
        }
      }
      queryClient.invalidateQueries({ queryKey: ["/api/legal/guest-status"] });
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "Maaf, terjadi kesalahan. Coba lagi." } : m));
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, limitReached, queryClient]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const QUICK_PROMPTS = [
    "Apa itu wanprestasi dalam hukum perdata?",
    "Berapa pesangon PHK menurut UU Cipta Kerja?",
    "Apa syarat mendirikan PT di Indonesia?",
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div
            className="w-80 sm:w-96 rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden"
            style={{ background: "#0d1433", height: "520px" }}
          >
            <div
              className="flex items-center justify-between p-4 border-b border-white/10"
              style={{ background: "linear-gradient(135deg, #7c3aed22, #4f46e522)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                  ⚖️
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Chaesa Lexbot</div>
                  <div className="text-purple-300 text-xs">AI Hukum Indonesia</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link href="/legal/chat">
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white h-7 w-7 p-0" title="Buka full chat">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white h-7 w-7 p-0"
                  data-testid="button-chaesa-close"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">⚖️</div>
                  <p className="text-white/60 text-xs mb-4">Tanyakan apa saja tentang hukum Indonesia</p>
                  <div className="space-y-2">
                    {QUICK_PROMPTS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(p)}
                        className="w-full p-2.5 rounded-lg border border-white/10 hover:border-purple-500/40 bg-white/5 hover:bg-white/10 text-left text-xs text-white/60 hover:text-white transition-all"
                        data-testid={`chaesa-starter-${i}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  {isGuest && (
                    <p className="text-white/25 text-xs mt-4">{MAX_GUEST - guestCount} pesan tersisa (mode tamu)</p>
                  )}
                </div>
              )}

              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-xs",
                      msg.role === "user"
                        ? "text-white rounded-tr-sm"
                        : "text-white/80 rounded-tl-sm border border-white/10"
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
                      <MessageContent text={msg.content} className="text-xs" />
                    ) : (
                      <div className="flex items-center gap-1 text-white/40">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Memproses...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {limitReached && (
                <div className="text-center p-3 rounded-xl border border-purple-500/30 bg-purple-500/10">
                  <p className="text-purple-300 text-xs mb-2">Batas pesan tamu tercapai</p>
                  <Link href="/legal/chat">
                    <Button size="sm" className="text-white border-0 text-xs" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                      Buka LexCom Chat Penuh
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya tentang hukum Indonesia..."
                  className="resize-none border-white/20 bg-white/5 text-white placeholder:text-white/40 rounded-lg text-xs focus:border-purple-500/50 min-h-[36px] max-h-24 py-2"
                  rows={1}
                  disabled={isStreaming || limitReached}
                  data-testid="input-chaesa-message"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isStreaming || limitReached}
                  size="sm"
                  className="text-white border-0 h-9 w-9 p-0 rounded-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                  data-testid="button-chaesa-send"
                >
                  {isStreaming ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
              <p className="text-white/20 text-xs text-center mt-1.5">
                ⚠️ Edukatif — bukan pendapat hukum mengikat
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 relative"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          data-testid="button-chaesa-toggle"
          title="Chaesa Lexbot"
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">Tutup</span>
            </>
          ) : (
            <>
              <Scale className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">Chaesa Lexbot</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white text-black text-xs flex items-center justify-center font-bold">✓</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
