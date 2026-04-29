import { useState, useRef } from "react";
import {
  Megaphone, Download, ClipboardCopy, Check, Target, MessageSquare,
  Sparkles, Globe, Users, ExternalLink, Link, Eye, Zap, Mail,
  Calendar, Instagram, Linkedin, FileText, BarChart3, Mic,
  ChevronDown, ChevronUp, Loader2, Copy, RefreshCw,
  Scan, PenLine, Newspaper, Share2, Printer, Bot,
  Phone, Star, ArrowRight, Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const escHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

// ─── AI Tool definitions ───────────────────────────────────────────────
interface AiTool {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  options?: { key: string; label: string; choices: string[] }[];
}

const AI_TOOLS: AiTool[] = [
  {
    id: "ad-copy",
    label: "Ad Copy Generator",
    description: "Headline & deskripsi iklan siap pakai untuk Meta, Google, LinkedIn, TikTok",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    options: [{ key: "platform", label: "Platform", choices: ["Meta Ads", "Google Ads", "LinkedIn Ads", "TikTok Ads"] }],
  },
  {
    id: "wa-broadcast",
    label: "WA Broadcast Script",
    description: "3 versi script WhatsApp (singkat/medium/panjang) siap kirim ke calon klien",
    icon: MessageSquare,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    options: [{ key: "tone", label: "Tone", choices: ["Profesional", "Kasual", "Formal & Resmi", "Antusias"] }],
  },
  {
    id: "elevator-pitch",
    label: "Elevator Pitch",
    description: "Script presentasi singkat verbal untuk meeting, pameran, atau demo",
    icon: Mic,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    options: [{ key: "duration", label: "Durasi", choices: ["30 detik", "60 detik", "2 menit"] }],
  },
  {
    id: "linkedin-post",
    label: "LinkedIn Post",
    description: "Postingan thought leadership untuk menarik perhatian profesional konstruksi",
    icon: Linkedin,
    color: "text-sky-600",
    bgColor: "bg-sky-50 dark:bg-sky-950/30",
  },
  {
    id: "email-sequence",
    label: "Email Sequence (3 Email)",
    description: "Drip campaign 3 email: perkenalan → value → closing untuk leads B2B",
    icon: Mail,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    id: "content-calendar",
    label: "Content Calendar 7 Hari",
    description: "Jadwal posting media sosial lengkap dengan topik & format selama seminggu",
    icon: Calendar,
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
  },
  {
    id: "instagram-caption",
    label: "Caption Instagram",
    description: "3 variasi caption + hashtag Indonesia untuk feed, Reels, atau Story",
    icon: Instagram,
    color: "text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    id: "proposal-exec",
    label: "Executive Summary Proposal",
    description: "Ringkasan 1 halaman untuk proposal klien konstruksi: BUJK, kontraktor, konsultan",
    icon: FileText,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    id: "value-proposition",
    label: "Value Proposition Canvas",
    description: "Customer profile, pain relievers, gain creators, dan fit statement lengkap",
    icon: BarChart3,
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
  },
];

// ─── AI Tool Card ─────────────────────────────────────────────────────
function AiToolCard({ tool, agent }: { tool: AiTool; agent: any }) {
  const { toast } = useToast();
  const [result, setResult] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [optValues, setOptValues] = useState<Record<string, string>>({});

  const generateMutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", `/api/agents/${agent.id}/marketing/generate`, {
        tool: tool.id,
        ...optValues,
      }).then((r) => r.json()),
    onSuccess: (data: any) => {
      setResult(data.content || "");
      setExpanded(true);
    },
    onError: () => {
      toast({ title: "Gagal", description: "Tidak bisa generate konten saat ini", variant: "destructive" });
    },
  });

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Disalin!", description: "Konten berhasil disalin ke clipboard" });
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = (agent.name || "chatbot").replace(/\s+/g, "-").toLowerCase();
    a.download = `${tool.id}-${slug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const Icon = tool.icon;

  return (
    <Card className={`border transition-all duration-200 ${expanded ? "ring-2 ring-primary/20" : ""}`}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${tool.bgColor}`}>
            <Icon className={`w-5 h-5 ${tool.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm">{tool.label}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tool.description}</p>
          </div>
        </div>

        {tool.options && (
          <div className="flex gap-2 flex-wrap">
            {tool.options.map((opt) => (
              <div key={opt.key} className="flex-1 min-w-[140px]">
                <Select
                  value={optValues[opt.key] || opt.choices[0]}
                  onValueChange={(v) => setOptValues((prev) => ({ ...prev, [opt.key]: v }))}
                >
                  <SelectTrigger className="h-8 text-xs" data-testid={`select-${tool.id}-${opt.key}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {opt.choices.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="w-full h-8 text-xs"
          data-testid={`button-generate-${tool.id}`}
        >
          {generateMutation.isPending ? (
            <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Generating…</>
          ) : result ? (
            <><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Buat Ulang</>
          ) : (
            <><Sparkles className="w-3.5 h-3.5 mr-1.5" />Generate AI</>
          )}
        </Button>

        {result && (
          <div className="space-y-2">
            <button
              onClick={() => setExpanded((p) => !p)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
              data-testid={`button-toggle-${tool.id}`}
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? "Sembunyikan" : "Tampilkan"} hasil
            </button>
            {expanded && (
              <div className="space-y-2">
                <div className="bg-muted/60 rounded-md p-3 max-h-[280px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs text-foreground leading-relaxed font-mono" data-testid={`text-result-${tool.id}`}>
                    {result}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={copyResult}
                    data-testid={`button-copy-${tool.id}`}
                  >
                    {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? "Tersalin" : "Salin"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={downloadResult}
                    data-testid={`button-download-${tool.id}`}
                  >
                    <Download className="w-3 h-3 mr-1" /> Unduh .txt
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── QR Code Tool ─────────────────────────────────────────────────────
function QrCodeTool({ agent }: { agent: any }) {
  const { toast } = useToast();
  const [selectedUrl, setSelectedUrl] = useState("chatbot");
  const urls: Record<string, { label: string; url: string }> = {
    chatbot: { label: "Chatbot", url: `${window.location.origin}/bot/${agent.id}` },
    ecourse: { label: "Landing eCourse", url: `${window.location.origin}/product/${agent.id}/ecourse` },
    ebook: { label: "Landing eBook", url: `${window.location.origin}/product/${agent.id}/ebook` },
    docgen: { label: "Landing Generator Dokumen", url: `${window.location.origin}/product/${agent.id}/docgen` },
    miniapps: { label: "Landing Mini Apps", url: `${window.location.origin}/product/${agent.id}/mini-apps` },
    product: { label: "Landing Chatbot", url: `${window.location.origin}/product/${agent.id}` },
  };
  const current = urls[selectedUrl];
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(current.url)}&bgcolor=ffffff&color=1a1a2e&margin=12`;

  const downloadQr = async () => {
    try {
      const resp = await fetch(qrSrc);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${agent.name?.replace(/\s+/g, "-").toLowerCase() || "chatbot"}-${selectedUrl}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "QR Code diunduh!" });
    } catch {
      toast({ title: "Gagal mengunduh", description: "Klik kanan gambar → Simpan gambar", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">QR Code Generator</span>
          <Badge variant="secondary" className="text-xs ml-auto">Instan</Badge>
        </div>
        <p className="text-xs text-muted-foreground">QR code untuk banner, kartu nama, presentasi, dan materi cetak event konstruksi.</p>
        <Select value={selectedUrl} onValueChange={setSelectedUrl}>
          <SelectTrigger className="h-8 text-xs" data-testid="select-qr-url">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(urls).map(([key, val]) => (
              <SelectItem key={key} value={key} className="text-xs">{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="border border-border rounded-xl overflow-hidden shadow-sm">
            <img src={qrSrc} alt="QR Code" className="w-40 h-40 block" data-testid="img-qr-code" />
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-[200px] break-all">{current.url}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 h-8 text-xs" onClick={downloadQr} data-testid="button-download-qr">
            <Download className="w-3 h-3 mr-1.5" /> Unduh PNG
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => { navigator.clipboard.writeText(current.url); toast({ title: "Link disalin!" }); }} data-testid="button-copy-qr-url">
            <Copy className="w-3 h-3 mr-1.5" /> Salin Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Email Signature Tool ─────────────────────────────────────────────
function EmailSignatureTool({ agent }: { agent: any }) {
  const { toast } = useToast();
  const [name, setName] = useState(agent.name || "");
  const [title, setTitle] = useState((agent as any).tagline || "Asisten AI Konstruksi");
  const [wa, setWa] = useState((agent as any).whatsappCta || "");
  const [copied, setCopied] = useState(false);

  const chatUrl = `${window.location.origin}/bot/${agent.id}`;
  const productUrl = `${window.location.origin}/product/${agent.id}`;
  const initials = (name || "AI").substring(0, 2).toUpperCase();

  const sigHtml = `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333;border-left:4px solid #4361ee;padding-left:16px;margin-top:8px">
  <tr><td><strong style="font-size:15px;color:#1a1a2e">${name}</strong></td></tr>
  <tr><td style="color:#4361ee;font-size:12px">${title}</td></tr>
  <tr><td style="padding-top:6px;font-size:12px">
    💬 <a href="${chatUrl}" style="color:#4361ee;text-decoration:none">Chat dengan AI</a>
    ${wa ? `&nbsp;·&nbsp; 📱 <a href="https://wa.me/${wa.replace(/\D/g, '')}" style="color:#25D366;text-decoration:none">WhatsApp</a>` : ""}
    &nbsp;·&nbsp; 🌐 <a href="${productUrl}" style="color:#4361ee;text-decoration:none">Landing Page</a>
  </td></tr>
  <tr><td style="padding-top:4px;font-size:11px;color:#888">Powered by Gustafta AI · Platform Chatbot Konstruksi Indonesia</td></tr>
</table>`;

  const copy = () => {
    navigator.clipboard.writeText(sigHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "HTML tanda tangan disalin!", description: "Paste di pengaturan tanda tangan email Anda" });
  };

  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Email Signature</span>
          <Badge variant="secondary" className="text-xs ml-auto">Instan</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Tanda tangan email HTML profesional dengan link chatbot dan WhatsApp.</p>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <Label className="text-xs mb-1 block">Nama Pengirim</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="h-8 text-xs" placeholder="Nama Anda / Chatbot" data-testid="input-sig-name" />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Jabatan / Tagline</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="h-8 text-xs" placeholder="Asisten AI Konstruksi" data-testid="input-sig-title" />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Nomor WhatsApp (opsional)</Label>
            <Input value={wa} onChange={e => setWa(e.target.value)} className="h-8 text-xs" placeholder="6281234567890" data-testid="input-sig-wa" />
          </div>
        </div>
        {/* Preview */}
        <div className="bg-muted/40 rounded-lg p-3 border text-xs" style={{ borderLeft: "4px solid #4361ee", paddingLeft: "12px" }}>
          <div className="font-bold text-sm" style={{ color: "#1a1a2e" }}>{name || "Nama Anda"}</div>
          <div style={{ color: "#4361ee", fontSize: "11px" }}>{title || "Jabatan"}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            💬 <span className="text-blue-600 underline">Chat dengan AI</span>
            {wa && <> · 📱 <span className="text-green-600 underline">WhatsApp</span></>}
            {" "}· 🌐 <span className="text-blue-600 underline">Landing Page</span>
          </div>
          <div className="mt-0.5 text-muted-foreground" style={{ fontSize: "10px" }}>Powered by Gustafta AI</div>
        </div>
        <Button size="sm" className="w-full h-8 text-xs" onClick={copy} data-testid="button-copy-sig">
          {copied ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
          {copied ? "Tersalin!" : "Salin HTML Tanda Tangan"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">Paste di: Gmail → Pengaturan → Tanda Tangan</p>
      </CardContent>
    </Card>
  );
}

// ─── Digital Flyer Tool ───────────────────────────────────────────────
function FlyerTool({ agent }: { agent: any }) {
  const { toast } = useToast();
  const chatUrl = `${window.location.origin}/bot/${agent.id}`;
  const productUrl = `${window.location.origin}/product/${agent.id}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(chatUrl)}&bgcolor=ffffff&color=1a1a2e&margin=8`;
  const expertise: string[] = agent.expertise || [];
  const features: string[] = agent.productFeatures || agent.landingBenefits || [];
  const points = [...expertise.slice(0, 3), ...features.slice(0, 3)].slice(0, 5);
  const wa = (agent as any).whatsappCta || "";

  const flyerHtml = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>Flyer — ${agent.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:#f0f4ff; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; }
  .flyer { width:420px; background:linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%); border-radius:20px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.4); }
  .top-bar { background:linear-gradient(90deg,#4361ee,#7209b7); padding:10px 24px; font-size:11px; color:white; letter-spacing:2px; font-weight:700; text-transform:uppercase; }
  .hero { padding:32px 28px 24px; text-align:center; }
  .badge { display:inline-block; background:rgba(255,255,255,0.1); color:#a0b4ff; border:1px solid rgba(255,255,255,0.15); border-radius:20px; font-size:11px; padding:4px 14px; letter-spacing:1px; margin-bottom:14px; }
  .title { font-size:26px; font-weight:900; color:white; line-height:1.2; margin-bottom:10px; }
  .subtitle { font-size:13px; color:#a0b4ff; line-height:1.5; max-width:340px; margin:0 auto; }
  .divider { height:1px; background:rgba(255,255,255,0.1); margin:0 28px; }
  .features { padding:20px 28px; }
  .features-title { font-size:11px; color:#4361ee; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:12px; }
  .feature { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; }
  .dot { width:8px; height:8px; background:#4361ee; border-radius:50%; flex-shrink:0; margin-top:4px; }
  .feature-text { font-size:12.5px; color:#c8d6f0; line-height:1.4; }
  .cta-section { background:rgba(255,255,255,0.05); margin:0 20px 20px; border-radius:12px; padding:20px; display:flex; gap:16px; align-items:center; }
  .qr-wrap { flex-shrink:0; background:white; border-radius:10px; padding:6px; }
  .qr-wrap img { width:90px; height:90px; display:block; }
  .cta-text h3 { font-size:14px; font-weight:700; color:white; margin-bottom:4px; }
  .cta-text p { font-size:11px; color:#a0b4ff; line-height:1.4; word-break:break-all; }
  ${wa ? `.wa { background:#25D366; color:white; border-radius:8px; padding:6px 12px; font-size:11px; font-weight:700; display:inline-block; margin-top:8px; text-decoration:none; }` : ""}
  .footer { text-align:center; padding:12px; font-size:10px; color:rgba(255,255,255,0.3); letter-spacing:1px; }
  @media print { body { background:white; padding:0; } .flyer { box-shadow:none; width:100%; border-radius:0; } }
</style>
</head>
<body>
<div class="flyer">
  <div class="top-bar">Powered by Gustafta AI · Platform Chatbot Konstruksi Indonesia</div>
  <div class="hero">
    <div class="badge">✦ Asisten AI Konstruksi</div>
    <div class="title">${agent.name || "AI Chatbot"}</div>
    <div class="subtitle">${(agent.description || agent.tagline || "Asisten AI cerdas untuk industri konstruksi Indonesia.").substring(0, 120)}</div>
  </div>
  <div class="divider"></div>
  ${points.length > 0 ? `<div class="features">
    <div class="features-title">Keunggulan Utama</div>
    ${points.map(p => `<div class="feature"><div class="dot"></div><div class="feature-text">${p}</div></div>`).join("")}
  </div>
  <div class="divider"></div>` : ""}
  <div class="cta-section">
    <div class="qr-wrap"><img src="${qrSrc}" alt="QR Code" /></div>
    <div class="cta-text">
      <h3>Scan untuk Mulai Chat</h3>
      <p>${chatUrl}</p>
      ${wa ? `<a href="https://wa.me/${wa.replace(/\D/g, '')}" class="wa">📱 WhatsApp</a>` : ""}
    </div>
  </div>
  <div class="footer">GUSTAFTA.AI · CHATBOT AI KONSTRUKSI INDONESIA</div>
</div>
<script>window.onload = function() { document.title = "Flyer — ${agent.name}"; }</script>
</body>
</html>`;

  const openFlyer = () => {
    const blob = new Blob([flyerHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    toast({ title: "Flyer terbuka!", description: "Gunakan Ctrl+P / Cmd+P untuk cetak atau simpan PDF" });
  };

  const downloadFlyer = () => {
    const blob = new Blob([flyerHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flyer-${(agent.name || "chatbot").replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Flyer diunduh!" });
  };

  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Digital Flyer / Poster</span>
          <Badge variant="secondary" className="text-xs ml-auto">Instan</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Poster promosi digital berisi nama, keunggulan, dan QR code chatbot — siap cetak / bagikan.</p>

        {/* Mini preview */}
        <div className="rounded-lg overflow-hidden border" style={{ background: "linear-gradient(135deg,#1a1a2e,#0f3460)", padding: "12px" }}>
          <div className="text-center space-y-1.5">
            <div className="text-xs font-bold text-blue-400 tracking-widest uppercase">✦ Asisten AI Konstruksi</div>
            <div className="text-white font-black text-sm leading-tight">{agent.name || "AI Chatbot"}</div>
            <div className="text-blue-200 text-xs leading-relaxed line-clamp-2">{(agent.description || agent.tagline || "").substring(0, 80)}</div>
          </div>
          {points.slice(0, 2).length > 0 && (
            <div className="mt-3 space-y-1">
              {points.slice(0, 2).map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-blue-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span className="line-clamp-1">{p}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center gap-2">
            <div className="bg-white rounded p-1 flex-shrink-0">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(chatUrl)}&margin=2`} className="w-10 h-10 block" alt="QR" />
            </div>
            <div className="text-xs text-blue-200 break-all line-clamp-2">{chatUrl}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 h-8 text-xs" onClick={openFlyer} data-testid="button-open-flyer">
            <Printer className="w-3 h-3 mr-1.5" /> Buka & Cetak
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={downloadFlyer} data-testid="button-download-flyer">
            <Download className="w-3 h-3 mr-1.5" /> Unduh .html
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">Tekan Ctrl+P / Cmd+P di tab baru untuk cetak atau simpan sebagai PDF</p>
      </CardContent>
    </Card>
  );
}

// ─── Social Preview Card Tool ─────────────────────────────────────────
function SocialPreviewTool({ agent }: { agent: any }) {
  const { toast } = useToast();
  const [platform, setPlatform] = useState<"whatsapp" | "linkedin">("whatsapp");
  const chatUrl = `${window.location.origin}/bot/${agent.id}`;
  const productUrl = `${window.location.origin}/product/${agent.id}`;
  const [selectedLink, setSelectedLink] = useState("chatbot");
  const linkMap: Record<string, string> = {
    chatbot: chatUrl,
    product: productUrl,
    ecourse: `${window.location.origin}/product/${agent.id}/ecourse`,
    ebook: `${window.location.origin}/product/${agent.id}/ebook`,
  };
  const activeLink = linkMap[selectedLink];
  const domain = window.location.hostname;
  const initials = (agent.name || "AI").substring(0, 2).toUpperCase();

  const copyLink = () => {
    navigator.clipboard.writeText(activeLink);
    toast({ title: "Link disalin!", description: activeLink });
  };

  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Social Share Preview</span>
          <Badge variant="secondary" className="text-xs ml-auto">Preview</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Preview tampilan link saat dibagikan di WhatsApp atau LinkedIn.</p>

        <div className="flex gap-2">
          <Button
            size="sm" variant={platform === "whatsapp" ? "default" : "outline"}
            className="flex-1 h-8 text-xs gap-1" onClick={() => setPlatform("whatsapp")}
            data-testid="button-preview-wa"
          >
            <MessageSquare className="w-3 h-3" /> WhatsApp
          </Button>
          <Button
            size="sm" variant={platform === "linkedin" ? "default" : "outline"}
            className="flex-1 h-8 text-xs gap-1" onClick={() => setPlatform("linkedin")}
            data-testid="button-preview-linkedin"
          >
            <Linkedin className="w-3 h-3" /> LinkedIn
          </Button>
        </div>

        <Select value={selectedLink} onValueChange={setSelectedLink}>
          <SelectTrigger className="h-8 text-xs" data-testid="select-preview-link">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chatbot" className="text-xs">Link Chatbot</SelectItem>
            <SelectItem value="product" className="text-xs">Landing Chatbot</SelectItem>
            <SelectItem value="ecourse" className="text-xs">Landing eCourse</SelectItem>
            <SelectItem value="ebook" className="text-xs">Landing eBook</SelectItem>
          </SelectContent>
        </Select>

        {/* WhatsApp Preview */}
        {platform === "whatsapp" && (
          <div className="rounded-xl overflow-hidden border" style={{ background: "#111b21" }}>
            <div className="px-3 py-2" style={{ background: "#202c33" }}>
              <div className="text-xs text-green-400 font-semibold mb-0.5">WhatsApp</div>
            </div>
            <div className="p-3">
              <div className="rounded-lg overflow-hidden border border-white/10 max-w-xs" style={{ background: "#1f2c34" }}>
                <div className="h-24 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1a1a2e,#4361ee)" }}>
                  <div className="text-white font-black text-2xl opacity-80">{initials}</div>
                </div>
                <div className="p-3 border-l-4 border-green-500">
                  <div className="text-white font-semibold text-sm leading-tight">{agent.name}</div>
                  <div className="text-gray-400 text-xs mt-1 line-clamp-2">{agent.description?.substring(0, 80) || agent.tagline || "Asisten AI Konstruksi Indonesia"}</div>
                  <div className="text-gray-500 text-xs mt-1.5">{domain}</div>
                </div>
              </div>
              <div className="text-gray-500 text-xs mt-1.5 pl-1">{activeLink.substring(0, 45)}…</div>
            </div>
          </div>
        )}

        {/* LinkedIn Preview */}
        {platform === "linkedin" && (
          <div className="rounded-xl overflow-hidden border bg-white dark:bg-gray-900 shadow-sm">
            <div className="h-20 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1a1a2e,#4361ee)" }}>
              <div className="text-white font-black text-3xl opacity-80">{initials}</div>
            </div>
            <div className="p-3 border border-t-0 rounded-b-xl border-border">
              <div className="font-semibold text-sm text-foreground leading-tight">{agent.name}</div>
              <div className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{agent.description?.substring(0, 100) || "Asisten AI Konstruksi Indonesia"}</div>
              <div className="text-muted-foreground text-xs mt-1.5 uppercase tracking-wide">{domain}</div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 h-8 text-xs" onClick={copyLink} data-testid="button-copy-share-link">
            <Copy className="w-3 h-3 mr-1.5" /> Salin Link
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs px-3" asChild>
            <a href={activeLink} target="_blank" rel="noopener noreferrer" data-testid="button-open-share-link">
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">Preview ini menunjukkan bagaimana link akan tampil saat dibagikan</p>
      </CardContent>
    </Card>
  );
}

// ─── ROI Calculator ───────────────────────────────────────────────────
function RoiCalculatorTool({ agent }: { agent: any }) {
  const { toast } = useToast();
  const [staff, setStaff] = useState(3);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [ratePerHour, setRatePerHour] = useState(50000);
  const [copied, setCopied] = useState(false);

  const monthlyCostManual = staff * hoursPerDay * 22 * ratePerHour;
  const chatbotCost = (agent.monthlyPrice || 299000);
  const moneySaved = monthlyCostManual - chatbotCost;
  const roiPercent = chatbotCost > 0 ? Math.round((moneySaved / chatbotCost) * 100) : 0;
  const paybackDays = moneySaved > 0 ? Math.round(chatbotCost / (moneySaved / 30)) : 0;

  const resultText = `ROI Kalkulator — ${agent.name}
==============================
Asumsi Input:
- Staf yang ditangani chatbot: ${staff} orang
- Waktu per hari: ${hoursPerDay} jam
- Rate per jam: Rp ${ratePerHour.toLocaleString("id-ID")}
- Hari kerja per bulan: 22 hari

Hasil Kalkulasi:
- Biaya manual/bulan: Rp ${monthlyCostManual.toLocaleString("id-ID")}
- Biaya chatbot/bulan: Rp ${chatbotCost.toLocaleString("id-ID")}
- Penghematan/bulan: Rp ${moneySaved.toLocaleString("id-ID")}
- ROI: ${roiPercent}%
- Payback period: ${paybackDays} hari

Gunakan kalkulator ini sebagai bahan presentasi ke klien/manajemen.
Generated by Gustafta AI`;

  const copy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Hasil disalin!", description: "Gunakan sebagai bahan proposal ke klien" });
  };

  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">ROI Calculator</span>
          <Badge variant="secondary" className="text-xs ml-auto">Sales Tool</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Hitung penghematan biaya vs proses manual — untuk presentasi ke klien & manajemen.</p>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label className="text-xs mb-1 block">Staf yang ditangani chatbot</Label>
            <div className="flex items-center gap-2">
              <input type="range" min={1} max={20} value={staff} onChange={e => setStaff(Number(e.target.value))} className="flex-1 h-1.5 accent-primary" />
              <span className="text-xs font-bold w-8 text-right">{staff}</span>
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1 block">Jam layanan per hari</Label>
            <div className="flex items-center gap-2">
              <input type="range" min={0.5} max={8} step={0.5} value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))} className="flex-1 h-1.5 accent-primary" />
              <span className="text-xs font-bold w-10 text-right">{hoursPerDay}j</span>
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1 block">Rate tenaga per jam</Label>
            <div className="flex items-center gap-2">
              <input type="range" min={25000} max={200000} step={5000} value={ratePerHour} onChange={e => setRatePerHour(Number(e.target.value))} className="flex-1 h-1.5 accent-primary" />
              <span className="text-xs font-bold w-24 text-right">Rp {(ratePerHour/1000).toFixed(0)}rb/j</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Biaya Manual/Bln</div>
            <div className="font-bold text-sm text-red-600">Rp {monthlyCostManual.toLocaleString("id-ID")}</div>
          </div>
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Biaya Chatbot/Bln</div>
            <div className="font-bold text-sm text-green-600">Rp {chatbotCost.toLocaleString("id-ID")}</div>
          </div>
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-center col-span-2">
            <div className="text-xs text-muted-foreground mb-1">Penghematan per Bulan</div>
            <div className="font-black text-lg text-primary">Rp {Math.max(moneySaved, 0).toLocaleString("id-ID")}</div>
            <div className="text-xs text-muted-foreground">ROI {roiPercent}% · Balik modal dalam {paybackDays} hari</div>
          </div>
        </div>

        <Button size="sm" className="w-full h-8 text-xs" onClick={copy} data-testid="button-copy-roi">
          {copied ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
          {copied ? "Tersalin!" : "Salin Hasil untuk Proposal"}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Marketing Brief helpers (unchanged) ──────────────────────────────
function buildMarketingBrief(agent: any): string {
  const lines: string[] = [];
  lines.push(`# Marketing Brief: ${agent.name || "(Tanpa Nama)"}`);
  lines.push(""); lines.push("---"); lines.push("");
  lines.push("## 1. PROFIL PRODUK"); lines.push("");
  if (agent.name) lines.push(`- **Nama Produk:** ${agent.name}`);
  if (agent.tagline) lines.push(`- **Tagline:** ${agent.tagline}`);
  if (agent.description) lines.push(`- **Deskripsi:** ${agent.description}`);
  if (agent.productSummary) lines.push(`- **Ringkasan Produk:** ${agent.productSummary}`);
  if (agent.category) lines.push(`- **Kategori:** ${agent.category}`);
  lines.push(`- **Link Chat:** ${window.location.origin}/bot/${agent.id}`);
  lines.push("");
  lines.push("## 2. USP (Unique Selling Proposition)"); lines.push("");
  if (agent.philosophy) lines.push(`**Filosofi:** ${agent.philosophy}`);
  lines.push("");
  const expertise = agent.expertise || [];
  if (expertise.length > 0) {
    lines.push("**Keunggulan/Keahlian:**");
    expertise.forEach((e: string) => lines.push(`- ${e}`));
    lines.push("");
  }
  const features = agent.productFeatures || [];
  if (features.length > 0) {
    lines.push("**Fitur Utama:**");
    features.forEach((f: string) => lines.push(`- ${f}`));
    lines.push("");
  }
  const keyPhrases = agent.keyPhrases || [];
  if (keyPhrases.length > 0) {
    lines.push("## 3. KEY MESSAGES / KATA KUNCI"); lines.push("");
    keyPhrases.forEach((p: string) => lines.push(`- ${p}`));
    lines.push("");
  }
  lines.push("## 4. BRAND VOICE"); lines.push("");
  if (agent.personality) lines.push(`- **Personality:** ${agent.personality}`);
  if (agent.communicationStyle) lines.push(`- **Gaya Komunikasi:** ${agent.communicationStyle}`);
  if (agent.toneOfVoice) lines.push(`- **Tone of Voice:** ${agent.toneOfVoice}`);
  if (agent.language) lines.push(`- **Bahasa:** ${agent.language === "id" ? "Indonesia" : agent.language === "en" ? "English" : agent.language}`);
  lines.push("");
  const starters = agent.conversationStarters || [];
  if (starters.length > 0 || agent.greetingMessage) {
    lines.push("## 5. CONTOH INTERAKSI"); lines.push("");
    if (agent.greetingMessage) {
      lines.push("**Sapaan Pembuka:**");
      lines.push(`> ${agent.greetingMessage}`);
      lines.push("");
    }
    if (starters.length > 0) {
      lines.push("**Topik Percakapan yang Bisa Dimulai:**");
      starters.forEach((s: string) => lines.push(`- "${s}"`));
      lines.push("");
    }
  }
  if (agent.monthlyPrice || agent.trialEnabled) {
    lines.push("## 6. PRICING & PENAWARAN"); lines.push("");
    if (agent.monthlyPrice) lines.push(`- **Harga Bulanan:** Rp ${agent.monthlyPrice.toLocaleString("id-ID")}`);
    if (agent.trialEnabled) lines.push(`- **Masa Trial:** ${agent.trialDays || 7} hari gratis`);
    if (agent.guestMessageLimit) lines.push(`- **Akses Tamu:** ${agent.guestMessageLimit} pesan gratis`);
    lines.push("");
  }
  const conversionOffers = agent.conversionOffers || [];
  if (conversionOffers.length > 0) {
    lines.push("## 7. PAKET PENAWARAN"); lines.push("");
    conversionOffers.forEach((offer: any, i: number) => {
      lines.push(`### Paket ${i + 1}: ${offer.title || "(Tanpa Judul)"}`);
      if (offer.description) lines.push(offer.description);
      if (offer.price) lines.push(`**Harga:** ${offer.price}`);
      if (offer.features && offer.features.length > 0) offer.features.forEach((f: string) => lines.push(`- ${f}`));
      lines.push("");
    });
  }
  if (agent.whatsappCta || agent.calendlyUrl) {
    lines.push("## 8. CHANNEL KONTAK"); lines.push("");
    if (agent.whatsappCta) lines.push(`- **WhatsApp:** ${agent.whatsappCta}`);
    if (agent.calendlyUrl) lines.push(`- **Calendly:** ${agent.calendlyUrl}`);
    lines.push("");
  }
  const landingPainPoints = agent.landingPainPoints || [];
  const landingBenefits = agent.landingBenefits || [];
  const landingTestimonials = agent.landingTestimonials || [];
  const landingFaq = agent.landingFaq || [];
  if (landingPainPoints.length > 0) {
    lines.push("## 9. PAIN POINTS TARGET MARKET"); lines.push("");
    landingPainPoints.forEach((p: string) => lines.push(`- ${p}`));
    lines.push("");
  }
  if (landingBenefits.length > 0) {
    lines.push("## 10. MANFAAT / BENEFITS"); lines.push("");
    landingBenefits.forEach((b: string) => lines.push(`- ${b}`));
    lines.push("");
  }
  if (landingTestimonials.length > 0) {
    lines.push("## 11. TESTIMONI"); lines.push("");
    landingTestimonials.forEach((t: any) => {
      lines.push(`> "${t.quote}"`);
      lines.push(`> — **${t.name}**${t.role ? `, ${t.role}` : ""}${t.company ? `, ${t.company}` : ""}`);
      lines.push("");
    });
  }
  if (landingFaq.length > 0) {
    lines.push("## 12. FAQ"); lines.push("");
    landingFaq.forEach((f: any) => {
      lines.push(`**Q: ${f.question}**`);
      lines.push(`A: ${f.answer}`);
      lines.push("");
    });
  }
  lines.push("---");
  lines.push(`*Brief ini di-generate otomatis oleh Gustafta AI dari data chatbot "${agent.name || ""}"*`);
  lines.push(`*Gunakan sebagai panduan untuk membuat ad copy, konten sosial media, dan materi promosi di platform lain.*`);
  return lines.join("\n");
}

function mdToHtml(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let inList = false;
  const closePendingList = () => { if (inList) { result.push("</ul>"); inList = false; } };
  const fmt = (t: string) => escHtml(t).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
  for (const line of lines) {
    if (line.startsWith("- ")) {
      if (!inList) { result.push("<ul>"); inList = true; }
      result.push(`<li>${fmt(line.slice(2))}</li>`);
      continue;
    }
    closePendingList();
    if (line.startsWith("# ")) { result.push(`<h1>${fmt(line.slice(2))}</h1>`); continue; }
    if (line.startsWith("## ")) { result.push(`<h2>${fmt(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("### ")) { result.push(`<h3>${fmt(line.slice(4))}</h3>`); continue; }
    if (line.startsWith("> ")) { result.push(`<blockquote>${fmt(line.slice(2))}</blockquote>`); continue; }
    if (line === "---") { result.push("<hr>"); continue; }
    if (line === "") continue;
    result.push(`<p>${fmt(line)}</p>`);
  }
  closePendingList();
  return result.join("\n");
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Panel ───────────────────────────────────────────────────────
export function MarketingPanel({ agent }: { agent: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [marketingKitUrl, setMarketingKitUrl] = useState(agent.marketingKitUrl || "");
  const [metaPixelId, setMetaPixelId] = useState(agent.metaPixelId || "");

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", `/api/agents/${agent.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({ title: "Tersimpan", description: "Pengaturan berhasil disimpan" });
    },
  });

  const brief = buildMarketingBrief(agent);
  const sectionCount = (brief.match(/^## /gm) || []).length;
  const slug = (agent.name || "chatbot").replace(/\s+/g, "-").toLowerCase();

  const copyAll = () => {
    navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Disalin!", description: "Brief marketing berhasil disalin ke clipboard" });
  };
  const downloadMarkdown = () => {
    downloadFile(brief, `brief-marketing-${slug}.md`, "text/markdown");
    toast({ title: "Berhasil", description: "File Markdown berhasil diunduh" });
  };
  const downloadHtml = () => {
    const body = mdToHtml(brief);
    const html = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Marketing Brief - ${agent.name || "Chatbot"}</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.7;color:#333}h1{color:#1a1a2e;border-bottom:3px solid #4361ee;padding-bottom:.5rem}h2{color:#3a0ca3;margin-top:2rem}h3{color:#4361ee}blockquote{border-left:4px solid #4361ee;margin:1rem 0;padding:.5rem 1rem;background:#f8f9fa;font-style:italic}ul{margin:.5rem 0;padding-left:1.5rem}li{margin:.3rem 0}hr{border:none;border-top:2px solid #eee;margin:2rem 0}strong{color:#1a1a2e}</style></head><body>${body}</body></html>`;
    downloadFile(html, `brief-marketing-${slug}.html`, "text/html");
    toast({ title: "Berhasil", description: "File HTML berhasil diunduh" });
  };

  return (
    <div className="space-y-0 max-h-[calc(100vh-80px)] overflow-y-auto">
      {/* Hero */}
      <div className="px-4 md:px-6 pt-5 pb-4 border-b bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground" data-testid="text-marketing-title">
                Marketing Suite
              </h2>
              <p className="text-sm text-muted-foreground">
                9 AI tools + 5 alat instan untuk mempromosikan chatbot <span className="font-medium text-foreground">{agent.name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" /> Powered by GPT-4o
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="ai-tools" className="w-full">
        <div className="px-4 md:px-6 pt-3 border-b sticky top-0 bg-background z-10">
          <TabsList className="h-9">
            <TabsTrigger value="ai-tools" className="text-xs gap-1.5" data-testid="tab-ai-tools">
              <Sparkles className="w-3.5 h-3.5" /> AI Tools
            </TabsTrigger>
            <TabsTrigger value="instant" className="text-xs gap-1.5" data-testid="tab-instant">
              <Zap className="w-3.5 h-3.5" /> Alat Instan
            </TabsTrigger>
            <TabsTrigger value="brief" className="text-xs gap-1.5" data-testid="tab-brief">
              <FileText className="w-3.5 h-3.5" /> Brief
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs gap-1.5" data-testid="tab-settings">
              <Eye className="w-3.5 h-3.5" /> Pengaturan
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── AI TOOLS TAB ── */}
        <TabsContent value="ai-tools" className="m-0 px-4 md:px-6 py-5 space-y-5">
          <p className="text-sm text-muted-foreground">
            Klik <strong>Generate AI</strong> pada tools yang Anda butuhkan. Konten dibuat khusus berdasarkan data chatbot <strong>{agent.name}</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {AI_TOOLS.map((tool) => (
              <AiToolCard key={tool.id} tool={tool} agent={agent} />
            ))}
          </div>
        </TabsContent>

        {/* ── ALAT INSTAN TAB ── */}
        <TabsContent value="instant" className="m-0 px-4 md:px-6 py-5 space-y-5">
          <p className="text-sm text-muted-foreground">
            5 alat marketing yang bekerja <strong>instan tanpa AI</strong> — QR code, tanda tangan email, flyer, social preview, dan kalkulator ROI untuk presentasi ke klien.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QrCodeTool agent={agent} />
            <EmailSignatureTool agent={agent} />
            <FlyerTool agent={agent} />
            <SocialPreviewTool agent={agent} />
            <div className="md:col-span-2">
              <RoiCalculatorTool agent={agent} />
            </div>
          </div>
        </TabsContent>

        {/* ── BRIEF TAB ── */}
        <TabsContent value="brief" className="m-0 px-4 md:px-6 py-5 space-y-5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="text-sm text-muted-foreground">
                Ringkasan lengkap data chatbot untuk panduan copywriting & promosi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyAll} data-testid="button-copy-all-marketing">
                {copied ? <Check className="w-4 h-4 mr-1.5" /> : <ClipboardCopy className="w-4 h-4 mr-1.5" />}
                {copied ? "Tersalin" : "Salin"}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadMarkdown} data-testid="button-download-md-marketing">
                <Download className="w-4 h-4 mr-1.5" /> .md
              </Button>
              <Button variant="outline" size="sm" onClick={downloadHtml} data-testid="button-download-html-marketing">
                <Download className="w-4 h-4 mr-1.5" /> .html
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Preview Brief</span>
                </div>
                <Badge variant="secondary">{sectionCount} bagian</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Brief ini otomatis diambil dari konfigurasi chatbot. Edit data di panel lain untuk memperbarui.
              </p>
              <div className="bg-muted/50 rounded-md p-4 max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono text-foreground leading-relaxed" data-testid="text-brief-preview">
                  {brief}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Cara Pakai</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>1. Download brief (.md / .html) atau gunakan AI Tools di tab pertama</p>
                <p>2. Gunakan untuk: Meta Ads, Google Ads, email marketing, proposal klien</p>
                <p>3. Simpan URL materi marketing di tab Pengaturan</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── SETTINGS TAB ── */}
        <TabsContent value="settings" className="m-0 px-4 md:px-6 py-5 space-y-5">
          <Card>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-primary" />
                <Label className="text-base font-semibold">Link Marketing Kit Eksternal</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Jika Anda sudah membuat materi marketing di platform lain (Google Drive, Canva, Notion, dll), masukkan URL-nya di sini
              </p>
              <div className="flex gap-2">
                <Input
                  value={marketingKitUrl}
                  onChange={(e) => setMarketingKitUrl(e.target.value)}
                  placeholder="https://drive.google.com/... atau https://canva.com/..."
                  data-testid="input-marketing-kit-url"
                />
                {marketingKitUrl && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={marketingKitUrl} target="_blank" rel="noopener noreferrer" data-testid="button-open-marketing-url">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <Label className="text-base font-semibold">Meta Pixel ID</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Masukkan Meta Pixel ID untuk tracking konversi di halaman chat publik
              </p>
              <div className="flex gap-2">
                <Input
                  value={metaPixelId}
                  onChange={(e) => setMetaPixelId(e.target.value)}
                  placeholder="Contoh: 123456789012345"
                  data-testid="input-meta-pixel-id"
                />
                <Button
                  onClick={() => updateMutation.mutate({ marketingKitUrl: marketingKitUrl.trim(), metaPixelId: metaPixelId.trim() })}
                  disabled={updateMutation.isPending}
                  data-testid="button-save-marketing-settings"
                >
                  {updateMutation.isPending ? "..." : "Simpan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
