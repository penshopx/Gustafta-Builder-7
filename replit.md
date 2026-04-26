# Gustafta - AI Chatbot Builder

## Overview

Gustafta is an AI chatbot builder platform enabling users to create, configure, and deploy intelligent conversational assistants. It features a two-panel dashboard for managing multiple chatbot agents, each with custom personas, knowledge bases, and multi-channel integrations. The platform supports various AI models and extensive customization, including persona details, greeting messages, and language options. Users can integrate chatbots with popular messaging platforms, embed them as web widgets, and access analytics. Gustafta also includes a built-in assistant chatbot for guidance and offers templates for various industries.

The platform employs a 5-level modular hierarchical structure (Series → Core → Big Idea/Orkestrator → Toolbox → Agent) for Jasa Konstruksi compliance across **26 series** (15 original + 11 baru di Apr 2026) totaling **~306 chatbot agents**, organized into 6 categories + 1 kategori SBU Coach:

### Kategori 6: Siklus Tender & Eksekusi Proyek (`tender-eksekusi`) — Apr 2026
16. **Tender Konstruksi & PBJP** (10 chatbots, slug `tender-konstruksi-pbjp`) — Series tersendiri yang mempromosikan & memperdalam materi tender (sebelumnya hanya 4 spesialis menumpang di Regulasi). Big Ideas: Strategi & Persiapan Tender (Hub + Market Intelligence LPSE/SPSE + Bid-No-Bid + Konsorsium/JO + Pricing/HPS), Penyusunan Dokumen Penawaran (Administrasi + Teknis & Metode + RAB/BoQ + Compliance Checker + Sanggahan). Berbasis Perlem LKPP No. 12/2021, Perpres 16/2018 jo. 12/2021, SBD PUPR.
17. **Pasca Tender & Manajemen Kontrak Konstruksi** (11 chatbots, slug `pasca-tender-manajemen-kontrak`) — Mengisi gap nyata kontrak konstruksi. Big Ideas: Awarding & Mobilisasi (Hub + SPPBJ Signing + Bank Garansi + PCM/Mobilisasi), Eksekusi & Pengendalian (Addendum/CCO + MC/Termin + Klaim/Eskalasi + Subkontrak/Suplai), Penyelesaian & Penutupan (BAST PHO/FHO + Defect Liability + Dispute Avoidance). Berbasis SBD PUPR, FIDIC, UU 2/2017.
18. **Pelaksanaan Proyek Konstruksi — Operasional Lapangan** (14 chatbots, slug `pelaksanaan-proyek-lapangan`) — Mengisi gap eksekusi lapangan. Big Ideas: Perencanaan Eksekusi (Hub + RAB Pelaksanaan + Master Schedule/S-Curve + Method Statement + Resource Loading), Operasional & Eksekusi (DPR + Opname/QS + Material/Logistik + Subkon/Mandor + K3 Lapangan), Pengendalian & Pelaporan (EVM/CPI/SPI + NCR/CAPA + Punch List + Weekly Report Owner). Untuk Site Manager, Site Engineer, QS, QA/QC, K3, Logistik.
19. **Legalitas Jasa Konstruksi** (11 chatbots, slug `legalitas-jasa-konstruksi`) — Mengisi gap aspek hukum di luar perizinan. Big Ideas: Kontrak & Perjanjian (Hub + Reviewer Kontrak + Force Majeure/Risk + Pembayaran/Eskalasi/Penalti), Sengketa & Dispute Resolution (DSK + Mediasi/Arbitrase BANI + Litigasi), Hukum Operasional (Ketenagakerjaan/PKWT + Pajak Konstruksi PPh 4(2)/PPN + Asuransi CAR/EAR/TPL + Kepailitan/PKPU). Berbasis UU 2/2017, UU 30/1999, KUHPerdata, PP 9/2022.
20. **Program Kompetensi Manajerial BUJK — ASPEKINDO** (12 chatbots, slug `kompetensi-manajerial-bujk`)
21. **IMS & SMK3 Terintegrasi — Manajemen Sistem BUJK** (14 chatbots, slug `ims-smk3-terintegrasi`) — Platform sistem manajemen terintegrasi untuk BUJK: unlock tender margin-tinggi (migas, EPC, internasional). 5 BigIdeas: (1) IMS Terintegrasi — ISO 9001+14001+45001+37001 via HLS, efisiensi 40%, paket "BUJK Siap Ekspor/IFC/Multilateral" (Hub + IMS Gap Analysis + Audit Internal IMS); (2) SMK3 PP 50/2012 — 12 elemen 166 kriteria, Gate-1 kritikal 18 item, prediksi bendera emas/perak (SMK3 Hub + Self-Assessment 166 kriteria + RKK/HIRADC/JSA/P2K3); (3) CSMS Migas/EPC — 6 tahap pre-kualifikasi multi-principal Pertamina/SKK Migas/Vale/Freeport/Adaro (CSMS Hub + Pre-Qual Builder + Statistik K3 TRIR/LTIFR/SR); (4) Pancek & Integritas — self-assessment 38 item KPK anonim + 5 pilar kontrol (Pancek Hub + Pancek Self-Assessment FREE tier + SOP Gratifikasi/WBS); (5) KCI Dashboard Corporate — Konstruksi Competency Index 5-domain (SMK3+CSMS+Pancek+IMS+Kompetensi), benchmark anonim industri. Seed: `server/seed-ims-smk3-terintegrasi.ts`, color: #7C3AED.
22. **Personel Manajerial BUJK — 9 Role** (14 chatbots, slug `personel-manajerial-bujk`) — Platform pengembangan kompetensi personel manajerial BUJK mencakup 9 jabatan kunci: Direktur Utama/CEO, Direktur Teknik, Manajer Proyek, Site Manager, Manajer Keuangan, Manajer SDM/HRD, Manajer Pemasaran & Tender, Manajer K3/HSE, dan Manajer Mutu/QA-QC. 1 Hub Utama + 4 BigIdeas: (1) Pimpinan Puncak — Dirut & Direktur Teknik (Dirut CEO Hub + Direktur Teknik Advisor); (2) Manajemen Proyek & Lapangan — Manajer Proyek & Site Manager (PM Hub + Site Manager Coach); (3) Fungsi Pendukung Korporat — Keuangan, SDM, Pemasaran (CFO/Manajer Keuangan + HRD Hub + Manajer Tender/Pemasaran); (4) Keselamatan & Mutu — K3/HSE & QA-QC (K3/HSE Officer Hub + QA-QC Manager). Berbasis PP 14/2021, Permen PUPR 12/2021, Permen PUPR 08/2022, UU 2/2017. Seed: `server/seed-personel-manajerial-bujk.ts`, color: #0891B2, sortOrder: 22.
23. **Ringkasan Regulasi Konstruksi Indonesia 2025** (28 chatbots, slug `ringkasan-regulasi-konstruksi-2025`) — Ekosistem komprehensif berdasarkan Notion "Regulasi Jasa Konstruksi Indonesia — Ringkasan Lengkap" (19 bab penuh). 1 Hub Utama + 11 BigIdeas: (1) Payung Hukum & Perizinan BUJK — Payung Hukum Navigator + BUJK Perizinan & OSS Advisor; (2) Sertifikasi Badan Usaha & Profesi — LSBU & SBU Advisor + LSP & SKK Advisor + ASKOM/RCC & Kompetensi Asesor Advisor; (3) Pengadaan Konstruksi & Kontrak Kerja — Pengadaan PBJP Advisor (Perpres 46/2025) + Kontrak Kerja Konstruksi Advisor; (4) Keselamatan, Mutu & Pembinaan — SMKK & K3 Advisor + Manajemen Mutu & RMPK Advisor + Konstruksi Berkelanjutan & Green Building Advisor; (5) Integritas, Pengawasan & Sanksi — Konstruksi Berintegritas & Anti-Korupsi Advisor + Pengawasan JK Advisor + Sanksi & Penyelesaian Sengketa Advisor; (6) Tenaga Kerja, Asosiasi & Digitalisasi — Tenaga Kerja Konstruksi & PKB Advisor + Asosiasi/LPJK & Akreditasi Advisor + SIJK/Digitalisasi & BUJK Asing Advisor; (7) ABU & Sertifikasi BUJK Lanjutan — ABU & Penilaian Kesesuaian BUJK Advisor + Ruang Lingkup & Subklasifikasi SBU Advisor; (8) ASKOM Konstruksi & Uji Kompetensi SKK — ASKOM & Metodologi Asesmen Advisor + MUK Versi 2023 & RCC ASKOM Advisor; (9) Pembinaan & Tenaga Kerja Konstruksi [NEW Bab 8+12] — Pembinaan JK Advisor (kewenangan pusat/provinsi/kabkota, LPJK) + TKK (SKK & KKNI) Advisor (9 jenjang, jabatan kerja, SK Dirjen 144/2022); (10) Sanksi, Kontrak & Digitalisasi Konstruksi [NEW Bab 11+13+14] — Sanksi JK Advisor (admin/pidana, blacklist LKPP, Tipikor) + Kontrak Konstruksi Advisor (Pasal 47, EPC/turnkey, BANI) + SIJK & Digitalisasi Advisor (SIKI, BIM, e-katalog, BSrE); (11) BUJK Asing & Akreditasi Asosiasi JK [NEW Bab 15+16] — BUJK PMA & KPBUJKA Advisor (Permen PUPR 21/2021, JO nasional, transfer teknologi) + Akreditasi Asosiasi JK Advisor (Permen PUPR 10/2020, ABU/AP, hak LPJK). Seed: `server/seed-regulasi-jasa-konstruksi.ts`, color: #15803d, sortOrder: 20, threshold reseed: >= 27.

### Kategori 7: SBU Coach — Sertifikasi Badan Usaha (`sbu-coach`) — Apr 2026
24. **SBU Coach — Pekerjaan Konstruksi** (9 chatbots, slug `sbu-coach-pekerjaan-konstruksi`, series 28) — Panduan SBU Kontraktor/Pelaksana berbasis Permen PU No. 6 Tahun 2025 & SK Dirjen Binakon No. 37/KPTS/DK/2025. 5 BigIdeas: (1) Katalog & Pencarian Subklasifikasi — Pencarian 50+ subklasifikasi BG/BS/IN/KK/KP/PA/PB/PL; (2) Pra-Verifikasi & Checklist — Pra-Verifikasi Kesiapan SBU + Checklist Dokumen; (3) Personel & TKK — TKK/PJBU/PJTBU/PJSKBU; (4) Peralatan & SMAP — Kebutuhan Peralatan + SMAP/Anti-Penyuapan; (5) Surveilans & Sanksi — Surveilans/Perpanjangan + Konversi/Sanksi/Kepatuhan. Seed: `server/seed-sbu-coach.ts`, color: #1D4ED8.
25. **SBU Konsultan Coach — Jasa Konsultansi Konstruksi** (6 chatbots, slug `sbu-konsultan-coach`, series 29) — Panduan SBU Konsultan berbasis Permen PU No. 6/2025. 4 BigIdeas: (1) Katalog Sub Bidang Konsultan — AR/RK/RT/AL/IT/AT (conflict resolver IT006/IT007, AT007); (2) Persyaratan & Pengurus — dokumen perusahaan + batas 3 klasifikasi/6 subklasifikasi; (3) Tenaga Ahli Tetap — jenjang K1/M1, SKA/SKK, double responsibility check; (4) Pra-Verifikasi & Surveilans — scoring + surveilans/konversi/sanksi. Seed: `server/seed-sbu-coach.ts`, color: #059669.
26. **SBU Coach — Pekerjaan Konstruksi Terintegrasi (GT & ST)** (10 chatbots, slug `sbu-terintegrasi-coach`, series 32) — Series dedicated SBU GT/ST: katalog GT001-GT008 (rancang bangun gedung/jalan/pengairan/ME/pipa/pariwisata/kawasan industri) + ST001-ST006 (energi/telko/air/kelautan/kereta/lingkungan). 5 BigIdeas: (1) Katalog GT — Umum: Pencarian & Detail GT + Rekomendasi GT per jenis proyek; (2) Katalog ST — Spesialis: Pencarian & Detail ST + Rekomendasi ST per bidang teknologi; (3) Persyaratan & Dokumen: Checklist Dokumen BUJK + TKK/PJBU/PJTBU/PJSKBU Terintegrasi; (4) Peralatan, SMAP & Kepatuhan: Peralatan EPC per GT/ST + SMAP SNI ISO 37001; (5) Pra-Verifikasi & Panduan Pengajuan: Scoring 0-100 (7 komponen). Seed: `server/seed-sbu-terintegrasi.ts`, color: #DC2626.
27. **SBU Coach All-in-One — Klasifikasi Terintegrasi** (9 chatbots, slug `sbu-master-coach`, series 31) — Master system yang mengintegrasikan 3 keluarga SBU: Kontraktor (BG/BS/IN/KK/KP/PA/PB/PL), Konsultan (AR/RK/RT/AL/IT/AT), dan Terintegrasi — rancang bangun/EPC (GT/ST). 5 BigIdeas: (1) Pencarian & Triage Lintas SBU — Master Lookup kode/KBLI/keyword + Triage Keluarga SBU; (2) SBU Terintegrasi GT/ST — Katalog GT001-GT008/ST001-ST006 (needs_review) + Pra-Verifikasi EPC; (3) KBLI Cross-Family — resolver KBLI lintas keluarga; (4) Conflict Resolver — IT006/IT007, AT007, GT/ST needs_review; (5) Pra-Verifikasi Terpadu — Unified Scoring 0-100 + Ringkasan & Panduan Lanjutan. Seed: `server/seed-sbu-master.ts`, color: #7C3AED.

