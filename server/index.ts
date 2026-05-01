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

import * as M_knowledgeBase from "./seed-knowledge-base";
import * as M_regulasi from "./seed-regulasi";
import * as M_asesor from "./seed-asesor";
import * as M_asesorLspExtra from "./seed-asesor-lsp-extra";
import * as M_smapPancek from "./seed-smap-pancek";
import * as M_odoo from "./seed-odoo";
import * as M_csmsOptia from "./seed-csms-optia";
import * as M_civilpro from "./seed-civilpro";
import * as M_sipPjbu from "./seed-sip-pjbu";
import * as M_manajemenLsbu from "./seed-manajemen-lsbu";
import * as M_manajemenLsp from "./seed-manajemen-lsp";
import * as M_iso14001 from "./seed-iso14001";
import * as M_iso9001 from "./seed-iso9001";
import * as M_siapUkom from "./seed-siap-ukom";
import * as M_kompetensiTeknis from "./seed-kompetensi-teknis";
import * as M_aspekindo from "./seed-aspekindo";
import * as M_skkAjj from "./seed-skk-ajj";
import * as M_ajjNirkertas from "./seed-ajj-nirkertas";
import * as M_ajjNirkertasExtra from "./seed-ajj-nirkertas-extra";
import * as M_skkHardcopy from "./seed-skk-hardcopy";
import * as M_skkHardcopyExtra from "./seed-skk-hardcopy-extra";
import * as M_askomKonstruksi from "./seed-askom-konstruksi";
import * as M_askomKonstruksiExtra from "./seed-askom-konstruksi-extra";
import * as M_lisensiLsp from "./seed-lisensi-lsp";
import * as M_lisensiLspExtra from "./seed-lisensi-lsp-extra";
import * as M_konsultanLisensiLsp from "./seed-konsultan-lisensi-lsp";
import * as M_akreditasiKan from "./seed-akreditasi-kan";
import * as M_akreditasiKanExtra from "./seed-akreditasi-kan-extra";
import * as M_smapIso37001 from "./seed-smap-iso37001";
import * as M_pancekKpk from "./seed-pancek-kpk";
import * as M_odooBujk from "./seed-odoo-bujk";
import * as M_odooMigrasi from "./seed-odoo-migrasi";
import * as M_kompetensiManajerialBujk from "./seed-kompetensi-manajerial-bujk";
import * as M_kompetensiManajerialPatch from "./seed-kompetensi-manajerial-patch";
import * as M_imsSmk3Terintegrasi from "./seed-ims-smk3-terintegrasi";
import * as M_personelManajerialBujk from "./seed-personel-manajerial-bujk";
import * as M_tenderKonstruksiPbjp from "./seed-tender-konstruksi-pbjp";
import * as M_pascaTenderManajemenKontrak from "./seed-pasca-tender-manajemen-kontrak";
import * as M_pelaksanaanProyekLapangan from "./seed-pelaksanaan-proyek-lapangan";
import * as M_legalitasJasaKonstruksi from "./seed-legalitas-jasa-konstruksi";
import * as M_regulasiJasaKonstruksi from "./seed-regulasi-jasa-konstruksi";
import * as M_sbuCoach from "./seed-sbu-coach";
import * as M_sbuMaster from "./seed-sbu-master";
import * as M_sbuTerintegrasi from "./seed-sbu-terintegrasi";
import * as M_skkManajemenPelaksanaan from "./seed-skk-manajemen-pelaksanaan";
import * as M_skkMekanikal from "./seed-skk-mekanikal";
import * as M_skkSipil from "./seed-skk-sipil";
import * as M_skkElektrikal from "./seed-skk-elektrikal";
import * as M_skkArsitektur from "./seed-skk-arsitektur";
import * as M_skkTataLingkungan from "./seed-skk-tata-lingkungan";
import * as M_skkK3Konstruksi from "./seed-skk-k3-konstruksi";
import * as M_skkManajemenProyek from "./seed-skk-manajemen-proyek";
import * as M_skkGeoteknik from "./seed-skk-geoteknik";
import * as M_skkPengujianQc from "./seed-skk-pengujian-qc";
import * as M_skkBangunanGedung from "./seed-skk-bangunan-gedung";
import * as M_skkKonstruksiKhusus from "./seed-skk-konstruksi-khusus";
import * as M_skkPeralatanLogistik from "./seed-skk-peralatan-logistik";
import * as M_sbuPenunjangListrik from "./seed-sbu-penunjang-listrik";
import * as M_sktkTenagaListrik from "./seed-sktk-tenaga-listrik";
import * as M_sbuKompetensiMigasEbtTambang from "./seed-sbu-kompetensi-migas-ebt-tambang";
import * as M_developerRealEstate from "./seed-developer-real-estate";
import * as M_layananRealEstate from "./seed-layanan-real-estate";
import * as M_pusatFaqPeserta from "./seed-pusat-faq-peserta";
import * as M_fixOrchestrators from "./fix-orchestrators";
import * as M_inaprocScraper from "./lib/inaproc-scraper";

