# Gustafta - AI Chatbot Builder

## Overview

Gustafta is an AI chatbot builder platform designed to help users create, configure, and deploy intelligent conversational assistants. It features a two-panel dashboard for managing multiple chatbot agents, each with custom personas, knowledge bases, and multi-channel integrations. The platform supports various AI models and allows for extensive customization, including persona details, greeting messages, and language options. Users can integrate chatbots with popular messaging platforms, embed them as web widgets, and access analytics. Gustafta also includes a built-in assistant chatbot for guidance and offers templates for various industries. The platform uses a 5-level modular hierarchical structure for Jasa Konstruksi compliance: Tujuan (Goal/Series) → Hub Utama (Global Navigator) → Modul Hub (Domain Navigator) → Toolbox (Chatbot Spesialis) → Agen (Micro Tools). Current implementation covers 4 compliance domains: Perizinan Usaha (Legal & OSS), SBU (Sertifikat Badan Usaha), SKK (Sertifikasi Kompetensi Kerja), and Tender & Pengadaan. Hub layers (Utama & Modul) only navigate/route — never analyze. Toolbox chatbots are domain-specific specialists with strict boundary rules. Cross-module integration uses Summary Protocol: SKK_SUMMARY, SBU_SUMMARY, LICENSING_SUMMARY. Tender Readiness Checker acts as integrator consuming summaries. Governance Rulebook prevents domain overlap. Schema: toolboxes.isOrchestrator (boolean) + toolboxes.seriesId (nullable FK to series) + toolboxes.bigIdeaId made nullable for HUB toolboxes. DB tables use English names (series, big_ideas, toolboxes, agents) while UI labels use Indonesian terms. Seed data in server/seed-regulasi.ts. The "Chatbot Series" feature allows organizing multiple Big Ideas into structured topic packages with public catalog and detail pages. A key feature is "Project Brain," which provides contextual data for chatbots, enabling specialized "Mini Apps" for tasks like project snapshots, decision summaries, and risk assessments. The platform integrates with Mayar.id for subscription management. Each chatbot has a dedicated public chat page (`/bot/:agentId`) serving as its "home" where end-users can interact directly without needing dashboard access. Dynamic PWA manifest per chatbot: each bot shows its own avatar/name when installed on mobile devices.

### RAG Toggle
- **Purpose**: Allows admins to enable/disable RAG (Retrieval Augmented Generation) per chatbot. Useful for orchestrator chatbots that don't need knowledge base lookups.
- **Schema**: `ragEnabled` boolean field on `agents` table (default true).
- **UI**: Toggle switch in Knowledge Base panel header. When disabled, "Tambah Knowledge" button is also disabled.
- **Server-side**: All three chat endpoints (non-stream, stream, external/WhatsApp) check `agent.ragEnabled !== false` before querying RAG chunks or knowledge bases.

### Modul Public Chat Page
- **Purpose**: Share all chatbots within a Modul (Big Idea) via a single link at `/modul/:bigIdeaId`.
- **API**: `GET /api/public/modul/:bigIdeaId` returns Modul info + list of public agents across active, non-orchestrator toolboxes. Validates isActive on BigIdea and isPublic+isActive on parent Series.
- **UI**: Grid of chatbot cards with avatar, name, tagline, category. Clicking a card opens inline chat with streaming support.
- **Widget Panel**: Shows "Link Modul (Multi-Chatbot)" section with copy/open buttons when bigIdeaId is available.

### Project Context (Konteks Proyek)
- **Purpose**: Allows chatbots to ask context questions at the start of conversations (e.g., "What type of project are you managing?") to personalize responses.
- **Configuration**: Admin defines context questions in Persona Panel → "Konteks Proyek" section. Each question has a label, type (text/select), options (for select type), and required flag.
- **Chat Flow**: When a chatbot has context questions, end-users see a form on the welcome screen before chatting. Answers are saved per session in localStorage and sent with every message.
- **Server-side**: Context answers are injected into the system prompt as "KONTEKS PROYEK" block, enabling the AI to tailor responses based on user's specific context (e.g., project type, scale, phase).
- **Schema**: `contextQuestions` field on `agents` table (jsonb array of `{id, label, type, options, required}`).

