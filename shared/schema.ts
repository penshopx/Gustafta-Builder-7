import { z } from "zod";
import { pgTable, text, boolean, timestamp, real, integer, jsonb, varchar, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// Export auth models (required for Replit Auth)
export * from "./models/auth";

// ==================== DRIZZLE TABLE DEFINITIONS ====================

// User Profiles Table
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url").default(""),
  bio: text("bio").default(""),
  company: text("company").default(""),
  position: text("position").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Series Table - Groups Big Ideas into cohesive topics/products
export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().default(""),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").default(""),
  tagline: text("tagline").default(""),
  coverImage: text("cover_image").default(""),
  color: text("color").default("#6366f1"),
  category: text("category").default(""),
  tags: jsonb("tags").default([]),
  language: text("language").default("id"),
  isPublic: boolean("is_public").default(false),
  isActive: boolean("is_active").default(false),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cores Table - Optional strategic umbrella between Series and Big Ideas
export const cores = pgTable("cores", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id").notNull(),
  name: text("name").notNull(),
  description: text("description").default(""),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Big Ideas Table
export const bigIdeas = pgTable("big_ideas", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id"),
  coreId: integer("core_id"),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  goals: jsonb("goals").default([]),
  targetAudience: text("target_audience").default(""),
  expectedOutcome: text("expected_outcome").default(""),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(false),
  monthlyPrice: integer("monthly_price").default(0),
  trialEnabled: boolean("trial_enabled").default(true),
  trialDays: integer("trial_days").default(7),
  requireRegistration: boolean("require_registration").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Toolboxes Table
export const toolboxes = pgTable("toolboxes", {
  id: serial("id").primaryKey(),
  bigIdeaId: integer("big_idea_id"),
  seriesId: integer("series_id"),
  isOrchestrator: boolean("is_orchestrator").default(false),
  name: text("name").notNull(),
  description: text("description").default(""),
  purpose: text("purpose").default(""),
  capabilities: jsonb("capabilities").default([]),
  limitations: jsonb("limitations").default([]),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agents/Chatbots Table
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().default(""),
  name: text("name").notNull(),
  description: text("description").default(""),
  avatar: text("avatar").default(""),
  tagline: text("tagline").default(""),
  philosophy: text("philosophy").default(""),
  offTopicHandling: text("off_topic_handling").default("politely_redirect"),
  offTopicResponse: text("off_topic_response").default(""),
  systemPrompt: text("system_prompt").default("You are a helpful assistant."),
  temperature: real("temperature").default(0.7),
  maxTokens: integer("max_tokens").default(1024),
  aiModel: text("ai_model").default("gpt-4o-mini"),
  customApiKey: text("custom_api_key").default(""),
  customBaseUrl: text("custom_base_url").default(""),
  customModelName: text("custom_model_name").default(""),
  greetingMessage: text("greeting_message").default(""),
  conversationStarters: jsonb("conversation_starters").default([]),
  language: text("language").default("id"),
  category: text("category").default(""),
  subcategory: text("subcategory").default(""),
  accessToken: text("access_token").default(""),
  isPublic: boolean("is_public").default(false),
  allowedDomains: jsonb("allowed_domains").default([]),
  toolboxId: integer("toolbox_id"),
  bigIdeaId: integer("big_idea_id"),
  isOrchestrator: boolean("is_orchestrator").default(false),
  orchestratorRole: text("orchestrator_role").default("standalone"),
  parentAgentId: integer("parent_agent_id"),
  agenticMode: boolean("agentic_mode").default(false),
  attentiveListening: boolean("attentive_listening").default(true),
  contextRetention: integer("context_retention").default(10),
  proactiveAssistance: boolean("proactive_assistance").default(false),
  learningEnabled: boolean("learning_enabled").default(false),
  emotionalIntelligence: boolean("emotional_intelligence").default(true),
  multiStepReasoning: boolean("multi_step_reasoning").default(true),
  selfCorrection: boolean("self_correction").default(true),
  // AI Agents extended settings
  behaviorPreset: text("behavior_preset").default("Balanced"),
  autonomyLevel: text("autonomy_level").default("Terbatas"),
  responseDepth: text("response_depth").default("Terstruktur"),
  outputFormat: text("output_format").default("Ringkasan + langkah"),
  clarifyBeforeAnswer: boolean("clarify_before_answer").default(true),
  uncertaintyHandling: text("uncertainty_handling").default("Sarankan verifikasi ke sumber resmi"),
  showRiskWarnings: boolean("show_risk_warnings").default(true),
  contextPriority: jsonb("context_priority").default(["Pertanyaan terakhir", "Tujuan pengguna", "Riwayat percakapan"]),
  proactiveAssistanceLevel: text("proactive_assistance_level").default("Rendah"),
  proactiveHelpTypes: jsonb("proactive_help_types").default(["Saran langkah berikutnya", "Pertanyaan klarifikasi", "Checklist"]),
  interactionStyle: text("interaction_style").default("Konsultatif"),
  contextualEmpathy: text("contextual_empathy").default("Ringan"),
  actionBoundary: jsonb("action_boundary").default(["Hanya menjawab", "Boleh bertanya balik", "Boleh menyarankan"]),
  escalationRules: jsonb("escalation_rules").default(["Arahkan ke sumber resmi", "Tampilkan disclaimer"]),
  offTopicBehavior: text("off_topic_behavior").default("Jawab singkat lalu arahkan kembali"),
  adaptiveLearningMode: text("adaptive_learning_mode").default("Off"),
  storeInteractionSignals: boolean("store_interaction_signals").default(false),
  sourcePriority: jsonb("source_priority").default(["System Prompt", "Knowledge Engine", "Riwayat percakapan", "Mini Apps", "Integrations", "Sumber eksternal"]),
  personality: text("personality").default(""),
  expertise: jsonb("expertise").default([]),
  communicationStyle: text("communication_style").default("friendly"),
  toneOfVoice: text("tone_of_voice").default("professional"),
  responseFormat: text("response_format").default("conversational"),
  avoidTopics: jsonb("avoid_topics").default([]),
  keyPhrases: jsonb("key_phrases").default([]),
  // Widget Customization
  widgetColor: text("widget_color").default("#6366f1"),
  widgetPosition: text("widget_position").default("bottom-right"),
  widgetSize: text("widget_size").default("medium"),
  widgetBorderRadius: text("widget_border_radius").default("rounded"),
  widgetShowBranding: boolean("widget_show_branding").default(true),
  widgetWelcomeMessage: text("widget_welcome_message").default(""),
  widgetButtonIcon: text("widget_button_icon").default("chat"),
  // Product/Monetization Settings
  isListed: boolean("is_listed").default(false),
  productSlug: text("product_slug"),
  productSummary: text("product_summary").default(""),
  productFeatures: jsonb("product_features").default([]),
  productPricing: jsonb("product_pricing").default({}),
  trialEnabled: boolean("trial_enabled").default(true),
  trialDays: integer("trial_days").default(7),
  monthlyPrice: integer("monthly_price").default(0),
  messageQuotaDaily: integer("message_quota_daily").default(50),
  messageQuotaMonthly: integer("message_quota_monthly").default(1000),
  guestMessageLimit: integer("guest_message_limit").default(10),
  requireRegistration: boolean("require_registration").default(false),
  brandingName: text("branding_name").default(""),
  brandingLogo: text("branding_logo").default(""),
  contextQuestions: jsonb("context_questions").default([]),
  ragEnabled: boolean("rag_enabled").default(true),
  ragChunkSize: integer("rag_chunk_size").default(800),
  ragChunkOverlap: integer("rag_chunk_overlap").default(200),
  ragTopK: integer("rag_top_k").default(5),
  // Landing Page Settings
  landingPageEnabled: boolean("landing_page_enabled").default(false),
  landingPageUrl: text("landing_page_url").default(""),
  marketingKitUrl: text("marketing_kit_url").default(""),
  landingHeroHeadline: text("landing_hero_headline").default(""),
  landingHeroSubheadline: text("landing_hero_subheadline").default(""),
  landingHeroCtaText: text("landing_hero_cta_text").default("Mulai Sekarang"),
  landingPainPoints: jsonb("landing_pain_points").default([]),
  landingSolutionText: text("landing_solution_text").default(""),
  landingBenefits: jsonb("landing_benefits").default([]),
  landingDemoItems: jsonb("landing_demo_items").default([]),
  landingTestimonials: jsonb("landing_testimonials").default([]),
  landingFaq: jsonb("landing_faq").default([]),
  landingAuthority: jsonb("landing_authority").default({}),
  landingGuarantees: jsonb("landing_guarantees").default([]),
  // Conversion Layer Settings
  conversionEnabled: boolean("conversion_enabled").default(false),
  conversionGoal: text("conversion_goal").default("lead_capture"),
  conversionCta: jsonb("conversion_cta").default({}),
  conversionOffers: jsonb("conversion_offers").default([]),
  leadCaptureFields: jsonb("lead_capture_fields").default([]),
  scoringEnabled: boolean("scoring_enabled").default(false),
  scoringRubric: jsonb("scoring_rubric").default([]),
  scoringThresholds: jsonb("scoring_thresholds").default({}),
  ctaTriggerAfterMessages: integer("cta_trigger_after_messages").default(5),
  ctaTriggerOnScore: integer("cta_trigger_on_score").default(0),
  whatsappCta: text("whatsapp_cta").default(""),
  calendlyUrl: text("calendly_url").default(""),
  // Marketing Kit - Ad Copy & Prompts
  adCopies: jsonb("ad_copies").default({}),
  imageHookPrompts: jsonb("image_hook_prompts").default([]),
  videoReelPrompts: jsonb("video_reel_prompts").default([]),
  metaPixelId: text("meta_pixel_id").default(""),
  // Atentif Agentic AI — Multi-Agent Architecture
  agentRole: text("agent_role").default("Standalone"),
  workMode: text("work_mode").default("Answer Mode"),
  executionGatePolicy: text("execution_gate_policy").default("Konfirmasi untuk write"),
  clarificationTriggers: jsonb("clarification_triggers").default(["Output target tidak jelas", "Risiko salah tinggi", "Butuh data spesifik untuk eksekusi"]),
  // OpenClaw Execution Engine
  openClawTrustedActions: jsonb("open_claw_trusted_actions").default(["Cari di Knowledge Base", "Hitung formula", "Ringkas dokumen", "Sarankan langkah selanjutnya"]),
  openClawBlockedActions: jsonb("open_claw_blocked_actions").default(["Hapus data pengguna", "Kirim email massal", "Publish ke publik tanpa konfirmasi"]),
  openClawAuditLog: boolean("open_claw_audit_log").default(true),
  openClawNotifyOnGate: boolean("open_claw_notify_on_gate").default(false),
  openClawStepTrace: boolean("open_claw_step_trace").default(true),
  // OpenClaw — PBJ Track Routing
  openClawTrack: text("open_claw_track").default("Komersial"),
  openClawEntityOwner: text("open_claw_entity_owner").default(""),
  openClawRulebook: text("open_claw_rulebook").default(""),
  openClawRulebookCategory: jsonb("open_claw_rulebook_category").default([]),
  openClawRulebookStatus: text("open_claw_rulebook_status").default("Active"),
  openClawClauseRefRequired: boolean("open_claw_clause_ref_required").default(false),
  // Tujuan & KPI
  primaryOutcome: text("primary_outcome").default(""),
  conversationWinConditions: text("conversation_win_conditions").default(""),
  fallbackObjective: text("fallback_objective").default("Kumpulkan data untuk tindak lanjut"),
  // Kebijakan & Domain Charter
  brandVoiceSpec: text("brand_voice_spec").default(""),
  reasoningPolicy: text("reasoning_policy").default("Langkah demi langkah"),
  interactionPolicy: text("interaction_policy").default(""),
  domainCharter: text("domain_charter").default(""),
  qualityBar: text("quality_bar").default(""),
  riskCompliance: text("risk_compliance").default(""),
  deliverables: jsonb("deliverables").default([]),
  deliverableBundle: text("deliverable_bundle").default(""),
  orchestratorConfig: jsonb("orchestrator_config").default({}),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Knowledge Taxonomy Table
// Hierarki 4-level: Sektor (root) → Subsektor → Topik → Klausul.
// Self-referencing parent_id; level konsisten dengan jenjang yang dipilih.
export const knowledgeTaxonomy = pgTable("knowledge_taxonomy", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id"),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  level: text("level").notNull().default("sektor"),
  description: text("description").default(""),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Knowledge Bases Table
export const knowledgeBases = pgTable("knowledge_bases", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  description: text("description").default(""),
  fileType: text("file_type"),
  fileName: text("file_name").default(""),
  fileSize: integer("file_size").default(0),
  fileUrl: text("file_url").default(""),
  processingStatus: text("processing_status").default("completed"),
  extractedText: text("extracted_text").default(""),
  knowledgeLayer: text("knowledge_layer").default("operational"),
  // Hierarki & versioning
  taxonomyId: integer("taxonomy_id"),
  sourceUrl: text("source_url").default(""),
  sourceAuthority: text("source_authority").default(""),
  effectiveDate: timestamp("effective_date"),
  supersededById: integer("superseded_by_id"),
  status: text("status").notNull().default("active"),
  isShared: boolean("is_shared").default(false),
  sharedScope: text("shared_scope"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Knowledge Chunks Table - RAG system for large document retrieval
export const knowledgeChunks = pgTable("knowledge_chunks", {
  id: serial("id").primaryKey(),
  knowledgeBaseId: integer("knowledge_base_id").notNull(),
  agentId: integer("agent_id").notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  content: text("content").notNull(),
  tokenCount: integer("token_count").default(0),
  embedding: jsonb("embedding").default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Integrations Table
export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  config: jsonb("config").default({}),
  isEnabled: boolean("is_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agent Messages Table (for chat history)
export const agentMessages = pgTable("agent_messages", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  sessionId: text("session_id").default(""),
  role: text("role").notNull(),
  content: text("content").notNull(),
  reasoning: text("reasoning").default(""),
  confidence: real("confidence"),
  sources: jsonb("sources").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analytics Table
export const analyticsTable = pgTable("analytics", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  eventType: text("event_type").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Client Subscriptions Table (end-users subscribing to chatbot products)
export const clientSubscriptions = pgTable("client_subscriptions", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  bigIdeaId: integer("big_idea_id"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").default(""),
  plan: text("plan").notNull().default("trial"),
  status: text("status").default("active"),
  accessToken: text("access_token").notNull(),
  mayarOrderId: text("mayar_order_id"),
  mayarPaymentUrl: text("mayar_payment_url"),
  amount: integer("amount").default(0),
  currency: text("currency").default("IDR"),
  messageUsedToday: integer("message_used_today").default(0),
  messageUsedMonth: integer("message_used_month").default(0),
  lastMessageDate: text("last_message_date"),
  lastMonthReset: text("last_month_reset"),
  referralCode: text("referral_code"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Affiliates/Partners Table
export const affiliates = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").default(""),
  code: text("code").notNull(),
  commissionRate: real("commission_rate").default(10),
  totalEarnings: integer("total_earnings").default(0),
  totalReferrals: integer("total_referrals").default(0),
  payoutInfo: text("payout_info").default(""),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions Table (builder-side platform subscriptions)
export const subscriptionsTable = pgTable("subscriptions_new", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  plan: text("plan").notNull(),
  status: text("status").default("pending"),
  mayarOrderId: text("mayar_order_id"),
  mayarPaymentUrl: text("mayar_payment_url"),
  amount: integer("amount").default(0),
  currency: text("currency").default("IDR"),
  chatbotLimit: integer("chatbot_limit").default(1),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==================== ZOD VALIDATION SCHEMAS ====================

// User Profile schema with avatar support
export const insertUserProfileSchema = z.object({
  userId: z.string(),
  displayName: z.string().min(1, "Name is required"),
  avatarUrl: z.string().optional().default(""),
  bio: z.string().optional().default(""),
  company: z.string().optional().default(""),
  position: z.string().optional().default(""),
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = InsertUserProfile & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

// Series schema - Groups Big Ideas into topics
export const insertSeriesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().default(""),
  tagline: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  color: z.string().optional().default("#6366f1"),
  category: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  language: z.string().optional().default("id"),
  isPublic: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().optional().default(0),
});

export type InsertSeries = z.infer<typeof insertSeriesSchema>;
export type Series = InsertSeries & {
  id: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
};

export type SeriesWithStats = Series & {
  totalBigIdeas: number;
  totalToolboxes: number;
  totalAgents: number;
  totalCores: number;
};

type AgentSummary = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  tagline: string;
  category: string;
  subcategory: string;
  isPublic: boolean;
  isActive: boolean;
  productSlug: string;
  widgetColor: string;
  isOrchestrator: boolean;
  orchestratorRole: string;
};

type ToolboxWithAgents = Toolbox & { agents: AgentSummary[] };
type BigIdeaWithToolboxes = BigIdea & { toolboxes: ToolboxWithAgents[] };

export type SeriesWithHierarchy = SeriesWithStats & {
  cores: (Core & { bigIdeas: BigIdeaWithToolboxes[] })[];
  bigIdeas: BigIdeaWithToolboxes[];
  orchestratorToolboxes?: ToolboxWithAgents[];
};

// Core schema - Optional strategic umbrella under Series
export const insertCoreSchema = z.object({
  seriesId: z.string().min(1, "Series is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  sortOrder: z.number().optional().default(0),
});

export type InsertCore = z.infer<typeof insertCoreSchema>;
export type Core = InsertCore & {
  id: string;
  isActive: boolean;
  createdAt: string;
};

// Big Idea schema - Top level of hierarchy
export const insertBigIdeaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["problem", "idea", "inspiration", "mentoring"]),
  description: z.string().min(1, "Description is required"),
  goals: z.array(z.string()).optional().default([]),
  targetAudience: z.string().optional().default(""),
  expectedOutcome: z.string().optional().default(""),
  seriesId: z.string().optional(),
  coreId: z.string().optional(),
  sortOrder: z.number().optional().default(0),
  monthlyPrice: z.number().min(0).optional().default(0),
  trialEnabled: z.boolean().optional().default(true),
  trialDays: z.number().optional().default(7),
  requireRegistration: z.boolean().optional().default(false),
});

export type InsertBigIdea = z.infer<typeof insertBigIdeaSchema>;
export type BigIdea = InsertBigIdea & {
  id: string;
  isActive: boolean;
  createdAt: string;
};

// Toolbox schema - Created from Big Idea or directly under Series (for Orchestrator/HUB)
export const insertToolboxSchema = z.object({
  bigIdeaId: z.string().optional(),
  seriesId: z.string().optional(),
  isOrchestrator: z.boolean().optional().default(false),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  purpose: z.string().optional().default(""),
  capabilities: z.array(z.string()).optional().default([]),
  limitations: z.array(z.string()).optional().default([]),
  sortOrder: z.number().optional().default(0),
});

export type InsertToolbox = z.infer<typeof insertToolboxSchema>;
export type Toolbox = InsertToolbox & {
  id: string;
  isActive: boolean;
  isOrchestrator: boolean;
  createdAt: string;
};

// AI Model configuration
export const aiModelSchema = z.enum([
  "gpt-4o-mini",
  "gpt-4o", 
  "gpt-4-turbo",
  "gpt-3.5-turbo",
  "deepseek-chat",
  "deepseek-reasoner",
  "claude-3-haiku",
  "claude-3-sonnet",
  "custom"
]);

export type AIModel = z.infer<typeof aiModelSchema>;

// Agent/Chatbot schema with enhanced features including Toolbox reference
// Note: userId is NOT included here - it must be set server-side from authenticated user
export const insertAgentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  avatar: z.string().optional().default(""),
  tagline: z.string().optional().default(""),
  philosophy: z.string().optional().default(""),
  offTopicHandling: z.string().optional().default("politely_redirect"),
  offTopicResponse: z.string().optional().default(""),
  systemPrompt: z.string().optional().default("You are a helpful assistant."),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().min(100).max(4096).optional().default(1024),
  // AI Model Configuration
  aiModel: aiModelSchema.optional().default("gpt-4o-mini"),
  customApiKey: z.string().optional().default(""),
  customBaseUrl: z.string().optional().default(""),
  customModelName: z.string().optional().default(""),
  // Enhanced features inspired by GPTs, Botika, KorinAI
  greetingMessage: z.string().optional().default(""),
  conversationStarters: z.array(z.string()).optional().default([]),
  language: z.string().optional().default("id"),
  // Business/Profession category
  category: z.string().optional().default(""),
  subcategory: z.string().optional().default(""),
  // Access control for monetization
  accessToken: z.string().optional().default(""),
  isPublic: z.boolean().optional().default(false),
  allowedDomains: z.array(z.string()).optional().default([]),
  // Hierarchy: Toolbox reference (required for module chatbots)
  toolboxId: z.string().optional(),
  // Hierarchy: Big Idea reference (required for orchestrators)
  bigIdeaId: z.string().optional(),
  // Is this an orchestrator chatbot?
  isOrchestrator: z.boolean().optional().default(false),
  // Role in orchestration
  orchestratorRole: z.enum(["orchestrator", "specialist", "standalone"]).optional().default("standalone"),
  parentAgentId: z.string().optional().default(""),
  // Attentive Agentic AI settings
  agenticMode: z.boolean().optional().default(false),
  attentiveListening: z.boolean().optional().default(true),
  contextRetention: z.number().min(1).max(50).optional().default(10),
  proactiveAssistance: z.boolean().optional().default(false),
  learningEnabled: z.boolean().optional().default(false),
  emotionalIntelligence: z.boolean().optional().default(true),
  multiStepReasoning: z.boolean().optional().default(true),
  selfCorrection: z.boolean().optional().default(true),
  // AI Agents extended settings
  behaviorPreset: z.string().optional().default("Balanced"),
  autonomyLevel: z.string().optional().default("Terbatas"),
  responseDepth: z.string().optional().default("Terstruktur"),
  outputFormat: z.string().optional().default("Ringkasan + langkah"),
  clarifyBeforeAnswer: z.boolean().optional().default(true),
  uncertaintyHandling: z.string().optional().default("Sarankan verifikasi ke sumber resmi"),
  showRiskWarnings: z.boolean().optional().default(true),
  contextPriority: z.array(z.string()).optional().default(["Pertanyaan terakhir", "Tujuan pengguna", "Riwayat percakapan"]),
  proactiveAssistanceLevel: z.string().optional().default("Rendah"),
  proactiveHelpTypes: z.array(z.string()).optional().default(["Saran langkah berikutnya", "Pertanyaan klarifikasi", "Checklist"]),
  interactionStyle: z.string().optional().default("Konsultatif"),
  contextualEmpathy: z.string().optional().default("Ringan"),
  actionBoundary: z.array(z.string()).optional().default(["Hanya menjawab", "Boleh bertanya balik", "Boleh menyarankan"]),
  escalationRules: z.array(z.string()).optional().default(["Arahkan ke sumber resmi", "Tampilkan disclaimer"]),
  offTopicBehavior: z.string().optional().default("Jawab singkat lalu arahkan kembali"),
  adaptiveLearningMode: z.string().optional().default("Off"),
  storeInteractionSignals: z.boolean().optional().default(false),
  sourcePriority: z.array(z.string()).optional().default(["System Prompt", "Knowledge Engine", "Riwayat percakapan", "Mini Apps", "Integrations", "Sumber eksternal"]),
  // Enhanced Persona fields for stronger AI personality
  personality: z.string().optional().default(""),
  expertise: z.array(z.string()).optional().default([]),
  communicationStyle: z.string().optional().default("friendly"),
  toneOfVoice: z.string().optional().default("professional"),
  responseFormat: z.string().optional().default("conversational"),
  avoidTopics: z.array(z.string()).optional().default([]),
  keyPhrases: z.array(z.string()).optional().default([]),
  // Widget Customization
  widgetColor: z.string().optional().default("#6366f1"),
  widgetPosition: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"]).optional().default("bottom-right"),
  widgetSize: z.enum(["small", "medium", "large"]).optional().default("medium"),
  widgetBorderRadius: z.enum(["rounded", "square", "pill"]).optional().default("rounded"),
  widgetShowBranding: z.boolean().optional().default(true),
  widgetWelcomeMessage: z.string().optional().default(""),
  widgetButtonIcon: z.enum(["chat", "message", "bot", "help"]).optional().default("chat"),
  // Product/Monetization Settings
  isListed: z.boolean().optional().default(false),
  productSlug: z.string().optional(),
  productSummary: z.string().optional().default(""),
  productFeatures: z.array(z.string()).optional().default([]),
  productPricing: z.record(z.any()).optional().default({}),
  trialEnabled: z.boolean().optional().default(true),
  trialDays: z.number().min(1).max(30).optional().default(7),
  monthlyPrice: z.number().min(0).optional().default(0),
  messageQuotaDaily: z.number().min(0).optional().default(50),
  messageQuotaMonthly: z.number().min(0).optional().default(1000),
  guestMessageLimit: z.number().min(0).optional().default(10),
  requireRegistration: z.boolean().optional().default(false),
  brandingName: z.string().optional().default(""),
  brandingLogo: z.string().optional().default(""),
  contextQuestions: z.array(z.object({
    id: z.string(),
    label: z.string(),
    type: z.enum(["text", "select"]),
    options: z.array(z.string()).optional().default([]),
    required: z.boolean().optional().default(true),
  })).optional().default([]),
  ragEnabled: z.boolean().optional().default(true),
  ragChunkSize: z.number().min(200).max(2000).optional().default(800),
  ragChunkOverlap: z.number().min(0).max(500).optional().default(200),
  ragTopK: z.number().min(1).max(20).optional().default(5),
  // Landing Page Settings
  landingPageEnabled: z.boolean().optional().default(false),
  landingPageUrl: z.string().optional().default(""),
  marketingKitUrl: z.string().optional().default(""),
  landingHeroHeadline: z.string().optional().default(""),
  landingHeroSubheadline: z.string().optional().default(""),
  landingHeroCtaText: z.string().optional().default("Mulai Sekarang"),
  landingPainPoints: z.array(z.string()).optional().default([]),
  landingSolutionText: z.string().optional().default(""),
  landingBenefits: z.array(z.string()).optional().default([]),
  landingDemoItems: z.array(z.object({
    title: z.string(),
    description: z.string().optional().default(""),
    imageUrl: z.string().optional().default(""),
  })).optional().default([]),
  landingTestimonials: z.array(z.object({
    name: z.string(),
    role: z.string().optional().default(""),
    company: z.string().optional().default(""),
    quote: z.string(),
  })).optional().default([]),
  landingFaq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional().default([]),
  landingAuthority: z.object({
    title: z.string().optional().default(""),
    description: z.string().optional().default(""),
    credentials: z.array(z.string()).optional().default([]),
  }).optional().default({}),
  landingGuarantees: z.array(z.string()).optional().default([]),
  // Conversion Layer Settings
  conversionEnabled: z.boolean().optional().default(false),
  conversionGoal: z.enum(["lead_capture", "assessment", "consultation", "product_sale", "registration"]).optional().default("lead_capture"),
  conversionCta: z.object({
    title: z.string().optional().default(""),
    description: z.string().optional().default(""),
    buttonText: z.string().optional().default(""),
    buttonUrl: z.string().optional().default(""),
    style: z.enum(["banner", "card", "floating", "inline"]).optional().default("card"),
  }).optional().default({}),
  conversionOffers: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional().default(""),
    price: z.string().optional().default(""),
    features: z.array(z.string()).optional().default([]),
    ctaText: z.string().optional().default(""),
    ctaUrl: z.string().optional().default(""),
    isPopular: z.boolean().optional().default(false),
  })).optional().default([]),
  leadCaptureFields: z.array(z.object({
    id: z.string(),
    label: z.string(),
    type: z.enum(["text", "email", "phone", "select", "textarea"]),
    required: z.boolean().optional().default(true),
    placeholder: z.string().optional().default(""),
    options: z.array(z.string()).optional().default([]),
  })).optional().default([]),
  scoringEnabled: z.boolean().optional().default(false),
  scoringRubric: z.array(z.object({
    id: z.string(),
    category: z.string(),
    maxScore: z.number().optional().default(100),
    weight: z.number().optional().default(1),
    description: z.string().optional().default(""),
  })).optional().default([]),
  scoringThresholds: z.object({
    low: z.number().optional().default(30),
    medium: z.number().optional().default(60),
    high: z.number().optional().default(80),
    lowLabel: z.string().optional().default("Perlu Peningkatan"),
    mediumLabel: z.string().optional().default("Cukup Baik"),
    highLabel: z.string().optional().default("Sangat Baik"),
    lowRecommendation: z.string().optional().default(""),
    mediumRecommendation: z.string().optional().default(""),
    highRecommendation: z.string().optional().default(""),
  }).optional().default({}),
  ctaTriggerAfterMessages: z.number().min(1).max(50).optional().default(5),
  ctaTriggerOnScore: z.number().min(0).max(100).optional().default(0),
  whatsappCta: z.string().optional().default(""),
  calendlyUrl: z.string().optional().default(""),
  // Marketing Kit
  adCopies: z.record(z.string(), z.object({
    headline: z.string().optional().default(""),
    primaryText: z.string().optional().default(""),
    description: z.string().optional().default(""),
    callToAction: z.string().optional().default(""),
    hashtags: z.string().optional().default(""),
  })).optional().default({}),
  imageHookPrompts: z.array(z.object({
    id: z.string(),
    title: z.string().optional().default(""),
    prompt: z.string(),
    platform: z.string().optional().default("general"),
    style: z.string().optional().default(""),
  })).optional().default([]),
  videoReelPrompts: z.array(z.object({
    id: z.string(),
    title: z.string().optional().default(""),
    prompt: z.string(),
    platform: z.string().optional().default("general"),
    duration: z.string().optional().default("15-30s"),
  })).optional().default([]),
  metaPixelId: z.string().optional().default(""),
  // Deliverables
  deliverables: z.array(z.string()).optional().default([]),
  deliverableBundle: z.string().optional().default(""),
  // OpenClaw Execution Engine
  openClawTrustedActions: z.array(z.string()).optional().default(["Cari di Knowledge Base", "Hitung formula", "Ringkas dokumen", "Sarankan langkah selanjutnya"]),
  openClawBlockedActions: z.array(z.string()).optional().default(["Hapus data pengguna", "Kirim email massal", "Publish ke publik tanpa konfirmasi"]),
  openClawAuditLog: z.boolean().optional().default(true),
  openClawNotifyOnGate: z.boolean().optional().default(false),
  openClawStepTrace: z.boolean().optional().default(true),
  // OpenClaw — PBJ Track Routing
  openClawTrack: z.string().optional().default("Komersial"),
  openClawEntityOwner: z.string().optional().default(""),
  openClawRulebook: z.string().optional().default(""),
  openClawRulebookCategory: z.array(z.string()).optional().default([]),
  openClawRulebookStatus: z.string().optional().default("Active"),
  openClawClauseRefRequired: z.boolean().optional().default(false),
  // Kebijakan Agen — 7 field yang harus selalu konsisten.
  // Auto-fill di storage.createAgent berdasarkan series jika kosong (lihat server/lib/agent-policies.ts).
  primaryOutcome: z.string().optional().default(""),
  conversationWinConditions: z.string().optional().default(""),
  brandVoiceSpec: z.string().optional().default(""),
  interactionPolicy: z.string().optional().default(""),
  domainCharter: z.string().optional().default(""),
  qualityBar: z.string().optional().default(""),
  riskCompliance: z.string().optional().default(""),
}).refine(
  (data) => {
    // Orchestrator must have bigIdeaId, Module must have toolboxId
    if (data.isOrchestrator) {
      return !!data.bigIdeaId;
    }
    return true; // Module validation is optional - existing agents may not have toolboxId
  },
  {
    message: "Orchestrator membutuhkan Big Idea yang aktif",
    path: ["bigIdeaId"],
  }
);

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = InsertAgent & {
  id: string;
  isActive: boolean;
  createdAt: string;
};

// Knowledge Taxonomy schema (4-level: sektor → subsektor → topik → klausul)
export const TAXONOMY_LEVELS = ["sektor", "subsektor", "topik", "klausul"] as const;
export const insertKnowledgeTaxonomySchema = z.object({
  parentId: z.number().nullable().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  level: z.enum(TAXONOMY_LEVELS).default("sektor"),
  description: z.string().optional().default(""),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});
export type InsertKnowledgeTaxonomy = z.infer<typeof insertKnowledgeTaxonomySchema>;
export type KnowledgeTaxonomyNode = InsertKnowledgeTaxonomy & {
  id: number;
  createdAt: string;
};
export type KnowledgeTaxonomyTreeNode = KnowledgeTaxonomyNode & {
  children: KnowledgeTaxonomyTreeNode[];
};

// Source authorities resmi yang umum dipakai industri jasa konstruksi Indonesia.
// Open-ended: nilai lain tetap diizinkan via "lainnya".
export const KB_SOURCE_AUTHORITIES = [
  "PUPR", "LKPP", "DJP", "BNSP", "LPJK", "BSN", "DJBC",
  "Kemnaker", "BPJS_Ketenagakerjaan", "JDIH", "internal", "lainnya",
] as const;

export const KB_STATUSES = ["active", "superseded", "draft"] as const;
export const KB_SHARED_SCOPES = ["series", "global"] as const;

// Knowledge Base schema with file upload support
export const insertKnowledgeBaseSchema = z.object({
  agentId: z.string(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["text", "file", "url"]),
  content: z.string(),
  description: z.string().optional().default(""),
  // File upload fields
  fileType: z.enum(["pdf", "ppt", "pptx", "xls", "xlsx", "doc", "docx", "txt", "other"]).optional(),
  fileName: z.string().optional().default(""),
  fileSize: z.number().optional().default(0),
  fileUrl: z.string().optional().default(""),
  // Processing status
  processingStatus: z.enum(["pending", "processing", "completed", "failed"]).optional().default("completed"),
  extractedText: z.string().optional().default(""),
  knowledgeLayer: z.enum(["foundational", "operational", "case_memory"]).optional().default("operational"),
  // Hierarki & versioning (semua opsional supaya backward-compat)
  taxonomyId: z.number().nullable().optional(),
  sourceUrl: z.string().optional().default(""),
  sourceAuthority: z.string().optional().default(""),
  effectiveDate: z.union([z.string(), z.date()]).nullable().optional(),
  supersededById: z.number().nullable().optional(),
  status: z.enum(KB_STATUSES).optional().default("active"),
  isShared: z.boolean().optional().default(false),
  sharedScope: z.enum(KB_SHARED_SCOPES).nullable().optional(),
});

export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;
export type KnowledgeBase = InsertKnowledgeBase & {
  id: string;
  createdAt: string;
};

// Knowledge Chunk schema - RAG
export const insertKnowledgeChunkSchema = z.object({
  knowledgeBaseId: z.number(),
  agentId: z.number(),
  chunkIndex: z.number(),
  content: z.string(),
  tokenCount: z.number().optional().default(0),
  embedding: z.array(z.number()).optional().default([]),
  metadata: z.record(z.any()).optional().default({}),
});

export type InsertKnowledgeChunk = z.infer<typeof insertKnowledgeChunkSchema>;
export type KnowledgeChunk = InsertKnowledgeChunk & {
  id: number;
  createdAt: string;
};

// Integration schema
export const insertIntegrationSchema = z.object({
  agentId: z.string(),
  type: z.enum(["whatsapp", "telegram", "discord", "slack", "web", "api"]),
  name: z.string(),
  config: z.record(z.string()).optional().default({}),
  isEnabled: z.boolean().optional().default(false),
});

export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = InsertIntegration & {
  id: string;
  createdAt: string;
};

// Chat Message schema
export const insertMessageSchema = z.object({
  agentId: z.string(),
  sessionId: z.string().optional(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  // Agentic AI metadata
  reasoning: z.string().optional().default(""),
  confidence: z.number().min(0).max(1).optional(),
  sources: z.array(z.string()).optional().default([]),
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = InsertMessage & {
  id: string;
  createdAt: string;
};

// User schema with admin role for access control
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email().optional(),
  role: z.enum(["admin", "user"]).optional().default("admin"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & {
  id: string;
  createdAt: string;
};

// Analytics schema for tracking usage
export const insertAnalyticsSchema = z.object({
  agentId: z.string(),
  eventType: z.enum(["message", "session", "integration_call"]),
  metadata: z.record(z.any()).optional().default({}),
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = InsertAnalytics & {
  id: string;
  createdAt: string;
};

// Subscription schema for payment/monetization
export const subscriptionPlanSchema = z.enum([
  "free_trial",
  "monthly_1",
  "monthly_3", 
  "monthly_6",
  "monthly_12"
]);

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;

export const subscriptionPricing: Record<SubscriptionPlan, { price: number; duration: number; label: string }> = {
  free_trial: { price: 0, duration: 14, label: "Free Trial 14 Hari" },
  monthly_1: { price: 199000, duration: 30, label: "1 Bulan" },
  monthly_3: { price: 499000, duration: 90, label: "3 Bulan" },
  monthly_6: { price: 999000, duration: 180, label: "6 Bulan" },
  monthly_12: { price: 1999000, duration: 365, label: "12 Bulan" },
};

export const insertSubscriptionSchema = z.object({
  userId: z.string(),
  plan: subscriptionPlanSchema,
  status: z.enum(["pending", "active", "expired", "cancelled"]).default("pending"),
  mayarOrderId: z.string().optional(),
  mayarPaymentUrl: z.string().optional(),
  amount: z.number(),
  currency: z.string().default("IDR"),
  chatbotLimit: z.number().default(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = InsertSubscription & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

// ==================== CLIENT SUBSCRIPTIONS ====================

export const clientSubscriptionPlanSchema = z.enum([
  "trial", "monthly", "yearly", "lifetime", "voucher"
]);
export type ClientSubscriptionPlan = z.infer<typeof clientSubscriptionPlanSchema>;

export const insertClientSubscriptionSchema = z.object({
  agentId: z.string(),
  bigIdeaId: z.string().optional(),
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional().default(""),
  plan: clientSubscriptionPlanSchema.default("trial"),
  status: z.enum(["active", "expired", "cancelled", "pending"]).default("active"),
  accessToken: z.string(),
  mayarOrderId: z.string().optional(),
  mayarPaymentUrl: z.string().optional(),
  amount: z.number().default(0),
  currency: z.string().default("IDR"),
  referralCode: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type InsertClientSubscription = z.infer<typeof insertClientSubscriptionSchema>;
export type ClientSubscription = InsertClientSubscription & {
  id: string;
  messageUsedToday: number;
  messageUsedMonth: number;
  lastMessageDate: string | null;
  lastMonthReset: string | null;
  createdAt: string;
  updatedAt: string;
};

// ==================== AFFILIATES ====================

export const insertAffiliateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional().default(""),
  code: z.string().min(3, "Code must be at least 3 characters"),
  commissionRate: z.number().min(0).max(100).default(10),
  payoutInfo: z.string().optional().default(""),
});

export type InsertAffiliate = z.infer<typeof insertAffiliateSchema>;
export type Affiliate = InsertAffiliate & {
  id: string;
  totalEarnings: number;
  totalReferrals: number;
  isActive: boolean;
  createdAt: string;
};

// ==================== PROJECT BRAIN ====================

// Project Brain field type enum
export const projectBrainFieldTypeSchema = z.enum([
  "text", "textarea", "number", "select", "multiselect", "boolean", "date", "url", "email"
]);
export type ProjectBrainFieldType = z.infer<typeof projectBrainFieldTypeSchema>;

// Project Brain field definition
export const projectBrainFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: projectBrainFieldTypeSchema,
  required: z.boolean().default(false),
  placeholder: z.string().optional().default(""),
  helpText: z.string().optional().default(""),
  defaultValue: z.string().optional().default(""),
  options: z.array(z.string()).optional().default([]),
  order: z.number().optional().default(0),
});
export type ProjectBrainField = z.infer<typeof projectBrainFieldSchema>;

// Project Brain Templates Table
export const projectBrainTemplates = pgTable("project_brain_templates", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  name: text("name").notNull(),
  description: text("description").default(""),
  fields: jsonb("fields").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Project Brain Instances Table (filled project data)
export const projectBrainInstances = pgTable("project_brain_instances", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  templateId: integer("template_id").notNull(),
  name: text("name").notNull(),
  values: jsonb("values").default({}),
  status: text("status").default("active"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Project Brain Template Zod schema
export const insertProjectBrainTemplateSchema = z.object({
  agentId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  fields: z.array(projectBrainFieldSchema).optional().default([]),
});

export type InsertProjectBrainTemplate = z.infer<typeof insertProjectBrainTemplateSchema>;
export type ProjectBrainTemplate = InsertProjectBrainTemplate & {
  id: string;
  isActive: boolean;
  createdAt: string;
};

// Project Brain Instance Zod schema
export const insertProjectBrainInstanceSchema = z.object({
  agentId: z.string(),
  templateId: z.string(),
  name: z.string().min(1, "Project name is required"),
  values: z.record(z.any()).optional().default({}),
  status: z.enum(["draft", "active", "completed", "archived"]).optional().default("active"),
});

export type InsertProjectBrainInstance = z.infer<typeof insertProjectBrainInstanceSchema>;
export type ProjectBrainInstance = InsertProjectBrainInstance & {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// ==================== LEADS (Conversion Layer) ====================

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  sessionId: text("session_id").default(""),
  name: text("name").default(""),
  email: text("email").default(""),
  phone: text("phone").default(""),
  company: text("company").default(""),
  source: text("source").default("chat"),
  status: text("status").default("new"),
  score: integer("score").default(0),
  scoreBreakdown: jsonb("score_breakdown").default({}),
  metadata: jsonb("metadata").default({}),
  notes: text("notes").default(""),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = z.object({
  agentId: z.number(),
  sessionId: z.string().optional().default(""),
  name: z.string().optional().default(""),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  source: z.enum(["chat", "widget", "whatsapp", "form", "mini_app"]).optional().default("chat"),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]).optional().default("new"),
  score: z.number().optional().default(0),
  scoreBreakdown: z.record(z.any()).optional().default({}),
  metadata: z.record(z.any()).optional().default({}),
  notes: z.string().optional().default(""),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = InsertLead & {
  id: number;
  convertedAt: string | null;
  createdAt: string;
};

// ==================== SCORING RESULTS (Conversion Layer) ====================

export const scoringResults = pgTable("scoring_results", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  sessionId: text("session_id").default(""),
  leadId: integer("lead_id"),
  totalScore: integer("total_score").default(0),
  maxScore: integer("max_score").default(100),
  level: text("level").default("low"),
  breakdown: jsonb("breakdown").default([]),
  recommendations: jsonb("recommendations").default([]),
  gapAnalysis: jsonb("gap_analysis").default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScoringResultSchema = z.object({
  agentId: z.number(),
  sessionId: z.string().optional().default(""),
  leadId: z.number().optional(),
  totalScore: z.number().optional().default(0),
  maxScore: z.number().optional().default(100),
  level: z.enum(["low", "medium", "high"]).optional().default("low"),
  breakdown: z.array(z.object({
    category: z.string(),
    score: z.number(),
    maxScore: z.number(),
    notes: z.string().optional().default(""),
  })).optional().default([]),
  recommendations: z.array(z.object({
    title: z.string(),
    description: z.string().optional().default(""),
    priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
    actionUrl: z.string().optional().default(""),
  })).optional().default([]),
  gapAnalysis: z.array(z.object({
    area: z.string(),
    current: z.string().optional().default(""),
    target: z.string().optional().default(""),
    gap: z.string().optional().default(""),
    recommendation: z.string().optional().default(""),
  })).optional().default([]),
  metadata: z.record(z.any()).optional().default({}),
});

export type InsertScoringResult = z.infer<typeof insertScoringResultSchema>;
export type ScoringResult = InsertScoringResult & {
  id: number;
  createdAt: string;
};

// ==================== MINI APPS ====================

export const miniAppTypeSchema = z.enum([
  "checklist", "calculator", "risk_assessment", "progress_tracker", "document_generator", "custom",
  "issue_log", "action_tracker", "change_log",
  "project_snapshot", "decision_summary", "risk_radar",
  "scoring_assessment", "gap_analysis", "recommendation_engine", "lead_capture_form",
  "nib_status_report", "whatsapp_status_update", "internal_project_report",
  // Tender/Pengadaan — OpenClaw Document Types
  "compliance_matrix", "tender_audit_report", "go_no_go_checklist",
  "pqp_document", "hse_plan", "executive_summary_penawaran", "metode_pelaksanaan"
]);
export type MiniAppType = z.infer<typeof miniAppTypeSchema>;

// Mini Apps Table
export const miniApps = pgTable("mini_apps", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  name: text("name").notNull(),
  description: text("description").default(""),
  type: text("type").notNull(),
  config: jsonb("config").default({}),
  icon: text("icon").default("app"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mini App Results Table
export const miniAppResults = pgTable("mini_app_results", {
  id: serial("id").primaryKey(),
  miniAppId: integer("mini_app_id").notNull(),
  agentId: integer("agent_id").notNull(),
  projectInstanceId: integer("project_instance_id"),
  input: jsonb("input").default({}),
  output: jsonb("output").default({}),
  status: text("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mini App Zod schema
export const insertMiniAppSchema = z.object({
  agentId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  type: miniAppTypeSchema,
  config: z.record(z.any()).optional().default({}),
  icon: z.string().optional().default("app"),
});

export type InsertMiniApp = z.infer<typeof insertMiniAppSchema>;
export type MiniApp = InsertMiniApp & {
  id: string;
  isActive: boolean;
  createdAt: string;
};

// Mini App Result Zod schema
export const insertMiniAppResultSchema = z.object({
  miniAppId: z.string(),
  agentId: z.string(),
  projectInstanceId: z.string().optional(),
  input: z.record(z.any()).optional().default({}),
  output: z.record(z.any()).optional().default({}),
  status: z.enum(["pending", "completed", "error"]).optional().default("completed"),
});

export type InsertMiniAppResult = z.infer<typeof insertMiniAppResultSchema>;
export type MiniAppResult = InsertMiniAppResult & {
  id: string;
  createdAt: string;
};

// ==================== VOUCHERS ====================

export const vouchers = pgTable("vouchers", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id"),
  code: text("code").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull().default("unlimited"),
  extraMessages: integer("extra_messages").default(0),
  durationDays: integer("duration_days").default(30),
  maxRedemptions: integer("max_redemptions").default(0),
  totalRedeemed: integer("total_redeemed").default(0),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const voucherRedemptions = pgTable("voucher_redemptions", {
  id: serial("id").primaryKey(),
  voucherId: integer("voucher_id").notNull(),
  clientSubscriptionId: integer("client_subscription_id").notNull(),
  redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
});

export const insertVoucherSchema = z.object({
  agentId: z.number().nullable().optional(),
  code: z.string().min(1, "Kode voucher wajib diisi"),
  name: z.string().min(1, "Nama voucher wajib diisi"),
  type: z.enum(["unlimited", "extra_quota"]).optional().default("unlimited"),
  extraMessages: z.number().optional().default(0),
  durationDays: z.number().optional().default(30),
  maxRedemptions: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
  expiresAt: z.string().nullable().optional(),
});

export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type Voucher = {
  id: number;
  agentId: number | null;
  code: string;
  name: string;
  type: string;
  extraMessages: number;
  durationDays: number;
  maxRedemptions: number;
  totalRedeemed: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
};

export type VoucherRedemption = {
  id: number;
  voucherId: number;
  clientSubscriptionId: number;
  redeemedAt: string;
};

// ==================== USER MEMORIES ====================

export const userMemories = pgTable("user_memories", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  sessionId: text("session_id").default(""),
  category: text("category").notNull().default("memory"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserMemorySchema = createInsertSchema(userMemories).omit({ id: true, createdAt: true });
export type InsertUserMemory = z.infer<typeof insertUserMemorySchema>;
export type UserMemory = typeof userMemories.$inferSelect;

// ==================== VOICE CHAT CONVERSATIONS ====================

// ==================== WA CONTACTS ====================

export const waContacts = pgTable("wa_contacts", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  phone: text("phone").notNull(),
  name: text("name").default(""),
  source: text("source").default("webhook"),
  isOptedOut: boolean("is_opted_out").default(false),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWaContactSchema = createInsertSchema(waContacts).omit({ id: true, createdAt: true });
export type InsertWaContact = z.infer<typeof insertWaContactSchema>;
export type WaContact = typeof waContacts.$inferSelect;

// ==================== WA BROADCASTS ====================

export const waBroadcasts = pgTable("wa_broadcasts", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull().default(""),
  name: text("name").notNull(),
  messageTemplate: text("message_template").notNull(),
  scheduleType: text("schedule_type").notNull().default("once"),
  scheduleTime: text("schedule_time").default("08:00"),
  scheduleDays: jsonb("schedule_days").default([]),
  timezone: text("timezone").default("Asia/Jakarta"),
  nextRunAt: timestamp("next_run_at"),
  lastRunAt: timestamp("last_run_at"),
  dataSource: text("data_source").default(""),
  dataSourceConfig: jsonb("data_source_config").default({}),
  isEnabled: boolean("is_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWaBroadcastSchema = createInsertSchema(waBroadcasts).omit({ id: true, createdAt: true, lastRunAt: true });
export type InsertWaBroadcast = z.infer<typeof insertWaBroadcastSchema>;
export type WaBroadcast = typeof waBroadcasts.$inferSelect;

// ==================== WA BROADCAST RUNS ====================

export const waBroadcastRuns = pgTable("wa_broadcast_runs", {
  id: serial("id").primaryKey(),
  broadcastId: integer("broadcast_id").notNull(),
  status: text("status").notNull().default("pending"),
  totalRecipients: integer("total_recipients").default(0),
  totalSent: integer("total_sent").default(0),
  totalFailed: integer("total_failed").default(0),
  runAt: timestamp("run_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  errorLog: text("error_log").default(""),
});

export type WaBroadcastRun = typeof waBroadcastRuns.$inferSelect;

// ==================== TENDER SOURCES ====================

export const tenderSources = pgTable("tender_sources", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().default(""),
  name: text("name").notNull(),
  baseUrl: text("base_url").notNull(),
  isEnabled: boolean("is_enabled").default(true),
  lastScrapedAt: timestamp("last_scraped_at"),
  totalTenders: integer("total_tenders").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTenderSourceSchema = createInsertSchema(tenderSources).omit({ id: true, createdAt: true, lastScrapedAt: true, totalTenders: true });
export type InsertTenderSource = z.infer<typeof insertTenderSourceSchema>;
export type TenderSource = typeof tenderSources.$inferSelect;

// ==================== TENDERS ====================

export const tenders = pgTable("tenders", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").notNull(),
  tenderId: text("tender_id").notNull(),
  name: text("name").notNull(),
  agency: text("agency").default(""),
  budget: text("budget").default(""),
  type: text("type").default(""),
  status: text("status").default(""),
  stage: text("stage").default(""),
  location: text("location").default(""),
  publishDate: text("publish_date").default(""),
  deadlineDate: text("deadline_date").default(""),
  url: text("url").default(""),
  rawData: jsonb("raw_data").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTenderSchema = createInsertSchema(tenders).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTender = z.infer<typeof insertTenderSchema>;
export type Tender = typeof tenders.$inferSelect;

// ==================== TENDER DOCUMENT CATALOG (Perpres 46/2025) ====================
// Katalog referensi dokumen tender pemerintah. Bukan dokumen real per-user (itu di
// tenderSessions), melainkan daftar template/jenis dokumen yang harus disiapkan
// penyedia/Pokja, dipakai sebagai data referensi oleh Agent Tender Document Generator.
export const tenderDocumentCatalog = pgTable("tender_document_catalog", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),             // PWR-06, ADM-05, KUL-02, dst — UNIQUE
  name: text("name").notNull(),                      // "Bukti Kinerja Penyedia (SIKaP)"
  kelompok: text("kelompok").notNull(),              // administrasi | kualifikasi | teknis | personel | pengalaman | peralatan | keuangan | penawaran | penjaminan
  jenisTender: text("jenis_tender").notNull().default("semua"), // pekerjaan_konstruksi | konsultansi_konstruksi | semua
  sisi: text("sisi").notNull().default("penyedia"),  // penyedia | pokja | keduanya
  wajibStatus: text("wajib_status").notNull().default("wajib"), // wajib | opsional | wajib_perpres_46
  formatOutput: text("format_output").default("PDF"), // PDF | DOCX | XLSX | JSON
  priority: text("priority").notNull().default("P1"), // P0 | P1 | P2
  templateStatus: text("template_status").notNull().default("placeholder"), // template_filled | placeholder | draft
  dasarHukum: text("dasar_hukum").default(""),       // "Perpres 46/2025 Pasal X" / "Permen PU 14/2020"
  sumberAutoFill: text("source_auto_fill").default(""), // JSON path: "company.nib", "personel[*].cv"
  openClawAgentRef: text("openclaw_agent_ref").default(""), // slug agent yg generate
  taxonomyId: integer("taxonomy_id"),                // FK opsional ke knowledge_taxonomy
  description: text("description").default(""),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTenderDocumentCatalogSchema = createInsertSchema(tenderDocumentCatalog).omit({ id: true, createdAt: true });
export type InsertTenderDocumentCatalog = z.infer<typeof insertTenderDocumentCatalogSchema>;
export type TenderDocumentCatalog = typeof tenderDocumentCatalog.$inferSelect;

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("New Chat"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const voiceMessages = pgTable("voice_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Tender LPSE Pack: Company Profile (reusable entity per user) ──────────
export const companyProfiles = pgTable("company_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  businessType: text("business_type").notNull().default("PT"),
  nib: text("nib").notNull().default(""),
  nibStatus: text("nib_status").notNull().default("Ada"),
  npwp: text("npwp").notNull().default(""),
  npwpStatus: text("npwp_status").notNull().default("Ada"),
  address: text("address").notNull().default(""),
  picName: text("pic_name").notNull().default(""),
  picContact: text("pic_contact").notNull().default(""),
  experiences: jsonb("experiences").notNull().$type<Array<{
    projectName: string;
    year: string;
    role: string;
    summary: string;
    value?: string;
  }>>().default([]),
  personnel: jsonb("personnel").notNull().$type<Array<{
    name: string;
    position: string;
    education: string;
    certifications: Array<{ name: string; number?: string; issuer: string; validUntil?: string }>;
    experiences: Array<{ project: string; role: string; tasks: string; output: string; year: string }>;
    competencies: string[];
  }>>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCompanyProfileSchema = createInsertSchema(companyProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCompanyProfile = z.infer<typeof insertCompanyProfileSchema>;
export type CompanyProfile = typeof companyProfiles.$inferSelect;

// ─── Tender LPSE Pack: Session (per-tender wizard run) ────────────────────
export const tenderPackTypeSchema = z.enum(["pelaksana_konstruksi", "konsultansi_mk"]);
export type TenderPackType = z.infer<typeof tenderPackTypeSchema>;

export const tenderSessions = pgTable("tender_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  packType: text("pack_type").notNull().default("pelaksana_konstruksi"),
  companyProfileId: integer("company_profile_id"),
  status: text("status").notNull().default("draft"),
  selectedOutputs: text("selected_outputs").array().notNull().default([]),
  tenderProfile: jsonb("tender_profile").$type<Record<string, string>>().default({}),
  requirements: jsonb("requirements").$type<Record<string, string>>().default({}),
  technicalApproach: jsonb("technical_approach").$type<Record<string, string>>().default({}),
  complianceAnswers: jsonb("compliance_answers").$type<Record<string, string>>().default({}),
  scoreKelengkapan: integer("score_kelengkapan"),
  scoreTeknis: integer("score_teknis"),
  generatedChecklist: jsonb("generated_checklist").$type<Array<{
    code: string; section: string; item: string;
    status: "Ada" | "Belum" | "Perlu revisi"; note?: string;
  }>>(),
  generatedRiskReview: jsonb("generated_risk_review").$type<Array<{
    level: "red" | "yellow" | "green";
    finding: string; impact: string; recommendation: string;
  }>>(),
  generatedDrafts: jsonb("generated_drafts").$type<Record<string, string>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTenderSessionSchema = createInsertSchema(tenderSessions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTenderSession = z.infer<typeof insertTenderSessionSchema>;
export type TenderSession = typeof tenderSessions.$inferSelect;

// ==================== Custom Domain Table ====================
export const customDomains = pgTable("custom_domains", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  agentId: text("agent_id"),
  domain: text("domain").notNull(),
  status: text("status").notNull().default("pending"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomDomainSchema = createInsertSchema(customDomains).omit({ id: true, createdAt: true, updatedAt: true, verifiedAt: true });
export type InsertCustomDomain = z.infer<typeof insertCustomDomainSchema>;
export type CustomDomain = typeof customDomains.$inferSelect;

// ==================== Trial Requests Table ====================
export const trialRequests = pgTable("trial_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  useCase: text("use_case"),
  status: text("status").notNull().default("pending"),
  voucherCode: text("voucher_code"),
  voucherId: integer("voucher_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTrialRequestSchema = createInsertSchema(trialRequests).omit({ id: true, createdAt: true, updatedAt: true, status: true, voucherCode: true, voucherId: true, notes: true });
export type InsertTrialRequest = z.infer<typeof insertTrialRequestSchema>;
export type TrialRequest = typeof trialRequests.$inferSelect;
