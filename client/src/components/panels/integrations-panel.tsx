import { useState } from "react";
import { Plug, MessageCircle, Send, Hash, Slack, Globe, Code, Check, X, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useIntegrations, useCreateIntegration, useUpdateIntegration } from "@/hooks/use-integrations";
import { SiWhatsapp, SiTelegram, SiDiscord, SiSlack } from "react-icons/si";
import type { Agent, Integration } from "@shared/schema";

interface IntegrationsPanelProps {
  agent: Agent;
}

const integrationTypes = [
  {
    type: "whatsapp" as const,
    name: "WhatsApp",
    description: "Connect to WhatsApp Business API",
    icon: SiWhatsapp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    type: "telegram" as const,
    name: "Telegram",
    description: "Deploy as a Telegram bot",
    icon: SiTelegram,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    type: "discord" as const,
    name: "Discord",
    description: "Add to Discord servers",
    icon: SiDiscord,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
  },
  {
    type: "slack" as const,
    name: "Slack",
    description: "Integrate with Slack workspaces",
    icon: SiSlack,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    type: "web" as const,
    name: "Web Widget",
    description: "Embed on your website",
    icon: Globe,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    type: "api" as const,
    name: "REST API",
    description: "Custom API integration",
    icon: Code,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export function IntegrationsPanel({ agent }: IntegrationsPanelProps) {
  const { toast } = useToast();
  const { data: integrations = [], isLoading } = useIntegrations(agent.id);
  const createIntegration = useCreateIntegration();
  const updateIntegration = useUpdateIntegration();

  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrationTypes[0] | null>(null);
  const [configData, setConfigData] = useState<Record<string, string>>({});

  const getIntegration = (type: string): Integration | undefined => {
    return integrations.find((i) => i.type === type);
  };

  const handleToggle = async (type: typeof integrationTypes[0]["type"], enabled: boolean) => {
    const existing = getIntegration(type);

    if (existing) {
      updateIntegration.mutate({
        id: existing.id,
        agentId: agent.id,
        data: { isEnabled: enabled },
      });
    } else if (enabled) {
      const integrationInfo = integrationTypes.find((i) => i.type === type);
      createIntegration.mutate({
        agentId: agent.id,
        type,
        name: integrationInfo?.name || type,
        isEnabled: true,
        config: {},
      });
    }

    toast({
      title: enabled ? "Integration Enabled" : "Integration Disabled",
      description: `${integrationTypes.find((i) => i.type === type)?.name} has been ${enabled ? "enabled" : "disabled"}.`,
    });
  };

  const openConfig = (integration: typeof integrationTypes[0]) => {
    setSelectedIntegration(integration);
    const existing = getIntegration(integration.type);
    setConfigData(existing?.config || {});
    setConfigDialogOpen(true);
  };

  const saveConfig = () => {
    if (!selectedIntegration) return;

    const existing = getIntegration(selectedIntegration.type);
    if (existing) {
      updateIntegration.mutate({
        id: existing.id,
        agentId: agent.id,
        data: { config: configData },
      });
    }

    toast({
      title: "Configuration Saved",
      description: `${selectedIntegration.name} settings have been updated.`,
    });
    setConfigDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Plug className="w-6 h-6 text-primary" />
          Integrations
        </h2>
        <p className="text-muted-foreground mt-1">
          Connect your chatbot to messaging platforms and services
        </p>
      </div>

      {/* Active Integrations Summary */}
      {integrations.filter((i) => i.isEnabled).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {integrations
                .filter((i) => i.isEnabled)
                .map((integration) => {
                  const info = integrationTypes.find((t) => t.type === integration.type);
                  if (!info) return null;
                  return (
                    <Badge key={integration.id} variant="secondary" className="gap-1.5 py-1">
                      <info.icon className={`w-3.5 h-3.5 ${info.color}`} />
                      {info.name}
                      <Check className="w-3 h-3 text-green-500" />
                    </Badge>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {integrationTypes.map((integration) => {
          const existing = getIntegration(integration.type);
          const isEnabled = existing?.isEnabled || false;

          return (
            <Card
              key={integration.type}
              className={isEnabled ? "ring-1 ring-primary/20" : ""}
              data-testid={`integration-${integration.type}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${integration.bgColor} flex items-center justify-center shrink-0`}>
                    <integration.icon className={`w-6 h-6 ${integration.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium">{integration.name}</h3>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) => handleToggle(integration.type, checked)}
                        data-testid={`switch-${integration.type}`}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {integration.description}
                    </p>
                    {isEnabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 -ml-2"
                        onClick={() => openConfig(integration)}
                        data-testid={`button-config-${integration.type}`}
                      >
                        <Settings className="w-3.5 h-3.5 mr-1.5" />
                        Configure
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Web Widget Embed Code */}
      {getIntegration("web")?.isEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Web Widget Embed Code</CardTitle>
            <CardDescription>Copy this code to embed the chatbot on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <code className="text-muted-foreground">
                {`<script src="https://gustafta.com/widget.js" data-agent-id="${agent.id}"></script>`}
              </code>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                navigator.clipboard.writeText(
                  `<script src="https://gustafta.com/widget.js" data-agent-id="${agent.id}"></script>`
                );
                toast({ title: "Copied!", description: "Embed code copied to clipboard." });
              }}
              data-testid="button-copy-embed"
            >
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* API Credentials */}
      {getIntegration("api")?.isEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">API Credentials</CardTitle>
            <CardDescription>Use these credentials to access the REST API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Endpoint</Label>
              <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                https://api.gustafta.com/v1/agents/{agent.id}/chat
              </div>
            </div>
            <div className="space-y-2">
              <Label>Agent ID</Label>
              <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                {agent.id}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedIntegration && (
                <>
                  <selectedIntegration.icon className={`w-5 h-5 ${selectedIntegration.color}`} />
                  {selectedIntegration.name} Configuration
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Configure the settings for this integration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedIntegration?.type === "whatsapp" && (
              <>
                <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground mb-2">
                  <p className="font-medium text-foreground mb-1">Cara Menghubungkan WhatsApp:</p>
                  <p>Masukkan token API dari layanan WhatsApp Anda (Multichat, WATI, Twilio, dll). 
                  Token ini biasanya ditemukan di halaman "API Access" atau "Generate Token" di dashboard layanan Anda.</p>
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL (untuk layanan eksternal)</Label>
                  <div className="bg-muted rounded-lg p-3 font-mono text-sm break-all">
                    {`https://api.gustafta.com/webhook/whatsapp/${agent.id}`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Salin URL ini dan masukkan sebagai Webhook di dashboard Multichat/layanan WhatsApp Anda
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>API Token dari Layanan WhatsApp</Label>
                  <Input
                    type="password"
                    value={configData.accessToken || ""}
                    onChange={(e) => setConfigData({ ...configData, accessToken: e.target.value })}
                    placeholder="Contoh: eyJhbGciOiJIUzI1NiIs... (dari Multichat/layanan lain)"
                    data-testid="input-whatsapp-token"
                  />
                  <p className="text-xs text-muted-foreground">
                    Token ini dari layanan WhatsApp eksternal Anda (bukan Access Token Gustafta)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number ID (Opsional)</Label>
                  <Input
                    value={configData.phoneNumberId || ""}
                    onChange={(e) => setConfigData({ ...configData, phoneNumberId: e.target.value })}
                    placeholder="Masukkan Phone Number ID jika diperlukan"
                  />
                </div>
              </>
            )}
            {selectedIntegration?.type === "telegram" && (
              <>
                <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground mb-2">
                  <p className="font-medium text-foreground mb-1">Cara Mendapatkan Bot Token:</p>
                  <p>Buka @BotFather di Telegram, buat bot baru dengan /newbot, lalu salin token yang diberikan.</p>
                </div>
                <div className="space-y-2">
                  <Label>Bot Token dari Telegram</Label>
                  <Input
                    type="password"
                    value={configData.botToken || ""}
                    onChange={(e) => setConfigData({ ...configData, botToken: e.target.value })}
                    placeholder="Contoh: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    data-testid="input-telegram-token"
                  />
                  <p className="text-xs text-muted-foreground">
                    Token ini diberikan oleh @BotFather saat Anda membuat bot Telegram
                  </p>
                </div>
              </>
            )}
            {selectedIntegration?.type === "discord" && (
              <div className="space-y-2">
                <Label>Bot Token</Label>
                <Input
                  type="password"
                  value={configData.botToken || ""}
                  onChange={(e) => setConfigData({ ...configData, botToken: e.target.value })}
                  placeholder="Enter your Discord Bot Token"
                />
              </div>
            )}
            {selectedIntegration?.type === "slack" && (
              <>
                <div className="space-y-2">
                  <Label>Bot Token</Label>
                  <Input
                    type="password"
                    value={configData.botToken || ""}
                    onChange={(e) => setConfigData({ ...configData, botToken: e.target.value })}
                    placeholder="xoxb-..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Signing Secret</Label>
                  <Input
                    type="password"
                    value={configData.signingSecret || ""}
                    onChange={(e) => setConfigData({ ...configData, signingSecret: e.target.value })}
                    placeholder="Enter your Slack Signing Secret"
                  />
                </div>
              </>
            )}
            {(selectedIntegration?.type === "web" || selectedIntegration?.type === "api") && (
              <div className="text-sm text-muted-foreground text-center py-4">
                No additional configuration required for this integration.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveConfig}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
