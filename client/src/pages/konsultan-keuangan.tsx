import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, ArrowRight, MessageCircle, TrendingUp, BarChart3,
  DollarSign, PieChart, Shield, FileText, Star, Users,
  Building2, Calculator, Layers,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20ingin%20konsultasi%20solusi%20AI%20untuk%20akuntan%20dan%20konsultan%20keuangan";
const CHECKOUT_URL = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533206&qty=1";
const CHECKOUT_BASIC = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533205&qty=1";

const TOOLS = [
  {
    id: "keuangan",
    color: "emerald",
    icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
    name: "KeuanganClaw",
    sub: "Keuangan BUJK & Analisis Finansial — 4 sub-agen",
    title: "Analisis Keuangan & Pelaporan",
    features: [
      "Analisis laporan keuangan: rasio likuiditas, solvabilitas, profitabilitas",
      "Interpretasi PSAK & IFRS untuk pengakuan pendapatan",
      "Penyusunan proyeksi keuangan & analisis sensitivitas",
      "Review kemampuan keuangan untuk dukungan bank tender",
      "Analisis modal kerja, cash flow, & kebutuhan pendanaan",
    ],
  },
  {
    id: "pajak",
    color: "amber",
    icon: <Calculator className="h-6 w-6 text-amber-600" />,
    name: "PajakClaw",
    sub: "AI Advisor Pajak Indonesia — 8 sub-agen",
    title: "Perencanaan & Optimasi Pajak",
    features: [
      "Tax planning yang legal untuk efisiensi beban pajak",
      "Rekonsiliasi fiskal laporan keuangan komersial vs fiskal",
      "Panduan deductible & non-deductible expense (Pasal 6 & 9)",
      "Optimasi penyusutan aset fiskal & amortisasi",
      "Review koreksi positif & negatif dalam SPT Badan",
    ],
  },
  {
    id: "esg",
    color: "green",
    icon: <TrendingUp className="h-6 w-6 text-green-600" />,
    name: "ESGClaw",
    sub: "ESG & Keberlanjutan — 8 sub-agen",
    title: "Pelaporan ESG & Keberlanjutan",
    features: [
      "Penyusunan laporan keberlanjutan GRI Standards",
      "Kalkulasi emisi karbon Scope 1, 2, 3 untuk pelaporan",
      "Panduan green bond & sustainability-linked financing",
      "Analisis risiko iklim berbasis TCFD untuk investor",
      "Integrasi laporan keuangan & non-keuangan (integrated reporting)",
    ],
  },
  {
    id: "korporasi",
    color: "blue",
    icon: <Building2 className="h-6 w-6 text-blue-600" />,
    name: "KorporasiClaw",
    sub: "AI Konsultan Korporasi & Bisnis — 8 sub-agen",
    title: "Corporate Finance & Valuasi",
    features: [
      "Analisis valuasi bisnis: DCF, market multiple, asset-based",
      "Due diligence keuangan untuk M&A & investasi",
      "Panduan struktur modal & optimasi leverage",
      "Analisis kelayakan proyek: NPV, IRR, payback period",
      "Panduan IPO & persiapan reporting keuangan publik",
    ],
  },
];

