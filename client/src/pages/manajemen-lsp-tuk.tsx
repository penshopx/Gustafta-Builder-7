import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, ArrowRight, MessageCircle, Building2, Users,
  ClipboardList, BarChart3, Shield, FileText, Star,
  Award, Target, Layers, Settings,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20ingin%20konsultasi%20AI%20untuk%20Manajemen%20LSP%20dan%20TUK%20Mandiri%20BNSP";
const CHECKOUT_URL = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533206&qty=1";

const DOMAINS = [
  {
    id: "asesor",
    color: "indigo",
    icon: <Users className="h-6 w-6 text-indigo-600" />,
    title: "Manajemen Asesor Kompetensi",
    items: [
      "Rekrutmen & seleksi asesor berdasarkan skema sertifikasi LSP",
      "Pemantauan masa berlaku sertifikat asesor & perpanjangan",
      "Pembagian tugas asesor per skema, TUK, & jadwal asesmen",
      "Evaluasi kinerja asesor: konsistensi keputusan & keluhan asesi",
      "Pengembangan kompetensi asesor: pelatihan lanjutan & recertification",
      "Register asesor internal & eksternal yang selalu up-to-date",
    ],
  },
  {
    id: "tuk",
    color: "emerald",
    icon: <Building2 className="h-6 w-6 text-emerald-600" />,
    title: "Manajemen TUK Mandiri",
    items: [
      "Panduan pendirian TUK Mandiri: persyaratan fasilitas & peralatan",
      "Checklist verifikasi TUK per skema sertifikasi yang dilaksanakan",
      "Jadwal ketersediaan & booking TUK untuk asesmen terjadwal",
      "Pemeliharaan fasilitas & kalibrasi peralatan TUK secara berkala",
      "Pengelolaan dokumen TUK: perizinan, SOP fasilitas, & rekaman",
      "Koordinasi TUK Sewaktu & Tempat Kerja sebagai alternatif",
    ],
  },
  {
    id: "skema",
    color: "violet",
    icon: <ClipboardList className="h-6 w-6 text-violet-600" />,
    title: "Manajemen Skema Sertifikasi",
    items: [
      "Pengembangan skema baru berbasis SKKNI & kebutuhan industri",
      "Review & pembaruan skema sertifikasi secara berkala",
      "Penyusunan Materi Uji Kompetensi (MUK) per unit kompetensi",
      "Penetapan kriteria unjuk kerja & standar kelulusan skema",
      "Harmonisasi skema dengan regulasi terbaru PUPR & BNSP",
      "Konsultasi teknis skema dengan komite teknis & pakar industri",
    ],
  },
  {
    id: "operasional",
    color: "teal",
    icon: <Settings className="h-6 w-6 text-teal-600" />,
    title: "Operasional Sertifikasi Harian",
    items: [
      "Manajemen pendaftaran asesi: validasi persyaratan & dokumen",
      "Penjadwalan asesmen & penugasan asesor secara efisien",
      "Pelaksanaan asesmen: monitoring, kendali mutu, & rekaman",
      "Proses keputusan sertifikasi: review asesor & rekomendasi",
      "Penerbitan sertifikat kompetensi & pengarsipan digital",
      "Penanganan banding, keberatan, & revisi keputusan asesmen",
    ],
  },
  {
    id: "kepatuhan",
    color: "amber",
    icon: <Shield className="h-6 w-6 text-amber-600" />,
    title: "Kepatuhan, Pelaporan & Audit",
    items: [
      "Pelaporan data sertifikasi ke SISI BNSP secara berkala",
      "Audit internal sistem manajemen mutu LSP per klausul 17024",
      "Tinjauan manajemen: evaluasi kinerja LSP & rencana perbaikan",
      "Persiapan surveillance & reassessment KAN/BNSP",
      "Dokumentasi tindakan korektif & pencegahan (CAPA)",
      "Pemantauan kepuasan asesi & penanganan pengaduan",
    ],
  },
  {
    id: "pengembangan",
    color: "rose",
    icon: <Target className="h-6 w-6 text-rose-600" />,
    title: "Pengembangan & Strategi LSP",
    items: [
      "Analisis kebutuhan pasar sertifikasi di wilayah kerja LSP",
      "Rencana perluasan skema & ruang lingkup TUK",
      "Strategi partnership dengan industri, kampus, & asosiasi",
      "Model bisnis LSP: penetapan biaya sertifikasi yang kompetitif",
      "Digitalisasi operasional & implementasi sistem informasi LSP",
      "Roadmap pengembangan LSP menuju keunggulan kompetitif",
    ],
  },
];

