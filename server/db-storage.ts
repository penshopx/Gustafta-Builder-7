import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { randomUUID } from "crypto";
import {
  agents,
  bigIdeas,
  toolboxes,
  knowledgeBases,
  knowledgeChunks,
  integrations,
  agentMessages,
  analyticsTable,
  subscriptionsTable,
  userProfiles,
  projectBrainTemplates,
  projectBrainInstances,
  miniApps,
  miniAppResults,
  clientSubscriptions,
  affiliates,
  series,
  cores,
  vouchers,
  voucherRedemptions,
  userMemories,
  waContacts,
  waBroadcasts,
  waBroadcastRuns,
  tenderSources,
  tenders,
  leads,
  scoringResults,
} from "@shared/schema";
import type { IStorage } from "./storage";
import type {
  Agent,
  InsertAgent,
  KnowledgeBase,
  InsertKnowledgeBase,
  Integration,
  InsertIntegration,
  Message,
  InsertMessage,
  User,
  InsertUser,
  Analytics,
  InsertAnalytics,
  BigIdea,
  InsertBigIdea,
  Toolbox,
  InsertToolbox,
  UserProfile,
  InsertUserProfile,
  Subscription,
  InsertSubscription,
  ProjectBrainTemplate,
  InsertProjectBrainTemplate,
  ProjectBrainInstance,
  InsertProjectBrainInstance,
  MiniApp,
  InsertMiniApp,
  MiniAppResult,
  InsertMiniAppResult,
  ClientSubscription,
  InsertClientSubscription,
  Affiliate,
  InsertAffiliate,
  Series,
  InsertSeries,
  SeriesWithStats,
  SeriesWithHierarchy,
  Core,
  InsertCore,
  Voucher,
  InsertVoucher,
  VoucherRedemption,
  KnowledgeChunk,
  InsertKnowledgeChunk,
  UserMemory,
  InsertUserMemory,
  WaContact,
  InsertWaContact,
  WaBroadcast,
  InsertWaBroadcast,
  WaBroadcastRun,
  TenderSource,
  InsertTenderSource,
  Tender,
  InsertTender,
  Lead,
  InsertLead,
  ScoringResult,
  InsertScoringResult,
} from "@shared/schema";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export class DatabaseStorage implements IStorage {
  
  // User methods (placeholder - using Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return { ...insertUser, id: "", createdAt: new Date().toISOString() };
  }

  // User Profile methods
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      userId: row.userId,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl || "",
      bio: row.bio || "",
      company: row.company || "",
      position: row.position || "",
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const result = await db.insert(userProfiles).values({
      userId: insertProfile.userId,
      displayName: insertProfile.displayName,
      avatarUrl: insertProfile.avatarUrl || "",
      bio: insertProfile.bio || "",
      company: insertProfile.company || "",
      position: insertProfile.position || "",
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      userId: row.userId,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl || "",
      bio: row.bio || "",
      company: row.company || "",
      position: row.position || "",
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async updateUserProfile(userId: string, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const result = await db.update(userProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      userId: row.userId,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl || "",
      bio: row.bio || "",
      company: row.company || "",
      position: row.position || "",
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  // Series methods
  private mapSeriesRow(row: any): Series {
    return {
      id: String(row.id),
      userId: row.userId || "",
      name: row.name,
      slug: row.slug,
      description: row.description || "",
      tagline: row.tagline || "",
      coverImage: row.coverImage || "",
      color: row.color || "#6366f1",
      category: row.category || "",
      tags: (row.tags as string[]) || [],
      language: row.language || "id",
      isPublic: row.isPublic || false,
      isActive: row.isActive || false,
      isFeatured: row.isFeatured || false,
      sortOrder: row.sortOrder || 0,
      createdAt: row.createdAt?.toISOString?.() || new Date().toISOString(),
    };
  }

  async getSeries(): Promise<Series[]> {
    const result = await db.select().from(series).orderBy(series.sortOrder);
    return result.map(row => this.mapSeriesRow(row));
  }

  async getSeriesById(id: string): Promise<Series | undefined> {
    const result = await db.select().from(series).where(eq(series.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    return this.mapSeriesRow(result[0]);
  }

  async getSeriesBySlug(slug: string): Promise<Series | undefined> {
    const result = await db.select().from(series).where(eq(series.slug, slug)).limit(1);
    if (result.length === 0) return undefined;
    return this.mapSeriesRow(result[0]);
  }

  async getPublicSeries(): Promise<SeriesWithStats[]> {
    const allSeries = await db.select().from(series)
      .where(and(eq(series.isPublic, true), eq(series.isActive, true)))
      .orderBy(series.sortOrder);

    const result: SeriesWithStats[] = [];
    for (const s of allSeries) {
      const mapped = this.mapSeriesRow(s);
      const biRows = await db.select().from(bigIdeas).where(eq(bigIdeas.seriesId, s.id));
      const biIds = biRows.map(b => b.id);
      let totalToolboxes = 0;
      let totalAgents = 0;
      for (const biId of biIds) {
        const tbRows = await db.select().from(toolboxes).where(eq(toolboxes.bigIdeaId, biId));
        totalToolboxes += tbRows.length;
        for (const tb of tbRows) {
          const agentRows = await db.select({ id: agents.id }).from(agents).where(eq(agents.toolboxId, tb.id));
          totalAgents += agentRows.length;
        }
      }
      const coreCount = await db.select({ id: cores.id }).from(cores).where(eq(cores.seriesId, s.id));
      result.push({ ...mapped, totalBigIdeas: biIds.length, totalToolboxes, totalAgents, totalCores: coreCount.length });
    }
    return result;
  }

  async getSeriesWithHierarchy(id: string): Promise<SeriesWithHierarchy | undefined> {
    const sid = parseInt(id);
    if (isNaN(sid)) {
      const bySlug = await db.select().from(series).where(eq(series.slug, id)).limit(1);
      if (bySlug.length === 0) return undefined;
      return this.getSeriesWithHierarchy(String(bySlug[0].id));
    }

    const sRows = await db.select().from(series).where(eq(series.id, sid)).limit(1);
    if (sRows.length === 0) return undefined;
    const mapped = this.mapSeriesRow(sRows[0]);

    const coreRows = await db.select().from(cores)
      .where(eq(cores.seriesId, sid))
      .orderBy(cores.sortOrder);

    const biRows = await db.select().from(bigIdeas)
      .where(eq(bigIdeas.seriesId, sid))
      .orderBy(bigIdeas.sortOrder);

    let totalToolboxes = 0;
    let totalAgents = 0;

    const buildBigIdeaWithToolboxes = async (bi: any) => {
      const tbRows = await db.select().from(toolboxes)
        .where(eq(toolboxes.bigIdeaId, bi.id))
        .orderBy(toolboxes.sortOrder);

      const toolboxesWithAgents = [];
      for (const tb of tbRows) {
        totalToolboxes++;
        const agentRows = await db.select().from(agents).where(eq(agents.toolboxId, tb.id));
        totalAgents += agentRows.length;
        toolboxesWithAgents.push({
          id: String(tb.id),
          bigIdeaId: String(tb.bigIdeaId),
          name: tb.name,
          description: tb.description || "",
          purpose: tb.purpose || "",
          capabilities: (tb.capabilities as string[]) || [],
          limitations: (tb.limitations as string[]) || [],
          sortOrder: tb.sortOrder || 0,
          isActive: tb.isActive || false,
          createdAt: tb.createdAt.toISOString(),
          agents: agentRows.map(a => ({
            id: String(a.id),
            name: a.name,
            description: a.description || "",
            avatar: a.avatar || "",
            tagline: a.tagline || "",
            category: a.category || "",
            subcategory: a.subcategory || "",
            isPublic: a.isPublic || false,
            isActive: a.isActive || false,
            productSlug: a.productSlug || "",
            widgetColor: a.widgetColor || "#6366f1",
          })),
        });
      }

      return {
        ...this.mapBigIdeaRow(bi),
        toolboxes: toolboxesWithAgents,
      };
    };

    const coresWithBigIdeas = [];
    for (const c of coreRows) {
      const coreBigIdeas = biRows.filter(bi => bi.coreId === c.id);
      const coreBigIdeasMapped = [];
      for (const bi of coreBigIdeas) {
        coreBigIdeasMapped.push(await buildBigIdeaWithToolboxes(bi));
      }
      coresWithBigIdeas.push({
        ...this.mapCoreRow(c),
        bigIdeas: coreBigIdeasMapped,
      });
    }

    const ungroupedBigIdeas = biRows.filter(bi => !bi.coreId);
    const ungroupedMapped = [];
    for (const bi of ungroupedBigIdeas) {
      ungroupedMapped.push(await buildBigIdeaWithToolboxes(bi));
    }

    return {
      ...mapped,
      totalBigIdeas: biRows.length,
      totalToolboxes,
      totalAgents,
      totalCores: coreRows.length,
      cores: coresWithBigIdeas,
      bigIdeas: ungroupedMapped,
    };
  }

  async createSeries(data: InsertSeries, userId: string): Promise<Series> {
    const result = await db.insert(series).values({
      userId,
      name: data.name,
      slug: data.slug,
      description: data.description || "",
      tagline: data.tagline || "",
      coverImage: data.coverImage || "",
      color: data.color || "#6366f1",
      category: data.category || "",
      tags: data.tags || [],
      language: data.language || "id",
      isPublic: data.isPublic || false,
      isFeatured: data.isFeatured || false,
      sortOrder: data.sortOrder || 0,
      isActive: true,
    }).returning();
    return this.mapSeriesRow(result[0]);
  }

  async updateSeries(id: string, data: Partial<InsertSeries>): Promise<Series | undefined> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.tagline !== undefined) updateData.tagline = data.tagline;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const result = await db.update(series)
      .set(updateData)
      .where(eq(series.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapSeriesRow(result[0]);
  }

  async deleteSeries(id: string): Promise<boolean> {
    const result = await db.delete(series).where(eq(series.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Core methods
  private mapCoreRow(row: any): Core {
    return {
      id: String(row.id),
      seriesId: String(row.seriesId),
      name: row.name,
      description: row.description || "",
      sortOrder: row.sortOrder || 0,
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getCores(seriesId?: string): Promise<Core[]> {
    const query = seriesId
      ? db.select().from(cores).where(eq(cores.seriesId, parseInt(seriesId))).orderBy(cores.sortOrder)
      : db.select().from(cores).orderBy(cores.sortOrder);
    const result = await query;
    return result.map(r => this.mapCoreRow(r));
  }

  async getCore(id: string): Promise<Core | undefined> {
    const result = await db.select().from(cores).where(eq(cores.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    return this.mapCoreRow(result[0]);
  }

  async createCore(data: InsertCore): Promise<Core> {
    const result = await db.insert(cores).values({
      seriesId: parseInt(data.seriesId),
      name: data.name,
      description: data.description || "",
      sortOrder: data.sortOrder || 0,
      isActive: true,
    }).returning();
    return this.mapCoreRow(result[0]);
  }

  async updateCore(id: string, data: Partial<InsertCore>): Promise<Core | undefined> {
    const updateData: any = { ...data };
    if ('seriesId' in updateData && updateData.seriesId) {
      updateData.seriesId = parseInt(updateData.seriesId);
    }
    const result = await db.update(cores).set(updateData).where(eq(cores.id, parseInt(id))).returning();
    if (result.length === 0) return undefined;
    return this.mapCoreRow(result[0]);
  }

  async deleteCore(id: string): Promise<boolean> {
    await db.update(bigIdeas).set({ coreId: null }).where(eq(bigIdeas.coreId, parseInt(id)));
    const result = await db.delete(cores).where(eq(cores.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Big Idea methods
  private mapBigIdeaRow(row: any): BigIdea {
    return {
      id: String(row.id),
      name: row.name,
      type: row.type as "problem" | "idea" | "inspiration" | "mentoring",
      description: row.description,
      goals: (row.goals as string[]) || [],
      targetAudience: row.targetAudience || "",
      expectedOutcome: row.expectedOutcome || "",
      seriesId: row.seriesId ? String(row.seriesId) : undefined,
      coreId: row.coreId ? String(row.coreId) : undefined,
      sortOrder: row.sortOrder || 0,
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getBigIdeas(): Promise<BigIdea[]> {
    const result = await db.select().from(bigIdeas).orderBy(desc(bigIdeas.createdAt));
    return result.map(row => this.mapBigIdeaRow(row));
  }

  async getBigIdea(id: string): Promise<BigIdea | undefined> {
    const result = await db.select().from(bigIdeas).where(eq(bigIdeas.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    return this.mapBigIdeaRow(result[0]);
  }

  async getActiveBigIdea(): Promise<BigIdea | null> {
    const result = await db.select().from(bigIdeas).where(eq(bigIdeas.isActive, true)).limit(1);
    if (result.length === 0) return null;
    return this.mapBigIdeaRow(result[0]);
  }

  async createBigIdea(insertBigIdea: InsertBigIdea): Promise<BigIdea> {
    await db.update(bigIdeas).set({ isActive: false });
    const result = await db.insert(bigIdeas).values({
      name: insertBigIdea.name,
      type: insertBigIdea.type,
      description: insertBigIdea.description,
      goals: insertBigIdea.goals || [],
      targetAudience: insertBigIdea.targetAudience || "",
      expectedOutcome: insertBigIdea.expectedOutcome || "",
      seriesId: insertBigIdea.seriesId ? parseInt(insertBigIdea.seriesId) : null,
      coreId: insertBigIdea.coreId ? parseInt(insertBigIdea.coreId) : null,
      sortOrder: insertBigIdea.sortOrder || 0,
      isActive: true,
    }).returning();
    return this.mapBigIdeaRow(result[0]);
  }

  async updateBigIdea(id: string, data: Partial<InsertBigIdea>): Promise<BigIdea | undefined> {
    const updateData: any = { ...data };
    if ('seriesId' in updateData) {
      if (updateData.seriesId && typeof updateData.seriesId === 'string' && updateData.seriesId.trim() !== '') {
        updateData.seriesId = parseInt(updateData.seriesId);
      } else {
        updateData.seriesId = null;
      }
    }
    if ('coreId' in updateData) {
      if (updateData.coreId && typeof updateData.coreId === 'string' && updateData.coreId.trim() !== '') {
        updateData.coreId = parseInt(updateData.coreId);
      } else {
        updateData.coreId = null;
      }
    }
    const result = await db.update(bigIdeas)
      .set(updateData)
      .where(eq(bigIdeas.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapBigIdeaRow(result[0]);
  }

  async setActiveBigIdea(id: string): Promise<BigIdea | undefined> {
    await db.update(bigIdeas).set({ isActive: false });
    const result = await db.update(bigIdeas)
      .set({ isActive: true })
      .where(eq(bigIdeas.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapBigIdeaRow(result[0]);
  }

  async deleteBigIdea(id: string): Promise<boolean> {
    const result = await db.delete(bigIdeas).where(eq(bigIdeas.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Toolbox methods
  async getToolboxes(bigIdeaId?: string): Promise<Toolbox[]> {
    const query = bigIdeaId 
      ? db.select().from(toolboxes).where(eq(toolboxes.bigIdeaId, parseInt(bigIdeaId))).orderBy(toolboxes.sortOrder)
      : db.select().from(toolboxes).orderBy(toolboxes.sortOrder);
    const result = await query;
    return result.map(row => ({
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      sortOrder: row.sortOrder || 0,
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async getToolbox(id: string): Promise<Toolbox | undefined> {
    const result = await db.select().from(toolboxes).where(eq(toolboxes.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      sortOrder: row.sortOrder || 0,
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getActiveToolbox(): Promise<Toolbox | null> {
    const result = await db.select().from(toolboxes).where(eq(toolboxes.isActive, true)).limit(1);
    if (result.length === 0) return null;
    const row = result[0];
    return {
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      sortOrder: row.sortOrder || 0,
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async createToolbox(insertToolbox: InsertToolbox): Promise<Toolbox> {
    await db.update(toolboxes).set({ isActive: false });
    const result = await db.insert(toolboxes).values({
      bigIdeaId: parseInt(insertToolbox.bigIdeaId),
      name: insertToolbox.name,
      description: insertToolbox.description || "",
      purpose: insertToolbox.purpose || "",
      capabilities: insertToolbox.capabilities || [],
      limitations: insertToolbox.limitations || [],
      sortOrder: insertToolbox.sortOrder || 0,
      isActive: true,
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      sortOrder: row.sortOrder || 0,
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async updateToolbox(id: string, data: Partial<InsertToolbox>): Promise<Toolbox | undefined> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.purpose !== undefined) updateData.purpose = data.purpose;
    if (data.capabilities !== undefined) updateData.capabilities = data.capabilities;
    if (data.limitations !== undefined) updateData.limitations = data.limitations;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    
    const result = await db.update(toolboxes)
      .set(updateData)
      .where(eq(toolboxes.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      sortOrder: row.sortOrder || 0,
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async setActiveToolbox(id: string): Promise<Toolbox | undefined> {
    await db.update(toolboxes).set({ isActive: false });
    const result = await db.update(toolboxes)
      .set({ isActive: true })
      .where(eq(toolboxes.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      bigIdeaId: String(row.bigIdeaId),
      name: row.name,
      description: row.description || "",
      purpose: row.purpose || "",
      capabilities: (row.capabilities as string[]) || [],
      limitations: (row.limitations as string[]) || [],
      sortOrder: row.sortOrder || 0,
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async deleteToolbox(id: string): Promise<boolean> {
    const result = await db.delete(toolboxes).where(eq(toolboxes.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Agent methods
  async getAgents(toolboxId?: string): Promise<Agent[]> {
    const query = toolboxId 
      ? db.select().from(agents).where(eq(agents.toolboxId, parseInt(toolboxId))).orderBy(desc(agents.createdAt))
      : db.select().from(agents).orderBy(desc(agents.createdAt));
    const result = await query;
    return result.map(row => this.mapAgentRow(row));
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    const result = await db.select().from(agents).where(eq(agents.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    return this.mapAgentRow(result[0]);
  }

  async getActiveAgent(): Promise<Agent | null> {
    const result = await db.select().from(agents).where(eq(agents.isActive, true)).limit(1);
    if (result.length === 0) return null;
    return this.mapAgentRow(result[0]);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    await db.update(agents).set({ isActive: false });
    
    // Auto-generate access token if not provided
    const accessToken = insertAgent.accessToken || `gus_${randomUUID().replace(/-/g, "")}`;
    
    const result = await db.insert(agents).values({
      name: insertAgent.name,
      description: insertAgent.description || "",
      avatar: insertAgent.avatar || "",
      tagline: insertAgent.tagline || "",
      philosophy: insertAgent.philosophy || "",
      offTopicHandling: insertAgent.offTopicHandling || "politely_redirect",
      systemPrompt: insertAgent.systemPrompt || "You are a helpful assistant.",
      temperature: insertAgent.temperature || 0.7,
      maxTokens: insertAgent.maxTokens || 1024,
      aiModel: insertAgent.aiModel || "gpt-4o-mini",
      customApiKey: insertAgent.customApiKey || "",
      customBaseUrl: insertAgent.customBaseUrl || "",
      customModelName: insertAgent.customModelName || "",
      greetingMessage: insertAgent.greetingMessage || "",
      conversationStarters: insertAgent.conversationStarters || [],
      language: insertAgent.language || "id",
      category: insertAgent.category || "",
      subcategory: insertAgent.subcategory || "",
      accessToken: accessToken,
      isPublic: insertAgent.isPublic || false,
      allowedDomains: insertAgent.allowedDomains || [],
      toolboxId: insertAgent.toolboxId ? parseInt(insertAgent.toolboxId) : null,
      bigIdeaId: insertAgent.bigIdeaId ? parseInt(insertAgent.bigIdeaId) : null,
      isOrchestrator: insertAgent.isOrchestrator || false,
      orchestratorRole: insertAgent.isOrchestrator ? "orchestrator" : (insertAgent.orchestratorRole || "standalone"),
      parentAgentId: insertAgent.parentAgentId ? parseInt(insertAgent.parentAgentId) : null,
      agenticMode: insertAgent.agenticMode || false,
      attentiveListening: insertAgent.attentiveListening ?? true,
      contextRetention: insertAgent.contextRetention || 10,
      proactiveAssistance: insertAgent.proactiveAssistance || false,
      learningEnabled: insertAgent.learningEnabled || false,
      emotionalIntelligence: insertAgent.emotionalIntelligence ?? true,
      multiStepReasoning: insertAgent.multiStepReasoning ?? true,
      selfCorrection: insertAgent.selfCorrection ?? true,
      personality: insertAgent.personality || "",
      expertise: insertAgent.expertise || [],
      communicationStyle: insertAgent.communicationStyle || "friendly",
      toneOfVoice: insertAgent.toneOfVoice || "professional",
      responseFormat: insertAgent.responseFormat || "conversational",
      avoidTopics: insertAgent.avoidTopics || [],
      keyPhrases: insertAgent.keyPhrases || [],
      widgetColor: insertAgent.widgetColor || "#6366f1",
      widgetPosition: insertAgent.widgetPosition || "bottom-right",
      widgetSize: insertAgent.widgetSize || "medium",
      widgetBorderRadius: insertAgent.widgetBorderRadius || "rounded",
      widgetShowBranding: insertAgent.widgetShowBranding ?? true,
      widgetWelcomeMessage: insertAgent.widgetWelcomeMessage || "",
      widgetButtonIcon: insertAgent.widgetButtonIcon || "chat",
      isActive: true,
    }).returning();
    return this.mapAgentRow(result[0]);
  }

  async updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined> {
    const updateData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "toolboxId" || key === "parentAgentId") {
          updateData[key] = value ? parseInt(value as string) : null;
        } else {
          updateData[key] = value;
        }
      }
    });
    
    const result = await db.update(agents)
      .set(updateData)
      .where(eq(agents.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapAgentRow(result[0]);
  }

  async setActiveAgent(id: string): Promise<Agent | undefined> {
    await db.update(agents).set({ isActive: false });
    const result = await db.update(agents)
      .set({ isActive: true })
      .where(eq(agents.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapAgentRow(result[0]);
  }

  async deleteAgent(id: string): Promise<boolean> {
    const result = await db.delete(agents).where(eq(agents.id, parseInt(id))).returning();
    return result.length > 0;
  }

  private mapAgentRow(row: typeof agents.$inferSelect): Agent {
    return {
      id: String(row.id),
      name: row.name,
      description: row.description || "",
      avatar: row.avatar || "",
      tagline: row.tagline || "",
      philosophy: row.philosophy || "",
      offTopicHandling: row.offTopicHandling || "politely_redirect",
      offTopicResponse: row.offTopicResponse || "",
      systemPrompt: row.systemPrompt || "You are a helpful assistant.",
      temperature: row.temperature || 0.7,
      maxTokens: row.maxTokens || 1024,
      aiModel: (row.aiModel || "gpt-4o-mini") as Agent["aiModel"],
      customApiKey: row.customApiKey || "",
      customBaseUrl: row.customBaseUrl || "",
      customModelName: row.customModelName || "",
      greetingMessage: row.greetingMessage || "",
      conversationStarters: (row.conversationStarters as string[]) || [],
      language: row.language || "id",
      category: row.category || "",
      subcategory: row.subcategory || "",
      accessToken: row.accessToken || "",
      isPublic: row.isPublic || false,
      allowedDomains: (row.allowedDomains as string[]) || [],
      toolboxId: row.toolboxId ? String(row.toolboxId) : "",
      bigIdeaId: row.bigIdeaId ? String(row.bigIdeaId) : "",
      isOrchestrator: row.isOrchestrator || false,
      orchestratorRole: (row.orchestratorRole || "standalone") as Agent["orchestratorRole"],
      parentAgentId: row.parentAgentId ? String(row.parentAgentId) : "",
      agenticMode: row.agenticMode || false,
      attentiveListening: row.attentiveListening ?? true,
      contextRetention: row.contextRetention || 10,
      proactiveAssistance: row.proactiveAssistance || false,
      learningEnabled: row.learningEnabled || false,
      emotionalIntelligence: row.emotionalIntelligence ?? true,
      multiStepReasoning: row.multiStepReasoning ?? true,
      selfCorrection: row.selfCorrection ?? true,
      personality: row.personality || "",
      expertise: (row.expertise as string[]) || [],
      communicationStyle: row.communicationStyle || "friendly",
      toneOfVoice: row.toneOfVoice || "professional",
      responseFormat: row.responseFormat || "conversational",
      avoidTopics: (row.avoidTopics as string[]) || [],
      keyPhrases: (row.keyPhrases as string[]) || [],
      widgetColor: row.widgetColor || "#6366f1",
      widgetPosition: (row.widgetPosition || "bottom-right") as Agent["widgetPosition"],
      widgetSize: (row.widgetSize || "medium") as Agent["widgetSize"],
      widgetBorderRadius: (row.widgetBorderRadius || "rounded") as Agent["widgetBorderRadius"],
      widgetShowBranding: row.widgetShowBranding ?? true,
      widgetWelcomeMessage: row.widgetWelcomeMessage || "",
      widgetButtonIcon: (row.widgetButtonIcon || "chat") as Agent["widgetButtonIcon"],
      isListed: row.isListed ?? false,
      productSlug: row.productSlug || undefined,
      productSummary: row.productSummary || "",
      productFeatures: (row.productFeatures as string[]) || [],
      productPricing: (row.productPricing as Record<string, any>) || {},
      trialEnabled: row.trialEnabled ?? true,
      trialDays: row.trialDays ?? 7,
      monthlyPrice: row.monthlyPrice ?? 0,
      messageQuotaDaily: row.messageQuotaDaily ?? 50,
      messageQuotaMonthly: row.messageQuotaMonthly ?? 1000,
      requireRegistration: row.requireRegistration ?? false,
      brandingName: row.brandingName || "",
      brandingLogo: row.brandingLogo || "",
      contextQuestions: (row.contextQuestions as any[]) || [],
      guestMessageLimit: row.guestMessageLimit ?? 10,
      ragChunkSize: row.ragChunkSize ?? 800,
      ragChunkOverlap: row.ragChunkOverlap ?? 200,
      ragTopK: row.ragTopK ?? 5,
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  // Knowledge Base methods
  async getKnowledgeBases(agentId: string): Promise<KnowledgeBase[]> {
    const result = await db.select().from(knowledgeBases)
      .where(eq(knowledgeBases.agentId, parseInt(agentId)))
      .orderBy(desc(knowledgeBases.createdAt));
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      type: row.type as "text" | "file" | "url",
      content: row.content,
      description: row.description || "",
      fileType: row.fileType as KnowledgeBase["fileType"],
      fileName: row.fileName || "",
      fileSize: row.fileSize || 0,
      fileUrl: row.fileUrl || "",
      processingStatus: (row.processingStatus || "completed") as KnowledgeBase["processingStatus"],
      extractedText: row.extractedText || "",
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createKnowledgeBase(kb: InsertKnowledgeBase): Promise<KnowledgeBase> {
    const result = await db.insert(knowledgeBases).values({
      agentId: parseInt(kb.agentId),
      name: kb.name,
      type: kb.type,
      content: kb.content,
      description: kb.description || "",
      fileType: kb.fileType,
      fileName: kb.fileName || "",
      fileSize: kb.fileSize || 0,
      fileUrl: kb.fileUrl || "",
      processingStatus: kb.processingStatus || "completed",
      extractedText: kb.extractedText || "",
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      type: row.type as "text" | "file" | "url",
      content: row.content,
      description: row.description || "",
      fileType: row.fileType as KnowledgeBase["fileType"],
      fileName: row.fileName || "",
      fileSize: row.fileSize || 0,
      fileUrl: row.fileUrl || "",
      processingStatus: (row.processingStatus || "completed") as KnowledgeBase["processingStatus"],
      extractedText: row.extractedText || "",
      createdAt: row.createdAt.toISOString(),
    };
  }

  async updateKnowledgeBase(id: string, data: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase | undefined> {
    const updateData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== "agentId") {
        updateData[key] = value;
      }
    });
    
    const result = await db.update(knowledgeBases)
      .set(updateData)
      .where(eq(knowledgeBases.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      type: row.type as "text" | "file" | "url",
      content: row.content,
      description: row.description || "",
      fileType: row.fileType as KnowledgeBase["fileType"],
      fileName: row.fileName || "",
      fileSize: row.fileSize || 0,
      fileUrl: row.fileUrl || "",
      processingStatus: (row.processingStatus || "completed") as KnowledgeBase["processingStatus"],
      extractedText: row.extractedText || "",
      createdAt: row.createdAt.toISOString(),
    };
  }

  async deleteKnowledgeBase(id: string): Promise<boolean> {
    await db.delete(knowledgeChunks).where(eq(knowledgeChunks.knowledgeBaseId, parseInt(id)));
    const result = await db.delete(knowledgeBases).where(eq(knowledgeBases.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Knowledge Chunks methods (RAG)
  async getChunksByKnowledgeBase(knowledgeBaseId: string): Promise<KnowledgeChunk[]> {
    const result = await db.select().from(knowledgeChunks)
      .where(eq(knowledgeChunks.knowledgeBaseId, parseInt(knowledgeBaseId)))
      .orderBy(knowledgeChunks.chunkIndex);
    return result.map(row => ({
      id: row.id as unknown as number,
      knowledgeBaseId: row.knowledgeBaseId as unknown as number,
      agentId: row.agentId as unknown as number,
      chunkIndex: row.chunkIndex,
      content: row.content,
      tokenCount: row.tokenCount || 0,
      embedding: (row.embedding as number[]) || [],
      metadata: (row.metadata as Record<string, any>) || {},
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async getChunksByAgent(agentId: string): Promise<KnowledgeChunk[]> {
    const result = await db.select().from(knowledgeChunks)
      .where(eq(knowledgeChunks.agentId, parseInt(agentId)))
      .orderBy(knowledgeChunks.chunkIndex);
    return result.map(row => ({
      id: row.id as unknown as number,
      knowledgeBaseId: row.knowledgeBaseId as unknown as number,
      agentId: row.agentId as unknown as number,
      chunkIndex: row.chunkIndex,
      content: row.content,
      tokenCount: row.tokenCount || 0,
      embedding: (row.embedding as number[]) || [],
      metadata: (row.metadata as Record<string, any>) || {},
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createChunks(chunks: InsertKnowledgeChunk[]): Promise<KnowledgeChunk[]> {
    if (chunks.length === 0) return [];
    const created: KnowledgeChunk[] = [];
    for (const chunk of chunks) {
      const result = await db.insert(knowledgeChunks).values({
        knowledgeBaseId: chunk.knowledgeBaseId as any,
        agentId: chunk.agentId as any,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
        tokenCount: chunk.tokenCount || 0,
        embedding: chunk.embedding || [],
        metadata: chunk.metadata || {},
      }).returning();
      if (result[0]) {
        created.push({
          id: result[0].id as unknown as number,
          knowledgeBaseId: result[0].knowledgeBaseId as unknown as number,
          agentId: result[0].agentId as unknown as number,
          chunkIndex: result[0].chunkIndex,
          content: result[0].content,
          tokenCount: result[0].tokenCount || 0,
          embedding: (result[0].embedding as number[]) || [],
          metadata: (result[0].metadata as Record<string, any>) || {},
          createdAt: result[0].createdAt.toISOString(),
        });
      }
    }
    return created;
  }

  async deleteChunksByKnowledgeBase(knowledgeBaseId: string): Promise<boolean> {
    await db.delete(knowledgeChunks).where(eq(knowledgeChunks.knowledgeBaseId, parseInt(knowledgeBaseId)));
    return true;
  }

  async deleteChunksByAgent(agentId: string): Promise<boolean> {
    await db.delete(knowledgeChunks).where(eq(knowledgeChunks.agentId, parseInt(agentId)));
    return true;
  }

  // Integration methods
  async getIntegrations(agentId: string): Promise<Integration[]> {
    const result = await db.select().from(integrations)
      .where(eq(integrations.agentId, parseInt(agentId)))
      .orderBy(desc(integrations.createdAt));
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      type: row.type as Integration["type"],
      name: row.name,
      config: (row.config as Record<string, string>) || {},
      isEnabled: row.isEnabled || false,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const result = await db.insert(integrations).values({
      agentId: parseInt(integration.agentId),
      type: integration.type,
      name: integration.name,
      config: integration.config || {},
      isEnabled: integration.isEnabled || false,
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      type: row.type as Integration["type"],
      name: row.name,
      config: (row.config as Record<string, string>) || {},
      isEnabled: row.isEnabled || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async updateIntegration(id: string, data: Partial<InsertIntegration>): Promise<Integration | undefined> {
    const updateData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== "agentId") {
        updateData[key] = value;
      }
    });
    
    const result = await db.update(integrations)
      .set(updateData)
      .where(eq(integrations.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      type: row.type as Integration["type"],
      name: row.name,
      config: (row.config as Record<string, string>) || {},
      isEnabled: row.isEnabled || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async deleteIntegration(id: string): Promise<boolean> {
    const result = await db.delete(integrations).where(eq(integrations.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Message methods
  async getMessages(agentId: string): Promise<Message[]> {
    const result = await db.select().from(agentMessages)
      .where(eq(agentMessages.agentId, parseInt(agentId)))
      .orderBy(agentMessages.createdAt);
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      sessionId: row.sessionId || "",
      role: row.role as "user" | "assistant",
      content: row.content,
      reasoning: row.reasoning || "",
      confidence: row.confidence || undefined,
      sources: (row.sources as string[]) || [],
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async getMessagesBySession(agentId: string, sessionId: string): Promise<Message[]> {
    const result = await db.select().from(agentMessages)
      .where(and(
        eq(agentMessages.agentId, parseInt(agentId)),
        eq(agentMessages.sessionId, sessionId)
      ))
      .orderBy(agentMessages.createdAt);
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      sessionId: row.sessionId || "",
      role: row.role as "user" | "assistant",
      content: row.content,
      reasoning: row.reasoning || "",
      confidence: row.confidence || undefined,
      sources: (row.sources as string[]) || [],
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const sourcesArray = Array.isArray(message.sources) ? message.sources : [];
    const agentIdNum = parseInt(message.agentId);
    const reasoningVal = message.reasoning || "";
    const confidenceVal = message.confidence || 0;
    const sourcesJson = JSON.stringify(sourcesArray);
    const sessionId = message.sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const result = await db.execute(sql`
      INSERT INTO agent_messages (agent_id, session_id, role, content, reasoning, confidence, sources)
      VALUES (${agentIdNum}, ${sessionId}, ${message.role}, ${message.content}, ${reasoningVal}, ${confidenceVal}, ${sourcesJson}::jsonb)
      RETURNING *
    `);
    const rows = result.rows as any[];
    const row = rows[0];
    return {
      id: String(row.id),
      agentId: String(row.agent_id),
      role: row.role as "user" | "assistant",
      content: row.content,
      reasoning: row.reasoning || "",
      confidence: row.confidence || undefined,
      sources: (row.sources as string[]) || [],
      createdAt: new Date(row.created_at).toISOString(),
    };
  }

  async clearMessages(agentId: string): Promise<boolean> {
    await db.delete(agentMessages).where(eq(agentMessages.agentId, parseInt(agentId)));
    return true;
  }

  // Analytics methods
  async getAnalytics(agentId: string): Promise<Analytics[]> {
    const result = await db.select().from(analyticsTable)
      .where(eq(analyticsTable.agentId, parseInt(agentId)))
      .orderBy(desc(analyticsTable.createdAt));
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      eventType: row.eventType as Analytics["eventType"],
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createAnalytics(analytics: InsertAnalytics): Promise<Analytics> {
    const result = await db.insert(analyticsTable).values({
      agentId: parseInt(analytics.agentId),
      eventType: analytics.eventType,
      metadata: analytics.metadata || {},
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      eventType: row.eventType as Analytics["eventType"],
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getAnalyticsSummary(agentId: string): Promise<{
    totalMessages: number;
    totalSessions: number;
    totalIntegrationCalls: number;
    messagesLast7Days: number[];
    topHours: { hour: number; count: number }[];
  }> {
    const analytics = await this.getAnalytics(agentId);
    
    const totalMessages = analytics.filter(a => a.eventType === "message").length;
    const totalSessions = analytics.filter(a => a.eventType === "session").length;
    const totalIntegrationCalls = analytics.filter(a => a.eventType === "integration_call").length;
    
    const now = new Date();
    const messagesLast7Days: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      const count = analytics.filter(a => {
        const eventDate = new Date(a.createdAt);
        return a.eventType === "message" && eventDate >= dayStart && eventDate <= dayEnd;
      }).length;
      messagesLast7Days.push(count);
    }
    
    const hourCounts: Record<number, number> = {};
    analytics.forEach(a => {
      const hour = new Date(a.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const topHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalMessages,
      totalSessions,
      totalIntegrationCalls,
      messagesLast7Days,
      topHours,
    };
  }

  // Subscription methods
  private mapSubscriptionRow(row: typeof subscriptionsTable.$inferSelect): Subscription {
    return {
      id: String(row.id),
      userId: row.userId,
      plan: row.plan as Subscription["plan"],
      status: (row.status || "pending") as Subscription["status"],
      mayarOrderId: row.mayarOrderId || undefined,
      mayarPaymentUrl: row.mayarPaymentUrl || undefined,
      amount: row.amount || 0,
      currency: row.currency || "IDR",
      chatbotLimit: row.chatbotLimit || 1,
      startDate: row.startDate?.toISOString(),
      endDate: row.endDate?.toISOString(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(subscriptionsTable).values({
      userId: subscription.userId,
      plan: subscription.plan,
      status: subscription.status || "pending",
      mayarOrderId: subscription.mayarOrderId,
      mayarPaymentUrl: subscription.mayarPaymentUrl,
      amount: subscription.amount || 0,
      currency: subscription.currency || "IDR",
      chatbotLimit: subscription.chatbotLimit || 1,
      startDate: subscription.startDate ? new Date(subscription.startDate) : null,
      endDate: subscription.endDate ? new Date(subscription.endDate) : null,
    }).returning();
    return this.mapSubscriptionRow(result[0]);
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    return this.mapSubscriptionRow(result[0]);
  }

  async getSubscriptionByMayarOrderId(mayarOrderId: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptionsTable)
      .where(eq(subscriptionsTable.mayarOrderId, mayarOrderId))
      .limit(1);
    if (result.length === 0) return undefined;
    return this.mapSubscriptionRow(result[0]);
  }

  async getActiveSubscription(userId: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptionsTable)
      .where(and(
        eq(subscriptionsTable.userId, userId),
        eq(subscriptionsTable.status, "active")
      ))
      .orderBy(desc(subscriptionsTable.endDate))
      .limit(1);
    if (result.length === 0) return undefined;
    return this.mapSubscriptionRow(result[0]);
  }

  async updateSubscription(id: string, data: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "startDate" || key === "endDate") {
          updateData[key] = value ? new Date(value as string) : null;
        } else {
          updateData[key] = value;
        }
      }
    });
    
    const result = await db.update(subscriptionsTable)
      .set(updateData)
      .where(eq(subscriptionsTable.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapSubscriptionRow(result[0]);
  }

  async expireSubscriptions(): Promise<number> {
    const now = new Date();
    const result = await db.update(subscriptionsTable)
      .set({ status: "expired", updatedAt: now })
      .where(
        and(
          eq(subscriptionsTable.status, "active"),
          sql`${subscriptionsTable.endDate} < ${now}`
        )
      )
      .returning();
    return result.length;
  }

  async countUserAgents(userId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(agents)
      .where(eq(agents.userId, userId));
    return Number(result[0]?.count || 0);
  }

  // Project Brain Template methods
  async getProjectBrainTemplates(agentId: string): Promise<ProjectBrainTemplate[]> {
    const result = await db.select().from(projectBrainTemplates)
      .where(eq(projectBrainTemplates.agentId, parseInt(agentId)))
      .orderBy(desc(projectBrainTemplates.createdAt));
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      description: row.description || "",
      fields: (row.fields as any[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async getProjectBrainTemplate(id: string): Promise<ProjectBrainTemplate | undefined> {
    const result = await db.select().from(projectBrainTemplates)
      .where(eq(projectBrainTemplates.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      description: row.description || "",
      fields: (row.fields as any[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async createProjectBrainTemplate(template: InsertProjectBrainTemplate): Promise<ProjectBrainTemplate> {
    const result = await db.insert(projectBrainTemplates).values({
      agentId: parseInt(template.agentId),
      name: template.name,
      description: template.description || "",
      fields: template.fields || [],
      isActive: true,
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      description: row.description || "",
      fields: (row.fields as any[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async updateProjectBrainTemplate(id: string, data: Partial<InsertProjectBrainTemplate>): Promise<ProjectBrainTemplate | undefined> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.fields !== undefined) updateData.fields = data.fields;

    const result = await db.update(projectBrainTemplates)
      .set(updateData)
      .where(eq(projectBrainTemplates.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      description: row.description || "",
      fields: (row.fields as any[]) || [],
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async deleteProjectBrainTemplate(id: string): Promise<boolean> {
    const result = await db.delete(projectBrainTemplates)
      .where(eq(projectBrainTemplates.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Project Brain Instance methods
  async getProjectBrainInstances(agentId: string): Promise<ProjectBrainInstance[]> {
    const result = await db.select().from(projectBrainInstances)
      .where(eq(projectBrainInstances.agentId, parseInt(agentId)))
      .orderBy(desc(projectBrainInstances.createdAt));
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      templateId: String(row.templateId),
      name: row.name,
      values: (row.values as Record<string, any>) || {},
      status: (row.status || "active") as "draft" | "active" | "completed" | "archived",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  async getProjectBrainInstance(id: string): Promise<ProjectBrainInstance | undefined> {
    const result = await db.select().from(projectBrainInstances)
      .where(eq(projectBrainInstances.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      templateId: String(row.templateId),
      name: row.name,
      values: (row.values as Record<string, any>) || {},
      status: (row.status || "active") as "draft" | "active" | "completed" | "archived",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async getActiveProjectBrainInstance(agentId: string): Promise<ProjectBrainInstance | null> {
    const result = await db.select().from(projectBrainInstances)
      .where(and(
        eq(projectBrainInstances.agentId, parseInt(agentId)),
        eq(projectBrainInstances.isActive, true)
      ))
      .limit(1);
    if (result.length === 0) return null;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      templateId: String(row.templateId),
      name: row.name,
      values: (row.values as Record<string, any>) || {},
      status: (row.status || "active") as "draft" | "active" | "completed" | "archived",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async createProjectBrainInstance(instance: InsertProjectBrainInstance): Promise<ProjectBrainInstance> {
    const result = await db.insert(projectBrainInstances).values({
      agentId: parseInt(instance.agentId),
      templateId: parseInt(instance.templateId),
      name: instance.name,
      values: instance.values || {},
      status: instance.status || "active",
      isActive: true,
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      templateId: String(row.templateId),
      name: row.name,
      values: (row.values as Record<string, any>) || {},
      status: (row.status || "active") as "draft" | "active" | "completed" | "archived",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async updateProjectBrainInstance(id: string, data: Partial<InsertProjectBrainInstance>): Promise<ProjectBrainInstance | undefined> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (data.name !== undefined) updateData.name = data.name;
    if (data.values !== undefined) updateData.values = data.values;
    if (data.status !== undefined) updateData.status = data.status;

    const result = await db.update(projectBrainInstances)
      .set(updateData)
      .where(eq(projectBrainInstances.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      templateId: String(row.templateId),
      name: row.name,
      values: (row.values as Record<string, any>) || {},
      status: (row.status || "active") as "draft" | "active" | "completed" | "archived",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async setActiveProjectBrainInstance(id: string): Promise<ProjectBrainInstance | undefined> {
    const instance = await this.getProjectBrainInstance(id);
    if (!instance) return undefined;

    await db.update(projectBrainInstances)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(projectBrainInstances.agentId, parseInt(instance.agentId)));

    const result = await db.update(projectBrainInstances)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(projectBrainInstances.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      templateId: String(row.templateId),
      name: row.name,
      values: (row.values as Record<string, any>) || {},
      status: (row.status || "active") as "draft" | "active" | "completed" | "archived",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async deleteProjectBrainInstance(id: string): Promise<boolean> {
    const result = await db.delete(projectBrainInstances)
      .where(eq(projectBrainInstances.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Mini App methods
  async getMiniApps(agentId: string): Promise<MiniApp[]> {
    const result = await db.select().from(miniApps)
      .where(eq(miniApps.agentId, parseInt(agentId)))
      .orderBy(desc(miniApps.createdAt));
    return result.map(row => ({
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      description: row.description || "",
      type: row.type as MiniApp["type"],
      config: (row.config as Record<string, any>) || {},
      icon: row.icon || "app",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async getMiniApp(id: string): Promise<MiniApp | undefined> {
    const result = await db.select().from(miniApps)
      .where(eq(miniApps.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      description: row.description || "",
      type: row.type as MiniApp["type"],
      config: (row.config as Record<string, any>) || {},
      icon: row.icon || "app",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async createMiniApp(miniApp: InsertMiniApp): Promise<MiniApp> {
    const result = await db.insert(miniApps).values({
      agentId: parseInt(miniApp.agentId),
      name: miniApp.name,
      description: miniApp.description || "",
      type: miniApp.type,
      config: miniApp.config || {},
      icon: miniApp.icon || "app",
      isActive: true,
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      description: row.description || "",
      type: row.type as MiniApp["type"],
      config: (row.config as Record<string, any>) || {},
      icon: row.icon || "app",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async updateMiniApp(id: string, data: Partial<InsertMiniApp>): Promise<MiniApp | undefined> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.config !== undefined) updateData.config = data.config;
    if (data.icon !== undefined) updateData.icon = data.icon;

    const result = await db.update(miniApps)
      .set(updateData)
      .where(eq(miniApps.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      name: row.name,
      description: row.description || "",
      type: row.type as MiniApp["type"],
      config: (row.config as Record<string, any>) || {},
      icon: row.icon || "app",
      isActive: row.isActive || false,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async deleteMiniApp(id: string): Promise<boolean> {
    const result = await db.delete(miniApps)
      .where(eq(miniApps.id, parseInt(id))).returning();
    return result.length > 0;
  }

  // Mini App Result methods
  async getMiniAppResults(miniAppId: string): Promise<MiniAppResult[]> {
    const result = await db.select().from(miniAppResults)
      .where(eq(miniAppResults.miniAppId, parseInt(miniAppId)))
      .orderBy(desc(miniAppResults.createdAt));
    return result.map(row => ({
      id: String(row.id),
      miniAppId: String(row.miniAppId),
      agentId: String(row.agentId),
      projectInstanceId: row.projectInstanceId ? String(row.projectInstanceId) : undefined,
      input: (row.input as Record<string, any>) || {},
      output: (row.output as Record<string, any>) || {},
      status: (row.status || "completed") as "pending" | "completed" | "error",
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createMiniAppResult(resultData: InsertMiniAppResult): Promise<MiniAppResult> {
    const result = await db.insert(miniAppResults).values({
      miniAppId: parseInt(resultData.miniAppId),
      agentId: parseInt(resultData.agentId),
      projectInstanceId: resultData.projectInstanceId ? parseInt(resultData.projectInstanceId) : null,
      input: resultData.input || {},
      output: resultData.output || {},
      status: resultData.status || "completed",
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      miniAppId: String(row.miniAppId),
      agentId: String(row.agentId),
      projectInstanceId: row.projectInstanceId ? String(row.projectInstanceId) : undefined,
      input: (row.input as Record<string, any>) || {},
      output: (row.output as Record<string, any>) || {},
      status: (row.status || "completed") as "pending" | "completed" | "error",
      createdAt: row.createdAt.toISOString(),
    };
  }

  // Client Subscription methods
  async getClientSubscriptions(agentId: string): Promise<ClientSubscription[]> {
    const result = await db.select().from(clientSubscriptions)
      .where(eq(clientSubscriptions.agentId, parseInt(agentId)))
      .orderBy(desc(clientSubscriptions.createdAt));
    return result.map((row) => ({
      id: String(row.id),
      agentId: String(row.agentId),
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      customerPhone: row.customerPhone || "",
      plan: row.plan as "trial" | "monthly" | "yearly" | "lifetime",
      status: (row.status || "active") as "active" | "expired" | "cancelled" | "pending",
      accessToken: row.accessToken,
      mayarOrderId: row.mayarOrderId || undefined,
      mayarPaymentUrl: row.mayarPaymentUrl || undefined,
      amount: row.amount || 0,
      currency: row.currency || "IDR",
      referralCode: row.referralCode || undefined,
      startDate: row.startDate ? row.startDate.toISOString() : undefined,
      endDate: row.endDate ? row.endDate.toISOString() : undefined,
      messageUsedToday: row.messageUsedToday || 0,
      messageUsedMonth: row.messageUsedMonth || 0,
      lastMessageDate: row.lastMessageDate || null,
      lastMonthReset: row.lastMonthReset || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  async getClientSubscription(id: string): Promise<ClientSubscription | undefined> {
    const result = await db.select().from(clientSubscriptions)
      .where(eq(clientSubscriptions.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      customerPhone: row.customerPhone || "",
      plan: row.plan as "trial" | "monthly" | "yearly" | "lifetime",
      status: (row.status || "active") as "active" | "expired" | "cancelled" | "pending",
      accessToken: row.accessToken,
      mayarOrderId: row.mayarOrderId || undefined,
      mayarPaymentUrl: row.mayarPaymentUrl || undefined,
      amount: row.amount || 0,
      currency: row.currency || "IDR",
      referralCode: row.referralCode || undefined,
      startDate: row.startDate ? row.startDate.toISOString() : undefined,
      endDate: row.endDate ? row.endDate.toISOString() : undefined,
      messageUsedToday: row.messageUsedToday || 0,
      messageUsedMonth: row.messageUsedMonth || 0,
      lastMessageDate: row.lastMessageDate || null,
      lastMonthReset: row.lastMonthReset || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async getClientSubscriptionByToken(token: string): Promise<ClientSubscription | undefined> {
    const result = await db.select().from(clientSubscriptions)
      .where(eq(clientSubscriptions.accessToken, token)).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      customerPhone: row.customerPhone || "",
      plan: row.plan as "trial" | "monthly" | "yearly" | "lifetime",
      status: (row.status || "active") as "active" | "expired" | "cancelled" | "pending",
      accessToken: row.accessToken,
      mayarOrderId: row.mayarOrderId || undefined,
      mayarPaymentUrl: row.mayarPaymentUrl || undefined,
      amount: row.amount || 0,
      currency: row.currency || "IDR",
      referralCode: row.referralCode || undefined,
      startDate: row.startDate ? row.startDate.toISOString() : undefined,
      endDate: row.endDate ? row.endDate.toISOString() : undefined,
      messageUsedToday: row.messageUsedToday || 0,
      messageUsedMonth: row.messageUsedMonth || 0,
      lastMessageDate: row.lastMessageDate || null,
      lastMonthReset: row.lastMonthReset || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async getClientSubscriptionByEmail(agentId: string, email: string): Promise<ClientSubscription | undefined> {
    const result = await db.select().from(clientSubscriptions)
      .where(and(
        eq(clientSubscriptions.agentId, parseInt(agentId)),
        eq(clientSubscriptions.customerEmail, email)
      )).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      customerPhone: row.customerPhone || "",
      plan: row.plan as "trial" | "monthly" | "yearly" | "lifetime",
      status: (row.status || "active") as "active" | "expired" | "cancelled" | "pending",
      accessToken: row.accessToken,
      mayarOrderId: row.mayarOrderId || undefined,
      mayarPaymentUrl: row.mayarPaymentUrl || undefined,
      amount: row.amount || 0,
      currency: row.currency || "IDR",
      referralCode: row.referralCode || undefined,
      startDate: row.startDate ? row.startDate.toISOString() : undefined,
      endDate: row.endDate ? row.endDate.toISOString() : undefined,
      messageUsedToday: row.messageUsedToday || 0,
      messageUsedMonth: row.messageUsedMonth || 0,
      lastMessageDate: row.lastMessageDate || null,
      lastMonthReset: row.lastMonthReset || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async createClientSubscription(insertSub: InsertClientSubscription): Promise<ClientSubscription> {
    const result = await db.insert(clientSubscriptions).values({
      agentId: parseInt(insertSub.agentId),
      customerName: insertSub.customerName,
      customerEmail: insertSub.customerEmail,
      customerPhone: insertSub.customerPhone || "",
      plan: insertSub.plan || "trial",
      status: insertSub.status || "active",
      accessToken: insertSub.accessToken,
      mayarOrderId: insertSub.mayarOrderId || null,
      mayarPaymentUrl: insertSub.mayarPaymentUrl || null,
      amount: insertSub.amount || 0,
      currency: insertSub.currency || "IDR",
      referralCode: insertSub.referralCode || null,
      startDate: insertSub.startDate ? new Date(insertSub.startDate) : null,
      endDate: insertSub.endDate ? new Date(insertSub.endDate) : null,
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      customerPhone: row.customerPhone || "",
      plan: row.plan as "trial" | "monthly" | "yearly" | "lifetime",
      status: (row.status || "active") as "active" | "expired" | "cancelled" | "pending",
      accessToken: row.accessToken,
      mayarOrderId: row.mayarOrderId || undefined,
      mayarPaymentUrl: row.mayarPaymentUrl || undefined,
      amount: row.amount || 0,
      currency: row.currency || "IDR",
      referralCode: row.referralCode || undefined,
      startDate: row.startDate ? row.startDate.toISOString() : undefined,
      endDate: row.endDate ? row.endDate.toISOString() : undefined,
      messageUsedToday: row.messageUsedToday || 0,
      messageUsedMonth: row.messageUsedMonth || 0,
      lastMessageDate: row.lastMessageDate || null,
      lastMonthReset: row.lastMonthReset || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async updateClientSubscription(id: string, data: Partial<InsertClientSubscription & { messageUsedToday: number; messageUsedMonth: number; lastMessageDate: string; lastMonthReset: string }>): Promise<ClientSubscription | undefined> {
    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (data.customerName !== undefined) updateData.customerName = data.customerName;
    if (data.customerEmail !== undefined) updateData.customerEmail = data.customerEmail;
    if (data.customerPhone !== undefined) updateData.customerPhone = data.customerPhone;
    if (data.plan !== undefined) updateData.plan = data.plan;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.accessToken !== undefined) updateData.accessToken = data.accessToken;
    if (data.mayarOrderId !== undefined) updateData.mayarOrderId = data.mayarOrderId;
    if (data.mayarPaymentUrl !== undefined) updateData.mayarPaymentUrl = data.mayarPaymentUrl;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.referralCode !== undefined) updateData.referralCode = data.referralCode;
    if (data.messageUsedToday !== undefined) updateData.messageUsedToday = data.messageUsedToday;
    if (data.messageUsedMonth !== undefined) updateData.messageUsedMonth = data.messageUsedMonth;
    if (data.lastMessageDate !== undefined) updateData.lastMessageDate = data.lastMessageDate;
    if (data.lastMonthReset !== undefined) updateData.lastMonthReset = data.lastMonthReset;

    const result = await db.update(clientSubscriptions).set(updateData)
      .where(eq(clientSubscriptions.id, parseInt(id))).returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      agentId: String(row.agentId),
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      customerPhone: row.customerPhone || "",
      plan: row.plan as "trial" | "monthly" | "yearly" | "lifetime",
      status: (row.status || "active") as "active" | "expired" | "cancelled" | "pending",
      accessToken: row.accessToken,
      mayarOrderId: row.mayarOrderId || undefined,
      mayarPaymentUrl: row.mayarPaymentUrl || undefined,
      amount: row.amount || 0,
      currency: row.currency || "IDR",
      referralCode: row.referralCode || undefined,
      startDate: row.startDate ? row.startDate.toISOString() : undefined,
      endDate: row.endDate ? row.endDate.toISOString() : undefined,
      messageUsedToday: row.messageUsedToday || 0,
      messageUsedMonth: row.messageUsedMonth || 0,
      lastMessageDate: row.lastMessageDate || null,
      lastMonthReset: row.lastMonthReset || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async deleteClientSubscription(id: string): Promise<boolean> {
    const result = await db.delete(clientSubscriptions)
      .where(eq(clientSubscriptions.id, parseInt(id))).returning();
    return result.length > 0;
  }

  async incrementClientMessageUsage(id: string): Promise<ClientSubscription | undefined> {
    const sub = await this.getClientSubscription(id);
    if (!sub) return undefined;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentMonth = today.substring(0, 7);

    let messageUsedToday = sub.messageUsedToday;
    let messageUsedMonth = sub.messageUsedMonth;

    if (sub.lastMessageDate !== today) {
      messageUsedToday = 0;
    }
    if (!sub.lastMonthReset || sub.lastMonthReset.substring(0, 7) !== currentMonth) {
      messageUsedMonth = 0;
    }

    messageUsedToday += 1;
    messageUsedMonth += 1;

    return this.updateClientSubscription(id, {
      messageUsedToday,
      messageUsedMonth,
      lastMessageDate: today,
      lastMonthReset: today,
    });
  }

  async getClientSubscriptionStats(agentId: string): Promise<{ totalClients: number; activeClients: number; totalRevenue: number }> {
    const subs = await this.getClientSubscriptions(agentId);
    const totalClients = subs.length;
    const activeClients = subs.filter((sub) => sub.status === "active").length;
    const totalRevenue = subs.reduce((sum, sub) => sum + (sub.amount || 0), 0);
    return { totalClients, activeClients, totalRevenue };
  }

  // Affiliate methods
  async getAffiliates(): Promise<Affiliate[]> {
    const result = await db.select().from(affiliates).orderBy(desc(affiliates.createdAt));
    return result.map((row) => ({
      id: String(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      code: row.code,
      commissionRate: row.commissionRate || 10,
      payoutInfo: row.payoutInfo || "",
      totalEarnings: row.totalEarnings || 0,
      totalReferrals: row.totalReferrals || 0,
      isActive: row.isActive ?? true,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async getAffiliate(id: string): Promise<Affiliate | undefined> {
    const result = await db.select().from(affiliates)
      .where(eq(affiliates.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      code: row.code,
      commissionRate: row.commissionRate || 10,
      payoutInfo: row.payoutInfo || "",
      totalEarnings: row.totalEarnings || 0,
      totalReferrals: row.totalReferrals || 0,
      isActive: row.isActive ?? true,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getAffiliateByCode(code: string): Promise<Affiliate | undefined> {
    const result = await db.select().from(affiliates)
      .where(eq(affiliates.code, code)).limit(1);
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      code: row.code,
      commissionRate: row.commissionRate || 10,
      payoutInfo: row.payoutInfo || "",
      totalEarnings: row.totalEarnings || 0,
      totalReferrals: row.totalReferrals || 0,
      isActive: row.isActive ?? true,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async createAffiliate(insertAffiliate: InsertAffiliate): Promise<Affiliate> {
    const result = await db.insert(affiliates).values({
      name: insertAffiliate.name,
      email: insertAffiliate.email,
      phone: insertAffiliate.phone || "",
      code: insertAffiliate.code,
      commissionRate: insertAffiliate.commissionRate ?? 10,
      payoutInfo: insertAffiliate.payoutInfo || "",
    }).returning();
    const row = result[0];
    return {
      id: String(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      code: row.code,
      commissionRate: row.commissionRate || 10,
      payoutInfo: row.payoutInfo || "",
      totalEarnings: row.totalEarnings || 0,
      totalReferrals: row.totalReferrals || 0,
      isActive: row.isActive ?? true,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async updateAffiliate(id: string, data: Partial<InsertAffiliate>): Promise<Affiliate | undefined> {
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.commissionRate !== undefined) updateData.commissionRate = data.commissionRate;
    if (data.payoutInfo !== undefined) updateData.payoutInfo = data.payoutInfo;

    const result = await db.update(affiliates).set(updateData)
      .where(eq(affiliates.id, parseInt(id))).returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      code: row.code,
      commissionRate: row.commissionRate || 10,
      payoutInfo: row.payoutInfo || "",
      totalEarnings: row.totalEarnings || 0,
      totalReferrals: row.totalReferrals || 0,
      isActive: row.isActive ?? true,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async deleteAffiliate(id: string): Promise<boolean> {
    const result = await db.delete(affiliates)
      .where(eq(affiliates.id, parseInt(id))).returning();
    return result.length > 0;
  }

  async incrementAffiliateReferral(code: string, amount: number): Promise<Affiliate | undefined> {
    const affiliate = await this.getAffiliateByCode(code);
    if (!affiliate) return undefined;

    const commission = amount * (affiliate.commissionRate / 100);
    const result = await db.update(affiliates).set({
      totalReferrals: (affiliate.totalReferrals || 0) + 1,
      totalEarnings: (affiliate.totalEarnings || 0) + commission,
    }).where(eq(affiliates.code, code)).returning();
    if (result.length === 0) return undefined;
    const row = result[0];
    return {
      id: String(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      code: row.code,
      commissionRate: row.commissionRate || 10,
      payoutInfo: row.payoutInfo || "",
      totalEarnings: row.totalEarnings || 0,
      totalReferrals: row.totalReferrals || 0,
      isActive: row.isActive ?? true,
      createdAt: row.createdAt.toISOString(),
    };
  }

  // Product listing methods
  async getListedAgents(): Promise<Agent[]> {
    const result = await db.select().from(agents).where(eq(agents.isListed, true));
    return result.map((row) => this.mapAgentRow(row));
  }

  async getAgentBySlug(slug: string): Promise<Agent | undefined> {
    const result = await db.select().from(agents)
      .where(eq(agents.productSlug, slug)).limit(1);
    if (result.length === 0) return undefined;
    return this.mapAgentRow(result[0]);
  }

  private mapVoucherRow(row: any): Voucher {
    return {
      id: row.id,
      agentId: row.agentId,
      code: row.code,
      name: row.name,
      type: row.type || "unlimited",
      extraMessages: row.extraMessages || 0,
      durationDays: row.durationDays || 30,
      maxRedemptions: row.maxRedemptions || 0,
      totalRedeemed: row.totalRedeemed || 0,
      isActive: row.isActive ?? true,
      expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getVouchers(agentId?: string): Promise<Voucher[]> {
    let result;
    if (agentId) {
      result = await db.select().from(vouchers)
        .where(eq(vouchers.agentId, parseInt(agentId)))
        .orderBy(desc(vouchers.createdAt));
    } else {
      result = await db.select().from(vouchers)
        .orderBy(desc(vouchers.createdAt));
    }
    return result.map((row) => this.mapVoucherRow(row));
  }

  async getVoucher(id: string): Promise<Voucher | undefined> {
    const result = await db.select().from(vouchers)
      .where(eq(vouchers.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    return this.mapVoucherRow(result[0]);
  }

  async getVoucherByCode(code: string): Promise<Voucher | undefined> {
    const result = await db.select().from(vouchers)
      .where(eq(vouchers.code, code.toUpperCase())).limit(1);
    if (result.length === 0) return undefined;
    return this.mapVoucherRow(result[0]);
  }

  async createVoucher(voucher: InsertVoucher): Promise<Voucher> {
    const result = await db.insert(vouchers).values({
      agentId: voucher.agentId || null,
      code: voucher.code.toUpperCase(),
      name: voucher.name,
      type: voucher.type || "unlimited",
      extraMessages: voucher.extraMessages || 0,
      durationDays: voucher.durationDays || 30,
      maxRedemptions: voucher.maxRedemptions || 0,
      isActive: voucher.isActive ?? true,
      expiresAt: voucher.expiresAt ? new Date(voucher.expiresAt) : null,
    }).returning();
    return this.mapVoucherRow(result[0]);
  }

  async updateVoucher(id: string, data: Partial<InsertVoucher>): Promise<Voucher | undefined> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code.toUpperCase();
    if (data.type !== undefined) updateData.type = data.type;
    if (data.extraMessages !== undefined) updateData.extraMessages = data.extraMessages;
    if (data.durationDays !== undefined) updateData.durationDays = data.durationDays;
    if (data.maxRedemptions !== undefined) updateData.maxRedemptions = data.maxRedemptions;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.agentId !== undefined) updateData.agentId = data.agentId;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

    const result = await db.update(vouchers)
      .set(updateData)
      .where(eq(vouchers.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapVoucherRow(result[0]);
  }

  async deleteVoucher(id: string): Promise<boolean> {
    await db.delete(voucherRedemptions).where(eq(voucherRedemptions.voucherId, parseInt(id)));
    const result = await db.delete(vouchers).where(eq(vouchers.id, parseInt(id))).returning();
    return result.length > 0;
  }

  async redeemVoucher(voucherId: number, clientSubscriptionId: number): Promise<VoucherRedemption> {
    await db.update(vouchers)
      .set({ totalRedeemed: sql`${vouchers.totalRedeemed} + 1` })
      .where(eq(vouchers.id, voucherId));

    const result = await db.insert(voucherRedemptions).values({
      voucherId,
      clientSubscriptionId,
    }).returning();

    return {
      id: result[0].id,
      voucherId: result[0].voucherId,
      clientSubscriptionId: result[0].clientSubscriptionId,
      redeemedAt: result[0].redeemedAt.toISOString(),
    };
  }

  async getVoucherRedemptions(voucherId: string): Promise<VoucherRedemption[]> {
    const result = await db.select().from(voucherRedemptions)
      .where(eq(voucherRedemptions.voucherId, parseInt(voucherId)))
      .orderBy(desc(voucherRedemptions.redeemedAt));
    return result.map((row) => ({
      id: row.id,
      voucherId: row.voucherId,
      clientSubscriptionId: row.clientSubscriptionId,
      redeemedAt: row.redeemedAt.toISOString(),
    }));
  }

  async getClientVoucherRedemptions(clientSubscriptionId: number): Promise<(VoucherRedemption & { voucher?: Voucher })[]> {
    const result = await db.select().from(voucherRedemptions)
      .where(eq(voucherRedemptions.clientSubscriptionId, clientSubscriptionId))
      .orderBy(desc(voucherRedemptions.redeemedAt));

    const redemptions: (VoucherRedemption & { voucher?: Voucher })[] = [];
    for (const row of result) {
      const voucherResult = await db.select().from(vouchers)
        .where(eq(vouchers.id, row.voucherId)).limit(1);
      redemptions.push({
        id: row.id,
        voucherId: row.voucherId,
        clientSubscriptionId: row.clientSubscriptionId,
        redeemedAt: row.redeemedAt.toISOString(),
        voucher: voucherResult.length > 0 ? this.mapVoucherRow(voucherResult[0]) : undefined,
      });
    }
    return redemptions;
  }
  // User Memory methods
  async getUserMemories(agentId: string, sessionId?: string): Promise<UserMemory[]> {
    const conditions = [eq(userMemories.agentId, Number(agentId))];
    if (sessionId) conditions.push(eq(userMemories.sessionId, sessionId));
    const result = await db.select().from(userMemories)
      .where(and(...conditions))
      .orderBy(desc(userMemories.createdAt));
    return result;
  }

  async createUserMemory(memory: InsertUserMemory): Promise<UserMemory> {
    const [result] = await db.insert(userMemories).values({
      agentId: memory.agentId,
      sessionId: memory.sessionId || "",
      category: memory.category || "memory",
      content: memory.content,
    }).returning();
    return result;
  }

  async deleteUserMemory(id: string): Promise<boolean> {
    const result = await db.delete(userMemories).where(eq(userMemories.id, Number(id)));
    return (result.rowCount ?? 0) > 0;
  }

  async deleteUserMemoriesByAgent(agentId: string, sessionId?: string): Promise<boolean> {
    const conditions = [eq(userMemories.agentId, Number(agentId))];
    if (sessionId) conditions.push(eq(userMemories.sessionId, sessionId));
    await db.delete(userMemories).where(and(...conditions));
    return true;
  }

  async getWaContacts(agentId: string): Promise<WaContact[]> {
    return db.select().from(waContacts)
      .where(eq(waContacts.agentId, Number(agentId)))
      .orderBy(desc(waContacts.lastSeenAt));
  }

  async getWaContact(id: string): Promise<WaContact | undefined> {
    const [result] = await db.select().from(waContacts).where(eq(waContacts.id, Number(id)));
    return result;
  }

  async upsertWaContact(contact: InsertWaContact): Promise<WaContact> {
    const existing = await db.select().from(waContacts)
      .where(and(
        eq(waContacts.agentId, contact.agentId),
        eq(waContacts.phone, contact.phone)
      ));
    if (existing.length > 0) {
      const [updated] = await db.update(waContacts)
        .set({ lastSeenAt: new Date(), name: contact.name || existing[0].name })
        .where(eq(waContacts.id, existing[0].id))
        .returning();
      return updated;
    }
    const [result] = await db.insert(waContacts).values({
      agentId: contact.agentId,
      phone: contact.phone,
      name: contact.name || "",
      source: contact.source || "webhook",
    }).returning();
    return result;
  }

  async updateWaContact(id: string, data: Partial<InsertWaContact>): Promise<WaContact | undefined> {
    const [result] = await db.update(waContacts).set(data).where(eq(waContacts.id, Number(id))).returning();
    return result;
  }

  async deleteWaContact(id: string): Promise<boolean> {
    const result = await db.delete(waContacts).where(eq(waContacts.id, Number(id)));
    return (result.rowCount ?? 0) > 0;
  }

  async getWaBroadcasts(agentId?: string): Promise<WaBroadcast[]> {
    if (agentId) {
      return db.select().from(waBroadcasts)
        .where(eq(waBroadcasts.agentId, Number(agentId)))
        .orderBy(desc(waBroadcasts.createdAt));
    }
    return db.select().from(waBroadcasts).orderBy(desc(waBroadcasts.createdAt));
  }

  async getWaBroadcast(id: string): Promise<WaBroadcast | undefined> {
    const [result] = await db.select().from(waBroadcasts).where(eq(waBroadcasts.id, Number(id)));
    return result;
  }

  async getDueBroadcasts(): Promise<WaBroadcast[]> {
    return db.select().from(waBroadcasts)
      .where(and(
        eq(waBroadcasts.isEnabled, true),
        sql`${waBroadcasts.nextRunAt} <= NOW()`
      ));
  }

  async createWaBroadcast(broadcast: InsertWaBroadcast): Promise<WaBroadcast> {
    const [result] = await db.insert(waBroadcasts).values(broadcast as any).returning();
    return result;
  }

  async updateWaBroadcast(id: string, data: Partial<InsertWaBroadcast>): Promise<WaBroadcast | undefined> {
    const [result] = await db.update(waBroadcasts).set(data as any).where(eq(waBroadcasts.id, Number(id))).returning();
    return result;
  }

  async deleteWaBroadcast(id: string): Promise<boolean> {
    const result = await db.delete(waBroadcasts).where(eq(waBroadcasts.id, Number(id)));
    return (result.rowCount ?? 0) > 0;
  }

  async createBroadcastRun(run: Partial<WaBroadcastRun>): Promise<WaBroadcastRun> {
    const [result] = await db.insert(waBroadcastRuns).values(run as any).returning();
    return result;
  }

  async updateBroadcastRun(id: string, data: Partial<WaBroadcastRun>): Promise<WaBroadcastRun | undefined> {
    const [result] = await db.update(waBroadcastRuns).set(data as any).where(eq(waBroadcastRuns.id, Number(id))).returning();
    return result;
  }

  async getBroadcastRuns(broadcastId: string): Promise<WaBroadcastRun[]> {
    return db.select().from(waBroadcastRuns)
      .where(eq(waBroadcastRuns.broadcastId, Number(broadcastId)))
      .orderBy(desc(waBroadcastRuns.runAt));
  }

  async getTenderSources(): Promise<TenderSource[]> {
    return db.select().from(tenderSources).orderBy(desc(tenderSources.createdAt));
  }

  async getTenderSource(id: string): Promise<TenderSource | undefined> {
    const [result] = await db.select().from(tenderSources).where(eq(tenderSources.id, Number(id)));
    return result;
  }

  async createTenderSource(source: InsertTenderSource): Promise<TenderSource> {
    const [result] = await db.insert(tenderSources).values(source as any).returning();
    return result;
  }

  async updateTenderSource(id: string, data: Partial<InsertTenderSource>): Promise<TenderSource | undefined> {
    const [result] = await db.update(tenderSources).set(data as any).where(eq(tenderSources.id, Number(id))).returning();
    return result;
  }

  async deleteTenderSource(id: string): Promise<boolean> {
    const result = await db.delete(tenderSources).where(eq(tenderSources.id, Number(id)));
    return (result.rowCount ?? 0) > 0;
  }

  async getTenders(sourceId?: string, limit?: number): Promise<Tender[]> {
    let query = db.select().from(tenders);
    if (sourceId) {
      query = query.where(eq(tenders.sourceId, Number(sourceId))) as any;
    }
    query = query.orderBy(desc(tenders.createdAt)) as any;
    if (limit) {
      query = query.limit(limit) as any;
    }
    return query;
  }

  async getTender(id: string): Promise<Tender | undefined> {
    const [result] = await db.select().from(tenders).where(eq(tenders.id, Number(id)));
    return result;
  }

  async upsertTender(tender: InsertTender): Promise<Tender> {
    const existing = await db.select().from(tenders)
      .where(and(
        eq(tenders.sourceId, tender.sourceId),
        eq(tenders.tenderId, tender.tenderId)
      ));
    if (existing.length > 0) {
      const [updated] = await db.update(tenders)
        .set({ ...tender, updatedAt: new Date() } as any)
        .where(eq(tenders.id, existing[0].id))
        .returning();
      return updated;
    }
    const [result] = await db.insert(tenders).values(tender as any).returning();
    return result;
  }

  async getLatestTenders(limit: number = 20): Promise<Tender[]> {
    return db.select().from(tenders)
      .orderBy(desc(tenders.createdAt))
      .limit(limit);
  }

  async deleteTender(id: string): Promise<boolean> {
    const result = await db.delete(tenders).where(eq(tenders.id, Number(id)));
    return (result.rowCount ?? 0) > 0;
  }

  // Lead methods
  private mapLeadRow(row: any): Lead {
    return {
      id: row.id,
      agentId: row.agentId,
      sessionId: row.sessionId || "",
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      company: row.company || "",
      source: (row.source || "chat") as Lead["source"],
      status: (row.status || "new") as Lead["status"],
      score: row.score || 0,
      scoreBreakdown: (row.scoreBreakdown as Record<string, any>) || {},
      metadata: (row.metadata as Record<string, any>) || {},
      notes: row.notes || "",
      convertedAt: row.convertedAt ? row.convertedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getLeads(agentId: string): Promise<Lead[]> {
    const result = await db.select().from(leads)
      .where(eq(leads.agentId, parseInt(agentId)))
      .orderBy(desc(leads.createdAt));
    return result.map(row => this.mapLeadRow(row));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads)
      .where(eq(leads.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    return this.mapLeadRow(result[0]);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values({
      agentId: lead.agentId,
      sessionId: lead.sessionId || "",
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source || "chat",
      status: lead.status || "new",
      score: lead.score || 0,
      scoreBreakdown: lead.scoreBreakdown || {},
      metadata: lead.metadata || {},
      notes: lead.notes || "",
    }).returning();
    return this.mapLeadRow(result[0]);
  }

  async updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.score !== undefined) updateData.score = data.score;
    if (data.scoreBreakdown !== undefined) updateData.scoreBreakdown = data.scoreBreakdown;
    if (data.metadata !== undefined) updateData.metadata = data.metadata;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const result = await db.update(leads)
      .set(updateData)
      .where(eq(leads.id, parseInt(id)))
      .returning();
    if (result.length === 0) return undefined;
    return this.mapLeadRow(result[0]);
  }

  async deleteLead(id: string): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, parseInt(id)));
    return (result.rowCount ?? 0) > 0;
  }

  async getLeadsBySession(agentId: string, sessionId: string): Promise<Lead[]> {
    const result = await db.select().from(leads)
      .where(and(
        eq(leads.agentId, parseInt(agentId)),
        eq(leads.sessionId, sessionId)
      ))
      .orderBy(desc(leads.createdAt));
    return result.map(row => this.mapLeadRow(row));
  }

  // Scoring Result methods
  private mapScoringResultRow(row: any): ScoringResult {
    return {
      id: row.id,
      agentId: row.agentId,
      sessionId: row.sessionId || "",
      leadId: row.leadId || undefined,
      totalScore: row.totalScore || 0,
      maxScore: row.maxScore || 100,
      level: (row.level || "low") as ScoringResult["level"],
      breakdown: (row.breakdown as any[]) || [],
      recommendations: (row.recommendations as any[]) || [],
      gapAnalysis: (row.gapAnalysis as any[]) || [],
      metadata: (row.metadata as Record<string, any>) || {},
      createdAt: row.createdAt.toISOString(),
    };
  }

  async getScoringResults(agentId: string): Promise<ScoringResult[]> {
    const result = await db.select().from(scoringResults)
      .where(eq(scoringResults.agentId, parseInt(agentId)))
      .orderBy(desc(scoringResults.createdAt));
    return result.map(row => this.mapScoringResultRow(row));
  }

  async getScoringResult(id: string): Promise<ScoringResult | undefined> {
    const result = await db.select().from(scoringResults)
      .where(eq(scoringResults.id, parseInt(id))).limit(1);
    if (result.length === 0) return undefined;
    return this.mapScoringResultRow(result[0]);
  }

  async createScoringResult(resultData: InsertScoringResult): Promise<ScoringResult> {
    const result = await db.insert(scoringResults).values({
      agentId: resultData.agentId,
      sessionId: resultData.sessionId || "",
      leadId: resultData.leadId || null,
      totalScore: resultData.totalScore || 0,
      maxScore: resultData.maxScore || 100,
      level: resultData.level || "low",
      breakdown: resultData.breakdown || [],
      recommendations: resultData.recommendations || [],
      gapAnalysis: resultData.gapAnalysis || [],
      metadata: resultData.metadata || {},
    }).returning();
    return this.mapScoringResultRow(result[0]);
  }

  async getScoringResultsBySession(agentId: string, sessionId: string): Promise<ScoringResult[]> {
    const result = await db.select().from(scoringResults)
      .where(and(
        eq(scoringResults.agentId, parseInt(agentId)),
        eq(scoringResults.sessionId, sessionId)
      ))
      .orderBy(desc(scoringResults.createdAt));
    return result.map(row => this.mapScoringResultRow(row));
  }
}

export const dbStorage = new DatabaseStorage();
