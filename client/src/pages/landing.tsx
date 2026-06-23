import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { SharedHeader } from "@/components/shared-header";
import {
  Rocket, ArrowRight, Check, BookOpen, MessageSquare, Smartphone,
  FileText, GraduationCap, Bot, Users, Building2, Award, Briefcase,
  User, Code2, Settings, Heart, Layers, MessageCircle, ChevronRight,
  Zap, ShieldCheck, Store, Star,
} from "lucide-react";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";
  const waUrl = "https://wa.me/6282299417818?text=Halo%2C%20saya%20ingin%20tahu%20lebih%20lanjut%20tentang%20Gustafta%20Builder";

  return (
    <div className="min-h-screen bg-background" data-testid="page-landing">
      <SharedHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 py-20 md:py-28 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.3),transparent_60%)]" />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-6 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" />
                WordPress-nya Ekosistem Kompetensi
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight" data-testid="text-hero-title">
                Rakit Pengetahuan Anda Menjadi{" "}
                <span className="text-yellow-300">Ekosistem AI</span>{" "}
                yang Bekerja.
              </h1>

              <p className="text-base md:text-lg text-blue-100 mb-3 leading-relaxed">
                Tanpa Coding. Dalam 30 Menit.
              </p>

              <p className="text-sm md:text-base text-blue-200 mb-8 leading-relaxed max-w-lg">
                Platform no-code untuk instruktur, asosiasi, LSP, universitas, konsultan, dan individu yang ingin mengubah keahlian menjadi aset digital — ebook, chatbot AI, mini apps, e-course, dan document generator yang hidup 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link href={builderUrl}>
                  <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold gap-2 px-6 h-12" data-testid="button-hero-masuk">
                    <Rocket className="w-4 h-4" />
                    Masuk ke Dashboard Builder
                  </Button>
                </Link>
                <Link href={builderUrl}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 gap-2 px-6 h-12" data-testid="button-hero-trial">
                    Coba 7 Hari Gratis
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-blue-200">
                {["30+ Sektor Industri", "1350+ Template Siap Pakai", "No-Code First"].map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Dashboard mockup placeholder */}
            <div className="hidden md:block">
              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-1 shadow-2xl">
                <img
                  src="/images/g03.png"
                  alt="Gustafta Builder Dashboard"
                  className="w-full rounded-xl object-cover object-top"
                  style={{ maxHeight: "340px" }}
                />
              </div>
              <p className="text-center text-xs text-blue-300 mt-3">Dashboard Builder — konfigurasi ekosistem Anda</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILOSOFI ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Dari Monolog ke Dialog
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
            Selama ini pengetahuan Anda bekerja satu arah:<br />
            Anda menjelaskan → audiens mendengar → selesai.
          </p>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
            Gustafta mengubahnya menjadi dialog: pengetahuan Anda terus berbicara, menjawab, melayani, dan berkembang — bahkan saat Anda tidur.
          </p>
          <p className="text-base md:text-lg font-semibold text-blue-600 dark:text-blue-400">
            Bukan menggantikan Anda. Melipatgandakan kehadiran Anda.
          </p>
        </div>
      </section>

      {/* ── 6 OUTPUT ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Platform Gustafta Builder</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Satu Platform. Enam Produk Digital.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Isi form konfigurasi — platform yang menghasilkan.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: BookOpen, emoji: "📚", label: "Ebook Interaktif", desc: "Pengetahuan terstruktur, diakses kapan saja.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
              { icon: MessageSquare, emoji: "💬", label: "Chatbot AI Spesialis", desc: "Tersegmentasi per sektor, profesi, dan knowledge base.", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/20" },
              { icon: Smartphone, emoji: "📱", label: "Mini Apps", desc: "Kalkulator, checklist, simulator, asesmen — 45+ tipe.", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
              { icon: FileText, emoji: "📄", label: "Document Generator", desc: "Surat, kontrak, laporan, proposal — otomatis.", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/20" },
              { icon: GraduationCap, emoji: "🎓", label: "E-Course", desc: "Modul pembelajaran dengan progress tracking.", color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/20" },
              { icon: Bot, emoji: "🤖", label: "Agentic AI", desc: "Risk / Audit / Policy Agent bekerja paralel (multi-agent).", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
            ].map((item) => (
              <div key={item.label} className={`rounded-2xl ${item.bg} border border-white/60 dark:border-white/5 p-6 flex flex-col gap-3`} data-testid={`card-output-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="text-3xl">{item.emoji}</div>
                <h3 className={`text-sm font-bold ${item.color}`}>{item.label}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 italic">
            Setiap produk dirakit lewat form. Bukan ditulis kode.
          </p>
        </div>
      </section>

      {/* ── CREATOR PERSONAS ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Untuk Siapa</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Platform Ini Dirancang untuk Creator — Bukan End-User
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: GraduationCap, emoji: "🎓", label: "Instruktur & Trainer", desc: "Rakit modul pelatihan, ebook, dan chatbot pendamping untuk peserta Anda." },
              { icon: Building2, emoji: "🏛️", label: "Asosiasi Profesi & Badan Usaha", desc: "Bangun ekosistem kompetensi anggota — dari sertifikasi hingga pembelajaran berkelanjutan." },
              { icon: Award, emoji: "📜", label: "Lembaga Sertifikasi (LSP)", desc: "Sediakan simulasi asesmen, bank soal, dan panduan kompetensi yang bisa diakses peserta 24/7." },
              { icon: Users, emoji: "🏫", label: "Universitas & Lembaga Pendidikan", desc: "Digitalisasi materi dosen menjadi ekosistem belajar yang skalabel." },
              { icon: Briefcase, emoji: "💼", label: "Konsultan Independen", desc: "Kemas keahlian Anda menjadi produk digital — chatbot konsultasi, document generator, mini apps." },
              { icon: User, emoji: "👤", label: "Individu Profesional", desc: "Wariskan pengalaman 10–20 tahun menjadi AI Twin yang terus bekerja." },
            ].map((p) => (
              <div key={p.label} className="rounded-2xl border bg-gray-50 dark:bg-muted/20 p-5 flex flex-col gap-3" data-testid={`card-persona-${p.label.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{p.label}</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-8">
            Anda bukan pemakai. Anda adalah arsitek ekosistem.
          </p>
        </div>
      </section>

      {/* ── CARA KERJA ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Cara Kerja</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Dari Kosong Menjadi Ekosistem Hidup — 4 Langkah
            </h2>
          </div>

          {/* Step progress bar desktop */}
          <div className="hidden md:flex items-center justify-center gap-0 mb-10">
            {["01", "02", "03", "04"].map((n, i) => (
              <div key={n} className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {n}
                </div>
                {i < 3 && <div className="w-24 h-0.5 bg-blue-200 dark:bg-blue-800" />}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              { n: "1", title: "Isi Form Identitas Ekosistem", desc: "Nama, sektor, audiens, tujuan. Platform mengenali konteks Anda secara otomatis." },
              { n: "2", title: "Konfigurasi Knowledge Base", desc: "Upload PDF, paste URL, tautkan YouTube, atau rekam audio. AI mentranskripsi dan mengindeks otomatis." },
              { n: "3", title: "Atur Persona & Alur Dialog", desc: "Pilih nada bicara, tentukan batas jawaban, aktifkan specialist yang dibutuhkan." },
              { n: "4", title: "Deploy ke Multi-Channel", desc: "Satu ekosistem → WhatsApp, Telegram, web widget, API. Live dalam hitungan menit." },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-4 bg-white dark:bg-card rounded-2xl border p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step.n}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 italic">
            Rata-rata creator aktif pertama dalam &lt; 30 menit.
          </p>
        </div>
      </section>

      {/* ── 5 PRINSIP ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Identitas Platform</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Setiap Keputusan di Gustafta Lolos 5 Prinsip Ini
            </h2>
          </div>

          <div className="grid sm:grid-cols-5 gap-4 mb-8">
            {[
              { n: "1", label: "No-Code First", icon: Code2, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
              { n: "2", label: "Form-Based Config", icon: Settings, color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
              { n: "3", label: "Creator Empowerment", icon: Heart, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
              { n: "4", label: "Ecosystem Thinking", icon: Layers, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
              { n: "5", label: "Philosophy Alignment", icon: MessageCircle, color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
            ].map((p) => (
              <div key={p.n} className={`rounded-2xl ${p.color} p-4 flex flex-col items-center text-center gap-2`}>
                <p.icon className="h-6 w-6" />
                <div className="text-[10px] font-bold uppercase tracking-wide leading-tight">{p.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {[
              { n: "1", title: "No-Code First", desc: "Tidak ada kode. Tidak ada developer. Tidak ada alasan untuk menunda." },
              { n: "2", title: "Form-Based Configuration", desc: "Semua pengaturan lewat form. Terstruktur, aman, dan bisa diulang kapan saja." },
              { n: "3", title: "Creator Empowerment", desc: "Platform memberdayakan creator — bukan mengunci mereka. Anda pemilik penuh ekosistem Anda." },
              { n: "4", title: "Ecosystem Thinking", desc: "Setiap produk yang dirakit bisa saling terhubung, membentuk ekosistem yang utuh dan skalabel." },
              { n: "5", title: "Philosophy Alignment: Dari Monolog ke Dialog", desc: "Setiap fitur harus memperkuat prinsip ini. Bukan menggantikan Anda — melipatgandakan kehadiran Anda." },
            ].map((p) => (
              <div key={p.n} className="flex items-start gap-4 rounded-xl border bg-gray-50 dark:bg-muted/20 p-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{p.n}</div>
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{p.title} — </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{p.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POWER USER: DIKLATKERJA ── */}
      <section className="py-16 px-4 bg-blue-50 dark:bg-blue-950/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800">
                Power User Pertama
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                DiklatKerja
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                DiklatKerja bukan mitra. Mereka adalah power user yang merakit Program Pengembangan Kompetensi (PKB) mereka sendiri di atas platform Gustafta.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  "Chatbot konsultan SMAP implementation",
                  "Executive Summary generator otomatis",
                  "Multi-agent: Risk / Audit / Policy Agent",
                  "Persona-based consulting 24/7",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-6 p-4 rounded-xl bg-white/70 dark:bg-white/5 border border-blue-200 dark:border-blue-800 italic">
                "Satu tim kecil DiklatKerja mampu melayani ratusan peserta PKB secara personal — 24/7."
              </p>

              <Link href={builderUrl}>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2" data-testid="btn-power-user-cta">
                  Jadi Power User Berikutnya <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-card p-6 shadow-lg">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">DiklatKerja</div>
                  <div className="text-xs text-gray-500">Program PKB berbasis AI</div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Peserta dilayani", value: "200+", icon: "👥" },
                    { label: "Chatbot aktif", value: "12", icon: "🤖" },
                    { label: "Dokumen digenerate", value: "500+", icon: "📄" },
                    { label: "Jam respons", value: "24/7", icon: "⏱️" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-muted/20">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">{m.icon} {m.label}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{m.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-4">Ini bukan simulasi. Platform bekerja.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Pricing</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Pilih Tier Sesuai Skala Ekosistem Anda
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tanpa biaya setup. Cancel kapan saja.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                emoji: "🆓", tier: "Explorer", price: "Gratis", period: "",
                desc: "Mencoba & belajar merakit",
                features: ["1 ekosistem", "Akses fitur dasar Builder", "Community support"],
                cta: "Mulai Gratis", ctaVariant: "outline" as const, highlight: false,
              },
              {
                emoji: "🛠️", tier: "Starter", price: "Rp 445 rb", period: "/bulan",
                desc: "Konsultan & instruktur independen",
                features: ["5 ekosistem", "Semua 6 output digital", "Custom domain", "Email support"],
                cta: "Pilih Plan", ctaVariant: "outline" as const, highlight: false,
              },
              {
                emoji: "⭐", tier: "Profesional", price: "Rp 699 rb", period: "/bulan",
                desc: "Asosiasi, LSP, perusahaan training",
                features: ["25 ekosistem", "Agentic AI & Multi-Agent", "Template Marketplace", "Priority support"],
                cta: "Pilih Plan", ctaVariant: "default" as const, highlight: true,
              },
              {
                emoji: "🏢", tier: "Enterprise", price: "Custom", period: "",
                desc: "Universitas, korporasi, pemerintah",
                features: ["Unlimited ekosistem", "White-label", "API access", "Dedicated success manager"],
                cta: "Hubungi Kami", ctaVariant: "outline" as const, highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.tier}
                className={`relative rounded-2xl border p-5 flex flex-col gap-4 ${plan.highlight ? "border-blue-500 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20" : "border-gray-200 dark:border-gray-700"}`}
                data-testid={`card-pricing-${plan.tier.toLowerCase()}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">TERPOPULER</span>
                  </div>
                )}
                <div>
                  <div className="text-2xl mb-2">{plan.emoji}</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{plan.tier}</div>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{plan.price}</span>
                    {plan.period && <span className="text-xs text-gray-500">{plan.period}</span>}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{plan.desc}</div>
                </div>

                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <Check className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.tier === "Enterprise" ? "#" : builderUrl}>
                  <Button
                    variant={plan.ctaVariant}
                    className={`w-full text-xs h-9 ${plan.highlight ? "bg-blue-600 hover:bg-blue-500 text-white" : ""}`}
                    onClick={plan.tier === "Enterprise" ? () => window.open(waUrl, "_blank") : undefined}
                    data-testid={`btn-pricing-${plan.tier.toLowerCase()}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/packs">
              <Button variant="ghost" className="gap-1 text-sm text-blue-600 dark:text-blue-400" data-testid="btn-lihat-perbandingan">
                Lihat Perbandingan Lengkap <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TEMPLATE MARKETPLACE ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Visual kiri */}
            <div className="rounded-2xl border bg-white dark:bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Store className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">Gustafta Store</span>
                <Badge className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Revenue 80/20</Badge>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Paket PKB Lengkap", price: "Rp 299.000", sold: "48 terjual" },
                  { name: "Chatbot Sertifikasi Profesi", price: "Rp 199.000", sold: "32 terjual" },
                  { name: "Modul K3 & SMK3", price: "Rp 149.000", sold: "27 terjual" },
                  { name: "Asesmen Kompetensi", price: "Rp 249.000", sold: "19 terjual" },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-muted/20 border">
                    <span className="text-gray-700 dark:text-gray-300">{t.name}</span>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{t.price}</div>
                      <div className="text-gray-400">{t.sold}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text kanan */}
            <div>
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800">
                Template Marketplace
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Jual Template yang Anda Rakit — Revenue Sharing 80/20
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Setiap ekosistem yang Anda rakit bisa dikemas jadi template dan dijual ke creator lain di Gustafta Store.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  "Anda terima 80% dari setiap penjualan",
                  "Gustafta kelola pembayaran, distribusi, update",
                  "Passive income dari keahlian yang sudah Anda kemas",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/store">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2" data-testid="btn-jadi-template-creator">
                  Jadi Template Creator <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-violet-700 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-4">🔑</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ekosistem Kompetensi Anda<br />Menunggu untuk Dirakit.
          </h2>
          <p className="text-blue-200 text-sm mb-2">
            Login sekarang — langsung masuk ke Dashboard Builder.
          </p>
          <p className="text-blue-200 text-sm mb-8">
            Tidak ada halaman perantara. Anda mulai merakit detik itu juga.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={builderUrl}>
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold gap-2 px-8 h-12" data-testid="btn-cta-final-masuk">
                <Rocket className="h-5 w-5" />
                Masuk ke Dashboard Builder
              </Button>
            </Link>
            <Link href={builderUrl}>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2 px-8 h-12" data-testid="btn-cta-final-trial">
                Coba Gratis 7 Hari — Tanpa Kartu Kredit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Pertanyaan yang Sering Muncul</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {[
              { q: "Apakah saya perlu kemampuan coding?", a: "Tidak sama sekali. Semua konfigurasi di Gustafta Builder dilakukan lewat form. Tidak ada satu baris kode pun yang perlu Anda tulis." },
              { q: "Apa yang saya miliki setelah merakit?", a: "Ekosistem digital penuh — Anda pemilik data, konten, dan monetisasinya. Gustafta tidak mengunci ekosistem Anda." },
              { q: "Bisakah saya menjual hasil rakitan ke klien?", a: "Bisa. Lewat Template Marketplace dengan revenue sharing 80/20, atau langsung ke klien Anda sendiri lewat layanan yang Anda atur." },
              { q: "Apakah Gustafta hanya untuk sektor konstruksi?", a: "Tidak. 30+ sektor industri sudah didukung — konstruksi, energi, HR, pendidikan, keuangan, dan lainnya. Konstruksi hanya yang paling dalam saat ini." },
              { q: "Apa bedanya dengan ChatGPT atau platform chatbot lain?", a: "Mereka menjual chatbot. Gustafta menjual platform untuk merakit ekosistem kompetensi Anda sendiri — ebook, chatbot, mini apps, e-course, dan document generator dalam satu sistem yang bisa dimonetisasi." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-4">
                <AccordionTrigger className="text-sm font-semibold text-gray-900 dark:text-white text-left hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t bg-gray-50 dark:bg-muted/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-gray-900 dark:text-white">GUSTAFTA</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                WordPress-nya Ekosistem Kompetensi
              </p>
              <p className="text-xs text-gray-400 mt-2 italic">Dari Monolog ke Dialog.</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Platform</p>
              <ul className="space-y-2">
                {[
                  { label: "Gustafta Builder", href: builderUrl },
                  { label: "MultiClaw Suite", href: "/ai-tools" },
                  { label: "Template Store", href: "/store" },
                  { label: "Pricing", href: "/packs" },
                ].map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Creator</p>
              <ul className="space-y-2">
                {[
                  { label: "Store Creator", href: "/store" },
                  { label: "Workshop", href: "/workshop" },
                  { label: "Panduan & Belajar", href: "/trilogi" },
                  { label: "Profil GAIA", href: "/gaia" },
                ].map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Kontak</p>
              <ul className="space-y-2">
                <li className="text-xs text-gray-500 dark:text-gray-400">📞 0812-8794-1900</li>
                <li>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> WhatsApp Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-400">© 2026 Gustafta. Dari Monolog ke Dialog.</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <ShieldCheck className="h-3 w-3" />
              Pembayaran aman via Scalev.id
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
