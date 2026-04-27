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
          { name: "AJJ Nirkertas — Tata Kelola LSP & BNSP", module: "./seed-ajj-nirkertas", fn: "seedAjjNirkertas" },
          { name: "AJJ Nirkertas Extra — Bidang Kompetensi & Skema", module: "./seed-ajj-nirkertas-extra", fn: "seedAjjNirkertasExtra" },
          { name: "SKK Hard Copy — Uji Kompetensi Tatap Muka", module: "./seed-skk-hardcopy", fn: "seedSkkHardcopy" },
          { name: "SKK Hard Copy Extra — Bidang Kompetensi & Skema Tatap Muka", module: "./seed-skk-hardcopy-extra", fn: "seedSkkHardcopyExtra" },
          { name: "ASKOM Konstruksi — Asesor Kompetensi Jasa Konstruksi", module: "./seed-askom-konstruksi", fn: "seedAskomKonstruksi" },
          { name: "Lisensi LSP Konstruksi — LPJK & BNSP", module: "./seed-lisensi-lsp", fn: "seedLisensiLsp" },
          { name: "Konsultan Lisensi LSP — Toolkit Pendamping LPJK & BNSP", module: "./seed-konsultan-lisensi-lsp", fn: "seedKonsultanLisensiLsp" },
          { name: "Kompetensi Manajerial BUJK — ASPEKINDO", module: "./seed-kompetensi-manajerial-bujk", fn: "seedKompetensiManajerialBujk" },
          { name: "IMS & SMK3 Terintegrasi", module: "./seed-ims-smk3-terintegrasi", fn: "seedImsSmk3Terintegrasi" },
          { name: "Personel Manajerial BUJK", module: "./seed-personel-manajerial-bujk", fn: "seedPersonelManajerialBujk" },
          { name: "Tender Konstruksi & PBJP", module: "./seed-tender-konstruksi-pbjp", fn: "seedTenderKonstruksiPbjp" },
          { name: "Pasca Tender & Manajemen Kontrak", module: "./seed-pasca-tender-manajemen-kontrak", fn: "seedPascaTenderManajemenKontrak" },
          { name: "Pelaksanaan Proyek Lapangan", module: "./seed-pelaksanaan-proyek-lapangan", fn: "seedPelaksanaanProyekLapangan" },
          { name: "Legalitas Jasa Konstruksi", module: "./seed-legalitas-jasa-konstruksi", fn: "seedLegalitasJasaKonstruksi" },
          { name: "Regulasi Jasa Konstruksi Indonesia", module: "./seed-regulasi-jasa-konstruksi", fn: "seedRegulasiJasaKonstruksi" },
          { name: "SBU Coach Pekerjaan Konstruksi & Konsultan", module: "./seed-sbu-coach", fn: "seedSbuCoach" },
          { name: "SBU Coach All-in-One — Klasifikasi Terintegrasi", module: "./seed-sbu-master", fn: "seedSbuMaster" },
          { name: "SBU Coach — Pekerjaan Konstruksi Terintegrasi (GT & ST)", module: "./seed-sbu-terintegrasi", fn: "seedSbuTerintegrasi" },
          { name: "SKK Coach — Manajemen Pelaksanaan", module: "./seed-skk-manajemen-pelaksanaan", fn: "seedSkkManajemenPelaksanaan" },
          { name: "SKK Coach — Mekanikal", module: "./seed-skk-mekanikal", fn: "seedSkkMekanikal" },
          { name: "SKK Coach — Sipil", module: "./seed-skk-sipil", fn: "seedSkkSipil" },
          { name: "SKK Coach — Elektrikal", module: "./seed-skk-elektrikal", fn: "seedSkkElektrikal" },
          { name: "SKK Coach — Arsitektur", module: "./seed-skk-arsitektur", fn: "seedSkkArsitektur" },
          { name: "SKK Coach — Tata Lingkungan", module: "./seed-skk-tata-lingkungan", fn: "seedSkkTataLingkungan" },
          { name: "SKK Coach — K3 Konstruksi", module: "./seed-skk-k3-konstruksi", fn: "seedSkkK3Konstruksi" },
          { name: "SKK Coach — Manajemen Proyek Konstruksi", module: "./seed-skk-manajemen-proyek", fn: "seedSkkManajemenProyek" },
          { name: "SKK Coach — Geoteknik & Geodesi", module: "./seed-skk-geoteknik", fn: "seedSkkGeoteknik" },
          { name: "SKK Coach — Pengujian & QC Konstruksi", module: "./seed-skk-pengujian-qc", fn: "seedSkkPengujianQc" },
          { name: "SKK Coach — Bangunan Gedung & Utilitas", module: "./seed-skk-bangunan-gedung", fn: "seedSkkBangunanGedung" },
          { name: "SKK Coach — Konstruksi Khusus", module: "./seed-skk-konstruksi-khusus", fn: "seedSkkKonstruksiKhusus" },
          { name: "SKK Coach — Peralatan Konstruksi & Logistik", module: "./seed-skk-peralatan-logistik", fn: "seedSkkPeralatanLogistik" },
          { name: "SBU Coach — Jasa Penunjang Tenaga Listrik", module: "./seed-sbu-penunjang-listrik", fn: "seedSbuPenunjangListrik" },
          { name: "SKTK Coach — Tenaga Teknik Ketenagalistrikan", module: "./seed-sktk-tenaga-listrik", fn: "seedSktkTenagaListrik" },
          { name: "SBU Kompetensi — Migas, EBT, dan Pertambangan", module: "./seed-sbu-kompetensi-migas-ebt-tambang", fn: "seedSbuKompetensiMigasEbtTambang" },
          { name: "DevProperti Pro — Developer Real Estate", module: "./seed-developer-real-estate", fn: "seedDeveloperRealEstate" },
          { name: "EstateCare Pro — Layanan Real Estate", module: "./seed-layanan-real-estate", fn: "seedLayananRealEstate" },
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

      // Catch-up: AJJ Nirkertas — Tata Kelola LSP & BNSP (added Apr 2026)
      try {
        const { seedAjjNirkertas } = await import("./seed-ajj-nirkertas");
        await seedAjjNirkertas("49465846");
      } catch (err) {
        log("Catch-up AJJ Nirkertas seed error: " + (err as Error).message);
      }

      // Catch-up: AJJ Nirkertas Extra — Bidang Kompetensi & Skema (added Apr 2026)
      try {
        const { seedAjjNirkertasExtra } = await import("./seed-ajj-nirkertas-extra");
        await seedAjjNirkertasExtra("49465846");
      } catch (err) {
        log("Catch-up AJJ Nirkertas Extra seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Hard Copy — Uji Kompetensi Tatap Muka (added Apr 2026)
      try {
        const { seedSkkHardcopy } = await import("./seed-skk-hardcopy");
        await seedSkkHardcopy("49465846");
      } catch (err) {
        log("Catch-up SKK Hardcopy seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Hard Copy Extra — Bidang Kompetensi & Skema Tatap Muka (added Apr 2026)
      try {
        const { seedSkkHardcopyExtra } = await import("./seed-skk-hardcopy-extra");
        await seedSkkHardcopyExtra("49465846");
      } catch (err) {
        log("Catch-up SKK Hardcopy Extra seed error: " + (err as Error).message);
      }

      // Catch-up: ASKOM Konstruksi — Asesor Kompetensi Jasa Konstruksi (added Apr 2026)
      try {
        const { seedAskomKonstruksi } = await import("./seed-askom-konstruksi");
        await seedAskomKonstruksi("49465846");
      } catch (err) {
        log("Catch-up ASKOM Konstruksi seed error: " + (err as Error).message);
      }

      // Catch-up: Lisensi LSP Konstruksi — LPJK & BNSP (added Apr 2026)
      try {
        const { seedLisensiLsp } = await import("./seed-lisensi-lsp");
        await seedLisensiLsp("49465846");
      } catch (err) {
        log("Catch-up Lisensi LSP seed error: " + (err as Error).message);
      }

      // Catch-up: Konsultan Lisensi LSP (added Apr 2026)
      try {
        const { seedKonsultanLisensiLsp } = await import("./seed-konsultan-lisensi-lsp");
        await seedKonsultanLisensiLsp("49465846");
      } catch (err) {
        log("Catch-up Konsultan Lisensi LSP seed error: " + (err as Error).message);
      }

      // Catch-up: Kompetensi Manajerial BUJK (added Apr 2026)
      try {
        const { seedKompetensiManajerialBujk } = await import("./seed-kompetensi-manajerial-bujk");
        const allSeries = await storage.getSeries();
        const kmSeries = allSeries.find((s: any) => s.slug === "kompetensi-manajerial-bujk");
        if (!kmSeries) {
          log("[CatchUp] Seeding Kompetensi Manajerial BUJK (missing)");
          await seedKompetensiManajerialBujk("49465846");
        }
      } catch (err) {
        log("Catch-up Kompetensi Manajerial seed error: " + (err as Error).message);
      }

      // Patch: Kompetensi Manajerial BUJK — tambah SIKaP, Analisis Keuangan, Compliance Tender
      try {
        const { patchKompetensiManajerialBujk } = await import("./seed-kompetensi-manajerial-patch");
        await patchKompetensiManajerialBujk("49465846");
      } catch (err) {
        log("Patch Kompetensi Manajerial error: " + (err as Error).message);
      }

      // Catch-up: IMS & SMK3 Terintegrasi (added Apr 2026)
      try {
        const { seedImsSmk3Terintegrasi } = await import("./seed-ims-smk3-terintegrasi");
        const allSeries = await storage.getSeries();
        const imsSeries = allSeries.find((s: any) => s.slug === "ims-smk3-terintegrasi");
        if (!imsSeries) {
          log("[CatchUp] Seeding IMS & SMK3 Terintegrasi (missing)");
          await seedImsSmk3Terintegrasi("49465846");
        }
      } catch (err) {
        log("Catch-up IMS & SMK3 seed error: " + (err as Error).message);
      }

      // Catch-up: Personel Manajerial BUJK (added Apr 2026)
      try {
        const { seedPersonelManajerialBujk } = await import("./seed-personel-manajerial-bujk");
        const allSeries = await storage.getSeries();
        const pmSeries = allSeries.find((s: any) => s.slug === "personel-manajerial-bujk");
        if (!pmSeries) {
          log("[CatchUp] Seeding Personel Manajerial BUJK (missing)");
          await seedPersonelManajerialBujk("49465846");
        }
      } catch (err) {
        log("Catch-up Personel Manajerial BUJK seed error: " + (err as Error).message);
      }

      // Catch-up: Tender Konstruksi & PBJP (added Apr 2026)
      try {
        const { seedTenderKonstruksiPbjp } = await import("./seed-tender-konstruksi-pbjp");
        const allSeries = await storage.getSeries();
        const tenderSeries = allSeries.find((s: any) => s.slug === "tender-konstruksi-pbjp");
        if (!tenderSeries) {
          log("[CatchUp] Seeding Tender Konstruksi & PBJP (missing)");
          await seedTenderKonstruksiPbjp("49465846");
        }
      } catch (err) {
        log("Catch-up Tender Konstruksi & PBJP seed error: " + (err as Error).message);
      }

      // Catch-up: Pasca Tender & Manajemen Kontrak (added Apr 2026)
      try {
        const { seedPascaTenderManajemenKontrak } = await import("./seed-pasca-tender-manajemen-kontrak");
        const allSeries = await storage.getSeries();
        const pascaSeries = allSeries.find((s: any) => s.slug === "pasca-tender-manajemen-kontrak");
        if (!pascaSeries) {
          log("[CatchUp] Seeding Pasca Tender & Manajemen Kontrak (missing)");
          await seedPascaTenderManajemenKontrak("49465846");
        }
      } catch (err) {
        log("Catch-up Pasca Tender & Manajemen Kontrak seed error: " + (err as Error).message);
      }

      // Catch-up: Pelaksanaan Proyek Lapangan (added Apr 2026)
      try {
        const { seedPelaksanaanProyekLapangan } = await import("./seed-pelaksanaan-proyek-lapangan");
        const allSeries = await storage.getSeries();
        const pelaksanaanSeries = allSeries.find((s: any) => s.slug === "pelaksanaan-proyek-lapangan");
        if (!pelaksanaanSeries) {
          log("[CatchUp] Seeding Pelaksanaan Proyek Lapangan (missing)");
          await seedPelaksanaanProyekLapangan("49465846");
        }
      } catch (err) {
        log("Catch-up Pelaksanaan Proyek Lapangan seed error: " + (err as Error).message);
      }

      // Catch-up: Legalitas Jasa Konstruksi (added Apr 2026)
      try {
        const { seedLegalitasJasaKonstruksi } = await import("./seed-legalitas-jasa-konstruksi");
        const allSeries = await storage.getSeries();
        const legalSeries = allSeries.find((s: any) => s.slug === "legalitas-jasa-konstruksi");
        if (!legalSeries) {
          log("[CatchUp] Seeding Legalitas Jasa Konstruksi (missing)");
          await seedLegalitasJasaKonstruksi("49465846");
        }
      } catch (err) {
        log("Catch-up Legalitas Jasa Konstruksi seed error: " + (err as Error).message);
      }

      // Catch-up: Ringkasan Regulasi Konstruksi Indonesia 2025 (added Apr 2026)
      try {
        const { seedRegulasiJasaKonstruksi } = await import("./seed-regulasi-jasa-konstruksi");
        const allSeries = await storage.getSeries();
        const regulasiSeries = allSeries.find((s: any) => s.slug === "ringkasan-regulasi-konstruksi-2025");
        if (!regulasiSeries) {
          log("[CatchUp] Seeding Ringkasan Regulasi Konstruksi Indonesia 2025 (missing)");
          await seedRegulasiJasaKonstruksi("49465846");
        }
      } catch (err) {
        log("Catch-up Ringkasan Regulasi Konstruksi seed error: " + (err as Error).message);
      }

      // Catch-up: SBU Coach Pekerjaan Konstruksi & Konsultan (added Apr 2026)
      try {
        const { seedSbuCoach } = await import("./seed-sbu-coach");
        const allSeries = await storage.getSeries();
        const sbuCoachSeries = allSeries.find((s: any) => s.slug === "sbu-coach-pekerjaan-konstruksi");
        if (!sbuCoachSeries) {
          log("[CatchUp] Seeding SBU Coach Pekerjaan Konstruksi (missing)");
          await seedSbuCoach("49465846");
        }
      } catch (err) {
        log("Catch-up SBU Coach seed error: " + (err as Error).message);
      }

      // Catch-up: SBU Master Coach All-in-One (added Apr 2026)
      try {
        const { seedSbuMaster } = await import("./seed-sbu-master");
        const allSeries = await storage.getSeries();
        const sbuMasterSeries = allSeries.find((s: any) => s.slug === "sbu-master-coach");
        if (!sbuMasterSeries) {
          log("[CatchUp] Seeding SBU Master Coach All-in-One (missing)");
          await seedSbuMaster("49465846");
        }
      } catch (err) {
        log("Catch-up SBU Master seed error: " + (err as Error).message);
      }

      // Catch-up: SBU Terintegrasi Coach (added Apr 2026)
      try {
        const { seedSbuTerintegrasi } = await import("./seed-sbu-terintegrasi");
        const allSeries = await storage.getSeries();
        const sbuTerintSeries = allSeries.find((s: any) => s.slug === "sbu-terintegrasi-coach");
        if (!sbuTerintSeries) {
          log("[CatchUp] Seeding SBU Terintegrasi Coach (missing)");
          await seedSbuTerintegrasi("49465846");
        }
      } catch (err) {
        log("Catch-up SBU Terintegrasi seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Manajemen Pelaksanaan (added Apr 2026)
      try {
        const { seedSkkManajemenPelaksanaan } = await import("./seed-skk-manajemen-pelaksanaan");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-manajemen-pelaksanaan");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Manajemen Pelaksanaan (missing)");
          await seedSkkManajemenPelaksanaan("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Manajemen Pelaksanaan seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Mekanikal (added Apr 2026)
      try {
        const { seedSkkMekanikal } = await import("./seed-skk-mekanikal");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-mekanikal");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Mekanikal (missing)");
          await seedSkkMekanikal("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Mekanikal seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Sipil (added Apr 2026)
      try {
        const { seedSkkSipil } = await import("./seed-skk-sipil");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-sipil");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Sipil (missing)");
          await seedSkkSipil("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Sipil seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Elektrikal (added Apr 2026)
      try {
        const { seedSkkElektrikal } = await import("./seed-skk-elektrikal");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-elektrikal");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Elektrikal (missing)");
          await seedSkkElektrikal("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Elektrikal seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Arsitektur (added Apr 2026)
      try {
        const { seedSkkArsitektur } = await import("./seed-skk-arsitektur");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-arsitektur");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Arsitektur (missing)");
          await seedSkkArsitektur("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Arsitektur seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Tata Lingkungan (added Apr 2026)
      try {
        const { seedSkkTataLingkungan } = await import("./seed-skk-tata-lingkungan");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-tata-lingkungan");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Tata Lingkungan (missing)");
          await seedSkkTataLingkungan("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Tata Lingkungan seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach K3 Konstruksi (added Apr 2026)
      try {
        const { seedSkkK3Konstruksi } = await import("./seed-skk-k3-konstruksi");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-k3-konstruksi");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach K3 Konstruksi (missing)");
          await seedSkkK3Konstruksi("49465846");
        }
      } catch (err) {
        log("Catch-up SKK K3 Konstruksi seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Manajemen Proyek (added Apr 2026)
      try {
        const { seedSkkManajemenProyek } = await import("./seed-skk-manajemen-proyek");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-manajemen-proyek");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Manajemen Proyek (missing)");
          await seedSkkManajemenProyek("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Manajemen Proyek seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Geoteknik & Geodesi (added Apr 2026)
      try {
        const { seedSkkGeoteknik } = await import("./seed-skk-geoteknik");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-geoteknik");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Geoteknik & Geodesi (missing)");
          await seedSkkGeoteknik("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Geoteknik seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Pengujian & QC Konstruksi (added Apr 2026)
      try {
        const { seedSkkPengujianQc } = await import("./seed-skk-pengujian-qc");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-pengujian-qc");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Pengujian & QC (missing)");
          await seedSkkPengujianQc("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Pengujian QC seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Bangunan Gedung & Utilitas (added Apr 2026)
      try {
        const { seedSkkBangunanGedung } = await import("./seed-skk-bangunan-gedung");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-bangunan-gedung");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Bangunan Gedung & Utilitas (missing)");
          await seedSkkBangunanGedung("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Bangunan Gedung seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Konstruksi Khusus (added Apr 2026)
      try {
        const { seedSkkKonstruksiKhusus } = await import("./seed-skk-konstruksi-khusus");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-konstruksi-khusus");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Konstruksi Khusus (missing)");
          await seedSkkKonstruksiKhusus("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Konstruksi Khusus seed error: " + (err as Error).message);
      }

      // Catch-up: SKK Coach Peralatan Konstruksi & Logistik (added Apr 2026)
      try {
        const { seedSkkPeralatanLogistik } = await import("./seed-skk-peralatan-logistik");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "skk-peralatan-logistik");
        if (!s) {
          log("[CatchUp] Seeding SKK Coach Peralatan Konstruksi & Logistik (missing)");
          await seedSkkPeralatanLogistik("49465846");
        }
      } catch (err) {
        log("Catch-up SKK Peralatan Logistik seed error: " + (err as Error).message);
      }

      // Catch-up: SBU Penunjang Tenaga Listrik (added Apr 2026)
      try {
        const { seedSbuPenunjangListrik } = await import("./seed-sbu-penunjang-listrik");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "sbu-penunjang-listrik");
        if (!s) {
          log("[CatchUp] Seeding SBU Penunjang Tenaga Listrik (missing)");
          await seedSbuPenunjangListrik("49465846");
        }
      } catch (err) {
        log("Catch-up SBU Penunjang Listrik seed error: " + (err as Error).message);
      }

      // Catch-up: SKTK Tenaga Teknik Ketenagalistrikan (added Apr 2026)
      try {
        const { seedSktkTenagaListrik } = await import("./seed-sktk-tenaga-listrik");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "sktk-tenaga-listrik");
        if (!s) {
          log("[CatchUp] Seeding SKTK Tenaga Teknik Ketenagalistrikan (missing)");
          await seedSktkTenagaListrik("49465846");
        }
      } catch (err) {
        log("Catch-up SKTK Tenaga Listrik seed error: " + (err as Error).message);
      }

      // Catch-up: SBU Kompetensi Migas, EBT, dan Pertambangan (added Apr 2026)
      try {
        const { seedSbuKompetensiMigasEbtTambang } = await import("./seed-sbu-kompetensi-migas-ebt-tambang");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "sbu-kompetensi-migas-ebt-tambang");
        if (!s) {
          log("[CatchUp] Seeding SBU Kompetensi Migas, EBT & Pertambangan (missing)");
          await seedSbuKompetensiMigasEbtTambang("49465846");
        }
      } catch (err) {
        log("Catch-up SBU Kompetensi Migas seed error: " + (err as Error).message);
      }

      // Catch-up: DevProperti Pro — Developer Real Estate (added Apr 2026)
      try {
        const { seedDeveloperRealEstate } = await import("./seed-developer-real-estate");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "developer-real-estate");
        if (!s) {
          log("[CatchUp] Seeding DevProperti Pro — Developer Real Estate (missing)");
          await seedDeveloperRealEstate("49465846");
        }
      } catch (err) {
        log("Catch-up DevProperti Pro seed error: " + (err as Error).message);
      }

      // Catch-up: EstateCare Pro — Layanan Real Estate (added Apr 2026)
      try {
        const { seedLayananRealEstate } = await import("./seed-layanan-real-estate");
        const allSeries = await storage.getSeries();
        const s = allSeries.find((x: any) => x.slug === "layanan-real-estate");
        if (!s) {
          log("[CatchUp] Seeding EstateCare Pro — Layanan Real Estate (missing)");
          await seedLayananRealEstate("49465846");
        }
      } catch (err) {
        log("Catch-up EstateCare Pro seed error: " + (err as Error).message);
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