### User Memory System
- **Purpose**: Chatbots can remember user-provided information across conversations (facts, preferences, notes).
- **AI Detection**: The AI detects save/recall commands via special tags (`[SAVE_MEMORY]`, `[DELETE_MEMORY]`) in its response, processed server-side.
- **Categories**: "memory" for facts/preferences, "note" for to-do/catatan.
- **Per-Session**: Memories are scoped to agent+session, so different users have separate memories.
- **Chat Integration**: Existing memories are injected into system prompt as "INGATAN PENGGUNA" block. AI uses them to personalize responses.
- **Frontend Handling**: Memory tags are stripped from streamed responses in real-time to avoid displaying raw tags.
- **Schema**: `user_memories` table with `agentId`, `sessionId`, `category`, `content`, `createdAt`.
- **API**: `GET/POST/DELETE /api/memories/:agentId`, `DELETE /api/memories/agent/:agentId`.

### Modul Bundle Monetization
- **Purpose**: Dual monetization system — per-Modul bundle pricing (access all specialist chatbots) and per-Chatbot individual pricing. HUB/Orchestrator always free.
- **Schema**: `monthlyPrice`, `trialEnabled`, `trialDays`, `requireRegistration` fields on `big_ideas` table. `bigIdeaId` column on `client_subscriptions` for bundle subscriptions.
- **API**: `POST /api/modul/:bigIdeaId/subscribe` creates bundle subscription. `GET /api/modul/:bigIdeaId/access?email=&token=` checks access. Public modul API returns `pricing` object.
- **Admin UI**: Pricing fields in Create/Edit Modul dialogs under "Monetisasi Modul" section.
- **Public UI**: Paywall/upgrade wall in modul-chat.tsx. Shows pricing card, trial/subscribe buttons, and registration form when modul has monthlyPrice > 0. Supports Mayar.id payment flow with redirect and localStorage-based access token persistence.
- **Access Logic**: Free moduls (monthlyPrice=0) always accessible. Paid moduls check for active bundle subscription by email or access token.

### Monetization Protection System
- **Guest Message Limit**: Configurable per chatbot (default: 10). Server-side tracking via IP+UA fingerprint. When guests exceed limit, upgrade wall is shown prompting registration.
- **Trial Period**: Configurable trial days (default: 7). Auto-expires subscriptions. Frontend warns users when trial has ≤2 days left.
- **Registered User Quotas**: Daily and monthly message limits enforced server-side. Counters reset automatically.
- **Upgrade Wall**: Professional overlay shown when any limit is reached. Supports guest registration, trial-to-paid upgrade, and renewal flows via Mayar.id payment gateway.
- **Server-side Enforcement**: All quota checks happen server-side on `/api/messages/stream` endpoint - cannot be bypassed from client.
- **Voucher System**: Admin can create voucher codes (unlimited access or extra quota type) via dashboard Voucher panel. Users redeem vouchers in the upgrade wall. Voucher holders with plan="voucher" bypass quota limits. Server validates: isActive, expiresAt, maxRedemptions, per-user dedup, agent scope. Schema tables: `vouchers`, `voucher_redemptions`.

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

The frontend employs a feature-based organization, including components for panels, dialogs, and a mobile-first floating chat widget. It utilizes custom React hooks for data fetching and implements optimistic updates for a responsive user experience. Light/dark mode theming is supported.

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Runtime**: Node.js with `tsx`
- **API Style**: RESTful JSON API
- **Build**: esbuild

The server manages CRUD operations for agents, knowledge bases, integrations, message storage, and user authentication. It handles webhook integrations for external services like WhatsApp. The chat system supports intelligent file processing: image analysis via GPT-4o vision, document text extraction (PDF, Word, Excel), video audio transcription, YouTube transcript fetching, and Google Drive/OneDrive file reading.

### Data Storage
- **ORM**: Drizzle ORM with Zod validation
- **Database**: PostgreSQL (with in-memory fallback for development)
- **Session Store**: connect-pg-simple

