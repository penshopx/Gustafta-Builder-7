# Gustafta - AI Chatbot Builder

## Overview

Gustafta is an AI chatbot builder platform designed to help users create, configure, and deploy intelligent conversational assistants. It features a two-panel dashboard for managing multiple chatbot agents, each with custom personas, knowledge bases, and multi-channel integrations. The platform supports various AI models and allows for extensive customization, including persona details, greeting messages, and language options. Users can integrate chatbots with popular messaging platforms, embed them as web widgets, and access analytics. Gustafta also includes a built-in assistant chatbot for guidance and offers templates for various industries. The platform supports a hierarchical structure for organizing chatbots: Big Idea (brand) → Toolbox (category) → Agent (chatbot), including "Orchestrator" chatbots for high-level management and "Module" chatbots for specific functions. A key feature is "Project Brain," which provides contextual data for chatbots, enabling specialized "Mini Apps" for tasks like project snapshots, decision summaries, and risk assessments. The platform integrates with Mayar.id for subscription management. Each chatbot has a dedicated public chat page (`/chat/:agentId`) serving as its "home" where end-users can interact directly without needing dashboard access.

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

The server manages CRUD operations for agents, knowledge bases, integrations, message storage, and user authentication. It handles webhook integrations for external services like WhatsApp.

### Data Storage
- **ORM**: Drizzle ORM with Zod validation
- **Database**: PostgreSQL (with in-memory fallback for development)
- **Session Store**: connect-pg-simple

The schema includes tables for `agents` (with extensive configuration options, AI model settings, enhanced persona fields, and access control), `knowledgeBases`, `integrations`, `agentMessages`, `users`, `userProfiles`, `analytics`, `bigIdeas`, `toolboxes`, `subscriptionsNew`, `project_brain_templates`, `project_brain_instances`, `mini_apps`, and `mini_app_results`. A hierarchical structure (`bigIdeas` -> `toolboxes` -> `agents`) is enforced.

### Design Patterns
- **Two-Panel Layout**: Left navigation, right content.
- **Active Agent Context**: Content adapts to the selected agent.
- **Optimistic Updates**: For mutations and cache invalidation.
- **Theme System**: CSS custom properties for light/dark mode.
- **Context API**: Unified API for managing active `Big Idea` and `Toolbox` context.
- **Streaming Chat**: Real-time AI responses via Server-Sent Events (SSE).
- **Project Brain**: Structured template and instance data for contextual chatbot interactions, with anti-prompt injection mechanisms.
- **Mini Apps**: Configuration-driven, AI-powered applications that leverage Project Brain data for specialized outputs (e.g., project snapshots, risk radars).

### UI/UX Decisions
- Inspired by Botika Online's two-panel dashboard.
- Mobile-first design for the floating chat widget.
- Professional templates for various industries and use cases.
- Dynamic widget embed system for flexible deployment.

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