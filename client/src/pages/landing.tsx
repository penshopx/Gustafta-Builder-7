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
  Clapperboard, PenLine, Video, Megaphone, Network, GitBranch,
  ScanSearch, Cpu, Repeat2, LayoutGrid, Activity,
} from "lucide-react";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const { data: gustaftaAssistant } = useGustaftaAssistant();
  const [activePersona, setActivePersona] = useState<"belajar" | "bekerja" | "berusaha" | "kreator">("bekerja");
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
    belajar: {
      icon: GraduationCap,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      label: "Belajar",
      tagline: "AI Tutor & BIMTEK 24/7",
      desc: "AI tutor per mata pelajaran, simulasi ujian SKK/UTBK, bank soal adaptif, dan bimbingan BNSP — tersedia kapan saja tanpa terikat jadwal.",
      useCases: [
        { icon: GraduationCap, title: "Simulasi Ujian SKK & UTBK", desc: "Latihan soal yang mengoreksi, menjelaskan, dan memberi saran belajar personal." },
        { icon: Brain, title: "Tutor Konstruksi & Teknik Sipil", desc: "Pembahasan materi SKKNI, Permen PUPR, SNI dari dokumen asli — tanya jawab langsung." },
        { icon: Users, title: "BIMTEK & Onboarding Karyawan", desc: "Modul terstruktur, quiz evaluasi, progress tracking, dan sertifikat otomatis." },
        { icon: BookOpen, title: "E-Learning Sertifikasi BNSP", desc: "Persiapan uji kompetensi LSP, bank soal adaptif, dan analisis kelemahan per unit kompetensi." },
      ],
    },
    bekerja: {
      icon: Briefcase,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      label: "Bekerja",
      tagline: "Asisten Profesional & Tender LPSE",
      desc: "Analisis tender LPSE otomatis, drafter dokumen teknis, notulis rapat, dan konsultan K3 yang siap kerja kapan saja dari mana saja.",
      useCases: [
        { icon: ClipboardCheck, title: "Asisten Tender LPSE", desc: "Checklist 30+ item, gap analysis, SCORECARD Win Probability, draft dokumen sesuai Perpres 46/2025." },
        { icon: FileText, title: "Draft Dokumen & Kontrak", desc: "Proposal teknis, SPK, SMKK plan, risk assessment, NDA, MoU — draf pertama dalam menit." },
        { icon: HardHat, title: "Konsultan K3 & Regulasi PUPR", desc: "Tanya Permen PUPR, SMK3, PP 50/2012, PermenPUPR 10/2021 — jawaban akurat berbasis regulasi." },
        { icon: MessageSquare, title: "Notulis Rapat & Knowledge Base Tim", desc: "Transkripsi audio/video otomatis, ringkasan rapat, dan pusat pengetahuan teknis yang bisa diakses via WA." },
      ],
    },
    berusaha: {
      icon: Store,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      label: "Berusaha",
      tagline: "CS Otomatis & Lead Generation",
      desc: "Jawab 80%+ pertanyaan pelanggan otomatis, tangkap leads 24/7, kirim broadcast WhatsApp, dan tingkatkan konversi tanpa tambah tim.",
      useCases: [
        { icon: MessageSquare, title: "Customer Service WhatsApp Otomatis", desc: "Jawab FAQ, tracking order, dan eskalasi ke CS manusia — 24/7 tanpa gaji tambahan." },
        { icon: TrendingUp, title: "Lead Generation & Follow-Up", desc: "Tangkap prospek, kualifikasi leads, kirim notifikasi ke sales — bahkan saat toko tutup." },
        { icon: Sparkles, title: "Konten & Copywriting AI", desc: "Caption IG/TikTok, artikel blog, script iklan, email marketing — siap publish berbasis produk Anda." },
        { icon: BarChart3, title: "Analis Bisnis & Cashflow", desc: "Laporan keuangan sederhana, proyeksi omset, alert anomali pengeluaran — tanpa akuntan tambahan." },
      ],
    },
    kreator: {
      icon: Clapperboard,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/30",
      label: "Kreator",
      tagline: "AI Manajer Konten & Script Writer",
      desc: "Dari editorial calendar bulanan, script YouTube & Podcast, proposal brand deal, hingga laporan performa — AI bantu kreator fokus berkreasi, bukan tenggelam di pekerjaan administratif.",
      useCases: [
        { icon: PenLine, title: "Editorial Calendar & Ide Konten", desc: "Rencanakan konten sebulan penuh: tema mingguan, content pillars, jadwal per platform, dikustomisasi sesuai niche." },
        { icon: Video, title: "Script YouTube & Podcast AI", desc: "Hook 5 detik yang kuat, opening, segmen isi, outro, CTA — script lengkap terasa natural saat dibacakan." },
        { icon: Megaphone, title: "Proposal Brand Deal & Media Kit", desc: "Profil kreator, audience insight, rate card, deliverables & SLA — media kit profesional siap kirim ke brand dalam menit." },
        { icon: MessageSquare, title: "Chatbot Kreator Pribadi", desc: "Bangun chatbot berisi semua konten, koleksi video, e-book, dan pengetahuan Anda — followers bisa tanya 24/7." },
      ],
    },
  };

  const p = personas[activePersona];
  const PersonaIcon = p.icon;

  return (
    <div className="min-h-screen bg-background" data-testid="page-landing">
      <SharedHeader />

      {/* ── ATTENTION: Promo Banner ── */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-2.5 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Flame className="w-4 h-4 animate-bounce" />
            Promo Paket Bisnis — Harga naik 2× per 1 Juli 2026
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
          <Link href="/packs" onClick={handlePacksClick}>
            <button className="bg-white text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors" data-testid="button-promo-cta">
              Kunci Harga Sekarang →
            </button>
          </Link>
        </div>
      </div>

      {/* ── ATTENTION: Hero ── */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            1350+ Agent AI Spesialis · 131 Hub Orchestrator · 45 MultiClaw Tools · Siap Pakai
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight" data-testid="text-hero-title">
            Buat Chatbot AI Cerdas untuk
            <br className="hidden md:block" />
            <span className="text-primary"> Belajar</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-primary">Bekerja</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-orange-500">Berusaha</span>
            <span className="text-muted-foreground"> &amp; </span>
            <span className="text-violet-500">Kreator</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl mt-1 text-muted-foreground font-semibold">— Tanpa Coding</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Dari <strong className="text-foreground">Asisten Tender LPSE</strong>, AI Tutor SKK, Customer Service otomatis, hingga Script Writer —
            bangun chatbot AI dalam <strong className="text-foreground">30 menit tanpa coding</strong>. Sudah dipakai ratusan kontraktor, konsultan, dan bisnis Indonesia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={handleStartNowClick}>
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-bold px-8 py-6" data-testid="button-hero-start">
                <Rocket className="w-5 h-5" />
                Mulai Sekarang — Gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/packs" onClick={handlePricingClick}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base font-semibold px-8 py-6" data-testid="button-hero-pricing">
                <Package className="w-5 h-5" />
                Lihat Paket Harga
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Mulai dari Rp 199.000/bulan · Tanpa kartu kredit · Setup &lt; 30 menit
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="border-y bg-muted/30 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "1350+", label: "Agent AI Spesialis" },
            { value: "131", label: "Hub Orchestrator" },
            { value: "45+", label: "MultiClaw AI Tools" },
            { value: "24/7", label: "AI Selalu Aktif" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-primary mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── STORYTELLING: Tiga Adegan ── */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-transparent dark:via-slate-900/40" />
        <div className="max-w-4xl mx-auto relative">

          {/* Opening hook */}
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Sebelum Kita Bicara Solusi</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
              Kenali Dulu{" "}
              <span className="text-red-500">Masalahnya.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
              Tiga adegan nyata. Tiga orang berbeda. Satu masalah yang sama — dan mungkin salah satunya adalah Anda.
            </p>
          </div>

          {/* Three scenes */}
          <div className="space-y-5 mb-14">

            {/* Scene 1: Kontraktor & Tender */}
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-background overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-indigo-700" />
              <div className="p-6 md:p-8 pl-8 md:pl-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-full">🌙 Pukul 23.47 · Kantor Kontraktor, Bekasi</span>
                </div>
                <p className="text-base md:text-lg leading-relaxed text-foreground mb-3">
                  <strong>Pak Budi</strong> membuka dokumen tender ke-9 minggu ini. <strong>PDF 214 halaman.</strong> Deadline besok jam 08.00.
                  Ia harus cek 30+ syarat kelengkapan, hitung estimasi harga, analisis risiko tersembunyi, draft surat penawaran.
                </p>
                <p className="text-base leading-relaxed text-foreground mb-3">
                  Ia buka tiga tab browser: PermenPUPR 6/2021, database SBU, dan spreadsheet lama dari tender bulan lalu.
                  Ia tidak yakin mana yang masih berlaku. Ia ingin bertanya ke konsultan — tapi jam segini?
                </p>
                <p className="text-lg font-semibold text-muted-foreground italic border-l-4 border-indigo-300 pl-4">
                  "Pak Budi bekerja sendirian. Dalam satu arah. Tanpa lawan bicara."
                </p>
              </div>
            </div>

            {/* Scene 2: Pemilik Usaha & WhatsApp */}
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-background overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-rose-600" />
              <div className="p-6 md:p-8 pl-8 md:pl-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-full">📱 Pukul 22.18 · Rumah Bu Sari, Surabaya</span>
                </div>
                <p className="text-base md:text-lg leading-relaxed text-foreground mb-3">
                  Notifikasi WhatsApp berbunyi. Lagi, dan lagi. <strong>9 pesan masuk dalam 20 menit</strong> dari calon klien yang baru saja
                  lihat portofolio Bu Sari di Instagram. Pertanyaan soal harga, SBU, jadwal, dan contoh proyek.
                </p>
                <p className="text-base leading-relaxed text-foreground mb-3">
                  Bu Sari sudah tidur. Tim CS juga sudah tidur. Tidak ada autoresponder. Tidak ada yang jaga.
                </p>
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Keesokan paginya, ketika ia membalas — klien itu sudah menandatangani kontrak dengan kompetitor yang membalas dalam 5 menit.
                </p>
                <p className="text-lg font-semibold text-muted-foreground italic border-l-4 border-orange-300 pl-4">
                  "Leads tidak menunggu. Tapi tidak ada yang bisa menjaga 24 jam."
                </p>
              </div>
            </div>

            {/* Scene 3: Profesional & Regulasi */}
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-background overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-600" />
              <div className="p-6 md:p-8 pl-8 md:pl-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-full">☕ Pukul 01.30 · Meja Kerja, Bandung</span>
                </div>
                <p className="text-base md:text-lg leading-relaxed text-foreground mb-3">
                  <strong>Mas Dian</strong> butuh satu jawaban: berapa SKK yang wajib dimiliki untuk kualifikasi M bidang Sipil?
                  Ia sudah buka <strong>6 PDF berbeda</strong> — tiga Permen PUPR, dua SE LPJK, dan satu dokumen dari asosiasi.
                </p>
                <p className="text-base leading-relaxed text-foreground mb-3">
                  Setiap dokumen menjawab sebagian. Tidak ada yang menjawab utuh. Ia tidak tahu mana yang terbaru, mana yang sudah
                  direvisi, dan mana yang saling bertentangan.
                </p>
                <p className="text-lg font-semibold text-muted-foreground italic border-l-4 border-emerald-300 pl-4">
                  "Informasinya ada. Tapi tidak ada yang membantu Mas Dian berpikir."
                </p>
              </div>
            </div>
          </div>

          {/* The insight — monolog ke dialog */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900" />
            <div className="relative p-8 md:p-12 text-white text-center">
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6 max-w-2xl mx-auto">
                Tiga adegan. Tiga orang berbeda. Satu pola yang sama:
              </p>
              <p className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                Kita punya lebih banyak akses informasi dari generasi mana pun sebelumnya.
                <br className="hidden md:block" />
                <span className="text-red-400"> Tapi kita masih bekerja dalam satu arah — sendirian.</span>
              </p>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Buku, PDF, YouTube, kursus online — semuanya <strong className="text-white">berbicara ke Anda</strong>.
                Tidak ada yang <strong className="text-white">berdialog bersama Anda</strong>.
                Itulah arsitektur lama yang sudah berusia 500 tahun: <span className="text-red-400 font-semibold">MONOLOG</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-4 text-center w-full sm:w-auto">
                  <p className="text-3xl mb-1">📄</p>
                  <p className="text-sm font-bold text-red-400 mb-1">MONOLOG — Lama</p>
                  <p className="text-xs text-slate-400">Dokumen bicara. Anda membaca sendirian.<br />Tidak ada yang menjawab pertanyaan lanjutan.</p>
                </div>
                <div className="hidden sm:block">
                  <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="rounded-xl border border-primary/40 bg-primary/10 px-6 py-4 text-center w-full sm:w-auto">
                  <p className="text-3xl mb-1">💬</p>
                  <p className="text-sm font-bold text-primary mb-1">DIALOG — Gustafta</p>
                  <p className="text-xs text-slate-400">AI yang mendengar, menjawab, menanyai balik.<br />Bukan asisten — tapi lawan bicara profesional.</p>
                </div>
              </div>

              <p className="text-base md:text-xl font-semibold text-white">
                Gustafta membangun arsitektur baru itu —
                <span className="text-primary"> dari monolog ke dialog.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM: Pain Points ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Masalah yang Anda Hadapi</p>
            <h2 className="text-2xl md:text-3xl font-bold">Apakah Ini Terasa Familiar?</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
              Ribuan profesional dan bisnis di Indonesia menghadapi masalah ini setiap hari.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Clock, problem: "Tim CS kewalahan menjawab pertanyaan yang sama berulang-ulang, jam kerja habis hanya untuk FAQ" },
              { icon: AlertTriangle, problem: "Dokumen tender dikerjakan manual berhari-hari, padahal deadline mepet dan checklist puluhan item" },
              { icon: TrendingUp, problem: "Leads masuk di luar jam kerja tapi tidak ada yang merespons — prospek pergi ke kompetitor" },
              { icon: Users, problem: "Pengetahuan perusahaan tersebar di mana-mana, tim baru butuh berminggu-minggu untuk onboarding" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10 p-4">
                  <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{item.problem}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AGITATION: Consequences ── */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Sementara Itu...</p>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              Kompetitor Anda Sudah Menggunakan AI untuk Pekerjaan Ini
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Kontraktor yang pakai AI Tender Assistant menyelesaikan analisis dokumen 3× lebih cepat dan win rate-nya naik 40%.
              Bisnis dengan CS otomatis 24/7 tidak pernah kehilangan leads lagi. Tim yang punya Knowledge Base AI onboarding karyawan baru dalam 2 hari, bukan 2 minggu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {[
                { label: "3× lebih cepat", sub: "analisis dokumen tender" },
                { label: "80%+ pertanyaan", sub: "dijawab otomatis tanpa CS manual" },
                { label: "Win rate naik 40%", sub: "dengan SCORECARD AI" },
              ].map((stat) => (
                <div key={stat.label} className="flex-1 bg-background rounded-lg p-3 text-center border border-border/50">
                  <div className="font-bold text-primary text-sm">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUTION: Intro ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Solusinya</p>
            <h2 className="text-2xl md:text-3xl font-bold">Kenalkan Gustafta — Platform AI Chatbot Builder</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
              Satu platform untuk membangun chatbot AI yang benar-benar memahami konteks bisnis Anda.
              Bukan chatbot template kosong — tapi 1350+ agent spesialis yang sudah dilatih khusus untuk konstruksi, tender, K3, SKK, energi, properti, marketing, HR, dan 20+ domain lainnya.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Brain, title: "Otak Proyek", desc: "Pusatkan semua data bisnis. AI jawab berdasarkan konteks nyata, bukan jawaban generik.", color: "text-amber-500", bg: "bg-amber-500/10" },
              { icon: Globe, title: "Custom Domain", desc: "Pasang bot.perusahaan.com. Branding profesional, bukan link chatbot biasa.", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: BookOpen, title: "Knowledge Base 7 Tipe", desc: "PDF, URL, YouTube, video, audio — AI transkripsi dan RAG secara otomatis.", color: "text-violet-500", bg: "bg-violet-500/10" },
              { icon: Plug, title: "Multi-Channel", desc: "WhatsApp, Telegram, web widget, REST API — satu chatbot, semua channel sekaligus.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { icon: Zap, title: "45+ MultiClaw AI Tools", desc: "Suite lengkap: TenderaClaw, SBUClaw, KonstraClaw, BrainClaw, SafiraClaw, dan 40+ tools spesialis siap pakai.", color: "text-orange-500", bg: "bg-orange-500/10" },
              { icon: Shield, title: "Aman & Privat", desc: "Token per chatbot, mode publik/privat, enkripsi end-to-end, OAuth Replit Identity.", color: "text-slate-500", bg: "bg-slate-500/10" },
            ].map((f) => {
              const FIcon = f.icon;
              return (
                <div key={f.title} className={`rounded-xl border p-5 hover:shadow-md transition-shadow ${f.bg}`} data-testid={`card-feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-3 shadow-sm border border-border/30">
                    <FIcon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STORY: Agentic AI vs Chatbot Biasa ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Cara Gustafta Bekerja</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Bukan Sekadar Chatbot.{" "}
              <span className="text-primary">Ini Agentic AI.</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
              Chatbot biasa menunggu pertanyaan lalu menjawab. Agentic AI Gustafta
              <strong className="text-foreground"> merencanakan, mengeksekusi, memverifikasi, dan berulang</strong> —
              seperti tim ahli yang bekerja untuk Anda, bukan sekadar asisten yang menunggu perintah.
            </p>
          </div>

          {/* Comparison: Biasa vs Agentic */}
          <div className="grid md:grid-cols-2 gap-5 mb-16">
            <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <p className="font-bold text-sm text-red-600 dark:text-red-400">Chatbot Biasa</p>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Menunggu pertanyaan, menjawab, selesai",
                  "Tidak tahu konteks bisnis Anda",
                  "Satu pertanyaan = satu jawaban generik",
                  "Tidak bisa bertindak atau menghubungkan informasi",
                  "Jika tidak tahu, berhenti atau hallucinate",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
              <div className="flex items-center gap-2 mb-4 relative">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <p className="font-bold text-sm text-primary">Agentic AI Gustafta</p>
              </div>
              <ul className="space-y-2.5 relative">
                {[
                  "Mendeteksi kebutuhan eksplisit DAN implisit Anda",
                  "Konteks dari Knowledge Base, Project Brain & Memori",
                  "Rencana multi-langkah, eksekusi bertahap, koreksi mandiri",
                  "Routing otomatis ke specialist paling relevan",
                  "Fallback terstruktur + transparansi asumsi",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-foreground">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* OpenClaw Flow */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold mb-3">
                <Cpu className="w-3.5 h-3.5" /> OpenClaw — Mesin Penalaran Agentic
              </div>
              <h3 className="text-lg font-bold">6-Langkah yang Terjadi di Balik Setiap Jawaban</h3>
              <p className="text-muted-foreground text-xs mt-1 max-w-lg mx-auto">
                Setiap pesan yang masuk ke Gustafta melewati pipeline OpenClaw — penalaran berlapis yang membuat jawaban selalu relevan, terstruktur, dan actionable.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { n: "01", icon: MessageSquare, label: "INPUT", desc: "Tangkap pesan + konteks percakapan", color: "text-blue-500", bg: "bg-blue-500/10" },
                { n: "02", icon: ScanSearch, label: "CONTEXT GRAB", desc: "Ambil KB, Project Brain, Memori user", color: "text-violet-500", bg: "bg-violet-500/10" },
                { n: "03", icon: Brain, label: "MULTI-LAYER REASON", desc: "Analisis teknis, bisnis, dan UX sekaligus", color: "text-amber-500", bg: "bg-amber-500/10" },
                { n: "04", icon: Zap, label: "TOOL INVOKE", desc: "Aktifkan fitur/specialist yang tepat", color: "text-orange-500", bg: "bg-orange-500/10" },
                { n: "05", icon: Layers, label: "SYNTHESIZE", desc: "Integrasikan semua jadi jawaban kohesif", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { n: "06", icon: Repeat2, label: "LOOP", desc: "Tawarkan iterasi & langkah lanjutan", color: "text-primary", bg: "bg-primary/10" },
              ].map((s, i) => {
                const SIcon = s.icon;
                return (
                  <div key={s.n} className="relative flex flex-col items-center">
                    {i < 5 && (
                      <div className="hidden md:block absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px bg-gradient-to-r from-border to-transparent z-0" />
                    )}
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-2 relative z-10 border border-border/30`}>
                      <SIcon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <p className={`text-[10px] font-bold ${s.color} mb-0.5 text-center`}>{s.label}</p>
                    <p className="text-[9px] text-muted-foreground text-center leading-tight">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MultiClaw Section */}
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-gradient-to-br from-amber-50/80 to-orange-50/40 dark:from-amber-900/20 dark:to-orange-900/10 p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Network className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-extrabold text-lg text-amber-700 dark:text-amber-400">MultiClaw Suite</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400">45+ TOOLS</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bayangkan kamu dapat dokumen tender 200 halaman jam 9 malam, deadline besok pagi.
                  Kamu ketik ke <strong className="text-foreground">TenderaClaw</strong> — dalam hitungan detik,{" "}
                  <strong className="text-foreground">10 agen AI bekerja paralel</strong>: satu cek syarat SBU/SKK,
                  satu hitung win probability, satu draft surat penawaran, satu flag risiko tersembunyi.
                  Dalam 3 menit kamu punya briefing lengkap yang biasanya butuh 2 hari kerja tim 3 orang.
                </p>
              </div>
            </div>

            {/* Parallel Agent Diagram */}
            <div className="bg-background/60 rounded-xl border border-border/40 p-4 mb-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 text-center">Cara Kerja MultiClaw — Paralel Setiap Saat</p>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-2 text-xs font-bold text-primary text-center">
                  📝 Pertanyaan Anda
                </div>
                <div className="w-px h-4 bg-primary/30" />
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 text-center">
                  🧠 Orchestrator — analisis & dispatch paralel
                </div>
                <div className="relative w-full flex justify-center">
                  <div className="absolute top-0 left-1/2 w-px h-4 bg-amber-500/30" />
                </div>
                <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {[
                    { label: "Agen 1", sub: "Syarat SBU/SKK", color: "blue" },
                    { label: "Agen 2", sub: "Win Probability", color: "emerald" },
                    { label: "Agen 3", sub: "Draft Dokumen", color: "violet" },
                    { label: "Agen 4–10", sub: "Spesialis lainnya", color: "orange" },
                  ].map((a) => (
                    <div key={a.label} className={`rounded-lg border border-border/50 bg-background/80 p-2 text-center`}>
                      <p className="text-[10px] font-bold text-foreground">{a.label}</p>
                      <p className="text-[9px] text-muted-foreground">{a.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="w-px h-4 bg-emerald-500/30" />
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 text-center">
                  ✅ Satu jawaban komprehensif — sintesis semua specialist
                </div>
              </div>
            </div>

            {/* MultiClaw tools grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              {[
                { name: "TenderaClaw", sub: "10 agen · Tender LPSE", href: "/tendera-claw", color: "text-indigo-600" },
                { name: "SBUClaw", sub: "10 agen · SBU Konstruksi", href: "/sbu-claw", color: "text-amber-600" },
                { name: "BrainClaw", sub: "6 agen · Intelijen Proyek", href: "/brain-claw", color: "text-cyan-600" },
                { name: "KonstraClaw", sub: "9 agen · Manajemen Proyek", href: "/konstra-claw", color: "text-slate-600" },
                { name: "SafiraClaw", sub: "5 agen · K3 Konstruksi", href: "/safira-claw", color: "text-red-600" },
                { name: "SMAPClaw", sub: "8 agen · ISO 37001 Anti-Suap", href: "/smap-claw", color: "text-teal-600" },
                { name: "SkemaClaw", sub: "9 agen · Sertifikasi BUJK", href: "/skema-claw", color: "text-blue-600" },
                { name: "+38 Tools Lagi", sub: "Konstruksi · Energi · HR · Digital", href: "/ai-tools", color: "text-primary font-bold" },
              ].map((t) => (
                <a
                  key={t.name}
                  href={t.href}
                  className="rounded-lg border border-border/60 bg-background hover:border-primary/40 hover:shadow-sm transition-all p-3 group"
                  data-testid={`link-multiclaw-${t.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <p className={`text-xs font-bold mb-0.5 ${t.color} group-hover:underline`}>{t.name}</p>
                  <p className="text-[9px] text-muted-foreground leading-tight">{t.sub}</p>
                </a>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Semua MultiClaw tools memerlukan paket <span className="font-semibold text-foreground">Profesional</span> ke atas.
              </p>
              <Link href="/ai-tools">
                <button className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline" data-testid="link-multiclaw-all">
                  Lihat 45+ Tools <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEREST: Cara Kerja ── */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Cara Kerja</p>
            <h2 className="text-2xl md:text-3xl font-bold">Dari Daftar Sampai Chatbot Aktif: &lt; 30 Menit</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { n: "1", title: "Buat Hierarki Chatbot", desc: "Buat Series, Modul, dan Chatbot sesuai struktur bisnis Anda.", time: "±10 mnt", bullets: ["Buat Series sebagai payung ekosistem", "Tambah Modul & Chatbot spesialis", "Aktifkan Orchestrator routing (opsional)"] },
              { n: "2", title: "Isi Knowledge Base", desc: "Upload sumber pengetahuan — PDF, URL, YouTube, video, atau audio.", time: "±10–15 mnt", bullets: ["Upload PDF/DOCX/Excel atau paste URL", "YouTube → transkripsi otomatis AI", "Video/audio → RAG background"] },
              { n: "3", title: "Konfigurasi & Deploy", desc: "Atur persona, Otak Proyek, dan pasang custom domain opsional.", time: "±5–7 mnt", bullets: ["Isi Otak Proyek dengan data bisnis", "Atur persona & conversation starters", "Custom Domain: CNAME setup otomatis"] },
              { n: "4", title: "Mulai Layani Pengguna", desc: "Hubungkan ke WhatsApp, embed web widget, atau share link langsung.", time: "±3–5 mnt", bullets: ["Connect WhatsApp / Telegram / Web", "Test 5 pertanyaan kunci via console", "Pantau analytics real-time"] },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-5 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent -translate-x-4 z-0" />
                )}
                <div className="relative bg-background rounded-xl border p-5 hover:shadow-md transition-shadow h-full">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-base font-bold mx-auto mb-3">
                    {s.n}
                  </div>
                  <div className="text-[10px] font-semibold text-primary text-center mb-1">{s.time}</div>
                  <h3 className="font-bold text-sm mb-1.5 text-center">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 text-center">{s.desc}</p>
                  <ul className="space-y-1">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESIRE: Untuk Siapa (Persona Tabs) ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Untuk Siapa?</p>
            <h2 className="text-2xl md:text-3xl font-bold">Satu Platform, Banyak Kegunaan</h2>
            <p className="text-muted-foreground mt-2 text-sm">Pilih peran Anda dan lihat bagaimana Gustafta bekerja untuk Anda.</p>
          </div>

          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {(["belajar", "bekerja", "berusaha", "kreator"] as const).map((key) => {
              const tab = personas[key];
              const TabIcon = tab.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActivePersona(key)}
                  data-testid={`tab-persona-${key}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                    activePersona === key
                      ? `${tab.bg} ${tab.color} ${tab.border}`
                      : "bg-background border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <TabIcon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          <div className={`rounded-2xl border-2 ${p.border} ${p.bg} p-6 md:p-8`}>
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-background border ${p.border} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <PersonaIcon className={`w-6 h-6 ${p.color}`} />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wide ${p.color} mb-1`}>{p.label}</p>
                <h3 className="text-lg font-bold mb-1">{p.tagline}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {p.useCases.map((uc) => {
                const UCIcon = uc.icon;
                return (
                  <div key={uc.title} className="flex items-start gap-3 bg-background/70 rounded-xl p-3.5 border border-border/50">
                    <div className={`w-8 h-8 rounded-lg bg-background border border-border/30 flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <UCIcon className={`w-4 h-4 ${p.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-0.5">{uc.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{uc.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end">
              <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={handleStartNowClick}>
                <button className={`flex items-center gap-2 text-sm font-semibold ${p.color} hover:underline`} data-testid={`button-persona-cta-${activePersona}`}>
                  Mulai untuk {p.label} <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PELUANG: Segmen Pasar ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Bukan Hanya untuk Perusahaan</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
              Gustafta Adalah Peluang —<br className="hidden md:block" />
              <span className="text-primary">untuk Semua yang Mau Bergerak</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              AI bukan cuma alat perusahaan besar. Di tangan yang tepat,
              Gustafta bisa jadi sumber penghasilan baru, mesin efisiensi tim,
              atau bahkan titik awal karier mandiri Anda.
            </p>
          </div>

          {/* Segment 1: Karyawan → Penghasilan Tambahan */}
          <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-900/10 p-7 md:p-10 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Untuk Karyawan Aktif</p>
                  <h3 className="text-lg md:text-xl font-bold">Punya Gaji Tetap? Tambah Penghasilan dengan AI.</h3>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                Karyawan konstruksi, konsultan, atau profesional apapun — Anda sudah punya keahlian domain.
                Gustafta mengubah keahlian itu jadi produk digital yang bisa dijual.
                Bangun chatbot AI spesialis di bidang Anda, tawarkan ke klien, dan terima bayaran — tanpa perlu keluar dari pekerjaan utama.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: "💼", title: "Jadi Reseller Gustafta", desc: "Jual akses Gustafta ke BUJK, LSP, atau institusi di sekitar Anda. Komisi langsung tanpa kelola server." },
                  { icon: "🤖", title: "Bangun Chatbot untuk Klien", desc: "Buat chatbot K3, tender, atau SBU untuk perusahaan konstruksi. Tarif Rp 2–10 juta per proyek chatbot." },
                  { icon: "📦", title: "Jual Template & Prompt", desc: "Kemas pengetahuan Anda jadi template AI. Upload ke Gustafta Store, passive income dari download." },
                ].map((item) => (
                  <div key={item.title} className="bg-white dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800/40">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <p className="text-sm font-bold mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Segment 2: Perusahaan → Efisiensi & Produktivitas */}
          <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-900/10 p-7 md:p-10 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Untuk Tim & Perusahaan</p>
                  <h3 className="text-lg md:text-xl font-bold">1 Langganan. Seluruh Tim Lebih Produktif.</h3>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                Staf estimasi, drafter, admin tender, HRD, manajer proyek — semua punya AI-nya sendiri.
                Tugas yang dulu makan 3 jam bisa selesai 20 menit. Dokumen yang dulu harus tunggu 2 hari bisa
                di-generate dalam hitungan menit. Efisiensi bukan lagi keuntungan, tapi keharusan.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                {[
                  { stat: "60–80%", label: "Pengurangan waktu analisis dokumen tender" },
                  { stat: "3×", label: "Kecepatan draft laporan teknis & K3" },
                  { stat: "24/7", label: "CS otomatis tanpa karyawan tambahan" },
                  { stat: "0", label: "Biaya training ulang — AI selalu update" },
                ].map((s) => (
                  <div key={s.label} className="bg-white dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800/40 text-center">
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">{s.stat}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                * Estimasi berdasarkan rata-rata pengguna aktif Gustafta di sektor konstruksi dan konsultansi Indonesia.
              </p>
            </div>
          </div>

          {/* Segment 3: Pencari Kerja / PHK → Usaha Mandiri */}
          <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-900/10 p-7 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Untuk Pencari Kerja & Yang Kena PHK</p>
                  <h3 className="text-lg md:text-xl font-bold">Tidak Ada Lowongan? Buka Usaha Sendiri dengan AI.</h3>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                Kehilangan pekerjaan bukan akhir — bisa jadi titik balik.
                Di era AI, seseorang dengan pengetahuan domain + alat yang tepat bisa bersaing dengan perusahaan besar.
                Gustafta memberi Anda alat itu. Mulai sebagai konsultan AI freelance,
                bangun chatbot spesialis, atau buka jasa "digitalisasi pengetahuan" untuk UMKM dan instansi di kota Anda.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: "🎯", title: "Konsultan AI Freelance", desc: "Bantu BUJK, kontraktor kecil, atau klinik membangun chatbot AI mereka. Modal: laptop + akun Gustafta." },
                  { icon: "🏪", title: "Buka Jasa Chatbot Spesialis", desc: "Fokus satu niche: K3, tender, properti, atau pendidikan. Klien datang karena Anda spesialis, bukan generalis." },
                  { icon: "📚", title: "Jual Pengetahuan Anda", desc: "Punya pengalaman 10 tahun di lapangan? Kemas jadi AI knowledge base. Orang bayar untuk akses ke keahlian Anda." },
                ].map((item) => (
                  <div key={item.title} className="bg-white dark:bg-emerald-950/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/40">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <p className="text-sm font-bold mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-0">
                <div className="bg-white dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800/40">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full uppercase tracking-wide">Starter</span>
                    <span className="text-sm font-black text-foreground">Rp 199.000<span className="text-xs font-normal text-muted-foreground">/bln</span></span>
                  </div>
                  <p className="text-xs font-bold mb-1">Bangun chatbot untuk klien</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Chatbot custom, knowledge base, multi-channel (WA, Telegram, Web). Cocok untuk memulai jasa chatbot pertama Anda.
                  </p>
                </div>
                <div className="bg-white dark:bg-emerald-950/30 rounded-xl p-5 border-2 border-emerald-400 dark:border-emerald-600 relative">
                  <div className="absolute -top-2.5 left-4">
                    <span className="text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wide">Direkomendasikan</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 mt-1">
                    <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wide">Profesional</span>
                    <span className="text-sm font-black text-foreground">Rp 299.000<span className="text-xs font-normal text-muted-foreground">/3 bln</span></span>
                  </div>
                  <p className="text-xs font-bold mb-1">+ Akses 45 MultiClaw AI Tools</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    TenderaClaw, SBUClaw, KonstraClaw, SafiraClaw — suite lengkap untuk klien konstruksi & bisnis. Nilai jual lebih tinggi.
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={handleStartNowClick}>
                  <button
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors"
                    data-testid="button-peluang-mulai-cta"
                  >
                    Mulai Sekarang →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESIRE: Testimoni ── */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Testimoni</p>
            <h2 className="text-2xl md:text-3xl font-bold">Dipercaya Ratusan Profesional Indonesia</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Budi Santoso",
                role: "Direktur Teknik, PT Bangun Nusa Konstruksi",
                avatar: "BS",
                text: "TenderaClaw menghemat 2–3 hari kerja per tender. Checklist 30+ item langsung muncul, gap analysis akurat, draft dokumen tinggal edit. Win rate naik signifikan.",
                tag: "Kontraktor BUJK",
              },
              {
                name: "Retno Ayu",
                role: "Kepala Divisi Sertifikasi, LSP Konstruksi",
                avatar: "RA",
                text: "Simulasi asesmen SKKNI via AI sangat membantu peserta kami. Peserta yang latihan pakai Gustafta kelulusannya jauh lebih konsisten dibanding batch sebelumnya.",
                tag: "Sertifikasi LSP",
              },
              {
                name: "Agus Prasetyo",
                role: "CEO, PT Graha Mandiri Consultant",
                avatar: "AP",
                text: "SCORECARD Win Probability dari BrainClaw membantu kami milih tender yang layak. Win rate naik 40% dalam 3 bulan — return on investment-nya jelas dan terukur.",
                tag: "Konsultan MK",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border bg-background p-5 shadow-sm" data-testid={`card-testimonial-${t.avatar.toLowerCase()}`}>
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{t.role}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">{t.tag}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: Lock, label: "Data Terenkripsi" },
              { icon: RefreshCw, label: "99.9% Uptime" },
              { icon: HeartHandshake, label: "Support 24/7" },
              { icon: Award, label: "Multi-Sektor" },
            ].map(({ icon: TIcon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full border bg-background text-sm text-muted-foreground">
                <TIcon className="w-4 h-4 text-primary" /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO PROMO ── */}
      <section className="py-20 px-4 bg-muted/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Lihat Gustafta Beraksi</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Dari Masalah ke Solusi — dalam Hitungan Menit
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
              Tiga video nyata: bagaimana profesional Indonesia beralih dari bekerja sendirian menjadi punya tim AI yang selalu siap.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                src: "/videos/gustafta-promo-problem.mp4",
                title: "Sebelum Gustafta",
                desc: "Sendirian di tengah tumpukan dokumen. Tengah malam. Deadline besok.",
                badge: "Masalah",
                badgeColor: "bg-red-500",
              },
              {
                src: "/videos/gustafta-promo-monolog-to-dialog.mp4",
                title: "Dari Monolog ke Dialog",
                desc: "Belajar & bekerja sendirian vs. punya lawan bicara AI yang benar-benar membantu.",
                badge: "Transformasi",
                badgeColor: "bg-amber-500",
              },
              {
                src: "/videos/gustafta-promo-solution.mp4",
                title: "Sesudah Gustafta",
                desc: "Profesional percaya diri. Tim AI siap kerja. Hasil terukur.",
                badge: "Solusi",
                badgeColor: "bg-emerald-500",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border bg-background overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <video
                    src={v.src}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className={`absolute top-3 left-3 text-[10px] font-bold text-white px-2.5 py-1 rounded-full ${v.badgeColor}`}>
                    {v.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Download CTA for external promo */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">Video bebas diunduh untuk keperluan promosi</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Video: Masalah", href: "/videos/gustafta-promo-problem.mp4" },
                { label: "Video: Transformasi", href: "/videos/gustafta-promo-monolog-to-dialog.mp4" },
                { label: "Video: Solusi", href: "/videos/gustafta-promo-solution.mp4" },
              ].map((dl) => (
                <a
                  key={dl.label}
                  href={dl.href}
                  download
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 px-4 py-2 rounded-full hover:bg-primary/5 transition-colors"
                  data-testid={`link-download-video-${dl.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  ↓ {dl.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTION: Pricing CTA ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-violet-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Flame className="w-3.5 h-3.5" /> Promo aktif — harga naik 2× per 1 Juli 2026
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-3">Mulai dari Rp 199.000/bulan</h2>
          <p className="text-white/75 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Semua paket sudah termasuk Agentic AI, 131 Orchestrator Multi-Agent, Knowledge Base 7 tipe, dan Multi-Channel. Tanpa biaya setup. Cancel kapan saja.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
            {[
              { plan: "Starter", price: "199rb", badge: null, features: ["3 chatbot", "Knowledge Base 7 tipe", "Multi-Channel (WA, TG, Web)", "REST API akses"] },
              { plan: "Profesional", price: "499rb", badge: "TERPOPULER", features: ["20 chatbot", "Custom Domain", "Analytics & Reporting", "Agentic AI + Orchestrator"] },
              { plan: "Bisnis", price: "999rb", badge: null, features: ["Unlimited chatbot", "1350+ agent spesialis", "45+ MultiClaw AI Tools", "Priority support"] },
            ].map((plan) => (
              <div
                key={plan.plan}
                className={`rounded-xl border-2 p-4 bg-white/5 relative ${plan.badge ? "border-amber-300" : "border-white/20"}`}
                data-testid={`card-pricing-${plan.plan.toLowerCase()}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 text-[10px] font-bold px-3 py-0.5 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="text-base font-bold mb-0.5">{plan.plan}</div>
                <div className="text-2xl font-extrabold mb-3">
                  Rp {plan.price}<span className="text-sm font-normal opacity-70">/bln</span>
                </div>
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-white/80">
                      <Check className="w-3.5 h-3.5 text-green-300 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={handleStartNowClick}>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold gap-2 px-8" data-testid="button-pricing-cta-start">
                <Rocket className="w-4 h-4" /> Mulai Sekarang — Gratis
              </Button>
            </Link>
            <Link href="/packs" onClick={handlePricingClick}>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white font-semibold px-8" data-testid="button-pricing-cta-plans">
                Bandingkan Semua Paket →
              </Button>
            </Link>
          </div>

          <p className="text-white/50 text-xs mt-4 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tanpa kartu kredit · Cancel kapan saja · Support via WhatsApp
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-bold">Pertanyaan yang Sering Ditanya</h2>
          </div>

          <Accordion type="single" collapsible defaultValue="item-0" className="space-y-2">
            {[
              { q: "Apakah perlu keahlian coding untuk mulai?", a: "Tidak sama sekali. Semua konfigurasi dilakukan lewat antarmuka visual — Knowledge Base, persona AI, Custom Domain, Tender Wizard — tanpa menulis satu baris kode pun. Rata-rata user mulai aktif dalam 30 menit setelah daftar." },
              { q: "Channel apa saja yang didukung?", a: "WhatsApp (Fonnte/Cloud API), Telegram, Web Widget (iframe & floating button), Custom Domain (bot.perusahaan.com), dan REST API untuk integrasi custom. Semua bisa diaktifkan dari satu dashboard tanpa biaya tambahan." },
              { q: "Apa itu 1350+ agent AI spesialis?", a: "Gustafta memiliki lebih dari 1350 agent AI yang sudah dikonfigurasi dan dilatih untuk domain spesifik — regulasi konstruksi, tender LPSE, K3, SKK/SBU, ISO, energi, properti, hukum, marketing, HR, dan lebih banyak lagi. Plus 45+ MultiClaw AI Tools yang siap pakai langsung, tanpa training dari nol." },
              { q: "Apa itu Orchestrator Multi-Agent?", a: "Orchestrator adalah sistem routing cerdas yang menganalisis setiap pesan user dan mengarahkannya ke specialist yang paling tepat secara otomatis. Misalnya: pertanyaan tender → Specialist Tender, pertanyaan SKK → Specialist Sertifikasi. Ada 131 hub orchestrator siap pakai, dan Anda bisa buat custom sendiri." },
              { q: "Bagaimana keamanan data saya?", a: "Data terenkripsi, akses berbasis token per chatbot, mode publik/privat yang bisa dikontrol, dan autentikasi via OAuth Replit Identity. Anda punya kontrol penuh atas siapa yang bisa mengakses chatbot dan data Knowledge Base Anda." },
              { q: "Bisa digunakan untuk bisnis di luar konstruksi?", a: "Ya. Meskipun Gustafta paling dalam untuk Jasa Konstruksi Indonesia, platform ini fleksibel untuk properti, energi, pendidikan, digital marketing, HR, legal, dan 12+ sektor lainnya. Knowledge Base, persona, dan Mini Apps bisa dikustomisasi sepenuhnya." },
            ].map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border rounded-xl px-4 overflow-hidden bg-background"
                data-testid={`faq-item-${i}`}
              >
                <AccordionTrigger className="text-sm font-semibold text-left py-4 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── ACTION: Final CTA Banner ── */}
      <section className="py-14 px-4 border-t bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Siap Mulai? Setup &lt; 30 Menit.</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm leading-relaxed">
            Bergabung dengan ratusan kontraktor, konsultan, dan bisnis Indonesia yang sudah menggunakan Gustafta. Mulai gratis, upgrade kapan pun Anda butuh.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={handleStartNowClick}>
              <Button size="lg" className="gap-2 font-bold px-8" data-testid="button-final-cta-start">
                <Rocket className="w-4 h-4" /> Mulai Sekarang — Gratis
              </Button>
            </Link>
            <a href="https://wa.me/6281287941900" target="_blank" rel="noopener noreferrer" onClick={() => handleWAClick("Final CTA")}>
              <Button size="lg" variant="outline" className="gap-2 font-semibold px-8" data-testid="button-final-cta-wa">
                <Smartphone className="w-4 h-4" /> Tanya via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">Gustafta</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs leading-relaxed">
                Platform AI Chatbot Builder terdalam untuk Indonesia. 1350+ agent spesialis, 131 hub orchestrator, 45+ MultiClaw AI Tools — siap pakai tanpa coding.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <Smartphone className="w-4 h-4" /> Hubungi Kami:
                </div>
                <a
                  href="https://wa.me/6281287941900"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
                  data-testid="link-footer-wa-1"
                  onClick={() => handleWAClick("Footer")}
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  081287941900
                </a>
                <a
                  href="https://wa.me/6282299417818"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
                  data-testid="link-footer-wa-2"
                  onClick={() => handleWAClick("Footer")}
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  082299417818
                </a>
              </div>
            </div>

            <div>
              <p className="font-semibold text-sm mb-3">Platform</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/packs" className="hover:text-foreground transition-colors" onClick={handlePricingClick}>Paket Harga</Link></li>
                <li><Link href="/ai-tools" className="hover:text-foreground transition-colors">AI Tools Hub</Link></li>
                <li><Link href="/gustafta-store" className="hover:text-foreground transition-colors">Template Store</Link></li>
                <li><Link href="/education" className="hover:text-foreground transition-colors">Education Platform</Link></li>
                <li><Link href="/legal" className="hover:text-foreground transition-colors">LexCom Legal AI</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground transition-colors">Dokumentasi</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-sm mb-3">MultiClaw Tools</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/tendera-claw" className="hover:text-foreground transition-colors">TenderaClaw</Link></li>
                <li><Link href="/sbu-claw" className="hover:text-foreground transition-colors">SBUClaw</Link></li>
                <li><Link href="/konstra-claw" className="hover:text-foreground transition-colors">KonstraClaw</Link></li>
                <li><Link href="/brain-claw" className="hover:text-foreground transition-colors">BrainClaw</Link></li>
                <li><Link href="/safira-claw" className="hover:text-foreground transition-colors">SafiraClaw</Link></li>
                <li><Link href="/ai-tools" className="hover:text-foreground transition-colors font-medium text-primary">Lihat 45+ Tools →</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">© 2026 Gustafta. All rights reserved.</p>
              <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground bg-muted/40">
                <CreditCard className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                <span className="font-semibold text-foreground/80">Scalev.id</span>
                <span className="ml-1 text-muted-foreground">— Pembayaran aman & terenkripsi</span>
                <span className="text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded font-medium">SSL</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/documentation" className="hover:text-foreground">Privacy</Link>
              <Link href="/documentation" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {gustaftaAssistant && <ChatPopup agent={gustaftaAssistant} />}
    </div>
  );
}
