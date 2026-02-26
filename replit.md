# Gustafta - AI Chatbot Builder

## Overview

Gustafta is an AI chatbot builder platform enabling users to create, configure, and deploy intelligent conversational assistants. It features a two-panel dashboard for managing multiple chatbot agents, each with custom personas, knowledge bases, and multi-channel integrations. The platform supports various AI models and extensive customization, including persona details, greeting messages, and language options. Users can integrate chatbots with popular messaging platforms, embed them as web widgets, and access analytics. Gustafta also includes a built-in assistant chatbot for guidance and offers templates for various industries.

The platform employs a 5-level modular hierarchical structure (Tujuan → Hub Utama → Modul Hub → Toolbox → Agen) for Jasa Konstruksi compliance across 14 series totaling 158 chatbot agents:

1. **Regulasi Jasa Konstruksi** (25 chatbots) — Perizinan Usaha (7), SBU (4), SKK (5), Tender & Pengadaan (4), + Hubs. Seed: `server/seed-regulasi.ts`
2. **Asesor Sertifikasi Konstruksi** (11 chatbots) — Asesor Badan Usaha/LSBU (4), Asesor Kompetensi/LSP (4), + Hubs. Seed: `server/seed-asesor.ts`
3. **SMAP & PANCEK** (11 chatbots) — SMAP/ISO 37001 (4), PANCEK Anti Korupsi (4), + Hubs. Seed: `server/seed-smap-pancek.ts`. PANCEK enriched with jaga.id platform (KPK), SE PUPR 21/2021 (persyaratan SBU), PDCAR structure (Komitmen-Perencanaan-Pelaksanaan-Evaluasi-Perbaikan-Respon), Perma 13/2016, Fraud Triangle/Diamond, Fungsi Pelaksana/API (Kemenaker 338/2017), template dokumen (Piagam Audit, Kebijakan Anti-Korupsi, WBS, SK Tim Kepatuhan, Risk Register).
4. **Odoo untuk Jasa Konstruksi** (12 chatbots) — Readiness & Assessment (2), Blueprint & Implementation (3), Governance & Control (3), + Hubs. Seed: `server/seed-odoo.ts`. Enriched with e-book "Digitalisasi Jasa Konstruksi dengan ERP Odoo" (9 topik, 3 level: Basic/Intermediate/Advanced). Referensi: SSOT (Single Source of Truth), Pengadaan 360°, Inventaris Multi-Gudang, Produktivitas Tim Lapangan (EAM/Timesheet), Gantt Chart/Kanban, Digitalisasi Dokumen & Kolaborasi, Konstruksi 4.0 (Cloud/Multi-Currency/Scalability). Pain points: silo data, kebocoran inventaris, PR/PO manual, kontrol biaya lemah, pembayaran bermasalah.
5. **CSMAS Contractor Safety** (12 chatbots) — Safety Assessment (2), HSE Planning & Risk (3), Safety Performance & Governance (3), + Hubs. Seed: `server/seed-csmas.ts`. CSMS enriched with: 6-step CSMS cycle (RA→PQ→Selection→PJA→WIP→FinalEval), two phases (Administrative + Implementation), risk classification 5 levels (R/M/T/ST/E) with passing grades, 16-element pre-qualification scoring system, 40-question CSMS evaluation form (Leadership/Audit/Procedure&Equipment), Formulir I & II structure, 5×5 risk matrix with 4 impact dimensions (Manusia/Aset/Lingkungan/Reputasi), 5 risk levels (E/VH/H/M/L), Lagging vs Leading indicators framework, Contractor Data Bank & reward/punishment system, Final Evaluation criteria, CSMS as ISO 45001 Operational Control (Clause 8.1.4), Company OHSMS ↔ Contractor OHSMS bridge architecture, e-book trilogi 9 jilid (Basic/Intermediate/Advanced).
6. **CIVILPRO — Professional Mentoring Sipil** (12 chatbots) — Skema & Navigasi SKK (2), Competency Prep & Mentoring (3), Operational Problem Solver (3), + Hubs. Seed: `server/seed-civilpro.ts`. Positioning: AI Professional Mentor & Strategic Advisor. 2 modes (Uji Kompetensi + Problem Solver). Tiered Intelligence (Teknisi → Supervisor → Manajer). Schemas: SKK_SCHEME_CARD v1, SKK_READY_SUMMARY v1, PORTOFOLIO_PACKET v1.
7. **SIP-PJBU — Sistem Informasi Pembinaan PJBU** (9 chatbots) — PJBU-Kontraktor (Asesmen Level, PUB, LKUT), PJBU-Konsultan (Asesmen Level, PUB, LKUT), + Hubs. Seed: `server/seed-sip-pjbu.ts`. Berbasis Permen PUPR 7/2024. Scoring: Kontraktor (40% Proyek + 60% Manajemen), Konsultan (60% Proyek + 40% Manajemen). Leveling: Tahap Dasar → Berkembang → Stabil → Mapan → Korporasi. Murni pembinaan internal asosiasi — bukan sertifikasi resmi. Admin: aspekindopub@gmail.com | WA: +6282299417818.
8. **Manajemen LSBU — Lembaga Sertifikasi Badan Usaha** (9 chatbots) — Akreditasi & Tata Kelola (Checklist Akreditasi, Manajemen Asesor, Pelaporan), Proses Sertifikasi SBU (Review Permohonan, Pelaksanaan Asesmen, Surveillance), + Hubs. Seed: `server/seed-manajemen-lsbu.ts`. Fokus: operasional LSBU, akreditasi LPJK, pengelolaan asesor badan usaha, proses sertifikasi SBU end-to-end.
9. **Manajemen LSP — Lembaga Sertifikasi Profesi** (9 chatbots) — Lisensi & Tata Kelola (Checklist Lisensi BNSP, Manajemen Asesor Kompetensi, Pelaporan), Proses Sertifikasi SKK (Review APL, Pelaksanaan Uji Kompetensi, Surveillance), + Hubs. Seed: `server/seed-manajemen-lsp.ts`. Fokus: operasional LSP, lisensi BNSP, TUK, skema sertifikasi, proses SKK end-to-end.
10. **ISO 14001 — Sistem Manajemen Lingkungan Konstruksi** (9 chatbots) — Readiness & Implementasi (Readiness Assessment, Aspek & Dampak Lingkungan, Kebijakan & Dokumentasi), Audit & Kepatuhan (Audit Internal, Environmental KPI, Surveillance), + Hubs. Seed: `server/seed-iso14001.ts`. Fokus: pengelolaan lingkungan proyek konstruksi, AMDAL/UKL-UPL, limbah B3, kebisingan, debu. Persyaratan tender.
11. **ISO 9001 — Sistem Manajemen Mutu Konstruksi** (9 chatbots) — Readiness & Implementasi (Readiness Assessment, Process Mapping & Quality Planning, Kebijakan & Dokumentasi Mutu), Audit & Kinerja Mutu (Audit Internal, Quality KPI & Performance, Surveillance), + Hubs. Seed: `server/seed-iso9001.ts`. Fokus: quality control beton/baja/tanah, ITP, method statement, NCR/CAPA, project quality plan. Persyaratan tender.
12. **Siap Uji Kompetensi SKK** (10 chatbots kerangka, expandable) — 1 Hub Utama + 9 Hub Bidang Klasifikasi: Sipil (160+ jabatan kerja), Arsitektur, Energi/Ketenagalistrikan/Pertambangan (1.700+ jabatan SKTTK DJK/ESDM — Level 1-6, 11 bidang: IPTL, Distribusi, Transmisi, 8 jenis Pembangkit), Sains & Rekayasa Teknik (BIM), Mekanikal (81 jabatan), Manajemen Pelaksanaan (18 jabatan), Pengembangan Wilayah & Kota (5 jabatan), Arsitek Lanskap/Desain Interior/Iluminasi (13 jabatan), Tata Lingkungan (28 jabatan). Seed: `server/seed-siap-ukom.ts`. Fokus: persiapan uji kompetensi SKK per jabatan kerja dan jenjang KKNI. Bidang Energi menggunakan SKTTK (bukan SKKNI) dengan data lengkap dari sertifikat-keahlian.com. Chatbot per jabatan kerja ditambahkan melalui dashboard di bawah masing-masing Hub Bidang. **Enriched domains**: Hub Sipil diperkaya dengan referensi e-book Pengelolaan Bangunan Gedung (9 e-book, SKKNI 115-2015, 11 Elemen Kompetensi) dan Pekerjaan Tanah/Geoteknik (9 e-book, SKKNI 305-2016, klasifikasi USCS/AASHTO, MDD/OMC, Ground Improvement). Hub Manajemen Pelaksanaan diperkaya dengan referensi domain Manajemen Konstruksi (9 modul, ITP, NCR/CAPA, EVM, kontrak FIDIC, ISO 9001 untuk konstruksi).
13. **Kompetensi Teknis Kontraktor & Konsultan** (9 chatbots) — Kontraktor: Klasifikasi SBU Navigator (BG/BS umum + IN/KK/KP/PA/PB/PL spesialis, 73 subklasifikasi), Persyaratan Teknis per Kualifikasi (K/M/B, mapping SKK), Roadmap Pengembangan. Konsultan: Klasifikasi SBU Navigator (AR/AL/RK/RT/AT/IT, 28 subklasifikasi), Persyaratan Tenaga Ahli Tetap, Ketenagalistrikan & IUJPTL (SBUJPTL/SKTTK/ESDM). + Hubs. Seed: `server/seed-kompetensi-teknis.ts`. Fokus: pengembangan kompetensi individu kontraktor/konsultan, knowledge base klasifikasi SBU lengkap, persyaratan teknis per kualifikasi. Dikembangkan oleh ASPEKINDO. Ke depan diperluas untuk anggota asosiasi lain.
14. **Pembinaan Anggota ASPEKINDO — Kontraktor** (9 chatbots) — Perizinan & Legalitas OSS-RBA (OSS-RBA Navigator, KBLI & Subklasifikasi Mapper, Sinkronisasi & Sertifikat Standar), Sertifikasi & Pengembangan Usaha (SBU Application Guide, Pemeliharaan & Re-Sertifikasi, Strategi Tender & Naik Kelas), + Hubs. Seed: `server/seed-aspekindo.ts`. Berbasis e-book MasterClass "ANTI-TOLAK: Strategi Jitu Mengurus Perizinan dan Sertifikasi Usaha Konstruksi" (10 bab). Khusus Kontraktor. Konsep kunci: "Anti-Tolak" (perizinan), "Anti-Gugur" (tender), Tiga Pilar Validasi (AHU/DJP/Dukcapil), Strategi Pemetaan Terbalik (KBLI→Subklasifikasi), Error Map E01-E16, 5 Checkpoint Digital (OSS→LSBU→LPJK→SIKaP→LPSE), Blueprint PUB-ASPEKINDO 5 Fase. Warna: #DC2626.

