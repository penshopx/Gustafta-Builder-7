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
- **Test Tracker**: 4-tab evaluation tool — Tender (35 sel, 5 bot × 7 T-test) + Federation (655 sel, 131 hub × 5 F-test) + Pilot (42 sel, 6 bot × 7 T-test, target ≥90% pass) + **KONSTRA (70 sel, 10 agen × 7 AC ABD v1.1, Sprint 4 sign-off ≥14/16 TC)**. Route: `/test-tracker`. (DB: 106 orchestrators, 971 agents total, 132 hub dengan sub-agents)
- **SCORECARD/WIN PROBABILITY (129/129 hubs — COMPLETE)**: All 129 Federation orchestrators upgraded with 4-dimension `┌──...┐` table scorecard + `PROBABILITAS X %` + `KEPUTUSAN:` line. Rumus weights vary by hub type. Covers: Tender, SBU, SKK, ISO 9001/14001, SMAP, PANCEK, Odoo, LSBU, LSP, ASKOM, AJJ, Legal Konstruksi, LexCom Wings, SKKNI Jabatan Kerja (PKBG-ARS/MPBG/PKFS/PBH/MPK/MK-CM/QS/QE/K3K/JLN/JBT/REL/TWG/PJJ), Project Management (StrategiTender/DokPenawaran/EksekusiKontrak/Perencanaan/Operasional/Pengendalian/Hukum/PlaybookBNSP), Personel Manajerial BUJK, dan seluruh discipline hubs.
- **T5-HANDOVER (103/103 orchestrators — COMPLETE)**: All active orchestrators upgraded with domain-specific `HANDOVER — TOPIK DI LUAR DOMAIN` block. Bot gracefully acknowledges out-of-domain queries, names the correct resource, and redirects back to core domain. Marker: `luar domain` in system_prompt.
- **F3-FALLBACK MODE (103/103 orchestrators — COMPLETE)**: All active orchestrators upgraded with `FALLBACK MODE — OPERASIONAL MANDIRI` block. Bot answers independently when sub-agents unavailable, using domain-specific 4-perspective coverage + `[ASUMSI: ...]` tagging. Marker: `FALLBACK` in system_prompt.
- **MASTER STANDAR v2.0 (129/129 hubs — COMPLETE)**: All 129 SYNTHESIS ORCHESTRATOR hubs upgraded with full Master Standard v2.0 — 5 universal blocks: (1) POLA KERJA v2.0 (ELICIT MAX 1 PUTARAN, ANTI INTERROGATION MODE, REFLECT SEBELUM DELIVER, ANTI HUMAN-AS-API), (2) STATE MACHINE 7-langkah (INIT→ELICIT→PLAN→DISPATCH→AGGREGATE→REFLECT→DELIVER). Fixes L0.5→L2.5 anti-patterns (Test A/B, 6 Mei 2026). Modul Tender 5-bot (IDs 23–27) fully rewritten standalone-agentic. Markers: `POLA KERJA v2.0`, `STATE_MACHINE_v2.0` in system_prompt.
- **Mini Apps (41 types — COMPLETE)**: All Master Standar Gustafta v1.0 types + Bekerja & Berusaha hub implemented — `rubric_scoring`, `risk_register`, `work_mode_selector`, `mentoring_plan`, `brief_intake`, `studio_kompetensi`, plus **Bekerja Hub**: `meeting_notes` (AI Notulis & Ringkas Rapat), `contract_drafter` (AI Drafter Kontrak/SPK/NDA/MoU), `rab_estimator` (RAB & Estimasi Biaya), `kpi_report` (Laporan KPI & Kinerja Tim); plus **Berusaha Hub**: `social_media_copy` (AI Copywriter Konten Medsos), `sales_script` (Sales Script & Objection Handling), `cashflow_report` (Laporan Cashflow & Keuangan), `customer_feedback` (Survey Kepuasan & NPS Tracker). All 41 registered in schema.ts, mini-apps-panel.tsx, server/routes.ts. UI: Two new hub cards (emerald Bekerja, orange Berusaha) shown in Mini Apps panel above mini-apps list.
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
