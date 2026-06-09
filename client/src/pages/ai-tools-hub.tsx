import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Calculator, ShieldAlert, Sparkles, ChevronRight,
  Zap, Brain, Eye, FileText, Wrench, FileSignature, Shield, Target, Handshake, BarChart3,
  Award, GraduationCap, BookOpen, Search, TrendingUp, Building2, RefreshCw, MessageSquare, Briefcase, LayoutList, MapPin, FileCheck,
  Users, CheckCircle2, Layers, Monitor, DollarSign,
  CheckSquare, Building, ScrollText, FileBadge, HardHat,
  ArrowRightLeft, Clock, Gavel, BadgeCheck, ClipboardList,
  FileEdit, ClipboardCheck, AlertOctagon, Umbrella,
  FileBarChart, ArrowUpFromLine, ClipboardSignature
} from "lucide-react";

interface Tool {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  badgeColor: string;
  label: string;
  desc: string;
  tag: string;
  model: string;
}

const KOMPETENSI_TOOLS = [
  {
    href: "/kompetensi-hub",
    icon: <BookOpen className="h-6 w-6" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    label: "Kompetensi Hub — Pusat Sertifikasi SKK",
    desc: "Landing page ekosistem kompetensi: diagnostik gap, mock asesmen, e-sertifikat, dan roadmap Gelombang 1–3 menuju 2030.",
    tag: "Hub",
    model: "Multi-tool",
  },
  {
    href: "/diagnostik-kompetensi",
    icon: <Brain className="h-6 w-6" />,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    label: "Diagnostik Kompetensi SKK",
    desc: "Isi profil pendidikan & pengalaman — AI menilai level KKNI saat ini, mengidentifikasi gap, dan menyusun jalur pembelajaran menuju target SKK.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/mock-asesmen",
    icon: <Target className="h-6 w-6" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    label: "Mock Asesmen SKK — Simulasi Uji BNSP",
    desc: "Pilih domain SKK (K3, Sipil, MEP, QS, dll.) — AI menghasilkan 5 soal simulasi (3 pengetahuan + 2 skenario) dengan penilaian dan penjelasan.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/sertifikat-digital",
    icon: <Award className="h-6 w-6" />,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    label: "SERTIVA — E-Sertifikat Digital + QR",
    desc: "Terbitkan sertifikat digital terverifikasi untuk peserta bimtek, pelatihan, atau uji kompetensi. Setiap sertifikat punya QR verifikasi publik.",
    tag: "Kompetensi",
    model: "QR + PostgreSQL",
  },
  {
    href: "/persiapan-asesmen",
    icon: <GraduationCap className="h-6 w-6" />,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    label: "Persiapan Asesmen SKK — Paket Lengkap",
    desc: "Pilih jabatan SKK & jalur sertifikasi — AI menghasilkan checklist dokumen, unit SKKNI prioritas, tips asesor, dan estimasi biaya.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/cek-kelayakan-skk",
    icon: <Target className="h-6 w-6" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    label: "Cek Kelayakan SKK — SKK Apa yang Bisa Saya Ambil?",
    desc: "Input pendidikan + tahun pengalaman + bidang → AI menampilkan semua jabatan SKK eligible sekarang + yang bisa dicapai 1-2 tahun + urutan prioritas.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-apl02",
    icon: <FileText className="h-6 w-6" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    label: "Generator APL-02 — Formulir Asesmen Mandiri SKK",
    desc: "Ceritakan pengalaman kerja → AI pre-fills seluruh APL-02 per unit SKKNI: klaim K/BK, konfidensitas diri, jenis bukti, dan dokumen pendukung.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/roi-karir-skk",
    icon: <TrendingUp className="h-6 w-6" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    label: "ROI & Karir SKK — Kenaikan Gaji & Proyeksi 5 Tahun",
    desc: "Input jabatan + gaji + target SKK → estimasi kenaikan gaji, rincian biaya sertifikasi, breakeven bulan, ROI 5 tahun + roadmap SKK lanjutan.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/syarat-personel-bujk",
    icon: <Building2 className="h-6 w-6" />,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    label: "Syarat Personel & Compliance BUJK",
    desc: "Pilih klasifikasi + grade BUJK → lihat syarat PJT/PJK/Tenaga Ahli per Permen PUPR 6/2025, atau cek compliance personel yang sudah ada + gap analysis.",
    tag: "BUJK",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-dokumen-skk",
    icon: <FileText className="h-6 w-6" />,
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    label: "Generator Dokumen SKK — Surat Pernyataan, Keterangan & Pengantar",
    desc: "Generate 3 jenis surat resmi untuk aplikasi SKK: Surat Pernyataan Pengalaman Kerja (bermaterai), Surat Keterangan Kerja dari perusahaan, dan Surat Pengantar ke LSP.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/validator-klaim-uk",
    icon: <BadgeCheck className="h-6 w-6" />,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    label: "Validator Klaim Unit Kompetensi SKK — Penilaian Asesor",
    desc: "Deskripsikan pengalaman + bukti per unit kompetensi → AI nilai seperti asesor BNSP: status Kuat/Cukup/Lemah/Tidak Cukup, skor 0–100 per unit, analisis objektif, bukti yang akan diminta asesor, dan saran konkret memperkuat klaim sebelum daftar asesmen.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-bast-proyek",
    icon: <FileSignature className="h-6 w-6" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    label: "Generator BAST Proyek — Serah Terima Formal + Checklist",
    desc: "Pilih jenis proyek + jenis BAST (Pertama, Kedua, Parsial, CCO, Material) → AI generate draft BAST formal dengan bahasa hukum Indonesia, identitas pihak, klausul pemeliharaan, checklist 8–10 dokumen lampiran wajib, dan catatan penting proses serah terima.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/panduan-iujk-sbu",
    icon: <Building2 className="h-6 w-6" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    label: "Panduan SBU & IUJK — Dari SKK ke Izin Usaha Konstruksi",
    desc: "Pilih klasifikasi SBU + kualifikasi + kondisi perusahaan → AI buat panduan: SKK wajib (jumlah dan jabatan), dokumen lengkap, langkah per tahap di OSS-RBA dan SIKI dengan estimasi waktu dan biaya, tips mempercepat proses, dan kesalahan umum yang sering terjadi.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-rmk",
    icon: <ClipboardList className="h-6 w-6" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    label: "Generator RMK — Rencana Mutu Kontrak 7 Bab",
    desc: "Input jenis + nama proyek + peran + durasi → AI generate draft RMK 7 bab (Pendahuluan, Info Kegiatan, Persyaratan, Metode Pelaksanaan, Pengendalian Mutu, K3 & Lingkungan, Pelaporan) dengan konten substansif, indikator mutu spesifik, dan jadwal peninjauan.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/simulator-csms",
    icon: <HardHat className="h-6 w-6" />,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
    label: "Simulator CSMS — Latihan Safety Pre-Qualification",
    desc: "Pilih jenis evaluasi K3 (CSMS, Vendor Assessment, Safety Audit) → AI jadi auditor K3 senior dan ajukan 6 pertanyaan kritis realistis. Setiap jawaban dinilai 0–10 dengan feedback konstruktif, skor akhir 0–100 predikat Lulus/Kondisional/Belum Lulus.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-surat-penawaran",
    icon: <FileEdit className="h-6 w-6" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    label: "Generator Surat Penawaran — Tender & Pengadaan Konstruksi",
    desc: "Pilih jenis pekerjaan + nama paket → AI generate surat penawaran teknis & harga lengkap: pembuka, data penawaran, lingkup pekerjaan, harga, jangka waktu, syarat pembayaran, keunggulan perusahaan, penutup, lampiran, dan catatan teknis sebelum mengirim.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/kalkulator-eskalasi-harga",
    icon: <TrendingUp className="h-6 w-6" />,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    label: "Kalkulator Eskalasi Harga Material — IHK & Klaim CCO",
    desc: "Input indeks harga konstruksi BPS awal vs akhir per material + volume → hitung eskalasi bruto & klaim bersih berdasarkan klausul persentase (Perpres 12/2021 Pasal 57–58). Real-time tanpa AI — preset 10 material konstruksi, dapat ditambah sendiri.",
    tag: "Kompetensi",
    model: "Lokal (tanpa AI)",
  },
  {
    href: "/panduan-audit-mutu-iso",
    icon: <ClipboardCheck className="h-6 w-6" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    label: "Panduan Audit Mutu Internal ISO — Per Klausul",
    desc: "Pilih standar (ISO 9001/14001/45001/IMS) + jenis audit → AI generate panduan per klausul: pertanyaan audit, bukti yang dicari, tembuan, risiko potensial, checklist persiapan, tips auditor, dan format laporan. Disesuaikan konteks konstruksi Indonesia.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-laporan-insiden",
    icon: <AlertOctagon className="h-6 w-6" />,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
    label: "Generator Laporan Insiden K3 — Permenaker No. 8/2020",
    desc: "Pilih jenis insiden (KK ringan/berat/fatal, near miss, kebakaran, TPL, dll) + tipe pekerjaan → AI generate laporan K3 formal: kronologi, penyebab langsung & dasar, tindakan darurat, rekomendasi pencegahan, kewajiban pelaporan legal.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/asisten-klaim-car",
    icon: <Umbrella className="h-6 w-6" />,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    label: "Asisten Klaim Asuransi CAR — Construction All Risk",
    desc: "Pilih jenis klaim CAR (kerusakan material, alat berat, kebakaran, TPL, dll) → AI generate panduan klaim: langkah+batas waktu, dokumen wajib+urgensi, klausul polis relevan, pengecualian yang sering ditolak, dan tips negosiasi dengan insurer.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-bapro",
    icon: <FileBarChart className="h-6 w-6" />,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    badgeColor: "bg-green-500/15 text-green-400 border-green-500/30",
    label: "Generator BAPRO — Berita Acara Kemajuan Pekerjaan",
    desc: "Input nama proyek, jenis kontrak, periode, dan persen fisik → AI generate BAPRO formal lengkap: tabel kemajuan per item pekerjaan, narasi fisik, kendala & solusi, rencana periode berikutnya, dan draft penutup + placeholder tanda tangan PPK.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/panduan-k3-ketinggian",
    icon: <ArrowUpFromLine className="h-6 w-6" />,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    label: "Panduan K3 Pekerjaan Ketinggian — APD & Prosedur Aman",
    desc: "Pilih jenis pekerjaan ketinggian dan rentang ketinggian → AI generate panduan K3 lengkap per Permenaker 9/2016: APD wajib+standar SNI, prosedur kerja aman, identifikasi risiko+pengendalian, checklist sebelum kerja, prosedur darurat.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-checklist-sta",
    icon: <ClipboardSignature className="h-6 w-6" />,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    label: "Generator Checklist Serah Terima Akhir — PHO/FHO",
    desc: "Pilih jenis proyek dan tahapan (PHO/FHO) → AI generate checklist STA komprehensif per kategori: arsitektur, struktur, MEP, K3, administrasi — kriteria kelulusan, status wajib/opsional, referensi SNI, dan daftar dokumen serah terima.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/simulator-negosiasi-kontrak",
    icon: <Handshake className="h-6 w-6" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    label: "Simulator Negosiasi Kontrak — Latihan vs AI",
    desc: "Pilih jenis kontrak, peran, dan topik negosiasi (denda, pembayaran, force majeure, CCO, dll) → AI berperan sebagai pihak lawan realistis. Simulasi 5 ronde dengan penilaian argumen yuridis, strategi, dan skor negosiasi akhir.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/panduan-mutasi-skk",
    icon: <ArrowRightLeft className="h-6 w-6" />,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    label: "Panduan Mutasi SKK — Gap Analisis Alih Profesi",
    desc: "Pilih jabatan asal dan tujuan → AI analisis gap unit kompetensi, unit yang masih diakui, status setiap dokumen (bisa dipakai/perlu diperbarui/perlu baru), 5–6 langkah mutasi dengan estimasi waktu, keuntungan, dan risiko.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-jsa",
    icon: <ShieldAlert className="h-6 w-6" />,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    label: "Generator JSA — Job Safety Analysis HIRARC",
    desc: "Pilih pekerjaan konstruksi + kondisi lingkungan → AI generate JSA per langkah kerja: bahaya potensial, level risiko (Kritis–Rendah), pengendalian 5 tipe (Eliminasi/Substitusi/Engineering/Administratif/APD), APD spesifik, prosedur darurat, referensi standar.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/kalkulator-jam-kerja-proyek",
    icon: <Clock className="h-6 w-6" />,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    label: "Kalkulator Jam Kerja & Fatigue Risk Proyek",
    desc: "Input data pekerja proyek (jam kerja, hari berturut, shift malam) → deteksi otomatis level risiko kelelahan per pekerja sesuai PP 35/2021, bar visual progres, alert kritis untuk yang butuh rotasi segera. Tanpa AI, update real-time.",
    tag: "Kompetensi",
    model: "Lokal (tanpa AI)",
  },
  {
    href: "/panduan-skk-pengadaan",
    icon: <Gavel className="h-6 w-6" />,
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-300",
    badgeColor: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    label: "Panduan SKK Pengadaan Konstruksi — PPK, PPTK, PP, Pokja",
    desc: "Pilih jabatan pengadaan + nilai kontrak → AI jelaskan SKK wajib berdasarkan UU 2/2017, PP 14/2021, Perpres 12/2021 dan regulasi LKPP, konsekuensi tanpa kompetensi, langkah persiapan, dan tips kepatuhan unit kerja pengadaan.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/estimator-biaya-sertifikasi",
    icon: <Calculator className="h-6 w-6" />,
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    label: "Estimator Biaya Sertifikasi SKK — Breakdown Lengkap",
    desc: "Pilih jabatan + kota + skala → kalkulator real-time: total biaya sertifikasi (min/tengah/maks), breakdown per komponen dengan stacked bar chart, cicilan bulanan 6x, dan ROI kenaikan gaji. Tanpa AI, instan.",
    tag: "Kompetensi",
    model: "Lokal (tanpa AI)",
  },
  {
    href: "/panduan-fresh-graduate-skk",
    icon: <GraduationCap className="h-6 w-6" />,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    badgeColor: "bg-green-500/15 text-green-400 border-green-500/30",
    label: "Panduan SKK Fresh Graduate — Jalur RPL & Langkah Konkret",
    desc: "Input jurusan + IPK + pengalaman → AI rekomendasikan 3 jabatan SKK yang realistis, strategi RPL untuk magang/KP, 5–6 langkah pertama yang harus dilakukan, dan daftar kesalahan umum yang harus dihindari.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/tracker-cpd-mandiri",
    icon: <TrendingUp className="h-6 w-6" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    label: "Tracker CPD Mandiri SKK — Monitor Poin Perpanjangan",
    desc: "Catat aktivitas CPD (seminar, pelatihan, menulis, proyek, dll) → hitung poin otomatis, progress bar target 40 poin/3 tahun, breakdown per kategori, filter riwayat. Data tersimpan lokal di browser. Tanpa AI.",
    tag: "Kompetensi",
    model: "Lokal (tanpa AI)",
  },
  {
    href: "/panduan-skk-jasa-konsultansi",
    icon: <Briefcase className="h-6 w-6" />,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    label: "Panduan SKK Jasa Konsultansi — Wajib, Disarankan, Biaya Setup",
    desc: "Pilih bidang konsultansi + skala → AI susun panduan: jabatan SKK wajib (dengan jumlah minimal), jabatan yang disarankan, persyaratan BUJK konsultansi beserta dokumennya, perbedaan vs kontraktor, dan estimasi biaya setup.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-sop-k3-proyek",
    icon: <HardHat className="h-6 w-6" />,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
    label: "Generator Draft SOP K3 Proyek — Prosedur + PJ + Regulasi",
    desc: "Pilih jenis proyek + aktivitas berisiko (ketinggian, galian, crane, las, B3, dll) → AI generate draft SOP K3 terstruktur per-seksi: langkah operasional, penanggung jawab, APD wajib, formulir terkait, dan referensi Permenaker/PP/SNI nyata.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/checker-kesiapan-asesmen",
    icon: <CheckSquare className="h-6 w-6" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    label: "Checker Kesiapan Asesmen SKK — Skor Kelengkapan Dokumen",
    desc: "Centang dokumen yang sudah ada → AI hitung skor kesiapan 0–100, analisis kritis setiap dokumen kurang (alasan + cara mendapatkan), rekomendasikan tindakan prioritas. Checklist disesuaikan untuk setiap jabatan SKK.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/panduan-pemilihan-lsp",
    icon: <Building className="h-6 w-6" />,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    label: "Panduan Memilih LSP SKK — Verifikasi, Biaya, Red Flags",
    desc: "Pilih jabatan + prioritas → AI buat panduan: 3 tipologi LSP (keunggulan/kelemahan/cocok untuk), 4 langkah menemukan LSP, checklist verifikasi keaslian + red flags, estimasi biaya per komponen, 8 pertanyaan wajib ke LSP.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/kalkulator-manfaat-skk-bujk",
    icon: <Building2 className="h-6 w-6" />,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    label: "Kalkulator Manfaat SKK BUJK — Poin, SBU, Kapasitas Tender",
    desc: "Input komposisi tenaga SKK → kalkulator real-time: total poin SKK, estimasi kualifikasi SBU (K2/M1/M2/B1/B2), nilai proyek maksimal, jumlah klasifikasi tercakup, status K3 compliance, estimasi biaya gaji. Tanpa AI.",
    tag: "Kompetensi",
    model: "Lokal (tanpa AI)",
  },
  {
    href: "/generator-portofolio-skk",
    icon: <ScrollText className="h-6 w-6" />,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    label: "Generator Portofolio SKK Digital — Format BNSP + APL-02",
    desc: "Input jabatan + data proyek (nama, jabatan, nilai, durasi) → AI generate: ringkasan profil profesional, 6–8 kompetensi utama, uraian tugas + capaian per proyek, unit SKKNI yang dibuktikan, dan draft APL-02 asesmen mandiri siap pakai.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/generator-sertifikat-pengalaman",
    icon: <FileBadge className="h-6 w-6" />,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    label: "Generator Surat Pengalaman Proyek SKK — 3 Dokumen Formal",
    desc: "Input nama + daftar proyek → AI generate 3 surat resmi siap cetak: Surat Pernyataan Pengalaman Kerja (format bermaterai), Surat Keterangan Kerja dari perusahaan, Surat Pengantar ke LSP. Tinggal tempel materai + tanda tangan.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/peta-unit-kompetensi",
    icon: <Layers className="h-6 w-6" />,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    label: "Peta Unit Kompetensi SKKNI — Breakdown Lengkap per Jabatan",
    desc: "Pilih jabatan SKK → AI tampilkan peta kompetensi lengkap: unit kompetensi + elemen + KUK (Kriteria Unjuk Kerja) + jenis uji (tulis/lisan/observasi/demonstrasi/portofolio) + bobot kritis/penting/pendukung + bukti yang dibutuhkan.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/asisten-banding-skk",
    icon: <Shield className="h-6 w-6" />,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    label: "Asisten Banding Asesmen SKK — Tidak Lulus? Ada Jalan Lain",
    desc: "Input unit tidak lulus + catatan penguji → AI generate: hak banding lengkap, prosedur pengajuan, draft surat banding formal siap pakai, analisis gap per unit, strategi remedial konkret, rencana mingguan persiapan ulang.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/kalkulator-upah-skk",
    icon: <DollarSign className="h-6 w-6" />,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    badgeColor: "bg-green-500/15 text-green-400 border-green-500/30",
    label: "Kalkulator Standar Upah SKK — Estimasi Gaji Real-Time",
    desc: "Atur jabatan + level + kota + tahun pengalaman + jenis kontrak → kalkulator langsung tampilkan batas bawah, rekomendasi, batas atas upah. Plus konversi ke paket kontrak per proyek dan freelance. Tanpa AI.",
    tag: "Kompetensi",
    model: "Lokal (tanpa AI)",
  },
  {
    href: "/panduan-siki-skk",
    icon: <Monitor className="h-6 w-6" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    label: "Panduan Registrasi SIKI-SKK — Daftar ke Sistem Digital LPJK",
    desc: "Pilih jabatan + status (baru/update/perpanjangan) → AI buat panduan step-by-step: tahapan registrasi detail, dokumen yang diupload per tahap, 3–4 sistem digital LPJK, 5 masalah umum + solusi, FAQ lengkap.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/rencana-karir-skk",
    icon: <TrendingUp className="h-6 w-6" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    label: "Rencana Pengembangan Karir SKK — Roadmap Pribadi",
    desc: "Input posisi sekarang + target + timeline + pengalaman → AI buat roadmap: skor kesiapan 0–100, 4–5 milestone bertahap dengan aksi konkret, kebutuhan CPD per kategori, pelatihan prioritas, hambatan + solusi, indikator sukses.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/simulator-uji-kompetensi",
    icon: <Brain className="h-6 w-6" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    label: "Simulator Uji Kompetensi SKK — Latihan Soal AI",
    desc: "Pilih jabatan + jumlah soal (5/10/15) → AI buat soal PG + esai berbasis unit kompetensi nyata → kerjakan → AI evaluasi tiap jawaban, skor, feedback detail, unit kompetensi lemah, dan rekomendasi belajar.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/laporan-proyek-bnsp",
    icon: <FileText className="h-6 w-6" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    label: "Generator Laporan Proyek BNSP — Format Portofolio SKK",
    desc: "Input proyek + peran + jabatan SKK → AI generate laporan proyek format BNSP lengkap: header, deskripsi, peran & tanggung jawab, unit kompetensi yang dibuktikan, pencapaian terukur, metode, hasil dan dampak.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/analisis-proyek-skk",
    icon: <BarChart3 className="h-6 w-6" />,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    label: "Analisis Proyek vs Kompetensi SKK — Cek Kesesuaian",
    desc: "Input proyek + deskripsi pekerjaan + jabatan target → AI analisis kesesuaian: skor 0–100, unit kompetensi terpenuhi/kurang, kekuatan/kelemahan sebagai bukti portofolio, rekomendasi jalur asesmen.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/panduan-rekrutmen-skk",
    icon: <Users className="h-6 w-6" />,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    label: "Panduan Rekrutmen Tenaga SKK BUJK — Panduan HR Konstruksi",
    desc: "Input jabatan + level + urgensi → AI buat panduan rekrutmen lengkap: tahapan + durasi, kriteria seleksi, 5–6 pertanyaan wawancara efektif, cara verifikasi keaslian SKK di SIKI-SKK, dan tips negosiasi kontrak.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/kalkulator-rpl",
    icon: <Award className="h-6 w-6" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    label: "Kalkulator Kelayakan RPL / Portofolio — Hitung Poin Pengalaman",
    desc: "Tambahkan jenis pengalaman (proyek, diklat, seminar, pengajaran, dll.) → hitung total poin RPL otomatis, bandingkan dengan ambang batas jabatan Muda/Madya/Utama, status layak/tidak layak jalur portofolio. Tanpa AI.",
    tag: "Kompetensi",
    model: "Lokal (tanpa AI)",
  },
  {
    href: "/panduan-pasca-asesmen",
    icon: <CheckCircle2 className="h-6 w-6" />,
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    label: "Panduan Pasca-Asesmen SKK — Apa Selanjutnya Setelah Asesmen",
    desc: "Pilih jabatan + hasil (lulus/tidak) → AI buat panduan: fase tindak lanjut, cara daftar SIKI-SKK/SiKA-SKK, cara pakai SKK di tender & proyek, hak & kewajiban pemegang SKK, 5–6 FAQ, tips keamanan SKK.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/planner-skk-bujk",
    icon: <Building2 className="h-6 w-6" />,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    label: "Planner SKK BUJK — Analisis Kebutuhan Perusahaan",
    desc: "Input subklasifikasi SBU + kualifikasi + SKK yang dimiliki → AI analisis gap kebutuhan SKK wajib, rencana rekrutmen/sertifikasi per prioritas, estimasi biaya total, dan risiko jika tidak dilengkapi.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/checker-skk-proyek",
    icon: <Shield className="h-6 w-6" />,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    label: "Checker Kepatuhan SKK Proyek — Cek SKK vs Tender",
    desc: "Input jenis proyek + nilai kontrak + sumber dana + SKK BUJK → AI cek kepatuhan berdasarkan PP 14/2021: syarat SKK per jabatan, skor 0–100, kewajiban administrasi, dan tindakan konkret yang diperlukan.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/panduan-apl01",
    icon: <FileSignature className="h-6 w-6" />,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    label: "Panduan Pengisian APL-01 — Guide Daftar Asesmen SKK",
    desc: "Pilih jabatan SKK + jalur → AI buat panduan lengkap formulir APL-01: petunjuk tiap seksi dengan contoh isian nyata, dokumen wajib/pendukung, kesalahan umum, dan checklist kritikal sebelum submit ke LSP.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/biaya-tim-skk",
    icon: <BarChart3 className="h-6 w-6" />,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    label: "Kalkulator Biaya Tim SKK — Estimasi Anggaran Sertifikasi",
    desc: "Tambahkan jabatan + jumlah orang + jalur → kalkulator estimasi anggaran sertifikasi tim: min/rata/maks per item dan total, perbandingan biaya jalur portofolio vs diklat, tips hemat untuk grup. Tanpa AI.",
    tag: "Kompetensi",
    model: "Lokal (tanpa AI)",
  },
  {
    href: "/generator-cv-skk",
    icon: <FileText className="h-6 w-6" />,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    label: "Generator CV Kompetensi SKK — AI CV Writer",
    desc: "Input nama + jabatan target + proyek → AI buat CV profesional BNSP-ready: profil, kompetensi utama, bullet poin proyek yang menonjolkan kompetensi, kualifikasi, dan tips optimasi untuk tender konstruksi.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/materi-belajar-skk",
    icon: <BookOpen className="h-6 w-6" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    label: "Materi Belajar & Referensi SKK — Panduan Studi",
    desc: "Pilih jabatan SKK + durasi belajar → AI buat rencana studi per minggu, 5–7 topik berprioritasi dengan poin kunci, referensi SNI/Peraturan/Buku nyata, tips asesmen, dan kesalahan umum kandidat.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/kalkulator-cpd",
    icon: <Calculator className="h-6 w-6" />,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    label: "Kalkulator Poin CPD SKK — Hitung Poin Perpanjangan",
    desc: "Kalkulator CPD berbasis regulasi LPJK: input aktivitas (diklat, seminar, proyek, publikasi, organisasi) → total poin, status perpanjangan, dan saran aktivitas tambahan. Tanpa AI — instan.",
    tag: "Kompetensi",
    model: "Lokal (tanpa AI)",
  },
  {
    href: "/evaluasi-portofolio",
    icon: <FileCheck className="h-6 w-6" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    label: "Evaluasi Kesiapan Portofolio SKK — AI Reviewer",
    desc: "Input detail proyek → AI evaluasi kesiapan portofolio RPL: skor 5 kriteria (bintang 1–5), kekuatan/kelemahan, daftar dokumen yang kurang, dan rekomendasi perbaikan sebelum daftar asesmen.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/jalur-sertifikasi",
    icon: <MapPin className="h-6 w-6" />,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    label: "Rekomendasi Jalur Sertifikasi SKK — Roadmap Karir",
    desc: "Input profil (profesi, bidang, pengalaman, target karir) → AI buat roadmap sertifikasi multi-tahun: urutan SKK, timeline, prasyarat, estimasi biaya, dan dampak karir tiap tahap.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/analisis-skkni",
    icon: <LayoutList className="h-6 w-6" />,
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    label: "Analisis Unit SKKNI — Breakdown Kompetensi Lengkap",
    desc: "AI breakdown unit kompetensi, elemen, KUK, metode asesmen per unit, contoh bukti portofolio, dan tips asesmen. Panduan belajar sebelum Simulator Wawancara.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/tracker-skk",
    icon: <Briefcase className="h-6 w-6" />,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    label: "Tracker Portofolio SKK — Dashboard Semua Sertifikat",
    desc: "Dashboard personal: simpan semua SKK, status aktif/segera/expired otomatis, countdown hari, progress bar masa berlaku, export/import JSON backup. Tanpa login.",
    tag: "Kompetensi",
    model: "Lokal (tanpa AI)",
  },
  {
    href: "/simulator-wawancara",
    icon: <MessageSquare className="h-6 w-6" />,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    label: "Simulator Wawancara Asesmen — AI Asesor BNSP Interaktif",
    desc: "AI berperan sebagai asesor BNSP: ajukan 4 pertanyaan kompetensi situasional, beri feedback + skor per jawaban (1–4), predikat akhir Kompeten/Bersyarat/Belum Kompeten.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
  {
    href: "/perpanjangan-skk",
    icon: <RefreshCw className="h-6 w-6" />,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    label: "Panduan Perpanjangan SKK — Status, Jalur & Timeline",
    desc: "Input jabatan SKK + tanggal terbit → status real-time sisa hari aktif, 3 jalur perpanjangan (asesmen ulang / portofolio / diklat pembaruan), dokumen, estimasi biaya, dan risiko.",
    tag: "Kompetensi",
    model: "GPT-4o-mini",
  },
];

const TOOLS: Tool[] = [
  {
    href: "/rab-kalkulator",
    icon: <Calculator className="h-6 w-6" />,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    label: "Kalkulator RAB Otomatis",
    desc: "Tempel catatan lapangan yang berantakan — AI langsung mengubahnya menjadi tabel RAB terstruktur lengkap dengan volume, harga satuan, PPN, dan grand total.",
    tag: "Estimasi Biaya",
    model: "GPT-4o",
  },
  {
    href: "/k3-vision",
    icon: <ShieldAlert className="h-6 w-6" />,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
    label: "AI Vision K3 Inspector",
    desc: "Upload foto lapangan konstruksi — GPT-4o Vision menganalisis potensi pelanggaran K3, memberikan skor kepatuhan, dan rekomendasi tindakan segera.",
    tag: "Inspeksi K3",
    model: "GPT-4o Vision",
  },
  {
    href: "/docu-gen",
    icon: <FileSignature className="h-6 w-6" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    label: "DocuGen — AI Document Generator",
    desc: "Pilih klien dan jenis dokumen — AI menghasilkan Surat Kuasa, Permohonan SBU, Pakta Integritas, Perjanjian Layanan, dan 5 jenis surat lain dalam bahasa Indonesia formal.",
    tag: "Biro Jasa",
    model: "GPT-4o",
  },
  {
    href: "/cert-tracker",
    icon: <Shield className="h-6 w-6" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    label: "CertTracker — Monitor Sertifikat BUJK",
    desc: "Kelola sertifikat SBU, SKK, ISO, CSMS, dan dokumen perizinan klien biro jasa. Alert otomatis H-90/H-30 sebelum expired.",
    tag: "Biro Jasa",
    model: "PostgreSQL",
  },
  {
    href: "/tender-mate",
    icon: <Target className="h-6 w-6" />,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    label: "TenderMate — Pipeline Tender",
    desc: "Track dan kelola pipeline tender klien biro jasa dari teridentifikasi → penawaran → menang. Hitung win rate dan total nilai kontrak.",
    tag: "Biro Jasa",
    model: "PostgreSQL",
  },
  {
    href: "/client-hub",
    icon: <Handshake className="h-6 w-6" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    label: "ClientHub — Manajemen Klien Biro Jasa",
    desc: "CRM mini untuk biro jasa: catat riwayat komunikasi, atur follow-up dengan deadline & prioritas, pantau status klien (Prospek/Aktif/Tidak Aktif).",
    tag: "Biro Jasa",
    model: "PostgreSQL",
  },
  {
    href: "/laporan-bj",
    icon: <BarChart3 className="h-6 w-6" />,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    label: "LaporanBJ — Laporan Bisnis Biro Jasa",
    desc: "Dashboard laporan agregat seluruh data BirojasaOS: ringkasan klien, sertifikat expiring, pipeline tender, follow-up pending, dan export PDF profesional.",
    tag: "Biro Jasa",
    model: "Export PDF",
  },
];

const MODEL_ROUTER = [
  {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: <Brain className="h-4 w-4" />,
    label: "GPT-4o",
    role: "Orchestrator & Vision",
    desc: "Logika kompleks, analisis gambar, koordinasi agen",
  },
  {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: <Zap className="h-4 w-4" />,
    label: "DeepSeek",
    role: "Kalkulasi & RAB",
    desc: "Chain-of-thought matematis, hemat biaya",
  },
  {
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    icon: <Eye className="h-4 w-4" />,
    label: "Gemini",
    role: "Dokumen Besar",
    desc: "Context window raksasa, analisis PDF tebal",
  },
  {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    icon: <FileText className="h-4 w-4" />,
    label: "Qwen",
    role: "Ekstraksi Data",
    desc: "Structured JSON output, data berantakan → rapi",
  },
];

export default function AiToolsHub() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="border-b border-white/8 px-4 py-3 flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white gap-1.5 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <div className="flex-1" />
        <Badge className="bg-violet-500/15 text-violet-400 border-violet-500/30 gap-1.5">
          <Wrench className="h-3.5 w-3.5" />
          AI Tools Hub
        </Badge>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4">
            <Sparkles className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">AI Tools Hub</h1>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Kumpulan alat AI mandiri untuk pekerjaan konstruksi, K3, dan estimasi biaya — tidak perlu login, langsung pakai.
          </p>
        </div>

        {/* Ekosistem Kompetensi Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Ekosistem Kompetensi SKK — Gelombang 1</h2>
            <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-[10px]">Baru 2026</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {KOMPETENSI_TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <div className="group cursor-pointer border border-white/8 hover:border-blue-500/30 rounded-2xl p-4 bg-white/2 hover:bg-blue-500/5 transition-all">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${tool.iconBg} border border-white/8 flex items-center justify-center ${tool.iconColor}`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white group-hover:text-white/90 mb-0.5">{tool.label}</h3>
                      <p className="text-xs text-white/45 leading-relaxed mb-2">{tool.desc}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[10px] px-2 py-0.5 border ${tool.badgeColor}`}>{tool.tag}</Badge>
                        <span className="text-[10px] text-white/30">via {tool.model}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/25 group-hover:text-white/50 shrink-0 mt-1 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* General AI Tools Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Tools Konstruksi & Biro Jasa</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <div className="group cursor-pointer border border-white/8 hover:border-white/20 rounded-2xl p-5 bg-white/2 hover:bg-white/4 transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${tool.iconBg} border border-white/8 flex items-center justify-center ${tool.iconColor}`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white group-hover:text-white/90">{tool.label}</h3>
                      </div>
                      <p className="text-xs text-white/45 leading-relaxed mb-3">{tool.desc}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[10px] px-2 py-0.5 border ${tool.badgeColor}`}>{tool.tag}</Badge>
                        <span className="text-[10px] text-white/30">via {tool.model}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/25 group-hover:text-white/50 shrink-0 mt-1 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Model Router — Routing AI Otomatis</h2>
          </div>
          <p className="text-xs text-white/40 mb-4">
            Setiap tool secara otomatis memilih model AI terbaik berdasarkan jenis tugas. Tidak ada biaya pemborosan — model mahal hanya dipakai untuk tugas yang membutuhkannya.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MODEL_ROUTER.map((m) => (
              <div key={m.label} className={`border ${m.border} rounded-xl p-3 ${m.bg}`}>
                <div className={`flex items-center gap-1.5 mb-1 ${m.color}`}>
                  {m.icon}
                  <span className="text-xs font-semibold">{m.label}</span>
                </div>
                <p className="text-[10px] text-white/60 font-medium mb-0.5">{m.role}</p>
                <p className="text-[10px] text-white/35 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
