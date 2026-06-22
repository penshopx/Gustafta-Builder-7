import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SharedHeader } from "@/components/shared-header";
import { Smartphone, LayoutGrid, ChevronRight } from "lucide-react";

const CLAW_CATEGORIES = [
  {
    label: "Sertifikasi & Izin Usaha BUJK", color: "amber", icon: "🏗️",
    items: [
      { name: "SBUClaw", href: "/sbu-claw", desc: "Sertifikasi Badan Usaha Konstruksi" },
      { name: "LKUTClaw", href: "/lkut-claw", desc: "Laporan Keuangan Usaha Tahunan" },
      { name: "PUB-LKUTClaw", href: "/pub-lkut-claw", desc: "Pengembangan Usaha Berkelanjutan & LKUT" },
      { name: "PJBUClaw", href: "/pjbu-claw", desc: "Personel Manajerial BUJK" },
      { name: "KeuanganClaw", href: "/keuangan-claw", desc: "Keuangan & Kesehatan Finansial BUJK" },
      { name: "PajakClaw", href: "/pajak-claw", desc: "Pajak & Kepatuhan Perpajakan Indonesia" },
      { name: "ABUClaw", href: "/abu-claw", desc: "Konsultan ABU & LSBU" },
      { name: "PanduanSBU", href: "/panduan-sbu", desc: "Tanya Jawab SBU — answer machine" },
      { name: "SkemaClaw", href: "/skema-claw", desc: "Sertifikasi BUJK Permen PU 6/2025" },
    ],
  },
  {
    label: "Tender & Pengadaan", color: "indigo", icon: "📋",
    items: [
      { name: "TenderaClaw", href: "/tendera-claw", desc: "Analisis Tender BUJK + Win Probability" },
      { name: "KonstraTenderClaw", href: "/konstra-tender-claw", desc: "Monitor Tender SIRUP BKAD" },
      { name: "BGClaw", href: "/bg-claw", desc: "Ruang Lingkup Bangunan Gedung" },
      { name: "BSClaw", href: "/bs-claw", desc: "Ruang Lingkup Bangunan Sipil" },
      { name: "IMClaw", href: "/im-claw", desc: "Instalasi Mekanikal-Elektrikal" },
      { name: "KOClaw", href: "/ko-claw", desc: "Konstruksi Spesialis" },
      { name: "KKClaw", href: "/kk-claw", desc: "Jasa Konsultansi Konstruksi" },
    ],
  },
  {
    label: "SKK & Kompetensi TKK", color: "teal", icon: "🎓",
    items: [
      { name: "PanduanASKOM", href: "/panduan-askom", desc: "Tanya Jawab SKK — answer machine" },
      { name: "TerasLPJK#1", href: "/teras-lpjk-1", desc: "Sharing Knowledge Sertifikasi SKK" },
      { name: "ManprojakClaw", href: "/manprojak-claw", desc: "SKK Manajemen Pelaksanaan Konstruksi" },
      { name: "ArsitekturClaw", href: "/arsitektur-claw", desc: "SKK Klasifikasi Arsitektur" },
      { name: "SurveiPemetaanClaw", href: "/surveipemetaan-claw", desc: "SKK Survei & Pemetaan" },
      { name: "GeoteknikClaw", href: "/geoteknik-claw", desc: "SKK Sipil (Geoteknik)" },
      { name: "JalanJembatanClaw", href: "/jalanjembatan-claw", desc: "SKK Sipil (Jalan & Jembatan)" },
      { name: "TataLingkunganClaw", href: "/tatalingkungan-claw", desc: "SKK Tata Lingkungan" },
      { name: "ElektrikalClaw", href: "/elektrikal-claw", desc: "SKK Klasifikasi Elektrikal" },
      { name: "SafiraClaw", href: "/safira-claw", desc: "SKK K3 Konstruksi" },
    ],
  },
  {
    label: "K3, HSE & IMS", color: "red", icon: "⛑️",
    items: [
      { name: "CSMSClaw", href: "/csms-claw", desc: "Contractor Safety Management System" },
      { name: "SMK3Claw", href: "/smk3-claw", desc: "IMS & SMK3 Terintegrasi" },
      { name: "K3ManClaw", href: "/k3man-claw", desc: "Manajemen K3 Konstruksi & SKK" },
      { name: "OffshoreSafetyClaw", href: "/offshore-safety-claw", desc: "K3 & Operasi Migas Offshore" },
    ],
  },
  {
    label: "ISO & Kepatuhan", color: "blue", icon: "📜",
    items: [
      { name: "ISOClaw 9001", href: "/iso-claw-9001", desc: "SMM ISO 9001 Jasa Konstruksi" },
      { name: "ISOClaw 14001", href: "/iso-claw-14001", desc: "SML ISO 14001 Jasa Konstruksi" },
      { name: "SMAPClaw", href: "/smap-claw", desc: "ISO 37001 Anti-Penyuapan" },
      { name: "PanCEKClaw", href: "/pancek-claw", desc: "KPK & Kepatuhan Anti-Korupsi" },
      { name: "NSPKNavigatorClaw", href: "/nspk-navigator-claw", desc: "Panduan NSPK & Standar Teknis" },
      { name: "HACCPClaw", href: "/haccp-claw", desc: "HACCP, BPOM & Sertifikasi Halal" },
    ],
  },
  {
    label: "Teknik & Konsultansi", color: "sky", icon: "🔧",
    items: [
      { name: "SipilClaw", href: "/sipil-claw", desc: "Konsultan Teknik Sipil" },
      { name: "MEPClaw", href: "/mep-claw", desc: "Konsultan MEP" },
      { name: "LingkunganClaw", href: "/lingkungan-claw", desc: "Konsultan Lingkungan Hidup" },
      { name: "BIMClaw", href: "/bim-claw", desc: "Konsultan BIM & Konstruksi Digital" },
      { name: "DesainClaw", href: "/desain-claw", desc: "Konsultan Desain Arsitektur" },
      { name: "QSClaw", href: "/qs-claw", desc: "Quantity Surveying & Estimasi Biaya" },
      { name: "PengawasClaw", href: "/pengawas-claw", desc: "Pengawas Konstruksi & SKK" },
      { name: "KontrakClaw", href: "/kontrak-claw", desc: "Manajemen Kontrak & Klaim" },
      { name: "SiteOpsClaw", href: "/siteops-claw", desc: "Operasional Lapangan" },
    ],
  },
  {
    label: "Perizinan & Investasi", color: "cyan", icon: "📑",
    items: [
      { name: "ESIMPANClaw", href: "/esimpan-claw", desc: "Input Pengalaman BUJK & TKK di E-SIMPAN" },
      { name: "LKPMClaw", href: "/lkpm-claw", desc: "LKPM & Penanaman Modal BKPM" },
      { name: "OSSClaw", href: "/oss-claw", desc: "OSS-RBA, NIB & Perizinan" },
    ],
  },
  {
    label: "Energi & Pertambangan", color: "orange", icon: "⚡",
    items: [
      { name: "KetenagalistrikanClaw", href: "/ketenagalistrikan-claw", desc: "Konsultan Ketenagalistrikan" },
      { name: "EnergiClaw", href: "/energi-claw", desc: "Konsultan Energi & EBT" },
      { name: "EBTSolarClaw", href: "/ebt-solar-claw", desc: "PLTS & Energi Surya" },
      { name: "TransisiEnergiClaw", href: "/transisi-energi-claw", desc: "Konsultan Transisi Energi" },
      { name: "MigasClaw", href: "/migas-claw", desc: "Kompetensi & Perizinan Energi Migas" },
      { name: "PertambanganClaw", href: "/pertambangan-claw", desc: "Konsultan Pertambangan" },
      { name: "GeologiClaw", href: "/geologi-claw", desc: "Konsultan Geologi & Eksplorasi" },
      { name: "TransmisiClaw", href: "/transmisi-claw", desc: "Transmisi & Gardu Induk PLN" },
    ],
  },
  {
    label: "Properti & Real Estate", color: "violet", icon: "🏠",
    items: [
      { name: "DevPropertiClaw", href: "/dev-properti-claw", desc: "Developer Real Estate" },
      { name: "EstateCareClaw", href: "/estate-care-claw", desc: "Konsultan Properti Konsumen" },
    ],
  },
  {
    label: "Manajemen Proyek Konstruksi", color: "slate", icon: "🏢",
    items: [
      { name: "KonstraClaw", href: "/konstra-claw", desc: "Manajemen Proyek Konstruksi" },
      { name: "BrainClaw", href: "/brain-claw", desc: "Project Intelligence AI" },
    ],
  },
  {
    label: "Pendidikan & Sertifikasi", color: "emerald", icon: "📚",
    items: [
      { name: "EducounselClaw", href: "/educounsel-claw", desc: "Konseling Akademik" },
      { name: "IBTUClaw", href: "/ibtu-claw", desc: "IB Testing Unit AI" },
      { name: "ETLOAcademyClaw", href: "/etlo-academy-claw", desc: "Program ETLO Energi & Sertifikasi EBT" },
      { name: "ETLOBizDevClaw", href: "/etlo-bizdev-claw", desc: "Strategi Bisnis & Pengembangan ETLO" },
      { name: "TutorTeknikClaw", href: "/tutor-teknik-claw", desc: "AI Tutor Teknik untuk Mahasiswa" },
      { name: "RisetSkripsiClaw", href: "/riset-skripsi-claw", desc: "Konsultan Riset & Skripsi" },
    ],
  },
  {
    label: "Bisnis, HR & Operasional", color: "rose", icon: "💼",
    items: [
      { name: "DigitalMarketingClaw", href: "/digital-marketing-claw", desc: "Konsultan Digital Marketing" },
      { name: "CrmSalesClaw", href: "/crm-sales-claw", desc: "Konsultan CRM & Sales" },
      { name: "BrandContentClaw", href: "/brand-content-claw", desc: "Konsultan Brand & Content" },
      { name: "EcommerceClaw", href: "/ecommerce-claw", desc: "Konsultan E-Commerce" },
      { name: "RekrutmenClaw", href: "/rekrutmen-claw", desc: "Konsultan Rekrutmen" },
      { name: "LdKompetensiClaw", href: "/ld-kompetensi-claw", desc: "Konsultan Learning & Development" },
      { name: "PenilaianKinerjaClaw", href: "/penilaian-kinerja-claw", desc: "Konsultan Manajemen Kinerja" },
      { name: "HubunganIndustrialClaw", href: "/hubungan-industrial-claw", desc: "HR & Industrial Relations" },
      { name: "ESGClaw", href: "/esg-claw", desc: "ESG & Keberlanjutan Indonesia" },
      { name: "LeanOpExClaw", href: "/lean-opex-claw", desc: "Lean Manufacturing & OpEx" },
      { name: "SupplyChainClaw", href: "/supply-chain-claw", desc: "Supply Chain & Logistics" },
      { name: "Industri40Claw", href: "/industri40-claw", desc: "Industri 4.0 & Digital Manufacturing" },
    ],
  },
  {
    label: "Regulasi, Hukum & Keamanan", color: "gray", icon: "⚖️",
    items: [
      { name: "KorporasiClaw", href: "/korporasi-claw", desc: "Konsultan Korporasi & Bisnis" },
      { name: "CybersecurityClaw", href: "/cybersecurity-claw", desc: "Cybersecurity & PDP Indonesia" },
    ],
  },
];

