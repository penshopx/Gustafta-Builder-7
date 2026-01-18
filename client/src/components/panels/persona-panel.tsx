import { useState, useEffect } from "react";
import { Bot, Save, Sparkles, MessageCircle, AlertCircle, Globe, Key, Shield, Plus, X, Briefcase } from "lucide-react";
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

export function PersonaPanel({ agent }: PersonaPanelProps) {
  const { toast } = useToast();
  const updateAgent = useUpdateAgent();

  const [formData, setFormData] = useState({
    name: agent.name,
    description: agent.description,
    tagline: agent.tagline,
    philosophy: agent.philosophy,
    offTopicHandling: agent.offTopicHandling,
    systemPrompt: agent.systemPrompt,
    temperature: agent.temperature,
    maxTokens: agent.maxTokens,
    greetingMessage: agent.greetingMessage || "",
    conversationStarters: agent.conversationStarters || [],
    language: agent.language || "id",
    isPublic: agent.isPublic || false,
    allowedDomains: agent.allowedDomains || [],
  });

  const [newStarter, setNewStarter] = useState("");
  const [newDomain, setNewDomain] = useState("");

  useEffect(() => {
    setFormData({
      name: agent.name,
      description: agent.description,
      tagline: agent.tagline,
      philosophy: agent.philosophy,
      offTopicHandling: agent.offTopicHandling,
      systemPrompt: agent.systemPrompt,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      greetingMessage: agent.greetingMessage || "",
      conversationStarters: agent.conversationStarters || [],
      language: agent.language || "id",
      isPublic: agent.isPublic || false,
      allowedDomains: agent.allowedDomains || [],
    });
  }, [agent]);

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

  const addConversationStarter = () => {
    if (newStarter.trim() && formData.conversationStarters.length < 5) {
      setFormData({
        ...formData,
        conversationStarters: [...formData.conversationStarters, newStarter.trim()],
      });
      setNewStarter("");
    }
  };

  const removeConversationStarter = (index: number) => {
    setFormData({
      ...formData,
      conversationStarters: formData.conversationStarters.filter((_, i) => i !== index),
    });
  };

  const addAllowedDomain = () => {
    if (newDomain.trim() && formData.allowedDomains.length < 10) {
      setFormData({
        ...formData,
        allowedDomains: [...formData.allowedDomains, newDomain.trim()],
      });
      setNewDomain("");
    }
  };

  const removeAllowedDomain = (index: number) => {
    setFormData({
      ...formData,
      allowedDomains: formData.allowedDomains.filter((_, i) => i !== index),
    });
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
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            Persona Configuration
          </h2>
          <p className="text-muted-foreground mt-1">
            Define your chatbot's personality, behavior, and response style
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateAgent.isPending}
          data-testid="button-save-persona"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateAgent.isPending ? "Saving..." : "Save Changes"}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Chatbot Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Assistant"
                data-testid="input-agent-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Your helpful AI companion"
                data-testid="input-agent-tagline"
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
              data-testid="input-agent-description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Primary Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger id="language" data-testid="select-language">
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
              data-testid="input-greeting-message"
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
                    data-testid={`button-remove-starter-${index}`}
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
                  data-testid="input-new-starter"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addConversationStarter}
                  disabled={!newStarter.trim()}
                  data-testid="button-add-starter"
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
              data-testid="input-agent-philosophy"
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
              data-testid="input-agent-system-prompt"
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
          <CardDescription>How your chatbot responds to irrelevant questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offTopicHandling">Response Strategy</Label>
            <Select
              value={formData.offTopicHandling}
              onValueChange={(value) => setFormData({ ...formData, offTopicHandling: value })}
            >
              <SelectTrigger id="offTopicHandling" data-testid="select-off-topic-handling">
                <SelectValue placeholder="Select a strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="politely_redirect">Politely Redirect</SelectItem>
                <SelectItem value="acknowledge_and_decline">Acknowledge and Decline</SelectItem>
                <SelectItem value="attempt_to_help">Attempt to Help Anyway</SelectItem>
                <SelectItem value="strict_boundaries">Strict Boundaries</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Determines how the chatbot handles questions outside its intended scope
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Model Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Model Settings</CardTitle>
          <CardDescription>Fine-tune the AI model parameters</CardDescription>
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
              data-testid="slider-temperature"
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
              data-testid="slider-max-tokens"
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
              data-testid="switch-is-public"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Access Token
            </Label>
            <div className="flex gap-2">
              <Input
                value={agent.accessToken || ""}
                readOnly
                className="font-mono text-sm"
                data-testid="input-access-token"
              />
              <Button variant="outline" onClick={copyAccessToken} data-testid="button-copy-token">
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this token to authenticate API requests to your chatbot
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
                    data-testid={`button-remove-domain-${index}`}
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
                  data-testid="input-new-domain"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addAllowedDomain}
                  disabled={!newDomain.trim()}
                  data-testid="button-add-domain"
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
