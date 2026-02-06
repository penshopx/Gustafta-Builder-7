import { useState } from "react";
import { Blocks, Plus, Trash2, Pencil, CheckSquare, Calculator, AlertTriangle, TrendingUp, FileOutput, Wrench, Play, BarChart3, ClipboardList, Radar, Loader2, ListChecks, Users, FileWarning } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMiniApps, useCreateMiniApp, useUpdateMiniApp, useDeleteMiniApp, useMiniAppResults, useCreateMiniAppResult, useRunAIMiniApp } from "@/hooks/use-mini-apps";
import type { Agent, MiniApp, MiniAppType, MiniAppResult } from "@shared/schema";

interface MiniAppsPanelProps {
  agent: Agent;
}

const miniAppTypeLabels: Record<MiniAppType, string> = {
  checklist: "Checklist",
  calculator: "Kalkulator",
  risk_assessment: "Penilaian Risiko",
  progress_tracker: "Pelacak Progres",
  document_generator: "Generator Dokumen",
  custom: "Custom",
  issue_log: "Issue Log",
  action_tracker: "Action Tracker",
  change_log: "Change Log",
  project_snapshot: "Project Snapshot",
  decision_summary: "Decision Summary",
  risk_radar: "Risk Radar",
};

const miniAppTypeIcons: Record<MiniAppType, typeof CheckSquare> = {
  checklist: CheckSquare,
  calculator: Calculator,
  risk_assessment: AlertTriangle,
  progress_tracker: TrendingUp,
  document_generator: FileOutput,
  custom: Wrench,
  issue_log: ListChecks,
  action_tracker: Users,
  change_log: FileWarning,
  project_snapshot: BarChart3,
  decision_summary: ClipboardList,
  risk_radar: Radar,
};

const miniAppTypeDescriptions: Record<MiniAppType, string> = {
  checklist: "Daftar tugas yang bisa dicentang untuk melacak penyelesaian",
  calculator: "Kalkulator dengan formula kustom untuk perhitungan",
  risk_assessment: "Penilaian risiko dengan kriteria dan scoring",
  progress_tracker: "Pelacak kemajuan dengan milestone dan persentase",
  document_generator: "Generator dokumen dari template dan data proyek",
  custom: "Aplikasi kustom dengan konfigurasi bebas",
  issue_log: "Daftar isu aktif & histori untuk monitoring proyek (AI-powered)",
  action_tracker: "Pelacakan tindak lanjut: siapa melakukan apa, kapan (AI-powered)",
  change_log: "Catatan perubahan desain/metode/scope dan dampaknya (AI-powered)",
  project_snapshot: "Snapshot status proyek dari data Otak Proyek (AI-powered)",
  decision_summary: "Ringkasan keputusan eksekutif dari data Otak Proyek (AI-powered)",
  risk_radar: "Penilaian risiko proyek dari data Otak Proyek (AI-powered)",
};

const AI_MINI_APP_TYPES: MiniAppType[] = ["project_snapshot", "decision_summary", "risk_radar", "issue_log", "action_tracker", "change_log"];

