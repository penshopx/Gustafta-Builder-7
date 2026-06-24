import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, ArrowRight, MessageCircle, Cpu, Zap, Star,
  HardHat, Scale, GraduationCap, Building2, Leaf, BarChart3,
  Shield, TrendingUp, Globe, Sparkles, ChevronRight,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20ingin%20tahu%20lebih%20tentang%20MultiClaw%20Suite";
const CHECKOUT_URL = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533206&qty=1";

const CATEGORIES = [
  {
    label: "Konstruksi & Infrastruktur",
    color: "amber",
    tools: ["SBUClaw", "SMK3Claw", "SafiraClaw", "TenderaClaw", "BGClaw", "BSClaw", "IMClaw", "KOClaw", "KKClaw", "BIMClaw", "SiteOpsClaw", "KonstraClaw"],
  },
  {
    label: "K3 & Keselamatan",
    color: "red",
    tools: ["CSMSClaw", "K3ManClaw", "OffshoreSafetyClaw", "SMAPClaw", "PanCEKClaw"],
  },
  {
    label: "Sertifikasi & Kompetensi SKK",
    color: "blue",
    tools: ["ManprojakClaw", "ArsitekturClaw", "SurveiPemetaanClaw", "GeoteknikClaw", "JalanJembatanClaw", "TataLingkunganClaw", "ElektrikalClaw", "PengawasClaw", "K3ManClaw"],
  },
  {
    label: "Perizinan & Regulasi",
    color: "emerald",
    tools: ["LKUTClaw", "PJBUClaw", "LKPMClaw", "OSSClaw", "ESIMPANClaw", "ABUClaw", "SkemaClaw", "NSPKNavigatorClaw"],
  },
  {
    label: "Energi & Lingkungan",
    color: "green",
    tools: ["MigasClaw", "EBTSolarClaw", "EnergiClaw", "TransisiEnergiClaw", "KetenagalistrikanClaw", "TransmisiClaw", "GeologiClaw", "ESGClaw", "LingkunganClaw"],
  },
  {
    label: "Properti & Real Estate",
    color: "violet",
    tools: ["DevPropertiClaw", "EstateCareClaw", "QSClaw", "DesainClaw", "SipilClaw", "MEPClaw"],
  },
  {
    label: "Bisnis & Manajemen",
    color: "indigo",
    tools: ["KontrakClaw", "KeuanganClaw", "PajakClaw", "KorporasiClaw", "HubunganIndustrialClaw", "LeanOpExClaw", "SupplyChainClaw", "Industri40Claw"],
  },
  {
    label: "Marketing & Sales",
    color: "rose",
    tools: ["DigitalMarketingClaw", "CrmSalesClaw", "BrandContentClaw", "EcommerceClaw"],
  },
  {
    label: "SDM & Pengembangan",
    color: "teal",
    tools: ["RekrutmenClaw", "LdKompetensiClaw", "PenilaianKinerjaClaw", "CybersecurityClaw", "HACCPClaw"],
  },
  {
    label: "Pendidikan & Riset",
    color: "sky",
    tools: ["EducounselClaw", "IBTUClaw", "ETLOAcademyClaw", "TutorTeknikClaw", "RisetSkripsiClaw", "BrainClaw"],
  },
];

const bgMap: Record<string, string> = {
  amber: "bg-amber-50 border-amber-200 dark:bg-amber-900/10",
  red: "bg-red-50 border-red-200 dark:bg-red-900/10",
  blue: "bg-blue-50 border-blue-200 dark:bg-blue-900/10",
  emerald: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10",
  green: "bg-green-50 border-green-200 dark:bg-green-900/10",
  violet: "bg-violet-50 border-violet-200 dark:bg-violet-900/10",
  indigo: "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/10",
  rose: "bg-rose-50 border-rose-200 dark:bg-rose-900/10",
  teal: "bg-teal-50 border-teal-200 dark:bg-teal-900/10",
  sky: "bg-sky-50 border-sky-200 dark:bg-sky-900/10",
};

