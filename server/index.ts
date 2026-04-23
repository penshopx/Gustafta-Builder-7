process.on("SIGHUP", () => {
  console.log(`${new Date().toLocaleTimeString()} [express] SIGHUP received — ignoring to keep server alive`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(`${new Date().toLocaleTimeString()} [express] Unhandled Promise Rejection:`, reason);
});

process.on("uncaughtException", (err) => {
  console.error(`${new Date().toLocaleTimeString()} [express] Uncaught Exception:`, err);
});

import express, { type Request, Response, NextFunction } from "express";
import { execSync } from "child_process";

import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { storage } from "./storage";

// Push DB schema on startup in production (build time has no DB access)
if (process.env.NODE_ENV === "production") {
  try {
    console.log("[startup] Pushing database schema...");
    execSync("npx drizzle-kit push --force", { stdio: "inherit", timeout: 60000 });
    console.log("[startup] Schema ready.");
  } catch (err) {
    console.error("[startup] db:push failed — continuing anyway:", err);
  }
}

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

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

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
      
      if (process.env.NODE_ENV !== "production") {
        try {
          const { gustaftaKnowledgeBaseAgent, dokumentenderAgent } = await import("./seed-knowledge-base");
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

          const dokExists = existingAgents.some(
            (agent: any) => agent.name === "Dokumentender Assistant"
          );
          if (!dokExists) {
            await storage.createAgent(dokumentenderAgent as any);
            log("Dokumentender Assistant chatbot auto-seeded successfully");
          } else {
            const dok = existingAgents.find(
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
          log("Failed to auto-seed knowledge base agents: " + (err as Error).message);
        }

        const seedTasks = [
          { name: "Regulasi Jasa Konstruksi", module: "./seed-regulasi", fn: "seedRegulasiJasaKonstruksi" },
          { name: "Asesor Sertifikasi", module: "./seed-asesor", fn: "seedAsesorSertifikasi" },
          { name: "SMAP & PANCEK", module: "./seed-smap-pancek", fn: "seedSmapPancek" },
          { name: "Odoo Jasa Konstruksi", module: "./seed-odoo", fn: "seedOdooKonstruksi" },
          { name: "CSMAS", module: "./seed-csmas", fn: "seedCsmas" },
          { name: "CIVILPRO", module: "./seed-civilpro", fn: "seedCivilpro" },
          { name: "SIP-PJBU", module: "./seed-sip-pjbu", fn: "seedSipPjbu" },
          { name: "Manajemen LSBU", module: "./seed-manajemen-lsbu", fn: "seedManajemenLsbu" },
          { name: "Manajemen LSP", module: "./seed-manajemen-lsp", fn: "seedManajemenLsp" },
          { name: "ISO 14001", module: "./seed-iso14001", fn: "seedIso14001" },
          { name: "ISO 9001", module: "./seed-iso9001", fn: "seedIso9001" },
          { name: "Siap Uji Kompetensi", module: "./seed-siap-ukom", fn: "seedSiapUkom" },
          { name: "Kompetensi Teknis", module: "./seed-kompetensi-teknis", fn: "seedKompetensiTeknis" },
          { name: "Pembinaan ASPEKINDO", module: "./seed-aspekindo", fn: "seedAspekindo" },
          { name: "SKK AJJ — Asesmen Jarak Jauh", module: "./seed-skk-ajj", fn: "seedSkkAjj" },
        ];

        for (const seed of seedTasks) {
          try {
            const mod = await import(seed.module);
            await mod[seed.fn]("49465846");
          } catch (err) {
            log(`Failed to seed ${seed.name} ecosystem: ` + (err as Error).message);
          }
        }

        try {
          const { fixOrphanedOrchestrators } = await import("./fix-orchestrators");
          await fixOrphanedOrchestrators();
        } catch (err) {
          log("Failed to fix orphaned orchestrators: " + (err as Error).message);
        }
      } else {
        log("Production mode — skipping seed operations (data already in database)");
      }

      // Catch-up seeds: run if SKK AJJ series is missing OR incomplete (<10 toolboxes)
      try {
        const { seedSkkAjj } = await import("./seed-skk-ajj");
        const allSeries = await storage.getSeries();
        const skkSeries = allSeries.find((s: any) => s.name === "SKK AJJ — Asesmen Jarak Jauh");
        let needsSeed = !skkSeries;
        if (skkSeries) {
          const toolboxes = await storage.getToolboxes(undefined, skkSeries.id);
          if (toolboxes.length < 10) needsSeed = true;
        }
        if (needsSeed) {
          log("[CatchUp] Seeding SKK AJJ — Asesmen Jarak Jauh (missing or incomplete)");
          await seedSkkAjj("49465846");
        }
      } catch (err) {
        log("Catch-up seed error: " + (err as Error).message);
      }

      // Catch-up: Pusat FAQ Peserta (added later, may not exist in older installations)
      try {
        const { seedPusatFaqPeserta } = await import("./seed-pusat-faq-peserta");
        await seedPusatFaqPeserta("49465846");
      } catch (err) {
        log("Catch-up Pusat FAQ seed error: " + (err as Error).message);
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
