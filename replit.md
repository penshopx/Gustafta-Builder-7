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
- **Legal AI Configuration**: `server/lib/legal-agents.ts`
- **AI Field Regeneration Component**: `client/src/components/ai-field-regen.tsx`
- **Config Health Widget**: `client/src/components/config-health.tsx`
- **MultiClaw Orchestration Planner**: `client/src/components/agentic-ai-panel.tsx`
- **Midtrans Integration**: `server/lib/midtrans.ts`
- **Legal Landing Page**: `client/src/pages/legal-landing.tsx`
- **Legal Chat Interface**: `client/src/pages/legal-chat.tsx`
- **Chaesa Lexbot Widget**: `client/src/components/chaesa-widget.tsx`
- **Templates**: `server/db/schema.ts` (chatbot_templates table)
- **Storefront Products**: `server/db/schema.ts` (store_products table)

## Architecture decisions
- **5-Level Modular Hierarchy**: Agents are organized Master → Series HUB → Sub-HUB → Specialist → Deep Specialist for scalability and detailed categorization.
- **Two-Panel Dashboard Layout**: Separates global navigation from selected content for improved UX.
- **Optimistic UI Updates**: Enhances responsiveness by immediately reflecting user actions.
- **Project Brain & Mini Apps**: Provides contextual data for chatbots, enabling specialized, configuration-driven applications with anti-prompt injection.
- **Multi-Provider LLM Fallback**: Implements a chain of LLM providers (OpenAI → DeepSeek → Qwen → Gemini) to ensure reliability.
- **Agentic Integration Layer**: Dynamically builds system prompts based on persona and policies, unifying chat, Project Brain, and external channels.
- **Inter-Agent API (L2.5)**: Orchestrator agents call sub-agents in parallel via `callAgentInternal()` (no HTTP overhead); results injected into orchestrator context before streaming final synthesis. SSE events: `orchestrating_start`, `sub_agent_start`, `sub_agent_done`, `aggregating`. Config via `agenticSubAgents` jsonb on agents table.

## Product
- **AI Chatbot Builder**: Create, configure, and deploy intelligent conversational agents.
- **LexCom Legal AI**: Integrated system with 12 specialized legal agents and a floating "Chaesa Lexbot" widget for Indonesian legal assistance.
- **MultiClaw/OpenClaw Multi-Agent Pipelines**: Advanced AI orchestration for tender analysis, studio enhancement, product generation, and broadcast personalization.
- **Dynamic Knowledge Base**: Supports hierarchical classification, versioning, source attribution, and various upload types (documents, YouTube, audio/video).
- **Monetization & Conversion Layer**: Flexible pricing, lead capture, scoring, and smart call-to-action triggers.
- **Chatbot Templates**: Gallery of pre-built chatbot configurations that users can adapt or publish their own to.
- **Gustafta Store**: A public marketplace for selling pre-configured chatbots to external customers.
- **Midtrans Payment Gateway**: Seamless integration for subscription payments and store purchases.
- **Agent Management**: Features like on/off toggles, folder grouping, and JSON import/export for chatbots.
- **AI-Powered Marketing Kit**: Generates landing pages, taglines, social posts, and other marketing content from chatbot configurations.

## User preferences
Preferred communication style: Simple, everyday language.

## Gotchas
- **Database Indexes**: Queries on `parent_agent_id`, `toolbox_id`, `kb.agent_id`, and `chunks.agent_id` require indexes for optimal performance.
- **Cache Invalidation**: All write operations (create/update/delete) must properly invalidate relevant cache keys to prevent stale data.
- **LexCom Admin Key**: Admin-level KB uploads for LexCom require the `x-legal-admin-key` header for authentication.
- **Disabled Agents**: `/api/chat/config/:agentId` and `/api/widget/config/:agentId` return 503 if an agent is disabled.

## Pointers
- **shadcn/ui Documentation**: _Populate as you build_
- **Drizzle ORM Documentation**: _Populate as you build_
- **TanStack React Query Documentation**: _Populate as you build_
- **Midtrans API Documentation**: _Populate as you build_
- **OpenAI API Documentation**: _Populate as you build_