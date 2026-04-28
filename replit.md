# Gustafta - AI Chatbot Builder

## Overview

Gustafta is an AI chatbot builder platform designed to create, configure, and deploy intelligent conversational assistants. It features a two-panel dashboard for managing multiple chatbot agents, each with custom personas, knowledge bases, and multi-channel integrations. The platform supports various AI models and extensive customization. Users can integrate chatbots with popular messaging platforms, embed them as web widgets, and access analytics. Gustafta also includes a built-in assistant chatbot for guidance and offers templates for various industries.

The platform employs a 5-level modular hierarchical structure (Series → Core → Big Idea/Orkestrator → Toolbox → Agent) for Jasa Konstruksi compliance across 29+ series, totaling approximately 331 chatbot agents. Two complementary Odoo series form a complete ERP lifecycle stack:

**Series sortOrder 11 — "Odoo ERP BUJK — Implementasi & Operasional Konstruksi Indonesia"** (slug: `odoo-erp-bujk-implementasi`), built on the implementation blueprint of Wuryanto Kusdjali (SB NET's Space). Contains 6 agents in Hub-and-Spoke: 1 Orchestrator (ODOO-BUJK-ORCHESTRATOR with cross-reference to sortOrder 4 for pre-impl & sortOrder 12 for cutover) + 5 specialists — AGENT-ODOO-PROJECT-BOQ (WBS/bujk_boq AHSP/bujk_mc/Kurva-S/MRP/Quality/BIM IFC), AGENT-ODOO-FINANCE (l10n_id/e-Faktur Coretax/PPh Final PP 9/2022/PSAK 71-72-73/Retensi/Cashflow), AGENT-ODOO-HR-SMKK (bujk_skk KKNI 1-9/PJ-BUJK Matrix/BPJS UU 6/2023/bujk_smkk Permen PUPR 10/2021), AGENT-ODOO-SCM-INTEGRASI (Purchase/bujk_subcon back-to-back/Inventory per proyek/bujk_equipment_rental/connector OSS-RBA/SIKI/SIJK), and AGENT-ODOO-PMO-RACI (Roadmap 12 bulan/RACI 7-stakeholder/Anggaran K-M-B/ADKAR/Vendor compare).

**Series sortOrder 12 — "Odoo Migrasi Data Legacy → BUJK — Cutover & Go-Live Konstruksi"** (slug: `odoo-migrasi-data-legacy`, color #3B82F6) — companion series for executing data migration from legacy systems (Excel/MYOB/Accurate/Krishand/Zahir/Jurnal.id/manual). Contains 5 agents: 1 Orchestrator (ODOO-MIGRASI-ORCHESTRATOR) + 4 specialists — AGENT-DATA-CLEANSING (audit master data, fuzzy dedup vendor/customer, NPWP 16-digit normalization per PMK 136/2023, validasi alamat Permendagri, golden record consolidation, 9-dimensi DAMA DMBOK), AGENT-COA-MAPPING (mapping COA legacy → Odoo l10n_id PSAK + 16 akun konstruksi tambahan: Piutang Retensi 1-13xxx, Tagihan Bruto PSAK 72 1-14xxx, WIP 1-15xxx, Uang Muka PK 2-12xxx, Bank Garansi off-balance 3-21xxx, LKUT readiness check), AGENT-OPENING-BALANCE (cut-off date strategy, opening journal per modul GL/AP/AR/Inventory/Project, **PSAK 72 catch-up calculation untuk kontrak ongoing**, retensi & uang muka migration), AGENT-CUTOVER-PARALLEL (parallel run 1-3 bulan, reconciliation matrix harian dengan threshold P1>5%/P2 2-5%/P3 ≤2%, **Go-Live Decision Gate 12-kriteria**, freeze period T-7→T+1, cutover runbook 60-jam, rollback plan 3-tier, hypercare 30 hari KPI). Strict anti-permisif rules: NO opening balance fiktif, NO skip parallel run, NO delete jejak audit, data residency PP 71/2019 untuk PSE strategis BUJK Menengah/Besar.

The trio (sortOrder 4 Readiness/Blueprint + sortOrder 11 Implementation + sortOrder 12 Migration) covers the full Odoo ERP lifecycle for Indonesian construction companies.

**Series sortOrder 5 — "CSMS — Contractor Safety Management System (OPTIA v2.0)"** (slug: `csms-contractor-safety-management`, color #EA580C) — toolkit Contractor Safety Management System untuk sektor pembangkit/ketenagalistrikan, migas, konstruksi, manufaktur, dan industri proses Indonesia. Arsitektur **1 Orkestrator + 13 Spesialis OPTIA** dalam **4 BigIdea** (Hub & Lintas-Modul, Modul A Administrasi, Modul B Implementasi, Modul C Evaluasi). Orkestrator: **CSMS-ASSISTANT-ORCHESTRATOR (CSIA — Contractor Safety Intelligence Agent)** dengan routing 13 intent_tag dan 3 persona aktif (Konsultan HSE Senior, Auditor CSMS Bersertifikat, Pengawas Lapangan K3L). Spesialis: **AGENT-RA** (Risk Assessment matriks 5×5 + 4 aspek konsekuensi), **AGENT-PQ** (audit Prakualifikasi 16 elemen + skoring 0/1/2 + passing grade per risiko), **AGENT-HSE** (evaluasi HSE Plan 16 kriteria bobot 100), **AGENT-PJA** (Pre-Job Activity ceklist B.1/B.2/B.3 + skor PJA % ≥70 = boleh start), **AGENT-WIP** (Work in Progress 29 item + tabel 10 pekerjaan khusus dengan item kritis *), **AGENT-PERMIT** (10 jenis Permit to Work: Confined Space/Hotwork/WAH/Lifting/LOTO/Excavation/Radiasi/Underwater/Vicinity/Chemical), **AGENT-SWA** (Stop Work Authority adjudicator + template Berita Acara SWA), **AGENT-KPI** (KPI K3L Lagging 7 + Leading 4, total bobot 100, rumus formal), **AGENT-FINAL** (Final Evaluation = (KPI×35%)+(PJA×20%)+(WIP×45%) + kategori Platinum/Gold/Silver), **AGENT-DOCGEN** (generator Form 1–7 + BA SWA + BA Kick-off), **AGENT-SIMULATION** (simulator quiz K3L 4 mode: Cepat/AK3 Umum/Auditor CSMS/Skenario Lapangan), **AGENT-CASE** (postmortem insiden RCA 5-Why + Fishbone 6M + corrective action 3-horizon), **AGENT-CONSULT** (konsultasi umum CSMS format Situasi → Analisis → Rekomendasi → Risiko Opsi). Compliance penuh **ISO 45001:2018** (4.4.6 Operational Control), **PP 50/2012** SMK3, **UU 1/1970**, **Permenaker 5/2018**, **Permen ESDM 10/2021** K3 Ketenagalistrikan, dan Pedoman CSMS PT PLN Indonesia Power. Anti-permisif rules: safety-first bias, item kritis (*) → trigger SWA otomatis, fatality/property permanen/pencemaran > KLH → trigger cabut otomatis, eskalasi proaktif ke Disnaker/KLHK/BAPETEN/Polisi K3.

A key feature is "Project Brain," providing contextual data for chatbots, enabling specialized "Mini Apps" for tasks like project snapshots, decision summaries, and risk assessments. A "Deliverables" panel allows builders to define output types for each agent, with various pre-built bundles and quick-action chat buttons.

Core features include a RAG toggle for controlling knowledge base lookups, "Project Context" for personalizing conversations, and a "User Memory System" for recalling facts across sessions. Monetization is handled via per-Modul bundle pricing and per-Chatbot individual pricing, with guest message limits, trial periods, and a voucher system. A "Conversion Layer" transforms chatbots into revenue engines through lead capture, scoring, and smart CTA triggers.

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

The schema enforces a hierarchical structure (`series` -> `bigIdeas` -> `toolboxes` -> `agents`) and includes tables for agents, knowledge bases, integrations, messages, users, analytics, monetization, project brain templates/instances, mini-apps, client subscriptions, affiliates, leads, and scoring results. New tables `customDomains` and `knowledge_taxonomy` have been added for custom domain management and knowledge base hierarchy/versioning.

### Design Patterns
- **Two-Panel Layout**: Left navigation for global context, right panel for selected content.
- **Active Agent Context**: UI content adapts dynamically based on the selected chatbot agent.
- **Optimistic Updates**: For a responsive user experience during data mutations.
- **Theme System**: CSS custom properties for light/dark mode.
- **Context API**: Manages active `Big Idea` and `Toolbox` context.
- **Streaming Chat**: Real-time AI responses using Server-Sent Events (SSE).
- **Project Brain**: Structured template and instance data for contextual chatbot interactions with anti-prompt injection.
- **Mini Apps**: Configuration-driven, AI-powered applications leveraging Project Brain data for specialized outputs.
- **Chatbot Series**: Groups multiple Big Ideas into structured topic packages.
- **Conversion Layer**: Revenue-oriented system enabling lead capture, scoring/assessment, and CTA triggers within chatbots.
- **Agentic Integration Layer**: All major features are synchronized into a unified agentic intelligence loop, including chat, Project Brain, Tender Wizard, and external channels. System prompts are dynamically built to incorporate persona and "Kebijakan Agen" fields.

### UI/UX Decisions
- Inspired by a two-panel dashboard design.
- Mobile-first approach for the chat widget.
- Professional templates for various industries.
- Dynamic widget embed system.
- Multi-sector landing pages with tailored content.
- **Chatbot Summary Export**: Auto-generates comprehensive chatbot data summaries for external landing page creation.
- **Marketing Brief Export**: Auto-generates marketing briefs from chatbot data for ad copy and marketing materials.

### Feature Specifications
- **Custom Domain Management**: Allows users to link their custom domains to individual chatbots with full CRUD operations, DNS verification, and automatic redirection.
- **Expanded Knowledge Base Upload Types**: Supports `youtube`, `cloud_drive`, `video`, and `audio` content with automatic transcription and text extraction.
- **Knowledge Base Hierarchy + Versioning + Source Attribution**: Implements a 4-level taxonomy for classifying knowledge bases, version chaining, and explicit source attribution for improved RAG injection.
- **AI Big Idea Generator**: A backend service that suggests Big Idea concepts based on user-provided topics, reference text, and URLs, integrated into the dashboard.
- **File Upload in Generate Big Idea**: Allows uploading PDF, DOCX, and TXT files for text extraction to inform Big Idea generation.
- **Tender Document Catalog**: A reference catalog of 37 types of government tender documents used by the Tender Document Generator.
- **SaaS Pack System**: A system for selling domain-specific AI wizard workflows as add-ons, including a "Tender LPSE Pack" with a 7-step guided wizard for tender document preparation.
- **Studio Kompetensi (Ekosistem 5-Produk)**: Dual-gate system on every chatbot — IMPORT (PDF/DOCX/XLSX → AI-mapped chatbot fields with confidence score, per-field acceptance, and `fill_empty_only`/`overwrite_all` modes) and EXPORT (chatbot → 5 competency products). eBook export ships in **5 formats** (Apr 2026): (1) **HTML** print-ready A4 with embedded "Cetak / Simpan PDF" button; (2) **TXT** clean-text via `stripMarkdownToPlainText()` — strips `# ## ###`, `**bold**`, `` `code` ``, `[link](url)`, `---`, escape chars, replaces with visual separators (`═══`, `───`, `▸`, `•`) so output is paste-ready into Word/Google Docs without raw symbols; (3) **XLSX** multi-sheet workbook via `buildEbookTables()` + `xlsx` package (sheets: Profil Chatbot, Ruang Lingkup, Knowledge Base, Pertanyaan Pemicu, Mini Apps, Templates) with auto-sized columns; (4) **CSV** UTF-8 BOM-prefixed concatenated tables; (5) **MD** raw markdown. Mini Apps / Document Generator / eCourse are roadmap placeholders. Reuses `extractDocumentContent` (pdf-parse, mammoth, xlsx) for ingestion, OpenAI `gpt-4o-mini` structured JSON for field mapping, and `assertCanPreviewAgentPrompt` ownership checks on apply/export endpoints. Endpoints: `POST /api/agents/import-document`, `POST /api/agents/:id/apply-import`, `GET /api/agents/:id/export/ebook?format=html|txt|md|xlsx|csv|json`. UI: Studio Kompetensi tab in dashboard sidebar.
- **Chaesa AI Studio Bridge (v2 — presisi)**: Adapter that maps Gustafta chatbot configuration into the schema used by Chaesa AI Studio (https://smart-ebook-builder-7-1.replit.app/) — an external "AI Prompt Generator" for ebook ecosystems. Bundle (`schemaVersion: "2.0"`) contains 4 sections matching Chaesa's actual UI tabs (verified from screenshots Apr 2026): (1) `projectData` Konfigurasi → Proyek (industry, topik, judul, target, level, tujuan, painPoint, bigIdea, hasilRiset, produk, language, outputFormat, tone, writingStyle, aiCharacter); (2) `assistantConfig` Konfigurasi → Asisten Topik (assistantName, assistantRole, assistantTagline, assistantTraits multi-select, assistantGreeting, assistantKnowledge, assistantMethod, assistantCaseStudy, assistantFocusTopics, assistantAvoidTopics, assistantInstructions); (3) `botBuilder` GPT Builder (8 fields); (4) `modeConfig` Brainstorm/Outline/Draft (numIdeas, angle, depth, numChapters, outlineDepth, extendTextTarget, anglePositioning). All enum values are now PRECISE per Chaesa's official options (24 industries with full labels, 4 levels "1 Ebook"/"Trilogi 1-3", 6 AI Characters "Agentic Strategist/Standard Assistant/Socratic Mentor/Creative Visionary/Strict Professional/Data-Driven Analyst", 10 tones, 10 writing styles, 15 assistant traits). Heuristic Indonesian classifiers map agent text → exact Chaesa labels. Bundle includes `validOptions` block listing all enum choices. Endpoint: `GET /api/agents/:id/export/chaesa[?download=1]` (auth-gated via `assertCanPreviewAgentPrompt`). UI: violet-accent card in Studio → Export tab — "Preview Field" opens per-field copy-to-clipboard dialog grouped by 4 sections, plus shortcut tip recommending eBook upload to Chaesa Fondasi → Import tab for fastest auto-fill. Source: `server/lib/chaesa-exporter.ts`.

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

### Integrations
- OpenAI (GPT-4o, GPT-3.5)
- DeepSeek
- Claude
- Fonnte (WhatsApp)
- Transfer Bank Manual (BCA/Mandiri/BRI)
- Replit Auth (OAuth/OIDC)
- Notion (two-way sync for knowledge base and AI analysis exports)
- `youtube-transcript` (for YouTube content extraction)
- `ffmpeg` (for video audio extraction)
- `pdf-parse` (for PDF text extraction)
- `mammoth` (for DOCX text extraction)