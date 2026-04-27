# Gustafta - AI Chatbot Builder

## Overview

Gustafta is an AI chatbot builder platform designed to create, configure, and deploy intelligent conversational assistants. It features a two-panel dashboard for managing multiple chatbot agents, each with custom personas, knowledge bases, and multi-channel integrations. The platform supports various AI models and extensive customization. Users can integrate chatbots with popular messaging platforms, embed them as web widgets, and access analytics. Gustafta also includes a built-in assistant chatbot for guidance and offers templates for various industries.

The platform employs a 5-level modular hierarchical structure (Series → Core → Big Idea/Orkestrator → Toolbox → Agent) for Jasa Konstruksi compliance across 26 series, totaling approximately 306 chatbot agents. A key feature is "Project Brain," providing contextual data for chatbots, enabling specialized "Mini Apps" for tasks like project snapshots, decision summaries, and risk assessments. A "Deliverables" panel allows builders to define output types for each agent, with various pre-built bundles and quick-action chat buttons.

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