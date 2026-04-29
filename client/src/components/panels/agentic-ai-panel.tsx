import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useActiveAgent, useUpdateAgent } from "@/hooks/use-agents";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
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
  Trash2,
  DatabaseBackup,
  GitBranch,
  Bot,
  Cpu,
  ChevronRight,
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
  // OpenClaw — PBJ Track Routing
  openClawTrack: string;
  openClawEntityOwner: string;
  openClawRulebook: string;
  openClawRulebookCategory: string[];
  openClawRulebookStatus: string;
  openClawClauseRefRequired: boolean;
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
    showRiskWarnings: true,
    interactionStyle: "Formal",
  },
};

const PRESET_DESCRIPTIONS: Record<string, { tagline: string; detail: string; color: string; chips: string[] }> = {
  Balanced: {
    tagline: "Seimbang & Fleksibel",
    detail: "Cocok untuk sebagian besar kasus. AI responsif, memberikan jawaban terstruktur, dan meminta klarifikasi sebelum bertindak.",
    color: "indigo",
    chips: ["Otonomi Sedang", "Terstruktur", "Tanya Dulu"],
  },
  Learn: {
    tagline: "Mode Belajar & Edukasi",
    detail: "AI bertindak sebagai mentor — penjelasan mendalam, sabar, langkah demi langkah. Ideal untuk onboarding atau pelatihan.",
    color: "blue",
    chips: ["Otonomi Pasif", "Mendalam", "Gaya Mentor"],
  },
  Mentor: {
    tagline: "Mentor Profesional",
    detail: "AI membimbing dengan penjelasan mendalam dan gaya mentor. Baik untuk diskusi strategis dan pengambilan keputusan.",
    color: "violet",
    chips: ["Otonomi Sedang", "Mendalam", "Poin-poin"],
  },
  Solve: {
    tagline: "Fokus Solusi",
    detail: "AI langsung ke inti masalah. Tidak banyak tanya, langsung jawab dan eksekusi. Cocok untuk troubleshooting cepat.",
    color: "orange",
    chips: ["Otonomi Tinggi", "Langsung Eksekusi", "Formal"],
  },
  Expert: {
    tagline: "Mode Ahli Teknis",
    detail: "Untuk pengguna berpengalaman yang butuh jawaban mendalam tanpa banyak basa-basi. AI langsung ke detail teknis.",
    color: "red",
    chips: ["Otonomi Tinggi", "Mendalam", "Tanpa Proaktif"],
  },
  "Brain Project": {
    tagline: "Manajemen Proyek",
    detail: "AI dirancang untuk Project Brain — tracking proyek, risiko, keputusan, dan tindak lanjut. Sangat proaktif dan konsultatif.",
    color: "emerald",
    chips: ["Otonomi Tinggi", "Sangat Proaktif", "Konsultatif"],
  },
  Compliance: {
    tagline: "Kepatuhan & Regulasi",
    detail: "AI hati-hati dan akurat — selalu menyarankan verifikasi ke sumber resmi. Ideal untuk tender, hukum, dan audit.",
    color: "amber",
    chips: ["Otonomi Terbatas", "Verifikasi Wajib", "Formal"],
  },
  Custom: {
    tagline: "Konfigurasi Manual",
    detail: "Semua pengaturan dikontrol secara manual. Gunakan untuk kebutuhan khusus yang tidak dicakup preset lain.",
    color: "gray",
    chips: ["Manual", "Fleksibel Penuh"],
  },
};

const PRESET_COLOR_MAP: Record<string, { bg: string; border: string; text: string; chip: string }> = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800", text: "text-indigo-700 dark:text-indigo-300", chip: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300" },
  blue: { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300", chip: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300" },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800", text: "text-violet-700 dark:text-violet-300", chip: "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", text: "text-orange-700 dark:text-orange-300", chip: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300" },
  red: { bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-300", chip: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-300", chip: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", text: "text-amber-700 dark:text-amber-300", chip: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300" },
  gray: { bg: "bg-muted/40", border: "border-border", text: "text-muted-foreground", chip: "bg-muted text-muted-foreground" },
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

