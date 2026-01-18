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
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Agent methods
  getAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  getActiveAgent(): Promise<Agent | null>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined>;
  setActiveAgent(id: string): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<boolean>;

  // Knowledge Base methods
  getKnowledgeBases(agentId: string): Promise<KnowledgeBase[]>;
  createKnowledgeBase(kb: InsertKnowledgeBase): Promise<KnowledgeBase>;
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private agents: Map<string, Agent>;
  private knowledgeBases: Map<string, KnowledgeBase>;
  private integrations: Map<string, Integration>;
  private messages: Map<string, Message>;

  constructor() {
    this.users = new Map();
    this.agents = new Map();
    this.knowledgeBases = new Map();
    this.integrations = new Map();
    this.messages = new Map();
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Agent methods
  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values()).sort(
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
    
    // Deactivate all existing agents and set new one as active
    for (const [agentId, a] of this.agents) {
      this.agents.set(agentId, { ...a, isActive: false });
    }
    
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
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;

    // Only update fields that are provided and valid
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
    };
    
    this.agents.set(id, updated);
    return updated;
  }

  async setActiveAgent(id: string): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;

    // Deactivate all agents
    for (const [agentId, a] of this.agents) {
      this.agents.set(agentId, { ...a, isActive: false });
    }

    // Activate the selected agent
    const updated: Agent = { ...agent, isActive: true };
    this.agents.set(id, updated);
    return updated;
  }

  async deleteAgent(id: string): Promise<boolean> {
    const agent = this.agents.get(id);
    if (!agent) return false;
    
    const wasActive = agent.isActive;
    const deleted = this.agents.delete(id);
    
    // If deleted agent was active, activate another agent if available
    if (deleted && wasActive) {
      const remainingAgents = Array.from(this.agents.values());
      if (remainingAgents.length > 0) {
        const firstAgent = remainingAgents[0];
        this.agents.set(firstAgent.id, { ...firstAgent, isActive: true });
      }
    }
    
    // Also delete related data
    for (const [kbId, kb] of this.knowledgeBases) {
      if (kb.agentId === id) this.knowledgeBases.delete(kbId);
    }
    for (const [intId, integration] of this.integrations) {
      if (integration.agentId === id) this.integrations.delete(intId);
    }
    for (const [msgId, msg] of this.messages) {
      if (msg.agentId === id) this.messages.delete(msgId);
    }

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
      createdAt: new Date().toISOString(),
    };
    this.knowledgeBases.set(id, kb);
    return kb;
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
        createdAt: new Date().toISOString(),
      };
      this.messages.set(botId, botMessage);
    }

    return message;
  }

  private generateBotResponse(userMessage: string, agent?: Agent): string {
    const greetings = ["hello", "hi", "hey", "greetings"];
    const lowerMessage = userMessage.toLowerCase();

    if (greetings.some((g) => lowerMessage.includes(g))) {
      return `Hello! I'm ${agent?.name || "your assistant"}. ${agent?.tagline || "How can I help you today?"}`;
    }

    if (lowerMessage.includes("help")) {
      return `I'd be happy to help! ${agent?.description || "I'm here to assist you with any questions you may have."}`;
    }

    if (lowerMessage.includes("who are you") || lowerMessage.includes("what are you")) {
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
    for (const [msgId, msg] of this.messages) {
      if (msg.agentId === agentId) {
        this.messages.delete(msgId);
      }
    }
    return true;
  }
}

export const storage = new MemStorage();