export default function MulticlawSuitePage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white dark:bg-background" data-testid="page-multiclaw-suite">
      <SharedHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 py-20 md:py-28 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold mb-6">
            <Cpu className="h-3.5 w-3.5" />
            80+ AI Tools Spesialis Indonesia
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            MultiClaw Suite —<br />
            <span className="text-cyan-100">Armada AI untuk Profesional Indonesia</span>
          </h1>
          <p className="text-base md:text-lg text-cyan-100 mb-6 max-w-3xl mx-auto leading-relaxed">
            Lebih dari 80 AI tools multi-agen terstruktur dalam 5 level hierarki — dari Konstruksi,
            K3, Legal, Energi, hingga SDM dan Marketing. Setiap Claw adalah tim AI spesialis
            yang bekerja paralel untuk memberikan analisis mendalam dalam hitungan detik.
          </p>
          <div className="flex items-center justify-center gap-6 mb-8 text-white">
            {[["80+", "AI Tools"], ["5", "Level Hierarki"], ["10+", "Sektor Industri"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold">{num}</div>
                <div className="text-xs text-cyan-200">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={builderUrl}>
              <Button size="lg" className="bg-white text-teal-700 hover:bg-cyan-50 font-bold gap-2 px-8 h-12" data-testid="btn-hero-mulai">
                <Zap className="h-5 w-5" /> Akses MultiClaw Suite
              </Button>
            </Link>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2 px-8 h-12" data-testid="btn-hero-tanya">
                <MessageCircle className="h-4 w-4" /> Tanya via WA
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── APA ITU MULTICLAW ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest text-center mb-2">Teknologi</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Bagaimana MultiClaw Bekerja?
          </h2>
          <p className="text-center text-gray-500 dark:text-muted-foreground mb-10 max-w-2xl mx-auto">
            Setiap "Claw" adalah orchestrator AI yang mengoordinasi tim sub-agen spesialis secara paralel —
            bukan sekadar chatbot, tapi sistem analisis berlapis.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <Cpu className="h-7 w-7 text-teal-600" />,
                title: "Orchestrator + Sub-Agen",
                desc: "Satu pertanyaan → dipecah ke 5–12 sub-agen spesialis yang bekerja paralel. Hasilnya dikompilasi menjadi laporan terstruktur.",
              },
              {
                icon: <Sparkles className="h-7 w-7 text-violet-600" />,
                title: "5-Level Modular Hierarchy",
                desc: "Master → Series HUB → Sub-HUB → Specialist → Deep Specialist. Setiap level memiliki keahlian yang semakin dalam dan spesifik.",
              },
              {
                icon: <Shield className="h-7 w-7 text-blue-600" />,
                title: "Regulasi Indonesia",
                desc: "Ditraining dengan regulasi lokal: Perpres, Permen PUPR, SNI, SKKNI, UU Ketenagakerjaan, dan ratusan standar teknis lainnya.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-border text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gray-50 dark:bg-muted rounded-xl">{item.icon}</div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KATALOG ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest text-center mb-2">Katalog Lengkap</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            80+ AI Tools dalam 10 Kategori
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className={`rounded-2xl border p-5 ${bgMap[cat.color]}`} data-testid={`card-category-${i}`}>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">{cat.label}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.tools.map((tool, j) => (
                    <span key={j} className="text-[10px] font-semibold px-2 py-0.5 bg-white/80 dark:bg-background/60 border border-gray-200 dark:border-border rounded-full text-gray-600 dark:text-muted-foreground">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AKSES ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Cara Akses</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10">Pilih Jalur Akses Anda</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-gray-200 dark:border-border text-left">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Paket Profesional</h3>
              <p className="text-sm text-gray-500 dark:text-muted-foreground mb-4">Akses seluruh MultiClaw Suite melalui langganan bulanan Gustafta Builder paket Profesional ke atas.</p>
              <ul className="space-y-2 mb-5">
                {["Akses semua 80+ tools", "SSE streaming real-time", "Sub-agen panel visualisasi", "Update tools baru otomatis"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={builderUrl}>
                <Button className="w-full font-bold" variant="outline" data-testid="btn-akses-profesional">
                  Lihat Paket Profesional <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-teal-400 text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full">REKOMENDASI</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Bundle Trilogi + Akses</h3>
              <p className="text-sm text-gray-500 dark:text-muted-foreground mb-4">Beli Bundle Trilogi, dapatkan BONUS 1 bulan Gustafta Builder gratis — langsung praktik MultiClaw Suite.</p>
              <ul className="space-y-2 mb-5">
                {["3 buku Trilogi (PDF + Flipbook)", "50+ Prompt Pack siap pakai", "Template 6-agen AI", "1 bulan Builder GRATIS"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold" data-testid="btn-akses-bundle">
                  Ambil Bundle Sekarang →
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-cyan-700 to-teal-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Armada AI Siap Bekerja untuk Anda</h2>
          <p className="text-cyan-100 mb-8 leading-relaxed">
            Tidak perlu memilih satu tool. Dengan MultiClaw Suite, seluruh ekosistem AI Indonesia ada di tangan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={builderUrl}>
              <Button size="lg" className="bg-white text-teal-700 hover:bg-cyan-50 font-bold gap-2 px-8 h-12" data-testid="btn-cta-mulai">
                <Zap className="h-5 w-5" /> Mulai Sekarang
              </Button>
            </Link>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2" data-testid="btn-cta-wa">
                <MessageCircle className="h-4 w-4" /> Chat WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-400 text-xs">
        <p className="mb-1">© 2026 Gustafta. Platform AI Chatbot Builder Indonesia.</p>
        <div className="flex justify-center gap-4">
          <Link href="/"><span className="hover:text-white cursor-pointer">Beranda</span></Link>
          <Link href="/trilogi"><span className="hover:text-white cursor-pointer">Trilogi</span></Link>
          <Link href="/industri"><span className="hover:text-white cursor-pointer">Per Industri</span></Link>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