function MemoryManager({ agentId }: { agentId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: memories = [], isLoading: memoriesLoading } = useQuery<any[]>({
    queryKey: ["/api/memories", agentId],
    queryFn: async () => {
      const res = await fetch(`/api/memories/${agentId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch memories");
      return res.json();
    },
    enabled: isOpen && !!agentId,
  });

  const deleteOneMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/memories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories", agentId] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/memories/agent/${agentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories", agentId] });
      toast({ title: "Memori dihapus", description: "Semua memori AI untuk chatbot ini telah dihapus." });
    },
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <DatabaseBackup className="h-4 w-4 text-blue-500" />
              Memori AI
            </CardTitle>
            {memories.length > 0 && (
              <Badge variant="secondary" className="text-xs">{memories.length}</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-toggle-memory-panel"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>
          Informasi yang diingat AI dari percakapan sebelumnya dengan pengguna.
        </CardDescription>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-3">
          {memoriesLoading ? (
            <p className="text-sm text-muted-foreground">Memuat memori...</p>
          ) : memories.length === 0 ? (
            <div className="text-center py-4">
              <Brain className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Belum ada memori tersimpan.</p>
              <p className="text-xs text-muted-foreground mt-1">Memori akan terbentuk saat AI belajar dari percakapan pengguna.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {memories.map((mem: any) => (
                  <div
                    key={mem.id}
                    className="flex items-start gap-2 p-2 bg-muted/40 rounded-lg text-sm"
                    data-testid={`memory-item-${mem.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      {mem.category && (
                        <Badge variant="outline" className="text-[10px] mb-1 capitalize">{mem.category}</Badge>
                      )}
                      <p className="text-xs text-muted-foreground break-words">{mem.content}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteOneMutation.mutate(mem.id)}
                      disabled={deleteOneMutation.isPending}
                      data-testid={`button-delete-memory-${mem.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => clearAllMutation.mutate()}
                disabled={clearAllMutation.isPending}
                data-testid="button-clear-all-memories"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Hapus Semua Memori
              </Button>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

type SpecialistConfig = { name: string; prompt: string; enabled: boolean };
type OrchestratorConfig = {
  enabled: boolean;
  routingModel: string;
  specialists: Record<string, SpecialistConfig>;
};

const SPECIALIST_META: Array<{ key: string; icon: string; label: string; defaultPrompt: string }> = [
  { key: "tender", icon: "📋", label: "Agen Tender", defaultPrompt: "Kamu adalah spesialis tender dan pengadaan jasa konstruksi. Fokus menjawab tentang: analisis dokumen tender, persyaratan kualifikasi BUJK, estimasi RAB dan BOQ, strategi penawaran harga, persyaratan teknis proyek, dan evaluasi kontrak tender. Berikan jawaban yang presisi dan berbasis regulasi Perpres 12/2021 dan aturan LKPP." },
  { key: "skk_sbu", icon: "🏆", label: "Agen SKK/SBU", defaultPrompt: "Kamu adalah spesialis sertifikasi kompetensi konstruksi Indonesia. Fokus menjawab tentang: SKK (Sertifikat Kompetensi Kerja) dari level 3-9, SBU (Sertifikat Badan Usaha), proses registrasi LPJK, persyaratan dokumen, biaya dan jadwal sertifikasi, serta jalur karir di jasa konstruksi sesuai PP 14/2021 dan UU Jasa Konstruksi 2/2017." },
  { key: "dokumen", icon: "📄", label: "Agen Dokumen", defaultPrompt: "Kamu adalah spesialis pembuatan dokumen teknis konstruksi. Fokus menjawab tentang: pembuatan SOP proyek, template kontrak konstruksi, surat garansi, MOU, dokumen K3, laporan progres, metode kerja (method statement), dan dokumen ISO 9001/14001/45001. Bantu pengguna membuat draft dokumen yang siap pakai." },
  { key: "hukum", icon: "⚖️", label: "Agen Hukum", defaultPrompt: "Kamu adalah spesialis hukum dan regulasi jasa konstruksi Indonesia. Fokus menjawab tentang: UU Jasa Konstruksi No. 2/2017, PP 22/2020, PP 14/2021, Perpres Pengadaan, perselisihan kontrak konstruksi, arbitrase, Permen PUPR, dan standar SNI. Berikan referensi pasal yang spesifik dalam setiap jawaban." },
  { key: "k3", icon: "🦺", label: "Agen K3", defaultPrompt: "Kamu adalah spesialis Keselamatan dan Kesehatan Kerja (K3) konstruksi. Fokus menjawab tentang: RK3K, JSA, IBPR, APD, inspeksi proyek, incident report, standar K3 Permenaker, dan sertifikasi K3. Prioritaskan keselamatan dan kepatuhan regulasi." },
  { key: "marketing", icon: "📈", label: "Agen Marketing", defaultPrompt: "Kamu adalah spesialis marketing dan penjualan untuk industri konstruksi. Fokus menjawab tentang: strategi pemasaran jasa konstruksi, copywriting, proposal klien, strategi media sosial untuk kontraktor, penawaran harga kompetitif, personal branding kontraktor, dan strategi lead generation." },
  { key: "umum", icon: "💬", label: "Agen Umum", defaultPrompt: "Kamu adalah asisten umum yang membantu dengan pertanyaan seputar industri konstruksi Indonesia, manajemen proyek, material bangunan, teknik sipil dasar, dan topik umum lainnya." },
];

function buildDefaultOrchConfig(): OrchestratorConfig {
  const specialists: Record<string, SpecialistConfig> = {};
  SPECIALIST_META.forEach(({ key, label, defaultPrompt }) => {
    specialists[key] = { name: label, prompt: defaultPrompt, enabled: true };
  });
  return { enabled: false, routingModel: "deepseek-chat", specialists };
}

export function AgenticAIPanel() {
  const { data: agent, isLoading } = useActiveAgent();
  const updateAgent = useUpdateAgent();
  const { toast } = useToast();
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [orchConfig, setOrchConfig] = useState<OrchestratorConfig>(buildDefaultOrchConfig());
  const [expandedSpec, setExpandedSpec] = useState<string | null>(null);

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
        openClawTrack: (agent as any).openClawTrack || "Komersial",
        openClawEntityOwner: (agent as any).openClawEntityOwner || "",
        openClawRulebook: (agent as any).openClawRulebook || "",
        openClawRulebookCategory: (agent as any).openClawRulebookCategory || [],
        openClawRulebookStatus: (agent as any).openClawRulebookStatus || "Active",
        openClawClauseRefRequired: (agent as any).openClawClauseRefRequired ?? false,
      });
    }
  }, [agent?.id]);

  useEffect(() => {
    if (agent) {
      const raw = (agent as any).orchestratorConfig;
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        const defaults = buildDefaultOrchConfig();
        const merged: OrchestratorConfig = {
          enabled: raw.enabled ?? false,
          routingModel: raw.routingModel || "deepseek-chat",
          specialists: { ...defaults.specialists, ...(raw.specialists || {}) },
        };
        setOrchConfig(merged);
      }
    }
  }, [agent?.id]);

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

  const saveOrch = async (patch: Partial<OrchestratorConfig>) => {
    if (!agent) return;
    const next = { ...orchConfig, ...patch };
    setOrchConfig(next);
    try {
      await updateAgent.mutateAsync({ id: agent.id, data: { orchestratorConfig: next } as any });
    } catch {
      toast({ title: "Error", description: "Gagal menyimpan konfigurasi orchestrator", variant: "destructive" });
      setOrchConfig(orchConfig);
    }
  };

  const saveSpecialist = async (key: string, patch: Partial<SpecialistConfig>) => {
    const next: OrchestratorConfig = {
      ...orchConfig,
      specialists: {
        ...orchConfig.specialists,
        [key]: { ...orchConfig.specialists[key], ...patch },
      },
    };
    setOrchConfig(next);
    try {
      await updateAgent.mutateAsync({ id: agent!.id, data: { orchestratorConfig: next } as any });
    } catch {
      toast({ title: "Error", description: "Gagal menyimpan specialist", variant: "destructive" });
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

      {/* ── ORCHESTRATOR MULTI-AGENT ── */}
      <Card className={orchConfig.enabled ? "border-violet-400 dark:border-violet-600 shadow-sm" : ""}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="h-4 w-4 text-violet-500" />
              Orchestrator Multi-Agent
              {orchConfig.enabled && (
                <span className="ml-1 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
                  Aktif
                </span>
              )}
            </CardTitle>
            <Switch
              checked={orchConfig.enabled}
              onCheckedChange={(v) => {
                if (v && !settings.agenticMode) save({ agenticMode: true });
                saveOrch({ enabled: v });
              }}
              data-testid="toggle-orchestrator-enabled"
            />
          </div>
          <CardDescription>
            Aktifkan agar AI secara otomatis mendeteksi topik query (tender, SKK, dokumen, hukum, K3, marketing)
            dan mengaktifkan prompt specialist yang tepat — tanpa biaya tinggi.
          </CardDescription>
        </CardHeader>
        {orchConfig.enabled && (
          <CardContent className="space-y-4">
            {/* Routing Model */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Cpu className="h-3 w-3 text-muted-foreground" />
                Model Routing (Classifier — Murah &amp; Cepat)
              </Label>
              <Select
                value={orchConfig.routingModel}
                onValueChange={(v) => saveOrch({ routingModel: v })}
              >
                <SelectTrigger className="h-8 text-xs" data-testid="select-routing-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deepseek-chat">DeepSeek Chat (~$0.0001/call) — Direkomendasikan</SelectItem>
                  <SelectItem value="deepseek-reasoner">DeepSeek Reasoner (lebih akurat)</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini (fallback)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Model ini hanya dipakai untuk klasifikasi topik (~10 token). Jawaban tetap menggunakan model utama chatbot.
              </p>
            </div>

            {/* Cost Indicator */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-xs text-green-800 dark:text-green-300">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>
                <strong>Efisiensi biaya:</strong> Classifier hanya ~$0.0001 per pesan. Jawaban specialist menggunakan model yang sudah dikonfigurasi — tidak ada biaya tambahan signifikan.
              </span>
            </div>

            {/* Specialist Agents */}
            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Bot className="h-3 w-3 text-muted-foreground" />
                7 Specialist Agents
              </Label>
              <div className="space-y-2">
                {SPECIALIST_META.map(({ key, icon, label }) => {
                  const spec = orchConfig.specialists[key] || { name: label, prompt: "", enabled: true };
                  const isExpanded = expandedSpec === key;
                  return (
                    <div
                      key={key}
                      className={`rounded-lg border transition-colors ${spec.enabled ? "border-border" : "border-border/40 opacity-60"}`}
                    >
                      <div
                        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/30"
                        onClick={() => setExpandedSpec(isExpanded ? null : key)}
                        data-testid={`specialist-header-${key}`}
                      >
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <span>{icon}</span>
                          <span>{label}</span>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Switch
                            checked={spec.enabled}
                            onCheckedChange={(v) => saveSpecialist(key, { enabled: v })}
                            data-testid={`toggle-specialist-${key}`}
                          />
                          <ChevronRight
                            className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          />
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="px-3 pb-3 space-y-2 border-t">
                          <Label className="text-xs text-muted-foreground mt-2 block">Prompt Specialist</Label>
                          <Textarea
                            value={spec.prompt}
                            onChange={(e) => {
                              const next: OrchestratorConfig = {
                                ...orchConfig,
                                specialists: { ...orchConfig.specialists, [key]: { ...spec, prompt: e.target.value } },
                              };
                              setOrchConfig(next);
                            }}
                            onBlur={() => saveSpecialist(key, { prompt: orchConfig.specialists[key]?.prompt || "" })}
                            rows={4}
                            className="text-xs resize-none"
                            placeholder="Prompt khusus untuk specialist ini..."
                            data-testid={`textarea-specialist-prompt-${key}`}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => {
                              const meta = SPECIALIST_META.find((m) => m.key === key);
                              if (meta) saveSpecialist(key, { prompt: meta.defaultPrompt });
                            }}
                            data-testid={`button-reset-specialist-${key}`}
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Reset ke Default
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

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

          {/* Preset description card */}
          {(() => {
            const desc = PRESET_DESCRIPTIONS[settings.behaviorPreset];
            const colors = PRESET_COLOR_MAP[desc?.color || "gray"];
            if (!desc) return null;
            return (
              <div className={`rounded-lg border p-3 space-y-2 ${colors.bg} ${colors.border}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold ${colors.text}`}>{desc.tagline}</span>
                  {settings.behaviorPreset !== "Custom" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-6 text-[11px] gap-1 shrink-0 ${colors.text} hover:bg-black/5 dark:hover:bg-white/5`}
                      onClick={() => applyPreset(settings.behaviorPreset)}
                      data-testid="btn-reset-preset"
                    >
                      <RefreshCcw className="h-2.5 w-2.5" />
                      Reset ke Preset
                    </Button>
                  )}
                </div>
                <p className={`text-xs ${colors.text} opacity-80`}>{desc.detail}</p>
                <div className="flex flex-wrap gap-1.5">
                  {desc.chips.map((chip) => (
                    <span key={chip} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${colors.chip}`}>{chip}</span>
                  ))}
                </div>
                {settings.behaviorPreset !== "Custom" && (
                  <p className="text-[10px] text-muted-foreground pt-0.5">Sebagian pengaturan mengikuti preset. Aktifkan Mode Lanjutan untuk detail.</p>
                )}
              </div>
            );
          })()}

          {settings.behaviorPreset === "Custom" && (
            <p className="text-xs text-muted-foreground">
              Semua pengaturan dikontrol manual. Aktifkan Mode Lanjutan untuk detail.
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
              "Orkestrator",
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

              {/* PBJ Track Routing */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded bg-blue-500/15">
                    <Layers className="h-3 w-3 text-blue-500" />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Track & Routing Dokumen</p>
                </div>

                {/* Track Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Track Pengadaan</Label>
                  <p className="text-xs text-muted-foreground">Menentukan skema routing dan persyaratan dokumen yang dihasilkan.</p>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {["Komersial", "PBJ Formal (Pemerintah/BUMN)", "Internal"].map((track) => (
                      <button
                        key={track}
                        data-testid={`btn-track-${track}`}
                        disabled={!settings.agenticMode}
                        onClick={() => save({ openClawTrack: track })}
                        className={`rounded-md border px-2 py-2 text-[11px] font-medium text-center transition-colors ${
                          settings.openClawTrack === track
                            ? track === "PBJ Formal (Pemerintah/BUMN)"
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-primary border-primary text-primary-foreground"
                            : "bg-background hover:bg-muted text-muted-foreground"
                        } ${!settings.agenticMode ? "opacity-40 pointer-events-none" : ""}`}
                      >
                        {track === "PBJ Formal (Pemerintah/BUMN)" ? "PBJ Formal" : track}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PBJ Formal — extended fields */}
                {settings.openClawTrack === "PBJ Formal (Pemerintah/BUMN)" && (
                  <div className="space-y-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30">PBJ FORMAL</Badge>
                      <p className="text-xs text-blue-700 dark:text-blue-400">Konfigurasi rulebook wajib untuk kepatuhan pengadaan pemerintah/BUMN.</p>
                    </div>

                    {/* Entity/Owner */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Entity / Owner</Label>
                      <p className="text-xs text-muted-foreground">Nama BUMN, K/L, atau instansi yang menjadi acuan rulebook.</p>
                      <Input
                        data-testid="input-openclaw-entity-owner"
                        placeholder="Contoh: BUMN Karya X, Kementerian PUPR, BUMN B Subholding"
                        value={settings.openClawEntityOwner}
                        onChange={(e) => save({ openClawEntityOwner: e.target.value })}
                        disabled={!settings.agenticMode}
                        className="h-8 text-xs"
                      />
                    </div>

                    {/* Rulebook Aktif */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Rulebook Aktif</Label>
                      <p className="text-xs text-muted-foreground">Nama dokumen pedoman yang berlaku (misal: Pedoman PBJ BUMN X 2025, Dokpem Paket Y).</p>
                      <Input
                        data-testid="input-openclaw-rulebook"
                        placeholder="Contoh: Pedoman PBJ BUMN X 2025"
                        value={settings.openClawRulebook}
                        onChange={(e) => save({ openClawRulebook: e.target.value })}
                        disabled={!settings.agenticMode}
                        className="h-8 text-xs"
                      />
                    </div>

                    {/* Kategori Rulebook */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Kategori Rulebook</Label>
                      <p className="text-xs text-muted-foreground">Jenis dokumen pedoman yang dipakai sebagai acuan.</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {["Regulasi", "SOP Internal", "Dokumen Pemilihan (Dokpem)", "Syarat Vendor", "Contract Template"].map((cat) => {
                          const selected = settings.openClawRulebookCategory.includes(cat);
                          return (
                            <button
                              key={cat}
                              data-testid={`btn-rulebook-cat-${cat}`}
                              disabled={!settings.agenticMode}
                              onClick={() => {
                                const next = selected
                                  ? settings.openClawRulebookCategory.filter((c) => c !== cat)
                                  : [...settings.openClawRulebookCategory, cat];
                                save({ openClawRulebookCategory: next });
                              }}
                              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                                selected
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "bg-background border-border text-muted-foreground hover:bg-muted"
                              } ${!settings.agenticMode ? "opacity-40 pointer-events-none" : ""}`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Status Rulebook */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Status Rulebook</Label>
                      <Select
                        value={settings.openClawRulebookStatus}
                        onValueChange={(v) => save({ openClawRulebookStatus: v })}
                        disabled={!settings.agenticMode}
                      >
                        <SelectTrigger className="h-8 text-xs" data-testid="select-rulebook-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active — berlaku saat ini</SelectItem>
                          <SelectItem value="Superseded">Superseded — sudah digantikan versi baru</SelectItem>
                          <SelectItem value="Deprecated">Deprecated — tidak berlaku lagi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Wajib Referensi Klausul */}
                    <div className="border-t border-blue-200 dark:border-blue-800 pt-3">
                      <ToggleRow
                        label="Wajib Referensi Klausul"
                        helper="Setiap temuan/klaim kepatuhan harus disertai nomor klausul dan bukti (halaman/section) dari rulebook."
                        value={settings.openClawClauseRefRequired}
                        onChange={(v) => save({ openClawClauseRefRequired: v })}
                        dataTestId="toggle-clause-ref-required"
                        disabled={!settings.agenticMode}
                      />
                    </div>

                    {/* Routing summary */}
                    <div className="rounded-md bg-white/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3 space-y-1.5 text-[11px] text-blue-800 dark:text-blue-300">
                      <p className="font-semibold">Alur Routing OpenClaw — PBJ Formal:</p>
                      <ol className="list-decimal ml-4 space-y-0.5">
                        <li>Tentukan <strong>Entity/Owner</strong> {settings.openClawEntityOwner ? `→ ${settings.openClawEntityOwner}` : "(belum diisi)"}</li>
                        <li>Pilih <strong>Rulebook</strong> {settings.openClawRulebook ? `→ "${settings.openClawRulebook}"` : "(belum diisi)"} {settings.openClawRulebook && <span className={`ml-1 font-medium ${settings.openClawRulebookStatus === "Active" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>({settings.openClawRulebookStatus})</span>}</li>
                        <li>Pilih <strong>Document Type</strong> berdasarkan konteks permintaan</li>
                        <li>Generate dokumen {settings.openClawClauseRefRequired ? <strong className="text-blue-700 dark:text-blue-300">+ rujukan klausul wajib</strong> : "tanpa kewajiban klausul"}</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compact summary when not in Advanced */}
          {!isAdvanced && settings.agenticMode && (
            <div className="rounded-md bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 px-3 py-2 space-y-1">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                <span className="text-xs text-orange-700 dark:text-orange-400">
                  Gate: <strong>{settings.executionGatePolicy === "Hanya baca (tanpa konfirmasi)" ? "Hanya Baca" : settings.executionGatePolicy === "Konfirmasi untuk write" ? "Write Gate" : "Full Gate"}</strong> · {settings.openClawStepTrace ? "Step trace ON" : "Step trace OFF"} · {settings.openClawAuditLog ? "Audit log ON" : "Audit log OFF"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span className="text-xs text-blue-700 dark:text-blue-400">
                  Track: <strong>{settings.openClawTrack === "PBJ Formal (Pemerintah/BUMN)" ? "PBJ Formal" : settings.openClawTrack}</strong>
                  {settings.openClawTrack === "PBJ Formal (Pemerintah/BUMN)" && settings.openClawEntityOwner && <span> · {settings.openClawEntityOwner}</span>}
                  {settings.openClawTrack === "PBJ Formal (Pemerintah/BUMN)" && settings.openClawClauseRefRequired && <span> · Klausul wajib</span>}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic mode summary — shown only when Advanced is OFF */}
      {!isAdvanced && (
        <Card className="border border-dashed bg-muted/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Pengaturan Lanjutan — Ringkasan
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={() => setIsAdvanced(true)}
                data-testid="btn-enable-advanced-from-summary"
              >
                <Settings2 className="h-3 w-3" />
                Ubah
              </Button>
            </div>
            <CardDescription className="text-xs">Aktifkan Mode Lanjutan di pojok kanan atas untuk mengubah nilai ini secara detail.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {/* Kualitas Respons */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3" /> Kualitas Respons
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Kedalaman Jawaban", value: settings.responseDepth },
                  { label: "Format Output Utama", value: settings.outputFormat },
                  { label: "Pemeriksaan Mandiri", value: settings.selfCorrection ? "Aktif" : "Nonaktif", bool: true, ok: settings.selfCorrection },
                ].map(({ label, value, bool, ok }) => (
                  <div key={label} className="flex items-center justify-between gap-2 bg-muted/40 rounded-md px-2.5 py-1.5">
                    <span className="text-xs text-muted-foreground truncate">{label}</span>
                    <Badge variant="secondary" className={`text-xs py-0 font-normal shrink-0 ${bool ? (ok ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-0" : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-0") : ""}`}>{value}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Klarifikasi & Risiko */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <HelpCircle className="h-3 w-3" /> Klarifikasi & Risiko
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Minta Klarifikasi Dulu", value: settings.clarifyBeforeAnswer ? "Ya" : "Tidak", bool: true, ok: settings.clarifyBeforeAnswer },
                  { label: "Tampilkan Peringatan Risiko", value: settings.showRiskWarnings ? "Aktif" : "Nonaktif", bool: true, ok: settings.showRiskWarnings },
                  { label: "Saat Tidak Yakin", value: settings.uncertaintyHandling.length > 24 ? settings.uncertaintyHandling.slice(0, 24) + "…" : settings.uncertaintyHandling },
                ].map(({ label, value, bool, ok }: { label: string; value: string; bool?: boolean; ok?: boolean }) => (
                  <div key={label} className="flex items-center justify-between gap-2 bg-muted/40 rounded-md px-2.5 py-1.5">
                    <span className="text-xs text-muted-foreground truncate">{label}</span>
                    <Badge variant="secondary" className={`text-xs py-0 font-normal shrink-0 ${bool ? (ok ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-0" : "bg-muted text-muted-foreground border-0") : ""}`}>{value}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Memori & Interaksi */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Ear className="h-3 w-3" /> Memori & Interaksi
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Retensi Konteks", value: `${settings.contextRetention} pesan` },
                  { label: "Bantuan Proaktif", value: settings.proactiveAssistanceLevel },
                  { label: "Gaya Interaksi", value: settings.interactionStyle },
                  { label: "Empati Kontekstual", value: settings.contextualEmpathy },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2 bg-muted/40 rounded-md px-2.5 py-1.5">
                    <span className="text-xs text-muted-foreground truncate">{label}</span>
                    <Badge variant="secondary" className="text-xs py-0 font-normal shrink-0">{value}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Pembelajaran */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <GraduationCap className="h-3 w-3" /> Pembelajaran Adaptif
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Mode Pembelajaran", value: settings.adaptiveLearningMode },
                  { label: "Simpan Sinyal Interaksi", value: settings.storeInteractionSignals ? "Ya" : "Tidak", bool: true, ok: settings.storeInteractionSignals },
                ].map(({ label, value, bool, ok }: { label: string; value: string; bool?: boolean; ok?: boolean }) => (
                  <div key={label} className="flex items-center justify-between gap-2 bg-muted/40 rounded-md px-2.5 py-1.5">
                    <span className="text-xs text-muted-foreground truncate">{label}</span>
                    <Badge variant="secondary" className={`text-xs py-0 font-normal shrink-0 ${bool ? (ok ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-0" : "bg-muted text-muted-foreground border-0") : ""}`}>{value}</Badge>
                  </div>
                ))}
              </div>
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

      {/* Memory Management Section */}
      {agent && <MemoryManager agentId={String(agent.id)} />}

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
