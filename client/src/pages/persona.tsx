import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Check, ArrowRight, MessageCircle, Award, Briefcase, Users,
  GraduationCap, HardHat, Scale, Stethoscope, Zap, Star, ChevronRight,
} from "lucide-react";

const WA_URL = "https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20ingin%20konsultasi%20solusi%20AI%20sesuai%20profesi%20saya";
const CHECKOUT_URL = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533206&qty=1";
const CHECKOUT_BASIC = "https://dialog.gustafta.my.id/c/checkout?variant_ids=533205&qty=1";

const PERSONAS = [
  {
    id: "asesor",
    icon: <Award className="h-8 w-8 text-amber-600" />,
    color: "amber",
    title: "Asesor Kompetensi",
    subtitle: "LSP · BNSP · SKK · SKKNI",
    hero: "Asesor yang Lebih Efisien, Bukan Lebih Sibuk",
    pain: "Anda menghabiskan waktu berjam-jam menjawab pertanyaan yang sama dari asesi — soal persyaratan, regulasi, dan prosedur sertifikasi.",
    solution: "Chatbot AI yang memahami skema SKK, SKKNI, dan regulasi BNSP — siap menjawab pertanyaan asesi 24/7, menyisakan waktu Anda untuk asesmen yang bermakna.",
    usecases: [
      "FAQ persyaratan sertifikasi otomatis",
      "Panduan persiapan portofolio asesi",
      "Informasi skema SKK per jabatan",
      "Follow-up jadwal & dokumen pendaftaran",
    ],
    tools: ["PanduanASKOM", "ManprojakClaw", "ArsitekturClaw", "IBTUClaw"],
    cta: CHECKOUT_URL,
  },
  {
    id: "konsultan",
    icon: <Briefcase className="h-8 w-8 text-blue-600" />,
    color: "blue",
    title: "Konsultan Independen",
    subtitle: "Konsultan · Advisor · Freelancer Profesional",
    hero: "Skalakan Layanan Konsultasi Tanpa Tambah Tim",
    pain: "Waktu Anda terbatas, klien terus bertambah. Pertanyaan berulang menguras energi yang harusnya untuk pekerjaan strategis.",
    solution: "Chatbot AI yang merepresentasikan keahlian Anda — menjawab pertanyaan klien, melakukan pre-screening, dan mengumpulkan brief awal secara otomatis.",
    usecases: [
      "Pre-screening klien baru otomatis",
      "FAQ layanan & pricing Anda",
      "Pengumpulan brief proyek",
      "Follow-up proposal & onboarding",
    ],
    tools: ["Gustafta Builder", "KontrakClaw", "KorporasiClaw", "KeuanganClaw"],
    cta: CHECKOUT_BASIC,
  },
  {
    id: "trainer",
    icon: <GraduationCap className="h-8 w-8 text-violet-600" />,
    color: "violet",
    title: "Trainer & Coach",
    subtitle: "Pelatih · Fasilitator · Learning Consultant",
    hero: "Buat Peserta Belajar Kapan Saja, Bukan Hanya Saat Sesi",
    pain: "Materi pelatihan Anda berharga, tapi peserta hanya bisa mengaksesnya saat sesi berlangsung. Di luar itu, mereka bingung sendiri.",
    solution: "Chatbot AI yang menjadi 'tutor 24/7' untuk peserta Anda — menjawab pertanyaan, memberikan latihan soal, dan memantau pemahaman antara sesi.",
    usecases: [
      "Tutor materi kursus antar sesi",
      "Generator soal latihan otomatis",
      "Reminder assignment & deadline",
      "Onboarding peserta batch baru",
    ],
    tools: ["EducounselClaw", "IBTUClaw", "ETLOAcademyClaw", "TutorTeknikClaw"],
    cta: CHECKOUT_BASIC,
  },
  {
    id: "k3",
    icon: <HardHat className="h-8 w-8 text-orange-600" />,
    color: "orange",
    title: "Spesialis K3",
    subtitle: "HSE Officer · Ahli K3 · Safety Manager",
    hero: "Jadikan Standar K3 Mudah Diakses Seluruh Tim",
    pain: "Prosedur K3 ada di dokumen tebal yang tidak pernah dibaca. Insiden terjadi bukan karena tidak ada aturan, tapi karena aturan tidak mudah diakses.",
    solution: "Chatbot AI K3 yang bisa diakses dari HP lapangan — menjawab pertanyaan prosedur, checklist inspeksi, dan panduan regulasi K3 secara instan.",
    usecases: [
      "Panduan prosedur K3 lapangan",
      "Checklist inspeksi digital",
      "FAQ regulasi Kemnaker & SMK3",
      "Laporan temuan K3 otomatis",
    ],
    tools: ["CSMSClaw", "SMK3Claw", "SafiraClaw", "K3ManClaw"],
    cta: CHECKOUT_URL,
  },
  {
    id: "legal",
    icon: <Scale className="h-8 w-8 text-indigo-600" />,
    color: "indigo",
    title: "Konsultan Hukum",
    subtitle: "Pengacara · Paralegal · Legal Advisor",
    hero: "Tangani Lebih Banyak Klien Tanpa Lebih Banyak Jam Kerja",
    pain: "Pertanyaan hukum dasar dari calon klien menghabiskan waktu yang bisa digunakan untuk kasus yang lebih kompleks dan bernilai tinggi.",
    solution: "Chatbot AI legal yang melakukan pre-screening calon klien, menjawab FAQ hukum dasar, dan menyiapkan brief awal sebelum konsultasi pertama.",
    usecases: [
      "Pre-screening calon klien",
      "FAQ regulasi bisnis & perizinan",
      "Informasi prosedur hukum dasar",
      "Pengumpulan brief kasus awal",
    ],
    tools: ["LexCom Legal AI", "KontrakClaw", "KorporasiClaw", "OSSClaw"],
    cta: CHECKOUT_URL,
  },
  {
    id: "akademisi",
    icon: <Users className="h-8 w-8 text-teal-600" />,
    color: "teal",
    title: "Akademisi & Peneliti",
    subtitle: "Dosen · Peneliti · Mahasiswa S2/S3",
    hero: "Asisten Riset yang Tidak Pernah Istirahat",
    pain: "Mahasiswa bimbingan terus bertanya hal yang sama. Anda ingin membimbing secara bermakna, tapi waktunya habis untuk pertanyaan teknis berulang.",
    solution: "Chatbot AI akademik yang menjawab pertanyaan metodologi, membantu review literatur, dan membimbing penulisan ilmiah — sehingga sesi bimbingan fokus pada hal substansial.",
    usecases: [
      "Panduan metodologi penelitian",
      "Review literatur & sitasi",
      "Panduan penulisan ilmiah",
      "FAQ prosedur sidang & wisuda",
    ],
    tools: ["RisetSkripsiClaw", "TutorTeknikClaw", "EducounselClaw", "BrainClaw"],
    cta: CHECKOUT_BASIC,
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string }> = {
  amber: { bg: "bg-amber-50 dark:bg-amber-900/10", border: "border-amber-200 dark:border-amber-800", badge: "bg-amber-100 text-amber-700" },
  blue: { bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-200 dark:border-blue-800", badge: "bg-blue-100 text-blue-700" },
  violet: { bg: "bg-violet-50 dark:bg-violet-900/10", border: "border-violet-200 dark:border-violet-800", badge: "bg-violet-100 text-violet-700" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/10", border: "border-orange-200 dark:border-orange-800", badge: "bg-orange-100 text-orange-700" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/10", border: "border-indigo-200 dark:border-indigo-800", badge: "bg-indigo-100 text-indigo-700" },
  teal: { bg: "bg-teal-50 dark:bg-teal-900/10", border: "border-teal-200 dark:border-teal-800", badge: "bg-teal-100 text-teal-700" },
};

export default function PersonaPage() {
  const { isAuthenticated } = useAuth();
  const builderUrl = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white dark:bg-background" data-testid="page-persona">
      <SharedHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-slate-800 py-20 md:py-28 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-6">
            <Award className="h-3.5 w-3.5" />
            AI Chatbot Sesuai Profesi Anda
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Bukan untuk Semua Orang —<br />
            <span className="text-gray-300">Dibuat Khusus untuk Anda</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Setiap profesi punya tantangan unik. Gustafta menyediakan konfigurasi AI
            yang berbicara bahasa Anda, memahami regulasi Anda, dan memecahkan masalah
            spesifik di bidang Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold gap-2 px-8 h-12" data-testid="btn-hero-konsultasi">
                <MessageCircle className="h-5 w-5" /> Konsultasi Gratis
              </Button>
            </a>
            <Link href={builderUrl}>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 px-8 h-12" data-testid="btn-hero-builder">
                Coba Builder <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PERSONA CARDS ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-2">Pilih Profesi Anda</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Untuk Siapa Gustafta Dirancang?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {PERSONAS.map((p) => {
              const colors = colorMap[p.color];
              return (
                <div key={p.id} className={`rounded-2xl border-2 ${colors.bg} ${colors.border} p-6`} data-testid={`card-persona-${p.id}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-white dark:bg-background rounded-xl shadow-sm flex-shrink-0">{p.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{p.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground">{p.subtitle}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">"{p.hero}"</p>
                    <p className="text-xs text-gray-500 dark:text-muted-foreground leading-relaxed mb-2">
                      <span className="font-semibold text-red-500">Masalah:</span> {p.pain}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-green-600">Solusi:</span> {p.solution}
                    </p>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {p.usecases.map((uc, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-gray-700 dark:text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        {uc}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tools.map((tool, j) => (
                      <span key={j} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {tool}
                      </span>
                    ))}
                  </div>
                  <a href={p.cta} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full font-bold text-sm h-9" data-testid={`btn-persona-cta-${p.id}`}>
                      Mulai sebagai {p.title} →
                    </Button>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TIDAK ADA DI SINI ── */}
      <section className="py-16 px-4 bg-white dark:bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Profesi Lain?</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profesi Anda Tidak Tercantum?</h2>
          <p className="text-sm text-gray-500 dark:text-muted-foreground mb-6 leading-relaxed">
            Gustafta dapat dikonfigurasi untuk hampir semua profesi dan industri.
            Hubungi tim kami untuk konsultasi gratis — kami akan bantu rancang
            solusi AI yang tepat untuk pekerjaan Anda.
          </p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer">
            <Button className="font-bold gap-2" data-testid="btn-konsultasi-custom">
              <MessageCircle className="h-4 w-4" /> Konsultasi Profesi Saya →
            </Button>
          </a>
        </div>
      </section>

      {/* ── PERBANDINGAN ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pilih Paket</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10">Mulai dari Mana?</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-gray-200 dark:border-border text-left">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Starter Kit</h3>
              <p className="text-xs text-gray-500 mb-4">Untuk yang ingin coba dulu sebelum komitmen lebih besar</p>
              <ul className="space-y-2 mb-5 text-xs text-gray-700 dark:text-muted-foreground">
                {["Buku I + Panduan Builder", "15 Prompt Pack starter", "Cocok untuk 1 profesi"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-green-500" />{item}</li>
                ))}
              </ul>
              <a href={CHECKOUT_BASIC} target="_blank" rel="noopener noreferrer">
                <Button className="w-full" variant="outline" data-testid="btn-paket-basic">
                  Ambil Starter Kit →
                </Button>
              </a>
            </div>
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-orange-400 text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full">PALING LENGKAP</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Bundle Trilogi</h3>
              <p className="text-xs text-gray-500 mb-4">Untuk yang serius membangun penghasilan baru dari keahliannya</p>
              <ul className="space-y-2 mb-5 text-xs text-gray-700 dark:text-muted-foreground">
                {["3 Buku + 50+ Prompt Pack", "Template 6-agen AI siap pakai", "1 Bulan Builder Gratis"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-green-500" />{item}</li>
                ))}
              </ul>
              <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold" data-testid="btn-paket-bundle">
                  Ambil Bundle Trilogi →
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-800 to-slate-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">AI yang Memahami Profesi Anda</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Mulai dari Starter Kit, atau langsung investasi di Bundle Trilogi untuk hasil lebih lengkap.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold gap-2 px-8 h-12" data-testid="btn-cta-bundle">
                Ambil Bundle Trilogi <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2" data-testid="btn-cta-wa">
                <MessageCircle className="h-4 w-4" /> Chat WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-400 text-xs">
        <p className="mb-1">© 2026 Gustafta. Platform AI Chatbot Builder Indonesia.</p>
        <div className="flex justify-center gap-4">
          <Link href="/"><span className="hover:text-white cursor-pointer">Beranda</span></Link>
          <Link href="/starter-kit"><span className="hover:text-white cursor-pointer">Starter Kit</span></Link>
          <Link href="/industri"><span className="hover:text-white cursor-pointer">Per Industri</span></Link>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
