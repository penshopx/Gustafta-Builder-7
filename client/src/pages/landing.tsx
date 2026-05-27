import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useGustaftaAssistant } from "@/hooks/use-agents";
import { trackLead, trackViewContent, trackContact, trackInitiateCheckout, trackCustomEvent } from "@/hooks/use-meta-pixel";
import { ChatPopup } from "@/components/chat-popup";
import { SharedHeader } from "@/components/shared-header";
import {
  Bot, Sparkles, Globe, Shield, BookOpen, ArrowRight, Check,
  Zap, Rocket, Brain, Plug, GraduationCap, Briefcase, Store,
  Flame, Package, CheckCircle2, Star, ChevronRight,
  CreditCard, Smartphone, Lock, RefreshCw, HeartHandshake, Award
} from "lucide-react";

export default function Landing() {
  const { user, isAuthenticated } = useAuth();
  const { data: gustaftaAssistant } = useGustaftaAssistant();
  const [activePersona, setActivePersona] = useState<"belajar" | "bekerja" | "berusaha">("belajar");
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
      bullets: ["Simulasi ujian SKK & UTBK", "Tutor konstruksi & teknik sipil", "BIMTEK & onboarding karyawan"],
    },
    bekerja: {
      icon: Briefcase,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      label: "Bekerja",
      tagline: "Asisten Profesional & Tender LPSE",
      desc: "Analisis tender LPSE otomatis, drafter dokumen teknis, notulis rapat, dan konsultan K3 yang siap kerja kapan saja dari mana saja.",
      bullets: ["Asisten Tender LPSE + checklist 30 item", "Draft kontrak, SPK, SMKK, laporan", "AI Konsultan K3 & regulasi PUPR"],
    },
    berusaha: {
      icon: Store,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      label: "Berusaha",
      tagline: "CS Otomatis & Lead Generation",
      desc: "Jawab 80%+ pertanyaan pelanggan otomatis, tangkap leads 24/7, kirim broadcast WhatsApp, dan tingkatkan konversi tanpa tambah tim.",
      bullets: ["Customer Service WhatsApp otomatis", "Lead gen & follow-up tanpa manual", "Konten & copywriting AI"],
    },
  };

  const features = [
    { icon: Brain, title: "Otak Proyek", desc: "Pusatkan semua data bisnis. AI jawab berdasarkan konteks nyata bisnis Anda.", color: "text-amber-500", bg: "bg-amber-500/10" },
    { icon: Globe, title: "Custom Domain", desc: "Pasang bot.perusahaan.com ke chatbot Anda. Setup CNAME dalam 5 menit.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: BookOpen, title: "Knowledge Base 7 Tipe", desc: "Upload PDF, URL, YouTube, video, audio — AI transkripsi & RAG otomatis.", color: "text-violet-500", bg: "bg-violet-500/10" },
    { icon: Plug, title: "Multi-Channel", desc: "WhatsApp, Telegram, web widget, REST API — satu chatbot, semua channel.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Zap, title: "Agentic AI + Orchestrator", desc: "Routing otomatis ke specialist domain: Tender, K3, SKK, Hukum, Marketing.", color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: Shield, title: "Aman & Privat", desc: "Token akses per chatbot, mode publik/privat, enkripsi data, OAuth Replit.", color: "text-slate-500", bg: "bg-slate-500/10" },
  ];

  const steps = [
    { n: "1", title: "Buat Hierarki Chatbot", desc: "Buat Series, Modul, dan Chatbot sesuai kebutuhan — dalam 10 menit.", time: "±10 mnt" },
    { n: "2", title: "Isi Knowledge Base", desc: "Upload PDF, URL, YouTube, atau audio. AI transkripsi otomatis di background.", time: "±10–15 mnt" },
    { n: "3", title: "Konfigurasi & Deploy", desc: "Atur persona, pasang custom domain, lalu hubungkan ke WhatsApp atau web.", time: "±5–7 mnt" },
    { n: "4", title: "Mulai Layani Pengguna", desc: "Chatbot aktif 24/7. Monitor performa via analytics dashboard real-time.", time: "±3–5 mnt" },
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Direktur Teknik, PT Bangun Nusa Konstruksi",
      avatar: "BS",
      text: "Tender LPSE Assistant menghemat 2–3 hari kerja per tender. Checklist 30+ item langsung muncul, gap analysis akurat, draft dokumen tinggal edit.",
      tag: "Kontraktor",
    },
    {
      name: "Retno Ayu",
      role: "Kepala Divisi Sertifikasi, LSP Konstruksi Nasional",
      avatar: "RA",
      text: "Simulasi asesmen SKKNI via AI sangat membantu peserta kami. Peserta yang latihan pakai Gustafta lulus lebih konsisten.",
      tag: "Sertifikasi LSP",
    },
    {
      name: "Agus Prasetyo",
      role: "Direktur Utama, PT Graha Mandiri Consultant",
      avatar: "AP",
      text: "SCORECARD Win Probability membantu kami memutuskan tender mana yang layak diikuti. Win rate naik 40% dalam 3 bulan.",
      tag: "Konsultan MK",
    },
  ];

  const faqs = [
    { q: "Apakah perlu keahlian coding?", a: "Tidak sama sekali. Semua konfigurasi dilakukan lewat antarmuka visual — Knowledge Base, persona AI, Custom Domain, Tender Wizard — tanpa menulis satu baris kode pun." },
    { q: "Channel apa saja yang didukung?", a: "WhatsApp (Fonnte/Cloud API), Telegram, Web Widget (iframe & floating), Custom Domain, dan REST API. Semua bisa dihubungkan dari satu dashboard." },
    { q: "Berapa lama setup-nya?", a: "Rata-rata kurang dari 30 menit dari daftar sampai chatbot aktif. Untuk chatbot sederhana (FAQ/CS), bahkan bisa 10–15 menit." },
    { q: "Apa itu 971+ agent AI spesialis?", a: "Gustafta memiliki ratusan agent AI yang sudah dikonfigurasi untuk domain spesifik — regulasi konstruksi, tender LPSE, K3, SKK/SBU, dan banyak lagi. Tinggal pakai, tidak perlu build dari nol." },
    { q: "Bagaimana keamanan data saya?", a: "Data terenkripsi, akses berbasis token per chatbot, mode publik/privat, dan OAuth via Replit Identity. Anda punya kontrol penuh atas siapa yang bisa mengakses chatbot Anda." },
    { q: "Bisa untuk sektor apa saja?", a: "Gustafta paling dalam untuk Jasa Konstruksi Indonesia — 971+ agent dalam 131 hub siap pakai. Platform juga fleksibel untuk 12 sektor lain: properti, energi, pendidikan, marketing, HR, dan lainnya." },
  ];

  const p = personas[activePersona];
  const PersonaIcon = p.icon;

  return (
    <div className="min-h-screen bg-background" data-testid="page-landing">
      <SharedHeader />

      {/* Promo Banner */}
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
              Beli Sekarang Rp 999rb/bln →
            </button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Platform AI Chatbot Builder #1 untuk Konstruksi Indonesia
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight" data-testid="text-hero-title">
            Chatbot AI Cerdas untuk<br />
            <span className="text-primary">Bisnis &amp; Profesional</span>
            <span className="text-muted-foreground"> Indonesia</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Bangun chatbot AI dalam <strong className="text-foreground">30 menit tanpa coding</strong>. Dari Customer Service otomatis, Asisten Tender LPSE, AI Tutor, hingga Knowledge Base tim — satu platform untuk semua kebutuhan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href={isAuthenticated ? "/dashboard" : "/auth"} onClick={handleStartNowClick}>
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

          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5" data-testid="text-hero-trust">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Mulai dari Rp 199.000/bulan · Tanpa kartu kredit · Setup &lt; 30 menit
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="border-y bg-muted/30 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "971+", label: "Agent AI Spesialis" },
            { value: "131", label: "Hub Orchestrator" },
            { value: "45", label: "Tipe Mini App" },
            { value: "24/7", label: "Selalu Aktif" },
          ].map((s) => (
            <div key={s.label} data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="text-3xl font-extrabold text-primary mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Untuk Siapa */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Untuk Siapa?</p>
            <h2 className="text-2xl md:text-3xl font-bold">Satu Platform, Banyak Kegunaan</h2>
          </div>

          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {(["belajar", "bekerja", "berusaha"] as const).map((key) => {
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
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-background border ${p.border} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <PersonaIcon className={`w-6 h-6 ${p.color}`} />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wide ${p.color} mb-1`}>{p.label}</p>
                <h3 className="text-lg font-bold mb-1">{p.tagline}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              {p.bullets.map((b) => (
                <div key={b} className="flex items-center gap-2 bg-background/70 rounded-lg px-3 py-2 text-xs font-medium flex-1 border border-border/50">
                  <Check className={`w-4 h-4 flex-shrink-0 ${p.color}`} />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Fitur Utama</p>
            <h2 className="text-2xl md:text-3xl font-bold">Semua yang Anda Butuhkan</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
              Platform lengkap dari Knowledge Base, multi-channel, AI orchestrator, hingga custom domain.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f) => {
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

      {/* Cara Kerja */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Cara Kerja</p>
            <h2 className="text-2xl md:text-3xl font-bold">Siap dalam 30 Menit</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-5 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent -translate-x-4 z-0" />
                )}
                <div className="relative bg-background rounded-xl border p-5 text-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-base font-bold mx-auto mb-3">
                    {s.n}
                  </div>
                  <div className="text-[10px] font-semibold text-muted-foreground mb-1">{s.time}</div>
                  <h3 className="font-bold text-sm mb-1.5">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Testimoni</p>
            <h2 className="text-2xl md:text-3xl font-bold">Dipercaya Ratusan Profesional</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border bg-muted/30 p-5" data-testid={`card-testimonial-${t.avatar.toLowerCase()}`}>
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
                  <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-violet-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Flame className="w-3.5 h-3.5" /> Promo aktif — harga naik 2× per 1 Juli 2026
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-3">Mulai dari Rp 199.000/bulan</h2>
          <p className="text-white/75 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Semua paket sudah termasuk Agentic AI, Orchestrator Multi-Agent, Knowledge Base 7 tipe, dan Multi-Channel. Tanpa biaya setup tambahan.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
            {[
              { plan: "Starter", price: "199rb", badge: null, features: ["3 chatbot", "Knowledge Base 7 tipe", "Multi-Channel", "API akses"] },
              { plan: "Profesional", price: "499rb", badge: "TERPOPULER", features: ["20 chatbot", "Custom Domain", "Analytics lengkap", "Agentic AI"] },
              { plan: "Bisnis", price: "999rb", badge: null, features: ["Unlimited chatbot", "971+ agent spesialis", "Priority support", "Semua fitur"] },
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
            <Link href={isAuthenticated ? "/dashboard" : "/auth"} onClick={handleStartNowClick}>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold gap-2 px-8" data-testid="button-pricing-cta-start">
                <Rocket className="w-4 h-4" /> Mulai Sekarang
              </Button>
            </Link>
            <Link href="/packs" onClick={handlePricingClick}>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white font-semibold px-8" data-testid="button-pricing-cta-plans">
                Lihat Semua Paket →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-bold">Pertanyaan Umum</h2>
          </div>

          <Accordion type="single" collapsible defaultValue="item-0" className="space-y-2">
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border rounded-xl px-4 overflow-hidden"
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

      {/* Footer */}
      <footer className="bg-muted/30 border-t py-10 px-4">
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
                Platform AI Chatbot Builder terdalam untuk Jasa Konstruksi Indonesia. 971+ agent spesialis, 131 hub orchestrator, siap pakai.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="w-4 h-4" /> Hubungi Kami:
                </div>
                <a
                  href="https://wa.me/6281287941900"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
                  data-testid="link-footer-wa-1"
                  onClick={() => handleWAClick("Footer")}
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  081287941900
                </a>
                <a
                  href="https://wa.me/6282299417818"
                  target="_blank"
                  rel="noopener noreferrer"
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
                <li><Link href="/gustafta-store" className="hover:text-foreground transition-colors">Template Store</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground transition-colors">Dokumentasi</Link></li>
                <li><Link href="/legal" className="hover:text-foreground transition-colors">LexCom Legal AI</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-sm mb-3">Produk</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/tendera-claw" className="hover:text-foreground transition-colors">TenderaClaw</Link></li>
                <li><Link href="/sbu-claw" className="hover:text-foreground transition-colors">SBUClaw</Link></li>
                <li><Link href="/konstra-claw" className="hover:text-foreground transition-colors">KonstraClaw</Link></li>
                <li><Link href="/brain-claw" className="hover:text-foreground transition-colors">BrainClaw</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">© 2026 Gustafta. All rights reserved.</p>
              <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground bg-muted/40">
                <CreditCard className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                <span className="font-semibold text-foreground/80">Scalev.id</span>
                <span className="text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded font-medium">Aman</span>
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
