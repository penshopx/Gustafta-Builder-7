import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useActiveAgent, useUpdateAgent } from "@/hooks/use-agents";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  Ear,
  Zap,
  GraduationCap,
  RotateCcw,
  Sparkles,
  Settings2,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Shield,
  ShieldCheck,
  ShieldX,
  MessageSquare,
  Target,
  Layers,
  HelpCircle,
  RefreshCcw,
  Network,
  Lock,
  Activity,
  Bell,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Settings = {
  agenticMode: boolean;
  attentiveListening: boolean;
  contextRetention: number;
  selfCorrection: boolean;
  multiStepReasoning: boolean;
  behaviorPreset: string;
  autonomyLevel: string;
  responseDepth: string;
  outputFormat: string;
  clarifyBeforeAnswer: boolean;
  uncertaintyHandling: string;
  showRiskWarnings: boolean;
  contextPriority: string[];
  proactiveAssistanceLevel: string;
  proactiveHelpTypes: string[];
  interactionStyle: string;
  contextualEmpathy: string;
  actionBoundary: string[];
  escalationRules: string[];
  offTopicBehavior: string;
  adaptiveLearningMode: string;
  storeInteractionSignals: boolean;
  sourcePriority: string[];
  // Multi-Agent Architecture fields
  agentRole: string;
  workMode: string;
  executionGatePolicy: string;
  clarificationTriggers: string[];
  // OpenClaw Execution Engine
  openClawTrustedActions: string[];
  openClawBlockedActions: string[];
  openClawAuditLog: boolean;
  openClawNotifyOnGate: boolean;
  openClawStepTrace: boolean;
};

const PRESET_DEFAULTS: Record<string, Partial<Settings>> = {
  Balanced: {
    autonomyLevel: "Sedang",
    responseDepth: "Terstruktur",
    outputFormat: "Ringkasan + langkah",
    proactiveAssistanceLevel: "Rendah",
    clarifyBeforeAnswer: true,
    uncertaintyHandling: "Jelaskan keterbatasan",
    interactionStyle: "Konsultatif",
  },
  Learn: {
    autonomyLevel: "Pasif",
    responseDepth: "Mendalam",
    outputFormat: "Langkah demi langkah",
    proactiveAssistanceLevel: "Sedang",
    clarifyBeforeAnswer: true,
    uncertaintyHandling: "Minta klarifikasi",
    interactionStyle: "Mentor",
  },
  Mentor: {
    autonomyLevel: "Sedang",
    responseDepth: "Mendalam",
    outputFormat: "Poin-poin",
    proactiveAssistanceLevel: "Sedang",
    clarifyBeforeAnswer: true,
    uncertaintyHandling: "Jelaskan keterbatasan",
    interactionStyle: "Mentor",
  },
  Solve: {
    autonomyLevel: "Tinggi",
    responseDepth: "Terstruktur",
    outputFormat: "Langkah demi langkah",
    proactiveAssistanceLevel: "Rendah",
    clarifyBeforeAnswer: false,
    uncertaintyHandling: "Jawab normal",
    interactionStyle: "Formal",
  },
  Expert: {
    autonomyLevel: "Tinggi",
    responseDepth: "Mendalam",
    outputFormat: "Poin-poin",
    proactiveAssistanceLevel: "Off",
    clarifyBeforeAnswer: false,
    uncertaintyHandling: "Jawab normal",
    interactionStyle: "Formal",
  },
  "Brain Project": {
    autonomyLevel: "Tinggi",
    responseDepth: "Mendalam",
    outputFormat: "Checklist",
    proactiveAssistanceLevel: "Tinggi",
    clarifyBeforeAnswer: true,
    uncertaintyHandling: "Sarankan verifikasi ke sumber resmi",
    interactionStyle: "Konsultatif",
  },
  Compliance: {
    autonomyLevel: "Terbatas",
    responseDepth: "Mendalam",
    outputFormat: "Poin-poin",
    proactiveAssistanceLevel: "Rendah",
    clarifyBeforeAnswer: true,
    uncertaintyHandling: "Sarankan verifikasi ke sumber resmi",
    interactionStyle: "Formal",
  },
};

const DEFAULT_SETTINGS: Settings = {
  agenticMode: true,
  attentiveListening: true,
  contextRetention: 10,
  selfCorrection: true,
  multiStepReasoning: true,
  behaviorPreset: "Balanced",
  autonomyLevel: "Terbatas",
  responseDepth: "Terstruktur",
  outputFormat: "Ringkasan + langkah",
  clarifyBeforeAnswer: true,
  uncertaintyHandling: "Sarankan verifikasi ke sumber resmi",
  showRiskWarnings: true,
  contextPriority: ["Pertanyaan terakhir", "Tujuan pengguna", "Riwayat percakapan"],
  proactiveAssistanceLevel: "Rendah",
  proactiveHelpTypes: ["Saran langkah berikutnya", "Pertanyaan klarifikasi", "Checklist"],
  interactionStyle: "Konsultatif",
  contextualEmpathy: "Ringan",
  actionBoundary: ["Hanya menjawab", "Boleh bertanya balik", "Boleh menyarankan"],
  escalationRules: ["Arahkan ke sumber resmi", "Tampilkan disclaimer"],
  offTopicBehavior: "Jawab singkat lalu arahkan kembali",
  adaptiveLearningMode: "Off",
  storeInteractionSignals: false,
  sourcePriority: ["System Prompt", "Knowledge Engine", "Riwayat percakapan", "Mini Apps", "Integrations", "Sumber eksternal"],
  agentRole: "Standalone",
  workMode: "Answer Mode",
  executionGatePolicy: "Konfirmasi untuk write",
  clarificationTriggers: ["Output target tidak jelas", "Risiko salah tinggi", "Butuh data spesifik untuk eksekusi"],
};