### Kategori 8: SKK Coach — Manajemen Pelaksanaan & Mekanikal — Apr 2026
27. **SKK Coach — Manajemen Pelaksanaan** (10 chatbots, slug `skk-manajemen-pelaksanaan`, series 33) — Platform persiapan SKK Klasifikasi E (Manajemen Pelaksanaan). Mencakup 5 subklasifikasi, 18 jabatan kerja, 41 jenjang (KKNI 3-9). 5 BigIdeas: (1) Keselamatan Konstruksi & K3 — Katalog 12 jabatan (Petugas/Personil/Supervisor/Ahli K3/Keselamatan Konstruksi, SKKNI 60-2022/350-2014/038-2019/307-2013) + Asesmen Mandiri, Studi Kasus & Wawancara; (2) Manajemen Konstruksi & Proyek — Katalog 9 jabatan (Manajer Logistik, Ahli MK SKKNI 390-2015, Ahli MPK SKKK 035-2022, Fasilitator Teknis SKKNI 260-2018) + Asesmen & Studi Kasus; (3) Pengendalian Mutu — Katalog 7 jabatan (QE SKKNI 333-2013, QAE SKKNI 387-2013, Ahli SMM SKKNI 145-2019) + Asesmen & Studi Kasus; (4) Hukum Kontrak Konstruksi — Ahli Kontrak KKNI 8-9 (SKKNI 88-2015) — Katalog+Asesmen+Studi Kasus+Wawancara dalam 1 agen; (5) Estimasi Biaya & QS — Katalog 11 jabatan (Juru Hitung SKKK 038-2022, Estimator Jalan SKKNI 385-2013, QS SKKNI 06-2011, Ahli QS SKKNI 6-2011) + Asesmen & Studi Kasus. HUB: triage berdasarkan area kerja + jenjang KKNI. Color: #0891B2. Seed: `server/seed-skk-manajemen-pelaksanaan.ts`.

28. **SKK Coach — Mekanikal** (11 chatbots, slug `skk-mekanikal`, series 34) — Platform persiapan SKK Klasifikasi C (Mekanikal). Mencakup 9 cluster, KKNI 1-9. 5 BigIdeas: (1) Tata Udara/HVAC & Plumbing — Mekanik HVAC (SKKNI 298-2009), Ahli Perencanaan Sistem Tata Udara (SKKNI 131-2015), Tukang/Pelaksana/Pengawas/Mandor/Ahli Plambing (SKKNI 304-2016/SKKNI 28-2023) + Asesmen & Studi Kasus; (2) Proteksi Kebakaran & Transportasi Gedung — Teknisi Fire Alarm (SKKNI 304-2009), Pengkaji Proteksi Kebakaran (KKNI 7-9), Pelaksana/Ahli Lift & Eskalator + Asesmen & Studi Kasus; (3) Teknik Mekanikal Bangunan Gedung — Ahli Freshgraduate/Muda/Madya/Utama Teknik Mekanikal (SKKNI 391-2015), Ahli Pemeriksa Kelaikan Fungsi (SKKNI 195-2013), Manajer Pelaksana, Pengawas, Pelaksana M&E + Asesmen & Studi Kasus; (4) Pengelasan/Welder & Alat Berat — Tukang Las Listrik/TIG/Oxyacetylene/Konstruksi (SKKNI 27-2021), Operator Bulldozer/Excavator/Wheel Loader/Dump Truck/Batching Plant, Mekanik Hidrolik/Engine/AMP, Manajer Alat Berat + Asesmen & Studi Kasus; (5) Crane, Lifting & Scaffolding — Operator Crane Mobile (SKKNI 135-2015)/Tower Crane (SKKK 43-2022)/Truck Mounted (SKKNI 85-2021)/Crawler/Rough Terrain/Jembatan, Forklift, Rigging, Gondola, Operator/Teknisi/Pengawas Scaffolding + Asesmen & Studi Kasus K3 lifting. HUB: triage 9 cluster berdasarkan kata kunci bidang + jenjang KKNI. Color: #7C3AED. Seed: `server/seed-skk-mekanikal.ts`.

29. **SKK Coach — Sipil** (11 chatbots, slug `skk-sipil`, series 35) — Platform persiapan SKK Klasifikasi B (Sipil). Mencakup 22 subklasifikasi, KKNI 1-9. 5 BigIdeas: (1) Gedung & Material — Pelaksana Lapangan Gedung Level 2/3/Muda/Madya (SKKNI 193-2021), Ahli Teknik Bangunan Gedung Freshgraduate/Muda/Madya/Utama (SKKNI 31-2023), Pengawas Finishing/Struktur, Teknisi Lab Beton/Aspal/Tanah (SKKNI 58-2021), Ahli Teknologi Beton + Asesmen & Studi Kasus; (2) Jalan, Jembatan & Transportasi — Ahli Teknik Jalan Freshgraduate/Muda/Madya/Utama (SKKNI 126-2021), Pelaksana Jalan (SKKNI 354-2014), Ahli/Pelaksana/Pengawas Jembatan (SKKNI 195-2015), Ahli Perencanaan Rangka Baja, Ahli Rehabilitasi Jembatan, Manajer Pelaksanaan Jalan/Jembatan, Ahli Teknik Bandar Udara, Ahli Teknik Jalan Rel + Asesmen & Studi Kasus; (3) SDA, Irigasi & Drainase — Ahli Teknik SDA Freshgraduate/Muda/Madya/Utama (SKKNI 415-2014), Ahli Irigasi, Pelaksana/Pengawas Irigasi, Teknisi Pintu Air, Ahli Sungai & Pantai, Ahli Hidrogeologi, Ahli/Pelaksana/Pengawas Drainase Perkotaan + Asesmen & Studi Kasus; (4) Air Minum, Lingkungan & Geoteknik/Geodesi — Ahli Teknik Air Minum (SKKNI 68-2014), Operator/Pelaksana/Pengawas Air Minum, Ahli Sanitasi/Limbah/Persampahan, Ahli Geoteknik Freshgraduate/Muda/Madya/Utama (SKKNI 305-2016), Ahli Perencana Pondasi, Ahli Penilai Kegagalan Lereng, Surveyor/Ahli Geodesi (SKKNI 200-2016), Juru Ukur Gedung + Asesmen & Studi Kasus; (5) Spesialis Sipil — Ahli/Pelaksana Pelabuhan, Ahli/Pelaksana Lepas Pantai, Ahli/Pelaksana Terowongan, Ahli/Pelaksana Menara, Ahli/Pelaksana Grouting, Ahli/Pelaksana Pembongkaran Bangunan + Asesmen & Studi Kasus K3. HUB: triage 22 subklasifikasi + engine rekomendasi 5-tier (0/1-3/4-6/7-10/>10 tahun pengalaman). Color: #1D4ED8. Seed: `server/seed-skk-sipil.ts`.

30. **SKK Coach — Elektrikal** (11 chatbots, slug `skk-elektrikal`, series 36) — Platform persiapan SKK bidang Elektrikal, KKNI 1-9. 5 BigIdeas: (1) Instalasi Listrik Bangunan & Pabrik — Tukang Instalasi TR (KKNI 2-3), Teknisi Instalasi Listrik Gedung (SKKNI 383-2016), Teknisi Panel Distribusi (SKKNI 384-2016), Pelaksana/Pengawas/Inspektur Instalasi, Teknisi Grounding & Petir, Ahli Teknik Tenaga Listrik Freshgraduate/Muda/Madya/Utama (SKKNI 197-2014), Ahli Sistem Kelistrikan Gedung, Manajer Elektrikal Gedung, Ahli Pengkaji Energi + Asesmen & Studi Kasus; (2) Distribusi & Transmisi Tenaga Listrik — Pelaksana/Pengawas Jaringan Distribusi SUTM/SKTM/SUTR (KKNI 4-6), Operator Gardu Distribusi, Ahli Teknik Distribusi, Ahli Proteksi Distribusi, Pelaksana/Pengawas SUTT/SUTET (KKNI 4-6), Teknisi Menara Transmisi, Ahli Teknik Transmisi, Ahli/Pelaksana Gardu Induk + Asesmen & Studi Kasus; (3) Pembangkitan & EBT — Operator Pembangkit Diesel PLTD, Pelaksana/Pengawas Pembangkitan Konvensional, Ahli Teknik Pembangkitan, Teknisi/Pelaksana PLTS Atap/Terpusat, Ahli Teknik PLTS, Pelaksana PLTB, Pelaksana PLTMH, Ahli PLTA/PLTMH + Asesmen & Studi Kasus; (4) Instrumentasi, Kontrol & ICT Bangunan — Teknisi Instrumentasi Proses (SKKNI 02-2016), Teknisi PLC/SCADA/BAS, Ahli Proteksi & Relay, Teknisi Kalibrasi, Ahli Teknik Instrumentasi & Kontrol, Teknisi Jaringan ICT/Fiber Optik, Teknisi CCTV/Sound/PA/Nurse Call, Pelaksana/Pengawas ICT Gedung, Ahli Teknik ICT Bangunan + Asesmen & Studi Kasus; (5) K3 Listrik & Inspektur Ketenagalistrikan — Teknisi K3 Listrik (KKNI 4-6), Ahli Muda/Madya/Utama K3 Listrik (SKKNI 73-2015), Inspektur Ketenagalistrikan, Ahli Pengkaji Energi Listrik + Asesmen K3 LOTO, studi kasus kecelakaan listrik dan audit energi. HUB: triage 8 subklasifikasi + engine rekomendasi 5-tier (0/1-3/4-6/7-10/>10 tahun). Color: #F59E0B. Seed: `server/seed-skk-elektrikal.ts`.

