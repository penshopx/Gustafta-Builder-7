import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, ArrowRight, MessageCircle, FileText, Scale,
  AlertTriangle, Gavel, Shield, Star, Users, ClipboardList,
  TrendingUp, Building2,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20ingin%20konsultasi%20solusi%20AI%20Konsultan%20Kontrak%20Proyek";
const CHECKOUT_URL = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533206&qty=1";

const SUB_AGENTS = [
  { role: "CONTRACT-REVIEWER", desc: "Analisis klausul kontrak FIDIC, Perpres 12/2021, & kontrak komersial — identifikasi risiko tersembunyi sebelum penandatanganan" },
  { role: "CLAIM-STRATEGIST", desc: "Panduan klaim Extension of Time (EoT), Additional Payment, & Variation Order — dari dasar hukum hingga kalkulasi nilai klaim" },
  { role: "DISPUTE-RESOLVER", desc: "Strategi penyelesaian sengketa: negosiasi, mediasi, DAB/DRBF, arbitrase BANI/ICC, & litigasi — analisis probabilitas keberhasilan" },
  { role: "NOTICE-DRAFTER", desc: "Template & panduan penulisan notice: surat teguran, warning letter, notice of delay, force majeure declaration, & termination notice" },
  { role: "VARIATION-MANAGER", desc: "Panduan pengelolaan Variation Order: identifikasi, valuasi, negosiasi, & dokumentasi perubahan lingkup kerja" },
  { role: "RISK-ALLOCATOR", desc: "Analisis alokasi risiko kontrak — identifikasi klausul yang unfair dan strategi negosiasi ulang sebelum proyek berjalan" },
  { role: "FINAL-ACCOUNT", desc: "Panduan penyusunan Final Account proyek: rekonsiliasi klaim, VO, eskalasi harga, dan penutupan kontrak" },
];

const CONTRACT_TYPES = [
  { type: "FIDIC", variants: ["Red Book (Konstruksi)", "Yellow Book (Rancang Bangun)", "Silver Book (EPC/Turnkey)", "Gold Book (DBO)"] },
  { type: "Perpres 12/2021", variants: ["SSKK & SSUK pengadaan pemerintah", "Kontrak Lump Sum & Harga Satuan", "Kontrak Payung & Multi-Years", "Kontrak Terima Jadi (Turnkey)"] },
  { type: "Komersial & B2B", variants: ["Kontrak konstruksi swasta", "Perjanjian subkontraktor", "Kontrak sewa alat & material", "MOU & perjanjian KSO/JV"] },
];

export default function KonsultanKontrakPage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white dark:bg-background" data-testid="page-konsultan-kontrak">
      <SharedHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-rose-700 to-orange-700 py-20 md:py-28 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold mb-6">
                <FileText className="h-3.5 w-3.5" />
                KontrakClaw — AI Konsultan Manajemen Kontrak & Klaim
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Kontrak yang Kuat,<br />
                <span className="text-rose-200">Klaim yang Termenangkan</span>
              </h1>
              <p className="text-base md:text-lg text-rose-100 mb-8 leading-relaxed">
                KontrakClaw hadir dengan 7 sub-agen spesialis kontrak konstruksi & komersial —
                dari review klausul berisiko, strategi klaim EoT & variasi, penyelesaian sengketa
                FIDIC/BANI/ICC, hingga penyusunan Final Account proyek.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-red-800 hover:bg-red-50 font-bold gap-2 px-8 h-12" data-testid="btn-hero-wa">
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
                { num: "7", label: "Sub-Agen KontrakClaw", sub: "Review · Klaim · Sengketa · Notice" },
                { num: "FIDIC", label: "Standar Kontrak", sub: "Red/Yellow/Silver/Gold Book" },
                { num: "EoT", label: "Klaim Konstruksi", sub: "Waktu, Biaya, & Variasi" },
                { num: "BANI", label: "Arbitrase", sub: "BANI, ICC, UNCITRAL, SIAC" },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-white text-center">
                  <div className="text-2xl font-extrabold">{s.num}</div>
                  <div className="text-xs font-bold mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-rose-200 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Agents */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest text-center mb-2">7 Sub-Agen Spesialis</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">KontrakClaw Bekerja Paralel untuk Anda</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {SUB_AGENTS.map((a, i) => (
              <div key={i} className="bg-white dark:bg-card rounded-xl border border-red-100 dark:border-border p-4 flex gap-3">
                <div className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                <div>
                  <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-0.5">{a.role}</p>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contract Types */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest text-center mb-2">Jenis Kontrak</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Kontrak yang Dipahami AI</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {CONTRACT_TYPES.map((ct, i) => (
              <div key={i} className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-5 border border-red-100 dark:border-red-800/30">
                <h3 className="font-bold text-red-700 dark:text-red-400 mb-3">{ct.type}</h3>
                <ul className="space-y-1.5">
                  {ct.variants.map((v, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />{v}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-gradient-to-br from-red-700 via-rose-700 to-orange-700 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Jangan Tanda Tangan Kontrak Tanpa Review AI</h2>
          <p className="text-rose-100 text-sm mb-6">Satu klausul yang terlewat bisa menelan ratusan juta hingga miliaran rupiah. KontrakClaw membaca kontrak Anda lebih teliti dari paralegal manapun.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-red-800 hover:bg-red-50 font-bold gap-2 px-8 h-12" data-testid="btn-cta-checkout">
                Ambil Bundle Trilogi <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2" data-testid="btn-cta-wa">
                <MessageCircle className="h-4 w-4" /> Konsultasi via WA
              </Button>
            </a>
          </div>
          <p className="text-xs text-rose-200 mt-4">
            Lihat juga:{" "}
            <Link href="/konsultan-dokumen-proyek"><span className="underline font-semibold cursor-pointer">Dokumen Proyek →</span></Link>
            {" · "}
            <Link href="/brain-project"><span className="underline font-semibold cursor-pointer">Brain Project →</span></Link>
          </p>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-400 text-xs">
        <p className="mb-1">© 2026 Gustafta. Platform AI Chatbot Builder Indonesia.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/"><span className="hover:text-white cursor-pointer">Beranda</span></Link>
          <Link href="/konstruksi"><span className="hover:text-white cursor-pointer">Konstruksi</span></Link>
          <Link href="/brain-project"><span className="hover:text-white cursor-pointer">Brain Project</span></Link>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
