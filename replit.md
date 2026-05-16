# Gustafta
Gustafta is an AI chatbot builder platform that enables users to create, configure, and deploy intelligent conversational assistants, including the integrated LexCom Legal AI system.

## Run & Operate
- **Run Development Server**: `npm run dev`
- **Build**: `npm run build`
- **Typecheck**: `npm run typecheck`
- **Codegen (Drizzle)**: `npx drizzle-kit generate`
- **DB Push (Drizzle)**: `npx drizzle-kit push`
- **Environment Variables**: `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY` (for Midtrans payment integration)

## Stack
- **Frontend Framework**: React 18 with TypeScript
- **Backend Framework**: Express 5 with TypeScript
- **Runtime**: Node.js (`tsx`)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Database**: PostgreSQL (with in-memory fallback for development)
- **Styling**: Tailwind CSS, shadcn/ui
- **Build Tool**: Vite (frontend), esbuild (backend)
- **State Management**: TanStack React Query

## Where things live
- **Database Schema**: `shared/schema.ts` (source of truth; `db/schema.ts` is symlinked)
- **API Routes**: `server/routes/*.ts`
- **Tutor Builder Page**: `client/src/pages/tutor-builder.tsx` (route `/tutor-builder`) — 5 blueprint presets dari ebook Trilogi: Tutor Sokratik 4-Mode, LexSkripsi, Satpam Belajar, Pendamping Baca, Learning Stack. Backend: `POST /api/tutor-builder/create-team` + `GET /api/tutor-builder/blueprints` di `server/routes.ts` (end of file).
- **Inter-Agent API v2**: `server/routes.ts` ~line 2806 (orchestration block), ~line 3926 (`callAgentInternal` v2)
- **Legal AI Configuration**: `server/lib/legal-agents.ts`
- **AI Field Regeneration Component**: `client/src/components/ai-field-regen.tsx`
- **MultiClaw Orchestration Planner**: `client/src/components/agentic-ai-panel.tsx`
- **Midtrans Integration**: `server/lib/midtrans.ts`
- **Legal Landing Page**: `client/src/pages/legal-landing.tsx`
- **Legal Chat Interface**: `client/src/pages/legal-chat.tsx`
- **Chaesa Lexbot Widget**: `client/src/components/chaesa-widget.tsx`
- **Test Tracker**: `client/src/pages/test-tracker.tsx` (route `/test-tracker`) — 4-tab: Tender 35 sel + Federation 655 sel + Pilot 42 sel + **KONSTRA 70 sel (10 agen × 7 AC ABD)**
- **Templates**: `server/db/schema.ts` (chatbot_templates table)
- **Storefront Products**: `server/db/schema.ts` (store_products table)

## Architecture decisions
- **5-Level Modular Hierarchy**: Agents organized Master → Series HUB → Sub-HUB → Specialist → Deep Specialist.
- **Two-Panel Dashboard Layout**: Separates global navigation from selected content.
- **Optimistic UI Updates**: Immediately reflects user actions for responsiveness.
- **Project Brain & Mini Apps**: Contextual data for chatbots with anti-prompt injection.
- **Multi-Provider LLM Fallback**: Chain: OpenAI → DeepSeek → Qwen → Gemini.
- **Inter-Agent API v2 (L2.5)**: Orchestrator agents call sub-agents in parallel via `callAgentInternal()` (25s AbortController timeout, min 1500 maxTokens, conversation history passed). Results injected as `LAPORAN SUB-AGEN` block before orchestrator synthesizes. SSE events: `orchestrating_start`, `sub_agent_start`, `sub_agent_done`, `aggregating`. Config via `agenticSubAgents` jsonb on agents table.
- **FEDERATION_MODE v2 Guard**: Seed checks for `FEDERATION_MODE v2` marker in prompts to avoid overwriting upgraded orchestrator prompts.