const COLOR_MAP: Record<string, { badge: string; label: string; card: string }> = {
  amber:   { badge: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",   label: "text-amber-600 dark:text-amber-400 border-amber-500/20",   card: "hover:border-amber-400 dark:hover:border-amber-600" },
  indigo:  { badge: "bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300", label: "text-indigo-600 dark:text-indigo-400 border-indigo-500/20", card: "hover:border-indigo-400 dark:hover:border-indigo-600" },
  teal:    { badge: "bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300",       label: "text-teal-600 dark:text-teal-400 border-teal-500/20",       card: "hover:border-teal-400 dark:hover:border-teal-600" },
  red:     { badge: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300",           label: "text-red-600 dark:text-red-400 border-red-500/20",           card: "hover:border-red-400 dark:hover:border-red-600" },
  blue:    { badge: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300",       label: "text-blue-600 dark:text-blue-400 border-blue-500/20",       card: "hover:border-blue-400 dark:hover:border-blue-600" },
  sky:     { badge: "bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300",           label: "text-sky-600 dark:text-sky-400 border-sky-500/20",           card: "hover:border-sky-400 dark:hover:border-sky-600" },
  cyan:    { badge: "bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300",       label: "text-cyan-600 dark:text-cyan-400 border-cyan-500/20",       card: "hover:border-cyan-400 dark:hover:border-cyan-600" },
  orange:  { badge: "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300", label: "text-orange-600 dark:text-orange-400 border-orange-500/20", card: "hover:border-orange-400 dark:hover:border-orange-600" },
  violet:  { badge: "bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300", label: "text-violet-600 dark:text-violet-400 border-violet-500/20", card: "hover:border-violet-400 dark:hover:border-violet-600" },
  slate:   { badge: "bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300",   label: "text-slate-600 dark:text-slate-400 border-slate-500/20",   card: "hover:border-slate-400 dark:hover:border-slate-600" },
  emerald: { badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300", label: "text-emerald-600 dark:text-emerald-400 border-emerald-500/20", card: "hover:border-emerald-400 dark:hover:border-emerald-600" },
  rose:    { badge: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300",       label: "text-rose-600 dark:text-rose-400 border-rose-500/20",       card: "hover:border-rose-400 dark:hover:border-rose-600" },
  gray:    { badge: "bg-gray-500/10 border-gray-500/30 text-gray-700 dark:text-gray-300",       label: "text-gray-600 dark:text-gray-400 border-gray-500/20",       card: "hover:border-gray-400 dark:hover:border-gray-600" },
};

const totalClaws = CLAW_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);

export default function MulticlawPage() {
  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      {/* Hero */}
      <section className="py-14 px-4 border-b bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-2 rounded-full mb-5">
            <LayoutGrid className="w-3.5 h-3.5" /> Suite Premium — {totalClaws} MultiClaw AI Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Semua MultiClaw<br className="hidden md:block" /> dalam Satu Halaman
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed mb-6">
            Setiap "Claw" adalah tim AI spesialis yang bekerja paralel. Pilih domain Anda, klik, dan langsung tanya — tanpa perlu setup apapun.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {CLAW_CATEGORIES.map((cat) => (
              <a key={cat.label} href={`#${cat.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all hover:shadow-sm cursor-pointer ${COLOR_MAP[cat.color].badge}`}>
                {cat.icon} {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          {CLAW_CATEGORIES.map((cat) => {
            const c = COLOR_MAP[cat.color];
            return (
              <div key={cat.label} id={cat.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}>
                <div className={`flex items-center gap-2 mb-4 pb-2 border-b ${c.label}`}>
                  <span className="text-xl">{cat.icon}</span>
                  <h2 className="text-sm font-bold uppercase tracking-wider">{cat.label}</h2>
                  <span className="text-xs text-muted-foreground font-normal normal-case">({cat.items.length} Claw)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {cat.items.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <div className={`rounded-xl border p-4 bg-background cursor-pointer transition-all hover:shadow-md ${c.card}`}
                        data-testid={`card-multiclaw-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm mb-0.5">{item.name}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 border-t bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-2">Tidak Menemukan Claw yang Anda Butuhkan?</h2>
          <p className="text-sm text-muted-foreground mb-5">Claw baru ditambahkan setiap bulan. Hubungi kami untuk request domain baru.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/6281287941900" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 font-bold" data-testid="button-multiclaw-request-wa">
                <Smartphone className="w-4 h-4" /> Request Claw Baru
              </Button>
            </a>
            <Link href="/">
              <Button size="lg" variant="outline" className="gap-2 font-semibold" data-testid="button-multiclaw-back-landing">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
