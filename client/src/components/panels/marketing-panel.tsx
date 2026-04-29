import { useState } from "react";
import {
  Megaphone, Download, ClipboardCopy, Check, Target, MessageSquare,
  Sparkles, Globe, Users, ExternalLink, Link, Eye, Zap, Mail,
  Calendar, Instagram, Linkedin, FileText, BarChart3, Mic,
  ChevronDown, ChevronUp, Loader2, Copy, RefreshCw
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
                9 AI tools untuk mempromosikan chatbot <span className="font-medium text-foreground">{agent.name}</span>
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
            <TabsTrigger value="brief" className="text-xs gap-1.5" data-testid="tab-brief">
              <FileText className="w-3.5 h-3.5" /> Brief Marketing
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
