import {
  Clock, AlertTriangle, TrendingUp, Users, MessageSquare, Target,
  Briefcase, Heart, Palette, Scale, Stethoscope, Settings, DollarSign,
  GraduationCap, ShoppingBag, Megaphone, Home, Headphones, Building2,
  Utensils, Plane, Leaf, Dumbbell, Shield, Truck, FileText,
  type LucideIcon
} from "lucide-react";

export interface SectorPainPoint {
  icon: LucideIcon;
  problem: string;
  solution: string;
}

export interface SectorTestimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface SectorUseCase {
  title: string;
  description: string;
}

export interface SectorFAQ {
  question: string;
  answer: string;
}

export interface SectorContent {
  id: string;
  label: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  icon: LucideIcon;
  color: string;
  painPoints: SectorPainPoint[];
  useCases: SectorUseCase[];
  testimonials: SectorTestimonial[];
  faq: SectorFAQ[];
  stats: { value: string; label: string }[];
}

export const featuredSectors: {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}[] = [
  { id: "engineering", label: "Konstruksi & Engineering", description: "Manajemen proyek, laporan otomatis, risk assessment untuk tim konstruksi", icon: Settings, color: "text-orange-500" },
  { id: "medical", label: "Kesehatan & Medis", description: "Asisten informasi pasien, jadwal, FAQ medis, dan panduan kesehatan", icon: Stethoscope, color: "text-red-500" },
  { id: "education", label: "Pendidikan", description: "Tutor AI, asisten akademik, FAQ kampus, dan panduan belajar", icon: GraduationCap, color: "text-blue-500" },
  { id: "finance", label: "Keuangan & Perbankan", description: "Konsultan keuangan AI, analisis investasi, dan panduan pajak", icon: DollarSign, color: "text-green-500" },
  { id: "retail", label: "Retail & E-Commerce", description: "Asisten belanja, rekomendasi produk, dan customer service otomatis", icon: ShoppingBag, color: "text-purple-500" },
  { id: "legal", label: "Hukum & Legal", description: "Konsultasi hukum awal, review dokumen, dan panduan regulasi", icon: Scale, color: "text-amber-600" },
  { id: "hospitality", label: "Hospitality & Pariwisata", description: "Concierge AI, reservasi, info wisata, dan layanan tamu", icon: Plane, color: "text-cyan-500" },
  { id: "marketing", label: "Marketing & Sales", description: "Lead generation, kampanye AI, copywriting, dan analisis pasar", icon: Megaphone, color: "text-pink-500" },
  { id: "customer_success", label: "Customer Service", description: "Helpdesk otomatis, ticketing AI, dan eskalasi cerdas", icon: Heart, color: "text-rose-500" },
  { id: "real_estate", label: "Properti & Real Estate", description: "Asisten pencarian properti, simulasi KPR, dan informasi proyek", icon: Home, color: "text-teal-500" },
  { id: "creative", label: "Kreatif & Media", description: "Brainstorming AI, content planning, review desain, dan copywriting", icon: Palette, color: "text-violet-500" },
  { id: "logistics", label: "Logistik & Supply Chain", description: "Tracking pengiriman, optimasi rute, dan manajemen stok", icon: Truck, color: "text-slate-500" },
];

