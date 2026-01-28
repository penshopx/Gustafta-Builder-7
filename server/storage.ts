import { randomUUID } from "crypto";
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

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User Profile methods
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;

  // Big Idea methods
  getBigIdeas(): Promise<BigIdea[]>;
  getBigIdea(id: string): Promise<BigIdea | undefined>;
  getActiveBigIdea(): Promise<BigIdea | null>;
  createBigIdea(bigIdea: InsertBigIdea): Promise<BigIdea>;
  updateBigIdea(id: string, data: Partial<InsertBigIdea>): Promise<BigIdea | undefined>;
  setActiveBigIdea(id: string): Promise<BigIdea | undefined>;
  deleteBigIdea(id: string): Promise<boolean>;

  // Toolbox methods
  getToolboxes(bigIdeaId?: string): Promise<Toolbox[]>;
  getToolbox(id: string): Promise<Toolbox | undefined>;
  getActiveToolbox(): Promise<Toolbox | null>;
  createToolbox(toolbox: InsertToolbox): Promise<Toolbox>;
  updateToolbox(id: string, data: Partial<InsertToolbox>): Promise<Toolbox | undefined>;
  setActiveToolbox(id: string): Promise<Toolbox | undefined>;
  deleteToolbox(id: string): Promise<boolean>;

  // Agent methods
  getAgents(toolboxId?: string): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  getActiveAgent(): Promise<Agent | null>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined>;
  setActiveAgent(id: string): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<boolean>;

  // Knowledge Base methods
  getKnowledgeBases(agentId: string): Promise<KnowledgeBase[]>;
  createKnowledgeBase(kb: InsertKnowledgeBase): Promise<KnowledgeBase>;
  updateKnowledgeBase(id: string, data: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase | undefined>;
  deleteKnowledgeBase(id: string): Promise<boolean>;

  // Integration methods
  getIntegrations(agentId: string): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: string, data: Partial<InsertIntegration>): Promise<Integration | undefined>;
  deleteIntegration(id: string): Promise<boolean>;

  // Message methods
  getMessages(agentId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  clearMessages(agentId: string): Promise<boolean>;

  // Analytics methods
  getAnalytics(agentId: string): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalyticsSummary(agentId: string): Promise<{
    totalMessages: number;
    totalSessions: number;
    totalIntegrationCalls: number;
    messagesLast7Days: number[];
    topHours: { hour: number; count: number }[];
  }>;

  // Subscription methods
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionByMayarOrderId(mayarOrderId: string): Promise<Subscription | undefined>;
  getActiveSubscription(userId: string): Promise<Subscription | undefined>;
  updateSubscription(id: string, data: Partial<InsertSubscription>): Promise<Subscription | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>;
  private bigIdeas: Map<string, BigIdea>;
  private toolboxes: Map<string, Toolbox>;
  private agents: Map<string, Agent>;
  private knowledgeBases: Map<string, KnowledgeBase>;
  private integrations: Map<string, Integration>;
  private messages: Map<string, Message>;
  private analytics: Map<string, Analytics>;
  private subscriptions: Map<string, Subscription>;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.bigIdeas = new Map();
    this.toolboxes = new Map();
    this.agents = new Map();
    this.knowledgeBases = new Map();
    this.integrations = new Map();
    this.messages = new Map();
    this.analytics = new Map();
    this.subscriptions = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date().toISOString() };
    this.users.set(id, user);
    return user;
  }

  // User Profile methods
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(p => p.userId === userId);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const profile: UserProfile = {
      ...insertProfile,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(userId: string, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return undefined;
    
    const updated: UserProfile = {
      ...profile,
      displayName: data.displayName !== undefined ? data.displayName : profile.displayName,
      avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : profile.avatarUrl,
      bio: data.bio !== undefined ? data.bio : profile.bio,
      company: data.company !== undefined ? data.company : profile.company,
      position: data.position !== undefined ? data.position : profile.position,
      updatedAt: new Date().toISOString(),
    };
    this.userProfiles.set(profile.id, updated);
    return updated;
  }

  // Big Idea methods
  async getBigIdeas(): Promise<BigIdea[]> {
    return Array.from(this.bigIdeas.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBigIdea(id: string): Promise<BigIdea | undefined> {
    return this.bigIdeas.get(id);
  }

  async getActiveBigIdea(): Promise<BigIdea | null> {
    const bigIdea = Array.from(this.bigIdeas.values()).find((b) => b.isActive);
    return bigIdea || null;
  }

  async createBigIdea(insertBigIdea: InsertBigIdea): Promise<BigIdea> {
    const id = randomUUID();
    
    Array.from(this.bigIdeas.entries()).forEach(([bigIdeaId, b]) => {
      this.bigIdeas.set(bigIdeaId, { ...b, isActive: false });
    });
    
    const bigIdea: BigIdea = {
      id,
      name: insertBigIdea.name,
      type: insertBigIdea.type,
      description: insertBigIdea.description,
      goals: insertBigIdea.goals || [],
      targetAudience: insertBigIdea.targetAudience || "",
      expectedOutcome: insertBigIdea.expectedOutcome || "",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    this.bigIdeas.set(id, bigIdea);
    return bigIdea;
  }

  async updateBigIdea(id: string, data: Partial<InsertBigIdea>): Promise<BigIdea | undefined> {
    const bigIdea = this.bigIdeas.get(id);
    if (!bigIdea) return undefined;

    const updated: BigIdea = {
      ...bigIdea,
      name: data.name !== undefined ? data.name : bigIdea.name,
      type: data.type !== undefined ? data.type : bigIdea.type,
      description: data.description !== undefined ? data.description : bigIdea.description,
      goals: data.goals !== undefined ? data.goals : bigIdea.goals,
      targetAudience: data.targetAudience !== undefined ? data.targetAudience : bigIdea.targetAudience,
      expectedOutcome: data.expectedOutcome !== undefined ? data.expectedOutcome : bigIdea.expectedOutcome,
    };
    
    this.bigIdeas.set(id, updated);
    return updated;
  }

  async setActiveBigIdea(id: string): Promise<BigIdea | undefined> {
    const bigIdea = this.bigIdeas.get(id);
    if (!bigIdea) return undefined;

    Array.from(this.bigIdeas.entries()).forEach(([bigIdeaId, b]) => {
      this.bigIdeas.set(bigIdeaId, { ...b, isActive: false });
    });

    const updated: BigIdea = { ...bigIdea, isActive: true };
    this.bigIdeas.set(id, updated);
    return updated;
  }

  async deleteBigIdea(id: string): Promise<boolean> {
    const bigIdea = this.bigIdeas.get(id);
    if (!bigIdea) return false;
    
    const wasActive = bigIdea.isActive;
    const deleted = this.bigIdeas.delete(id);
    
    if (deleted && wasActive) {
      const remaining = Array.from(this.bigIdeas.values());
      if (remaining.length > 0) {
        this.bigIdeas.set(remaining[0].id, { ...remaining[0], isActive: true });
      }
    }
    
    // Delete related toolboxes
    Array.from(this.toolboxes.entries()).forEach(([toolboxId, t]) => {
      if (t.bigIdeaId === id) {
        this.deleteToolbox(toolboxId);
      }
    });
    
    return deleted;
  }

  // Toolbox methods
  async getToolboxes(bigIdeaId?: string): Promise<Toolbox[]> {
    let toolboxes = Array.from(this.toolboxes.values());
    if (bigIdeaId) {
      toolboxes = toolboxes.filter(t => t.bigIdeaId === bigIdeaId);
    }
    return toolboxes.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getToolbox(id: string): Promise<Toolbox | undefined> {
    return this.toolboxes.get(id);
  }

  async getActiveToolbox(): Promise<Toolbox | null> {
    const toolbox = Array.from(this.toolboxes.values()).find((t) => t.isActive);
    return toolbox || null;
  }

  async createToolbox(insertToolbox: InsertToolbox): Promise<Toolbox> {
    const id = randomUUID();
    
    Array.from(this.toolboxes.entries()).forEach(([toolboxId, t]) => {
      this.toolboxes.set(toolboxId, { ...t, isActive: false });
    });
    
    const toolbox: Toolbox = {
      id,
      bigIdeaId: insertToolbox.bigIdeaId,
      name: insertToolbox.name,
      description: insertToolbox.description || "",
      purpose: insertToolbox.purpose || "",
      capabilities: insertToolbox.capabilities || [],
      limitations: insertToolbox.limitations || [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    this.toolboxes.set(id, toolbox);
    return toolbox;
  }

  async updateToolbox(id: string, data: Partial<InsertToolbox>): Promise<Toolbox | undefined> {
    const toolbox = this.toolboxes.get(id);
    if (!toolbox) return undefined;

    const updated: Toolbox = {
      ...toolbox,
      name: data.name !== undefined ? data.name : toolbox.name,
      description: data.description !== undefined ? data.description : toolbox.description,
      purpose: data.purpose !== undefined ? data.purpose : toolbox.purpose,
      capabilities: data.capabilities !== undefined ? data.capabilities : toolbox.capabilities,
      limitations: data.limitations !== undefined ? data.limitations : toolbox.limitations,
    };
    
    this.toolboxes.set(id, updated);
    return updated;
  }

  async setActiveToolbox(id: string): Promise<Toolbox | undefined> {
    const toolbox = this.toolboxes.get(id);
    if (!toolbox) return undefined;

    Array.from(this.toolboxes.entries()).forEach(([toolboxId, t]) => {
      this.toolboxes.set(toolboxId, { ...t, isActive: false });
    });

    const updated: Toolbox = { ...toolbox, isActive: true };
    this.toolboxes.set(id, updated);
    return updated;
  }

  async deleteToolbox(id: string): Promise<boolean> {
    const toolbox = this.toolboxes.get(id);
    if (!toolbox) return false;
    
    const wasActive = toolbox.isActive;
    const deleted = this.toolboxes.delete(id);
    
    if (deleted && wasActive) {
      const remaining = Array.from(this.toolboxes.values());
      if (remaining.length > 0) {
        this.toolboxes.set(remaining[0].id, { ...remaining[0], isActive: true });
      }
    }
    
    // Delete related agents
    Array.from(this.agents.entries()).forEach(([agentId, a]) => {
      if (a.toolboxId === id) {
        this.deleteAgent(agentId);
      }
    });
    
    return deleted;
  }

  // Agent methods
  async getAgents(toolboxId?: string): Promise<Agent[]> {
    let agents = Array.from(this.agents.values());
    if (toolboxId) {
      agents = agents.filter(a => a.toolboxId === toolboxId);
    }
    return agents.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async getActiveAgent(): Promise<Agent | null> {
    const agent = Array.from(this.agents.values()).find((a) => a.isActive);
    return agent || null;
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    
    Array.from(this.agents.entries()).forEach(([agentId, a]) => {
      this.agents.set(agentId, { ...a, isActive: false });
    });
    
    const accessToken = `gus_${randomUUID().replace(/-/g, "")}`;
    
    const agent: Agent = {
      id,
      name: insertAgent.name,
      description: insertAgent.description || "",
      avatar: insertAgent.avatar || "",
      tagline: insertAgent.tagline || "",
      philosophy: insertAgent.philosophy || "",
      offTopicHandling: insertAgent.offTopicHandling || "politely_redirect",
      systemPrompt: insertAgent.systemPrompt || "You are a helpful assistant.",
      temperature: insertAgent.temperature ?? 0.7,
      maxTokens: insertAgent.maxTokens ?? 1024,
      aiModel: insertAgent.aiModel || "gpt-4o-mini",
      customApiKey: insertAgent.customApiKey || "",
      customBaseUrl: insertAgent.customBaseUrl || "",
      customModelName: insertAgent.customModelName || "",
      greetingMessage: insertAgent.greetingMessage || "",
      conversationStarters: insertAgent.conversationStarters || [],
      language: insertAgent.language || "id",
      category: insertAgent.category || "",
      subcategory: insertAgent.subcategory || "",
      accessToken,
      isPublic: insertAgent.isPublic ?? false,
      allowedDomains: insertAgent.allowedDomains || [],
      toolboxId: insertAgent.toolboxId || "",
      orchestratorRole: insertAgent.orchestratorRole || "standalone",
      parentAgentId: insertAgent.parentAgentId || "",
      agenticMode: insertAgent.agenticMode ?? false,
      attentiveListening: insertAgent.attentiveListening ?? true,
      contextRetention: insertAgent.contextRetention ?? 10,
      proactiveAssistance: insertAgent.proactiveAssistance ?? false,
      learningEnabled: insertAgent.learningEnabled ?? false,
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
      createdAt: new Date().toISOString(),
    };
    
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;

    const updated: Agent = {
      ...agent,
      name: data.name !== undefined ? data.name : agent.name,
      description: data.description !== undefined ? data.description : agent.description,
      avatar: data.avatar !== undefined ? data.avatar : agent.avatar,
      tagline: data.tagline !== undefined ? data.tagline : agent.tagline,
      philosophy: data.philosophy !== undefined ? data.philosophy : agent.philosophy,
      offTopicHandling: data.offTopicHandling !== undefined ? data.offTopicHandling : agent.offTopicHandling,
      systemPrompt: data.systemPrompt !== undefined ? data.systemPrompt : agent.systemPrompt,
      temperature: data.temperature !== undefined ? Math.max(0, Math.min(2, data.temperature)) : agent.temperature,
      maxTokens: data.maxTokens !== undefined ? Math.max(100, Math.min(4096, data.maxTokens)) : agent.maxTokens,
      aiModel: data.aiModel !== undefined ? data.aiModel : agent.aiModel,
      customApiKey: data.customApiKey !== undefined ? data.customApiKey : agent.customApiKey,
      customBaseUrl: data.customBaseUrl !== undefined ? data.customBaseUrl : agent.customBaseUrl,
      customModelName: data.customModelName !== undefined ? data.customModelName : agent.customModelName,
      greetingMessage: data.greetingMessage !== undefined ? data.greetingMessage : agent.greetingMessage,
      conversationStarters: data.conversationStarters !== undefined ? data.conversationStarters : agent.conversationStarters,
      language: data.language !== undefined ? data.language : agent.language,
      category: data.category !== undefined ? data.category : agent.category,
      subcategory: data.subcategory !== undefined ? data.subcategory : agent.subcategory,
      isPublic: data.isPublic !== undefined ? data.isPublic : agent.isPublic,
      allowedDomains: data.allowedDomains !== undefined ? data.allowedDomains : agent.allowedDomains,
      toolboxId: data.toolboxId !== undefined ? data.toolboxId : agent.toolboxId,
      orchestratorRole: data.orchestratorRole !== undefined ? data.orchestratorRole : agent.orchestratorRole,
      parentAgentId: data.parentAgentId !== undefined ? data.parentAgentId : agent.parentAgentId,
      agenticMode: data.agenticMode !== undefined ? data.agenticMode : agent.agenticMode,
      attentiveListening: data.attentiveListening !== undefined ? data.attentiveListening : agent.attentiveListening,
      contextRetention: data.contextRetention !== undefined ? data.contextRetention : agent.contextRetention,
      proactiveAssistance: data.proactiveAssistance !== undefined ? data.proactiveAssistance : agent.proactiveAssistance,
      learningEnabled: data.learningEnabled !== undefined ? data.learningEnabled : agent.learningEnabled,
      emotionalIntelligence: data.emotionalIntelligence !== undefined ? data.emotionalIntelligence : agent.emotionalIntelligence,
      multiStepReasoning: data.multiStepReasoning !== undefined ? data.multiStepReasoning : agent.multiStepReasoning,
      selfCorrection: data.selfCorrection !== undefined ? data.selfCorrection : agent.selfCorrection,
      personality: data.personality !== undefined ? data.personality : agent.personality,
      expertise: data.expertise !== undefined ? data.expertise : agent.expertise,
      communicationStyle: data.communicationStyle !== undefined ? data.communicationStyle : agent.communicationStyle,
      toneOfVoice: data.toneOfVoice !== undefined ? data.toneOfVoice : agent.toneOfVoice,
      responseFormat: data.responseFormat !== undefined ? data.responseFormat : agent.responseFormat,
      avoidTopics: data.avoidTopics !== undefined ? data.avoidTopics : agent.avoidTopics,
      keyPhrases: data.keyPhrases !== undefined ? data.keyPhrases : agent.keyPhrases,
      widgetColor: data.widgetColor !== undefined ? data.widgetColor : agent.widgetColor,
      widgetPosition: data.widgetPosition !== undefined ? data.widgetPosition : agent.widgetPosition,
      widgetSize: data.widgetSize !== undefined ? data.widgetSize : agent.widgetSize,
      widgetBorderRadius: data.widgetBorderRadius !== undefined ? data.widgetBorderRadius : agent.widgetBorderRadius,
      widgetShowBranding: data.widgetShowBranding !== undefined ? data.widgetShowBranding : agent.widgetShowBranding,
      widgetWelcomeMessage: data.widgetWelcomeMessage !== undefined ? data.widgetWelcomeMessage : agent.widgetWelcomeMessage,
      widgetButtonIcon: data.widgetButtonIcon !== undefined ? data.widgetButtonIcon : agent.widgetButtonIcon,
    };
    
    this.agents.set(id, updated);
    return updated;
  }

  async setActiveAgent(id: string): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;

    Array.from(this.agents.entries()).forEach(([agentId, a]) => {
      this.agents.set(agentId, { ...a, isActive: false });
    });

    const updated: Agent = { ...agent, isActive: true };
    this.agents.set(id, updated);
    return updated;
  }

  async deleteAgent(id: string): Promise<boolean> {
    const agent = this.agents.get(id);
    if (!agent) return false;
    
    const wasActive = agent.isActive;
    const deleted = this.agents.delete(id);
    
    if (deleted && wasActive) {
      const remainingAgents = Array.from(this.agents.values());
      if (remainingAgents.length > 0) {
        const firstAgent = remainingAgents[0];
        this.agents.set(firstAgent.id, { ...firstAgent, isActive: true });
      }
    }
    
    // Delete related data
    Array.from(this.knowledgeBases.entries()).forEach(([kbId, kb]) => {
      if (kb.agentId === id) this.knowledgeBases.delete(kbId);
    });
    Array.from(this.integrations.entries()).forEach(([intId, integration]) => {
      if (integration.agentId === id) this.integrations.delete(intId);
    });
    Array.from(this.messages.entries()).forEach(([msgId, msg]) => {
      if (msg.agentId === id) this.messages.delete(msgId);
    });

    return deleted;
  }

  // Knowledge Base methods
  async getKnowledgeBases(agentId: string): Promise<KnowledgeBase[]> {
    return Array.from(this.knowledgeBases.values())
      .filter((kb) => kb.agentId === agentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createKnowledgeBase(insertKb: InsertKnowledgeBase): Promise<KnowledgeBase> {
    const id = randomUUID();
    const kb: KnowledgeBase = {
      id,
      agentId: insertKb.agentId,
      name: insertKb.name,
      type: insertKb.type,
      content: insertKb.content,
      description: insertKb.description || "",
      fileType: insertKb.fileType,
      fileName: insertKb.fileName || "",
      fileSize: insertKb.fileSize || 0,
      fileUrl: insertKb.fileUrl || "",
      processingStatus: insertKb.processingStatus || "completed",
      extractedText: insertKb.extractedText || "",
      createdAt: new Date().toISOString(),
    };
    this.knowledgeBases.set(id, kb);
    return kb;
  }

  async updateKnowledgeBase(id: string, data: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase | undefined> {
    const kb = this.knowledgeBases.get(id);
    if (!kb) return undefined;

    const updated: KnowledgeBase = {
      ...kb,
      name: data.name !== undefined ? data.name : kb.name,
      content: data.content !== undefined ? data.content : kb.content,
      description: data.description !== undefined ? data.description : kb.description,
      processingStatus: data.processingStatus !== undefined ? data.processingStatus : kb.processingStatus,
      extractedText: data.extractedText !== undefined ? data.extractedText : kb.extractedText,
    };
    this.knowledgeBases.set(id, updated);
    return updated;
  }

  async deleteKnowledgeBase(id: string): Promise<boolean> {
    return this.knowledgeBases.delete(id);
  }

  // Integration methods
  async getIntegrations(agentId: string): Promise<Integration[]> {
    return Array.from(this.integrations.values())
      .filter((int) => int.agentId === agentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createIntegration(insertInt: InsertIntegration): Promise<Integration> {
    const id = randomUUID();
    const integration: Integration = {
      id,
      agentId: insertInt.agentId,
      type: insertInt.type,
      name: insertInt.name,
      config: insertInt.config || {},
      isEnabled: insertInt.isEnabled ?? false,
      createdAt: new Date().toISOString(),
    };
    this.integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: string, data: Partial<InsertIntegration>): Promise<Integration | undefined> {
    const integration = this.integrations.get(id);
    if (!integration) return undefined;

    const updated: Integration = {
      ...integration,
      name: data.name !== undefined ? data.name : integration.name,
      config: data.config !== undefined ? data.config : integration.config,
      isEnabled: data.isEnabled !== undefined ? data.isEnabled : integration.isEnabled,
    };
    this.integrations.set(id, updated);
    return updated;
  }

  async deleteIntegration(id: string): Promise<boolean> {
    return this.integrations.delete(id);
  }

  // Message methods
  async getMessages(agentId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((msg) => msg.agentId === agentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createMessage(insertMsg: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      agentId: insertMsg.agentId,
      role: insertMsg.role,
      content: insertMsg.content,
      reasoning: insertMsg.reasoning || "",
      sources: insertMsg.sources || [],
      confidence: insertMsg.confidence,
      createdAt: new Date().toISOString(),
    };
    this.messages.set(id, message);

    // If user message, simulate bot response
    if (insertMsg.role === "user") {
      const agent = await this.getAgent(insertMsg.agentId);
      const botId = randomUUID();
      const botMessage: Message = {
        id: botId,
        agentId: insertMsg.agentId,
        role: "assistant",
        content: this.generateBotResponse(insertMsg.content, agent),
        reasoning: agent?.agenticMode ? "Analyzed user query and formulated response based on context and knowledge." : "",
        sources: [],
        createdAt: new Date().toISOString(),
      };
      this.messages.set(botId, botMessage);
    }

    return message;
  }

  private generateBotResponse(userMessage: string, agent?: Agent): string {
    const greetings = ["hello", "hi", "hey", "greetings", "halo", "hai"];
    const lowerMessage = userMessage.toLowerCase();

    if (greetings.some((g) => lowerMessage.includes(g))) {
      return `Hello! I'm ${agent?.name || "your assistant"}. ${agent?.tagline || "How can I help you today?"}`;
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("bantu")) {
      return `I'd be happy to help! ${agent?.description || "I'm here to assist you with any questions you may have."}`;
    }

    if (lowerMessage.includes("who are you") || lowerMessage.includes("what are you") || lowerMessage.includes("siapa kamu")) {
      return `I'm ${agent?.name || "an AI assistant"}. ${agent?.philosophy || "I'm designed to be helpful, harmless, and honest."}`;
    }

    const responses = [
      "That's an interesting point. Could you tell me more about what you're looking for?",
      "I understand. Let me help you with that.",
      "Great question! Based on my knowledge, I can provide some insights on this topic.",
      "Thank you for sharing that. Is there anything specific you'd like to know?",
      "I'm here to assist you. What would you like to explore further?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  async clearMessages(agentId: string): Promise<boolean> {
    Array.from(this.messages.entries()).forEach(([msgId, msg]) => {
      if (msg.agentId === agentId) {
        this.messages.delete(msgId);
      }
    });
    return true;
  }

  // Analytics methods
  async getAnalytics(agentId: string): Promise<Analytics[]> {
    return Array.from(this.analytics.values())
      .filter((a) => a.agentId === agentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = {
      id,
      agentId: insertAnalytics.agentId,
      eventType: insertAnalytics.eventType,
      metadata: insertAnalytics.metadata || {},
      createdAt: new Date().toISOString(),
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getAnalyticsSummary(agentId: string): Promise<{
    totalMessages: number;
    totalSessions: number;
    totalIntegrationCalls: number;
    messagesLast7Days: number[];
    topHours: { hour: number; count: number }[];
  }> {
    const agentAnalytics = Array.from(this.analytics.values()).filter(
      (a) => a.agentId === agentId
    );
    const agentMessages = Array.from(this.messages.values()).filter(
      (m) => m.agentId === agentId
    );

    const totalMessages = agentMessages.length;
    const sessionEvents = agentAnalytics.filter((a) => a.eventType === "session").length;
    const totalSessions = sessionEvents > 0 ? sessionEvents : (agentMessages.length > 0 ? 1 : 0);
    const totalIntegrationCalls = agentAnalytics.filter((a) => a.eventType === "integration_call").length;

    const now = new Date();
    const messagesLast7Days: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const count = agentMessages.filter((m) => {
        const msgDate = new Date(m.createdAt);
        return msgDate >= dayStart && msgDate <= dayEnd;
      }).length;
      messagesLast7Days.push(count);
    }

    const hourCounts: Record<number, number> = {};
    agentMessages.forEach((m) => {
      const hour = new Date(m.createdAt).getHours();
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
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const subscription: Subscription = {
      id,
      userId: insertSubscription.userId,
      plan: insertSubscription.plan,
      status: insertSubscription.status || "pending",
      mayarOrderId: insertSubscription.mayarOrderId,
      mayarPaymentUrl: insertSubscription.mayarPaymentUrl,
      amount: insertSubscription.amount,
      currency: insertSubscription.currency || "IDR",
      chatbotLimit: insertSubscription.chatbotLimit || 1,
      startDate: insertSubscription.startDate,
      endDate: insertSubscription.endDate,
      createdAt: now,
      updatedAt: now,
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionByMayarOrderId(mayarOrderId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (sub) => sub.mayarOrderId === mayarOrderId
    );
  }

  async getActiveSubscription(userId: string): Promise<Subscription | undefined> {
    const now = new Date();
    return Array.from(this.subscriptions.values()).find((sub) => {
      if (sub.userId !== userId || sub.status !== "active") return false;
      if (sub.endDate) {
        return new Date(sub.endDate) > now;
      }
      return true;
    });
  }

  async updateSubscription(id: string, data: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updated: Subscription = {
      ...subscription,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.subscriptions.set(id, updated);
    return updated;
  }
}

import { dbStorage } from "./db-storage";

// Use DatabaseStorage for persistence
export const storage: IStorage = dbStorage;
