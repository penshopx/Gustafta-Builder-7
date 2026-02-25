import { storage } from "./storage";

function log(msg: string) {
  const now = new Date().toLocaleTimeString();
  console.log(`${now} [express] ${msg}`);
}

const GOVERNANCE_RULES = `

GOVERNANCE RULES (WAJIB):
- Tidak ada "super chatbot" — setiap chatbot punya domain klasifikasi tunggal.
- Jika pertanyaan di luar domain klasifikasi Anda, tolak sopan dan arahkan ke Hub Siap UKom.
- Bahasa Indonesia profesional, suportif, berorientasi mentoring & persiapan uji kompetensi.
- Jika data kurang, minta data minimum (maksimal 3 pertanyaan).
- Selalu disclaimer: "Panduan ini bersifat referensi persiapan. Keputusan akhir kelulusan ditentukan oleh LSP dan asesor resmi sesuai skema BNSP."

═══ SUMMARY_RULEBOOK v1 (WAJIB DIPATUHI) ═══
Jika user memberikan *_SUMMARY v1:
1) PRIORITAS OVERALL — Gunakan bagian OVERALL sebagai sumber utama.
2) NO DOWNGRADE — Risk boleh tetap atau naik, tidak boleh turun.
3) UNKNOWN HANDLING — Tandai sebagai BUTUH_VERIFIKASI, maksimal naik 1 level.
4) EXPIRED/INVALID RULE — Jika komponen inti expired/invalid, risk minimal Tinggi.
5) DATA CONSISTENCY — MISMATCH pada entitas inti → risk minimal Tinggi.
6) DATA BARU — Jika bertentangan dengan SUMMARY, minta user pilih atau gunakan yang lebih valid.`;

const SPECIALIST_RESPONSE_FORMAT = `
Format Respons Standar (gunakan sesuai konteks):
- Jika bimbingan skema: Jabatan Kerja → Jenjang KKNI → Unit Kompetensi → Persyaratan → Tips
- Jika simulasi asesmen: Skenario → Pertanyaan → Rubrik Penilaian → Feedback
- Jika checklist portofolio: Dokumen Wajib → Format → Contoh → Status Kelengkapan
- Jika analisis kesiapan: Profil Peserta → Gap Analysis → Rekomendasi → Timeline Persiapan`;

