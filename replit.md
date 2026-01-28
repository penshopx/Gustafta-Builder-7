# Gustafta - AI Chatbot Builder

## Overview

Gustafta is an AI chatbot builder platform that allows users to create, configure, and deploy intelligent conversational assistants. The application features a two-panel dashboard layout inspired by Botika Online, where users can manage multiple chatbot agents with custom personas, knowledge bases, and multi-channel integrations.

The platform enables users to:
- Create and manage multiple AI chatbot agents
- Configure detailed persona settings (name, tagline, philosophy, system prompts)
- Select from multiple AI models (OpenAI GPT-4o, GPT-3.5, DeepSeek, Claude, or custom models)
- Configure custom API endpoints with user-provided credentials
- Enhanced persona fields: personality, expertise, communication style, tone of voice
- Set up greeting messages and conversation starters (up to 5)
- Choose from 8 languages including Bahasa Indonesia
- Build knowledge bases from text, files, or URLs
- Set up integrations with WhatsApp, Telegram, Discord, Slack, Web Widget, and API
- Test chatbots through a floating popup chat widget (mobile-first design)
- Control access with auto-generated tokens, public/private toggle, and allowed domains
- View analytics dashboard with message counts, sessions, and engagement metrics
- Mayar.id payment gateway integration for subscription management
- Widget customization (color, position, size, border radius, icon, branding)
- Chatbot templates for various industries (E-commerce, Education, Healthcare, Real Estate, Restaurant, HR, General Support)

### Built-in Gustafta Assistant Chatbot
The platform includes a pre-built "Gustafta Assistant" knowledge base chatbot that:
- Explains what Gustafta is and its features
- Provides step-by-step guides on using the platform
- Offers inspiration for chatbot creation across 10+ business categories
- Lists available templates and their use cases
- Gives tips for creating effective chatbots

To seed this chatbot: POST /api/agents/seed-knowledge-base

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a feature-based organization:
- `pages/` - Route-level components (dashboard, not-found)
- `components/panels/` - Main content panels (persona, knowledge base, integrations, chat, analytics)
- `components/dialogs/` - Modal dialogs (create agent)
- `components/chat-popup.tsx` - Floating popup chat widget (mobile-first)
- `components/ui/` - Reusable UI primitives from shadcn/ui
- `hooks/` - Custom React hooks for data fetching (agents, chat, integrations, knowledge base, analytics)
- `lib/` - Utilities, query client, theme provider

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Runtime**: Node.js with tsx for development
- **API Style**: RESTful JSON API
- **Build**: esbuild for production bundling

The server provides:
- Agent CRUD operations with active agent switching
- Knowledge base management per agent
- Integration configuration per agent
- Message storage and retrieval for chat console

### Data Storage
- **ORM**: Drizzle ORM with Zod schema validation
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Development Fallback**: In-memory storage (MemStorage class)
- **Session Store**: connect-pg-simple for PostgreSQL sessions

Schema includes:
- `agents` - Chatbot configurations with:
  - Basic settings: name, description, avatar, tagline, philosophy
  - AI model config: aiModel (gpt-4o-mini/gpt-4o/deepseek/claude/custom), customApiKey, customBaseUrl, customModelName
  - Enhanced persona: personality, expertise, communicationStyle, toneOfVoice, responseFormat, avoidTopics, keyPhrases
  - Agentic features: agenticMode, attentiveListening, contextRetention, proactiveAssistance
  - Access control: accessToken, isPublic, allowedDomains
- `knowledgeBases` - Text/file/URL content linked to agents
- `integrations` - Channel configurations (WhatsApp, Telegram, etc.)
- `agentMessages` - Chat history per agent
- `users` - User authentication data (Replit Auth)
- `userProfiles` - Extended user profile data
- `analytics` - Event tracking for usage metrics
- `bigIdeas` - Top-level business concepts
- `toolboxes` - Collections of agents under a Big Idea
- `subscriptionsNew` - Mayar.id payment subscriptions

### Design Patterns
- **Two-Panel Layout**: Left navigation sidebar with right content panel
- **Active Agent Context**: Single active agent determines panel content
- **Optimistic Updates**: React Query mutations with cache invalidation
- **Theme System**: Light/dark mode with CSS custom properties

## External Dependencies

### UI Libraries
- Radix UI primitives (dialog, dropdown, tabs, etc.)
- Lucide React icons
- React Icons (social media icons)
- Embla Carousel
- React Day Picker
- cmdk (command menu)
- Vaul (drawer)

### Data & Validation
- Zod for schema validation
- drizzle-zod for database-schema integration
- TanStack React Query for data fetching

### Database
- PostgreSQL via `pg` driver
- Drizzle ORM for queries
- drizzle-kit for migrations (run with `npm run db:push`)

### Development Tools
- Vite with React plugin
- Replit-specific plugins (runtime error overlay, cartographer, dev banner)
- TypeScript with strict mode
- PostCSS with Tailwind and Autoprefixer