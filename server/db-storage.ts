import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  agents,
  bigIdeas,
  toolboxes,
  knowledgeBases,
  integrations,
  agentMessages,
  analyticsTable,
  subscriptionsTable,
  userProfiles,
} from "@shared/schema";
import type { IStorage } from "./storage";
import type {
  Agent,
  InsertAgent,
  KnowledgeBase,
  InsertKnowledgeBase,
  Integration,
  InsertIntegration,
  Message,
  InsertMessage,
  User,
  InsertUser,
  Analytics,
  InsertAnalytics,
  BigIdea,
  InsertBigIdea,
  Toolbox,
  InsertToolbox,
  UserProfile,
  InsertUserProfile,
  Subscription,
  InsertSubscription,
} from "@shared/schema";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export class DatabaseStorage implements IStorage {
  
  // User methods (placeholder - using Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return { ...insertUser, id: "", createdAt: new Date().toISOString() };
  }

  // User Profile methods
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      userId: row.userId,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl || "",
      bio: row.bio || "",
      company: row.company || "",
      position: row.position || "",
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const result = await db.insert(userProfiles).values({
      userId: insertProfile.userId,
      displayName: insertProfile.displayName,
      avatarUrl: insertProfile.avatarUrl || "",
      bio: insertProfile.bio || "",
      company: insertProfile.company || "",
      position: insertProfile.position || "",
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      userId: row.userId,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl || "",
      bio: row.bio || "",
      company: row.company || "",
      position: row.position || "",
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async updateUserProfile(userId: string, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const result = await db.update(userProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      userId: row.userId,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl || "",
      bio: row.bio || "",
      company: row.company || "",
      position: row.position || "",
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  // Big Idea methods
  async getBigIdeas(): Promise<BigIdea[]> {
    const result = await db.select().from(bigIdeas).orderBy(desc(bigIdeas.createdAt));
    return result.map(row => ({
      id: String(row.id),
      name: row.name,
      type: row.type as "problem" | "idea" | "inspiration" | "mentoring",
      description: row.description,
      goals: (row.goals as string[]) || [],
      targetAudience: row.targetAudience || "",
      expectedOutcome: row.expectedOutcome || "",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async getBigIdea(id: string): Promise<BigIdea | undefined> {
    const result = await db.select().from(bigIdeas).where(eq(bigIdeas.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      name: row.name,
      type: row.type as "problem" | "idea" | "inspiration" | "mentoring",
      description: row.description,
      goals: (row.goals as string[]) || [],
      targetAudience: row.targetAudience || "",
      expectedOutcome: row.expectedOutcome || "",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getActiveBigIdea(): Promise<BigIdea | null> {
    const result = await db.select().from(bigIdeas).where(eq(bigIdeas.isActive, true)).limit(1);
    if (result.length === 0) return null;
    const row = result[0];
    return {
      id: String(row.id),
      name: row.name,
      type: row.type as "problem" | "idea" | "inspiration" | "mentoring",
      description: row.description,
      goals: (row.goals as string[]) || [],
      targetAudience: row.targetAudience || "",
      expectedOutcome: row.expectedOutcome || "",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async createBigIdea(insertBigIdea: InsertBigIdea): Promise<BigIdea> {
    await db.update(bigIdeas).set({ isActive: false });
    const result = await db.insert(bigIdeas).values({
      name: insertBigIdea.name,
      type: insertBigIdea.type,
      description: insertBigIdea.description,
      goals: insertBigIdea.goals || [],
      targetAudience: insertBigIdea.targetAudience || "",
      expectedOutcome: insertBigIdea.expectedOutcome || "",
      isActive: true,
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      name: row.name,
      type: row.type as "problem" | "idea" | "inspiration" | "mentoring",
      description: row.description,
      goals: (row.goals as string[]) || [],
      targetAudience: row.targetAudience || "",
      expectedOutcome: row.expectedOutcome || "",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async updateBigIdea(id: string, data: Partial<InsertBigIdea>): Promise<BigIdea | undefined> {
    const result = await db.update(bigIdeas)
      .set(data)
      .where(eq(bigIdeas.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      name: row.name,
      type: row.type as "problem" | "idea" | "inspiration" | "mentoring",
      description: row.description,
      goals: (row.goals as string[]) || [],
      targetAudience: row.targetAudience || "",
      expectedOutcome: row.expectedOutcome || "",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async setActiveBigIdea(id: string): Promise<BigIdea | undefined> {
    await db.update(bigIdeas).set({ isActive: false });
    return this.updateBigIdea(id, {});
  }

  async deleteBigIdea(id: string): Promise<boolean> {
    const result = await db.delete(bigIdeas).where(eq(bigIdeas.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Toolbox methods
  async getToolboxes(bigIdeaId?: string): Promise<Toolbox[]> {
    const query = bigIdeaId 
      ? db.select().from(toolboxes).where(eq(toolboxes.bigIdeaId, parseInt(bigIdeaId))).orderBy(desc(toolboxes.createdAt))
      : db.select().from(toolboxes).orderBy(desc(toolboxes.createdAt));
    const result = await query;
    return result.map(row => ({
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async getToolbox(id: string): Promise<Toolbox | undefined> {
    const result = await db.select().from(toolboxes).where(eq(toolboxes.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getActiveToolbox(): Promise<Toolbox | null> {
    const result = await db.select().from(toolboxes).where(eq(toolboxes.isActive, true)).limit(1);
    if (result.length === 0) return null;
    const row = result[0];
    return {
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async createToolbox(insertToolbox: InsertToolbox): Promise<Toolbox> {
    await db.update(toolboxes).set({ isActive: false });
    const result = await db.insert(toolboxes).values({
      bigIdeaId: parseInt(insertToolbox.bigIdeaId),
      name: insertToolbox.name,
      description: insertToolbox.description || "",
      purpose: insertToolbox.purpose || "",
      capabilities: insertToolbox.capabilities || [],
      limitations: insertToolbox.limitations || [],
      isActive: true,
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async updateToolbox(id: string, data: Partial<InsertToolbox>): Promise<Toolbox | undefined> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.purpose !== undefined) updateData.purpose = data.purpose;
    if (data.capabilities !== undefined) updateData.capabilities = data.capabilities;
    if (data.limitations !== undefined) updateData.limitations = data.limitations;
    
    const result = await db.update(toolboxes)
      .set(updateData)
      .where(eq(toolboxes.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async setActiveToolbox(id: string): Promise<Toolbox | undefined> {
    await db.update(toolboxes).set({ isActive: false });
    const result = await db.update(toolboxes)
      .set({ isActive: true })
      .where(eq(toolboxes.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async deleteToolbox(id: string): Promise<boolean> {
    const result = await db.delete(toolboxes).where(eq(toolboxes.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Agent methods
  async getAgents(toolboxId?: string): Promise<Agent[]> {
    const query = toolboxId 
      ? db.select().from(agents).where(eq(agents.toolboxId, parseInt(toolboxId))).orderBy(desc(agents.createdAt))
      : db.select().from(agents).orderBy(desc(agents.createdAt));
    const result = await query;
    return result.map(row => this.mapAgentRow(row));
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    const result = await db.select().from(agents).where(eq(agents.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    return this.mapAgentRow(result[0]);
  }

  async getActiveAgent(): Promise<Agent | null> {
    const result = await db.select().from(agents).where(eq(agents.isActive, true)).limit(1);
    if (result.length === 0) return null;
    return this.mapAgentRow(result[0]);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    await db.update(agents).set({ isActive: false });
    const result = await db.insert(agents).values({
      name: insertAgent.name,
      description: insertAgent.description || "",
      avatar: insertAgent.avatar || "",
      tagline: insertAgent.tagline || "",
      philosophy: insertAgent.philosophy || "",
      offTopicHandling: insertAgent.offTopicHandling || "politely_redirect",
      systemPrompt: insertAgent.systemPrompt || "You are a helpful assistant.",
      temperature: insertAgent.temperature || 0.7,
      maxTokens: insertAgent.maxTokens || 1024,
      aiModel: insertAgent.aiModel || "gpt-4o-mini",
      customApiKey: insertAgent.customApiKey || "",
      customBaseUrl: insertAgent.customBaseUrl || "",
      customModelName: insertAgent.customModelName || "",
      greetingMessage: insertAgent.greetingMessage || "",
      conversationStarters: insertAgent.conversationStarters || [],
      language: insertAgent.language || "id",
      category: insertAgent.category || "",
      subcategory: insertAgent.subcategory || "",
      accessToken: insertAgent.accessToken || "",
      isPublic: insertAgent.isPublic || false,
      allowedDomains: insertAgent.allowedDomains || [],
      toolboxId: insertAgent.toolboxId ? parseInt(insertAgent.toolboxId) : null,
      orchestratorRole: insertAgent.orchestratorRole || "standalone",
      parentAgentId: insertAgent.parentAgentId ? parseInt(insertAgent.parentAgentId) : null,
      agenticMode: insertAgent.agenticMode || false,
      attentiveListening: insertAgent.attentiveListening ?? true,
      contextRetention: insertAgent.contextRetention || 10,
      proactiveAssistance: insertAgent.proactiveAssistance || false,
      learningEnabled: insertAgent.learningEnabled || false,
      emotionalIntelligence: insertAgent.emotionalIntelligence ?? true,
      multiStepReasoning: insertAgent.multiStepReasoning ?? true,
      selfCorrection: insertAgent.selfCorrection ?? true,
      personality: insertAgent.personality || "",
      expertise: insertAgent.expertise || [],
      communicationStyle: insertAgent.communicationStyle || "friendly",
      toneOfVoice: insertAgent.toneOfVoice || "professional",
      responseFormat: insertAgent.responseFormat || "conversational",
      avoidTopics: insertAgent.avoidTopics || [],
      keyPhrases: insertAgent.keyPhrases || [],
      widgetColor: insertAgent.widgetColor || "#6366f1",
      widgetPosition: insertAgent.widgetPosition || "bottom-right",
      widgetSize: insertAgent.widgetSize || "medium",
      widgetBorderRadius: insertAgent.widgetBorderRadius || "rounded",
      widgetShowBranding: insertAgent.widgetShowBranding ?? true,
      widgetWelcomeMessage: insertAgent.widgetWelcomeMessage || "",
      widgetButtonIcon: insertAgent.widgetButtonIcon || "chat",
      isActive: true,
    }).returning();
    return this.mapAgentRow(result[0]);
  }

  async updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined> {
    const updateData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "toolboxId" || key === "parentAgentId") {
          updateData[key] = value ? parseInt(value as string) : null;
        } else {
          updateData[key] = value;
        }
      }
    });
    
    const result = await db.update(agents)
      .set(updateData)
      .where(eq(agents.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapAgentRow(result[0]);
  }

  async setActiveAgent(id: string): Promise<Agent | undefined> {
    await db.update(agents).set({ isActive: false });
    const result = await db.update(agents)
      .set({ isActive: true })
      .where(eq(agents.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapAgentRow(result[0]);
  }

  async deleteAgent(id: string): Promise<boolean> {
    const result = await db.delete(agents).where(eq(agents.id, parseInt(id))).returning();
    return result.length > 0;
  }

  private mapAgentRow(row: typeof agents.$inferSelect): Agent {
    return {
      id: String(row.id),
      name: row.name,
      description: row.description || "",
      avatar: row.avatar || "",
      tagline: row.tagline || "",
      philosophy: row.philosophy || "",
      offTopicHandling: row.offTopicHandling || "politely_redirect",
      systemPrompt: row.systemPrompt || "You are a helpful assistant.",
      temperature: row.temperature || 0.7,
      maxTokens: row.maxTokens || 1024,
      aiModel: (row.aiModel || "gpt-4o-mini") as Agent["aiModel"],
      customApiKey: row.customApiKey || "",
      customBaseUrl: row.customBaseUrl || "",
      customModelName: row.customModelName || "",
      greetingMessage: row.greetingMessage || "",
      conversationStarters: (row.conversationStarters as string[]) || [],
      language: row.language || "id",
      category: row.category || "",
      subcategory: row.subcategory || "",
      accessToken: row.accessToken || "",
      isPublic: row.isPublic || false,
      allowedDomains: (row.allowedDomains as string[]) || [],
      toolboxId: row.toolboxId ? String(row.toolboxId) : "",
      orchestratorRole: (row.orchestratorRole || "standalone") as Agent["orchestratorRole"],
      parentAgentId: row.parentAgentId ? String(row.parentAgentId) : "",
      agenticMode: row.agenticMode || false,
      attentiveListening: row.attentiveListening ?? true,
      contextRetention: row.contextRetention || 10,
      proactiveAssistance: row.proactiveAssistance || false,
      learningEnabled: row.learningEnabled || false,
      emotionalIntelligence: row.emotionalIntelligence ?? true,
      multiStepReasoning: row.multiStepReasoning ?? true,
      selfCorrection: row.selfCorrection ?? true,
      personality: row.personality || "",
      expertise: (row.expertise as string[]) || [],
      communicationStyle: row.communicationStyle || "friendly",
      toneOfVoice: row.toneOfVoice || "professional",
      responseFormat: row.responseFormat || "conversational",
      avoidTopics: (row.avoidTopics as string[]) || [],
      keyPhrases: (row.keyPhrases as string[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  // Knowledge Base methods
  async getKnowledgeBases(agentId: string): Promise<KnowledgeBase[]> {
    const result = await db.select().from(knowledgeBases)
      .where(eq(knowledgeBases.agentId, parseInt(agentId)))
      .orderBy(desc(knowledgeBases.createdAt));
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      type: row.type as "text" | "file" | "url",
      content: row.content,
      description: row.description || "",
      fileType: row.fileType as KnowledgeBase["fileType"],
      fileName: row.fileName || "",
      fileSize: row.fileSize || 0,
      fileUrl: row.fileUrl || "",
      processingStatus: (row.processingStatus || "completed") as KnowledgeBase["processingStatus"],
      extractedText: row.extractedText || "",
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createKnowledgeBase(kb: InsertKnowledgeBase): Promise<KnowledgeBase> {
    const result = await db.insert(knowledgeBases).values({
      agentId: parseInt(kb.agentId),
      name: kb.name,
      type: kb.type,
      content: kb.content,
      description: kb.description || "",
      fileType: kb.fileType,
      fileName: kb.fileName || "",
      fileSize: kb.fileSize || 0,
      fileUrl: kb.fileUrl || "",
      processingStatus: kb.processingStatus || "completed",
      extractedText: kb.extractedText || "",
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      type: row.type as "text" | "file" | "url",
      content: row.content,
      description: row.description || "",
      fileType: row.fileType as KnowledgeBase["fileType"],
      fileName: row.fileName || "",
      fileSize: row.fileSize || 0,
      fileUrl: row.fileUrl || "",
      processingStatus: (row.processingStatus || "completed") as KnowledgeBase["processingStatus"],
      extractedText: row.extractedText || "",
      createdAt: row.createdAt.toISOString(),
    };
  }

  async updateKnowledgeBase(id: string, data: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase | undefined> {
    const updateData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== "agentId") {
        updateData[key] = value;
      }
    });
    
    const result = await db.update(knowledgeBases)
      .set(updateData)
      .where(eq(knowledgeBases.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      type: row.type as "text" | "file" | "url",
      content: row.content,
      description: row.description || "",
      fileType: row.fileType as KnowledgeBase["fileType"],
      fileName: row.fileName || "",
      fileSize: row.fileSize || 0,
      fileUrl: row.fileUrl || "",
      processingStatus: (row.processingStatus || "completed") as KnowledgeBase["processingStatus"],
      extractedText: row.extractedText || "",
      createdAt: row.createdAt.toISOString(),
    };
  }

  async deleteKnowledgeBase(id: string): Promise<boolean> {
    const result = await db.delete(knowledgeBases).where(eq(knowledgeBases.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Integration methods
  async getIntegrations(agentId: string): Promise<Integration[]> {
    const result = await db.select().from(integrations)
      .where(eq(integrations.agentId, parseInt(agentId)))
      .orderBy(desc(integrations.createdAt));
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      type: row.type as Integration["type"],
      name: row.name,
      config: (row.config as Record<string, string>) || {},
      isEnabled: row.isEnabled || false,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const result = await db.insert(integrations).values({
      agentId: parseInt(integration.agentId),
      type: integration.type,
      name: integration.name,
      config: integration.config || {},
      isEnabled: integration.isEnabled || false,
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      type: row.type as Integration["type"],
      name: row.name,
      config: (row.config as Record<string, string>) || {},
      isEnabled: row.isEnabled || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async updateIntegration(id: string, data: Partial<InsertIntegration>): Promise<Integration | undefined> {
    const updateData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== "agentId") {
        updateData[key] = value;
      }
    });
    
    const result = await db.update(integrations)
      .set(updateData)
      .where(eq(integrations.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      type: row.type as Integration["type"],
      name: row.name,
      config: (row.config as Record<string, string>) || {},
      isEnabled: row.isEnabled || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async deleteIntegration(id: string): Promise<boolean> {
    const result = await db.delete(integrations).where(eq(integrations.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Message methods
  async getMessages(agentId: string): Promise<Message[]> {
    const result = await db.select().from(agentMessages)
      .where(eq(agentMessages.agentId, parseInt(agentId)))
      .orderBy(agentMessages.createdAt);
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      role: row.role as "user" | "assistant",
      content: row.content,
      reasoning: row.reasoning || "",
      confidence: row.confidence || undefined,
      sources: (row.sources as string[]) || [],
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const sourcesArray = Array.isArray(message.sources) ? message.sources : [];
    const agentIdNum = parseInt(message.agentId);
    const reasoningVal = message.reasoning || "";
    const confidenceVal = message.confidence || 0;
    const sourcesVal = `{${sourcesArray.join(",")}}`;
    
    const result = await db.execute(sql`
      INSERT INTO agent_messages (agent_id, role, content, reasoning, confidence, sources)
      VALUES (${agentIdNum}, ${message.role}, ${message.content}, ${reasoningVal}, ${confidenceVal}, ${sourcesVal}::text[])
      RETURNING *
    `);
    const rows = result.rows as any[];
    const row = rows[0];
    return {
      id: String(row.id),
      agentId: String(row.agent_id),
      role: row.role as "user" | "assistant",
      content: row.content,
      reasoning: row.reasoning || "",
      confidence: row.confidence || undefined,
      sources: (row.sources as string[]) || [],
      createdAt: new Date(row.created_at).toISOString(),
    };
  }

  async clearMessages(agentId: string): Promise<boolean> {
    await db.delete(agentMessages).where(eq(agentMessages.agentId, parseInt(agentId)));
    return true;
  }

  // Analytics methods
  async getAnalytics(agentId: string): Promise<Analytics[]> {
    const result = await db.select().from(analyticsTable)
      .where(eq(analyticsTable.agentId, parseInt(agentId)))
      .orderBy(desc(analyticsTable.createdAt));
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      eventType: row.eventType as Analytics["eventType"],
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createAnalytics(analytics: InsertAnalytics): Promise<Analytics> {
    const result = await db.insert(analyticsTable).values({
      agentId: parseInt(analytics.agentId),
      eventType: analytics.eventType,
      metadata: analytics.metadata || {},
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      eventType: row.eventType as Analytics["eventType"],
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getAnalyticsSummary(agentId: string): Promise<{
    totalMessages: number;
    totalSessions: number;
    totalIntegrationCalls: number;
    messagesLast7Days: number[];
    topHours: { hour: number; count: number }[];
  }> {
    const analytics = await this.getAnalytics(agentId);
    
    const totalMessages = analytics.filter(a => a.eventType === "message").length;
    const totalSessions = analytics.filter(a => a.eventType === "session").length;
    const totalIntegrationCalls = analytics.filter(a => a.eventType === "integration_call").length;
    
    const now = new Date();
    const messagesLast7Days: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      const count = analytics.filter(a => {
        const eventDate = new Date(a.createdAt);
        return a.eventType === "message" && eventDate >= dayStart && eventDate <= dayEnd;
      }).length;
      messagesLast7Days.push(count);
    }
    
    const hourCounts: Record<number, number> = {};
    analytics.forEach(a => {
      const hour = new Date(a.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const topHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalMessages,
      totalSessions,
      totalIntegrationCalls,
      messagesLast7Days,
      topHours,
    };
  }

  // Subscription methods
  private mapSubscriptionRow(row: typeof subscriptionsTable.$inferSelect): Subscription {
    return {
      id: String(row.id),
      userId: row.userId,
      plan: row.plan as Subscription["plan"],
      status: (row.status || "pending") as Subscription["status"],
      mayarOrderId: row.mayarOrderId || undefined,
      mayarPaymentUrl: row.mayarPaymentUrl || undefined,
      amount: row.amount || 0,
      currency: row.currency || "IDR",
      chatbotLimit: row.chatbotLimit || 1,
      startDate: row.startDate?.toISOString(),
      endDate: row.endDate?.toISOString(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(subscriptionsTable).values({
      userId: subscription.userId,
      plan: subscription.plan,
      status: subscription.status || "pending",
      mayarOrderId: subscription.mayarOrderId,
      mayarPaymentUrl: subscription.mayarPaymentUrl,
      amount: subscription.amount || 0,
      currency: subscription.currency || "IDR",
      chatbotLimit: subscription.chatbotLimit || 1,
      startDate: subscription.startDate ? new Date(subscription.startDate) : null,
      endDate: subscription.endDate ? new Date(subscription.endDate) : null,
    }).returning();
    return this.mapSubscriptionRow(result[0]);
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    return this.mapSubscriptionRow(result[0]);
  }

  async getSubscriptionByMayarOrderId(mayarOrderId: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptionsTable)
      .where(eq(subscriptionsTable.mayarOrderId, mayarOrderId))
      .limit(1);
    if (result.length === 0) return undefined;
    return this.mapSubscriptionRow(result[0]);
  }

  async getActiveSubscription(userId: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptionsTable)
      .where(and(
        eq(subscriptionsTable.userId, userId),
        eq(subscriptionsTable.status, "active")
      ))
      .orderBy(desc(subscriptionsTable.endDate))
      .limit(1);
    if (result.length === 0) return undefined;
    return this.mapSubscriptionRow(result[0]);
  }

  async updateSubscription(id: string, data: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "startDate" || key === "endDate") {
          updateData[key] = value ? new Date(value as string) : null;
        } else {
          updateData[key] = value;
        }
      }
    });
    
    const result = await db.update(subscriptionsTable)
      .set(updateData)
      .where(eq(subscriptionsTable.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapSubscriptionRow(result[0]);
  }
}

export const dbStorage = new DatabaseStorage();
