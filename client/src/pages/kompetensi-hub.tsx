import { Link } from "wouter";
import { Award, Brain, Target, TrendingUp, ChevronRight, Sparkles, GraduationCap, Shield, BarChart3, Zap, BookOpen, Users, Building2, CheckCircle2, ClipboardList, Search, FileText, DollarSign, RefreshCw, MessageSquare, Briefcase, LayoutList, MapPin, Calculator, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const WAVES = [
  {
    wave: "Gelombang 1",
    period: "2026–2027",
    theme: "Digital Compliance & Certification",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    items: ["E-Sertifikat + QR Verifikasi", "Mock Asesmen SKK", "Diagnostik Kompetensi AI"],
  },
  {
    wave: "Gelombang 2",
    period: "2027–2028",
    theme: "Skills-Based Talent Economy",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    items: ["Skills Map & Analytics", "Mini Apps Practice Layer", "Generator Dokumen BUJK"],
  },
  {
    wave: "Gelombang 3",
    period: "2029–2030",
    theme: "Immersive & Autonomous Learning",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    items: ["AI Assessment Engine", "Green Jobs Certification", "RPL.AI Automation"],
  },
];

const TOOLS = [
  {
    href: "/sertifikat-digital",
    icon: Award,
    label: "SERTIVA",
    sublabel: "E-Sertifikat Digital + QR",
    desc: "Terbitkan sertifikat digital terverifikasi dengan QR code untuk pelatihan, bimtek, & uji kompetensi.",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "Gelombang 1",
    badgeColor: "text-amber-400 border-amber-400/30",
    live: true,
  },
  {
    href: "/diagnostik-kompetensi",
    icon: Brain,
    label: "Diagnostik Kompetensi",
    sublabel: "Gap Analysis AI — SKK/KKNI",
    desc: "Analisis AI terhadap profil pendidikan & pengalaman untuk menentukan level KKNI dan gap kompetensi.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 1",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/mock-asesmen",
    icon: Target,
    label: "Mock Asesmen SKK",
    sublabel: "Simulasi Uji Kompetensi AI",
    desc: "Latihan soal uji kompetensi berbasis SKKNI/BNSP dengan penilaian dan penjelasan per soal.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 1",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/persiapan-asesmen",
    icon: ClipboardList,
    label: "Persiapan Asesmen SKK",
    sublabel: "Paket Dokumen + Tips Asesor",
    desc: "Generate checklist dokumen, unit kompetensi prioritas, tips wawancara asesor, dan estimasi biaya sertifikasi.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 1",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/cek-kelayakan-skk",
    icon: Search,
    label: "Cek Kelayakan SKK",
    sublabel: "SKK apa yang bisa diambil sekarang?",
    desc: "Input pendidikan + pengalaman → AI menampilkan semua jabatan SKK eligible sekarang, yang bisa dicapai 1-2 tahun, dan urutan prioritas strategis.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 2",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/generator-apl02",
    icon: FileText,
    label: "Generator APL-02 Asesmen Mandiri",
    sublabel: "Formulir SKK otomatis dari pengalamanmu",
    desc: "Ceritakan pengalaman kerja → AI pre-fills seluruh APL-02 (klaim K/BK, konfidensitas, jenis bukti, dokumen pendukung) per unit SKKNI.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 2",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/roi-karir-skk",
    icon: DollarSign,
    label: "ROI & Karir SKK",
    sublabel: "Berapa kenaikan gaji & kapan balik modal?",
    desc: "Input jabatan + gaji + target SKK → proyeksi kenaikan gaji, breakeven biaya sertifikasi, ROI 5 tahun, dan roadmap SKK lanjutan.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 2",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/syarat-personel-bujk",
    icon: Building2,
    label: "Syarat Personel & Compliance BUJK",
    sublabel: "Permen PUPR 6/2025 — PJT/PJK/Tenaga Ahli",
    desc: "Pilih klasifikasi + grade BUJK → lihat syarat personel SKK wajib, atau input personel yang ada untuk compliance check + gap analysis.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 2",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/generator-dokumen-skk",
    icon: FileText,
    label: "Generator Dokumen SKK",
    sublabel: "Surat Pernyataan · Keterangan Kerja · Pengantar LSP",
    desc: "Generate 3 jenis surat resmi aplikasi SKK: surat pernyataan pengalaman kerja (bermaterai), surat keterangan kerja, dan surat pengantar ke LSP — siap cetak.",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    bg: "bg-sky-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-sky-400 border-sky-400/30",
    live: true,
  },
  {
    href: "/planner-skk-bujk",
    icon: Building2,
    label: "Planner SKK BUJK",
    sublabel: "Analisis kebutuhan SKK · gap analysis · rencana rekrutmen",
    desc: "Input subklasifikasi + kualifikasi SBU + SKK yang sudah ada → AI analisis kebutuhan SKK wajib per Permen PUPR 6/2021, gap yang harus diisi, rencana rekrutmen/sertifikasi, estimasi biaya, dan timeline.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-indigo-400 border-indigo-400/30",
    live: true,
  },
  {
    href: "/checker-skk-proyek",
    icon: Shield,
    label: "Checker Kepatuhan SKK Proyek",
    sublabel: "Cek SKK vs proyek · syarat per regulasi · skor kepatuhan",
    desc: "Input jenis + nilai proyek + SKK BUJK → AI cek kepatuhan: syarat SKK spesifik proyek berdasarkan PP 14/2021, status terpenuhi/kurang, kewajiban administrasi, dan tindakan yang diperlukan sebelum tender.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/panduan-apl01",
    icon: ClipboardList,
    label: "Panduan Pengisian APL-01",
    sublabel: "Petunjuk per seksi · contoh isian · checklist · dokumen",
    desc: "Pilih jabatan SKK + jalur asesmen → AI buat panduan lengkap APL-01: petunjuk tiap seksi dengan contoh isian nyata, daftar dokumen wajib/pendukung, kesalahan umum yang harus dihindari, dan checklist sebelum submit ke LSP.",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bg: "bg-rose-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-rose-400 border-rose-400/30",
    live: true,
  },
  {
    href: "/biaya-tim-skk",
    icon: DollarSign,
    label: "Kalkulator Biaya Tim SKK",
    sublabel: "Estimasi anggaran · per jalur · tips hemat · localStorage",
    desc: "Tambahkan jabatan SKK + jumlah orang + jalur sertifikasi → kalkulator estimasi biaya per item dan total: min/rata-rata/maks, perbandingan jalur (portofolio vs diklat), dan tips hemat untuk grup.",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-amber-400 border-amber-400/30",
    live: true,
  },
  {
    href: "/generator-cv-skk",
    icon: FileText,
    label: "Generator CV Kompetensi SKK",
    sublabel: "AI tulis CV profesional · kompetensi terstruktur · siap tender",
    desc: "Input profil + daftar proyek → AI buat CV lengkap: profil profesional, kompetensi utama, pengalaman proyek dengan bullet BNSP-ready, kualifikasi, dan tips optimasi CV untuk aplikasi SKK & tender.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-cyan-400 border-cyan-400/30",
    live: true,
  },
  {
    href: "/materi-belajar-skk",
    icon: BookOpen,
    label: "Materi Belajar & Referensi SKK",
    sublabel: "Rencana studi · topik prioritas · regulasi · referensi",
    desc: "Pilih jabatan SKK + waktu belajar → AI buat panduan studi terstruktur: rencana per minggu, 5–7 topik dengan poin kunci, referensi SNI/Peraturan/Buku nyata, tips asesmen, dan kesalahan umum yang harus dihindari.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/kalkulator-cpd",
    icon: Calculator,
    label: "Kalkulator Poin CPD SKK",
    sublabel: "Hitung poin CPD · status perpanjangan · gap analysis",
    desc: "Tambahkan aktivitas CPD (diklat, seminar, proyek, publikasi, organisasi) → kalkulator otomatis hitung total poin, status cukup/kurang, dan saran aktivitas tambahan untuk mencapai 30 poin minimum.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/evaluasi-portofolio",
    icon: FileCheck,
    label: "Evaluasi Kesiapan Portofolio SKK",
    sublabel: "AI evaluasi bukti portofolio · skor 5 kriteria · rekomendasi",
    desc: "Input pengalaman proyek → AI evaluasi kesiapan portofolio untuk jalur RPL: skor per 5 kriteria (relevansi, kompleksitas, kesesuaian level, dokumen, kejelasan peran), dokumen yang kurang, dan rekomendasi perbaikan.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/jalur-sertifikasi",
    icon: MapPin,
    label: "Rekomendasi Jalur Sertifikasi SKK",
    sublabel: "Roadmap multi-tahun · biaya · timeline · karir",
    desc: "Input profil + target karir → AI rancang roadmap sertifikasi SKK optimal: urutan SKK per tahun, prasyarat, estimasi biaya kumulatif, dan dampak karir setiap langkah.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/analisis-skkni",
    icon: LayoutList,
    label: "Analisis Unit SKKNI",
    sublabel: "Unit kompetensi · elemen · KUK · bukti portofolio",
    desc: "Pilih jabatan SKK → AI breakdown semua unit kompetensi (inti/pilihan/umum), elemen, KUK, metode asesmen per unit, contoh bukti portofolio, dan tips menghadapi asesmen.",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    bg: "bg-sky-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-sky-400 border-sky-400/30",
    live: true,
  },
  {
    href: "/tracker-skk",
    icon: Briefcase,
    label: "Tracker Portofolio SKK",
    sublabel: "Dashboard semua SKK Anda · aktif/expired/segera",
    desc: "Simpan semua sertifikat SKK dalam satu dashboard — status aktif/akan expired/sudah expired, countdown hari, progress bar masa berlaku, dan akses cepat panduan perpanjangan.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/simulator-wawancara",
    icon: MessageSquare,
    label: "Simulator Wawancara Asesmen",
    sublabel: "AI asesor BNSP · 4 putaran · skor & feedback",
    desc: "AI berperan sebagai asesor BNSP sungguhan — ajukan 4 pertanyaan wawancara kompetensi situasional, beri feedback per jawaban, dan predikat akhir Kompeten/Belum Kompeten.",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bg: "bg-rose-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-rose-400 border-rose-400/30",
    live: true,
  },
  {
    href: "/perpanjangan-skk",
    icon: RefreshCw,
    label: "Panduan Perpanjangan SKK",
    sublabel: "Status aktif · Jalur perpanjangan · Timeline",
    desc: "Input jabatan SKK + tanggal terbit → status real-time (sisa hari), 3 jalur perpanjangan (asesmen ulang / portofolio / diklat), dokumen, biaya, dan risiko jika tidak diperpanjang.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-indigo-400 border-indigo-400/30",
    live: true,
  },
  {
    href: "/rab-kalkulator",
    icon: BarChart3,
    label: "RAB Kalkulator",
    sublabel: "Estimasi Biaya Konstruksi AI",
    desc: "Kalkulasi RAB otomatis dari deskripsi pekerjaan menggunakan AHSP PermenPUPR 1/2022.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Live",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/k3-vision",
    icon: Shield,
    label: "AI Vision K3",
    sublabel: "Inspeksi K3 dari Foto",
    desc: "Upload foto lapangan → AI analisis temuan K3 + skor kepatuhan berdasarkan PP 50/2012.",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "Live",
    badgeColor: "text-red-400 border-red-400/30",
    live: true,
  },
  {
    href: "/pkb-builder",
    icon: GraduationCap,
    label: "PKB Builder",
    sublabel: "Pengembangan Keprofesian",
    desc: "Rencanakan dan dokumentasikan kegiatan PKB/CPD untuk pemenuhan SKP sertifikasi.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Live",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
];

const STATS = [
  { label: "Agen AI Aktif", value: "944+", icon: Sparkles, color: "text-blue-400" },
  { label: "Domain Konstruksi", value: "45+", icon: Building2, color: "text-emerald-400" },
  { label: "MultiClaw Suites", value: "45", icon: Zap, color: "text-amber-400" },
  { label: "Pasar Konstruksi 2034", value: "$226B", icon: TrendingUp, color: "text-violet-400" },
];

export default function KompetensiHub() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-4 py-14">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-blue-300 text-xs font-medium">Ekosistem Kompetensi 2026–2030</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Platform AI untuk<br /><span className="text-blue-400">Sertifikasi & Kompetensi</span>
            </h1>
            <p className="text-slate-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Dari diagnostik gap hingga sertifikat digital terverifikasi — tools AI untuk mempersiapkan, menilai, dan mendokumentasikan kompetensi tenaga konstruksi Indonesia.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/diagnostik-kompetensi"><Brain className="h-4 w-4 mr-2" /> Mulai Diagnostik</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                <Link href="/mock-asesmen"><Target className="h-4 w-4 mr-2" /> Mock Asesmen</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <s.icon className={`h-5 w-5 mx-auto mb-2 ${s.color}`} />
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Tools Kompetensi</h2>
            <p className="text-slate-400 text-sm">Tersedia sekarang — gratis untuk digunakan</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs">
            <Link href="/ai-tools">Lihat Semua AI Tools <ChevronRight className="h-3.5 w-3.5 ml-1" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {TOOLS.map((t, i) => (
            <Link key={i} href={t.href}>
              <div className={`group rounded-2xl border ${t.borderColor} ${t.bg} p-5 hover:bg-white/5 transition-all cursor-pointer h-full`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`rounded-xl p-2.5 bg-white/5 border border-white/10`}>
                    <t.icon className={`h-5 w-5 ${t.color}`} />
                  </div>
                  <Badge variant="outline" className={`text-xs ${t.badgeColor}`}>{t.badge}</Badge>
                </div>
                <h3 className="text-white font-semibold text-sm mb-0.5">{t.label}</h3>
                <p className={`text-xs ${t.color} mb-2`}>{t.sublabel}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
                <div className={`mt-3 flex items-center gap-1 text-xs ${t.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Buka <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Roadmap 2026-2030 */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Roadmap Produk 2026–2030</h2>
            <p className="text-slate-400 text-sm">Tiga gelombang pertumbuhan Ekosistem Kompetensi Indonesia</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {WAVES.map((w, i) => (
              <div key={i} className={`rounded-2xl border ${w.borderColor} ${w.bg} p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${w.color} uppercase tracking-wide`}>{w.wave}</span>
                  <span className="text-slate-500 text-xs">{w.period}</span>
                </div>
                <p className={`text-sm font-semibold ${w.color} mb-3`}>{w.theme}</p>
                <ul className="space-y-1.5">
                  {w.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-300 text-xs">
                      <CheckCircle2 className={`h-3 w-3 ${i === 0 ? "text-emerald-400" : w.color} shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Market Context */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" /> Konteks Pasar Indonesia 2026–2030
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Konstruksi 2025 → 2034", value: "USD 125B → USD 226B (CAGR 6.77%)", icon: Building2, color: "text-blue-400" },
              { label: "Kekurangan tenaga ahli/tahun", value: "349K–500K pekerja baru", icon: Users, color: "text-amber-400" },
              { label: "Pekerja belum bersertifikat", value: "> 8.3 juta (< 10% tersertifikasi)", icon: GraduationCap, color: "text-red-400" },
              { label: "HR Tech Indonesia 2024", value: "USD 6.01B, tumbuh 15–20%/tahun", icon: BarChart3, color: "text-emerald-400" },
              { label: "Employer hiring micro-credential", value: "97% sudah memprioritaskan", icon: CheckCircle2, color: "text-violet-400" },
              { label: "Digital skilled workers → GDP 2030", value: "USD 303.4 miliar (16% GDP)", icon: Zap, color: "text-teal-400" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon className={`h-4 w-4 mt-0.5 ${item.color} shrink-0`} />
                <div>
                  <p className="text-slate-400 text-xs">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.color}`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-5 border-t border-white/10 pt-4">
            Sumber: Deloitte, World Bank, Credential Engine, HR Tech Indonesia Report 2024, PermenPUPR 6/2021
          </p>
        </div>
      </div>

      {/* MultiClaw CTA */}
      <div className="border-t border-white/10 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <BookOpen className="h-10 w-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Konsultasi dengan AI Spesialis</h2>
          <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
            45 MultiClaw suite AI tersedia untuk konsultasi mendalam — SBU, SKK, K3, Tender, Kontrak, ESG, dan banyak lagi.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline" size="sm" className="border-white/20 hover:bg-white/5 text-sm">
              <Link href="/panduan-askom">→ Panduan Uji Kompetensi SKK</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-white/20 hover:bg-white/5 text-sm">
              <Link href="/panduan-sbu">→ Panduan SBU Konstruksi</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-white/20 hover:bg-white/5 text-sm">
              <Link href="/skema-claw">→ Skema Sertifikasi BUJK</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