const DEFAULT_MINI_APP_CONFIGS: Partial<Record<MiniAppType, { name: string; description: string; items?: string[]; config?: Record<string, any> }>> = {
  checklist: {
    name: "Checklist Penanganan Isu",
    description: "Daftar langkah standar untuk memastikan isu dianalisa, diputuskan, ditindaklanjuti, dan ditutup.",
    items: [
      "Isu teridentifikasi & deskripsi jelas",
      "Lokasi/elemen isu terkonfirmasi",
      "Data pendukung terkumpul (foto/laporan/uji)",
      "Analisa teknis dilakukan",
      "Alternatif solusi dibandingkan",
      "Risiko dinilai",
      "Keputusan diambil & dicatat",
      "PIC & due date ditetapkan",
      "Tindak lanjut dieksekusi",
      "Verifikasi selesai & isu ditutup",
    ],
    config: {
      mode: "task_list",
      link_to: { project: "project_name", issue: ["issue_type", "issue_location", "issue_status"] },
      rules: { block_close_if_unfinished: true, show_completion_rate: true },
    },
  },
  calculator: {
    name: "Kalkulator",
    description: "Hitung cepat volume/berat/kebutuhan material.",
    config: {
      mode: "calculator",
      presets: [
        { name: "Volume Beton", inputs: ["panjang_m", "lebar_m", "tinggi_m"], formula: "panjang_m * lebar_m * tinggi_m", unit: "m3" },
        { name: "Luas Bekisting", inputs: ["panjang_m", "tinggi_m"], formula: "panjang_m * tinggi_m", unit: "m2" },
      ],
      rules: { round_result: 3, reject_negative: true },
    },
  },
  risk_assessment: {
    name: "Penilaian Risiko",
    description: "Menilai risiko isu/keputusan dengan skor likelihood x impact dan prioritas mitigasi.",
    config: {
      mode: "risk_scoring",
      risk_categories: ["Safety", "Quality", "Structural", "Cost", "Schedule", "Environment"],
      scoring: {
        likelihood_scale: [1, 2, 3, 4, 5],
        impact_scale: [1, 2, 3, 4, 5],
        method: "likelihood_x_impact",
        thresholds: { low_max: 6, medium_max: 14, high_min: 15 },
      },
      sources: ["time_constraint", "cost_constraint", "site_access", "environmental_factors", "issue_type", "issue_location", "issue_status"],
      outputs: ["risk_category", "likelihood", "impact", "risk_level", "mitigation"],
    },
  },
  progress_tracker: {
    name: "Pelacak Progres",
    description: "Monitoring progres rencana vs aktual untuk paket pekerjaan utama.",
    config: {
      mode: "progress_tracking",
      metrics: { planned_field: "planned_progress", actual_field: "actual_progress", unit: "percent" },
      rules: {
        status_logic: [
          { if: "actual >= planned + 5", status: "Ahead" },
          { if: "actual >= planned - 5", status: "On Track" },
          { if: "actual < planned - 5", status: "Delay" },
        ],
        require_note_if_delay: true,
      },
      summary: { show_top_delays: true, limit: 5 },
    },
  },
  document_generator: {
    name: "Generator Dokumen",
    description: "Menghasilkan dokumen standar dari data Project Brain.",
    config: {
      mode: "document_generator",
      document_types: ["Weekly Report", "Laporan Inspeksi", "Notulen Keputusan", "Ringkasan Risiko", "Progress Update"],
      sources: [
        "project_name", "project_type", "project_stage", "location", "owner_client",
        "issue_type", "issue_location", "issue_status", "issue_since",
        "decision_summary", "decision_reason", "decision_risk_level", "decision_date",
        "inspection_notes", "last_updated",
      ],
      format: {
        sections: ["Executive Summary", "Project Context", "Issues & Status", "Decisions", "Risks", "Quality/Inspection Notes", "Next Actions"],
        style: "bullet_first",
      },
      rules: { no_hallucination: true, mark_missing_as: "Data belum tersedia" },
    },
  },
  custom: {
    name: "Custom",
    description: "Aplikasi kustom untuk kebutuhan spesifik proyek.",
    config: {
      mode: "custom",
      note: "Gunakan mini app ini untuk kebutuhan spesifik. Batasi scope dan jangan duplikasi fungsi Issue/Action/Decision/Risk.",
      rules: { max_fields_recommended: 7, single_purpose_only: true },
    },
  },
  issue_log: {
    name: "Issue Log",
    description: "Daftar isu aktif & histori isu untuk monitoring proyek.",
    config: {
      mode: "issue_log",
      fields: ["issue_type", "issue_location", "issue_status", "issue_since", "decision_risk_level", "last_updated"],
      prioritization: {
        sort: ["decision_risk_level_desc", "issue_since_asc"],
        highlight_if: { status: ["Open", "Monitoring"], risk: ["High"] },
      },
      rules: { flag_if_open_days_over: 14, recommended_next_step: true },
    },
  },
  action_tracker: {
    name: "Action Tracker",
    description: "Pelacakan tugas tindak lanjut (who does what by when).",
    config: {
      mode: "action_tracker",
      fields: ["action_item", "related_issue", "assigned_to", "due_date", "status", "note"],
      status_values: ["Not Started", "In Progress", "Done", "Blocked"],
      rules: { overdue_logic: "today > due_date AND status != Done", block_issue_close_if_overdue: true, show_overdue_first: true },
      views: { default: "overdue_then_due_soon", due_soon_days: 7 },
    },
  },
  change_log: {
    name: "Change Log",
    description: "Catatan perubahan desain/metode/scope dan dampaknya.",
    config: {
      mode: "change_log",
      change_types: ["Design", "Method", "Scope"],
      impact_areas: ["Cost", "Time", "Quality", "Safety", "Multi"],
      fields: ["change_type", "description", "reason", "impact_area", "approval_status", "date"],
      approval_status_values: ["Draft", "Proposed", "Approved", "Rejected"],
      rules: { require_reason: true, require_impact_area: true, if_impact_multi_then_recommend: "run_risk_assessment" },
    },
  },
  project_snapshot: {
    name: "Project Snapshot",
    description: "Ringkasan kondisi proyek dalam satu tampilan untuk owner/manajemen.",
    config: {
      output_format: "executive_summary",
      max_bullets: 7,
      focus: ["project_stage", "project_type", "location", "open_issues", "high_risks", "latest_decision", "last_updated"],
    },
  },
  decision_summary: {
    name: "Decision Summary",
    description: "Ringkasan keputusan penting proyek untuk audit trail dan pembelajaran.",
    config: {
      sort: "decision_date_desc",
      limit: 5,
      format: "what_why_risk_impact_next",
      fields: ["decision_summary", "decision_reason", "decision_date", "decision_risk_level", "project_stage"],
    },
  },
  risk_radar: {
    name: "Risk Radar",
    description: "Peta risiko per kategori dan tren.",
    config: {
      group_by: "risk_category",
      trend_analysis: true,
      alert_rules: { high_and_increasing: "highlight", multiple_high_risk: "highlight" },
      sources: ["decision_risk_level", "issue_status", "time_constraint", "cost_constraint", "environmental_factors"],
    },
  },
};

