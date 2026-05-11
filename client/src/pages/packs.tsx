import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import {
  CheckSquare, AlertTriangle, Building2, ShieldCheck,
  ClipboardList, ArrowRight, Star, Lock, Zap, BarChart3,
  Phone, Check, TrendingUp, Sparkles, Crown, MessageCircle,
  GraduationCap, BookOpen, Users, Award
} from "lucide-react";

interface Pack {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  bg: string;
  border: string;
  iconColor: string;
  status: "available" | "coming_soon";
  outputs: string[];
  useCases: string[];
  route?: string;
  popular?: boolean;
}

const PACKS: Pack[] = [
  {
    id: "tender_pelaksana",
    name: "AI Pack: Tender LPSE Pelaksana",
    tagline: "Dokumen penawaran kontraktor — dari data tender jadi draft siap submit",
    description: "Masukkan data tender LPSE, sistem langsung bantu: checklist kelengkapan, review risiko & kepatuhan Perpres 46/2025, sampai draft dokumen penawaran. Agen AI yang terlibat menyesuaikan kebutuhan proyek.",
    icon: Building2,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600",
    status: "available",
    popular: true,
    outputs: ["Checklist LPSE + skor", "Risk & Compliance Review", "Draft surat penawaran", "Metode pelaksanaan", "Rencana SMKK"],
    useCases: ["Kontraktor pekerjaan gedung", "Kontraktor jalan & jembatan", "Vendor pengadaan konstruksi"],
    route: "/packs/tender-pelaksana",
  },
  {
    id: "tender_konsultansi",
    name: "AI Pack: Tender LPSE Konsultansi MK",
    tagline: "Proposal teknis Manajemen Konstruksi — modular, lengkap, siap submit",
    description: "Khusus konsultan MK. Sistem menyusun proposal teknis utuh (12 blok modular), checklist kepatuhan, risk review, hingga template laporan monitoring SMKK — disesuaikan dengan scope pekerjaan.",
    icon: ClipboardList,
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600",
    status: "available",
    outputs: ["Proposal teknis modular (M0–M12)", "Checklist + skor MK", "Risk review", "Template laporan SMKK"],
    useCases: ["Konsultan manajemen konstruksi", "Konsultan supervisi", "Konsultan DED"],
    route: "/packs/tender-konsultansi",
  },
  {
    id: "perizinan",
    name: "AI Pack: Perizinan & Sertifikasi",
    tagline: "Jalur SBU, NIB, BUJK — step-by-step tanpa harus tahu regulasinya dulu",
    description: "Wizard interaktif yang memandu pengurusan perizinan dari awal: jalur yang tepat, checklist persyaratan, timeline, sampai draft dokumen pendukung.",
    icon: ShieldCheck,
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600",
    status: "coming_soon",
    outputs: ["Jalur perizinan optimal", "Checklist persyaratan", "Timeline perizinan", "Draft dokumen pendukung"],
    useCases: ["BUJK baru", "Perpanjangan SBU", "Permohonan NIB konstruksi"],
  },
  {
    id: "smap",
    name: "AI Pack: SMAP & Pancek",
    tagline: "Self-assessment anti-penyuapan ISO 37001 & panduan KPK dalam satu sistem",
    description: "Sistem memandu self-assessment SMAP, gap analysis, rencana tindakan, dan evidence checklist Pancek KPK — disesuaikan kondisi perusahaan yang sebenarnya.",
    icon: AlertTriangle,
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-600",
    status: "coming_soon",
    outputs: ["Self-assessment SMAP", "Gap analysis", "Action plan", "Evidence checklist KPK"],
    useCases: ["BUJK yang butuh sertifikasi SMAP", "Internal compliance review", "Persiapan audit KPK"],
  },
  {
    id: "smkk",
    name: "AI Pack: SMKK – K3 Konstruksi",
    tagline: "Audit K3 & dokumentasi Permen PUPR 10/2021 — terstruktur dan bisa dilacak",
    description: "Checklist SMKK, audit internal, temuan & CAPA, evidence tracker — semua terorganisir. Agen yang dilibatkan disesuaikan tipe pekerjaan dan skala proyek.",
    icon: CheckSquare,
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600",
    status: "coming_soon",
    outputs: ["Checklist SMKK", "Temuan audit internal", "CAPA plan", "Evidence tracker K3"],
    useCases: ["Kontraktor wajib SMKK", "Audit internal K3", "Persiapan kunjungan pengawas"],
  },
  {
    id: "bujk_report",
    name: "AI Pack: Laporan Kegiatan BUJK",
    tagline: "Generator laporan tahunan BUJK — dari data mentah jadi dokumen siap kirim",
    description: "Validasi kelengkapan data, susun narasi, dan generate tabel ringkasan Laporan Kegiatan Usaha Tahunan sesuai ketentuan LSBU — tanpa perlu hafal formatnya.",
    icon: BarChart3,
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-200 dark:border-teal-800",
    iconColor: "text-teal-600",
    status: "coming_soon",
    outputs: ["Narasi laporan tahunan", "Tabel ringkasan kegiatan", "Validasi kelengkapan", "Draft PDF siap kirim"],
    useCases: ["BUJK wajib laporan tahunan", "Tim legal/compliance BUJK"],
  },
];