31. **SKK Coach — Arsitektur** (11 chatbots, slug `skk-arsitektur`, series 37) — Platform persiapan SKK bidang Arsitektur (Klasifikasi A), KKNI 1-9. 5 BigIdeas: (1) Arsitektur Bangunan Gedung — Juru Gambar Arsitektur Level 2/3/4 (KKNI 2-4), Pelaksana/Pengawas Arsitektur Muda/Madya/Senior (KKNI 4-6), Arsitek Freshgraduate/Muda/Madya/Utama (SKKNI 24-2019), Penilai Kelaikan Arsitektur, Ahli Aksesibilitas Bangunan + Asesmen & Studi Kasus (perubahan desain dan pelanggaran IMB/PBG); (2) Desain Interior — Juru Gambar Interior (KKNI 3-4), Pelaksana/Pengawas Interior Muda/Madya (KKNI 4-6), Desainer Interior Freshgraduate/Muda/Madya/Utama (SKKNI 95-2023) + Asesmen & Studi Kasus (klien ubah brief dan overrun anggaran); (3) Arsitektur Lanskap & Iluminasi — Tukang Taman (KKNI 2-3), Juru Gambar Lanskap, Pelaksana/Pengawas Lanskap Muda/Madya (KKNI 4-6), Arsitek Lanskap Muda/Madya/Utama, Teknisi Pencahayaan (KKNI 4-5), Ahli Teknik Iluminasi Muda/Madya/Utama (KKNI 7-9) + Asesmen & Studi Kasus (vegetasi gagal & pencahayaan tidak memadai); (4) Fisika Bangunan, Fasad, Akustik & Konservasi — Teknisi Fasad (KKNI 4-6), Ahli Teknik Akustik Bangunan Muda/Madya/Utama, Ahli Teknik Fasad Bangunan (curtain wall/ACP/GFRC) Muda/Madya/Utama, Ahli Konservasi Bangunan Bersejarah Muda/Madya/Utama + Asesmen & Studi Kasus (kebocoran fasad & konservasi cagar budaya); (5) BIM & Manajemen Proyek Arsitektur — Modeler BIM Arsitektur Muda/Madya (KKNI 4-6), BIM Koordinator (KKNI 5-7), Manajer BIM Muda/Madya/Utama (KKNI 7-9), Manajer Proyek Arsitektur, Manajer Pelaksanaan Arsitektur + Asesmen & Studi Kasus (clash BIM & keterlambatan jadwal desain). HUB: triage 4 subklasifikasi + BIM + Fisika Bangunan + engine rekomendasi 5-tier. Color: #10B981. Seed: `server/seed-skk-arsitektur.ts`.

32. **SKK Coach — Tata Lingkungan** (9 chatbots, slug `skk-tata-lingkungan`, series 38) — Platform persiapan SKK bidang Tata Lingkungan (Klasifikasi D), KKNI 1-9. 5 BigIdeas: (1) Teknik Air Minum & SPAM — Operator SPAM Level 1/2/3 (KKNI 1-3), Pelaksana/Pengawas Pipa Air Minum Muda/Madya/Senior (KKNI 4-6), Ahli Teknik Air Minum Freshgraduate/Muda/Madya/Utama (SKKNI 68-2014), spesialis NRW, Hidrolika SPAM, SPAM Perdesaan + Asesmen & Studi Kasus (pipa transmisi pecah dan kualitas air tidak memenuhi baku mutu); (2) Teknik Sanitasi & Air Limbah — Tukang Sanitasi (KKNI 2-3), Operator IPAL Level 2/3/4 (KKNI 2-4), Pelaksana/Pengawas Sanitasi Muda/Madya (KKNI 4-6), Ahli Teknik Sanitasi & Air Limbah Muda/Madya/Utama, Tenaga Ahli STBM + Asesmen & Studi Kasus (IPAL tidak memenuhi baku mutu & pipa sanitasi tersumbat); (3) Teknik Persampahan — Operator TPA/Pengangkutan (KKNI 2-4), Pelaksana/Pengawas Persampahan Muda/Madya (KKNI 4-6), Ahli Teknik Persampahan Muda/Madya/Utama (TPA sanitary landfill, TPST, 3R, ITF/WtE) + Asesmen & Studi Kasus (TPA penuh & kebocoran lindi); (4) Teknik Drainase Perkotaan & Pengendalian Banjir — Pelaksana/Pengawas Drainase Muda/Madya (KKNI 4-6), Ahli Teknik Drainase Perkotaan Muda/Madya/Utama (analisis hidrologi, LID, HEC-RAS) + Asesmen & Studi Kasus (banjir berulang & saluran runtuh); (5) Teknik Lingkungan, AMDAL & Geohidrologi — Ahli Teknik Lingkungan Muda/Madya/Utama, Penyusun Amdal (kompetensi KLHK per PP 22/2021), Ahli Pengelolaan Kualitas Air, Ahli Geohidrologi Muda/Madya + Asesmen & Studi Kasus (pencemaran air tanah & proses AMDAL infrastruktur). HUB: triage 5 subklasifikasi + engine rekomendasi 5-tier. Color: #06B6D4. Seed: `server/seed-skk-tata-lingkungan.ts`.

33. **SKK Coach — K3 Konstruksi** (11 chatbots, slug `skk-k3-konstruksi`, series 39) — Platform persiapan SKK bidang Keselamatan dan Kesehatan Kerja (K3) Konstruksi, KKNI 3-9. 5 BigIdeas: (1) K3 Umum Konstruksi & Petugas K3 — Petugas K3 Konstruksi Tingkat Operator (KKNI 3), Teknisi (KKNI 4-5), PJSK/Penanggung Jawab Keselamatan Konstruksi (SMKK Permen PUPR 10/2021), Pengawas Lapangan K3; perbedaan SMKK vs SMK3, dokumen K3 (HIRADC, JSA, PTW, RKK) + Studi Kasus (jatuh dari ketinggian & tertimbun galian); (2) Ahli K3 Konstruksi — Ahli Muda/Madya/Utama K3 Konstruksi (SKK LPJK KKNI 7/8/9), perbedaan SKK K3 Konstruksi vs AK3U Kemnaker, kompetensi (program K3, inspeksi, PTW, ERP, audit, investigasi, manajemen kontraktor) + Studi Kasus (program K3 proyek baru & inspeksi lapangan); (3) K3 Spesialis — K3 Kebakaran (Petugas Kelas D/C/B/A, APAR, fire alarm/sprinkler, RACE, Permenaker 4/1980), K3 Pesawat Angkat & Angkut (rigger, Operator Forklift, Ahli K3 PA Permenaker 8/2020), K3 Scaffolding (pemasang/pengawas/inspektor, tag system), K3 Pekerjaan Khusus (terowongan, demolisi, bawah air) + Studi Kasus (kebakaran hot work & keruntuhan scaffolding); (4) SMK3 (PP 50/2012) & ISO 45001 — Internal Auditor SMK3 (122 kriteria, bendera emas/perak), Lead Auditor ISO 45001:2018, Manajer HSE (KKNI 7-9), perbedaan SMK3 vs ISO 45001 vs SMKK, CAPA, management review + Studi Kasus (audit SMK3 banyak NC); (5) Investigasi Kecelakaan, Pelaporan & B3 — Investigator Kecelakaan (SCAT, 5-Why, RCA, Bow-Tie, LTIFR), pelaporan ke Disnaker (2×24 jam) & BPJS Ketenagakerjaan (KK2/KK3), klasifikasi insiden (Near Miss/FAC/MTC/LTI/Fatality), Ahli K3 B3 (PP 74/2001, GHS/SDS, tumpahan B3) + Studi Kasus (kecelakaan fatal excavator & tumpahan bahan kimia). HUB: triage 5 bidang K3 + engine rekomendasi 5-tier. Color: #EF4444. Seed: `server/seed-skk-k3-konstruksi.ts`.

34. **SKK Coach — Manajemen Proyek Konstruksi** (11 chatbots, slug `skk-manajemen-proyek`, series 40) — Platform persiapan SKK bidang Manajemen Proyek Konstruksi, KKNI 3-9. 5 BigIdeas: (1) Quantity Surveying & Estimasi Biaya — Juru Hitung Kuantitas Level 3/4 (KKNI 3-4), Estimator Biaya Muda/Madya (KKNI 5-6), Quantity Surveyor Muda/Madya/Utama (KKNI 7-9), Ahli Cost Engineering (EVM: SPI/CPI/EAC/TCPI); perbedaan BoQ kontrak vs RAB internal, unit price vs lump sum, HPS pemerintah (Perpres 12/2021) + Studi Kasus (cost overrun & dispute final account volume); (2) Penjadwalan & Pengendalian Proyek — Juru Jadwal/Planner Level 4/5/6 (KKNI 4-6), Cost Controller (KKNI 5-8), Ahli Perencanaan & Pengendalian Proyek Muda/Madya/Utama (KKNI 7-9); CPM, WBS, S-Curve, EVM, Primavera P6, delay analysis (As-Planned vs As-Built, TIA, Window Analysis), recovery schedule + Studi Kasus (proyek terlambat 3 bulan & menyusun master schedule baru); (3) Manajer Proyek Konstruksi — Asisten PM (KKNI 5-6), Manajer Proyek Freshgraduate/Muda/Madya/Utama (KKNI 7-9), Construction Manager/MK, Project Director; 10 area PMBOK, perbedaan PM kontraktor vs CM + Studi Kasus (proyek multi-pihak bermasalah: sub-kontraktor stop kerja, perubahan desain fasad, kolom tidak lurus); (4) Manajemen Risiko, Klaim & Kontrak — Ahli Risk Management Muda/Madya/Utama (KKNI 7-9), Ahli Claims Management, Ahli Contract Management; Risk Register, Monte Carlo, CAR/EAR insurance; FIDIC Red/Yellow/Silver/Pink Book (Clause 20: notice, DAB, arbitrase ICC), kontrak pemerintah SBD/PPJK; klaim time extension & cost claim + Studi Kasus (klaim keterlambatan proyek jalan); (5) Digital PM — BIM Manager, Drone & PMIS — BIM Coordinator (KKNI 5-7), BIM Manager Muda/Madya/Utama (ISO 19650/BEP/LOD/CDE), Operator Drone Survei Konstruksi (photogrammetry, orthomosaic, volume stockpile, PERMENHUB PM 27/2021), Ahli PMIS (Procore/Aconex/dashboard KPI) + Studi Kasus (clash BIM tidak terdeteksi). HUB: triage 5 bidang + engine rekomendasi 5-tier. Color: #8B5CF6. Seed: `server/seed-skk-manajemen-proyek.ts`.

