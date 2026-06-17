import type { Express } from "express";
import bcrypt from "bcryptjs";
import { randomInt, randomUUID } from "crypto";
import { db } from "../../db";
import { users, emailVerifications } from "@shared/models/auth";
import { eq, and, gt } from "drizzle-orm";
import { authStorage } from "./storage";
import { agents } from "@shared/schema";
import rateLimit from "express-rate-limit";

const isProduction = process.env.NODE_ENV === "production";

// Rate limiters — prevent brute force on auth endpoints
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5,                    // maks 5 percobaan registrasi per IP per 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." },
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 menit
  max: 10,                   // maks 10 percobaan verifikasi OTP per IP per 10 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10,                   // maks 10 percobaan login per IP per 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit." },
});

async function seedSampleAgentForEmailUser(userId: string, firstName: string | null | undefined) {
  try {
    const existing = await db.select().from(agents).where(eq(agents.userId, userId)).limit(1);
    if (existing.length > 0) return;
    const accessToken = `gus_sample_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
    const name = firstName || "Saya";
    await db.insert(agents).values({
      name: "Contoh: CS Toko Online",
      description: `Agent contoh Customer Service untuk toko online. Dibuat otomatis sebagai referensi cara mengisi field sistem prompt, greeting, dan conversation starters. Modifikasi sesuai bisnis ${name}.`,
      avatar: "🛍️",
      tagline: "Contoh agent siap pakai — tinggal modifikasi!",
      systemPrompt: `# CONTOH AGENT — Customer Service Toko Online\n> ⚠️ Ini adalah agent CONTOH. Modifikasi sesuai bisnis kamu.\n\n## IDENTITAS\nNama: Asisten CS [Nama Toko Kamu]\nPeran: Customer service untuk [Nama Toko Kamu]\nBahasa: Indonesia\n\n## KEPRIBADIAN\n- Ramah, sabar, dan solutif\n- Gunakan sapaan "Kak"\n\n## DOMAIN\n1. Status pesanan & pengiriman\n2. Return & refund\n3. Informasi produk\n4. Pembayaran & promo`,
      greetingMessage: `Halo Kak! 👋 Selamat datang di CS [Nama Toko Kamu].\n\nSaya siap bantu pertanyaan seputar pesanan, produk, pengiriman, dan promo.\n\nAda yang bisa saya bantu hari ini? 😊`,
      conversationStarters: ["Gimana cara cek status pesanan saya?", "Produk ini masih ada stoknya?", "Promo apa yang aktif?", "Saya mau return barang", "Berapa lama pengirimannya?"],
      language: "id", category: "Customer Service", subcategory: "E-Commerce",
      aiModel: "gpt-4o-mini", temperature: 0.7, maxTokens: 1024,
      accessToken, isPublic: false, isActive: true,
      widgetColor: "#6366f1", widgetPosition: "bottom-right", widgetSize: "medium",
      widgetBorderRadius: "rounded", widgetShowBranding: true,
      communicationStyle: "friendly", toneOfVoice: "professional",
      responseFormat: "conversational", offTopicHandling: "politely_redirect",
      attentiveListening: true, contextRetention: 10, emotionalIntelligence: true,
      multiStepReasoning: true, selfCorrection: true, agenticMode: false,
      isOrchestrator: false, orchestratorRole: "standalone", userId,
    } as any);
    console.log(`[seed] Sample agent seeded for email user ${userId}`);
  } catch (err) {
    console.warn(`[seed] Failed to seed sample agent for email user ${userId}:`, err);
  }
}

function generateOTP(): string {
  return String(randomInt(100000, 999999));
}

