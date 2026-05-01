# Gustafta - AI Chatbot Builder

## Overview
Gustafta is an AI chatbot builder platform for creating, configuring, and deploying intelligent conversational assistants. It features a two-panel dashboard, multi-channel integrations, and supports various AI models. The platform allows users to manage multiple chatbot agents with custom personas and knowledge bases. Key capabilities include integration with popular messaging platforms, web widget embedding, and analytics. Gustafta aims to provide an extensive ecosystem for building and monetizing AI-powered conversational experiences.

The platform employs a 5-level modular hierarchical structure (Series → Core → Big Idea/Orkestrator → Toolbox → Agent) to manage numerous chatbot agents across various specialized series. For example, specific series are designed for Indonesian construction companies, covering the full Odoo ERP lifecycle (Readiness, Implementation, and Data Migration) and Contractor Safety Management System (CSMS) compliance.

The "Manajemen LSP — Lembaga Sertifikasi Profesi" series includes a third BigIdea "Playbook BNSP — Tata Kelola Operasional LSP" (seeded by `server/seed-manajemen-lsp-extra.ts`) with 9 chatbots covering: Register PBNSP, Matriks Klausul 201→SOP, Manajemen TUK (PBNSP 206/214), Pengembangan Skema (PBNSP 210), Pelaksanaan Asesmen (PBNSP 301), Pelaporan & SI (PBNSP 211/508), Kalender Kepatuhan, Register CAPA + Form Templates, dan Draft SK Tim Pusat & 4 Komite.

A core feature is "Project Brain," providing contextual data for chatbots, enabling specialized "Mini Apps" for tasks like project snapshots and risk assessments. A "Deliverables" panel allows defining output types for each agent, with pre-built bundles and quick-action chat buttons.

Gustafta also converts any chatbot into four digital products:
1.  **eBook Kompetensi**: A competency guidebook available in multiple formats.
2.  **eCourse Modul Belajar**: Interactive e-learning modules with quizzes.
3.  **Generator Dokumen**: A domain-aware document template generator.
4.  **Chaesa AI Studio Bridge**: Exports chatbot configurations for an external AI prompt generator.

Monetization is handled via per-module bundle pricing and per-chatbot individual pricing, with guest message limits, trial periods, and a voucher system. A "Conversion Layer" facilitates lead capture, scoring, and smart CTA triggers. Each chatbot can include an "Orchestrator Multi-Agent" system for routing user messages to relevant specialist agents based on intent classification.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
-   **Framework**: React 18 with TypeScript
-   **Routing**: Wouter
-   **State Management**: TanStack React Query
-   **Styling**: Tailwind CSS with CSS variables
-   **UI Components**: shadcn/ui
-   **Build Tool**: Vite

The frontend uses a feature-based organization, custom React hooks for data fetching, optimistic updates, and supports light/dark mode theming and a mobile-first floating chat widget.

### Backend Architecture
-   **Framework**: Express 5 with TypeScript
-   **Runtime**: Node.js with `tsx`
-   **API Style**: RESTful JSON API
-   **Build**: esbuild

The server manages CRUD operations for agents, knowledge bases, integrations, message storage, and user authentication. It supports webhook integrations and intelligent file processing, including image analysis, document text extraction, and video/YouTube transcript fetching.

### Data Storage
-   **ORM**: Drizzle ORM with Zod validation
-   **Database**: PostgreSQL (with in-memory fallback for development)
-   **Session Store**: connect-pg-simple

The schema enforces a hierarchical structure (`series` -> `bigIdeas` -> `toolboxes` -> `agents`) and includes tables for managing agents, knowledge bases, integrations, messages, users, analytics, monetization, project brain templates/instances, mini-apps, client subscriptions, affiliates, leads, scoring results, custom domains, and knowledge taxonomy.