const BIDANG_KLASIFIKASI = [
  {
    key: "sipil",
    name: "Sipil",
    fullName: "Klasifikasi Bidang Sipil",
    description: "Mencakup 160+ jabatan kerja konstruksi sipil meliputi jalan, jembatan, bendungan, irigasi, pelabuhan, bandar udara, gedung, struktur bangunan, dan infrastruktur sipil lainnya.",
    subklasifikasi: "Jalan & Jembatan, Bendungan & Irigasi, Pelabuhan & Dermaga, Bandar Udara, Gedung & Bangunan, Struktur Baja & Beton, Geoteknik & Fondasi, Drainase & Sanitasi, Terowongan, Reklamasi, Survey & Pengukuran",
    contohJabatan: "Pelaksana Lapangan Jalan, Site Manager Gedung, Quality Control Beton, Surveyor, Drafter Struktur, Pengawas K3 Konstruksi, Estimator, Ahli Geoteknik",
    jenjang: "Operator/Teknisi → Teknisi/Analis → Ahli Muda → Ahli Madya → Ahli Utama",
    color: "#DC2626",
  },
  {
    key: "arsitektur",
    name: "Arsitektur",
    fullName: "Klasifikasi Bidang Arsitektur",
    description: "Mencakup jabatan kerja di bidang perancangan arsitektur bangunan gedung, perumahan, fasilitas publik, dan perencanaan tapak.",
    subklasifikasi: "Arsitektur Bangunan Gedung, Arsitektur Perumahan, Arsitektur Fasilitas Publik, Perencanaan Tapak, Preservasi & Konservasi Bangunan",
    contohJabatan: "Arsitek, Drafter Arsitektur, Perencana Tapak, Pengawas Arsitektur, Ahli Preservasi Bangunan",
    jenjang: "Teknisi → Ahli Muda → Ahli Madya → Ahli Utama",
    color: "#9333EA",
  },
  {
    key: "energi",
    name: "Energi, Ketenagalistrikan & Pertambangan",
    fullName: "Klasifikasi Bidang Energi, Ketenagalistrikan dan Pertambangan",
    description: "Mencakup jabatan kerja di bidang pembangkit listrik, transmisi & distribusi, instalasi listrik, pertambangan, dan energi terbarukan. Catatan: Sebagian skema ini berada di luar lingkup jasa konstruksi murni.",
    subklasifikasi: "Pembangkit Listrik, Transmisi & Distribusi, Instalasi Listrik, Pertambangan, Energi Terbarukan (Solar, Wind, Hydro), Jaringan Gas",
    contohJabatan: "Teknisi Listrik, Ahli Pembangkit, Installer Panel Surya, Pengawas Kelistrikan, Ahli Jaringan Transmisi",
    jenjang: "Operator/Teknisi → Teknisi/Analis → Ahli Muda → Ahli Madya → Ahli Utama",
    color: "#F59E0B",
  },
  {
    key: "sains-rekayasa",
    name: "Sains & Rekayasa Teknik",
    fullName: "Klasifikasi Bidang Sains dan Rekayasa Teknik",
    description: "Mencakup jabatan kerja di bidang rekayasa teknik, laboratorium konstruksi, pengujian material, dan teknologi konstruksi terapan.",
    subklasifikasi: "Rekayasa Teknik Sipil, Laboratorium Konstruksi, Pengujian Material, Teknologi Beton, Teknologi Baja, Mekanika Tanah, Hidrologi & Hidrolika",
    contohJabatan: "Ahli Laboratorium Beton, Teknisi Pengujian Material, Ahli Mekanika Tanah, Rekayasa Hidrologi, Ahli Teknologi Beton",
    jenjang: "Teknisi → Analis → Ahli Muda → Ahli Madya → Ahli Utama",
    color: "#0EA5E9",
  },
  {
    key: "mekanikal",
    name: "Mekanikal",
    fullName: "Klasifikasi Bidang Mekanikal",
    description: "Mencakup jabatan kerja di bidang instalasi mekanikal bangunan, perpipaan, HVAC, fire protection, elevator, dan sistem mekanikal lainnya.",
    subklasifikasi: "Perpipaan (Plumbing), HVAC (Heating, Ventilation, Air Conditioning), Fire Protection, Elevator & Eskalator, Pompa & Kompresor, Instalasi Gas Medis",
    contohJabatan: "Teknisi Plumbing, Ahli HVAC, Installer Fire Protection, Teknisi Elevator, Ahli Perpipaan, Pengawas Mekanikal",
    jenjang: "Operator/Teknisi → Teknisi/Analis → Ahli Muda → Ahli Madya → Ahli Utama",
    color: "#6366F1",
  },
  {
    key: "manajemen-pelaksanaan",
    name: "Manajemen Pelaksanaan",
    fullName: "Klasifikasi Bidang Manajemen Pelaksanaan",
    description: "Mencakup jabatan kerja di bidang manajemen proyek konstruksi, pengendalian biaya, waktu, mutu, K3, dan administrasi kontrak.",
    subklasifikasi: "Manajemen Proyek, Pengendalian Biaya (Cost Control), Penjadwalan (Scheduling), Manajemen Mutu, Manajemen K3 Konstruksi, Administrasi Kontrak, Pengadaan (Procurement)",
    contohJabatan: "Project Manager, Site Manager, Cost Controller, Scheduler, Quality Manager, HSE Manager, Quantity Surveyor, Contract Administrator",
    jenjang: "Pelaksana → Supervisor → Manajer → Manajer Senior → Direktur",
    color: "#14B8A6",
  },
  {
    key: "pengembangan-wilayah",
    name: "Pengembangan Wilayah & Kota",
    fullName: "Klasifikasi Bidang Pengembangan Wilayah dan Kota",
    description: "Mencakup jabatan kerja di bidang perencanaan tata ruang, pengembangan wilayah, perencanaan kota, dan infrastruktur perkotaan.",
    subklasifikasi: "Perencanaan Tata Ruang, Pengembangan Wilayah, Perencanaan Kota, Infrastruktur Perkotaan, Transportasi Perkotaan, Perumahan & Permukiman",
    contohJabatan: "Perencana Kota, Ahli Tata Ruang, Perencana Wilayah, Ahli Transportasi Perkotaan, Perencana Permukiman",
    jenjang: "Teknisi → Analis → Ahli Muda → Ahli Madya → Ahli Utama",
    color: "#84CC16",
  },
  {
    key: "lanskap-interior-iluminasi",
    name: "Arsitek Lanskap, Desain Interior & Iluminasi",
    fullName: "Klasifikasi Bidang Arsitek Lanskap, Desain Interior, dan Iluminasi",
    description: "Mencakup jabatan kerja di bidang arsitektur lanskap, desain interior bangunan, dan desain pencahayaan (iluminasi).",
    subklasifikasi: "Arsitektur Lanskap, Desain Taman & Ruang Terbuka, Desain Interior Komersial, Desain Interior Residensial, Desain Pencahayaan (Iluminasi), Desain Pameran & Display",
    contohJabatan: "Arsitek Lanskap, Desainer Interior, Ahli Iluminasi, Drafter Lanskap, Pengawas Lanskap, Desainer Pencahayaan",
    jenjang: "Teknisi → Ahli Muda → Ahli Madya → Ahli Utama",
    color: "#EC4899",
  },
  {
    key: "tata-lingkungan",
    name: "Tata Lingkungan",
    fullName: "Klasifikasi Bidang Tata Lingkungan",
    description: "Mencakup jabatan kerja di bidang pengelolaan lingkungan konstruksi, AMDAL, pengelolaan limbah, pengendalian pencemaran, dan rehabilitasi lahan.",
    subklasifikasi: "Pengelolaan Lingkungan Hidup, AMDAL/UKL-UPL, Pengelolaan Limbah B3, Pengendalian Pencemaran (Air, Udara, Tanah), Rehabilitasi Lahan, Konservasi Sumber Daya Air, Sanitasi Lingkungan",
    contohJabatan: "Ahli Lingkungan, Penyusun AMDAL, Ahli Pengelolaan Limbah, Ahli Konservasi Air, Pengawas Lingkungan, Ahli Sanitasi",
    jenjang: "Teknisi → Analis → Ahli Muda → Ahli Madya → Ahli Utama",
    color: "#22C55E",
  },
];

