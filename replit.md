# Gustafta - AI Chatbot Builder + LexCom Legal AI

## Overview
Gustafta is an AI chatbot builder platform designed for creating, configuring, and deploying intelligent conversational assistants. It now includes **LexCom**, an integrated Indonesian Legal AI Chatbot system featuring a LEX-ORCHESTRATOR with 12 specialized legal agents and a floating "Chaesa Lexbot" widget. It features a two-panel dashboard, multi-channel integrations, and supports various AI models. The platform enables users to manage multiple chatbot agents with custom personas and knowledge bases, integrate with popular messaging platforms, embed web widgets, and access analytics. Gustafta aims to provide a comprehensive ecosystem for building and monetizing AI-powered conversational experiences.

The platform utilizes a 5-level modular hierarchical structure (Series → Core → Big Idea/Orkestrator → Toolbox → Agent) to organize chatbot agents across specialized series. This structure supports applications like managing Indonesian construction company needs (Odoo ERP lifecycle, CSMS compliance) and professional certification body operations.

A key feature is "Project Brain," which provides contextual data for chatbots, enabling specialized "Mini Apps" for tasks like project snapshots and risk assessments. A "Deliverables" panel allows defining output types for each agent, with pre-built bundles and quick-action chat buttons.

Gustafta converts any chatbot into four digital products: eBook Kompetensi, eCourse Modul Belajar, Generator Dokumen, and Chaesa AI Studio Bridge for external AI prompt generation. Monetization is supported through flexible pricing models, guest message limits, trial periods, and a voucher system. A "Conversion Layer" handles lead capture, scoring, and smart call-to-action triggers. Chatbots can include an "Orchestrator Multi-Agent" system for routing messages to specialist agents based on intent.

## MultiClaw / OpenClaw Multi-Agent Feature Upgrades

Gustafta now features **OpenClaw/MultiClaw** — a suite of multi-agent AI pipelines embedded across 4 key panels:

### 1. Info Tender — MultiClaw 4-Agent Pipeline
- **Endpoint**: `POST /api/ai/tender-multiclaw`
- **Agents**: LPSE Analyst → Compliance Checker → Gap Analyst → Document Drafter
- **UI**: "MultiClaw" button on each tender card opens a dialog with animated stage reveal, compliance score, and tabbed results (LPSE | Checklist | Gap | Draft Dokumen)

### 2. Studio Kompetensi — MultiClaw 3-Stage Enhancement
- **Endpoint**: `POST /api/ai/studio-multiclaw`
- **Agents**: Proposal Analyzer → Config Enhancer → KB Enricher
- **UI**: "Perkaya dengan MultiClaw" button appears after document import; auto-applies enhanced fields to proposal and adds KB chunks

### 3. Ekosistem Kompetensi — MultiClaw Parallel Product Factory
- **Endpoint**: `POST /api/ai/ekosistem-multiclaw`
- **Agents**: eBook Agent + eCourse Agent + DocGen Agent + Chaesa Bridge Agent (all parallel)
- **UI**: "Generate Semua Produk (MultiClaw)" button in header; dialog with 4 colored agent cards and tabbed product outlines

### 4. Broadcast WA — OpenClaw Gate + Personalization Agent
- **Endpoint**: `POST /api/ai/broadcast-personalize`
- **OpenClaw Gate**: "Kirim Sekarang" now requires confirmation dialog (shows recipient count, message preview, irreversibility warning)
- **Personalization Agent**: "Personalisasi AI" button near template textarea; generates per-contact personalized messages and an improved general version
- **UI**: Two dialogs — gate confirmation + personalization results with apply-to-template action

## LexCom Integration in Agent Builder (Task #3)

The 12 LexCom legal specialist agents are now fully integrated into the Gustafta agent builder:

- **12 LexCom Templates** added to the template picker (category: "LexCom Spesialis Hukum"):
  - Lex Kriminal (Hukum Pidana), Lex Civil (Hukum Perdata), Lex Corp (Hukum Korporasi)
  - Lex Labor (Hukum Ketenagakerjaan), Lex Agraria (Hukum Pertanahan), Lex Fiscus (Hukum Pajak)
  - Lex Praesidium (Yurisprudensi), Lex Scriptor (Legal Drafting), Lex Advocatus (Litigasi)
  - Lex Insolventia (Kepailitan & PKPU), Lex Nexus (Lintas Bidang), Lex Futura (Hukum Emerging)
- **Category filter tabs** added to the template dialog for easy browsing
- **LexCom quick-start card** in the "Create Agent" dialog that opens directly to LexCom templates
- **"Template LexCom" button** in the Persona panel's system prompt section for applying LexCom templates to existing agents
- Templates work with the existing agent infrastructure; users can attach legal documents via the KB panel to extend each specialist agent with RAG-based retrieval

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
The schema enforces a hierarchical structure (`series` -> `bigIdeas` -> `toolboxes` -> `agents`) and includes tables for managing various platform entities from agents to client subscriptions and analytics.

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
-   Two-panel dashboard design.
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
-   **Chat UI Markdown Renderer**: Renders chat assistant messages with a comprehensive set of markdown features.
-   **Studio Kompetensi (Ekosistem 5-Produk)**: A dual-gate system for importing documents and exporting chatbot configurations into five competency products.
-   **Chaesa AI Studio Bridge**: An adapter that maps Gustafta chatbot configurations to the schema used by Chaesa AI Studio.
-   **Multi-Provider Chat Fallback**: Implements a fallback chain for LLM calls (OpenAI → DeepSeek → Qwen → Gemini) if the primary stream creation fails.
-   **Admin Panel & Role Hierarchy**: Supports `superadmin`, `admin`, and `user` roles with differentiated access to user management, subscription management, and trial request handling.