### Design Patterns
-   **Two-Panel Layout**: Left navigation for global context, right panel for selected content.
-   **Active Agent Context**: UI content adapts dynamically based on the selected chatbot agent.
-   **Optimistic Updates**: For a responsive user experience.
-   **Theme System**: CSS custom properties for light/dark mode.
-   **Context API**: Manages active `Big Idea` and `Toolbox` context.
-   **Streaming Chat**: Real-time AI responses using Server-Sent Events (SSE).
-   **Project Brain**: Structured template and instance data for contextual chatbot interactions with anti-prompt injection.
-   **Mini Apps**: Configuration-driven, AI-powered applications leveraging Project Brain data.
-   **Chatbot Series**: Groups multiple Big Ideas into structured topic packages.
-   **Conversion Layer**: Revenue-oriented system for lead capture, scoring, and CTA triggers.
-   **Agentic Integration Layer**: Unifies chat, Project Brain, and external channels into an agentic intelligence loop, dynamically building system prompts based on persona and "Kebijakan Agen" fields.

### UI/UX Decisions
-   Two-panel dashboard design inspiration.
-   Mobile-first chat widget.
-   Professional templates for various industries.
-   Dynamic widget embed system.
-   Multi-sector landing pages with tailored content.
-   Export features for Chatbot Summary and Marketing Briefs.

### Feature Specifications
-   **Custom Domain Management**: Allows linking custom domains to chatbots with DNS verification and redirection.
-   **Expanded Knowledge Base Upload Types**: Supports `youtube`, `cloud_drive`, `video`, and `audio` content with automatic transcription and text extraction.
-   **Knowledge Base Hierarchy + Versioning + Source Attribution**: Implements a 4-level taxonomy for classification, version chaining, and explicit source attribution for RAG.
-   **AI Big Idea Generator**: Backend service suggesting Big Idea concepts based on user input and reference files.
-   **Tender Document Catalog**: A reference catalog of 37 types of government tender documents.
-   **SaaS Pack System**: Add-on system for domain-specific AI wizard workflows, e.g., "Tender LPSE Pack".
-   **Chat UI Markdown Renderer**: Renders chat assistant messages with a comprehensive set of markdown features (bold, italic, code, links, headings, lists, blockquotes, separators, fenced code blocks, and pipe tables).
-   **Studio Kompetensi (Ekosistem 5-Produk)**: A dual-gate system for importing documents and exporting chatbot configurations into five competency products (eBook in HTML, TXT, XLSX, CSV, MD; Mini Apps, Document Generator, eCourse are planned).
-   **Chaesa AI Studio Bridge**: An adapter that maps Gustafta chatbot configurations to the schema used by Chaesa AI Studio, including precise enum values for various fields like industry, topic, AI character, tone, and writing style.