const colorStyles: Record<string, { bg: string; border: string; icon: string; tag: string }> = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/10", border: "border-indigo-200 dark:border-indigo-800", icon: "bg-indigo-100 dark:bg-indigo-900/30", tag: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-200 dark:border-emerald-800", icon: "bg-emerald-100 dark:bg-emerald-900/30", tag: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  violet: { bg: "bg-violet-50 dark:bg-violet-900/10", border: "border-violet-200 dark:border-violet-800", icon: "bg-violet-100 dark:bg-violet-900/30", tag: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  teal: { bg: "bg-teal-50 dark:bg-teal-900/10", border: "border-teal-200 dark:border-teal-800", icon: "bg-teal-100 dark:bg-teal-900/30", tag: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-900/10", border: "border-amber-200 dark:border-amber-800", icon: "bg-amber-100 dark:bg-amber-900/30", tag: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  rose: { bg: "bg-rose-50 dark:bg-rose-900/10", border: "border-rose-200 dark:border-rose-800", icon: "bg-rose-100 dark:bg-rose-900/30", tag: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
};

export default function ManajemenLspTukPage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white dark:bg-background" data-testid="page-manajemen-lsp-tuk">
      <SharedHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-violet-800 py-20 md:py-28 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold mb-6">
                <Building2 className="h-3.5 w-3.5" />
                AI Asisten Manajemen LSP & TUK Mandiri BNSP
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                LSP yang Terkelola Baik<br />
                <span className="text-indigo-200">Menghasilkan Sertifikasi Bermutu</span>
              </h1>
              <p className="text-base md:text-lg text-indigo-100 mb-8 leading-relaxed">
                Mengelola LSP aktif membutuhkan koordinasi asesor, TUK, skema, jadwal, dan
                kepatuhan yang kompleks. AI Gustafta menjadi asisten manajerial LSP Anda —
                dari manajemen asesor, operasional TUK Mandiri, administrasi sertifikasi,
                hingga persiapan audit BNSP.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-indigo-800 hover:bg-indigo-50 font-bold gap-2 px-8 h-12" data-testid="btn-hero-wa">
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
                { num: "6", label: "Domain Manajemen LSP", sub: "Asesor · TUK · Skema · Audit" },
                { num: "ISO 17024", label: "Standar SMM LSP", sub: "Klausul demi klausul" },
                { num: "3", label: "Tipe TUK", sub: "Mandiri · Sewaktu · Tempat Kerja" },
                { num: "SISI", label: "Pelaporan BNSP", sub: "Sistem Informasi BNSP terintegrasi" },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-white text-center">
                  <div className="text-2xl font-extrabold">{s.num}</div>
                  <div className="text-xs font-bold mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-indigo-200 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 Domain */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest text-center mb-2">6 Domain Manajemen</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">AI Mendampingi Setiap Aspek Operasional LSP</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {DOMAINS.map((d) => {
              const c = colorStyles[d.color];
              return (
                <div key={d.id} className={`rounded-2xl border-2 ${c.bg} ${c.border} p-5`} data-testid={`card-domain-${d.id}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${c.icon}`}>{d.icon}</div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{d.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {d.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest text-center mb-2">Cerita Pengguna</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Dari Pengelola LSP Indonesia</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Pak Irwan", role: "Direktur LSP Konstruksi, Jawa Tengah", text: "AI ini sangat membantu untuk manajemen jadwal asesor kami yang cukup banyak. Pengelolaan masa berlaku sertifikat asesor tidak terlewat lagi dengan panduan AI." },
              { name: "Bu Dewi, S.T.", role: "Manajer Sertifikasi LSP Energi", text: "Persiapan surveillance KAN jadi lebih terstruktur. AI membantu audit internal kami menemukan gap sebelum asesor KAN datang — sehingga tidak ada temuan major." },
              { name: "Pak Rudi", role: "Pengurus LSP Pihak Kedua, Asosiasi Nasional", text: "Pengembangan skema baru sangat terbantu. AI memandu kami dari SKKNI, penyusunan MUK, hingga presentasi ke komite teknis BNSP." },
            ].map((t, i) => (
              <div key={i} className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-5 border border-indigo-100 dark:border-border">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-700 dark:text-muted-foreground italic mb-4 leading-relaxed">"{t.text}"</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-gradient-to-br from-indigo-700 via-blue-700 to-violet-800 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">LSP Anda Layak Dikelola dengan Standar Terbaik</h2>
          <p className="text-indigo-100 text-sm mb-6">AI menjadi asisten manajerial yang memahami seluruh persyaratan ISO 17024 dan regulasi BNSP — selalu tersedia 24/7.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-indigo-800 hover:bg-indigo-50 font-bold gap-2 px-8 h-12" data-testid="btn-cta-checkout">
                Ambil Bundle Trilogi <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2" data-testid="btn-cta-wa">
                <MessageCircle className="h-4 w-4" /> Konsultasi via WA
              </Button>
            </a>
          </div>
          <p className="text-xs text-indigo-200 mt-4">
            Lihat juga:{" "}
            <Link href="/lisensi-lsp-bnsp"><span className="underline font-semibold cursor-pointer">Lisensi LSP BNSP →</span></Link>
            {" · "}
            <Link href="/paperless-asesmen"><span className="underline font-semibold cursor-pointer">Paperless & AJJ →</span></Link>
          </p>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-400 text-xs">
        <p className="mb-1">© 2026 Gustafta. Platform AI Chatbot Builder Indonesia.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/"><span className="hover:text-white cursor-pointer">Beranda</span></Link>
          <Link href="/lisensi-lsp-bnsp"><span className="hover:text-white cursor-pointer">Lisensi LSP</span></Link>
          <Link href="/paperless-asesmen"><span className="hover:text-white cursor-pointer">Paperless & AJJ</span></Link>
          <Link href="/skk-pedoman-bnsp"><span className="hover:text-white cursor-pointer">SKK BNSP</span></Link>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
