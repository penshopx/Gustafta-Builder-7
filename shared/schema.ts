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

// Big Ideas Table
export const bigIdeas = pgTable("big_ideas", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id"),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  goals: jsonb("goals").default([]),
  targetAudience: text("target_audience").default(""),
  expectedOutcome: text("expected_outcome").default(""),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Toolboxes Table
export const toolboxes = pgTable("toolboxes", {
  id: serial("id").primaryKey(),
  bigIdeaId: integer("big_idea_id").notNull(),
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
  ragChunkSize: integer("rag_chunk_size").default(800),
  ragChunkOverlap: integer("rag_chunk_overlap").default(200),
  ragTopK: integer("rag_top_k").default(5),
  isActive: boolean("is_active").default(false),
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
};

export type SeriesWithHierarchy = SeriesWithStats & {
  bigIdeas: (BigIdea & {
    toolboxes: (Toolbox & {
      agents: {
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
      }[];
    })[];
  })[];
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
  sortOrder: z.number().optional().default(0),
});

export type InsertBigIdea = z.infer<typeof insertBigIdeaSchema>;
export type BigIdea = InsertBigIdea & {
  id: string;
  isActive: boolean;
  createdAt: string;
};

// Toolbox schema - Created from Big Idea
export const insertToolboxSchema = z.object({
  bigIdeaId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  purpose: z.string().optional().default(""),
  capabilities: z.array(z.string()).optional().default([]),
  limitations: z.array(z.string()).optional().default([]),
});

export type InsertToolbox = z.infer<typeof insertToolboxSchema>;
export type Toolbox = InsertToolbox & {
  id: string;
  isActive: boolean;
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
  ragChunkSize: z.number().min(200).max(2000).optional().default(800),
  ragChunkOverlap: z.number().min(0).max(500).optional().default(200),
  ragTopK: z.number().min(1).max(20).optional().default(5),
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

// ==================== MINI APPS ====================

export const miniAppTypeSchema = z.enum([
  "checklist", "calculator", "risk_assessment", "progress_tracker", "document_generator", "custom",
  "issue_log", "action_tracker", "change_log",
  "project_snapshot", "decision_summary", "risk_radar"
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

// ==================== VOICE CHAT CONVERSATIONS ====================

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("New Chat"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("voice_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
