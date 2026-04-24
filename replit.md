# Gustafta - AI Chatbot Builder

## Overview

Gustafta is an AI chatbot builder platform enabling users to create, configure, and deploy intelligent conversational assistants. It features a two-panel dashboard for managing multiple chatbot agents, each with custom personas, knowledge bases, and multi-channel integrations. The platform supports various AI models and extensive customization, including persona details, greeting messages, and language options. Users can integrate chatbots with popular messaging platforms, embed them as web widgets, and access analytics. Gustafta also includes a built-in assistant chatbot for guidance and offers templates for various industries.

The platform employs a 5-level modular hierarchical structure (Series → Core → Big Idea/Orkestrator → Toolbox → Agent) for Jasa Konstruksi compliance across **19 series** (15 original + 4 baru di Apr 2026) totaling **~250 chatbot agents**, organized into 6 categories:

### Kategori 6: Siklus Tender & Eksekusi Proyek (`tender-eksekusi`) — Apr 2026
16. **Tender Konstruksi & PBJP** (10 chatbots, slug `tender-konstruksi-pbjp`) — Series tersendiri yang mempromosikan & memperdalam materi tender (sebelumnya hanya 4 spesialis menumpang di Regulasi). Big Ideas: Strategi & Persiapan Tender (Hub + Market Intelligence LPSE/SPSE + Bid-No-Bid + Konsorsium/JO + Pricing/HPS), Penyusunan Dokumen Penawaran (Administrasi + Teknis & Metode + RAB/BoQ + Compliance Checker + Sanggahan). Berbasis Perlem LKPP No. 12/2021, Perpres 16/2018 jo. 12/2021, SBD PUPR.
17. **Pasca Tender & Manajemen Kontrak Konstruksi** (11 chatbots, slug `pasca-tender-manajemen-kontrak`) — Mengisi gap nyata kontrak konstruksi. Big Ideas: Awarding & Mobilisasi (Hub + SPPBJ Signing + Bank Garansi + PCM/Mobilisasi), Eksekusi & Pengendalian (Addendum/CCO + MC/Termin + Klaim/Eskalasi + Subkontrak/Suplai), Penyelesaian & Penutupan (BAST PHO/FHO + Defect Liability + Dispute Avoidance). Berbasis SBD PUPR, FIDIC, UU 2/2017.
18. **Pelaksanaan Proyek Konstruksi — Operasional Lapangan** (14 chatbots, slug `pelaksanaan-proyek-lapangan`) — Mengisi gap eksekusi lapangan. Big Ideas: Perencanaan Eksekusi (Hub + RAB Pelaksanaan + Master Schedule/S-Curve + Method Statement + Resource Loading), Operasional & Eksekusi (DPR + Opname/QS + Material/Logistik + Subkon/Mandor + K3 Lapangan), Pengendalian & Pelaporan (EVM/CPI/SPI + NCR/CAPA + Punch List + Weekly Report Owner). Untuk Site Manager, Site Engineer, QS, QA/QC, K3, Logistik.
19. **Legalitas Jasa Konstruksi** (11 chatbots, slug `legalitas-jasa-konstruksi`) — Mengisi gap aspek hukum di luar perizinan. Big Ideas: Kontrak & Perjanjian (Hub + Reviewer Kontrak + Force Majeure/Risk + Pembayaran/Eskalasi/Penalti), Sengketa & Dispute Resolution (DSK + Mediasi/Arbitrase BANI + Litigasi), Hukum Operasional (Ketenagakerjaan/PKWT + Pajak Konstruksi PPh 4(2)/PPN + Asuransi CAR/EAR/TPL + Kepailitan/PKPU). Berbasis UU 2/2017, UU 30/1999, KUHPerdata, PP 9/2022.

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
