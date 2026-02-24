# Gustafta - AI Chatbot Builder

## Overview

Gustafta is an AI chatbot builder platform enabling users to create, configure, and deploy intelligent conversational assistants. It features a two-panel dashboard for managing multiple chatbot agents, each with custom personas, knowledge bases, and multi-channel integrations. The platform supports various AI models and extensive customization, including persona details, greeting messages, and language options. Users can integrate chatbots with popular messaging platforms, embed them as web widgets, and access analytics. Gustafta also includes a built-in assistant chatbot for guidance and offers templates for various industries.

The platform employs a 5-level modular hierarchical structure (Tujuan → Hub Utama → Modul Hub → Toolbox → Agen) for Jasa Konstruksi compliance, currently covering Perizinan Usaha (7 specialists including OSS RBA/KBLI/Sertifikat Standar), SBU (4 specialists), SKK (5 specialists), and Tender & Pengadaan (4 specialists) domains — totaling 25 chatbot agents. A key feature is "Project Brain," providing contextual data for chatbots, enabling specialized "Mini Apps" for tasks like project snapshots, decision summaries, and risk assessments. The platform integrates with Mayar.id for subscription management and provides public chat pages for individual bots and multi-chatbot modules. Dynamic PWA manifests are supported for individual chatbots.

Core features include a RAG toggle for controlling knowledge base lookups, "Project Context" for personalizing conversations via user-provided information, and a "User Memory System" allowing chatbots to recall facts across sessions. Monetization is handled via per-Modul bundle pricing and per-Chatbot individual pricing, with guest message limits, trial periods, registered user quotas, and a voucher system protected by server-side enforcement. A "Conversion Layer" transforms chatbots into revenue engines through lead capture, scoring, and smart CTA triggers.

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

The schema enforces a hierarchical structure (`series` -> `bigIdeas` -> `toolboxes` -> `agents`) and includes tables for agents, knowledge bases, integrations, messages, users, analytics, monetization, project brain templates/instances, mini-apps, client subscriptions, affiliates, leads, and scoring results.

### Design Patterns
- **Two-Panel Layout**: Left navigation for global context, right panel for selected content.
- **Active Agent Context**: UI content adapts dynamically based on the selected chatbot agent.
- **Optimistic Updates**: For a responsive user experience during data mutations.
- **Theme System**: CSS custom properties for light/dark mode.
- **Context API**: Manages active `Big Idea` and `Toolbox` context.
- **Streaming Chat**: Real-time AI responses using Server-Sent Events (SSE).
- **Project Brain**: Structured template and instance data for contextual chatbot interactions with anti-prompt injection.
- **Mini Apps**: Configuration-driven, AI-powered applications leveraging Project Brain data for specialized outputs (e.g., project snapshots, risk radars, scoring assessments).
- **Chatbot Series**: Groups multiple Big Ideas into structured topic packages with public catalog and detail pages.
- **Conversion Layer**: Revenue-oriented system enabling lead capture, scoring/assessment, and CTA triggers within chatbots.

### UI/UX Decisions
- Inspired by a two-panel dashboard design.
- Mobile-first approach for the chat widget.
- Professional templates for various industries.
- Dynamic widget embed system.
- Multi-sector landing pages with tailored content.
- **Rangkuman Chatbot (Chatbot Summary Export)**: Auto-generates comprehensive chatbot data summaries for external landing page creation (Markdown, HTML export).
- **Brief Marketing (Marketing Brief Export)**: Auto-generates marketing briefs from chatbot data for ad copy and marketing materials (Markdown, HTML export), including Meta Pixel ID integration.

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
- Mayar.id (payment gateway)
- Replit Auth (OAuth/OIDC)