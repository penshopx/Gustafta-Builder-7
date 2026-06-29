import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, ArrowRight, BookOpen, Zap, Shield, Star,
  MessageCircle, Sparkles, Gift, AlertCircle, TrendingUp,
  Clock, XCircle, ChevronRight,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20mau%20tanya%20tentang%20Starter%20Kit";
const CHECKOUT_URL = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533205&qty=1";

export default function StarterKitPage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white dark:bg-background" data-testid="page-starter-kit">
      <SharedHeader />

      {/* ── A: ATTENTION — Pain hook ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 py-20 md:py-28 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold mb-6">
            <BookOpen className="h-3.5 w-3.5" />
            Pintu Masuk Terbaik ke Ekosistem AI Gustafta
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Sudah Penasaran dengan AI<br />
            <span className="text-sky-200">tapi Tidak Tahu Harus Mulai dari Mana?</span>
          </h1>
          <p className="text-base md:text-lg text-sky-100 mb-6 max-w-2xl mx-auto leading-relaxed">
            Banyak profesional Indonesia tertarik dengan AI — tapi akhirnya tidak melakukan apa-apa
            karena overwhelm dengan pilihan yang terlalu banyak. Starter Kit ini adalah satu-satunya
            langkah yang Anda butuhkan untuk memulai.
          </p>
          <div className="flex items-center justify-center gap-6 mb-8 text-white">
            {[["2.400+", "Profesional"], ["4.8/5", "Rating"], ["Rp 245rb", "Sekali Bayar"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold">{num}</div>
                <div className="text-xs text-sky-200">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-sky-50 font-bold gap-2 px-8 h-12" data-testid="btn-hero-beli-starter">
                <Zap className="h-5 w-5" /> Ambil Starter Kit — Rp 245.000
              </Button>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2 px-8 h-12" data-testid="btn-hero-tanya">
                <MessageCircle className="h-4 w-4" /> Tanya Dulu
              </Button>
            </a>
          </div>
          <p className="text-xs text-sky-200 mt-4">🛡️ Garansi uang kembali 7 hari · Tidak perlu latar belakang teknis</p>
        </div>
      </section>

      {/* ── I: INTEREST — Kenapa ini penting sekarang ── */}
      <section className="py-14 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Realita yang Sering Terjadi</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Kenapa Kebanyakan Orang Gagal Mulai dengan AI?</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">Bukan karena tidak pintar. Bukan karena tidak mau belajar. Tapi karena tidak ada panduan yang tepat untuk profesi mereka.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: <XCircle className="h-5 w-5 text-red-400" />, title: "Coba ChatGPT, bingung mau dipakai untuk apa", desc: "ChatGPT itu alat umum. Tanpa tahu cara mengkonfigurasinya untuk profesi Anda, hasilnya generik dan tidak berguna." },
              { icon: <XCircle className="h-5 w-5 text-red-400" />, title: "Ikut kursus AI mahal, tidak bisa dipraktikkan", desc: "Kursus AI kebanyakan membahas teori atau coding. Tidak ada yang mengajarkan cara membangun chatbot untuk pekerjaan Anda hari ini." },
              { icon: <XCircle className="h-5 w-5 text-red-400" />, title: "Menunggu 'waktu yang tepat' yang tidak pernah datang", desc: "Sementara Anda menunggu, kolega Anda sudah mulai. Klien mereka sudah dilayani chatbot AI 24/7." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">{item.icon}<h3 className="font-bold text-sm">{item.title}</h3></div>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-sky-500/10 border border-sky-500/30 rounded-2xl p-6 text-center">
            <AlertCircle className="h-8 w-8 text-sky-400 mx-auto mb-3" />
            <p className="text-sky-100 font-semibold mb-1">Starter Kit bukan kursus AI lagi.</p>
            <p className="text-gray-300 text-sm max-w-lg mx-auto">Ini adalah fondasi mindset + panduan praktis membangun chatbot pertama Anda dalam waktu 2 minggu — bahkan jika Anda belum pernah coding seumur hidup.</p>
          </div>
        </div>
      </section>

      {/* ── ISI PAKET ── */}
      <section className="py-16 px-4 bg-sky-50 dark:bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-sky-600 uppercase tracking-widest text-center mb-2">Yang Anda Dapatkan</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Isi Starter Kit Lengkap
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <BookOpen className="h-7 w-7 text-sky-600" />,
                title: "Trilogi GUSTAFTA — Buku I, II & III",
                desc: "Tiga buku panduan lengkap perjalanan Perakit AI: dari mindset shift, cara merakit di Builder, hingga strategi menghasilkan nilai dari AI. PDF + Flipbook interaktif.",
                badge: "Inti Materi",
                highlight: "Dibaca rata-rata dalam 4 jam per buku, dipraktikkan dalam 2 minggu",
              },
              {
                icon: <Zap className="h-7 w-7 text-emerald-600" />,
                title: "Prompt Pack Starter (15 Prompt)",
                desc: "15 prompt siap pakai untuk chatbot di bidang Anda — tinggal ganti nama, langsung bisa dipakai untuk demo ke calon klien hari ini.",
                badge: "Siap Pakai",
                highlight: "Prompt untuk: K3, Legal, Konsultan, Trainer, Akademisi",
              },
              {
                icon: <Gift className="h-7 w-7 text-violet-600" />,
                title: "Template Konfigurasi Chatbot",
                desc: "Sample konfigurasi chatbot siap pakai dari berbagai profesi — persona, knowledge base, dan system prompt yang sudah dikonfigurasi. Tinggal sesuaikan untuk bidang Anda.",
                badge: "Template",
                highlight: "Tersedia untuk: Konsultan, Trainer, K3, Asosiasi, LSP",
              },
              {
                icon: <Star className="h-7 w-7 text-amber-500" />,
                title: "Akses GUSTAFTA Builder 7 Hari",
                desc: "Langsung praktik di platform nyata — rakit chatbot pertama Anda selama 7 hari tanpa biaya. Semua fitur Builder tersedia penuh selama masa trial.",
                badge: "Trial Gratis",
                highlight: "Langsung aktif setelah pembelian · Tanpa kartu kredit",
              },
              {
                icon: <Gift className="h-7 w-7 text-orange-500" />,
                title: "Akses Komunitas Perakit AI",
                desc: "Bergabung di grup eksklusif pembeli Starter Kit — berbagi pengalaman, tanya jawab langsung dengan tim, dan mendapat update materi baru.",
                badge: "Komunitas",
                highlight: "340+ anggota aktif sudah bergabung",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-border">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-muted rounded-xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full">{item.badge}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-muted-foreground leading-relaxed mb-2">{item.desc}</p>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />{item.highlight}
                    </p>
                    {item.link && (
                      <Link href={item.link}>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 underline cursor-pointer font-medium">Baca Framework →</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── D: DESIRE — Transformasi & Social Proof ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-sky-600 uppercase tracking-widest text-center mb-2">Bukti Nyata</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Dari Ragu ke Chatbot Pertama dalam 2 Minggu
          </h2>
          <p className="text-center text-gray-500 dark:text-muted-foreground text-sm mb-10 max-w-lg mx-auto">
            Mereka bukan programmer. Bukan orang teknis. Tapi mereka berhasil.
          </p>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              {
                name: "Hendra S.",
                role: "Pengawas Konstruksi, Surabaya",
                before: "Menghabiskan 2 jam/hari menjawab pertanyaan regulasi K3 yang sama",
                after: "Chatbot-nya kini menjawab 90% pertanyaan tim lapangan secara otomatis",
                text: "Dalam 2 minggu chatbot saya sudah bisa dipakai klien. Saya kira bakal susah ternyata tidak.",
              },
              {
                name: "Yuli A.",
                role: "Konsultan HR Freelance, Jakarta",
                before: "Kehilangan klien karena tidak bisa respond cepat di luar jam kerja",
                after: "Chatbot pre-screening klien 24/7, omset naik 40% dalam 3 bulan",
                text: "Prompt pack-nya langsung kepake. Saya custom sedikit, jadilah chatbot yang bisa jawab otomatis.",
              },
              {
                name: "Baskoro W.",
                role: "Trainer Independen, Bandung",
                before: "Peserta pelatihan tidak punya tempat bertanya di luar sesi",
                after: "Tingkat penyelesaian modul naik dari 60% ke 88% setelah pakai chatbot tutor",
                text: "Harga segitu worth it banget. Terstruktur dan yang paling penting bisa dipraktikkan langsung.",
              },
            ].map((t, i) => (
              <div key={i} className="bg-sky-50 dark:bg-muted/30 rounded-2xl p-5 border border-sky-100 dark:border-border">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-gray-400 mb-1">Sebelum: <span className="text-red-400">{t.before}</span></p>
                <p className="text-xs text-gray-400 mb-3">Sesudah: <span className="text-green-600 dark:text-green-400 font-semibold">{t.after}</span></p>
                <p className="text-sm text-gray-700 dark:text-muted-foreground italic mb-4">"{t.text}"</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>

          {/* Untuk siapa */}
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-muted/20 dark:to-muted/30 rounded-2xl p-8">
            <p className="text-xs font-bold text-sky-600 uppercase tracking-widest text-center mb-2">Cocok Untuk</p>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">Starter Kit Ini Untuk Anda Jika…</h3>
            <div className="space-y-3">
              {[
                "Anda ingin tahu apa itu AI chatbot tapi belum yakin mau investasi besar",
                "Anda seorang karyawan yang ingin mulai membangun penghasilan sampingan dari keahlian Anda",
                "Anda konsultan atau freelancer yang mau otomatisasi layanan tanpa biaya agensi",
                "Anda pernah mencoba buat chatbot tapi bingung harus mulai dari mana",
                "Anda ingin test dulu sebelum upgrade ke paket Bundle Trilogi lengkap",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 bg-white dark:bg-card rounded-xl px-5 py-3.5 border border-sky-100 dark:border-border">
                  <Check className="h-4 w-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── A: ACTION — Pricing + Urgency ── */}
      <section className="py-16 px-4 bg-gradient-to-b from-sky-50 to-white dark:from-muted/20 dark:to-background">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2 text-center">Investasi</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Pilih yang Sesuai Kebutuhan Anda</h2>
          <p className="text-sm text-gray-500 dark:text-muted-foreground mb-8 text-center">Lebih murah dari satu sesi kursus — hasilnya bisa Anda pakai seumur karier.</p>

          {/* Promo badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full px-4 py-1.5 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-red-500" />
              <span className="text-xs font-bold text-red-600 dark:text-red-400">Harga promosi — bisa berubah sewaktu-waktu</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Kartu 1: Starter Kit saja */}
            <div className="bg-white dark:bg-card rounded-2xl shadow-md border-2 border-sky-300 dark:border-sky-700 p-7 flex flex-col">
              <div className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3">Starter Kit</div>
              <div className="text-4xl font-extrabold text-sky-600 mb-0.5">Rp 245.000</div>
              <div className="text-xs text-gray-400 line-through mb-1">Harga normal Rp 350.000</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-5">Sekali bayar · Akses selamanya</div>
              <ul className="text-sm space-y-2.5 mb-6 text-gray-700 dark:text-muted-foreground flex-1">
                {[
                  "Trilogi GUSTAFTA Buku I, II & III",
                  "15 Prompt Pack siap pakai",
                  "Template Konfigurasi Chatbot",
                  "Akses Builder 7 hari (trial)",
                  "Akses Komunitas Perakit AI",
                  "🛡️ Garansi 7 hari uang kembali",
                  "🔄 Update gratis selamanya",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full h-11 bg-sky-600 hover:bg-sky-500 text-white font-bold" data-testid="btn-pricing-kit">
                  Ambil Starter Kit →
                </Button>
              </a>
              <p className="text-xs text-gray-400 mt-2 text-center">Pembayaran aman via Scalev</p>
            </div>

            {/* Kartu 2: Starter Kit + Langganan Belajar */}
            <div className="bg-gradient-to-b from-indigo-600 to-blue-700 rounded-2xl shadow-xl border-2 border-indigo-400 p-7 flex flex-col text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide">
                Terlengkap
              </div>
              <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-3">Starter Kit + Belajar</div>
              <div className="text-4xl font-extrabold text-white mb-0.5">Rp 445.000</div>
              <div className="text-xs text-indigo-300 line-through mb-1">Harga normal Rp 550.000</div>
              <div className="text-xs text-indigo-200 mb-5">Starter Kit + Langganan Belajar 1 bulan</div>
              <ul className="text-sm space-y-2.5 mb-6 text-indigo-100 flex-1">
                {[
                  { text: "Semua isi Starter Kit", highlight: false },
                  { text: "Langganan plan Starter 1 bulan penuh", highlight: true },
                  { text: "Akses platform Builder tidak terbatas", highlight: true },
                  { text: "Mulai rakit AI hari ini — bukan trial", highlight: true },
                  "🛡️ Garansi 7 hari uang kembali",
                  "🔄 Update gratis selamanya",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className={`h-4 w-4 flex-shrink-0 ${typeof item === "object" && item.highlight ? "text-yellow-300" : "text-indigo-300"}`} />
                    <span className={typeof item === "object" && item.highlight ? "text-white font-medium" : ""}>
                      {typeof item === "object" ? item.text : item}
                    </span>
                  </li>
                ))}
              </ul>
              <a href={`https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20mau%20ambil%20paket%20Starter%20Kit%20%2B%20Langganan%20Belajar%20Rp%20445.000`} target="_blank" rel="noopener noreferrer">
                <Button className="w-full h-11 bg-white text-indigo-700 hover:bg-indigo-50 font-bold" data-testid="btn-pricing-bundle">
                  Ambil Paket Bundle →
                </Button>
              </a>
              <p className="text-xs text-indigo-300 mt-2 text-center">Konfirmasi via WhatsApp</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-muted-foreground mt-6 text-center">
            Mau paket lebih lengkap?{" "}
            <Link href="/trilogi">
              <span className="text-sky-600 font-semibold underline cursor-pointer">Lihat Bundle Trilogi →</span>
            </Link>
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-sky-600 to-indigo-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Setiap Hari yang Ditunda adalah Klien yang Tidak Terlayani</h2>
          <p className="text-sky-100 mb-3 text-base leading-relaxed">
            2.400+ profesional Indonesia sudah memulai. Kapan giliran Anda?
          </p>
          <p className="text-sky-200 mb-8 text-sm">Starter Kit ini adalah langkah pertama yang paling masuk akal — sebelum investasi lebih besar.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-sky-50 font-bold gap-2 px-8 h-12" data-testid="btn-final-cta">
                Ambil Starter Kit Sekarang <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2" data-testid="btn-final-wa">
                <MessageCircle className="h-4 w-4" /> Chat WhatsApp
              </Button>
            </a>
          </div>
          <p className="text-xs text-sky-200 mt-5">
            Sudah punya akun Gustafta?{" "}
            <Link href={builderUrl}>
              <span className="underline font-semibold cursor-pointer">Langsung ke Builder →</span>
            </Link>
          </p>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-400 text-xs">
        <p className="mb-1">© 2026 Gustafta. Platform AI Chatbot Builder Indonesia.</p>
        <div className="flex justify-center gap-4">
          <Link href="/"><span className="hover:text-white cursor-pointer">Beranda</span></Link>
          <Link href="/trilogi"><span className="hover:text-white cursor-pointer">Trilogi</span></Link>
          <Link href="/mitra"><span className="hover:text-white cursor-pointer">Mitra</span></Link>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
