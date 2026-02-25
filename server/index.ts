import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { storage } from "./storage";
import { gustaftaKnowledgeBaseAgent, dokumentenderAgent } from "./seed-knowledge-base";
import { seedRegulasiJasaKonstruksi } from "./seed-regulasi";
import { seedAsesorSertifikasi } from "./seed-asesor";
import { seedSmapPancek } from "./seed-smap-pancek";
import { seedOdooKonstruksi } from "./seed-odoo";
import { seedCsmas } from "./seed-csmas";
import { seedCivilpro } from "./seed-civilpro";
import { fixOrphanedOrchestrators } from "./fix-orchestrators";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: "50mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && process.env.NODE_ENV !== "production") {
        const jsonStr = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${jsonStr.length > 200 ? jsonStr.substring(0, 200) + "..." : jsonStr}`;
      }

      log(logLine);
    }
  });

  next();
});

const requiredEnvVars = ["DATABASE_URL", "SESSION_SECRET"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

(async () => {
  await setupAuth(app);
  registerAuthRoutes(app);
  registerAudioRoutes(app);
  
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    async () => {
      log(`serving on port ${port}`);
      
      try {
        const existingAgents = await storage.getAgents();
        const helpdeskExists = existingAgents.some(
          (agent: any) => agent.name === "Gustafta Helpdesk" || agent.name === "Gustafta Assistant"
        );
        if (!helpdeskExists) {
          await storage.createAgent(gustaftaKnowledgeBaseAgent as any);
          log("Gustafta Helpdesk chatbot auto-seeded successfully");
        } else {
          const helpdesk = existingAgents.find(
            (agent: any) => agent.name === "Gustafta Helpdesk" || agent.name === "Gustafta Assistant"
          );
          if (helpdesk) {
            await storage.updateAgent(helpdesk.id, {
              systemPrompt: gustaftaKnowledgeBaseAgent.systemPrompt,
              greetingMessage: gustaftaKnowledgeBaseAgent.greetingMessage,
              conversationStarters: gustaftaKnowledgeBaseAgent.conversationStarters,
              personality: gustaftaKnowledgeBaseAgent.personality,
              tagline: gustaftaKnowledgeBaseAgent.tagline,
              description: gustaftaKnowledgeBaseAgent.description,
            } as any);
            log("Gustafta Helpdesk chatbot updated with latest configuration");
          }
        }
      } catch (err) {
        log("Failed to auto-seed Gustafta Helpdesk: " + (err as Error).message);
      }

      try {
        const allAgents = await storage.getAgents();
        const dokExists = allAgents.some(
          (agent: any) => agent.name === "Dokumentender Assistant"
        );
        if (!dokExists) {
          await storage.createAgent(dokumentenderAgent as any);
          log("Dokumentender Assistant chatbot auto-seeded successfully");
        } else {
          const dok = allAgents.find(
            (agent: any) => agent.name === "Dokumentender Assistant"
          );
          if (dok) {
            await storage.updateAgent(dok.id, {
              systemPrompt: dokumentenderAgent.systemPrompt,
              greetingMessage: dokumentenderAgent.greetingMessage,
              conversationStarters: dokumentenderAgent.conversationStarters,
              personality: dokumentenderAgent.personality,
              tagline: dokumentenderAgent.tagline,
              description: dokumentenderAgent.description,
            } as any);
            log("Dokumentender Assistant chatbot updated with latest configuration");
          }
        }
      } catch (err) {
        log("Failed to auto-seed Dokumentender: " + (err as Error).message);
      }

      try {
        await seedRegulasiJasaKonstruksi("49465846");
      } catch (err) {
        log("Failed to seed Regulasi Jasa Konstruksi ecosystem: " + (err as Error).message);
      }

      try {
        await seedAsesorSertifikasi("49465846");
      } catch (err) {
        log("Failed to seed Asesor Sertifikasi ecosystem: " + (err as Error).message);
      }

      try {
        await seedSmapPancek("49465846");
      } catch (err) {
        log("Failed to seed SMAP & PANCEK ecosystem: " + (err as Error).message);
      }

      try {
        await seedOdooKonstruksi("49465846");
      } catch (err) {
        log("Failed to seed Odoo Jasa Konstruksi ecosystem: " + (err as Error).message);
      }

      try {
        await seedCsmas("49465846");
      } catch (err) {
        log("Failed to seed CSMAS ecosystem: " + (err as Error).message);
      }

      try {
        await seedCivilpro("49465846");
      } catch (err) {
        log("Failed to seed CIVILPRO ecosystem: " + (err as Error).message);
      }

      try {
        await fixOrphanedOrchestrators();
      } catch (err) {
        log("Failed to fix orphaned orchestrators: " + (err as Error).message);
      }

      startScheduler();
    },
  );
})();

function startScheduler() {
  const BROADCAST_CHECK_INTERVAL = 2 * 60 * 1000;
  const TENDER_SCRAPE_INTERVAL = 12 * 60 * 60 * 1000;

  setInterval(async () => {
    try {
      const dueBroadcasts = await storage.getDueBroadcasts();
      for (const broadcast of dueBroadcasts) {
        log(`[Scheduler] Running broadcast: ${broadcast.name} (ID: ${broadcast.id})`);
        try {
          const contacts = await storage.getWaContacts(String(broadcast.agentId));
          const activeContacts = contacts.filter(c => !c.isOptedOut);
          if (activeContacts.length === 0) continue;

          const integrations = await storage.getIntegrations(String(broadcast.agentId));
          const waIntegration = integrations.find((i: any) => i.type === "whatsapp" && i.isEnabled);
          const waConfig = (waIntegration?.config || {}) as Record<string, string>;
          const waApiToken = waConfig.apiToken || waConfig.token;
          if (!waApiToken) continue;

          const run = await storage.createBroadcastRun({
            broadcastId: broadcast.id,
            status: "running",
            totalRecipients: activeContacts.length,
          });

          let message = broadcast.messageTemplate;
          if (broadcast.dataSource === "tender_daily") {
            const latestTenders = await storage.getLatestTenders(10);
            if (latestTenders.length > 0) {
              const tenderList = latestTenders.map((t: any, i: number) =>
                `${i + 1}. ${t.name}\n   ${t.agency} | ${t.budget}\n   ${t.url}`
              ).join("\n\n");
              message = message.replace("{{tender_list}}", tenderList);
              message = message.replace("{{date}}", new Date().toLocaleDateString("id-ID"));
              message = message.replace("{{count}}", String(latestTenders.length));
            }
          }

          let sent = 0, failed = 0;
          for (const contact of activeContacts) {
            try {
              await fetch("https://api.fonnte.com/send", {
                method: "POST",
                headers: { "Authorization": waApiToken },
                body: new URLSearchParams({
                  target: contact.phone,
                  message: message.replace("{{name}}", contact.name || ""),
                }),
              });
              sent++;
              if (activeContacts.length > 5) await new Promise(r => setTimeout(r, 1000));
            } catch {
              failed++;
            }
          }

          await storage.updateBroadcastRun(String(run.id), {
            status: "completed",
            totalSent: sent,
            totalFailed: failed,
            completedAt: new Date(),
          });

          await storage.updateWaBroadcast(String(broadcast.id), { lastRunAt: new Date() } as any);

          if (broadcast.scheduleType === "daily") {
            const [hours, minutes] = (broadcast.scheduleTime || "08:00").split(":").map(Number);
            const next = new Date();
            next.setDate(next.getDate() + 1);
            next.setHours(hours, minutes, 0, 0);
            await storage.updateWaBroadcast(String(broadcast.id), { nextRunAt: next } as any);
          } else if (broadcast.scheduleType === "once") {
            await storage.updateWaBroadcast(String(broadcast.id), { isEnabled: false } as any);
          }

          log(`[Scheduler] Broadcast "${broadcast.name}" completed: ${sent} sent, ${failed} failed`);
        } catch (err) {
          log(`[Scheduler] Broadcast "${broadcast.name}" failed: ${(err as Error).message}`);
        }
      }
    } catch (err) {
      log(`[Scheduler] Broadcast check error: ${(err as Error).message}`);
    }
  }, BROADCAST_CHECK_INTERVAL);

  setInterval(async () => {
    try {
      const { runDailyTenderScrape } = await import("./lib/inaproc-scraper");
      await runDailyTenderScrape(storage);
    } catch (err) {
      log(`[Scheduler] Tender scrape error: ${(err as Error).message}`);
    }
  }, TENDER_SCRAPE_INTERVAL);

  log("[Scheduler] Started - broadcasts checked every 2min, tenders scraped every 12h");
}
