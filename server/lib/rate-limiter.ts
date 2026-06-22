import { rateLimit, ipKeyGenerator, type Options } from "express-rate-limit";
import type { Request, Response } from "express";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function getUserId(req: Request): string | null {
  const r = req as any;
  return r.user?.claims?.sub || r.user?.id || r.session?.emailUser?.id || null;
}

function isAuthenticatedUser(req: Request): boolean {
  const r = req as any;
  if (r.isAuthenticated && r.isAuthenticated()) return true;
  if (r.session?.emailUser?.id) return true;
  return false;
}

function isAdminUser(req: Request): boolean {
  const userId = getUserId(req);
  if (!userId) return false;
  return ADMIN_USER_IDS.includes(String(userId));
}

const retryAfterHandler = (
  _req: Request,
  res: Response,
  _next: any,
  options: Options
) => {
  const windowSec = Math.ceil((options.windowMs as number) / 1000);
  res.setHeader("Retry-After", String(windowSec));
  res.status(429).json({
    error: "Too Many Requests",
    message: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
    retryAfter: windowSec,
  });
};

export const chatIpRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: (req: Request) => {
    if (isAdminUser(req)) return 0;
    if (isAuthenticatedUser(req)) return 120;
    return 30;
  },
  keyGenerator: (req: Request) => ipKeyGenerator(req),
  skip: (req: Request) => isAdminUser(req),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: retryAfterHandler as any,
  message: "Terlalu banyak permintaan dari IP ini.",
});

const agentIdStore = new Map<string, { count: number; resetAt: number }>();
const AGENT_WINDOW_MS = 60 * 60 * 1000;
const AGENT_MAX_UNAUTHENTICATED = 100;

export function chatAgentIdRateLimiter(
  req: Request,
  res: Response,
  next: () => void
) {
  if (isAuthenticatedUser(req)) return next();

  const agentId = req.body?.agentId;
  if (!agentId) return next();

  const now = Date.now();
  const key = String(agentId);
  const entry = agentIdStore.get(key);

  if (!entry || now >= entry.resetAt) {
    agentIdStore.set(key, { count: 1, resetAt: now + AGENT_WINDOW_MS });
    return next();
  }

  entry.count += 1;
  if (entry.count > AGENT_MAX_UNAUTHENTICATED) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    res.setHeader("Retry-After", String(retryAfterSec));
    return res.status(429).json({
      error: "Too Many Requests",
      message:
        "Agen ini telah mencapai batas permintaan per jam. Silakan coba lagi nanti.",
      retryAfter: retryAfterSec,
    });
  }

  return next();
}

setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of agentIdStore) {
      if (now >= entry.resetAt) agentIdStore.delete(key);
    }
  },
  10 * 60 * 1000
);