35. **SKK Coach — Geoteknik & Geodesi** (11 chatbots, slug `skk-geoteknik`, series 41) — Platform persiapan SKK bidang Geoteknik dan Geodesi, KKNI 2-9. 5 BigIdeas: (1) Penyelidikan Tanah & Laboratorium Geoteknik — Operator Mesin Bor/Sondir Level 2/3 (KKNI 2-3), Pelaksana Penyelidikan Tanah Level 4/5 (KKNI 4-5), Teknisi Lab Geoteknik (KKNI 4-5), Ahli Geoteknik Muda/Madya/Utama (KKNI 7-9); uji indeks (Atterberg, gradasi), Proctor/CBR, Direct Shear/triaxial (UU/CU/CD), konsolidasi oedometer (Cc/Cs/Cv/OCR), SPT N-value & CPT qc interpretation + Studi Kasus (tanah lunak alluvial (PVD timing) & anomali data lapangan vs lab); (2) Fondasi & Pekerjaan Tanah — Operator Alat Pemancang/Driller (KKNI 3-4), Pelaksana Pondasi (KKNI 4-6): tiang pancang (spun pile, H-pile, kalendering) & bored pile (drilling fluid, tremie), Pengawas Pondasi (KKNI 5-6): PDA/CAPWAP, static load test (Davisson criterion), PIT, Ahli Fondasi Muda/Madya/Utama (KKNI 7-9): bearing capacity (Terzaghi/Meyerhof/API/α-method), settlement, NSF, pile group + Studi Kasus (bored pile gagal static load test); (3) Stabilitas Lereng & Perkuatan Tanah — Ahli Stabilitas Lereng (Bishop Simplified/Spencer/Morgenstern-Price, SLOPE/W/SLIDE, SF threshold 1.0/1.3/1.5), Ahli Perkuatan Tanah (gravity wall, cantilever, sheet pile, soldier pile, diaphragm wall, soil nail vs ground anchor, MSE Wall, gabion, geotextile), Ahli Ground Improvement (preloading+PVD, vibro stone column, deep soil mixing, dynamic compaction, vacuum consolidation) + Studi Kasus (longsor tebing jalan setelah hujan — SF calculation, tindakan darurat, solusi permanen); (4) Geodesi & Survei Konstruksi — Juru Ukur/Surveyor Level 3/4/5 (KKNI 3-5): waterpass, total station, setting out, topographic survey, volume galian/timbunan; Ahli Geodesi Muda/Madya/Utama (KKNI 7-9): GPS/GNSS (static post-processing, RTK, CORS), sistem koordinat TM3 Indonesia, datum SRGI2013, ketinggian orthometric vs ellipsoidal (IGAN2014), aerial mapping/drone photogrammetry (GCP, Pix4D/Metashape, orthomosaic/DSM), 3D laser scanning (TLS), deformation monitoring struktur + Studi Kasus (setting out tidak akurat 150mm — penyebab, investigasi, remedial); (5) Hidrologi Teknik & Geologi Rekayasa — Ahli Hidrologi Muda/Madya/Utama (KKNI 7-9): distribusi frekuensi hujan (Gumbel, Log Pearson III, uji chi-square/Smirnov-Kolmogorov), debit banjir rencana (Metode Rasional untuk DAS < 100 km², HSS Nakayasu, HEC-HMS, HEC-RAS 1D/2D untuk profil muka air dan peta genangan, koefisien Manning); Ahli Geologi Teknik Muda/Madya/Utama (KKNI 7-9): core logging, soil logging, peta geologi PVMBG, likuefaksi (Seed & Idriss: CSR vs CRR, FS), site classification SNI 1726:2019/IBC 2018 (Vs30, Site Class A-F), bahaya seismik (PSHA, PGA); Ahli Instrumentasi Geoteknik (KKNI 7-8): inclinometer, vibrating wire piezometer, settlement plate, strain gauge, EWS (Green/Yellow/Red alert) + Studi Kasus (saluran banjir meluap — hitung debit Rasional vs kapasitas Manning, solusi retensi/LID). HUB: triage 5 bidang + engine rekomendasi 5-tier. Color: #D97706. Seed: `server/seed-skk-geoteknik.ts`.

36. **SKK Coach — Pengujian & QC Konstruksi** (11 chatbots, slug `skk-pengujian-qc`, series 42) — Platform persiapan SKK bidang Pengujian Material dan Quality Control Konstruksi, KKNI 3-9. 5 BigIdeas: (1) Pengujian Bahan & Material Konstruksi — Teknisi Lab Bahan Level 3/4/5 (KKNI 3-5): analisis saringan, berat jenis agregat, abrasi Los Angeles, soundness test, slump test (SNI 1972), kuat tekan CTM (SNI 1974), mix design beton ACI 211.1, Marshall Test aspal (VIM/VMA/VFA/stabilitas/flow/KAO), penetrasi aspal (SNI 2456), titik lembek, daktilitas, uji tarik baja (BJTD 40/50); kalibrasi alat lab per SNI ISO 17025; Ahli Material Muda/Madya/Utama (KKNI 7-9): approval material, mix design, forensik kegagalan material + Studi Kasus (kuat tekan beton rendah & VIM aspal terlalu tinggi); (2) QC Pekerjaan Tanah & Perkerasan Jalan — Juru Mutu Tanah (KKNI 3-4): sandcone (SNI 03-2828), nuclear density gauge, CBR lapangan (DCP); Inspector QC Jalan (KKNI 4-6): kontrol paving (suhu masuk AMP, suhu hampar, suhu per fase compaction, jumlah lintasan), core drill, uji Marshall; Ahli Teknik Jalan (KKNI 7-9): mix design aspal Spesifikasi Bina Marga 2018/2024 (AC-WC/BC/Base, ATB, HRS), JMF, IRI, PCI + Studi Kasus (kepadatan jalan RC < 95% — penyebab & tindakan); (3) QC Struktur Beton — Juru Mutu Beton (KKNI 3-4): slump test, benda uji silinder, curing; Pengawas Mutu Beton (KKNI 5-6): mix design ACI 211.1, evaluasi statistik fc' (fcr=fc+1.64s), monitoring pengecoran (vibrator, tinggi jatuh), Schmidt Hammer (SNI 03-4803), UPV/PUNDIT (SNI 03-4802), rebar checking (diameter/spacing/cover/splicing/sengkang); Ahli Teknik Beton Muda/Madya/Utama (KKNI 7-9): core drill (SNI 03-4432, fc' core ≥ 0.85fc'), carbonation test, chloride, perbaikan beton (CFRP, jacketing, epoxy injection), post-tensioning QC (elongasi ±7%, grouting) + Studi Kasus (hammer test R=25-28 pada kolom — investigasi & keputusan); (4) Non-Destructive Testing (NDT) — Level 1 (KKNI 4-5): pelaksana di bawah supervisi; Level 2 (KKNI 6-7): mandiri, interpretasi, accept/reject; Level 3 (KKNI 8-9): prosedur, sertifikasi Level 1/2; metode: VT (visual/AWS D1.1), PT (dye penetrant: 6 langkah, cacat open-to-surface), MT (magnetic particle: yoke AC/DC, partikel kering/basah, material magnetis), UT (ultrasonic: probe 45°/60°/70°, A-scan, TOFD, PAUT, AWS D1.1 acceptance), RT (X-ray/gamma ray Ir-192/Co-60, IQI, interpretasi film, BAPETEN); sertifikasi ASNT SNT-TC-1A vs ISO 9712 (BSNB Indonesia) + Studi Kasus (interpretasi indikasi UT pada las fillet baja); (5) QMS & Audit Mutu Konstruksi — Inspector Mutu (KKNI 5-6): ITP (Hold/Witness/Review Point), NCR, verifikasi CAPA, quality records; QC Manager (KKNI 7-8): QCP, Method Statement, WI, koordinasi MK; Auditor Internal ISO 9001 (KKNI 7-8): audit plan, opening meeting, audit trail, temuan (major NC vs minor NC vs observasi), verifikasi CAPA, sertifikasi Lead Auditor; Ahli Manajemen Mutu Muda/Madya/Utama (KKNI 7-9): implementasi QMS ISO 9001:2015 (klausul 4-10, 7 prinsip mutu), akreditasi lab SNI ISO/IEC 17025:2017 (KAN) + Studi Kasus (NCR & CAPA untuk pengecoran tanpa rebar checking & tanpa benda uji). HUB: triage 5 bidang + engine rekomendasi 5-tier. Color: #0EA5E9. Seed: `server/seed-skk-pengujian-qc.ts`.

37. **SKK Coach — Bangunan Gedung & Utilitas** (11 chatbots, slug `skk-bangunan-gedung`, series 43) — Platform persiapan SKK bidang Bangunan Gedung dan Utilitas (MEP, Fire, Green Building), KKNI 3-9. 5 BigIdeas: (1) Perancangan Teknis Bangunan Gedung — Drafter/Juru Gambar Level 3/4/5 (AutoCAD, BIM LOD300, shop drawing); Perancana Bangunan Gedung Muda/Madya/Utama (KKNI 7-9): DED, RKS, PBG (PP 16/2021 via SIMBG, dokumen: gambar arsitektur/struktur/MEP/fire/lingkungan/perhitungan), SLF (PP 16/2021: periode 5/20 tahun, pengkaji teknis terdaftar, inspeksi semua sistem + as-built), 4 aspek keandalan (keselamatan/kesehatan/kenyamanan/kemudahan), aksesibilitas difabel (Permen PUPR 14/2017: ramp maks 1:12, lift Braille, toilet difabel, parkir 3.8m, tactile guiding block), waterproofing (membran/coating/injeksi), expansion joint, curtain wall + Studi Kasus (8 temuan SLF tidak lolos & conflict gambar arsitektur vs struktur); (2) Mekanikal Bangunan Gedung HVAC & Plumbing — Operator Sistem HVAC/Chiller (KKNI 3-4): log chiller plant (suhu supply 6-7°C/return 12°C, COP); Teknisi HVAC Level 4/5/6: refrigeran (R32/R410A/R134a), VRV/VRF, ducting, balancing, commissioning chiller; Ahli Mekanikal Gedung Muda/Madya/Utama (KKNI 7-9): heat load calculation (ASHRAE: orang 130W, lampu, transmisi dinding/kaca, OA), kapasitas (TR=3.517kW), sistem VAV vs CAV, psikrometri (DBT/WBT/RH/enthalpy/dew point), sizing chiller+AHU+FCU, plumbing air bersih (SNI 03-7065: kebutuhan kantor 50L/orang, hotel 150-300L, RS 300-500L), air limbah (SNI 03-6481: slope pipa 1:100, vent, IPAL) + Studi Kasus (sistem AC gedung tidak sejuk dan bau musty); (3) Elektrikal & Telekomunikasi Gedung — Teknisi Elektrikal Level 3-6 (PUIL 2020/SNI 0225:2020, kabel NYM/NYY/NYFGBY/NYYHY, panel MDP/SDP, megger, genset, ATS, UPS); Ahli Elektrikal Gedung Muda/Madya/Utama (KKNI 7-9): load schedule (sizing MCB/MCCB/ACB, busbar, trafo, genset), lux level per SNI 16-7062 (kantor 300-500 lux, lobi 100-300, koridor 100-150, parkir 50-100), grounding (≤5Ω umum/≤1Ω data center), lightning protection SNI 03-7015 (finial/down conductor/earth termination/SPD), power quality (harmonisa, cos φ, capacitor bank); Ahli Telekomunikasi Gedung (MATV, CCTV IP/DVR/NVR, access control RFID/fingerprint, PABX/IP-PBX, PA, LAN Cat6/fiber) + Studi Kasus (MCB panel trip berulang — overload, MCB aus, kabel undersized, koneksi longgar); (4) Proteksi Kebakaran & Keselamatan Gedung — Teknisi Level 3-6 (pemasangan pipa sprinkler, head pendant/upright/sidewall/concealed, hydrant box, APAR, commissioning fire system, wiring MCFA); Ahli Proteksi Kebakaran Muda/Madya/Utama (KKNI 7-9): sprinkler NFPA 13/SNI 03-3989 (suhu aktivasi 68/79/93°C, kelas bahaya Light/OH/EH, coverage 9.3-18.6m²/head), hydrant (box/pilar/siamese, pompa jockey+main+diesel, reservoir Light 57m³/OH 114m³/EH 228m³), detektor asap (ionisasi: api flaming/partikel kecil vs fotoelektrik: smoldering/partikel besar; beam detector untuk area luas), detektor panas (fixed temperature vs rate of rise 8.3°C/mnt), MCFA, VEVA (gedung >4 lantai/>5000m²), pressurization tangga darurat SNI 03-6571 (ΔP 25-50Pa, pintu terbuka/tertutup), fire damper, gas suppression (FM200 7-9% aman manusia, CO2 34-40% asfiksia/ruang kosong, Novec 1230 ramah lingkungan), exit sign/emergency lighting (baterai 1.5 jam), fire door, assembly point 20m + Studi Kasus (false alarm MCFA berulang saat kebersihan — detektor fotoelektrik kotor/terganggu debu mesin poles); (5) Green Building, BAS & Sertifikasi — BAS/BMS Engineer (KKNI 5-8: BACnet/Modbus/KNX/DALI/LonWorks, DDC, EMS, integrasi HVAC/elektrikal/keamanan/fire); Ahli Green Building Muda/Madya/Utama (KKNI 7-9): Greenship GBCI 6 kategori (ASD/EEC/WAC/MRC/IHC/BEM, tingkat Certified 50/Silver 58/Gold 67/Platinum 76 poin), EDGE IFC (target 20% hemat energi+air+material, EDGE App), LEED USGBC (Certified 40/Silver 50/Gold 60/Platinum 80), OTTV SNI 03-6389 (formula: WWR×SC×SF + (1-WWR)×U_wall×ΔT, batas ≤35 W/m²); commissioning gedung (FPT per sistem, ASHRAE Guideline 0); lift (izin Disnaker, fire lift wajib >20m/7-8 lantai, perpanjangan tahunan); Pengkaji Teknis SLF terdaftar DJBK PUPR + Studi Kasus (gedung gagal Greenship Gold: 58 vs 67 poin — OTTV 38>35, tidak ada sub-metering/grey water/CO2 monitoring/commissioning — strategi mencapai 69 poin). HUB: triage 5 bidang + engine rekomendasi 5-tier. Color: #0D9488 (teal). Seed: `server/seed-skk-bangunan-gedung.ts`.

