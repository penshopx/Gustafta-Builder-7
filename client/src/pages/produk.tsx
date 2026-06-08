/**
 * Gustafta Builder — Halaman Produk
 * 4 jalur produk: Paket Bisnis, Paket Modul, Paket Chatbot, Paket Whitelabel
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { SharedHeader } from "@/components/shared-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import {
  Bot, Blocks, Package, Building2, ChevronRight, Check, Zap,
  MessageSquare, Globe, Shield, Headphones, Users, Star,
  ArrowRight, Sparkles, Crown, Wrench, BookOpen, BarChart3,
  HardHat, Target, Award, Pencil, Layers, Briefcase,
  Phone, ExternalLink, Plus, CreditCard, FileText, GraduationCap,
  Mic, PenLine, Calculator, Megaphone, ScrollText, LayoutGrid,
  AlertTriangle, TrendingUp, Lightbulb, ClipboardList, BadgePlus,
} from "lucide-react";

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface BisnisPlan {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  price: string;
  priceNote: string;
  setupFee?: string;
  popular?: boolean;
  color: string;
  borderColor: string;
  bgColor: string;
  headerBg: string;
  icon: typeof Bot;
  tagline: string;
  limits: { label: string; value: string }[];
  features: string[];
  chatbots: { name: string; icon: typeof Bot; tag: string }[];
  cta: string;
  planKey: string;
}

const BISNIS_PLANS: BisnisPlan[] = [
  {
    id: "free",
    name: "Gratis",
    badge: "TRIAL",
    badgeColor: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    price: "Rp 0",
    priceNote: "/bulan",
    color: "text-slate-500",
    borderColor: "border-slate-200 dark:border-slate-800",
    bgColor: "bg-slate-50 dark:bg-slate-900/40",
    headerBg: "bg-slate-100/60 dark:bg-slate-800/40",
    icon: Sparkles,
    tagline: "Coba platform tanpa biaya",
    limits: [
      { label: "Pesan/bulan", value: "50 pesan" },
      { label: "Chatbot buat sendiri", value: "3 bot" },
      { label: "Knowledge Base", value: "5 dokumen" },
    ],
    features: [
      "Builder chatbot dasar",
      "Web widget embed",
      "Dashboard analitik",
    ],
    chatbots: [
      { name: "Sample Bot 1", icon: Bot, tag: "Contoh konfigurasi" },
      { name: "Sample Bot 2", icon: MessageSquare, tag: "Contoh persona" },
    ],
    cta: "Mulai Gratis",
    planKey: "free",
  },
  {
    id: "starter",
    name: "Starter",
    badge: "STARTER",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    price: "Rp 199.000",
    priceNote: "/bulan",
    setupFee: "Setup Rp 1.500.000",
    color: "text-blue-500",
    borderColor: "border-blue-200 dark:border-blue-800",
    bgColor: "bg-blue-50/50 dark:bg-blue-950/20",
    headerBg: "bg-blue-100/50 dark:bg-blue-900/30",
    icon: Zap,
    tagline: "Mulai bisnis chatbot Anda",
    limits: [
      { label: "Pesan/bulan", value: "2.000 pesan" },
      { label: "Chatbot buat sendiri", value: "10 bot" },
      { label: "Knowledge Base", value: "20 dokumen" },
    ],
    features: [
      "Builder chatbot penuh",
      "Mini Apps 5 tipe",
      "Modul pembelajaran",
      "Web widget no-branding",
      "Email support",
    ],
    chatbots: [
      { name: "Sample Bot 1 & 2", icon: Bot, tag: "2 contoh konfigurasi" },
      { name: "EduCounsel AI", icon: BookOpen, tag: "Konseling akademik" },
      { name: "AI Tutor Adaptif", icon: Award, tag: "Tutor 8 agen" },
    ],
    cta: "Pilih Starter",
    planKey: "starter",
  },
  {
    id: "profesional",
    name: "Profesional",
    badge: "PRO",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    price: "Rp 499.000",
    priceNote: "/bulan",
    setupFee: "Setup Rp 3.500.000",
    popular: true,
    color: "text-indigo-500",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    bgColor: "bg-indigo-50/50 dark:bg-indigo-950/20",
    headerBg: "bg-indigo-100/50 dark:bg-indigo-900/30",
    icon: Crown,
    tagline: "Ekosistem lengkap + 4 bot konstruksi",
    limits: [
      { label: "Pesan/bulan", value: "3.000 pesan" },
      { label: "Chatbot buat sendiri", value: "50 bot" },
      { label: "Knowledge Base", value: "30 dokumen" },
    ],
    features: [
      "Semua fitur Starter",
      "Advanced AI Tools (MultiClaw)",
      "Mini Apps 15 tipe",
      "E-Course & Document Generator",
      "Custom Domain (1)",
      "Priority email support",
    ],
    chatbots: [
      { name: "Semua bot Starter", icon: Zap, tag: "Termasuk" },
      { name: "TenderBot", icon: Target, tag: "AI Tender BUJK" },
      { name: "SertifikasiBot", icon: Award, tag: "SBU & SKK" },
      { name: "PerijinanBot", icon: Globe, tag: "OSS-RBA & NIB" },
      { name: "KontraktorBot", icon: HardHat, tag: "QS & RAB" },
    ],
    cta: "Pilih Profesional",
    planKey: "profesional",
  },
  {
    id: "bisnis",
    name: "Bisnis",
    badge: "BISNIS",
    badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    price: "Rp 999.000",
    priceNote: "/bulan",
    setupFee: "Setup Rp 7.500.000",
    color: "text-violet-500",
    borderColor: "border-violet-200 dark:border-violet-800",
    bgColor: "bg-violet-50/50 dark:bg-violet-950/20",
    headerBg: "bg-violet-100/50 dark:bg-violet-900/30",
    icon: Building2,
    tagline: "Suite lengkap 9 bot konstruksi",
    limits: [
      { label: "Pesan/bulan", value: "5.000 pesan" },
      { label: "Chatbot buat sendiri", value: "200 bot" },
      { label: "Knowledge Base", value: "50 dokumen" },
    ],
    features: [
      "Semua fitur Profesional",
      "Custom Domain (3)",
      "White-label branding",
      "Semua Mini Apps (45 tipe)",
      "Priority WhatsApp support",
    ],
    chatbots: [
      { name: "Semua bot Profesional", icon: Crown, tag: "Termasuk" },
      { name: "ProyekBot", icon: Layers, tag: "Manajemen Proyek" },
      { name: "OwnerBot", icon: Building2, tag: "Developer & Owner" },
      { name: "KonsultanBot", icon: Pencil, tag: "DED & MK" },
      { name: "BoheerBot", icon: Wrench, tag: "Subkontraktor" },
      { name: "SupplierBot", icon: Package, tag: "Material & Logistik" },
    ],
    cta: "Pilih Bisnis",
    planKey: "bisnis",
  },
];

const MODUL_PACKAGES = [
  {
    tier: "Modul Dasar",
    price: "Rp 1.499.000",
    color: "text-blue-500",
    borderColor: "border-blue-200 dark:border-blue-800",
    bgColor: "bg-blue-50/40 dark:bg-blue-950/20",
    icon: Bot,
    desc: "1 chatbot spesifik untuk kebutuhan Anda — FAQ, info produk, layanan dasar",
    includes: [
      "Konfigurasi 1 chatbot tematik",
      "Prompt engineering profesional",
      "Knowledge base hingga 10 dokumen",
      "Testing & QA sebelum go-live",
      "Training penggunaan 1 jam (online)",
    ],
    delivery: "5–7 hari kerja",
  },
  {
    tier: "Modul Menengah",
    price: "Rp 2.499.000",
    color: "text-indigo-500",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    bgColor: "bg-indigo-50/40 dark:bg-indigo-950/20",
    icon: Layers,
    desc: "Chatbot multi-fungsi dengan logika percakapan kompleks dan integrasi",
    popular: true,
    includes: [
      "Semua Modul Dasar",
      "Multi-persona atau multi-topik",
      "Integrasi WhatsApp/Telegram",
      "Knowledge base hingga 20 dokumen",
      "Revisi hingga 3×",
      "Training penggunaan 2 jam",
    ],
    delivery: "7–14 hari kerja",
  },
  {
    tier: "Modul Kompleks",
    price: "Rp 4.900.000",
    color: "text-violet-500",
    borderColor: "border-violet-200 dark:border-violet-800",
    bgColor: "bg-violet-50/40 dark:bg-violet-950/20",
    icon: Zap,
    desc: "Sistem multi-agent dengan orkestrasi — untuk kebutuhan enterprise",
    includes: [
      "Semua Modul Menengah",
      "Orkestrasi multi-agent (3–7 agen)",
      "Knowledge base luas (50+ dokumen)",
      "Custom workflow & persona",
      "Revisi tidak terbatas (30 hari)",
      "Dedicated support 30 hari",
    ],
    delivery: "14–21 hari kerja",
  },
];

const KREDIT_EKSTRA = [
  {
    label: "Pack S",
    pesan: "500 pesan",
    price: "Rp 49.000",
    perPesan: "Rp 98/pesan",
    color: "text-blue-500",
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    badge: "",
  },
  {
    label: "Pack M",
    pesan: "1.500 pesan",
    price: "Rp 129.000",
    perPesan: "Rp 86/pesan",
    color: "text-indigo-500",
    border: "border-indigo-200 dark:border-indigo-800",
    bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
    badge: "PALING LAKU",
  },
  {
    label: "Pack L",
    pesan: "3.000 pesan",
    price: "Rp 229.000",
    perPesan: "Rp 76/pesan",
    color: "text-violet-500",
    border: "border-violet-200 dark:border-violet-800",
    bg: "bg-violet-50/50 dark:bg-violet-950/20",
    badge: "",
  },
  {
    label: "Pack XL",
    pesan: "5.000 pesan",
    price: "Rp 349.000",
    perPesan: "Rp 70/pesan",
    color: "text-purple-500",
    border: "border-purple-200 dark:border-purple-800",
    bg: "bg-purple-50/50 dark:bg-purple-950/20",
    badge: "TERBAIK",
  },
];

const FITUR_LANJUTAN = [
  {
    icon: LayoutGrid,
    title: "Mini Apps (45 tipe)",
    color: "text-violet-500",
    border: "border-violet-200 dark:border-violet-800",
    bg: "bg-violet-50/40 dark:bg-violet-950/20",
    badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    desc: "Tools produktivitas AI yang tertanam di dalam chatbot Anda. Satu klik → output siap pakai.",
    groups: [
      { hub: "🟣 Kreator", items: ["Editorial Calendar", "Script YouTube/Podcast", "Proposal Brand Deal", "Laporan Performa Konten"] },
      { hub: "🟢 Bekerja", items: ["AI Notulis Rapat", "Drafter Kontrak/SPK/NDA", "RAB & Estimasi Biaya", "Laporan KPI Tim"] },
      { hub: "🟠 Berusaha", items: ["AI Copywriter Medsos", "Sales Script & Objection Handling", "Laporan Cashflow", "NPS & Survey Kepuasan"] },
      { hub: "🎓 Kompetensi PKB", items: ["Executive Summary PKB (25 poin SKP)", "Penulis Cerdas — dokumen bab per bab", "Input: E-SIMPAN + YouTube + lapangan", "Studio Kompetensi & Rubrik 0–3"] },
    ],
  },
  {
    icon: FileText,
    title: "Generator Dokumen",
    color: "text-blue-500",
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50/40 dark:bg-blue-950/20",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    desc: "AI menghasilkan dokumen profesional dari knowledge base & data proyek — bukan template kosong.",
    groups: [
      { hub: "📘 eBook & eCourse", items: ["Buku panduan kompetensi dari KB", "eCourse microlearning + kuis", "Sertifikat digital (PDF)", "Ekspor HTML/PDF siap cetak"] },
      { hub: "📄 Dokumen Tender/Proyek", items: ["HSE Plan & PQP Tender", "Compliance Matrix & Audit", "Metode Pelaksanaan", "Executive Summary Penawaran"] },
      { hub: "🎓 Ekosistem Kompetensi PKB", items: ["Executive Summary PKB 25 poin SKP", "Input: proyek E-SIMPAN + pelatihan + YouTube", "Penulis Cerdas: dokumen bab per bab", "Klaim SKP ke LPJK"] },
      { hub: "✍️ Dokumen Legal & Bisnis", items: ["Drafter Kontrak/SPK/NDA/MoU", "Laporan kinerja & KPI tim", "Proposal & media kit", "Surat resmi industri Indonesia"] },
    ],
  },
  {
    icon: GraduationCap,
    title: "E-Course & LMS",
    color: "text-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800",
    bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    desc: "Ubah chatbot Anda menjadi platform belajar interaktif — termasuk kuis, sertifikat, dan progress peserta.",
    groups: [
      { hub: "📚 Modul Belajar", items: ["Konten dari KB chatbot", "Urutan materi otomatis", "Multi-topik per chatbot", "Progress peserta real-time"] },
      { hub: "📝 Evaluasi", items: ["Kuis otomatis per modul", "Skor & leaderboard", "Sertifikat digital PDF", "Rekap nilai peserta"] },
      { hub: "👨‍🏫 Tutor Adaptif", items: ["AI Tutor 8 agen spesialis", "Mode: Teori/Latihan/Tryout", "Gamifikasi & poin", "Dashboard orang tua"] },
      { hub: "🏫 Admin LMS", items: ["Kelola kelas & peserta", "Absensi & jadwal", "Laporan progress kelas", "Notifikasi otomatis"] },
    ],
  },
  {
    icon: Mic,
    title: "Studio Podcast & Audio",
    color: "text-rose-500",
    border: "border-rose-200 dark:border-rose-800",
    bg: "bg-rose-50/40 dark:bg-rose-950/20",
    badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    desc: "Produksi konten audio profesional dengan bantuan AI — dari rekaman ke distribusi.",
    groups: [
      { hub: "🎙️ Produksi", items: ["Transkrip otomatis", "Clean-up & cut points", "Show notes lengkap", "Snippet medsos"] },
      { hub: "📝 Konten", items: ["Script YouTube/Podcast AI", "Hook 5 detik (3 variasi)", "Narasi & storytelling", "CTA & outro"] },
      { hub: "📢 Distribusi", items: ["Konten ke semua platform", "Jadwal posting otomatis", "Analytics performa", "Media kit kreator"] },
      { hub: "🤖 Studio AI", items: ["Orchestrator 4 agen pasca-rekaman", "AI Narator & Pencerita", "Tone of voice adaptif", "A/B testing hook"] },
    ],
  },
];

const CHATBOT_SHOWCASE = [
  { icon: HardHat, name: "KontraktorBot", desc: "QS, RAB & Estimasi Biaya", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20", tag: "Konstruksi" },
  { icon: Target, name: "TenderBot", desc: "AI Tender BUJK & Monitor SIRUP", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/20", tag: "Konstruksi" },
  { icon: Award, name: "SertifikasiBot", desc: "SBU & SKK Kompetensi", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20", tag: "Konstruksi" },
  { icon: Building2, name: "OwnerBot", desc: "Developer & Pemilik Proyek", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/20", tag: "Properti" },
  { icon: Pencil, name: "KonsultanBot", desc: "DED, MK & Jasa Konsultansi", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20", tag: "Konstruksi" },
  { icon: Wrench, name: "BoheerBot", desc: "Subkontraktor & Klaim Termin", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/20", tag: "Konstruksi" },
  { icon: Package, name: "SupplierBot", desc: "Material & Supply Chain", color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/20", tag: "Logistik" },
  { icon: Globe, name: "PerijinanBot", desc: "OSS-RBA, NIB & Perizinan", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20", tag: "Regulasi" },
];

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = "bisnis" | "modul" | "chatbot" | "whitelabel";

const TABS: { id: Tab; label: string; icon: typeof Bot; color: string }[] = [
  { id: "bisnis",     label: "Paket Bisnis",    icon: Zap,       color: "indigo" },
  { id: "modul",      label: "Paket Modul",     icon: Wrench,    color: "violet" },
  { id: "chatbot",    label: "Paket Chatbot",   icon: Bot,       color: "blue" },
  { id: "whitelabel", label: "Paket Whitelabel",icon: Shield,    color: "amber" },
];

// ─── Sections ─────────────────────────────────────────────────────────────────
function BisnisPaket() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <Badge className="mb-3 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">Paket Bisnis</Badge>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Akses platform + chatbot premium per tier</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
          Setiap tier Paket Bisnis sudah termasuk chatbot premium yang berbeda — semakin tinggi tier,
          semakin banyak chatbot konstruksi canggih yang langsung bisa dipakai.
        </p>
      </div>

      {/* Pricing + chatbot grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {BISNIS_PLANS.map(plan => (
          <div key={plan.id}
            className={`relative rounded-2xl border ${plan.borderColor} overflow-hidden flex flex-col transition-shadow hover:shadow-xl`}>
            {plan.popular && (
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">POPULER</span>
              </div>
            )}

            {/* Header */}
            <div className={`${plan.headerBg} px-5 pt-5 pb-4`}>
              <div className="flex items-center gap-2 mb-2">
                <plan.icon className={`w-4 h-4 ${plan.color}`}/>
                <Badge className={`text-[10px] ${plan.badgeColor}`}>{plan.badge}</Badge>
              </div>
              <div className="text-base font-bold text-gray-900 dark:text-white">{plan.name}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{plan.tagline}</div>
              <div className="mt-3">
                <span className={`text-2xl font-bold ${plan.color}`}>{plan.price}</span>
                <span className="text-xs text-gray-400 ml-1">{plan.priceNote}</span>
              </div>
              {plan.setupFee && <div className="text-[10px] text-gray-400 mt-0.5">{plan.setupFee} (sekali)</div>}
            </div>

            <div className={`flex-1 ${plan.bgColor} px-5 py-4 flex flex-col gap-4`}>
              {/* Limits */}
              <div className="space-y-1.5">
                {plan.limits.map((l, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-500">{l.label}</span>
                    <span className={`font-semibold ${plan.color}`}>{l.value}</span>
                  </div>
                ))}
              </div>

              {/* Chatbots included */}
              <div>
                <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Bot className="w-3 h-3"/> Chatbot Premium Termasuk
                </div>
                <ul className="space-y-1.5">
                  {plan.chatbots.map((bot, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${plan.headerBg} border ${plan.borderColor}`}>
                        <bot.icon className={`w-2.5 h-2.5 ${plan.color}`}/>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-gray-800 dark:text-gray-200 leading-none">{bot.name}</div>
                        <div className="text-[9px] text-gray-400 mt-0.5">{bot.tag}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Platform features */}
              <ul className="space-y-1 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600 dark:text-gray-400">
                    <Check className={`w-3 h-3 shrink-0 mt-0.5 ${plan.color}`}/>
                    {f}
                  </li>
                ))}
              </ul>

              <Button size="sm"
                data-testid={`btn-pilih-${plan.id}`}
                onClick={() => navigate(user ? "/pricing" : "/auth")}
                className={`w-full text-xs h-8 ${plan.popular ? "bg-indigo-600 hover:bg-indigo-500 text-white" : ""}`}
                variant={plan.popular ? "default" : "outline"}>
                {plan.cta} <ChevronRight className="w-3.5 h-3.5 ml-1"/>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade ladder */}
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-500"/> Makin tinggi tier = makin lengkap chatbot yang didapat
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-500 flex-wrap">
          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">Free: 2 sample</span>
          <ArrowRight className="w-3 h-3 text-gray-400 shrink-0"/>
          <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full text-blue-600 dark:text-blue-400">Starter: + EduCounsel, AI Tutor</span>
          <ArrowRight className="w-3 h-3 text-gray-400 shrink-0"/>
          <span className="bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded-full text-indigo-600 dark:text-indigo-400">Pro: + 4 bot konstruksi</span>
          <ArrowRight className="w-3 h-3 text-gray-400 shrink-0"/>
          <span className="bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 rounded-full text-violet-600 dark:text-violet-400">Bisnis: + 5 bot konstruksi lagi (total 9)</span>
        </div>
      </div>

      {/* Pesan notice */}
      <div className="max-w-3xl mx-auto bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
        <strong>Batas pesan:</strong> Dihitung dari total interaksi dengan AI di semua chatbot Anda per bulan.
        Kuota habis → chat dihentikan sementara hingga bulan berikutnya atau upgrade.
      </div>

      {/* ── Kredit Ekstra ─────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <BadgePlus className="w-4 h-4 text-indigo-500"/>
          <span className="text-sm font-bold text-gray-900 dark:text-white">Kredit Pesan Ekstra</span>
          <Badge className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">Top-Up</Badge>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 ml-6">
          Kuota bulanan habis sebelum waktunya? Top-up kapan saja — kredit langsung aktif, tidak kadaluarsa.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {KREDIT_EKSTRA.map((pack, i) => (
            <div key={i} className={`relative rounded-xl border ${pack.border} ${pack.bg} p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow`}>
              {pack.badge && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shadow ${pack.badge === "PALING LAKU" ? "bg-indigo-600 text-white" : "bg-purple-600 text-white"}`}>
                    {pack.badge}
                  </span>
                </div>
              )}
              <div className={`text-xs font-semibold ${pack.color} mb-1`}>{pack.label}</div>
              <div className={`text-lg font-bold ${pack.color}`}>{pack.pesan}</div>
              <div className="text-base font-bold text-gray-900 dark:text-white mt-1">{pack.price}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{pack.perPesan}</div>
              <a href="https://wa.me/6281234567890?text=Halo%20Gustafta%2C%20saya%20ingin%20top-up%20kredit%20pesan" target="_blank" rel="noopener noreferrer" className="mt-3 w-full">
                <Button size="sm" variant="outline" className={`w-full text-[11px] h-7 border-current ${pack.color}`}>
                  Beli <Plus className="w-3 h-3 ml-1"/>
                </Button>
              </a>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-gray-400 text-center">
          Kredit berlaku di semua paket (Starter, Profesional, Bisnis) · Tidak kadaluarsa · Bisa akumulasi
        </div>
      </div>

      {/* ── Fitur Lanjutan ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <Badge className="mb-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">Platform Features</Badge>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fitur Lanjutan Platform Gustafta</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Di luar chatbot biasa — ini tools produktivitas yang terintegrasi langsung di platform Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FITUR_LANJUTAN.map((fitur, i) => (
            <div key={i} className={`rounded-2xl border ${fitur.border} ${fitur.bg} p-5 flex flex-col gap-3`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${fitur.bg} border ${fitur.border}`}>
                  <fitur.icon className={`w-5 h-5 ${fitur.color}`}/>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{fitur.title}</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{fitur.desc}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {fitur.groups.map((group, j) => (
                  <div key={j} className="bg-white/60 dark:bg-black/10 rounded-lg p-2.5 border border-white/80 dark:border-white/5">
                    <div className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{group.hub}</div>
                    <ul className="space-y-0.5">
                      {group.items.map((item, k) => (
                        <li key={k} className="text-[10px] text-gray-600 dark:text-gray-400 flex items-start gap-1">
                          <Check className={`w-2.5 h-2.5 shrink-0 mt-0.5 ${fitur.color}`}/>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-gray-400 flex items-center gap-1">
                <Shield className="w-3 h-3"/>
                {i === 0 ? "Tersedia mulai Starter (5 tipe) · Profesional (15 tipe) · Bisnis (45 tipe)"
                 : i === 1 ? "Generator Dokumen tersedia di Profesional ke atas"
                 : i === 2 ? "E-Course tersedia di Profesional ke atas · LMS di semua paket"
                 : "Studio Podcast tersedia di Bisnis ke atas"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModulPaket() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <Badge className="mb-3 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">Paket Modul</Badge>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Minta dibuatkan modul khusus</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
          Tim Gustafta membuatkan chatbot sesuai spesifikasi bisnis Anda. Ideal untuk perusahaan yang ingin
          chatbot profesional tanpa perlu konfigurasi sendiri.
        </p>
      </div>

      {/* How it works */}
      <div className="max-w-3xl mx-auto">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 text-center">Cara Kerja</div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { step:"1", label:"Konsultasi", desc:"Diskusikan kebutuhan via WhatsApp" },
            { step:"2", label:"Brief & Desain", desc:"Tim kami menyusun spesifikasi chatbot" },
            { step:"3", label:"Build & Testing", desc:"Pengembangan & pengujian kualitas" },
            { step:"4", label:"Deploy & Training", desc:"Go-live + pelatihan penggunaan" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-bold text-sm flex items-center justify-center mx-auto mb-2">{s.step}</div>
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{s.label}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {MODUL_PACKAGES.map((pkg, i) => (
          <div key={i}
            className={`relative rounded-2xl border ${pkg.borderColor} ${pkg.bgColor} p-5 flex flex-col hover:shadow-lg transition-shadow`}>
            {"popular" in pkg && pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">PALING DIMINATI</span>
              </div>
            )}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${pkg.bgColor} border ${pkg.borderColor}`}>
              <pkg.icon className={`w-5 h-5 ${pkg.color}`}/>
            </div>
            <div className="text-base font-bold text-gray-900 dark:text-white">{pkg.tier}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3 leading-relaxed">{pkg.desc}</div>
            <div className={`text-2xl font-bold ${pkg.color} mb-1`}>{pkg.price}</div>
            <div className="text-[10px] text-gray-400 mb-4">One-time · Delivery {pkg.delivery}</div>
            <ul className="space-y-1.5 flex-1 mb-5">
              {pkg.includes.map((f, j) => (
                <li key={j} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${pkg.color}`}/>
                  {f}
                </li>
              ))}
            </ul>
            <a href="https://wa.me/6281234567890?text=Halo%20Gustafta%2C%20saya%20ingin%20order%20Paket%20Modul%20" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className={`w-full text-xs h-8 border-current ${pkg.color}`}>
                Order Sekarang <ExternalLink className="w-3 h-3 ml-1"/>
              </Button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatbotPaket() {
  const [, navigate] = useLocation();
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <Badge className="mb-3 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Paket Chatbot</Badge>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Aktivasi chatbot siap pakai</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
          Pilih chatbot dari koleksi Gustafta yang sudah dibuat dan dioptimalkan oleh tim ahli.
          Aktifkan langsung di akun Anda — tidak perlu setup dari nol.
        </p>
      </div>

      {/* Value prop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {[
          { icon: Zap, title: "Langsung Aktif", desc: "Bot diaktifkan di akun Anda dalam 24 jam kerja" },
          { icon: Star, title: "Sudah Teruji", desc: "Setiap bot telah diuji dan dioptimalkan tim ahli" },
          { icon: Layers, title: "Multi-Agent", desc: "Bot premium menggunakan orkestrasi 7–10 agen spesialis" },
        ].map((v, i) => (
          <div key={i} className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <v.icon className="w-5 h-5 text-blue-500 mx-auto mb-2"/>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{v.title}</div>
            <div className="text-[11px] text-gray-500 mt-1">{v.desc}</div>
          </div>
        ))}
      </div>

      {/* Bot catalog */}
      <div className="max-w-5xl mx-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">Koleksi Bot Premium — Construction Suite</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CHATBOT_SHOWCASE.map((bot, i) => (
            <div key={i} className={`${bot.bg} border border-current/10 rounded-xl p-3.5 flex flex-col items-center text-center hover:shadow-md transition-shadow`}>
              <div className={`w-10 h-10 rounded-xl ${bot.bg} flex items-center justify-center mb-2 border border-current/10`}>
                <bot.icon className={`w-5 h-5 ${bot.color}`}/>
              </div>
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{bot.name}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{bot.desc}</div>
              <Badge className="mt-2 text-[9px] bg-white/60 dark:bg-black/20 text-gray-600 dark:text-gray-400">{bot.tag}</Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          +50 chatbot lainnya tersedia — lihat katalog lengkap di halaman Pricing
        </div>
      </div>

      {/* Pricing note */}
      <div className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 text-center">
        <div className="text-sm font-bold text-gray-800 dark:text-white mb-1">Harga mulai Rp 1.499.000</div>
        <div className="text-xs text-gray-500 mb-4">One-time activation fee per bot. Termasuk konfigurasi + embed widget.</div>
        <div className="flex gap-3 justify-center">
          <Button size="sm" onClick={() => navigate("/pricing")} className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8">
            Lihat Katalog Lengkap <ChevronRight className="w-3.5 h-3.5 ml-1"/>
          </Button>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="text-xs h-8 border-blue-300 text-blue-600">
              Konsultasi via WA <ExternalLink className="w-3 h-3 ml-1"/>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

function WhitelabelPaket() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <Badge className="mb-3 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Paket Whitelabel</Badge>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Platform chatbot dengan merek Anda</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
          Dapatkan aplikasi Gustafta dengan logo, nama, dan domain Anda sendiri.
          Cocok untuk perusahaan yang ingin menjual layanan chatbot ke klien mereka.
        </p>
      </div>

      {/* What's included */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500"/>
            <div className="text-sm font-bold text-gray-900 dark:text-white">Yang Anda Dapatkan</div>
          </div>
          <ul className="space-y-2">
            {[
              "Aplikasi chatbot builder dengan logo & nama Anda",
              "Domain/subdomain custom (app.merekanda.com)",
              "1 chatbot aktif: MerawatRumahBot (default)",
              "Builder untuk tambah chatbot sendiri",
              "Dashboard admin untuk kelola user & bot",
              "Branding penuh — tidak ada logo Gustafta",
              "Onboarding & training tim Anda",
              "Dedicated support 3 bulan",
            ].map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {/* Default bot info */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-green-600"/>
              <div className="text-xs font-bold text-green-800 dark:text-green-300">Bot Default: MerawatRumahBot</div>
            </div>
            <p className="text-[11px] text-green-700 dark:text-green-400 leading-relaxed">
              Satu-satunya chatbot yang aktif di versi whitelabel kosong. Membantu pemilik rumah
              dengan tips perawatan rumah, renovasi, dan rekomendasi material. Berfungsi sebagai
              demo & proof-of-concept untuk calon klien Anda.
            </p>
          </div>

          {/* Use cases */}
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Cocok untuk:</div>
            <ul className="space-y-1.5">
              {[
                { icon: Building2, text: "Perusahaan teknologi yang jual solusi AI ke klien" },
                { icon: Briefcase, text: "Konsultan digital yang ingin platform sendiri" },
                { icon: Users,     text: "Agensi marketing yang bundel chatbot ke layanannya" },
                { icon: Globe,     text: "Perusahaan yang butuh internal chatbot hub bermerek" },
              ].map((u, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <u.icon className="w-3.5 h-3.5 text-amber-500 shrink-0"/>
                  {u.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700 rounded-xl p-4 text-center">
            <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">Harga Whitelabel</div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">Custom</div>
            <div className="text-[10px] text-gray-500 mt-1 mb-3">Tergantung kebutuhan, jumlah user & modul</div>
            <a href="https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20Paket%20Whitelabel%20Gustafta" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-8 w-full">
                Hubungi Tim Kami <ExternalLink className="w-3 h-3 ml-1"/>
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Expand note */}
      <div className="max-w-3xl mx-auto bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Ingin menambah bot premium di platform whitelabel Anda? Kombinasikan dengan <strong>Paket Modul</strong> atau <strong>Paket Chatbot</strong> untuk memperluas kemampuan aplikasi.
      </div>
    </div>
  );
}

// ─── Comparison table ─────────────────────────────────────────────────────────
function KomparasiTable() {
  const rows = [
    { label: "Buat chatbot sendiri",   bisnis: true,   modul: false,  chatbot: false, wl: true  },
    { label: "Bot dibuatkan tim ahli", bisnis: false,  modul: true,   chatbot: true,  wl: false },
    { label: "Bot siap pakai (jadi)",  bisnis: false,  modul: false,  chatbot: true,  wl: true  },
    { label: "Branding sendiri",       bisnis: false,  modul: false,  chatbot: false, wl: true  },
    { label: "Akses semua fitur Gustafta", bisnis: true, modul: false, chatbot: false, wl: true },
    { label: "One-time payment",       bisnis: false,  modul: true,   chatbot: true,  wl: false },
    { label: "Subscription bulanan",   bisnis: true,   modul: false,  chatbot: false, wl: true  },
    { label: "Cocok untuk pemula",     bisnis: true,   modul: true,   chatbot: true,  wl: false },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="text-sm font-bold text-center text-gray-800 dark:text-white mb-4">Perbandingan Cepat</div>
      <div className="rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900">
              <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Fitur</th>
              <th className="text-center px-3 py-2.5 text-indigo-500 font-semibold">Bisnis</th>
              <th className="text-center px-3 py-2.5 text-violet-500 font-semibold">Modul</th>
              <th className="text-center px-3 py-2.5 text-blue-500 font-semibold">Chatbot</th>
              <th className="text-center px-3 py-2.5 text-amber-500 font-semibold">Whitelabel</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-gray-50/60 dark:bg-slate-900/40"}>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.label}</td>
                {[row.bisnis, row.modul, row.chatbot, row.wl].map((v, j) => (
                  <td key={j} className="text-center px-3 py-2">
                    {v
                      ? <Check className="w-3.5 h-3.5 text-green-500 mx-auto"/>
                      : <span className="text-gray-300 dark:text-gray-700 text-base leading-none">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProdukPage() {
  const [activeTab, setActiveTab] = useState<Tab>("bisnis");

  const TAB_ACTIVE: Record<Tab, string> = {
    bisnis:     "bg-indigo-600 text-white shadow-md",
    modul:      "bg-violet-600 text-white shadow-md",
    chatbot:    "bg-blue-600 text-white shadow-md",
    whitelabel: "bg-amber-600 text-white shadow-md",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <SharedHeader/>

      {/* Hero */}
      <section className="pt-16 pb-10 px-4 text-center bg-gradient-to-b from-indigo-50/60 to-white dark:from-indigo-950/20 dark:to-slate-950">
        <Badge className="mb-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs">
          Gustafta Builder
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          4 Cara Pakai Gustafta
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Pilih jalur yang sesuai kebutuhan Anda — bangun sendiri, minta dibuatkan,
          aktifkan yang sudah jadi, atau gunakan dengan merek Anda sendiri.
        </p>
      </section>

      {/* Tab navigation */}
      <section className="sticky top-0 z-10 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-gray-200 dark:border-slate-800 px-4 py-3">
        <div className="flex gap-2 max-w-3xl mx-auto overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id}`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? TAB_ACTIVE[tab.id]
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}>
              <tab.icon className="w-3.5 h-3.5"/>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4">
        {activeTab === "bisnis"     && <BisnisPaket/>}
        {activeTab === "modul"      && <ModulPaket/>}
        {activeTab === "chatbot"    && <ChatbotPaket/>}
        {activeTab === "whitelabel" && <WhitelabelPaket/>}

        <KomparasiTable/>
      </section>

      {/* CTA bottom */}
      <section className="py-12 px-4 bg-gradient-to-b from-white to-indigo-50/60 dark:from-slate-950 dark:to-indigo-950/20 text-center">
        <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">Masih bingung pilih yang mana?</div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Konsultasi gratis dengan tim Gustafta — kami bantu pilihkan paket terbaik untuk bisnis Anda.</p>
        <div className="flex gap-3 justify-center">
          <a href="https://wa.me/6281234567890?text=Halo%20Gustafta%2C%20saya%20ingin%20konsultasi%20paket" target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-600 hover:bg-green-500 text-white text-sm h-10 px-5">
              <Phone className="w-4 h-4 mr-2"/> Chat WhatsApp
            </Button>
          </a>
          <Link href="/pricing">
            <Button variant="outline" className="text-sm h-10 px-5 border-indigo-300 text-indigo-600 dark:border-indigo-700 dark:text-indigo-400">
              Lihat Pricing Lengkap <ArrowRight className="w-4 h-4 ml-2"/>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