const seedModuleRegistry: Record<string, any> = {
  "./seed-knowledge-base": M_knowledgeBase,
  "./seed-regulasi": M_regulasi,
  "./seed-asesor": M_asesor,
  "./seed-asesor-lsp-extra": M_asesorLspExtra,
  "./seed-smap-pancek": M_smapPancek,
  "./seed-odoo": M_odoo,
  "./seed-csms-optia": M_csmsOptia,
  "./seed-civilpro": M_civilpro,
  "./seed-sip-pjbu": M_sipPjbu,
  "./seed-manajemen-lsbu": M_manajemenLsbu,
  "./seed-manajemen-lsp": M_manajemenLsp,
  "./seed-iso14001": M_iso14001,
  "./seed-iso9001": M_iso9001,
  "./seed-siap-ukom": M_siapUkom,
  "./seed-kompetensi-teknis": M_kompetensiTeknis,
  "./seed-aspekindo": M_aspekindo,
  "./seed-skk-ajj": M_skkAjj,
  "./seed-ajj-nirkertas": M_ajjNirkertas,
  "./seed-ajj-nirkertas-extra": M_ajjNirkertasExtra,
  "./seed-skk-hardcopy": M_skkHardcopy,
  "./seed-skk-hardcopy-extra": M_skkHardcopyExtra,
  "./seed-askom-konstruksi": M_askomKonstruksi,
  "./seed-askom-konstruksi-extra": M_askomKonstruksiExtra,
  "./seed-lisensi-lsp": M_lisensiLsp,
  "./seed-lisensi-lsp-extra": M_lisensiLspExtra,
  "./seed-konsultan-lisensi-lsp": M_konsultanLisensiLsp,
  "./seed-akreditasi-kan": M_akreditasiKan,
  "./seed-akreditasi-kan-extra": M_akreditasiKanExtra,
  "./seed-smap-iso37001": M_smapIso37001,
  "./seed-pancek-kpk": M_pancekKpk,
  "./seed-odoo-bujk": M_odooBujk,
  "./seed-odoo-migrasi": M_odooMigrasi,
  "./seed-kompetensi-manajerial-bujk": M_kompetensiManajerialBujk,
  "./seed-kompetensi-manajerial-patch": M_kompetensiManajerialPatch,
  "./seed-ims-smk3-terintegrasi": M_imsSmk3Terintegrasi,
  "./seed-personel-manajerial-bujk": M_personelManajerialBujk,
  "./seed-tender-konstruksi-pbjp": M_tenderKonstruksiPbjp,
  "./seed-pasca-tender-manajemen-kontrak": M_pascaTenderManajemenKontrak,
  "./seed-pelaksanaan-proyek-lapangan": M_pelaksanaanProyekLapangan,
  "./seed-legalitas-jasa-konstruksi": M_legalitasJasaKonstruksi,
  "./seed-regulasi-jasa-konstruksi": M_regulasiJasaKonstruksi,
  "./seed-sbu-coach": M_sbuCoach,
  "./seed-sbu-master": M_sbuMaster,
  "./seed-sbu-terintegrasi": M_sbuTerintegrasi,
  "./seed-skk-manajemen-pelaksanaan": M_skkManajemenPelaksanaan,
  "./seed-skk-mekanikal": M_skkMekanikal,
  "./seed-skk-sipil": M_skkSipil,
  "./seed-skk-elektrikal": M_skkElektrikal,
  "./seed-skk-arsitektur": M_skkArsitektur,
  "./seed-skk-tata-lingkungan": M_skkTataLingkungan,
  "./seed-skk-k3-konstruksi": M_skkK3Konstruksi,
  "./seed-skk-manajemen-proyek": M_skkManajemenProyek,
  "./seed-skk-geoteknik": M_skkGeoteknik,
  "./seed-skk-pengujian-qc": M_skkPengujianQc,
  "./seed-skk-bangunan-gedung": M_skkBangunanGedung,
  "./seed-skk-konstruksi-khusus": M_skkKonstruksiKhusus,
  "./seed-skk-peralatan-logistik": M_skkPeralatanLogistik,
  "./seed-sbu-penunjang-listrik": M_sbuPenunjangListrik,
  "./seed-sktk-tenaga-listrik": M_sktkTenagaListrik,
  "./seed-sbu-kompetensi-migas-ebt-tambang": M_sbuKompetensiMigasEbtTambang,
  "./seed-developer-real-estate": M_developerRealEstate,
  "./seed-layanan-real-estate": M_layananRealEstate,
  "./seed-pusat-faq-peserta": M_pusatFaqPeserta,
  "./fix-orchestrators": M_fixOrchestrators,
  "./lib/inaproc-scraper": M_inaprocScraper,
};

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
      
      // ── ORPHAN CLEANUP — hapus toolboxes/agents yang induknya sudah hilang ──
      // Berlaku di dev & prod sebagai defense-in-depth. Idempoten: hanya menghapus baris yang
      // big_idea_id/series_id-nya tidak lagi punya induk valid; aman dijalankan tiap boot.
      try {
        const { db: rawDb } = await import("./db");
        const { sql: rawSql } = await import("drizzle-orm");
        const orphanAgentsRes: any = await rawDb.execute(rawSql`
          DELETE FROM agents
          WHERE toolbox_id IS NOT NULL
            AND toolbox_id NOT IN (SELECT id FROM toolboxes)
          RETURNING id
        `);
        const orphanToolboxesRes: any = await rawDb.execute(rawSql`
          DELETE FROM toolboxes
          WHERE (big_idea_id IS NOT NULL AND big_idea_id NOT IN (SELECT id FROM big_ideas))
             OR (series_id   IS NOT NULL AND series_id   NOT IN (SELECT id FROM series))
          RETURNING id
        `);
        const aRows = (orphanAgentsRes?.rowCount ?? orphanAgentsRes?.rows?.length ?? 0);
        const tRows = (orphanToolboxesRes?.rowCount ?? orphanToolboxesRes?.rows?.length ?? 0);
        if (aRows || tRows) {
          log(`[OrphanCleanup] removed ${tRows} orphan toolbox(es) & ${aRows} orphan agent(s)`);
        }
      } catch (err) {
        log("[OrphanCleanup] error: " + (err as Error).message);
      }

      // ── PUBLIC FLAG REPAIR — pastikan agen SKK/SBU/SKTK Coach is_public=true ──
      // Bug historis: 17 file seed memanggil createAgent() tanpa isPublic:true → default false.
      // Akibatnya endpoint /api/public/modul/:bigIdeaId memfilter habis & UI menampilkan
      // "Belum Ada Chatbot" pada modul SKK Sipil dll. Patch seed sudah memperbaiki untuk
      // seed baru, tapi data eksisting di prod & dev tetap private. Migrasi ini idempoten:
      // hanya UPDATE baris yang masih is_public=false dalam scope SKK/SBU/SKTK Coach.
      try {
        const { db: rawDb } = await import("./db");
        const { sql: rawSql } = await import("drizzle-orm");
        const repairRes: any = await rawDb.execute(rawSql`
          UPDATE agents SET is_public = true
          WHERE id IN (
            SELECT a.id FROM agents a
            JOIN toolboxes t ON a.toolbox_id = t.id
            JOIN series s ON t.series_id = s.id
            WHERE (s.slug LIKE 'skk-%' OR s.slug LIKE 'sbu-%' OR s.slug LIKE 'sktk-%')
              AND a.is_public = false
          )
          RETURNING id
        `);
        const rows = (repairRes?.rowCount ?? repairRes?.rows?.length ?? 0);
        if (rows) {
          log(`[PublicFlagRepair] set is_public=true for ${rows} SKK/SBU/SKTK agent(s)`);
        }
      } catch (err) {
        log("[PublicFlagRepair] error: " + (err as Error).message);
      }

      // ── SEED BLOCK: berlaku di DEV & PROD ──
      // Sebelumnya di-gate hanya non-production → menyebabkan production tertinggal
      // (mis. 5 chatbot ekstra Lisensi LSP tidak ikut). Semua seed sudah idempotent
      // (cek existence per BigIdea/toolbox, lalu skip), jadi aman dijalankan di prod.
      // Yang clear-and-reseed (IMS, Personel Manajerial, Tender, Pasca Tender, Pelaksanaan,
      // Legalitas) hanya menyentuh data seri-nya sendiri — tidak menghapus chatbot user.
      {
        try {
          const { gustaftaKnowledgeBaseAgent, dokumentenderAgent } = M_knowledgeBase;
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
          { name: "Asesor LSP Extra — Etika/CoI, Regulasi, Integrasi, RCC", module: "./seed-asesor-lsp-extra", fn: "seedAsesorLspExtra" },
          { name: "SMAP & PANCEK", module: "./seed-smap-pancek", fn: "seedSmapPancek" },
          { name: "Odoo Jasa Konstruksi", module: "./seed-odoo", fn: "seedOdooKonstruksi" },
          { name: "CSMS OPTIA v2.0", module: "./seed-csms-optia", fn: "seedCsmsOptia" },
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
          { name: "ASKOM Konstruksi Extra — BA-UKK, Portofolio, RPL, MUK, Moda Uji, Pelatihan", module: "./seed-askom-konstruksi-extra", fn: "seedAskomKonstruksiExtra" },
          { name: "Lisensi LSP Konstruksi — LPJK & BNSP", module: "./seed-lisensi-lsp", fn: "seedLisensiLsp" },
          { name: "Lisensi LSP Extra — Lisensi Baru, Surveilans, Perpanjangan, Perubahan, Sanksi", module: "./seed-lisensi-lsp-extra", fn: "seedLisensiLspExtra" },
          { name: "Konsultan Lisensi LSP — Toolkit Pendamping LPJK & BNSP", module: "./seed-konsultan-lisensi-lsp", fn: "seedKonsultanLisensiLsp" },
          { name: "Akreditasi LSP oleh KAN — SNI ISO/IEC 17024 + KAN K-09", module: "./seed-akreditasi-kan", fn: "seedAkreditasiKan" },
          { name: "Akreditasi KAN Extra — Asesmen Awal, Surveilans, Re-Akreditasi, Extension Scope, Banding & Sanksi", module: "./seed-akreditasi-kan-extra", fn: "seedAkreditasiKanExtra" },
          { name: "Chatbot SMAP — Sistem Manajemen Anti Penyuapan (SNI ISO 37001:2016)", module: "./seed-smap-iso37001", fn: "seedSmapIso37001" },
          { name: "Chatbot SMAP Nasional & Generator PanCEK KPK (Ver.2 — JAGA.id)", module: "./seed-pancek-kpk", fn: "seedPancekKpk" },
          { name: "Odoo ERP BUJK — Implementasi & Operasional Konstruksi Indonesia", module: "./seed-odoo-bujk", fn: "seedOdooBujk" },
          { name: "Odoo Migrasi Data Legacy → BUJK — Cutover & Go-Live Konstruksi", module: "./seed-odoo-migrasi", fn: "seedOdooMigrasi" },
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
            const mod = seedModuleRegistry[seed.module];
            if (!mod) throw new Error(`Module ${seed.module} not registered in seedModuleRegistry`);
            await mod[seed.fn]("49465846");
          } catch (err) {
            log(`Failed to seed ${seed.name} ecosystem: ` + (err as Error).message);
          }
        }

        try {
          const { fixOrphanedOrchestrators } = M_fixOrchestrators;
          await fixOrphanedOrchestrators();
        } catch (err) {
          log("Failed to fix orphaned orchestrators: " + (err as Error).message);
        }
      }

      // ── DEDUP: catch-up Apr 2026 dihapus karena DUPLIKAT seedTasks utama ──
      // Akar masalah lama: blok catch-up unconditional menjalankan seed yang sama
      // dua kali per restart → kadang menghapus BigIdea yang baru saja dibuat.
      // Sejak iter 9, semua seed Apr 2026 sudah di seedTasks (loop di atas) dan
      // memiliki idempotency (skip jika sudah grounded). Catch-up unconditional
      // dihapus. Hanya yang BENAR-BENAR belum ada di seedTasks yang ditahan.

      // Catch-up: Pusat FAQ Peserta (TIDAK ada di seedTasks — TAHAN)
      try {
        const { seedPusatFaqPeserta } = M_pusatFaqPeserta;
        await seedPusatFaqPeserta("49465846");
      } catch (err) {
        log("Catch-up Pusat FAQ seed error: " + (err as Error).message);
      }

      // Catch-up: Kompetensi Manajerial BUJK (added Apr 2026)
      try {
        const { seedKompetensiManajerialBujk } = M_kompetensiManajerialBujk;
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
        const { patchKompetensiManajerialBujk } = M_kompetensiManajerialPatch;
        await patchKompetensiManajerialBujk("49465846");
      } catch (err) {
        log("Patch Kompetensi Manajerial error: " + (err as Error).message);
      }

      // Catch-up: IMS & SMK3 Terintegrasi (added Apr 2026)
      try {
        const { seedImsSmk3Terintegrasi } = M_imsSmk3Terintegrasi;
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
        const { seedPersonelManajerialBujk } = M_personelManajerialBujk;
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
        const { seedTenderKonstruksiPbjp } = M_tenderKonstruksiPbjp;
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
        const { seedPascaTenderManajemenKontrak } = M_pascaTenderManajemenKontrak;
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
        const { seedPelaksanaanProyekLapangan } = M_pelaksanaanProyekLapangan;
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
        const { seedLegalitasJasaKonstruksi } = M_legalitasJasaKonstruksi;
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
        const { seedRegulasiJasaKonstruksi } = M_regulasiJasaKonstruksi;
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
        const { seedSbuCoach } = M_sbuCoach;
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
        const { seedSbuMaster } = M_sbuMaster;
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
        const { seedSbuTerintegrasi } = M_sbuTerintegrasi;
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
        const { seedSkkManajemenPelaksanaan } = M_skkManajemenPelaksanaan;
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
        const { seedSkkMekanikal } = M_skkMekanikal;
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
        const { seedSkkSipil } = M_skkSipil;
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
        const { seedSkkElektrikal } = M_skkElektrikal;
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
        const { seedSkkArsitektur } = M_skkArsitektur;
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
        const { seedSkkTataLingkungan } = M_skkTataLingkungan;
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
        const { seedSkkK3Konstruksi } = M_skkK3Konstruksi;
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
        const { seedSkkManajemenProyek } = M_skkManajemenProyek;
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
        const { seedSkkGeoteknik } = M_skkGeoteknik;
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
        const { seedSkkPengujianQc } = M_skkPengujianQc;
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
        const { seedSkkBangunanGedung } = M_skkBangunanGedung;
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
        const { seedSkkKonstruksiKhusus } = M_skkKonstruksiKhusus;
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
        const { seedSkkPeralatanLogistik } = M_skkPeralatanLogistik;
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
        const { seedSbuPenunjangListrik } = M_sbuPenunjangListrik;
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
        const { seedSktkTenagaListrik } = M_sktkTenagaListrik;
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
        const { seedSbuKompetensiMigasEbtTambang } = M_sbuKompetensiMigasEbtTambang;
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
        const { seedDeveloperRealEstate } = M_developerRealEstate;
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
        const { seedLayananRealEstate } = M_layananRealEstate;
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
      const { runDailyTenderScrape } = M_inaprocScraper;
      await runDailyTenderScrape(storage);
    } catch (err) {
      log(`[Scheduler] Tender scrape error: ${(err as Error).message}`);
    }
  }, TENDER_SCRAPE_INTERVAL);

  log("[Scheduler] Started - broadcasts checked every 2min, tenders scraped every 12h");
}