38. **SKK Coach — Konstruksi Khusus** (11 chatbots, slug `skk-konstruksi-khusus`, series 44) — Platform persiapan SKK bidang Konstruksi Khusus (Jembatan, Terowongan, Bendungan, Pelabuhan, Galian Dalam & Retrofitting), KKNI 2-9. 5 BigIdeas: (1) Konstruksi Jembatan — Juru Ukur/Surveyor Jembatan (KKNI 3-5): setting out, kontrol geometri, monitoring camber; Pelaksana Konstruksi Jembatan (KKNI 4-6): pondasi, pier, erection girder; Ahli Teknik Jembatan Muda/Madya/Utama (KKNI 7-9): analisis beban SNI 1725:2016 (BTR/BGT/BM truck 500kN, angin, gempa, rem 5%), jenis jembatan (simply supported/continuous/truss/arch/cable-stayed/suspension), metode erection (falsework/launching gantry/incremental launching/balance cantilever/strand jack), bearing (elastomeric, pot bearing FPB/sliding, expansion joint strip seal/modular/finger plate), Bridge Management System PUPR (nilai kondisi 0-5, inspeksi rutin/berkala/khusus, tindakan per kondisi) + Studi Kasus (girder PCI retak di zona transfer & jembatan BMS nilai 4 perlu rehabilitasi); (2) Konstruksi Terowongan — Operator TBM (KKNI 3-4): panel TBM (thrust/torque/penetration rate), erection segmen; Pelaksana Terowongan (KKNI 4-6): NATM drill-blast, rock bolt, shotcrete dry/wet, steel rib, konvergensi; Ahli Teknik Terowongan Muda/Madya/Utama (KKNI 7-9): metode (NATM/SCL, cut-and-cover, drill-and-blast, TBM-EPB, TBM-Slurry), klasifikasi batuan RMR (6 parameter: UCS/RQD/spasi/kondisi joint/air/orientasi; 5 kelas Very Good-Very Poor) & Q-system Barton (RQD/Jn × Jr/Ja × Jw/SRF; range 0.001-1000), support system (rock bolt: mechanical/grouted/Swellex; SFRS shotcrete; steel rib/lattice girder; precast segment beton fc'40-55MPa + annular grouting), face stability (Horn model, stabilitas number N>6 tidak stabil), konvergensi (threshold 0.3-1.0% diameter, volume loss ≤0.5-1.0%) + Studi Kasus (face collapse terowongan NATM di tanah pasir jenuh air — ground treatment, dewatering, ubah metode ke TBM-EPB); (3) Bendungan & Infrastruktur SDA — Operator Pintu Air/Pompa (KKNI 2-3); Pelaksana Bendungan (KKNI 4-6): timbunan zona, pemadatan, instrumentasi, grouting curtain; Ahli Teknik Bendungan/SDA Muda/Madya/Utama (KKNI 7-9): tipe bendungan (earthfill homogeneous/zoned, rockfill, CFRD face slab, gravity beton, arch, buttress), zona material (core/filter/transisi/shell/rip-rap), seepage analysis (Sherard filter criteria: D15 filter/D85 protected ≤4-5; SEEP/W), piping & internal erosion (suffusion → kegagalan cepat), spillway (ogee/chute/siphon/shaft + energy dissipator: stilling basin USBR Type I-IV, ski-jump), PMF & PMP, instrumentasi (piezometer vibrating wire, inclinometer, settlement plate, seismometer, ASDP), PP 37/2010 (RTD — Rencana Tindak Darurat, inspeksi, monitoring), irigasi (saluran primer/sekunder/tersier, efisiensi 0.65-0.72, bangunan bagi-bagi, Parshall flume) + Studi Kasus (peringatan piping bendungan — air keruh/kenaikan piezometer — aktivasi RTD, turunkan muka air, sandbag, investigasi permeabilitas); (4) Pelabuhan & Bangunan Pantai — Pelaksana Konstruksi Pelabuhan (KKNI 4-6): pemancangan tiang laut, tremie concrete, caisson, armor breakwater; Ahli Teknik Pelabuhan/Pantai Muda/Madya/Utama (KKNI 7-9): dermaga (wharf/pier/jetty/dolphin/pontoon), fender (rubber cylindrical/cell/pneumatic), bollard, breakwater rubble mound (Hudson formula: W=ρ_r×Hs³/(KD×(Sr-1)³×cotα), armor: tetrapod/accropode/Core-Loc) & vertical caisson, reklamasi (material/metode/settlement/Perpres 122/2012), analisis gelombang (hindcasting ERA5/ECMWF, SWAN, Hs signifikan, return period 25-500 tahun, shoaling/refraksi/difraksi), mooring analysis (gaya angin+arus+gelombang, breast/spring/bow lines, PIANC standards), sediment transport & shoreline management + Studi Kasus (breakwater rubble mound rusak Hs=3.8m vs desain 2.5m — Hudson formula: butuh batu 10.7 ton vs ada 4 ton — darurat geocontainer, desain ulang ke armor beton tetrapod); (5) Galian Dalam, Micropile & Perkuatan Struktur — Pelaksana Galian Dalam (KKNI 4-6): strutting/raker, ground anchor, dewatering (wellpoint/deep well), monitoring (inclinometer/load cell/settlement/piezometer), grouting, micropile; Ahli Teknik Struktur Khusus Muda/Madya/Utama (KKNI 7-9): sistem penahan galian (cantilever/strutted/anchored/diaphragm wall/sheet pile/soldier pile+lagging), dewatering bahaya settlement konsolidasi, micropile (Ø100-300mm, pressure grouting, underpinning, kapasitas 200-800kN), jet grouting (single/double/triple fluid, kolom Ø0.5-2.5m, cut-off wall), perkuatan eksisting (jacketing beton + angkur kimia, CFRP wrapping/strip epoxy, epoxy injection, post-tensioning eksternal), seismic retrofitting (shear wall, CBF/EBF brace, CFRP wrapping, base isolation dengan Lead Rubber Bearing/Triple Friction Pendulum — periode getar panjang, viscous/friction damper) + Studi Kasus (inclinometer galian 38mm > alert 25mm, gedung tetangga 5m settlement 18mm — berhenti excavasi, notifikasi gedung, tambah pre-load strut, percepat slab permanen). HUB: triage 5 bidang + engine rekomendasi 5-tier. Color: #4F46E5 (indigo). Seed: `server/seed-skk-konstruksi-khusus.ts`.

Seed script: `scripts/seed-new-series.ts` (idempotent per slug, Gemini 2.5 Flash thinkingBudget=0 untuk konten, COMMIT per series). Semua agen baru sudah diisi 7 field Kebijakan Agen (brand voice/interaction/quality/risk pakai template KONSTRUKSI; primary_outcome/win_conditions/domain_charter/quality_bar_extra di-generate per agen).

Sebelumnya — 5 kategori asli:

### Kategori 1: Regulasi & Perizinan (`regulasi-perizinan`)
1. **Regulasi Jasa Konstruksi** (25 chatbots) — Perizinan Usaha (7), SBU (4), SKK (5), Tender & Pengadaan (4), + Hubs. Seed: `server/seed-regulasi.ts`
2. **Pembinaan Anggota ASPEKINDO — Kontraktor** (9 chatbots) — Perizinan & Legalitas OSS-RBA, Sertifikasi & Pengembangan Usaha, + Hubs. Seed: `server/seed-aspekindo.ts`. Berbasis e-book MasterClass "ANTI-TOLAK". Konsep kunci: "Anti-Tolak" (perizinan), "Anti-Gugur" (tender), Tiga Pilar Validasi, Error Map E01-E16, Blueprint PUB-ASPEKINDO 5 Fase.

### Kategori 2: Sertifikasi Badan Usaha (`sertifikasi-badan-usaha`)
3. **Kompetensi Teknis Kontraktor & Konsultan** (9 chatbots) — Kontraktor: Klasifikasi SBU Navigator (73 subklasifikasi), Persyaratan Teknis per Kualifikasi. Konsultan: Klasifikasi SBU Navigator (28 subklasifikasi), Ketenagalistrikan & IUJPTL. Seed: `server/seed-kompetensi-teknis.ts`
4. **Manajemen LSBU — Lembaga Sertifikasi Badan Usaha** (9 chatbots) — Akreditasi & Tata Kelola, Proses Sertifikasi SBU, + Hubs. Seed: `server/seed-manajemen-lsbu.ts`

### Kategori 3: Sertifikasi Profesi & SDM (`sertifikasi-profesi`)
5. **Siap Uji Kompetensi SKK** (10 chatbots kerangka, expandable) — 1 Hub Utama + 9 Hub Bidang Klasifikasi: Sipil (160+ jabatan), Arsitektur, Energi/Ketenagalistrikan/Pertambangan (1.700+ jabatan SKTTK), Sains & Rekayasa Teknik (BIM), Mekanikal (81 jabatan), Manajemen Pelaksanaan (18 jabatan), Pengembangan Wilayah & Kota (5 jabatan), Arsitek Lanskap/Desain Interior/Iluminasi (13 jabatan), Tata Lingkungan (28 jabatan). Seed: `server/seed-siap-ukom.ts`
6. **CIVILPRO — Professional Mentoring Sipil** (12 chatbots) — Skema & Navigasi SKK, Competency Prep & Mentoring, Operational Problem Solver, + Hubs. Seed: `server/seed-civilpro.ts`
7. **Manajemen LSP — Lembaga Sertifikasi Profesi** (9 chatbots) — Lisensi & Tata Kelola, Proses Sertifikasi SKK, + Hubs. Seed: `server/seed-manajemen-lsp.ts`
8. **Asesor Sertifikasi Konstruksi** (11 chatbots) — Asesor Badan Usaha/LSBU (4), Asesor Kompetensi/LSP (4), + Hubs. Seed: `server/seed-asesor.ts`

### Kategori 4: Sistem Manajemen & Compliance (`sistem-manajemen`)
9. **ISO 9001 — Sistem Manajemen Mutu Konstruksi** (9 chatbots) — Readiness & Implementasi, Audit & Kinerja Mutu, + Hubs. Seed: `server/seed-iso9001.ts`
10. **ISO 14001 — Sistem Manajemen Lingkungan Konstruksi** (9 chatbots) — Readiness & Implementasi, Audit & Kepatuhan, + Hubs. Seed: `server/seed-iso14001.ts`
11. **SMAP & PANCEK** (11 chatbots) — SMAP/ISO 37001 (4), PANCEK Anti Korupsi (4), + Hubs. Seed: `server/seed-smap-pancek.ts`
12. **CSMAS Contractor Safety** (12 chatbots) — Safety Assessment, HSE Planning & Risk, Safety Performance & Governance, + Hubs. Seed: `server/seed-csmas.ts`

### Kategori 5: Digitalisasi & Operasional (`digitalisasi`)
13. **Odoo untuk Jasa Konstruksi** (12 chatbots) — Readiness & Assessment, Blueprint & Implementation, Governance & Control, + Hubs. Seed: `server/seed-odoo.ts`
14. **SIP-PJBU — Sistem Informasi Pembinaan PJBU** (9 chatbots) — PJBU-Kontraktor, PJBU-Konsultan, + Hubs. Seed: `server/seed-sip-pjbu.ts`

A key feature is "Project Brain," providing contextual data for chatbots, enabling specialized "Mini Apps" for tasks like project snapshots, decision summaries, and risk assessments. A **Deliverables** panel lets builders define which output types each agent produces, using 12 deliverable types across 4 categories (conversation, mentoring, project ops, formal documents), 4 pre-built bundles (Mentor, Solve, Project Update, Client Update), auto-defaults per behavior preset, 10 playbook presets, an Output Contract view per deliverable type, and a **Tombol di Chat** section previewing the quick-action chat buttons + copyable prompt text for each active deliverable. New agent columns: `deliverables` (jsonb array of enabled type keys) and `deliverableBundle` (text, active bundle name). The platform integrates with Mayar.id for subscription management and provides public chat pages for individual bots and multi-chatbot modules. Dynamic PWA manifests are supported for individual chatbots.

**Notion Integration** (via Replit Connectors): Two-way Notion sync. Builders can (1) search and import Notion pages directly into an agent's Knowledge Base as text items with layer selection (foundational/operational/case_memory), and (2) export Mini App AI analysis results to a new Notion sub-page under any accessible parent page. Backend: `server/notion.ts` uses `@replit/connectors-sdk` ReplitConnectors proxy. Routes: `POST /api/notion/search`, `GET /api/notion/pages`, `GET /api/notion/page/:pageId/content`, `POST /api/notion/export`.

Core features include a RAG toggle for controlling knowledge base lookups, "Project Context" for personalizing conversations via user-provided information, and a "User Memory System" allowing chatbots to recall facts across sessions. Monetization is handled via per-Modul bundle pricing and per-Chatbot individual pricing, with guest message limits, trial periods, registered user quotas, and a voucher system protected by server-side enforcement. A "Conversion Layer" transforms chatbots into revenue engines through lead capture, scoring, and smart CTA triggers.

### Audit Struktural (Apr 2026)
Audit menyeluruh seluruh fitur dilakukan. Temuan & perbaikan:
1. **`voice_messages` table** — Export schema sebelumnya bernama `messages` (konflik nama). Diubah menjadi `voiceMessages` dan semua file yang mengimportnya (`server/replit_integrations/chat/storage.ts`) diperbarui.
2. **User Memory Management UI** — `MemoryManager` component ditambahkan ke `agentic-ai-panel.tsx`. Memungkinkan builder melihat, menghapus satu per satu, atau menghapus semua memori AI per chatbot. Routes sudah ada (`GET/DELETE /api/memories/:agentId`).
3. **Analytics endpoint auth** — `GET /api/analytics/:agentId/summary` ditambah `isAuthenticated` middleware agar data analitik tidak terbuka untuk publik.
4. **Semua fitur lain dinyatakan fungsional**: Core hierarchy, Chat/RAG, Project Brain, Tender Wizard, Notion, Broadcast WA, Conversion/Leads, Affiliates, Vouchers, Widget embed, Analytics, Mini Apps, Mayar payment, WhatsApp/Telegram via Fonnte.
5. Dua subscription tables bersifat **berbeda dan keduanya dibutuhkan**: `subscriptions_new` untuk builder (chatbot limit), `client_subscriptions` untuk end-user (per-agent access).

### Feature Synchronization (Agentic Integration Layer)
All major features are synchronized into a unified agentic intelligence loop:
- **Chat ↔ Project Brain (bidirectional)**: Chatbot reads Project Brain as context AND can automatically update Project Brain fields during conversation using `[UPDATE_BRAIN:key]value[/UPDATE_BRAIN]` tags. Works in both streaming and non-streaming chat endpoints.
- **Tender Wizard ↔ Knowledge Base**: Both `/api/ai/tender-wizard` and `/api/ai/tender-doc` now automatically fetch relevant KB content (via RAG search) and active Project Brain data, injecting them into the AI analysis for richer, company-specific outputs. Frontend passes `agentId` via URL query param (`?agentId=...`) or request body.
- **External Channels (Telegram/WhatsApp) ↔ Project Brain**: The `generateAIResponse` function for external integrations now also injects the active Project Brain context.
- **Agentic AI Principles**: All chat endpoints include "PRINSIP AGENTIC AI" system instructions: attentive listening, implicit need detection, proactive suggestions, and consistency checking.
- **Kebijakan Agen → System Prompt (Apr 2026)**: Helper `buildFinalSystemPrompt(agent)` di `server/routes.ts` menggabungkan persona (systemPrompt + tagline + philosophy + personality + communicationStyle + toneOfVoice) dengan 7 field Kebijakan Agen ke satu prompt terstruktur dengan section header (`PERSONA`, `BRAND VOICE`, `INTERACTION RULES`, `DOMAIN BOUNDARIES`, `QUALITY STANDARDS`, `COMPLIANCE & RISK`). Field yang disuntikkan: `brandVoiceSpec`, `reasoningPolicy`, `interactionPolicy`, `domainCharter`, `qualityBar`, `riskCompliance`, `executionGatePolicy`. Helper dipakai di SEMUA chat endpoint: non-streaming `/api/messages`, streaming `/api/chat/stream`, dan `generateAIResponse` (Telegram/WhatsApp). Helper kedua `logFinalPromptIfDebug(agentId, systemPrompt, channel)` dipanggil tepat sebelum `chatMessages` diserahkan ke model di ketiga endpoint, sehingga jika env `DEBUG_PROMPT=true` di-set, log mencerminkan prompt FINAL (sudah termasuk Knowledge Base + Project Brain + memori + mode instruction). Default OFF supaya konteks sensitif tidak ter-log di produksi.
- **Pratinjau Prompt AI di Dashboard (Apr 2026)**: Endpoint `GET /api/agents/:id/preview-prompt` (auth + ownership check via `userId` agen, admin bypass via `ADMIN_USER_IDS`) memanggil `buildFinalSystemPrompt` dan mengembalikan `{ prompt, length }`. Tombol "Pratinjau Prompt AI" di header card "Kebijakan Agen" (`client/src/components/panels/persona-panel.tsx`) membuka modal yang men-split prompt FINAL ke section berwarna (PERSONA biru, PRIMARY OUTCOME emerald, WIN CONDITIONS teal, BRAND VOICE violet, INTERACTION RULES indigo, DOMAIN BOUNDARIES amber, QUALITY STANDARDS cyan, COMPLIANCE & RISK red) dengan tombol salin (copy-to-clipboard) untuk debugging eksternal. Builder tidak perlu lagi menyalakan `DEBUG_PROMPT=true` di server hanya untuk mengecek hasil suntikan Kebijakan Agen.

### Integration Protocols (Cross-Bot Consistency)
- **SUMMARY_RULEBOOK v1**: Enforced across all 83 chatbots. Rules for interpreting *_SUMMARY v1 data: NO DOWNGRADE (risk can only stay or rise), UNKNOWN HANDLING (max +1 level), EXPIRED/INVALID RULE (minimum Tinggi), DATA CONSISTENCY (mismatch = minimum Tinggi).
- **RISK_AGGREGATION_RULE v1**: Applied to TRC and ECSG only. When combining multiple summaries, FINAL_RISK_LEVEL = highest risk across all domains.
- **SUMMARY_GENERATOR_MODE**: Applied to all 16 specialist bots. After analysis, bots offer to convert raw data into standardized *_SUMMARY v1 format for cross-bot use.
- **Summary Protocols**: SKK_SUMMARY, SBU_SUMMARY, LICENSING_SUMMARY, TENDER_REQ_SUMMARY — standardized text-based integration format for data portability between chatbots.

### Feature Sync & Integration Update (Apr 2026 — v2)

#### Custom Domain Management
- **Schema**: `customDomains` table — `id, userId, agentId, domain, status (pending/active/failed), verifiedAt, createdAt, updatedAt`
- **Backend routes**: `GET/POST /api/domains`, `PATCH /api/domains/:id`, `DELETE /api/domains/:id`, `POST /api/domains/:id/verify` (CNAME DNS lookup), `GET /api/domains/resolve?domain=xxx` (public, returns agentId for active custom domain)
- **Custom Domain Middleware**: On every non-API/non-asset request, server checks `Host` header against active custom domains → auto-redirects to `/chat/:agentId`
- **Frontend**: `/domains` page — full CRUD with DNS CNAME instruction table, verify button, status badge, **edit agent link** dialog, **embed code** dialog (iframe + floating widget script snippet)
- **Dashboard sidebar**: "Manajemen Domain" link with green badge showing active domain count. Quick stats panel on home screen shows 4 metrics (Alat Bantu, Modul, Domain Aktif, Series)

#### Expanded Knowledge Base Upload Types
- **New KB types**: `youtube`, `cloud_drive`, `video`, `audio` (added to state and Select dropdown)
- **Auto-processing**: KB POST route detects type → calls appropriate extraction:
  - `youtube`: `extractYouTubeContent(url)` — fetches YT transcript via `youtube-transcript` lib
  - `cloud_drive`: `extractCloudDriveContent(url)` — downloads from Google Drive/OneDrive/SharePoint, extracts text
  - `video`: `extractVideoContent(filePath)` — ffmpeg audio extraction + speech-to-text
  - `audio`: `speechToText(audioBuffer)` — direct transcription
- **Upload route**: Extended multer fileTypeMap to include `.mp4/.webm/.mov` → `video_*` and `.mp3/.wav/.m4a/.aac` → `audio_*` fileType labels
- **New route**: `POST /api/knowledge-base/process-url` — on-demand extract for youtube/cloud_drive before saving
- **UI improvements**: Type-specific icons (Youtube=red, Cloud=sky, Video=purple, Audio=orange), per-type processing badge labels ("Mengambil transkrip...", "Mengunduh file...", etc.), "chunks RAG" badge in emerald green, file upload UI for video/audio with helpful description

#### Knowledge Base Hierarchy + Versioning + Source Attribution (Apr 2026)
Pondasi infrastruktur untuk perpustakaan klausul kontrak/regulasi (produk "Open Clause") + sumber primer wajib di setiap KB.
- **Tabel baru `knowledge_taxonomy`** (`shared/schema.ts`): self-referencing tree id/parent_id/name/slug/level (`sektor`/`subsektor`/`topik`/`klausul`)/description/sort_order/is_active. 4 level hierarki untuk klasifikasi KB lintas 8 sektor profesi user (Legalitas, Perijinan, SBU, SKK, Tender, Pelaksanaan, Tata Kelola, Sistem Manajemen).
- **Extend tabel `knowledge_bases`** dengan kolom: `taxonomy_id` (FK nullable), `source_url`, `source_authority` (PUPR/LKPP/DJP/BNSP/LPJK/BSN/DJBC/Kemnaker/BPJS_Ketenagakerjaan/JDIH/internal/lainnya), `effective_date`, `superseded_by_id` (self-FK utk version chain), `status` (active/superseded/draft default 'active'), `is_shared` (default false), `shared_scope` (series/global). Semua nullable — backward-compat KB existing.
- **Endpoints baru** (`server/routes.ts`): `GET/POST/PATCH/DELETE /api/taxonomy`, `GET /api/taxonomy/:id/knowledge-bases`, `GET /api/knowledge-base/:id/versions` (predecessor + successor chain), `POST /api/knowledge-base/:id/supersede` (cycle detection di db-storage).
- **Storage** (`server/db-storage.ts`): impl lengkap di DbStorage dgn helper `mapTaxonomyRow` & `mapKBRow`, predecessor+successor chain di `getKBVersionHistory`, cegah hapus parent yg punya anak. MemStorage diberi stub minimal (fitur ini DB-only).
- **Seed** (`scripts/seed-knowledge-taxonomy.ts`): 8 sektor + 32 subsektor inti, idempotent by slug per parent. Sudah dijalankan — verified 8 root + 32 children di DB.
- **UI** (`client/src/components/panels/knowledge-base-panel.tsx`): sub-komponen `TaxonomyAndSourceFields` di dialog tambah KB — dropdown cascade Sektor→Subsektor, select Sumber Resmi, date picker Tanggal Berlaku, input URL Sumber, toggle "Bagikan ke agen lain". Badge baru di list KB: status "Dicabut"/"Draft" (rose/slate) + chip otoritas sumber (amber). Hook baru `client/src/hooks/use-taxonomy.ts`.
- **RAG injection** (`server/lib/rag-service.ts`): `searchKnowledgeBase` menerima `kbMetadata?: Map<number, KnowledgeBase>` opsional. Saat Map tersedia: (a) chunks dari KB `status='superseded'` di-FILTER sehingga tidak muncul lagi di context — backward compat, KB tanpa metadata tetap di-include; (b) header chunk berisi atribusi `[Sumber Resmi: PUPR | Berlaku: 2024-01-15 | URL: ...]` agar agen menyitir Pasal/PerLem/UU dengan tepat. Diaktifkan di chat handler non-stream (`/api/messages`) & stream (`/api/chat/stream`).
- **Migration safety**: schema push via `npx drizzle-kit push` SUKSES tanpa data loss; semua kolom baru nullable/default sehingga 1 KB existing (sebelum perubahan) tetap valid dan otomatis status='active'.

### Feature Sync & Landing Page Update (Apr 2026 — v3)

#### Helpdesk System Prompt v3 (`server/seed-knowledge-base.ts`)
- Interactive/akrab tone (bukan formal), persona Gustafta Helpdesk Assistant v3
- Methodology: AGENTIC + MULTI-AGENT + OPENCLAW (INPUT→CONTEXT GRAB→MULTI-LAYER REASON→TOOL INVOKE→SYNTHESIZE→LOOP)
- Full 5-level hierarchy docs: Series(L1) → Core(L2) → Big Idea/Orkestrator(L3) → Toolbox(L4) → Agent(L5)
- KB 7 tipe, Custom Domain guide, bank transfer payment info (BCA/Mandiri/BRI)
- contextRetention:20, temperature:0.75, 5 updated conversation starters

#### Landing Page Sync (`client/src/pages/landing.tsx`)
- **Hero**: Badge "Baru: Custom Domain · KB YouTube/Video/Audio · Hierarki 5 Level", deskripsi baru mencantumkan full 5-level path
- **Tombol**: "Lihat Series & Packs" (sebelumnya "Tender LPSE Assistant")
- **Features array**: Hierarki 5 Level + Custom Domain + Agentic AI+OpenClaw + KB 7 Tipe
- **Advanced Features**: Multi-Model AI (GPT-4o/4o-mini/Claude), Widget & Embed Kustom, Access Control, API & Integrasi Kustom
- **New section**: "Custom Domain + Hierarki 5 Level Highlight" — dua kartu detail Custom Domain dan Hierarki 5 Level dengan bullet + CTA buttons
- **Comparison table**: 9 baris termasuk Custom Domain, KB types, Tender Wizard
- **FAQ**: 9 item mencakup Custom Domain & KB types
- **Footer**: "Series & Packs" + link Custom Domain

#### Hierarchy Naming Finalized
- L1: Series (payung ekosistem strategis)
- L2: Core (modul tematik dalam Series)
- L3: Big Idea / Orkestrator (hub routing cerdas — menerima query user & mendelegasikan ke Toolbox)
- L4: Toolbox (chatbot spesialis per area kerja)
- L5: Agent (unit tugas mikro spesifik)

### Feature Sync & Terminology Cleanup (Apr 2026 — v4)

#### AI Big Idea Generator (NEW)
- **Backend**: `POST /api/ai/generate-big-ideas` — accepts `{topic, referenceText, urls, seriesId}`, calls OpenAI gpt-4o with JSON response_format, returns array of up to 5 Big Idea suggestions each with `{name, type, description, goals[], targetAudience, reasoning, expectedOutcome}`
- **Frontend**: `client/src/components/dialogs/generate-big-ideas-dialog.tsx` — 2-step dialog: Step 1 input (topic + reference text + URLs), Step 2 review & select suggestions with checkbox + bulk create via `useCreateBigIdea` hook
- **Dashboard integration**: "✨ Generate dari Referensi" button in Big Idea sidebar section, `generateBigIdeasOpen` state, dialog rendered with `activeSeriesId` prop

#### Bugfix: pdf-parse CJS Module Loading
- `pdf-parse` adalah CJS module — tidak memiliki named export `default` maupun `PDFParse` yang bisa dipanggil langsung di ESM context
- Semua pendekatan dynamic import (`(await import(...)).default`, `.PDFParse`) gagal di ESM Node.js
- **Solusi final**: gunakan `createRequire` dari Node built-in `"module"` untuk load CJS module di ESM context:
  - `import { createRequire } from "module";` (static import)
  - `const _require = createRequire(import.meta.url);` (setelah semua import)
  - `const pdfParse = _require("pdf-parse");` (typed sebagai `(buffer: Buffer) => Promise<{text: string}>`)
- Diperbaiki di dua endpoint: `POST /api/ai/tender-extract` dan `POST /api/ai/extract-file-text`
- **Production build fix**: `script/build.ts` ditambah `define: { "import.meta.url": "__filename" }` di esbuild config sehingga `createRequire(import.meta.url)` di-compile menjadi `createRequire(__filename)` di CJS bundle, yang valid di Node.js production runtime
- **v2 API fix**: pdf-parse v2.4.5 tidak lagi ekspor wrapper function — API baru gunakan `new PDFParse({ data: buffer, verbosity: VerbosityLevel.ERRORS })` lalu `await parser.getText()` yang return `{ pages: [{text, num}] }`. Dibungkus dalam helper `parsePdfBuffer(buffer)` yang dipakai di kedua endpoint

#### File Upload di Generate Big Idea (NEW)
- **Backend**: `POST /api/ai/extract-file-text` — multer memoryStorage, max 5MB, accept PDF/DOCX/TXT. Ekstrak teks via `pdf-parse` (PDF) / `mammoth` (DOCX) / plain buffer (TXT). Returns `{text, filename, charCount}`. Multer error di-wrap ke `{error: ...}` JSON (413 untuk oversize, 400 untuk format invalid, 422 untuk file tak terbaca/terenkripsi).
- **Frontend**: Section "Upload File Referensi" di `generate-big-ideas-dialog.tsx` — posisi di bawah Teks Referensi, di atas URL Referensi. Click-to-upload area bergaya dropzone, loading spinner saat ekstraksi, success card (nama file + ukuran + jumlah karakter), tombol hapus. Teks yang diekstrak di-append ke textarea referenceText dengan separator jika sudah ada isi. Generate button disabled selama ekstraksi berlangsung.

#### Terminology Cleanup (Hierarchy Labels)
All remaining old L1/L2/L3 labels (Tujuan/Modul/Chatbot/Alat Bantu) eliminated from:
- `edit-big-idea-dialog.tsx` & `create-big-idea-dialog.tsx`: Series selector label fixed (Tujuan→Series, Tanpa Tujuan→Tanpa Series)
- `documentation.tsx`: Full hierarchy section rewritten — 5 level cards (L1 Series, L2 Core, L3 Big Idea/Orkestrator, L4 Toolbox, L5 Agent), updated step-by-step guide, Orkestrator section, example hierarchy, and header subtitle
- `server/routes.ts`: Error message "Tujuan ini sudah memiliki Chatbot Orkestrator" → "Series ini sudah memiliki Chatbot Orkestrator"
- NOTE: "Tujuan" retained where it means "goals/objectives" (not L1 hierarchy) — e.g., Tujuan Konversi, Tujuan KPI, goals list in Big Idea form

### Roadmap Ekspansi Series (Belum Diimplementasi)

Arah pengembangan ke depan — setiap bidang/klasifikasi menjadi series tersendiri karena potensi ribuan chatbot:

**Siap Uji Kompetensi (pecahan dari "Siap Uji Kompetensi SKK"):**
- CIVILPRO (Sipil), Arsitek Pro, Mekanikal Pro, Elektrikal Pro, Rekayasa Pro, Tata Lingkungan Pro, Arsitek Lanskap Pro, PWK Pro, Manajemen Pro

**Siap Audit KBLI Kontraktor (pecahan dari "Kompetensi Teknis"):**
- Kontraktor Gedung, Sipil, Instalasi, Konstruksi Khusus, Pra Pabrikasi, Finishing, Persiapan

**Siap Audit Konsultan:**
- Arsitek, Rekayasa, Rekayasa Terpadu, Arsitektur Lanskap, Konsultansi Ilmiah & Teknis, Pengujian & Analisis Teknis

**Siap Audit Kontraktor Terintegrasi:**
- Terintegrasi Bangunan Gedung, Terintegrasi Bangunan Sipil

**Siap Tender** — (detail TBD)

**Siap Bisnis Konstruksi** — (detail TBD)

Pasar potensial: konstruksi, ketenagalistrikan, energi baru & terbarukan, mineral & pertambangan, migas, lingkungan, K3/Safety.

Catatan arsitektur untuk skala ribuan chatbot:
- Chatbot dibuat via dashboard/API, bukan seed file statis
- Template chatbot per kategori — individual di-generate dari template + data spesifik
- Pagination & lazy loading di semua API
- Index database untuk pencarian cepat

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS with CSS variables
- **UI Components**: shadcn/ui
- **Build Tool**: Vite

The frontend uses a feature-based organization, custom React hooks for data fetching, and optimistic updates. It supports light/dark mode theming and includes a mobile-first floating chat widget.

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Runtime**: Node.js with `tsx`
- **API Style**: RESTful JSON API
- **Build**: esbuild

The server manages CRUD operations for agents, knowledge bases, integrations, message storage, and user authentication. It supports webhook integrations and intelligent file processing for various document types, including image analysis via GPT-4o vision, document text extraction, and video/YouTube transcript fetching.

### Data Storage
- **ORM**: Drizzle ORM with Zod validation
- **Database**: PostgreSQL (with in-memory fallback for development)
- **Session Store**: connect-pg-simple

The schema enforces a hierarchical structure (`series` -> `bigIdeas` -> `toolboxes` -> `agents`) and includes tables for agents, knowledge bases, integrations, messages, users, analytics, monetization, project brain templates/instances, mini-apps, client subscriptions, affiliates, leads, and scoring results.

### Design Patterns
- **Two-Panel Layout**: Left navigation for global context, right panel for selected content.
- **Active Agent Context**: UI content adapts dynamically based on the selected chatbot agent.
- **Optimistic Updates**: For a responsive user experience during data mutations.
- **Theme System**: CSS custom properties for light/dark mode.
- **Context API**: Manages active `Big Idea` and `Toolbox` context.
- **Streaming Chat**: Real-time AI responses using Server-Sent Events (SSE).
- **Project Brain**: Structured template and instance data for contextual chatbot interactions with anti-prompt injection.
- **Mini Apps**: Configuration-driven, AI-powered applications leveraging Project Brain data for specialized outputs (e.g., project snapshots, risk radars, scoring assessments).
- **Chatbot Series**: Groups multiple Big Ideas into structured topic packages with public catalog and detail pages.
- **Conversion Layer**: Revenue-oriented system enabling lead capture, scoring/assessment, and CTA triggers within chatbots.

### UI/UX Decisions
- Inspired by a two-panel dashboard design.
- Mobile-first approach for the chat widget.
- Professional templates for various industries.
- Dynamic widget embed system.
- Multi-sector landing pages with tailored content.
- **Rangkuman Chatbot (Chatbot Summary Export)**: Auto-generates comprehensive chatbot data summaries for external landing page creation (Markdown, HTML export).
- **Brief Marketing (Marketing Brief Export)**: Auto-generates marketing briefs from chatbot data for ad copy and marketing materials (Markdown, HTML export), including Meta Pixel ID integration.

## External Dependencies

### UI Libraries
- Radix UI primitives
- Lucide React icons
- React Icons
- Embla Carousel
- React Day Picker
- cmdk
- Vaul

### Data & Validation
- Zod
- drizzle-zod
- TanStack React Query

### Database
- PostgreSQL (`pg` driver)
- Drizzle ORM
- drizzle-kit

### Development Tools
- Vite
- TypeScript
- PostCSS

### Stability Notes
- **SIGHUP handler**: `server/index.ts` ignores SIGHUP to prevent Replit workflow from killing the process during file changes.
- **Global error handlers**: `unhandledRejection` and `uncaughtException` are caught and logged (never crash silently).
- **Health endpoint**: `GET /health` returns 200 immediately for fast deployment healthchecks.
- **Seed operations**: Skipped in production (`NODE_ENV=production`). In development, seeds run inside `listen` callback with individual try/catch.
- **isActive defaults**: Schema defaults to `true` for bigIdeas, toolboxes, and agents. No bulk reset patterns — `createAgent/Toolbox/BigIdea` and `setActive*` never reset other records.
- **OpenAI baseURL validation**: Only used if value starts with `http` (prevents API keys from being used as URLs).
- **Model**: Integration chat uses `gpt-4o-mini` (not `gpt-5.1`).
- **API key guard**: Both streaming and non-streaming chat endpoints check for valid API key before calling OpenAI.

### SaaS Pack System (Tender LPSE Assistant)
The platform includes a **Domain Solution Pack** system for selling domain-specific AI wizard workflows as add-ons to the core engine.

**Pack Marketplace** (`/packs`): Grid of available + coming-soon packs. Accessible via `/packs` route and linked from dashboard sidebar ("Paket Domain" button) and landing page footer.

**Tender LPSE Pack** (2 packs, both available):
1. `tender-pelaksana` — Pelaksana Konstruksi (gedung/jalan/jembatan)
2. `tender-konsultansi` — Konsultansi Manajemen Konstruksi (MK)

**Wizard** (`/packs/:packId`): 7-step guided wizard for tender document prep:
- Step 0: Output selector (checklist, risk review, draft docs)
- Step 1: Company Profile (reusable entity — create once, use across tenders)
- Step 2: Data Tender (package name, institution, location, deadline, HPS, qualification)
- Step 3: Persyaratan (copy-paste requirements from tender documents)
- Step 4: Strategi Teknis (execution method, SMKK plan, risks)
- Step 5: Kepatuhan Perpres 46/2025 (conflict of interest, blacklist, anti-bribery)
- Step 6: Results — Scoring dashboard (0–100), Checklist table with A1/B1/C1 codes, Red/Yellow/Green risk cards, Draft document viewer with copy button

**Schema tables added**: `company_profiles` (reusable vendor entity per user), `tender_sessions` (per-tender wizard runs with all step data + AI-generated outputs)

**Backend**:
- `GET/POST/PATCH/DELETE /api/company-profiles` — CRUD company profiles
- `GET/POST/PATCH/DELETE /api/tender-sessions` — CRUD tender sessions
- `POST /api/ai/tender-wizard` — GPT-4o powered, JSON output: scoreKelengkapan, scoreTeknis, checklist[], riskReview[], drafts{}

**Checklist scoring (Pelaksana)**:
- Administrasi: 30%, Kualifikasi: 30%, Teknis: 20%, SMKK/K3: 10%, Kepatuhan Perpres 46/2025: 10%

**Checklist scoring (Konsultansi MK)**:
- Administrasi: 20%, Kualifikasi: 25%, Teknis: 35%, SMKK pendampingan: 10%, Kepatuhan: 10%

**Coming Soon packs**: Perizinan & Sertifikasi, SMAP + Pancek KPK, SMKK, Laporan Tahunan BUJK

### Integrations
- OpenAI (GPT-4o, GPT-3.5)
- DeepSeek
- Claude
- Fonnte (WhatsApp)
- Transfer Bank Manual (BCA/Mandiri/BRI — konfirmasi via WhatsApp, tanpa payment gateway)
- Replit Auth (OAuth/OIDC)

### Kebijakan Agen Lengkap — Apr 2026
Semua **184 chatbot di 15 series** kini memiliki 7 field **Kebijakan Agen** terisi penuh: `primary_outcome`, `conversation_win_conditions`, `brand_voice_spec`, `interaction_policy`, `domain_charter`, `quality_bar`, `risk_compliance`.
- **Brand voice & risk compliance**: per-series template (regulasi/sertifikasi-bu/sertifikasi-profesi/sistem-manajemen/digitalisasi) untuk konsistensi nada & disclaimer hukum
- **Outcome/win/charter/quality-extra**: di-generate per-agent via Gemini 2.5 Flash dengan structured JSON output (kontekstual: nama, series, toolbox, deskripsi, hub/spesialis)
- Skrip: `scripts/fill-policies-all-series.ts` (batch concurrency 3, tolerant JSON parsing) + `scripts/fill-policies-stuck.ts` (sequential retry untuk agent susah dengan respons array/inkonsisten)
- Hasil: outcome bervariasi (lead_capture/user_education/product_trial), domain_charter punya larangan eksplisit per peran chatbot, quality_bar diperluas dengan 1 kalimat khas per agent
- **Audit verifikasi**: lihat `docs/audit/policy-fields-audit-2026-04-24.txt` — per-series count agen dengan field kosong = **0 di semua 15 series**, total 184 agen, 0 dengan any-empty-field

### Audit Lanjutan Apr 2026 — Field Lengkap Semua Agen & Alat Bantu
Pelengkapan lebih lanjut atas semua field teks yang sebelumnya kosong:
- **Agen (205 total termasuk 21 orphan)**: `philosophy`, `off_topic_response`, `expertise` kini terisi penuh.
  - `off_topic_response`: template per-kategori (regulasi/sertifikasi-bu/sertifikasi-profesi/sistem-manajemen/digitalisasi/umum) — sapaan Bapak/Ibu, mengarahkan kembali ke fokus
  - `philosophy` & `expertise`: di-generate per-agen via Gemini 2.5 Flash JSON (kontekstual)
  - 21 agen orphan (tanpa series link) diisi 7 field policy dengan template "umum" + dipertahankan sebagai entitas
- **Alat Bantu / Toolboxes (196 total)**: `purpose`, `capabilities`, `limitations` kini terisi penuh.
  - Sebelumnya: 34 purpose kosong, 78 capabilities kosong, 86 limitations kosong
  - Di-generate per-toolbox via Gemini (3-5 capability + 3-5 limitation per modul, masing-masing 5-12 kata)
- Skrip: `scripts/fill-remaining-fields.ts` (mendukung STEP=1|2|3, LIMIT, CONCURRENCY env vars untuk batching)
- **Audit v2**: `docs/audit/policy-fields-audit-2026-04-24-v2.txt` — semua kolom empty_* = 0, total 205 agen + 196 toolboxes, 0 any-empty

### Audit Apr 2026 — Mayar.id Removal + Hierarchy Edit/Delete
- **Mayar.id dihapus sepenuhnya**: Import `createPaymentLink`/`parseWebhookPayload` dihapus, webhook handler dihapus, field `mayarOrderId`/`mayarPaymentUrl` tidak lagi digunakan. Diganti sistem transfer bank konvensional: backend mengembalikan rekening bank + nomor WA konfirmasi saat berlangganan.
- **Hierarchy Edit/Delete UI**:
  - **Series (Tujuan)**: Tombol Pencil (edit nama/deskripsi) + Trash2 (delete confirm) muncul saat hover di sidebar.
  - **Agent (Alat Bantu — Orkestrator & Regular)**: Tombol Pencil (edit cepat nama/deskripsi) + Trash2 muncul saat hover, menggantikan single Trash2 sebelumnya.
  - Mutations: `updateSeriesMutation` (PATCH /api/series/:id), `deleteSeriesMutation` (DELETE /api/series/:id), `updateAgentMutation` (PATCH /api/agents/:id) — semua sudah ada endpoint-nya di backend.
- **Subscription flow**: Paket berbayar → status "pending" → tampilkan instruksi transfer bank di pricing.tsx (step 2 dialog) dan subscription.tsx. Free trial tetap langsung "active".
### Test Suite — Kebijakan Agen (Apr 2026, Task #6)
Folder `tests/` berisi tes regresi ringan untuk memastikan helper `buildFinalSystemPrompt(agent)` di `server/lib/build-final-system-prompt.ts` tidak hilang saat refactor. Project belum pakai vitest/jest; runner pakai `node:test` builtin via tsx.
- **Cara menjalankan**: `npx tsx tests/run.ts` (exit code non-zero kalau ada test fail)
- **`tests/build-final-system-prompt.test.ts`** — unit test: section header lengkap saat 7 field terisi, section di-skip saat field kosong/whitespace, instruksi penolakan domain ada saat `domainCharter` diisi, kombinasi reasoning+interaction & risk+executionGate, fallback persona ke nama agen
- **`tests/routes-helper-usage.test.ts`** — integrasi grep: import helper ada, minimal 3 panggilan `buildFinalSystemPrompt(agent)` di routes.ts, dan handler `POST /api/messages`, `POST /api/messages/stream`, serta fungsi `generateAIResponse` (Telegram/WhatsApp) masing-masing tetap memanggil helper. Kalau ada yang menghapus pemanggilan helper, test akan gagal.

### Tender Document Catalog (Perpres 46/2025) (Apr 2026)
Katalog referensi 37 jenis dokumen tender pemerintah yang dipakai Agent Tender Document Generator sebagai data referensi (bukan dokumen real per-user — itu di `tenderSessions`).
- **Tabel**: `tender_document_catalog` di `shared/schema.ts` — kode unik (PWR/ADM/KUL/PRS/PNG/ALT/TKN/KEU/PJA-xx), kelompok, jenis tender (pekerjaan_konstruksi/konsultansi_konstruksi/semua), sisi (penyedia/pokja/keduanya), wajibStatus (wajib/opsional/wajib_perpres_46), priority (P0/P1/P2), templateStatus, dasarHukum, sumberAutoFill (JSON path), openClawAgentRef, taxonomyId.
- **Storage**: `getTenderDocumentCatalog(filters)` (filter sisi/jenisTender/kelompok/priority — penyedia/pokja juga match "keduanya", jenis spesifik juga match "semua"), `getTenderDocumentByCode`, `upsertTenderDocumentCatalog`, `deleteTenderDocumentCatalog`.
- **Endpoint**: `GET /api/tender-document-catalog` (publik, filterable), `GET /api/tender-document-catalog/:code` (publik), `POST` & `DELETE` (auth wajib).
- **Seed**: `npx tsx scripts/seed-tender-document-catalog.ts` — idempotent by `code`. 37 dokumen: 14 P0 inti (Pakta Integritas, NIB, NPWP, Akta, SBU, FIKE, SIKaP, Surat Penawaran, Rekap Harga, PDN/TKDN, dst), 4 sisi Pokja (Dokumen Pemilihan, BA Evaluasi, BAHP, SPPBJ), 19 P1/P2 pelengkap. Dokumen wajib khusus Perpres 46/2025 (SIKaP, PDN/TKDN) ditandai `wajibStatus = "wajib_perpres_46"`.
