import { useState, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { CompanyProfile } from "@shared/schema";
import {
  Building2, ClipboardList, CheckSquare, AlertTriangle, FileText,
  ChevronRight, ChevronLeft, Sparkles, Loader2, Plus, Edit3,
  CheckCircle2, XCircle, AlertCircle, Copy, BarChart3, Shield, RotateCcw,
  ArrowLeft
} from "lucide-react";

type PackType = "pelaksana_konstruksi" | "konsultansi_mk";

const PACK_META: Record<PackType, { label: string; icon: React.ReactNode; color: string; description: string }> = {
  pelaksana_konstruksi: {
    label: "Pelaksana Konstruksi",
    icon: <Building2 className="h-5 w-5" />,
    color: "blue",
    description: "Vendor/kontraktor pekerjaan konstruksi gedung, jalan, jembatan. Regulasi: Perpres 46/2025.",
  },
  konsultansi_mk: {
    label: "Konsultansi Manajemen Konstruksi",
    icon: <ClipboardList className="h-5 w-5" />,
    color: "purple",
    description: "Konsultan Manajemen Konstruksi (MK). Proposal teknis modular + pendampingan SMKK proyek.",
  },
};

const OUTPUT_OPTIONS = [
  { id: "checklist", label: "Checklist Kelengkapan + Skor" },
  { id: "risk_review", label: "Risk & Compliance Review" },
  { id: "draft_surat_penawaran", label: "Draft Surat Penawaran" },
  { id: "draft_metode", label: "Draft Metode Pelaksanaan / Proposal Teknis" },
  { id: "draft_smkk", label: "Draft Rencana SMKK" },
  { id: "draft_pernyataan", label: "Draft Pernyataan Kepatuhan Perpres 46/2025" },
];

const STEPS = [
  { id: 0, label: "Pilih Output" },
  { id: 1, label: "Profil Perusahaan" },
  { id: 2, label: "Data Tender" },
  { id: 3, label: "Persyaratan" },
  { id: 4, label: "Strategi Teknis" },
  { id: 5, label: "Kepatuhan" },
  { id: 6, label: "Hasil" },
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400" :
    score >= 60 ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400" :
    "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400";
  const label = score >= 80 ? "Green" : score >= 60 ? "Yellow" : "Red";
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${color} font-semibold text-sm`}>
      <span className="text-2xl font-bold">{score}</span>
      <span className="text-xs opacity-80">/ 100 · {label}</span>
    </div>
  );
}

function ChecklistTable({ items }: { items: Array<{ code: string; section: string; item: string; status: string; note?: string }> }) {
  const sections = Array.from(new Set(items.map(i => i.section)));
  return (
    <div className="space-y-4">
      {sections.map(section => (
        <div key={section}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{section}</p>
          <div className="rounded-lg border overflow-hidden">
            {items.filter(i => i.section === section).map((item, idx) => (
              <div key={idx} className={`flex items-start gap-3 p-3 text-sm ${idx % 2 === 0 ? "bg-muted/20" : ""}`}>
                <span className="font-mono text-xs text-muted-foreground w-8 shrink-0 pt-0.5">{item.code}</span>
                <div className="flex-1 min-w-0">
                  <p className="leading-snug">{item.item}</p>
                  {item.note && <p className="text-xs text-muted-foreground mt-1">{item.note}</p>}
                </div>
                <div className="shrink-0">
                  {item.status === "Ada" ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Ada
                    </span>
                  ) : item.status === "Perlu revisi" ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                      <AlertCircle className="h-3 w-3" /> Perlu revisi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      <XCircle className="h-3 w-3" /> Belum
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RiskCards({ items }: { items: Array<{ level: string; finding: string; impact: string; recommendation: string }> }) {
  const order = ["red", "yellow", "green"];
  const sorted = [...items].sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));
  return (
    <div className="space-y-3">
      {sorted.map((item, idx) => (
        <div key={idx} className={`rounded-lg border-l-4 p-4 ${
          item.level === "red" ? "border-red-500 bg-red-50 dark:bg-red-900/10" :
          item.level === "yellow" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10" :
          "border-green-500 bg-green-50 dark:bg-green-900/10"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {item.level === "red" ? <XCircle className="h-4 w-4 text-red-600" /> :
             item.level === "yellow" ? <AlertCircle className="h-4 w-4 text-yellow-600" /> :
             <CheckCircle2 className="h-4 w-4 text-green-600" />}
            <span className={`text-xs font-bold uppercase ${
              item.level === "red" ? "text-red-700" : item.level === "yellow" ? "text-yellow-700" : "text-green-700"
            }`}>
              {item.level === "red" ? "Red Flag" : item.level === "yellow" ? "Yellow Flag" : "Green"}
            </span>
          </div>
          <p className="text-sm font-medium mb-1">{item.finding}</p>
          <p className="text-xs text-muted-foreground mb-2"><span className="font-medium">Dampak:</span> {item.impact}</p>
          <p className="text-xs text-muted-foreground"><span className="font-medium">Rekomendasi:</span> {item.recommendation}</p>
        </div>
      ))}
    </div>
  );
}

