import { useState } from "react";
import { FileText, Download, ClipboardCopy, Check, Bot, Target, MessageSquare, Zap, Globe, BookOpen, Shield, Users, ExternalLink, Link } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

export function LandingPagePanel({ agent }: { agent: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [landingPageUrl, setLandingPageUrl] = useState(agent.landingPageUrl || "");

  const { data: knowledgeBases = [] } = useQuery<any[]>({
    queryKey: [`/api/knowledge-base/${agent.id}`],
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", `/api/agents/${agent.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({ title: "Tersimpan", description: "URL landing page berhasil disimpan" });
    },
  });

  const handleSaveUrl = () => {
    updateMutation.mutate({ landingPageUrl: landingPageUrl.trim() });
  };

  const buildSummary = () => {
    const lines: string[] = [];
    lines.push(`# Rangkuman Chatbot: ${agent.name || "(Tanpa Nama)"}`);
    lines.push("");
    lines.push("---");
    lines.push("");

    lines.push("## 1. IDENTITAS");
    lines.push("");
    if (agent.name) lines.push(`- **Nama:** ${agent.name}`);
    if (agent.tagline) lines.push(`- **Tagline:** ${agent.tagline}`);
    if (agent.description) lines.push(`- **Deskripsi:** ${agent.description}`);
    if (agent.category) lines.push(`- **Kategori:** ${agent.category}`);
    if (agent.subcategory) lines.push(`- **Subkategori:** ${agent.subcategory}`);
    if (agent.language) lines.push(`- **Bahasa:** ${agent.language === "id" ? "Indonesia" : agent.language === "en" ? "English" : agent.language}`);
    if (agent.brandingName) lines.push(`- **Branding:** ${agent.brandingName}`);
    lines.push(`- **URL Chat:** ${window.location.origin}/bot/${agent.id}`);
    lines.push("");

    if (agent.personality || agent.communicationStyle || agent.toneOfVoice || agent.philosophy) {
      lines.push("## 2. PERSONA & KARAKTER");
      lines.push("");
      if (agent.personality) lines.push(`- **Personality:** ${agent.personality}`);
      if (agent.communicationStyle) lines.push(`- **Gaya Komunikasi:** ${agent.communicationStyle}`);
      if (agent.toneOfVoice) lines.push(`- **Tone of Voice:** ${agent.toneOfVoice}`);
      if (agent.responseFormat) lines.push(`- **Format Respon:** ${agent.responseFormat}`);
      if (agent.philosophy) lines.push(`- **Filosofi:** ${agent.philosophy}`);
      lines.push("");
    }

    const expertise = agent.expertise || [];
    if (expertise.length > 0) {
      lines.push("## 3. KEAHLIAN / EXPERTISE");
      lines.push("");
      expertise.forEach((e: string) => lines.push(`- ${e}`));
      lines.push("");
    }

    if (agent.greetingMessage || (agent.conversationStarters || []).length > 0) {
      lines.push("## 4. SAPAAN & CONVERSATION STARTERS");
      lines.push("");
      if (agent.greetingMessage) lines.push(`**Pesan Sapaan:** ${agent.greetingMessage}`);
      const starters = agent.conversationStarters || [];
      if (starters.length > 0) {
        lines.push("");
        lines.push("**Conversation Starters:**");
        starters.forEach((s: string) => lines.push(`- ${s}`));
      }
      lines.push("");
    }

    const features = agent.productFeatures || [];
    if (features.length > 0 || agent.productSummary) {
      lines.push("## 5. FITUR PRODUK");
      lines.push("");
      if (agent.productSummary) lines.push(agent.productSummary);
      if (features.length > 0) {
        lines.push("");
        features.forEach((f: string) => lines.push(`- ${f}`));
      }
      lines.push("");
    }

    const keyPhrases = agent.keyPhrases || [];
    if (keyPhrases.length > 0) {
      lines.push("## 6. KEY PHRASES / KATA KUNCI");
      lines.push("");
      keyPhrases.forEach((p: string) => lines.push(`- ${p}`));
      lines.push("");
    }

    if (knowledgeBases.length > 0) {
      lines.push("## 7. KNOWLEDGE BASE");
      lines.push("");
      knowledgeBases.forEach((kb: any) => {
        lines.push(`- **${kb.name}** (${kb.type})${kb.description ? `: ${kb.description}` : ""}`);
      });
      lines.push("");
    }

    const contextQuestions = agent.contextQuestions || [];
    if (contextQuestions.length > 0) {
      lines.push("## 8. KONTEKS PROYEK (Pertanyaan Awal)");
      lines.push("");
      contextQuestions.forEach((q: any) => {
        lines.push(`- **${q.label}** (${q.type})${q.required ? " *wajib*" : ""}`);
        if (q.options && q.options.length > 0) {
          lines.push(`  Opsi: ${q.options.join(", ")}`);
        }
      });
      lines.push("");
    }

    lines.push("## 9. PENGATURAN TEKNIS");
    lines.push("");
    lines.push(`- **Model AI:** ${agent.aiModel || "gpt-4o-mini"}`);
    lines.push(`- **Temperature:** ${agent.temperature ?? 0.7}`);
    lines.push(`- **Max Tokens:** ${agent.maxTokens ?? 1024}`);
    if (agent.isOrchestrator) lines.push(`- **Peran:** Orchestrator (${agent.orchestratorRole})`);
    if (agent.agenticMode) lines.push("- **Mode Agentik:** Aktif");
    if (agent.emotionalIntelligence) lines.push("- **Kecerdasan Emosional:** Aktif");
    if (agent.multiStepReasoning) lines.push("- **Multi-Step Reasoning:** Aktif");
    lines.push("");

    if (agent.monthlyPrice || agent.guestMessageLimit || agent.trialEnabled) {
      lines.push("## 10. MONETISASI");
      lines.push("");
      if (agent.monthlyPrice) lines.push(`- **Harga Bulanan:** Rp ${agent.monthlyPrice.toLocaleString("id-ID")}`);
      if (agent.guestMessageLimit) lines.push(`- **Limit Pesan Tamu:** ${agent.guestMessageLimit} pesan`);
      if (agent.messageQuotaDaily) lines.push(`- **Kuota Harian:** ${agent.messageQuotaDaily} pesan`);
      if (agent.messageQuotaMonthly) lines.push(`- **Kuota Bulanan:** ${agent.messageQuotaMonthly} pesan`);
      if (agent.trialEnabled) lines.push(`- **Trial:** ${agent.trialDays || 7} hari`);
      lines.push("");
    }

    const avoidTopics = agent.avoidTopics || [];
    if (avoidTopics.length > 0) {
      lines.push("## 11. TOPIK YANG DIHINDARI");
      lines.push("");
      avoidTopics.forEach((t: string) => lines.push(`- ${t}`));
      lines.push("");
    }

    lines.push("---");
    lines.push(`*Rangkuman ini di-generate otomatis oleh Gustafta AI dari data chatbot "${agent.name || ""}"*`);
    lines.push(`*Gunakan sebagai referensi untuk membuat landing page, marketing material, atau proposal di platform lain.*`);
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
    downloadFile(buildSummary(), `rangkuman-${slug}.md`, "text/markdown");
    toast({ title: "Berhasil", description: "File Markdown berhasil diunduh" });
  };

  const downloadHtml = () => {
    const body = mdToHtml(buildSummary());
    const html = `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Rangkuman Chatbot - ${agent.name || "Chatbot"}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.7;color:#333}
h1{color:#1a1a2e;border-bottom:3px solid #4361ee;padding-bottom:.5rem}
h2{color:#3a0ca3;margin-top:2rem}h3{color:#4361ee}
ul{margin:.5rem 0;padding-left:1.5rem}li{margin:.3rem 0}hr{border:none;border-top:2px solid #eee;margin:2rem 0}
strong{color:#1a1a2e}em{color:#666}</style></head>
<body>${body}</body></html>`;
    downloadFile(html, `rangkuman-${slug}.html`, "text/html");
    toast({ title: "Berhasil", description: "File HTML berhasil diunduh" });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(buildSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Disalin!", description: "Rangkuman chatbot berhasil disalin ke clipboard" });
  };

  const summary = buildSummary();
  const sectionCount = (summary.match(/^## /gm) || []).length;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl overflow-y-auto max-h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground" data-testid="text-summary-title">Rangkuman Chatbot</h2>
            <p className="text-sm text-muted-foreground">Data lengkap chatbot untuk bahan landing page & marketing</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={copyAll} data-testid="button-copy-all-summary">
            {copied ? <Check className="w-4 h-4 mr-1.5" /> : <ClipboardCopy className="w-4 h-4 mr-1.5" />}
            {copied ? "Tersalin" : "Salin Semua"}
          </Button>
          <Button variant="outline" onClick={downloadMarkdown} data-testid="button-download-md-summary">
            <Download className="w-4 h-4 mr-1.5" />
            .md
          </Button>
          <Button variant="outline" onClick={downloadHtml} data-testid="button-download-html-summary">
            <Download className="w-4 h-4 mr-1.5" />
            .html
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Link className="w-4 h-4 text-primary" />
            <Label className="text-base font-semibold">Link Landing Page Eksternal</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Jika Anda sudah membuat landing page di platform lain (Carrd, Notion, Google Sites, dll), masukkan URL-nya di sini sebagai referensi
          </p>
          <div className="flex gap-2">
            <Input
              value={landingPageUrl}
              onChange={(e) => setLandingPageUrl(e.target.value)}
              placeholder="https://contoh.carrd.co atau https://site.google.com/..."
              data-testid="input-landing-page-url"
            />
            <Button onClick={handleSaveUrl} disabled={updateMutation.isPending} data-testid="button-save-landing-url">
              {updateMutation.isPending ? "..." : "Simpan"}
            </Button>
            {landingPageUrl && (
              <Button variant="outline" size="icon" asChild>
                <a href={landingPageUrl} target="_blank" rel="noopener noreferrer" data-testid="button-open-landing-url">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="font-semibold">Preview Rangkuman</span>
            </div>
            <Badge variant="secondary">{sectionCount} bagian</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Rangkuman ini otomatis diambil dari konfigurasi chatbot Anda. Edit data chatbot di panel lain untuk memperbarui rangkuman ini.
          </p>
          <div className="bg-muted/50 rounded-md p-4 max-h-[500px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm font-mono text-foreground leading-relaxed" data-testid="text-summary-preview">
              {summary}
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
            <p>2. Paste ke platform landing page pilihan Anda (Carrd, Notion, Google Sites, WordPress, dll.)</p>
            <p>3. Sesuaikan desain dan tambahkan visual sesuai kebutuhan</p>
            <p>4. Simpan URL landing page di field di atas sebagai referensi</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}