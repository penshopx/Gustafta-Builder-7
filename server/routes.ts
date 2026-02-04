import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertAgentSchema,
  insertKnowledgeBaseSchema,
  insertIntegrationSchema,
  insertMessageSchema,
  insertBigIdeaSchema,
  insertToolboxSchema,
  insertUserProfileSchema,
} from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import OpenAI from "openai";
import { createPaymentLink, subscriptionPlans, parseWebhookPayload, type SubscriptionPlanKey } from "./lib/mayar";
import { gustaftaKnowledgeBaseAgent } from "./seed-knowledge-base";
import { isAuthenticated } from "./replit_integrations/auth";

// Initialize OpenAI client with Replit AI Integrations
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });

  // ==================== User Profile Routes (Protected) ====================

  // Get user profile
  app.get("/api/profile/:userId", isAuthenticated, async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Create or update user profile
  app.post("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertUserProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      
      const existingProfile = await storage.getUserProfile(parsed.data.userId);
      let profile;
      
      if (existingProfile) {
        profile = await storage.updateUserProfile(parsed.data.userId, parsed.data);
      } else {
        profile = await storage.createUserProfile(parsed.data);
      }
      
      res.status(existingProfile ? 200 : 201).json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  // Upload avatar
  app.post("/api/profile/avatar", isAuthenticated, upload.single("avatar"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const avatarUrl = `/uploads/${req.file.filename}`;
      res.json({ avatarUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload avatar" });
    }
  });

  // ==================== Big Idea Routes (Protected) ====================

  // Get all big ideas
  app.get("/api/big-ideas", isAuthenticated, async (_req, res) => {
    try {
      const bigIdeas = await storage.getBigIdeas();
      res.json(bigIdeas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch big ideas" });
    }
  });

  // Get active big idea
  app.get("/api/big-ideas/active", isAuthenticated, async (_req, res) => {
    try {
      const bigIdea = await storage.getActiveBigIdea();
      res.json(bigIdea);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active big idea" });
    }
  });

  // Get single big idea
  app.get("/api/big-ideas/:id", isAuthenticated, async (req, res) => {
    try {
      const bigIdea = await storage.getBigIdea(req.params.id);
      if (!bigIdea) {
        return res.status(404).json({ error: "Big idea not found" });
      }
      res.json(bigIdea);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch big idea" });
    }
  });

  // Create big idea
  app.post("/api/big-ideas", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertBigIdeaSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const bigIdea = await storage.createBigIdea(parsed.data);
      res.status(201).json(bigIdea);
    } catch (error) {
      res.status(500).json({ error: "Failed to create big idea" });
    }
  });

  // Update big idea
  app.patch("/api/big-ideas/:id", isAuthenticated, async (req, res) => {
    try {
      const bigIdea = await storage.updateBigIdea(req.params.id, req.body);
      if (!bigIdea) {
        return res.status(404).json({ error: "Big idea not found" });
      }
      res.json(bigIdea);
    } catch (error) {
      res.status(500).json({ error: "Failed to update big idea" });
    }
  });

  // Activate big idea
  app.post("/api/big-ideas/:id/activate", isAuthenticated, async (req, res) => {
    try {
      const bigIdea = await storage.setActiveBigIdea(req.params.id);
      if (!bigIdea) {
        return res.status(404).json({ error: "Big idea not found" });
      }
      res.json(bigIdea);
    } catch (error) {
      res.status(500).json({ error: "Failed to activate big idea" });
    }
  });

  // Delete big idea
  app.delete("/api/big-ideas/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteBigIdea(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Big idea not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete big idea" });
    }
  });

  // ==================== Toolbox Routes (Protected) ====================

  // Get all toolboxes (optionally filter by big idea)
  app.get("/api/toolboxes", isAuthenticated, async (req, res) => {
    try {
      const bigIdeaId = req.query.bigIdeaId as string | undefined;
      const toolboxes = await storage.getToolboxes(bigIdeaId);
      res.json(toolboxes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch toolboxes" });
    }
  });

  // Get active toolbox
  app.get("/api/toolboxes/active", isAuthenticated, async (_req, res) => {
    try {
      const toolbox = await storage.getActiveToolbox();
      res.json(toolbox);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active toolbox" });
    }
  });

  // Get single toolbox
  app.get("/api/toolboxes/:id", isAuthenticated, async (req, res) => {
    try {
      const toolbox = await storage.getToolbox(req.params.id);
      if (!toolbox) {
        return res.status(404).json({ error: "Toolbox not found" });
      }
      res.json(toolbox);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch toolbox" });
    }
  });

  // Create toolbox
  app.post("/api/toolboxes", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertToolboxSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const toolbox = await storage.createToolbox(parsed.data);
      res.status(201).json(toolbox);
    } catch (error) {
      res.status(500).json({ error: "Failed to create toolbox" });
    }
  });

  // Update toolbox
  app.patch("/api/toolboxes/:id", isAuthenticated, async (req, res) => {
    try {
      const toolbox = await storage.updateToolbox(req.params.id, req.body);
      if (!toolbox) {
        return res.status(404).json({ error: "Toolbox not found" });
      }
      res.json(toolbox);
    } catch (error) {
      res.status(500).json({ error: "Failed to update toolbox" });
    }
  });

  // Activate toolbox
  app.post("/api/toolboxes/:id/activate", isAuthenticated, async (req, res) => {
    try {
      const toolbox = await storage.setActiveToolbox(req.params.id);
      if (!toolbox) {
        return res.status(404).json({ error: "Toolbox not found" });
      }
      res.json(toolbox);
    } catch (error) {
      res.status(500).json({ error: "Failed to activate toolbox" });
    }
  });

  // Delete toolbox
  app.delete("/api/toolboxes/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteToolbox(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Toolbox not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete toolbox" });
    }
  });

  // ==================== Public Agent Routes ====================
  
  // Get Gustafta Assistant (public - for landing page chatbot)
  app.get("/api/agents/gustafta-assistant", async (_req, res) => {
    try {
      const agents = await storage.getAgents();
      const gustaftaAssistant = agents.find(agent => agent.name === "Gustafta Assistant");
      if (!gustaftaAssistant) {
        return res.status(404).json({ error: "Gustafta Assistant not found" });
      }
      res.json(gustaftaAssistant);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Gustafta Assistant" });
    }
  });

  // ==================== Agent Routes (Protected) ====================
  
  // Get all agents (optionally filter by toolbox)
  app.get("/api/agents", isAuthenticated, async (req, res) => {
    try {
      const toolboxId = req.query.toolboxId as string | undefined;
      const agents = await storage.getAgents(toolboxId);
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  // Get active agent
  app.get("/api/agents/active", isAuthenticated, async (_req, res) => {
    try {
      const agent = await storage.getActiveAgent();
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active agent" });
    }
  });

  // Get single agent
  app.get("/api/agents/:id", isAuthenticated, async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  // Create agent (with subscription check)
  app.post("/api/agents", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found" });
      }

      // Check subscription status - auto-create free trial if no subscription exists
      let subscription = await storage.getActiveSubscription(userId);
      
      if (!subscription) {
        // Auto-create free trial subscription for new users
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 14); // 14-day free trial
        
        subscription = await storage.createSubscription({
          userId,
          plan: "free_trial",
          status: "active",
          amount: 0,
          currency: "IDR",
          chatbotLimit: 1,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        
        console.log(`Created free trial subscription for user ${userId}`);
      }

      if (subscription.status !== "active") {
        return res.status(403).json({ 
          error: "Subscription expired",
          message: "Langganan Anda sudah habis. Silakan perpanjang untuk membuat chatbot baru.",
          code: "SUBSCRIPTION_EXPIRED"
        });
      }

      // Check chatbot limit
      const currentAgentCount = await storage.countUserAgents(userId);
      const chatbotLimit = subscription.chatbotLimit || 1;

      if (currentAgentCount >= chatbotLimit) {
        return res.status(403).json({ 
          error: "Chatbot limit reached",
          message: `Anda sudah mencapai batas ${chatbotLimit} chatbot. Upgrade paket untuk menambah chatbot.`,
          code: "LIMIT_REACHED",
          currentCount: currentAgentCount,
          limit: chatbotLimit
        });
      }

      // Parse and validate agent data
      const parsed = insertAgentSchema.safeParse({
        ...req.body,
        userId: userId, // Add user ID to agent
      });
      
      if (!parsed.success) {
        console.error("Agent validation error:", parsed.error.format());
        return res.status(400).json({ error: parsed.error.message, details: parsed.error.format() });
      }
      
      const agent = await storage.createAgent(parsed.data);
      res.status(201).json(agent);
    } catch (error) {
      console.error("Agent creation error:", error);
      res.status(500).json({ error: "Failed to create agent", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Update agent
  app.patch("/api/agents/:id", isAuthenticated, async (req, res) => {
    try {
      const agent = await storage.updateAgent(req.params.id, req.body);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to update agent" });
    }
  });

  // Activate agent
  app.post("/api/agents/:id/activate", isAuthenticated, async (req, res) => {
    try {
      const agent = await storage.setActiveAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to activate agent" });
    }
  });

  // Delete agent
  app.delete("/api/agents/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteAgent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete agent" });
    }
  });

  // Seed Gustafta Knowledge Base chatbot
  app.post("/api/agents/seed-knowledge-base", async (req, res) => {
    try {
      const existingAgents = await storage.getAgents();
      const alreadyExists = existingAgents.some(
        agent => agent.name === "Gustafta Assistant"
      );
      
      if (alreadyExists) {
        const existing = existingAgents.find(a => a.name === "Gustafta Assistant");
        return res.json({ message: "Gustafta Assistant already exists", agent: existing });
      }
      
      const agent = await storage.createAgent(gustaftaKnowledgeBaseAgent);
      res.status(201).json({ message: "Gustafta Assistant created successfully", agent });
    } catch (error: any) {
      console.error("Seed knowledge base error:", error);
      res.status(500).json({ error: "Failed to seed knowledge base chatbot", details: error?.message });
    }
  });

  // ==================== Knowledge Base Routes (Protected) ====================

  // Get knowledge bases for an agent
  app.get("/api/knowledge-base/:agentId", isAuthenticated, async (req, res) => {
    try {
      const kbs = await storage.getKnowledgeBases(req.params.agentId);
      res.json(kbs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge bases" });
    }
  });

  // Create knowledge base
  app.post("/api/knowledge-base", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertKnowledgeBaseSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const kb = await storage.createKnowledgeBase(parsed.data);
      res.status(201).json(kb);
    } catch (error) {
      res.status(500).json({ error: "Failed to create knowledge base" });
    }
  });

  // Upload file for knowledge base
  app.post("/api/knowledge-base/upload", isAuthenticated, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const ext = path.extname(req.file.originalname).toLowerCase();
      let fileType: string;
      switch (ext) {
        case ".pdf":
          fileType = "pdf";
          break;
        case ".ppt":
          fileType = "ppt";
          break;
        case ".pptx":
          fileType = "pptx";
          break;
        case ".xls":
          fileType = "xls";
          break;
        case ".xlsx":
          fileType = "xlsx";
          break;
        case ".doc":
          fileType = "doc";
          break;
        case ".docx":
          fileType = "docx";
          break;
        case ".txt":
          fileType = "txt";
          break;
        case ".jpg":
        case ".jpeg":
          fileType = "jpeg";
          break;
        case ".png":
          fileType = "png";
          break;
        case ".gif":
          fileType = "gif";
          break;
        case ".webp":
          fileType = "webp";
          break;
        default:
          fileType = "other";
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType,
        fileUrl,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Update knowledge base
  app.patch("/api/knowledge-base/:id", isAuthenticated, async (req, res) => {
    try {
      const kb = await storage.updateKnowledgeBase(req.params.id, req.body);
      if (!kb) {
        return res.status(404).json({ error: "Knowledge base not found" });
      }
      res.json(kb);
    } catch (error) {
      res.status(500).json({ error: "Failed to update knowledge base" });
    }
  });

  // Delete knowledge base
  app.delete("/api/knowledge-base/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteKnowledgeBase(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Knowledge base not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete knowledge base" });
    }
  });

  // ==================== Integration Routes (Protected) ====================

  // Get integrations for an agent
  app.get("/api/integrations/:agentId", isAuthenticated, async (req, res) => {
    try {
      const integrations = await storage.getIntegrations(req.params.agentId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch integrations" });
    }
  });

  // Create integration
  app.post("/api/integrations", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertIntegrationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const integration = await storage.createIntegration(parsed.data);
      res.status(201).json(integration);
    } catch (error) {
      res.status(500).json({ error: "Failed to create integration" });
    }
  });

  // Update integration
  app.patch("/api/integrations/:id", isAuthenticated, async (req, res) => {
    try {
      const integration = await storage.updateIntegration(req.params.id, req.body);
      if (!integration) {
        return res.status(404).json({ error: "Integration not found" });
      }
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: "Failed to update integration" });
    }
  });

  // Delete integration
  app.delete("/api/integrations/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteIntegration(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Integration not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete integration" });
    }
  });

  // ==================== Message Routes ====================

  // Get messages for an agent
  app.get("/api/messages/:agentId", async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.agentId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Export messages as JSON
  app.get("/api/messages/:agentId/export/json", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.agentId);
      const agent = await storage.getAgent(req.params.agentId);
      
      const exportData = {
        agentName: agent?.name || "Unknown Agent",
        exportDate: new Date().toISOString(),
        totalMessages: messages.length,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.createdAt,
        })),
      };
      
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="${agent?.name || "chat"}_export_${Date.now()}.json"`);
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ error: "Failed to export messages" });
    }
  });

  // Export messages as CSV
  app.get("/api/messages/:agentId/export/csv", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.agentId);
      const agent = await storage.getAgent(req.params.agentId);
      
      // Build CSV
      const csvRows = ["Timestamp,Role,Content"];
      messages.forEach(m => {
        const content = m.content.replace(/"/g, '""').replace(/\n/g, ' ');
        csvRows.push(`"${m.createdAt}","${m.role}","${content}"`);
      });
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${agent?.name || "chat"}_export_${Date.now()}.csv"`);
      res.send(csvRows.join("\n"));
    } catch (error) {
      res.status(500).json({ error: "Failed to export messages" });
    }
  });

  // Send message and get AI response
  app.post("/api/messages", async (req, res) => {
    try {
      const parsed = insertMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      
      // Save user message
      const userMessage = await storage.createMessage(parsed.data);
      
      // Get agent configuration for persona
      const agent = await storage.getAgent(parsed.data.agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      
      // Get knowledge base for context
      const knowledgeBases = await storage.getKnowledgeBases(parsed.data.agentId);
      const knowledgeContext = knowledgeBases
        .map(kb => `[${kb.name}]: ${kb.content}`)
        .join("\n\n");
      
      // Get recent conversation history
      const allMessages = await storage.getMessages(parsed.data.agentId);
      const recentMessages = allMessages.slice(-10); // Last 10 messages for context
      
      // Build system prompt from agent persona
      let systemPrompt = agent.systemPrompt || `Kamu adalah ${agent.name}.`;
      if (agent.tagline) {
        systemPrompt += ` ${agent.tagline}`;
      }
      if (agent.philosophy) {
        systemPrompt += `\n\nFilosofi: ${agent.philosophy}`;
      }
      if (agent.personality) {
        systemPrompt += `\n\nKepribadian: ${agent.personality}`;
      }
      if (agent.communicationStyle) {
        systemPrompt += `\nGaya komunikasi: ${agent.communicationStyle}`;
      }
      if (agent.toneOfVoice) {
        systemPrompt += `\nNada suara: ${agent.toneOfVoice}`;
      }
      if (knowledgeContext) {
        systemPrompt += `\n\nKnowledge Base:\n${knowledgeContext}`;
      }
      systemPrompt += `\n\nRespons dalam bahasa ${agent.language === "id" ? "Indonesia" : agent.language || "Indonesia"}.`;
      
      // Build messages array
      const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt }
      ];
      
      // Add conversation history
      for (const msg of recentMessages) {
        if (msg.id !== userMessage.id) {
          chatMessages.push({
            role: msg.role as "user" | "assistant",
            content: msg.content
          });
        }
      }
      
      // Add current user message
      chatMessages.push({ role: "user", content: parsed.data.content });
      
      // Determine which AI model and client to use
      const agentModel = agent.aiModel || "gpt-4o-mini";
      const temperature = Math.max(0, Math.min(2, agent.temperature ?? 0.7));
      const maxTokens = Math.max(100, Math.min(4096, agent.maxTokens ?? 1024));
      
      let aiResponseContent = "";
      
      // Handle different model providers
      if (agentModel === "custom") {
        // Custom model with user-provided credentials
        if (!agent.customApiKey) {
          return res.status(400).json({ error: "Custom model requires API key. Please configure in Persona settings." });
        }
        if (!agent.customBaseUrl) {
          return res.status(400).json({ error: "Custom model requires Base URL. Please configure in Persona settings." });
        }
        
        const customClient = new OpenAI({
          apiKey: agent.customApiKey,
          baseURL: agent.customBaseUrl,
        });
        const modelName = agent.customModelName || "gpt-4";
        
        const completion = await customClient.chat.completions.create({
          model: modelName,
          messages: chatMessages,
          max_tokens: maxTokens,
          temperature: temperature,
        });
        aiResponseContent = completion.choices[0]?.message?.content || "Maaf, saya tidak dapat merespons saat ini.";
        
      } else if (agentModel.startsWith("deepseek-")) {
        // DeepSeek models - require API key
        const deepseekApiKey = process.env.DEEPSEEK_API_KEY || agent.customApiKey;
        if (!deepseekApiKey) {
          return res.status(400).json({ 
            error: "DeepSeek API key not configured. Please set DEEPSEEK_API_KEY environment variable or provide custom API key in Persona settings." 
          });
        }
        
        const deepseekClient = new OpenAI({
          apiKey: deepseekApiKey,
          baseURL: "https://api.deepseek.com",
        });
        
        const completion = await deepseekClient.chat.completions.create({
          model: agentModel,
          messages: chatMessages,
          max_tokens: maxTokens,
          temperature: temperature,
        });
        aiResponseContent = completion.choices[0]?.message?.content || "Maaf, saya tidak dapat merespons saat ini.";
        
      } else if (agentModel.startsWith("claude-")) {
        // Claude models - require custom configuration with OpenAI-compatible proxy
        // Anthropic's native API is not OpenAI-compatible, so users must use a proxy service
        // or configure a custom endpoint that wraps Anthropic's API
        
        if (agent.customApiKey && agent.customBaseUrl) {
          // User has configured custom proxy for Claude
          const claudeClient = new OpenAI({
            apiKey: agent.customApiKey,
            baseURL: agent.customBaseUrl,
          });
          
          try {
            const completion = await claudeClient.chat.completions.create({
              model: agent.customModelName || agentModel,
              messages: chatMessages,
              max_tokens: maxTokens,
              temperature: temperature,
            });
            aiResponseContent = completion.choices[0]?.message?.content || "Maaf, saya tidak dapat merespons saat ini.";
          } catch (claudeError) {
            console.error("Claude proxy error:", claudeError);
            return res.status(503).json({ 
              error: "Failed to connect to Claude model. Please verify your custom API configuration." 
            });
          }
        } else {
          // Claude without custom configuration - inform user about setup requirements
          return res.status(400).json({ 
            error: "Claude models require custom API configuration. Please select 'Custom Model' and configure an OpenAI-compatible proxy endpoint (such as OpenRouter, LiteLLM, or similar) that supports Claude models, or use OpenAI/DeepSeek models instead." 
          });
        }
        
      } else {
        // OpenAI models (default) - use the built-in integration
        const completion = await openai.chat.completions.create({
          model: agentModel,
          messages: chatMessages,
          max_tokens: maxTokens,
          temperature: temperature,
        });
        aiResponseContent = completion.choices[0]?.message?.content || "Maaf, saya tidak dapat merespons saat ini.";
      }
      
      // Save AI response
      const aiMessage = await storage.createMessage({
        agentId: parsed.data.agentId,
        role: "assistant",
        content: aiResponseContent,
        reasoning: "",
        sources: [],
      });
      
      // Return both messages
      res.status(201).json({
        userMessage,
        aiMessage,
      });
    } catch (error) {
      console.error("Failed to process message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Clear messages for an agent
  app.delete("/api/messages/:agentId", async (req, res) => {
    try {
      await storage.clearMessages(req.params.agentId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to clear messages" });
    }
  });

  // Streaming message endpoint for real-time AI responses
  app.post("/api/messages/stream", async (req, res) => {
    try {
      const parsed = insertMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      
      // Save user message
      const userMessage = await storage.createMessage(parsed.data);
      
      // Get agent configuration for persona
      const agent = await storage.getAgent(parsed.data.agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      
      // Get knowledge base for context
      const knowledgeBases = await storage.getKnowledgeBases(parsed.data.agentId);
      const knowledgeContext = knowledgeBases
        .map(kb => `[${kb.name}]: ${kb.content}`)
        .join("\n\n");
      
      // Get recent conversation history
      const allMessages = await storage.getMessages(parsed.data.agentId);
      const recentMessages = allMessages.slice(-10);
      
      // Build system prompt from agent persona
      let systemPrompt = agent.systemPrompt || `Kamu adalah ${agent.name}.`;
      if (agent.tagline) systemPrompt += ` ${agent.tagline}`;
      if (agent.philosophy) systemPrompt += `\n\nFilosofi: ${agent.philosophy}`;
      if (agent.personality) systemPrompt += `\n\nKepribadian: ${agent.personality}`;
      if (agent.communicationStyle) systemPrompt += `\nGaya komunikasi: ${agent.communicationStyle}`;
      if (agent.toneOfVoice) systemPrompt += `\nNada suara: ${agent.toneOfVoice}`;
      if (knowledgeContext) systemPrompt += `\n\nKnowledge Base:\n${knowledgeContext}`;
      systemPrompt += `\n\nRespons dalam bahasa ${agent.language === "id" ? "Indonesia" : agent.language || "Indonesia"}.`;
      
      // Build messages array
      const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt }
      ];
      
      for (const msg of recentMessages) {
        if (msg.id !== userMessage.id) {
          chatMessages.push({
            role: msg.role as "user" | "assistant",
            content: msg.content
          });
        }
      }
      chatMessages.push({ role: "user", content: parsed.data.content });
      
      // Set up SSE headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      res.flushHeaders();
      
      // Track if client disconnected
      let isClientConnected = true;
      req.on("close", () => {
        isClientConnected = false;
      });
      
      // Send keepalive ping periodically
      const pingInterval = setInterval(() => {
        if (isClientConnected && !res.writableEnded) {
          res.write(`data: ${JSON.stringify({ type: "ping" })}\n\n`);
        }
      }, 15000);
      
      // Cleanup function
      const cleanup = () => {
        clearInterval(pingInterval);
      };
      
      // Send user message first
      res.write(`data: ${JSON.stringify({ type: "user_message", message: userMessage })}\n\n`);
      
      const agentModel = agent.aiModel || "gpt-4o-mini";
      const temperature = Math.max(0, Math.min(2, agent.temperature ?? 0.7));
      const maxTokens = Math.max(100, Math.min(4096, agent.maxTokens ?? 1024));
      
      let fullContent = "";
      let streamClient: OpenAI;
      let modelName = agentModel;
      
      // Select appropriate client
      if (agentModel === "custom" && agent.customApiKey && agent.customBaseUrl) {
        streamClient = new OpenAI({
          apiKey: agent.customApiKey,
          baseURL: agent.customBaseUrl,
        });
        modelName = agent.customModelName || "gpt-4";
      } else if (agentModel.startsWith("deepseek-")) {
        const deepseekApiKey = process.env.DEEPSEEK_API_KEY || agent.customApiKey;
        if (!deepseekApiKey) {
          res.write(`data: ${JSON.stringify({ type: "error", error: "DeepSeek API key not configured" })}\n\n`);
          res.end();
          return;
        }
        streamClient = new OpenAI({
          apiKey: deepseekApiKey,
          baseURL: "https://api.deepseek.com",
        });
      } else if (agentModel.startsWith("claude-") && agent.customApiKey && agent.customBaseUrl) {
        streamClient = new OpenAI({
          apiKey: agent.customApiKey,
          baseURL: agent.customBaseUrl,
        });
        modelName = agent.customModelName || agentModel;
      } else {
        streamClient = openai;
      }
      
      try {
        const stream = await streamClient.chat.completions.create({
          model: modelName,
          messages: chatMessages,
          max_tokens: maxTokens,
          temperature: temperature,
          stream: true,
        });
        
        for await (const chunk of stream) {
          if (!isClientConnected) {
            cleanup();
            return;
          }
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullContent += content;
            res.write(`data: ${JSON.stringify({ type: "chunk", content })}\n\n`);
          }
        }
        
        // Save the complete AI response
        const aiMessage = await storage.createMessage({
          agentId: parsed.data.agentId,
          role: "assistant",
          content: fullContent || "Maaf, saya tidak dapat merespons saat ini.",
          reasoning: "",
          sources: [],
        });
        
        // Send completion event
        cleanup();
        res.write(`data: ${JSON.stringify({ type: "complete", message: aiMessage })}\n\n`);
        res.end();
        
      } catch (streamError) {
        console.error("Streaming error:", streamError);
        cleanup();
        if (isClientConnected && !res.writableEnded) {
          res.write(`data: ${JSON.stringify({ type: "error", error: "Failed to generate response" })}\n\n`);
          res.end();
        }
      }
      
    } catch (error) {
      console.error("Failed to process streaming message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // ==================== Analytics Routes ====================

  // Track analytics event (public endpoint for widget)
  app.post("/api/analytics", async (req, res) => {
    try {
      const { agentId, eventType, metadata } = req.body;
      if (!agentId || !eventType) {
        return res.status(400).json({ error: "Missing agentId or eventType" });
      }
      await storage.trackAnalytics(agentId, eventType, metadata || {});
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track analytics" });
    }
  });

  // Get analytics summary for an agent
  app.get("/api/analytics/:agentId/summary", async (req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary(req.params.agentId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Get all analytics for an agent
  app.get("/api/analytics/:agentId", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics(req.params.agentId);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // ==================== Payment/Subscription Routes (Mayar.id) ====================

  // Get subscription plans
  app.get("/api/subscriptions/plans", (_req, res) => {
    const plans = Object.entries(subscriptionPlans).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    res.json(plans);
  });

  // Check Mayar configuration status
  app.get("/api/subscriptions/status", (_req, res) => {
    const mayarApiKey = process.env.MAYAR_API_KEY;
    res.json({
      paymentConfigured: !!mayarApiKey,
      provider: "mayar.id",
    });
  });

  // Create subscription/payment order
  app.post("/api/subscriptions/create", async (req, res) => {
    try {
      const { plan, customerName, customerEmail, customerPhone } = req.body;
      
      // Validate plan
      if (!plan || !subscriptionPlans[plan as SubscriptionPlanKey]) {
        return res.status(400).json({ error: "Invalid subscription plan" });
      }
      
      const selectedPlan = plan as SubscriptionPlanKey;
      const pricing = subscriptionPlans[selectedPlan];
      
      // For free trial, create subscription directly
      if (selectedPlan === "free_trial") {
        const now = new Date();
        const endDate = new Date(now.getTime() + pricing.duration * 24 * 60 * 60 * 1000);
        
        const subscription = await storage.createSubscription({
          userId: customerEmail,
          plan: selectedPlan,
          status: "active",
          amount: 0,
          currency: "IDR",
          chatbotLimit: pricing.chatbotLimit,
          startDate: now.toISOString(),
          endDate: endDate.toISOString(),
        });
        
        return res.status(201).json({
          subscription,
          message: "Free trial activated successfully",
        });
      }
      
      // Check if Mayar is configured
      const mayarApiKey = process.env.MAYAR_API_KEY;
      if (!mayarApiKey) {
        return res.status(503).json({ 
          error: "Payment gateway not configured",
          message: "Mayar.id API key is not configured. Please contact administrator."
        });
      }
      
      // Get redirect URL from environment or use default
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : "http://localhost:5000";
      
      // Create Mayar payment link
      const mayarPayment = await createPaymentLink(mayarApiKey, {
        name: customerName,
        email: customerEmail,
        mobile: customerPhone,
        amount: pricing.price,
        description: `Gustafta Subscription: ${pricing.name}`,
        redirectUrl: `${baseUrl}/payment-success`,
      });
      
      // Create pending subscription
      const subscription = await storage.createSubscription({
        userId: customerEmail,
        plan: selectedPlan,
        status: "pending",
        mayarOrderId: mayarPayment.data.id,
        mayarPaymentUrl: mayarPayment.data.link,
        amount: pricing.price,
        currency: "IDR",
        chatbotLimit: pricing.chatbotLimit,
      });
      
      res.status(201).json({
        subscription,
        paymentUrl: mayarPayment.data.link,
        paymentId: mayarPayment.data.id,
      });
    } catch (error) {
      console.error("Failed to create subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  // Mayar webhook handler
  app.post("/api/webhooks/mayar", async (req, res) => {
    try {
      const payload = parseWebhookPayload(req.body);
      
      if (!payload || !payload.event) {
        return res.status(400).json({ error: "Invalid webhook payload" });
      }
      
      // Handle transaction completed event
      if (payload.event === "transaction.completed" || payload.status === "paid") {
        // Find subscription by payment ID
        const subscription = await storage.getSubscriptionByMayarOrderId(payload.id);
        
        if (subscription) {
          const planDetails = subscriptionPlans[subscription.plan as SubscriptionPlanKey];
          const now = new Date();
          const endDate = new Date(now.getTime() + planDetails.duration * 24 * 60 * 60 * 1000);
          
          await storage.updateSubscription(subscription.id, {
            status: "active",
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
          });
        }
      } else if (payload.status === "expired" || payload.status === "cancelled" || payload.status === "failed") {
        const subscription = await storage.getSubscriptionByMayarOrderId(payload.id);
        
        if (subscription) {
          await storage.updateSubscription(subscription.id, {
            status: "cancelled",
          });
        }
      }
      
      res.json({ status: "success" });
    } catch (error) {
      console.error("Mayar webhook processing error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Get user's active subscription
  app.get("/api/subscriptions/user/:userId", async (req, res) => {
    try {
      const subscription = await storage.getActiveSubscription(req.params.userId);
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Auto-expire subscriptions (protected - requires auth)
  app.post("/api/subscriptions/expire-check", isAuthenticated, async (_req, res) => {
    try {
      const expiredCount = await storage.expireSubscriptions();
      console.log(`Auto-expired ${expiredCount} subscriptions`);
      res.json({ success: true, expiredCount });
    } catch (error) {
      console.error("Failed to expire subscriptions:", error);
      res.status(500).json({ error: "Failed to expire subscriptions" });
    }
  });

  // Run expire check on startup
  (async () => {
    try {
      const expiredCount = await storage.expireSubscriptions();
      if (expiredCount > 0) {
        console.log(`[Startup] Auto-expired ${expiredCount} subscriptions`);
      }
    } catch (error) {
      console.error("[Startup] Failed to run expire check:", error);
    }
  })();

  // ==================== Telegram Webhook ====================
  
  // Helper function to generate AI response for external integrations
  async function generateAIResponse(agentId: string, userMessage: string): Promise<string> {
    const agent = await storage.getAgent(agentId);
    if (!agent) {
      return "Agent tidak ditemukan.";
    }
    
    // Get knowledge base for context
    const knowledgeBases = await storage.getKnowledgeBases(agentId);
    const knowledgeContext = knowledgeBases
      .map(kb => `[${kb.name}]: ${kb.content}`)
      .join("\n\n");
    
    // Build system prompt from agent persona
    let systemPrompt = agent.systemPrompt || `Kamu adalah ${agent.name}.`;
    if (agent.tagline) {
      systemPrompt += ` ${agent.tagline}`;
    }
    if (agent.philosophy) {
      systemPrompt += `\n\nFilosofi: ${agent.philosophy}`;
    }
    if (agent.personality) {
      systemPrompt += `\n\nKepribadian: ${agent.personality}`;
    }
    if (agent.communicationStyle) {
      systemPrompt += `\nGaya komunikasi: ${agent.communicationStyle}`;
    }
    if (agent.toneOfVoice) {
      systemPrompt += `\nNada suara: ${agent.toneOfVoice}`;
    }
    if (knowledgeContext) {
      systemPrompt += `\n\nKnowledge Base:\n${knowledgeContext}`;
    }
    systemPrompt += `\n\nRespons dalam bahasa ${agent.language === "id" ? "Indonesia" : agent.language || "Indonesia"}.`;
    
    const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ];
    
    const agentModel = agent.aiModel || "gpt-4o-mini";
    const temperature = Math.max(0, Math.min(2, agent.temperature ?? 0.7));
    const maxTokens = Math.max(100, Math.min(4096, agent.maxTokens ?? 1024));
    
    try {
      if (agentModel === "custom" && agent.customApiKey && agent.customBaseUrl) {
        const customClient = new OpenAI({
          apiKey: agent.customApiKey,
          baseURL: agent.customBaseUrl,
        });
        const modelName = agent.customModelName || "gpt-4";
        const completion = await customClient.chat.completions.create({
          model: modelName,
          messages: chatMessages,
          max_tokens: maxTokens,
          temperature: temperature,
        });
        return completion.choices[0]?.message?.content || "Maaf, saya tidak dapat merespons saat ini.";
      } else if (agentModel.startsWith("deepseek-")) {
        const deepseekApiKey = process.env.DEEPSEEK_API_KEY || agent.customApiKey;
        if (!deepseekApiKey) {
          return "DeepSeek API key belum dikonfigurasi.";
        }
        const deepseekClient = new OpenAI({
          apiKey: deepseekApiKey,
          baseURL: "https://api.deepseek.com",
        });
        const completion = await deepseekClient.chat.completions.create({
          model: agentModel,
          messages: chatMessages,
          max_tokens: maxTokens,
          temperature: temperature,
        });
        return completion.choices[0]?.message?.content || "Maaf, saya tidak dapat merespons saat ini.";
      } else {
        // OpenAI models (default)
        const completion = await openai.chat.completions.create({
          model: agentModel,
          messages: chatMessages,
          max_tokens: maxTokens,
          temperature: temperature,
        });
        return completion.choices[0]?.message?.content || "Maaf, saya tidak dapat merespons saat ini.";
      }
    } catch (error) {
      console.error("AI response error:", error);
      return "Maaf, terjadi kesalahan dalam memproses pesan Anda.";
    }
  }

  // Telegram webhook endpoint
  app.post("/api/webhook/telegram/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const update = req.body;
      
      console.log("Telegram webhook received:", JSON.stringify(update, null, 2));
      
      // Get agent and its Telegram integration
      const agent = await storage.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      
      const integrations = await storage.getIntegrations(agentId);
      const telegramIntegration = integrations.find(i => i.type === "telegram" && i.isEnabled);
      const config = (telegramIntegration?.config || {}) as Record<string, string>;
      const botToken = config.botToken || config.apiToken;
      
      if (!telegramIntegration || !botToken) {
        console.log("Telegram integration not configured for agent:", agentId);
        return res.status(200).json({ ok: true }); // Return 200 to prevent Telegram from retrying
      }
      
      // Handle incoming message
      const message = update.message;
      if (!message || !message.text) {
        return res.status(200).json({ ok: true });
      }
      
      const chatId = message.chat.id;
      const userText = message.text;
      
      // Handle /start command
      if (userText === "/start") {
        const greeting = agent.greetingMessage || `Halo! Saya ${agent.name}. ${agent.tagline || "Ada yang bisa saya bantu?"}`;
        await sendTelegramMessage(botToken, chatId, greeting);
        return res.status(200).json({ ok: true });
      }
      
      // Generate AI response
      const aiResponse = await generateAIResponse(agentId, userText);
      
      // Send response to Telegram
      await sendTelegramMessage(botToken, chatId, aiResponse);
      
      // Log the interaction
      await storage.createMessage({
        agentId,
        role: "user",
        content: userText,
        reasoning: "",
        sources: [],
      });
      await storage.createMessage({
        agentId,
        role: "assistant", 
        content: aiResponse,
        reasoning: "",
        sources: [],
      });
      
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Telegram webhook error:", error);
      res.status(200).json({ ok: true }); // Return 200 to prevent retries
    }
  });
  
  // Helper function to send Telegram message
  async function sendTelegramMessage(botToken: string, chatId: number, text: string): Promise<void> {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log("Sending Telegram message to chat:", chatId);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown",
        }),
      });
      const result = await response.json();
      console.log("Telegram sendMessage result:", JSON.stringify(result));
      if (!result.ok) {
        console.error("Failed to send Telegram message:", result);
      }
    } catch (error) {
      console.error("Error sending Telegram message:", error);
    }
  }
  
  // Setup Telegram webhook (call this to register webhook URL with Telegram)
  app.post("/api/telegram/setup-webhook/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      
      const integrations = await storage.getIntegrations(agentId);
      const telegramIntegration = integrations.find(i => i.type === "telegram");
      const telegramConfig = (telegramIntegration?.config || {}) as Record<string, string>;
      const botToken = telegramConfig.botToken || telegramConfig.apiToken;
      
      if (!telegramIntegration || !botToken) {
        return res.status(400).json({ error: "Telegram Bot Token belum dikonfigurasi" });
      }
      
      // Get the webhook URL - prefer production URL from request host
      const host = req.get("host");
      const baseUrl = host ? `https://${host}` : `https://${process.env.REPLIT_DEV_DOMAIN}`;
      const webhookUrl = `${baseUrl}/api/webhook/telegram/${agentId}`;
      
      console.log("Setting Telegram webhook to:", webhookUrl);
      
      // Set webhook with Telegram
      const telegramUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl }),
      });
      
      const result = await response.json();
      
      if (result.ok) {
        // Update integration config with webhook URL
        await storage.updateIntegration(telegramIntegration.id, {
          config: { ...telegramConfig, webhookUrl },
        });
        
        res.json({ 
          success: true, 
          webhookUrl,
          message: "Telegram webhook berhasil diatur!" 
        });
      } else {
        res.status(400).json({ 
          error: "Gagal mengatur webhook Telegram",
          details: result 
        });
      }
    } catch (error) {
      console.error("Telegram webhook setup error:", error);
      res.status(500).json({ error: "Gagal mengatur webhook Telegram" });
    }
  });

  // Check Telegram webhook status
  app.get("/api/telegram/webhook-info/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      
      const integrations = await storage.getIntegrations(agentId);
      const telegramIntegration = integrations.find(i => i.type === "telegram");
      const telegramConfig = (telegramIntegration?.config || {}) as Record<string, string>;
      const botToken = telegramConfig.botToken || telegramConfig.apiToken;
      
      if (!telegramIntegration || !botToken) {
        return res.status(400).json({ error: "Telegram Bot Token belum dikonfigurasi" });
      }
      
      // Get webhook info from Telegram
      const telegramUrl = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;
      const response = await fetch(telegramUrl);
      const result = await response.json();
      
      res.json(result);
    } catch (error) {
      console.error("Telegram webhook info error:", error);
      res.status(500).json({ error: "Gagal mendapatkan info webhook" });
    }
  });

  // ==================== WhatsApp Webhook (via Multichat/generic provider) ====================
  
  // WhatsApp webhook endpoint
  app.post("/api/webhook/whatsapp/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const payload = req.body;
      
      console.log("WhatsApp webhook received:", JSON.stringify(payload, null, 2));
      
      // Get agent and its WhatsApp integration
      const agent = await storage.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      
      const integrations = await storage.getIntegrations(agentId);
      const whatsappIntegration = integrations.find(i => i.type === "whatsapp" && i.isEnabled);
      const waConfig = (whatsappIntegration?.config || {}) as Record<string, string>;
      const waApiToken = waConfig.apiToken || waConfig.token;
      
      if (!whatsappIntegration || !waApiToken) {
        console.log("WhatsApp integration not configured for agent:", agentId);
        return res.status(200).json({ status: "ok" });
      }
      
      // Handle different webhook formats (Multichat, WhatsApp Cloud API, Kirimi.id, etc.)
      let phoneNumber: string | undefined;
      let messageText: string | undefined;
      let messageId: string | undefined;
      
      // Kirimi.id format: { event: "message.received", from: "628...", message: "text" }
      if (payload.event === "message.received" && payload.from && payload.message) {
        phoneNumber = payload.from;
        messageText = payload.message;
        messageId = payload.msgId || payload.messageId;
        console.log("Kirimi.id format detected");
      }
      // Multichat format: { from: "628...", text: "message" }
      else if (payload.from && payload.text) {
        phoneNumber = payload.from;
        messageText = payload.text;
        messageId = payload.id;
      }
      // WhatsApp Cloud API format
      else if (payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        const msg = payload.entry[0].changes[0].value.messages[0];
        phoneNumber = msg.from;
        messageText = msg.text?.body;
        messageId = msg.id;
      }
      // Generic format: { sender: "628...", message: "text" }
      else if (payload.message && payload.sender) {
        phoneNumber = payload.sender;
        messageText = payload.message;
        messageId = payload.messageId;
      }
      // Simple format: { from: "628...", message: "text" }
      else if (payload.from && payload.message) {
        phoneNumber = payload.from;
        messageText = payload.message;
        messageId = payload.msgId || payload.id;
      }
      
      if (!phoneNumber || !messageText) {
        console.log("No message found in webhook payload");
        return res.status(200).json({ status: "ok" });
      }
      
      // Generate AI response
      const aiResponse = await generateAIResponse(agentId, messageText);
      
      // Send response via Multichat API or configured send URL
      const sendUrl = waConfig.sendUrl || waConfig.webhookUrl;
      if (sendUrl) {
        try {
          await fetch(sendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${waApiToken}`,
            },
            body: JSON.stringify({
              to: phoneNumber,
              text: aiResponse,
              replyTo: messageId,
            }),
          });
        } catch (sendError) {
          console.error("Failed to send WhatsApp reply:", sendError);
        }
      }
      
      // Log the interaction
      await storage.createMessage({
        agentId,
        role: "user",
        content: messageText,
        reasoning: "",
        sources: [],
      });
      await storage.createMessage({
        agentId,
        role: "assistant",
        content: aiResponse,
        reasoning: "",
        sources: [],
      });
      
      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("WhatsApp webhook error:", error);
      res.status(200).json({ status: "ok" });
    }
  });
  
  // Webhook verification for WhatsApp Cloud API
  app.get("/api/webhook/whatsapp/:agentId", async (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    
    // Get agent's WhatsApp integration to verify token
    const { agentId } = req.params;
    const integrations = await storage.getIntegrations(agentId);
    const whatsappIntegration = integrations.find(i => i.type === "whatsapp");
    const waVerifyConfig = (whatsappIntegration?.config || {}) as Record<string, string>;
    const verifyToken = waVerifyConfig.verifyToken || waVerifyConfig.accessToken;
    
    // Use configured verify token for webhook verification
    if (mode === "subscribe" && token === verifyToken) {
      console.log("WhatsApp webhook verified for agent:", agentId);
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });

  // ==================== Generic Webhook/Chat API (Botika-style format) ====================
  
  // Generic chat webhook - accepts multiple formats including Botika style
  app.post("/api/webhook/chat/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const payload = req.body;
      const authHeader = req.headers.authorization;
      
      console.log("Chat webhook received:", JSON.stringify(payload, null, 2));
      
      // Get agent
      const agent = await storage.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      
      // Verify access token - require it if agent has one set
      if (agent.accessToken) {
        if (!authHeader) {
          return res.status(401).json({ error: "Authorization header required" });
        }
        const token = authHeader.replace("Bearer ", "");
        if (token !== agent.accessToken) {
          return res.status(401).json({ error: "Invalid access token" });
        }
      }
      
      let senderId: string | undefined;
      let messageText: string | undefined;
      let messageId: string | undefined;
      
      // Botika format: { app: { id }, data: { sender: { id }, message: [{ type, value }] } }
      if (payload.app?.id && payload.data?.message?.[0]) {
        senderId = payload.data.sender?.id;
        const firstMessage = payload.data.message[0];
        messageText = firstMessage.value || firstMessage.text;
        messageId = firstMessage.id;
      }
      // Simple format: { sender_id, message }
      else if (payload.sender_id && payload.message) {
        senderId = payload.sender_id;
        messageText = payload.message;
        messageId = payload.message_id;
      }
      // Ultra simple: { message }
      else if (payload.message) {
        senderId = payload.sender || payload.user_id || "anonymous";
        messageText = payload.message;
      }
      
      if (!messageText) {
        return res.status(400).json({ error: "No message provided" });
      }
      
      // Generate AI response
      const aiResponse = await generateAIResponse(agentId, messageText);
      
      // Log the interaction
      await storage.createMessage({
        agentId,
        role: "user",
        content: messageText,
        reasoning: "",
        sources: [],
      });
      await storage.createMessage({
        agentId,
        role: "assistant",
        content: aiResponse,
        reasoning: "",
        sources: [],
      });
      
      // Return Botika-style response
      const timestamp = Date.now();
      res.json({
        app: {
          id: agentId,
        },
        time: timestamp,
        data: {
          recipient: {
            id: senderId || "user",
          },
          message: [
            {
              time: String(timestamp),
              type: "text",
              value: aiResponse,
            },
          ],
        },
        // Also include simple format for easy parsing
        response: aiResponse,
        agent_id: agentId,
      });
    } catch (error) {
      console.error("Chat webhook error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // ==================== Unified Context API ====================

  // Get unified active context (Big Idea -> Toolbox -> Agent chain)
  app.get("/api/context/active", isAuthenticated, async (_req, res) => {
    try {
      const [activeBigIdea, activeToolbox, activeAgent] = await Promise.all([
        storage.getActiveBigIdea(),
        storage.getActiveToolbox(),
        storage.getActiveAgent(),
      ]);

      // Validate chain consistency
      let validatedToolbox = activeToolbox;
      let validatedAgent = activeAgent;

      // If toolbox doesn't belong to active big idea, invalidate
      if (activeBigIdea && activeToolbox && activeToolbox.bigIdeaId !== activeBigIdea.id) {
        validatedToolbox = null;
      }

      // If agent doesn't belong to active toolbox, invalidate
      if (validatedToolbox && activeAgent && activeAgent.toolboxId !== validatedToolbox.id) {
        validatedAgent = null;
      }

      res.json({
        bigIdea: activeBigIdea,
        toolbox: validatedToolbox,
        agent: validatedAgent,
        chain: {
          isValid: !!(activeBigIdea || activeAgent),
          hasOrphanedToolbox: activeToolbox && !validatedToolbox,
          hasOrphanedAgent: activeAgent && !validatedAgent,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active context" });
    }
  });

  // Activate context with cascade (Big Idea -> auto-select first Toolbox -> first Agent)
  app.post("/api/context/activate", isAuthenticated, async (req, res) => {
    try {
      const { bigIdeaId, toolboxId, agentId } = req.body;

      let result: any = {};

      // If activating a Big Idea, cascade to toolbox and agent
      if (bigIdeaId) {
        const bigIdea = await storage.setActiveBigIdea(bigIdeaId);
        result.bigIdea = bigIdea;

        // Get first toolbox in this big idea
        const toolboxes = await storage.getToolboxes(bigIdeaId);
        if (toolboxes.length > 0) {
          const toolbox = await storage.setActiveToolbox(toolboxes[0].id);
          result.toolbox = toolbox;

          // Get first agent in this toolbox
          const agents = await storage.getAgents(toolboxes[0].id);
          if (agents.length > 0) {
            const agent = await storage.setActiveAgent(agents[0].id);
            result.agent = agent;
          }
        }
      }

      // If activating a Toolbox specifically
      if (toolboxId && !bigIdeaId) {
        const toolbox = await storage.setActiveToolbox(toolboxId);
        result.toolbox = toolbox;

        // Cascade to first agent in toolbox
        if (toolbox) {
          const agents = await storage.getAgents(toolboxId);
          if (agents.length > 0) {
            const agent = await storage.setActiveAgent(agents[0].id);
            result.agent = agent;
          }
        }
      }

      // If activating an Agent specifically
      if (agentId && !toolboxId && !bigIdeaId) {
        const agent = await storage.setActiveAgent(agentId);
        result.agent = agent;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to activate context" });
    }
  });

  // ==================== Agent Templates API ====================

  // Get all templates
  app.get("/api/templates", async (_req, res) => {
    try {
      const { agentTemplates, templateCategories } = await import("@shared/agent-templates");
      res.json({ templates: agentTemplates, categories: templateCategories });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Get template by ID
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const { getTemplateById } = await import("@shared/agent-templates");
      const template = getTemplateById(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Create agent from template
  app.post("/api/templates/:id/create-agent", isAuthenticated, async (req, res) => {
    try {
      const { getTemplateById } = await import("@shared/agent-templates");
      const template = getTemplateById(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      const { customName, toolboxId } = req.body;

      // Merge template with custom values
      const agentData = {
        ...template.agent,
        name: customName || template.agent.name,
        toolboxId: toolboxId || "",
      };

      const agent = await storage.createAgent(agentData as any);
      res.status(201).json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create agent from template" });
    }
  });

  // ==================== Export/Import Agent Configuration ====================

  // Export agent configuration
  app.get("/api/agents/:id/export", isAuthenticated, async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }

      // Get knowledge bases for this agent
      const knowledgeBases = await storage.getKnowledgeBases(req.params.id);
      const integrations = await storage.getIntegrations(req.params.id);

      // Create export object (exclude sensitive data)
      const exportData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        agent: {
          name: agent.name,
          description: agent.description,
          tagline: agent.tagline,
          philosophy: agent.philosophy,
          systemPrompt: agent.systemPrompt,
          personality: agent.personality,
          communicationStyle: agent.communicationStyle,
          toneOfVoice: agent.toneOfVoice,
          responseFormat: agent.responseFormat,
          greetingMessage: agent.greetingMessage,
          conversationStarters: agent.conversationStarters,
          language: agent.language,
          category: agent.category,
          subcategory: agent.subcategory,
          temperature: agent.temperature,
          maxTokens: agent.maxTokens,
          aiModel: agent.aiModel,
          agenticMode: agent.agenticMode,
          attentiveListening: agent.attentiveListening,
          contextRetention: agent.contextRetention,
          emotionalIntelligence: agent.emotionalIntelligence,
          multiStepReasoning: agent.multiStepReasoning,
          selfCorrection: agent.selfCorrection,
          expertise: agent.expertise,
          avoidTopics: agent.avoidTopics,
          keyPhrases: agent.keyPhrases,
          widgetColor: agent.widgetColor,
          widgetPosition: agent.widgetPosition,
          widgetSize: agent.widgetSize,
          widgetBorderRadius: agent.widgetBorderRadius,
          widgetShowBranding: agent.widgetShowBranding,
          widgetWelcomeMessage: agent.widgetWelcomeMessage,
          widgetButtonIcon: agent.widgetButtonIcon,
        },
        knowledgeBases: knowledgeBases.map(kb => ({
          name: kb.name,
          type: kb.type,
          content: kb.content,
          description: kb.description,
        })),
        integrations: integrations.map(int => ({
          type: int.type,
          name: int.name,
          isEnabled: int.isEnabled,
        })),
      };

      res.json(exportData);
    } catch (error) {
      res.status(500).json({ error: "Failed to export agent" });
    }
  });

  // Import agent configuration
  app.post("/api/agents/import", isAuthenticated, async (req, res) => {
    try {
      const { config, customName, toolboxId } = req.body;

      if (!config || !config.agent) {
        return res.status(400).json({ error: "Invalid configuration format" });
      }

      // Create agent from imported config
      const agentData = {
        ...config.agent,
        name: customName || config.agent.name || "Imported Agent",
        toolboxId: toolboxId || "",
      };

      const agent = await storage.createAgent(agentData);

      // Import knowledge bases if present
      if (config.knowledgeBases && Array.isArray(config.knowledgeBases)) {
        for (const kb of config.knowledgeBases) {
          await storage.createKnowledgeBase({
            agentId: agent.id,
            name: kb.name,
            type: kb.type,
            content: kb.content,
            description: kb.description || "",
          });
        }
      }

      res.status(201).json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to import agent" });
    }
  });

  // ==================== Enhanced Analytics ====================

  // Get aggregated platform stats (for landing page)
  app.get("/api/stats/platform", async (_req, res) => {
    try {
      const agents = await storage.getAgents();
      const activeAgentCount = agents.filter(a => a.isActive).length;
      
      res.json({
        totalAgents: agents.length,
        activeAgents: activeAgentCount,
        categories: [...new Set(agents.map(a => a.category).filter(Boolean))].length,
        templates: 10, // From our template library
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch platform stats" });
    }
  });

  // ==================== DYNAMIC WIDGET API ====================
  
  // Public endpoint to get widget configuration (no auth required)
  app.get("/api/widget/config/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const agent = await storage.getAgent(agentId);
      
      if (!agent) {
        return res.status(404).json({ error: "Widget not found" });
      }
      
      // Check if agent is active and public (for public embed access)
      if (!agent.isActive) {
        return res.status(404).json({ error: "Widget is disabled", disabled: true });
      }
      
      if (!agent.isPublic) {
        return res.status(403).json({ error: "Widget is not public", private: true });
      }
      
      // Return only public widget configuration
      const widgetConfig = {
        agentId: agent.id,
        name: agent.name,
        avatar: agent.avatar || "",
        tagline: agent.tagline || "",
        greetingMessage: agent.greetingMessage || "Halo! Ada yang bisa saya bantu?",
        welcomeMessage: agent.widgetWelcomeMessage || agent.greetingMessage || "Halo! Ada yang bisa saya bantu?",
        conversationStarters: agent.conversationStarters || [],
        // Widget styling
        color: agent.widgetColor || "#6366f1",
        position: agent.widgetPosition || "bottom-right",
        size: agent.widgetSize || "medium",
        borderRadius: agent.widgetBorderRadius || "rounded",
        showBranding: agent.widgetShowBranding ?? true,
        buttonIcon: agent.widgetButtonIcon || "chat",
        // Status
        isActive: agent.isActive,
        isPublic: agent.isPublic,
      };
      
      res.json(widgetConfig);
    } catch (error) {
      console.error("Widget config error:", error);
      res.status(500).json({ error: "Failed to load widget configuration" });
    }
  });

  // Serve dynamic widget loader script
  app.get("/widget/loader.js", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    
    const loaderScript = `
(function() {
  'use strict';
  
  // Get script element using document.currentScript (with fallback)
  var currentScript = document.currentScript;
  if (!currentScript) {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('widget/loader.js') !== -1) {
        currentScript = scripts[i];
        break;
      }
    }
  }
  
  if (!currentScript) {
    console.error('Gustafta Widget: Could not find loader script');
    return;
  }
  
  var agentId = currentScript.getAttribute('data-agent-id');
  var apiBase = currentScript.getAttribute('data-api-base') || '${baseUrl}';
  
  if (!agentId) {
    console.error('Gustafta Widget: data-agent-id attribute is required');
    return;
  }
  
  // Prevent duplicate injection per agentId (allows multiple widgets for different agents)
  window.__gustaftaWidgets = window.__gustaftaWidgets || {};
  if (window.__gustaftaWidgets[agentId]) return;
  window.__gustaftaWidgets[agentId] = true;
  
  // Size and border radius mappings
  var sizeMap = { small: 350, medium: 400, large: 450 };
  var borderMap = { rounded: 16, square: 0, pill: 24 };
  
  // Icon SVGs
  var icons = {
    chat: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>',
    message: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    bot: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
    help: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>'
  };
  
  // Fetch configuration from backend
  fetch(apiBase + '/api/widget/config/' + agentId)
    .then(function(response) {
      if (!response.ok) throw new Error('Failed to load widget config');
      return response.json();
    })
    .then(function(config) {
      initWidget(config);
    })
    .catch(function(error) {
      console.error('Gustafta Widget Error:', error);
    });
  
  function initWidget(config) {
    var width = sizeMap[config.size] || 400;
    var radius = borderMap[config.borderRadius] || 16;
    var icon = icons[config.buttonIcon] || icons.chat;
    
    // Position styles
    var posStyles = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;'
    };
    var framePos = {
      'bottom-right': 'bottom: 70px; right: 0;',
      'bottom-left': 'bottom: 70px; left: 0;',
      'top-right': 'top: 70px; right: 0;',
      'top-left': 'top: 70px; left: 0;'
    };
    
    // Inject styles
    var style = document.createElement('style');
    style.textContent = 
      '#gustafta-widget-container { position: fixed; ' + posStyles[config.position] + ' z-index: 9999; font-family: system-ui, -apple-system, sans-serif; }' +
      '#gustafta-widget-btn { width: 56px; height: 56px; border-radius: 50%; background: ' + config.color + '; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s, box-shadow 0.2s; }' +
      '#gustafta-widget-btn:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }' +
      '#gustafta-chat-frame { display: none; position: absolute; ' + framePos[config.position] + ' width: ' + width + 'px; height: 500px; border: none; border-radius: ' + radius + 'px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); background: white; overflow: hidden; }' +
      '#gustafta-chat-frame.open { display: block; animation: gustafta-slide-in 0.3s ease; }' +
      '@keyframes gustafta-slide-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(style);
    
    // Create widget elements
    var container = document.createElement('div');
    container.id = 'gustafta-widget-container';
    
    var embedUrl = apiBase + '/embed/' + config.agentId + 
      '?color=' + encodeURIComponent(config.color) + 
      '&name=' + encodeURIComponent(config.name) + 
      '&avatar=' + encodeURIComponent(config.avatar) + 
      '&welcome=' + encodeURIComponent(config.welcomeMessage) + 
      '&branding=' + config.showBranding;
    
    container.innerHTML = 
      '<iframe id="gustafta-chat-frame" src="' + embedUrl + '"></iframe>' +
      '<button id="gustafta-widget-btn" aria-label="Chat">' + icon + '</button>';
    
    document.body.appendChild(container);
    
    // Toggle chat
    var btn = document.getElementById('gustafta-widget-btn');
    var frame = document.getElementById('gustafta-chat-frame');
    btn.onclick = function() { frame.classList.toggle('open'); };
  }
})();
`;
    
    res.type('application/javascript');
    res.send(loaderScript);
  });

  return httpServer;
}
