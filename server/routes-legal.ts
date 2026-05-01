import type { Express } from "express";
import OpenAI from "openai";
import { db } from "./db";
import { legalChatSessions, legalChatMessages } from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { LEGAL_AGENTS, LEX_ORCHESTRATOR_PROMPT, LEX_ORCHESTRATOR_GREETING, selectAgent, buildOrchestrationPrompt } from "./lib/legal-agents";

const isProduction = process.env.NODE_ENV === "production";
const rawBaseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
const isLocalhostProxy = rawBaseURL?.includes("localhost");
let openaiApiKey: string | undefined;
let openaiBaseURL: string | undefined;
if (!isProduction && isLocalhostProxy && process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
  openaiApiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  openaiBaseURL = rawBaseURL;
} else {
  openaiApiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  openaiBaseURL = undefined;
}

const openai = new OpenAI({
  apiKey: openaiApiKey || "missing-key",
  ...(openaiBaseURL ? { baseURL: openaiBaseURL } : {}),
});

const DISCLAIMER = "\n\n---\n⚠️ *Informasi ini bersifat edukatif dan bukan pendapat hukum yang mengikat. Untuk kasus hukum konkret, konsultasikan dengan advokat atau konsultan hukum berpengalaman.*";

function detectTier(message: string): string {
  const T3_SIGNALS = /\b(eksepsi|ratio decidendi|kasasi|pk |peninjauan kembali|legal opinion|due diligence|dakwaan|pledoi|requisitor|in dubio pro reo|lex specialis|pasal \d+|putusan no|yurisprudensi|actio pauliana|concursus|homologasi|boedel|debt to equity)\b/i;
  const T2_SIGNALS = /\b(perusahaan|direksi|karyawan|kontrak komersial|risiko bisnis|due diligence|perjanjian kerja|mou|nda|sha|compliance|gcg|in-house|merger|akuisisi)\b/i;
  if (T3_SIGNALS.test(message)) return "T3 (Advokat/Profesional) — gunakan bahasa hukum teknis penuh, sitasi pasal lengkap, format IRAC+.";
  if (T2_SIGNALS.test(message)) return "T2 (Korporat) — bahasa bisnis-legal, focus pada risiko dan opsi, risk matrix jika relevan.";
  return "T1 (Awam) — gunakan bahasa sederhana, hindari jargon berlebihan, jelaskan istilah teknis.";
}

const GUEST_MESSAGE_LIMIT = 5;
const guestLegalTracker = new Map<string, { count: number; lastReset: string }>();

