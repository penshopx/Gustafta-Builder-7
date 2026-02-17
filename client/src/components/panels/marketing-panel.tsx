import { useState, useEffect } from "react";
import { 
  Megaphone, Copy, Check, Sparkles, Plus, Trash2, ChevronDown, ChevronUp,
  Image, Video, Eye, Loader2, Link, ExternalLink, Download, ClipboardCopy
} from "lucide-react";
import { SiFacebook, SiInstagram, SiGoogle, SiTiktok, SiLinkedin } from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AdCopy {
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;
  hashtags: string;
}

interface ImagePrompt {
  id: string;
  title: string;
  prompt: string;
  platform: string;
  style: string;
}

interface VideoPrompt {
  id: string;
  title: string;
  prompt: string;
  platform: string;
  duration: string;
}

const AD_PLATFORMS = [
  { id: "meta", label: "Meta Ads (Facebook)", icon: SiFacebook, color: "text-blue-600" },
  { id: "instagram", label: "Instagram", icon: SiInstagram, color: "text-pink-500" },
  { id: "google", label: "Google Ads", icon: SiGoogle, color: "text-red-500" },
  { id: "tiktok", label: "TikTok", icon: SiTiktok, color: "text-foreground" },
  { id: "linkedin", label: "LinkedIn", icon: SiLinkedin, color: "text-blue-700" },
];

const IMAGE_STYLES = [
  "Professional Photography", "3D Render", "Flat Design", "Minimalist",
  "Bold Typography", "Lifestyle Shot", "Product Showcase", "Infographic",
];

