import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useGustaftaAssistant } from "@/hooks/use-agents";
import {
  trackLead, trackViewContent, trackContact,
  trackInitiateCheckout, trackCustomEvent,
} from "@/hooks/use-meta-pixel";
import { ChatPopup } from "@/components/chat-popup";
import { SharedHeader } from "@/components/shared-header";
import {
  Bot, Sparkles, Globe, Shield, BookOpen, ArrowRight, Check, X,
  Zap, Rocket, Brain, Plug, GraduationCap, Briefcase, Store,
  Flame, Package, CheckCircle2, Star, AlertTriangle, Clock,
  TrendingUp, Users, CreditCard, Smartphone, ChevronRight,
  FileText, ClipboardCheck, BarChart3, HardHat, Layers,
  MessageSquare, Lock, HeartHandshake, Award, RefreshCw,
  Clapperboard, PenLine, Video, Megaphone, Phone,
  BadgeCheck, Lightbulb, Target, DollarSign,
} from "lucide-react";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const { data: gustaftaAssistant } = useGustaftaAssistant();
  const [activePersona, setActivePersona] = useState<"bekerja" | "berusaha" | "belajar" | "kreator">("bekerja");
  const [promoCountdown, setPromoCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const PROMO_DEADLINE = new Date("2026-07-01T00:00:00+07:00");
    const tick = () => {
      const diff = PROMO_DEADLINE.getTime() - Date.now();
      if (diff <= 0) { setPromoCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setPromoCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    trackViewContent({ content_name: "Landing Page", content_category: "Homepage" });
  }, []);

  const handleStartNowClick = () => trackLead({ content_name: "Start Now CTA" });
  const handlePricingClick = () => trackViewContent({ content_name: "Pricing Page", content_category: "Pricing" });
  const handleWAClick = (source: string) => { trackContact(); trackCustomEvent("WhatsApp_Click", { source }); };
  const handlePacksClick = () => trackInitiateCheckout({ content_name: "Packs Page", value: 999000, currency: "IDR" });

  const personas = {
    bekerja: {
      icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30",
      label: "Profesional & Kontraktor", tagline: "Asisten Tender, Dokumen & Regulasi PUPR",
      desc: "Analisis tender LPSE otomatis, drafter dokumen teknis, konsultan K3 regulasi, notulis rapat — asisten profesional yang tidak pernah tidur.",
      useCases: [
        { icon: ClipboardCheck, title: "Asisten Tender LPSE", desc: "Checklist 30+ item, gap analysis, SCORECARD Win Probability, draft dokumen sesuai Perpres 46/2025." },
        { icon: FileText, title: "Draft Dokumen & Kontrak", desc: "Proposal teknis, SPK, SMKK plan, risk assessment, NDA — draf pertama siap dalam menit." },
        { icon: HardHat, title: "Konsultan K3 & Regulasi PUPR", desc: "Tanya Permen PUPR, SMK3, PP 50/2012 — jawaban akurat berbasis regulasi resmi." },
        { icon: MessageSquare, title: "Notulis Rapat AI", desc: "Transkripsi otomatis, ringkasan keputusan, dan pusat pengetahuan teknis tim." },
      ],
    },
    berusaha: {
      icon: Store, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30",
      label: "Pengusaha & Bisnis", tagline: "CS Otomatis & Lead Generation 24/7",
      desc: "Jawab 80%+ pertanyaan pelanggan otomatis, tangkap leads, kirim broadcast, tingkatkan konversi tanpa tambah tim CS.",
      useCases: [
        { icon: MessageSquare, title: "Customer Service WA Otomatis", desc: "Jawab FAQ, tracking order, eskalasi ke CS manusia — 24/7 tanpa gaji tambahan." },
        { icon: TrendingUp, title: "Lead Generation & Follow-Up", desc: "Tangkap prospek, kualifikasi leads, notifikasi ke sales — bahkan saat toko tutup." },
        { icon: Sparkles, title: "Konten & Copywriting AI", desc: "Caption IG/TikTok, artikel blog, script iklan, email marketing — siap publish berbasis produk Anda." },
        { icon: BarChart3, title: "Analis Bisnis & Cashflow", desc: "Laporan keuangan, proyeksi omset, alert anomali — tanpa akuntan tambahan." },
      ],
    },
    belajar: {
      icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30",
      label: "Pelajar & Peserta Sertifikasi", tagline: "AI Tutor & Simulasi Ujian 24/7",
      desc: "Simulasi ujian SKK/UTBK adaptif, bank soal cerdas, BIMTEK tanpa jadwal, persiapan uji kompetensi BNSP dari mana saja.",
      useCases: [
        { icon: GraduationCap, title: "Simulasi Ujian SKK & UTBK", desc: "Soal adaptif yang mengoreksi, menjelaskan, dan memberi saran belajar personal." },
        { icon: Brain, title: "Tutor Konstruksi & Teknik Sipil", desc: "Pembahasan SKKNI, Permen PUPR, SNI dari dokumen asli — tanya jawab langsung." },
        { icon: Users, title: "BIMTEK & Onboarding Karyawan", desc: "Modul terstruktur, quiz evaluasi, progress tracking, sertifikat otomatis." },
        { icon: BookOpen, title: "E-Learning Sertifikasi BNSP", desc: "Persiapan uji kompetensi LSP, bank soal adaptif, analisis kelemahan per unit." },
      ],
    },
    kreator: {
      icon: Clapperboard, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/30",
      label: "Kreator & Penulis", tagline: "AI Manajer Konten & Script Writer",
      desc: "Editorial calendar, script YouTube, proposal brand deal, laporan performa — fokus berkreasi, bukan tenggelam di pekerjaan administratif.",
      useCases: [
        { icon: PenLine, title: "Editorial Calendar & Ide Konten", desc: "Rencanakan konten sebulan penuh: tema, content pillars, jadwal per platform." },
        { icon: Video, title: "Script YouTube & Podcast AI", desc: "Hook 5 detik kuat, opening, segmen isi, outro, CTA — script lengkap, natural saat dibacakan." },
        { icon: Megaphone, title: "Proposal Brand Deal & Media Kit", desc: "Profil kreator, audience insight, rate card — media kit profesional siap kirim ke brand." },
        { icon: MessageSquare, title: "Chatbot Kreator Pribadi", desc: "Followers bisa tanya konten, koleksi video, e-book, dan pengetahuan Anda 24/7." },
      ],
    },
  };

  const p = personas[activePersona];
  const PersonaIcon = p.icon;

  const SCALEV_BUNDLE = "https://scalev.id/p/LINK_CHECKOUT_SCALEV_ANDA";
  const SCALEV_BUKU1 = "https://scalev.id/p/LINK_CHECKOUT_BUKU_1_SCALEV_ANDA";
  const WA_URL = "https://wa.me/6281234567890?text=Halo%20Gustafta%2C%20saya%20mau%20tanya%20tentang%20Trilogi%20%26%20Gustafta%20Builder";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200" data-testid="page-landing">
      <SharedHeader />

      {/* ── STICKY PROMO BANNER ── */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-2.5 px-4 sticky top-[57px] z-40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Flame className="w-4 h-4 animate-bounce" />
            Early Bird Trilogi + Gustafta Builder — Harga naik per 1 Juli 2026
          </div>
          <div className="flex items-center gap-1 text-xs font-mono">
            {[
              { v: promoCountdown.days, l: "Hari" },
              { v: promoCountdown.hours, l: "Jam" },
              { v: promoCountdown.minutes, l: "Mnt" },
              { v: promoCountdown.seconds, l: "Dtk" },
            ].map(({ v, l }, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span className="opacity-50">:</span>}
                <span className="bg-white/20 px-1.5 py-0.5 rounded font-bold tabular-nums">{String(v).padStart(2, "0")}</span>
                <span className="opacity-70 text-[10px]">{l}</span>
              </span>
            ))}
          </div>
          <a href={SCALEV_BUNDLE} target="_blank" rel="noopener noreferrer" onClick={() => handleWAClick("promo-banner")}>
            <button className="bg-white text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap" data-testid="button-promo-cta">
              Kunci Harga Sekarang →
            </button>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          HERO — PAIN HEADLINE (3 detik pertama)
      ══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-blue-950/60 text-blue-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 inline-block border border-blue-400/30">
            🚀 Untuk Karyawan, Profesional &amp; Calon Pensiunan
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight" data-testid="text-hero-title">
            Kerja 15 Tahun,<br className="hidden sm:block" />
            Tapi Tabungan Cuma Cukup <span className="text-orange-400 underline decoration-wavy decoration-orange-400/50">6 Bulan?</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Masalahnya <strong className="text-white">BUKAN</strong> kamu kurang pintar atau kurang kerja keras.
            Masalahnya, keahlianmu selama ini cuma <strong className="text-orange-300">"MONOLOG"</strong> — berbicara satu arah ke perusahaan.
            Begitu perusahaan berhenti mendengar (PHK atau pensiun), <strong className="text-white">penghasilan ikut berhenti</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a href={SCALEV_BUNDLE} target="_blank" rel="noopener noreferrer"
              onClick={() => { handleWAClick("hero-primary"); handlePacksClick(); }}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-base font-bold py-4 px-8 rounded-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95"
              data-testid="button-hero-ebook">
              🔥 Ya, Saya Mau Amankan Slot Early Bird
            </a>
            <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={handleStartNowClick}>
              <button className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white text-base font-semibold py-4 px-8 rounded-xl transition-all hover:bg-white/10"
                data-testid="button-hero-platform">
                <Rocket className="w-5 h-5" />
                Coba Platform Gratis
              </button>
            </Link>
          </div>

          <p className="text-sm text-blue-200 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>✅ Garansi 7 Hari Uang Kembali</span>
            <span className="opacity-40">|</span>
            <span>🔒 Checkout Aman via Scalev</span>
            <span className="opacity-40">|</span>
            <span>📦 Akses Seumur Hidup</span>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROBLEM — "Hamster di Roda Putar"
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Pernah Merasa Seperti Hamster di Roda Putar?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                "Gaji cuma numpang lewat. Bayar cicilan, SPP anak, biaya orang tua — langsung habis tanpa sisa.",
                "Tiap ada rumor PHK atau restrukturisasi, jantung langsung dag-dig-dug. Padahal sudah kerja puluhan tahun.",
                "Mendekati pensiun, tapi bayangan \"berhenti kerja = berhenti penghasilan\" bikin malam tak bisa tidur.",
                "Pengen punya side income, tapi mikir: \"Saya gaptek, masa harus belajar coding atau jualan online dari nol?\"",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                  <span className="text-red-500 text-xl mt-0.5 flex-shrink-0">❌</span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="bg-red-600 text-white p-7 rounded-2xl shadow-xl flex flex-col justify-center">
              <p className="text-xl font-extrabold mb-3">STOP. Itu bukan salahmu.</p>
              <p className="text-red-100 leading-relaxed text-sm mb-4">
                Selama ini kamu <strong className="text-white">membangun rumah di atas pasir</strong>.
                Keahlian dan pengalamanmu hanya "berbicara" satu arah ke satu tempat kerja.
                Saat tempat itu berhenti mendengar, <strong className="text-white">penghasilanmu mati suri</strong>.
              </p>
              <p className="text-white font-bold text-base">
                Saatnya beralih dari <span className="bg-white/20 px-1.5 py-0.5 rounded">MONOLOG</span> ke <span className="bg-orange-400 text-white px-1.5 py-0.5 rounded">DIALOG</span> — penghasilan yang terus mengalir meski kamu sedang tidur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SOLUTION — Trilogi + Meta-Case
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Solusinya</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ubah Pengalaman Kerjamu Jadi <span className="text-blue-600">"Mesin Uang" 24/7</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-sm leading-relaxed mb-10">
            Ebook <strong className="text-gray-800 dark:text-white">Trilogi: Dari Monolog ke Dialog</strong> memandu Anda menjadi seorang <em>Orchestrator</em>.
            Anda tidak perlu coding. Cukup <strong className="text-gray-800 dark:text-white">pimpin 6 Agen AI MultiClaw</strong> — Researcher, Narrator, Designer,
            Case Builder, Futurist, Editor — untuk bekerja atas nama keahlian Anda, 24 jam sehari.
          </p>

          {/* 3 Buku */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { n: "I", title: "Belajar", sub: "Pahami cara kerja AI dan bagaimana merakit chatbot spesialis dari pengalaman Anda", color: "from-blue-600 to-blue-500" },
              { n: "II", title: "Bekerja", sub: "Praktik langsung: rakit asisten AI pertama Anda dan dapatkan klien/pengguna pertama", color: "from-emerald-600 to-emerald-500" },
              { n: "III", title: "Berkarya", sub: "Skalakan: dari 1 asisten jadi ekosistem chatbot dengan penghasilan subscription", color: "from-orange-600 to-orange-500" },
            ].map((b) => (
              <div key={b.n} className={`bg-gradient-to-br ${b.color} text-white rounded-2xl p-5 shadow-lg text-left`}>
                <div className="text-xs font-bold opacity-70 mb-1">BUKU {b.n}</div>
                <div className="text-xl font-extrabold mb-2">{b.title}</div>
                <p className="text-sm text-white/80 leading-relaxed">{b.sub}</p>
              </div>
            ))}
          </div>

          {/* META-CASE Box */}
          <div className="bg-blue-950 text-white p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-blue-700/40">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <h3 className="text-lg font-extrabold">META-CASE: Bukti Nyata Metode Ini Bekerja</h3>
            </div>
            <p className="text-blue-100 leading-relaxed text-sm">
              Ebook Trilogi yang sedang Anda baca ini <strong className="text-white">DITULIS menggunakan metode yang sama</strong> yang diajarkan di dalamnya.
              Proses riset, narasi, pengecekan fakta, hingga desain struktur bab — semuanya dieksekusi oleh Tim 6-Agen AI MultiClaw, dipimpin oleh satu <em>Orchestrator</em> (manusia).
            </p>
            <p className="text-blue-200 text-sm mt-3">
              <strong className="text-white">Jadi jika Anda bertanya: "Ini beneran works?"</strong><br />
              Jawabannya: Anda sedang memegang buktinya.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SOCIAL PROOF — Testimoni Relatable
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 text-center">Bukan Teori</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Kisah Nyata dari Orang-Orang Seperti Anda
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Testimoni personal/relatable */}
            {[
              {
                quote: "Dulu saya panik tiap denger rumor restructuring. Tapi setelah baca Buku I, saya rakit 'Asisten Admin AI' dari pengalaman 20 tahun saya di kantor. Sekarang saya punya 50 klien UKM subscription Rp 100rb/bulan. Side income Rp 5 juta/bulan. Kalau di-PHK pun, saya nggak panik lagi.",
                name: "Bu Sari", age: "48 tahun", role: "Staf Admin, Bekasi", bg: "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30",
              },
              {
                quote: "Saya kira masa tua bakal jadi beban anak. Uang pensiun cuma cukup 2 tahun. Tapi setelah coba metode ini, saya rakit 'Tutor AI untuk Siswa SMA' dari pengalaman 30 tahun mengajar. Sekarang ada 200 subscriber, Rp 10 juta/bulan. Pensiun bukan lagi momok, tapi berkah.",
                name: "Pak Hartono", age: "62 tahun", role: "Pensiunan Guru, Surabaya", bg: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30",
              },
            ].map((t, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${t.bg} relative`}>
                <div className="text-4xl text-gray-300 dark:text-gray-600 font-serif leading-none mb-2">"</div>
                <p className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed mb-4">{t.quote}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.name.split(" ").map(w => w[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.age} · {t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimoni B2B profesional */}
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Budi Santoso", role: "Direktur Teknik, PT Bangun Nusa Konstruksi", avatar: "BS", text: "TenderaClaw menghemat 2–3 hari kerja per tender. Win rate naik signifikan dalam 3 bulan.", tag: "Kontraktor BUJK" },
              { name: "Retno Ayu", role: "Kepala Divisi Sertifikasi, LSP Konstruksi", avatar: "RA", text: "Simulasi asesmen SKKNI via AI sangat membantu peserta. Kelulusan jauh lebih konsisten.", tag: "Sertifikasi LSP" },
              { name: "Agus Prasetyo", role: "CEO, PT Graha Mandiri Consultant", avatar: "AP", text: "SCORECARD Win Probability dari BrainClaw — return on investment-nya jelas dan terukur.", tag: "Konsultan MK" },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm" data-testid={`card-testimonial-${t.avatar.toLowerCase()}`}>
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold flex-shrink-0">{t.avatar}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{t.role}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex-shrink-0">{t.tag}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, value: "1350+", label: "Agent AI Spesialis" },
              { icon: Target, value: "131", label: "Hub Orchestrator" },
              { icon: Zap, value: "45+", label: "MultiClaw AI Tools" },
              { icon: BadgeCheck, value: "24/7", label: "AI Selalu Aktif" },
            ].map((s) => {
              const SIcon = s.icon;
              return (
                <div key={s.label} className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <SIcon className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="text-2xl font-extrabold text-blue-600 mb-0.5">{s.value}</div>
                  <div className="text-xs text-gray-500 text-center">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          INTEREST — Cara Kerja Platform
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Cara Kerja</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Dari Nol ke Chatbot AI Aktif: <span className="text-blue-600">&lt; 30 Menit</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Tidak perlu coding. Tidak perlu server. Tidak perlu tim IT.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { n: "1", title: "Buat Chatbot", desc: "Pilih template atau mulai dari nol. Isi persona dan keahlian chatbot Anda.", time: "±5 mnt", color: "bg-blue-600" },
              { n: "2", title: "Isi Knowledge Base", desc: "Upload PDF, paste URL, atau input teks dokumen regulasi/SOP Anda.", time: "±10 mnt", color: "bg-emerald-600" },
              { n: "3", title: "Konfigurasi & Test", desc: "Atur model AI, ragTopK, greeting, dan prompt cepat untuk segmen target.", time: "±7 mnt", color: "bg-orange-600" },
              { n: "4", title: "Deploy & Layani", desc: "Share link, embed di website, atau connect ke WhatsApp/Telegram.", time: "±3 mnt", color: "bg-violet-600" },
            ].map((s, i) => (
              <div key={s.n} className="relative bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow">
                {i < 3 && <div className="hidden md:block absolute top-6 left-full w-6 text-gray-300 dark:text-gray-700 text-xs font-bold z-10 text-center">→</div>}
                <div className={`w-10 h-10 ${s.color} text-white rounded-full flex items-center justify-center text-base font-bold mx-auto mb-3`}>{s.n}</div>
                <div className="text-[10px] font-semibold text-center text-gray-400 mb-1">{s.time}</div>
                <h3 className="font-bold text-sm mb-1.5 text-center text-gray-900 dark:text-white">{s.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-center">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DESIRE — Persona Tabs (Untuk Siapa)
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Untuk Siapa?</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Satu Platform, Cocok untuk Semua Profesi</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Pilih peran Anda dan lihat bagaimana Gustafta bekerja untuk situasi Anda.</p>
          </div>

          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {(["bekerja", "berusaha", "belajar", "kreator"] as const).map((key) => {
              const tab = personas[key];
              const TabIcon = tab.icon;
              return (
                <button key={key} onClick={() => setActivePersona(key)}
                  data-testid={`tab-persona-${key}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${activePersona === key ? `${tab.bg} ${tab.color} ${tab.border}` : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-300"}`}
                >
                  <TabIcon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          <div className={`rounded-2xl border-2 ${p.border} ${p.bg} p-6 md:p-8`}>
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-white dark:bg-gray-900 border ${p.border} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <PersonaIcon className={`w-6 h-6 ${p.color}`} />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wide ${p.color} mb-1`}>{p.label}</p>
                <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">{p.tagline}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {p.useCases.map((uc) => {
                const UCIcon = uc.icon;
                return (
                  <div key={uc.title} className="flex items-start gap-3 bg-white/70 dark:bg-gray-900/70 rounded-xl p-3.5 border border-gray-200/60 dark:border-gray-700/40">
                    <div className={`w-8 h-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <UCIcon className={`w-4 h-4 ${p.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-0.5 text-gray-900 dark:text-white">{uc.title}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{uc.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end">
              <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={handleStartNowClick}>
                <button className={`flex items-center gap-2 text-sm font-semibold ${p.color} hover:underline`} data-testid={`button-persona-cta-${activePersona}`}>
                  Mulai Sekarang <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ACTION — PRICING
      ══════════════════════════════════════════════ */}
      <section id="pricing" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Investasi</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Pilih Jalan Anda Menuju <span className="text-orange-500">Dialog</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Investasi leher ke atas untuk ketenangan finansial jangka panjang.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Card 1: Trilogi Ebook Bundle */}
            <div className="relative bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border-2 border-orange-500 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-extrabold py-1.5 px-5 rounded-full shadow whitespace-nowrap">
                PALING LARIS 🔥
              </div>
              <div className="p-7 pt-10">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">BUNDLE TRILOGI LENGKAP</h3>
                <p className="text-gray-500 text-xs mb-5">Buku I + II + III · Belajar → Bekerja → Berkarya</p>
                <div className="text-4xl font-extrabold text-orange-600 mb-1">Rp 499.000</div>
                <div className="text-gray-400 text-sm line-through mb-6">Normal: Rp 945.000 <span className="text-orange-500 no-underline font-semibold">(Hemat 47%)</span></div>
                <ul className="space-y-2.5 mb-7 text-sm text-gray-700 dark:text-gray-300">
                  {[
                    "Buku I, II, III (PDF + Flipbook Interaktif)",
                    "Prompt Pack MultiClaw (50+ prompt siap pakai)",
                    "Template Tim 6-Agen AI (import 1 klik)",
                    "🎁 BONUS: 1 Bulan Gustafta Builder GRATIS",
                    "🔄 Update gratis selamanya",
                    "🛡️ Garansi 7 hari uang kembali",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
                <a href={SCALEV_BUNDLE} target="_blank" rel="noopener noreferrer"
                  onClick={() => { handleWAClick("pricing-bundle"); handlePacksClick(); }}
                  className="block w-full text-center bg-orange-600 hover:bg-orange-500 text-white text-base font-extrabold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
                  data-testid="button-pricing-bundle">
                  AMANKAN BUNDLE SEKARANG →
                </a>
                <p className="text-xs text-gray-400 mt-3 text-center">⏰ Early Bird hanya sampai 30 Juni 2026</p>
              </div>
            </div>

            {/* Card 2: Gustafta Builder Platform */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-800/40 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-5 text-white">
                <h3 className="text-lg font-extrabold mb-1">GUSTAFTA BUILDER</h3>
                <p className="text-blue-100 text-xs">Platform SaaS — Bangun chatbot AI sendiri</p>
              </div>
              <div className="p-7">
                <div className="text-3xl font-extrabold text-blue-600 mb-1">Mulai Rp 199.000<span className="text-base font-normal text-gray-400">/bulan</span></div>
                <div className="text-gray-400 text-sm mb-5">Atau coba gratis tanpa kartu kredit</div>
                <ul className="space-y-2.5 mb-7 text-sm text-gray-700 dark:text-gray-300">
                  {[
                    "1350+ Agent AI spesialis siap pakai",
                    "45+ MultiClaw Tools premium",
                    "Knowledge Base 7 tipe (PDF, URL, YouTube...)",
                    "Multi-channel: WA, Telegram, Web Widget",
                    "Custom domain & branding",
                    "Analytics & laporan percakapan",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
                <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={handleStartNowClick}>
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-base font-bold py-4 rounded-xl shadow transition-all transform hover:scale-[1.02]"
                    data-testid="button-pricing-platform">
                    Mulai Gratis Sekarang →
                  </button>
                </Link>
                <Link href="/packs" onClick={handlePricingClick}>
                  <button className="w-full mt-2 text-center text-sm text-blue-600 hover:text-blue-500 font-semibold py-2" data-testid="button-pricing-detail">
                    Lihat Detail Paket Harga →
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mulai buku 1 saja */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm mb-2">Belum siap bundle? Mulai dari yang dasar dulu:</p>
            <a href={SCALEV_BUKU1} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-500 font-semibold underline text-sm"
              data-testid="link-buku1">
              Ambil Buku I Saja (Early Bird Rp 245.000) →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ — Objection Busting
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 text-center">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Pertanyaan yang Sering Muncul
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              {
                q: "🤔 \"Saya sudah tua, masa harus belajar teknologi baru?\"",
                a: "Justru ini keunggulan Anda! Pengalaman 10–20 tahun yang Anda miliki adalah aset yang tidak dipunya generasi muda. Gustafta adalah alat no-code. Tidak ada coding, tidak ada server. Jika Anda bisa isi formulir online dan kirim email, Anda bisa melakukannya."
              },
              {
                q: "🤔 \"Saya terancam PHK, tidak punya banyak waktu untuk belajar hal baru\"",
                a: "Justru karena itulah ini DARURAT. Buku ini dirancang untuk orang sibuk. Setiap bab bisa dibaca 15–20 menit. Total cukup 20–25 jam dalam 1–3 bulan untuk membangun fondasi 'sekoci' finansial Anda. Mulai sekarang adalah keputusan terbaik."
              },
              {
                q: "🤔 \"Apa bedanya dengan chatbot biasa yang bisa saya buat di platform lain?\"",
                a: "Gustafta bukan sekedar chatbot biasa. Di dalamnya sudah ada 1350+ agent AI spesialis yang sudah dilatih untuk domain spesifik (konstruksi, hukum, K3, tender, SKK, energi, dll). Plus 45+ MultiClaw Tools dengan sistem Multi-Agent Orchestration — hasilnya jauh lebih akurat dan kontekstual."
              },
              {
                q: "🤔 \"Bagaimana jika saya tidak puas setelah beli?\"",
                a: "Kami percaya pada metode ini. Coba 7 hari, praktik minimal satu latihan dari Buku I. Jika tidak ada manfaat yang Anda rasakan, hubungi kami dan uang kembali 100%. Tanpa pertanyaan, tanpa drama."
              },
              {
                q: "🤔 \"Apakah saya perlu langganan bulanan untuk menggunakan ebook?\"",
                a: "Tidak. Ebook Trilogi adalah pembelian sekali bayar dengan akses seumur hidup dan update gratis. Gustafta Builder Platform adalah produk terpisah (berlangganan bulanan). Anda bisa mulai dari ebook dulu, lalu gunakan bonus 1 bulan Gustafta Builder GRATIS yang disertakan di bundle."
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-gray-200 dark:border-gray-800 rounded-xl px-4">
                <AccordionTrigger className="text-sm font-semibold text-gray-900 dark:text-white hover:no-underline py-4 text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pb-4">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA — Urgency Close
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            Dua Pilihan di Depan Anda
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-4">
              <p className="font-bold text-red-300 mb-2">❌ Tidak melakukan apa-apa</p>
              <p className="text-sm text-red-200/80 leading-relaxed">Tetap di roda hamster. Tetap khawatir soal PHK. Tetap bergantung pada satu sumber penghasilan. 5 tahun lagi situasinya tidak berubah.</p>
            </div>
            <div className="bg-green-900/40 border border-green-400/40 rounded-xl p-4">
              <p className="font-bold text-green-300 mb-2">✅ Ambil langkah hari ini</p>
              <p className="text-sm text-green-200/80 leading-relaxed">Mulai ubah keahlian jadi chatbot AI. 3 bulan lagi punya side income pertama. 6 bulan lagi punya penghasilan yang tidak bergantung satu bos.</p>
            </div>
          </div>
          <a href={SCALEV_BUNDLE} target="_blank" rel="noopener noreferrer"
            onClick={() => { handleWAClick("final-cta"); handlePacksClick(); }}
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-lg font-extrabold py-5 px-10 rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 mb-4"
            data-testid="button-final-cta">
            🔥 Ya, Saya Mau Mulai Sekarang
          </a>
          <p className="text-sm text-blue-200">✅ Garansi 7 Hari Uang Kembali &nbsp;|&nbsp; ⏰ Early Bird habis 30 Juni 2026</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-500 py-8 px-4 text-center text-sm">
        <p className="mb-1 text-gray-400">© 2026 Gustafta — WordPress-nya Ekosistem Kompetensi Indonesia.</p>
        <p className="text-xs">Butuh bantuan? <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={() => handleWAClick("footer")} className="text-green-400 hover:text-green-300 underline">Hubungi kami via WhatsApp</a></p>
      </footer>

      {/* ══════════════════════════════════════════════
          STICKY FLOATING CTA — WhatsApp + Beli
          (selalu terlihat saat scroll di HP)
      ══════════════════════════════════════════════ */}
      {/* WhatsApp Float */}
      <a href={WA_URL} target="_blank" rel="noopener noreferrer"
        onClick={() => handleWAClick("floating-wa")}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-400 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 z-50 transition-all transform hover:scale-110 active:scale-95"
        data-testid="button-floating-wa">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="font-bold text-sm hidden md:inline">Tanya via WhatsApp</span>
      </a>

      {/* Mobile sticky bottom bar CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex gap-3 shadow-2xl">
        <a href={SCALEV_BUNDLE} target="_blank" rel="noopener noreferrer"
          onClick={() => { handleWAClick("mobile-sticky"); handlePacksClick(); }}
          className="flex-1 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold py-3 rounded-xl text-center transition-all active:scale-95"
          data-testid="button-mobile-sticky-buy">
          🔥 Early Bird Rp 499.000
        </a>
        <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={handleStartNowClick}>
          <button className="px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-3 rounded-xl transition-all active:scale-95"
            data-testid="button-mobile-sticky-try">
            Coba Gratis
          </button>
        </Link>
      </div>

      {/* Chat Popup */}
      {gustaftaAssistant && (
        <ChatPopup agent={gustaftaAssistant} />
      )}
    </div>
  );
}
