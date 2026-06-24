import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, ArrowRight, MessageCircle, HardHat, Scale, GraduationCap,
  Heart, Building2, Leaf, ChevronRight, Sparkles, Star, Zap,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20ingin%20tahu%20solusi%20AI%20untuk%20industri%20saya";
const CHECKOUT_URL = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533206&qty=1";

const VERTICALS = [
  {
    icon: <HardHat className="h-8 w-8 text-amber-600" />,
    color: "amber",
    title: "K3 & Konstruksi",
    slug: "k3",
    tagline: "Pakar Keselamatan Kerja 24/7",
    desc: "Chatbot AI yang memahami SMK3, CSMS, ISO 45001, SBU/SKK konstruksi. Jawab pertanyaan lapangan, bantu pengisian dokumen, dan pantau kepatuhan secara otomatis.",
    usecases: [
      "Konsultasi persyaratan SBU & SKK",
      "Panduan CSMS Contractor Safety",
      "Checklist inspeksi K3 otomatis",
      "Tanya-jawab regulasi PUPR & Kemnaker",
    ],
    tools: ["SBUClaw", "SMK3Claw", "SafiraClaw", "K3ManClaw"],
  },
  {
    icon: <Scale className="h-8 w-8 text-violet-600" />,
    color: "violet",
    title: "Hukum & Legal",
    slug: "legal",
    tagline: "Konsultan Hukum Pintu Depan",
    desc: "Chatbot AI untuk firma hukum, paralegal, dan konsultan legal. Pra-screening klien, ringkasan regulasi, hingga draft awal dokumen hukum.",
    usecases: [
      "Pra-konsultasi klien otomatis",
      "Ringkasan peraturan & putusan",
      "Draft awal kontrak & MoU",
      "FAQ regulasi bisnis & perizinan",
    ],
    tools: ["LexCom Legal AI", "OSSClaw", "KontrakClaw", "KorporasiClaw"],
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-blue-600" />,
    color: "blue",
    title: "Pendidikan & Pelatihan",
    slug: "edukasi",
    tagline: "Tutor AI yang Tidak Pernah Lelah",
    desc: "Chatbot AI untuk lembaga pendidikan, trainer, dan coach. Jawab pertanyaan peserta, berikan latihan soal, dan pantau kemajuan belajar.",
    usecases: [
      "Tutor materi kursus 24/7",
      "Generator soal latihan otomatis",
      "Panduan sertifikasi kompetensi",
      "Onboarding peserta pelatihan",
    ],
    tools: ["EducounselClaw", "IBTUClaw", "ETLOAcademyClaw", "TutorTeknikClaw"],
  },
  {
    icon: <Heart className="h-8 w-8 text-rose-600" />,
    color: "rose",
    title: "Kesehatan & Klinik",
    slug: "kesehatan",
    tagline: "Asisten Administratif Klinik",
    desc: "Chatbot AI untuk klinik, apotek, dan praktisi kesehatan. Tangani pertanyaan pasien, jadwal konsultasi, dan edukasi kesehatan preventif.",
    usecases: [
      "FAQ layanan & jadwal klinik",
      "Edukasi kesehatan preventif",
      "Pre-screening gejala pasien",
      "Pengingat obat & follow-up",
    ],
    tools: ["Gustafta Builder", "HACCP Claw", "Custom AI"],
  },
  {
    icon: <Building2 className="h-8 w-8 text-sky-600" />,
    color: "sky",
    title: "Properti & Real Estate",
    slug: "properti",
    tagline: "Agen Properti Digital",
    desc: "Chatbot AI untuk agen properti, developer, dan konsultan. Pra-kualifikasi calon pembeli, informasi unit, dan simulasi KPR otomatis.",
    usecases: [
      "Pra-kualifikasi calon pembeli",
      "Info unit, harga & ketersediaan",
      "Simulasi KPR & cicilan",
      "Follow-up prospek otomatis",
    ],
    tools: ["DevPropertiClaw", "EstateCareClaw", "KorporasiClaw"],
  },
  {
    icon: <Leaf className="h-8 w-8 text-emerald-600" />,
    color: "emerald",
    title: "ESG & Keberlanjutan",
    slug: "esg",
    tagline: "Panduan Keberlanjutan Bisnis",
    desc: "Chatbot AI untuk perusahaan yang menjalankan program ESG, PROPER, dan sertifikasi lingkungan. Bantu pelaporan, compliance, dan edukasi karyawan.",
    usecases: [
      "Panduan PROPER & ISO 14001",
      "Kalkulator emisi karbon",
      "Laporan ESG otomatis",
      "Edukasi karyawan tentang lingkungan",
    ],
    tools: ["ESGClaw", "LingkunganClaw", "ISO14001Claw", "TataLingkunganClaw"],
  },
];