export function MarketingPanel({ agent }: { agent: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [adCopies, setAdCopies] = useState<Record<string, AdCopy>>(() => {
    const raw = (agent.adCopies as Record<string, AdCopy>) || {};
    const result: Record<string, AdCopy> = {};
    for (const p of AD_PLATFORMS) {
      result[p.id] = raw[p.id] || { headline: "", primaryText: "", description: "", callToAction: "", hashtags: "" };
    }
    return result;
  });

  const [imagePrompts, setImagePrompts] = useState<ImagePrompt[]>(
    (agent.imageHookPrompts as ImagePrompt[]) || []
  );

  const [videoPrompts, setVideoPrompts] = useState<VideoPrompt[]>(
    (agent.videoReelPrompts as VideoPrompt[]) || []
  );

  const [metaPixelId, setMetaPixelId] = useState(agent.metaPixelId || "");
  const [marketingKitUrl, setMarketingKitUrl] = useState(agent.marketingKitUrl || "");

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [generatingPlatform, setGeneratingPlatform] = useState<string | null>(null);
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  useEffect(() => {
    const raw = (agent.adCopies as Record<string, AdCopy>) || {};
    const result: Record<string, AdCopy> = {};
    for (const p of AD_PLATFORMS) {
      result[p.id] = raw[p.id] || { headline: "", primaryText: "", description: "", callToAction: "", hashtags: "" };
    }
    setAdCopies(result);
    setImagePrompts((agent.imageHookPrompts as ImagePrompt[]) || []);
    setVideoPrompts((agent.videoReelPrompts as VideoPrompt[]) || []);
    setMetaPixelId(agent.metaPixelId || "");
    setMarketingKitUrl(agent.marketingKitUrl || "");
  }, [agent]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/agents/${agent.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({ title: "Berhasil", description: "Marketing kit berhasil disimpan" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menyimpan marketing kit", variant: "destructive" });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      adCopies,
      imageHookPrompts: imagePrompts,
      videoReelPrompts: videoPrompts,
      metaPixelId,
      marketingKitUrl: marketingKitUrl.trim(),
    });
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const generateAdCopy = async (platformId: string) => {
    setGeneratingPlatform(platformId);
    try {
      const response = await apiRequest("POST", `/api/agents/${agent.id}/generate-ad-copy`, {
        platform: platformId,
        agentName: agent.name,
        agentDescription: agent.description,
        agentTagline: agent.tagline || "",
        productFeatures: agent.productFeatures || [],
        landingBenefits: agent.landingBenefits || [],
      });
      const data = await response.json();
      if (data.adCopy) {
        setAdCopies(prev => ({ ...prev, [platformId]: data.adCopy }));
        toast({ title: "Berhasil", description: `Ad copy ${platformId} berhasil di-generate` });
      }
    } catch {
      toast({ title: "Gagal", description: "Gagal generate ad copy", variant: "destructive" });
    } finally {
      setGeneratingPlatform(null);
    }
  };

  const generateCreativePrompts = async (type: "image" | "video") => {
    setGeneratingType(type);
    try {
      const response = await apiRequest("POST", `/api/agents/${agent.id}/generate-creative-prompts`, {
        type,
        agentName: agent.name,
        agentDescription: agent.description,
        agentTagline: agent.tagline || "",
      });
      const data = await response.json();
      if (type === "image" && data.prompts) {
        setImagePrompts(prev => [...prev, ...data.prompts]);
        toast({ title: "Berhasil", description: "Prompt gambar hook berhasil di-generate" });
      } else if (type === "video" && data.prompts) {
        setVideoPrompts(prev => [...prev, ...data.prompts]);
        toast({ title: "Berhasil", description: "Prompt video reel berhasil di-generate" });
      }
    } catch {
      toast({ title: "Gagal", description: "Gagal generate prompts", variant: "destructive" });
    } finally {
      setGeneratingType(null);
    }
  };

  const updateAdCopy = (platformId: string, field: keyof AdCopy, value: string) => {
    setAdCopies(prev => ({
      ...prev,
      [platformId]: { ...prev[platformId], [field]: value },
    }));
  };

  const addImagePrompt = () => {
    setImagePrompts(prev => [...prev, {
      id: Date.now().toString(),
      title: "",
      prompt: "",
      platform: "general",
      style: "Professional Photography",
    }]);
  };

  const removeImagePrompt = (id: string) => {
    setImagePrompts(prev => prev.filter(p => p.id !== id));
  };

  const updateImagePrompt = (id: string, field: keyof ImagePrompt, value: string) => {
    setImagePrompts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addVideoPrompt = () => {
    setVideoPrompts(prev => [...prev, {
      id: Date.now().toString(),
      title: "",
      prompt: "",
      platform: "general",
      duration: "15-30s",
    }]);
  };

  const removeVideoPrompt = (id: string) => {
    setVideoPrompts(prev => prev.filter(p => p.id !== id));
  };

  const updateVideoPrompt = (id: string, field: keyof VideoPrompt, value: string) => {
    setVideoPrompts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const generateMarkdown = () => {
    const lines: string[] = [];
    lines.push(`# Marketing Kit - ${agent.name || "Chatbot"}`);
    lines.push("");
    lines.push("---");
    lines.push("");

    const filledPlatforms = AD_PLATFORMS.filter(p => {
      const copy = adCopies[p.id];
      return copy && (copy.headline || copy.primaryText || copy.description);
    });

    if (filledPlatforms.length > 0) {
      lines.push("## AD COPY");
      lines.push("");
      filledPlatforms.forEach(p => {
        const copy = adCopies[p.id];
        lines.push(`### ${p.label}`);
        lines.push("");
        if (copy.headline) lines.push(`**Headline:** ${copy.headline}`);
        if (copy.primaryText) lines.push(`**Primary Text:** ${copy.primaryText}`);
        if (copy.description) lines.push(`**Description:** ${copy.description}`);
        if (copy.callToAction) lines.push(`**Call to Action:** ${copy.callToAction}`);
        if (copy.hashtags) lines.push(`**Hashtags:** ${copy.hashtags}`);
        lines.push("");
      });
    }

    if (imagePrompts.length > 0) {
      lines.push("## IMAGE HOOK PROMPTS");
      lines.push("");
      imagePrompts.forEach((p, i) => {
        lines.push(`### ${i + 1}. ${p.title || "(Tanpa judul)"}`);
        lines.push(`- **Platform:** ${p.platform}`);
        lines.push(`- **Style:** ${p.style}`);
        lines.push(`- **Prompt:** ${p.prompt}`);
        lines.push("");
      });
    }

    if (videoPrompts.length > 0) {
      lines.push("## VIDEO REEL PROMPTS");
      lines.push("");
      videoPrompts.forEach((p, i) => {
        lines.push(`### ${i + 1}. ${p.title || "(Tanpa judul)"}`);
        lines.push(`- **Platform:** ${p.platform}`);
        lines.push(`- **Duration:** ${p.duration}`);
        lines.push(`- **Prompt:** ${p.prompt}`);
        lines.push("");
      });
    }

    if (metaPixelId) {
      lines.push("## META PIXEL");
      lines.push("");
      lines.push(`**Pixel ID:** ${metaPixelId}`);
      lines.push("");
    }

    lines.push("---");
    lines.push(`*Dokumen ini di-generate oleh Gustafta AI untuk chatbot "${agent.name || ""}"*`);
    return lines.join("\n");
  };

  const downloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketing-kit-${(agent.name || "chatbot").replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Berhasil", description: "Dokumen Markdown berhasil diunduh" });
  };

  const copyAllContent = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    toast({ title: "Disalin!", description: "Semua konten marketing kit berhasil disalin ke clipboard" });
  };

  const mdToHtml = (md: string) => {
    const lines = md.split("\n");
    const result: string[] = [];
    let inList = false;
    let listType = "";

    const closePendingList = () => {
      if (inList) {
        result.push(listType === "ol" ? "</ol>" : "</ul>");
        inList = false;
      }
    };

    const fmt = (t: string) => t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");

    for (const line of lines) {
      const isOl = /^\d+\.\s/.test(line);
      const isUl = line.startsWith("- ");

      if (isOl || isUl) {
        const newType = isOl ? "ol" : "ul";
        if (!inList || listType !== newType) {
          closePendingList();
          result.push(newType === "ol" ? "<ol>" : "<ul>");
          inList = true;
          listType = newType;
        }
        const content = isOl ? line.replace(/^\d+\.\s/, "") : line.slice(2);
        result.push(`<li>${fmt(content)}</li>`);
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

  const downloadHtml = () => {
    const md = generateMarkdown();
    const body = mdToHtml(md);
    const html = `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Marketing Kit - ${agent.name || "Chatbot"}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.7;color:#333}
h1{color:#1a1a2e;border-bottom:3px solid #4361ee;padding-bottom:.5rem}
h2{color:#3a0ca3;margin-top:2rem}h3{color:#4361ee}
ol,ul{margin:.5rem 0;padding-left:1.5rem}li{margin:.3rem 0}hr{border:none;border-top:2px solid #eee;margin:2rem 0}
strong{color:#1a1a2e}</style></head>
<body>${body}</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketing-kit-${(agent.name || "chatbot").replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Berhasil", description: "Dokumen HTML berhasil diunduh" });
  };

  const renderCopyButton = (text: string, fieldId: string) => (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => copyToClipboard(text, fieldId)}
      data-testid={`button-copy-${fieldId}`}
    >
      {copiedField === fieldId ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </Button>
  );

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl overflow-y-auto max-h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground" data-testid="text-marketing-title">Marketing Kit</h2>
            <p className="text-sm text-muted-foreground">Ad copy, creative prompts, dan tracking pixel</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={copyAllContent} data-testid="button-copy-all-marketing">
            <ClipboardCopy className="w-4 h-4 mr-1.5" />
            Salin Semua
          </Button>
          <Button variant="outline" onClick={downloadMarkdown} data-testid="button-download-md-marketing">
            <Download className="w-4 h-4 mr-1.5" />
            .md
          </Button>
          <Button variant="outline" onClick={downloadHtml} data-testid="button-download-html-marketing">
            <Download className="w-4 h-4 mr-1.5" />
            .html
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending} data-testid="button-save-marketing">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Simpan
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
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={marketingKitUrl}
                onChange={(e) => setMarketingKitUrl(e.target.value)}
                placeholder="https://drive.google.com/folder/marketing-kit-anda"
                className="pl-10 text-sm"
                data-testid="input-external-marketing-url"
              />
            </div>
            {marketingKitUrl.trim() && (
              <Button size="icon" variant="outline" onClick={() => window.open(marketingKitUrl.trim(), "_blank")} data-testid="button-open-external-marketing">
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="adcopy" className="w-full">
        <TabsList className="grid w-full grid-cols-4" data-testid="tabs-marketing">
          <TabsTrigger value="adcopy" data-testid="tab-adcopy">
            <Megaphone className="w-4 h-4 mr-1.5 hidden sm:inline" />
            Ad Copy
          </TabsTrigger>
          <TabsTrigger value="image" data-testid="tab-image-prompts">
            <Image className="w-4 h-4 mr-1.5 hidden sm:inline" />
            Gambar Hook
          </TabsTrigger>
          <TabsTrigger value="video" data-testid="tab-video-prompts">
            <Video className="w-4 h-4 mr-1.5 hidden sm:inline" />
            Video Reel
          </TabsTrigger>
          <TabsTrigger value="pixel" data-testid="tab-pixel">
            <Eye className="w-4 h-4 mr-1.5 hidden sm:inline" />
            Pixel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adcopy" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm text-muted-foreground">
              Buat copywriting iklan untuk berbagai platform. Klik tombol AI untuk generate otomatis.
            </p>
          </div>

          {AD_PLATFORMS.map((platform) => {
            const isExpanded = expandedSections[platform.id] ?? false;
            const Icon = platform.icon;
            const copy = adCopies[platform.id];
            const hasContent = copy && (copy.headline || copy.primaryText);

            return (
              <Card key={platform.id}>
                <CardHeader
                  className="cursor-pointer flex flex-row items-center justify-between gap-2 py-3"
                  onClick={() => toggleSection(platform.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${platform.color}`} />
                    <CardTitle className="text-sm font-medium">{platform.label}</CardTitle>
                    {hasContent && <Badge variant="secondary" className="text-xs">Terisi</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => { e.stopPropagation(); generateAdCopy(platform.id); }}
                      disabled={generatingPlatform === platform.id}
                      data-testid={`button-generate-${platform.id}`}
                    >
                      {generatingPlatform === platform.id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-1" />
                      )}
                      AI Generate
                    </Button>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium">Headline</Label>
                        {copy?.headline && renderCopyButton(copy.headline, `${platform.id}-headline`)}
                      </div>
                      <Input
                        value={copy?.headline || ""}
                        onChange={(e) => updateAdCopy(platform.id, "headline", e.target.value)}
                        placeholder={platform.id === "google" ? "Max 30 karakter" : "Headline utama iklan"}
                        data-testid={`input-headline-${platform.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium">Primary Text / Body</Label>
                        {copy?.primaryText && renderCopyButton(copy.primaryText, `${platform.id}-primary`)}
                      </div>
                      <Textarea
                        value={copy?.primaryText || ""}
                        onChange={(e) => updateAdCopy(platform.id, "primaryText", e.target.value)}
                        placeholder="Teks utama iklan"
                        rows={4}
                        data-testid={`input-primary-${platform.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium">Description / Caption</Label>
                        {copy?.description && renderCopyButton(copy.description, `${platform.id}-desc`)}
                      </div>
                      <Textarea
                        value={copy?.description || ""}
                        onChange={(e) => updateAdCopy(platform.id, "description", e.target.value)}
                        placeholder="Deskripsi tambahan"
                        rows={3}
                        data-testid={`input-desc-${platform.id}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Call to Action</Label>
                        <Input
                          value={copy?.callToAction || ""}
                          onChange={(e) => updateAdCopy(platform.id, "callToAction", e.target.value)}
                          placeholder="Coba Gratis Sekarang"
                          data-testid={`input-cta-${platform.id}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="text-xs font-medium">Hashtags</Label>
                          {copy?.hashtags && renderCopyButton(copy.hashtags, `${platform.id}-hashtags`)}
                        </div>
                        <Input
                          value={copy?.hashtags || ""}
                          onChange={(e) => updateAdCopy(platform.id, "hashtags", e.target.value)}
                          placeholder="#chatbot #AI #bisnis"
                          data-testid={`input-hashtags-${platform.id}`}
                        />
                      </div>
                    </div>

                    {copy && (copy.headline || copy.primaryText) && (
                      <div className="border-t pt-3 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const full = [copy.headline, copy.primaryText, copy.description, copy.callToAction, copy.hashtags]
                              .filter(Boolean).join("\n\n");
                            copyToClipboard(full, `${platform.id}-all`);
                          }}
                          data-testid={`button-copy-all-${platform.id}`}
                        >
                          {copiedField === `${platform.id}-all` ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                          Copy Semua
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="image" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm text-muted-foreground">
              Prompt untuk membuat gambar hook iklan. Gunakan di Midjourney, DALL-E, atau tool AI lainnya.
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateCreativePrompts("image")}
                disabled={generatingType === "image"}
                data-testid="button-generate-image-prompts"
              >
                {generatingType === "image" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
                AI Generate
              </Button>
              <Button size="sm" onClick={addImagePrompt} data-testid="button-add-image-prompt">
                <Plus className="w-4 h-4 mr-1" />
                Tambah
              </Button>
            </div>
          </div>

          {imagePrompts.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Image className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Belum ada prompt gambar. Klik "AI Generate" atau "Tambah" untuk mulai.</p>
              </CardContent>
            </Card>
          )}

          {imagePrompts.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-xs">Prompt #{index + 1}</Badge>
                  <div className="flex items-center gap-1">
                    {item.prompt && renderCopyButton(item.prompt, `img-${item.id}`)}
                    <Button size="icon" variant="ghost" onClick={() => removeImagePrompt(item.id)} data-testid={`button-delete-image-${item.id}`}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <Input
                  value={item.title}
                  onChange={(e) => updateImagePrompt(item.id, "title", e.target.value)}
                  placeholder="Judul / label prompt"
                  data-testid={`input-image-title-${item.id}`}
                />
                <Textarea
                  value={item.prompt}
                  onChange={(e) => updateImagePrompt(item.id, "prompt", e.target.value)}
                  placeholder="Deskripsi detail untuk AI image generator..."
                  rows={4}
                  data-testid={`input-image-prompt-${item.id}`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Platform</Label>
                    <Select value={item.platform} onValueChange={(v) => updateImagePrompt(item.id, "platform", v)}>
                      <SelectTrigger data-testid={`select-image-platform-${item.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Umum</SelectItem>
                        <SelectItem value="meta">Meta/Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Style</Label>
                    <Select value={item.style} onValueChange={(v) => updateImagePrompt(item.id, "style", v)}>
                      <SelectTrigger data-testid={`select-image-style-${item.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_STYLES.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="video" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm text-muted-foreground">
              Prompt untuk membuat video reel iklan. Gunakan di CapCut, RunwayML, atau tool AI lainnya.
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateCreativePrompts("video")}
                disabled={generatingType === "video"}
                data-testid="button-generate-video-prompts"
              >
                {generatingType === "video" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
                AI Generate
              </Button>
              <Button size="sm" onClick={addVideoPrompt} data-testid="button-add-video-prompt">
                <Plus className="w-4 h-4 mr-1" />
                Tambah
              </Button>
            </div>
          </div>

          {videoPrompts.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Video className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Belum ada prompt video. Klik "AI Generate" atau "Tambah" untuk mulai.</p>
              </CardContent>
            </Card>
          )}

          {videoPrompts.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-xs">Reel #{index + 1}</Badge>
                  <div className="flex items-center gap-1">
                    {item.prompt && renderCopyButton(item.prompt, `vid-${item.id}`)}
                    <Button size="icon" variant="ghost" onClick={() => removeVideoPrompt(item.id)} data-testid={`button-delete-video-${item.id}`}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <Input
                  value={item.title}
                  onChange={(e) => updateVideoPrompt(item.id, "title", e.target.value)}
                  placeholder="Judul / konsep video"
                  data-testid={`input-video-title-${item.id}`}
                />
                <Textarea
                  value={item.prompt}
                  onChange={(e) => updateVideoPrompt(item.id, "prompt", e.target.value)}
                  placeholder="Deskripsi alur video, visual, narasi, hook pembuka..."
                  rows={5}
                  data-testid={`input-video-prompt-${item.id}`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Platform</Label>
                    <Select value={item.platform} onValueChange={(v) => updateVideoPrompt(item.id, "platform", v)}>
                      <SelectTrigger data-testid={`select-video-platform-${item.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Umum</SelectItem>
                        <SelectItem value="instagram">Instagram Reels</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube Shorts</SelectItem>
                        <SelectItem value="meta">Facebook Reels</SelectItem>
                        <SelectItem value="linkedin">LinkedIn Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Durasi</Label>
                    <Select value={item.duration} onValueChange={(v) => updateVideoPrompt(item.id, "duration", v)}>
                      <SelectTrigger data-testid={`select-video-duration-${item.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-15s">5-15 detik</SelectItem>
                        <SelectItem value="15-30s">15-30 detik</SelectItem>
                        <SelectItem value="30-60s">30-60 detik</SelectItem>
                        <SelectItem value="60-90s">60-90 detik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pixel" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <SiFacebook className="w-4 h-4 text-blue-600" />
                Meta Ads Pixel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Hubungkan Meta Pixel untuk melacak konversi dari iklan Facebook & Instagram.
                Pixel akan otomatis dipasang di halaman chat publik dan landing page chatbot ini.
              </p>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Pixel ID</Label>
                <Input
                  value={metaPixelId}
                  onChange={(e) => setMetaPixelId(e.target.value)}
                  placeholder="Contoh: 123456789012345"
                  data-testid="input-meta-pixel-id"
                />
                <p className="text-xs text-muted-foreground">
                  Dapatkan Pixel ID dari Meta Business Suite &gt; Events Manager
                </p>
              </div>

              {metaPixelId && (
                <div className="space-y-3 border-t pt-3">
                  <p className="text-xs font-medium text-foreground">Event yang dilacak:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs">PageView - Halaman chat & landing</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs">Lead - Saat form lead terkirim</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs">ViewContent - Mulai chat</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs">InitiateCheckout - Klik CTA</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