The schema includes tables for `agents` (with extensive configuration options, AI model settings, enhanced persona fields, access control, product monetization fields, and conversion layer settings), `knowledgeBases`, `integrations`, `agentMessages`, `users`, `userProfiles`, `analytics`, `bigIdeas` (with `seriesId` and `sortOrder` fields), `toolboxes`, `series` (top-level grouping entity), `subscriptionsNew`, `project_brain_templates`, `project_brain_instances`, `mini_apps`, `mini_app_results`, `clientSubscriptions` (end-user subscriptions to chatbot products), `affiliates` (referral partnership tracking), `leads` (conversion layer lead capture), and `scoring_results` (conversion layer assessment scoring). A hierarchical structure (`series` -> `bigIdeas` -> `toolboxes` -> `agents`) is enforced, where Series is the optional top-level grouping.

### Design Patterns
- **Two-Panel Layout**: Left navigation, right content.
- **Active Agent Context**: Content adapts to the selected agent.
- **Optimistic Updates**: For mutations and cache invalidation.
- **Theme System**: CSS custom properties for light/dark mode.
- **Context API**: Unified API for managing active `Big Idea` and `Toolbox` context.
- **Streaming Chat**: Real-time AI responses via Server-Sent Events (SSE).
- **Project Brain**: Structured template and instance data for contextual chatbot interactions, with anti-prompt injection mechanisms.
- **Mini Apps**: Configuration-driven, AI-powered applications that leverage Project Brain data for specialized outputs (e.g., project snapshots, risk radars, scoring assessments, gap analyses, recommendations).
- **Chatbot Series**: Grouping multiple Big Ideas into structured topic packages with public catalog (`/series`), detail pages (`/series/:slug`), and admin management dialog in dashboard.
- **Conversion Layer**: Revenue-oriented system that transforms chatbots from knowledge bots into revenue engines. Includes: lead capture (with configurable form fields), scoring & assessment (rubrics with thresholds), CTA triggers (after N messages or on score threshold), offer/paket penawaran cards, WhatsApp CTA, Calendly integration. Configured via "Conversion" panel in dashboard. Smart CTA cards appear in public chat automatically based on configured triggers. New mini app types: scoring_assessment, gap_analysis, recommendation_engine, lead_capture_form. Schema tables: `leads`, `scoring_results`. Agent fields: conversionEnabled, conversionGoal, conversionCta, conversionOffers, leadCaptureFields, scoringEnabled, scoringRubric, scoringThresholds, ctaTriggerAfterMessages, ctaTriggerOnScore, whatsappCta, calendlyUrl.

### UI/UX Decisions
- Inspired by Botika Online's two-panel dashboard.
- Mobile-first design for the floating chat widget.
- Professional templates for various industries and use cases.
- Dynamic widget embed system for flexible deployment.
- **Multi-sector landing pages**: Generic platform landing at `/` with sector grid linking to `/sector/:sectorId` pages. 12 featured sectors with tailored content (engineering, medical, education, finance, retail, legal, hospitality, marketing, customer_success, real_estate, creative, logistics). Sector content stored in `client/src/lib/sector-content.ts`.
- **Rangkuman Chatbot (Chatbot Summary Export)**: Auto-generated comprehensive summary of all chatbot data (identity, persona, expertise, features, knowledge bases, settings, monetization) for use as reference when building landing pages on external platforms (Carrd, Notion, Google Sites, etc.). Supports copy-to-clipboard, download as Markdown (.md), and download as HTML (.html). Includes external URL field to link to landing pages built elsewhere. Located in "Rangkuman Chatbot" panel in dashboard.
- **Brief Marketing (Marketing Brief Export)**: Auto-generated marketing brief from chatbot data (product profile, USP, brand voice, pricing, offers, pain points, benefits, testimonials, FAQ) for use when creating ad copy, social media content, and marketing materials on external platforms. Supports copy-to-clipboard, download as Markdown (.md), and download as HTML (.html). Includes external URL field for marketing kit links and Meta Pixel ID for tracking. Located in "Brief Marketing" panel in dashboard.

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
- Vite (with Replit-specific plugins)
- TypeScript
- PostCSS (Tailwind, Autoprefixer)

### Integrations
- OpenAI (GPT-4o, GPT-3.5)
- DeepSeek
- Claude
- Fonnte (WhatsApp integration)
- Mayar.id (payment gateway)
- Replit Auth (OAuth/OIDC)