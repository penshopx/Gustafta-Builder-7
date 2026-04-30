# Gustafta - AI Chatbot Builder

## Overview
Gustafta is an AI chatbot builder platform for creating, configuring, and deploying intelligent conversational assistants. It features a two-panel dashboard, multi-channel integrations, and supports various AI models. The platform allows users to manage multiple chatbot agents with custom personas and knowledge bases. Key capabilities include integration with popular messaging platforms, web widget embedding, and analytics. Gustafta aims to provide an extensive ecosystem for building and monetizing AI-powered conversational experiences.

The platform employs a 5-level modular hierarchical structure (Series → Core → Big Idea/Orkestrator → Toolbox → Agent) to manage numerous chatbot agents across various specialized series. For example, specific series are designed for Indonesian construction companies, covering the full Odoo ERP lifecycle (Readiness, Implementation, and Data Migration) and Contractor Safety Management System (CSMS) compliance.

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
-   OpenAI (GPT-4o, GPT-3.5)
-   DeepSeek
-   Claude
-   Fonnte (WhatsApp)
-   Transfer Bank Manual (BCA/Mandiri/BRI)
-   Replit Auth (OAuth/OIDC)
-   Notion (two-way sync for knowledge base and AI analysis exports)
-   `youtube-transcript` (for YouTube content extraction)
-   `ffmpeg` (for video audio extraction)
-   `pdf-parse` (for PDF text extraction)
-   `mammoth` (for DOCX text extraction)