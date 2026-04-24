import { useState, useEffect, useRef } from "react";
import { Bot, Save, Sparkles, MessageCircle, AlertCircle, Globe, Key, Shield, Plus, X, Briefcase, Cpu, Settings2, Eye, EyeOff, Camera, Upload, ClipboardList, GripVertical, Trash2, Target, BookOpen, Scale, CheckCircle2, FileText, Copy, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUpdateAgent } from "@/hooks/use-agents";
import { getCategoryById, getSubcategoryLabel } from "@/lib/categories";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Agent } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const PROMPT_SECTION_STYLES: Array<{
  header: string;
  label: string;
  className: string;
}> = [
  { header: "=== PERSONA ===", label: "PERSONA", className: "bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 border-blue-300 dark:border-blue-800" },
  { header: "=== PRIMARY OUTCOME (TUJUAN UTAMA) ===", label: "PRIMARY OUTCOME", className: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800" },
  { header: "=== WIN CONDITIONS (KONDISI MENANG PERCAKAPAN) ===", label: "WIN CONDITIONS", className: "bg-teal-100 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200 border-teal-300 dark:border-teal-800" },
  { header: "=== BRAND VOICE (WAJIB DIPATUHI) ===", label: "BRAND VOICE", className: "bg-violet-100 text-violet-900 dark:bg-violet-950/60 dark:text-violet-200 border-violet-300 dark:border-violet-800" },
  { header: "=== INTERACTION RULES ===", label: "INTERACTION RULES", className: "bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800" },
  { header: "=== DOMAIN BOUNDARIES (BATAS TOPIK) ===", label: "DOMAIN BOUNDARIES", className: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300 dark:border-amber-800" },
  { header: "=== QUALITY STANDARDS ===", label: "QUALITY STANDARDS", className: "bg-cyan-100 text-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-200 border-cyan-300 dark:border-cyan-800" },
  { header: "=== COMPLIANCE & RISK ===", label: "COMPLIANCE & RISK", className: "bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-200 border-red-300 dark:border-red-800" },
];

function splitPromptSections(prompt: string): Array<{ label: string; className: string; body: string }> {
  if (!prompt) return [];
  const knownHeaders = PROMPT_SECTION_STYLES.map((s) => s.header);
  const lines = prompt.split("\n");
  const result: Array<{ label: string; className: string; body: string }> = [];
  let current: { label: string; className: string; body: string } | null = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (knownHeaders.includes(trimmed)) {
      if (current) result.push(current);
      const meta = PROMPT_SECTION_STYLES.find((s) => s.header === trimmed)!;
      current = { label: meta.label, className: meta.className, body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    }
  }
  if (current) result.push(current);
  return result.map((s) => ({ ...s, body: s.body.replace(/^\n+|\n+$/g, "") }));
}

interface PersonaPanelProps {
  agent: Agent;
}

const languages = [
  { code: "id", name: "Bahasa Indonesia" },
  { code: "en", name: "English" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
];

const aiModels = [
  { value: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", description: "Fast and affordable" },
  { value: "gpt-4o", name: "GPT-4o", provider: "OpenAI", description: "Most capable" },
  { value: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", description: "High performance" },
  { value: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", description: "Legacy model" },
  { value: "deepseek-chat", name: "DeepSeek Chat", provider: "DeepSeek", description: "Cost-effective" },
  { value: "deepseek-reasoner", name: "DeepSeek Reasoner", provider: "DeepSeek", description: "Advanced reasoning" },
  { value: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", description: "Fast responses" },
  { value: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic", description: "Balanced performance" },
  { value: "custom", name: "Custom Model", provider: "Custom", description: "Use your own API" },
];

export function PersonaPanel({ agent }: PersonaPanelProps) {
  const { toast } = useToast();
  const updateAgent = useUpdateAgent();

  const [formData, setFormData] = useState({
    name: agent.name,
    description: agent.description,
    avatar: agent.avatar || "",
    tagline: agent.tagline,
    philosophy: agent.philosophy,
    offTopicHandling: agent.offTopicHandling,
    offTopicResponse: agent.offTopicResponse || "",
    systemPrompt: agent.systemPrompt,
    temperature: agent.temperature,
    maxTokens: agent.maxTokens,
    aiModel: agent.aiModel || "gpt-4o-mini",
    customApiKey: agent.customApiKey || "",
    customBaseUrl: agent.customBaseUrl || "",
    customModelName: agent.customModelName || "",
    greetingMessage: agent.greetingMessage || "",
    conversationStarters: agent.conversationStarters || [],
    language: agent.language || "id",
    isPublic: agent.isPublic || false,
    allowedDomains: agent.allowedDomains || [],
    contextQuestions: (agent as any).contextQuestions || [],
    // Tujuan & KPI
    primaryOutcome: (agent as any).primaryOutcome || "",
    conversationWinConditions: (agent as any).conversationWinConditions || "",
    fallbackObjective: (agent as any).fallbackObjective || "Kumpulkan data untuk tindak lanjut",
    // Kebijakan Agen
    brandVoiceSpec: (agent as any).brandVoiceSpec || "",
    reasoningPolicy: (agent as any).reasoningPolicy || "Langkah demi langkah",
    interactionPolicy: (agent as any).interactionPolicy || "",
    domainCharter: (agent as any).domainCharter || "",
    qualityBar: (agent as any).qualityBar || "",
    riskCompliance: (agent as any).riskCompliance || "",
  });

  const [newStarter, setNewStarter] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [newContextLabel, setNewContextLabel] = useState("");
  const [newContextType, setNewContextType] = useState<"text" | "select">("select");
  const [newContextOptions, setNewContextOptions] = useState("");
  const [newContextRequired, setNewContextRequired] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewPrompt, setPreviewPrompt] = useState<string>("");
  const [previewError, setPreviewError] = useState<string>("");
  const [copiedPreview, setCopiedPreview] = useState(false);

  const handleOpenPromptPreview = async () => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError("");
    setPreviewPrompt("");
    setCopiedPreview(false);
    try {
      const res = await apiRequest("GET", `/api/agents/${agent.id}/preview-prompt`);
      const data = await res.json();
      setPreviewPrompt(data.prompt || "");
    } catch (err: any) {
      setPreviewError(err?.message || "Gagal memuat pratinjau prompt");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCopyPreview = async () => {
    if (!previewPrompt) return;
    try {
      await navigator.clipboard.writeText(previewPrompt);
      setCopiedPreview(true);
      toast({ title: "Tersalin", description: "Prompt akhir disalin ke clipboard." });
      setTimeout(() => setCopiedPreview(false), 2000);
    } catch {
      toast({ title: "Gagal menyalin", description: "Browser tidak mengizinkan akses clipboard.", variant: "destructive" });
    }
  };

  const previewSections = splitPromptSections(previewPrompt);

  useEffect(() => {
    // Reset form HANYA ketika berpindah ke agent berbeda (agent.id berubah)
    // Jangan reset saat data agent diperbarui (autoSave) agar field lain tidak hilang
    setFormData({
      name: agent.name,
      description: agent.description,
      avatar: agent.avatar || "",
      tagline: agent.tagline,
      philosophy: agent.philosophy,
      offTopicHandling: agent.offTopicHandling,
      offTopicResponse: agent.offTopicResponse || "",
      systemPrompt: agent.systemPrompt,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      aiModel: agent.aiModel || "gpt-4o-mini",
      customApiKey: agent.customApiKey || "",
      customBaseUrl: agent.customBaseUrl || "",
      customModelName: agent.customModelName || "",
      greetingMessage: agent.greetingMessage || "",
      conversationStarters: agent.conversationStarters || [],
      language: agent.language || "id",
      isPublic: agent.isPublic || false,
      allowedDomains: agent.allowedDomains || [],
      contextQuestions: (agent as any).contextQuestions || [],
      primaryOutcome: (agent as any).primaryOutcome || "",
      conversationWinConditions: (agent as any).conversationWinConditions || "",
      fallbackObjective: (agent as any).fallbackObjective || "Kumpulkan data untuk tindak lanjut",
      brandVoiceSpec: (agent as any).brandVoiceSpec || "",
      reasoningPolicy: (agent as any).reasoningPolicy || "Langkah demi langkah",
      interactionPolicy: (agent as any).interactionPolicy || "",
      domainCharter: (agent as any).domainCharter || "",
      qualityBar: (agent as any).qualityBar || "",
      riskCompliance: (agent as any).riskCompliance || "",
    });
  }, [agent.id]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Hanya file gambar yang diperbolehkan",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      
      const res = await fetch("/api/agents/avatar-upload", {
        method: "POST",
        body: formDataUpload,
      });
      
      if (!res.ok) throw new Error("Failed to upload avatar");
      const result = await res.json();
      
      setFormData({ ...formData, avatar: result.fileUrl });
      toast({
        title: "Berhasil",
        description: "Avatar berhasil diupload. Klik Save Changes untuk menyimpan.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupload avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = () => {
    updateAgent.mutate(
      { id: agent.id, data: formData },
      {
        onSuccess: () => {
          toast({
            title: "Persona Updated",
            description: "Your chatbot persona has been saved successfully.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update persona. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const autoSaveField = (field: string, value: unknown) => {
    updateAgent.mutate(
      { id: agent.id, data: { [field]: value } },
      {
        onError: () => {
          toast({
            title: "Error",
            description: "Gagal menyimpan perubahan otomatis.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const addConversationStarter = () => {
    if (newStarter.trim() && formData.conversationStarters.length < 5) {
      const updated = [...formData.conversationStarters, newStarter.trim()];
      setFormData({
        ...formData,
        conversationStarters: updated,
      });
      setNewStarter("");
      autoSaveField("conversationStarters", updated);
    }
  };

  const removeConversationStarter = (index: number) => {
    const updated = formData.conversationStarters.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      conversationStarters: updated,
    });
    autoSaveField("conversationStarters", updated);
  };

  const addAllowedDomain = () => {
    if (newDomain.trim() && formData.allowedDomains.length < 10) {
      const updated = [...formData.allowedDomains, newDomain.trim()];
      setFormData({
        ...formData,
        allowedDomains: updated,
      });
      setNewDomain("");
      autoSaveField("allowedDomains", updated);
    }
  };

  const removeAllowedDomain = (index: number) => {
    const updated = formData.allowedDomains.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      allowedDomains: updated,
    });
    autoSaveField("allowedDomains", updated);
  };

  const copyAccessToken = () => {
    if (agent.accessToken) {
      navigator.clipboard.writeText(agent.accessToken);
      toast({
        title: "Copied",
        description: "Access token copied to clipboard.",
      });
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg md:text-2xl font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
            <span className="truncate">Persona</span>
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden sm:block">
            Define your chatbot's personality and behavior
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateAgent.isPending}
          size="sm"
         
          className="shrink-0"
        >
          <Save className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">{updateAgent.isPending ? "Saving..." : "Save Changes"}</span>
        </Button>
      </div>

      {/* Basic Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Identity
          </CardTitle>
          <CardDescription>Basic information about your chatbot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage src={formData.avatar} alt={formData.name} />
                <AvatarFallback className="text-xl bg-primary/10">
                  {formData.name ? formData.name.substring(0, 2).toUpperCase() : <Bot className="h-8 w-8 text-primary" />}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
               
              >
                {isUploadingAvatar ? (
                  <Upload className="h-3.5 w-3.5 animate-pulse" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </Button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
               
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-sm">Avatar Chatbot</Label>
              <p className="text-xs text-muted-foreground">
                Klik ikon kamera untuk upload gambar avatar. Format: JPG, PNG, GIF, WebP. Maksimal 5MB. Rekomendasi ukuran: 200x200 hingga 500x500 pixel (rasio 1:1).
              </p>
              {formData.avatar && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive h-7 px-2"
                  onClick={() => setFormData({ ...formData, avatar: "" })}
                >
                  <X className="w-3 h-3 mr-1" />
                  Hapus Avatar
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Chatbot Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Assistant"
               
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline" className="text-sm">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Your helpful AI companion"
               
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A brief description of what your chatbot does..."
              rows={3}
             
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Primary Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {agent.category && (
            <div className="space-y-2">
              <Label>Business Category</Label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                {(() => {
                  const category = getCategoryById(agent.category);
                  if (!category) return null;
                  const IconComponent = category.icon;
                  return (
                    <>
                      <IconComponent className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">
                        {category.label}
                        {agent.subcategory && (
                          <span className="text-muted-foreground">
                            {" "}&gt; {getSubcategoryLabel(agent.category, agent.subcategory)}
                          </span>
                        )}
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Greeting & Conversation Starters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Welcome Experience
          </CardTitle>
          <CardDescription>First impression when users start a conversation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="greetingMessage">Greeting Message</Label>
            <Textarea
              id="greetingMessage"
              value={formData.greetingMessage}
              onChange={(e) => setFormData({ ...formData, greetingMessage: e.target.value })}
              placeholder="Hello! Welcome to our service. How can I help you today?"
              rows={2}
             
            />
            <p className="text-xs text-muted-foreground">
              This message is shown when users first open the chat
            </p>
          </div>
          <div className="space-y-2">
            <Label>Conversation Starters</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Quick prompts users can click to start a conversation (max 5)
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.conversationStarters.map((starter, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pl-3">
                  {starter}
                  <button
                    onClick={() => removeConversationStarter(index)}
                    className="ml-1 hover:text-destructive"
                   
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {formData.conversationStarters.length < 5 && (
              <div className="flex gap-2">
                <Input
                  value={newStarter}
                  onChange={(e) => setNewStarter(e.target.value)}
                  placeholder="e.g., How do I get started?"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addConversationStarter())}
                 
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addConversationStarter}
                  disabled={!newStarter.trim()}
                 
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Context Questions / Konteks Proyek */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Konteks Proyek
          </CardTitle>
          <CardDescription>
            Pertanyaan yang ditanyakan chatbot di awal percakapan untuk memahami konteks pengguna. Jawaban akan digunakan chatbot untuk menyesuaikan responnya.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.contextQuestions.length > 0 && (
            <div className="space-y-2">
              {formData.contextQuestions.map((q: any, index: number) => (
                <div key={q.id} className="flex items-start gap-2 p-3 rounded-lg border bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{q.label}</span>
                      <Badge variant="secondary">{q.type === "select" ? "Pilihan" : "Teks Bebas"}</Badge>
                      {q.required && <Badge variant="outline" className="text-xs">Wajib</Badge>}
                    </div>
                    {q.type === "select" && q.options?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {q.options.map((opt: string, i: number) => (
                          <span key={i} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{opt}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const updated = formData.contextQuestions.filter((_: any, i: number) => i !== index);
                      setFormData({ ...formData, contextQuestions: updated });
                    }}
                    data-testid={`button-remove-context-${index}`}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {formData.contextQuestions.length < 10 && (
            <div className="space-y-3 p-4 rounded-lg border border-dashed">
              <p className="text-sm font-medium text-muted-foreground">Tambah Pertanyaan Konteks</p>
              <div className="space-y-2">
                <Input
                  value={newContextLabel}
                  onChange={(e) => setNewContextLabel(e.target.value)}
                  placeholder="Contoh: Jenis proyek apa yang Anda kelola?"
                  data-testid="input-context-label"
                />
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Tipe:</Label>
                  <Select
                    value={newContextType}
                    onValueChange={(v) => setNewContextType(v as "text" | "select")}
                  >
                    <SelectTrigger className="w-[140px]" data-testid="select-context-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select">Pilihan</SelectItem>
                      <SelectItem value="text">Teks Bebas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newContextRequired}
                    onCheckedChange={setNewContextRequired}
                    data-testid="switch-context-required"
                  />
                  <Label className="text-sm">Wajib</Label>
                </div>
              </div>
              {newContextType === "select" && (
                <div className="space-y-1">
                  <Input
                    value={newContextOptions}
                    onChange={(e) => setNewContextOptions(e.target.value)}
                    placeholder="Pilihan dipisah koma: Gedung, Jalan, Irigasi, Jembatan"
                    data-testid="input-context-options"
                  />
                  <p className="text-xs text-muted-foreground">Pisahkan setiap pilihan dengan tanda koma</p>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!newContextLabel.trim()) return;
                  const options = newContextType === "select"
                    ? newContextOptions.split(",").map(o => o.trim()).filter(Boolean)
                    : [];
                  if (newContextType === "select" && options.length === 0) return;
                  const newQuestion = {
                    id: `ctx_${Date.now()}`,
                    label: newContextLabel.trim(),
                    type: newContextType,
                    options,
                    required: newContextRequired,
                  };
                  setFormData({
                    ...formData,
                    contextQuestions: [...formData.contextQuestions, newQuestion],
                  });
                  setNewContextLabel("");
                  setNewContextOptions("");
                  setNewContextRequired(true);
                }}
                disabled={!newContextLabel.trim() || (newContextType === "select" && !newContextOptions.trim())}
                data-testid="button-add-context-question"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pertanyaan
              </Button>
            </div>
          )}

          {formData.contextQuestions.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Belum ada pertanyaan konteks. Tambahkan pertanyaan agar chatbot memahami kebutuhan pengguna di awal percakapan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Personality & Behavior */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Personality & Behavior
          </CardTitle>
          <CardDescription>How your chatbot interacts with users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="philosophy">Communication Philosophy</Label>
            <Textarea
              id="philosophy"
              value={formData.philosophy}
              onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
              placeholder="Describe the communication style and values your chatbot should embody..."
              rows={3}
             
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              placeholder="You are a helpful assistant that..."
              rows={5}
              className="font-mono text-sm"
             
            />
            <p className="text-xs text-muted-foreground">
              The system prompt defines the core behavior and context for your chatbot
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Off-Topic Handling */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Off-Topic Handling
          </CardTitle>
          <CardDescription>Bagaimana chatbot merespons pertanyaan di luar topik</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offTopicHandling">Strategi Respons</Label>
            <Select
              value={formData.offTopicHandling}
              onValueChange={(value) => setFormData({ ...formData, offTopicHandling: value })}
            >
              <SelectTrigger id="offTopicHandling">
                <SelectValue placeholder="Pilih strategi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="politely_redirect">Arahkan dengan Sopan</SelectItem>
                <SelectItem value="acknowledge_and_decline">Akui dan Tolak</SelectItem>
                <SelectItem value="attempt_to_help">Tetap Coba Bantu</SelectItem>
                <SelectItem value="strict_boundaries">Batasan Ketat</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Menentukan bagaimana chatbot menangani pertanyaan di luar cakupan yang ditentukan
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="offTopicResponse">Respons Kustom (Opsional)</Label>
            <Textarea
              id="offTopicResponse"
              value={formData.offTopicResponse}
              onChange={(e) => setFormData({ ...formData, offTopicResponse: e.target.value })}
              placeholder="Contoh: Maaf, saya hanya bisa membantu dengan pertanyaan seputar produk kami. Silakan hubungi customer service untuk pertanyaan lainnya."
              rows={3}
             
            />
            <p className="text-xs text-muted-foreground">
              Tulis respons kustom yang akan diberikan chatbot ketika menerima pertanyaan di luar topik. 
              Kosongkan untuk menggunakan respons otomatis berdasarkan strategi di atas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Model Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            Konfigurasi Model AI
          </CardTitle>
          <CardDescription>Pilih model AI yang menggerakkan chatbot Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aiModel">Model AI</Label>
            <Select
              value={formData.aiModel}
              onValueChange={(value) => setFormData({ ...formData, aiModel: value as typeof formData.aiModel })}
            >
              <SelectTrigger id="aiModel">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex items-center gap-2">
                      <span>{model.name}</span>
                      <span className="text-xs text-muted-foreground">({model.provider})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {aiModels.find(m => m.value === formData.aiModel)?.description || "Choose an AI model"}
            </p>
          </div>

          {(formData.aiModel === "custom" || formData.aiModel.startsWith("claude-") || formData.aiModel.startsWith("deepseek-")) && (
            <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Settings2 className="w-4 h-4" />
                {formData.aiModel.startsWith("claude-") 
                  ? "Claude Proxy Settings" 
                  : formData.aiModel.startsWith("deepseek-")
                    ? "DeepSeek API Settings"
                    : "Custom Model Settings"}
              </div>
              {formData.aiModel.startsWith("claude-") && (
                <p className="text-xs text-muted-foreground">
                  Claude models require an OpenAI-compatible proxy (like OpenRouter or LiteLLM). Configure your proxy endpoint below.
                </p>
              )}
              {formData.aiModel.startsWith("deepseek-") && (
                <p className="text-xs text-muted-foreground">
                  Masukkan API key DeepSeek Anda. Dapatkan di <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">platform.deepseek.com</a>
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="customApiKey">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="customApiKey"
                    type={showApiKey ? "text" : "password"}
                    value={formData.customApiKey}
                    onChange={(e) => setFormData({ ...formData, customApiKey: e.target.value })}
                    placeholder="sk-..."
                    className="font-mono text-sm"
                   
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                   
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customBaseUrl">Base URL</Label>
                <Input
                  id="customBaseUrl"
                  value={formData.customBaseUrl}
                  onChange={(e) => setFormData({ ...formData, customBaseUrl: e.target.value })}
                  placeholder="https://api.example.com/v1"
                 
                />
                <p className="text-xs text-muted-foreground">
                  The API endpoint URL (e.g., https://api.openai.com/v1)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customModelName">Model Name</Label>
                <Input
                  id="customModelName"
                  value={formData.customModelName}
                  onChange={(e) => setFormData({ ...formData, customModelName: e.target.value })}
                  placeholder="gpt-4"
                 
                />
                <p className="text-xs text-muted-foreground">
                  The specific model identifier to use
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parameter Model</CardTitle>
          <CardDescription>Sesuaikan parameter perilaku model AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Kreativitas: {formData.temperature.toFixed(1)}</Label>
              <span className="text-xs text-muted-foreground">
                {formData.temperature < 0.5 ? "Lebih fokus" : formData.temperature > 1 ? "Lebih kreatif" : "Seimbang"}
              </span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[formData.temperature]}
              onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
             
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxTokens">Panjang Respons Maks: {formData.maxTokens}</Label>
              <span className="text-xs text-muted-foreground">
                Batas panjang respons
              </span>
            </div>
            <Slider
              id="maxTokens"
              min={100}
              max={4096}
              step={100}
              value={[formData.maxTokens]}
              onValueChange={([value]) => setFormData({ ...formData, maxTokens: value })}
             
            />
          </div>
        </CardContent>
      </Card>

      {/* Access Control & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Kontrol Akses & Keamanan
          </CardTitle>
          <CardDescription>Atur siapa saja yang dapat mengakses chatbot Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isPublic">Akses Publik</Label>
              <p className="text-xs text-muted-foreground">
                Izinkan siapa saja mengakses chatbot ini tanpa otentikasi
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
             
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Access Token (untuk Integrasi)
            </Label>
            <div className="flex gap-2">
              <Input
                value={agent.accessToken || ""}
                readOnly
                className="font-mono text-sm"
               
              />
              <Button variant="outline" onClick={copyAccessToken}>
                Salin
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Token ini digunakan untuk mengautentikasi permintaan API ke chatbot Anda. 
              Gunakan saat menyematkan chatbot di website Anda atau mengintegrasikan dengan aplikasi eksternal (WhatsApp, Telegram, dll).
            </p>
          </div>

          <div className="space-y-2">
            <Label>Domain yang Diizinkan</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Batasi akses widget ke domain tertentu. Kosongkan untuk mengizinkan semua domain.
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.allowedDomains.map((domain, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pl-3">
                  {domain}
                  <button
                    onClick={() => removeAllowedDomain(index)}
                    className="ml-1 hover:text-destructive"
                   
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {formData.allowedDomains.length < 10 && (
              <div className="flex gap-2">
                <Input
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g., example.com"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllowedDomain())}
                 
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addAllowedDomain}
                  disabled={!newDomain.trim()}
                 
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tujuan & KPI */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            Tujuan & KPI Agen
          </CardTitle>
          <CardDescription>Definisikan target keberhasilan dan respons fallback saat target tidak tercapai.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Outcome Utama
            </Label>
            <p className="text-xs text-muted-foreground">Tujuan bisnis utama yang harus dicapai agen.</p>
            <Select
              value={formData.primaryOutcome}
              onValueChange={(v) => {
                setFormData({ ...formData, primaryOutcome: v });
                autoSaveField("primaryOutcome", v);
              }}
            >
              <SelectTrigger data-testid="select-primary-outcome">
                <SelectValue placeholder="Pilih outcome utama…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Menyelesaikan tiket">Menyelesaikan tiket / dukungan pelanggan</SelectItem>
                <SelectItem value="Menghasilkan dokumen">Menghasilkan dokumen / laporan</SelectItem>
                <SelectItem value="Menutup penjualan">Menutup penjualan / konversi leads</SelectItem>
                <SelectItem value="Mendidik pengguna">Mendidik & onboard pengguna</SelectItem>
                <SelectItem value="Mengumpulkan data">Mengumpulkan data / requirement</SelectItem>
                <SelectItem value="Audit & compliance">Audit & kepatuhan regulasi</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Kondisi Percakapan Berhasil (Win Conditions)</Label>
            <p className="text-xs text-muted-foreground">Deskripsikan kapan percakapan dianggap berhasil. Contoh: "Pengguna mendapatkan nomor RAB yang disetujui dan bisa diunduh."</p>
            <Textarea
              value={formData.conversationWinConditions}
              onChange={(e) => setFormData({ ...formData, conversationWinConditions: e.target.value })}
              onBlur={(e) => autoSaveField("conversationWinConditions", e.target.value)}
              placeholder="Contoh: Pengguna menerima jawaban definitif dan tidak perlu eskalasi ke manusia…"
              rows={3}
              data-testid="textarea-win-conditions"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Fallback Objective</Label>
            <p className="text-xs text-muted-foreground">Tindakan terbaik saat agen tidak bisa mencapai outcome utama.</p>
            <Select
              value={formData.fallbackObjective}
              onValueChange={(v) => {
                setFormData({ ...formData, fallbackObjective: v });
                autoSaveField("fallbackObjective", v);
              }}
            >
              <SelectTrigger data-testid="select-fallback-objective">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kumpulkan data untuk tindak lanjut">Kumpulkan data untuk tindak lanjut</SelectItem>
                <SelectItem value="Eskalasi ke manusia">Eskalasi ke manusia / supervisor</SelectItem>
                <SelectItem value="Buat ringkasan">Buat ringkasan percakapan & simpan</SelectItem>
                <SelectItem value="Berikan disclaimer">Berikan disclaimer & arahkan ke sumber resmi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kebijakan Agen */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-500" />
                Kebijakan Agen
              </CardTitle>
              <CardDescription>Aturan tetap yang tidak boleh diubah oleh pengguna — suara merek, batas domain, standar kualitas, dan kepatuhan.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenPromptPreview}
              className="shrink-0 gap-2"
              data-testid="button-preview-prompt"
            >
              <FileText className="w-4 h-4" />
              Pratinjau Prompt AI
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-violet-500" />
              Spesifikasi Brand Voice
            </Label>
            <p className="text-xs text-muted-foreground">Gaya bahasa, tingkat formalitas, dan karakter komunikasi yang harus dipertahankan.</p>
            <Textarea
              value={formData.brandVoiceSpec}
              onChange={(e) => setFormData({ ...formData, brandVoiceSpec: e.target.value })}
              onBlur={(e) => autoSaveField("brandVoiceSpec", e.target.value)}
              placeholder="Contoh: Gunakan bahasa formal namun ramah. Hindari jargon teknis. Selalu gunakan sapaan 'Bapak/Ibu'. Nada: profesional, suportif, berbasis data…"
              rows={3}
              data-testid="textarea-brand-voice"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              Kebijakan Penalaran (Reasoning Policy)
            </Label>
            <p className="text-xs text-muted-foreground">Cara agen menyajikan proses berpikirnya kepada pengguna.</p>
            <Select
              value={formData.reasoningPolicy}
              onValueChange={(v) => {
                setFormData({ ...formData, reasoningPolicy: v });
                autoSaveField("reasoningPolicy", v);
              }}
            >
              <SelectTrigger data-testid="select-reasoning-policy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ringkas">Ringkas — langsung ke jawaban akhir</SelectItem>
                <SelectItem value="Langkah demi langkah">Langkah demi langkah — tampilkan proses</SelectItem>
                <SelectItem value="Tanya klarifikasi">Tanya klarifikasi — validasi dulu sebelum menjawab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Kebijakan Interaksi</Label>
            <p className="text-xs text-muted-foreground">Aturan kapan agen bertanya balik vs. menyimpulkan sendiri.</p>
            <Textarea
              value={formData.interactionPolicy}
              onChange={(e) => setFormData({ ...formData, interactionPolicy: e.target.value })}
              onBlur={(e) => autoSaveField("interactionPolicy", e.target.value)}
              placeholder="Contoh: Tanya kembali jika ada lebih dari satu interpretasi. Jangan bertanya lebih dari 2 hal sekaligus…"
              rows={2}
              data-testid="textarea-interaction-policy"
            />
          </div>

          <div className="border-t pt-4 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-500" />
                Domain Charter
              </Label>
              <p className="text-xs text-muted-foreground">Topik dan tindakan yang boleh dan tidak boleh dilakukan agen.</p>
              <Textarea
                value={formData.domainCharter}
                onChange={(e) => setFormData({ ...formData, domainCharter: e.target.value })}
                onBlur={(e) => autoSaveField("domainCharter", e.target.value)}
                placeholder="Contoh: Agen HANYA membahas topik konstruksi dan teknik sipil. Dilarang memberikan saran medis atau hukum. Dilarang membuat kontrak yang mengikat secara hukum…"
                rows={3}
                data-testid="textarea-domain-charter"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Standar Kualitas (Quality Bar)</Label>
              <p className="text-xs text-muted-foreground">Standar minimum kualitas jawaban yang harus dipenuhi.</p>
              <Textarea
                value={formData.qualityBar}
                onChange={(e) => setFormData({ ...formData, qualityBar: e.target.value })}
                onBlur={(e) => autoSaveField("qualityBar", e.target.value)}
                placeholder="Contoh: Setiap jawaban harus menyertakan referensi standar (SNI/PUPR). Jangan memberikan angka tanpa konteks. Jawaban > 3 paragraf wajib ada ringkasan…"
                rows={2}
                data-testid="textarea-quality-bar"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                Kepatuhan & Risiko
              </Label>
              <p className="text-xs text-muted-foreground">Aturan regulasi, disclaimer wajib, dan batasan risiko.</p>
              <Textarea
                value={formData.riskCompliance}
                onChange={(e) => setFormData({ ...formData, riskCompliance: e.target.value })}
                onBlur={(e) => autoSaveField("riskCompliance", e.target.value)}
                placeholder="Contoh: Tambahkan disclaimer 'Konsultasikan dengan ahli bersertifikat' untuk semua saran struktural. Patuhi UU ITE. Jangan simpan data sensitif pengguna…"
                rows={3}
                data-testid="textarea-risk-compliance"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col" data-testid="dialog-preview-prompt">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-500" />
              Pratinjau Prompt AI Final
            </DialogTitle>
            <DialogDescription>
              Hasil perakitan PERSONA + 7 field Kebijakan Agen yang dikirim ke model. Knowledge Base, Project Brain, dan memori user ditambahkan saat runtime chat.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between gap-2 border-b pb-3">
            <div className="text-xs text-muted-foreground">
              {previewPrompt ? (
                <span data-testid="text-preview-length">
                  {previewPrompt.length.toLocaleString("id-ID")} karakter • {previewSections.length} section
                </span>
              ) : (
                <span>Memuat prompt akhir…</span>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyPreview}
              disabled={!previewPrompt || previewLoading}
              className="gap-2"
              data-testid="button-copy-preview"
            >
              {copiedPreview ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Salin
                </>
              )}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 -mr-1">
            {previewLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2" data-testid="status-preview-loading">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memuat prompt akhir…</span>
              </div>
            ) : previewError ? (
              <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-800 p-4 text-sm text-red-800 dark:text-red-200" data-testid="status-preview-error">
                <div className="font-medium mb-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Gagal memuat pratinjau
                </div>
                <div className="text-xs opacity-90">{previewError}</div>
              </div>
            ) : previewSections.length > 0 ? (
              <div className="space-y-4 py-2">
                {previewSections.map((section, idx) => (
                  <div
                    key={`${section.label}-${idx}`}
                    className="rounded-md border overflow-hidden"
                    data-testid={`section-preview-${section.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    <div className={`px-3 py-2 text-xs font-semibold tracking-wide border-b ${section.className}`}>
                      {section.label}
                    </div>
                    <pre className="px-3 py-3 text-xs whitespace-pre-wrap font-mono leading-relaxed bg-muted/30">
                      {section.body || "(kosong)"}
                    </pre>
                  </div>
                ))}
              </div>
            ) : previewPrompt ? (
              <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed p-3 bg-muted/30 rounded-md" data-testid="text-preview-raw">
                {previewPrompt}
              </pre>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground" data-testid="status-preview-empty">
                Belum ada konten untuk ditampilkan.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
