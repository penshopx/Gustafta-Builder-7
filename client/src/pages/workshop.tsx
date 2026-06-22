import { SharedHeader } from "@/components/shared-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, BookOpen, Blocks, Zap, Check, MessageCircle,
  Clock, Users, Award, ChevronRight, Star, Lightbulb, Settings2,
  FileText, LayoutGrid, ArrowRight,
} from "lucide-react";

const KURIKULUM = [
  {
    no: "01",
    title: "Filosofi Trilogi Gustafta",
    subtitle: "Fondasi berpikir sebelum membangun",
    icon: BookOpen,
    color: "text-indigo-500",
    border: "border-indigo-200 dark:border-indigo-800",
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    badgeBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    items: [
      "Mengapa AI tidak cukup hanya 'pintar' — harus tepat konteks",
      "Struktur Trilogi: Jilid 1 (Dasar) · Jilid 2 (Konfigurasi) · Jilid 3 (Ekosistem)",
      "Prinsip prompt engineering yang benar untuk domain spesifik",
      "Membangun persona AI yang konsisten & profesional",
      "Kesalahan umum builder pemula & cara menghindarinya",
    ],
  },
  {
    no: "02",
    title: "Konfigurasi Gustafta Builder",
    subtitle: "Hands-on membangun di platform",
    icon: Settings2,
    color: "text-violet-500",
    border: "border-violet-200 dark:border-violet-800",
    bg: "bg-violet-50 dark:bg-violet-950/20",
    badgeBg: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    items: [
      "Setup agen: system prompt, persona, tone, dan knowledge base",
      "Konfigurasi multi-agen & orkestrasi Inter-Agent API",
      "Mengelola knowledge base: upload dokumen, klasifikasi, versi",
      "Integrasi WhatsApp, Telegram & embed widget ke website",
      "Mini Apps: mengaktifkan & mengkustomisasi 45 tipe tools",
    ],
  },
  {
    no: "03",
    title: "Ekosistem Kompetensi",
    subtitle: "Dari dialog ke aksi nyata",
    icon: Blocks,
    color: "text-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    badgeBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    items: [
      "Generator Dokumen: kontrak, RAB, laporan, executive summary",
      "E-Course & LMS: ubah chatbot jadi platform belajar interaktif",
      "Ekosistem PKB: Executive Summary + klaim SKP ke LPJK",
      "Store Creator: syarat sertifikasi & cara submit chatbot ke Store",
      "Model bisnis creator: harga, komisi, dan distribusi produk",
    ],
  },
];