A key feature is "Project Brain," providing contextual data for chatbots, enabling specialized "Mini Apps" for tasks like project snapshots, decision summaries, and risk assessments. The platform integrates with Mayar.id for subscription management and provides public chat pages for individual bots and multi-chatbot modules. Dynamic PWA manifests are supported for individual chatbots.

Core features include a RAG toggle for controlling knowledge base lookups, "Project Context" for personalizing conversations via user-provided information, and a "User Memory System" allowing chatbots to recall facts across sessions. Monetization is handled via per-Modul bundle pricing and per-Chatbot individual pricing, with guest message limits, trial periods, registered user quotas, and a voucher system protected by server-side enforcement. A "Conversion Layer" transforms chatbots into revenue engines through lead capture, scoring, and smart CTA triggers.

### Integration Protocols (Cross-Bot Consistency)
- **SUMMARY_RULEBOOK v1**: Enforced across all 83 chatbots. Rules for interpreting *_SUMMARY v1 data: NO DOWNGRADE (risk can only stay or rise), UNKNOWN HANDLING (max +1 level), EXPIRED/INVALID RULE (minimum Tinggi), DATA CONSISTENCY (mismatch = minimum Tinggi).
- **RISK_AGGREGATION_RULE v1**: Applied to TRC and ECSG only. When combining multiple summaries, FINAL_RISK_LEVEL = highest risk across all domains.
- **SUMMARY_GENERATOR_MODE**: Applied to all 16 specialist bots. After analysis, bots offer to convert raw data into standardized *_SUMMARY v1 format for cross-bot use.
- **Summary Protocols**: SKK_SUMMARY, SBU_SUMMARY, LICENSING_SUMMARY, TENDER_REQ_SUMMARY — standardized text-based integration format for data portability between chatbots.

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
- The server registers a SIGHUP handler in `server/index.ts` to prevent the Replit workflow system from killing the process during file-change events. Without this handler, the default SIGHUP behavior terminates the Node.js process.
- All 14 seed file imports use dynamic `import()` (lazy loading) to reduce initial memory footprint during server startup.

### Integrations
- OpenAI (GPT-4o, GPT-3.5)
- DeepSeek
- Claude
- Fonnte (WhatsApp)
- Mayar.id (payment gateway)
- Replit Auth (OAuth/OIDC)