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

// Big Ideas Table
export const bigIdeas = pgTable("big_ideas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  goals: jsonb("goals").default([]),
  targetAudience: text("target_audience").default(""),
  expectedOutcome: text("expected_outcome").default(""),
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

// Subscriptions Table
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

// Big Idea schema - Top level of hierarchy
export const insertBigIdeaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["problem", "idea", "inspiration", "mentoring"]),
  description: z.string().min(1, "Description is required"),
  goals: z.array(z.string()).optional().default([]),
  targetAudience: z.string().optional().default(""),
  expectedOutcome: z.string().optional().default(""),
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
  // Hierarchy: Toolbox reference
  toolboxId: z.string().optional().default(""),
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
});

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
