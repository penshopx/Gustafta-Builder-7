import { users, type User, type UpsertUser } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";

// Interface for auth storage operations
// (IMPORTANT) These user operations are mandatory for Replit Auth.
export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

function resolveInitialRole(email: string | null | undefined): "superadmin" | "user" {
  if (!email) return "user";
  const superadminEmails = (process.env.SUPERADMIN_EMAILS || "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (superadminEmails.includes(email.toLowerCase())) return "superadmin";
  return "user";
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const initialRole = resolveInitialRole(userData.email);

    // Check if user already exists to preserve their role
    const existing = await this.getUser(userData.id as string);

    let finalRole: string;
    let finalIsActive: boolean;

    if (!existing) {
      // First login — assign initial role
      finalRole = initialRole;
      // Superadmins are immediately active; all other new users need approval
      finalIsActive = finalRole === "superadmin";
    } else if (initialRole === "superadmin") {
      // Always ensure superadmin emails keep their superadmin role and stay active
      finalRole = "superadmin";
      finalIsActive = existing.isActive !== false; // preserve but never deactivate superadmin
    } else {
      // Preserve existing role and active status (admin-assigned roles persist)
      finalRole = existing.role || "user";
      finalIsActive = existing.isActive !== false;
    }

    const [user] = await db
      .insert(users)
      .values({ ...userData, role: finalRole, isActive: finalIsActive })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          role: finalRole,
          updatedAt: new Date(),
          // isActive is NOT updated here — preserved from DB
        },
      })
      .returning();
    return user;
  }
}

export const authStorage = new AuthStorage();
