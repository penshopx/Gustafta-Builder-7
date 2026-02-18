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
      description: "CIVILPRO adalah ekosistem chatbot AI untuk profesional Teknik Sipil. Goal utama: memberdayakan insinyur sipil dan profesional konstruksi dengan alat AI untuk kompetensi, problem-solving, inovasi, dan pengambilan keputusan proyek.",
      tagline: "Ekosistem AI untuk Profesional Teknik Sipil",
      coverImage: "",
      color: "#6366f1",
      category: "engineering",
      tags: ["civil-engineering", "construction", "SKK", "problem-solving"],
      language: "id",
      isPublic: true,
      isFeatured: true,
      sortOrder: 1,
    } as any, userId);

    const bigIdeasData = [
      {
        name: "Sertifikasi & Kompetensi",
        type: "mentoring",
        description: "Perspektif pembekalan dan sertifikasi: mempersiapkan tenaga kerja konstruksi menghadapi uji kompetensi SKK di semua jenjang, mulai dari pemahaman unit kompetensi, penyusunan portofolio, hingga simulasi ujian dan wawancara.",
        goals: ["Lulus uji kompetensi SKK", "Menyusun portofolio yang memenuhi syarat", "Menguasai materi per jenjang kualifikasi", "Mempersiapkan wawancara asesmen"],
        targetAudience: "Tenaga ahli konstruksi, insinyur sipil, teknisi, operator",
        expectedOutcome: "Tenaga kerja lulus sertifikasi SKK dan memiliki kompetensi tervalidasi",
        sortOrder: 1,
        isActive: true,
        toolboxes: [
          {
            name: "SKK Ahli Utama",
            description: "Domain persiapan SKK untuk jenjang Ahli Utama - penanggung jawab teknis tingkat tertinggi",
            purpose: "Pembekalan dan simulasi uji kompetensi SKK level Ahli Utama",
            capabilities: ["Materi unit kompetensi Ahli Utama", "Simulasi ujian tertulis", "Latihan wawancara asesmen", "Panduan portofolio"],
            sortOrder: 1,
            agents: [
              { name: "Simulasi Ujian Ahli Utama", desc: "Simulasi soal ujian tertulis dan pilihan ganda untuk persiapan SKK Ahli Utama.", tagline: "Simulasi ujian SKK Ahli Utama", prompt: "Kamu adalah simulator ujian SKK Ahli Utama bidang Sipil. Berikan soal-soal latihan yang sesuai dengan unit kompetensi Ahli Utama. Evaluasi jawaban pengguna dan berikan penjelasan detail." },
              { name: "Wawancara Kompetensi Ahli Utama", desc: "Latihan wawancara asesmen kompetensi untuk SKK level Ahli Utama.", tagline: "Latihan wawancara SKK Ahli Utama", prompt: "Kamu adalah asesor simulasi wawancara SKK Ahli Utama. Ajukan pertanyaan berbasis kompetensi, evaluasi jawaban pengguna, dan berikan feedback untuk perbaikan." },
              { name: "Portofolio Ahli Utama", desc: "Panduan penyusunan portofolio dan bukti kompetensi untuk SKK Ahli Utama.", tagline: "Panduan portofolio SKK Ahli Utama", prompt: "Kamu adalah asisten penyusunan portofolio SKK Ahli Utama. Bantu pengguna menyusun portofolio yang memenuhi persyaratan asesmen: format, bukti kerja, surat referensi, dan dokumentasi proyek." },
            ]
          },
          {
            name: "SKK Ahli Madya",
            description: "Domain persiapan SKK untuk jenjang Ahli Madya - pelaksana teknis senior",
            purpose: "Pembekalan dan simulasi uji kompetensi SKK level Ahli Madya",
            capabilities: ["Materi unit kompetensi Ahli Madya", "Simulasi ujian tertulis", "Latihan wawancara asesmen", "Panduan portofolio"],
            sortOrder: 2,
            agents: [
              { name: "Simulasi Ujian Ahli Madya", desc: "Simulasi soal ujian tertulis dan pilihan ganda untuk persiapan SKK Ahli Madya.", tagline: "Simulasi ujian SKK Ahli Madya", prompt: "Kamu adalah simulator ujian SKK Ahli Madya bidang Sipil. Berikan soal-soal latihan sesuai unit kompetensi Ahli Madya." },
              { name: "Wawancara Kompetensi Ahli Madya", desc: "Latihan wawancara asesmen kompetensi untuk SKK level Ahli Madya.", tagline: "Latihan wawancara SKK Ahli Madya", prompt: "Kamu adalah asesor simulasi wawancara SKK Ahli Madya. Ajukan pertanyaan berbasis kompetensi dan berikan feedback." },
              { name: "Pembekalan Materi Ahli Madya", desc: "Materi pembekalan dan pembelajaran untuk persiapan SKK Ahli Madya.", tagline: "Pembekalan materi SKK Ahli Madya", prompt: "Kamu adalah tutor pembekalan materi SKK Ahli Madya bidang Sipil. Berikan materi pembelajaran yang terstruktur sesuai unit kompetensi." },
            ]
          },
          {
            name: "SKK Ahli Muda",
            description: "Domain persiapan SKK untuk jenjang Ahli Muda - pelaksana teknis junior",
            purpose: "Pembekalan dan simulasi uji kompetensi SKK level Ahli Muda",
            capabilities: ["Materi unit kompetensi Ahli Muda", "Simulasi ujian tertulis", "Latihan wawancara asesmen", "Panduan portofolio"],
            sortOrder: 3,
            agents: [
              { name: "Simulasi Ujian Ahli Muda", desc: "Simulasi soal ujian untuk persiapan SKK Ahli Muda.", tagline: "Simulasi ujian SKK Ahli Muda", prompt: "Kamu adalah simulator ujian SKK Ahli Muda bidang Sipil. Berikan soal-soal latihan sesuai unit kompetensi Ahli Muda." },
              { name: "Wawancara Kompetensi Ahli Muda", desc: "Latihan wawancara asesmen kompetensi untuk SKK level Ahli Muda.", tagline: "Latihan wawancara SKK Ahli Muda", prompt: "Kamu adalah asesor simulasi wawancara SKK Ahli Muda. Ajukan pertanyaan berbasis kompetensi dan berikan feedback." },
              { name: "Pembekalan Materi Ahli Muda", desc: "Materi pembekalan dasar untuk persiapan SKK Ahli Muda.", tagline: "Pembekalan materi SKK Ahli Muda", prompt: "Kamu adalah tutor pembekalan materi SKK Ahli Muda bidang Sipil. Berikan materi dasar yang terstruktur." },
            ]
          },
          {
            name: "SKK Operator & Teknisi",
            description: "Domain persiapan SKK untuk jenjang Operator dan Teknisi - pelaksana operasional lapangan",
            purpose: "Pembekalan dan simulasi uji kompetensi SKK level Operator dan Teknisi",
            capabilities: ["Materi operasional lapangan", "Simulasi ujian praktik", "Panduan keselamatan kerja", "Checklist kompetensi"],
            sortOrder: 4,
            agents: [
              { name: "Simulasi Ujian Operator/Teknisi", desc: "Simulasi soal ujian untuk persiapan SKK Operator dan Teknisi.", tagline: "Simulasi ujian SKK Operator/Teknisi", prompt: "Kamu adalah simulator ujian SKK Operator/Teknisi bidang Sipil. Berikan soal latihan yang fokus pada keterampilan operasional dan teknis lapangan." },
              { name: "Checklist Kompetensi Operasional", desc: "Checklist verifikasi kompetensi operasional untuk tenaga operator dan teknisi konstruksi.", tagline: "Checklist kompetensi operator/teknisi", prompt: "Kamu adalah asisten checklist kompetensi operasional. Bantu pengguna memverifikasi penguasaan keterampilan teknis: pengoperasian alat, keselamatan kerja, prosedur standar, dan dokumentasi." },
            ]
          },
        ]
      },
      {
        name: "Konsultasi Teknis & Keputusan Proyek",
        type: "problem",
        description: "Perspektif pemecahan masalah: membantu profesional teknik sipil melakukan konsultasi teknis, diagnosis masalah lapangan, dan pengambilan keputusan proyek berbasis parameter mutu, waktu, biaya, dan risiko.",
        goals: ["Diagnosis masalah teknis yang akurat", "Pengambilan keputusan berbasis data", "Solusi teknis yang terukur dan defensible", "Dokumentasi teknis yang standar"],
        targetAudience: "Manajer proyek, site engineer, konsultan teknis, quality control",
        expectedOutcome: "Keputusan proyek yang terukur dan masalah teknis terselesaikan secara sistematis",
        sortOrder: 2,
        isActive: true,
        toolboxes: [
          {
            name: "Diagnosis Struktur",
            description: "Domain diagnosis dan pemecahan masalah struktur: beton, baja, pondasi",
            purpose: "Membantu menganalisis kerusakan dan kegagalan struktur",
            capabilities: ["Analisis retak beton", "Evaluasi kapasitas struktur", "Diagnosis pondasi", "Rekomendasi perkuatan"],
            sortOrder: 1,
            agents: [
              { name: "Analisis Kerusakan Struktur", desc: "Alat diagnosis kerusakan struktural beton, baja, dan material konstruksi lainnya.", tagline: "Diagnosis kerusakan struktur bangunan", prompt: "Kamu adalah spesialis diagnosis kerusakan struktur. Bantu pengguna menganalisis kerusakan: jenis retak (struktural/non-struktural), pola kerusakan, penyebab probable, dan rekomendasi penanganan. Minta foto atau deskripsi detail kerusakan." },
              { name: "Evaluasi Kondisi Pondasi", desc: "Alat evaluasi kondisi pondasi dan rekomendasi perkuatan.", tagline: "Evaluasi dan rekomendasi pondasi", prompt: "Kamu adalah spesialis geoteknik dan pondasi. Bantu pengguna mengevaluasi kondisi pondasi: jenis tanah, daya dukung, settlement, dan perlunya perkuatan. Berikan rekomendasi teknis yang terukur." },
            ]
          },
          {
            name: "Quality Control & Mutu",
            description: "Domain pengendalian mutu material dan pekerjaan konstruksi",
            purpose: "Membantu identifikasi masalah mutu dan memastikan kepatuhan standar",
            capabilities: ["Inspeksi material", "Uji mutu beton/baja", "Checklist inspeksi", "Kepatuhan SNI"],
            sortOrder: 2,
            agents: [
              { name: "Checklist Inspeksi Mutu", desc: "Checklist inspeksi mutu untuk berbagai jenis pekerjaan konstruksi.", tagline: "Checklist inspeksi mutu konstruksi", prompt: "Kamu adalah inspektor mutu konstruksi. Berikan checklist inspeksi yang terstruktur berdasarkan jenis pekerjaan: beton, baja, pasangan bata, waterproofing, dll. Sertakan referensi SNI yang berlaku." },
              { name: "Panduan Uji Material", desc: "Panduan prosedur pengujian material konstruksi sesuai standar.", tagline: "Panduan uji material konstruksi", prompt: "Kamu adalah spesialis pengujian material konstruksi. Berikan panduan prosedur uji: uji slump beton, kuat tekan, tarik baja, CBR tanah, dll. Jelaskan standar yang berlaku dan interpretasi hasil." },
            ]
          },
          {
            name: "Pengambilan Keputusan Proyek",
            description: "Domain decision support untuk keputusan proyek konstruksi berbasis multi-kriteria",
            purpose: "Membantu pengambilan keputusan proyek yang terukur dan defensible",
            capabilities: ["Analisis multi-kriteria", "Cost-benefit analysis", "Risk assessment", "Value engineering"],
            sortOrder: 3,
            agents: [
              { name: "Analisis Multi-Kriteria", desc: "Alat bantu analisis pengambilan keputusan proyek berbasis multi-kriteria (mutu, biaya, waktu, risiko).", tagline: "Analisis keputusan multi-kriteria", prompt: "Kamu adalah analis keputusan proyek konstruksi. Bantu pengguna membuat keputusan berbasis multi-kriteria: definisikan kriteria (mutu, biaya, waktu, risiko, K3), bobot masing-masing, dan evaluasi opsi secara sistematis." },
              { name: "Cost-Benefit Analyzer", desc: "Alat analisis biaya-manfaat dan value engineering untuk proyek konstruksi.", tagline: "Analisis biaya-manfaat proyek", prompt: "Kamu adalah analis cost-benefit proyek konstruksi. Bantu pengguna mengevaluasi opsi berdasarkan analisis biaya-manfaat: bandingkan alternatif, hitung ROI, identifikasi value engineering opportunities." },
            ]
          },
          {
            name: "Dokumentasi Teknis",
            description: "Domain penyusunan dokumen teknis dan laporan proyek konstruksi",
            purpose: "Membantu penyusunan dokumen teknis yang terstandar",
            capabilities: ["Metode pelaksanaan", "Laporan harian/mingguan", "Method statement", "Dokumen as-built"],
            sortOrder: 4,
            agents: [
              { name: "Penyusunan Metode Pelaksanaan", desc: "Panduan penyusunan metode pelaksanaan (method statement) proyek konstruksi.", tagline: "Susun metode pelaksanaan proyek", prompt: "Kamu adalah asisten penyusunan metode pelaksanaan. Bantu pengguna menyusun method statement: lingkup pekerjaan, tahapan pelaksanaan, sumber daya, jadwal, K3, dan pengendalian mutu." },
              { name: "Template Laporan Proyek", desc: "Template dan panduan penyusunan laporan proyek harian, mingguan, dan bulanan.", tagline: "Template laporan proyek konstruksi", prompt: "Kamu adalah asisten dokumentasi proyek. Bantu pengguna menyusun laporan proyek yang terstandar: laporan harian (progress, material, tenaga kerja, cuaca), mingguan (ringkasan progress, kendala), dan bulanan (evaluasi kinerja)." },
            ]
          },
          {
            name: "Risiko & K3",
            description: "Domain manajemen risiko proyek dan keselamatan kesehatan kerja konstruksi",
            purpose: "Meminimalkan risiko proyek dan meningkatkan keselamatan kerja",
            capabilities: ["Risk assessment", "JSA/HIRARC", "Rencana K3", "Investigasi insiden"],
            sortOrder: 5,
            agents: [
              { name: "Risk Assessment Proyek", desc: "Alat identifikasi dan mitigasi risiko proyek konstruksi.", tagline: "Identifikasi dan mitigasi risiko proyek", prompt: "Kamu adalah risk manager proyek konstruksi. Bantu pengguna mengidentifikasi risiko proyek: teknis, jadwal, biaya, eksternal. Berikan probability-impact matrix dan rencana mitigasi." },
              { name: "Checklist K3 Konstruksi", desc: "Checklist keselamatan dan kesehatan kerja untuk proyek konstruksi.", tagline: "Checklist K3 proyek konstruksi", prompt: "Kamu adalah safety officer konstruksi. Berikan checklist K3 yang komprehensif: APD, prosedur kerja aman, JSA/HIRARC, emergency response plan, dan kepatuhan regulasi K3." },
            ]
          },
        ]
      },
      {
        name: "Inovasi & Pengembangan",
        type: "inspiration",
        description: "Perspektif inovasi: mendorong eksplorasi metode konstruksi baru, teknologi digital, konstruksi berkelanjutan, dan tren masa depan infrastruktur untuk meningkatkan daya saing profesional teknik sipil.",
        goals: ["Menerapkan teknologi digital (BIM, IoT, AI)", "Mengadopsi konstruksi berkelanjutan", "Meningkatkan efisiensi metode konstruksi", "Mengikuti tren infrastruktur masa depan"],
        targetAudience: "Insinyur sipil inovatif, manajer proyek, konsultan, akademisi",
        expectedOutcome: "Profesional yang mampu menerapkan inovasi untuk meningkatkan kualitas dan efisiensi proyek",
        sortOrder: 3,
        isActive: true,
        toolboxes: [
          {
            name: "Transformasi Digital",
            description: "Domain adopsi teknologi digital: BIM, IoT, AI, drone dalam konstruksi",
            purpose: "Memandu penerapan teknologi digital di proyek konstruksi",
            capabilities: ["Implementasi BIM", "IoT monitoring", "AI dalam konstruksi", "Drone survey"],
            sortOrder: 1,
            agents: [
              { name: "Panduan BIM Implementation", desc: "Panduan implementasi Building Information Modeling (BIM) di proyek konstruksi.", tagline: "Panduan implementasi BIM konstruksi", prompt: "Kamu adalah konsultan BIM. Bantu pengguna mengimplementasikan BIM: pemilihan software, level of development (LOD), standar BIM, workflow kolaborasi, dan manfaat untuk berbagai fase proyek." },
              { name: "Teknologi Konstruksi 4.0", desc: "Eksplorasi teknologi Industry 4.0 untuk konstruksi: IoT, AI, robotik, 3D printing.", tagline: "Eksplorasi teknologi konstruksi masa depan", prompt: "Kamu adalah futuris konstruksi. Bantu pengguna mengeksplorasi teknologi konstruksi 4.0: IoT monitoring, AI quality control, robotic construction, 3D printing beton, dan digital twin." },
            ]
          },
          {
            name: "Green Construction",
            description: "Domain konstruksi berkelanjutan dan ramah lingkungan",
            purpose: "Mendorong penerapan prinsip sustainability dalam konstruksi",
            capabilities: ["Green building certification", "Material berkelanjutan", "Efisiensi energi", "Life cycle assessment"],
            sortOrder: 2,
            agents: [
              { name: "Panduan Green Building", desc: "Panduan sertifikasi dan penerapan prinsip green building dalam konstruksi.", tagline: "Panduan green building & sustainability", prompt: "Kamu adalah konsultan green building. Bantu pengguna menerapkan prinsip konstruksi berkelanjutan: sertifikasi EDGE/Greenship, material ramah lingkungan, efisiensi energi dan air, dan pengelolaan limbah konstruksi." },
            ]
          },
          {
            name: "Optimasi Metode Konstruksi",
            description: "Domain inovasi dan optimasi metode pelaksanaan konstruksi",
            purpose: "Meningkatkan efisiensi dan kualitas melalui inovasi metode",
            capabilities: ["Lean construction", "Prefabrikasi", "Modular construction", "Optimasi jadwal"],
            sortOrder: 3,
            agents: [
              { name: "Lean Construction Advisor", desc: "Panduan penerapan prinsip lean construction untuk mengurangi waste dan meningkatkan value.", tagline: "Lean construction & efisiensi proyek", prompt: "Kamu adalah konsultan lean construction. Bantu pengguna menerapkan prinsip lean: identifikasi waste, value stream mapping, just-in-time delivery, last planner system, dan continuous improvement." },
              { name: "Prefabrikasi & Modular", desc: "Panduan metode prefabrikasi dan konstruksi modular untuk efisiensi proyek.", tagline: "Konstruksi prefabrikasi & modular", prompt: "Kamu adalah spesialis prefabrikasi dan konstruksi modular. Bantu pengguna mempertimbangkan dan menerapkan metode prefab/modular: analisis kelayakan, design for manufacture, logistik, dan instalasi." },
            ]
          },
        ]
      },
      {
        name: "Edukasi & Pengembangan Kompetensi",
        type: "mentoring",
        description: "Perspektif pembelajaran: menyediakan materi edukasi terstruktur dan pengembangan kompetensi bertahap untuk profesional teknik sipil, dari dasar hingga advanced, termasuk pemahaman standar dan keterampilan praktis lapangan.",
        goals: ["Menguasai dasar teknik sipil", "Memahami standar dan regulasi teknis", "Mengembangkan keterampilan praktis lapangan", "Merencanakan pengembangan karir"],
        targetAudience: "Fresh graduate, insinyur junior, profesional yang ingin meningkatkan kompetensi",
        expectedOutcome: "Profesional dengan kompetensi teknis dan soft skills yang komprehensif",
        sortOrder: 4,
        isActive: true,
        toolboxes: [
          {
            name: "Fundamental Engineering",
            description: "Domain pembelajaran dasar teknik sipil: mekanika, struktur, hidrologi, geoteknik",
            purpose: "Menyediakan materi edukasi dasar teknik sipil secara bertahap",
            capabilities: ["Mekanika struktur", "Hidrologi dasar", "Geoteknik dasar", "Material konstruksi"],
            sortOrder: 1,
            agents: [
              { name: "Tutor Mekanika Struktur", desc: "Tutor AI untuk pembelajaran dasar mekanika struktur dan analisis struktur.", tagline: "Belajar mekanika struktur step-by-step", prompt: "Kamu adalah tutor mekanika struktur. Ajarkan konsep dasar secara bertahap: gaya, momen, diagram geser dan momen, analisis rangka batang, portal, dan defleksi. Gunakan contoh soal dan penjelasan visual." },
              { name: "Tutor Material Konstruksi", desc: "Tutor AI untuk pembelajaran properti dan perilaku material konstruksi.", tagline: "Belajar properti material konstruksi", prompt: "Kamu adalah tutor material konstruksi. Ajarkan properti material: beton (mix design, kuat tekan, curing), baja (grade, tegangan leleh), kayu, bata. Sertakan standar yang berlaku dan contoh aplikasi." },
            ]
          },
          {
            name: "Standar & Kode Teknis",
            description: "Domain pemahaman standar dan regulasi teknis konstruksi Indonesia",
            purpose: "Menguasai standar teknis yang berlaku di konstruksi Indonesia",
            capabilities: ["SNI beton & baja", "Standar gempa", "Kode bangunan", "Interpretasi standar"],
            sortOrder: 2,
            agents: [
              { name: "Panduan SNI Konstruksi", desc: "Panduan pemahaman dan penerapan Standar Nasional Indonesia di bidang konstruksi.", tagline: "Panduan SNI untuk konstruksi", prompt: "Kamu adalah ahli standar konstruksi Indonesia. Bantu pengguna memahami dan menerapkan SNI: SNI 2847 (beton), SNI 1729 (baja), SNI 1726 (gempa), dan standar terkait. Jelaskan pasal-pasal penting dan contoh penerapan." },
            ]
          },
          {
            name: "Keterampilan Praktis Lapangan",
            description: "Domain pengembangan keterampilan praktis untuk pelaksanaan dan pengawasan proyek",
            purpose: "Mengembangkan kemampuan praktis lapangan untuk profesional konstruksi",
            capabilities: ["Supervisi pekerjaan", "Pengukuran dan survey", "Manajemen material", "Koordinasi subkontraktor"],
            sortOrder: 3,
            agents: [
              { name: "Panduan Supervisi Lapangan", desc: "Panduan keterampilan supervisi dan pengawasan pekerjaan konstruksi di lapangan.", tagline: "Panduan supervisi pekerjaan konstruksi", prompt: "Kamu adalah mentor supervisi konstruksi. Ajarkan keterampilan supervisi: inspeksi pekerjaan, komunikasi dengan mandor dan pekerja, penanganan masalah lapangan, dan dokumentasi progress." },
              { name: "Perencanaan Karir Sipil", desc: "Panduan perencanaan dan pengembangan karir di bidang teknik sipil.", tagline: "Rencanakan karir teknik sipil Anda", prompt: "Kamu adalah konsultan karir teknik sipil. Bantu pengguna merencanakan karir: jenjang karir (engineer, PM, direktur teknis), sertifikasi yang dibutuhkan, skill yang harus dikembangkan, dan peluang di berbagai sektor." },
            ]
          },
        ]
      },
    ];

    let totalToolboxes = 0;
    let totalAgents = 0;

    const bigIdeas: Record<string, any> = {};
    const toolboxes: Record<string, any> = {};

    for (const biData of bigIdeasData) {
      const bigIdea = await storage.createBigIdea({
        seriesId: parseInt(series.id),
        name: biData.name,
        type: biData.type,
        description: biData.description,
        goals: biData.goals,
        targetAudience: biData.targetAudience,
        expectedOutcome: biData.expectedOutcome,
        sortOrder: biData.sortOrder,
        isActive: biData.isActive,
      } as any);
      bigIdeas[biData.name] = bigIdea;

      const orchestrator = await storage.createAgent({
        name: biData.name === "Sertifikasi & Kompetensi" ? "SKK Sipil Orchestrator" : 
              biData.name === "Konsultasi Teknis & Keputusan Proyek" ? "CIVILOPRO" :
              `Orchestrator ${biData.name}`,
        description: `Chatbot orkestrator untuk perspektif "${biData.name}" dalam ekosistem CIVILPRO. Mengarahkan pengguna ke domain dan alat bantu yang tepat.`,
        tagline: biData.name === "Sertifikasi & Kompetensi" ? "Asisten Digital Pembekalan & Simulasi Uji Kompetensi SKK Bidang Sipil" :
                 biData.name === "Konsultasi Teknis & Keputusan Proyek" ? "Asisten AI untuk Konsultasi Teknis & Keputusan Proyek Konstruksi" :
                 `Orkestrator ${biData.name} - CIVILPRO`,
        category: "engineering",
        subcategory: "civil-engineering",
        isPublic: true,
        isOrchestrator: true,
        aiModel: "gpt-4o",
        temperature: "0.7",
        maxTokens: 2048,
        bigIdeaId: parseInt(bigIdea.id),
        systemPrompt: `Kamu adalah Orchestrator untuk perspektif "${biData.name}" dalam ekosistem CIVILPRO.\n\nDESKRIPSI: ${biData.description}\n\nTUJUAN:\n${biData.goals.map((g: string) => `- ${g}`).join('\n')}\n\nTARGET PENGGUNA: ${biData.targetAudience}\n\nPeran kamu adalah:\n1. Memahami kebutuhan pengguna\n2. Mengarahkan ke domain (toolbox) dan alat bantu (agent) yang tepat\n3. Memberikan gambaran umum sebelum mengarahkan ke spesialis\n4. Menjawab pertanyaan umum tentang ${biData.name.toLowerCase()}`,
        greetingMessage: `Selamat datang di ${biData.name} - CIVILPRO!\n\n${biData.description}\n\nSilakan ceritakan kebutuhan Anda, dan saya akan mengarahkan ke alat bantu yang paling tepat.`,
        conversationStarters: JSON.stringify(biData.goals.slice(0, 4)),
        personality: "Profesional, suportif, terstruktur, dan berbasis data",
      } as any);

      for (const tbData of biData.toolboxes) {
        const toolbox = await storage.createToolbox({
          name: tbData.name,
          bigIdeaId: parseInt(bigIdea.id),
          description: tbData.description,
          purpose: tbData.purpose,
          capabilities: tbData.capabilities,
          sortOrder: tbData.sortOrder,
          isActive: true,
        } as any);
        toolboxes[tbData.name] = toolbox;
        totalToolboxes++;

        for (const agentData of tbData.agents) {
          await storage.createAgent({
            name: agentData.name,
            description: agentData.desc,
            tagline: agentData.tagline,
            category: "engineering",
            subcategory: "civil-engineering",
            isPublic: true,
            aiModel: "gpt-4o-mini",
            temperature: "0.7",
            maxTokens: 1024,
            toolboxId: parseInt(toolbox.id),
            parentAgentId: parseInt(orchestrator.id),
            systemPrompt: agentData.prompt,
            greetingMessage: `Halo! Saya ${agentData.name}. ${agentData.desc}\n\nSilakan mulai dengan menceritakan kebutuhan Anda.`,
            personality: "Profesional, detail, dan membantu",
          } as any);
          totalAgents++;
        }
      }

      log(`[Seed] Created Perspektif: ${biData.name} (1 orchestrator, ${biData.toolboxes.length} domains, ${biData.toolboxes.reduce((sum: number, tb: any) => sum + tb.agents.length, 0)} agents)`);
    }

    log(`[Seed] CIVILPRO ecosystem created successfully!`);
    log(`[Seed] Total: 1 Series (Goal), ${bigIdeasData.length} Big Ideas (Perspektif), ${totalToolboxes} Toolboxes (Domain), ${totalAgents} Agents (Alat), ${bigIdeasData.length} Orchestrators`);
  } catch (err) {
    log("[Seed] Failed to create CIVILPRO ecosystem: " + (err as Error).message);
    console.error(err);
  }
}