## Product
- **AI Chatbot Builder**: Create, configure, and deploy intelligent conversational agents.
- **LexCom Legal AI**: Integrated system with 12 specialized legal agents and a floating "Chaesa Lexbot" widget.
- **Federation Layer (131 hubs)**: 131 hub orchestrators with `agenticSubAgents` configured — parallel multi-agent synthesis (131/131 SYNTHESIS ORCHESTRATOR marker). Includes: Tender, SKK, SBU (PK/KK/Terintegrasi/AIO/JPTL), Perizinan, ASKOM, CSMS, SMAP, PANCEK, Odoo, AJJ, KAN, Lisensi LSP, IT LSP, ISO 14001/9001, PJBU, Kontraktor/Konsultan, Perizinan & Legalitas, Sertifikasi, Admin BUJK, Competency Mentoring, Problem Solver, Skema Navigator, LKUT, 9 Discipline Hubs, Hub Kompetensi Teknis, Manajemen Kontrak Hub, Legal Konstruksi Hub, RG Orchestrator (SKKNI 106), 6 SKKNI Jabatan, LEX-ORCHESTRATOR, 8 SKKNI Jabatan Kerja, 8 Project Management, 4 LexCom Wings, 3 Standalone Hubs, 13 SKK Coach Hubs, IMS/SMK3/CSMS/Pancek cluster (307/308/311/314/317), 13 Persona-upgraded hubs, SKTK-TTK, Migas-EBT-Tambang, DevProperti Pro, EstateCare Pro, Personel Manajerial BUJK, Regulasi JK.
- **Dynamic Knowledge Base**: Hierarchical classification, versioning, source attribution, multiple upload types.
- **Monetization & Conversion Layer**: Pricing, lead capture, scoring, smart CTA triggers.
- **Chatbot Templates & Gustafta Store**: Public marketplace with Midtrans payment integration.
- **Test Tracker**: 6-tab evaluation tool — Tender (35 sel, 5 bot × 7 T-test) + Federation (655 sel, 131 hub × 5 F-test) + Pilot (42 sel, 6 bot × 7 T-test, target ≥90% pass) + KONSTRA (70 sel, 10 agen × 7 AC ABD v1.1, Sprint 4 sign-off ≥14/16 TC) + AI Tutor (45 sel, 9 agen × 5 AC Pedagogi, target ≥80% pass, C1 Anti-Block CRITICAL) + **SBUClaw (55 sel, 11 agen × 5 AC ABD v1.1, target ≥80% pass, C1 Anti-Block CRITICAL + C4 Regulasi CRITICAL)**. Route: `/test-tracker`. (DB: 106 orchestrators, 982 agents total, 132 hub dengan sub-agents)
- **SBUClaw Chat**: `/sbu-claw` — OpenClaw L4 multi-agent SBU Konstruksi UI (amber/yellow theme). Endpoint: `GET /api/sbuclaw/orchestrator`. 10-agen legend strip. SSE streaming dengan sub-agent panel.
- **SCORECARD/WIN PROBABILITY (129/129 hubs — COMPLETE)**: All 129 Federation orchestrators upgraded with 4-dimension `┌──...┐` table scorecard + `PROBABILITAS X %` + `KEPUTUSAN:` line. Rumus weights vary by hub type. Covers: Tender, SBU, SKK, ISO 9001/14001, SMAP, PANCEK, Odoo, LSBU, LSP, ASKOM, AJJ, Legal Konstruksi, LexCom Wings, SKKNI Jabatan Kerja (PKBG-ARS/MPBG/PKFS/PBH/MPK/MK-CM/QS/QE/K3K/JLN/JBT/REL/TWG/PJJ), Project Management (StrategiTender/DokPenawaran/EksekusiKontrak/Perencanaan/Operasional/Pengendalian/Hukum/PlaybookBNSP), Personel Manajerial BUJK, dan seluruh discipline hubs.
- **T5-HANDOVER (103/103 orchestrators — COMPLETE)**: All active orchestrators upgraded with domain-specific `HANDOVER — TOPIK DI LUAR DOMAIN` block. Bot gracefully acknowledges out-of-domain queries, names the correct resource, and redirects back to core domain. Marker: `luar domain` in system_prompt.
- **F3-FALLBACK MODE (103/103 orchestrators — COMPLETE)**: All active orchestrators upgraded with `FALLBACK MODE — OPERASIONAL MANDIRI` block. Bot answers independently when sub-agents unavailable, using domain-specific 4-perspective coverage + `[ASUMSI: ...]` tagging. Marker: `FALLBACK` in system_prompt.
- **MASTER STANDAR v2.0 (129/129 hubs — COMPLETE)**: All 129 SYNTHESIS ORCHESTRATOR hubs upgraded with full Master Standard v2.0 — 5 universal blocks: (1) POLA KERJA v2.0 (ELICIT MAX 1 PUTARAN, ANTI INTERROGATION MODE, REFLECT SEBELUM DELIVER, ANTI HUMAN-AS-API), (2) STATE MACHINE 7-langkah (INIT→ELICIT→PLAN→DISPATCH→AGGREGATE→REFLECT→DELIVER). Fixes L0.5→L2.5 anti-patterns (Test A/B, 6 Mei 2026). Modul Tender 5-bot (IDs 23–27) fully rewritten standalone-agentic. Markers: `POLA KERJA v2.0`, `STATE_MACHINE_v2.0` in system_prompt.
- **Mini Apps (45 types — COMPLETE)**: All Master Standar Gustafta v1.0 types + Bekerja & Berusaha hub implemented — `rubric_scoring`, `risk_register`, `work_mode_selector`, `mentoring_plan`, `brief_intake`, `studio_kompetensi`, plus **Bekerja Hub**: `meeting_notes` (AI Notulis & Ringkas Rapat), `contract_drafter` (AI Drafter Kontrak/SPK/NDA/MoU), `rab_estimator` (RAB & Estimasi Biaya), `kpi_report` (Laporan KPI & Kinerja Tim); plus **Berusaha Hub**: `social_media_copy` (AI Copywriter Konten Medsos), `sales_script` (Sales Script & Objection Handling), `cashflow_report` (Laporan Cashflow & Keuangan), `customer_feedback` (Survey Kepuasan & NPS Tracker). All 45 registered in schema.ts, mini-apps-panel.tsx, server/routes.ts. UI: Three new hub cards (violet Kreator, emerald Bekerja, orange Berusaha) shown in Mini Apps panel above mini-apps list. **Kreator Hub** (4 tools): `content_calendar` (Editorial Calendar), `video_script` (Script YouTube/Podcast), `brand_deal_proposal` (Proposal Brand Deal & Media Kit), `content_analytics` (Laporan Performa Konten).
- **MULTICLAW Universal ABD v1.1 Upgrade (609 agen — COMPLETE)**: Semua agen yang belum diupgrade diupgrade via `scripts/upgrade-all-remaining-abd.ts`. Marker: `ABD_v1.1_UPGRADED`. Cakupan: LSBU (104–112), Personel Manajerial BUJK (1460–1469: PJBU/PJTBU/PJKBU/PJSKBU + 5 Manager), ISO 9001/14001 (131–148), CSMS/SMK3/IMS/SMAP (47–56, 69–82, 272–320, 307–316), Tender/Kontrak/Site Ops (331–364), Legal Konstruksi (365–386), Katalog Jabatan & SKK Coach (439–548), SKKNI EDU/QUIZ/PORTO/DOC-REG series (648–752), Odoo (57–68), Properti/DevProperti/EstateCare (575–596), LexCom (625–647), AI Tutor (1360–1368), IB-TU (1300–1307), AJJ/Hard Copy/Paperless (180–226), dan seluruh Agentic Sub-Agents (AGENT-FINDER/SCORER/STRATEGI/RISKSCAN/dll). Blok universal: CATATAN REGULASI WAJIB (UU 2/2017 · PP 14/2021 · Permen PU 6/2025 · Permen PUPR 9/2023 · SK Dirjen 114 · BNSP Pedoman · ISO 9001/14001 · SMK3 · SMAP · FIDIC), POLA KERJA v2.0, STATE MACHINE (INIT->ELICIT->PLAN->DELIVER), ABD-7 OUTPUT, HEURISTIK DEFAULT UNIVERSAL, GUARDRAILS UNIVERSAL. Dikecualikan: IDs 1394–1404 (SBUClaw) + 1272–1281 (KONSTRA) — sudah ABD-compliant dari seeding.

