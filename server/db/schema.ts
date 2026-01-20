import { pgTable, text, boolean, timestamp, real, integer, jsonb, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  role: text("role").default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url").default(""),
  bio: text("bio").default(""),
  company: text("company").default(""),
  position: text("position").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bigIdeas = pgTable("big_ideas", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  goals: jsonb("goals").default([]),
  targetAudience: text("target_audience").default(""),
  expectedOutcome: text("expected_outcome").default(""),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const toolboxes = pgTable("toolboxes", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  bigIdeaId: varchar("big_idea_id", { length: 36 }).notNull(),
  name: text("name").notNull(),
  description: text("description").default(""),
  purpose: text("purpose").default(""),
  capabilities: jsonb("capabilities").default([]),
  limitations: jsonb("limitations").default([]),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agents = pgTable("agents", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
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
  toolboxId: varchar("toolbox_id", { length: 36 }).default(""),
  orchestratorRole: text("orchestrator_role").default("standalone"),
  parentAgentId: varchar("parent_agent_id", { length: 36 }).default(""),
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
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const knowledgeBases = pgTable("knowledge_bases", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id", { length: 36 }).notNull(),
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

export const integrations = pgTable("integrations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id", { length: 36 }).notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  config: jsonb("config").default({}),
  isEnabled: boolean("is_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id", { length: 36 }).notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  reasoning: text("reasoning").default(""),
  confidence: real("confidence"),
  sources: jsonb("sources").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id", { length: 36 }).notNull(),
  eventType: text("event_type").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  planId: text("plan_id").notNull(),
  status: text("status").default("pending"),
  mayarOrderId: text("mayar_order_id"),
  mayarPaymentUrl: text("mayar_payment_url"),
  amount: integer("amount").default(0),
  currency: text("currency").default("IDR"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
