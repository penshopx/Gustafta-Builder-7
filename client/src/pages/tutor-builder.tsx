import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  BookOpen, Brain, Swords, Users, Layers, ArrowLeft, Loader2,
  CheckCircle2, ChevronRight, Zap, GraduationCap, MessageSquare,
  Eye, Target, Heart, PenLine, BookMarked, Play, RotateCcw,
  Sparkles, Bot, Star, ArrowRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

// ─── Blueprint metadata ────────────────────────────────────────────────────

interface BlueprintMeta {
  id: string;
  label: string;
  tagline: string;
  description: string;
  useCase: string;
  color: string;
  bgGradient: string;
  icon: React.ReactNode;
  sourceChapter: string;
  agentCount: number;
  specialists: Array<{ name: string; role: string; icon: React.ReactNode; color: string }>;
}

const BLUEPRINTS: BlueprintMeta[] = [
  {
    id: "sokrates-4mode",
    label: "Tutor Sokratik 4-Mode",
    tagline: "Dari monolog ke dialog — 4 mode pedagogi",
    description:
      "Tim 4 agen yang bergiliran memandu dialog belajar: Penjelas membangun pemahaman, Penantang menguji, Pembuat Soal melatih, Pelacak memantau kemajuan. Tidak ada yang memberi jawaban langsung — semua mendorong pelajar menemukan sendiri.",
    useCase: "Ideal untuk: kursus online, belajar mandiri, pelatihan korporat",
    color: "indigo",
    bgGradient: "from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30",
    icon: <Brain className="w-6 h-6" />,
    sourceChapter: "Bab 4 — Sokrates Digital",
    agentCount: 5,
    specialists: [
      { name: "PENJELAS", role: "Penjelas", icon: <BookOpen className="w-3.5 h-3.5" />, color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
      { name: "PENANTANG", role: "Penantang", icon: <Swords className="w-3.5 h-3.5" />, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
      { name: "PEMBUAT SOAL", role: "Pembuat Soal", icon: <PenLine className="w-3.5 h-3.5" />, color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
      { name: "PELACAK", role: "Pelacak Pemahaman", icon: <Target className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
    ],
  },
  {
    id: "lexskripsi",
    label: "LexSkripsi — Pendamping Skripsi/Tesis",
    tagline: "9 agen spesialis untuk tugas akademik paling menantang",
    description:
      "Sistem multi-agen untuk membimbing penulisan skripsi atau tesis. Tidak ada yang menulis untuk Anda — semua agen mendorong Anda merumuskan sendiri. Dari sumber → argumen → hipotesis → penulisan → sitasi → kritik → struktur → simulasi sidang → wellbeing.",
    useCase: "Ideal untuk: mahasiswa S1/S2/S3, peneliti, penulis akademis",
    color: "blue",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    icon: <GraduationCap className="w-6 h-6" />,
    sourceChapter: "Bab 5 — LexSkripsi",
    agentCount: 10,
    specialists: [
      { name: "SOURCE", role: "Source Agent", icon: <BookMarked className="w-3.5 h-3.5" />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
      { name: "ARGUMENT", role: "Argument Agent", icon: <Brain className="w-3.5 h-3.5" />, color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
      { name: "HYPOTHESIS", role: "Hypothesis Agent", icon: <Sparkles className="w-3.5 h-3.5" />, color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
      { name: "WRITING COACH", role: "Writing Coach", icon: <PenLine className="w-3.5 h-3.5" />, color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300" },
      { name: "CITATION", role: "Citation Agent", icon: <BookOpen className="w-3.5 h-3.5" />, color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" },
      { name: "COUNTER", role: "Counter Agent", icon: <Swords className="w-3.5 h-3.5" />, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
      { name: "STRUCTURE", role: "Structure Agent", icon: <Layers className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
      { name: "DEFENSE", role: "Defense Agent", icon: <Target className="w-3.5 h-3.5" />, color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
      { name: "WELLBEING", role: "Wellbeing Agent", icon: <Heart className="w-3.5 h-3.5" />, color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" },
    ],
  },
  {
    id: "satpam-belajar",
    label: "Satpam Belajar — Penjaga Video Learning",
    tagline: "Mengubah 'nonton pasif tanpa rem' menjadi dialog aktif",
    description:
      "Video adalah ilusi belajar jika ditonton pasif. Satpam Belajar memastikan setiap sesi video learning menjadi dialog aktif: persiapan sebelum nonton, jeda & pertanyaan selama nonton, konsolidasi sesudah nonton, dan pengulangan terjadwal.",
    useCase: "Ideal untuk: pelajar kursus online, penonton YouTube edukasi, peserta webinar",
    color: "amber",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    icon: <Eye className="w-6 h-6" />,
    sourceChapter: "Bab 2 — Video Tanpa Rem",
    agentCount: 5,
    specialists: [
      { name: "PRE-WATCH", role: "Pre-Watch Agent", icon: <Play className="w-3.5 h-3.5" />, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
      { name: "INTERUPTOR", role: "Interuptor", icon: <Swords className="w-3.5 h-3.5" />, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
      { name: "POST-WATCH", role: "Post-Watch Agent", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" },
      { name: "SPACED REVIEW", role: "Spaced Review Agent", icon: <RotateCcw className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
    ],
  },
  {
    id: "pendamping-baca",
    label: "Pendamping Baca — Reading Companion",
    tagline: "Teman membaca yang membuat setiap halaman bermakna",
    description:
      "Membaca bukan aktivitas pasif — ini adalah dialog antara pembaca dan teks. Pendamping Baca hadir dengan 4 agen: bantuan kosakata, pemeriksaan pemahaman, pelatihan strategi membaca, dan pelacak kemajuan yang merayakan setiap langkah.",
    useCase: "Ideal untuk: pelajar literasi, pembaca buku non-fiksi, mahasiswa",
    color: "green",
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    icon: <BookOpen className="w-6 h-6" />,
    sourceChapter: "Bab 3 — Krisis Literasi yang Sunyi",
    agentCount: 5,
    specialists: [
      { name: "VOCAB HELPER", role: "Vocabulary Helper", icon: <MessageSquare className="w-3.5 h-3.5" />, color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
      { name: "COMPREHENSION", role: "Comprehension Checker", icon: <Brain className="w-3.5 h-3.5" />, color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" },
      { name: "READING COACH", role: "Reading Coach", icon: <GraduationCap className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
      { name: "PROGRESS", role: "Progress Tracker", icon: <Star className="w-3.5 h-3.5" />, color: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300" },
    ],
  },
  {
    id: "learning-stack",
    label: "Learning Stack Pribadi — 5 Lapisan",
    tagline: "Belajar bukan aktivitas — ia adalah infrastruktur",
    description:
      "Sistem belajar 5-lapis yang mengubah konsumsi konten menjadi pemahaman yang bertahan. Setiap lapis saling menopang: Input (kurasi) → Processing (olah) → Praktik (aplikasi) → Review (pengulangan) → Refleksi (makna).",
    useCase: "Ideal untuk: profesional yang belajar mandiri, content creator, eksekutif",
    color: "purple",
    bgGradient: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
    icon: <Layers className="w-6 h-6" />,
    sourceChapter: "Bab 6 — Learning Stack Pribadi",
    agentCount: 6,
    specialists: [
      { name: "INPUT", role: "Input Agent", icon: <BookOpen className="w-3.5 h-3.5" />, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
      { name: "PROCESSING", role: "Processing Agent", icon: <Brain className="w-3.5 h-3.5" />, color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
      { name: "PRAKTIK", role: "Praktik Agent", icon: <Zap className="w-3.5 h-3.5" />, color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
      { name: "REVIEW", role: "Review Agent", icon: <RotateCcw className="w-3.5 h-3.5" />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
      { name: "REFLEKSI", role: "Refleksi Agent", icon: <Sparkles className="w-3.5 h-3.5" />, color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" },
    ],
  },
];

// ─── Blueprint Card ────────────────────────────────────────────────────────

function BlueprintCard({ bp, onSelect }: { bp: BlueprintMeta; onSelect: (bp: BlueprintMeta) => void }) {
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br ${bp.bgGradient} p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200 cursor-pointer group`}
      onClick={() => onSelect(bp)}
      data-testid={`card-blueprint-${bp.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-white/70 dark:bg-white/10 flex items-center justify-center shadow-sm">
            {bp.icon}
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">{bp.label}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{bp.tagline}</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px] shrink-0 font-normal">
          {bp.agentCount} agen
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{bp.description}</p>

      {/* Agent chips */}
      <div className="flex flex-wrap gap-1">
        <span className="text-[10px] font-medium bg-white/60 dark:bg-white/10 text-muted-foreground border border-border/50 rounded px-1.5 py-0.5 flex items-center gap-1">
          <Bot className="w-2.5 h-2.5" />
          Orchestrator
        </span>
        {bp.specialists.slice(0, 4).map((s) => (
          <span key={s.name} className={`text-[10px] font-medium rounded px-1.5 py-0.5 flex items-center gap-1 ${s.color}`}>
            {s.icon}
            {s.name}
          </span>
        ))}
        {bp.specialists.length > 4 && (
          <span className="text-[10px] text-muted-foreground rounded px-1.5 py-0.5 border border-dashed border-border">
            +{bp.specialists.length - 4} lagi
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/30">
        <span className="text-[10px] text-muted-foreground italic">{bp.sourceChapter}</span>
        <Button size="sm" variant="default" className="h-7 text-xs gap-1.5 group-hover:gap-2 transition-all" onClick={(e) => { e.stopPropagation(); onSelect(bp); }} data-testid={`button-rakit-${bp.id}`}>
          Rakit Tim
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ─── Create Team Dialog ────────────────────────────────────────────────────

function CreateTeamDialog({
  blueprint,
  onClose,
  onSuccess,
}: {
  blueprint: BlueprintMeta | null;
  onClose: () => void;
  onSuccess: (orchestratorId: number, teamName: string) => void;
}) {
  const [teamName, setTeamName] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: { blueprintId: string; teamName: string }) => {
      const res = await apiRequest("POST", "/api/tutor-builder/create-team", data);
      return res as any;
    },
    onSuccess: (data) => {
      toast({
        title: "Tim berhasil dibuat!",
        description: `${data.totalAgents} agen sudah siap di dashboard kamu.`,
      });
      onSuccess(data.orchestratorId, data.teamName);
    },
    onError: (err: any) => {
      toast({
        title: "Gagal membuat tim",
        description: err.message || "Terjadi kesalahan. Coba lagi.",
        variant: "destructive",
      });
    },
  });

  if (!blueprint) return null;

  const handleCreate = () => {
    if (!teamName.trim()) {
      toast({ title: "Nama tim wajib diisi", variant: "destructive" });
      return;
    }
    mutation.mutate({ blueprintId: blueprint.id, teamName: teamName.trim() });
  };

  return (
    <Dialog open={!!blueprint} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            {blueprint.icon}
            Rakit Tim: {blueprint.label}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Blueprint summary */}
          <div className={`rounded-lg bg-gradient-to-br ${blueprint.bgGradient} p-3 space-y-2`}>
            <p className="text-xs text-muted-foreground leading-relaxed">{blueprint.description}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-[10px] bg-white/60 dark:bg-white/10 border border-border/50 text-muted-foreground rounded px-1.5 py-0.5 flex items-center gap-1">
                <Bot className="w-2.5 h-2.5" /> Orchestrator
              </span>
              {blueprint.specialists.map((s) => (
                <span key={s.name} className={`text-[10px] rounded px-1.5 py-0.5 flex items-center gap-1 ${s.color}`}>
                  {s.icon} {s.name}
                </span>
              ))}
            </div>
          </div>

          {/* Team name input */}
          <div className="space-y-1.5">
            <Label htmlFor="team-name" className="text-sm">Nama Tim / Topik Belajar</Label>
            <Input
              id="team-name"
              placeholder={`Contoh: ${blueprint.id === "lexskripsi" ? "Skripsi Hukum Lingkungan" : blueprint.id === "learning-stack" ? "Belajar React 2025" : "Kelas Hukum Tata Negara"}`}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              disabled={mutation.isPending}
              data-testid="input-team-name"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground">
              Nama ini akan digunakan sebagai prefix untuk semua agen dalam tim.
            </p>
          </div>

          {/* What will be created */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Yang akan dibuat:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <Bot className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">[Nama Tim] — {blueprint.label}</span>
                <Badge variant="outline" className="text-[9px] h-4">Orchestrator</Badge>
              </div>
              {blueprint.specialists.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-xs text-muted-foreground ml-5">
                  <ChevronRight className="w-3 h-3 shrink-0" />
                  {s.icon}
                  <span>[Nama Tim] — {s.name}</span>
                  <span className="text-[10px]">({s.role})</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Total: <strong>{blueprint.agentCount} agen</strong> — semua otomatis terhubung dan siap digunakan.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending} data-testid="button-cancel-create">
            Batal
          </Button>
          <Button onClick={handleCreate} disabled={mutation.isPending || !teamName.trim()} data-testid="button-confirm-create">
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Membuat {blueprint.agentCount} agen...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Rakit {blueprint.agentCount} Agen Sekarang
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Success State ─────────────────────────────────────────────────────────

function SuccessPanel({
  orchestratorId,
  teamName,
  onReset,
}: {
  orchestratorId: number;
  teamName: string;
  onReset: () => void;
}) {
  const [, navigate] = useLocation();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Tim berhasil dirakit!</h2>
        <p className="text-muted-foreground text-sm mt-1">
          <strong>{teamName}</strong> sudah siap. Semua agen sudah terhubung dan bisa langsung digunakan.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <Button onClick={() => navigate(`/bot/${orchestratorId}`)} className="gap-2" data-testid="button-open-orchestrator">
          <MessageSquare className="w-4 h-4" />
          Buka Chat Tim Sekarang
        </Button>
        <Button variant="outline" onClick={() => navigate("/dashboard")} className="gap-2" data-testid="button-go-dashboard">
          <Users className="w-4 h-4" />
          Lihat di Dashboard
        </Button>
        <Button variant="ghost" onClick={onReset} className="gap-2" data-testid="button-build-another">
          <Zap className="w-4 h-4" />
          Rakit Tim Lain
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function TutorBuilderPage() {
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintMeta | null>(null);
  const [successState, setSuccessState] = useState<{ orchestratorId: number; teamName: string } | null>(null);

  const handleSuccess = (orchestratorId: number, teamName: string) => {
    setSelectedBlueprint(null);
    setSuccessState({ orchestratorId, teamName });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" data-testid="button-back-dashboard">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-primary" />
            Rakit Tim AI Tutor
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {successState ? (
          <SuccessPanel
            orchestratorId={successState.orchestratorId}
            teamName={successState.teamName}
            onReset={() => setSuccessState(null)}
          />
        ) : (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1 border border-primary/20">
                <BookOpen className="w-3 h-3" />
                Terinspirasi dari "Trilogi: Dari Monolog ke Dialog" — SKI Team, Mei 2026
              </div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Rakit Tim AI Tutor dalam Satu Klik
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Satu agen tidak cukup untuk pekerjaan intelektual serius. Gustafta Builder memungkinkan
                Anda merakit tim agen MultiClaw — cukup pilih blueprint, beri nama, dan semua agen
                langsung terhubung dan siap digunakan.
              </p>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
              {[
                { label: "Blueprint siap pakai", value: "5" },
                { label: "Pola dari ebook Trilogi", value: "7 Bab" },
                { label: "Maksimal agen per tim", value: "10" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xl font-bold text-primary">{stat.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Blueprint grid */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Pilih Blueprint Tim Agen
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BLUEPRINTS.map((bp) => (
                  <BlueprintCard key={bp.id} bp={bp} onSelect={setSelectedBlueprint} />
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-xl border bg-muted/20 p-6 space-y-4">
              <h2 className="text-sm font-semibold">Bagaimana cara kerjanya?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    step: "1",
                    title: "Pilih blueprint",
                    desc: "Pilih pola tim agen yang sesuai dengan kebutuhan belajarmu — dari Tutor Sokratik hingga pendamping skripsi.",
                  },
                  {
                    step: "2",
                    title: "Beri nama tim",
                    desc: "Beri nama sesuai topik atau kelas. Misalnya 'Kelas Manajemen Risiko' atau 'Skripsi Hukum Lingkungan'.",
                  },
                  {
                    step: "3",
                    title: "Langsung pakai",
                    desc: "Semua agen otomatis dibuat, terhubung, dan siap di dashboard. Klik Orchestrator untuk mulai berdialog.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote from book */}
            <blockquote className="border-l-4 border-primary/40 pl-4 py-1">
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "Untuk merakitnya, Anda tidak perlu menulis kode. Platform seperti Gustafta Builder
                sudah memungkinkan orang awam menyusun tim agen MultiClaw cukup dengan menuliskan
                peran masing-masing dalam bahasa manusia. Ini bukan masa depan; ini sudah ada hari ini."
              </p>
              <footer className="text-xs text-muted-foreground mt-1.5 font-medium not-italic">
                — Trilogi: Dari Monolog ke Dialog, Buku I, Epilog (SKI Team, Mei 2026)
              </footer>
            </blockquote>
          </div>
        )}
      </div>

      {/* Create Team Dialog */}
      <CreateTeamDialog
        blueprint={selectedBlueprint}
        onClose={() => setSelectedBlueprint(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
