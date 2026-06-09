import { Link } from "wouter";
import { useState } from "react";
import { Award, Brain, Target, TrendingUp, ChevronRight, Sparkles, GraduationCap, Shield, BarChart3, Zap, BookOpen, Users, Building2, CheckCircle2, ClipboardList, Search, FileText, DollarSign, RefreshCw, MessageSquare, Briefcase, LayoutList, MapPin, Calculator, FileCheck, Layers, Monitor, CheckSquare, Building, ScrollText, FileBadge, HardHat, ArrowRightLeft, ShieldAlert, Clock, Gavel, BadgeCheck, FileSignature, FileEdit, ClipboardCheck, AlertOctagon, Umbrella, X, FileBarChart, Users2, ArrowUpFromLine, ClipboardSignature, Handshake, TrendingDown, ShieldCheck, Flame, AlertTriangle, Scale, Gauge, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const WAVES = [
  {
    wave: "Gelombang 1",
    period: "2026–2027",
    theme: "Digital Compliance & Certification",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    items: ["E-Sertifikat + QR Verifikasi", "Mock Asesmen SKK", "Diagnostik Kompetensi AI"],
  },
  {
    wave: "Gelombang 2",
    period: "2027–2028",
    theme: "Skills-Based Talent Economy",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    items: ["Skills Map & Analytics", "Mini Apps Practice Layer", "Generator Dokumen BUJK"],
  },
  {
    wave: "Gelombang 3",
    period: "2029–2030",
    theme: "Immersive & Autonomous Learning",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    items: ["AI Assessment Engine", "Green Jobs Certification", "RPL.AI Automation"],
  },
];

const TOOLS = [
  {
    href: "/sertifikat-digital",
    icon: Award,
    label: "SERTIVA",
    sublabel: "E-Sertifikat Digital + QR",
    desc: "Terbitkan sertifikat digital terverifikasi dengan QR code untuk pelatihan, bimtek, & uji kompetensi.",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "Gelombang 1",
    badgeColor: "text-amber-400 border-amber-400/30",
    live: true,
  },
  {
    href: "/diagnostik-kompetensi",
    icon: Brain,
    label: "Diagnostik Kompetensi",
    sublabel: "Gap Analysis AI — SKK/KKNI",
    desc: "Analisis AI terhadap profil pendidikan & pengalaman untuk menentukan level KKNI dan gap kompetensi.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 1",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/mock-asesmen",
    icon: Target,
    label: "Mock Asesmen SKK",
    sublabel: "Simulasi Uji Kompetensi AI",
    desc: "Latihan soal uji kompetensi berbasis SKKNI/BNSP dengan penilaian dan penjelasan per soal.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 1",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/persiapan-asesmen",
    icon: ClipboardList,
    label: "Persiapan Asesmen SKK",
    sublabel: "Paket Dokumen + Tips Asesor",
    desc: "Generate checklist dokumen, unit kompetensi prioritas, tips wawancara asesor, dan estimasi biaya sertifikasi.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 1",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/cek-kelayakan-skk",
    icon: Search,
    label: "Cek Kelayakan SKK",
    sublabel: "SKK apa yang bisa diambil sekarang?",
    desc: "Input pendidikan + pengalaman → AI menampilkan semua jabatan SKK eligible sekarang, yang bisa dicapai 1-2 tahun, dan urutan prioritas strategis.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 2",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/generator-apl02",
    icon: FileText,
    label: "Generator APL-02 Asesmen Mandiri",
    sublabel: "Formulir SKK otomatis dari pengalamanmu",
    desc: "Ceritakan pengalaman kerja → AI pre-fills seluruh APL-02 (klaim K/BK, konfidensitas, jenis bukti, dokumen pendukung) per unit SKKNI.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 2",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/roi-karir-skk",
    icon: DollarSign,
    label: "ROI & Karir SKK",
    sublabel: "Berapa kenaikan gaji & kapan balik modal?",
    desc: "Input jabatan + gaji + target SKK → proyeksi kenaikan gaji, breakeven biaya sertifikasi, ROI 5 tahun, dan roadmap SKK lanjutan.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 2",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/syarat-personel-bujk",
    icon: Building2,
    label: "Syarat Personel & Compliance BUJK",
    sublabel: "Permen PUPR 6/2025 — PJT/PJK/Tenaga Ahli",
    desc: "Pilih klasifikasi + grade BUJK → lihat syarat personel SKK wajib, atau input personel yang ada untuk compliance check + gap analysis.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 2",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/generator-dokumen-skk",
    icon: FileText,
    label: "Generator Dokumen SKK",
    sublabel: "Surat Pernyataan · Keterangan Kerja · Pengantar LSP",
    desc: "Generate 3 jenis surat resmi aplikasi SKK: surat pernyataan pengalaman kerja (bermaterai), surat keterangan kerja, dan surat pengantar ke LSP — siap cetak.",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    bg: "bg-sky-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-sky-400 border-sky-400/30",
    live: true,
  },
  {
    href: "/validator-klaim-uk",
    icon: BadgeCheck,
    label: "Validator Klaim Unit Kompetensi SKK",
    sublabel: "Nilai kekuatan klaim sebelum asesmen · skor per unit · saran perkuatan",
    desc: "Deskripsikan pengalaman per unit kompetensi + bukti yang dimiliki → AI nilai kekuatan klaim seperti asesor sungguhan (Kuat/Cukup/Lemah/Tidak Cukup), skor 0–100, analisis objektif, dan saran konkret untuk memperkuat bukti sebelum mendaftar asesmen.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "Gelombang 10",
    badgeColor: "text-indigo-400 border-indigo-400/30",
    live: true,
  },
  {
    href: "/generator-bast-proyek",
    icon: FileSignature,
    label: "Generator BAST Proyek Konstruksi",
    sublabel: "Draft Berita Acara Serah Terima formal + checklist lampiran",
    desc: "Pilih jenis proyek + jenis serah terima (BAST Pertama, Kedua, Parsial, CCO) → AI generate draft BAST dengan bahasa hukum formal, ruang identitas pihak, klausul masa pemeliharaan, checklist 8–10 dokumen wajib, dan catatan penting proses serah terima.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 10",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/panduan-iujk-sbu",
    icon: Building2,
    label: "Panduan Pengurusan SBU & IUJK",
    sublabel: "Dari SKK ke SBU — SKK wajib, dokumen, OSS-RBA, biaya, tips",
    desc: "Pilih klasifikasi + kualifikasi + kondisi perusahaan → AI susun panduan lengkap: SKK yang wajib dimiliki, dokumen yang dibutuhkan, langkah di OSS-RBA/SIKI per tahap, estimasi waktu dan biaya, tips sukses, dan kesalahan yang sering menyebabkan penolakan.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 10",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/generator-rmk",
    icon: ClipboardList,
    label: "Generator Rencana Mutu Kontrak (RMK)",
    sublabel: "Draft RMK 7 bab · indikator mutu · jadwal peninjauan",
    desc: "Input jenis proyek + nama + peran penyusun + durasi → AI generate draft RMK terstruktur 7 bab (Pendahuluan → Pengendalian Mutu → K3 → Pelaporan) dengan konten spesifik per jenis proyek, indikator mutu, dan jadwal peninjauan. Format sesuai Perlem LKPP.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 10",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/simulator-csms",
    icon: HardHat,
    label: "Simulator CSMS / Safety Pre-Qualification",
    sublabel: "Latihan menjawab evaluasi K3 dari Owner/Principal",
    desc: "Pilih jenis evaluasi (CSMS, Vendor Assessment, Safety Audit, dll) → AI berperan sebagai auditor K3 senior dan ajukan 6 pertanyaan kritis. Setiap jawaban dinilai 0–10 dengan feedback konstruktif. Skor akhir 0–100 dengan predikat Lulus / Kondisional / Belum Lulus.",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "Gelombang 10",
    badgeColor: "text-red-400 border-red-400/30",
    live: true,
  },
  // ===== GELOMBANG 11 =====
  {
    href: "/generator-surat-penawaran",
    icon: FileEdit,
    label: "Generator Surat Penawaran",
    sublabel: "Draft teknis & harga untuk tender konstruksi",
    desc: "Pilih jenis pekerjaan + nama paket → AI generate surat penawaran teknis & harga lengkap format tender konstruksi Indonesia: pembuka, data penawaran, lingkup, harga, jangka waktu, syarat pembayaran, keunggulan, penutup + lampiran.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 11",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/kalkulator-eskalasi-harga",
    icon: TrendingUp,
    label: "Kalkulator Eskalasi Harga Material",
    sublabel: "Hitung dampak IHK & estimasi klaim CCO addendum",
    desc: "Input indeks harga konstruksi BPS awal vs akhir per material + volume → hitung eskalasi bruto dan klaim bersih berdasarkan klausul persentase (Perpres 12/2021 Pasal 57–58). Update real-time, tanpa AI.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 11",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/panduan-audit-mutu-iso",
    icon: ClipboardCheck,
    label: "Panduan Audit Mutu Internal ISO",
    sublabel: "Pertanyaan audit per klausul · checklist · format laporan",
    desc: "Pilih standar (ISO 9001, 14001, 45001, IMS) + jenis audit → AI generate panduan per klausul: pertanyaan audit, bukti yang dicari, tembuan, risiko potensial, checklist persiapan, tips auditor, dan format laporan sesuai standar.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 11",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/generator-laporan-insiden",
    icon: AlertOctagon,
    label: "Generator Laporan Insiden K3",
    sublabel: "Draft laporan KK/PAK sesuai Permenaker No. 8/2020",
    desc: "Pilih jenis insiden (KK luka ringan/berat/fatal, near miss, kebakaran, dll) + tipe pekerjaan → AI generate laporan insiden formal: kronologi, penyebab langsung & dasar, tindakan darurat, rekomendasi pencegahan + kewajiban pelaporan legal.",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "Gelombang 11",
    badgeColor: "text-red-400 border-red-400/30",
    live: true,
  },
  {
    href: "/asisten-klaim-car",
    icon: Umbrella,
    label: "Asisten Klaim Asuransi CAR",
    sublabel: "Panduan klaim Construction All Risk step-by-step",
    desc: "Pilih jenis klaim CAR (kerusakan material, alat berat, kebakaran, TPL, dll) → AI generate panduan klaim: langkah+batas waktu, dokumen wajib + urgensi, klausul polis relevan, pengecualian yang sering ditolak, dan tips negosiasi dengan insurer.",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "Gelombang 11",
    badgeColor: "text-amber-400 border-amber-400/30",
    live: true,
  },
  {
    href: "/generator-rks",
    icon: ScrollText,
    label: "Generator Dokumen RKS Konstruksi",
    sublabel: "Rencana Kerja dan Syarat teknis per jenis pekerjaan — standar SNI/ASTM",
    desc: "Pilih jenis pekerjaan (pondasi/struktur beton/baja/MEP/jalan/dll), standar referensi (SNI/ASTM/JIS), tingkat detail, dan seksi yang difokuskan → AI generate RKS lengkap per bab: lingkup pekerjaan, material, metode pelaksanaan, pengendalian mutu, K3, dan lampiran.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 18",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/kalkulator-ahsp",
    icon: DollarSign,
    label: "Kalkulator AHSP — Analisa Harga Satuan Pekerjaan",
    sublabel: "Template AHSP PUPR 2022 — koefisien material, upah, alat + overhead",
    desc: "Pilih jenis pekerjaan (beton K-250 / pembesian / bekisting / bata / keramik / cat / galian / dll), edit harga satuan sesuai pasar lokal, atur overhead & profit → kalkulator hitung subtotal material/upah/alat, overhead, harga satuan akhir, dan total untuk volume pekerjaan.",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "Gelombang 18",
    badgeColor: "text-amber-400 border-amber-400/30",
    live: true,
  },
  {
    href: "/panduan-iso-9001",
    icon: CheckSquare,
    label: "Panduan Penerapan ISO 9001:2015 Konstruksi",
    sublabel: "Roadmap QMS, klausul per klausul, dokumen wajib & indikator kesesuaian",
    desc: "Pilih jenis perusahaan konstruksi, skala, status SMM saat ini, dan klausul yang difokuskan → AI generate panduan implementasi ISO 9001:2015: persyaratan + langkah tiap klausul, dokumen wajib, indikator kesesuaian, roadmap dengan timeline, dokumen sistem mutu, dan estimasi biaya.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "Gelombang 18",
    badgeColor: "text-indigo-400 border-indigo-400/30",
    live: true,
  },
  {
    href: "/generator-berita-acara",
    icon: FileEdit,
    label: "Generator Berita Acara Proyek Konstruksi",
    sublabel: "MC, serah terima, adendum, CCO, force majeure, sengketa — siap tanda tangan",
    desc: "Pilih jenis BA (prestasi pekerjaan/MC / serah terima / adendum / perpanjangan waktu / CCO / force majeure / penyelesaian sengketa / dll), isi data proyek dan konteks → AI generate berita acara resmi lengkap: narasi formal, pihak penandatangan, dan daftar lampiran.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 18",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/simulator-ujian-teori-skk",
    icon: BookOpen,
    label: "Simulator Ujian Teori SKK — Bank Soal Pilihan Ganda",
    sublabel: "10–40 soal per bidang & level — kunci jawaban + penjelasan per soal",
    desc: "Pilih bidang SKK (manpro / gedung / jalan / K3 / MEP / geoteknik / dll) dan level (5–8), jumlah soal → AI generate bank soal pilihan ganda (A/B/C/D) berbasis SKKNI. Jawab online, navigasi bebas antar soal, lihat skor akhir + pembahasan kunci jawaban tiap soal + referensi regulasi.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 18",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/generator-surat-kuasa",
    icon: FileSignature,
    label: "Generator Surat Kuasa Proyek Konstruksi",
    sublabel: "Tender, kontrak, rapat, izin, serah terima — surat kuasa formal siap pakai",
    desc: "Pilih keperluan (pengambilan dokumen tender / penandatanganan kontrak / pengurusan PBG / PHO-FHO / dll), isi data pemberi & penerima kuasa → AI generate surat kuasa formal lengkap dengan ketentuan tambahan dan catatan hukum. Siap disalin & ditandatangani.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "Gelombang 17",
    badgeColor: "text-indigo-400 border-indigo-400/30",
    live: true,
  },
  {
    href: "/kalkulator-material-beton",
    icon: Calculator,
    label: "Kalkulator Kebutuhan Material Beton",
    sublabel: "K-175 hingga K-500 — semen, pasir, kerikil, air + faktor waste per jenis pekerjaan",
    desc: "Pilih mutu beton (K-175 s/d K-500), jenis pekerjaan (kolom/balok/pelat/pondasi), dan volume → kalkulator hitung kebutuhan semen (sak/kg), pasir (ton), kerikil (ton), air (liter) dengan faktor waste SNI. Lengkap: W/C ratio, slump target, kategori mutu, dan rekomendasi pelaksanaan.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 17",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/panduan-manajemen-risiko",
    icon: AlertOctagon,
    label: "Panduan Manajemen Risiko Proyek",
    sublabel: "Risk register, matriks 5×5, mitigasi & kontingensi — ISO 31000 & PMBOK",
    desc: "Pilih jenis proyek, fase, dan kategori risiko → AI generate risk register lengkap: identifikasi risiko per kategori dengan penyebab & dampak, skor kemungkinan & dampak, level risiko (Sangat Tinggi/Tinggi/Sedang/Rendah), rencana mitigasi, kontingensi, PIC, dan jadwal review.",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "Gelombang 17",
    badgeColor: "text-amber-400 border-amber-400/30",
    live: true,
  },
  {
    href: "/generator-pakta-integritas",
    icon: BadgeCheck,
    label: "Generator Pakta Integritas",
    sublabel: "Anti-KKN, pengadaan, K3, ISO 37001 — pakta formal siap tanda tangan",
    desc: "Pilih jenis pakta (pengadaan Perpres 16/2018 / anti-korupsi KPK / K3 Zero Accident / SMAP ISO 37001 / dll), isi data organisasi dan penandatangan → AI generate pakta integritas resmi lengkap dengan klausul khusus, sanksi pelanggaran, dan landasan hukum yang berlaku.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 17",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/simulator-klarifikasi-tender",
    icon: Briefcase,
    label: "Simulator Klarifikasi Teknis Tender",
    sublabel: "Latih menjawab pertanyaan panitia evaluasi tender — skor & feedback profesional",
    desc: "Pilih jenis tender, posisi dalam tim (direktur/PM/estimator/QS/K3/dll), dan nama proyek → AI panitia mengajukan pertanyaan klarifikasi teknis: metode kerja, jadwal, harga satuan, kualifikasi, K3. Diakhiri skor, kekuatan/kelemahan presentasi, dan saran perbaikan.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 17",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/generator-checklist-serah-terima",
    icon: ClipboardCheck,
    label: "Generator Checklist Serah Terima Proyek",
    sublabel: "PHO & FHO — checklist interaktif per seksi + dokumen pendamping",
    desc: "Pilih jenis proyek, jenis serah terima (PHO/FHO/parsial), dan lingkup pekerjaan → AI generate checklist lengkap per seksi (sipil, MEP, K3, dokumen, dll) dengan kode item, standar penerimaan, status (Wajib/Dianjurkan). Checklist interaktif bisa dicentang & disalin.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 16",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/kalkulator-cashflow-proyek",
    icon: BarChart3,
    label: "Kalkulator Cashflow Proyek Konstruksi",
    sublabel: "Proyeksi cashflow bulanan — defisit puncak, titik impas, kebutuhan kredit",
    desc: "Input nilai kontrak, uang muka, progres per termin, durasi, overhead, retensi, dan pola distribusi pekerjaan (kurva-S/front-loaded/dll) → kalkulator generate cashflow masuk/keluar per bulan, net, kumulatif, defisit puncak, bulan break-even, dan estimasi kebutuhan kredit.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 16",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/panduan-tkdn",
    icon: FileCheck,
    label: "Panduan Pembuatan Dokumen TKDN",
    sublabel: "Perhitungan TKDN, formulir, verifikasi & sanksi — Perpres 16/2018 & revisi",
    desc: "Pilih jenis pekerjaan, skala proyek, sumber komponen, dan sumber pendanaan → AI generate panduan TKDN: nilai minimal yang dipersyaratkan, formula perhitungan, komponen TKDN (material/alat/SDM/umum), dokumen wajib, prosedur verifikasi, sanksi pelanggaran, dan tips.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 16",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/generator-laporan-hse",
    icon: Activity,
    label: "Generator Laporan HSE Bulanan",
    sublabel: "Input data K3 → laporan HSE formal: statistik, insiden, inspeksi, rekomendasi",
    desc: "Input nama proyek, periode, man-hours, jumlah insiden & near miss, inspeksi, temuan kritis, program K3, kondisi umum → AI generate laporan HSE bulanan resmi: statistik K3 (FR/SR/DART), detail insiden, hasil inspeksi per area, program K3, analisis risiko, rekomendasi, target bulan depan.",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bg: "bg-rose-500/5",
    badge: "Gelombang 16",
    badgeColor: "text-rose-400 border-rose-400/30",
    live: true,
  },
  {
    href: "/simulator-asesmen-skk",
    icon: GraduationCap,
    label: "Simulator Asesmen Kompetensi SKK",
    sublabel: "Latih asesmen SKK LPJK vs AI asesor — unit kompetensi & skor akhir",
    desc: "Pilih skema SKK (gedung/jalan/K3/MEP/dll), pengalaman kerja → AI asesor mengajukan pertanyaan berbasis unit kompetensi SKKNI, portofolio, dan observasi. Evaluasi setiap jawaban. Diakhiri skor, UK Kompeten/Belum Kompeten, umpan balik, dan rekomendasi belajar.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 16",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/simulator-negosiasi-harga",
    icon: Scale,
    label: "Simulator Negosiasi Harga Kontrak",
    sublabel: "Latih skill negosiasi kontrak konstruksi vs AI — summary hasil",
    desc: "Pilih posisi (kontraktor/subkon/supplier), lawan negosiasi (owner/procurement/MK), jenis kontrak, nilai penawaran, dan target penekanan harga → AI mensimulasikan sesi negosiasi bolak-balik. Diakhiri summary: nilai disepakati, diskon tercapai, kondisi, dan evaluasi.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 15",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/kalkulator-produktivitas-tk",
    icon: Gauge,
    label: "Kalkulator Produktivitas Tenaga Kerja",
    sublabel: "Efisiensi kerja vs standar SNI — proyeksi penyelesaian pekerjaan",
    desc: "Input jenis pekerjaan (beton/baja/bata/keramik/dll), volume, jumlah TK, jam kerja, faktor cuaca & pengalaman → kalkulator menampilkan produktivitas aktual vs standar SNI, efisiensi (%), volume per hari, proyeksi selesai, dan rekomendasi akselerasi.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 15",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/panduan-sertifikasi-migas",
    icon: Award,
    label: "Panduan Sertifikasi Tenaga Ahli Migas",
    sublabel: "Jalur sertifikasi, persyaratan, prosedur & estimasi biaya SKK Migas",
    desc: "Pilih jabatan target (reservoir/pemboran/produksi/K3 migas/dll), pengalaman, dan subsektor → AI generate panduan lengkap: jalur sertifikasi, lembaga penguji (SKK Migas/BNSP/LSP), persyaratan dokumen, prosedur langkah demi langkah, estimasi biaya & waktu.",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "Gelombang 15",
    badgeColor: "text-amber-400 border-amber-400/30",
    live: true,
  },
  {
    href: "/generator-notulensi",
    icon: ClipboardList,
    label: "Generator Notulensi Rapat Otomatis",
    sublabel: "Input poin diskusi → notulensi formal, keputusan & action item",
    desc: "Pilih jenis rapat, isi peserta, agenda, dan poin-poin diskusi dalam bentuk catatan kasar → AI menyusun notulensi resmi lengkap: agenda & pembahasan per poin, keputusan rapat, tabel action item (kegiatan/PIC/target/status), dan penutup formal. Bisa langsung disalin.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 15",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/simulator-sidang-k3",
    icon: Gavel,
    label: "Simulator Sidang Pelanggaran K3",
    sublabel: "Latih menghadapi sidang K3 vs AI majelis — vonis + rekomendasi",
    desc: "Pilih posisi (kontraktor/HSE officer/site manager), jenis pelanggaran K3 (APD/ketinggian/crane/hot work/dll), dan tingkat pelanggaran → AI majelis sidang memimpin proses sidang resmi, menguji pembelaan Anda. Diakhiri vonis, sanksi, dan rekomendasi perbaikan.",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "Gelombang 15",
    badgeColor: "text-red-400 border-red-400/30",
    live: true,
  },
  {
    href: "/generator-surat-teguran",
    icon: AlertTriangle,
    label: "Generator Surat Teguran Keterlambatan",
    sublabel: "Surat teguran resmi kepada sub-kon / supplier yang terlambat",
    desc: "Pilih tingkat teguran (1-3 atau final), penerima (subkon/supplier/mandor), alasan pelanggaran, dan hari keterlambatan → AI generate surat teguran resmi dengan isi paragraf, tuntutan spesifik, konsekuensi, dan klausul hukum yang relevan.",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "Gelombang 14",
    badgeColor: "text-amber-400 border-amber-400/30",
    live: true,
  },
  {
    href: "/kalkulator-bep-proyek",
    icon: TrendingUp,
    label: "Kalkulator BEP Proyek Konstruksi",
    sublabel: "Hitung Break Even Point, margin profit aktual, komposisi biaya",
    desc: "Input nilai kontrak dan rincian biaya per kategori (material, upah, alat, subkon, overhead) beserta contingency dan target profit → kalkulator menampilkan BEP, margin aktual, status laba/rugi, dan visualisasi komposisi biaya per komponen.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    badge: "Gelombang 14",
    badgeColor: "text-cyan-400 border-cyan-400/30",
    live: true,
  },
  {
    href: "/panduan-smkk",
    icon: ShieldCheck,
    label: "Panduan Penyusunan SMKK",
    sublabel: "Sistem Manajemen Keselamatan Konstruksi — Permen PUPR 10/2021",
    desc: "Pilih jenis proyek, risiko K3 utama, anggaran, dan durasi → AI generate panduan SMKK lengkap: komponen wajib, rencana K3 per elemen, hirarki pengendalian (eliminasi → APD), struktur organisasi K3, dan referensi regulasi yang berlaku.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 14",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/generator-jsa",
    icon: Flame,
    label: "Generator Job Safety Analysis (JSA)",
    sublabel: "HIRARC per langkah kerja — bahaya, risiko, pengendalian, APD",
    desc: "Pilih jenis pekerjaan berisiko (ketinggian, galian dalam, crane, las, dll), kondisi lingkungan, dan level risiko → AI generate JSA dengan identifikasi bahaya per tahap kerja, penilaian risiko, hirarki pengendalian (eliminasi/substitusi/engineering/APD), dan prosedur darurat.",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "Gelombang 14",
    badgeColor: "text-red-400 border-red-400/30",
    live: true,
  },
  {
    href: "/simulator-rapat-evaluasi",
    icon: Users2,
    label: "Simulator Rapat Evaluasi Proyek",
    sublabel: "Latih rapat evaluasi vs AI moderator — notulensi + action item",
    desc: "Pilih jenis rapat (bulanan/mingguan/mutu/K3/keuangan), peran Anda, dan isu yang dibahas → AI moderator memimpin rapat evaluasi formal dengan mensimulasikan peserta berbeda (owner, konsultan, K3). Diakhiri notulensi resmi, keputusan, dan action item.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 14",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/generator-kontrak-sederhana",
    icon: ScrollText,
    label: "Generator Draft Kontrak Sederhana",
    sublabel: "Draft kontrak subkontrak / sewa alat / pengadaan material",
    desc: "Pilih jenis pekerjaan (subkontrak sipil, MEP, finishing, sewa alat, dll), nilai kontrak, metode bayar, dan durasi → AI generate draft kontrak 12 pasal lengkap: para pihak, lingkup, pembayaran, denda, K3, penyelesaian sengketa, dengan catatan hukum.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 13",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/kalkulator-depresiasi-alat",
    icon: TrendingDown,
    label: "Kalkulator Depresiasi Alat Berat",
    sublabel: "Hitung penyusutan alat dengan metode SL, DDB, atau SYD",
    desc: "Pilih jenis alat berat, masukkan nilai perolehan, nilai sisa, dan umur ekonomis → kalkulator hitung depresiasi per tahun dengan tabel lengkap menggunakan metode Straight Line, Double Declining Balance, atau Sum of Years Digits. Cocok untuk RAB dan laporan keuangan BUJK.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 13",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/panduan-kualifikasi-tender",
    icon: Target,
    label: "Panduan Kualifikasi Tender BUJK",
    sublabel: "Gap assessment kualifikasi + strategi pemenangan tender",
    desc: "Pilih jenis pengadaan, metode kualifikasi, klasifikasi SBU, subkualifikasi, dan pengalaman → AI analisis gap persyaratan kualifikasi, skor kesiapan 0-100, checklist dokumen yang perlu disiapkan, dan strategi pemenangan tender berdasarkan Perpres 12/2021.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "Gelombang 13",
    badgeColor: "text-indigo-400 border-indigo-400/30",
    live: true,
  },
  {
    href: "/generator-laporan-mingguan",
    icon: ClipboardList,
    label: "Generator Laporan Mingguan Proyek",
    sublabel: "Draft laporan mingguan Site Manager ke PPK / Owner",
    desc: "Input nama proyek, progress aktual vs rencana, kondisi cuaca, dan kendala → AI generate laporan mingguan profesional: tabel progress per aktivitas, narasi realisasi, isu & risiko, rencana minggu depan, status pembayaran, dan catatan untuk Direksi.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 13",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/simulator-pcm",
    icon: Building2,
    label: "Simulator Pre-Construction Meeting (PCM)",
    sublabel: "Latih PCM vs AI fasilitator — notulensi + evaluasi",
    desc: "Pilih jenis proyek, peran (kontraktor/konsultan/owner), dan topik PCM → AI berperan sebagai fasilitator rapat PCM yang memimpin diskusi jadwal, metode kerja, K3, koordinasi, dan pembayaran. Sesi 7 ronde, diakhiri notulensi resmi dan evaluasi partisipasi.",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bg: "bg-rose-500/5",
    badge: "Gelombang 13",
    badgeColor: "text-rose-400 border-rose-400/30",
    live: true,
  },
  {
    href: "/generator-bapro",
    icon: FileBarChart,
    label: "Generator BAPRO — Berita Acara Kemajuan",
    sublabel: "Draft laporan kemajuan pekerjaan formal untuk pelaporan ke PPK",
    desc: "Input nama proyek, jenis kontrak, periode laporan, dan persentase fisik → AI generate BAPRO lengkap: tabel kemajuan per item, narasi kemajuan, kendala & solusi, rencana periode berikutnya, dan draft penutup dengan placeholder tanda tangan.",
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bg: "bg-green-500/5",
    badge: "Gelombang 12",
    badgeColor: "text-green-400 border-green-400/30",
    live: true,
  },
  {
    href: "/kalkulator-kompensasi-phk",
    icon: Users2,
    label: "Kalkulator Kompensasi PHK",
    sublabel: "Hitung pesangon, UPMK, UPH sesuai PP 35/2021",
    desc: "Pilih alasan PHK (pensiun, efisiensi, pengunduran diri, dll), masukkan masa kerja dan gaji → kalkulator otomatis hitung Uang Pesangon, Uang Penghargaan Masa Kerja, dan Uang Pengganti Hak sesuai UU Cipta Kerja + PP 35/2021.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 12",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/panduan-k3-ketinggian",
    icon: ArrowUpFromLine,
    label: "Panduan K3 Pekerjaan Ketinggian",
    sublabel: "APD wajib, prosedur aman, checklist, prosedur darurat",
    desc: "Pilih jenis pekerjaan ketinggian (scaffolding, bekisting, fasad, gondola, dll) dan rentang ketinggian → AI generate panduan K3 lengkap: APD per standar SNI, prosedur kerja aman, identifikasi risiko + pengendalian hierarkis, checklist sebelum kerja, prosedur darurat.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 12",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/generator-checklist-sta",
    icon: ClipboardSignature,
    label: "Generator Checklist Serah Terima Akhir",
    sublabel: "Checklist PHO/FHO lengkap per kategori pekerjaan",
    desc: "Pilih jenis proyek dan tahapan (PHO/FHO) → AI generate checklist serah terima komprehensif per kategori: arsitektur, struktur, MEP, K3, administrasi — lengkap dengan kriteria kelulusan, status wajib/opsional, referensi SNI, dan daftar dokumen serah terima.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 12",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/simulator-negosiasi-kontrak",
    icon: Handshake,
    label: "Simulator Negosiasi Kontrak",
    sublabel: "Latih negosiasi pasal kritis kontrak konstruksi vs AI",
    desc: "Pilih jenis kontrak, peran Anda, dan topik (denda keterlambatan, pembayaran termin, force majeure, CCO, dll) → AI berperan sebagai pihak lawan yang realistis. Simulasi 5 ronde dengan evaluasi kekuatan argumen yuridis dan skor negosiasi akhir.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 12",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/panduan-mutasi-skk",
    icon: ArrowRightLeft,
    label: "Panduan Mutasi / Alih Profesi SKK",
    sublabel: "Gap unit kompetensi · dokumen yang masih berlaku · langkah mutasi",
    desc: "Pilih jabatan asal dan jabatan tujuan → AI analisis gap unit kompetensi, unit yang masih diakui, dokumen yang bisa dipakai ulang, langkah step-by-step mutasi, keuntungan, dan risiko yang perlu dipertimbangkan.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 9",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/kalkulator-jam-kerja-proyek",
    icon: Clock,
    label: "Kalkulator Jam Kerja & Fatigue Risk",
    sublabel: "Monitor jam kerja · deteksi kelelahan · rekomendasi rotasi",
    desc: "Input data pekerja proyek: jam kerja per minggu, hari berturut tanpa libur, shift malam → kalkulator otomatis deteksi level risiko (Aman/Waspada/Berbahaya/Kritis) sesuai PP 35/2021, visualisasi bar per pekerja. Tanpa AI.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 9",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/panduan-skk-pengadaan",
    icon: Gavel,
    label: "Panduan SKK untuk Pengadaan Konstruksi",
    sublabel: "PPK · PPTK · PP · Pokja · PPHP — SKK wajib + konsekuensi",
    desc: "Pilih jabatan pengadaan + nilai kontrak → AI jelaskan SKK wajib berdasarkan UU Jasa Konstruksi dan regulasi LKPP, konsekuensi tanpa kompetensi, langkah mempersiapkan diri, dan referensi regulasi lengkap.",
    color: "text-slate-300",
    borderColor: "border-slate-500/30",
    bg: "bg-slate-500/5",
    badge: "Gelombang 9",
    badgeColor: "text-slate-300 border-slate-500/30",
    live: true,
  },
  {
    href: "/estimator-biaya-sertifikasi",
    icon: Calculator,
    label: "Estimator Biaya Sertifikasi SKK",
    sublabel: "LSP + pelatihan + dokumen + transportasi + CPD",
    desc: "Pilih jabatan + kota + skala → kalkulator real-time tampilkan estimasi total biaya sertifikasi (min–maks), breakdown per komponen dengan bar chart proporsi, cicilan bulanan, dan ROI kenaikan gaji. Tanpa AI.",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    bg: "bg-sky-500/5",
    badge: "Gelombang 8",
    badgeColor: "text-sky-400 border-sky-400/30",
    live: true,
  },
  {
    href: "/panduan-fresh-graduate-skk",
    icon: GraduationCap,
    label: "Panduan SKK untuk Fresh Graduate",
    sublabel: "Jabatan realistis · jalur RPL magang · langkah konkret",
    desc: "Input jurusan + IPK + pengalaman → AI rekomendasikan 3 jabatan SKK yang realistis dan reachable, strategi memanfaatkan RPL dari magang/KP, 5–6 langkah konkret pertama, dan kesalahan yang harus dihindari.",
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bg: "bg-green-500/5",
    badge: "Gelombang 8",
    badgeColor: "text-green-400 border-green-400/30",
    live: true,
  },
  {
    href: "/tracker-cpd-mandiri",
    icon: TrendingUp,
    label: "Tracker CPD Mandiri SKK",
    sublabel: "Catat aktivitas · hitung poin · pantau progres perpanjangan",
    desc: "Catat semua kegiatan CPD (seminar, pelatihan, menulis makalah, proyek, dll) → hitung poin otomatis sesuai kategori, progress bar menuju target 40 poin 3 tahun, breakdown per kategori, dan filter riwayat. Data tersimpan di browser.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 8",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/panduan-skk-jasa-konsultansi",
    icon: Briefcase,
    label: "Panduan SKK untuk Jasa Konsultansi",
    sublabel: "Jabatan wajib · persyaratan BUJK konsultan · perbedaan vs kontraktor",
    desc: "Pilih bidang konsultansi + skala → AI buat panduan lengkap: jabatan SKK yang wajib dan disarankan, persyaratan BUJK konsultansi, estimasi biaya setup, tips khusus jasa konsultansi, dan perbedaan kunci dari kontraktor.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    badge: "Gelombang 8",
    badgeColor: "text-cyan-400 border-cyan-400/30",
    live: true,
  },
  {
    href: "/generator-sop-k3-proyek",
    icon: HardHat,
    label: "Generator Draft SOP K3 Konstruksi",
    sublabel: "Pilih aktivitas berisiko → SOP terstruktur dengan prosedur + PJ + APD",
    desc: "Pilih jenis proyek + aktivitas berisiko (galian, ketinggian, crane, las, B3, dll) → AI generate draft SOP K3 terstruktur: per-seksi per-aktivitas, langkah operasional, penanggung jawab, APD wajib, formulir terkait, dan referensi regulasi nyata.",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "Gelombang 8",
    badgeColor: "text-red-400 border-red-400/30",
    live: true,
  },
  {
    href: "/checker-kesiapan-asesmen",
    icon: CheckSquare,
    label: "Checker Kesiapan Asesmen SKK",
    sublabel: "Checklist dokumen · skor kesiapan · prioritas melengkapi",
    desc: "Centang dokumen yang sudah disiapkan → AI analisis kelengkapan khusus jabatan yang dipilih, beri skor kesiapan 0–100, list kekurangan + cara mendapatkan, dan rekomendasikan tindakan prioritas sebelum asesmen.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 7",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/panduan-pemilihan-lsp",
    icon: Building,
    label: "Panduan Memilih LSP SKK",
    sublabel: "Tipologi LSP · cara verifikasi · estimasi biaya · red flags",
    desc: "Pilih jabatan + prioritas (murah/cepat/reputasi) → AI buat panduan lengkap: tipe LSP yang tersedia, langkah menemukan LSP, checklist verifikasi keaslian (termasuk red flag), estimasi biaya, pertanyaan yang harus ditanyakan.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "Gelombang 7",
    badgeColor: "text-indigo-400 border-indigo-400/30",
    live: true,
  },
  {
    href: "/kalkulator-manfaat-skk-bujk",
    icon: Building2,
    label: "Kalkulator Manfaat SKK untuk BUJK",
    sublabel: "Kualifikasi SBU · kapasitas tender · analisis komposisi",
    desc: "Input komposisi tenaga SKK BUJK Anda → kalkulator real-time hitung: total poin SKK, estimasi kualifikasi SBU (K2/M1/M2/B1/B2), kapasitas nilai proyek, cakupan klasifikasi, status K3 compliance, dan estimasi biaya gaji bulanan.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 7",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/generator-portofolio-skk",
    icon: ScrollText,
    label: "Generator Portofolio SKK Digital",
    sublabel: "Profil profesional · uraian tugas · draft APL-02 format BNSP",
    desc: "Input jabatan + daftar proyek (nama, jabatan, nilai, durasi) → AI generate portofolio lengkap: ringkasan profil, kompetensi utama, uraian tugas per proyek, capaian terukur, unit kompetensi yang dibuktikan, dan draft APL-02 siap pakai.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 7",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/generator-sertifikat-pengalaman",
    icon: FileBadge,
    label: "Generator Surat Pengalaman Proyek SKK",
    sublabel: "3 surat formal siap cetak · pernyataan bermaterai · pengantar LSP",
    desc: "Input nama + proyek pengalaman → AI generate 3 dokumen formal siap pakai: Surat Pernyataan Pengalaman Kerja (format bermaterai), Surat Keterangan Kerja dari perusahaan, dan Surat Pengantar ke LSP. Tinggal cetak + tanda tangan.",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bg: "bg-rose-500/5",
    badge: "Gelombang 7",
    badgeColor: "text-rose-400 border-rose-400/30",
    live: true,
  },
  {
    href: "/peta-unit-kompetensi",
    icon: Layers,
    label: "Peta Unit Kompetensi SKKNI",
    sublabel: "Unit kompetensi · elemen · KUK · jenis uji",
    desc: "Pilih jabatan SKK → AI tampilkan peta lengkap: unit kompetensi, elemen, Kriteria Unjuk Kerja (KUK), jenis pengujian (tulis/lisan/observasi/portofolio), bobot dalam asesmen, dan tips persiapan spesifik.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    badge: "Gelombang 6",
    badgeColor: "text-cyan-400 border-cyan-400/30",
    live: true,
  },
  {
    href: "/asisten-banding-skk",
    icon: Shield,
    label: "Asisten Banding Asesmen SKK",
    sublabel: "Surat banding · strategi remedial · rencana persiapan ulang",
    desc: "Tidak lulus asesmen? Input unit tidak lulus + catatan penguji → AI buat: draft surat banding siap pakai, analisis gap per unit, strategi remedial konkret, dan rencana mingguan persiapan asesmen ulang.",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "Gelombang 6",
    badgeColor: "text-amber-400 border-amber-400/30",
    live: true,
  },
  {
    href: "/kalkulator-upah-skk",
    icon: DollarSign,
    label: "Kalkulator Standar Upah SKK",
    sublabel: "Estimasi rentang gaji · per kota · per jenis kontrak",
    desc: "Pilih jabatan + level + kota + pengalaman + jenis kontrak → kalkulator real-time hitung rentang upah wajar: batas bawah, rekomendasi, batas atas. Berguna untuk negosiasi gaji atau menentukan budget rekrutmen SKK.",
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bg: "bg-green-500/5",
    badge: "Gelombang 6",
    badgeColor: "text-green-400 border-green-400/30",
    live: true,
  },
  {
    href: "/panduan-siki-skk",
    icon: Monitor,
    label: "Panduan Registrasi SIKI-SKK",
    sublabel: "Step-by-step daftar · upload dokumen · aktivasi digital",
    desc: "Pilih jabatan + status pendaftar → AI buat panduan step-by-step registrasi SKK ke sistem digital LPJK: SIKI-SKK, SiKA-SKK, dan sistem terkait. Termasuk daftar dokumen upload, masalah umum + solusi, dan FAQ.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 6",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/rencana-karir-skk",
    icon: TrendingUp,
    label: "Rencana Pengembangan Karir SKK",
    sublabel: "Roadmap personal · milestone · CPD · pelatihan",
    desc: "Input posisi sekarang + target jabatan + timeline → AI buat roadmap karir lengkap: milestone bertahap, kebutuhan CPD per kategori, pelatihan prioritas, hambatan potensial, dan indikator sukses yang terukur.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 6",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/simulator-uji-kompetensi",
    icon: Brain,
    label: "Simulator Uji Kompetensi SKK",
    sublabel: "Latihan soal PG + esai · evaluasi AI · feedback per soal",
    desc: "Pilih jabatan SKK + jumlah soal → AI buat soal pilihan ganda + esai berbasis unit kompetensi nyata. Kerjakan → AI evaluasi tiap jawaban, beri skor, feedback detail, dan rekomendasi materi yang perlu diperkuat.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 5",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/laporan-proyek-bnsp",
    icon: FileText,
    label: "Generator Laporan Proyek BNSP",
    sublabel: "Format portofolio SKK · kompetensi terbuktikan · salin teks",
    desc: "Input nama proyek + peran + jabatan SKK → AI buat laporan proyek terstruktur format BNSP: deskripsi, peran & tanggung jawab, unit kompetensi yang dibuktikan, pencapaian, metode, dan hasil proyek.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "Gelombang 5",
    badgeColor: "text-blue-400 border-blue-400/30",
    live: true,
  },
  {
    href: "/analisis-proyek-skk",
    icon: BarChart3,
    label: "Analisis Proyek vs Kompetensi SKK",
    sublabel: "Skor kesesuaian · unit terpenuhi · gap · saran penguatan",
    desc: "Input proyek + peran + deskripsi pekerjaan → AI analisis kesesuaian: skor 0–100, unit kompetensi mana yang terpenuhi/kurang, kekuatan/kelemahan bukti, rekomendasi jalur asesmen, dan saran penguatan portofolio.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 5",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/panduan-rekrutmen-skk",
    icon: Users,
    label: "Panduan Rekrutmen Tenaga SKK BUJK",
    sublabel: "Tahapan rekrutmen · kriteria seleksi · verifikasi SKK asli",
    desc: "Input jabatan + level + urgensi → AI buat panduan rekrutmen lengkap: tahapan dengan durasi, kriteria seleksi per kategori, pertanyaan wawancara efektif, cara verifikasi keaslian SKK di SIKI-SKK, dan tips negosiasi.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "Gelombang 5",
    badgeColor: "text-indigo-400 border-indigo-400/30",
    live: true,
  },
  {
    href: "/kalkulator-rpl",
    icon: Award,
    label: "Kalkulator Kelayakan RPL / Portofolio",
    sublabel: "Hitung poin pengalaman · skor RPL · status kelayakan jalur",
    desc: "Tambahkan berbagai jenis pengalaman (proyek, pelatihan, seminar, dll.) → kalkulator otomatis hitung total poin RPL, bandingkan dengan ambang batas jabatan target, dan tampilkan status kelayakan jalur portofolio.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 5",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/panduan-pasca-asesmen",
    icon: CheckCircle2,
    label: "Panduan Pasca-Asesmen SKK",
    sublabel: "Proses penerbitan · cara pakai SKK · SIKI-SKK · FAQ",
    desc: "Pilih jabatan + hasil asesmen (lulus/tidak lulus) → AI buat panduan lengkap: fase tindak lanjut, cara mendaftarkan ke SIKI-SKK/SiKA-SKK, cara menggunakan SKK di tender & proyek, hak dan kewajiban, dan FAQ pasca-asesmen.",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    bg: "bg-sky-500/5",
    badge: "Gelombang 5",
    badgeColor: "text-sky-400 border-sky-400/30",
    live: true,
  },
  {
    href: "/planner-skk-bujk",
    icon: Building2,
    label: "Planner SKK BUJK",
    sublabel: "Analisis kebutuhan SKK · gap analysis · rencana rekrutmen",
    desc: "Input subklasifikasi + kualifikasi SBU + SKK yang sudah ada → AI analisis kebutuhan SKK wajib per Permen PUPR 6/2021, gap yang harus diisi, rencana rekrutmen/sertifikasi, estimasi biaya, dan timeline.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-indigo-400 border-indigo-400/30",
    live: true,
  },
  {
    href: "/checker-skk-proyek",
    icon: Shield,
    label: "Checker Kepatuhan SKK Proyek",
    sublabel: "Cek SKK vs proyek · syarat per regulasi · skor kepatuhan",
    desc: "Input jenis + nilai proyek + SKK BUJK → AI cek kepatuhan: syarat SKK spesifik proyek berdasarkan PP 14/2021, status terpenuhi/kurang, kewajiban administrasi, dan tindakan yang diperlukan sebelum tender.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/panduan-apl01",
    icon: ClipboardList,
    label: "Panduan Pengisian APL-01",
    sublabel: "Petunjuk per seksi · contoh isian · checklist · dokumen",
    desc: "Pilih jabatan SKK + jalur asesmen → AI buat panduan lengkap APL-01: petunjuk tiap seksi dengan contoh isian nyata, daftar dokumen wajib/pendukung, kesalahan umum yang harus dihindari, dan checklist sebelum submit ke LSP.",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bg: "bg-rose-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-rose-400 border-rose-400/30",
    live: true,
  },
  {
    href: "/biaya-tim-skk",
    icon: DollarSign,
    label: "Kalkulator Biaya Tim SKK",
    sublabel: "Estimasi anggaran · per jalur · tips hemat · localStorage",
    desc: "Tambahkan jabatan SKK + jumlah orang + jalur sertifikasi → kalkulator estimasi biaya per item dan total: min/rata-rata/maks, perbandingan jalur (portofolio vs diklat), dan tips hemat untuk grup.",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-amber-400 border-amber-400/30",
    live: true,
  },
  {
    href: "/generator-cv-skk",
    icon: FileText,
    label: "Generator CV Kompetensi SKK",
    sublabel: "AI tulis CV profesional · kompetensi terstruktur · siap tender",
    desc: "Input profil + daftar proyek → AI buat CV lengkap: profil profesional, kompetensi utama, pengalaman proyek dengan bullet BNSP-ready, kualifikasi, dan tips optimasi CV untuk aplikasi SKK & tender.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-cyan-400 border-cyan-400/30",
    live: true,
  },
  {
    href: "/materi-belajar-skk",
    icon: BookOpen,
    label: "Materi Belajar & Referensi SKK",
    sublabel: "Rencana studi · topik prioritas · regulasi · referensi",
    desc: "Pilih jabatan SKK + waktu belajar → AI buat panduan studi terstruktur: rencana per minggu, 5–7 topik dengan poin kunci, referensi SNI/Peraturan/Buku nyata, tips asesmen, dan kesalahan umum yang harus dihindari.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Gelombang 4",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/kalkulator-cpd",
    icon: Calculator,
    label: "Kalkulator Poin CPD SKK",
    sublabel: "Hitung poin CPD · status perpanjangan · gap analysis",
    desc: "Tambahkan aktivitas CPD (diklat, seminar, proyek, publikasi, organisasi) → kalkulator otomatis hitung total poin, status cukup/kurang, dan saran aktivitas tambahan untuk mencapai 30 poin minimum.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/evaluasi-portofolio",
    icon: FileCheck,
    label: "Evaluasi Kesiapan Portofolio SKK",
    sublabel: "AI evaluasi bukti portofolio · skor 5 kriteria · rekomendasi",
    desc: "Input pengalaman proyek → AI evaluasi kesiapan portofolio untuk jalur RPL: skor per 5 kriteria (relevansi, kompleksitas, kesesuaian level, dokumen, kejelasan peran), dokumen yang kurang, dan rekomendasi perbaikan.",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-violet-400 border-violet-400/30",
    live: true,
  },
  {
    href: "/jalur-sertifikasi",
    icon: MapPin,
    label: "Rekomendasi Jalur Sertifikasi SKK",
    sublabel: "Roadmap multi-tahun · biaya · timeline · karir",
    desc: "Input profil + target karir → AI rancang roadmap sertifikasi SKK optimal: urutan SKK per tahun, prasyarat, estimasi biaya kumulatif, dan dampak karir setiap langkah.",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-orange-400 border-orange-400/30",
    live: true,
  },
  {
    href: "/analisis-skkni",
    icon: LayoutList,
    label: "Analisis Unit SKKNI",
    sublabel: "Unit kompetensi · elemen · KUK · bukti portofolio",
    desc: "Pilih jabatan SKK → AI breakdown semua unit kompetensi (inti/pilihan/umum), elemen, KUK, metode asesmen per unit, contoh bukti portofolio, dan tips menghadapi asesmen.",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    bg: "bg-sky-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-sky-400 border-sky-400/30",
    live: true,
  },
  {
    href: "/tracker-skk",
    icon: Briefcase,
    label: "Tracker Portofolio SKK",
    sublabel: "Dashboard semua SKK Anda · aktif/expired/segera",
    desc: "Simpan semua sertifikat SKK dalam satu dashboard — status aktif/akan expired/sudah expired, countdown hari, progress bar masa berlaku, dan akses cepat panduan perpanjangan.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
  {
    href: "/simulator-wawancara",
    icon: MessageSquare,
    label: "Simulator Wawancara Asesmen",
    sublabel: "AI asesor BNSP · 4 putaran · skor & feedback",
    desc: "AI berperan sebagai asesor BNSP sungguhan — ajukan 4 pertanyaan wawancara kompetensi situasional, beri feedback per jawaban, dan predikat akhir Kompeten/Belum Kompeten.",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bg: "bg-rose-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-rose-400 border-rose-400/30",
    live: true,
  },
  {
    href: "/perpanjangan-skk",
    icon: RefreshCw,
    label: "Panduan Perpanjangan SKK",
    sublabel: "Status aktif · Jalur perpanjangan · Timeline",
    desc: "Input jabatan SKK + tanggal terbit → status real-time (sisa hari), 3 jalur perpanjangan (asesmen ulang / portofolio / diklat), dokumen, biaya, dan risiko jika tidak diperpanjang.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "Gelombang 3",
    badgeColor: "text-indigo-400 border-indigo-400/30",
    live: true,
  },
  {
    href: "/rab-kalkulator",
    icon: BarChart3,
    label: "RAB Kalkulator",
    sublabel: "Estimasi Biaya Konstruksi AI",
    desc: "Kalkulasi RAB otomatis dari deskripsi pekerjaan menggunakan AHSP PermenPUPR 1/2022.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    badge: "Live",
    badgeColor: "text-emerald-400 border-emerald-400/30",
    live: true,
  },
  {
    href: "/k3-vision",
    icon: Shield,
    label: "AI Vision K3",
    sublabel: "Inspeksi K3 dari Foto",
    desc: "Upload foto lapangan → AI analisis temuan K3 + skor kepatuhan berdasarkan PP 50/2012.",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "Live",
    badgeColor: "text-red-400 border-red-400/30",
    live: true,
  },
  {
    href: "/pkb-builder",
    icon: GraduationCap,
    label: "PKB Builder",
    sublabel: "Pengembangan Keprofesian",
    desc: "Rencanakan dan dokumentasikan kegiatan PKB/CPD untuk pemenuhan SKP sertifikasi.",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bg: "bg-teal-500/5",
    badge: "Live",
    badgeColor: "text-teal-400 border-teal-400/30",
    live: true,
  },
];

const STATS = [
  { label: "Agen AI Aktif", value: "944+", icon: Sparkles, color: "text-blue-400" },
  { label: "Domain Konstruksi", value: "45+", icon: Building2, color: "text-emerald-400" },
  { label: "MultiClaw Suites", value: "45", icon: Zap, color: "text-amber-400" },
  { label: "Pasar Konstruksi 2034", value: "$226B", icon: TrendingUp, color: "text-violet-400" },
];

export default function KompetensiHub() {
  const [search, setSearch] = useState("");
  const [filterWave, setFilterWave] = useState("Semua");

  const waves = ["Semua", ...Array.from(new Set(TOOLS.map(t => t.badge)))];

  const filtered = TOOLS.filter(t => {
    const matchWave = filterWave === "Semua" || t.badge === filterWave;
    const q = search.toLowerCase();
    const matchSearch = !q || t.label.toLowerCase().includes(q) || t.sublabel.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    return matchWave && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-4 py-14">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-blue-300 text-xs font-medium">Ekosistem Kompetensi 2026–2030</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Platform AI untuk<br /><span className="text-blue-400">Sertifikasi & Kompetensi</span>
            </h1>
            <p className="text-slate-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Dari diagnostik gap hingga sertifikat digital terverifikasi — tools AI untuk mempersiapkan, menilai, dan mendokumentasikan kompetensi tenaga konstruksi Indonesia.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/diagnostik-kompetensi"><Brain className="h-4 w-4 mr-2" /> Mulai Diagnostik</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                <Link href="/mock-asesmen"><Target className="h-4 w-4 mr-2" /> Mock Asesmen</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <s.icon className={`h-5 w-5 mx-auto mb-2 ${s.color}`} />
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Tools Kompetensi</h2>
            <p className="text-slate-400 text-sm">{TOOLS.length} tools tersedia · gratis digunakan</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs">
            <Link href="/ai-tools">Lihat Semua AI Tools <ChevronRight className="h-3.5 w-3.5 ml-1" /></Link>
          </Button>
        </div>

        {/* Search + Filter */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari tools... (cth: JSA, SKK, ISO, tender, K3)"
              className="w-full rounded-xl border border-white/10 bg-white/3 pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {waves.map(w => (
              <button key={w} onClick={() => setFilterWave(w)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all border ${
                  filterWave === w
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "border-white/10 text-slate-400 hover:text-white bg-white/3"
                }`}>
                {w === "Semua" ? `Semua (${TOOLS.length})` : w}
              </button>
            ))}
          </div>
          {(search || filterWave !== "Semua") && (
            <p className="text-xs text-slate-500">
              {filtered.length === 0 ? "Tidak ada tools yang cocok" : `${filtered.length} tools ditemukan`}
              {(search || filterWave !== "Semua") && (
                <button onClick={() => { setSearch(""); setFilterWave("Semua"); }} className="ml-2 text-blue-400 hover:text-blue-300">Reset filter</button>
              )}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filtered.map((t, i) => (
            <Link key={i} href={t.href}>
              <div className={`group rounded-2xl border ${t.borderColor} ${t.bg} p-5 hover:bg-white/5 transition-all cursor-pointer h-full`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`rounded-xl p-2.5 bg-white/5 border border-white/10`}>
                    <t.icon className={`h-5 w-5 ${t.color}`} />
                  </div>
                  <Badge variant="outline" className={`text-xs ${t.badgeColor}`}>{t.badge}</Badge>
                </div>
                <h3 className="text-white font-semibold text-sm mb-0.5">{t.label}</h3>
                <p className={`text-xs ${t.color} mb-2`}>{t.sublabel}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
                <div className={`mt-3 flex items-center gap-1 text-xs ${t.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Buka <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <Search className="h-8 w-8 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Tidak ada tools yang cocok dengan pencarian</p>
              <button onClick={() => { setSearch(""); setFilterWave("Semua"); }} className="text-blue-400 text-xs mt-2 hover:text-blue-300">Reset filter</button>
            </div>
          )}
        </div>

        {/* Roadmap 2026-2030 */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Roadmap Produk 2026–2030</h2>
            <p className="text-slate-400 text-sm">Tiga gelombang pertumbuhan Ekosistem Kompetensi Indonesia</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {WAVES.map((w, i) => (
              <div key={i} className={`rounded-2xl border ${w.borderColor} ${w.bg} p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${w.color} uppercase tracking-wide`}>{w.wave}</span>
                  <span className="text-slate-500 text-xs">{w.period}</span>
                </div>
                <p className={`text-sm font-semibold ${w.color} mb-3`}>{w.theme}</p>
                <ul className="space-y-1.5">
                  {w.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-300 text-xs">
                      <CheckCircle2 className={`h-3 w-3 ${i === 0 ? "text-emerald-400" : w.color} shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Market Context */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" /> Konteks Pasar Indonesia 2026–2030
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Konstruksi 2025 → 2034", value: "USD 125B → USD 226B (CAGR 6.77%)", icon: Building2, color: "text-blue-400" },
              { label: "Kekurangan tenaga ahli/tahun", value: "349K–500K pekerja baru", icon: Users, color: "text-amber-400" },
              { label: "Pekerja belum bersertifikat", value: "> 8.3 juta (< 10% tersertifikasi)", icon: GraduationCap, color: "text-red-400" },
              { label: "HR Tech Indonesia 2024", value: "USD 6.01B, tumbuh 15–20%/tahun", icon: BarChart3, color: "text-emerald-400" },
              { label: "Employer hiring micro-credential", value: "97% sudah memprioritaskan", icon: CheckCircle2, color: "text-violet-400" },
              { label: "Digital skilled workers → GDP 2030", value: "USD 303.4 miliar (16% GDP)", icon: Zap, color: "text-teal-400" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon className={`h-4 w-4 mt-0.5 ${item.color} shrink-0`} />
                <div>
                  <p className="text-slate-400 text-xs">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.color}`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-5 border-t border-white/10 pt-4">
            Sumber: Deloitte, World Bank, Credential Engine, HR Tech Indonesia Report 2024, PermenPUPR 6/2021
          </p>
        </div>
      </div>

      {/* MultiClaw CTA */}
      <div className="border-t border-white/10 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <BookOpen className="h-10 w-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Konsultasi dengan AI Spesialis</h2>
          <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
            45 MultiClaw suite AI tersedia untuk konsultasi mendalam — SBU, SKK, K3, Tender, Kontrak, ESG, dan banyak lagi.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline" size="sm" className="border-white/20 hover:bg-white/5 text-sm">
              <Link href="/panduan-askom">→ Panduan Uji Kompetensi SKK</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-white/20 hover:bg-white/5 text-sm">
              <Link href="/panduan-sbu">→ Panduan SBU Konstruksi</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-white/20 hover:bg-white/5 text-sm">
              <Link href="/skema-claw">→ Skema Sertifikasi BUJK</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
