# Gustafta - AI Chatbot Builder

## Overview
Gustafta is an AI chatbot builder platform designed for creating, configuring, and deploying intelligent conversational assistants. It features a two-panel dashboard, multi-channel integrations, and supports various AI models. The platform enables users to manage multiple chatbot agents with custom personas and knowledge bases, integrate with popular messaging platforms, embed web widgets, and access analytics. Gustafta aims to provide a comprehensive ecosystem for building and monetizing AI-powered conversational experiences.

The platform utilizes a 5-level modular hierarchical structure (Series → Core → Big Idea/Orkestrator → Toolbox → Agent) to organize chatbot agents across specialized series. This structure supports applications like managing Indonesian construction company needs (Odoo ERP lifecycle, CSMS compliance) and professional certification body operations.

A key feature is "Project Brain," which provides contextual data for chatbots, enabling specialized "Mini Apps" for tasks like project snapshots and risk assessments. A "Deliverables" panel allows defining output types for each agent, with pre-built bundles and quick-action chat buttons.

Gustafta converts any chatbot into four digital products: eBook Kompetensi, eCourse Modul Belajar, Generator Dokumen, and Chaesa AI Studio Bridge for external AI prompt generation. Monetization is supported through flexible pricing models, guest message limits, trial periods, and a voucher system. A "Conversion Layer" handles lead capture, scoring, and smart call-to-action triggers. Chatbots can include an "Orchestrator Multi-Agent" system for routing messages to specialist agents based on intent.

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