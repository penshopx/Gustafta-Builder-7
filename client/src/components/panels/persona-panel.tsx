import { useState, useEffect, useRef } from "react";
import { Bot, Save, Sparkles, MessageCircle, AlertCircle, Globe, Key, Shield, Plus, X, Briefcase, Cpu, Settings2, Eye, EyeOff, Camera, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUpdateAgent } from "@/hooks/use-agents";
import { getCategoryById, getSubcategoryLabel } from "@/lib/categories";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Agent } from "@shared/schema";

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
  });

  const [newStarter, setNewStarter] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
    });
  }, [agent]);

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
      
      const res = await fetch("/api/knowledge-base/upload", {
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
            AI Model Configuration
          </CardTitle>
          <CardDescription>Select which AI model powers your chatbot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aiModel">AI Model</Label>
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
          <CardTitle className="text-lg">Model Parameters</CardTitle>
          <CardDescription>Fine-tune the AI model behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature: {formData.temperature.toFixed(1)}</Label>
              <span className="text-xs text-muted-foreground">
                {formData.temperature < 0.5 ? "More focused" : formData.temperature > 1 ? "More creative" : "Balanced"}
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
              <Label htmlFor="maxTokens">Max Tokens: {formData.maxTokens}</Label>
              <span className="text-xs text-muted-foreground">
                Response length limit
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
            Access Control & Security
          </CardTitle>
          <CardDescription>Control who can access your chatbot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isPublic">Public Access</Label>
              <p className="text-xs text-muted-foreground">
                Allow anyone to access this chatbot without authentication
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
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Token ini digunakan untuk mengautentikasi permintaan API ke chatbot Anda. 
              Gunakan saat menyematkan chatbot di website Anda atau mengintegrasikan dengan aplikasi eksternal (WhatsApp, Telegram, dll).
            </p>
          </div>

          <div className="space-y-2">
            <Label>Allowed Domains</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Restrict web widget access to specific domains (leave empty for all domains)
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
    </div>
  );
}