const WA_NUMBER = "6282299417818";
const waLink = (msg: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

export default function PacksPage() {
  const [, navigate] = useLocation();

  const available = PACKS.filter(p => p.status === "available");
  const comingSoon = PACKS.filter(p => p.status === "coming_soon");

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-14 pb-12 md:pt-20 md:pb-16 bg-gradient-to-br from-primary/8 via-violet-500/4 to-transparent">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Sparkles className="h-4 w-4" />
            Paket Series Modul — Done-for-You
            <Zap className="h-4 w-4 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Kami yang Setup,{" "}
            <span className="bg-gradient-to-r from-violet-500 to-primary bg-clip-text text-transparent">
              Anda Langsung Pakai
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-5">
            Berbeda dengan Paket Bisnis AI (DIY), di sini Anda cukup <strong>pesan modul yang dibutuhkan</strong> — tim Gustafta yang mengkonfigurasi, menginstal, dan mengaktifkan semuanya. Anda tidak perlu tahu teknisnya.
          </p>

          {/* Perbandingan jalur */}
          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-5 text-left">
            <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Crown className="h-3.5 w-3.5 text-violet-600" />
                <span className="font-semibold text-xs text-violet-700 dark:text-violet-300">Paket Series Modul (halaman ini)</span>
              </div>
              <p className="text-xs text-muted-foreground">Pesan modul → kami setup → Anda pakai. Cocok untuk yang ingin solusi siap pakai tanpa konfigurasi.</p>
            </div>
            <div className="rounded-xl border border-muted bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Star className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold text-xs text-muted-foreground">Paket Bisnis AI (DIY)</span>
              </div>
              <p className="text-xs text-muted-foreground">Anda admin yang build & kelola sendiri. <a href="/pricing" className="text-primary underline underline-offset-2">Lihat halaman Paket Bisnis →</a></p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2">
            {[
              "Setup & konfigurasi kami yang handle",
              "Agen AI fleksibel per orderan",
              "Tidak perlu tahu teknisnya",
              "Modul baru terus bertambah",
            ].map(b => (
              <div key={b} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y bg-muted/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { value: `${available.length}`, label: "Modul Tersedia Sekarang" },
              { value: `${comingSoon.length}`, label: "Modul Segera Hadir" },
              { value: "Perpres 46/2025", label: "Regulasi Acuan Terkini" },
              { value: "Fleksibel", label: "Harga Sesuai Orderan" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-lg font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Series label */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-border" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            Series Konstruksi & Pengadaan
          </div>
          <div className="h-px flex-1 bg-border" />
        </div>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Seri modul pertama Gustafta — dirancang khusus untuk industri konstruksi, pengadaan, dan legalitas usaha jasa konstruksi.
        </p>

        {/* Available packs */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <h2 className="text-xl font-bold">Modul Aktif</h2>
            <Badge className="bg-green-500 text-white text-xs">Bisa Langsung Diorder</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {available.map(pack => (
              <PackCard key={pack.id} pack={pack} onNavigate={navigate} />
            ))}
          </div>
        </div>

        {/* Coming soon packs */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">Modul Dalam Pengembangan</h2>
            <Badge variant="secondary" className="text-xs">Bisa dipesan lebih awal</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {comingSoon.map(pack => (
              <PackCardMini key={pack.id} pack={pack} />
            ))}
          </div>
        </div>

        {/* ── PAKET BIMBEL ── */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <GraduationCap className="h-3 w-3" />
              Paket Bimbel AI
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-8">
            AI Tutor personal 24/7 untuk pelajar, mahasiswa, guru, instruktur, dan HRD — dikonfigurasi oleh tim Gustafta, Anda langsung pakai.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                id: "bimbel-sma", name: "Paket Bimbel SMA / SMK", popular: true,
                tagline: "7 AI Tutor per mata pelajaran — belajar kapan saja, lebih murah dari bimbel",
                desc: "AI aktif menjawab pertanyaan, menjelaskan konsep, dan membuat latihan soal adaptif. Tersedia paket IPA, IPS, SMK Vokasi, dan UTBK Intensif.",
                outputs: ["Tutor Matematika AI", "Tutor Fisika / Kimia / Bio AI", "Bank soal & simulasi UTBK", "B. Indonesia & B. Inggris AI", "Progress tracking siswa"],
                useCases: ["Pelajar SMA/SMK yang ingin belajar mandiri", "Persiapan UTBK & ujian sekolah", "Alternatif bimbel lebih hemat"],
                color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800",
                icon: GraduationCap,
                route: "/education#pelajar",
              },
              {
                id: "bimbel-mahasiswa", name: "Paket Mahasiswa & Skripsi", popular: false,
                tagline: "Tutor mata kuliah + asisten TA/skripsi + pemahaman jurnal",
                desc: "Khusus mahasiswa S1/S2 — AI paham silabus, bantu analisis jurnal, dampingi proses TA dari brainstorm judul hingga persiapan sidang.",
                outputs: ["Tutor per mata kuliah", "Asisten analisis jurnal & penelitian", "Brainstorm judul & kerangka TA", "Latihan soal UTS/UAS", "Khusus Teknik: Konstruksi, Arsitektur, Hukum"],
                useCases: ["Mahasiswa S1 yang butuh tutor", "Mahasiswa teknik & konstruksi", "Persiapan TA & skripsi"],
                color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800",
                icon: BookOpen,
                route: "/education#mahasiswa",
              },
              {
                id: "bimbel-pengajar", name: "Paket Guru & Dosen Digital", popular: false,
                tagline: "Buat AI tutor dari materi Anda — siswa belajar mandiri 24/7",
                desc: "Upload silabus & materi, AI menjadi tutor digital yang menjawab pertanyaan siswa/mahasiswa kapan pun. Pantau progress via dashboard.",
                outputs: ["AI dari silabus & materi Anda", "Deploy ke semua siswa sekaligus", "Dashboard progress & pertanyaan", "Kuis & evaluasi otomatis", "Branding kelas sendiri"],
                useCases: ["Guru SMA / SMK / Madrasah", "Dosen perguruan tinggi", "Pengelola kursus / LKP"],
                color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800",
                icon: Users,
                route: "/education#guru",
              },
              {
                id: "bimbel-instruktur", name: "Paket Instruktur & HRD", popular: false,
                tagline: "AI coach untuk peserta pelatihan + portal training karyawan",
                desc: "Peserta berlatih mandiri via AI yang tahu materi kursus. HRD otomatiskan onboarding, SOP, dan evaluasi karyawan tanpa training berulang.",
                outputs: ["AI coach dari modul pelatihan Anda", "Simulasi ujian sertifikasi (BNSP/SKK/K3)", "Onboarding & SOP karyawan AI", "Kuis & evaluasi otomatis", "Dashboard progress peserta"],
                useCases: ["Instruktur BNSP / SKK / K3", "HRD perusahaan konstruksi", "Lembaga pelatihan & LDP"],
                color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800",
                icon: Award,
                route: "/education#instruktur",
              },
            ].map(pack => (
              <div key={pack.id} className={`relative rounded-2xl border-2 overflow-hidden transition-all ${pack.border} ${pack.popular ? "ring-2 ring-primary ring-offset-2" : ""}`} data-testid={`card-bimbel-${pack.id}`}>
                {pack.popular && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-violet-500 to-primary" />}
                <div className={`${pack.bg} px-5 py-4 border-b ${pack.border}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${pack.bg} border ${pack.border} flex-shrink-0`}>
                      <pack.icon className={`h-6 w-6 ${pack.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-bold text-sm">{pack.name}</h3>
                        {pack.popular && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">POPULER</span>}
                      </div>
                      <p className={`text-xs font-medium ${pack.color}`}>{pack.tagline}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">{pack.desc}</p>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Yang Bisa Dihasilkan</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.outputs.map(o => (
                        <span key={o} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${pack.bg} ${pack.border} ${pack.color}`}>{o}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cocok Untuk</p>
                    {pack.useCases.map(u => (
                      <div key={u} className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Check className={`h-3 w-3 flex-shrink-0 ${pack.color}`} />
                        {u}
                      </div>
                    ))}
                  </div>
                  <div className={`rounded-lg ${pack.bg} border ${pack.border} px-3 py-2 space-y-1`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${pack.color} font-semibold`}>Setup & Instalasi</p>
                      <p className={`text-xs font-bold ${pack.color}`}>via Store (sekali bayar)</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-semibold">Hosting / Berlangganan</p>
                      <p className="text-xs font-bold text-foreground">Rp 199rb/bln</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a href={waLink(`Halo, saya tertarik dengan ${pack.name} Gustafta. Bisa ceritakan proses ordernya?`)} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button className="w-full gap-2" size="sm" data-testid={`button-wa-bimbel-${pack.id}`}>
                        <MessageCircle className="h-3.5 w-3.5" />
                        Tanya via WhatsApp
                      </Button>
                    </a>
                    <a href={pack.route} className="flex-shrink-0">
                      <Button variant="outline" size="sm" className="gap-1.5" data-testid={`button-detail-bimbel-${pack.id}`}>
                        Detail <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combine modules CTA */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/8 via-violet-500/4 to-transparent p-7 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Crown className="h-5 w-5 text-amber-500" />
                <span className="font-bold text-lg">Kombinasikan Beberapa Modul</span>
                <Badge className="bg-amber-500 text-white text-xs">Rekomendasi</Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl">
                Misalnya: Modul Tender + SMKK untuk kontraktor aktif, atau Modul Perizinan + Laporan BUJK untuk perusahaan yang baru berkembang. Semakin banyak modul, semakin lengkap ekosistem kerja Anda. Kami bantu rancang kombinasinya.
              </p>
            </div>
            <a
              href={waLink("Halo, saya ingin konsultasi kombinasi Paket Series Modul Gustafta. Bisa bantu?")}
              target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <Button size="lg" className="gap-2 whitespace-nowrap" data-testid="button-bundle-wa">
                <MessageCircle className="h-4 w-4" />
                Konsultasi Kombinasi
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Next series teaser */}
        <div className="rounded-2xl border border-dashed border-muted-foreground/30 p-6 mb-8 text-center bg-muted/20">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Seri Berikutnya</div>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {["Series Properti & Realestat", "Series Hukum & Legalitas", "Series SDM & Kompetensi", "Series Manufaktur & Industri"].map(s => (
              <span key={s} className="text-xs px-3 py-1 rounded-full bg-muted border text-muted-foreground">{s}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Punya domain yang belum ada di daftar? Kami terima pesanan modul khusus.</p>
        </div>

        {/* Custom module CTA */}
        <div className="text-center border rounded-2xl p-10 bg-card">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Star className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Mau Modul untuk Domain Lain?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Kami terima pesanan modul AI khusus untuk industri apa pun — konstruksi spesifik, properti, hukum, manufaktur, pendidikan, dan lainnya. Ceritakan kebutuhannya, kami yang rancang modulnya dari nol.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href={waLink("Halo, saya ingin pesan modul AI custom dari Gustafta. Bisa konsultasi dulu?")} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2" data-testid="button-custom-pack-wa">
                <Phone className="h-4 w-4" /> Pesan Modul Custom
              </Button>
            </a>
            <Button variant="outline" className="gap-2" onClick={() => navigate("/pricing")} data-testid="button-see-pricing">
              <TrendingUp className="h-4 w-4" /> Lihat Paket Bisnis AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackCard({ pack, onNavigate }: { pack: Pack; onNavigate: (path: string) => void }) {
  const waMsg = `Halo, saya tertarik dengan ${pack.name}. Bisa ceritakan lebih lanjut dan proses ordernya seperti apa?`;

  return (
    <div
      className={`relative rounded-2xl border-2 overflow-hidden transition-all ${pack.border} ${pack.popular ? "ring-2 ring-primary ring-offset-2" : ""}`}
      data-testid={`card-pack-${pack.id}`}
    >
      {pack.popular && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-violet-500 to-primary" />
      )}

      {/* Header */}
      <div className={`${pack.bg} px-5 py-4 border-b ${pack.border}`}>
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${pack.bg} border ${pack.border} flex-shrink-0`}>
            <pack.icon className={`h-6 w-6 ${pack.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-bold text-sm leading-snug">{pack.name}</h3>
              {pack.popular && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">POPULER</span>
              )}
            </div>
            <p className={`text-xs font-medium ${pack.iconColor}`}>{pack.tagline}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-xs text-muted-foreground leading-relaxed">{pack.description}</p>

        {/* Outputs */}
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Yang Bisa Dihasilkan</p>
          <div className="flex flex-wrap gap-1.5">
            {pack.outputs.map(o => (
              <span key={o} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${pack.bg} ${pack.border} ${pack.iconColor}`}>
                {o}
              </span>
            ))}
          </div>
        </div>

        {/* Use cases */}
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cocok Untuk</p>
          <div className="space-y-1">
            {pack.useCases.map(u => (
              <div key={u} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className={`h-3 w-3 flex-shrink-0 ${pack.iconColor}`} />
                {u}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing note */}
        <div className={`rounded-lg ${pack.bg} border ${pack.border} px-3 py-2 space-y-1`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs ${pack.iconColor} font-semibold`}>Setup & Instalasi</p>
            <p className={`text-xs font-bold ${pack.iconColor}`}>via Store (sekali bayar)</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-semibold">Hosting / Berlangganan</p>
            <p className="text-xs font-bold text-foreground">Rp 199rb/bln</p>
          </div>
          <p className="text-[10px] text-muted-foreground pt-0.5 border-t border-border/40">Hosting sama dengan Paket Bisnis AI · <a href="/pricing" className="underline underline-offset-2">Lihat durasi & harga →</a></p>
        </div>

        {/* CTA */}
        <div className="flex gap-2 pt-1">
          <a
            href={waLink(waMsg)}
            target="_blank" rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full gap-2" size="sm" data-testid={`button-order-${pack.id}`}>
              <MessageCircle className="h-3.5 w-3.5" />
              Tanya via WhatsApp
            </Button>
          </a>
          {pack.route && (
            <Button
              variant="outline" size="sm"
              onClick={() => pack.route && onNavigate(pack.route)}
              className="gap-1.5"
              data-testid={`button-try-${pack.id}`}
            >
              Coba <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function PackCardMini({ pack }: { pack: Pack }) {
  const waMsg = `Halo, saya tertarik dengan ${pack.name} yang belum tersedia. Kapan bisa dipakai dan bagaimana cara pesannya?`;
  return (
    <div
      className={`rounded-xl border ${pack.border} overflow-hidden opacity-80`}
      data-testid={`card-pack-mini-${pack.id}`}
    >
      <div className={`${pack.bg} px-4 py-3 border-b ${pack.border} flex items-center gap-2`}>
        <pack.icon className={`h-4 w-4 ${pack.iconColor} flex-shrink-0`} />
        <h3 className="font-semibold text-xs leading-snug">{pack.name}</h3>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{pack.tagline}</p>
        <div className="flex items-center justify-between">
          <p className={`text-xs font-medium ${pack.iconColor}`}>Segera hadir</p>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
        <a
          href={waLink(waMsg)}
          target="_blank" rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs" data-testid={`button-preorder-${pack.id}`}>
            <Phone className="h-3 w-3" />
            Pesan Lebih Awal
          </Button>
        </a>
      </div>
    </div>
  );
}