export function MiniAppsPanel({ agent }: MiniAppsPanelProps) {
  const { toast } = useToast();
  const agentId = String(agent.id);

  const { data: miniApps = [], isLoading } = useMiniApps(agentId);
  const createMiniApp = useCreateMiniApp();
  const updateMiniApp = useUpdateMiniApp();
  const deleteMiniApp = useDeleteMiniApp();

  const createMiniAppResult = useCreateMiniAppResult();
  const runAIMiniApp = useRunAIMiniApp();

  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<MiniApp | null>(null);
  const [viewingApp, setViewingApp] = useState<MiniApp | null>(null);
  const [runInput, setRunInput] = useState<Record<string, any>>({});

  const [newApp, setNewApp] = useState({
    name: "",
    description: "",
    type: "checklist" as MiniAppType,
    config: {} as Record<string, any>,
    icon: "app",
  });

  const [editApp, setEditApp] = useState({
    name: "",
    description: "",
    type: "checklist" as MiniAppType,
    config: {} as Record<string, any>,
    icon: "app",
  });

  const [checklistItems, setChecklistItems] = useState<string[]>([""]);
  const [editChecklistItems, setEditChecklistItems] = useState<string[]>([""]);

  const handleCreate = () => {
    if (!newApp.name) {
      toast({ title: "Error", description: "Nama mini app wajib diisi.", variant: "destructive" });
      return;
    }
    let config = newApp.config;
    if (newApp.type === "checklist") {
      config = { items: checklistItems.filter((item) => item.trim() !== "") };
    }
    createMiniApp.mutate(
      { agentId, name: newApp.name, description: newApp.description, type: newApp.type, config, icon: newApp.icon },
      {
        onSuccess: () => {
          toast({ title: "Berhasil", description: "Mini App berhasil dibuat." });
          setCreateDialogOpen(false);
          setNewApp({ name: "", description: "", type: "checklist", config: {}, icon: "app" });
          setChecklistItems([""]);
        },
        onError: () => {
          toast({ title: "Error", description: "Gagal membuat Mini App.", variant: "destructive" });
        },
      }
    );
  };

  const handleEdit = (app: MiniApp) => {
    setEditingApp(app);
    setEditApp({
      name: app.name,
      description: app.description || "",
      type: app.type as MiniAppType,
      config: typeof app.config === "object" && app.config ? (app.config as Record<string, any>) : {},
      icon: app.icon || "app",
    });
    if (app.type === "checklist") {
      const appConfig = typeof app.config === "object" && app.config ? (app.config as Record<string, any>) : {};
      setEditChecklistItems(Array.isArray(appConfig.items) ? appConfig.items : [""]);
    }
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingApp) return;
    let config = editApp.config;
    if (editApp.type === "checklist") {
      config = { items: editChecklistItems.filter((item) => item.trim() !== "") };
    }
    updateMiniApp.mutate(
      { id: String(editingApp.id), agentId, data: { name: editApp.name, description: editApp.description, config } },
      {
        onSuccess: () => {
          toast({ title: "Berhasil", description: "Mini App berhasil diperbarui." });
          setEditDialogOpen(false);
          setEditingApp(null);
        },
        onError: () => {
          toast({ title: "Error", description: "Gagal memperbarui Mini App.", variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteMiniApp.mutate(
      { id, agentId },
      {
        onSuccess: () => toast({ title: "Berhasil", description: "Mini App berhasil dihapus." }),
      }
    );
  };

  const handleViewDetail = (app: MiniApp) => {
    setViewingApp(app);
    setRunInput({});
    setAiAnalysisResult(null);
    setDetailDialogOpen(true);
  };

  const handleRunAIMiniApp = () => {
    if (!viewingApp) return;
    setAiAnalysisResult(null);
    runAIMiniApp.mutate(
      { id: String(viewingApp.id), agentId },
      {
        onSuccess: (result) => {
          setAiAnalysisResult(result.data.analysis);
          toast({ title: "Berhasil", description: "Analisis AI berhasil dibuat." });
        },
        onError: (error: any) => {
          let msg = "Gagal menjalankan analisis AI.";
          if (error?.message) {
            const match = error.message.match(/\d+:\s*(.+)/);
            if (match) {
              try {
                const parsed = JSON.parse(match[1]);
                msg = parsed.error || msg;
              } catch {
                msg = match[1] || msg;
              }
            } else {
              msg = error.message;
            }
          }
          toast({ title: "Error", description: msg, variant: "destructive" });
        },
      }
    );
  };

  const handleRunMiniApp = () => {
    if (!viewingApp) return;
    const config = typeof viewingApp.config === "object" && viewingApp.config ? (viewingApp.config as Record<string, any>) : {};

    let output: Record<string, any> = {};
    if (viewingApp.type === "checklist") {
      const items = Array.isArray(config.items) ? config.items : [];
      const checked = runInput.checked || {};
      const total = items.length;
      const done = Object.values(checked).filter(Boolean).length;
      output = { items, checked, total, completed: done, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
    } else {
      output = { ...runInput, executedAt: new Date().toISOString() };
    }

    createMiniAppResult.mutate(
      { miniAppId: String(viewingApp.id), agentId, input: runInput, output, status: "completed" as const },
      {
        onSuccess: () => {
          toast({ title: "Berhasil", description: "Mini App berhasil dijalankan." });
          setRunInput({});
        },
        onError: () => {
          toast({ title: "Error", description: "Gagal menjalankan Mini App.", variant: "destructive" });
        },
      }
    );
  };

  const renderChecklistEditor = (items: string[], setItems: (items: string[]) => void, testIdPrefix: string) => (
    <div className="space-y-2">
      <Label>Item Checklist</Label>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => {
              const updated = [...items];
              updated[index] = e.target.value;
              setItems(updated);
            }}
            placeholder={`Item ${index + 1}`}
            data-testid={`${testIdPrefix}-item-${index}`}
          />
          {items.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              data-testid={`${testIdPrefix}-remove-${index}`}
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setItems([...items, ""])}
        data-testid={`${testIdPrefix}-add`}
      >
        <Plus className="w-3 h-3 mr-1" />
        Tambah Item
      </Button>
    </div>
  );

  const renderJsonEditor = (config: Record<string, any>, setConfig: (c: Record<string, any>) => void, testIdPrefix: string, collapsed = false) => {
    const jsonStr = typeof config === "object" ? JSON.stringify(config, null, 2) : "{}";
    const lineCount = jsonStr.split("\n").length;
    return (
      <div className="space-y-2">
        <Label>Konfigurasi (JSON)</Label>
        <Textarea
          value={jsonStr}
          onChange={(e) => {
            try {
              setConfig(JSON.parse(e.target.value));
            } catch {}
          }}
          rows={Math.min(Math.max(lineCount + 1, 4), 16)}
          className="font-mono text-xs"
          data-testid={`${testIdPrefix}-json`}
        />
      </div>
    );
  };

  const renderConfigByType = (type: MiniAppType, config: Record<string, any>, setConfig: (c: Record<string, any>) => void, testIdPrefix: string) => {
    return renderJsonEditor(config, setConfig, testIdPrefix);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
            <Blocks className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            Mini Apps
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Aplikasi kecil yang memproses data dari Otak Proyek
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-miniapp">
          <Plus className="w-4 h-4 mr-2" />
          Buat Mini App
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4"><div className="h-10 bg-muted rounded mb-3" /><div className="h-4 bg-muted rounded w-2/3" /></CardContent>
            </Card>
          ))}
        </div>
      ) : miniApps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Blocks className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">Belum Ada Mini Apps</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Buat mini app untuk memproses data proyek Anda
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} variant="outline" data-testid="button-create-first-miniapp">
              <Plus className="w-4 h-4 mr-2" />
              Buat Mini App Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {miniApps.map((app) => {
            const TypeIcon = miniAppTypeIcons[app.type as MiniAppType] || Wrench;
            return (
              <Card key={app.id} data-testid={`miniapp-item-${app.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <TypeIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium truncate">{app.name}</h4>
                        <Badge variant="secondary" className="text-xs mt-0.5">
                          {miniAppTypeLabels[app.type as MiniAppType] || app.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(app)}
                        data-testid={`button-edit-miniapp-${app.id}`}
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(String(app.id))}
                        data-testid={`button-delete-miniapp-${app.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  {app.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{app.description}</p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleViewDetail(app)}
                    data-testid={`button-view-miniapp-${app.id}`}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Mini App Baru</DialogTitle>
            <DialogDescription>Pilih tipe dan konfigurasi mini app Anda</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tipe Mini App</Label>
              <Select
                value={newApp.type}
                onValueChange={(val: MiniAppType) => {
                  const defaults = DEFAULT_MINI_APP_CONFIGS[val];
                  const updatedApp = {
                    ...newApp,
                    type: val,
                    config: defaults?.config || {},
                    name: !newApp.name || DEFAULT_MINI_APP_CONFIGS[newApp.type]?.name === newApp.name ? (defaults?.name || "") : newApp.name,
                    description: !newApp.description || DEFAULT_MINI_APP_CONFIGS[newApp.type]?.description === newApp.description ? (defaults?.description || "") : newApp.description,
                  };
                  setNewApp(updatedApp);
                  if (val === "checklist" && defaults?.items) {
                    setChecklistItems(defaults.items);
                  } else if (val === "checklist") {
                    setChecklistItems([""]);
                  }
                }}
              >
                <SelectTrigger data-testid="select-miniapp-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(miniAppTypeLabels).map(([val, label]) => {
                    const Icon = miniAppTypeIcons[val as MiniAppType];
                    return (
                      <SelectItem key={val} value={val}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{miniAppTypeDescriptions[newApp.type]}</p>
            </div>
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input
                value={newApp.name}
                onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                placeholder="Contoh: Checklist Dokumen KPR"
                data-testid="input-miniapp-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi (opsional)</Label>
              <Textarea
                value={newApp.description}
                onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                placeholder="Deskripsi singkat..."
                rows={2}
                data-testid="input-miniapp-description"
              />
            </div>
            {newApp.type === "checklist" && renderChecklistEditor(checklistItems, setChecklistItems, "create-checklist")}
            {renderConfigByType(newApp.type, newApp.config, (config) => setNewApp({ ...newApp, config }), "create-config")}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Batal</Button>
            <Button
              onClick={handleCreate}
              disabled={createMiniApp.isPending}
              data-testid="button-confirm-create-miniapp"
            >
              {createMiniApp.isPending ? "Membuat..." : "Buat Mini App"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Mini App</DialogTitle>
            <DialogDescription>Perbarui konfigurasi mini app</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input
                value={editApp.name}
                onChange={(e) => setEditApp({ ...editApp, name: e.target.value })}
                data-testid="input-edit-miniapp-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={editApp.description}
                onChange={(e) => setEditApp({ ...editApp, description: e.target.value })}
                rows={2}
                data-testid="input-edit-miniapp-description"
              />
            </div>
            {editApp.type === "checklist" && renderChecklistEditor(editChecklistItems, setEditChecklistItems, "edit-checklist")}
            {renderConfigByType(editApp.type, editApp.config, (config) => setEditApp({ ...editApp, config }), "edit-config")}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Batal</Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateMiniApp.isPending}
              data-testid="button-confirm-edit-miniapp"
            >
              {updateMiniApp.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingApp?.name}</DialogTitle>
            <DialogDescription>
              {miniAppTypeLabels[viewingApp?.type as MiniAppType] || viewingApp?.type}
            </DialogDescription>
          </DialogHeader>
          {viewingApp && (
            <Tabs defaultValue="run">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="run" data-testid="tab-miniapp-run">Jalankan</TabsTrigger>
                <TabsTrigger value="results" data-testid="tab-miniapp-results">Riwayat</TabsTrigger>
              </TabsList>

              <TabsContent value="run" className="space-y-4 mt-3">
                {AI_MINI_APP_TYPES.includes(viewingApp.type as MiniAppType) && (
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-md p-4 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {viewingApp.type === "project_snapshot" && "Menghasilkan snapshot status proyek berdasarkan data Otak Proyek yang aktif. Mencakup status keseluruhan, ringkasan isu, indikator risiko, dan keputusan terakhir."}
                        {viewingApp.type === "decision_summary" && "Menghasilkan ringkasan keputusan eksekutif berdasarkan data Otak Proyek. Mencakup overview proyek, keputusan kunci, dampak isu, dan rekomendasi."}
                        {viewingApp.type === "risk_radar" && "Menilai level risiko proyek berdasarkan data Otak Proyek. Mencakup risiko teknis, jadwal, dan biaya dengan alasan detail."}
                        {viewingApp.type === "issue_log" && "Menghasilkan daftar isu aktif & histori berdasarkan data Otak Proyek. Mencakup prioritas isu, status, dan rekomendasi langkah selanjutnya."}
                        {viewingApp.type === "action_tracker" && "Menghasilkan daftar tindak lanjut berdasarkan isu dan keputusan di Otak Proyek. Mencakup aksi, PIC, due date, dan status."}
                        {viewingApp.type === "change_log" && "Menganalisis perubahan desain/metode/scope dari data Otak Proyek. Mencakup dampak dan kebutuhan approval."}
                      </p>
                      <p className="text-xs text-muted-foreground">Pastikan ada Otak Proyek yang aktif sebelum menjalankan.</p>
                    </div>
                    <Button
                      onClick={handleRunAIMiniApp}
                      disabled={runAIMiniApp.isPending}
                      className="w-full"
                      data-testid="button-run-ai-miniapp"
                    >
                      {runAIMiniApp.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Menganalisis...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Jalankan Analisis AI
                        </>
                      )}
                    </Button>
                    {aiAnalysisResult && (
                      <div className="bg-muted/30 border rounded-md p-4 space-y-2">
                        <h4 className="text-sm font-medium">Hasil Analisis</h4>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed" data-testid="ai-analysis-result">
                          {aiAnalysisResult}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {viewingApp.type === "checklist" && (() => {
                  const config = typeof viewingApp.config === "object" && viewingApp.config ? (viewingApp.config as Record<string, any>) : {};
                  const items = Array.isArray(config.items) ? config.items : [];
                  const checked = runInput.checked || {};
                  return items.length > 0 ? (
                    <div className="space-y-2">
                      {items.map((item: string, i: number) => (
                        <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!checked[i]}
                            onChange={(e) =>
                              setRunInput({ ...runInput, checked: { ...checked, [i]: e.target.checked } })
                            }
                            className="rounded"
                            data-testid={`run-checklist-item-${i}`}
                          />
                          <span className={checked[i] ? "line-through text-muted-foreground" : ""}>{item}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada item checklist.</p>
                  );
                })()}

                {viewingApp.type === "calculator" && (
                  <div className="space-y-3">
                    {(() => {
                      const config = typeof viewingApp.config === "object" && viewingApp.config ? (viewingApp.config as Record<string, any>) : {};
                      const vars = typeof config.variables === "string" ? config.variables.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
                      return vars.map((v: string) => (
                        <div key={v} className="space-y-1">
                          <Label className="text-sm">{v}</Label>
                          <Input
                            type="number"
                            value={runInput[v] || ""}
                            onChange={(e) => setRunInput({ ...runInput, [v]: e.target.value })}
                            placeholder={`Masukkan ${v}`}
                            data-testid={`run-calc-${v}`}
                          />
                        </div>
                      ));
                    })()}
                    {(() => {
                      const config = typeof viewingApp.config === "object" && viewingApp.config ? (viewingApp.config as Record<string, any>) : {};
                      return config.formula && (
                        <p className="text-xs text-muted-foreground">Formula: {config.formula}</p>
                      );
                    })()}
                  </div>
                )}

                {viewingApp.type === "progress_tracker" && (() => {
                  const config = typeof viewingApp.config === "object" && viewingApp.config ? (viewingApp.config as Record<string, any>) : {};
                  const milestones = typeof config.milestones === "string" ? config.milestones.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
                  return (
                    <div className="space-y-2">
                      {milestones.map((m: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <Label className="text-sm flex-1">{m}</Label>
                          <Select
                            value={runInput[`milestone_${i}`] || "pending"}
                            onValueChange={(val) => setRunInput({ ...runInput, [`milestone_${i}`]: val })}
                          >
                            <SelectTrigger className="w-32" data-testid={`run-milestone-${i}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Belum</SelectItem>
                              <SelectItem value="in_progress">Proses</SelectItem>
                              <SelectItem value="done">Selesai</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {viewingApp.type === "risk_assessment" && (() => {
                  const config = typeof viewingApp.config === "object" && viewingApp.config ? (viewingApp.config as Record<string, any>) : {};
                  const criteria = typeof config.criteria === "string" ? config.criteria.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
                  return (
                    <div className="space-y-2">
                      {criteria.map((c: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <Label className="text-sm flex-1">{c}</Label>
                          <Select
                            value={runInput[`risk_${i}`] || "low"}
                            onValueChange={(val) => setRunInput({ ...runInput, [`risk_${i}`]: val })}
                          >
                            <SelectTrigger className="w-28" data-testid={`run-risk-${i}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Rendah</SelectItem>
                              <SelectItem value="medium">Sedang</SelectItem>
                              <SelectItem value="high">Tinggi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {(viewingApp.type === "document_generator" || viewingApp.type === "custom") && (
                  <div className="space-y-2">
                    <Label>Input Data (JSON)</Label>
                    <Textarea
                      value={typeof runInput.data === "string" ? runInput.data : JSON.stringify(runInput, null, 2)}
                      onChange={(e) => {
                        try { setRunInput(JSON.parse(e.target.value)); } catch { setRunInput({ data: e.target.value }); }
                      }}
                      rows={4}
                      placeholder='{"key": "value"}'
                      data-testid="run-custom-input"
                    />
                  </div>
                )}

                {!AI_MINI_APP_TYPES.includes(viewingApp.type as MiniAppType) && (
                  <Button
                    onClick={handleRunMiniApp}
                    disabled={createMiniAppResult.isPending}
                    className="w-full"
                    data-testid="button-run-miniapp"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {createMiniAppResult.isPending ? "Menjalankan..." : "Jalankan & Simpan"}
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="results" className="mt-3">
                <MiniAppResultsList miniAppId={String(viewingApp.id)} appType={viewingApp.type as MiniAppType} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniAppResultsList({ miniAppId, appType }: { miniAppId: string; appType: MiniAppType }) {
  const { data: results = [], isLoading } = useMiniAppResults(miniAppId);

  if (isLoading) {
    return (
      <div className="space-y-3 py-2">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-3"><div className="h-4 bg-muted rounded w-1/2 mb-2" /><div className="h-3 bg-muted rounded w-full" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">Belum ada riwayat eksekusi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 py-2">
      {results.map((result) => {
        const output = typeof result.output === "object" && result.output ? (result.output as Record<string, any>) : {};
        return (
          <Card key={result.id} data-testid={`miniapp-result-${result.id}`}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {result.status === "completed" ? "Selesai" : result.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(result.createdAt).toLocaleString("id-ID")}
                </span>
              </div>
              {appType === "checklist" && output.percentage !== undefined && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progres</span>
                    <span className="font-medium">{output.completed}/{output.total} ({output.percentage}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${output.percentage}%` }}
                    />
                  </div>
                </div>
              )}
              {AI_MINI_APP_TYPES.includes(appType) && output.analysis && (
                <div className="text-xs whitespace-pre-wrap leading-relaxed max-h-40 overflow-auto">
                  {output.analysis}
                </div>
              )}
              {appType !== "checklist" && !AI_MINI_APP_TYPES.includes(appType) && (
                <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-24">
                  {JSON.stringify(output, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
