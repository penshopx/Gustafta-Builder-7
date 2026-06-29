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

type SendEmailResult =
  | { sent: true }
  | { sent: false; reason: "not_configured" | "api_error" | "network_error"; detail?: string };

async function sendVerificationEmail(email: string, code: string, firstName: string): Promise<SendEmailResult> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.log(`[EmailAuth] BREVO_API_KEY not set — OTP for ${email}: ${code}`);
    return { sent: false, reason: "not_configured" };
  }
  // Use custom sender domain (must be verified in Brevo dashboard).
  // Set BREVO_SENDER_EMAIL env var to override (e.g. noreply@gustafta.com).
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@gustafta.com";

  try {
    const html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:40px;font-family:Arial,sans-serif;color:#111">
        <tr><td>
          <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#6366f1">Gustafta</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
          <p style="font-size:16px;margin:0 0 8px">Halo <b>${firstName}</b>,</p>
          <p style="font-size:15px;color:#374151;margin:0 0 24px">Gunakan kode berikut untuk menyelesaikan pendaftaran akun Gustafta kamu:</p>
          <div style="font-size:40px;font-weight:700;letter-spacing:10px;color:#111;text-align:center;padding:24px 16px;background:#f9fafb;border-radius:8px;border:2px solid #e5e7eb;margin:0 0 24px">
            ${code}
          </div>
          <p style="font-size:14px;color:#6b7280;margin:0 0 8px">Kode ini berlaku selama <b>10 menit</b>.</p>
          <p style="font-size:14px;color:#6b7280;margin:0 0 24px">Jangan bagikan kode ini kepada siapapun, termasuk tim Gustafta.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 16px">
          <p style="font-size:12px;color:#9ca3af;margin:0">Jika kamu tidak mendaftar di Gustafta, abaikan email ini — tidak ada tindakan yang diperlukan.</p>
          <p style="font-size:12px;color:#9ca3af;margin:8px 0 0">© 2025 Gustafta. Seluruh hak dilindungi.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const textContent = `Halo ${firstName},

Kode verifikasi Gustafta kamu:

  ${code}

Kode berlaku 10 menit. Jangan bagikan kepada siapapun.

Jika kamu tidak mendaftar di Gustafta, abaikan email ini.

— Tim Gustafta`;

    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Gustafta", email: senderEmail },
        replyTo: { name: "Gustafta Support", email: "support@gustafta.com" },
        to: [{ email, name: firstName }],
        subject: "Kode Verifikasi Akun Gustafta Anda",
        htmlContent: html,
        textContent,
        tags: ["otp", "transactional"],
      }),
    });
    if (!resp.ok) {
      const errBody = await resp.text();
      console.error(`[EmailAuth] Brevo API error sending to ${email}: HTTP ${resp.status} — ${errBody}`);
      return { sent: false, reason: "api_error", detail: `HTTP ${resp.status}: ${errBody.slice(0, 300)}` };
    }
    console.log(`[EmailAuth] OTP sent to ${email} via Brevo (sender: ${senderEmail})`);
    return { sent: true };
  } catch (err: any) {
    const detail = err?.message || String(err);
    console.error(`[EmailAuth] Network/send error for ${email}: ${detail}`);
    return { sent: false, reason: "network_error", detail };
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

      const emailResult = await sendVerificationEmail(email, code, firstName);

      if (!emailResult.sent) {
        if (emailResult.reason === "not_configured") {
          if (isProduction) {
            return res.status(503).json({
              error: "Layanan email belum dikonfigurasi. Hubungi administrator.",
            });
          }
          // Dev/staging: expose OTP fallback
          return res.json({
            success: true,
            message: "Kode OTP berhasil dibuat. Email belum dikonfigurasi — lihat kode di bawah.",
            otpFallback: code,
          });
        }
        // api_error or network_error — email IS configured but send failed
        console.error(`[EmailAuth] Register email send failed (${emailResult.reason}) for ${email}: ${emailResult.detail ?? ""}`);
        return res.status(503).json({
          error: "Email gagal terkirim. Coba lagi dalam beberapa menit, atau hubungi administrator jika masalah berlanjut.",
          errorCode: emailResult.reason,
        });
      }

      res.json({
        success: true,
        message: "Kode OTP telah dikirim ke email Anda.",
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

      await new Promise<void>((resolve, reject) => {
        req.session.save((err: any) => {
          if (err) reject(err); else resolve();
        });
      });

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

      const emailResult = await sendVerificationEmail(email, code, userRow.firstName || "");

      if (!emailResult.sent) {
        if (emailResult.reason === "not_configured") {
          if (isProduction) {
            return res.status(503).json({
              error: "Layanan email belum dikonfigurasi. Hubungi administrator.",
            });
          }
          return res.json({
            success: true,
            message: "Kode OTP baru dibuat. Email belum dikonfigurasi — lihat kode di bawah.",
            otpFallback: code,
          });
        }
        // api_error or network_error
        console.error(`[EmailAuth] Resend email send failed (${emailResult.reason}) for ${email}: ${emailResult.detail ?? ""}`);
        return res.status(503).json({
          error: "Email gagal terkirim. Coba lagi dalam beberapa menit, atau hubungi administrator jika masalah berlanjut.",
          errorCode: emailResult.reason,
        });
      }

      res.json({
        success: true,
        message: "Kode OTP baru telah dikirim ke email Anda.",
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

      await new Promise<void>((resolve, reject) => {
        req.session.save((err: any) => {
          if (err) reject(err); else resolve();
        });
      });

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

  // ── FORGOT PASSWORD: Step 1 — request reset OTP ─────────────────────────────
  app.post("/api/auth/request-reset", otpLimiter, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email wajib diisi." });

      const [userRow] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!userRow || !userRow.passwordHash) {
        // Generic message — don't reveal if email exists
        return res.json({ success: true, message: "Jika email terdaftar, kode reset dikirim ke email Anda." });
      }
      if (!userRow.emailVerified) {
        return res.status(400).json({ error: "Email belum diverifikasi. Selesaikan verifikasi akun terlebih dahulu." });
      }

      // Invalidate old OTPs and create new one
      await db.update(emailVerifications).set({ used: true }).where(eq(emailVerifications.email, email));
      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await db.insert(emailVerifications).values({ id: randomUUID(), email, code, expiresAt });

      const firstName = userRow.firstName || "Pengguna";
      const brevoApiKey = process.env.BREVO_API_KEY;

      if (!brevoApiKey) {
        if (isProduction) {
          return res.status(503).json({ error: "Layanan email belum dikonfigurasi. Hubungi administrator." });
        }
        return res.json({ success: true, message: "Kode reset dibuat (email belum dikonfigurasi).", otpFallback: code });
      }

      const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@gustafta.com";
      const html = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:40px;font-family:Arial,sans-serif;color:#111">
        <tr><td>
          <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#6366f1">Gustafta</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
          <p style="font-size:16px;margin:0 0 8px">Halo <b>${firstName}</b>,</p>
          <p style="font-size:15px;color:#374151;margin:0 0 24px">Gunakan kode berikut untuk reset password akun Gustafta kamu:</p>
          <div style="font-size:40px;font-weight:700;letter-spacing:10px;color:#111;text-align:center;padding:24px 16px;background:#f9fafb;border-radius:8px;border:2px solid #e5e7eb;margin:0 0 24px">
            ${code}
          </div>
          <p style="font-size:14px;color:#6b7280;margin:0 0 8px">Kode ini berlaku selama <b>10 menit</b>.</p>
          <p style="font-size:14px;color:#6b7280;margin:0 0 24px">Jika kamu tidak meminta reset password, abaikan email ini — password kamu tidak akan berubah.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 16px">
          <p style="font-size:12px;color:#9ca3af;margin:0">© 2025 Gustafta. Seluruh hak dilindungi.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

      try {
        const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "accept": "application/json", "api-key": brevoApiKey, "content-type": "application/json" },
          body: JSON.stringify({
            sender: { name: "Gustafta", email: senderEmail },
            to: [{ email, name: firstName }],
            subject: "Kode Reset Password Gustafta",
            htmlContent: html,
            tags: ["reset-password", "transactional"],
          }),
        });
        if (!resp.ok) {
          const errBody = await resp.text();
          console.error(`[EmailAuth] Reset email send failed for ${email}: HTTP ${resp.status} — ${errBody}`);
          return res.status(503).json({ error: "Email gagal terkirim. Coba lagi atau hubungi support." });
        }
      } catch (emailErr: any) {
        console.error(`[EmailAuth] Reset email network error for ${email}:`, emailErr?.message);
        return res.status(503).json({ error: "Email gagal terkirim. Coba lagi atau hubungi support." });
      }

      res.json({ success: true, message: "Jika email terdaftar, kode reset dikirim ke email Anda." });
    } catch (err) {
      console.error("[EmailAuth] Request reset error:", err);
      res.status(500).json({ error: "Terjadi kesalahan. Silakan coba lagi." });
    }
  });

  // ── FORGOT PASSWORD: Step 2 — verify OTP + set new password ─────────────────
  app.post("/api/auth/reset-password", otpLimiter, async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: "Email, kode OTP, dan password baru wajib diisi." });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: "Password minimal 8 karakter." });
      }

      const verif = await db
        .select()
        .from(emailVerifications)
        .where(and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.code, String(code).trim()),
          eq(emailVerifications.used, false),
          gt(emailVerifications.expiresAt, new Date())
        ))
        .limit(1);

      if (verif.length === 0) {
        return res.status(400).json({ error: "Kode OTP salah atau sudah kadaluarsa." });
      }

      const [userRow] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!userRow) return res.status(404).json({ error: "Akun tidak ditemukan." });

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await db.update(emailVerifications).set({ used: true }).where(eq(emailVerifications.id, verif[0].id));
      await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.email, email));

      console.log(`[EmailAuth] Password reset successful for ${email}`);
      res.json({ success: true, message: "Password berhasil direset. Silakan login dengan password baru." });
    } catch (err) {
      console.error("[EmailAuth] Reset password error:", err);
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