export const sectorContentMap: Record<string, SectorContent> = {
  engineering: {
    id: "engineering",
    label: "Konstruksi & Engineering",
    tagline: "Platform AI Chatbot Terdalam untuk Industri Jasa Konstruksi Indonesia",
    heroTitle: "131 Hub Orchestrator & 971+ Agent AI Spesialis untuk Industri Jasa Konstruksi",
    heroSubtitle: "Dari Regulasi PUPR/LKPP, Perizinan & SBU/SKK, Tender LPSE, Pasca Tender & Manajemen Kontrak, Pelaksanaan Lapangan, hingga Legalitas Konstruksi — semua dalam satu platform AI. Tanpa coding.",
    icon: Settings,
    color: "text-orange-500",
    painPoints: [
      { icon: AlertTriangle, problem: "Tender LPSE/SPSE rumit: 30+ item dokumen, klasifikasi SBU/SKK, dan SBD PUPR yang sering berubah", solution: "Series Tender Konstruksi & PBJP: hub strategi + spesialis dokumen administrasi/teknis/RAB sesuai Perlem LKPP No. 12/2021" },
      { icon: FileText, problem: "Pasca tender chaos: SPPBJ, jaminan pelaksanaan, addendum, MC, klaim, BAST sering kurang dokumentasi", solution: "Series Pasca Tender & Manajemen Kontrak: 11 chatbot spesialis dari awarding sampai FHO + masa pemeliharaan" },
      { icon: Clock, problem: "Eksekusi lapangan lambat: DPR manual, opname tidak konsisten, koordinasi subkon ribet", solution: "Series Pelaksanaan Proyek Lapangan: 14 chatbot site engineer (RAB pelaksanaan, S-Curve, EVM, K3, NCR, MC tracker)" },
      { icon: Scale, problem: "Sengketa kontrak tinggi, klausul force majeure rumit, pajak konstruksi membingungkan", solution: "Series Legalitas Jasa Konstruksi: review kontrak, dewan sengketa, BANI, ketenagakerjaan, PPh Final 4(2), asuransi CAR/EAR" },
    ],
    useCases: [
      { title: "Tender LPSE End-to-End", description: "Market intelligence → bid-no-bid → konsorsium → dokumen administrasi/teknis/RAB → compliance check sebelum upload SPSE" },
      { title: "Manajemen Kontrak Konstruksi", description: "Review kontrak (FIDIC/SBD), bank garansi, addendum/CCO, monthly certificate, klaim eskalasi, BAST PHO/FHO" },
      { title: "Operasional Lapangan Harian", description: "DPR otomatis, opname QS, EVM (CPI/SPI), NCR/CAPA, punch list, weekly report ke owner/MK" },
      { title: "Legalitas & Sengketa Konstruksi", description: "Reviewer klausul kritis, dewan sengketa, mediasi BANI, kepailitan/PKPU, pajak & asuransi konstruksi" },
      { title: "Sertifikasi SBU/SKK & ISO", description: "Klasifikasi SBU, eligibility SKK, manajemen LSBU/LSP, ISO 9001/14001/37001 (SMAP), CSMAS K3" },
      { title: "Project Brain & Mini Apps 33 Tipe", description: "Pusatkan data proyek + 33 tipe Mini App (rubrik penilaian, risk register, brief intake, studio kompetensi, docgen, e-course) untuk tim internal" },
    ],
    testimonials: [
      { name: "Ir. Budi Santoso", role: "Project Manager, PT Pembangunan Jaya", avatar: "BS", content: "Project Brain mengubah cara kami mengelola data proyek. Laporan mingguan yang biasa butuh 4 jam sekarang selesai dalam 10 menit.", rating: 5 },
      { name: "Sarah Wijaya, ST", role: "QA/QC Manager, Konstruksi Mandiri", avatar: "SW", content: "Issue Log dan Risk Radar sangat membantu tim QC kami. Isu kritis tidak pernah terlewat lagi sejak pakai Gustafta.", rating: 5 },
      { name: "Andi Pratama, MT", role: "Site Engineer, Infrastruktur Nusantara", avatar: "AP", content: "Mini Apps untuk checklist dan action tracker mempercepat koordinasi tim di lapangan. Sangat praktis!", rating: 5 },
    ],
    faq: [
      { question: "Apakah cocok untuk siklus tender LPSE/SPSE?", answer: "Sangat cocok! Gustafta punya 971+ agent AI dalam 131 hub orchestrator khusus konstruksi termasuk Series Tender Konstruksi & PBJP (strategi + dokumen administrasi/teknis/RAB), Series Pasca Tender & Manajemen Kontrak (SPPBJ → BAST FHO), dan Series Pelaksanaan Proyek Lapangan (DPR, opname, EVM, K3). Semua sesuai Perpres 16/2018 jo. 12/2021, Perlem LKPP No. 12/2021, dan SBD PUPR." },
      { question: "Bagaimana dengan aspek hukum kontrak konstruksi?", answer: "Gustafta menyediakan Series Legalitas Jasa Konstruksi: 11 chatbot spesialis untuk review kontrak (FIDIC, SBD PUPR, swasta), force majeure & risk allocation, dewan sengketa konstruksi (DSK) sesuai UU 2/2017, mediasi/arbitrase BANI, ketenagakerjaan PKWT konstruksi, panduan pajak konstruksi termasuk PPh Final 4(2), asuransi CAR/EAR/TPL, dan strategi PKPU/kepailitan. Catatan: konten chatbot bersifat edukatif/informatif, bukan pengganti konsultasi advokat, konsultan pajak, atau notaris berlisensi. Tarif & regulasi spesifik (mis. PPh Final 4(2)) wajib diverifikasi pada sumber resmi DJP/PUPR/LKPP terbaru sebelum dipakai untuk keputusan." },
      { question: "Bisa diakses dari lapangan?", answer: "Ya, Gustafta bisa diakses via WhatsApp, web browser, atau widget chat dari mana saja termasuk di lokasi proyek. Cocok untuk Site Manager, QS, QA/QC, dan tim K3." },
      { question: "Bagaimana dengan keamanan data proyek?", answer: "Data proyek Anda aman dengan enkripsi, token akses per agen, mode publik/privat, dan kontrol domain." },
    ],
    stats: [
      { value: "971+", label: "Agent AI Spesialis" },
      { value: "131", label: "Hub Orchestrator" },
      { value: "33", label: "Tipe Mini App Bawaan" },
      { value: "24/7", label: "AI Selalu Aktif" },
    ],
  },

  medical: {
    id: "medical",
    label: "Kesehatan & Medis",
    tagline: "AI Assistant untuk Layanan Kesehatan yang Lebih Baik",
    heroTitle: "AI Chatbot untuk Layanan Kesehatan & Klinik",
    heroSubtitle: "Buat asisten AI untuk menjawab pertanyaan pasien, mengatur jadwal, memberikan informasi kesehatan, dan meningkatkan layanan klinik Anda. Tanpa coding.",
    icon: Stethoscope,
    color: "text-red-500",
    painPoints: [
      { icon: Clock, problem: "Staff klinik kewalahan menjawab pertanyaan berulang dari pasien", solution: "Chatbot AI menjawab FAQ otomatis 24/7 - jam buka, layanan, persiapan pemeriksaan" },
      { icon: MessageSquare, problem: "Pasien sulit mendapatkan informasi di luar jam kerja", solution: "Asisten AI tersedia 24/7 via WhatsApp dan web untuk informasi dasar kesehatan" },
      { icon: AlertTriangle, problem: "Jadwal dokter sering bentrok atau pasien tidak datang", solution: "Chatbot membantu reminder jadwal dan pre-screening gejala sebelum kunjungan" },
      { icon: Users, problem: "Edukasi kesehatan pasien kurang optimal", solution: "AI memberikan panduan kesehatan personal berdasarkan kondisi dan riwayat pasien" },
    ],
    useCases: [
      { title: "FAQ Klinik Otomatis", description: "Jawab pertanyaan tentang jadwal dokter, layanan, tarif, dan persiapan pemeriksaan" },
      { title: "Pre-screening Gejala", description: "Chatbot membantu pasien menjelaskan gejala sebelum konsultasi untuk efisiensi waktu" },
      { title: "Reminder Jadwal", description: "Otomatis ingatkan pasien tentang jadwal konsultasi via WhatsApp" },
      { title: "Panduan Kesehatan", description: "Berikan tips kesehatan dan panduan perawatan berdasarkan knowledge base medis" },
    ],
    testimonials: [
      { name: "dr. Rina Susanti", role: "Direktur, Klinik Sehat Sentosa", avatar: "RS", content: "Sejak pakai Gustafta, panggilan telepon untuk pertanyaan dasar turun 60%. Staff bisa fokus pada pelayanan langsung.", rating: 5 },
      { name: "dr. Ahmad Fadli, Sp.PD", role: "Internist, RS Harapan Bangsa", avatar: "AF", content: "Pre-screening chatbot membantu pasien menjelaskan gejala lebih terstruktur sebelum konsultasi. Efisiensi meningkat.", rating: 5 },
      { name: "Siti Nurhaliza", role: "Admin Manager, Klinik Pratama", avatar: "SN", content: "Chatbot WhatsApp kami sekarang bisa jawab pertanyaan tentang jadwal dokter dan layanan 24 jam. Sangat membantu!", rating: 5 },
    ],
    faq: [
      { question: "Apakah chatbot bisa memberikan diagnosis medis?", answer: "Tidak, chatbot Gustafta dirancang untuk informasi umum, FAQ, dan pre-screening. Diagnosis tetap dilakukan oleh dokter profesional." },
      { question: "Bagaimana dengan kerahasiaan data pasien?", answer: "Gustafta mendukung enkripsi data, akses kontrol, dan mode privat untuk menjaga kerahasiaan informasi." },
      { question: "Bisa terintegrasi dengan sistem klinik?", answer: "Ya, melalui REST API dan webhook, Gustafta bisa terhubung dengan sistem informasi klinik Anda." },
    ],
    stats: [
      { value: "24/7", label: "Layanan Non-stop" },
      { value: "60%", label: "Pertanyaan Ditangani AI" },
      { value: "100+", label: "Klinik Pengguna" },
      { value: "95%", label: "Kepuasan Pasien" },
    ],
  },

  education: {
    id: "education",
    label: "Pendidikan",
    tagline: "AI Tutor dan Asisten Akademik untuk Institusi Pendidikan",
    heroTitle: "AI Chatbot untuk Dunia Pendidikan",
    heroSubtitle: "Buat tutor AI, asisten akademik, dan helpdesk kampus yang tersedia 24/7. Bantu mahasiswa belajar lebih efektif dengan chatbot cerdas.",
    icon: GraduationCap,
    color: "text-blue-500",
    painPoints: [
      { icon: Clock, problem: "Dosen dan staff kewalahan menjawab pertanyaan repetitif dari mahasiswa", solution: "Chatbot AI menjawab FAQ akademik otomatis - jadwal, kurikulum, prosedur administrasi" },
      { icon: Users, problem: "Mahasiswa kesulitan mendapat bantuan belajar di luar jam kuliah", solution: "Tutor AI tersedia 24/7 untuk membantu pemahaman materi dan latihan soal" },
      { icon: AlertTriangle, problem: "Informasi kampus tersebar di banyak tempat dan sulit diakses", solution: "Knowledge Base terpusat dengan chatbot sebagai pintu akses informasi kampus" },
      { icon: Target, problem: "Sulit memantau progress belajar dan keterlibatan mahasiswa", solution: "Analytics dashboard untuk tracking engagement dan pola pertanyaan mahasiswa" },
    ],
    useCases: [
      { title: "Tutor AI per Mata Kuliah", description: "Chatbot yang memahami materi kuliah dan membantu mahasiswa belajar" },
      { title: "Helpdesk Kampus", description: "Jawab pertanyaan tentang pendaftaran, beasiswa, jadwal, dan prosedur akademik" },
      { title: "Asisten Dosen", description: "Bantu dosen menjawab pertanyaan umum dan arahkan ke materi yang relevan" },
      { title: "Panduan Skripsi/TA", description: "Chatbot yang membimbing mahasiswa dalam proses penulisan tugas akhir" },
    ],
    testimonials: [
      { name: "Prof. Dr. Hendra", role: "Dekan, Fakultas Teknik UNPAD", avatar: "PH", content: "Tutor AI untuk mata kuliah Matematika Teknik membantu mahasiswa belajar mandiri. Nilai rata-rata meningkat 15%.", rating: 5 },
      { name: "Dra. Maya Kartika, M.Pd", role: "Kepala Administrasi, Universitas Merdeka", avatar: "MK", content: "Helpdesk AI mengurangi antrian administrasi hingga 70%. Mahasiswa bisa dapat info kapan saja.", rating: 5 },
      { name: "Rizky Firmansyah, S.Kom", role: "IT Manager, Politeknik Negeri", avatar: "RF", content: "Setup chatbot untuk 5 program studi hanya butuh 2 hari. Knowledge base dari silabus langsung bisa dipakai.", rating: 5 },
    ],
    faq: [
      { question: "Bisa digunakan untuk semua jenjang pendidikan?", answer: "Ya, Gustafta fleksibel untuk SD, SMP, SMA, universitas, maupun kursus/pelatihan." },
      { question: "Bagaimana cara memasukkan materi kuliah?", answer: "Upload PDF, PPT, Word, atau URL ke Knowledge Base. AI otomatis memahami dan bisa menjawab pertanyaan berdasarkan materi tersebut." },
      { question: "Apakah bisa diakses mahasiswa via WhatsApp?", answer: "Ya, chatbot bisa diintegrasikan ke WhatsApp, Telegram, web widget, dan channel lainnya." },
    ],
    stats: [
      { value: "24/7", label: "Tutor Tersedia" },
      { value: "70%", label: "Beban Admin Berkurang" },
      { value: "200+", label: "Institusi Pengguna" },
      { value: "15%", label: "Peningkatan Nilai" },
    ],
  },

  finance: {
    id: "finance",
    label: "Keuangan & Perbankan",
    tagline: "AI Assistant untuk Layanan Keuangan yang Efisien",
    heroTitle: "AI Chatbot untuk Industri Keuangan",
    heroSubtitle: "Buat asisten AI untuk konsultasi keuangan, informasi produk perbankan, dan layanan nasabah otomatis. Tingkatkan efisiensi dengan chatbot cerdas.",
    icon: DollarSign,
    color: "text-green-500",
    painPoints: [
      { icon: Clock, problem: "Customer service kewalahan dengan pertanyaan produk yang berulang", solution: "Chatbot AI menjawab pertanyaan tentang produk, suku bunga, dan prosedur 24/7" },
      { icon: Users, problem: "Nasabah kesulitan memilih produk keuangan yang tepat", solution: "AI memberikan rekomendasi produk berdasarkan profil dan kebutuhan nasabah" },
      { icon: AlertTriangle, problem: "Proses onboarding nasabah baru lambat dan manual", solution: "Chatbot membantu pre-screening dan pengumpulan dokumen awal secara otomatis" },
      { icon: TrendingUp, problem: "Sulit memberikan edukasi keuangan yang personal", solution: "AI memberikan tips dan panduan keuangan sesuai profil risiko nasabah" },
    ],
    useCases: [
      { title: "FAQ Produk Perbankan", description: "Jawab pertanyaan tentang tabungan, deposito, kredit, dan produk investasi" },
      { title: "Simulasi Kredit/KPR", description: "Chatbot membantu nasabah simulasi cicilan dan persyaratan kredit" },
      { title: "Onboarding Nasabah", description: "Panduan langkah demi langkah untuk pembukaan rekening baru" },
      { title: "Edukasi Keuangan", description: "Tips investasi, perencanaan pensiun, dan literasi keuangan personal" },
    ],
    testimonials: [
      { name: "Hadi Wijayanto", role: "VP Digital, Bank Nusantara", avatar: "HW", content: "Chatbot Gustafta menangani 50% pertanyaan nasabah secara otomatis. Tim CS bisa fokus pada kasus kompleks.", rating: 5 },
      { name: "Linda Maharani, SE", role: "Branch Manager, BPR Sejahtera", avatar: "LM", content: "Simulasi kredit otomatis via chatbot sangat membantu nasabah. Konversi aplikasi kredit naik 25%.", rating: 5 },
      { name: "Arief Budiman", role: "Head of Digital, Asuransi Mandala", avatar: "AB", content: "AI membantu menjelaskan produk asuransi dengan bahasa sederhana. Nasabah lebih paham sebelum membeli.", rating: 5 },
    ],
    faq: [
      { question: "Apakah aman untuk data keuangan?", answer: "Ya, Gustafta mendukung enkripsi, akses kontrol per agen, dan mode privat. Data sensitif bisa dikontrol sepenuhnya." },
      { question: "Bisa terintegrasi dengan core banking?", answer: "Melalui REST API dan webhook, Gustafta bisa terhubung dengan sistem perbankan Anda." },
      { question: "Apakah bisa multi-bahasa?", answer: "Ya, chatbot bisa dikonfigurasi untuk berbagai bahasa sesuai kebutuhan nasabah." },
    ],
    stats: [
      { value: "50%", label: "Pertanyaan Otomatis" },
      { value: "25%", label: "Konversi Meningkat" },
      { value: "24/7", label: "Layanan Non-stop" },
      { value: "97%", label: "Akurasi Jawaban" },
    ],
  },

  retail: {
    id: "retail",
    label: "Retail & E-Commerce",
    tagline: "AI Shopping Assistant untuk Toko Online & Offline",
    heroTitle: "AI Chatbot untuk Retail & E-Commerce",
    heroSubtitle: "Buat asisten belanja AI yang membantu pelanggan menemukan produk, menjawab pertanyaan, dan meningkatkan penjualan. Tersedia 24/7 di semua channel.",
    icon: ShoppingBag,
    color: "text-purple-500",
    painPoints: [
      { icon: Clock, problem: "Pelanggan sering meninggalkan keranjang belanja tanpa checkout", solution: "Chatbot AI proaktif membantu pelanggan yang ragu dan menjawab pertanyaan produk" },
      { icon: MessageSquare, problem: "Tim CS kewalahan saat promo dan peak season", solution: "AI menangani volume pertanyaan tinggi secara otomatis tanpa antrian" },
      { icon: Users, problem: "Pelanggan sulit menemukan produk yang sesuai kebutuhan", solution: "AI memberikan rekomendasi produk personal berdasarkan preferensi pelanggan" },
      { icon: TrendingUp, problem: "Kehilangan penjualan di luar jam operasional", solution: "Chatbot tersedia 24/7 untuk melayani dan mengarahkan pembelian" },
    ],
    useCases: [
      { title: "Asisten Belanja AI", description: "Bantu pelanggan menemukan produk, cek stok, dan rekomendasi personal" },
      { title: "Customer Service Otomatis", description: "Jawab pertanyaan tentang pengiriman, retur, ukuran, dan pembayaran" },
      { title: "Promo & Campaign", description: "Informasikan promo terbaru dan voucher secara proaktif ke pelanggan" },
      { title: "After-sales Support", description: "Tracking pesanan, panduan penggunaan produk, dan penanganan keluhan" },
    ],
    testimonials: [
      { name: "Dewi Kartini", role: "Owner, Batik Nusantara Online", avatar: "DK", content: "Chatbot WhatsApp kami menjawab pertanyaan ukuran dan motif batik 24 jam. Penjualan online naik 35%.", rating: 5 },
      { name: "Tommy Hadinata", role: "E-Commerce Manager, Gadget Store", avatar: "TH", content: "Saat promo 11.11, chatbot menangani 80% pertanyaan pelanggan. Tim CS tidak kewalahan lagi.", rating: 5 },
      { name: "Ratna Sari", role: "Marketing Director, Fashion House", avatar: "RS", content: "Rekomendasi produk dari AI sangat akurat. Cart abandonment turun 20% sejak implementasi.", rating: 5 },
    ],
    faq: [
      { question: "Bisa terkoneksi dengan toko online saya?", answer: "Ya, melalui REST API dan webhook. Bisa terhubung dengan Shopify, WooCommerce, Tokopedia, dan platform lainnya." },
      { question: "Bagaimana chatbot mengetahui produk saya?", answer: "Upload katalog produk ke Knowledge Base. AI otomatis memahami dan bisa menjawab pertanyaan tentang produk Anda." },
      { question: "Bisa handle berapa banyak chat sekaligus?", answer: "Tidak terbatas. AI bisa melayani ratusan pelanggan secara bersamaan tanpa antrian." },
    ],
    stats: [
      { value: "35%", label: "Penjualan Meningkat" },
      { value: "80%", label: "Pertanyaan Otomatis" },
      { value: "24/7", label: "Selalu Tersedia" },
      { value: "20%", label: "Cart Abandon Turun" },
    ],
  },

  legal: {
    id: "legal",
    label: "Hukum & Legal",
    tagline: "AI Assistant untuk Konsultasi dan Layanan Hukum",
    heroTitle: "AI Chatbot untuk Firma Hukum & Legal",
    heroSubtitle: "Buat asisten AI untuk konsultasi hukum awal, FAQ legal, dan panduan regulasi. Bantu klien mendapat informasi hukum kapan saja.",
    icon: Scale,
    color: "text-amber-600",
    painPoints: [
      { icon: Clock, problem: "Klien sering bertanya hal dasar yang memakan waktu pengacara", solution: "Chatbot menjawab pertanyaan hukum umum dan prosedur dasar secara otomatis" },
      { icon: Users, problem: "Calon klien ragu menghubungi firma hukum untuk konsultasi awal", solution: "AI menyediakan konsultasi awal gratis 24/7 untuk menyaring dan mengarahkan klien" },
      { icon: AlertTriangle, problem: "Informasi regulasi sering berubah dan sulit ditrack", solution: "Knowledge Base yang di-update berkala dengan peraturan terbaru" },
      { icon: Target, problem: "Lead generation untuk firma hukum sangat terbatas", solution: "Chatbot mengumpulkan informasi klien potensial dan mengkualifikasi kebutuhan mereka" },
    ],
    useCases: [
      { title: "Konsultasi Hukum Awal", description: "Pre-screening kasus klien dan memberikan informasi umum tentang proses hukum" },
      { title: "FAQ Regulasi", description: "Jawab pertanyaan tentang perizinan, kontrak, hak tenaga kerja, dan regulasi bisnis" },
      { title: "Panduan Dokumen Legal", description: "Bantu klien memahami dokumen legal dan persyaratan yang diperlukan" },
      { title: "Lead Qualification", description: "Kualifikasi calon klien berdasarkan jenis kasus dan urgensi" },
    ],
    testimonials: [
      { name: "Dr. Agus Salim, SH, MH", role: "Partner, Kantor Hukum Salim & Associates", avatar: "AS", content: "Chatbot menangani pertanyaan awal klien sehingga tim pengacara bisa fokus pada kasus aktif. Efisiensi naik drastis.", rating: 5 },
      { name: "Maria Theresia, SH", role: "Legal Consultant, Law Firm Jakarta", avatar: "MT", content: "Knowledge Base berisi regulasi terbaru sangat membantu. Klien bisa cek informasi dasar kapan saja.", rating: 5 },
      { name: "Benny Kurniawan, SH", role: "Notaris & PPAT", avatar: "BK", content: "FAQ otomatis tentang persyaratan akta dan sertifikat mengurangi beban admin kami hingga 40%.", rating: 5 },
    ],
    faq: [
      { question: "Apakah chatbot bisa menggantikan konsultasi pengacara?", answer: "Tidak. Chatbot memberikan informasi umum dan pre-screening. Konsultasi profesional tetap dilakukan oleh pengacara berlisensi." },
      { question: "Bagaimana menjaga kerahasiaan klien?", answer: "Gustafta mendukung enkripsi, mode privat, dan kontrol akses untuk menjaga kerahasiaan informasi klien." },
      { question: "Bisa di-update dengan regulasi baru?", answer: "Ya, Knowledge Base bisa di-update kapan saja dengan dokumen regulasi terbaru." },
    ],
    stats: [
      { value: "40%", label: "Beban Admin Berkurang" },
      { value: "24/7", label: "Konsultasi Awal" },
      { value: "3x", label: "Lead Lebih Banyak" },
      { value: "90%", label: "Akurasi Info" },
    ],
  },

  hospitality: {
    id: "hospitality",
    label: "Hospitality & Pariwisata",
    tagline: "AI Concierge untuk Hotel, Resort, dan Destinasi Wisata",
    heroTitle: "AI Chatbot untuk Hospitality & Pariwisata",
    heroSubtitle: "Buat concierge AI yang melayani tamu 24/7, mengelola reservasi, dan memberikan rekomendasi wisata personal. Tingkatkan pengalaman tamu Anda.",
    icon: Plane,
    color: "text-cyan-500",
    painPoints: [
      { icon: Clock, problem: "Tamu hotel sering kesulitan mendapat informasi di luar jam front desk", solution: "Concierge AI tersedia 24/7 via WhatsApp untuk informasi hotel dan area sekitar" },
      { icon: MessageSquare, problem: "Staff kewalahan menjawab pertanyaan yang sama berulang kali", solution: "Chatbot menangani FAQ tentang fasilitas, checkout, transport, dan wisata otomatis" },
      { icon: Users, problem: "Wisatawan butuh rekomendasi personal tapi guide terbatas", solution: "AI memberikan rekomendasi destinasi, kuliner, dan aktivitas berdasarkan preferensi" },
      { icon: TrendingUp, problem: "Booking dan reservasi di luar jam kerja sering terlewat", solution: "Chatbot menangkap lead dan permintaan reservasi 24/7" },
    ],
    useCases: [
      { title: "Virtual Concierge", description: "Informasi fasilitas hotel, room service, laundry, dan layanan lainnya" },
      { title: "Rekomendasi Wisata", description: "Saran destinasi, restoran, dan aktivitas berdasarkan minat tamu" },
      { title: "Booking Assistant", description: "Bantu tamu reservasi restoran, spa, tour, dan transportasi" },
      { title: "Multi-bahasa", description: "Layani tamu internasional dalam berbagai bahasa secara otomatis" },
    ],
    testimonials: [
      { name: "I Made Surya", role: "GM, Bali Paradise Resort", avatar: "MS", content: "Concierge AI kami melayani tamu dalam 5 bahasa. Review score di TripAdvisor naik dari 4.2 ke 4.7.", rating: 5 },
      { name: "Ratih Kumala", role: "Owner, Jogja Heritage Hotel", avatar: "RK", content: "Chatbot WhatsApp menangani 70% pertanyaan tamu. Staff bisa lebih fokus pada pelayanan personal.", rating: 5 },
      { name: "David Chen", role: "Marketing Manager, Tour Operator", avatar: "DC", content: "AI merekomendasikan paket wisata sesuai preferensi. Penjualan paket premium naik 40%.", rating: 5 },
    ],
    faq: [
      { question: "Bisa melayani tamu dalam berbagai bahasa?", answer: "Ya, chatbot bisa dikonfigurasi untuk melayani tamu dalam bahasa Indonesia, Inggris, Mandarin, Jepang, dan lainnya." },
      { question: "Bisa terkoneksi dengan sistem reservasi hotel?", answer: "Ya, melalui REST API Gustafta bisa terhubung dengan PMS (Property Management System) Anda." },
      { question: "Bagaimana cara memasukkan informasi hotel?", answer: "Upload brosur, menu, daftar fasilitas, dan info wisata ke Knowledge Base. AI langsung bisa menjawab berdasarkan data tersebut." },
    ],
    stats: [
      { value: "5+", label: "Bahasa Tersedia" },
      { value: "70%", label: "FAQ Otomatis" },
      { value: "40%", label: "Revenue Naik" },
      { value: "4.7", label: "Rating Tamu" },
    ],
  },

  marketing: {
    id: "marketing",
    label: "Marketing & Sales",
    tagline: "AI untuk Lead Generation dan Kampanye Marketing",
    heroTitle: "AI Chatbot untuk Marketing & Sales",
    heroSubtitle: "Buat chatbot yang menghasilkan leads, mengkualifikasi prospek, dan mendukung tim sales. Tingkatkan konversi dengan AI yang bekerja 24/7.",
    icon: Megaphone,
    color: "text-pink-500",
    painPoints: [
      { icon: Clock, problem: "Lead masuk di luar jam kerja dan tidak ter-follow up", solution: "Chatbot menangkap dan mengkualifikasi leads 24/7 secara otomatis" },
      { icon: Target, problem: "Tim sales menghabiskan waktu untuk prospek yang tidak berkualitas", solution: "AI melakukan pre-qualification dan scoring sebelum meneruskan ke tim sales" },
      { icon: Users, problem: "Engagement pelanggan rendah pada kampanye digital", solution: "Chatbot interaktif meningkatkan engagement dan personalisasi komunikasi" },
      { icon: TrendingUp, problem: "Sulit mengukur ROI dari setiap touchpoint marketing", solution: "Analytics dashboard mentrack engagement, konversi, dan pola interaksi" },
    ],
    useCases: [
      { title: "Lead Generation Bot", description: "Tangkap dan kualifikasi leads dari website, WhatsApp, dan social media" },
      { title: "Product Demo Assistant", description: "Chatbot yang menjelaskan fitur produk dan menjawab pertanyaan prospek" },
      { title: "Campaign Bot", description: "Distribusi konten, follow-up otomatis, dan nurturing leads" },
      { title: "Sales Enablement", description: "Asisten AI untuk tim sales dengan product knowledge lengkap" },
    ],
    testimonials: [
      { name: "Dian Sastro", role: "CMO, Tech Startup Jakarta", avatar: "DS", content: "Lead generation bot menghasilkan 3x lebih banyak qualified leads. Tim sales lebih produktif karena fokus pada prospek berkualitas.", rating: 5 },
      { name: "Reza Rahardian", role: "Digital Marketing Manager", avatar: "RR", content: "Chatbot campaign untuk product launch menghasilkan engagement 5x lipat dibanding email blast biasa.", rating: 5 },
      { name: "Putri Handayani", role: "Sales Director, SaaS Company", avatar: "PH", content: "AI pre-qualification menghemat 60% waktu tim sales. Konversi meningkat karena leads sudah tersaring.", rating: 5 },
    ],
    faq: [
      { question: "Bisa terintegrasi dengan CRM?", answer: "Ya, melalui REST API dan webhook, Gustafta bisa terhubung dengan Salesforce, HubSpot, Pipedrive, dan CRM lainnya." },
      { question: "Bagaimana cara setup lead scoring?", answer: "Konfigurasikan pertanyaan kualifikasi di Persona chatbot. AI otomatis mengumpulkan dan menyimpan data prospek." },
      { question: "Bisa untuk B2B dan B2C?", answer: "Ya, chatbot bisa dikustomisasi untuk segmen B2B maupun B2C dengan persona dan alur yang berbeda." },
    ],
    stats: [
      { value: "3x", label: "Leads Lebih Banyak" },
      { value: "60%", label: "Waktu Sales Hemat" },
      { value: "5x", label: "Engagement Naik" },
      { value: "24/7", label: "Always Working" },
    ],
  },

  customer_success: {
    id: "customer_success",
    label: "Customer Service",
    tagline: "AI Helpdesk untuk Layanan Pelanggan yang Luar Biasa",
    heroTitle: "AI Chatbot untuk Customer Service",
    heroSubtitle: "Buat helpdesk AI yang menjawab pertanyaan pelanggan, menangani keluhan, dan eskalasi kasus secara otomatis. Tingkatkan kepuasan pelanggan.",
    icon: Heart,
    color: "text-rose-500",
    painPoints: [
      { icon: Clock, problem: "Waktu respons ke pelanggan terlalu lama, terutama di luar jam kerja", solution: "AI merespons dalam hitungan detik, 24/7, tanpa antrian" },
      { icon: MessageSquare, problem: "Agent CS menjawab pertanyaan yang sama berulang-ulang", solution: "Chatbot menangani FAQ otomatis, agent fokus pada kasus kompleks" },
      { icon: AlertTriangle, problem: "Keluhan pelanggan sering terlewat atau terlambat ditangani", solution: "AI mendeteksi sentimen negatif dan langsung eskalasi ke supervisor" },
      { icon: Users, problem: "Biaya operasional CS tinggi untuk coverage 24/7", solution: "AI menangani 60-80% volume chat, kurangi kebutuhan shift malam" },
    ],
    useCases: [
      { title: "Helpdesk Otomatis", description: "Jawab pertanyaan umum tentang produk, layanan, kebijakan, dan prosedur" },
      { title: "Ticketing AI", description: "Klasifikasi dan prioritaskan tiket berdasarkan urgensi dan kategori" },
      { title: "Eskalasi Cerdas", description: "Otomatis eskalasi kasus kompleks ke agent manusia yang tepat" },
      { title: "Self-service Portal", description: "Panduan langkah-demi-langkah untuk troubleshooting dan penyelesaian masalah" },
    ],
    testimonials: [
      { name: "Anita Dewi", role: "CS Manager, E-Commerce Terbesar", avatar: "AD", content: "Gustafta menangani 75% pertanyaan pelanggan otomatis. CSAT score naik dari 3.8 ke 4.5.", rating: 5 },
      { name: "Budi Prasetyo", role: "VP Customer Experience", avatar: "BP", content: "Response time turun dari rata-rata 15 menit ke 3 detik. Pelanggan sangat puas dengan kecepatan respon.", rating: 5 },
      { name: "Christine Tanuwijaya", role: "Head of Support, Fintech", avatar: "CT", content: "Eskalasi otomatis memastikan keluhan kritis langsung ditangani. Tidak ada lagi tiket terlewat.", rating: 5 },
    ],
    faq: [
      { question: "Bisa handover ke agent manusia?", answer: "Ya, chatbot bisa diatur untuk eskalasi ke agent manusia saat mendeteksi kasus kompleks atau permintaan klien." },
      { question: "Bagaimana cara melatih chatbot dengan FAQ kita?", answer: "Upload dokumen FAQ, SOP, dan kebijakan ke Knowledge Base. AI langsung bisa menjawab berdasarkan data tersebut." },
      { question: "Bisa tracking kepuasan pelanggan?", answer: "Ya, melalui Analytics dashboard Anda bisa melihat engagement, sentiment, dan pola pertanyaan pelanggan." },
    ],
    stats: [
      { value: "75%", label: "Otomatis Terjawab" },
      { value: "3 dtk", label: "Response Time" },
      { value: "4.5", label: "CSAT Score" },
      { value: "60%", label: "Biaya CS Hemat" },
    ],
  },

  real_estate: {
    id: "real_estate",
    label: "Properti & Real Estate",
    tagline: "AI Assistant untuk Agen Properti dan Developer",
    heroTitle: "AI Chatbot untuk Properti & Real Estate",
    heroSubtitle: "Buat asisten AI yang membantu calon pembeli menemukan properti, simulasi KPR, dan jadwalkan kunjungan. Jual lebih banyak properti.",
    icon: Home,
    color: "text-teal-500",
    painPoints: [
      { icon: Clock, problem: "Calon pembeli sering menghubungi di luar jam kerja", solution: "AI menjawab pertanyaan tentang properti, harga, dan lokasi 24/7" },
      { icon: Users, problem: "Agen kewalahan menangani banyak inquiry sekaligus", solution: "Chatbot melakukan pre-screening dan kualifikasi buyer secara otomatis" },
      { icon: Target, problem: "Sulit mencocokkan properti dengan kebutuhan pembeli", solution: "AI merekomendasikan properti berdasarkan budget, lokasi, dan preferensi" },
      { icon: TrendingUp, problem: "Follow-up ke prospek sering terlewat", solution: "Nurturing otomatis dengan informasi properti baru dan promo terkini" },
    ],
    useCases: [
      { title: "Property Finder Bot", description: "Bantu pembeli menemukan properti sesuai budget, lokasi, dan tipe yang diinginkan" },
      { title: "Simulasi KPR", description: "Kalkulasi cicilan, DP, dan persyaratan KPR secara otomatis" },
      { title: "Virtual Tour Booking", description: "Jadwalkan kunjungan properti dan site visit secara otomatis" },
      { title: "Developer Info Bot", description: "Informasi proyek, progress pembangunan, dan spesifikasi unit" },
    ],
    testimonials: [
      { name: "Irwan Hidayat", role: "Director, Properti Nusantara Group", avatar: "IH", content: "Chatbot menangani inquiry dari 3 proyek sekaligus. Konversi kunjungan site visit naik 45%.", rating: 5 },
      { name: "Stephanie Wijaya", role: "Senior Agent, Century 21", avatar: "SW", content: "AI melakukan pre-screening buyer sehingga saya hanya bertemu prospek yang serius. Closing rate naik 30%.", rating: 5 },
      { name: "Agus Dharma", role: "Marketing Manager, Ciputra Group", avatar: "AD", content: "Simulasi KPR otomatis di chatbot sangat membantu. Calon pembeli sudah siap saat meeting.", rating: 5 },
    ],
    faq: [
      { question: "Bisa menampilkan foto dan detail properti?", answer: "Ya, chatbot bisa mengirim gambar, brosur, dan informasi detail properti dari Knowledge Base." },
      { question: "Bisa untuk property listing banyak proyek?", answer: "Ya, gunakan hierarki Big Idea untuk setiap proyek, Toolbox untuk tipe unit, dan Agent untuk chatbot khusus." },
      { question: "Bisa terkoneksi ke CRM properti?", answer: "Ya, melalui REST API untuk sync data prospek ke CRM atau sistem marketing Anda." },
    ],
    stats: [
      { value: "45%", label: "Kunjungan Naik" },
      { value: "30%", label: "Closing Rate Naik" },
      { value: "24/7", label: "Inquiry Terlayani" },
      { value: "3x", label: "Leads Lebih Banyak" },
    ],
  },

  creative: {
    id: "creative",
    label: "Kreatif & Media",
    tagline: "AI untuk Kreasi Konten dan Manajemen Proyek Kreatif",
    heroTitle: "AI Chatbot untuk Industri Kreatif",
    heroSubtitle: "Buat asisten AI untuk brainstorming, content planning, project management kreatif, dan kolaborasi tim. Percepat proses kreatif Anda.",
    icon: Palette,
    color: "text-violet-500",
    painPoints: [
      { icon: Clock, problem: "Brainstorming dan ideasi memakan waktu lama", solution: "AI membantu generate ide, konsep, dan sudut pandang baru dalam hitungan menit" },
      { icon: AlertTriangle, problem: "Brief dari klien sering tidak jelas dan berubah-ubah", solution: "Chatbot membantu menyusun creative brief terstruktur dengan klien" },
      { icon: Users, problem: "Koordinasi antara tim kreatif dan klien tidak efisien", solution: "Chatbot sebagai hub komunikasi untuk feedback, revisi, dan approval" },
      { icon: Target, problem: "Content calendar sulit dikelola dengan banyak channel", solution: "AI membantu planning dan tracking konten untuk berbagai platform" },
    ],
    useCases: [
      { title: "Creative Brainstorming", description: "Generate ide kampanye, konsep visual, dan angle konten dengan AI" },
      { title: "Brief Builder", description: "Chatbot membantu klien menyusun brief proyek kreatif yang terstruktur" },
      { title: "Content Planning", description: "AI membantu menyusun editorial calendar dan content strategy" },
      { title: "Client Communication", description: "Hub untuk feedback, revisi, dan approval dari klien" },
    ],
    testimonials: [
      { name: "Vanya Sarasvati", role: "Creative Director, Digital Agency", avatar: "VS", content: "AI brainstorming membantu tim kami generate 50+ ide kampanye dalam satu sesi. Proses pitching jauh lebih efisien.", rating: 5 },
      { name: "Ryan Adriandhy", role: "Content Manager, Media Company", avatar: "RA", content: "Content planning dengan AI menghemat 10 jam per minggu. Editorial calendar selalu terisi dan terorganisir.", rating: 5 },
      { name: "Nadia Kusuma", role: "Freelance Designer", avatar: "NK", content: "Chatbot brief builder membantu saya mendapat brief yang jelas dari klien. Revisi berkurang drastis.", rating: 5 },
    ],
    faq: [
      { question: "Bisa untuk copywriting?", answer: "Ya, chatbot bisa membantu generate copy, headline, tagline, dan konten berdasarkan brief dan brand guidelines di Knowledge Base." },
      { question: "Apakah bisa disesuaikan dengan brand tone?", answer: "Ya, konfigurasi persona chatbot sesuai brand voice dan tone of voice yang diinginkan." },
      { question: "Bisa kolaborasi tim?", answer: "Ya, chatbot bisa diakses oleh seluruh tim melalui berbagai channel untuk koordinasi dan brainstorming." },
    ],
    stats: [
      { value: "50+", label: "Ide per Sesi" },
      { value: "10 jam", label: "Hemat per Minggu" },
      { value: "70%", label: "Revisi Berkurang" },
      { value: "3x", label: "Output Meningkat" },
    ],
  },

  logistics: {
    id: "logistics",
    label: "Logistik & Supply Chain",
    tagline: "AI untuk Efisiensi Operasi Logistik",
    heroTitle: "AI Chatbot untuk Logistik & Supply Chain",
    heroSubtitle: "Buat asisten AI untuk tracking pengiriman, koordinasi gudang, dan informasi pelanggan. Tingkatkan efisiensi operasional logistik Anda.",
    icon: Truck,
    color: "text-slate-500",
    painPoints: [
      { icon: Clock, problem: "Pelanggan terus menanyakan status pengiriman", solution: "Chatbot menjawab status tracking otomatis 24/7 via WhatsApp" },
      { icon: AlertTriangle, problem: "Koordinasi antara gudang, driver, dan CS manual", solution: "AI menjadi hub informasi real-time untuk semua pihak" },
      { icon: Users, problem: "CS kewalahan saat peak season dan promo", solution: "Chatbot menangani volume tinggi tanpa tambahan staff" },
      { icon: TrendingUp, problem: "Informasi tarif dan estimasi pengiriman sering berubah", solution: "Knowledge Base selalu di-update dengan tarif dan SLA terbaru" },
    ],
    useCases: [
      { title: "Tracking Bot", description: "Cek status pengiriman dan estimasi tiba secara otomatis" },
      { title: "Kalkulator Tarif", description: "Hitung biaya pengiriman berdasarkan berat, dimensi, dan tujuan" },
      { title: "CS Logistik", description: "Jawab pertanyaan tentang layanan, area coverage, dan prosedur klaim" },
      { title: "Driver Assistant", description: "Chatbot untuk driver: info rute, SOP pengiriman, dan laporan masalah" },
    ],
    testimonials: [
      { name: "Hendri Gunawan", role: "COO, Ekspedisi Cepat Nusantara", avatar: "HG", content: "Tracking bot via WhatsApp mengurangi panggilan CS 65%. Pelanggan puas bisa cek status kapan saja.", rating: 5 },
      { name: "Lisa Permata", role: "CS Manager, JNT Logistics", avatar: "LP", content: "Saat Harbolnas, chatbot menangani 10x volume normal tanpa masalah. Tim CS tetap bisa handle kasus khusus.", rating: 5 },
      { name: "Eko Prasetyo", role: "Fleet Manager, Transportasi Andalan", avatar: "EP", content: "Chatbot untuk driver membantu standarisasi SOP pengiriman. Keluhan pelanggan turun 40%.", rating: 5 },
    ],
    faq: [
      { question: "Bisa terkoneksi dengan sistem tracking?", answer: "Ya, melalui REST API chatbot bisa mengambil data real-time dari TMS (Transportation Management System) Anda." },
      { question: "Bisa untuk pengiriman internasional?", answer: "Ya, chatbot bisa dikonfigurasi multi-bahasa dan di-update dengan tarif internasional." },
      { question: "Bagaimana update tarif otomatis?", answer: "Update Knowledge Base dengan data tarif terbaru. AI langsung menggunakan informasi yang paling baru." },
    ],
    stats: [
      { value: "65%", label: "Panggilan CS Turun" },
      { value: "10x", label: "Capacity Handling" },
      { value: "40%", label: "Keluhan Turun" },
      { value: "24/7", label: "Tracking Tersedia" },
    ],
  },
};

export function getSectorContent(sectorId: string): SectorContent | null {
  return sectorContentMap[sectorId] || null;
}

export function getAllSectorIds(): string[] {
  return Object.keys(sectorContentMap);
}
