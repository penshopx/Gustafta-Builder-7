import { storage } from "./storage";

function log(msg: string) {
  const now = new Date().toLocaleTimeString();
  console.log(`${now} [express] ${msg}`);
}

export async function seedCivilproEcosystem(userId: string) {
  try {
    const existingSeries = await storage.getSeries();
    const civilproSeries = existingSeries.find((s: any) => s.name === "CIVILPRO");
    if (civilproSeries) {
      const existingAgents = await storage.getAgents();
      const hasSKK = existingAgents.some((a: any) => a.name === "SKK Sipil Orchestrator");
      const hasCIVILOPRO = existingAgents.some((a: any) => a.name === "CIVILOPRO");
      if (hasSKK && hasCIVILOPRO) {
        log("[Seed] CIVILPRO ecosystem already exists, skipping");
        return;
      }
      log("[Seed] CIVILPRO series exists but incomplete, skipping to avoid duplicates");
      return;
    }

    log("[Seed] Creating CIVILPRO ecosystem...");

    const series = await storage.createSeries({
      name: "CIVILPRO",
      slug: "civilpro",
      description: "CIVILPRO adalah ekosistem chatbot AI yang dirancang khusus untuk para profesional di bidang Teknik Sipil (Civil Engineering). Platform ini menggabungkan berbagai kemampuan AI mulai dari pemecahan masalah teknis proyek nyata, edukasi dan pengembangan kompetensi bertahap, pembekalan dan simulasi uji Sertifikasi Kompetensi Kerja (SKK), hingga eksplorasi ide inovatif dan masa depan infrastruktur.",
      tagline: "Ekosistem AI untuk Profesional Teknik Sipil",
      coverImage: "",
      color: "#6366f1",
      category: "engineering",
      tags: ["civil-engineering", "construction", "SKK"],
      language: "id",
      isPublic: true,
      isFeatured: true,
      sortOrder: 1,
    } as any, userId);

    const bigIdeasData = [
      { name: "CIVILPRO Inspire", type: "inspiration", description: "CIVILPRO Inspire bertujuan untuk mendorong pemikiran inovatif dan eksplorasi masa depan di bidang teknik sipil.", isActive: true, sortOrder: 1 },
      { name: "CIVILPRO Solver", type: "problem", description: "CIVILPRO Solver difokuskan pada pemecahan masalah teknis nyata yang dihadapi Insinyur Sipil dalam proyek konstruksi dan infrastruktur.", isActive: false, sortOrder: 2 },
      { name: "CIVILPRO SKK", type: "mentoring", description: "CIVILPRO SKK dirancang khusus untuk pembekalan dan simulasi uji Sertifikasi Kompetensi Kerja (SKK) bidang Sipil.", isActive: false, sortOrder: 3 },
      { name: "CIVILPRO Learn", type: "mentoring", description: "CIVILPRO Learn menyediakan platform edukasi dan pengembangan kompetensi bertahap untuk profesional teknik sipil.", isActive: false, sortOrder: 4 },
      { name: "Konsultasi Teknis & Pengambilan Keputusan Proyek", type: "problem", description: "Big Idea untuk membantu para profesional teknik sipil dan manajemen konstruksi dalam melakukan konsultasi teknis, diagnosis masalah lapangan, serta pengambilan keputusan proyek berbasis parameter mutu, waktu, biaya, dan risiko.", isActive: false, sortOrder: 5 },
    ];

    const bigIdeas: Record<string, any> = {};
    for (const bi of bigIdeasData) {
      const created = await storage.createBigIdea({
        ...bi,
        seriesId: parseInt(series.id),
      } as any);
      bigIdeas[bi.name] = created;
    }

    const toolboxesData: Array<{ name: string; bigIdea: string; description: string; purpose: string }> = [
      { name: "SKK Ahli Utama Toolbox", bigIdea: "CIVILPRO SKK", description: "Toolbox untuk persiapan SKK Ahli Utama", purpose: "Mempersiapkan tenaga konstruksi level Ahli Utama menghadapi uji kompetensi SKK bidang Sipil" },
      { name: "SKK Ahli Madya Toolbox", bigIdea: "CIVILPRO SKK", description: "Toolbox untuk persiapan SKK Ahli Madya", purpose: "Mempersiapkan tenaga konstruksi level Ahli Madya menghadapi uji kompetensi SKK bidang Sipil" },
      { name: "SKK Ahli Muda Toolbox", bigIdea: "CIVILPRO SKK", description: "Toolbox untuk persiapan SKK Ahli Muda", purpose: "Mempersiapkan tenaga konstruksi level Ahli Muda menghadapi uji kompetensi SKK bidang Sipil" },
      { name: "SKK Operator / Teknisi Toolbox", bigIdea: "CIVILPRO SKK", description: "Toolbox untuk persiapan SKK Operator dan Teknisi", purpose: "Mempersiapkan tenaga konstruksi level Operator dan Teknisi menghadapi uji kompetensi SKK bidang Sipil" },
      { name: "Innovation & Optimization Toolbox", bigIdea: "CIVILPRO Inspire", description: "Eksplorasi metode inovatif dan optimasi proses konstruksi menggunakan teknologi terbaru", purpose: "Membantu pengguna menemukan pendekatan inovatif untuk meningkatkan efisiensi dan kualitas konstruksi" },
      { name: "Sustainability & Green Construction Toolbox", bigIdea: "CIVILPRO Inspire", description: "Panduan konstruksi berkelanjutan dan ramah lingkungan", purpose: "Mendorong penerapan prinsip green construction dan keberlanjutan dalam proyek sipil" },
      { name: "Digital Transformation Toolbox", bigIdea: "CIVILPRO Inspire", description: "Transformasi digital dalam industri konstruksi: BIM, IoT, AI", purpose: "Memperkenalkan dan membimbing penerapan teknologi digital di proyek konstruksi" },
      { name: "Future Infrastructure Toolbox", bigIdea: "CIVILPRO Inspire", description: "Eksplorasi masa depan infrastruktur dan tren teknologi sipil", purpose: "Membuka wawasan tentang perkembangan infrastruktur masa depan" },
      { name: "Structural Problem Solving Toolbox", bigIdea: "CIVILPRO Solver", description: "Diagnosis dan pemecahan masalah struktur: beton, baja, kayu", purpose: "Membantu menganalisis kegagalan struktur dan memberikan rekomendasi solusi teknis" },
      { name: "Geotechnical & Foundation Toolbox", bigIdea: "CIVILPRO Solver", description: "Analisis masalah geoteknik dan fondasi", purpose: "Membantu diagnosis masalah tanah, fondasi, dan perkuatan struktur bawah" },
      { name: "Quality Control & Materials Toolbox", bigIdea: "CIVILPRO Solver", description: "Pengendalian mutu material dan pekerjaan konstruksi", purpose: "Membantu identifikasi masalah mutu dan rekomendasi penanganan material" },
      { name: "Schedule & Cost Control Toolbox", bigIdea: "CIVILPRO Solver", description: "Pengendalian jadwal dan biaya proyek konstruksi", purpose: "Membantu analisis keterlambatan dan pembengkakan biaya proyek" },
      { name: "Safety & Risk Management Toolbox", bigIdea: "CIVILPRO Solver", description: "Manajemen risiko dan keselamatan kerja konstruksi", purpose: "Membantu identifikasi risiko K3 dan mitigasi bahaya di proyek konstruksi" },
      { name: "Fundamental Engineering Toolbox", bigIdea: "CIVILPRO Learn", description: "Pembelajaran dasar teknik sipil: mekanika, struktur, hidrologi", purpose: "Menyediakan materi edukasi dasar teknik sipil secara bertahap" },
      { name: "Standards & Codes Toolbox", bigIdea: "CIVILPRO Learn", description: "Pemahaman standar dan regulasi konstruksi Indonesia", purpose: "Membantu mempelajari SNI, peraturan konstruksi, dan standar teknis" },
      { name: "Practical Skills Toolbox", bigIdea: "CIVILPRO Learn", description: "Keterampilan praktis lapangan dan supervisi", purpose: "Mengembangkan kemampuan praktis untuk pelaksanaan dan pengawasan proyek" },
      { name: "Professional Development Toolbox", bigIdea: "CIVILPRO Learn", description: "Pengembangan karir profesional teknik sipil", purpose: "Membantu perencanaan dan pengembangan karir di bidang teknik sipil" },
      { name: "Core Foundation", bigIdea: "Konsultasi Teknis & Pengambilan Keputusan Proyek", description: "Toolbox dasar yang menjadi fondasi seluruh sistem konsultasi teknis.", purpose: "Menyediakan framework dasar untuk intake proyek dan diagnosis awal masalah teknis" },
      { name: "Decision Support", bigIdea: "Konsultasi Teknis & Pengambilan Keputusan Proyek", description: "Toolbox untuk mendukung pengambilan keputusan proyek berbasis multi-kriteria.", purpose: "Membantu pengambilan keputusan proyek yang terukur dan defensible" },
      { name: "Field Diagnosis", bigIdea: "Konsultasi Teknis & Pengambilan Keputusan Proyek", description: "Toolbox untuk diagnosis masalah lapangan.", purpose: "Diagnosis cepat dan akurat untuk masalah lapangan konstruksi" },
      { name: "Risk & Safety", bigIdea: "Konsultasi Teknis & Pengambilan Keputusan Proyek", description: "Toolbox untuk manajemen risiko proyek, K3 konstruksi.", purpose: "Meminimalkan risiko dan meningkatkan keselamatan proyek" },
      { name: "Quality & Compliance", bigIdea: "Konsultasi Teknis & Pengambilan Keputusan Proyek", description: "Toolbox untuk pengendalian mutu, kepatuhan standar.", purpose: "Memastikan mutu proyek sesuai standar dan spesifikasi" },
      { name: "Documentation & Reporting", bigIdea: "Konsultasi Teknis & Pengambilan Keputusan Proyek", description: "Toolbox untuk penyusunan dokumen teknis.", purpose: "Mempercepat dan menstandardisasi dokumentasi proyek" },
      { name: "Mentoring & Evaluation", bigIdea: "Konsultasi Teknis & Pengambilan Keputusan Proyek", description: "Toolbox untuk evaluasi kesehatan proyek, mentoring tim teknis.", purpose: "Meningkatkan kapasitas tim dan mengevaluasi performa proyek" },
    ];

    const toolboxes: Record<string, any> = {};
    for (const tb of toolboxesData) {
      const biId = bigIdeas[tb.bigIdea]?.id;
      if (!biId) continue;
      const created = await storage.createToolbox({
        name: tb.name,
        bigIdeaId: parseInt(biId),
        description: tb.description,
        purpose: tb.purpose,
      } as any);
      toolboxes[tb.name] = created;
    }

    const skkOrchestrator = await storage.createAgent({
      name: "SKK Sipil Orchestrator",
      description: "Chatbot Orchestrator untuk Sertifikasi Kompetensi Kerja (SKK) bidang Sipil.",
      tagline: "Asisten Digital Pembekalan & Simulasi Uji Kompetensi SKK Bidang Sipil",
      category: "engineering",
      subcategory: "civil-engineering",
      isPublic: true,
      aiModel: "gpt-4o",
      temperature: "0.7",
      maxTokens: 2048,
      systemPrompt: `Kamu adalah SKK Sipil Orchestrator — asisten AI utama untuk pembekalan dan simulasi uji Sertifikasi Kompetensi Kerja (SKK) bidang Sipil di Indonesia.

PERAN UTAMA:
- Menjadi pusat kendali yang mengarahkan pengguna ke modul spesialis berdasarkan level klasifikasi dan jabatan kerja
- Mendukung dua mode pengguna: MODE ASESI (peserta uji kompetensi) dan MODE ASESOR (penguji kompetensi)

LEVEL KLASIFIKASI:
- Ahli Utama: Penanggung jawab teknis tingkat tertinggi
- Ahli Madya: Pelaksana teknis senior
- Ahli Muda: Pelaksana teknis junior
- Operator/Teknisi: Pelaksana operasional dan teknis lapangan`,
      greetingMessage: "Selamat datang di SKK Sipil Orchestrator! Saya adalah asisten digital Anda untuk pembekalan dan simulasi uji Sertifikasi Kompetensi Kerja (SKK) bidang Sipil.",
      conversationStarters: JSON.stringify(["Saya ingin mempersiapkan uji kompetensi SKK", "Bantu saya simulasi ujian SKK Sipil", "Apa saja jabatan kerja SKK bidang Sipil?"]),
      personality: "Profesional, suportif, terstruktur, dan berbasis data.",
    } as any);

    const skkLevels = [
      { name: "SKK Ahli Utama", toolbox: "SKK Ahli Utama Toolbox", tagline: "Pembekalan SKK Level Ahli Utama", desc: "Chatbot spesialis untuk pembekalan dan simulasi uji kompetensi SKK level Ahli Utama bidang Sipil.", greeting: "Selamat datang di modul SKK Ahli Utama!", prompt: "Kamu adalah chatbot spesialis SKK Ahli Utama bidang Sipil. Fokus pada penanggung jawab teknis tingkat tertinggi." },
      { name: "SKK Ahli Madya", toolbox: "SKK Ahli Madya Toolbox", tagline: "Pembekalan SKK Level Ahli Madya", desc: "Chatbot spesialis untuk pembekalan dan simulasi uji kompetensi SKK level Ahli Madya bidang Sipil.", greeting: "Selamat datang di modul SKK Ahli Madya!", prompt: "Kamu adalah chatbot spesialis SKK Ahli Madya bidang Sipil. Fokus pada pelaksana teknis senior." },
      { name: "SKK Ahli Muda", toolbox: "SKK Ahli Muda Toolbox", tagline: "Pembekalan SKK Level Ahli Muda", desc: "Chatbot spesialis untuk pembekalan dan simulasi uji kompetensi SKK level Ahli Muda bidang Sipil.", greeting: "Selamat datang di modul SKK Ahli Muda!", prompt: "Kamu adalah chatbot spesialis SKK Ahli Muda bidang Sipil. Fokus pada pelaksana teknis junior." },
      { name: "SKK Operator / Teknisi", toolbox: "SKK Operator / Teknisi Toolbox", tagline: "Pembekalan SKK Level Operator/Teknisi", desc: "Chatbot spesialis untuk pembekalan dan simulasi uji kompetensi SKK level Operator dan Teknisi bidang Sipil.", greeting: "Selamat datang di modul SKK Operator/Teknisi!", prompt: "Kamu adalah chatbot spesialis SKK Operator/Teknisi bidang Sipil. Fokus pada keterampilan operasional." },
    ];

    const skkParentAgents: Record<string, any> = {};
    for (const level of skkLevels) {
      const tbId = toolboxes[level.toolbox]?.id;
      const agent = await storage.createAgent({
        name: level.name,
        description: level.desc,
        tagline: level.tagline,
        category: "engineering",
        subcategory: "civil-engineering",
        isPublic: true,
        aiModel: "gpt-4o",
        temperature: "0.7",
        maxTokens: 2048,
        toolboxId: tbId ? parseInt(tbId) : undefined,
        parentAgentId: parseInt(skkOrchestrator.id),
        systemPrompt: level.prompt,
        greetingMessage: level.greeting,
        conversationStarters: JSON.stringify(["Simulasi ujian", "Latihan wawancara", "Unit kompetensi", "Panduan portofolio"]),
        personality: "Profesional dan suportif",
      } as any);
      skkParentAgents[level.name] = agent;
    }

    const skkSubModules = [
      { prefix: "Ahli Utama", parent: "SKK Ahli Utama", toolbox: "SKK Ahli Utama Toolbox" },
      { prefix: "Ahli Madya", parent: "SKK Ahli Madya", toolbox: "SKK Ahli Madya Toolbox" },
      { prefix: "Ahli Muda", parent: "SKK Ahli Muda", toolbox: "SKK Ahli Muda Toolbox" },
      { prefix: "Operator/Teknisi", parent: "SKK Operator / Teknisi", toolbox: "SKK Operator / Teknisi Toolbox" },
    ];

    const subModuleTypes = [
      { suffix: "Simulasi Ujian", desc: "Agen simulasi ujian tertulis dan pilihan ganda", tagline: "Simulasi Ujian SKK", temp: "0.5" },
      { suffix: "Wawancara Kompetensi", desc: "Agen latihan wawancara asesmen kompetensi", tagline: "Latihan Wawancara SKK", temp: "0.7" },
      { suffix: "Portofolio & Bukti", desc: "Agen panduan penyusunan portofolio dan bukti kompetensi", tagline: "Panduan Portofolio SKK", temp: "0.7" },
      { suffix: "Pembekalan Materi", desc: "Agen pembekalan materi dan pembelajaran", tagline: "Pembekalan Materi SKK", temp: "0.7" },
    ];

    for (const mod of skkSubModules) {
      const parentAgent = skkParentAgents[mod.parent];
      const tbId = toolboxes[mod.toolbox]?.id;
      for (const sub of subModuleTypes) {
        await storage.createAgent({
          name: `${sub.suffix} ${mod.prefix}`,
          description: `${sub.desc} untuk SKK level ${mod.prefix}.`,
          tagline: `${sub.tagline} ${mod.prefix}`,
          category: "engineering",
          subcategory: "civil-engineering",
          isPublic: true,
          aiModel: "gpt-4o",
          temperature: sub.temp,
          maxTokens: 2048,
          toolboxId: tbId ? parseInt(tbId) : undefined,
          parentAgentId: parentAgent ? parseInt(parentAgent.id) : undefined,
          systemPrompt: `Kamu adalah ${sub.suffix} untuk SKK level ${mod.prefix} bidang Sipil.`,
          greetingMessage: `Selamat datang di modul ${sub.suffix} ${mod.prefix}!`,
          personality: "Profesional dan suportif",
        } as any);
      }
    }

    const civiloproOrchestrator = await storage.createAgent({
      name: "CIVILOPRO",
      description: `CIVILOPRO adalah chatbot orkestrator untuk bidang teknik sipil dan manajemen konstruksi yang membantu pengguna melakukan konsultasi teknis, analisis masalah lapangan, serta pengambilan keputusan proyek berbasis parameter mutu, waktu, biaya, dan risiko.`,
      tagline: "Asisten AI untuk Konsultasi Teknis & Keputusan Proyek Konstruksi",
      category: "engineering",
      subcategory: "civil_engineer",
      isPublic: true,
      aiModel: "gpt-4o-mini",
      temperature: "0.7",
      maxTokens: 1024,
      bigIdeaId: bigIdeas["Konsultasi Teknis & Pengambilan Keputusan Proyek"] ? parseInt(bigIdeas["Konsultasi Teknis & Pengambilan Keputusan Proyek"].id) : undefined,
      systemPrompt: `You are CIVILOPRO, an orchestrator chatbot for technical consultation and project decision-making in civil engineering and construction projects.

Your role is to act as a professional project consultant who:
- understands project context,
- references the CIVILOPRO Knowledge Base,
- coordinates internal specialist reasoning when needed,
- and delivers a single, structured, actionable response.

MANDATORY RESPONSE STRUCTURE
Every response must follow this structure:
1. Ringkasan Masalah
2. Data yang Dibutuhkan / Asumsi
3. Analisis Teknis
4. Opsi Solusi
5. Rekomendasi Tindakan
6. Checklist Lapangan
7. Risiko Utama`,
      greetingMessage: `Halo! Saya CIVILOPRO \u{1F477}\u200D\u2642\uFE0F\u{1F4D0}
Asisten AI untuk konsultasi teknis dan pengambilan keputusan proyek konstruksi.

Ceritakan kondisi proyek atau masalah yang Anda hadapi\u2014saya akan bantu menganalisis dan memberi rekomendasi terbaik.`,
      conversationStarters: JSON.stringify(["Analisis masalah retak pada struktur beton", "Bantu pilih metode perbaikan pondasi", "Evaluasi risiko keterlambatan proyek", "Cek kepatuhan spesifikasi terhadap SNI", "Susunkan laporan harian proyek"]),
    } as any);

    const civiloproModules = [
      { name: "Intake & Data Collection", toolbox: "Core Foundation", desc: "Modul spesialis untuk pengumpulan data awal proyek, checklist intake, dan verifikasi kelengkapan informasi proyek.", tagline: "Pengumpulan data & checklist awal proyek" },
      { name: "Problem Diagnosis", toolbox: "Core Foundation", desc: "Modul spesialis untuk diagnosis awal masalah teknis proyek.", tagline: "Diagnosis awal masalah teknis proyek" },
      { name: "Multi-Criteria Analysis", toolbox: "Decision Support", desc: "Modul spesialis untuk analisis pengambilan keputusan berbasis multi-kriteria.", tagline: "Analisis keputusan multi-kriteria proyek" },
      { name: "Cost-Benefit Analyzer", toolbox: "Decision Support", desc: "Modul spesialis untuk analisis biaya-manfaat dan value engineering.", tagline: "Analisis biaya-manfaat & value engineering" },
      { name: "Structural Damage Analyzer", toolbox: "Field Diagnosis", desc: "Modul spesialis untuk analisis kerusakan struktural.", tagline: "Analisis kerusakan struktural proyek" },
      { name: "Site Condition Evaluator", toolbox: "Field Diagnosis", desc: "Modul spesialis untuk evaluasi kondisi lapangan.", tagline: "Evaluasi kondisi lapangan & lingkungan proyek" },
      { name: "Risk Mitigation Planner", toolbox: "Risk & Safety", desc: "Modul spesialis untuk identifikasi risiko proyek dan mitigasi.", tagline: "Identifikasi & mitigasi risiko proyek" },
      { name: "K3 Safety Advisor", toolbox: "Risk & Safety", desc: "Modul spesialis untuk keselamatan dan kesehatan kerja (K3) konstruksi.", tagline: "Konsultasi K3 & keselamatan konstruksi" },
      { name: "Standards Compliance Checker", toolbox: "Quality & Compliance", desc: "Modul spesialis untuk verifikasi kepatuhan standar SNI, ACI, ASTM.", tagline: "Cek kepatuhan standar & regulasi teknis" },
      { name: "Quality Control Inspector", toolbox: "Quality & Compliance", desc: "Modul spesialis untuk pengendalian mutu material dan inspeksi.", tagline: "Pengendalian mutu & inspeksi proyek" },
      { name: "Technical Document Drafter", toolbox: "Documentation & Reporting", desc: "Modul spesialis untuk penyusunan dokumen teknis proyek.", tagline: "Penyusunan dokumen teknis proyek" },
      { name: "Method Statement Writer", toolbox: "Documentation & Reporting", desc: "Modul spesialis untuk penyusunan metode pelaksanaan.", tagline: "Penyusunan metode kerja & SOP proyek" },
      { name: "Project Health Evaluator", toolbox: "Mentoring & Evaluation", desc: "Modul spesialis untuk evaluasi kesehatan proyek secara menyeluruh.", tagline: "Evaluasi kesehatan & performa proyek" },
      { name: "Technical Mentor", toolbox: "Mentoring & Evaluation", desc: "Modul spesialis untuk mentoring dan coaching tim teknis proyek.", tagline: "Mentoring teknis & pengembangan kompetensi" },
    ];

    for (const mod of civiloproModules) {
      const tbId = toolboxes[mod.toolbox]?.id;
      await storage.createAgent({
        name: mod.name,
        description: mod.desc,
        tagline: mod.tagline,
        category: "engineering",
        subcategory: "civil_engineer",
        isPublic: true,
        aiModel: "gpt-4o-mini",
        temperature: "0.7",
        maxTokens: 1024,
        toolboxId: tbId ? parseInt(tbId) : undefined,
        parentAgentId: parseInt(civiloproOrchestrator.id),
        systemPrompt: `Kamu adalah ${mod.name}, bagian dari sistem CIVILOPRO. ${mod.desc}`,
        greetingMessage: `Halo! Saya ${mod.name}. ${mod.desc}`,
        personality: "Profesional, objektif, dan detail",
      } as any);
    }

    log("[Seed] CIVILPRO ecosystem created successfully (1 series, 5 big ideas, 24 toolboxes, 36 agents)");
  } catch (err) {
    log("[Seed] Failed to create CIVILPRO ecosystem: " + (err as Error).message);
    console.error(err);
  }
}
