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
- **Test Tracker**: `client/src/pages/test-tracker.tsx` (route `/test-tracker`) — dual-tab: Tender 35 sel + Federation 275 sel (55 hub × 5 F-test)
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
- **Federation Layer (55 hubs)**: 55 hub orchestrators with `agenticSubAgents` configured — parallel multi-agent synthesis covering Tender, SKK, SBU, Perizinan, ASKOM, CSMS, SMAP, PANCEK, Odoo, AJJ, KAN, Lisensi LSP, IT LSP, ISO 14001/9001, PJBU, Kontraktor/Konsultan, Perizinan & Legalitas, Sertifikasi, Admin BUJK, Competency Mentoring, Problem Solver, Skema Navigator, LKUT, plus 9 Discipline Hubs (Sipil, Arsitektur, Energi, Sains, Mekanikal, Manajemen Pelaksanaan, Pengembangan Wilayah, Arsitek Lanskap, Tata Lingkungan).
- **Dynamic Knowledge Base**: Hierarchical classification, versioning, source attribution, multiple upload types.
- **Monetization & Conversion Layer**: Pricing, lead capture, scoring, smart CTA triggers.
- **Chatbot Templates & Gustafta Store**: Public marketplace with Midtrans payment integration.
- **Test Tracker**: Dual-tab evaluation tool — Tender (35 sel, 5 bot × 7 test) + Federation (275 sel, 55 hub × 5 F-test). Route: `/test-tracker`.

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
- **Test Tracker Storage**: `gustafta_test_tracker_v1` (Tender), `gustafta_fed_tracker_v1` (Federation) — localStorage