- **TOTAL ABD v1.1 UPGRADE — 934/944 agents (COMPLETE)**: SBU (242) + SKK (36) + ASKOM/LSP (47) + Universal (609 net new). 10 agen sisa adalah seeded ABD-compliant by design (SBUClaw + KONSTRA specialists).

- **ASKOM/LSP ABD v1.1 Upgrade (52 agen — COMPLETE)**: Semua agen ASKOM, LSP, ABU, TUK, BLKK diupgrade via `scripts/upgrade-askom-lsp-abd.ts`. Marker: `ASKOM_ABD_v1.1_UPGRADED`. Regulasi acuan: BNSP Pedoman 201/202/301/303, SKKNI 333/2020 (MAPA·MA·MKVA), SNI ISO/IEC 17024:2012 (KAN), PP 10/2018 (BNSP), Permen PUPR 9/2023, SK Dirjen 114/KPTS/DK/2024. Blok ASKOM/LSP-spesifik: POLA KERJA v2.0, STATE MACHINE, ANTI-BLOCK + HEURISTIK DEFAULT (calon ASKOM → ASKOM Junior; LSP → tahap awal Pedoman 201+301; TUK → TUK Sewaktu sebagai default; FR-APL-01 sebagai titik masuk standar), GUARDRAILS (DILARANG janjikan lisensi LSP/KAN terbit, DILARANG janjikan lulus asesmen, DILARANG manipulasi MUK/FR-Series). Cakupan: HUB ASKOM Konstruksi (34, 230), Hub Lisensi LSP (242–252), Akreditasi KAN (260–271), IT LSP (597–602), Konsultan LSP (253–259), TUK Hard Copy (219–220), AJJ ASKOM (192, 207), dll.