function getGuestKey(req: any): string {
  const ip = req.headers["x-forwarded-for"] || req.ip || "unknown";
  const ua = (req.headers["user-agent"] || "").substring(0, 50);
  const raw = `legal_${ip}_${ua}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return `guest_legal_${Math.abs(hash).toString(36)}`;
}

function getGuestCount(key: string): number {
  const today = new Date().toISOString().split("T")[0];
  const entry = guestLegalTracker.get(key);
  if (!entry || entry.lastReset !== today) return 0;
  return entry.count;
}

function incrementGuestCount(key: string): number {
  const today = new Date().toISOString().split("T")[0];
  const entry = guestLegalTracker.get(key);
  if (!entry || entry.lastReset !== today) {
    guestLegalTracker.set(key, { count: 1, lastReset: today });
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

setInterval(() => {
  const today = new Date().toISOString().split("T")[0];
  for (const [key, val] of Array.from(guestLegalTracker.entries())) {
    if (val.lastReset !== today) guestLegalTracker.delete(key);
  }
}, 60 * 60 * 1000);

function getUserId(req: any): string | null {
  return req.user?.claims?.sub || req.user?.id || null;
}

function isGuest(req: any): boolean {
  return !getUserId(req);
}

export function registerLegalRoutes(app: Express) {

  app.post("/api/legal/chat", async (req: any, res: any) => {
    try {
      const { sessionId, message } = req.body;
      let agentType: string = req.body.agentType || "auto";
      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ error: "Message is required" });
      }
      if (message.length > 4000) {
        return res.status(400).json({ error: "Message too long (max 4000 characters)" });
      }

      const userId = getUserId(req);
      const guest = !userId;

      if (guest) {
        const guestKey = getGuestKey(req);
        const count = getGuestCount(guestKey);
        if (count >= GUEST_MESSAGE_LIMIT) {
          return res.status(429).json({
            error: "Batas pesan tamu tercapai",
            limitReached: true,
            message: `Mode tamu dibatasi ${GUEST_MESSAGE_LIMIT} pesan per hari. Silakan login untuk akses penuh.`
          });
        }
        incrementGuestCount(guestKey);
      }

      const validAgentIds = ["auto", ...LEGAL_AGENTS.map(a => a.id)];
      if (!validAgentIds.includes(agentType)) {
        agentType = "auto";
      }

      let selectedAgentId: string;
      let systemPrompt: string;

      if (agentType === "auto") {
        const orchestrated = buildOrchestrationPrompt(message);
        selectedAgentId = orchestrated.agentId;
        systemPrompt = orchestrated.systemPrompt;
      } else {
        selectedAgentId = agentType;
        const agentConfig = LEGAL_AGENTS.find(a => a.id === selectedAgentId);
        systemPrompt = agentConfig
          ? agentConfig.systemPrompt
          : LEX_ORCHESTRATOR_PROMPT;
      }

      const tierHint = detectTier(message);
      systemPrompt = `${systemPrompt}\n\nUSER TIER (detected): ${tierHint}. Sesuaikan kedalaman jawaban.`;

      let dbSessionId: number | null = null;
      let history: { role: "user" | "assistant"; content: string }[] = [];

      if (userId) {
        if (sessionId && !isNaN(Number(sessionId))) {
          const parsedSessionId = Number(sessionId);
          try {
            const [session] = await db
              .select()
              .from(legalChatSessions)
              .where(and(
                eq(legalChatSessions.id, parsedSessionId),
                eq(legalChatSessions.userId, userId)
              ));

            if (session) {
              dbSessionId = session.id;
              const msgs = await db
                .select()
                .from(legalChatMessages)
                .where(eq(legalChatMessages.sessionId, dbSessionId))
                .orderBy(legalChatMessages.createdAt)
                .limit(24);
              history = msgs.map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
            }
          } catch (err) {
            console.error("[Legal Chat] Failed to load session history:", err);
          }
        }

        if (!dbSessionId) {
          try {
            const title = message.trim().slice(0, 60) + (message.trim().length > 60 ? "..." : "");
            const [newSession] = await db.insert(legalChatSessions).values({
              userId,
              agentType: selectedAgentId,
              title,
              messageCount: 0,
            }).returning();
            dbSessionId = newSession.id;
          } catch (err) {
            console.error("[Legal Chat] Failed to create session:", err);
          }
        }
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Agent-Selected", selectedAgentId);

      const messages: { role: "user" | "assistant" | "system"; content: string }[] = [
        { role: "system", content: systemPrompt },
        ...history.slice(-16),
        { role: "user", content: message.trim() },
      ];

      let fullResponse = "";
      try {
        const stream = await openai.chat.completions.create({
          model: "gpt-4o",
          messages,
          stream: true,
          max_tokens: 3500,
          temperature: 0.2,
        });

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            fullResponse += text;
            res.write(`data: ${JSON.stringify({ text, agentId: selectedAgentId })}\n\n`);
          }
        }

        if (!fullResponse.includes("⚠️")) {
          fullResponse += DISCLAIMER;
          res.write(`data: ${JSON.stringify({ text: DISCLAIMER, agentId: selectedAgentId })}\n\n`);
        }
      } catch (err: any) {
        const errMsg = `Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.`;
        fullResponse = errMsg;
        res.write(`data: ${JSON.stringify({ text: errMsg, agentId: selectedAgentId })}\n\n`);
      }

      if (userId && dbSessionId) {
        try {
          await db.insert(legalChatMessages).values([
            {
              sessionId: dbSessionId,
              userId,
              role: "user",
              content: message.trim(),
              agentType: selectedAgentId,
            },
            {
              sessionId: dbSessionId,
              userId,
              role: "assistant",
              content: fullResponse,
              agentType: selectedAgentId,
              agentSelected: selectedAgentId,
            },
          ]);
          await db
            .update(legalChatSessions)
            .set({ messageCount: sql`${legalChatSessions.messageCount} + 2`, updatedAt: new Date() })
            .where(and(
              eq(legalChatSessions.id, dbSessionId),
              eq(legalChatSessions.userId, userId)
            ));
        } catch (err) {
          console.error("[Legal Chat] Failed to persist messages:", err);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true, sessionId: dbSessionId, agentId: selectedAgentId })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("[Legal Chat] Unhandled error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.write(`data: ${JSON.stringify({ error: "Server error", done: true })}\n\n`);
        res.end();
      }
    }
  });

  app.get("/api/legal/sessions", async (req: any, res: any) => {
    try {
      const userId = getUserId(req);
      if (!userId) return res.json([]);
      const sessions = await db
        .select()
        .from(legalChatSessions)
        .where(eq(legalChatSessions.userId, userId))
        .orderBy(desc(legalChatSessions.updatedAt))
        .limit(50);
      res.json(sessions);
    } catch (error) {
      console.error("[Legal Sessions] Error:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get("/api/legal/sessions/:id", async (req: any, res: any) => {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const sessionId = Number(req.params.id);
      if (isNaN(sessionId)) return res.status(400).json({ error: "Invalid session ID" });

      const [session] = await db
        .select()
        .from(legalChatSessions)
        .where(and(eq(legalChatSessions.id, sessionId), eq(legalChatSessions.userId, userId)));

      if (!session) return res.status(404).json({ error: "Session not found" });

      const messages = await db
        .select()
        .from(legalChatMessages)
        .where(and(
          eq(legalChatMessages.sessionId, sessionId),
          eq(legalChatMessages.userId, userId)
        ))
        .orderBy(legalChatMessages.createdAt);

      res.json({ ...session, messages });
    } catch (error) {
      console.error("[Legal Session] Error:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  app.delete("/api/legal/sessions/:id", async (req: any, res: any) => {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const sessionId = Number(req.params.id);
      if (isNaN(sessionId)) return res.status(400).json({ error: "Invalid session ID" });

      const [session] = await db
        .select({ id: legalChatSessions.id })
        .from(legalChatSessions)
        .where(and(eq(legalChatSessions.id, sessionId), eq(legalChatSessions.userId, userId)));

      if (!session) return res.status(404).json({ error: "Session not found" });

      await db.delete(legalChatMessages).where(
        and(
          eq(legalChatMessages.sessionId, sessionId),
          eq(legalChatMessages.userId, userId)
        )
      );
      await db
        .delete(legalChatSessions)
        .where(and(eq(legalChatSessions.id, sessionId), eq(legalChatSessions.userId, userId)));

      res.json({ success: true });
    } catch (error) {
      console.error("[Legal Session Delete] Error:", error);
      res.status(500).json({ error: "Failed to delete session" });
    }
  });

  app.get("/api/legal/agents", (_req: any, res: any) => {
    res.json(LEGAL_AGENTS.map(a => ({
      id: a.id,
      name: a.name,
      personaName: a.personaName,
      emoji: a.emoji,
      domain: a.domain,
      tagline: a.tagline,
      greetingMessage: a.greetingMessage ?? null,
      starters: a.starters,
    })));
  });

  app.get("/api/legal/guest-status", (req: any, res: any) => {
    if (!isGuest(req)) {
      return res.json({ isGuest: false, messagesUsed: 0, limit: GUEST_MESSAGE_LIMIT });
    }
    const guestKey = getGuestKey(req);
    const count = getGuestCount(guestKey);
    res.json({ isGuest: true, messagesUsed: count, limit: GUEST_MESSAGE_LIMIT, limitReached: count >= GUEST_MESSAGE_LIMIT });
  });
}
