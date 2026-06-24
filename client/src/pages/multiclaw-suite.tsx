import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, MessageCircle, Cpu, Zap, Star,
  Shield, Sparkles, ChevronRight, Lock,
  Crown, Filter,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20ingin%20tahu%20lebih%20tentang%20MultiClaw%20Suite";
const CHECKOUT_BUNDLE = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533206&qty=1";
const CHECKOUT_BASIC  = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533205&qty=1";

type PlanTier = "starter" | "profesional" | "bisnis";

// ── Plan lookup ───────────────────────────────────────────────────────────────
const STARTER_SET = new Set([
  "SBUClaw", "LKUTClaw", "PJBUClaw", "KeuanganClaw", "ABUClaw",
  "PanduanSBU", "SkemaClaw", "TenderaClaw", "KonstraTenderClaw",
  "PanduanASKOM", "QSClaw", "PengawasClaw", "KontrakClaw",
]);
const BISNIS_SET = new Set([
  "PajakClaw", "OffshoreSafetyClaw", "HACCPClaw", "KetenagalistrikanClaw",
  "EnergiClaw", "EBTSolarClaw", "TransisiEnergiClaw", "MigasClaw",
  "PertambanganClaw", "GeologiClaw", "TransmisiClaw", "DevPropertiClaw",
  "EstateCareClaw", "DigitalMarketingClaw", "CrmSalesClaw", "BrandContentClaw",
  "EcommerceClaw", "RekrutmenClaw", "LdKompetensiClaw", "PenilaianKinerjaClaw",
  "HubunganIndustrialClaw", "ESGClaw", "LeanOpExClaw", "SupplyChainClaw",
  "Industri40Claw", "KorporasiClaw", "CybersecurityClaw", "ETLOAcademyClaw",
  "ETLOBizDevClaw",
]);

function getPlan(tool: string): PlanTier {
  if (STARTER_SET.has(tool)) return "starter";
  if (BISNIS_SET.has(tool)) return "bisnis";
  return "profesional";
}

function isAccessible(tool: string, selectedPlan: PlanTier | "semua"): boolean {
  if (selectedPlan === "semua" || selectedPlan === "bisnis") return true;
  const plan = getPlan(tool);
  if (selectedPlan === "starter") return plan === "starter";
  // profesional: starter + profesional
  return plan !== "bisnis";
}

const PLAN_LABEL: Record<PlanTier, string> = {
  starter: "S",
  profesional: "P",
  bisnis: "B",
};
const PLAN_DOT: Record<PlanTier, string> = {
  starter: "bg-blue-500",
  profesional: "bg-indigo-500",
  bisnis: "bg-violet-500",
};

// ── Categories (industry grouping preserved) ──────────────────────────────────
const CATEGORIES = [
  {
    label: "Konstruksi & Infrastruktur", color: "amber",
    tools: ["SBUClaw","SMK3Claw","SafiraClaw","TenderaClaw","BGClaw","BSClaw","IMClaw","KOClaw","KKClaw","BIMClaw","SiteOpsClaw","KonstraClaw"],
  },
  {
    label: "K3 & Keselamatan", color: "red",
    tools: ["CSMSClaw","K3ManClaw","OffshoreSafetyClaw","SMAPClaw","PanCEKClaw"],
  },
  {
    label: "Sertifikasi & Kompetensi SKK", color: "blue",
    tools: ["ManprojakClaw","ArsitekturClaw","SurveiPemetaanClaw","GeoteknikClaw","JalanJembatanClaw","TataLingkunganClaw","ElektrikalClaw","PengawasClaw","K3ManClaw"],
  },
  {
    label: "Perizinan & Regulasi", color: "emerald",
    tools: ["LKUTClaw","PJBUClaw","LKPMClaw","OSSClaw","ESIMPANClaw","ABUClaw","SkemaClaw","NSPKNavigatorClaw"],
  },
  {
    label: "Energi & Lingkungan", color: "green",
    tools: ["MigasClaw","EBTSolarClaw","EnergiClaw","TransisiEnergiClaw","KetenagalistrikanClaw","TransmisiClaw","GeologiClaw","ESGClaw","LingkunganClaw"],
  },
  {
    label: "Properti & Real Estate", color: "violet",
    tools: ["DevPropertiClaw","EstateCareClaw","QSClaw","DesainClaw","SipilClaw","MEPClaw"],
  },
  {
    label: "Bisnis & Manajemen", color: "indigo",
    tools: ["KontrakClaw","KeuanganClaw","PajakClaw","KorporasiClaw","HubunganIndustrialClaw","LeanOpExClaw","SupplyChainClaw","Industri40Claw"],
  },
  {
    label: "Marketing & Sales", color: "rose",
    tools: ["DigitalMarketingClaw","CrmSalesClaw","BrandContentClaw","EcommerceClaw"],
  },
  {
    label: "SDM & Pengembangan", color: "teal",
    tools: ["RekrutmenClaw","LdKompetensiClaw","PenilaianKinerjaClaw","CybersecurityClaw","HACCPClaw"],
  },
  {
    label: "Pendidikan & Riset", color: "sky",
    tools: ["EducounselClaw","IBTUClaw","ETLOAcademyClaw","TutorTeknikClaw","RisetSkripsiClaw","BrainClaw"],
  },
];

