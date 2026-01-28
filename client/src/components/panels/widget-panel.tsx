import { useState, useEffect } from "react";
import { Palette, Move, Maximize, Square, Eye, MessageCircle, Bot, HelpCircle, MessageSquare, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Agent } from "@shared/schema";

interface WidgetPanelProps {
  agent: Agent;
}

const positionOptions = [
  { value: "bottom-right", label: "Kanan Bawah" },
  { value: "bottom-left", label: "Kiri Bawah" },
  { value: "top-right", label: "Kanan Atas" },
  { value: "top-left", label: "Kiri Atas" },
];

const sizeOptions = [
  { value: "small", label: "Kecil" },
  { value: "medium", label: "Sedang" },
  { value: "large", label: "Besar" },
];

const borderRadiusOptions = [
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Kotak" },
  { value: "pill", label: "Pill" },
];

const iconOptions = [
  { value: "chat", label: "Chat", icon: MessageCircle },
  { value: "message", label: "Message", icon: MessageSquare },
  { value: "bot", label: "Bot", icon: Bot },
  { value: "help", label: "Help", icon: HelpCircle },
];

const colorPresets = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", 
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6", "#1e293b", "#0f172a"
];

export function WidgetPanel({ agent }: WidgetPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  
  const [settings, setSettings] = useState({
    widgetColor: agent.widgetColor || "#6366f1",
    widgetPosition: agent.widgetPosition || "bottom-right",
    widgetSize: agent.widgetSize || "medium",
    widgetBorderRadius: agent.widgetBorderRadius || "rounded",
    widgetShowBranding: agent.widgetShowBranding ?? true,
    widgetWelcomeMessage: agent.widgetWelcomeMessage || "",
    widgetButtonIcon: agent.widgetButtonIcon || "chat",
  });

  useEffect(() => {
    setSettings({
      widgetColor: agent.widgetColor || "#6366f1",
      widgetPosition: agent.widgetPosition || "bottom-right",
      widgetSize: agent.widgetSize || "medium",
      widgetBorderRadius: agent.widgetBorderRadius || "rounded",
      widgetShowBranding: agent.widgetShowBranding ?? true,
      widgetWelcomeMessage: agent.widgetWelcomeMessage || "",
      widgetButtonIcon: agent.widgetButtonIcon || "chat",
    });
  }, [agent]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof settings) => {
      const response = await apiRequest("PATCH", `/api/agents/${agent.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Berhasil",
        description: "Pengaturan widget berhasil disimpan",
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal menyimpan pengaturan widget",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(settings);
  };

  const getBaseUrl = () => window.location.origin;

  const generateEmbedCode = () => {
    const sizeMap = { small: "350", medium: "400", large: "450" };
    const borderMap = { rounded: "16", square: "0", pill: "24" };
    const positionMap = {
      "bottom-right": "bottom: 20px; right: 20px;",
      "bottom-left": "bottom: 20px; left: 20px;",
      "top-right": "top: 20px; right: 20px;",
      "top-left": "top: 20px; left: 20px;",
    };
    const iconMap = {
      chat: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`,
      message: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      bot: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`,
      help: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,
    };

    return `<!-- Gustafta Chat Widget -->
<script>
(function() {
  var config = {
    agentId: "${agent.id}",
    apiUrl: "${getBaseUrl()}/api/embed-chat",
    color: "${settings.widgetColor}",
    position: "${settings.widgetPosition}",
    size: "${sizeMap[settings.widgetSize as keyof typeof sizeMap]}",
    borderRadius: "${borderMap[settings.widgetBorderRadius as keyof typeof borderMap]}",
    showBranding: ${settings.widgetShowBranding},
    welcomeMessage: "${settings.widgetWelcomeMessage || agent.greetingMessage || "Halo! Ada yang bisa saya bantu?"}",
    agentName: "${agent.name}",
    agentAvatar: "${agent.avatar || ""}"
  };
  
  var style = document.createElement('style');
  style.textContent = \`
    #gustafta-widget-container { position: fixed; ${positionMap[settings.widgetPosition as keyof typeof positionMap]} z-index: 9999; font-family: system-ui, -apple-system, sans-serif; }
    #gustafta-widget-btn { width: 56px; height: 56px; border-radius: 50%; background: \${config.color}; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s, box-shadow 0.2s; }
    #gustafta-widget-btn:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
    #gustafta-chat-frame { display: none; position: absolute; ${settings.widgetPosition.includes("bottom") ? "bottom: 70px;" : "top: 70px;"} ${settings.widgetPosition.includes("right") ? "right: 0;" : "left: 0;"} width: \${config.size}px; height: 500px; border: none; border-radius: \${config.borderRadius}px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); background: white; overflow: hidden; }
    #gustafta-chat-frame.open { display: block; animation: gustafta-slide-in 0.3s ease; }
    @keyframes gustafta-slide-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  \`;
  document.head.appendChild(style);
  
  var container = document.createElement('div');
  container.id = 'gustafta-widget-container';
  container.innerHTML = \`
    <iframe id="gustafta-chat-frame" src="\${config.apiUrl}/\${config.agentId}?color=\${encodeURIComponent(config.color)}&name=\${encodeURIComponent(config.agentName)}&avatar=\${encodeURIComponent(config.agentAvatar)}&welcome=\${encodeURIComponent(config.welcomeMessage)}&branding=\${config.showBranding}"></iframe>
    <button id="gustafta-widget-btn" aria-label="Chat">${iconMap[settings.widgetButtonIcon as keyof typeof iconMap]}</button>
  \`;
  document.body.appendChild(container);
  
  var btn = document.getElementById('gustafta-widget-btn');
  var frame = document.getElementById('gustafta-chat-frame');
  btn.onclick = function() { frame.classList.toggle('open'); };
})();
</script>
<!-- End Gustafta Chat Widget -->`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Disalin!",
      description: "Kode embed berhasil disalin ke clipboard",
    });
  };

  const IconComponent = iconOptions.find(i => i.value === settings.widgetButtonIcon)?.icon || MessageCircle;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Palette className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-widget-title">Widget Customization</h2>
          <p className="text-muted-foreground">Sesuaikan tampilan chat widget</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Warna & Tampilan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Warna Utama</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={settings.widgetColor}
                    onChange={(e) => setSettings({ ...settings, widgetColor: e.target.value })}
                    className="w-12 h-9 p-1 cursor-pointer"
                    data-testid="input-widget-color"
                  />
                  <Input
                    value={settings.widgetColor}
                    onChange={(e) => setSettings({ ...settings, widgetColor: e.target.value })}
                    className="flex-1"
                    placeholder="#6366f1"
                    data-testid="input-widget-color-hex"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-transparent hover:border-foreground/30 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => setSettings({ ...settings, widgetColor: color })}
                      data-testid={`button-color-${color.replace("#", "")}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ikon Tombol</Label>
                <Select
                  value={settings.widgetButtonIcon}
                  onValueChange={(v) => setSettings({ ...settings, widgetButtonIcon: v })}
                >
                  <SelectTrigger data-testid="select-widget-icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} data-testid={`icon-option-${opt.value}`}>
                        <div className="flex items-center gap-2">
                          <opt.icon className="w-4 h-4" />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bentuk Sudut</Label>
                <Select
                  value={settings.widgetBorderRadius}
                  onValueChange={(v) => setSettings({ ...settings, widgetBorderRadius: v })}
                >
                  <SelectTrigger data-testid="select-widget-radius">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} data-testid={`radius-option-${opt.value}`}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Move className="w-4 h-4" />
                Posisi & Ukuran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Posisi Widget</Label>
                <Select
                  value={settings.widgetPosition}
                  onValueChange={(v) => setSettings({ ...settings, widgetPosition: v })}
                >
                  <SelectTrigger data-testid="select-widget-position">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positionOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} data-testid={`position-option-${opt.value}`}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ukuran Chat Window</Label>
                <Select
                  value={settings.widgetSize}
                  onValueChange={(v) => setSettings({ ...settings, widgetSize: v })}
                >
                  <SelectTrigger data-testid="select-widget-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} data-testid={`size-option-${opt.value}`}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Pesan & Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pesan Selamat Datang (opsional)</Label>
                <Textarea
                  value={settings.widgetWelcomeMessage}
                  onChange={(e) => setSettings({ ...settings, widgetWelcomeMessage: e.target.value })}
                  placeholder="Halo! Ada yang bisa saya bantu hari ini?"
                  rows={2}
                  data-testid="input-widget-welcome"
                />
                <p className="text-xs text-muted-foreground">
                  Kosongkan untuk menggunakan greeting message dari persona
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tampilkan Branding</Label>
                  <p className="text-xs text-muted-foreground">Powered by Gustafta</p>
                </div>
                <Switch
                  checked={settings.widgetShowBranding}
                  onCheckedChange={(v) => setSettings({ ...settings, widgetShowBranding: v })}
                  data-testid="switch-widget-branding"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full" disabled={updateMutation.isPending} data-testid="button-save-widget">
            {updateMutation.isPending ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview Widget
              </CardTitle>
              <CardDescription>Tampilan widget di website Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg h-80 overflow-hidden">
                <div className="absolute inset-4 bg-background/80 rounded-lg backdrop-blur-sm border">
                  <div className="p-4 text-sm text-muted-foreground">
                    <div className="h-2 w-24 bg-muted rounded mb-2" />
                    <div className="h-2 w-full bg-muted rounded mb-2" />
                    <div className="h-2 w-3/4 bg-muted rounded" />
                  </div>
                </div>
                
                <div
                  className="absolute flex items-center justify-center w-14 h-14 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105"
                  style={{
                    backgroundColor: settings.widgetColor,
                    ...(settings.widgetPosition === "bottom-right" ? { bottom: 16, right: 16 } : {}),
                    ...(settings.widgetPosition === "bottom-left" ? { bottom: 16, left: 16 } : {}),
                    ...(settings.widgetPosition === "top-right" ? { top: 16, right: 16 } : {}),
                    ...(settings.widgetPosition === "top-left" ? { top: 16, left: 16 } : {}),
                  }}
                  data-testid="preview-widget-button"
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kode Embed</CardTitle>
              <CardDescription>Salin dan tempel kode ini di website Anda sebelum tag &lt;/body&gt;</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="p-4 rounded-lg bg-muted text-xs overflow-x-auto max-h-64">
                  <code>{generateEmbedCode()}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={copyEmbedCode}
                  data-testid="button-copy-embed"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
