import type { Express } from "express";
import { db } from "./db";
import { bujkData, materialPrices, insertBujkDataSchema, insertMaterialPriceSchema } from "@shared/schema";
import { eq, and, desc, ilike, or } from "drizzle-orm";
import { isAuthenticated } from "./replit_integrations/auth";

// ─────────────────────────────────────────────────────────────────────────────
// buildDataMasterContext — called by the OpenClaw orchestrator to inject real
// data (BUJK binaan + harga material) into the enrichedUserContent block
// before sub-agents are dispatched.
// ─────────────────────────────────────────────────────────────────────────────
const COST_KEYWORDS = /\b(biaya|harga|rab|estimasi|anggaran|cost|budget|pagu|satuan|material|beton|baja|tanah|kayu)\b/i;
const BUJK_KEYWORDS = /\b(bujk|perusahaan|klien|nib|sbu|kualifikasi|kontraktor|konsultan|subklas)\b/i;

export async function buildDataMasterContext(userId: string, userMessage: string): Promise<string> {
  if (!userId) return "";
  try {
    const parts: string[] = [];

    // ── 1. BUJK Data (always include if user has any) ──────────────────────
    const hasBujkKeyword = BUJK_KEYWORDS.test(userMessage);
    const bujkRows = await db
      .select()
      .from(bujkData)
      .where(eq(bujkData.userId, userId))
      .orderBy(desc(bujkData.updatedAt))
      .limit(hasBujkKeyword ? 10 : 5);

    if (bujkRows.length > 0) {
      const bujkLines = bujkRows.map(r =>
        `• ${r.namaPerusahaan}${r.nib ? ` | NIB: ${r.nib}` : ""}${r.kualifikasi ? ` | Kualifikasi: ${r.kualifikasi}` : ""}${r.subklasifikasi ? ` | Subklas: ${r.subklasifikasi}` : ""}${r.nomorSbu ? ` | SBU: ${r.nomorSbu}` : ""} | Status SBU: ${r.statusSbu || "—"}${r.masaBerlakuSbu ? ` s/d ${r.masaBerlakuSbu}` : ""}${r.picNama ? ` | PIC: ${r.picNama}${r.picPhone ? ` (${r.picPhone})` : ""}` : ""}${r.catatan ? `\n  Catatan: ${r.catatan}` : ""}`
      ).join("\n");
      parts.push(`📋 DATA BUJK BINAAN (${bujkRows.length} perusahaan):\n${bujkLines}`);
    }

    // ── 2. Harga Material (only if message has cost/price keywords) ─────────
    if (COST_KEYWORDS.test(userMessage)) {
      const priceRows = await db
        .select()
        .from(materialPrices)
        .where(eq(materialPrices.userId, userId))
        .orderBy(desc(materialPrices.updatedAt))
        .limit(20);

      if (priceRows.length > 0) {
        const grouped: Record<string, typeof priceRows> = {};
        for (const r of priceRows) {
          if (!grouped[r.kategori]) grouped[r.kategori] = [];
          grouped[r.kategori].push(r);
        }
        const priceLines = Object.entries(grouped).map(([kat, items]) => {
          const itemLines = items.map(r =>
            `  - ${r.namaItem}${r.satuan ? ` (${r.satuan})` : ""}: ${r.hargaAcuan ? `Rp ${r.hargaAcuan.toLocaleString("id-ID")}` : ""}${r.hargaMin && r.hargaMax ? ` [${r.hargaMin.toLocaleString("id-ID")}–${r.hargaMax.toLocaleString("id-ID")}]` : ""}${r.sumber ? ` | Sumber: ${r.sumber}` : ""}${r.wilayah ? ` | ${r.wilayah}` : ""}${r.tahunAnggaran ? ` | TA ${r.tahunAnggaran}` : ""}`
          ).join("\n");
          return `[${kat}]\n${itemLines}`;
        }).join("\n");
        parts.push(`💰 REFERENSI HARGA MATERIAL INTERNAL:\n${priceLines}`);
      }
    }

    if (parts.length === 0) return "";

    return `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDATA MASTER OPENCLAW — DATA NYATA PENGGUNA\nGunakan data ini sebagai referensi utama. Prioritaskan di atas estimasi umum.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${parts.join("\n\n")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  } catch (err) {
    console.warn("[DataMaster] buildDataMasterContext error:", err);
    return "";
  }
}

export function registerDataMasterRoutes(app: Express) {

  // ─────────────────────────────────────────────────────────────
  // BUJK DATA — CRUD
  // ─────────────────────────────────────────────────────────────

  app.get("/api/data-master/bujk", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      const search = req.query.search as string | undefined;
      let rows;
      if (search) {
        rows = await db.select().from(bujkData)
          .where(and(
            eq(bujkData.userId, userId),
            or(
              ilike(bujkData.namaPerusahaan, `%${search}%`),
              ilike(bujkData.nib, `%${search}%`),
              ilike(bujkData.picNama, `%${search}%`)
            )
          ))
          .orderBy(desc(bujkData.createdAt));
      } else {
        rows = await db.select().from(bujkData)
          .where(eq(bujkData.userId, userId))
          .orderBy(desc(bujkData.createdAt));
      }
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/data-master/bujk", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      const parsed = insertBujkDataSchema.safeParse({ ...req.body, userId });
      if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
      const [row] = await db.insert(bujkData).values(parsed.data).returning();
      res.json(row);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/data-master/bujk/:id", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      const id = parseInt(req.params.id);
      const [row] = await db.update(bujkData)
        .set({ ...req.body, updatedAt: new Date() })
        .where(and(eq(bujkData.id, id), eq(bujkData.userId, userId)))
        .returning();
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/data-master/bujk/:id", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      const id = parseInt(req.params.id);
      await db.delete(bujkData)
        .where(and(eq(bujkData.id, id), eq(bujkData.userId, userId)));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // MATERIAL PRICES — CRUD
  // ─────────────────────────────────────────────────────────────

  app.get("/api/data-master/harga", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      const search = req.query.search as string | undefined;
      const kategori = req.query.kategori as string | undefined;
      let query = db.select().from(materialPrices)
        .where(eq(materialPrices.userId, userId))
        .$dynamic();

      if (search) {
        query = db.select().from(materialPrices)
          .where(and(
            eq(materialPrices.userId, userId),
            or(
              ilike(materialPrices.namaItem, `%${search}%`),
              ilike(materialPrices.kategori, `%${search}%`)
            )
          ))
          .$dynamic();
      } else if (kategori) {
        query = db.select().from(materialPrices)
          .where(and(eq(materialPrices.userId, userId), eq(materialPrices.kategori, kategori)))
          .$dynamic();
      }

      const rows = await query.orderBy(desc(materialPrices.createdAt));
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/data-master/harga", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      const parsed = insertMaterialPriceSchema.safeParse({ ...req.body, userId });
      if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
      const [row] = await db.insert(materialPrices).values(parsed.data).returning();
      res.json(row);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/data-master/harga/:id", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      const id = parseInt(req.params.id);
      const [row] = await db.update(materialPrices)
        .set({ ...req.body, updatedAt: new Date() })
        .where(and(eq(materialPrices.id, id), eq(materialPrices.userId, userId)))
        .returning();
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/data-master/harga/:id", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      const id = parseInt(req.params.id);
      await db.delete(materialPrices)
        .where(and(eq(materialPrices.id, id), eq(materialPrices.userId, userId)));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // CEK OSS-RBA — real-time NIB/SBU lookup
  // ─────────────────────────────────────────────────────────────

  app.get("/api/data-master/cek-oss", isAuthenticated, async (req: any, res: any) => {
    const nib = (req.query.nib as string || "").trim();
    if (!nib || nib.length < 5) {
      return res.status(400).json({ error: "NIB tidak valid. Masukkan minimal 5 karakter." });
    }
    try {
      // Try OSS public API
      const ossUrl = `https://oss.go.id/api/nib/${encodeURIComponent(nib)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let ossData: any = null;
      let ossOk = false;
      try {
        const ossResp = await fetch(ossUrl, {
          signal: controller.signal,
          headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" }
        });
        clearTimeout(timeout);
        if (ossResp.ok) {
          ossData = await ossResp.json();
          ossOk = true;
        }
      } catch (_) {
        clearTimeout(timeout);
      }

      if (ossOk && ossData) {
        return res.json({ source: "oss", data: ossData, nib });
      }

      // Try SIKI LPJK
      const lpjkUrl = `https://siki.lpjk.pu.go.id/api/bujk?nib=${encodeURIComponent(nib)}`;
      const ctrl2 = new AbortController();
      const t2 = setTimeout(() => ctrl2.abort(), 8000);
      let lpjkData: any = null;
      try {
        const lpjkResp = await fetch(lpjkUrl, {
          signal: ctrl2.signal,
          headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" }
        });
        clearTimeout(t2);
        if (lpjkResp.ok) {
          lpjkData = await lpjkResp.json();
        }
      } catch (_) {
        clearTimeout(t2);
      }

      if (lpjkData) {
        return res.json({ source: "lpjk", data: lpjkData, nib });
      }

      // Fallback: manual scrape OSS web
      const webUrl = `https://oss.go.id/portal/api/nib/${encodeURIComponent(nib)}`;
      const ctrl3 = new AbortController();
      const t3 = setTimeout(() => ctrl3.abort(), 8000);
      try {
        const webResp = await fetch(webUrl, {
          signal: ctrl3.signal,
          headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" }
        });
        clearTimeout(t3);
        if (webResp.ok) {
          const webData = await webResp.json();
          return res.json({ source: "oss_portal", data: webData, nib });
        }
      } catch (_) {
        clearTimeout(t3);
      }

      return res.json({
        source: "unavailable",
        nib,
        message: "Sistem OSS-RBA sedang tidak bisa diakses secara otomatis. Silakan cek manual di https://oss.go.id atau https://siki.lpjk.pu.go.id dengan NIB: " + nib,
        manualLinks: [
          { label: "OSS-RBA — Cek NIB", url: `https://oss.go.id/portal/api/v1/nib/verifikasi?nib=${nib}` },
          { label: "SIKI LPJK — Cari BUJK", url: `https://siki.lpjk.pu.go.id` },
        ]
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
