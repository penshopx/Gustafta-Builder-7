import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { SharedHeader } from "@/components/shared-header";
import {
  Rocket, ArrowRight, Check, BookOpen, Wrench, Zap, Lightbulb, TrendingUp,
  MessageCircle, ChevronRight, ShieldCheck, Store, Bot, FileText,
  GraduationCap, Smartphone, Users, Building2, Briefcase, User,
} from "lucide-react";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";
  const waUrl = "https://wa.me/6282299417818?text=Halo%2C%20saya%20ingin%20tahu%20lebih%20lanjut%20tentang%20Gustafta";

  return (
    <div className="min-h-screen bg-background" data-testid="page-landing">
      <SharedHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 py-20 md:py-28 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.3),transparent_60%)]" />

        <div className="max-w-4xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-6 backdrop-blur-sm">
            <Wrench className="h-3.5 w-3.5" />
            Platform untuk Para Perakit AI
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" data-testid="text-hero-title">
            Semua Orang Punya Pengetahuan.
            <br />
            <span className="text-yellow-300">Kini Saatnya Merakitnya Menjadi AI.</span>
          </h1>

          <p className="text-base md:text-lg text-blue-100 mb-2 font-semibold tracking-wide">
            Belajar · Merakit · Menggunakan · Menghasilkan · Berkembang
          </p>

          <p className="text-sm md:text-base text-blue-200 mb-8 leading-relaxed max-w-2xl mx-auto">
            Ubah pengetahuan, pengalaman, kompetensi, SOP, regulasi, maupun ide Anda menjadi{" "}
            <strong className="text-white">Teman Berpikir Digital</strong> yang mampu membantu pekerjaan, bisnis, organisasi, dan pelanggan — tanpa harus bisa coding.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link href="/persona">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold gap-2 px-6 h-12" data-testid="button-hero-starterkit">
                <BookOpen className="w-4 h-4" />
                Mulai dengan Starter Kit
              </Button>
            </Link>
            <Link href={builderUrl}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 gap-2 px-6 h-12" data-testid="button-hero-builder">
                <Wrench className="w-4 h-4" />
                Coba GUSTAFTA Builder
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-blue-200 justify-center">
            {["No-Code · Tanpa Coding", "30+ Sektor Industri", "1350+ Template Siap Pakai"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green-400" />{s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DUA DUNIA ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Dari Mana Pun Anda Berasal</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Anda Mungkin Berasal dari Dua Dunia yang Berbeda…
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Dunia 1 */}
            <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-7">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Anda sudah belajar AI…</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-5">
                {[
                  "Sudah mencoba ChatGPT",
                  "Sudah mengikuti kursus AI",
                  "Sudah mengenal AI Agent, Agentic AI, Multi-Agent, Prompt Engineering",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/70 dark:bg-white/5 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-1">Tetapi… Anda masih bertanya:</p>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  "Bagaimana cara membuat AI yang benar-benar bekerja?"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Bagaimana membangun AI Agent? Bagaimana mengubah semua pengetahuan itu menjadi produk nyata?</p>
              </div>
            </div>

            {/* Dunia 2 */}
            <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20 p-7">
              <div className="text-3xl mb-3">👷</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Anda sudah menjadi seorang profesional…</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-5">
                {[
                  "Anda memiliki pengalaman dan kompetensi",
                  "Anda memiliki SOP, regulasi, modul pelatihan",
                  "Anda memiliki metode kerja yang terbukti",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/70 dark:bg-white/5 border border-violet-200 dark:border-violet-700 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-1">Tetapi… Anda masih bertanya:</p>
                <p className="text-sm font-bold text-violet-700 dark:text-violet-300">
                  "Bagaimana cara mengubah semua pengalaman itu menjadi AI?"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Bagaimana AI membantu pekerjaan saya? Bagaimana AI menjadi aset bisnis saya?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRIDGE ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-violet-700 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">Apa Pun Titik Awal Anda…</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tujuan Kita Sama.<br />
            <span className="text-yellow-300">Menjadi Perakit AI.</span>
          </h2>
          <p className="text-blue-100 text-base leading-relaxed mb-6 max-w-2xl mx-auto">
            GUSTAFTA hadir untuk menjembatani keduanya. Bukan sekadar mengajari AI. Bukan sekadar membuat chatbot. Tetapi membantu Anda mengubah pengetahuan menjadi AI yang benar-benar bekerja.
          </p>
          <div className="inline-block bg-white/15 border border-white/30 rounded-2xl px-8 py-4">
            <div className="flex flex-wrap gap-4 justify-center text-sm font-bold">
              {["📚 Belajar", "🛠 Merakit", "⚡ Menggunakan", "💡 Menghasilkan", "🚀 Berkembang"].map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DARI PENGETAHUAN MENJADI AI ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Kekayaan Pengetahuan Anda</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Dari Pengetahuan Menjadi Aset AI
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Setiap orang memiliki sesuatu yang sangat berharga. Selama ini semua itu hanya tersimpan di kepala atau di folder komputer. Dengan GUSTAFTA, semuanya dapat dirakit menjadi AI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 items-start">
            {/* Input: Pengetahuan */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Pengetahuan yang Anda miliki</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Pengalaman kerja", "Kompetensi profesi", "Dokumen & SOP",
                  "Prosedur standar", "Regulasi & kebijakan", "Modul pelatihan",
                  "Metode kerja", "Ide & inovasi",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-muted/30 rounded-lg px-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Output: AI */}
            <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-6">
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">AI yang mampu bekerja untuk Anda</p>
              <div className="space-y-2">
                {[
                  { icon: "💬", text: "Menjawab pertanyaan" },
                  { icon: "🤝", text: "Membantu pekerjaan" },
                  { icon: "📄", text: "Menghasilkan dokumen" },
                  { icon: "👤", text: "Menjadi asisten digital" },
                  { icon: "🎓", text: "Membimbing pelanggan & peserta" },
                  { icon: "📦", text: "Menjadi produk digital" },
                  { icon: "💰", text: "Menciptakan nilai bagi bisnis" },
                  { icon: "👥", text: "Mendukung tim" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="h-4 w-4 text-blue-500 shrink-0" />
                    <span>{item.icon} {item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5-STAGE JOURNEY ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Perjalanan Menjadi Perakit AI</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Satu Platform. Lima Perjalanan.
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Semuanya berada dalam satu ekosistem GUSTAFTA.</p>
          </div>

          <div className="space-y-5">
            {[
              {
                emoji: "📚", num: "01", label: "BELAJAR",
                color: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20",
                badge: "bg-blue-600",
                title: "Mulailah dari Starter Kit GUSTAFTA",
                desc: "Pelajari cara berpikir sebagai Perakit AI. Bukan sekadar teori — tetapi langkah demi langkah membangun AI yang benar. Starter Kit berisi panduan praktis, blueprint, contoh implementasi, prompt, framework, hingga akses menuju workshop dan academy.",
                items: ["Trilogi GUSTAFTA (Panduan + Playbook + Prompt)", "GUSTAFTA Framework™", "Panduan Onboarding step-by-step", "Akses Komunitas Perakit AI", "Akses Builder 7 hari"],
                cta: "Ambil Starter Kit", href: "/persona",
              },
              {
                emoji: "🛠", num: "02", label: "MERAKIT",
                color: "border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20",
                badge: "bg-violet-600",
                title: "Bangun AI Anda Sendiri di GUSTAFTA Builder",
                desc: "Dengan GUSTAFTA Builder Anda dapat merakit AI Assistant, Chatbot AI, AI Agent, Multi-Agent, Knowledge Base, Mini Apps, Workflow AI, dan OpenClaw Configuration — semuanya secara visual tanpa coding. Teknologi AI terbaru sudah tersedia.",
                items: ["AI Assistant & Chatbot AI", "AI Agent & Multi-Agent", "Knowledge Base & Mini Apps", "Workflow AI & OpenClaw", "Tanpa coding · Semua via form"],
                cta: "Masuk ke Builder", href: builderUrl,
              },
              {
                emoji: "⚡", num: "03", label: "MENGGUNAKAN",
                color: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20",
                badge: "bg-emerald-600",
                title: "AI yang Anda Rakit Mulai Bekerja",
                desc: "Gunakan AI untuk membantu pelanggan, menyusun laporan, membuat proposal, menghasilkan dokumen, membuat SOP, menghitung RAB, membuat kontrak, menyusun materi pelatihan. Atau gunakan chatbot siap pakai dari GUSTAFTA Store.",
                items: ["Bantu pelanggan 24/7", "Generate dokumen & kontrak", "Hitung RAB & estimasi biaya", "Susun materi pelatihan", "Pendamping proses sertifikasi"],
                cta: "Lihat Chatbot Store", href: "/store",
              },
              {
                emoji: "💡", num: "04", label: "MENGHASILKAN NILAI",
                color: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20",
                badge: "bg-amber-600",
                title: "AI adalah Aset — Bukan Sekadar Alat",
                desc: "\"Nilai\" bukan hanya uang. Bisa berupa waktu, produktivitas, reputasi, kompetensi, atau penghasilan nyata. Jual hasil rakitan Anda melalui Creator Marketplace — atau gunakan AI untuk membuka layanan baru bagi klien.",
                items: ["Jual chatbot di Creator Marketplace", "Revenue sharing 80/20 untuk creator", "Layanan konsultasi berbasis AI", "Penghasilan dari kompetensi yang Anda miliki"],
                cta: "Lihat Program Affiliate & Creator", href: "/affiliate",
              },
              {
                emoji: "🚀", num: "05", label: "BERKEMBANG",
                color: "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20",
                badge: "bg-orange-600",
                title: "Dari Perakit AI — Menjadi Pelaku Bisnis AI.",
                desc: "Ini bukan lagi tentang memakai AI. Ini tentang membangun bisnis, organisasi, atau ekosistem berbasis AI. Dua jalur tersedia: naik level sebagai Perakit AI Profesional, atau bangun ekosistem AI untuk tim & perusahaan Anda.",
                items: ["Naik level: Pemula → Profesional → Creator → Enterprise", "Sertifikasi Perakit AI (Certified AI Assembler)", "Buka jasa konsultasi AI sendiri", "AI Studio — tim Gustafta rakitkan untuk Anda", "White Label & Kemitraan Bisnis AI", "Corporate Training & AI Organization"],
                evolution: null,
                cta: "Mulai Berkembang", href: "/packs",
              },
            ].map((stage) => (
              <div key={stage.num} className={`rounded-2xl border ${stage.color} p-6`}>
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="flex items-center gap-3 md:flex-col md:items-center md:w-20 shrink-0">
                    <div className={`w-10 h-10 rounded-xl ${stage.badge} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                      {stage.num}
                    </div>
                    <div className="text-2xl">{stage.emoji}</div>
                    <div className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white ${stage.badge}`}>
                      {stage.label}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{stage.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{stage.desc}</p>
                    {stage.items && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
                        {stage.items.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                            <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />{item}
                          </div>
                        ))}
                      </div>
                    )}
                    {stage.evolution && (
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {stage.evolution.map((ev, i) => (
                          <span key={ev} className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-white/10 border rounded-lg px-3 py-1">{ev}</span>
                            {i < stage.evolution.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link href={stage.href}>
                      <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5" data-testid={`btn-stage-${stage.label.toLowerCase()}`}>
                        {stage.cta} <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APA YANG INGIN DIRAKIT ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Apa yang Ingin Anda Rakit?</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Jika Anda Memiliki Pengetahuan…<br />
              Anda Dapat Merakitnya Menjadi AI.
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
            {[
              { icon: "👤", label: "Mentor AI" },
              { icon: "📚", label: "Tutor AI" },
              { icon: "🏢", label: "AI Perusahaan" },
              { icon: "⚖", label: "AI Regulasi" },
              { icon: "🏗", label: "AI Konstruksi" },
              { icon: "⚡", label: "AI Energi" },
              { icon: "⛏", label: "AI Pertambangan" },
              { icon: "🌱", label: "AI Lingkungan" },
              { icon: "📄", label: "AI Dokumen" },
              { icon: "🎓", label: "AI Sertifikasi" },
              { icon: "💼", label: "AI Konsultan" },
              { icon: "📊", label: "AI Bisnis" },
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-card border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 flex items-center gap-2.5 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border shadow-lg">
            <img
              src="/images/g07.png"
              alt="Contoh ekosistem digital yang dirakit di Gustafta Builder"
              className="w-full object-cover"
              loading="lazy"
              data-testid="img-output-showcase"
            />
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
            Contoh chatbot dan ekosistem AI yang sudah dirakit oleh pengguna Gustafta.
          </p>
        </div>
      </section>

      {/* ── PILIH CARA MEMULAI ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Pilih Cara Memulai</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Empat Jalur Masuk ke Ekosistem Gustafta
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                emoji: "📚", label: "Belajar Merakit AI",
                desc: "Mulailah dengan Starter Kit, Workshop, dan Academy. Belajar secara bertahap hingga siap menjadi Perakit AI.",
                cta: "Ambil Starter Kit", href: "/persona",
                color: "border-blue-200 dark:border-blue-800 hover:border-blue-400",
                badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
              },
              {
                emoji: "🛠", label: "Merakit AI Sendiri",
                desc: "Gunakan GUSTAFTA Builder untuk membangun AI sesuai bidang Anda. Semua via form, tanpa coding.",
                cta: "Buka Builder", href: builderUrl,
                color: "border-violet-200 dark:border-violet-800 hover:border-violet-400",
                badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
              },
              {
                emoji: "⚡", label: "Menggunakan AI",
                desc: "Pilih chatbot siap pakai dari GUSTAFTA Store. Langsung aktif, langsung bekerja.",
                cta: "Lihat Store", href: "/store",
                color: "border-emerald-200 dark:border-emerald-800 hover:border-emerald-400",
                badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
              },
              {
                emoji: "🤝", label: "Kami Rakitkan",
                desc: "Tidak punya waktu? Tim GUSTAFTA siap membantu merancang, membangun, dan mengimplementasikan AI sesuai kebutuhan Anda.",
                cta: "Konsultasi WA", href: waUrl, external: true,
                color: "border-amber-200 dark:border-amber-800 hover:border-amber-400",
                badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
              },
            ].map((jalur) => (
              <div key={jalur.label} className={`rounded-2xl border bg-gray-50 dark:bg-muted/20 ${jalur.color} p-5 flex flex-col gap-3 transition-colors`}
                data-testid={`card-jalur-${jalur.label.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="text-3xl">{jalur.emoji}</div>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${jalur.badge}`}>{jalur.label}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed flex-1">{jalur.desc}</p>
                {jalur.external ? (
                  <a href={jalur.href} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="w-full text-xs h-8 gap-1">
                      {jalur.cta} <ArrowRight className="w-3 h-3" />
                    </Button>
                  </a>
                ) : (
                  <Link href={jalur.href}>
                    <Button size="sm" variant="outline" className="w-full text-xs h-8 gap-1">
                      {jalur.cta} <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO PLATFORM ── */}
      <section className="py-16 px-4 bg-blue-50 dark:bg-blue-950/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Platform Bekerja</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Dari Pengetahuan Menjadi AI — Tanpa Coding
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Lihat bagaimana Gustafta Builder mengubah pengetahuan Anda menjadi ekosistem AI yang hidup dan bekerja 24/7.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border shadow-lg bg-black/5 dark:bg-white/5">
            <video
              src="/videos/gustafta-monolog-to-dialog.mp4"
              poster="/images/g05.png"
              className="w-full"
              controls
              playsInline
              preload="metadata"
              data-testid="video-platform"
            />
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
            Lihat bagaimana pengetahuan satu arah berubah menjadi dialog yang hidup.
          </p>

          <div className="mt-8 rounded-2xl overflow-hidden border shadow-lg bg-black/5 dark:bg-white/5">
            <video
              src="/videos/gustafta-business-opportunity.mp4"
              poster="/images/g06.png"
              className="w-full"
              controls
              playsInline
              preload="metadata"
              data-testid="video-business"
            />
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
            Peluang bisnis nyata: ubah keahlian Anda menjadi aset digital yang menghasilkan.
          </p>
        </div>
      </section>

      {/* ── CREATOR PERSONAS ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Untuk Siapa</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Siapa Pun yang Punya Pengetahuan — Bisa Menjadi Perakit AI
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { emoji: "🎓", label: "Instruktur & Trainer", desc: "Rakit modul pelatihan, panduan digital, dan chatbot pendamping untuk peserta Anda." },
              { emoji: "🏛️", label: "Asosiasi Profesi & Badan Usaha", desc: "Bangun ekosistem kompetensi anggota — dari sertifikasi hingga pembelajaran berkelanjutan." },
              { emoji: "📜", label: "Lembaga Sertifikasi (LSP)", desc: "Sediakan simulasi asesmen, bank soal, dan panduan kompetensi yang bisa diakses 24/7." },
              { emoji: "🏫", label: "Universitas & Lembaga Pendidikan", desc: "Digitalisasi materi dosen menjadi ekosistem belajar yang skalabel." },
              { emoji: "💼", label: "Konsultan Independen", desc: "Kemas keahlian Anda menjadi produk digital — chatbot konsultasi, document generator, mini apps." },
              { emoji: "👤", label: "Individu Profesional", desc: "Wariskan pengalaman 10–20 tahun menjadi AI Twin yang terus bekerja untuk Anda." },
            ].map((p) => (
              <div key={p.label} className="rounded-2xl border bg-gray-50 dark:bg-muted/20 p-5 flex flex-col gap-3"
                data-testid={`card-persona-${p.label.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{p.label}</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILOSOFI PENUTUP ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 to-slate-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-6">🧠</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            AI Tidak Menggantikan Keahlian Anda.
          </h2>
          <h3 className="text-xl md:text-2xl font-bold text-yellow-300 mb-6">
            AI Memperkuat Keahlian Anda.
          </h3>
          <p className="text-gray-300 leading-relaxed text-base mb-2">
            Karena yang paling berharga bukan teknologinya.
          </p>
          <p className="text-gray-300 leading-relaxed text-base mb-8">
            Tetapi <strong className="text-white">pengetahuan yang Anda miliki.</strong>
          </p>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            GUSTAFTA membantu Anda mengubahnya menjadi AI yang mampu bekerja untuk diri Anda, tim, organisasi, maupun pelanggan.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-violet-700 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">GUSTAFTA — Platform untuk Para Perakit AI</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ubah Pengetahuan Anda Menjadi<br />
            <span className="text-yellow-300">Aset AI yang Menciptakan Nilai.</span>
          </h2>
          <p className="text-blue-200 text-sm mb-8">
            Belajar · Merakit · Menggunakan · Menghasilkan · Berkembang
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/persona">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold gap-2 px-8 h-12" data-testid="btn-cta-final-starter">
                <BookOpen className="h-5 w-5" />
                Mulai dengan Starter Kit
              </Button>
            </Link>
            <Link href={builderUrl}>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2 px-8 h-12" data-testid="btn-cta-final-builder">
                <Wrench className="h-5 w-5" />
                Mulai Merakit AI Sekarang
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
              {
                q: "Apakah saya perlu kemampuan coding?",
                a: "Tidak sama sekali. Semua konfigurasi di Gustafta Builder dilakukan lewat form. Tidak ada satu baris kode pun yang perlu Anda tulis.",
              },
              {
                q: "Apa bedanya Gustafta dengan ChatGPT atau platform chatbot lain?",
                a: "Mereka menjual chatbot siap pakai. Gustafta menjual platform untuk merakit ekosistem AI dari pengetahuan Anda sendiri — chatbot, mini apps, e-course, document generator, dan multi-agent dalam satu sistem yang bisa dimonetisasi.",
              },
              {
                q: "Saya sudah profesional tapi tidak tahu AI — bisa pakai Gustafta?",
                a: "Justru inilah target utama Gustafta. Pengetahuan dan pengalaman Anda adalah modal utamanya. Starter Kit akan memandu Anda langkah demi langkah dari nol hingga memiliki AI pertama Anda.",
              },
              {
                q: "Apa yang saya miliki setelah merakit?",
                a: "Ekosistem digital penuh — Anda pemilik data, konten, dan monetisasinya. Gustafta tidak mengunci ekosistem Anda. Bisa digunakan untuk diri sendiri, tim, atau dijual ke orang lain.",
              },
              {
                q: "Bisakah saya menghasilkan uang dari Gustafta?",
                a: "Bisa. Lewat Creator Marketplace dengan revenue sharing 80/20, atau langsung ke klien Anda sendiri lewat layanan yang Anda atur. Pengetahuan Anda adalah aset — Gustafta membantu mengubahnya menjadi produk.",
              },
              {
                q: "Apakah Gustafta hanya untuk sektor konstruksi?",
                a: "Tidak. 30+ sektor industri sudah didukung — konstruksi, energi, HR, pendidikan, keuangan, hukum, dan lainnya. Konstruksi hanya yang paling dalam saat ini.",
              },
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
                Platform untuk Para Perakit AI
              </p>
              <p className="text-xs text-gray-400 mt-2 italic">Belajar · Merakit · Menggunakan · Menghasilkan · Berkembang</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Platform</p>
              <ul className="space-y-2">
                {[
                  { label: "Gustafta Builder", href: builderUrl },
                  { label: "MultiClaw Suite", href: "/ai-tools" },
                  { label: "Chatbot Store", href: "/store" },
                  { label: "Layanan Jasa", href: "/packs" },
                ].map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Perakit AI</p>
              <ul className="space-y-2">
                {[
                  { label: "Starter Kit", href: "/persona" },
                  { label: "Workshop", href: "/workshop" },
                  { label: "Panduan & Belajar", href: "/trilogi" },
                  { label: "Profil GAIA", href: "/profil" },
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
            <p className="text-xs text-gray-400">© 2026 Gustafta. Platform untuk Para Perakit AI.</p>
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
