import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, ArrowRight, BookOpen, Zap, Shield, Star,
  MessageCircle, ChevronRight, Sparkles, Play, Gift,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20mau%20tanya%20tentang%20Starter%20Kit";
const CHECKOUT_URL = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533205&qty=1";

export default function StarterKitPage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white dark:bg-background" data-testid="page-starter-kit">
      <SharedHeader />

      {/* ── HERO ── */}
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
            Starter Kit —<br />
            <span className="text-sky-200">Langkah Pertama yang Tepat</span>
          </h1>
          <p className="text-base md:text-lg text-sky-100 mb-4 max-w-2xl mx-auto leading-relaxed">
            Buku I "Dari Monolog ke Dialog" + Panduan Gustafta Builder: fondasi lengkap
            untuk membangun chatbot AI pertama Anda, bahkan tanpa latar belakang teknis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-sky-50 font-bold gap-2 px-8 h-12" data-testid="btn-hero-beli-starter">
                <Zap className="h-5 w-5" /> Ambil Starter Kit Sekarang
              </Button>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2 px-8 h-12" data-testid="btn-hero-tanya">
                <MessageCircle className="h-4 w-4" /> Tanya Dulu
              </Button>
            </a>
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
                title: "Buku I: Dari Monolog ke Dialog",
                desc: "Mindset shift dari karyawan ke profesional independen yang bisa menghasilkan dari keahliannya — bukan dari jabatannya. PDF + Flipbook interaktif.",
                badge: "Inti Materi",
              },
              {
                icon: <Sparkles className="h-7 w-7 text-indigo-600" />,
                title: "Panduan Gustafta Builder",
                desc: "Step-by-step membangun chatbot AI pertama Anda di platform Gustafta. No-code. Cocok untuk pemula yang belum pernah coding seumur hidup.",
                badge: "Panduan Praktik",
              },
              {
                icon: <Play className="h-7 w-7 text-emerald-600" />,
                title: "Prompt Pack Starter (15 Prompt)",
                desc: "15 prompt siap pakai untuk chatbot di bidang Anda — tinggal ganti nama, langsung bisa dipakai untuk demo ke calon klien.",
                badge: "Siap Pakai",
              },
              {
                icon: <Gift className="h-7 w-7 text-orange-500" />,
                title: "Akses Komunitas Beta",
                desc: "Bergabung di grup eksklusif pembeli Starter Kit: berbagi pengalaman, tanya jawab, dan mendapat update materi baru.",
                badge: "Bonus",
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
                    <p className="text-sm text-gray-500 dark:text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UNTUK SIAPA ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">Cocok Untuk</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-10">
            Starter Kit Ini Untuk Anda Jika…
          </h2>
          <div className="space-y-4 text-left">
            {[
              "Anda ingin tahu apa itu AI chatbot tapi belum yakin mau investasi besar",
              "Anda seorang karyawan yang ingin mulai membangun penghasilan sampingan dari keahlian Anda",
              "Anda konsultan atau freelancer yang mau otomatisasi layanan tanpa biaya agensi",
              "Anda pernah mencoba buat chatbot tapi bingung harus mulai dari mana",
              "Anda ingin test dulu sebelum upgrade ke paket Bundle Trilogi lengkap",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 bg-sky-50 dark:bg-muted/30 rounded-xl px-5 py-4">
                <Check className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-16 px-4 bg-gradient-to-b from-sky-50 to-white dark:from-muted/20 dark:to-background">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">Investasi</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Satu Langkah, Harga Terjangkau</h2>
          <div className="bg-white dark:bg-card rounded-2xl shadow-xl border-2 border-sky-400 p-8">
            <div className="text-5xl font-extrabold text-sky-600 mb-1">Rp 245.000</div>
            <div className="text-sm text-gray-400 mb-6 line-through">Harga normal Rp 315.000</div>
            <ul className="text-sm text-left space-y-3 mb-8 text-gray-700 dark:text-muted-foreground">
              {[
                "Buku I PDF + Flipbook",
                "Panduan Gustafta Builder",
                "15 Prompt Pack Starter",
                "Akses Komunitas Beta",
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
              <Button className="w-full h-12 bg-sky-600 hover:bg-sky-500 text-white font-bold text-base" data-testid="btn-pricing-checkout">
                Beli Starter Kit — Rp 245.000 →
              </Button>
            </a>
            <p className="text-xs text-gray-400 mt-3">Pembayaran aman via Scalev · Transfer / e-wallet</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-muted-foreground mt-6">
            Mau paket lebih lengkap?{" "}
            <Link href="/trilogi">
              <span className="text-sky-600 font-semibold underline cursor-pointer">Lihat Bundle Trilogi →</span>
            </Link>
          </p>
        </div>
      </section>

      {/* ── TESTIMONI ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-sky-600 uppercase tracking-widest text-center mb-2">Cerita Pembeli</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Mereka Sudah Mulai</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Hendra S.",
                role: "Pengawas Konstruksi",
                text: "Saya kira bakal susah. Ternyata setelah baca Buku I dan ikutin panduan builder, chatbot saya sudah bisa dipakai klien dalam 2 minggu.",
              },
              {
                name: "Yuli A.",
                role: "Konsultan HR Freelance",
                text: "Prompt pack-nya langsung kepake. Saya custom dikit, jadilah chatbot yang bisa jawab pertanyaan klien saya otomatis 24 jam.",
              },
              {
                name: "Baskoro W.",
                role: "Trainer Independen",
                text: "Harga segitu worth it banget. Starter kit-nya jelas, terstruktur, dan yang paling penting — bisa dipraktikkan langsung.",
              },
            ].map((t, i) => (
              <div key={i} className="bg-sky-50 dark:bg-muted/30 rounded-2xl p-5 border border-sky-100 dark:border-border">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 dark:text-muted-foreground italic mb-4">"{t.text}"</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-sky-600 to-indigo-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Mulai dari Yang Pertama</h2>
          <p className="text-sky-100 mb-8 text-base leading-relaxed">
            Setiap perjalanan dimulai dari satu langkah. Starter Kit ini adalah langkah itu.
          </p>
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

      {/* ── FOOTER ── */}
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
