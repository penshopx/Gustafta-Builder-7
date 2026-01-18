import { z } from "zod";

// Agent/Chatbot schema with enhanced features
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
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = InsertAgent & {
  id: string;
  isActive: boolean;
  createdAt: string;
};

// Knowledge Base schema
export const insertKnowledgeBaseSchema = z.object({
  agentId: z.string(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["text", "file", "url"]),
  content: z.string(),
  description: z.string().optional().default(""),
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
