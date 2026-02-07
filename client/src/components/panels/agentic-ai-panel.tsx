import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useActiveAgent, useUpdateAgent } from "@/hooks/use-agents";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  Ear,
  Zap,
  GraduationCap,
  Heart,
  GitBranch,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export function AgenticAIPanel() {
  const { data: agent, isLoading } = useActiveAgent();
  const updateAgent = useUpdateAgent();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    agenticMode: false,
    attentiveListening: true,
    contextRetention: 10,
    proactiveAssistance: false,
    learningEnabled: false,
    emotionalIntelligence: true,
    multiStepReasoning: true,
    selfCorrection: true,
  });

  useEffect(() => {
    if (agent) {
      setSettings({
        agenticMode: agent.agenticMode ?? false,
        attentiveListening: agent.attentiveListening ?? true,
        contextRetention: agent.contextRetention ?? 10,
        proactiveAssistance: agent.proactiveAssistance ?? false,
        learningEnabled: agent.learningEnabled ?? false,
        emotionalIntelligence: agent.emotionalIntelligence ?? true,
        multiStepReasoning: agent.multiStepReasoning ?? true,
        selfCorrection: agent.selfCorrection ?? true,
      });
    }
  }, [agent]);

  const handleSettingChange = async (key: keyof typeof settings, value: boolean | number) => {
    if (!agent) return;

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      await updateAgent.mutateAsync({
        id: agent.id,
        data: { [key]: value },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive",
      });
      setSettings(settings);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Memuat pengaturan AI...
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Pilih atau buat chatbot terlebih dahulu untuk mengatur Agentic AI.
      </div>
    );
  }

  const features = [
    {
      key: "agenticMode",
      label: "Mode Agentic",
      description: "Aktifkan kemampuan AI untuk bertindak secara mandiri dan proaktif",
      icon: <Brain className="h-5 w-5" />,
      color: "text-purple-500",
      value: settings.agenticMode,
    },
    {
      key: "attentiveListening",
      label: "Attentive Listening",
      description: "AI memperhatikan konteks percakapan dengan lebih teliti",
      icon: <Ear className="h-5 w-5" />,
      color: "text-blue-500",
      value: settings.attentiveListening,
    },
    {
      key: "proactiveAssistance",
      label: "Bantuan Proaktif",
      description: "AI memberikan saran dan bantuan tanpa diminta",
      icon: <Zap className="h-5 w-5" />,
      color: "text-yellow-500",
      value: settings.proactiveAssistance,
    },
    {
      key: "learningEnabled",
      label: "Pembelajaran Adaptif",
      description: "AI belajar dari interaksi untuk meningkatkan respons",
      icon: <GraduationCap className="h-5 w-5" />,
      color: "text-green-500",
      value: settings.learningEnabled,
    },
    {
      key: "emotionalIntelligence",
      label: "Kecerdasan Emosional",
      description: "AI mendeteksi dan merespons emosi pengguna dengan empati",
      icon: <Heart className="h-5 w-5" />,
      color: "text-red-500",
      value: settings.emotionalIntelligence,
    },
    {
      key: "multiStepReasoning",
      label: "Penalaran Multi-Langkah",
      description: "AI memecah masalah kompleks menjadi langkah-langkah terstruktur",
      icon: <GitBranch className="h-5 w-5" />,
      color: "text-orange-500",
      value: settings.multiStepReasoning,
    },
    {
      key: "selfCorrection",
      label: "Koreksi Mandiri",
      description: "AI mendeteksi dan memperbaiki kesalahannya sendiri",
      icon: <RotateCcw className="h-5 w-5" />,
      color: "text-cyan-500",
      value: settings.selfCorrection,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Attentive Agentic AI
        </h2>
        <p className="text-muted-foreground mt-1">
          Konfigurasikan kemampuan AI untuk chatbot yang lebih cerdas dan responsif
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Mode Agentic
                {settings.agenticMode && (
                  <Badge variant="default" className="bg-purple-500">Aktif</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Mengaktifkan semua kemampuan Agentic AI tingkat lanjut
              </CardDescription>
            </div>
            <Switch
              checked={settings.agenticMode}
              onCheckedChange={(checked) => handleSettingChange("agenticMode", checked)}
             
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {features.slice(1).map((feature) => (
          <Card key={feature.key}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className={feature.color}>{feature.icon}</span>
                  <div>
                    <Label className="font-medium">{feature.label}</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={feature.value}
                  onCheckedChange={(checked) =>
                    handleSettingChange(feature.key as keyof typeof settings, checked)
                  }
                 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retensi Konteks</CardTitle>
          <CardDescription>
            Jumlah pesan sebelumnya yang diingat AI dalam percakapan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {settings.contextRetention} pesan
              </span>
              <Badge variant="secondary">
                {settings.contextRetention <= 5
                  ? "Minimal"
                  : settings.contextRetention <= 15
                  ? "Normal"
                  : settings.contextRetention <= 30
                  ? "Tinggi"
                  : "Maksimal"}
              </Badge>
            </div>
            <Slider
              value={[settings.contextRetention]}
              onValueChange={([value]) => handleSettingChange("contextRetention", value)}
              min={1}
              max={50}
              step={1}
             
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 pesan</span>
              <span>50 pesan</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold">Tentang Attentive Agentic AI</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Fitur Attentive Agentic AI memungkinkan chatbot Anda untuk:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>Memahami konteks percakapan dengan lebih mendalam</li>
                <li>Memberikan respons yang lebih personal dan empatik</li>
                <li>Mengambil inisiatif untuk membantu pengguna</li>
                <li>Belajar dari setiap interaksi untuk meningkatkan kualitas</li>
                <li>Memecahkan masalah kompleks dengan penalaran terstruktur</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
