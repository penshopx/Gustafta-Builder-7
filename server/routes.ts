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

  // ==================== User Profile Routes ====================

  // Get user profile
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Create or update user profile
  app.post("/api/profile", async (req, res) => {
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
  app.post("/api/profile/avatar", upload.single("avatar"), async (req, res) => {
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

  // ==================== Big Idea Routes ====================

  // Get all big ideas
  app.get("/api/big-ideas", async (_req, res) => {
    try {
      const bigIdeas = await storage.getBigIdeas();
      res.json(bigIdeas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch big ideas" });
    }
  });

  // Get active big idea
  app.get("/api/big-ideas/active", async (_req, res) => {
    try {
      const bigIdea = await storage.getActiveBigIdea();
      res.json(bigIdea);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active big idea" });
    }
  });

  // Get single big idea
  app.get("/api/big-ideas/:id", async (req, res) => {
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
  app.post("/api/big-ideas", async (req, res) => {
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
  app.patch("/api/big-ideas/:id", async (req, res) => {
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
  app.post("/api/big-ideas/:id/activate", async (req, res) => {
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
  app.delete("/api/big-ideas/:id", async (req, res) => {
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

  // ==================== Toolbox Routes ====================

  // Get all toolboxes (optionally filter by big idea)
  app.get("/api/toolboxes", async (req, res) => {
    try {
      const bigIdeaId = req.query.bigIdeaId as string | undefined;
      const toolboxes = await storage.getToolboxes(bigIdeaId);
      res.json(toolboxes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch toolboxes" });
    }
  });

  // Get active toolbox
  app.get("/api/toolboxes/active", async (_req, res) => {
    try {
      const toolbox = await storage.getActiveToolbox();
      res.json(toolbox);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active toolbox" });
    }
  });

  // Get single toolbox
  app.get("/api/toolboxes/:id", async (req, res) => {
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
  app.post("/api/toolboxes", async (req, res) => {
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
  app.patch("/api/toolboxes/:id", async (req, res) => {
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
  app.post("/api/toolboxes/:id/activate", async (req, res) => {
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
  app.delete("/api/toolboxes/:id", async (req, res) => {
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

  // ==================== Agent Routes ====================
  
  // Get all agents (optionally filter by toolbox)
  app.get("/api/agents", async (req, res) => {
    try {
      const toolboxId = req.query.toolboxId as string | undefined;
      const agents = await storage.getAgents(toolboxId);
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  // Get active agent
  app.get("/api/agents/active", async (_req, res) => {
    try {
      const agent = await storage.getActiveAgent();
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active agent" });
    }
  });

  // Get single agent
  app.get("/api/agents/:id", async (req, res) => {
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

  // Create agent
  app.post("/api/agents", async (req, res) => {
    try {
      const parsed = insertAgentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const agent = await storage.createAgent(parsed.data);
      res.status(201).json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create agent" });
    }
  });

  // Update agent
  app.patch("/api/agents/:id", async (req, res) => {
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
  app.post("/api/agents/:id/activate", async (req, res) => {
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
  app.delete("/api/agents/:id", async (req, res) => {
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

  // ==================== Knowledge Base Routes ====================

  // Get knowledge bases for an agent
  app.get("/api/knowledge-base/:agentId", async (req, res) => {
    try {
      const kbs = await storage.getKnowledgeBases(req.params.agentId);
      res.json(kbs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge bases" });
    }
  });

  // Create knowledge base
  app.post("/api/knowledge-base", async (req, res) => {
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
  app.post("/api/knowledge-base/upload", upload.single("file"), async (req, res) => {
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
  app.patch("/api/knowledge-base/:id", async (req, res) => {
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
  app.delete("/api/knowledge-base/:id", async (req, res) => {
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

  // ==================== Integration Routes ====================

  // Get integrations for an agent
  app.get("/api/integrations/:agentId", async (req, res) => {
    try {
      const integrations = await storage.getIntegrations(req.params.agentId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch integrations" });
    }
  });

  // Create integration
  app.post("/api/integrations", async (req, res) => {
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
  app.patch("/api/integrations/:id", async (req, res) => {
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
  app.delete("/api/integrations/:id", async (req, res) => {
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

  // Send message
  app.post("/api/messages", async (req, res) => {
    try {
      const parsed = insertMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const message = await storage.createMessage(parsed.data);
      res.status(201).json(message);
    } catch (error) {
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

  // ==================== Analytics Routes ====================

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

  return httpServer;
}
