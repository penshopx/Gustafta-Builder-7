import { z } from "zod";

// Export auth models (required for Replit Auth)
export * from "./models/auth";

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

// Agent/Chatbot schema with enhanced features including Toolbox reference
export const insertAgentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  avatar: z.string().optional().default(""),
  tagline: z.string().optional().default(""),
  philosophy: z.string().optional().default(""),
  offTopicHandling: z.string().optional().default("politely_redirect"),
  systemPrompt: z.string().optional().default("You are a helpful assistant."),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().min(100).max(4096).optional().default(1024),
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
