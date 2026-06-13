import { useState, useRef, useCallback, useEffect } from "react";
import { Paperclip, Send, Loader2, X, FileText, Image as ImageIcon, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";

export interface ChatAttachment {
  fileName: string;
  fileUrl: string;
  category: string;
  mimeType?: string;
  fileSize?: number;
  previewUrl?: string;
}

interface ChatInputBarProps {
  onSend: (text: string, files: ChatAttachment[]) => Promise<void> | void;
  disabled?: boolean;
  streaming?: boolean;
  placeholder?: string;
  footerText?: string;
  showClear?: boolean;
  onClear?: () => void;
}

export function ChatInputBar({
  onSend,
  disabled = false,
  streaming = false,
  placeholder = "Ketik pesan…",
  footerText,
  showClear = false,
  onClear,
}: ChatInputBarProps) {
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<ChatAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  useEffect(() => { autoResize(); }, [input, autoResize]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded: ChatAttachment[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/chat/upload", { method: "POST", body: fd });
        if (!r.ok) continue;
        const data = await r.json();
        const att: ChatAttachment = { ...data };
        if (data.category === "image") att.previewUrl = URL.createObjectURL(file);
        uploaded.push(att);
      }
      setPendingFiles(prev => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSend() {
    if ((!input.trim() && pendingFiles.length === 0) || disabled || streaming) return;
    const text = input;
    const files = [...pendingFiles];
    setInput("");
    setPendingFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await onSend(text, files);
    textareaRef.current?.focus();
  }

  const canSend = !disabled && !streaming && (input.trim().length > 0 || pendingFiles.length > 0);

  return (
    <div className="shrink-0 border-t border-white/10 px-4 pt-3 pb-2 bg-black/30">
      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {pendingFiles.map((att, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white/70 max-w-[180px]">
              {att.category === "image" && att.previewUrl
                ? <img src={att.previewUrl} className="h-6 w-6 rounded object-cover shrink-0" alt="" />
                : att.category === "image"
                  ? <ImageIcon className="h-4 w-4 text-blue-400 shrink-0" />
                  : <FileText className="h-4 w-4 text-slate-400 shrink-0" />
              }
              <span className="truncate flex-1">{att.fileName}</span>
              <button onClick={() => setPendingFiles(p => p.filter((_, i) => i !== idx))} className="text-white/30 hover:text-white/80 shrink-0 ml-0.5" data-testid={`button-remove-attachment-${idx}`}>
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/10 transition-all max-w-3xl mx-auto">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="shrink-0 mb-0.5 p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 disabled:opacity-30 transition-all"
          title="Lampirkan file"
          data-testid="button-attach-file"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.csv" className="hidden" onChange={handleFileSelect} />

        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
          }}
          placeholder={placeholder}
          disabled={disabled && !streaming}
          rows={1}
          className="flex-1 bg-transparent border-0 outline-none resize-none text-white placeholder:text-white/30 text-sm leading-relaxed py-0.5 max-h-[160px] overflow-y-auto"
          data-testid="input-message"
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`shrink-0 mb-0.5 p-1.5 rounded-lg transition-all ${canSend ? "bg-white/20 hover:bg-white/30 text-white" : "text-white/20 cursor-not-allowed"}`}
          data-testid="button-send"
        >
          {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-1.5 max-w-3xl mx-auto">
        {footerText && <span className="text-[10px] text-white/20">{footerText}</span>}
        {showClear && onClear && (
          <button onClick={onClear} className="text-[10px] text-white/20 hover:text-white/50 transition-colors" data-testid="button-clear-chat">
            Bersihkan chat
          </button>
        )}
      </div>
    </div>
  );
}

export function MessageActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  function copy() {
    navigator.clipboard.writeText(content).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div className="flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={copy} className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-white/40 hover:text-white/70 hover:bg-white/8 transition-all" title="Salin" data-testid="button-copy-message">
        {copied ? <><Check className="h-3 w-3 text-green-400" /><span className="text-green-400">Disalin!</span></> : <><Copy className="h-3 w-3" /><span>Salin</span></>}
      </button>
      <button onClick={() => setFeedback(f => f === "up" ? null : "up")} className={`p-1.5 rounded transition-all ${feedback === "up" ? "text-blue-400 bg-blue-900/40" : "text-white/30 hover:text-white/60 hover:bg-white/8"}`} title="Respons bagus" data-testid="button-thumbs-up">
        <ThumbsUp className="h-3 w-3" />
      </button>
      <button onClick={() => setFeedback(f => f === "down" ? null : "down")} className={`p-1.5 rounded transition-all ${feedback === "down" ? "text-red-400 bg-red-900/40" : "text-white/30 hover:text-white/60 hover:bg-white/8"}`} title="Perlu perbaikan" data-testid="button-thumbs-down">
        <ThumbsDown className="h-3 w-3" />
      </button>
    </div>
  );
}

export function AttachmentRow({ attachments }: { attachments: ChatAttachment[] }) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mb-1.5">
      {attachments.map((att, i) => (
        <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-xs text-white/70 max-w-[160px]">
          {att.category === "image" && att.previewUrl
            ? <img src={att.previewUrl} className="h-5 w-5 rounded object-cover shrink-0" alt="" />
            : att.category === "image"
              ? <ImageIcon className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              : <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          }
          <span className="truncate">{att.fileName}</span>
        </div>
      ))}
    </div>
  );
}
