import { useState } from "react";
import { 
  Megaphone, Download, ClipboardCopy, Check, Target, MessageSquare, 
  Sparkles, Globe, Users, ExternalLink, Link, Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

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

  const handleSave = () => {
    updateMutation.mutate({
      marketingKitUrl: marketingKitUrl.trim(),
      metaPixelId: metaPixelId.trim(),
    });
  };

  const buildMarketingBrief = () => {
    const lines: string[] = [];
    lines.push(`# Marketing Brief: ${agent.name || "(Tanpa Nama)"}`);
    lines.push("");
    lines.push("---");
    lines.push("");

    lines.push("## 1. PROFIL PRODUK");
    lines.push("");
    if (agent.name) lines.push(`- **Nama Produk:** ${agent.name}`);
    if (agent.tagline) lines.push(`- **Tagline:** ${agent.tagline}`);
    if (agent.description) lines.push(`- **Deskripsi:** ${agent.description}`);
    if (agent.productSummary) lines.push(`- **Ringkasan Produk:** ${agent.productSummary}`);
    if (agent.category) lines.push(`- **Kategori:** ${agent.category}`);
    lines.push(`- **Link Chat:** ${window.location.origin}/bot/${agent.id}`);
    lines.push("");

    lines.push("## 2. USP (Unique Selling Proposition)");
    lines.push("");
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
      lines.push("## 3. KEY MESSAGES / KATA KUNCI");
      lines.push("");
      keyPhrases.forEach((p: string) => lines.push(`- ${p}`));
      lines.push("");
    }

    lines.push("## 4. BRAND VOICE");
    lines.push("");
    if (agent.personality) lines.push(`- **Personality:** ${agent.personality}`);
    if (agent.communicationStyle) lines.push(`- **Gaya Komunikasi:** ${agent.communicationStyle}`);
    if (agent.toneOfVoice) lines.push(`- **Tone of Voice:** ${agent.toneOfVoice}`);
    if (agent.language) lines.push(`- **Bahasa:** ${agent.language === "id" ? "Indonesia" : agent.language === "en" ? "English" : agent.language}`);
    lines.push("");

    const starters = agent.conversationStarters || [];
    if (starters.length > 0 || agent.greetingMessage) {
      lines.push("## 5. CONTOH INTERAKSI");
      lines.push("");
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
      lines.push("## 6. PRICING & PENAWARAN");
      lines.push("");
      if (agent.monthlyPrice) lines.push(`- **Harga Bulanan:** Rp ${agent.monthlyPrice.toLocaleString("id-ID")}`);
      if (agent.trialEnabled) lines.push(`- **Masa Trial:** ${agent.trialDays || 7} hari gratis`);
      if (agent.guestMessageLimit) lines.push(`- **Akses Tamu:** ${agent.guestMessageLimit} pesan gratis`);
      lines.push("");
    }

    const conversionOffers = agent.conversionOffers || [];
    if (conversionOffers.length > 0) {
      lines.push("## 7. PAKET PENAWARAN");
      lines.push("");
      conversionOffers.forEach((offer: any, i: number) => {
        lines.push(`### Paket ${i + 1}: ${offer.title || "(Tanpa Judul)"}`);
        if (offer.description) lines.push(offer.description);
        if (offer.price) lines.push(`**Harga:** ${offer.price}`);
        if (offer.features && offer.features.length > 0) {
          offer.features.forEach((f: string) => lines.push(`- ${f}`));
        }
        lines.push("");
      });
    }

    if (agent.whatsappCta || agent.calendlyUrl) {
      lines.push("## 8. CHANNEL KONTAK");
      lines.push("");
      if (agent.whatsappCta) lines.push(`- **WhatsApp:** ${agent.whatsappCta}`);
      if (agent.calendlyUrl) lines.push(`- **Calendly:** ${agent.calendlyUrl}`);
      lines.push("");
    }

    const landingPainPoints = agent.landingPainPoints || [];
    const landingBenefits = agent.landingBenefits || [];
    const landingTestimonials = agent.landingTestimonials || [];
    const landingFaq = agent.landingFaq || [];

    if (landingPainPoints.length > 0) {
      lines.push("## 9. PAIN POINTS TARGET MARKET");
      lines.push("");
      landingPainPoints.forEach((p: string) => lines.push(`- ${p}`));
      lines.push("");
    }

    if (landingBenefits.length > 0) {
      lines.push("## 10. MANFAAT / BENEFITS");
      lines.push("");
      landingBenefits.forEach((b: string) => lines.push(`- ${b}`));
      lines.push("");
    }

    if (landingTestimonials.length > 0) {
      lines.push("## 11. TESTIMONI");
      lines.push("");
      landingTestimonials.forEach((t: any, i: number) => {
        lines.push(`> "${t.quote}"`);
        lines.push(`> — **${t.name}**${t.role ? `, ${t.role}` : ""}${t.company ? `, ${t.company}` : ""}`);
        lines.push("");
      });
    }

    if (landingFaq.length > 0) {
      lines.push("## 12. FAQ");
      lines.push("");
      landingFaq.forEach((f: any) => {
        lines.push(`**Q: ${f.question}**`);
        lines.push(`A: ${f.answer}`);
        lines.push("");
      });
    }

    if (metaPixelId) {
      lines.push("## TRACKING");
      lines.push("");
      lines.push(`- **Meta Pixel ID:** ${metaPixelId}`);
      lines.push("");
    }

    lines.push("---");
    lines.push(`*Brief ini di-generate otomatis oleh Gustafta AI dari data chatbot "${agent.name || ""}"*`);
    lines.push(`*Gunakan sebagai panduan untuk membuat ad copy, konten sosial media, dan materi promosi di platform lain.*`);
    return lines.join("\n");
  };

  const mdToHtml = (md: string) => {
    const lines = md.split("\n");
    const result: string[] = [];
    let inList = false;

    const closePendingList = () => {
      if (inList) { result.push("</ul>"); inList = false; }
    };
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
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const slug = (agent.name || "chatbot").replace(/\s+/g, "-").toLowerCase();

  const downloadMarkdown = () => {
    downloadFile(buildMarketingBrief(), `brief-marketing-${slug}.md`, "text/markdown");
    toast({ title: "Berhasil", description: "File Markdown berhasil diunduh" });
  };

  const downloadHtml = () => {
    const body = mdToHtml(buildMarketingBrief());
    const html = `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Marketing Brief - ${agent.name || "Chatbot"}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.7;color:#333}
h1{color:#1a1a2e;border-bottom:3px solid #4361ee;padding-bottom:.5rem}
h2{color:#3a0ca3;margin-top:2rem}h3{color:#4361ee}
blockquote{border-left:4px solid #4361ee;margin:1rem 0;padding:.5rem 1rem;background:#f8f9fa;font-style:italic}
ul{margin:.5rem 0;padding-left:1.5rem}li{margin:.3rem 0}hr{border:none;border-top:2px solid #eee;margin:2rem 0}
strong{color:#1a1a2e}</style></head>
<body>${body}</body></html>`;
    downloadFile(html, `brief-marketing-${slug}.html`, "text/html");
    toast({ title: "Berhasil", description: "File HTML berhasil diunduh" });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(buildMarketingBrief());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Disalin!", description: "Brief marketing berhasil disalin ke clipboard" });
  };

  const brief = buildMarketingBrief();
  const sectionCount = (brief.match(/^## /gm) || []).length;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl overflow-y-auto max-h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground" data-testid="text-marketing-title">Brief Marketing</h2>
            <p className="text-sm text-muted-foreground">Data chatbot untuk bahan promosi & ad copy</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={copyAll} data-testid="button-copy-all-marketing">
            {copied ? <Check className="w-4 h-4 mr-1.5" /> : <ClipboardCopy className="w-4 h-4 mr-1.5" />}
            {copied ? "Tersalin" : "Salin Semua"}
          </Button>
          <Button variant="outline" onClick={downloadMarkdown} data-testid="button-download-md-marketing">
            <Download className="w-4 h-4 mr-1.5" />
            .md
          </Button>
          <Button variant="outline" onClick={downloadHtml} data-testid="button-download-html-marketing">
            <Download className="w-4 h-4 mr-1.5" />
            .html
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-3">
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
        <CardContent className="pt-6 space-y-3">
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
            <Button onClick={handleSave} disabled={updateMutation.isPending} data-testid="button-save-marketing-settings">
              {updateMutation.isPending ? "..." : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="font-semibold">Preview Brief Marketing</span>
            </div>
            <Badge variant="secondary">{sectionCount} bagian</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Brief ini otomatis diambil dari konfigurasi chatbot Anda. Edit data chatbot di panel lain untuk memperbarui brief ini.
          </p>
          <div className="bg-muted/50 rounded-md p-4 max-h-[500px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm font-mono text-foreground leading-relaxed" data-testid="text-brief-preview">
              {brief}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-semibold">Cara Pakai</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>1. Klik "Salin Semua" atau download file (.md / .html)</p>
            <p>2. Gunakan brief ini sebagai panduan untuk membuat:</p>
            <div className="pl-4 space-y-1">
              <p>- Ad copy untuk Meta Ads, Google Ads, TikTok, dll.</p>
              <p>- Konten Instagram, LinkedIn, dan sosial media lainnya</p>
              <p>- Email marketing dan landing page</p>
              <p>- Proposal dan presentasi produk</p>
            </div>
            <p>3. Simpan URL materi marketing jadi di field di atas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}