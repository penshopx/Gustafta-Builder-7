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
  MessageSquare,
  Target,
  Layers,
  HelpCircle,
  RefreshCcw,
} from "lucide-react";

type Settings = {
  agenticMode: boolean;
  attentiveListening: boolean;
  contextRetention: number;
  selfCorrection: boolean;
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
};

function MultiSelectField({
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
  return (
    <div className="space-y-2">
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
}: {
  label: string;
  helper: string;
  value: boolean;
  onChange: (v: boolean) => void;
  dataTestId?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{helper}</p>
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        data-testid={dataTestId}
        className="shrink-0"
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
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  dataTestId?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{helper}</p>
      </div>
      <Select value={value} onValueChange={onChange}>
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
            <p className="text-xs text-muted-foreground">Pengaturan detail untuk pengguna berpengalaman.</p>
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
          {isAdvanced && (
            <div className="border-t pt-4">
              <SortableList
                label="Prioritas Konteks"
                helper="Urutan konteks yang paling diutamakan."
                items={settings.contextPriority}
                onChange={(v) => save({ contextPriority: v })}
                dataTestId="sortable-context-priority"
              />
            </div>
          )}
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
            helper="Seberapa sering AI memberi bantuan tambahan tanpa diminta."
            value={settings.proactiveAssistanceLevel}
            onChange={(v) => save({ proactiveAssistanceLevel: v })}
            options={["Off", "Rendah", "Sedang", "Tinggi"]}
            dataTestId="select-proactive-assistance"
          />
          {isAdvanced && settings.proactiveAssistanceLevel !== "Off" && (
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
          {isAdvanced && (
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
          )}
        </CardContent>
      </Card>

      {/* Advanced-only cards */}
      {isAdvanced && (
        <>
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