const colorMap: Record<string, string> = {
  amber: "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800",
  violet: "bg-violet-50 border-violet-200 dark:bg-violet-900/10 dark:border-violet-800",
  blue: "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800",
  rose: "bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800",
  sky: "bg-sky-50 border-sky-200 dark:bg-sky-900/10 dark:border-sky-800",
  emerald: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800",
};

export default function IndustriPage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white dark:bg-background" data-testid="page-industri">
      <SharedHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 py-20 md:py-28 px-4">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI Chatbot Spesifik Industri
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Chatbot AI yang Memahami<br />
            <span className="text-sky-300">Dunia Kerja Anda</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Bukan chatbot generik — Gustafta menyediakan konfigurasi khusus untuk setiap industri,
            dilengkapi knowledge base regulasi, standar teknis, dan use case yang relevan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={builderUrl}>
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold gap-2 px-8 h-12" data-testid="btn-hero-mulai">
                <Zap className="h-5 w-5" /> Mulai Gratis
              </Button>
            </Link>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 px-8 h-12" data-testid="btn-hero-konsultasi">
                <MessageCircle className="h-4 w-4" /> Konsultasi Gratis
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── VERTICALS ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-2">Pilih Industri Anda</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Solusi AI untuk 6 Sektor Utama
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {VERTICALS.map((v, i) => (
              <div key={i} className={`rounded-2xl border p-6 ${colorMap[v.color]}`} data-testid={`card-industri-${v.slug}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-white dark:bg-background rounded-xl shadow-sm flex-shrink-0">{v.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{v.title}</h3>
                    <p className="text-xs font-semibold text-gray-500">{v.tagline}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground mb-4 leading-relaxed">{v.desc}</p>
                <ul className="space-y-1.5 mb-4">
                  {v.usecases.map((uc, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      {uc}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {v.tools.map((tool, j) => (
                    <span key={j} className="text-[10px] font-bold px-2 py-0.5 bg-white/70 dark:bg-background/50 border border-gray-200 dark:border-border rounded-full text-gray-600 dark:text-muted-foreground">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">Cara Kerja</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-10">Dari Nol ke Chatbot Aktif dalam 3 Langkah</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Pilih Template Industri", desc: "Pilih dari 80+ template AI yang sudah dikonfigurasi untuk industri Anda. Tidak perlu mulai dari nol." },
              { step: "2", title: "Sesuaikan Identitas & KB", desc: "Tambahkan nama, logo, dan knowledge base spesifik perusahaan Anda. Drag & drop, tidak perlu coding." },
              { step: "3", title: "Deploy & Integrasikan", desc: "Embed di website, bagikan link, atau integrasikan via API ke sistem yang sudah ada." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 font-extrabold text-xl flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-800 to-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Siap Bangun Chatbot untuk Industri Anda?</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Mulai gratis, atau konsultasi langsung dengan tim Gustafta untuk solusi custom sesuai kebutuhan bisnis Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold gap-2 px-8 h-12" data-testid="btn-cta-bundle">
                Ambil Bundle Trilogi <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2" data-testid="btn-cta-wa">
                <MessageCircle className="h-4 w-4" /> Diskusi via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-400 text-xs">
        <p className="mb-1">© 2026 Gustafta. Platform AI Chatbot Builder Indonesia.</p>
        <div className="flex justify-center gap-4">
          <Link href="/"><span className="hover:text-white cursor-pointer">Beranda</span></Link>
          <Link href="/starter-kit"><span className="hover:text-white cursor-pointer">Starter Kit</span></Link>
          <Link href="/trilogi"><span className="hover:text-white cursor-pointer">Trilogi</span></Link>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
