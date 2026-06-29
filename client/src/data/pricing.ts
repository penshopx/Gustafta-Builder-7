/**
 * Gustafta — Sumber Data Tunggal untuk Harga & Produk
 *
 * Semua angka harga, tier layanan jasa, dan kredit pesan didefinisikan DI SINI.
 * Halaman /produk, /packs, /store, /store-featured WAJIB mengambil dari file ini
 * agar harga & penamaan selalu konsisten di seluruh aplikasi.
 *
 * Aturan kanonik (jangan dilanggar):
 * - Produk chatbot = LISENSI saja (tanpa biaya setup wajib).
 * - Layanan jasa (dirakit tim) = ada biaya SETUP sekali bayar.
 * - Tidak ada paket "Gratis" permanen — gratis hanya bonus trial 7 hari.
 */

// ─── Harga inti ────────────────────────────────────────────────────────────────
export const PRICING = {
  license: {
    /** Harga coret (anchor) sebelum diskon */
    normal: "Rp 450.000",
    /** Harga lisensi sekali bayar */
    price: "Rp 299.000",
    amount: 299000,
  },
  starterKit: {
    price: "Rp 245.000",
    amount: 245000,
    trialDays: 7,
  },
  setup: {
    price: "Rp 999.000",
    amount: 999000,
  },
  subscription: {
    starter: { label: "Rp 199.000", perMonth: "Rp 199rb/bln", amount: 199000 },
    profesional: { label: "Rp 499.000", perMonth: "Rp 499rb/bln", amount: 499000 },
    bisnis: { label: "Rp 999.000", perMonth: "Rp 999rb/bln", amount: 999000 },
  },
} as const;

/** Kalimat info skema lisensi (dipakai berulang di kartu paket bisnis) */
export const LICENSE_INFO = `Dengan Starter Kit ${PRICING.starterKit.price} (sekali) → lisensi Rp 0 · Tanpa Starter Kit → lisensi ${PRICING.license.price} (sekali)`;

// ─── Hosting / Paket Berlangganan ────────────────────────────────────────────────
export const HOSTING = {
  monthly: "Rp 199.000/bln",
  quarterly: "Rp 299.000/3bln",
  semiannual: "Rp 999.000/6bln",
  annual: "Rp 1.999.000/thn",
} as const;

/** Ringkasan periode hosting untuk strip info, mis. di /packs */
export const HOSTING_SUMMARY = `${HOSTING.monthly} · ${HOSTING.quarterly} · ${HOSTING.semiannual} · ${HOSTING.annual}`;

/** Rentang singkat hosting untuk kartu tier */
export const HOSTING_RANGE = "Rp 199rb–1.999rb/periode";

// ─── Tier Layanan Jasa (dirakit tim Gustafta) ────────────────────────────────────
// CANONICAL: 4 tier. Dipakai di /packs (dan halaman manapun yang menampilkan harga jasa).
export interface ServiceTier {
  tier: string;
  jasaKey: string;
  price: string;
  scope: string;
  desc: string;
  tag: string;
  tagClass: string;
  highlight: boolean;
}

export const SERVICE_TIERS: ServiceTier[] = [
  {
    tier: "Tier 1",
    jasaKey: "tier1",
    price: "Rp 1.499.000",
    scope: "Chatbot Dasar",
    desc: "Chatbot ringan — FAQ, info produk, layanan dasar",
    tag: "Mulai",
    tagClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    highlight: false,
  },
  {
    tier: "Tier 2",
    jasaKey: "tier2",
    price: "Rp 2.499.000",
    scope: "Chatbot Menengah",
    desc: "Chatbot menengah — multi-fungsi, lead gen, sales assist",
    tag: "Populer",
    tagClass: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    highlight: true,
  },
  {
    tier: "Tier 3",
    jasaKey: "tier3",
    price: "Rp 4.900.000",
    scope: "Chatbot Kompleks",
    desc: "Chatbot kompleks — orkestrasi, knowledge base luas",
    tag: "Bisnis",
    tagClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    highlight: false,
  },
  {
    tier: "Tier 4",
    jasaKey: "tier4",
    price: "Rp 7.490.000",
    scope: "Chatbot Enterprise",
    desc: "Chatbot enterprise — multi-domain, agentic penuh",
    tag: "Enterprise",
    tagClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    highlight: false,
  },
];

// ─── Kredit Pesan Ekstra (top-up) ────────────────────────────────────────────────
export interface CreditPack {
  label: string;
  pesan: string;
  price: string;
  perPesan: string;
  color: string;
  border: string;
  bg: string;
  badge: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    label: "Pack S",
    pesan: "500 pesan",
    price: "Rp 49.000",
    perPesan: "Rp 98/pesan",
    color: "text-blue-500",
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    badge: "",
  },
  {
    label: "Pack M",
    pesan: "1.500 pesan",
    price: "Rp 129.000",
    perPesan: "Rp 86/pesan",
    color: "text-indigo-500",
    border: "border-indigo-200 dark:border-indigo-800",
    bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
    badge: "PALING LAKU",
  },
  {
    label: "Pack L",
    pesan: "3.000 pesan",
    price: "Rp 229.000",
    perPesan: "Rp 76/pesan",
    color: "text-violet-500",
    border: "border-violet-200 dark:border-violet-800",
    bg: "bg-violet-50/50 dark:bg-violet-950/20",
    badge: "",
  },
  {
    label: "Pack XL",
    pesan: "5.000 pesan",
    price: "Rp 349.000",
    perPesan: "Rp 70/pesan",
    color: "text-purple-500",
    border: "border-purple-200 dark:border-purple-800",
    bg: "bg-purple-50/50 dark:bg-purple-950/20",
    badge: "TERBAIK",
  },
];

/** Format angka rupiah penuh, mis. 299000 → "Rp 299.000" */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
