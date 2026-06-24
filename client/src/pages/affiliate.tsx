import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, ArrowRight, MessageCircle, TrendingUp, Users, Wallet,
  Share2, Gift, Star, Zap, BarChart3, ShieldCheck, Link as LinkIcon,
  DollarSign, Clock, AlertCircle, ChevronRight,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20tertarik%20jadi%20Affiliate%2FReseller%20Gustafta";

export default function AffiliatePage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white dark:bg-background" data-testid="page-affiliate">
      <SharedHeader />

      {/* ── A: ATTENTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 py-20 md:py-28 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold mb-6">
            <Share2 className="h-3.5 w-3.5" />
            Program Affiliate & Reseller Gustafta
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Anda Sudah Sering Rekomendasikan Tools.<br />
            <span className="text-violet-200">Kenapa Belum Dibayar untuk Itu?</span>
          </h1>
          <p className="text-base md:text-lg text-violet-100 mb-4 max-w-2xl mx-auto leading-relaxed">
            Setiap kali Anda rekomendasikan Gustafta ke teman, kolega, atau komunitas —
            Anda bisa menghasilkan komisi hingga 30% secara berulang setiap bulan,
            tanpa harus membuat produk sendiri.
          </p>
          <div className="flex items-center justify-center gap-6 mb-8 text-white">
            {[["30%", "Komisi Maks"], ["Recurring", "Tiap Bulan"], ["Rp 0", "Modal Awal"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold">{num}</div>
                <div className="text-xs text-violet-200">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 font-bold gap-2 px-8 h-12" data-testid="btn-hero-daftar">
                <Share2 className="h-5 w-5" /> Daftar Jadi Affiliate Sekarang
              </Button>
            </a>
            <Link href={builderUrl}>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2 px-8 h-12" data-testid="btn-hero-coba">
                Coba Builder Dulu <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-violet-200 mt-4">Tidak ada biaya pendaftaran · Tidak ada target minimum · Pencairan bulanan</p>
        </div>
      </section>

      {/* ── I: INTEREST — Potensi penghasilan nyata ── */}
      <section className="py-14 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Ilustrasi Penghasilan</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Berapa yang Bisa Anda Hasilkan?</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">Bukan janji. Ini simulasi nyata berdasarkan struktur komisi aktual — Anda yang menentukan skalanya.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                level: "Mulai Pelan",
                referral: "5 referral/bulan",
                produk: "Starter Kit Rp 245rb",
                komisi: "15%",
                hasil: "Rp 183.750/bln",
                recurring: "+ langganan recurring",
                color: "border-violet-500/30 bg-violet-500/5",
              },
              {
                level: "Tumbuh Konsisten",
                referral: "20 referral/bulan",
                produk: "Mix Starter + Trilogi",
                komisi: "20%",
                hasil: "Rp 1–3 juta/bln",
                recurring: "+ recurring dari subscriber lama",
                color: "border-violet-400 bg-violet-500/10",
                highlight: true,
              },
              {
                level: "Skala Reseller",
                referral: "50+ pelanggan aktif",
                produk: "Bundle + Langganan",
                komisi: "30%",
                hasil: "Rp 5–15 juta/bln",
                recurring: "Passive income dari portfolio",
                color: "border-violet-500/30 bg-violet-500/5",
              },
            ].map((s, i) => (
              <div key={i} className={`rounded-xl border p-5 ${s.color}`}>
                {s.highlight && <div className="text-center mb-3"><span className="text-[10px] font-extrabold bg-violet-500 text-white px-3 py-1 rounded-full">PALING REALISTIS</span></div>}
                <h3 className="font-bold text-sm text-violet-200 mb-3">{s.level}</h3>
                <div className="space-y-1.5 text-xs text-gray-300 mb-4">
                  <p>📊 {s.referral}</p>
                  <p>🛒 {s.produk}</p>
                  <p>💰 Komisi {s.komisi}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-xl font-extrabold text-violet-300">{s.hasil}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{s.recurring}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-5 flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              <span className="font-bold text-violet-300">Yang membuat ini berbeda dari afiliasi biasa:</span>{" "}
              komisi Anda bersifat <span className="font-semibold text-white">recurring</span> — selama pelanggan yang Anda referensikan masih berlangganan, Anda terus menerima komisi setiap bulan tanpa harus mencari referral baru.
            </p>
          </div>
        </div>
      </section>

      {/* ── TIERS ── */}
      <section className="py-16 px-4 bg-violet-50 dark:bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest text-center mb-2">Struktur Komisi</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Tiga Jalur — Naik Otomatis Sesuai Performa
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                level: "Affiliate",
                icon: <Share2 className="h-6 w-6 text-violet-600" />,
                komisiBuku: "15%",
                komisiSubs: "10% / bulan",
                syarat: "Tidak ada minimum",
                perks: ["Link affiliate personal", "Dashboard statistik real-time", "Materi promosi siap pakai", "Pencairan bulanan otomatis"],
                highlight: false,
              },
              {
                level: "Creator",
                icon: <Star className="h-6 w-6 text-amber-500" />,
                komisiBuku: "20%",
                komisiSubs: "20% / bulan",
                syarat: "5 referral aktif",
                perks: ["Semua benefit Affiliate", "Prioritas support tim", "Co-branding materi promosi", "Badge Creator verified"],
                highlight: true,
              },
              {
                level: "Reseller",
                icon: <Wallet className="h-6 w-6 text-emerald-600" />,
                komisiBuku: "30%",
                komisiSubs: "30% / bulan",
                syarat: "20 pelanggan aktif",
                perks: ["Semua benefit Creator", "Harga grosir produk digital", "Akses pre-launch produk baru", "Dedicated account manager"],
                highlight: false,
              },
            ].map((tier, i) => (
              <div key={i} className={`rounded-2xl p-6 border-2 bg-white dark:bg-card ${tier.highlight ? "border-violet-500 shadow-xl" : "border-gray-200 dark:border-border"}`}>
                {tier.highlight && (
                  <div className="text-center mb-3">
                    <span className="text-[10px] font-extrabold bg-violet-500 text-white px-3 py-1 rounded-full">PALING POPULER</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-50 dark:bg-muted rounded-lg">{tier.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{tier.level}</h3>
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-extrabold text-violet-600">{tier.komisiBuku}</div>
                  <div className="text-xs text-gray-500">komisi per produk / ebook</div>
                  <div className="text-lg font-bold text-purple-600 mt-1">{tier.komisiSubs}</div>
                  <div className="text-xs text-gray-500">komisi berlangganan (recurring)</div>
                </div>
                <p className="text-xs text-gray-500 mb-4 font-medium bg-gray-50 dark:bg-muted rounded-lg px-3 py-2">Syarat: {tier.syarat}</p>
                <ul className="space-y-2">
                  {tier.perks.map((p, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── D: DESIRE — Social proof + Cara kerja ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Cara mulai */}
            <div>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">Cara Mulai</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dari Daftar ke Komisi Pertama</h2>
              <div className="space-y-5">
                {[
                  { step: "01", title: "Daftar via WA", desc: "Hubungi tim Gustafta, dapatkan link affiliate personal Anda dalam 1 hari kerja." },
                  { step: "02", title: "Bagikan ke Komunitas", desc: "Gunakan di konten, grup WA/Telegram, atau rekomendasi langsung. Semua materi promosi sudah kami siapkan." },
                  { step: "03", title: "Referral Membeli / Berlangganan", desc: "Setiap klik link Anda yang berakhir pembelian atau langganan tercatat otomatis di dashboard Anda." },
                  { step: "04", title: "Terima Komisi Bulanan", desc: "Komisi diakumulasi dan dicairkan otomatis setiap bulan ke rekening Anda. Recurring selama mereka masih aktif." },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 font-extrabold text-xs flex items-center justify-center shrink-0">{s.step}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{s.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Siapa yang cocok */}
            <div>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">Siapa yang Cocok</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Program Ini Untuk Anda Jika…</h2>
              <div className="space-y-3">
                {[
                  { icon: <Users className="h-4 w-4 text-violet-500" />, text: "Anda memiliki komunitas online (grup WA, Telegram, LinkedIn, YouTube)" },
                  { icon: <BarChart3 className="h-4 w-4 text-violet-500" />, text: "Anda seorang trainer, konsultan, atau coach yang ingin monetasi audiens" },
                  { icon: <LinkIcon className="h-4 w-4 text-violet-500" />, text: "Anda aktif di media sosial dan sering merekomendasikan tools produktivitas" },
                  { icon: <TrendingUp className="h-4 w-4 text-violet-500" />, text: "Anda ingin penghasilan pasif tanpa harus buat produk sendiri" },
                  { icon: <Gift className="h-4 w-4 text-violet-500" />, text: "Anda ingin menawarkan nilai tambah ke klien/murid dengan tools AI terbaik" },
                  { icon: <ShieldCheck className="h-4 w-4 text-violet-500" />, text: "Anda ingin membangun bisnis reseller digital yang scalable dan legal" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-violet-50 dark:bg-muted/20 rounded-xl px-4 py-3 border border-violet-100 dark:border-border">
                    {item.icon}
                    <p className="text-sm text-gray-700 dark:text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Senjata promosi ── */}
      <section className="py-14 px-4 bg-violet-50 dark:bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">Yang Kami Sediakan</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Kami Siapkan Semua Senjatanya</h2>
          <p className="text-sm text-gray-500 dark:text-muted-foreground mb-8">Anda tidak perlu buat konten dari nol. Semua sudah ada — tinggal Anda bagikan.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "Caption & copywriting siap pakai",
              "Banner dan visual promosi",
              "Video demo produk",
              "Template WhatsApp broadcast",
              "Materi edukasi untuk audiens",
              "Dashboard tracking real-time",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-muted-foreground bg-white dark:bg-card rounded-xl px-4 py-3 border border-violet-100 dark:border-border">
                <Check className="h-4 w-4 text-violet-500 flex-shrink-0" />{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── A: ACTION ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-violet-600 to-indigo-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Mulai Hasilkan Komisi Hari Ini</h2>
          <p className="text-violet-100 mb-3 leading-relaxed">
            Tidak ada biaya pendaftaran. Tidak ada target minimum. Tidak perlu stok.
          </p>
          <p className="text-violet-200 text-sm mb-8">Cukup bagikan link Anda — dan komisi mulai masuk setiap bulan.</p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 font-bold gap-2 px-10 h-12" data-testid="btn-cta-daftar">
              <Share2 className="h-5 w-5" /> Daftar via WhatsApp Sekarang
            </Button>
          </a>
          <p className="text-xs text-violet-300 mt-4">Respon dalam 1×24 jam kerja · Tim siap membantu setup Anda</p>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-400 text-xs">
        <p className="mb-1">© 2026 Gustafta. Platform AI Chatbot Builder Indonesia.</p>
        <div className="flex justify-center gap-4">
          <Link href="/"><span className="hover:text-white cursor-pointer">Beranda</span></Link>
          <Link href="/mitra"><span className="hover:text-white cursor-pointer">Mitra</span></Link>
          <Link href="/trilogi"><span className="hover:text-white cursor-pointer">Trilogi</span></Link>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