- **SKK ABD v1.1 Upgrade (53 agen — COMPLETE)**: Semua agen SKK murni diupgrade dengan blok ABD v1.1 via `scripts/upgrade-skk-abd.ts` + `scripts/patch-skk-sk-dirjen-114.ts`. Marker: `SKK_ABD_v1.1_UPGRADED`. Regulasi acuan: **Permen PUPR No. 9 Tahun 2023** (pedoman utama) + **SK Dirjen Bina Konstruksi Nomor 114/KPTS/Dk/2024** (acuan teknis jabatan kerja & SKKNI — WAJIB diacu). Blok SKK-spesifik: CATATAN REGULASI WAJIB (SK Dirjen 114/KPTS/DK/2024 + SKKNI + KKNI L1-9, LSP/BNSP/LPJK), POLA KERJA v2.0, STATE MACHINE (INIT→ELICIT→PLAN→DELIVER), ANTI-BLOCK DOCTRINE + HEURISTIK DEFAULT SKK (jenjang default KKNI L6 jika tidak ada info), GUARDRAILS SKK (DILARANG janjikan SKK terbit/lulus uji, DILARANG pinjam nama tenaga ahli). Cakupan: SKK Coach 13 HUB (438–543), SKK AJJ (177–205), SKKNI EDU/QUIZ/PORTO/REG (649–672), Proses Sertifikasi SKK, Siap Uji, AJJ Nirkertas, AGENT-SKKMATCH.

- **SBU ABD v1.1 Upgrade (339 agen — COMPLETE)**: Semua agen SBU di database diupgrade dengan blok ABD v1.1 via `scripts/upgrade-sbu-abd.ts`. Blok yang diinjeksikan: CATATAN REGULASI WAJIB (Permen PU 6/2025 acuan utama; SK Dirjen 37/2025 JANGAN jadi acuan teknis), POLA KERJA v2.0 (ELICIT MAX 1 PUTARAN, ANTI INTERROGATION, REFLECT, ANTI HUMAN-AS-API), STATE MACHINE (INIT→ELICIT→PLAN→DELIVER), ANTI-BLOCK DOCTRINE (ABD-7 output + [ASUMSI:] wajib), GUARDRAILS ABD (DILARANG Permen 8/2022, DILARANG SBU pasti terbit). Marker: `SBU_ABD_v1.1_UPGRADED`. Cakupan: SBU PK (IDs 404–412), SBU KK (IDs 413–418), SBU AIO (419–427), SBU Terintegrasi (428–437), SBU JPTL (549–555, 563), SBU Migas/EBT/Tambang (564–574), dan seluruh agen konstruksi terkait lainnya.

- **SBUCLAW-ORCHESTRATOR (ID 1404 — SEEDED + ABD-COMPLIANT)**: OpenClaw Multi-Agent Pembuatan SBU Konstruksi — 10 specialist sub-agents (IDs 1394–1403): AGENT-MAPPER (Smart Mapping Subklas), AGENT-QUALIFY (Gap Analysis Kualifikasi), AGENT-DOCS (Checklist Dokumen), AGENT-SKKMATCH (Pencocokan SKK), AGENT-LETTERGEN (Draft Surat 5 jenis), AGENT-COST (Estimasi Biaya & Timeline), AGENT-ASSESS (Asesmen Kesiapan BUJK 8 dimensi), AGENT-OSS (Walkthrough OSS-RBA & LPJK), AGENT-COMPLY (Regulasi & Compliance), AGENT-INTEGRITY (ABD Overlay & Anti-Fraud). Cakupan: BS · BG · IL · IM · KO. Regulasi: **Permen PU No. 6 Tahun 2025** (menggantikan Permen PU 8/2022). Catatan: SK Dirjen No. 37/2025 masih berpedoman Permen lama — JANGAN jadi acuan; SK Dirjen baru (segera terbit) akan berpedoman Permen PU 6/2025. Setiap agen: INPUT MINIMAL, HEURISTIK DEFAULT, ABD-7 output, confidence score, [ASUMSI:] eksplisit, INTER-AGENT TRIGGERS.

