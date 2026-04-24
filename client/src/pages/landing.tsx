import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useGustaftaAssistant } from "@/hooks/use-agents";
import { useTemplates } from "@/hooks/use-templates";
import { trackLead, trackViewContent } from "@/hooks/use-meta-pixel";
import { ChatPopup } from "@/components/chat-popup";
import { SharedHeader } from "@/components/shared-header";
import { TemplateShowcase } from "@/components/template-showcase";
import { featuredSectors } from "@/lib/sector-content";
import { 
  Bot, Sparkles, MessageSquare, Globe, Shield, 
  BookOpen, BarChart3, Lightbulb, ArrowRight, Check,
  Zap, Palette, Code, Cpu, Layers,
  Clock, TrendingUp, Users, Star, CheckCircle2, XCircle, AlertTriangle,
  HeartHandshake, Award, Target, Rocket, Lock, RefreshCw, Play,
  Brain, Blocks, Camera, Plug, ExternalLink, Wrench,
  GraduationCap, Briefcase, Store, HardHat, FileText, ClipboardCheck,
  Package, ChevronRight, Flame, Factory, ShieldCheck, Scale
} from "lucide-react";

export default function Landing() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: gustaftaAssistant } = useGustaftaAssistant();
  const { data: templatesData } = useTemplates();
  const [activePersona, setActivePersona] = useState<"belajar" | "bekerja" | "berusaha">("belajar");

  useEffect(() => {
    trackViewContent({ content_name: 'Landing Page', content_category: 'Homepage' });
  }, []);

  const handleLoginClick = () => {
    trackLead({ content_name: 'Login Button Click' });
  };

  const handleStartNowClick = () => {
    trackLead({ content_name: 'Start Now CTA' });
  };

  const handlePricingClick = () => {
    trackViewContent({ content_name: 'Pricing Page', content_category: 'Pricing' });
  };

  const personaContent = {
    belajar: {
      icon: GraduationCap,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      label: "Untuk Belajar",
      tagline: "AI sebagai tutor, mentor BIMTEK, dan asisten belajar personal",
      description: "Chatbot AI untuk modul pembelajaran, sertifikasi, dan pelatihan teknis. Mulai dari BIMTEK konstruksi, sertifikasi SKK, quiz interaktif, bank soal, hingga toolbox perhitungan — semuanya tersedia 24/7 tanpa batas.",
      useCases: [
        { title: "Mentoring & BIMTEK Konstruksi", desc: "Modul pembelajaran terstruktur, progress tracking, quiz interaktif, dan AI expert agent untuk pelatihan teknis konstruksi." },
        { title: "Simulasi Ujian SKK", desc: "Latihan soal Sertifikasi Kompetensi Kerja (SKK) dengan AI yang mengoreksi, menjelaskan, dan memberi saran belajar personal." },
        { title: "Belajar Regulasi Konstruksi", desc: "Chatbot khusus Perpres 46/2025, Permen PUPR, SNI — tanya langsung, jawaban akurat dari dokumen asli." },
        { title: "E-Learning & Onboarding", desc: "Onboarding karyawan, pelatihan K3, SOP produk, dan quiz evaluasi — semua bisa diakses via chatbot kapan pun dibutuhkan." },
      ]
    },
    bekerja: {
      icon: Briefcase,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      label: "Untuk Bekerja",
      tagline: "AI sebagai asisten profesional, manajer proyek, dan konsultan teknis",
      description: "Chatbot yang memahami konteks pekerjaan Anda — proyek konstruksi, dokumen teknis, laporan, analisis risiko, dan koordinasi tim. Kerja lebih cepat, lebih akurat, dengan dukungan AI yang selalu siap.",
      useCases: [
        { title: "Asisten Tender LPSE", desc: "Analisis dokumen tender, checklist 30+ item, gap analysis, dan draft dokumen otomatis sesuai Perpres 46/2025." },
        { title: "Manajemen Risiko Proyek", desc: "Risk assessment otomatis, SMKK plan, identifikasi isu dari laporan harian — semua berbasis data proyek Anda." },
        { title: "Knowledge Base Tim", desc: "Pusat pengetahuan teknis yang bisa diakses seluruh tim via WhatsApp atau web — SOP, standar, prosedur kerja." },
        { title: "Laporan & Dokumentasi", desc: "AI membantu menyusun laporan mingguan, notulen rapat, ringkasan proyek, dan dokumen teknis dalam hitungan menit." },
      ]
    },
    berusaha: {
      icon: Store,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      label: "Untuk Berusaha",
      tagline: "AI sebagai CS, sales, dan tim operasional yang tidak pernah tidur",
      description: "Dari menjawab pertanyaan pelanggan hingga menutup penjualan — chatbot AI bekerja 24/7 untuk bisnis Anda. Lebih banyak leads, lebih sedikit biaya operasional, pelayanan yang konsisten di semua channel.",
      useCases: [
        { title: "Customer Service Otomatis", desc: "Jawab 80%+ pertanyaan pelanggan secara otomatis. Tim CS bisa fokus pada kasus kompleks yang butuh sentuhan manusia." },
        { title: "Lead Generation 24/7", desc: "Chatbot menangkap prospek, kualifikasi leads, dan kirim notifikasi ke tim sales — bahkan saat bisnis sudah tutup." },
        { title: "WhatsApp Business AI", desc: "Satu chatbot untuk ribuan percakapan WhatsApp secara bersamaan. Broadcast, follow-up, dan layanan otomatis." },
        { title: "Konsultan Tender Konstruksi", desc: "Kontraktor bisa analisis peluang tender, cek kesiapan dokumen, dan dapatkan saran strategi penawaran lewat AI." },
      ]
    }
  };

  const tenderFeatures = [
    { icon: ClipboardCheck, title: "Checklist 30+ Item", desc: "Validasi kelengkapan dokumen administrasi, kualifikasi SBU, teknis, SMKK/K3, dan kepatuhan Perpres 46/2025 secara otomatis." },
    { icon: BarChart3, title: "Skor Kesiapan Tender", desc: "Skor Kelengkapan Dokumen + Skor Teknis (0–100) dengan penjelasan detail per bagian dan prioritas perbaikan." },
    { icon: AlertTriangle, title: "Gap Analysis Prioritas", desc: "Identifikasi kekurangan spesifik vs persyaratan tender, dengan rekomendasi tindakan dan estimasi waktu penyelesaian." },
    { icon: FileText, title: "Draft Dokumen AI", desc: "Proposal teknis, rencana mutu, SMKK plan, risk assessment, dan metode pelaksanaan — draf pertama siap dalam menit." },
    { icon: Brain, title: "Executive Summary", desc: "Ringkasan kesiapan tender 4–5 kalimat: kekuatan utama, risiko terbesar, dan rekomendasi strategis untuk diputuskan." },
    { icon: HardHat, title: "Wizard 7 Langkah", desc: "Input profil perusahaan, data tender, upload dokumen (auto-extract AI), strategi teknis, compliance, dan pilih output." },
  ];

  const painPoints = [
    {
      icon: Clock,
      problem: "Tim CS kewalahan menjawab pertanyaan yang sama berulang-ulang",
      solution: "Chatbot AI menjawab FAQ otomatis 24/7 - pelanggan mendapat respons instan tanpa antrian"
    },
    {
      icon: AlertTriangle,
      problem: "Informasi bisnis tersebar dan sulit diakses oleh tim maupun pelanggan",
      solution: "Knowledge Base terpusat + chatbot sebagai pintu akses informasi kapan saja"
    },
    {
      icon: TrendingUp,
      problem: "Kehilangan peluang bisnis di luar jam operasional",
      solution: "AI bekerja 24/7 menangkap leads, menjawab pertanyaan, dan melayani pelanggan"
    },
    {
      icon: Users,
      problem: "Biaya operasional tinggi untuk customer service multi-channel",
      solution: "Satu chatbot AI melayani di WhatsApp, web, Telegram, dan channel lainnya sekaligus"
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "Otak Proyek",
      description: "Pusatkan semua data dan konteks bisnis dalam satu tempat. AI menggunakan data ini untuk memberikan jawaban yang akurat dan kontekstual."
    },
    {
      icon: Layers,
      title: "Hierarki 4 Level",
      description: "Bangun ekosistem multi-agent terstruktur: Series → Modul → Chatbot → Alat Bantu. Skala bebas, koordinasi cerdas."
    },
    {
      icon: Globe,
      title: "Custom Domain",
      description: "Pasang domain kustom (misal: bot.perusahaan.com) ke chatbot manapun. CNAME setup, verifikasi otomatis, embed code siap pakai."
    },
    {
      icon: Sparkles,
      title: "Agentic AI + OpenClaw",
      description: "Metodologi agentic berlapis: listen → detect → plan → execute → follow-up. Multi-agent dengan Orkestrator sebagai hub routing cerdas."
    },
    {
      icon: BookOpen,
      title: "Knowledge Base 7 Tipe",
      description: "Upload teks, file (PDF/DOCX/Excel), URL, YouTube, Cloud Drive, Video, atau Audio. AI transkripsi & RAG otomatis dari semua sumber."
    },
    {
      icon: Plug,
      title: "Multi-Channel",
      description: "WhatsApp (Fonnte/Cloud API), Telegram, Web Widget, REST API, dan Custom Domain. Satu chatbot, semua channel terhubung."
    },
  ];

  const advancedFeatures = [
    {
      icon: Camera,
      title: "Project Snapshot AI",
      description: "Ringkasan kondisi bisnis atau proyek otomatis - status, isu, risiko, dan keputusan terakhir dalam satu laporan"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Pantau performa chatbot dengan metrik pesan, sesi, engagement, dan peak hours secara real-time"
    },
    {
      icon: Cpu,
      title: "Multi-Model AI",
      description: "GPT-4o, GPT-4o-mini, Claude, atau model custom dengan API endpoint sendiri sesuai kebutuhan dan budget"
    },
    {
      icon: Palette,
      title: "Widget & Embed Kustom",
      description: "Widget floating atau iframe embed. Kustomisasi warna, posisi, ukuran, logo, dan welcome message sesuai brand"
    },
    {
      icon: Shield,
      title: "Access Control & Keamanan",
      description: "Token akses per chatbot, mode publik/privat, Custom Domain verifikasi, OAuth Replit Identity, dan enkripsi data"
    },
    {
      icon: Code,
      title: "API & Integrasi Kustom",
      description: "REST API lengkap, webhook, dan Broadcast WA. Integrasi dengan CRM, ERP, LPSE tender scraper, atau tools lainnya"
    },
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Direktur Teknik, PT Bangun Nusa Konstruksi",
      avatar: "BS",
      content: "Tender LPSE Assistant menghemat 2–3 hari kerja per tender. Checklist 30+ item langsung muncul, gap analysis akurat, draft dokumen tinggal edit. Tim kami bisa fokus ke strategi, bukan administrasi.",
      rating: 5,
      tag: "Konstruksi"
    },
    {
      name: "Ahmad Fadli",
      role: "Head of Digital, Retail Company",
      avatar: "AF",
      content: "Chatbot WhatsApp kami menjawab 80% pertanyaan pelanggan otomatis. Tim CS bisa fokus pada kasus yang benar-benar butuh sentuhan manusia. ROI-nya luar biasa.",
      rating: 5,
      tag: "Retail"
    },
    {
      name: "Dewi Pratiwi",
      role: "Founder, EdTech Startup",
      avatar: "DP",
      content: "Knowledge Base dan Mini Apps sangat powerful. Tutor AI kami menjawab berdasarkan materi kuliah yang di-upload. Mahasiswa bisa belajar 24/7 tanpa menunggu dosen.",
      rating: 5,
      tag: "Pendidikan"
    },
    {
      name: "Rina Kusuma",
      role: "CEO, Digital Agency Jakarta",
      avatar: "RK",
      content: "Kami membuat chatbot untuk 15 klien dari berbagai industri dalam 2 bulan. Setup cepat, fleksibel untuk setiap sektor, dan hasilnya konsisten di semua channel.",
      rating: 5,
      tag: "Agency"
    },
  ];

  const comparisonData = [
    { feature: "Hierarki 4 Level: Series → Modul → Chatbot → Alat Bantu", gustafta: true, others: false },
    { feature: "Multi-Agent Orchestration (Orkestrator sebagai Hub)", gustafta: true, others: false },
    { feature: "Custom Domain (bot.perusahaan.com → chatbot)", gustafta: true, others: false },
    { feature: "Knowledge Base 7 Tipe (YouTube, Video, Audio, Cloud Drive)", gustafta: true, others: "Terbatas" },
    { feature: "Otak Proyek / Project Brain + Tender Wizard", gustafta: true, others: false },
    { feature: "Multi-Channel (WhatsApp, Telegram, Widget, API)", gustafta: "4+ channel", others: "1–2 channel" },
    { feature: "Multi-Model AI (GPT-4o, Claude, Custom API)", gustafta: true, others: "Terbatas" },
    { feature: "Widget Embed + Embed Code Dialog", gustafta: true, others: "Basic" },
    { feature: "Monetisasi, Voucher & Afiliasi", gustafta: true, others: false },
  ];

  const faqItems = [
    {
      question: "Apa itu Gustafta?",
      answer: "Gustafta adalah platform AI chatbot builder multi-tenant yang memungkinkan siapa saja — pelajar, profesional, dan pengusaha — membangun ekosistem chatbot AI cerdas menggunakan hierarki 4 level (Series → Modul → Chatbot → Alat Bantu). Dari tutor AI kampus, asisten tender konstruksi, hingga CS otomatis WhatsApp — semuanya dalam satu platform, tanpa coding."
    },
    {
      question: "Apa itu hierarki Series → Modul → Chatbot → Alat Bantu?",
      answer: "Ini adalah arsitektur multi-agent Gustafta: Series (L1) = payung ekosistem, Modul (L2) = fokus tematik dalam Series, Chatbot (L3) = unit chatbot spesialis per area (dengan tipe Orkestrator sebagai hub routing cerdas), Alat Bantu (L4) = sub-agen mikro eksekutor di dalam Chatbot. Dengan hierarki ini Anda bisa bangun ekosistem chatbot skalabel yang terkoordinasi cerdas."
    },
    {
      question: "Apa itu Custom Domain dan bagaimana cara pakainya?",
      answer: "Custom Domain memungkinkan Anda memasang domain kustom (misal: bot.perusahaan.com) yang langsung mengarah ke chatbot Anda. Caranya: tambahkan CNAME record di provider domain → arahkan ke host Gustafta → verifikasi di dashboard → domain aktif. Tersedia juga embed code (iframe & floating widget) untuk dipasang di website lain."
    },
    {
      question: "Apa itu Tender LPSE Assistant dan bagaimana cara kerjanya?",
      answer: "Tender LPSE Assistant adalah alat AI khusus untuk kontraktor dan konsultan MK yang ingin mengikuti tender pengadaan pemerintah (LPSE). Wizard 7 langkah memandu Anda dari input profil perusahaan → data tender → upload dokumen (auto-extract AI) → strategi teknis → compliance Perpres 46/2025 → pilih output. Hasilnya: checklist 30+ item, gap analysis, skor kesiapan, executive summary, dan draft dokumen siap pakai."
    },
    {
      question: "Tipe sumber apa saja yang bisa jadi Knowledge Base?",
      answer: "7 tipe sumber: Teks (ketik langsung), File (PDF/DOCX/CSV/Excel), URL (crawl website), YouTube (ambil transkrip otomatis), Cloud Drive (Google Drive/OneDrive), Video (.mp4/.webm/.mov → transkripsi), dan Audio (.mp3/.wav/.m4a/.aac → transkripsi). Semua diproses otomatis di background dan tersedia sebagai RAG chunks untuk chatbot."
    },
    {
      question: "Apakah saya perlu keahlian coding?",
      answer: "Tidak! Semua konfigurasi dilakukan melalui antarmuka visual. Otak Proyek, Knowledge Base 7 tipe, Custom Domain, Persona AI, dan Tender Wizard semuanya bisa di-setup tanpa menulis kode apapun."
    },
    {
      question: "Channel apa saja yang didukung?",
      answer: "Gustafta mendukung WhatsApp (Fonnte/Kirimi/Multichat/Cloud API), Telegram, Web Widget (iframe & floating), Custom Domain, REST API, dan PWA (bisa install di HP). Discord dan Slack akan hadir segera."
    },
    {
      question: "Bagaimana dengan keamanan data?",
      answer: "Data Anda aman dengan enkripsi, token akses per chatbot, mode publik/privat, kontrol domain, dan OAuth via Replit Identity. Anda memiliki kontrol penuh atas siapa yang bisa mengakses chatbot dan data Anda."
    },
    {
      question: "Bisa digunakan untuk sektor usaha apa saja?",
      answer: "Gustafta adalah platform AI chatbot terdalam untuk industri Jasa Konstruksi Indonesia — 19 ekosistem (Series) dan 250+ chatbot spesialis siap pakai mencakup Regulasi, Perizinan/SBU/SKK, Tender LPSE, Pasca Tender & Manajemen Kontrak, Pelaksanaan Proyek, Legalitas Konstruksi, Sertifikasi ISO/SMAP, K3, dan Pengembangan Profesi. Selain itu, platform juga fleksibel digunakan untuk 12 sektor usaha lain (kesehatan, pendidikan, keuangan, hukum, retail, properti, hospitality, logistik, marketing, customer service, kreatif) — tinggal kustomisasi Knowledge Base, Persona, dan Conversion Layer sesuai kebutuhan."
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Bangun Hierarki Series → Alat Bantu",
      description: "Definisikan ekosistem chatbot Anda. Buat Series, Modul, Chatbot (termasuk Orkestrator), dan Alat Bantu sesuai kebutuhan.",
      time: "± 10 menit",
      bullets: ["Buat Series sebagai payung ekosistem", "Tambahkan Modul & Chatbot spesialis", "Buat Orkestrator sebagai hub routing (opsional)"]
    },
    {
      number: "2",
      title: "Isi Knowledge Base (7 Tipe)",
      description: "Upload sumber pengetahuan — teks, file, URL, YouTube, Cloud Drive, video, atau audio. AI transkripsi & RAG otomatis.",
      time: "± 10–15 menit",
      bullets: ["Upload PDF/DOCX/Excel atau paste URL", "Tambahkan link YouTube untuk transkripsi otomatis", "Upload video/audio — AI transkripsi background"]
    },
    {
      number: "3",
      title: "Konfigurasi & Custom Domain",
      description: "Aktifkan Otak Proyek, setup persona, dan opsional pasang custom domain untuk branding profesional.",
      time: "± 5–7 menit",
      bullets: ["Isi Otak Proyek dengan data bisnis", "Atur persona, greeting & conversation starters", "Setup Custom Domain (CNAME → chatbot Anda)"]
    },
    {
      number: "4",
      title: "Deploy & Uji Coba",
      description: "Hubungkan ke channel, tes pertanyaan kunci, lalu bagikan ke pengguna melalui link, widget, atau domain kustom.",
      time: "± 3–5 menit",
      bullets: ["Hubungkan WhatsApp / Web Widget", "Tes 5 pertanyaan kunci via chat console", "Bagikan link atau embed code ke website"]
    },
  ];

  const trustBadges = [
    { icon: Lock, label: "Data Terenkripsi" },
    { icon: RefreshCw, label: "99.9% Uptime" },
    { icon: HeartHandshake, label: "Support 24/7" },
    { icon: Award, label: "Multi-Sektor" },
  ];

  const stats = [
    { value: "250+", label: "Chatbot Spesialis Konstruksi" },
    { value: "19", label: "Ekosistem Series" },
    { value: "12+", label: "Sektor Usaha Didukung" },
    { value: "24/7", label: "AI Selalu Aktif" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <section className="relative overflow-hidden py-16 md:py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Baru: Custom Domain · KB YouTube/Video/Audio · Hierarki 4 Level</span>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight" data-testid="text-hero-title">
              Buat Chatbot AI Cerdas untuk
              <br className="hidden md:block" />
              <span className="text-primary">Belajar, Bekerja</span>
              <span>, dan </span>
              <span className="text-primary">Berusaha</span>
              <span className="block text-2xl sm:text-3xl md:text-4xl mt-1 text-muted-foreground font-semibold">— Tanpa Coding</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Platform multi-tenant untuk membangun ekosistem chatbot AI terstruktur menggunakan hierarki 4 level: <strong>Series → Modul → Chatbot → Alat Bantu</strong>. Knowledge Base 7 tipe, Custom Domain, Tender Wizard, dan Agentic AI. Tanpa coding, siap dalam kurang dari 30 menit.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm">
                <GraduationCap className="h-4 w-4" /> Pelajar & Mahasiswa
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm">
                <Briefcase className="h-4 w-4" /> Profesional & Kontraktor
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm">
                <Store className="h-4 w-4" /> Pemilik Usaha & UMKM
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <badge.icon className="h-4 w-4 text-primary" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-6" data-testid="button-dashboard">
                    <Rocket className="h-5 w-5" />
                    Buka Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <a href="/api/login" onClick={handleStartNowClick} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 text-lg px-8 py-6" data-testid="button-start">
                    <Rocket className="h-5 w-5" />
                    Mulai Gratis Sekarang
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
              )}
              <Link href="/packs" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-2 text-lg px-8 py-6 border-primary/30" data-testid="button-packs">
                  <Package className="h-5 w-5" />
                  Lihat Paket Domain
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 inline mr-1 text-green-500" />
              Gratis untuk memulai. Tidak perlu kartu kredit. Setup kurang dari 30 menit.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/50 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center" data-testid={`stat-${stat.label}`}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION: 3 Persona Tabs ── */}
      <section className="py-16 md:py-24 bg-muted/20" id="persona">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4">Untuk Siapa Gustafta?</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Satu Platform, Tiga Peran AI
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chatbot AI bukan hanya untuk bisnis. Gustafta hadir untuk mendukung siapa pun yang ingin belajar lebih cerdas, bekerja lebih efisien, dan membangun usaha yang lebih kuat.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {(["belajar", "bekerja", "berusaha"] as const).map((key) => {
              const p = personaContent[key];
              const Icon = p.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActivePersona(key)}
                  data-testid={`tab-persona-${key}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    activePersona === key
                      ? `${p.bg} ${p.color} ${p.border} border-2 shadow-sm`
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Active persona content */}
          {(() => {
            const p = personaContent[activePersona];
            const Icon = p.icon;
            return (
              <div className="max-w-5xl mx-auto">
                <div className={`rounded-2xl border-2 ${p.border} p-6 md:p-8 mb-6 ${p.bg}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-6 w-6 ${p.color}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wide ${p.color} mb-1`}>{p.label}</p>
                      <h3 className="text-lg md:text-xl font-bold mb-2">{p.tagline}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {p.useCases.map((uc, i) => (
                    <Card key={i} className="hover-elevate overflow-visible border">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg ${p.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <CheckCircle2 className={`h-4 w-4 ${p.color}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{uc.title}</h4>
                            <p className="text-muted-foreground text-xs leading-relaxed">{uc.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {activePersona === "bekerja" && (
                  <div className="text-center mt-6">
                    <Link href="/packs">
                      <Button className="gap-2" data-testid="button-try-tender">
                        <HardHat className="h-4 w-4" />
                        Coba Tender LPSE Assistant
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Masalah & Solusi</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Tantangan yang Kami Selesaikan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Apapun sektor usaha Anda, tantangan ini pasti familiar. Gustafta hadir sebagai solusi cerdas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {painPoints.map((item, index) => (
              <Card key={index} className="hover-elevate overflow-visible" data-testid={`card-pain-${index}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-destructive" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <p className="font-medium text-destructive">{item.problem}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{item.solution}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Cara Kerja</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              4 Langkah, Kurang dari 30 Menit Sampai Deploy
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tidak perlu developer, tidak perlu coding. Setup pertama memang butuh waktu untuk menyiapkan dokumen & integrasi — tapi hasilnya chatbot yang benar-benar memahami bisnis Anda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-2rem)] h-0.5 bg-border z-0" />
                )}
                <div className="relative bg-background rounded-xl p-6 border hover-elevate h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shrink-0">
                      {step.number}
                    </div>
                    <Badge variant="outline" className="text-xs">{step.time}</Badge>
                  </div>
                  <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-xs mb-3 leading-relaxed">{step.description}</p>
                  <ul className="space-y-1 mt-auto">
                    {step.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            {!isAuthenticated && (
              <a href="/api/login" onClick={handleStartNowClick}>
                <Button size="lg" className="gap-2" data-testid="button-try-now">
                  <Target className="h-5 w-5" />
                  Coba Sekarang - Gratis
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Fitur Utama</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Platform Chatbot AI Terlengkap
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk membangun chatbot AI profesional dalam satu platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate overflow-visible" data-testid={`card-feature-${feature.title}`}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION: Custom Domain + Hierarki 5 Level Highlight ── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-violet-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Custom Domain card */}
              <Card className="border-2 border-primary/30 hover-elevate overflow-visible">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <Badge className="mb-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Fitur Baru</Badge>
                      <h3 className="text-xl font-bold">Custom Domain</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Pasang domain kustom Anda sendiri (misal: <strong>bot.perusahaan.com</strong>) langsung ke chatbot manapun. Cocok untuk branding profesional dan white-label deployment.
                  </p>
                  <ul className="space-y-2 mb-4">
                    {[
                      "CNAME setup + verifikasi otomatis",
                      "Redirect langsung ke halaman chat",
                      "Embed code: iframe & floating widget",
                      "Ganti chatbot tujuan tanpa hapus domain",
                    ].map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/domains">
                    <Button variant="outline" size="sm" className="gap-2 border-primary/30" data-testid="button-custom-domain">
                      <Globe className="h-4 w-4" />
                      Kelola Domain
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Hierarki 5 Level card */}
              <Card className="border-2 border-violet-500/30 hover-elevate overflow-visible">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <Layers className="h-6 w-6 text-violet-500" />
                    </div>
                    <div>
                      <Badge className="mb-1 text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 border-violet-500/20">Multi-Agent</Badge>
                      <h3 className="text-xl font-bold">Hierarki 4 Level</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Bangun ekosistem chatbot yang terkoordinasi dan skalabel menggunakan arsitektur multi-agent unik Gustafta — dari payung strategis hingga unit tugas mikro.
                  </p>
                  <div className="space-y-2 mb-4">
                    {[
                      { level: "L1", name: "Series", desc: "Payung ekosistem strategis" },
                      { level: "L2", name: "Modul", desc: "Fokus tematik dalam Series" },
                      { level: "L3", name: "Chatbot", desc: "Chatbot spesialis (+ Orkestrator hub)" },
                      { level: "L4", name: "Alat Bantu", desc: "Sub-agen mikro eksekutor" },
                    ].map(item => (
                      <div key={item.level} className="flex items-center gap-3 text-sm">
                        <span className="h-6 w-8 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center shrink-0">{item.level}</span>
                        <span className="font-semibold w-20 shrink-0">{item.name}</span>
                        <span className="text-muted-foreground">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="gap-2 border-violet-500/30 text-violet-600 dark:text-violet-400" data-testid="button-hierarchy">
                      <Layers className="h-4 w-4" />
                      Mulai Bangun Ekosistem
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION: Tender LPSE Spotlight ── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-500/5 via-background to-blue-500/5" id="tender">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-4 gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
                <Flame className="h-3 w-3" /> Flagship — Paket Domain Konstruksi
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Tender LPSE Assistant
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Alat AI pertama di Indonesia khusus untuk kontraktor dan konsultan MK yang ingin memenangkan tender pengadaan pemerintah. Analisis mendalam sesuai <strong>Perpres 46/2025</strong> — dari checklist dokumen hingga draft teknis siap kirim.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: Pack cards */}
              <div className="space-y-4">
                <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <HardHat className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Pelaksana Konstruksi</p>
                        <p className="text-xs text-muted-foreground">Kontraktor / Penyedia Jasa</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">Analisis kesiapan tender sebagai kontraktor: SBU, pengalaman proyek, personel, alat berat, metode pelaksanaan, SMKK/K3, dan kepatuhan regulasi.</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Konsultansi MK</p>
                        <p className="text-xs text-muted-foreground">Manajemen Konstruksi / Pengawas</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">Analisis kesiapan sebagai konsultan MK: metodologi pengawasan, organisasi tim, pengalaman MK, rencana QA/QC, dan SMKK mentoring.</p>
                  </CardContent>
                </Card>
                <div className="flex gap-3">
                  <Link href="/packs" className="flex-1">
                    <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700" data-testid="button-go-packs">
                      <Package className="h-4 w-4" />
                      Buka Paket Domain
                    </Button>
                  </Link>
                  {!isAuthenticated && (
                    <a href="/api/login" onClick={handleStartNowClick}>
                      <Button variant="outline" className="gap-2">
                        <Rocket className="h-4 w-4" />
                        Daftar Gratis
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Feature grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tenderFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <f.icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-0.5">{f.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works wizard */}
            <div className="rounded-xl border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Alur Wizard 7 Langkah</p>
              <div className="flex flex-wrap gap-2">
                {["Pilih Pack", "Profil Perusahaan", "Data Tender", "Upload Dokumen (AI)", "Strategi Teknis", "Compliance Check", "Generate Hasil"].map((step, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-xs text-muted-foreground">{step}</span>
                    {i < 6 && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30" id="sectors">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Sektor Usaha</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4" data-testid="text-sectors-title">
              Untuk Berbagai Sektor Usaha
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Gustafta dirancang fleksibel untuk semua industri. Pilih sektor Anda dan lihat bagaimana AI chatbot bisa membantu bisnis Anda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {featuredSectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <Link key={sector.id} href={`/sector/${sector.id}`}>
                  <Card className="hover-elevate overflow-visible cursor-pointer h-full" data-testid={`card-sector-${sector.id}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className={`h-5 w-5 ${sector.color}`} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm mb-1">{sector.label}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{sector.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                        <span>Pelajari lebih lanjut</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Testimoni</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Dipercaya oleh Berbagai Bisnis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lihat bagaimana Gustafta membantu bisnis dari berbagai sektor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-elevate overflow-visible" data-testid={`card-testimonial-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">{testimonial.tag}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-5 italic text-sm leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Perbandingan</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Mengapa Gustafta Lebih Unggul?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bandingkan fitur Gustafta dengan platform chatbot builder lainnya
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Fitur</th>
                        <th className="text-center p-4 font-semibold bg-primary/5">
                          <div className="flex items-center justify-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            Gustafta
                          </div>
                        </th>
                        <th className="text-center p-4 font-semibold text-muted-foreground">Kompetitor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="p-4 text-sm">{row.feature}</td>
                          <td className="p-4 text-center bg-primary/5">
                            {typeof row.gustafta === 'boolean' ? (
                              row.gustafta ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive mx-auto" />
                              )
                            ) : (
                              <span className="text-sm font-medium text-primary">{row.gustafta}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {typeof row.others === 'boolean' ? (
                              row.others ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-muted-foreground">{row.others}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Fitur Lanjutan</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Kemampuan Lebih untuk Bisnis Anda
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fitur tambahan untuk monitoring, pelaporan, dan integrasi yang lebih mendalam
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature) => (
              <Card key={feature.title} className="hover-elevate overflow-visible" data-testid={`card-advanced-${feature.title}`}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum tentang Gustafta
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left" data-testid={`faq-trigger-${index}`}>
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">
                <Globe className="h-3 w-3 mr-1" />
                Chatbot Terintegrasi
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Ekosistem AI Konstruksi & Teknik
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Gustafta terintegrasi dengan chatbot AI spesialis untuk mendukung kebutuhan belajar, bekerja, dan berusaha di sektor konstruksi dan keteknikan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Konstruksi AI */}
              <Card className="hover-elevate overflow-visible border-2 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                      <HardHat className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Konstruksi AI</h3>
                      <p className="text-xs text-muted-foreground">Asisten AI Proyek Konstruksi</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Asisten AI khusus proyek konstruksi — perencanaan jadwal, estimasi biaya, monitoring progres lapangan, manajemen subkontraktor, dan pelaporan proyek berbasis AI.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {["Jadwal Proyek", "Estimasi Biaya", "Progres Lapangan", "Subkontraktor", "Pelaporan"].map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs text-yellow-700 border-yellow-300 dark:text-yellow-400">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href="https://falling-bloom-7842.d.kiloapps.io/" target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full gap-1.5 bg-yellow-600 hover:bg-yellow-700 text-xs" data-testid="button-konstruksi-ai">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Buka Konstruksi AI
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Siap Uji Kompetensi */}
              <Card className="hover-elevate overflow-visible border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Siap Uji Kompetensi</h3>
                      <p className="text-xs text-muted-foreground">Chatbot Persiapan SKK, Asesmen & Audit</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Persiapkan diri menghadapi Uji Kompetensi SKK, Asesmen Tenaga Ahli, dan Audit Sistem Manajemen. Latihan soal interaktif, simulasi wawancara asesor, dan panduan dokumen portofolio berbasis AI.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {["SKK Konstruksi", "Asesmen Ahli", "Audit SMKK", "Portofolio", "Simulasi"].map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs text-blue-700 border-blue-300 dark:text-blue-400">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href="https://linear-snow-8672.d.kiloapps.io/" target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full gap-1.5 bg-blue-600 hover:bg-blue-700 text-xs" data-testid="button-uji-kompetensi">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Buka Chatbot Persiapan
                        </Button>
                      </a>
                      <Link href="/bot/siap-ukom">
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs" data-testid="button-chat-ukom">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Chat
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Dokumentender */}
              <Card className="hover-elevate overflow-visible border-2 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Wrench className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Dokumentender</h3>
                      <p className="text-xs text-muted-foreground">Knowledge Base Keteknikan & Konstruksi</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Akses pengetahuan lengkap tentang Teknik Sipil, Mesin, Elektro — standar SNI, ISO, metode pelaksanaan, RAB, K3, dokumen tender, kontrak, dan peraturan LKPP. Jawaban akurat dari dokumen asli.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {["Teknik Sipil", "SNI & ISO", "RAB & K3", "Pengadaan", "LKPP"].map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs text-emerald-700 border-emerald-300 dark:text-emerald-400">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href="https://chat.dokumentender.com" target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs" data-testid="button-dokumentender">
                          <ExternalLink className="h-3.5 w-3.5" />
                          chat.dokumentender.com
                        </Button>
                      </a>
                      <Link href="/bot/dokumentender">
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs" data-testid="button-chat-dokumentender">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Chat
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Aplikasi Industri */}
              <Card className="hover-elevate overflow-visible border-2 border-orange-200 dark:border-orange-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Factory className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Aplikasi Industri</h3>
                      <p className="text-xs text-muted-foreground">Tools Operasional Sektor Industri</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Aplikasi AI terintegrasi untuk kebutuhan operasional industri — manajemen produksi, quality control, efisiensi proses, dan digitalisasi sistem kerja di lapangan.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {["Produksi", "Quality Control", "Efisiensi Proses", "Digitalisasi", "Lapangan"].map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs text-orange-700 border-orange-300 dark:text-orange-400">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href="https://dual-voxel-1743.d.kiloapps.io/" target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full gap-1.5 bg-orange-600 hover:bg-orange-700 text-xs" data-testid="button-aplikasi-industri">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Buka Aplikasi Industri
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5. Manajemen ISO */}
              <Card className="hover-elevate overflow-visible border-2 border-violet-200 dark:border-violet-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-6 w-6 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Manajemen ISO</h3>
                      <p className="text-xs text-muted-foreground">Sistem Manajemen Mutu & Kepatuhan ISO</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Kelola implementasi standar ISO secara menyeluruh — dokumentasi prosedur, audit internal, tindakan korektif, pemantauan KPI mutu, dan persiapan sertifikasi berbasis AI.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {["ISO 9001", "ISO 14001", "ISO 45001", "Audit Internal", "Sertifikasi"].map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs text-violet-700 border-violet-300 dark:text-violet-400">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href="https://soft-reed-1971.d.kiloapps.io/" target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full gap-1.5 bg-violet-600 hover:bg-violet-700 text-xs" data-testid="button-manajemen-iso">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Buka Manajemen ISO
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 6. Aplikasi Hukum */}
              <Card className="hover-elevate overflow-visible border-2 border-rose-200 dark:border-rose-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                      <Scale className="h-6 w-6 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Aplikasi Hukum</h3>
                      <p className="text-xs text-muted-foreground">Asisten AI Bidang Hukum & Kontrak</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Asisten AI untuk kebutuhan hukum bisnis dan konstruksi — review kontrak, analisis klausul, draf perjanjian, kepatuhan regulasi, dan konsultasi hukum pengadaan.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {["Review Kontrak", "Analisis Klausul", "Regulasi", "Pengadaan", "Hukum Bisnis"].map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs text-rose-700 border-rose-300 dark:text-rose-400">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href="https://open-token-0622.d.kiloapps.io/" target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full gap-1.5 bg-rose-600 hover:bg-rose-700 text-xs" data-testid="button-aplikasi-hukum">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Buka Aplikasi Hukum
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 text-center relative">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            <Bot className="h-3 w-3 mr-1" />
            AI Chatbot Builder Spesialis Konstruksi (Konfigurabel untuk Sektor Lain)
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Siap Membangun Chatbot AI Anda?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
            Bergabung dengan kontraktor, konsultan, dan pelaku jasa konstruksi yang sudah memakai 19 series & 250+ chatbot Gustafta — 
            dan tetap bisa Anda konfigurasi untuk sektor lain. Setup chatbot AI dan mulai melayani hari ini.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>Setup &lt; 30 menit</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>250+ chatbot konstruksi</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>Tanpa coding</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6" data-testid="button-cta-dashboard">
                  <Rocket className="h-5 w-5" />
                  Buka Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <a href="/api/login" onClick={handleStartNowClick}>
                <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6" data-testid="button-cta-start">
                  <Rocket className="h-5 w-5" />
                  Mulai Gratis Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
            )}
            <Link href="/pricing" onClick={handlePricingClick}>
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Lihat Harga
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Gustafta</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                AI Chatbot Builder spesialis jasa konstruksi Indonesia — 19 series, 250+ chatbot. Konfigurabel untuk sektor lain.
              </p>
              <div className="flex flex-wrap gap-2">
                {trustBadges.slice(0, 2).map((badge) => (
                  <Badge key={badge.label} variant="outline" className="text-xs">
                    <badge.icon className="h-3 w-3 mr-1" />
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/marketplace" className="hover:text-foreground">Marketplace</Link></li>
                <li><Link href="/packs" className="hover:text-foreground">Paket Domain</Link></li>
                <li><Link href="/domains" className="hover:text-foreground">Domain Kustom (URL)</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Harga</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Template</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Integrasi</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sektor Usaha</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {featuredSectors.slice(0, 6).map((sector) => (
                  <li key={sector.id}>
                    <Link href={`/sector/${sector.id}`} className="hover:text-foreground">{sector.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/documentation" className="hover:text-foreground">Dokumentasi</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">API Reference</Link></li>
                <li><Link href="/series" className="hover:text-foreground">Chatbot Series</Link></li>
                <li>
                  <a href="https://chat.dokumentender.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Dokumentender
                  </a>
                </li>
                <li>
                  <a href="https://linear-snow-8672.d.kiloapps.io/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Siap Uji Kompetensi
                  </a>
                </li>
                <li>
                  <a href="https://dual-voxel-1743.d.kiloapps.io/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Aplikasi Industri
                  </a>
                </li>
                <li>
                  <a href="https://soft-reed-1971.d.kiloapps.io/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Manajemen ISO
                  </a>
                </li>
                <li>
                  <a href="https://falling-bloom-7842.d.kiloapps.io/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Konstruksi AI
                  </a>
                </li>
                <li>
                  <a href="https://open-token-0622.d.kiloapps.io/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Aplikasi Hukum
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Gustafta. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/documentation" className="hover:text-foreground">Terms</Link>
              <Link href="/documentation" className="hover:text-foreground">Privacy</Link>
              <Link href="/documentation" className="hover:text-foreground">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {gustaftaAssistant && (
        <ChatPopup agent={gustaftaAssistant} />
      )}
    </div>
  );
}