const ALUR = [
  { step: "1", label: "Daftar Tunggu", desc: "Masukkan nomor WhatsApp — kami kabari saat slot tersedia", icon: MessageCircle, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  { step: "2", label: "Ikuti Workshop", desc: "3 sesi online · 2 jam per sesi · Hari kerja", icon: GraduationCap, color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  { step: "3", label: "Lulus & Sertifikat", desc: "Ujian praktik konfigurasi chatbot nyata di Builder", icon: Award, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  { step: "4", label: "Jadi Creator Bersertifikat", desc: "Boleh submit chatbot ke Store Creator Gustafta", icon: Star, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
];

export default function WorkshopPage() {
  const waUrl = "https://wa.me/6282299417818?text=Halo%2C%20saya%20ingin%20daftar%20tunggu%20Workshop%20Gustafta%20Builder";

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      {/* Hero */}
      <section className="py-14 px-4 text-center border-b bg-gradient-to-b from-indigo-50/60 to-background dark:from-indigo-950/20">
        <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800">
          🎓 Segera Hadir — Workshop Gustafta Builder
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
          Belajar membangun chatbot AI<br className="hidden sm:block" />
          <span className="text-indigo-600 dark:text-indigo-400"> yang benar-benar bekerja</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4 text-sm sm:text-base leading-relaxed">
          Workshop resmi Gustafta — dari filosofi Trilogi hingga konfigurasi platform secara hands-on.
          Lulus workshop = berhak menjadi <strong className="text-gray-900 dark:text-white">Creator Bersertifikat</strong> yang bisa menjual chatbot di Store Creator.
        </p>

        {/* Coming soon chip */}
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-full px-4 py-2 text-xs text-amber-700 dark:text-amber-400 mb-8">
          <Clock className="h-3.5 w-3.5" />
          Kurikulum sedang disusun — direncanakan rilis dalam 3 bulan ke depan
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-600 hover:bg-green-500 text-white gap-2 px-6 h-11 rounded-full shadow-lg" data-testid="btn-daftar-tunggu-hero">
              <MessageCircle className="h-4 w-4" />
              Daftar Tunggu Sekarang
            </Button>
          </a>
          <a href="/store">
            <Button variant="outline" className="gap-2 px-6 h-11 rounded-full" data-testid="btn-lihat-store">
              Lihat Store Creator <ChevronRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-16">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: "3", label: "Sesi Workshop", sub: "2 jam per sesi" },
            { value: "3", label: "Pilar Kurikulum", sub: "Trilogi · Builder · Ekosistem" },
            { value: "45+", label: "Mini Apps", sub: "yang dipelajari langsung" },
            { value: "✓", label: "Sertifikat Resmi", sub: "dari Gustafta" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{s.value}</div>
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{s.label}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Alur Workshop */}
        <div>
          <div className="text-center mb-8">
            <Badge className="mb-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">Alur Peserta</Badge>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dari pendaftaran hingga bersertifikat</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ALUR.map((a, i) => (
              <div key={i} className="relative">
                {i < ALUR.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[calc(100%+0.25rem)] w-4 text-gray-300 dark:text-gray-600 z-10">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
                <div className="rounded-2xl border bg-card p-4 flex flex-col items-center text-center gap-2 shadow-sm h-full">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}>
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Step {a.step}</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{a.label}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kurikulum */}
        <div>
          <div className="text-center mb-8">
            <Badge className="mb-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">Kurikulum</Badge>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">3 Pilar yang akan Anda kuasai</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Kurikulum lengkap sedang disusun. Topik utama per pilar sudah final.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {KURIKULUM.map((k) => (
              <div key={k.no} className={`rounded-2xl border ${k.border} ${k.bg} p-5 flex flex-col`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${k.border} bg-white/60 dark:bg-black/10 flex-shrink-0`}>
                    <k.icon className={`h-5 w-5 ${k.color}`} />
                  </div>
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${k.color}`}>Pilar {k.no}</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{k.title}</div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3 italic">{k.subtitle}</p>
                <ul className="space-y-1.5 flex-1">
                  {k.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                      <Check className={`w-3 h-3 shrink-0 mt-0.5 ${k.color}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Apps callout */}
        <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 p-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0">
              <LayoutGrid className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-violet-500 uppercase tracking-wide mb-1">Yang Membedakan dari Builder Lain</div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                Anda belajar membangun chatbot yang <em>bertindak</em>, bukan cuma bicara
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Modul Pilar 02 dan 03 langsung hands-on dengan <strong>45 tipe Mini Apps</strong> — Anda belajar
                cara mengaktifkan Generator Dokumen, Kalkulator RAB, Laporan KPI, dan lainnya di dalam chatbot
                yang sedang Anda bangun.
              </p>
              <div className="flex flex-wrap gap-2">
                {["📋 Checklist & Audit", "🧮 Kalkulator RAB", "📄 Generator Dokumen", "📊 Laporan KPI", "🎓 Ekosistem Kompetensi"].map((tag) => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/20 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Siapa yang cocok */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Workshop ini cocok untuk siapa?</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: Users, title: "Konsultan & Praktisi", desc: "Yang ingin tambah layanan AI ke klien — bisa jual chatbot siap pakai lewat Store Creator" },
              { icon: Lightbulb, title: "Builder Mandiri", desc: "Yang sudah punya akun Builder dan ingin memaksimalkan semua fitur — termasuk Mini Apps & Generator Dokumen" },
              { icon: FileText, title: "Penulis & Kreator Konten", desc: "Yang ingin AI yang menghasilkan dokumen profesional, bukan sekadar menjawab pertanyaan" },
              { icon: Zap, title: "Operator & Admin Bisnis", desc: "Yang ingin chatbot operasional — bukan coba-coba — dengan konfigurasi yang benar dari awal" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="text-center rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-8">
          <div className="text-3xl mb-3">🎓</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Daftar tunggu sekarang — gratis</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
            Kami hubungi Anda via WhatsApp saat batch pertama dibuka.
            Tidak ada biaya pendaftaran — daftar tunggu gratis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-500 text-white gap-2 px-8 h-11 rounded-full shadow-lg" data-testid="btn-daftar-tunggu-bottom">
                <MessageCircle className="h-4 w-4" />
                Daftar Tunggu via WhatsApp
              </Button>
            </a>
          </div>
          <p className="text-[11px] text-gray-400 mt-4">
            Atau hubungi langsung: <a href="https://wa.me/6282299417818" className="underline underline-offset-2 hover:text-gray-600">082299417818</a>
          </p>
        </div>

      </div>
    </div>
  );
}