export async function seedSiapUkom(userId: string) {
  try {
    const existingSeries = await storage.getSeries();
    const existing = existingSeries.find((s: any) =>
      s.name === "Siap Uji Kompetensi SKK"
    );
    if (existing) {
      const toolboxes = await storage.getToolboxes(undefined, existing.id);
      const hubUtama = toolboxes.find((t: any) => t.name === "HUB Siap Uji Kompetensi SKK" && t.seriesId === existing.id && !t.bigIdeaId);
      if (hubUtama) {
        log("[Seed] Siap Uji Kompetensi SKK already exists, skipping...");
        return;
      }
      const bigIdeas = await storage.getBigIdeas(existing.id);
      for (const bi of bigIdeas) {
        const biToolboxes = await storage.getToolboxes(bi.id);
        for (const tb of biToolboxes) {
          const agents = await storage.getAgents(tb.id);
          for (const agent of agents) { await storage.deleteAgent(agent.id); }
          await storage.deleteToolbox(tb.id);
        }
        await storage.deleteBigIdea(bi.id);
      }
      for (const tb of toolboxes) {
        const agents = await storage.getAgents(tb.id);
        for (const agent of agents) { await storage.deleteAgent(agent.id); }
        await storage.deleteToolbox(tb.id);
      }
      await storage.deleteSeries(existing.id);
      log("[Seed] Old Siap Uji Kompetensi data cleared");
    }

    log("[Seed] Creating Siap Uji Kompetensi SKK ecosystem...");

    const series = await storage.createSeries({
      name: "Siap Uji Kompetensi SKK",
      slug: "siap-ukom-skk",
      description: "Platform persiapan Uji Kompetensi SKK (Sertifikasi Kompetensi Kerja) Jasa Konstruksi. Mencakup 9 klasifikasi bidang: Sipil, Arsitektur, Energi & Ketenagalistrikan, Sains & Rekayasa Teknik, Mekanikal, Manajemen Pelaksanaan, Pengembangan Wilayah & Kota, Arsitek Lanskap/Desain Interior/Iluminasi, dan Tata Lingkungan. Setiap bidang memiliki hub yang siap diisi chatbot per jabatan kerja.",
      tagline: "Persiapan Uji Kompetensi SKK untuk Seluruh Klasifikasi Jasa Konstruksi",
      coverImage: "",
      color: "#B91C1C",
      category: "engineering",
      tags: ["skk", "uji-kompetensi", "sertifikasi", "jabatan-kerja", "bnsp", "lsp", "konstruksi", "kkni", "bimtek"],
      language: "id",
      isPublic: true,
      isFeatured: true,
      sortOrder: 12,
    } as any, userId);

    const seriesId = series.id;

    const hubUtamaToolbox = await storage.createToolbox({
      name: "HUB Siap Uji Kompetensi SKK",
      description: "Hub utama Siap Uji Kompetensi — mengarahkan peserta ke klasifikasi bidang yang sesuai untuk persiapan uji kompetensi SKK.",
      isOrchestrator: true,
      seriesId: seriesId,
      bigIdeaId: null,
      isActive: true,
      sortOrder: 0,
      purpose: "Orchestrator utama yang mengidentifikasi bidang klasifikasi peserta dan routing ke modul bidang yang tepat",
      capabilities: ["Identifikasi bidang klasifikasi peserta", "Routing ke hub bidang yang sesuai", "Informasi umum tentang skema SKK dan proses uji kompetensi"],
      limitations: ["Tidak melakukan bimbingan teknis langsung per jabatan kerja", "Tidak menerbitkan sertifikat"],
    } as any);

    const hubUtamaAgent = await storage.createAgent({
      name: "HUB Siap Uji Kompetensi SKK",
      description: "Hub utama persiapan Uji Kompetensi SKK — mengarahkan peserta ke klasifikasi bidang yang sesuai.",
      tagline: "Persiapan Uji Kompetensi SKK Jasa Konstruksi",
      category: "engineering",
      subcategory: "construction-competency",
      isPublic: true,
      isOrchestrator: true,
      aiModel: "gpt-4o",
      temperature: "0.7",
      maxTokens: 2048,
      toolboxId: parseInt(hubUtamaToolbox.id),
      ragEnabled: false,
      systemPrompt: `You are HUB Siap Uji Kompetensi SKK — the main orchestrator for construction workforce competency exam preparation.

═══ PERAN ═══
Anda adalah navigator utama untuk persiapan Uji Kompetensi SKK (Sertifikasi Kompetensi Kerja) Jasa Konstruksi. Identifikasi bidang klasifikasi peserta dan arahkan ke Hub Bidang yang tepat.

═══ KONTEKS SKK ═══
SKK (Sertifikasi Kompetensi Kerja) adalah sertifikasi wajib bagi tenaga kerja konstruksi di Indonesia, diatur oleh:
- UU No. 2/2017 tentang Jasa Konstruksi
- PP No. 14/2021 tentang Perubahan PP 22/2020
- Permen PUPR tentang Sertifikasi Kompetensi Kerja
- BNSP (Badan Nasional Sertifikasi Profesi) sebagai regulator
- LSP (Lembaga Sertifikasi Profesi) sebagai pelaksana uji kompetensi

═══ 9 KLASIFIKASI BIDANG ═══
1. **Sipil** — Jalan, jembatan, bendungan, gedung, struktur, geoteknik, dll (160+ jabatan kerja)
2. **Arsitektur** — Perancangan bangunan, perencanaan tapak, preservasi
3. **Energi, Ketenagalistrikan & Pertambangan** — Pembangkit, transmisi, instalasi listrik, tambang
4. **Sains & Rekayasa Teknik** — Laboratorium, pengujian material, mekanika tanah, hidrologi
5. **Mekanikal** — Perpipaan, HVAC, fire protection, elevator
6. **Manajemen Pelaksanaan** — Project management, cost control, scheduling, K3, kontrak
7. **Pengembangan Wilayah & Kota** — Tata ruang, perencanaan kota, transportasi perkotaan
8. **Arsitek Lanskap, Desain Interior & Iluminasi** — Lanskap, interior, pencahayaan
9. **Tata Lingkungan** — AMDAL, limbah, pencemaran, rehabilitasi lahan

═══ ROUTING ═══
Identifikasi bidang klasifikasi dari profil atau pertanyaan user, lalu arahkan ke Hub Bidang yang sesuai.
Jika user belum tahu bidangnya, tanyakan:
1. Latar belakang pendidikan/pekerjaan
2. Jenis proyek yang biasa dikerjakan
3. Jabatan saat ini

═══ PROSES UJI KOMPETENSI ═══
1. Pendaftaran ke LSP terakreditasi
2. Pengisian APL-01 (Formulir Permohonan) dan APL-02 (Asesmen Mandiri)
3. Verifikasi berkas oleh LSP
4. Pelaksanaan uji kompetensi (tertulis, wawancara, praktik/portofolio)
5. Keputusan: Kompeten / Belum Kompeten
6. Penerbitan SKK oleh LSP

Respond dalam Bahasa Indonesia. Suportif, profesional, berorientasi mentoring.${GOVERNANCE_RULES}`,
      greetingMessage: `Selamat datang di Siap Uji Kompetensi SKK — platform persiapan sertifikasi kompetensi kerja jasa konstruksi! 🎯

Saya siap membantu Anda mempersiapkan uji kompetensi di 9 bidang klasifikasi:

1. 🏗️ **Sipil** — 160+ jabatan kerja
2. 🏛️ **Arsitektur**
3. ⚡ **Energi, Ketenagalistrikan & Pertambangan**
4. 🔬 **Sains & Rekayasa Teknik**
5. ⚙️ **Mekanikal**
6. 📋 **Manajemen Pelaksanaan**
7. 🌆 **Pengembangan Wilayah & Kota**
8. 🌿 **Arsitek Lanskap, Desain Interior & Iluminasi**
9. 🌍 **Tata Lingkungan**

Bidang apa yang ingin Anda persiapkan?`,
      conversationStarters: [
        "Saya ingin persiapan uji kompetensi bidang Sipil",
        "Bagaimana proses uji kompetensi SKK?",
        "Saya engineer mekanikal, skema apa yang cocok?",
        "Apa saja persyaratan mengikuti uji kompetensi?",
      ],
      contextQuestions: [
        {
          id: "ukom-bidang",
          label: "Bidang klasifikasi Anda?",
          type: "select",
          options: BIDANG_KLASIFIKASI.map(b => b.name),
          required: true,
        },
        {
          id: "ukom-jenjang",
          label: "Jenjang yang dituju?",
          type: "select",
          options: ["Operator/Teknisi", "Teknisi/Analis", "Ahli Muda", "Ahli Madya", "Ahli Utama", "Belum tahu"],
          required: false,
        },
      ],
      personality: "Suportif, profesional, dan berorientasi mentoring. Membangun kepercayaan diri peserta.",
    } as any);

    log("[Seed] Created Hub Utama Siap Uji Kompetensi SKK");

    for (let i = 0; i < BIDANG_KLASIFIKASI.length; i++) {
      const bidang = BIDANG_KLASIFIKASI[i];

      const modul = await storage.createBigIdea({
        seriesId: seriesId,
        name: `Bidang ${bidang.name}`,
        type: "competency",
        description: `${bidang.description} Modul ini menjadi payung untuk chatbot-chatbot persiapan uji kompetensi per jabatan kerja di ${bidang.fullName}.`,
        goals: [
          `Menyediakan bimbingan persiapan uji kompetensi untuk seluruh jabatan kerja di ${bidang.fullName}`,
          "Simulasi asesmen dan review portofolio",
          "Mapping unit kompetensi per jabatan kerja dan jenjang KKNI",
        ],
        targetAudience: `Tenaga kerja konstruksi ${bidang.fullName} yang akan mengikuti uji kompetensi SKK`,
        expectedOutcome: "Peserta siap menghadapi uji kompetensi dengan pemahaman unit kompetensi, portofolio lengkap, dan mental yang terlatih",
        sortOrder: i + 1,
        isActive: true,
      } as any);

      const hubToolbox = await storage.createToolbox({
        name: `Hub ${bidang.name}`,
        description: `Hub bidang ${bidang.name} — mengarahkan ke chatbot persiapan uji kompetensi per jabatan kerja.`,
        isOrchestrator: true,
        seriesId: null,
        bigIdeaId: modul.id,
        isActive: true,
        sortOrder: 0,
        purpose: `Orchestrator bidang ${bidang.name} — routing ke chatbot jabatan kerja yang sesuai`,
        capabilities: [
          `Identifikasi jabatan kerja di ${bidang.fullName}`,
          "Informasi skema sertifikasi dan jenjang KKNI",
          "Routing ke chatbot persiapan per jabatan kerja",
        ],
        limitations: ["Tidak melakukan uji kompetensi langsung", "Tidak menerbitkan sertifikat"],
      } as any);

      await storage.createAgent({
        name: `Hub ${bidang.name}`,
        description: `Hub persiapan uji kompetensi ${bidang.fullName} — mengarahkan ke chatbot per jabatan kerja.`,
        tagline: `Persiapan Uji Kompetensi ${bidang.fullName}`,
        category: "engineering",
        subcategory: "construction-competency",
        isPublic: true,
        isOrchestrator: true,
        aiModel: "gpt-4o",
        temperature: "0.7",
        maxTokens: 2048,
        toolboxId: parseInt(hubToolbox.id),
        parentAgentId: parseInt(hubUtamaAgent.id),
        ragEnabled: false,
        systemPrompt: `You are Hub ${bidang.name} — orchestrator untuk persiapan Uji Kompetensi SKK ${bidang.fullName}.

═══ PERAN ═══
Anda adalah hub bidang ${bidang.name} yang membantu peserta menavigasi jabatan kerja dan mempersiapkan uji kompetensi di bidang ini.

═══ KLASIFIKASI BIDANG ═══
${bidang.fullName}
${bidang.description}

═══ SUBKLASIFIKASI ═══
${bidang.subklasifikasi}

═══ CONTOH JABATAN KERJA ═══
${bidang.contohJabatan}

═══ JENJANG KUALIFIKASI ═══
${bidang.jenjang}

═══ KEMAMPUAN ANDA ═══
1. **Identifikasi Jabatan Kerja** — Bantu peserta menemukan jabatan kerja yang sesuai dengan profil dan pengalaman mereka
2. **Informasi Skema SKK** — Jelaskan skema sertifikasi, unit kompetensi wajib, dan persyaratan per jenjang
3. **Pemetaan KKNI** — Mapping antara jabatan kerja, level KKNI, dan kualifikasi yang dibutuhkan
4. **Panduan Persiapan Umum** — Tips persiapan uji kompetensi: portofolio, wawancara, praktik
5. **Routing** — Arahkan ke chatbot jabatan kerja spesifik jika tersedia

═══ PANDUAN PERSIAPAN UKOM ═══
Untuk setiap jabatan kerja, peserta perlu menyiapkan:
1. **APL-01**: Formulir permohonan sertifikasi — data pribadi, pendidikan, pengalaman
2. **APL-02**: Asesmen mandiri — self-assessment terhadap unit kompetensi
3. **Portofolio**: Bukti kompetensi — sertifikat pelatihan, foto proyek, surat pengalaman kerja, logbook
4. **Pengetahuan**: Pemahaman unit kompetensi wajib dan pilihan sesuai skema
5. **Mental**: Kesiapan menghadapi wawancara asesor dan demonstrasi praktik

═══ INSTRUKSI KHUSUS ═══
- Jika chatbot jabatan kerja spesifik belum tersedia, berikan panduan umum persiapan berdasarkan pengetahuan Anda tentang bidang ${bidang.name}
- Selalu tanyakan jenjang yang dituju (${bidang.jenjang})
- Berikan informasi tentang unit kompetensi inti yang biasa diujikan di bidang ini
- Dorong peserta untuk berlatih dengan simulasi pertanyaan asesor

${SPECIALIST_RESPONSE_FORMAT}
${GOVERNANCE_RULES}`,
        greetingMessage: `Selamat datang di Hub ${bidang.name}! 🎯

Saya akan membantu Anda mempersiapkan Uji Kompetensi SKK di ${bidang.fullName}.

**Subklasifikasi yang tercakup:**
${bidang.subklasifikasi.split(", ").map((s: string) => `• ${s}`).join("\n")}

**Contoh jabatan kerja:**
${bidang.contohJabatan.split(", ").map((j: string) => `• ${j}`).join("\n")}

**Jenjang:** ${bidang.jenjang}

Silakan sampaikan jabatan kerja dan jenjang yang ingin Anda persiapkan!`,
        conversationStarters: [
          `Jabatan kerja apa saja yang ada di bidang ${bidang.name}?`,
          `Saya ingin persiapan uji kompetensi jenjang Ahli Muda`,
          `Apa saja unit kompetensi yang diujikan?`,
          `Bantu saya menyiapkan portofolio untuk uji kompetensi`,
        ],
        contextQuestions: [
          {
            id: `${bidang.key}-jabatan`,
            label: "Jabatan kerja yang dituju?",
            type: "text",
            required: true,
          },
          {
            id: `${bidang.key}-jenjang`,
            label: "Jenjang kualifikasi yang dituju?",
            type: "select",
            options: bidang.jenjang.split(" → "),
            required: true,
          },
          {
            id: `${bidang.key}-pengalaman`,
            label: "Pengalaman kerja di bidang ini (tahun)?",
            type: "select",
            options: ["< 1 tahun", "1-3 tahun", "3-5 tahun", "5-10 tahun", "> 10 tahun"],
            required: false,
          },
        ],
        personality: "Suportif, sabar, dan detail. Seperti mentor senior yang membantu juniornya mempersiapkan ujian.",
      } as any);

      log(`[Seed] Created Hub Bidang ${bidang.name}`);
    }

    log(`[Seed] ✅ Siap Uji Kompetensi SKK created: 1 Hub Utama + ${BIDANG_KLASIFIKASI.length} Hub Bidang = ${1 + BIDANG_KLASIFIKASI.length} chatbots`);
    log("[Seed] 💡 Chatbot per jabatan kerja dapat ditambahkan melalui dashboard di bawah masing-masing Hub Bidang");

  } catch (error) {
    log(`[Seed] Error creating Siap Uji Kompetensi SKK: ${error}`);
  }
}