function MultiSelectField({
  label,
  helper,
  options,
  value,
  onChange,
  dataTestId,
  disabled,
}: {
  label: string;
  helper: string;
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
  dataTestId?: string;
  disabled?: boolean;
}) {
  const toggle = (opt: string) => {
    if (disabled) return;
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };
  return (
    <div className={`space-y-2 ${disabled ? "opacity-40 pointer-events-none select-none" : ""}`}>
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{helper}</p>
      </div>
      <div className="space-y-2" data-testid={dataTestId}>
        {options.map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <Checkbox
              id={`${dataTestId}-${opt}`}
              checked={value.includes(opt)}
              onCheckedChange={() => toggle(opt)}
              data-testid={`checkbox-${dataTestId}-${opt}`}
            />
            <label
              htmlFor={`${dataTestId}-${opt}`}
              className="text-sm cursor-pointer"
            >
              {opt}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function SortableMultiSelect({
  label,
  helper,
  options,
  value,
  onChange,
  dataTestId,
}: {
  label: string;
  helper: string;
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
  dataTestId?: string;
}) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...value];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };
  const moveDown = (i: number) => {
    if (i === value.length - 1) return;
    const next = [...value];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  };
  const unchecked = options.filter((o) => !value.includes(o));
  return (
    <div className="space-y-2">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{helper}</p>
      </div>
      <div className="space-y-1" data-testid={dataTestId}>
        {value.map((item, i) => (
          <div
            key={item}
            className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-md px-3 py-1.5"
            data-testid={`sortable-checked-${dataTestId}-${i}`}
          >
            <Checkbox
              id={`${dataTestId}-checked-${item}`}
              checked={true}
              onCheckedChange={() => toggle(item)}
              data-testid={`checkbox-${dataTestId}-${item}`}
            />
            <span className="text-xs text-primary font-medium w-4 shrink-0">{i + 1}.</span>
            <label
              htmlFor={`${dataTestId}-checked-${item}`}
              className="text-sm flex-1 cursor-pointer"
            >
              {item}
            </label>
            <div className="flex gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                data-testid={`btn-up-${dataTestId}-${i}`}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => moveDown(i)}
                disabled={i === value.length - 1}
                data-testid={`btn-down-${dataTestId}-${i}`}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        {unchecked.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 bg-muted/30 rounded-md px-3 py-1.5"
          >
            <Checkbox
              id={`${dataTestId}-unchecked-${item}`}
              checked={false}
              onCheckedChange={() => toggle(item)}
              data-testid={`checkbox-${dataTestId}-${item}`}
            />
            <label
              htmlFor={`${dataTestId}-unchecked-${item}`}
              className="text-sm flex-1 cursor-pointer text-muted-foreground"
            >
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function SortableList({
  label,
  helper,
  items,
  onChange,
  dataTestId,
}: {
  label: string;
  helper: string;
  items: string[];
  onChange: (val: string[]) => void;
  dataTestId?: string;
}) {
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...items];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };
  const moveDown = (i: number) => {
    if (i === items.length - 1) return;
    const next = [...items];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{helper}</p>
      </div>
      <div className="space-y-1" data-testid={dataTestId}>
        {items.map((item, i) => (
          <div
            key={item}
            className="flex items-center gap-2 bg-muted/40 rounded-md px-3 py-1.5"
            data-testid={`sortable-item-${dataTestId}-${i}`}
          >
            <span className="text-xs text-muted-foreground w-4 shrink-0">{i + 1}.</span>
            <span className="text-sm flex-1">{item}</span>
            <div className="flex gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                data-testid={`btn-up-${dataTestId}-${i}`}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => moveDown(i)}
                disabled={i === items.length - 1}
                data-testid={`btn-down-${dataTestId}-${i}`}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  helper,
  value,
  onChange,
  dataTestId,
  disabled,
}: {
  label: string;
  helper: string;
  value: boolean;
  onChange: (v: boolean) => void;
  dataTestId?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 ${disabled ? "opacity-40 pointer-events-none select-none" : ""}`}>
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{helper}</p>
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        data-testid={dataTestId}
        className="shrink-0"
        disabled={disabled}
      />
    </div>
  );
}

function SelectRow({
  label,
  helper,
  value,
  onChange,
  options,
  dataTestId,
  disabled,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  dataTestId?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${disabled ? "opacity-40 pointer-events-none select-none" : ""}`}>
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{helper}</p>
      </div>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger data-testid={dataTestId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function AgenticAIPanel() {
  const { data: agent, isLoading } = useActiveAgent();
  const updateAgent = useUpdateAgent();
  const { toast } = useToast();
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (agent) {
      setSettings({
        agenticMode: (agent as any).agenticMode ?? true,
        attentiveListening: (agent as any).attentiveListening ?? true,
        contextRetention: (agent as any).contextRetention ?? 10,
        selfCorrection: (agent as any).selfCorrection ?? true,
        multiStepReasoning: (agent as any).multiStepReasoning ?? true,
        behaviorPreset: (agent as any).behaviorPreset || "Balanced",
        autonomyLevel: (agent as any).autonomyLevel || "Terbatas",
        responseDepth: (agent as any).responseDepth || "Terstruktur",
        outputFormat: (agent as any).outputFormat || "Ringkasan + langkah",
        clarifyBeforeAnswer: (agent as any).clarifyBeforeAnswer ?? true,
        uncertaintyHandling: (agent as any).uncertaintyHandling || "Sarankan verifikasi ke sumber resmi",
        showRiskWarnings: (agent as any).showRiskWarnings ?? true,
        contextPriority: (agent as any).contextPriority || ["Pertanyaan terakhir", "Tujuan pengguna", "Riwayat percakapan"],
        proactiveAssistanceLevel: (agent as any).proactiveAssistanceLevel || "Rendah",
        proactiveHelpTypes: (agent as any).proactiveHelpTypes || ["Saran langkah berikutnya", "Pertanyaan klarifikasi", "Checklist"],
        interactionStyle: (agent as any).interactionStyle || "Konsultatif",
        contextualEmpathy: (agent as any).contextualEmpathy || "Ringan",
        actionBoundary: (agent as any).actionBoundary || ["Hanya menjawab", "Boleh bertanya balik", "Boleh menyarankan"],
        escalationRules: (agent as any).escalationRules || ["Arahkan ke sumber resmi", "Tampilkan disclaimer"],
        offTopicBehavior: (agent as any).offTopicBehavior || "Jawab singkat lalu arahkan kembali",
        adaptiveLearningMode: (agent as any).adaptiveLearningMode || "Off",
        storeInteractionSignals: (agent as any).storeInteractionSignals ?? false,
        sourcePriority: (agent as any).sourcePriority || ["System Prompt", "Knowledge Engine", "Riwayat percakapan", "Mini Apps", "Integrations", "Sumber eksternal"],
        agentRole: (agent as any).agentRole || "Standalone",
        workMode: (agent as any).workMode || "Answer Mode",
        executionGatePolicy: (agent as any).executionGatePolicy || "Konfirmasi untuk write",
        clarificationTriggers: (agent as any).clarificationTriggers || ["Output target tidak jelas", "Risiko salah tinggi", "Butuh data spesifik untuk eksekusi"],
        openClawTrustedActions: (agent as any).openClawTrustedActions || ["Cari di Knowledge Base", "Hitung formula", "Ringkas dokumen", "Sarankan langkah selanjutnya"],
        openClawBlockedActions: (agent as any).openClawBlockedActions || ["Hapus data pengguna", "Kirim email massal", "Publish ke publik tanpa konfirmasi"],
        openClawAuditLog: (agent as any).openClawAuditLog ?? true,
        openClawNotifyOnGate: (agent as any).openClawNotifyOnGate ?? false,
        openClawStepTrace: (agent as any).openClawStepTrace ?? true,
      });
    }
  }, [agent]);

  const save = async (patch: Partial<Settings>) => {
    if (!agent) return;
    const prev = settings;
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      await updateAgent.mutateAsync({ id: agent.id, data: patch as any });
    } catch {
      toast({ title: "Error", description: "Gagal menyimpan pengaturan", variant: "destructive" });
      setSettings(prev);
    }
  };

  const applyPreset = (preset: string) => {
    if (preset === "Custom") {
      save({ behaviorPreset: "Custom" });
      return;
    }
    const defaults = PRESET_DEFAULTS[preset];
    if (defaults) {
      save({ behaviorPreset: preset, ...defaults });
    } else {
      save({ behaviorPreset: preset });
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Memuat pengaturan AI...</div>;
  }

  if (!agent) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Pilih atau buat chatbot terlebih dahulu untuk mengatur AI Agents.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            AI Agents
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Atur perilaku, tingkat otonomi, dan cara AI merespons.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <Label className="text-sm font-medium" data-testid="label-advanced-mode">Mode Lanjutan</Label>
            <p className="text-xs text-muted-foreground">Tampilkan pengaturan detail untuk pengguna berpengalaman.</p>
          </div>
          <Switch
            checked={isAdvanced}
            onCheckedChange={setIsAdvanced}
            data-testid="toggle-advanced-mode"
          />
        </div>
      </div>

      {/* 1. Preset Perilaku */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-indigo-500" />
            Preset Perilaku
          </CardTitle>
          <CardDescription>Pilih gaya kerja AI yang paling cocok.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select
            value={settings.behaviorPreset}
            onValueChange={applyPreset}
          >
            <SelectTrigger data-testid="select-behavior-preset">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Balanced", "Learn", "Mentor", "Solve", "Expert", "Brain Project", "Compliance", "Custom"].map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {settings.behaviorPreset !== "Custom" ? (
            <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
              <p className="text-xs text-muted-foreground">Sebagian pengaturan mengikuti preset.</p>
              {isAdvanced && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs gap-1"
                  onClick={() => applyPreset(settings.behaviorPreset)}
                  data-testid="btn-reset-preset"
                >
                  <RefreshCcw className="h-3 w-3" />
                  Reset ke Preset
                </Button>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Anda bisa mengatur detail di bagian pengaturan di bawah.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 2. Tingkat Otonomi */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="h-4 w-4 text-blue-500" />
            Tingkat Otonomi
          </CardTitle>
          <CardDescription>Seberapa aktif AI mengambil inisiatif.</CardDescription>
        </CardHeader>
        <CardContent>
          <SelectRow
            label=""
            helper=""
            value={settings.autonomyLevel}
            onChange={(v) => save({ autonomyLevel: v })}
            options={["Pasif", "Terbatas", "Sedang", "Tinggi"]}
            dataTestId="select-autonomy-level"
          />
        </CardContent>
      </Card>

      {/* 3. Mode Agentic */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <CardTitle className="text-base">Mode Agentic</CardTitle>
              {settings.agenticMode && (
                <Badge variant="default" className="bg-purple-500 text-xs">Aktif</Badge>
              )}
            </div>
            <Switch
              checked={settings.agenticMode}
              onCheckedChange={(v) => save({ agenticMode: v })}
              data-testid="toggle-agentic-mode"
            />
          </div>
          <CardDescription>Aktifkan kemampuan lanjutan (perencanaan & langkah bertahap).</CardDescription>
        </CardHeader>
        {!settings.agenticMode && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 rounded-md bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
              <p className="text-xs text-orange-700 dark:text-orange-400">Fitur lanjutan akan dibatasi.</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 3b. Peran & Mode Kerja */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="h-4 w-4 text-cyan-500" />
            Peran & Mode Kerja
          </CardTitle>
          <CardDescription>Tentukan peran agen dalam sistem multi-agent dan mode operasinya.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SelectRow
            label="Peran Agen"
            helper="Posisi agen dalam ekosistem multi-agent."
            value={settings.agentRole}
            onChange={(v) => save({ agentRole: v })}
            options={[
              "Standalone",
              "Orchestrator",
              "Spesialis: Clarifier",
              "Spesialis: Knowledge Curator",
              "Spesialis: Compliance",
              "Spesialis: Copywriter",
              "Spesialis: Data Analyst",
              "Spesialis: Executor",
            ]}
            dataTestId="select-agent-role"
          />
          <div className="border-t pt-4">
            {!settings.agenticMode && (
              <div className="mb-3 flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                <p className="text-xs text-muted-foreground">Mode Agentic OFF — hanya "Answer Mode" tersedia.</p>
              </div>
            )}
            <SelectRow
              label="Mode Kerja"
              helper="Mode operasi aktif agen saat ini."
              value={settings.agenticMode ? settings.workMode : "Answer Mode"}
              onChange={(v) => save({ workMode: v })}
              options={settings.agenticMode
                ? ["Answer Mode", "Advisor Mode", "Task Intake Mode", "Execution Mode", "Review Mode"]
                : ["Answer Mode"]
              }
              dataTestId="select-work-mode"
              disabled={!settings.agenticMode}
            />
            <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-muted-foreground">
              {[
                { mode: "Answer Mode", desc: "Jawab cepat berbasis KB." },
                { mode: "Advisor Mode", desc: "Beri opsi + tradeoff." },
                { mode: "Task Intake Mode", desc: "Kumpulkan requirement tugas." },
                { mode: "Execution Mode", desc: "Jalankan tool dan laporkan hasil." },
                { mode: "Review Mode", desc: "Verifikasi dan minta persetujuan." },
              ].map(({ mode, desc }) => (
                <div
                  key={mode}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded ${settings.workMode === mode ? "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-medium" : ""}`}
                >
                  <span className="shrink-0">·</span>
                  <span className="font-medium">{mode}:</span>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OpenClaw Execution Engine Card */}
      <Card className={`border-2 transition-colors ${settings.agenticMode ? "border-orange-400/60 dark:border-orange-600/40" : "border-border opacity-60"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-orange-500/15">
                <Shield className="h-4 w-4 text-orange-500" />
              </div>
              <CardTitle className="text-base">OpenClaw</CardTitle>
              <Badge variant="outline" className={`text-[10px] font-semibold px-1.5 py-0 ${settings.agenticMode ? "border-orange-400 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30" : "text-muted-foreground"}`}>
                {settings.agenticMode ? "AKTIF" : "NONAKTIF"}
              </Badge>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest">EXECUTION ENGINE</span>
          </div>
          <CardDescription className="text-xs mt-1">
            Lapisan keamanan eksekusi multi-level. Setiap tindakan AI dicegat, dikategorikan, dan dikonfirmasi sebelum berjalan — memberi Anda kontrol penuh atas apa yang dilakukan AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!settings.agenticMode && (
            <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              <p className="text-xs text-muted-foreground">Aktifkan Mode Agentic untuk mengaktifkan OpenClaw.</p>
            </div>
          )}

          {/* Gate Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gerbang Eksekusi</Label>
            <p className="text-xs text-muted-foreground">Level konfirmasi sebelum AI melakukan tindakan.</p>
            <Select
              value={settings.executionGatePolicy}
              onValueChange={(v) => save({ executionGatePolicy: v })}
              disabled={!settings.agenticMode}
            >
              <SelectTrigger data-testid="select-execution-gate-policy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hanya baca (tanpa konfirmasi)">Hanya Baca — bebas tanpa konfirmasi</SelectItem>
                <SelectItem value="Konfirmasi untuk write">Write Gate — konfirmasi 1× untuk tindakan tulis</SelectItem>
                <SelectItem value="Konfirmasi ganda untuk destructive">Full Gate — konfirmasi ganda untuk tindakan destruktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Matrix */}
          <div className="rounded-lg border overflow-hidden">
            <div className="px-3 py-1.5 bg-muted/40 border-b">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Matriks Tindakan</p>
            </div>
            {[
              {
                level: "READ",
                color: "green",
                icon: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
                examples: "Cari KB · Hitung · Rangkum · Sarankan",
                gate: "Otomatis",
                gateClass: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30",
              },
              {
                level: "WRITE",
                color: "yellow",
                icon: <Lock className="h-3.5 w-3.5 text-yellow-500" />,
                examples: "Draft dokumen · Update rekaman · Buat laporan",
                gate: "1× Konfirmasi",
                gateClass: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30",
              },
              {
                level: "DESTRUCTIVE",
                color: "red",
                icon: <XCircle className="h-3.5 w-3.5 text-red-500" />,
                examples: "Hapus data · Publish · Kirim massal",
                gate: "Konfirmasi Ganda",
                gateClass: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
              },
            ].map(({ level, icon, examples, gate, gateClass }) => (
              <div key={level} className="flex items-center gap-3 px-3 py-2 border-b last:border-0 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-1.5 w-28 shrink-0">
                  {icon}
                  <span className="text-xs font-mono font-semibold">{level}</span>
                </div>
                <span className="text-xs text-muted-foreground flex-1 truncate">{examples}</span>
                <Badge variant="secondary" className={`text-[10px] shrink-0 ${gateClass}`}>{gate}</Badge>
              </div>
            ))}
          </div>

          {/* Advanced OpenClaw settings */}
          {isAdvanced && (
            <div className="space-y-4 border-t pt-4">
              {/* Trusted Actions */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">Aksi Selalu Diizinkan (Trusted)</span>
                </div>
                <MultiSelectField
                  label=""
                  helper="Tindakan ini dijalankan tanpa konfirmasi apapun."
                  options={[
                    "Cari di Knowledge Base",
                    "Hitung formula",
                    "Ringkas dokumen",
                    "Sarankan langkah selanjutnya",
                    "Tampilkan mini app",
                    "Arahkan ke chatbot lain",
                    "Generate teks saja",
                  ]}
                  value={settings.openClawTrustedActions}
                  onChange={(v) => save({ openClawTrustedActions: v })}
                  dataTestId="multiselect-trusted-actions"
                  disabled={!settings.agenticMode}
                />
              </div>

              {/* Blocked Actions */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldX className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-xs font-semibold text-red-700 dark:text-red-400">Aksi Selalu Diblokir (Blocked)</span>
                </div>
                <MultiSelectField
                  label=""
                  helper="Tindakan ini tidak bisa dijalankan meski diminta."
                  options={[
                    "Hapus data pengguna",
                    "Kirim email massal",
                    "Publish ke publik tanpa konfirmasi",
                    "Akses data sensitif langsung",
                    "Ubah konfigurasi sistem",
                    "Bayar atau charge kartu",
                  ]}
                  value={settings.openClawBlockedActions}
                  onChange={(v) => save({ openClawBlockedActions: v })}
                  dataTestId="multiselect-blocked-actions"
                  disabled={!settings.agenticMode}
                />
              </div>

              {/* Trace & Audit */}
              <div className="border-t pt-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Transparansi & Audit</p>
                <ToggleRow
                  label="Lacak Langkah Eksekusi"
                  helper="Tampilkan rantai tindakan AI step-by-step di chat."
                  value={settings.openClawStepTrace}
                  onChange={(v) => save({ openClawStepTrace: v })}
                  dataTestId="toggle-openclaw-step-trace"
                  disabled={!settings.agenticMode}
                />
                <div className="border-t pt-3">
                  <ToggleRow
                    label="Simpan Audit Log Sesi"
                    helper="Catat semua tindakan AI dalam sesi ke log internal."
                    value={settings.openClawAuditLog}
                    onChange={(v) => save({ openClawAuditLog: v })}
                    dataTestId="toggle-openclaw-audit-log"
                    disabled={!settings.agenticMode}
                  />
                </div>
                <div className="border-t pt-3">
                  <ToggleRow
                    label="Notifikasi saat Gate Terpicu"
                    helper="Kirim notifikasi ketika AI meminta konfirmasi eksekusi."
                    value={settings.openClawNotifyOnGate}
                    onChange={(v) => save({ openClawNotifyOnGate: v })}
                    dataTestId="toggle-openclaw-notify"
                    disabled={!settings.agenticMode}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Compact summary when not in Advanced */}
          {!isAdvanced && settings.agenticMode && (
            <div className="rounded-md bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 px-3 py-2 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              <span className="text-xs text-orange-700 dark:text-orange-400">
                Gate: <strong>{settings.executionGatePolicy === "Hanya baca (tanpa konfirmasi)" ? "Hanya Baca" : settings.executionGatePolicy === "Konfirmasi untuk write" ? "Write Gate" : "Full Gate"}</strong> · {settings.openClawStepTrace ? "Step trace ON" : "Step trace OFF"} · {settings.openClawAuditLog ? "Audit log ON" : "Audit log OFF"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic mode summary — shown only when Advanced is OFF */}
      {!isAdvanced && (
        <Card className="border border-dashed bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Pengaturan lanjutan (ringkasan)
            </CardTitle>
            <CardDescription className="text-xs">Aktifkan Mode Lanjutan di atas untuk mengubah nilai ini.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {[
                { label: "Kedalaman Jawaban", value: settings.responseDepth },
                { label: "Format Output", value: settings.outputFormat },
                { label: "Gaya Interaksi", value: settings.interactionStyle },
                { label: "Bantuan Proaktif", value: settings.proactiveAssistanceLevel },
                { label: "Minta Klarifikasi", value: settings.clarifyBeforeAnswer ? "Ya" : "Tidak" },
                { label: "Peringatan Risiko", value: settings.showRiskWarnings ? "Aktif" : "Tidak aktif" },
                { label: "Retensi Konteks", value: `${settings.contextRetention} pesan` },
                { label: "Saat Tidak Yakin", value: settings.uncertaintyHandling.length > 22 ? settings.uncertaintyHandling.slice(0, 22) + "…" : settings.uncertaintyHandling },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-border/40 py-1 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <Badge variant="secondary" className="text-xs py-0 font-normal">{value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced-only cards (4-12) */}
      {isAdvanced && (
        <>
          {/* 4. Kualitas Respons */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-emerald-500" />
                Kualitas Respons
              </CardTitle>
              <CardDescription>Kontrol cara jawaban disajikan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SelectRow
                label="Kedalaman Jawaban"
                helper="Atur tingkat detail penjelasan AI."
                value={settings.responseDepth}
                onChange={(v) => save({ responseDepth: v })}
                options={["Singkat", "Normal", "Terstruktur", "Mendalam"]}
                dataTestId="select-response-depth"
              />
              <SelectRow
                label="Format Output Utama"
                helper="Bentuk jawaban yang paling sering digunakan."
                value={settings.outputFormat}
                onChange={(v) => save({ outputFormat: v })}
                options={["Paragraf", "Poin-poin", "Langkah demi langkah", "Checklist", "Ringkasan + langkah"]}
                dataTestId="select-output-format"
              />
              <div className="border-t pt-4">
                <ToggleRow
                  label="Pemeriksaan Mandiri"
                  helper="AI mengecek ulang jawaban sebelum dikirim."
                  value={settings.selfCorrection}
                  onChange={(v) => save({ selfCorrection: v })}
                  dataTestId="toggle-self-correction"
                />
              </div>
              <div className="border-t pt-4">
                <ToggleRow
                  label="Penalaran Multi-Langkah"
                  helper="AI memecah masalah menjadi langkah-langkah terstruktur."
                  value={settings.multiStepReasoning}
                  onChange={(v) => save({ multiStepReasoning: v })}
                  dataTestId="toggle-multi-step-reasoning"
                  disabled={!settings.agenticMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* 5. Klarifikasi & Ketidakpastian */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <HelpCircle className="h-4 w-4 text-yellow-500" />
                Klarifikasi & Ketidakpastian
              </CardTitle>
              <CardDescription>Mengurangi halusinasi dan meningkatkan kualitas dialog.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                label="Minta Klarifikasi Dulu"
                helper="AI bertanya jika informasi belum cukup."
                value={settings.clarifyBeforeAnswer}
                onChange={(v) => save({ clarifyBeforeAnswer: v })}
                dataTestId="toggle-clarify-before-answer"
              />
              <div className="border-t pt-4">
                <SelectRow
                  label="Saat Tidak Yakin"
                  helper="Cara AI merespons ketika informasinya tidak pasti."
                  value={settings.uncertaintyHandling}
                  onChange={(v) => save({ uncertaintyHandling: v })}
                  options={[
                    "Jawab normal",
                    "Jelaskan keterbatasan",
                    "Minta klarifikasi",
                    "Sarankan verifikasi ke sumber resmi",
                    "Jangan jawab jika tidak cukup yakin",
                  ]}
                  dataTestId="select-uncertainty-handling"
                />
              </div>
              <div className="border-t pt-4">
                <ToggleRow
                  label="Tampilkan Peringatan Risiko"
                  helper="Tambahkan catatan kehati-hatian untuk topik sensitif."
                  value={settings.showRiskWarnings}
                  onChange={(v) => save({ showRiskWarnings: v })}
                  dataTestId="toggle-show-risk-warnings"
                />
              </div>
              <div className="border-t pt-4">
                <MultiSelectField
                  label="Pemicu Klarifikasi"
                  helper="Kondisi yang membuat AI otomatis meminta klarifikasi."
                  options={[
                    "Output target tidak jelas",
                    "Risiko salah tinggi",
                    "Butuh data spesifik untuk eksekusi",
                    "Pertanyaan ambigu / multi-tafsir",
                    "Informasi pengguna tampak bertentangan",
                  ]}
                  value={settings.clarificationTriggers}
                  onChange={(v) => save({ clarificationTriggers: v })}
                  dataTestId="multiselect-clarification-triggers"
                  disabled={!settings.agenticMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* 6. Memori & Konteks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Ear className="h-4 w-4 text-blue-500" />
                Memori & Konteks
              </CardTitle>
              <CardDescription>Kontrol apa yang diingat dan diprioritaskan AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                label="Mendengarkan dengan Teliti"
                helper="AI membaca konteks dan maksud lebih cermat."
                value={settings.attentiveListening}
                onChange={(v) => save({ attentiveListening: v })}
                dataTestId="toggle-attentive-listening"
              />
              <div className="border-t pt-4 space-y-3">
                <div>
                  <Label className="text-sm font-medium">Retensi Konteks</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Banyaknya pesan terakhir yang jadi acuan.</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{settings.contextRetention} pesan</span>
                  <Badge variant="secondary" className="text-xs">
                    {settings.contextRetention <= 5 ? "Minimal" : settings.contextRetention <= 15 ? "Normal" : settings.contextRetention <= 30 ? "Tinggi" : "Maksimal"}
                  </Badge>
                </div>
                <Slider
                  value={[settings.contextRetention]}
                  onValueChange={([v]) => save({ contextRetention: v })}
                  min={1}
                  max={50}
                  step={1}
                  data-testid="slider-context-retention"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 pesan</span>
                  <span>50 pesan</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <SortableMultiSelect
                  label="Prioritas Konteks"
                  helper="Urutan konteks yang paling diutamakan."
                  options={[
                    "Pertanyaan terakhir",
                    "Tujuan pengguna",
                    "Profil pengguna",
                    "Data proyek",
                    "Riwayat percakapan",
                    "Hasil tools",
                  ]}
                  value={settings.contextPriority}
                  onChange={(v) => save({ contextPriority: v })}
                  dataTestId="sortable-context-priority"
                />
              </div>
            </CardContent>
          </Card>

          {/* 7. Bantuan Proaktif */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4 text-yellow-500" />
                Bantuan Proaktif
              </CardTitle>
              <CardDescription>Seberapa sering AI memberi bantuan tambahan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SelectRow
                label="Bantuan Proaktif"
                helper="Seberapa sering AI memberi bantuan tambahan."
                value={settings.proactiveAssistanceLevel}
                onChange={(v) => save({ proactiveAssistanceLevel: v })}
                options={["Off", "Rendah", "Sedang", "Tinggi"]}
                dataTestId="select-proactive-assistance"
              />
              {settings.proactiveAssistanceLevel !== "Off" && (
                <div className="border-t pt-4">
                  <MultiSelectField
                    label="Jenis Bantuan Proaktif"
                    helper="Jenis bantuan yang boleh ditampilkan."
                    options={[
                      "Saran langkah berikutnya",
                      "Pertanyaan klarifikasi",
                      "Checklist",
                      "Peringatan risiko",
                      "Rekomendasi mini apps",
                      "Rekomendasi chatbot spesialis",
                      "Rekomendasi dokumen",
                    ]}
                    value={settings.proactiveHelpTypes}
                    onChange={(v) => save({ proactiveHelpTypes: v })}
                    dataTestId="multi-proactive-help-types"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 8. Gaya Interaksi */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-pink-500" />
                Gaya Interaksi & Empati
              </CardTitle>
              <CardDescription>Nada dan cara AI berkomunikasi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SelectRow
                label="Gaya Interaksi"
                helper="Cara AI menyampaikan jawaban."
                value={settings.interactionStyle}
                onChange={(v) => save({ interactionStyle: v })}
                options={["Formal", "Profesional", "Ramah", "Konsultatif", "Mentor"]}
                dataTestId="select-interaction-style"
              />
              <div className="border-t pt-4">
                <SelectRow
                  label="Empati Kontekstual"
                  helper="Seberapa peka AI terhadap emosi pengguna."
                  value={settings.contextualEmpathy}
                  onChange={(v) => save({ contextualEmpathy: v })}
                  options={["Off", "Ringan", "Sedang", "Tinggi"]}
                  dataTestId="select-contextual-empathy"
                />
              </div>
            </CardContent>
          </Card>

          {/* 9-12: deeper advanced-only cards */}
          {/* 9. Batas Tindakan & Eskalasi */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-red-500" />
                Batas Tindakan & Eskalasi
              </CardTitle>
              <CardDescription>Guardrails dan aturan keamanan AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultiSelectField
                label="Batas Tindakan AI"
                helper="Apa saja tindakan yang diizinkan."
                options={[
                  "Hanya menjawab",
                  "Boleh menyarankan",
                  "Boleh bertanya balik",
                  "Boleh memanggil mini apps",
                  "Boleh mengarahkan ke chatbot lain",
                  "Boleh memberi CTA bisnis",
                ]}
                value={settings.actionBoundary}
                onChange={(v) => save({ actionBoundary: v })}
                dataTestId="multi-action-boundary"
              />
              <div className="border-t pt-4">
                <MultiSelectField
                  label="Aturan Eskalasi"
                  helper="Apa yang dilakukan saat kasus sensitif/rumit."
                  options={[
                    "Arahkan ke sumber resmi",
                    "Sarankan konsultasi manusia",
                    "Pindahkan ke chatbot spesialis",
                    "Sarankan mini app terkait",
                    "Tampilkan disclaimer",
                  ]}
                  value={settings.escalationRules}
                  onChange={(v) => save({ escalationRules: v })}
                  dataTestId="multi-escalation-rules"
                />
              </div>
            </CardContent>
          </Card>

          {/* 10. Perilaku Off-topic */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Perilaku di Luar Topik
              </CardTitle>
              <CardDescription>Cara AI merespons ketika pertanyaan tidak relevan.</CardDescription>
            </CardHeader>
            <CardContent>
              <SelectRow
                label="Saat di Luar Topik"
                helper="Respons AI ketika pertanyaan tidak relevan."
                value={settings.offTopicBehavior}
                onChange={(v) => save({ offTopicBehavior: v })}
                options={[
                  "Arahkan dengan sopan",
                  "Jawab singkat lalu arahkan kembali",
                  "Tolak dengan jelas",
                ]}
                dataTestId="select-off-topic-behavior"
              />
            </CardContent>
          </Card>

          {/* 11. Pembelajaran & Telemetri */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-4 w-4 text-green-500" />
                Pembelajaran & Telemetri
              </CardTitle>
              <CardDescription>Kontrol adaptasi dan penyimpanan sinyal interaksi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SelectRow
                label="Mode Pembelajaran Adaptif"
                helper="Apakah AI menyesuaikan diri dari interaksi."
                value={settings.adaptiveLearningMode}
                onChange={(v) => save({ adaptiveLearningMode: v })}
                options={["Off", "Sesi aktif saja", "Belajar pola interaksi", "Dengan review admin"]}
                dataTestId="select-adaptive-learning"
              />
              <div className="border-t pt-4">
                <ToggleRow
                  label="Simpan Sinyal Interaksi"
                  helper="Simpan sinyal untuk evaluasi kualitas."
                  value={settings.storeInteractionSignals}
                  onChange={(v) => save({ storeInteractionSignals: v })}
                  dataTestId="toggle-store-signals"
                />
              </div>
            </CardContent>
          </Card>

          {/* 12. Prioritas Sumber */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings2 className="h-4 w-4 text-slate-500" />
                Prioritas Sumber Jawaban
              </CardTitle>
              <CardDescription>Urutan sumber yang diprioritaskan AI.</CardDescription>
            </CardHeader>
            <CardContent>
              <SortableList
                label=""
                helper="Geser urutan sumber yang diutamakan AI saat menjawab."
                items={settings.sourcePriority}
                onChange={(v) => save({ sourcePriority: v })}
                dataTestId="sortable-source-priority"
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Info footer */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardContent className="pt-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg shrink-0">
              <RotateCcw className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {isAdvanced ? "Mode Lanjutan Aktif" : "Tampilkan Mode Lanjutan untuk lebih banyak opsi"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {isAdvanced
                  ? "Semua pengaturan ditampilkan. Nilai tersimpan otomatis saat diubah."
                  : "Aktifkan Mode Lanjutan di atas untuk mengatur prioritas konteks, batas tindakan, eskalasi, pembelajaran, dan prioritas sumber."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
