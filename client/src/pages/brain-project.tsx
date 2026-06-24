import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, ArrowRight, MessageCircle, Brain, BarChart3,
  Target, Layers, Zap, Star, TrendingUp, AlertTriangle,
  ClipboardList, Users, Activity,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20ingin%20konsultasi%20solusi%20AI%20Brain%20Project";
const CHECKOUT_URL = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533206&qty=1";

const SUB_AGENTS = [
  { role: "INTELLIGENCE-CORE", desc: "Sintesis data proyek menjadi intelligence yang actionable untuk pengambilan keputusan strategis" },
  { role: "RISK-RADAR", desc: "Deteksi dini risiko proyek: biaya, jadwal, mutu, safety — sebelum menjadi masalah nyata" },
  { role: "PERFORMANCE-ANALYST", desc: "Analisis Earned Value (EVM): CPI, SPI, EAC, VAC, dan tren performa proyek real-time" },
  { role: "DECISION-ARCHITECT", desc: "Strukturisasi keputusan kompleks dengan decision tree, AHP, dan analisis multi-kriteria" },
  { role: "STAKEHOLDER-INTEL", desc: "Pemetaan kepentingan stakeholder, strategi komunikasi, dan manajemen ekspektasi" },
  { role: "FORECAST-ENGINE", desc: "Proyeksi penyelesaian proyek (EAC, ETC, TCPI) berbasis data aktual dan tren terkini" },
];

export default function BrainProjectPage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white dark:bg-background" data-testid="page-brain-project">
      <SharedHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-700 via-teal-700 to-blue-800 py-20 md:py-28 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold mb-6">
                <Brain className="h-3.5 w-3.5" />
                BrainClaw — Project Intelligence AI
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Kecerdasan Proyek<br />
                <span className="text-cyan-200">di Ujung Jari Anda</span>
              </h1>
              <p className="text-base md:text-lg text-cyan-100 mb-8 leading-relaxed">
                BrainClaw adalah AI Project Intelligence yang mengintegrasikan data biaya, jadwal,
                risiko, dan performa proyek menjadi insight strategis yang siap dipakai
                untuk mengambil keputusan — bukan sekadar melaporkan angka.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-cyan-800 hover:bg-cyan-50 font-bold gap-2 px-8 h-12" data-testid="btn-hero-wa">
                    <MessageCircle className="h-5 w-5" /> Konsultasi Gratis
                  </Button>
                </a>
                <Link href={builderUrl}>
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2 px-8 h-12" data-testid="btn-hero-coba">
                    Coba Gratis <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "6", label: "Sub-Agen BrainClaw", sub: "Intelligence · Risk · EVM · Forecast" },
                { num: "EVM", label: "Metodologi", sub: "CPI, SPI, EAC, VAC, TCPI" },
                { num: "360°", label: "Visibilitas Proyek", sub: "Biaya, jadwal, mutu, risiko" },
                { num: "Proaktif", label: "Deteksi Risiko", sub: "Sebelum menjadi masalah nyata" },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-white text-center">
                  <div className="text-2xl font-extrabold">{s.num}</div>
                  <div className="text-xs font-bold mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-cyan-200 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Agents */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest text-center mb-2">6 Sub-Agen BrainClaw</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Project Intelligence yang Bekerja Paralel</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {SUB_AGENTS.map((a, i) => (
              <div key={i} className="bg-white dark:bg-card rounded-xl border border-cyan-100 dark:border-border p-4 flex gap-3">
                <div className="w-7 h-7 rounded-full bg-cyan-600 text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                <div>
                  <p className="text-xs font-bold text-cyan-700 dark:text-cyan-400 mb-0.5">{a.role}</p>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest text-center mb-2">Kasus Penggunaan</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Kapan BrainClaw Paling Dibutuhkan?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <AlertTriangle className="h-5 w-5 text-red-500" />, title: "Proyek Bermasalah", points: ["CPI < 1 dan terus menurun", "Jadwal sudah telat lebih dari 2 bulan", "Klaim kontraktor membengkak", "Owner meminta laporan pemulihan"] },
              { icon: <BarChart3 className="h-5 w-5 text-cyan-500" />, title: "Monthly Reporting", points: ["Persiapan laporan progress bulanan", "Presentasi ke steering committee", "Update investor & financier proyek", "KPI dashboard proyek real-time"] },
              { icon: <Target className="h-5 w-5 text-emerald-500" />, title: "Perencanaan Strategis", points: ["Baseline jadwal & anggaran baru", "Scenario analysis untuk keputusan percepatan", "Resource leveling & optimasi alokasi", "Close-out review & lesson learned"] },
            ].map((g, i) => (
              <div key={i} className="bg-cyan-50 dark:bg-cyan-900/10 rounded-2xl p-5 border border-cyan-100 dark:border-cyan-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-white dark:bg-background rounded-lg">{g.icon}</div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">{g.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {g.points.map((pt, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-cyan-500 flex-shrink-0" />{pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-gradient-to-br from-cyan-700 via-teal-700 to-blue-800 text-white text-center">
        <div className="max-w-xl mx-auto">
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-3">Dari Data Proyek ke Intelligence yang Menggerakkan Keputusan</h2>
          <p className="text-cyan-100 text-sm mb-6">BrainClaw memproses data lintas fungsi proyek secara paralel dan menghasilkan laporan yang siap dipakai dalam hitungan menit.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-cyan-800 hover:bg-cyan-50 font-bold gap-2 px-8 h-12" data-testid="btn-cta-checkout">
                Ambil Bundle Trilogi <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2" data-testid="btn-cta-wa">
                <MessageCircle className="h-4 w-4" /> Konsultasi via WA
              </Button>
            </a>
          </div>
          <p className="text-xs text-cyan-200 mt-4">
            Lihat juga:{" "}
            <Link href="/konsultan-kontrak"><span className="underline font-semibold cursor-pointer">Konsultan Kontrak →</span></Link>
            {" · "}
            <Link href="/konsultan-dokumen-proyek"><span className="underline font-semibold cursor-pointer">Dokumen Proyek →</span></Link>
          </p>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-400 text-xs">
        <p className="mb-1">© 2026 Gustafta. Platform AI Chatbot Builder Indonesia.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/"><span className="hover:text-white cursor-pointer">Beranda</span></Link>
          <Link href="/konstruksi"><span className="hover:text-white cursor-pointer">Konstruksi</span></Link>
          <Link href="/konsultan-kontrak"><span className="hover:text-white cursor-pointer">Konsultan Kontrak</span></Link>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
