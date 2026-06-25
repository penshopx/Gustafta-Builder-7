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
  Zap, ShieldCheck, Store, Star, Sparkles,
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
                Platform no-code untuk instruktur, asosiasi, LSP, universitas, konsultan, dan individu yang ingin mengubah keahlian menjadi aset digital — panduan digital, chatbot AI, mini apps, e-course, dan document generator yang hidup 24/7.
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

          <div className="mt-10 rounded-2xl overflow-hidden border shadow-lg bg-black/5 dark:bg-white/5">
            <video
              src="/videos/gustafta-monolog-to-dialog.mp4"
              poster="/images/g05.png"
              className="w-full"
              controls
              playsInline
              preload="metadata"
              data-testid="video-monolog-dialog"
            />
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
            Lihat bagaimana pengetahuan satu arah berubah menjadi dialog yang hidup.
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
              { icon: BookOpen, emoji: "📚", label: "Panduan Digital", desc: "Pengetahuan terstruktur, diakses kapan saja.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
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

          <div className="mt-10 rounded-2xl overflow-hidden border border-white/60 dark:border-white/5 shadow-lg">
            <img
              src="/images/g07.png"
              alt="Contoh ekosistem digital yang dirakit di Gustafta Builder"
              className="w-full object-cover"
              loading="lazy"
              data-testid="img-output-showcase"
            />
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
              { icon: GraduationCap, emoji: "🎓", label: "Instruktur & Trainer", desc: "Rakit modul pelatihan, panduan digital, dan chatbot pendamping untuk peserta Anda." },
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

          <div className="mt-10 rounded-2xl overflow-hidden border shadow-lg bg-black/5 dark:bg-white/5">
            <video
              src="/videos/gustafta-business-opportunity.mp4"
              poster="/images/g06.png"
              className="w-full"
              controls
              playsInline
              preload="metadata"
              data-testid="video-business-opportunity"
            />
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
            Peluang bisnis nyata: ubah keahlian Anda menjadi aset digital yang menghasilkan.
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

      {/* ── PLATFORM BEKERJA ── */}
      <section className="py-16 px-4 bg-blue-50 dark:bg-blue-950/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800">
                Platform Bekerja
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Satu Tim Kecil Dapat Melayani Ratusan Peserta Secara Personal.
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Sebuah training provider atau lembaga diklat dapat merakit ekosistem kompetensi mereka sendiri di atas platform Gustafta — tanpa tim IT, tanpa coding, dalam hitungan hari.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  "Chatbot konsultan implementasi — menjawab 24/7",
                  "Executive Summary generator otomatis dari data peserta",
                  "Multi-agent: Risk / Audit / Policy Agent bekerja paralel",
                  "Persona berbeda untuk setiap segmen peserta",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 p-4 rounded-xl bg-white/70 dark:bg-white/5 border border-blue-200 dark:border-blue-800 italic">
                Ini bukan pilot project. Ini ekosistem yang berjalan setiap hari — melayani peserta secara personal tanpa menambah headcount.
              </p>

              <Link href={builderUrl}>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2" data-testid="btn-power-user-cta">
                  Rakit Ekosistem Anda Sekarang <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-card p-6 shadow-lg">
                <div className="text-center mb-5">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Yang Dapat Dirakit</div>
                  <div className="text-xs text-gray-500">oleh satu training provider atau lembaga diklat</div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Peserta dapat dilayani", value: "Ratusan", icon: "👥" },
                    { label: "Chatbot spesialis", value: "Banyak", icon: "🤖" },
                    { label: "Dokumen digenerate", value: "Otomatis", icon: "📄" },
                    { label: "Jam operasional", value: "24/7", icon: "⏱️" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-muted/20">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">{m.icon} {m.label}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{m.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-4">Tanpa tambah tim. Tanpa coding.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIALOG GUSTAFTA ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-[#0a1628] dark:via-[#0d1f3c] dark:to-[#0a1628]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-700 dark:bg-cyan-500/20 dark:border-cyan-500/30 dark:text-cyan-300 text-xs font-semibold mb-5">
                <Sparkles className="h-3.5 w-3.5" />
                Teman Berpikir AI
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                Belum Tahu Mau Rakit Apa?<br />
                <span className="text-cyan-600 dark:text-cyan-300">Dialog Gustafta Bantu Gali Idenya.</span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed mb-6">
                Ceritakan profesi, keahlian, atau tantangan Anda — Dialog Gustafta menggali potensi tersembunyi dan merancang blueprint ekosistem AI yang tepat, khusus untuk Anda.
              </p>
              <div className="space-y-3 mb-7">
                {[
                  { step: "1", text: "Cerita bebas soal pekerjaan atau tantangan Anda" },
                  { step: "G1", text: "Checkpoint pertama: AI tunjukkan Profil Awal Anda" },
                  { step: "2", text: "Dialog lebih dalam — gali ide konkret" },
                  { step: "G2", text: "Blueprint ekosistem AI siap — personalisasi untuk Anda" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${s.step.startsWith("G") ? "bg-emerald-500 text-white" : "bg-cyan-500 text-white"}`}>
                      {s.step}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-white/80">{s.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dialog-gustafta">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white gap-2 font-bold px-6 h-11" data-testid="button-cta-dialog">
                    <Sparkles className="w-4 h-4" />
                    Coba Dialog Gustafta
                  </Button>
                </Link>
                <p className="text-xs text-gray-400 dark:text-white/40 self-center">Gratis · Tanpa daftar · Dapat di-share</p>
              </div>
            </div>

            {/* Right: Visual mockup */}
            <div className="relative">
              <div className="rounded-2xl border border-cyan-200 dark:border-cyan-500/20 bg-white dark:bg-white/5 shadow-sm dark:shadow-none backdrop-blur p-5 space-y-3">
                {/* Header bar */}
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">DIALOG GUSTAFTA</div>
                    <div className="text-[10px] text-blue-500 dark:text-cyan-300/70">Teman Berpikir · 3-Stage System</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-[9px] font-bold text-cyan-600 dark:text-cyan-400">1</div>
                    <div className="w-10 h-0.5 bg-cyan-200 dark:bg-cyan-500/30" />
                    <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-[9px] font-bold text-emerald-600 dark:text-emerald-400">3</div>
                  </div>
                </div>
                {/* Mock messages */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 shrink-0" />
                    <div className="bg-blue-50 dark:bg-white/10 rounded-xl rounded-tl-sm px-3 py-2 text-xs text-gray-700 dark:text-white/80 max-w-[85%]">Ceritakan — kamu bekerja di bidang apa, atau ada tantangan apa? 🌟</div>
                  </div>
                  <div className="flex gap-2 flex-row-reverse">
                    <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-white/20 shrink-0" />
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-700 rounded-xl rounded-tr-sm px-3 py-2 text-xs text-white max-w-[85%]">Saya konsultan K3 yang ingin menjangkau lebih banyak klien...</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 shrink-0" />
                    <div className="bg-blue-50 dark:bg-white/10 rounded-xl rounded-tl-sm px-3 py-2 text-xs text-gray-700 dark:text-white/80 max-w-[85%]">Menarik! Klien yang ingin kamu jangkau itu dari sektor apa?</div>
                  </div>
                </div>
                {/* Gate 1 preview */}
                <div className="rounded-xl border border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-900/20 p-3 text-xs">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center text-[8px] font-bold text-white">1</div>
                    <span className="font-bold text-cyan-700 dark:text-cyan-300">Checkpoint 1 — Profil Awal</span>
                  </div>
                  <div className="space-y-1 text-gray-500 dark:text-white/60">
                    <div>🎯 Bidang: <span className="text-gray-800 dark:text-white">Konsultansi K3 Konstruksi</span></div>
                    <div>💡 Potensi: <span className="text-gray-800 dark:text-white">Knowledge base K3 yang kuat, siap jadi chatbot</span></div>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    <div className="flex-1 bg-cyan-500 text-white rounded-lg px-2 py-1 text-center font-semibold text-[10px]">Lanjut ke Blueprint →</div>
                    <div className="flex-1 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/50 rounded-lg px-2 py-1 text-center text-[10px]">Cukup di sini</div>
                  </div>
                </div>
              </div>
              {/* Shareable badge */}
              <div className="absolute -bottom-3 right-4 bg-emerald-50 dark:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-500/30 rounded-full px-3 py-1 text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                <Star className="w-3 h-3" /> Dapat di-share · Installable
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Pricing</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Pilih Tier Sesuai Skala Ekosistem Anda
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Semua tier memerlukan lisensi platform (sekali) — sudah termasuk dalam Lisensi Starter Kit.</p>
          </div>

          {/* Jalur Masuk */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {/* Jalur Lisensi Starter Kit — recommended */}
            <div className="relative rounded-2xl border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-5">
              <div className="absolute -top-3 left-4">
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">✦ DIREKOMENDASIKAN</span>
              </div>
              <div className="flex items-start gap-3 mt-1">
                <span className="text-2xl">🎫</span>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-1">Beli Starter Kit Gustafta</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">Paket pembuka ekosistem — bayar sekali, aktif selamanya</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">Rp 245.000</span>
                      <span className="text-[10px] text-gray-400 line-through">Rp 299.000</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold">Hemat Rp 54rb</span>
                    </div>
                    <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Yang Anda dapat:</div>
                    <div className="flex items-center gap-1.5">✅ <span><strong>Lisensi platform seumur hidup</strong> — tidak perlu bayar lisensi lagi</span></div>
                    <div className="flex items-center gap-1.5">✅ <span>3 Panduan Digital Trilogi Ekosistem Kompetensi</span></div>
                    <div className="flex items-center gap-1.5">✅ <span>7 hari akses penuh Starter (trial gratis)</span></div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800 text-[11px] text-gray-500 dark:text-gray-400">
                    Lanjut berlangganan setelah trial: <strong className="text-gray-700 dark:text-gray-200">+ Rp 199.000/bln</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Jalur Tanpa Lisensi */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-muted/20 p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-1">Langsung Berlangganan</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">Tanpa aktivasi lisensi terlebih dahulu</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-700 dark:text-gray-200 text-base">Rp 299.000</span>
                      <span className="text-[10px] text-gray-400">biaya lisensi (sekali)</span>
                    </div>
                    <div className="flex items-center gap-1.5">➕ <span>Langganan Starter Rp 199.000/bln</span></div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">✗ <span>Tanpa Starter Kit, tanpa trial 7 hari</span></div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-[11px] text-gray-500 dark:text-gray-400">
                    Total awal: <strong className="text-gray-700 dark:text-gray-300">Rp 498.000</strong>
                    <span className="text-gray-400"> — lebih mahal Rp 53rb, tanpa panduan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                emoji: "🆓", tier: "Gratis", price: "Rp 0", period: "/bulan",
                note: "",
                desc: "Eksplorasi awal platform",
                features: ["Builder chatbot dasar", "3 bot · 50 pesan/bulan", "Web widget embed", "Dashboard analitik"],
                cta: "Mulai Gratis", ctaVariant: "outline" as const, highlight: false,
              },
              {
                emoji: "⚡", tier: "Starter", price: "Rp 199.000", period: "/bulan",
                note: "Lisensi Rp 0 (dengan Starter Kit) atau Rp 299rb (tanpa) — sekali",
                desc: "Mulai bisnis chatbot + ekosistem penuh",
                features: ["Builder chatbot penuh", "10 bot · 2.000 pesan/bulan", "Mini Apps 5 tipe", "Web widget no-branding", "Email support"],
                cta: "Pilih Starter", ctaVariant: "outline" as const, highlight: false,
              },
              {
                emoji: "👑", tier: "Profesional", price: "Rp 499.000", period: "/bulan",
                note: "Lisensi Rp 0 (dengan Starter Kit) atau Rp 299rb (tanpa) — sekali",
                desc: "Ekosistem lengkap + 80 MultiClaw AI Tools",
                features: ["Semua fitur Starter", "50 bot · 3.000 pesan/bulan", "80+ MultiClaw AI Tools", "Mini Apps 15 tipe", "E-Course & Document Generator", "Custom Domain (1)"],
                cta: "Pilih Profesional", ctaVariant: "default" as const, highlight: true,
              },
              {
                emoji: "🏢", tier: "Bisnis", price: "Rp 999.000", period: "/bulan",
                note: "Lisensi Rp 0 (dengan Starter Kit) atau Rp 299rb (tanpa) — sekali",
                desc: "Tim 2 akun + 100 slot shared + suite lengkap",
                features: ["Semua fitur Profesional", "100 slot shared (2 sub-akun)", "Semua Mini Apps (45 tipe)", "Custom Domain (3)", "Priority WA support & Dedicated Manager"],
                cta: "Pilih Bisnis", ctaVariant: "outline" as const, highlight: false,
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
                  {plan.note && <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 leading-tight">{plan.note}</div>}
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

                <Link href={builderUrl}>
                  <Button
                    variant={plan.ctaVariant}
                    className={`w-full text-xs h-9 ${plan.highlight ? "bg-blue-600 hover:bg-blue-500 text-white" : ""}`}
                    data-testid={`btn-pricing-${plan.tier.toLowerCase()}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Enterprise row */}
          <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-muted/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🏛️</span>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">Enterprise — Custom</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Universitas, korporasi, pemerintah — unlimited ekosistem, white-label, API access, dedicated success manager</div>
              </div>
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
              <Button variant="outline" className="text-xs h-9 gap-1.5" data-testid="btn-pricing-enterprise">
                <MessageCircle className="h-3.5 w-3.5" /> Hubungi Kami
              </Button>
            </a>
          </div>

          <div className="text-center mt-6">
            <Link href="/produk">
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
                  { name: "Paket PKB Lengkap", badge: "🔥 Trending", bar: 92, tier: "Premium" },
                  { name: "Chatbot Sertifikasi Profesi", badge: "⭐ Favorit", bar: 74, tier: "Standar" },
                  { name: "Modul K3 & SMK3", badge: "✨ Baru", bar: 58, tier: "Standar" },
                  { name: "Asesmen Kompetensi", badge: "📈 Naik", bar: 41, tier: "Dasar" },
                ].map((t) => (
                  <div key={t.name} className="text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-muted/20 border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{t.name}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{t.badge}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${t.bar}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{t.tier}</span>
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
              { q: "Apa bedanya dengan ChatGPT atau platform chatbot lain?", a: "Mereka menjual chatbot. Gustafta menjual platform untuk merakit ekosistem kompetensi Anda sendiri — panduan digital, chatbot, mini apps, e-course, dan document generator dalam satu sistem yang bisa dimonetisasi." },
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