- **KONSTRA-ORCHESTRATOR (ID 1281 — SEEDED + ABD-COMPLIANT)**: OpenClaw Multi-Agent Manajemen Konstruksi — 9 specialist sub-agents (IDs 1272–1280): AGENT-PROXIMA (PM), AGENT-TEKNIK (Engineering), AGENT-KONTRAK (Kontrak/FIDIC), AGENT-SAFIRA (K3/SMK3), AGENT-MUTU (QC/ISO9001), AGENT-ENVIRA (LH/ISO14001), AGENT-EQUIPRA (Peralatan/OEE), AGENT-LOGIS (Supply Chain), AGENT-FINTAX (Keuangan/PSAK34/PPh). All 10 agents seeded via `scripts/seed-konstra-agents.ts` with ABD v1.1 prompts (Anti-Blocking Doctrine ABD-1 to ABD-7). Each specialist has: 5-field INPUT MINIMAL, HEURISTIK DEFAULT tables, INTER-AGENT TRIGGERS, STRUKTUR OUTPUT WAJIB (confidence score + asumsi + sitasi). KONSTRA-ORCHESTRATOR has agenticSubAgents with all 9 IDs configured for parallel orchestration.

- **Gustafta Apps Feature Access System**: Plan-gated feature access for Gustafta Apps. Tiers: `free` (0), `starter` (1), `profesional` (2), `bisnis` (3), `enterprise` (4). Source of truth: `shared/feature-plans.ts`. Hook: `client/src/hooks/use-feature-access.ts`. Gate component: `client/src/components/feature-gate.tsx`. Pages: `/onboarding` (plan selection), `/my-subscription` (plan dashboard). API: `GET /api/subscriptions/my`, `GET /api/subscriptions/features`. Admin activates via `POST /api/subscriptions/activate/:id`. New plan keys accepted by `/api/subscriptions/create`: `starter`, `profesional`, `bisnis`, `enterprise` (saved as `pending`, admin confirms after WA payment).

## User preferences
Preferred communication style: Simple, everyday language.

## Gotchas
- **FEDERATION_MODE v2 marker**: Embedded in DB prompts for upgraded orchestrators (e.g., agents 24, 27). Seed checks this and skips overwriting. NEVER remove this marker.
- **Agent Cache 5 min TTL**: Restart server after bulk SQL prompt/agenticSubAgents updates to clear cache.
- **Database Indexes**: Queries on `parent_agent_id`, `toolbox_id`, `kb.agent_id`, `chunks.agent_id` need indexes.
- **Cache Invalidation**: All write operations must properly invalidate relevant cache keys.
- **LexCom Admin Key**: Admin KB uploads require `x-legal-admin-key` header.
- **Disabled Agents**: `/api/chat/config/:agentId` and `/api/widget/config/:agentId` return 503 if agent is disabled.
- **callAgentInternal signature**: `(agentId, userMessage, conversationHistory?, timeoutMs=25000)` — v2. Batch endpoint still uses old 2-arg call (fine for batch).
- **Sub-agent maxTokens**: `Math.max(1500, Math.min(3000, subAgent.maxTokens ?? 1500))` — minimum guaranteed 1500.
- **FALLBACK template**: `[ASUMSI: {nilai} | basis: {regulasi/heuristik} | verifikasi-ke: {pihak}]`

## Pointers
- **Inter-Agent API**: `server/routes.ts` orchestration block ~line 2806
- **Test Tracker Storage**: `gustafta_test_tracker_v1` (Tender), `gustafta_fed_tracker_v1` (Federation), `gustafta_pilot_tracker_v1` (Pilot), `gustafta_konstra_tracker_v1` (KONSTRA grid), `gustafta_konstra_signoff_v1` (Sprint 4 Sign-Off SO-1…SO-6) — localStorage