## Multi-Agent Strengthening Features (Latest)

### 1. AI Field Regen (`client/src/components/ai-field-regen.tsx`)
- Small 🪄 Wand icon button placed next to each individual field label in Persona and Policy panels
- Calls `POST /api/ai/regen-field` with field name, current value, and agent context
- Shows a popover with AI-generated suggestion + Rationale, with "Terapkan" / "Ulangi" / "Abaikan" actions
- Applied to 7 Persona fields: name, tagline, description, greetingMessage, philosophy, systemPrompt, offTopicResponse
- Applied to 6 Policy fields: conversationWinConditions, brandVoiceSpec, interactionPolicy, domainCharter, qualityBar, riskCompliance

### 2. Config Health Widget (`client/src/components/config-health.tsx`)
- Client-side completeness score for agent configuration
- Weighted scoring: each field checked for minimum character threshold
- Color-coded: red (<40%), amber (40-75%), green (≥75%)
- Shows filled/missing field badges and guidance message
- Integrated into top of Persona panel and Policy panel

### 3. MultiClaw Orchestration Planner (in `agentic-ai-panel.tsx`)
- 2-stage AI endpoint `POST /api/ai/orchestration-plan`:
  - Stage 1: Domain analysis per agent (keywords, primary domain, strengths)
  - Stage 2: Full plan (routing rules, handoff protocols, gap/overlap analysis, orchestrator system prompt addition)
- UI card shows: executive summary, agent roster, routing rules (condition → agent), handoff protocols, gap analysis, orchestrator prompt update suggestion
- "Tambahkan ke System Prompt" button injects routing rules into the current agent's system prompt
- Only shown when agent has a toolboxId (i.e., is in a multi-agent toolbox)

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
-   OpenAI (GPT-4o, GPT-3.5)
-   DeepSeek
-   Qwen
-   Gemini
-   Claude
-   Fonnte (WhatsApp)
-   Transfer Bank Manual (BCA/Mandiri/BRI)
-   Replit Auth (OAuth/OIDC)
-   Notion
-   `youtube-transcript`
-   `ffmpeg`
-   `pdf-parse`
-   `mammoth`
## LexCom - Indonesian Legal AI Chatbot System

### Overview
LexCom is an integrated multi-agent legal AI system added to the Gustafta platform. It provides Indonesian legal research, drafting, and consultation via 12 specialized AI agents.

### Routes
- `/legal` — Dark-themed legal landing page with hero, agent badge grid, and feature cards
- `/legal/chat` — Full two-panel chat interface with agent switcher and session history

### Architecture
- **LEX-ORCHESTRATOR**: Routes queries to the most appropriate specialist agent automatically
- **12 Specialist Agents**: PIDANA, PERDATA, KORPORASI, KETENAGAKERJAAN, PERTANAHAN, PAJAK, YURISPRUDENSI, DRAFTER, LITIGASI, KEPAILITAN, MULTICLAW, OPENCLAW
- **Chaesa Lexbot Widget**: Floating bottom-right widget on all pages except `/legal/chat` and `/embed/*`

### Key Files
- `server/lib/legal-agents.ts` — All 13 agent configs (orchestrator + 12 specialists) with system prompts
- `server/lib/rag-service.ts` — RAG embedding/retrieval functions used for legal KB and case search
- `server/routes-legal.ts` — API routes: chat, sessions, KB management, case search
- `server/seed-legal-cases.ts` — Seeds 12 landmark putusan MA/MK with embeddings on first startup
- `client/src/pages/legal-landing.tsx` — Legal landing page
- `client/src/pages/legal-chat.tsx` — Chat interface with case search panel and admin KB panel
- `client/src/components/chaesa-widget.tsx` — Floating Chaesa Lexbot widget

### Database Tables
- `legal_chat_sessions` — Stores chat sessions per user
- `legal_chat_messages` — Stores chat messages linked to sessions
- `legal_knowledge_bases` — Admin-uploadable regulation documents (KUHP 2023, KUHPerdata, etc.)
- `legal_knowledge_chunks` — RAG chunks with vector embeddings for regulation documents
- `legal_cases` — Pre-indexed putusan MA/MK with embeddings for semantic and keyword search

### Case Search & Regulation RAG (Task #4)
- **Putusan database**: 12 seed cases spanning pidana, perdata, TUN, ketenagakerjaan, ketatanegaraan
- **Semantic search**: Embedding-based retrieval via `GET /api/legal/cases/search?q=...`
- **Admin KB upload**: `POST /api/legal/kb` (auth via `x-legal-admin-key` header) — chunks and embeds regulation text
- **RAG in chat**: All chat messages search the KB and case database; relevant chunks are injected into the system prompt
- **Citation format**: "Putusan MA No. XXX/Pid/YYYY/MARI" — consistent across all agents
- **UI**: "Cari Putusan" button in chat header opens a search panel; admin panel in sidebar for KB management

### Disclaimer
All legal chatbot responses include the mandatory disclaimer: "⚠️ Informasi ini bersifat edukatif dan bukan pendapat hukum yang mengikat."
