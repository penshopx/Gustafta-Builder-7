/**
 * GUSTAFTA APPS — Feature Plans (Shared Config)
 * Source of truth untuk fitur yang tersedia per paket.
 * Digunakan di server (middleware) dan client (FeatureGate).
 */

export type FeatureKey =
  | "chatbot"
  | "modul_pembelajaran"
  | "mini_apps"
  | "ecourse"
  | "doc_generator"
  | "podcast"
  | "custom_domain"
  | "white_label"
  | "priority_support"
  | "api_access";

export type PlanTier = "free" | "starter" | "profesional" | "bisnis" | "enterprise";

export interface PlanConfig {
  name: string;
  badge: string;
  tier: number; // 0=free, 1=starter, 2=pro, 3=bisnis, 4=enterprise
  setupFee: number;    // IDR, one-time
  monthlyFee: number;  // IDR/bulan
  maxAgents: number;       // -1 = unlimited
  maxSeries: number;       // -1 = unlimited
  maxMiniAppTypes: number; // -1 = unlimited
  maxMessagesPerMonth: number; // -1 = unlimited
  maxCustomDomains: number;    // -1 = unlimited
  features: Record<FeatureKey, boolean>;
  color: string;
  description: string;
}

export const PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  free: {
    name: "Gratis",
    badge: "GRATIS",
    tier: 0,
    setupFee: 0,
    monthlyFee: 0,
    maxAgents: 3,
    maxSeries: 1,
    maxMiniAppTypes: 3,
    maxMessagesPerMonth: 50,
    maxCustomDomains: 0,
    color: "#64748b",
    description: "Akses terbatas untuk trial platform",
    features: {
      chatbot: true,
      modul_pembelajaran: false,
      mini_apps: false,
      ecourse: false,
      doc_generator: false,
      podcast: false,
      custom_domain: false,
      white_label: false,
      priority_support: false,
      api_access: false,
    },
  },
  starter: {
    name: "Starter",
    badge: "STARTER",
    tier: 1,
    setupFee: 1500000,
    monthlyFee: 199000,
    maxAgents: 10,
    maxSeries: 1,
    maxMiniAppTypes: 5,
    maxMessagesPerMonth: 1000,
    maxCustomDomains: 0,
    color: "#3b82f6",
    description: "Mulai ekosistem digital Anda",
    features: {
      chatbot: true,
      modul_pembelajaran: true,
      mini_apps: true,
      ecourse: false,
      doc_generator: false,
      podcast: false,
      custom_domain: false,
      white_label: false,
      priority_support: false,
      api_access: false,
    },
  },
  profesional: {
    name: "Profesional",
    badge: "PRO",
    tier: 2,
    setupFee: 3500000,
    monthlyFee: 499000,
    maxAgents: 50,
    maxSeries: 3,
    maxMiniAppTypes: 15,
    maxMessagesPerMonth: 5000,
    maxCustomDomains: 1,
    color: "#6366f1",
    description: "Ekosistem lengkap untuk kreator",
    features: {
      chatbot: true,
      modul_pembelajaran: true,
      mini_apps: true,
      ecourse: true,
      doc_generator: true,
      podcast: false,
      custom_domain: true,
      white_label: false,
      priority_support: false,
      api_access: false,
    },
  },
  bisnis: {
    name: "Bisnis",
    badge: "BISNIS",
    tier: 3,
    setupFee: 7500000,
    monthlyFee: 999000,
    maxAgents: 200,
    maxSeries: 10,
    maxMiniAppTypes: 33,
    maxMessagesPerMonth: 20000,
    maxCustomDomains: 3,
    color: "#8b5cf6",
    description: "Platform penuh untuk institusi",
    features: {
      chatbot: true,
      modul_pembelajaran: true,
      mini_apps: true,
      ecourse: true,
      doc_generator: true,
      podcast: true,
      custom_domain: true,
      white_label: true,
      priority_support: true,
      api_access: false,
    },
  },
  enterprise: {
    name: "Enterprise",
    badge: "ENTERPRISE",
    tier: 4,
    setupFee: 0, // custom/negotiated
    monthlyFee: 0, // custom
    maxAgents: -1,
    maxSeries: -1,
    maxMiniAppTypes: -1,
    maxMessagesPerMonth: -1,
    maxCustomDomains: -1,
    color: "#f59e0b",
    description: "Solusi skala korporat & institusi besar",
    features: {
      chatbot: true,
      modul_pembelajaran: true,
      mini_apps: true,
      ecourse: true,
      doc_generator: true,
      podcast: true,
      custom_domain: true,
      white_label: true,
      priority_support: true,
      api_access: true,
    },
  },
};

/** Map legacy plan keys → PlanTier */
export const LEGACY_PLAN_MAP: Record<string, PlanTier> = {
  free_trial: "starter",
  monthly_1: "starter",
  monthly_3: "profesional",
  monthly_6: "bisnis",
  monthly_12: "bisnis",
  starter: "starter",
  profesional: "profesional",
  bisnis: "bisnis",
  enterprise: "enterprise",
};

/** Resolve any plan string → PlanConfig */
export function resolvePlan(plan: string | undefined | null, isActive: boolean): PlanConfig {
  if (!plan || !isActive) return PLAN_CONFIGS.free;
  const tier = LEGACY_PLAN_MAP[plan] ?? "free";
  return PLAN_CONFIGS[tier] ?? PLAN_CONFIGS.free;
}

/** Check if planA has at least the tier of planB */
export function meetsMinPlan(userPlan: PlanTier, requiredPlan: PlanTier): boolean {
  return PLAN_CONFIGS[userPlan].tier >= PLAN_CONFIGS[requiredPlan].tier;
}

/** Feature labels for UI display */
export const FEATURE_LABELS: Record<FeatureKey, { name: string; description: string; icon: string }> = {
  chatbot: { name: "AI Chatbot", description: "Chatbot AI cerdas berbasis LLM", icon: "MessageSquare" },
  modul_pembelajaran: { name: "Modul Pembelajaran", description: "Belajar terstruktur & interaktif", icon: "BookOpen" },
  mini_apps: { name: "Mini Apps", description: "33+ tools produktivitas siap pakai", icon: "Blocks" },
  ecourse: { name: "E-Course", description: "Kursus digital yang bisa dijual", icon: "PlaySquare" },
  doc_generator: { name: "Document Generator", description: "Otomatisasi pembuatan dokumen", icon: "FileText" },
  podcast: { name: "Podcast", description: "Kelola konten audio", icon: "Mic" },
  custom_domain: { name: "Custom Domain", description: "Domain sendiri untuk platform Anda", icon: "Globe" },
  white_label: { name: "White-label", description: "Hapus branding Gustafta, tampilkan merek Anda", icon: "Shield" },
  priority_support: { name: "Priority Support", description: "Dukungan WhatsApp prioritas 1×24 jam", icon: "Headphones" },
  api_access: { name: "API Access", description: "Akses API penuh untuk integrasi", icon: "Cpu" },
};