const bgMap: Record<string, string> = {
  amber:   "bg-amber-50 border-amber-200 dark:bg-amber-900/10",
  red:     "bg-red-50 border-red-200 dark:bg-red-900/10",
  blue:    "bg-blue-50 border-blue-200 dark:bg-blue-900/10",
  emerald: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10",
  green:   "bg-green-50 border-green-200 dark:bg-green-900/10",
  violet:  "bg-violet-50 border-violet-200 dark:bg-violet-900/10",
  indigo:  "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/10",
  rose:    "bg-rose-50 border-rose-200 dark:bg-rose-900/10",
  teal:    "bg-teal-50 border-teal-200 dark:bg-teal-900/10",
  sky:     "bg-sky-50 border-sky-200 dark:bg-sky-900/10",
};

const totalClaws = 80;
const starterCount = STARTER_SET.size;
const proCount = totalClaws - BISNIS_SET.size;

export default function MulticlawSuitePage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | "semua">("semua");

  const PLAN_FILTERS: { label: string; value: PlanTier | "semua"; icon: React.ReactNode; desc: string }[] = [
    { label: "Semua",      value: "semua",      icon: <Filter className="h-3.5 w-3.5" />,  desc: `${totalClaws} claw` },
    { label: "Starter",    value: "starter",    icon: <Star className="h-3.5 w-3.5" />,    desc: `${starterCount} claw` },
    { label: "Profesional",value: "profesional",icon: <Zap className="h-3.5 w-3.5" />,     desc: `${proCount} claw` },
    { label: "Bisnis",     value: "bisnis",     icon: <Crown className="h-3.5 w-3.5" />,   desc: `${totalClaws} claw` },
  ];

  const planColors: Record<string, string> = {
    semua:      "bg-gray-800 text-white border-gray-600",
    starter:    "bg-blue-600 text-white border-blue-500",
    profesional:"bg-indigo-600 text-white border-indigo-500",
    bisnis:     "bg-violet-600 text-white border-violet-500",
  };
  const planColorsInactive = "bg-white/5 dark:bg-muted/30 text-gray-600 dark:text-muted-foreground border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/50";

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
            {[["80+", "AI Tools"], ["3", "Paket Akses"], ["10+", "Sektor Industri"]].map(([num, label]) => (
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
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
            80+ AI Tools dalam 10 Kategori
          </h2>
          <p className="text-center text-gray-500 dark:text-muted-foreground mb-8 text-sm">
            Filter berdasarkan paket untuk melihat tool yang dapat Anda akses.
          </p>

          {/* ── Plan filter ── */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {PLAN_FILTERS.map(p => (
              <button
                key={p.value}
                onClick={() => setSelectedPlan(p.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                  selectedPlan === p.value ? planColors[p.value] : planColorsInactive
                }`}
                data-testid={`filter-plan-${p.value}`}
              >
                {p.icon}
                {p.label}
                <span className={`text-[10px] opacity-70`}>{p.desc}</span>
              </button>
            ))}
          </div>

          {/* Legend */}
          {selectedPlan === "semua" && (
            <div className="flex flex-wrap justify-center gap-3 mb-8 text-[10px] text-gray-500 dark:text-muted-foreground">
              {(["starter","profesional","bisnis"] as PlanTier[]).map(p => (
                <span key={p} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${PLAN_DOT[p]}`} />
                  {p === "starter" ? "Starter" : p === "profesional" ? "Profesional" : "Bisnis"}
                </span>
              ))}
            </div>
          )}

          {selectedPlan !== "semua" && (
            <div className="flex justify-center mb-8">
              <div className={`inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full border ${
                selectedPlan === "starter"     ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300" :
                selectedPlan === "profesional" ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300" :
                "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300"
              }`}>
                <Lock className="h-3 w-3 opacity-60" />
                Tool berwarna abu-abu memerlukan upgrade paket yang lebih tinggi
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {CATEGORIES.map((cat, i) => {
              const accessibleTools = cat.tools.filter(t => isAccessible(t, selectedPlan));
              const hasAny = selectedPlan === "semua" || accessibleTools.length > 0;
              return (
                <div
                  key={i}
                  className={`rounded-2xl border p-5 transition-all ${bgMap[cat.color]} ${
                    !hasAny ? "opacity-40" : ""
                  }`}
                  data-testid={`card-category-${i}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{cat.label}</h3>
                    {selectedPlan !== "semua" && (
                      <span className="text-[10px] text-gray-400 dark:text-muted-foreground">
                        {accessibleTools.length}/{cat.tools.length} tersedia
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tools.map((tool, j) => {
                      const accessible = isAccessible(tool, selectedPlan);
                      const plan = getPlan(tool);
                      return (
                        <span
                          key={j}
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                            accessible
                              ? "bg-white/80 dark:bg-background/60 border-gray-200 dark:border-border text-gray-700 dark:text-muted-foreground"
                              : "bg-gray-100 dark:bg-muted/20 border-gray-200 dark:border-border text-gray-300 dark:text-muted-foreground/40 line-through"
                          }`}
                        >
                          {selectedPlan === "semua" && (
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PLAN_DOT[plan]}`} />
                          )}
                          {!accessible && <Lock className="h-2.5 w-2.5 shrink-0" />}
                          {tool}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CARA AKSES ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest text-center mb-2">Cara Akses</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Pilih Paket yang Sesuai</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {/* Starter */}
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Starter</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-muted-foreground mb-4">
                Akses {starterCount} MultiClaw inti — SBU, Tender, Perizinan dasar. Cocok untuk BUJK yang baru mulai.
              </p>
              <ul className="space-y-1.5 mb-5">
                {[`${starterCount} claw SBU & Tender`, "SSE streaming real-time", "Sub-agen panel visualisasi"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href={CHECKOUT_BASIC} target="_blank" rel="noopener noreferrer">
                <Button className="w-full font-bold border-blue-300 dark:border-blue-700" variant="outline" data-testid="btn-akses-starter">
                  Mulai Starter <ChevronRight className="h-4 w-4" />
                </Button>
              </a>
            </div>

            {/* Profesional */}
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-indigo-300 dark:border-indigo-700 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-indigo-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Profesional</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-muted-foreground mb-4">
                Akses {proCount} MultiClaw — termasuk Konstruksi Teknis, SKK, K3, ISO, dan Perizinan lanjutan.
              </p>
              <ul className="space-y-1.5 mb-5">
                {[`${proCount} claw Konstruksi & SKK`, "K3, ISO & Perizinan", "Update tools baru otomatis"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={builderUrl}>
                <Button className="w-full font-bold border-indigo-300 dark:border-indigo-700" variant="outline" data-testid="btn-akses-profesional">
                  Lihat Paket Profesional <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Bisnis — recommended */}
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-teal-400 text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full">REKOMENDASI</div>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-5 w-5 text-violet-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Bisnis</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-muted-foreground mb-4">
                Akses semua {totalClaws} MultiClaw — termasuk Energi, HR, Marketing, dan Bisnis. Bundle Trilogi + 1 bulan gratis.
              </p>
              <ul className="space-y-1.5 mb-5">
                {["Semua 80+ claw tanpa batas", "3 buku Trilogi (PDF + Flipbook)", "50+ Prompt Pack siap pakai", "1 bulan Builder GRATIS"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href={CHECKOUT_BUNDLE} target="_blank" rel="noopener noreferrer">
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
          <Link href="/multiclaw"><span className="hover:text-white cursor-pointer">Direktori</span></Link>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