const colorStyles: Record<string, { bg: string; border: string; icon: string; tag: string }> = {
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-200 dark:border-emerald-800", icon: "bg-emerald-100 dark:bg-emerald-900/30", tag: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-900/10", border: "border-amber-200 dark:border-amber-800", icon: "bg-amber-100 dark:bg-amber-900/30", tag: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  green: { bg: "bg-green-50 dark:bg-green-900/10", border: "border-green-200 dark:border-green-800", icon: "bg-green-100 dark:bg-green-900/30", tag: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  blue: { bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-200 dark:border-blue-800", icon: "bg-blue-100 dark:bg-blue-900/30", tag: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

export default function KonsultanKeuanganPage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white dark:bg-background" data-testid="page-konsultan-keuangan">
      <SharedHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-green-700 to-teal-800 py-20 md:py-28 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold mb-6">
                <TrendingUp className="h-3.5 w-3.5" />
                AI untuk Akuntan & Konsultan Keuangan Indonesia
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Analisis Keuangan Lebih Dalam,<br />
                <span className="text-emerald-200">Keputusan Lebih Tepat</span>
              </h1>
              <p className="text-base md:text-lg text-emerald-100 mb-8 leading-relaxed">
                Dari analisis laporan keuangan, perencanaan pajak, pelaporan ESG, hingga corporate finance
                dan valuasi bisnis — AI Gustafta menjadi mitra analisis keuangan yang memahami PSAK,
                IFRS, dan regulasi keuangan Indonesia.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold gap-2 px-8 h-12" data-testid="btn-hero-konsultasi">
                    <MessageCircle className="h-5 w-5" /> Konsultasi Gratis
                  </Button>
                </a>
                <Link href={builderUrl}>
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2 px-8 h-12" data-testid="btn-hero-mulai">
                    Coba Gratis <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "4+", label: "AI Tools Keuangan", sub: "Analisis, Pajak, ESG, Korporasi" },
                { num: "PSAK", label: "Standar Akuntansi", sub: "PSAK, IFRS, SAK ETAP, SAK EP" },
                { num: "GRI", label: "Pelaporan ESG", sub: "GRI, TCFD, SASB, SFDR" },
                { num: "DCF+IRR", label: "Metode Valuasi", sub: "NPV, IRR, Multiple, Asset-based" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-white text-center">
                  <div className="text-2xl md:text-3xl font-extrabold">{stat.num}</div>
                  <div className="text-xs font-bold mt-0.5">{stat.label}</div>
                  <div className="text-[10px] text-emerald-200 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest text-center mb-2">4 Area Layanan</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">AI untuk Setiap Aspek Keuangan</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {TOOLS.map((tool) => {
              const c = colorStyles[tool.color];
              return (
                <div key={tool.id} className={`rounded-2xl border-2 ${c.bg} ${c.border} p-6`} data-testid={`card-${tool.id}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl ${c.icon}`}>{tool.icon}</div>
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.tag}`}>{tool.name}</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">{tool.sub}</p>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mt-1">{tool.title}</h3>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {tool.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest text-center mb-2">Untuk Siapa</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Profesi yang Paling Diuntungkan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <BarChart3 className="h-5 w-5 text-emerald-500" />, title: "Akuntan & KAP", points: ["Partner & senior akuntan publik", "Auditor eksternal & internal", "Konsultan PSAK & IFRS", "Staf keuangan perusahaan"] },
              { icon: <TrendingUp className="h-5 w-5 text-blue-500" />, title: "Analis & Perencana", points: ["Financial analyst & planner", "Investment analyst & fund manager", "Corporate finance specialist", "Treasury & cash management"] },
              { icon: <Shield className="h-5 w-5 text-amber-500" />, title: "Konsultan & Advisor", points: ["Konsultan keuangan independen", "M&A advisor & due diligence", "CFO & FD perusahaan", "Lembaga keuangan & perbankan"] },
            ].map((group, i) => (
              <div key={i} className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-white dark:bg-background rounded-lg">{group.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{group.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {group.points.map((pt, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />{pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-emerald-700 via-green-700 to-teal-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Data Keuangan Anda + Analisis AI = Keputusan yang Lebih Baik</h2>
          <p className="text-emerald-100 mb-8">PSAK, IFRS, regulasi OJK, dan praktik keuangan Indonesia — AI yang benar-benar paham konteksnya.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold gap-2 px-8 h-12" data-testid="btn-cta-bundle">
                Ambil Bundle Trilogi <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2" data-testid="btn-cta-wa">
                <MessageCircle className="h-4 w-4" /> Konsultasi via WA
              </Button>
            </a>
          </div>
          <p className="text-xs text-emerald-200 mt-5">
            Lihat juga:{" "}
            <Link href="/konsultan-pajak"><span className="underline font-semibold cursor-pointer">Konsultan Pajak →</span></Link>
            {" · "}
            <Link href="/konsultan-hukum"><span className="underline font-semibold cursor-pointer">Konsultan Hukum →</span></Link>
          </p>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-400 text-xs">
        <p className="mb-1">© 2026 Gustafta. Platform AI Chatbot Builder Indonesia.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/"><span className="hover:text-white cursor-pointer">Beranda</span></Link>
          <Link href="/konsultan-pajak"><span className="hover:text-white cursor-pointer">Konsultan Pajak</span></Link>
          <Link href="/konsultan-hukum"><span className="hover:text-white cursor-pointer">Konsultan Hukum</span></Link>
          <Link href="/industri"><span className="hover:text-white cursor-pointer">Semua Industri</span></Link>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
