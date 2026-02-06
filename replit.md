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

## Recent Changes (February 2026)

### Orchestrator vs Module Architecture (Feb 5, 2026)
- Chatbot hierarchy: Big Idea (brand) → Toolbox (category) → Agent (chatbot)
- **Orchestrator**: Main entry-point chatbot for a Big Idea (1 per Big Idea, no Toolbox required)
  - Created via "Buat Chatbot Orchestrator" when Big Idea is active (no Toolbox selected)
  - Has purple "Orchestrator" badge and Network icon in dashboard
  - Requires `isOrchestrator: true` and `bigIdeaId` in schema
- **Module**: Standard chatbots under a Toolbox (many per Toolbox)
  - Created via "Buat Chatbot" when a Toolbox is active
  - Requires `toolboxId` in schema
- Validation enforced at 3 layers: Frontend (create-agent-dialog.tsx), Backend (routes.ts), Schema (Zod refine)

### Fonnte WhatsApp Integration (Feb 5, 2026)
- Implemented complete Fonnte WhatsApp integration with webhook handler
- Webhook endpoint: POST /api/webhook/whatsapp/:agentId (supports Fonnte format: {pengirim, pesan})
- Test connection endpoint: POST /api/whatsapp/test-connection/:agentId (authenticated)
- Send test message endpoint: POST /api/whatsapp/send-test/:agentId (authenticated)
- Frontend UI with clear Fonnte setup instructions and test connection button
- Security: All management endpoints require authentication

### Pre-Deployment Synchronization (Feb 5, 2026)
- Enhanced Gustafta Helpdesk knowledge base with comprehensive feature documentation
- Added complete explanation of all 10 chatbot templates with use cases
- Documented authentication flow (Replit OAuth/OIDC)
- Added subscription pricing details and payment methods (Mayar.id)
- Implemented webhook signature verification for payment security
- Verified end-to-end flow: Landing → Login → Dashboard → Features → Monetization

## Recent Changes (February 2026)

### Agent Template Library
- Added 10+ professional templates (shared/agent-templates.ts)
- Categories: Business, Education, Healthcare, Technology, Creative, Legal, Travel, Finance
- Each template includes pre-configured persona, system prompts, and settings

### Unified Context API
- Big Idea → Toolbox → Agent hierarchy with cascade logic
- /api/context/active endpoint for active context management
- Context-aware creation dialogs showing active toolbox/big idea

### Streaming Chat
- Real-time AI responses via Server-Sent Events (SSE)
- POST /api/messages/stream endpoint with keepalive pings
- Client-side buffer-aware SSE parsing (use-streaming-chat.ts)
- Multi-line SSE event support with error handling

### Export/Import Functionality
- Export agent configurations as JSON
- Import configurations to recreate agents
- /api/agents/:id/export and /api/agents/import endpoints

### Enhanced Landing Page
- Template showcase with category filtering
- Advanced features section
- Statistics display
- Improved CTAs for authentication flow

### Dynamic Widget Embed System
- Widget configuration fetched dynamically from backend (no hard-coded values in embed)
- `/api/widget/config/:agentId` - Public API endpoint for widget config
- `/widget/loader.js` - Dynamic loader script with data-agent-id attribute
- Supports: agentId, welcomeMessage, color, position, size, branding, enable/disable
- Widget adapts to changes automatically without needing to replace embed code
- Access control: Only active + public agents can be embedded
- Multi-widget support: Multiple widgets per page (different agents)

### Project Brain (Feb 6, 2026)
- "Otak Proyek" - form data proyek yang menjadi konteks chatbot
- Templates: definisi field yang bisa dikonfigurasi per agent (JSONB)
  - Field types: text, textarea, number, select, multiselect, boolean, date, url, email
  - Each field: key, label, type, required, placeholder, helpText, defaultValue, options, order
- **Default template fields aligned with CiviloPro architecture:**
  - Project Profile: project_name, project_type, project_stage, location, owner_client
  - Key Technical Parameters: structural_system, concrete_grade, construction_method
  - Project Constraints: time_constraint, cost_constraint, site_access, environmental_factors
  - Active Issues: issue_type (select: Structural/Quality/Safety/Method/Cost/Schedule/Environment), issue_location, issue_status, issue_since
  - Key Decisions Log: decision_summary, decision_reason, decision_risk_level (default: Medium), decision_date, decision_impact (select: Cost/Time/Quality/Safety/Multi), assumption_used (textarea, audit trail)
  - Test Data Snapshot: slump, concrete_strength, inspection_notes (all optional)
  - Metadata: completeness_level (Draft/Partial/Complete), last_updated
  - Legacy keys (active_issues, key_decisions, test_data) still supported as "Notes" sections
- Instances: data proyek aktual yang diisi oleh pengguna
  - Status: draft, active, completed, archived
  - Active instance auto-injected into system prompt
- **System prompt injection format:** Structured sections (Project Profile, Key Technical Parameters, Constraints, Issues, Decisions, Test Data, Status)
- **Anti-prompt injection:** Project Brain data treated as context, not instructions; injection guard added before data block
- `formatProjectBrainBlock()` helper in routes.ts for consistent structured output with backward compatibility
- **MODE INSTRUCTION support:** All 3 modes (Management Snapshot, Decision Summary, Risk Radar) injected into system prompt; chatbot auto-detects user intent
- Tables: `project_brain_templates`, `project_brain_instances`
- API Routes:
  - GET/POST /api/project-brain/templates/:agentId
  - GET/PATCH/DELETE /api/project-brain/template/:id
  - GET/POST /api/project-brain/instances/:agentId
  - GET /api/project-brain/instances/:agentId/active
  - GET/PATCH/DELETE /api/project-brain/instance/:id
  - POST /api/project-brain/instance/:id/activate
- Chat integration: Active project brain instance values injected into both regular and streaming chat system prompts

### Mini Apps (Feb 6, 2026)
- Aplikasi kecil turunan dari Project Brain data
- Types: checklist, calculator, risk_assessment, progress_tracker, document_generator, custom, project_snapshot, decision_summary, risk_radar, issue_log, action_tracker, change_log
- **AI-Powered Mini Apps** (6 types: project_snapshot, decision_summary, risk_radar, issue_log, action_tracker, change_log):
  - Execute via POST /api/mini-app/:id/run (uses OpenAI to analyze active Project Brain data)
  - Project Snapshot: Overall status, issue summary, risk indicators, last decision
  - Decision Summary: Executive decision summary with recommendations
  - Risk Radar: Technical/schedule/cost risk assessment with reasons
  - Issue Log: Structured issue tracking with ISU-001 IDs, priority ranking, escalation flags (>14 days)
  - Action Tracker: Action items from issues/decisions with PIC, due dates, overdue risk assessment
  - Change Log: Design/method/scope change analysis with impact assessment and approval status
- **DEFAULT_MINI_APP_CONFIGS**: Auto-populate name, description, and checklist items when creating mini apps
  - Checklist default: 10-step "Checklist Penanganan Isu" for construction issue workflow
  - All 11 types have default name and description
- Each mini app: name, description, type, config (JSONB), icon
- Mini App Results: stores input/output of mini app executions
- Tables: `mini_apps`, `mini_app_results`
- API Routes:
  - GET/POST /api/mini-apps/:agentId
  - GET/PATCH/DELETE /api/mini-app/:id
  - GET/POST /api/mini-app-results/:miniAppId