// Returns true if email was sent, false if not configured
async function sendVerificationEmail(email: string, code: string, firstName: string): Promise<boolean> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.log(`[EmailAuth] Email not configured — OTP for ${email}: ${code}`);
    return false;
  }
  try {
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#f9f9f9;border-radius:12px">
        <h2 style="color:#6366f1;margin-bottom:8px">Verifikasi Email Anda</h2>
        <p>Halo <b>${firstName}</b>! Gunakan kode berikut untuk menyelesaikan registrasi:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#111;text-align:center;padding:24px;background:#fff;border-radius:8px;border:1px solid #e5e7eb;margin:24px 0">
          ${code}
        </div>
        <p style="color:#666;font-size:14px">Kode berlaku selama <b>10 menit</b>. Jangan bagikan kode ini kepada siapapun.</p>
        <p style="color:#999;font-size:12px">Jika kamu tidak mendaftar di Gustafta, abaikan email ini.</p>
      </div>
    `;
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Gustafta", email: "af0ae9001@smtp-brevo.com" },
        to: [{ email, name: firstName }],
        subject: "Kode Verifikasi Gustafta",
        htmlContent: html,
      }),
    });
    if (!resp.ok) {
      const errBody = await resp.text();
      console.error("[EmailAuth] Brevo API error:", resp.status, errBody);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[EmailAuth] Failed to send email:", err);
    console.log(`[EmailAuth] OTP fallback for ${email}: ${code}`);
    return false;
  }
}

export function registerEmailAuthRoutes(app: Express): void {
  // ── REGISTER: Step 1 — send OTP ─────────────────────────────────────────────
  app.post("/api/auth/register", registerLimiter, async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password || !firstName) {
        return res.status(400).json({ error: "Email, password, dan nama wajib diisi." });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: "Password minimal 8 karakter." });
      }

      // Check if email already registered
      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing.length > 0 && existing[0].emailVerified && existing[0].passwordHash) {
        return res.status(409).json({ error: "Email ini sudah terdaftar. Silakan login." });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Upsert user as unverified
      await db
        .insert(users)
        .values({
          id: randomUUID(),
          email,
          firstName,
          lastName: lastName || "",
          passwordHash,
          emailVerified: false,
          authProvider: "email",
          role: "user",
          isActive: true,
        })
        .onConflictDoUpdate({
          target: users.email,
          set: { firstName, lastName: lastName || "", passwordHash, authProvider: "email", updatedAt: new Date() },
        });

      // Invalidate old OTPs
      await db.update(emailVerifications)
        .set({ used: true })
        .where(eq(emailVerifications.email, email));

      // Create new OTP
      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      await db.insert(emailVerifications).values({ id: randomUUID(), email, code, expiresAt });

      const emailSent = await sendVerificationEmail(email, code, firstName);

      if (!emailSent && isProduction) {
        return res.status(503).json({
          error: "Layanan email belum dikonfigurasi. Hubungi administrator.",
        });
      }

      res.json({
        success: true,
        message: emailSent
          ? "Kode OTP telah dikirim ke email Anda."
          : "Kode OTP berhasil dibuat. Email belum dikonfigurasi — lihat kode di bawah.",
        otpFallback: emailSent ? undefined : code,
      });
    } catch (err) {
      console.error("[EmailAuth] Register error:", err);
      res.status(500).json({ error: "Terjadi kesalahan. Silakan coba lagi." });
    }
  });

  // ── REGISTER: Step 2 — verify OTP ───────────────────────────────────────────
  app.post("/api/auth/verify-email", otpLimiter, async (req: any, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: "Email dan kode OTP wajib diisi." });
      }

      const verif = await db
        .select()
        .from(emailVerifications)
        .where(
          and(
            eq(emailVerifications.email, email),
            eq(emailVerifications.code, String(code).trim()),
            eq(emailVerifications.used, false),
            gt(emailVerifications.expiresAt, new Date())
          )
        )
        .limit(1);

      if (verif.length === 0) {
        return res.status(400).json({ error: "Kode OTP salah atau sudah kadaluarsa." });
      }

      // Mark OTP used + verify user
      await db.update(emailVerifications).set({ used: true }).where(eq(emailVerifications.id, verif[0].id));
      await db.update(users).set({ emailVerified: true, updatedAt: new Date() }).where(eq(users.email, email));

      // Fetch and log in the user
      const [userRow] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!userRow) return res.status(500).json({ error: "User tidak ditemukan." });

      // Seed sample agent for new user — non-blocking
      seedSampleAgentForEmailUser(userRow.id, userRow.firstName).catch(() => {});

      // Auto-create pending trial request so super-admin can approve from admin panel
      try {
        const { trialRequests } = await import("@shared/schema");
        const existing = await db.select().from(trialRequests).where(eq(trialRequests.email, email)).limit(1);
        if (existing.length === 0) {
          await db.insert(trialRequests).values({
            name: `${userRow.firstName || ""} ${userRow.lastName || ""}`.trim() || email,
            phone: "-",
            email,
            company: null,
            useCase: "Auto-created from email registration",
            status: "pending",
          });
        }
      } catch (e) {
        console.error("[EmailAuth] Failed to auto-create trial request:", e);
      }

      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err: any) => {
          if (err) reject(err); else resolve();
        });
      });

      // Store user in session similar to Replit Auth format
      (req.session as any).emailUser = {
        id: userRow.id,
        email: userRow.email,
        firstName: userRow.firstName,
        lastName: userRow.lastName,
        role: userRow.role,
      };

      res.json({ success: true, message: "Email berhasil diverifikasi. Selamat datang!" });
    } catch (err) {
      console.error("[EmailAuth] Verify error:", err);
      res.status(500).json({ error: "Terjadi kesalahan. Silakan coba lagi." });
    }
  });

  // ── RESEND OTP ───────────────────────────────────────────────────────────────
  app.post("/api/auth/resend-otp", otpLimiter, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email wajib diisi." });

      const [userRow] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!userRow) return res.status(404).json({ error: "Email tidak terdaftar." });

      await db.update(emailVerifications).set({ used: true }).where(eq(emailVerifications.email, email));

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await db.insert(emailVerifications).values({ id: randomUUID(), email, code, expiresAt });

      const emailSent = await sendVerificationEmail(email, code, userRow.firstName || "");

      if (!emailSent && isProduction) {
        return res.status(503).json({
          error: "Layanan email belum dikonfigurasi. Hubungi administrator.",
        });
      }

      res.json({
        success: true,
        message: emailSent ? "Kode OTP baru telah dikirim." : "Kode OTP baru dibuat.",
        otpFallback: emailSent ? undefined : code,
      });
    } catch (err) {
      console.error("[EmailAuth] Resend error:", err);
      res.status(500).json({ error: "Terjadi kesalahan. Silakan coba lagi." });
    }
  });

  // ── LOGIN with email + password ──────────────────────────────────────────────
  app.post("/api/auth/login-email", loginLimiter, async (req: any, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email dan password wajib diisi." });
      }

      const [userRow] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!userRow || !userRow.passwordHash) {
        return res.status(401).json({ error: "Email atau password salah." });
      }

      if (!userRow.emailVerified) {
        return res.status(403).json({ error: "Email belum diverifikasi.", needsVerification: true, email });
      }

      if (userRow.isActive === false) {
        return res.status(403).json({ error: "Akun Anda telah dinonaktifkan. Hubungi admin Gustafta." });
      }

      const valid = await bcrypt.compare(password, userRow.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Email atau password salah." });
      }

      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err: any) => {
          if (err) reject(err); else resolve();
        });
      });

      (req.session as any).emailUser = {
        id: userRow.id,
        email: userRow.email,
        firstName: userRow.firstName,
        lastName: userRow.lastName,
        role: userRow.role,
      };

      res.json({
        success: true,
        user: {
          id: userRow.id,
          email: userRow.email,
          firstName: userRow.firstName,
          lastName: userRow.lastName,
          role: userRow.role,
        },
      });
    } catch (err) {
      console.error("[EmailAuth] Login error:", err);
      res.status(500).json({ error: "Terjadi kesalahan. Silakan coba lagi." });
    }
  });

  // ── LOGOUT email session ─────────────────────────────────────────────────────
  app.post("/api/auth/logout-email", (req: any, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });
}
