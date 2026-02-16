import { storage } from "./storage";

function log(msg: string) {
  const now = new Date().toLocaleTimeString();
  console.log(`${now} [express] ${msg}`);
}

export async function seedPerijinanSertifikasi(userId: string) {
  try {
    const existingSeries = await storage.getSeries();
    const existing = existingSeries.find((s: any) => s.name === "Perijinan dan Sertifikasi Jasa Konstruksi");
    if (existing) {
      log("[Seed] Perijinan & Sertifikasi series already exists, skipping");
      return;
    }

    log("[Seed] Creating Perijinan & Sertifikasi Jasa Konstruksi ecosystem...");

    const series = await storage.createSeries({
      name: "Perijinan dan Sertifikasi Jasa Konstruksi",
      slug: "perijinan-sertifikasi-konstruksi",
      description: "Ekosistem chatbot AI untuk membantu profesional dan perusahaan jasa konstruksi dalam mengurus perijinan usaha, sertifikasi badan usaha (SBU), sertifikasi kompetensi kerja (SKK), dan kepatuhan regulasi sektor konstruksi di Indonesia. Mencakup panduan LPJK, LKPP, OSS, dan standar nasional terkait.",
      tagline: "Panduan Lengkap Perijinan & Sertifikasi Konstruksi Indonesia",
      coverImage: "",
      color: "#059669",
      category: "engineering",
      tags: ["perijinan", "sertifikasi", "konstruksi", "SBU", "SKK", "LPJK", "OSS"],
      language: "id",
      isPublic: true,
      isFeatured: true,
      sortOrder: 2,
    } as any, userId);

    const seriesId = series.id;

    const bigIdeasData = [
      {
        name: "Sertifikasi Badan Usaha (SBU)",
        type: "mentoring",
        description: "Panduan lengkap pengurusan Sertifikasi Badan Usaha (SBU) jasa konstruksi melalui LPJK/OSS. Mencakup klasifikasi dan kualifikasi usaha, persyaratan dokumen, proses pengajuan, hingga perpanjangan dan peningkatan grade.",
        goals: ["Memahami klasifikasi dan kualifikasi SBU", "Panduan proses pengajuan SBU baru", "Strategi peningkatan grade SBU", "Perpanjangan dan pemeliharaan SBU"],
        targetAudience: "Perusahaan jasa konstruksi, direktur perusahaan, admin perijinan",
        expectedOutcome: "Perusahaan berhasil mendapatkan dan memelihara SBU sesuai klasifikasi yang tepat",
        sortOrder: 1,
        isActive: true,
        toolboxes: [
          { name: "Klasifikasi & Kualifikasi SBU", description: "Panduan klasifikasi (umum/spesialis) dan kualifikasi (kecil/menengah/besar) SBU jasa konstruksi", purpose: "Membantu menentukan klasifikasi dan kualifikasi SBU yang tepat untuk perusahaan", capabilities: ["Analisis bidang usaha", "Penentuan sub-klasifikasi", "Rekomendasi kualifikasi grade"], sortOrder: 1 },
          { name: "Pengajuan & Proses SBU", description: "Panduan lengkap proses pengajuan SBU baru melalui LPJK dan OSS", purpose: "Memandu proses pengajuan SBU dari awal hingga terbit", capabilities: ["Checklist dokumen", "Panduan pengisian formulir", "Tracking status pengajuan"], sortOrder: 2 },
          { name: "Perpanjangan & Peningkatan SBU", description: "Panduan perpanjangan masa berlaku dan peningkatan grade SBU", purpose: "Membantu proses perpanjangan dan peningkatan kualifikasi SBU", capabilities: ["Syarat perpanjangan", "Strategi peningkatan grade", "Timeline dan biaya"], sortOrder: 3 },
          { name: "Persyaratan Teknis SBU", description: "Detail persyaratan teknis dan administrasi SBU per klasifikasi", purpose: "Menyediakan informasi detail persyaratan SBU", capabilities: ["Persyaratan PJT/PJBU", "Syarat pengalaman", "Persyaratan keuangan"], sortOrder: 4 },
        ]
      },
      {
        name: "Sertifikasi Kompetensi Kerja (SKK)",
        type: "mentoring",
        description: "Panduan persiapan dan pengurusan Sertifikasi Kompetensi Kerja (SKK) untuk tenaga kerja konstruksi. Mencakup jenjang kualifikasi, unit kompetensi, portofolio, simulasi ujian, dan pemeliharaan sertifikat.",
        goals: ["Memahami jenjang kualifikasi SKK", "Persiapan portofolio dan dokumen", "Simulasi ujian sertifikasi", "Pemeliharaan dan perpanjangan SKK"],
        targetAudience: "Tenaga ahli konstruksi, insinyur, teknisi, operator",
        expectedOutcome: "Tenaga kerja lulus sertifikasi dan memiliki SKK yang valid",
        sortOrder: 2,
        isActive: true,
        toolboxes: [
          { name: "Jenjang & Unit Kompetensi SKK", description: "Panduan jenjang kualifikasi SKK dan unit kompetensi yang diujikan", purpose: "Memahami struktur jenjang dan materi uji SKK", capabilities: ["Jenjang Ahli Utama/Madya/Muda", "Unit kompetensi per jenjang", "Mapping kompetensi"], sortOrder: 1 },
          { name: "Persiapan Dokumen & Portofolio SKK", description: "Panduan penyusunan portofolio dan dokumen persyaratan SKK", purpose: "Membantu menyiapkan dokumen yang memenuhi syarat", capabilities: ["Template portofolio", "Checklist dokumen", "Tips penyusunan"], sortOrder: 2 },
          { name: "Simulasi Ujian SKK", description: "Simulasi ujian sertifikasi kompetensi kerja konstruksi", purpose: "Latihan dan simulasi untuk persiapan ujian SKK", capabilities: ["Soal latihan per jenjang", "Simulasi wawancara", "Penilaian mandiri"], sortOrder: 3 },
          { name: "Pemeliharaan & Perpanjangan SKK", description: "Panduan pemeliharaan kompetensi dan perpanjangan sertifikat SKK", purpose: "Memastikan SKK tetap valid dan ter-update", capabilities: ["Syarat perpanjangan", "Pengembangan profesional berkelanjutan", "Rekam jejak kompetensi"], sortOrder: 4 },
        ]
      },
      {
        name: "Perijinan Usaha Konstruksi",
        type: "problem",
        description: "Panduan lengkap perijinan usaha jasa konstruksi melalui sistem OSS (Online Single Submission) dan instansi terkait. Mencakup NIB, IUJK, izin usaha, dan kepatuhan regulasi PP 14/2021.",
        goals: ["Memahami alur perijinan OSS", "Pengurusan NIB dan IUJK", "Kepatuhan PP 14/2021", "Persyaratan dan dokumen perijinan"],
        targetAudience: "Calon pengusaha konstruksi, perusahaan baru, admin perijinan",
        expectedOutcome: "Perusahaan memiliki seluruh perijinan usaha konstruksi yang lengkap dan valid",
        sortOrder: 3,
        isActive: true,
        toolboxes: [
          { name: "NIB & Izin Usaha via OSS", description: "Panduan pengurusan Nomor Induk Berusaha dan izin usaha melalui OSS RBA", purpose: "Memandu proses perijinan usaha konstruksi online", capabilities: ["Registrasi OSS", "Pengurusan NIB", "KBLI konstruksi", "Izin usaha sektoral"], sortOrder: 1 },
          { name: "IUJK & Izin Pelaksanaan", description: "Panduan Izin Usaha Jasa Konstruksi dan izin pelaksanaan kegiatan", purpose: "Membantu pengurusan IUJK dan izin operasional", capabilities: ["Syarat IUJK", "Proses pengajuan", "Izin pelaksanaan proyek"], sortOrder: 2 },
          { name: "Persyaratan Administrasi Perusahaan", description: "Panduan kelengkapan administrasi perusahaan jasa konstruksi", purpose: "Memastikan kelengkapan dokumen administrasi perusahaan", capabilities: ["Akta perusahaan", "NPWP", "Domisili", "Laporan keuangan"], sortOrder: 3 },
          { name: "Kepatuhan & Audit Perijinan", description: "Panduan kepatuhan regulasi dan persiapan audit perijinan", purpose: "Membantu perusahaan menjaga kepatuhan perijinan", capabilities: ["Checklist kepatuhan", "Persiapan audit", "Sanksi dan remedi"], sortOrder: 4 },
        ]
      },
      {
        name: "Regulasi dan Standar Konstruksi",
        type: "inspiration",
        description: "Pemahaman regulasi, undang-undang, peraturan pemerintah, dan standar nasional yang berlaku di sektor jasa konstruksi Indonesia. Mencakup UU Jasa Konstruksi, PP turunan, Permen PUPR, dan SNI terkait.",
        goals: ["Memahami UU No. 2/2017 Jasa Konstruksi", "Menguasai PP dan Permen terkait", "Kepatuhan standar SNI konstruksi", "Update regulasi terbaru"],
        targetAudience: "Profesional konstruksi, konsultan hukum konstruksi, pemilik perusahaan",
        expectedOutcome: "Pemahaman komprehensif regulasi jasa konstruksi Indonesia",
        sortOrder: 4,
        isActive: true,
        toolboxes: [
          { name: "UU Jasa Konstruksi & PP Turunan", description: "Pemahaman UU No. 2/2017 tentang Jasa Konstruksi dan Peraturan Pemerintah turunannya", purpose: "Penguasaan kerangka hukum utama jasa konstruksi", capabilities: ["UU 2/2017", "PP 14/2021", "PP 22/2020", "Interpretasi pasal"], sortOrder: 1 },
          { name: "Permen PUPR & Regulasi Teknis", description: "Peraturan Menteri PUPR dan regulasi teknis terkait jasa konstruksi", purpose: "Memahami regulasi teknis yang berlaku", capabilities: ["Permen PUPR terkini", "Standar teknis", "Pedoman pelaksanaan"], sortOrder: 2 },
          { name: "SNI & Standar Konstruksi", description: "Standar Nasional Indonesia yang berlaku di sektor konstruksi", purpose: "Penguasaan standar teknis konstruksi", capabilities: ["SNI beton", "SNI baja", "SNI gempa", "SNI keselamatan"], sortOrder: 3 },
          { name: "Update Regulasi & Kebijakan", description: "Informasi terbaru perubahan regulasi dan kebijakan sektor konstruksi", purpose: "Mengikuti perkembangan regulasi terkini", capabilities: ["Perubahan regulasi", "Kebijakan baru", "Masa transisi", "Dampak industri"], sortOrder: 4 },
        ]
      },
      {
        name: "Tender dan Pengadaan Jasa Konstruksi",
        type: "problem",
        description: "Panduan mengikuti proses tender dan pengadaan jasa konstruksi baik pemerintah (e-procurement LKPP) maupun swasta. Mencakup persyaratan kualifikasi, penyusunan dokumen penawaran, evaluasi, dan kontrak.",
        goals: ["Memahami sistem e-procurement", "Penyusunan dokumen penawaran", "Strategi memenangkan tender", "Manajemen kontrak konstruksi"],
        targetAudience: "Perusahaan kontraktor, estimator, manajer proyek, admin tender",
        expectedOutcome: "Perusahaan mampu mengikuti dan memenangkan tender secara kompetitif",
        sortOrder: 5,
        isActive: true,
        toolboxes: [
          { name: "Sistem e-Procurement & LKPP", description: "Panduan penggunaan sistem e-procurement pemerintah melalui LKPP/LPSE", purpose: "Menguasai platform tender elektronik", capabilities: ["Registrasi LPSE", "e-Tendering", "e-Purchasing", "Katalog elektronik"], sortOrder: 1 },
          { name: "Penyusunan Dokumen Penawaran", description: "Panduan menyusun dokumen penawaran teknis dan harga yang kompetitif", purpose: "Menyusun penawaran yang memenuhi syarat dan kompetitif", capabilities: ["Dokumen kualifikasi", "Penawaran teknis", "RAB/penawaran harga", "Jadwal pelaksanaan"], sortOrder: 2 },
          { name: "Evaluasi & Negosiasi Kontrak", description: "Panduan proses evaluasi penawaran dan negosiasi kontrak konstruksi", purpose: "Memahami proses evaluasi dan kontrak", capabilities: ["Metode evaluasi", "Negosiasi harga", "Klausul kontrak", "FIDIC/standar kontrak"], sortOrder: 3 },
          { name: "Manajemen Kontrak & Klaim", description: "Panduan manajemen kontrak, addendum, dan penyelesaian klaim", purpose: "Mengelola kontrak konstruksi secara efektif", capabilities: ["Administrasi kontrak", "Change order", "Klaim dan dispute", "Penyelesaian sengketa"], sortOrder: 4 },
        ]
      },
    ];

    for (const biData of bigIdeasData) {
      const bigIdea = await storage.createBigIdea({
        seriesId: seriesId,
        name: biData.name,
        type: biData.type,
        description: biData.description,
        goals: biData.goals,
        targetAudience: biData.targetAudience,
        expectedOutcome: biData.expectedOutcome,
        sortOrder: biData.sortOrder,
        isActive: biData.isActive,
      } as any);

      for (const tbData of biData.toolboxes) {
        await storage.createToolbox({
          bigIdeaId: bigIdea.id,
          name: tbData.name,
          description: tbData.description,
          purpose: tbData.purpose,
          capabilities: tbData.capabilities,
          sortOrder: tbData.sortOrder,
          isActive: true,
        } as any);
      }

      log(`[Seed] Created Big Idea: ${biData.name} with ${biData.toolboxes.length} toolboxes`);
    }

    log("[Seed] Perijinan & Sertifikasi Jasa Konstruksi ecosystem created successfully!");
    log(`[Seed] Total: 1 Series, ${bigIdeasData.length} Big Ideas, ${bigIdeasData.reduce((sum, bi) => sum + bi.toolboxes.length, 0)} Toolboxes`);
  } catch (error) {
    log(`[Seed] Error creating Perijinan ecosystem: ${error}`);
  }
}