function DraftViewer({ drafts }: { drafts: Record<string, string> }) {
  const [activeKey, setActiveKey] = useState(Object.keys(drafts)[0] || "");
  const { toast } = useToast();

  const DRAFT_LABELS: Record<string, string> = {
    surat_penawaran: "Surat Penawaran",
    metode_pelaksanaan: "Metode Pelaksanaan",
    rencana_smkk: "Rencana SMKK",
    pernyataan_kepatuhan: "Pernyataan Kepatuhan",
    proposal_teknis: "Proposal Teknis",
    laporan_smkk: "Template Laporan SMKK",
  };

  const keys = Object.keys(drafts);
  if (keys.length === 0) return <p className="text-sm text-muted-foreground">Tidak ada draft yang dihasilkan.</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {keys.map(k => (
          <button
            key={k}
            onClick={() => setActiveKey(k)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              activeKey === k ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
            }`}
          >
            {DRAFT_LABELS[k] || k}
          </button>
        ))}
      </div>
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex justify-end mb-3">
          <Button
            size="sm" variant="ghost" className="gap-2 h-7 text-xs"
            onClick={() => {
              navigator.clipboard.writeText(drafts[activeKey] || "");
              toast({ description: "Draft disalin ke clipboard" });
            }}
          >
            <Copy className="h-3 w-3" /> Salin
          </Button>
        </div>
        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{drafts[activeKey]}</pre>
      </div>
    </div>
  );
}

export default function TenderWizardPage() {
  const params = useParams<{ packId: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const packType: PackType = params.packId === "tender-konsultansi" ? "konsultansi_mk" : "pelaksana_konstruksi";
  const meta = PACK_META[packType];

  const [step, setStep] = useState(0);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(["checklist", "risk_review", "draft_surat_penawaran"]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [showNewProfile, setShowNewProfile] = useState(false);

  // Form states
  const [newProfile, setNewProfile] = useState({
    name: "", businessType: "PT", nib: "", nibStatus: "Ada",
    npwp: "", npwpStatus: "Ada", address: "", picName: "", picContact: "",
  });
  const [tenderProfile, setTenderProfile] = useState({
    packageName: "", institution: "", location: "",
    deadline: "", hpsValue: "", qualification: "Non-Kecil", evaluationMethod: "",
  });
  const [requirements, setRequirements] = useState({
    qualificationReqs: "", personnelReqs: "", experienceReqs: "",
    smkkReqs: "", bondReqs: "",
  });
  const [technicalApproach, setTechnicalApproach] = useState(
    packType === "pelaksana_konstruksi" ? {
      understanding: "", executionMethod: "", schedule: "",
      qualityPlan: "", smkkPlan: "", risks: "",
    } : {
      understanding: "", methodology: "", teamOrg: "",
      workSchedule: "", qaQcPlan: "", smkkMentoring: "", risks: "",
    }
  );
  const [complianceAnswers, setComplianceAnswers] = useState({
    conflictOfInterest: "Tidak", blacklist: "Tidak",
    antiBribery: "Ya", dataDeclaration: "Ya",
  });

  const [generateResult, setGenerateResult] = useState<any>(null);

  // Queries
  const profilesQ = useQuery<CompanyProfile[]>({
    queryKey: ["/api/company-profiles"],
    enabled: !!user,
  });

  // Mutations
  const createProfileMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/company-profiles", data),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ["/api/company-profiles"] });
      setSelectedProfileId(data.id);
      setShowNewProfile(false);
      toast({ description: "Profil perusahaan berhasil disimpan" });
    },
  });

  const createSessionMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/tender-sessions", data),
  });

  const generateMut = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiRequest("POST", "/api/ai/tender-wizard", payload);
      return res;
    },
    onSuccess: (data: any) => {
      setGenerateResult(data);
      // Save result to session if we have one
      if (sessionId) {
        apiRequest("PATCH", `/api/tender-sessions/${sessionId}`, {
          status: "completed",
          scoreKelengkapan: data.scoreKelengkapan || null,
          scoreTeknis: data.scoreTeknis || null,
          generatedChecklist: data.checklist || null,
          generatedRiskReview: data.riskReview || null,
          generatedDrafts: data.drafts || null,
        });
      }
    },
    onError: () => {
      toast({ description: "Gagal generate output. Coba lagi.", variant: "destructive" });
    },
  });

  const selectedProfile = profilesQ.data?.find(p => p.id === selectedProfileId);

  const handleGenerate = async () => {
    let sId = sessionId;
    if (!sId) {
      try {
        const sess = await createSessionMut.mutateAsync({
          packType,
          companyProfileId: selectedProfileId || undefined,
          status: "generating",
          selectedOutputs,
          tenderProfile,
          requirements,
          technicalApproach,
          complianceAnswers,
        });
        sId = (sess as any).id;
        setSessionId(sId);
      } catch {}
    }
    generateMut.mutate({
      packType,
      companyProfile: selectedProfile || newProfile,
      tenderProfile,
      requirements,
      technicalApproach,
      complianceAnswers,
      selectedOutputs,
    });
    setStep(6);
  };

  const progress = Math.round((step / 6) * 100);

  const TextareaField = ({ label, helper, value, onChange, placeholder }: {
    label: string; helper?: string; value: string;
    onChange: (v: string) => void; placeholder?: string;
  }) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
      <Textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "Tulis di sini..."}
        className="min-h-[90px] text-sm resize-y"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/packs")} className="gap-1.5 shrink-0">
            <ArrowLeft className="h-4 w-4" /> Packs
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold ${meta.color === "blue" ? "text-blue-600" : "text-purple-600"}`}>
                {meta.label}
              </span>
              <Badge variant="outline" className="text-xs font-normal py-0">Tender LPSE Assistant</Badge>
            </div>
            <Progress value={progress} className="h-1.5 mt-1.5" />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">Langkah {step + 1}/7</span>
        </div>
        {/* Step indicators */}
        <div className="max-w-3xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
          {STEPS.map(s => (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs transition-colors ${
                s.id === step ? "bg-primary text-primary-foreground font-semibold" :
                s.id < step ? "bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer" :
                "bg-muted text-muted-foreground cursor-default"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ─── STEP 0: Pilih Output ────────────────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Selamat datang di Tender LPSE Wizard</h2>
              <p className="text-muted-foreground">{meta.description}</p>
            </div>
            <Card className={`border-2 ${meta.color === "blue" ? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20" : "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20"}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">{meta.icon} {meta.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{meta.description}</p>
              </CardContent>
            </Card>
            <div>
              <p className="text-sm font-semibold mb-3">Pilih output yang ingin dihasilkan:</p>
              <div className="space-y-2.5">
                {OUTPUT_OPTIONS.map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={selectedOutputs.includes(opt.id)}
                      onCheckedChange={checked => {
                        setSelectedOutputs(prev =>
                          checked ? [...prev, opt.id] : prev.filter(o => o !== opt.id)
                        );
                      }}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
              {selectedOutputs.length === 0 && (
                <p className="text-xs text-red-500 mt-2">Pilih minimal 1 output.</p>
              )}
            </div>
          </div>
        )}

        {/* ─── STEP 1: Company Profile ──────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Profil Perusahaan</h2>
              <p className="text-muted-foreground text-sm">Profil ini reusable — sekali dibuat, bisa dipakai untuk tender berikutnya.</p>
            </div>
            {profilesQ.isLoading ? (
              <div className="space-y-2"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>
            ) : (profilesQ.data || []).length > 0 && !showNewProfile ? (
              <div className="space-y-3">
                <p className="text-sm font-medium">Pilih profil yang sudah ada:</p>
                {(profilesQ.data || []).map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProfileId(p.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedProfileId === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.businessType} · {p.address || "Alamat belum diisi"}</p>
                      </div>
                      {selectedProfileId === p.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                  </button>
                ))}
                <Button variant="outline" className="gap-2 w-full" onClick={() => setShowNewProfile(true)}>
                  <Plus className="h-4 w-4" /> Buat Profil Baru
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {(profilesQ.data || []).length > 0 && (
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => setShowNewProfile(false)}>
                    ← Pilih profil yang ada
                  </Button>
                )}
                <p className="text-sm font-medium">Isi profil perusahaan baru:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <Label>Nama Perusahaan</Label>
                    <Input value={newProfile.name} onChange={e => setNewProfile(p => ({ ...p, name: e.target.value }))} placeholder="PT Maju Jaya Konstruksi" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Bentuk Usaha</Label>
                    <Select value={newProfile.businessType} onValueChange={v => setNewProfile(p => ({ ...p, businessType: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["PT", "CV", "Firma", "Koperasi", "Perseorangan"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Status NIB</Label>
                    <Select value={newProfile.nibStatus} onValueChange={v => setNewProfile(p => ({ ...p, nibStatus: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Ada", "Belum", "Proses"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nomor NIB (opsional)</Label>
                    <Input value={newProfile.nib} onChange={e => setNewProfile(p => ({ ...p, nib: e.target.value }))} placeholder="8120xxxxxxxxx" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>NPWP (opsional)</Label>
                    <Input value={newProfile.npwp} onChange={e => setNewProfile(p => ({ ...p, npwp: e.target.value }))} placeholder="xx.xxx.xxx.x-xxx.xxx" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Alamat Kantor</Label>
                    <Input value={newProfile.address} onChange={e => setNewProfile(p => ({ ...p, address: e.target.value }))} placeholder="Jl. Sudirman No. 1, Jakarta Selatan" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nama PIC Tender</Label>
                    <Input value={newProfile.picName} onChange={e => setNewProfile(p => ({ ...p, picName: e.target.value }))} placeholder="Budi Santoso" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Kontak PIC</Label>
                    <Input value={newProfile.picContact} onChange={e => setNewProfile(p => ({ ...p, picContact: e.target.value }))} placeholder="08123456789" />
                  </div>
                </div>
                <Button
                  className="gap-2" disabled={!newProfile.name || createProfileMut.isPending}
                  onClick={() => createProfileMut.mutate({ ...newProfile, experiences: [], personnel: [] })}
                >
                  {createProfileMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckSquare className="h-4 w-4" />}
                  Simpan Profil
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 2: Data Tender ────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1">Detail Tender</h2>
              <p className="text-muted-foreground text-sm">Data ini diisi per tender. Nama paket + instansi + deadline wajib diisi.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Nama Paket Pekerjaan <span className="text-red-500">*</span></Label>
                <Input value={tenderProfile.packageName} onChange={e => setTenderProfile(p => ({ ...p, packageName: e.target.value }))} placeholder="Pembangunan Gedung Kantor Dinas Pekerjaan Umum..." />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Instansi / UKPBJ <span className="text-red-500">*</span></Label>
                <Input value={tenderProfile.institution} onChange={e => setTenderProfile(p => ({ ...p, institution: e.target.value }))} placeholder="Dinas PUPR Kabupaten X" />
              </div>
              <div className="space-y-1.5">
                <Label>Lokasi Pekerjaan</Label>
                <Input value={tenderProfile.location} onChange={e => setTenderProfile(p => ({ ...p, location: e.target.value }))} placeholder="Kabupaten X, Provinsi Y" />
              </div>
              <div className="space-y-1.5">
                <Label>Batas Akhir Pemasukan <span className="text-red-500">*</span></Label>
                <Input type="date" value={tenderProfile.deadline} onChange={e => setTenderProfile(p => ({ ...p, deadline: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Nilai HPS/Pagu (opsional)</Label>
                <Input value={tenderProfile.hpsValue} onChange={e => setTenderProfile(p => ({ ...p, hpsValue: e.target.value }))} placeholder="Rp 5.000.000.000" />
              </div>
              <div className="space-y-1.5">
                <Label>Kualifikasi</Label>
                <Select value={tenderProfile.qualification} onValueChange={v => setTenderProfile(p => ({ ...p, qualification: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Kecil", "Non-Kecil", "Besar"].map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Metode Evaluasi (opsional)</Label>
                <Input value={tenderProfile.evaluationMethod} onChange={e => setTenderProfile(p => ({ ...p, evaluationMethod: e.target.value }))} placeholder="Harga terendah / Kualitas-Harga / dll" />
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Persyaratan ─────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1">Persyaratan Tender</h2>
              <p className="text-muted-foreground text-sm">Copy-paste poin persyaratan dari dokumen pemilihan. Boleh kosong — output akan bersifat generik.</p>
            </div>
            <TextareaField
              label="Persyaratan Kualifikasi"
              helper="Kualifikasi usaha, bidang/sub-bidang, SBU yang disyaratkan."
              value={requirements.qualificationReqs}
              onChange={v => setRequirements(p => ({ ...p, qualificationReqs: v }))}
              placeholder="Contoh: Kualifikasi Non-Kecil, Bidang Bangunan Gedung, Sub-bidang BG009..."
            />
            <TextareaField
              label="Persyaratan Personel Inti"
              helper="Role, jumlah, dan sertifikat yang disyaratkan."
              value={requirements.personnelReqs}
              onChange={v => setRequirements(p => ({ ...p, personnelReqs: v }))}
              placeholder="Contoh: 1 Penanggung Jawab Teknik (SKA Ahli Madya Sipil), 1 K3 Konstruksi..."
            />
            <TextareaField
              label="Persyaratan Pengalaman"
              helper="Minimal pengalaman proyek sejenis."
              value={requirements.experienceReqs}
              onChange={v => setRequirements(p => ({ ...p, experienceReqs: v }))}
              placeholder="Contoh: Memiliki pengalaman pekerjaan sejenis 10 tahun terakhir, nilai minimal Rp 2 M..."
            />
            <TextareaField
              label="Persyaratan SMKK / K3 / Mutu"
              helper="Persyaratan Sistem Manajemen Keselamatan Konstruksi."
              value={requirements.smkkReqs}
              onChange={v => setRequirements(p => ({ ...p, smkkReqs: v }))}
              placeholder="Contoh: Wajib melampirkan RKK (Rencana Keselamatan Konstruksi), memiliki personel K3..."
            />
            <TextareaField
              label="Persyaratan Jaminan (opsional)"
              helper="Jaminan penawaran, pelaksanaan, uang muka."
              value={requirements.bondReqs}
              onChange={v => setRequirements(p => ({ ...p, bondReqs: v }))}
              placeholder="Contoh: Jaminan penawaran 1% dari HPS, berlaku 60 hari..."
            />
          </div>
        )}

        {/* ─── STEP 4: Strategi Teknis ─────────────────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1">
                {packType === "pelaksana_konstruksi" ? "Strategi Teknis Pelaksana" : "Metodologi & Pendekatan MK"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {packType === "pelaksana_konstruksi"
                  ? "Minimal isi metode pelaksanaan + rencana SMKK."
                  : "Minimal isi metodologi + pendampingan SMKK."}
              </p>
            </div>
            {packType === "pelaksana_konstruksi" ? (
              <>
                <TextareaField label="Pemahaman Pekerjaan" helper="3–7 poin pemahaman terhadap ruang lingkup tender."
                  value={(technicalApproach as any).understanding} onChange={v => setTechnicalApproach(p => ({ ...p, understanding: v }))}
                  placeholder="1. Pekerjaan meliputi pembangunan 3 lantai...\n2. Lokasi di daerah perkotaan padat..." />
                <TextareaField label="Metode Pelaksanaan *" helper="Minimal 5 tahap pekerjaan."
                  value={(technicalApproach as any).executionMethod} onChange={v => setTechnicalApproach(p => ({ ...p, executionMethod: v }))}
                  placeholder="Tahap 1: Persiapan & Mobilisasi\nTahap 2: Pekerjaan Pondasi\n..." />
                <TextareaField label="Rencana Jadwal" helper="Tahap pekerjaan + estimasi durasi."
                  value={(technicalApproach as any).schedule} onChange={v => setTechnicalApproach(p => ({ ...p, schedule: v }))}
                  placeholder="Persiapan: 2 minggu\nPondasi: 4 minggu\n..." />
                <TextareaField label="Rencana Mutu" helper="3–7 poin rencana kendali mutu."
                  value={(technicalApproach as any).qualityPlan} onChange={v => setTechnicalApproach(p => ({ ...p, qualityPlan: v }))}
                  placeholder="1. Pemeriksaan material sebelum digunakan\n2. Uji beton sesuai SNI..." />
                <TextareaField label="Rencana SMKK / K3 *" helper="Wajib untuk konstruksi. 3–7 poin."
                  value={(technicalApproach as any).smkkPlan} onChange={v => setTechnicalApproach(p => ({ ...p, smkkPlan: v }))}
                  placeholder="1. Toolbox meeting setiap pagi\n2. Inspeksi K3 mingguan\n3. APD wajib semua pekerja..." />
                <TextareaField label="Risiko & Mitigasi" helper="Minimal 3 risiko + mitigasi."
                  value={(technicalApproach as any).risks} onChange={v => setTechnicalApproach(p => ({ ...p, risks: v }))}
                  placeholder="1. Risiko cuaca buruk → Jadwal buffer 10%\n2. ..." />
              </>
            ) : (
              <>
                <TextareaField label="Pemahaman Pekerjaan MK"
                  value={(technicalApproach as any).understanding} onChange={v => setTechnicalApproach(p => ({ ...p, understanding: v }))}
                  placeholder="Sasaran MK: mutu, waktu, biaya, K3/SMKK, administrasi kontrak..." />
                <TextareaField label="Metodologi Pelaksanaan *" helper="Per proses: mutu, waktu, biaya, dokumen, risiko."
                  value={(technicalApproach as any).methodology} onChange={v => setTechnicalApproach(p => ({ ...p, methodology: v }))}
                  placeholder="Pengendalian Mutu: inspeksi mingguan, ITP, laporan NCR...\nPengendalian Waktu: kurva-S, weekly progress report..." />
                <TextareaField label="Organisasi Tim & Penugasan"
                  value={(technicalApproach as any).teamOrg} onChange={v => setTechnicalApproach(p => ({ ...p, teamOrg: v }))}
                  placeholder="Team Leader: Ir. Budi (30 th pengalaman MK)\nSite Engineer: ..." />
                <TextareaField label="Jadwal Kerja & Milestone"
                  value={(technicalApproach as any).workSchedule} onChange={v => setTechnicalApproach(p => ({ ...p, workSchedule: v }))}
                  placeholder="Minggu 1: Mobilisasi & kick-off\nMingguan: Weekly meeting + progress report..." />
                <TextareaField label="Rencana QA/QC Deliverable"
                  value={(technicalApproach as any).qaQcPlan} onChange={v => setTechnicalApproach(p => ({ ...p, qaQcPlan: v }))}
                  placeholder="Review berlapis: draft → review internal → approval → submit..." />
                <TextareaField label="Pendampingan SMKK Proyek *" helper="Ruang lingkup pendampingan SMKK oleh konsultan MK."
                  value={(technicalApproach as any).smkkMentoring} onChange={v => setTechnicalApproach(p => ({ ...p, smkkMentoring: v }))}
                  placeholder="Coaching toolbox meeting, monitoring K3 mingguan, laporan temuan & CAPA..." />
                <TextareaField label="Risiko & Mitigasi"
                  value={(technicalApproach as any).risks} onChange={v => setTechnicalApproach(p => ({ ...p, risks: v }))}
                  placeholder="1. Keterlambatan informasi dari kontraktor → Protok komunikasi tertulis..." />
              </>
            )}
          </div>
        )}

        {/* ─── STEP 5: Kepatuhan ───────────────────────────────────────────────── */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1">Kepatuhan Perpres 46/2025</h2>
              <p className="text-muted-foreground text-sm">Self-check integritas. Jawaban "Ya" pada konflik/blacklist akan otomatis memunculkan Red Flag.</p>
            </div>
            <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-400">
                  <Shield className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>Sistem ini adalah <strong>checklist & drafting assistant</strong>, bukan legal advice. Verifikasi selalu dengan konsultan hukum pengadaan.</p>
                </div>
              </CardContent>
            </Card>
            {[
              { key: "conflictOfInterest", label: "Ada konflik kepentingan dengan panitia/PPK?", isRisk: true },
              { key: "blacklist", label: "Pernah masuk daftar hitam pengadaan?", isRisk: true },
              { key: "antiBribery", label: "Berkomitmen anti penyuapan/gratifikasi sesuai Perpres 46/2025?", isRisk: false },
              { key: "dataDeclaration", label: "Bersedia menandatangani pernyataan kebenaran data?", isRisk: false },
            ].map(({ key, label, isRisk }) => (
              <div key={key} className="p-4 rounded-xl border bg-card space-y-3">
                <p className="text-sm font-medium">{label}</p>
                <div className="flex gap-3">
                  {["Ya", "Tidak"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setComplianceAnswers(p => ({ ...p, [key]: opt }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        (complianceAnswers as any)[key] === opt
                          ? (isRisk && opt === "Ya") ? "border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : (!isRisk && opt === "Ya") ? "border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {isRisk && (complianceAnswers as any)[key] === "Ya" && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> Ini akan menghasilkan Red Flag. Verifikasi ke konsultan hukum.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── STEP 6: Hasil ───────────────────────────────────────────────────── */}
        {step === 6 && (
          <div className="space-y-6">
            {generateMut.isPending ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg mb-1">Menganalisis data tender...</p>
                  <p className="text-muted-foreground text-sm">AI sedang menyusun checklist, risk review, dan draft dokumen.</p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  {["Memvalidasi profil perusahaan", "Menjalankan compliance check Perpres 46/2025", "Menyusun checklist LPSE", "Menghasilkan risk review", "Menyusun draft dokumen"].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" style={{ animationDelay: `${i * 0.3}s` }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ) : generateResult ? (
              <div className="space-y-8">
                {/* Score dashboard */}
                {(generateResult.scoreKelengkapan != null || generateResult.scoreTeknis != null) && (
                  <div>
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" /> Skor Kesiapan
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="text-center p-4">
                        <p className="text-xs text-muted-foreground mb-2">Kelengkapan Dokumen</p>
                        <ScoreBadge score={generateResult.scoreKelengkapan || 0} />
                      </Card>
                      <Card className="text-center p-4">
                        <p className="text-xs text-muted-foreground mb-2">Kesiapan Teknis</p>
                        <ScoreBadge score={generateResult.scoreTeknis || 0} />
                      </Card>
                    </div>
                  </div>
                )}

                {/* Checklist */}
                {generateResult.checklist && generateResult.checklist.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" /> Checklist Kelengkapan
                    </h3>
                    <ChecklistTable items={generateResult.checklist} />
                  </div>
                )}

                {/* Risk Review */}
                {generateResult.riskReview && generateResult.riskReview.length > 0 && (
                  <div>
                    <Separator />
                    <h3 className="text-base font-semibold mb-4 mt-4 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Risk & Compliance Review
                    </h3>
                    <RiskCards items={generateResult.riskReview} />
                  </div>
                )}

                {/* Draft Documents */}
                {generateResult.drafts && Object.keys(generateResult.drafts).length > 0 && (
                  <div>
                    <Separator />
                    <h3 className="text-base font-semibold mb-4 mt-4 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Draft Dokumen
                    </h3>
                    <DraftViewer drafts={generateResult.drafts} />
                  </div>
                )}

                {/* Error fallback */}
                {generateResult.error && (
                  <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
                    <CardContent className="pt-4 text-sm text-red-700">
                      Error: {generateResult.error}
                    </CardContent>
                  </Card>
                )}

                <Button variant="outline" className="gap-2" onClick={() => {
                  setGenerateResult(null);
                  setStep(0);
                }}>
                  <RotateCcw className="h-4 w-4" /> Mulai Wizard Baru
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">Output belum dihasilkan. Klik Generate di bawah.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Navigation ──────────────────────────────────────────────────────── */}
        {step < 6 && (
          <div className="flex justify-between pt-8 mt-4 border-t">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(s => s - 1)} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Sebelumnya
            </Button>
            {step < 5 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && selectedOutputs.length === 0}
                className="gap-2"
              >
                Selanjutnya <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={generateMut.isPending || !tenderProfile.packageName}
                className="gap-2 bg-gradient-to-r from-primary to-primary/80"
              >
                {generateMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Output
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