### Seed System Data Integrity (April 2026)
-   **Storage Layer Filter Discipline**: `dbStorage.getBigIdeas(seriesId?)` now honors the optional `seriesId` filter. Previously it ignored the parameter and returned all bigIdeas globally — causing seed cleanup loops (`for (bi of getBigIdeas(seriesId)) deleteBigIdea(bi.id)`) to wipe data across unrelated series.
-   **Cascade Deletes in Storage**: `deleteSeries`, `deleteBigIdea`, and `deleteToolbox` now manually cascade to children (since `shared/schema.ts` has no FK `onDelete` clauses). This prevents orphan toolboxes and orphan agents accumulating across restarts.
-   **Startup OrphanCleanup**: `server/index.ts` runs a one-shot raw-SQL DELETE on boot to remove any toolboxes/agents whose parents no longer exist, providing defense-in-depth.
-   **Seed Idempotency Markers**: Each grounded seed (PanCEK KPK, SMAP ISO 37001, KAN, Lisensi LSP, ASKOM, AJJ Nirkertas, SKK Hardcopy) writes verifiable freshness markers (HEDGE, UU PDP 27/2022, LPSK, LSSM ter-akreditasi KAN, etc.) into agent system prompts. Catch-up logic only re-seeds when these markers are missing.
-   **Seeds Run in Both Dev & Prod**: The seed block is no longer gated by `NODE_ENV`. Production deployments use a separate database from development, so gating seeds caused prod to lag behind dev (e.g. missing 5 Lisensi LSP Extra chatbots). All seeds are idempotent (skip if already exist), so running them in prod safely brings the deployed database up to parity on each restart/redeploy.
-   **Static Seed Imports for Production Bundle**: All ~65 `seed-*.ts` modules are imported statically at the top of `server/index.ts` (with namespace aliases `M_xxx`) and registered in `seedModuleRegistry`. The previous pattern of `await import("./seed-XXX")` did NOT work in the production esbuild bundle (`dist/index.cjs`) because esbuild cannot statically resolve dynamic-import paths read from object properties — the seed source files were silently excluded from the bundle, and at runtime every dynamic import threw `Cannot find module '/dist/seed-XXX'` (caught and logged but causing prod DB to never receive seeds). The fix preserves the existing string-based `seedTasks` array but resolves modules through the registry instead of dynamic import.
-   **Template Literal Hygiene in Seed Content**: Markdown inline-code backticks (`` ` ``) inside JS template literals must be escaped (`` \` ``); otherwise they prematurely terminate the literal and the following text (e.g. `/admin`) is parsed as JS, producing module-load `ReferenceError`. With dynamic imports the error was swallowed by try/catch; with static imports it crashes server boot. `seed-knowledge-base.ts` line 625 was the only offender.
-   **Stronger Seed Idempotency Check (SKK/SBU/SKTK)**: All 19 SKK/SBU/SKTK Coach seed files (`seed-skk-*.ts`, `seed-sbu-*.ts`, `seed-sktk-*.ts`) now check both hub presence AND `bigIdeas.length >= 1` before skipping. Previously the check was hub-only, so a partially-seeded series (hub created, bigIdeas not yet populated due to a crash mid-loop) was treated as "complete" and never repaired. The new check forces re-seed (delete + recreate) when hub exists but bigIdeas are missing — recovering automatically on the next restart. Affected slugs that were previously stuck as hub-only stubs in DEV: `skk-sipil`, `skk-arsitektur`, `skk-elektrikal`, `skk-mekanikal`, `skk-bangunan-gedung`, `skk-tata-lingkungan`, `skk-k3-konstruksi`, `skk-manajemen-proyek`, `skk-manajemen-pelaksanaan`, `skk-geoteknik`, `skk-pengujian-qc`, `skk-konstruksi-khusus`, `skk-peralatan-logistik`, `sbu-coach-pekerjaan-konstruksi`, `sbu-konsultan-coach`, `sbu-master-coach`, `sbu-terintegrasi-coach`, `sbu-penunjang-listrik`, `sbu-kompetensi-migas-ebt-tambang`, `sktk-tenaga-listrik`. Production was already correct (fresh seed on first deploy); this fix restores DEV to parity.
-   **Multi-Provider Chat Fallback (OpenAI → DeepSeek → Qwen → Gemini)**: Streaming chat handler in `server/routes.ts` wraps the primary LLM call in a fallback chain. If the primary stream creation fails (auth, rate limit, network, model unavailable), the system automatically retries the next provider in order: DeepSeek (OpenAI-compatible at `https://api.deepseek.com`, model `deepseek-chat`), then Qwen / Alibaba DashScope (OpenAI-compatible at `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`, model `qwen-plus` — both base URL and model overridable via `QWEN_BASE_URL` / `QWEN_MODEL` for users on China endpoint or different model tier), then Gemini (`gemini-2.5-flash` via `@google/genai`). Fallback only triggers on **stream creation failure**, never mid-stream — once any provider successfully starts streaming, the response commits to that provider (preserves streaming UX). DeepSeek fallback is skipped when the user's chosen model already starts with `deepseek-`. Gemini message conversion: system messages → `systemInstruction`, assistant role → `model`, vision/image content → text-only (graceful degradation since vision typically forces gpt-4o anyway). Required secrets: `OPENAI_API_KEY` (primary, mandatory); `DEEPSEEK_API_KEY`, `QWEN_API_KEY`, `GEMINI_API_KEY` (fallbacks, all optional — each fallback step is skipped automatically if its key is missing).
-   **Public Flag Auto-Repair on Startup**: 17 of the 19 SKK/SBU/SKTK Coach seed files were calling `storage.createAgent({...})` without `isPublic: true` (default in schema is `false`). This caused `/api/public/modul/:bigIdeaId` (which filters with `a.isPublic`) to return zero chatbots, so users saw "Belum Ada Chatbot" in 17 of 22 series (only `skk-hardcopy`, `skk-ajj`, `sbu-coach-pekerjaan-konstruksi`, `sbu-konsultan-coach` were correctly public). Two-part fix: (1) all 156 `createAgent()` calls in those 17 seed files now have `isPublic: true` injected, so future fresh seeds work correctly; (2) `server/index.ts` runs an idempotent `[PublicFlagRepair]` UPDATE on every startup (right after `[OrphanCleanup]`) that sets `is_public = true` for any agent whose series slug starts with `skk-`/`sbu-`/`sktk-` and is still `false`. This auto-heals existing prod & dev DBs on next deploy without manual intervention.

### SKK Coach — Sipil Wave 1 (May 2026)
-   **Wave 1 Module Set**: 5 BigIdea baru di series 109 (`skk-sipil`) yang fokus pada SKK bidang Bangunan Gedung dan Penilai/Pemeriksa: (1) Ahli Madya Rekayasa Konstruksi Bangunan Gedung — SKKNI 106-2015 (KKNI 8); (2) Ahli Penilai Kelaikan Bangunan Gedung Aspek Arsitektur & Tata Ruang Luar — SKKNI 113-2015 (KKNI 9); (3) Manajer Pengelolaan Bangunan Gedung — SKKNI 115-2015 (KKNI 7); (4) Ahli Pemeriksa Kelaikan Fungsi Struktur Bangunan Gedung — SKKNI 193-2013 (KKNI 9); (5) Ahli Penilai Bangunan Hijau — SKKNI 2-2023 (KKNI 7-9, mengacu Permen PUPR 21/2021 BGH).
-   **Multi-Agent Architecture (Modul 1)**: SKKNI 106-2015 menggunakan 9 chatbot multi-agent: RG-Orchestrator (router intent), RG-EDU (9 unit kompetensi), RG-QUIZ (bank soal + remedial 4 tingkat berdasar skor), RG-CASE (studi kasus rubrik 5 dimensi), RG-ASESOR (simulasi wawancara rubrik lisan 6 dimensi max 24), RG-PORTO (evidence mapping per unit), RG-DOC (generator draft Spek/Metode/QC/Laporan dengan disclaimer verifikasi ahli), RG-REG (hierarki regulasi + glossary 20+ istilah), RG-PROGRESS (self-assessment 12 item skala 1-5).
-   **Compact Architecture (Modul 2-5)**: 4 chatbot per modul via helper `buildKompakChatbots`: EDU (materi unit), QUIZ-CASE (latihan + studi kasus dengan remedial flow), PORTO-ASESOR (portofolio + simulasi wawancara rubrik 6 dimensi), REG (hierarki regulasi & standar acuan).
-   **Regulasi-Based Guardrails**: Setiap system prompt menyertakan blok ATURAN UTAMA: dilarang memberi keputusan "kompeten/tidak kompeten" (wewenang asesor BNSP/LSP), dilarang mengarang nilai numerik tanpa data input peserta, wajib merujuk SKKNI Kemnaker resmi (URL `skkni-api.kemnaker.go.id`) + SNI 1726/2847/1729 + UU 2/2017 + PP 14/2021 + Permen PUPR 8/2022. Sesuai constraint user: "kurangi kreatifitas tidak berbasis data atau regulasi atau standar."
-   **Idempotent Seeder**: `server/seed-skk-sipil-wave1.ts` mengikuti pola upsert (find toolbox by name → find agent by name → update; jika tidak ada, create toolbox + agent). Terdaftar statis di `server/index.ts` registry (`M_skkSipilWave1`) dan `seedTasks` (urutan setelah Manajemen LSP Extra). Total 25 chatbot baru terverifikasi di DB (BigIdea ID 526-530).

### SKK Coach — Sipil Wave 2 (May 2026) — Manajemen Proyek & QA/QC
-   **Wave 2D Module Set**: 5 BigIdea baru di series 109 (`skk-sipil`, BigIdea ID 535-539) yang fokus pada manajemen proyek konstruksi & QA/QC: (1) Manajer Proyek Konstruksi / Project Manager — SKKNI Manajemen Konstruksi (KKNI 8, 10 knowledge area PMBOK terapan + kontrak/klaim/SMKK); (2) Manajer Konstruksi / MK Konsultan Pengawas — Permen PUPR 8/2022 + KBLI 71101/71102 (KKNI 8, sisi owner: review desain, value engineering, RFI/RFA, BAST); (3) Quantity Surveyor / Estimator Biaya — SKKNI 71-2015 + AHSP Permen PUPR 1/2022 (KKNI 7, take-off → BoQ → HPS → interim valuation → final account); (4) Quality Engineer / Pengendali Mutu — SKKNI Manajemen Mutu + SNI 2847/1729 + ISO 9001 (KKNI 7, Quality Plan, ITP, NCR/CAR, mix design, kalibrasi); (5) Ahli K3 Konstruksi / HSE — Permen PUPR 10/2021 SMKK + SKKNI 350-2014 (KKNI 7-8, RKK, IBPRP/HIRARC, JSA, statistik TRIR/LTIFR).
-   **Compact Architecture (4 chatbot/modul)**: Semua 5 modul Wave 2 menggunakan helper `buildKompakChatbots` yang sama secara struktural dengan Wave 1 modul 2-5: EDU (materi unit), QUIZ-CASE (latihan + studi kasus + remedial 4 tingkat), PORTO-ASESOR (portofolio + wawancara rubrik 6 dimensi max 24), DOC-REG (generator dokumen + hierarki regulasi). Total 20 chatbot baru (agent ID 1831-1850), semua public + active dengan system prompt 2400-3700 char.
-   **Honest Regulatory Reference**: Berbeda dari Wave 1 yang menyertakan UUID dokumen SKKNI spesifik, Wave 2 hanya menyebut nomor SKKNI yang umum dirujuk + arahkan peserta ke portal `skkni.kemnaker.go.id` untuk verifikasi nomor terbaru. Ini menghindari risiko misleading bila UUID tidak akurat. Acuan regulasi spesifik per modul: Permen PUPR 1/2022 (AHSP) untuk QS, Permen PUPR 10/2021 (SMKK) untuk K3, Permen PUPR 8/2022 (SBU/SKK) untuk MK, ISO 9001/45001 untuk QE/K3.
-   **Idempotent Seeder**: `server/seed-skk-sipil-wave2.ts` pola sama dengan Wave 1 (lookup series by name/slug, getBigIdeas dengan series filter, upsert by toolbox/agent name). Terdaftar di `server/index.ts` registry (`M_skkSipilWave2`) dan `seedTasks` setelah `SKK Sipil Wave1`.

### SKK Coach — Sipil Wave 2A/2B/2C (May 2026) — Bina Marga, SDA, Geoteknik
-   **Wave 2A — Bina Marga (Jalan, Jembatan, Rel, Terowongan, Pemeliharaan)**: 5 BigIdea (ID 548-552): (1) Ahli Teknik Jalan — SKKNI Bina Marga + Spesifikasi Umum BM + MDP 2017 + Pd T-19-2004 (KKNI 7-8); (2) Ahli Teknik Jembatan — SNI 1725:2016 + SNI 2833:2016 + RSNI T-12-2004 + BMS Bina Marga (KKNI 8); (3) Ahli Perencana Jalan Rel — UU 23/2007 + PM 60/2012 + standar PT KAI/HSR/MRT/LRT (KKNI 7-8); (4) Ahli Terowongan — SNI 03-3401-1994 + NATM/TBM/Cut & Cover + RMR/Q/GSI (KKNI 8); (5) Ahli Pemeliharaan Jalan & Jembatan — Permen PUPR 13/2011 + 41/2015 + RMS/IRMS/BMS/IBMS + HDM-4 (KKNI 7-8).
-   **Wave 2B — SDA (Bendungan, Irigasi, Sungai, Pantai, Hidrologi)**: 5 BigIdea (ID 553-557): (1) Ahli Bendungan Besar — PP 37/2010 + Permen PUPR 27/2015 + KNI-BB + ICOLD (KKNI 8-9, mencakup PMF, instrumentasi, RTD); (2) Ahli Irigasi & Rawa — PP 20/2006 + Permen PUPR 12/2015 + KP-01 sd KP-09 (KKNI 7-8, modernisasi + P3A); (3) Ahli Sungai & Drainase — PP 38/2011 + Permen PUPR 28/2015 + 12/2014 + SNI 2415:2016 + HEC-RAS (KKNI 7-8); (4) Ahli Pantai — Permen PUPR 7/2015 + CEM USACE + SLR/ROB adaptation (KKNI 7-8); (5) Ahli Hidrologi & SDA Terapan — SNI 2415:2016 + HEC-HMS/Mock/NRECA + Penman-Monteith FAO 56 + IPCC SSP scenarios (KKNI 7-8).
-   **Wave 2C — Geoteknik (Geoteknik, Pondasi, Investigasi, Perbaikan, Lereng)**: 5 BigIdea (ID 558-562): (1) Ahli Geoteknik — SNI 8460:2017 + SNI 1726:2019 + HATTI + Boulanger-Idriss 2014 likuifaksi (KKNI 7-8); (2) Ahli Pondasi — SNI 8460:2017 Bab Pondasi + SNI 2847:2019 + uji PDA/Static/Integrity (KKNI 7-8); (3) Ahli Investigasi Tanah — SNI 4153:2008 + SNI 03-2436-1991 + Robertson chart + MASW (KKNI 7); (4) Ahli Perbaikan Tanah & Grouting — FHWA Ground Improvement + NAVFAC DM-7.3 + PVD/vacuum/stone column/DSM/jet grouting/dewatering (KKNI 7-8); (5) Ahli Lereng & Stabilitas — SNI 8460:2017 + Pd Bina Marga 005/BM/2008 + Varnes classification + Bishop/Spencer/Morgenstern-Price + Plaxis (KKNI 7-8).
-   **Compact Architecture (4 chatbot/modul × 15 modul = 60 chatbot baru)**: Semua 15 modul Wave 2A/B/C menggunakan helper bersama `server/seed-skk-sipil-helper.ts` (`buildKompakChatbots` + `seedWaveModules`) dengan pola identik Wave 2D: EDU + QUIZ-CASE + PORTO-ASESOR + DOC-REG. Setiap chatbot menyertakan `regulasiBlock` lengkap dengan caveat "rujuk JDIH Kemnaker/PUPR untuk nomor terbaru" — tidak ada UUID hardcoded. Total Series 109 (`skk-sipil`) sekarang punya 25 modul / 105 chatbot.
-   **Idempotent Seeder & Recovery**: 3 file (`seed-skk-sipil-wave2a.ts`, `wave2b.ts`, `wave2c.ts`) terdaftar statis di `server/index.ts` (3 import + 3 registry + 3 seedTasks setelah `SKK Sipil Wave2`). Helper bersama menangani recovery untuk toolbox-tanpa-agent (jika seed sebelumnya gagal di tengah). Verifikasi DB: 25 modul × ≥4 chatbot = 105 toolbox + 105 agent (semua public + active).

### Admin Panel & Role Hierarchy
-   **Role Hierarchy**: `superadmin` (Wuryanto, auto-assigned), `admin` (assigned by superadmin), and `user` (default).
-   **Admin Dashboard**: Provides different views and capabilities based on role, including user management, subscription management, and trial request handling.
-   **Role Assignment Logic**: Superadmin status is determined by email, and roles are persistent.
-   **Trial Request System**: Manages public trial requests, allowing admins to approve or reject them and generate voucher codes.

## External Dependencies

### UI Libraries
-   Radix UI primitives
-   Lucide React icons
-   React Icons
-   Embla Carousel
-   React Day Picker
-   cmdk
-   Vaul

### Data & Validation
-   Zod
-   drizzle-zod
-   TanStack React Query

### Database
-   PostgreSQL (`pg` driver)
-   Drizzle ORM
-   drizzle-kit

### Development Tools
-   Vite
-   TypeScript
-   PostCSS

### Integrations
-   OpenAI (GPT-4o, GPT-3.5) — primary chat provider
-   DeepSeek — fallback layer 1 (deepseek-chat via OpenAI-compat)
-   Qwen — fallback layer 2 (qwen-plus via DashScope OpenAI-compat)
-   Gemini — fallback layer 3 (gemini-2.5-flash via @google/genai)
-   Claude
-   Fonnte (WhatsApp)
-   Transfer Bank Manual (BCA/Mandiri/BRI)
-   Replit Auth (OAuth/OIDC)
-   Notion (two-way sync for knowledge base and AI analysis exports)
-   `youtube-transcript` (for YouTube content extraction)
-   `ffmpeg` (for video audio extraction)
-   `pdf-parse` (for PDF text extraction)
-   `mammoth` (for DOCX text extraction)