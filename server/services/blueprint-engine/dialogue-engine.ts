/**
 * ============================================================================
 * DIALOGUE ENGINE V2 — Tahap 5
 * ============================================================================
 *
 * Wawancara Socratic ADAPTIF untuk mengisi Blueprint (shared/blueprint/
 * blueprint-schema.ts) dengan pertanyaan SESEDIKIT MUNGKIN.
 *
 * Filosofi (sesuai roadmap "Confidence, bukan Completion"):
 *   - JANGAN menanyakan field yang sudah diketahui dengan keyakinan cukup.
 *   - Tanya HANYA field penting yang masih kosong / confidence rendah /
 *     menunggu konfirmasi (needsConfirmation).
 *   - Prioritaskan: identitas inti dulu, baru persona, baru hal opsional.
 *
 * PENTING — engine ini MURNI (pure), seperti Mapping Engine (Tahap 3):
 *   - TIDAK menyentuh DB / storage / UI. Tidak ada efek samping.
 *   - TIDAK memanggil LLM. Ia hanya MEMILIH pertanyaan & MENERAPKAN jawaban
 *     ke struktur Blueprint (mengembalikan salinan baru). Penghalusan kalimat
 *     pertanyaan dengan LLM (opsional) adalah urusan lapisan di atasnya nanti.
 *   - Belum dipanggil dari route mana pun — masih aditif, menunggu fase lanjut.
 *
 * Hubungan dengan tahap lain:
 *   - Hilir: jawaban menaikkan confidence field → siap dipetakan Mapping Engine
 *     (Tahap 3) lalu ditulis Configuration Engine (Tahap 4).
 *   - Tahap 6 (Inference) & 7 (Confidence) akan MENGISI confidence/needs
 *     Confirmation sebelum engine ini berjalan; di sini kita hanya membacanya.
 * ============================================================================
 */

import {
  type Blueprint,
  type BlueprintModuleName,
} from "@shared/blueprint/blueprint-schema";

/* ===========================================================================
 * Tipe
 * ======================================================================== */

/** Target pseudo-module "meta" → ditulis ke blueprint.meta (tanpa fieldMeta). */
type DialogueTargetModule = BlueprintModuleName | "meta";

export type DialogueInputType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "boolean"
  | "number"
  | "list"; // daftar string (pisah koma / baris baru)

export interface DialogueOption {
  value: string;
  label: string;
}

/** Satu simpul pertanyaan dalam bank pertanyaan kurasi. */
export interface DialogueNode {
  id: string;
  module: DialogueTargetModule;
  /** Key di dalam `module.data` (atau key di `meta` bila module === "meta"). */
  field: string;
  /** Tier prioritas: makin kecil makin dulu ditanya. 1=inti, 2=persona, 3=opsional. */
  priority: number;
  /** Pertanyaan dalam Bahasa Indonesia. */
  question: string;
  /** Alasan kenapa ini ditanya (boleh ditampilkan ke user). */
  why?: string;
  inputType: DialogueInputType;
  options?: DialogueOption[];
  /** Hanya tanya bila predikat ini true (mis. sub-agen hanya bila orchestrator). */
  askIf?: (bp: Blueprint) => boolean;
  /** Ubah jawaban mentah → nilai tersimpan (default: identitas + coercion tipe). */
  coerce?: (raw: any) => any;
}

export interface SelectOptions {
  /** Maksimum pertanyaan dikembalikan sekali jalan (default 3 — "sesedikit mungkin"). */
  max?: number;
  /** Ambang confidence: field dengan confidence < ini dianggap belum mantap (default 0.6). */
  minConfidence?: number;
  /** Sertakan tier opsional (priority > ESSENTIAL_MAX_PRIORITY) bila esensial sudah tuntas. */
  includeOptional?: boolean;
}

/** Pertanyaan siap-tampil (tanpa fungsi askIf/coerce internal). */
export interface DialogueQuestion {
  id: string;
  module: DialogueTargetModule;
  field: string;
  priority: number;
  question: string;
  why?: string;
  inputType: DialogueInputType;
  options?: DialogueOption[];
}

export interface DialogueState {
  /** Jumlah field esensial (tier 1–2) yang berlaku untuk Blueprint ini. */
  totalEssential: number;
  /** Berapa esensial yang sudah diketahui dengan cukup. */
  answeredEssential: number;
  /** Sisa esensial yang belum mantap. */
  remainingEssential: number;
  /** Esensial sudah tuntas? */
  essentialComplete: boolean;
  /** Batch pertanyaan berikutnya (dibatasi `max`). */
  nextQuestions: DialogueQuestion[];
}

export interface ApplyAnswerResult {
  blueprint: Blueprint;
  applied: boolean;
  warnings: string[];
}

/* ===========================================================================
 * Konstanta
 * ======================================================================== */

/** Tier 1–2 dianggap esensial; tier > ini bersifat opsional/lanjutan. */
export const ESSENTIAL_MAX_PRIORITY = 2;

const TONE_OPTIONS: DialogueOption[] = [
  { value: "profesional", label: "Profesional & formal" },
  { value: "ramah", label: "Ramah & hangat" },
  { value: "santai", label: "Santai & akrab" },
  { value: "tegas", label: "Tegas & lugas" },
  { value: "empatik", label: "Empatik & suportif" },
];

const LANGUAGE_OPTIONS: DialogueOption[] = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" },
  { value: "mixed", label: "Campuran (ID + EN)" },
];

/* ===========================================================================
 * BANK PERTANYAAN (kurasi — hanya field berdampak tinggi)
 * Urutan = prioritas. Tidak mencakup semua ~150 field; itu justru melawan
 * prinsip "sesedikit mungkin". Field lain diisi via Inference (Tahap 6) /
 * default / edit manual di Builder.
 * ======================================================================== */

export const QUESTION_BANK: DialogueNode[] = [
  /* --- Tier 1: identitas & maksud inti -------------------------------- */
  {
    id: "intent",
    module: "meta",
    field: "intent",
    priority: 1,
    question: "Apa ide besar atau tujuan utama dari asisten AI yang ingin Anda bangun?",
    why: "Menjadi 'DNA' yang mengarahkan seluruh konfigurasi lain.",
    inputType: "textarea",
  },
  {
    id: "identity.name",
    module: "identity",
    field: "name",
    priority: 1,
    question: "Mau diberi nama apa asisten AI ini?",
    inputType: "text",
  },
  {
    id: "identity.description",
    module: "identity",
    field: "description",
    priority: 1,
    question: "Jelaskan secara singkat: apa yang dikerjakan asisten ini untuk penggunanya?",
    inputType: "textarea",
  },
  {
    id: "monetization.productTargetUser",
    module: "monetization",
    field: "productTargetUser",
    priority: 1,
    question: "Siapa target pengguna utamanya? (mis. pemilik UMKM, mahasiswa teknik, tim HR)",
    why: "Menentukan gaya bahasa, kedalaman jawaban, dan contoh yang dipakai.",
    inputType: "text",
  },
  {
    id: "goals.primaryOutcome",
    module: "goals",
    field: "primaryOutcome",
    priority: 1,
    question: "Apa hasil utama yang harus dicapai setiap kali pengguna selesai mengobrol?",
    why: "Tujuan percakapan = tolok ukur keberhasilan agen.",
    inputType: "textarea",
  },

  /* --- Tier 2: persona, bahasa, batasan ------------------------------ */
  {
    id: "identity.language",
    module: "identity",
    field: "language",
    priority: 2,
    question: "Bahasa utama yang dipakai asisten?",
    inputType: "select",
    options: LANGUAGE_OPTIONS,
  },
  {
    id: "identity.toneOfVoice",
    module: "identity",
    field: "toneOfVoice",
    priority: 2,
    question: "Bagaimana gaya bicara yang Anda inginkan?",
    inputType: "select",
    options: TONE_OPTIONS,
  },
  {
    id: "identity.expertise",
    module: "identity",
    field: "expertise",
    priority: 2,
    question: "Sebutkan bidang keahlian utama asisten (pisahkan dengan koma).",
    why: "Membatasi cakupan agar jawaban tetap fokus & kredibel.",
    inputType: "list",
  },
  {
    id: "identity.greetingMessage",
    module: "identity",
    field: "greetingMessage",
    priority: 2,
    question: "Kalimat sapaan pembuka saat pengguna mulai mengobrol?",
    inputType: "text",
  },
  {
    id: "identity.avoidTopics",
    module: "identity",
    field: "avoidTopics",
    priority: 2,
    question: "Adakah topik yang harus dihindari asisten? (pisahkan dengan koma; kosongkan bila tidak ada)",
    inputType: "list",
  },
  {
    id: "policy.riskCompliance",
    module: "policy",
    field: "riskCompliance",
    priority: 2,
    question: "Adakah aturan kepatuhan, batasan hukum, atau hal sensitif yang wajib dipatuhi?",
    why: "Mencegah jawaban berisiko (mis. nasihat hukum/medis/keuangan).",
    inputType: "textarea",
  },
  {
    id: "knowledge.ragEnabled",
    module: "knowledge",
    field: "ragEnabled",
    priority: 2,
    question: "Apakah asisten perlu menjawab berdasarkan dokumen/pengetahuan yang akan Anda unggah?",
    why: "Mengaktifkan basis pengetahuan (RAG) bila jawaban harus bersumber.",
    inputType: "boolean",
  },

  /* --- Tier 3: opsional / lanjutan ----------------------------------- */
  {
    id: "orchestration.isOrchestrator",
    module: "orchestration",
    field: "isOrchestrator",
    priority: 3,
    question: "Apakah ini agen 'pemimpin' yang mengoordinasi beberapa sub-agen?",
    inputType: "boolean",
  },
  {
    id: "monetization.productSummary",
    module: "monetization",
    field: "productSummary",
    priority: 3,
    question: "Bila asisten ini akan dijual/dilisensikan, ringkas produknya dalam 1–2 kalimat.",
    inputType: "textarea",
  },
  {
    id: "conversion.conversionGoal",
    module: "conversion",
    field: "conversionGoal",
    priority: 3,
    question: "Tindakan konversi apa yang diharapkan? (mis. isi form lead, klik WhatsApp, beli)",
    inputType: "text",
  },
  {
    id: "widget.widgetWelcomeMessage",
    module: "widget",
    field: "widgetWelcomeMessage",
    priority: 3,
    question: "Pesan selamat datang pada widget chat (bila dipakai sebagai widget)?",
    inputType: "text",
  },
];

/* ===========================================================================
 * Inti: pilih pertanyaan berikutnya
 * ======================================================================== */

/**
 * Mengembalikan batch pertanyaan berikutnya — hanya field yang BELUM mantap,
 * terurut prioritas, dibatasi `max`. Inilah jantung "tanya sesedikit mungkin".
 */
export function selectNextQuestions(
  blueprint: Blueprint,
  options: SelectOptions = {},
): DialogueQuestion[] {
  const max = options.max ?? 3;
  const minConfidence = options.minConfidence ?? 0.6;
  const includeOptional = options.includeOptional ?? false;

  const candidates: DialogueNode[] = [];
  for (const node of [...QUESTION_BANK].sort((a, b) => a.priority - b.priority)) {
    if (!includeOptional && node.priority > ESSENTIAL_MAX_PRIORITY) continue;
    if (node.askIf && !node.askIf(blueprint)) continue;
    if (isFieldKnown(blueprint, node, minConfidence)) continue;
    candidates.push(node);
  }

  // Bila esensial sudah tuntas tetapi caller tak minta opsional, batch kosong.
  return candidates.slice(0, max).map(toQuestion);
}

/* ===========================================================================
 * Inti: terapkan jawaban ke Blueprint (pure → salinan baru)
 * ======================================================================== */

/**
 * Menyimpan satu jawaban ke Blueprint: set nilai field + naikkan fieldMeta
 * (source="user", confidence=1, needsConfirmation=false) + segarkan status modul.
 * Mengembalikan SALINAN baru (tidak memutasi input).
 */
export function applyAnswer(
  blueprint: Blueprint,
  nodeId: string,
  rawValue: any,
): ApplyAnswerResult {
  const warnings: string[] = [];
  const node = QUESTION_BANK.find((n) => n.id === nodeId);
  if (!node) {
    return { blueprint, applied: false, warnings: [`[dialogue] nodeId "${nodeId}" tak dikenal`] };
  }

  const next = cloneBlueprint(blueprint);
  const value = node.coerce ? node.coerce(rawValue) : coerceByType(node.inputType, rawValue);

  if (node.module === "meta") {
    (next.meta as Record<string, any>)[node.field] = value;
    return { blueprint: next, applied: true, warnings };
  }

  const mod = next.modules[node.module];
  (mod.data as Record<string, any>)[node.field] = value;
  mod.fieldMeta = mod.fieldMeta ?? {};
  mod.fieldMeta[node.field] = {
    confidence: 1,
    source: "user",
    needsConfirmation: false,
    evidence: "dijawab langsung oleh user (Dialogue Engine V2)",
  };
  mod.status = recomputeModuleStatus(next, node.module);

  return { blueprint: next, applied: true, warnings };
}

/** Terapkan beberapa jawaban sekaligus: map nodeId -> nilai. */
export function applyAnswers(
  blueprint: Blueprint,
  answers: Record<string, any>,
): ApplyAnswerResult {
  let current = blueprint;
  const warnings: string[] = [];
  let appliedAny = false;
  for (const [nodeId, value] of Object.entries(answers)) {
    const res = applyAnswer(current, nodeId, value);
    current = res.blueprint;
    warnings.push(...res.warnings);
    if (res.applied) appliedAny = true;
  }
  return { blueprint: current, applied: appliedAny, warnings };
}

/* ===========================================================================
 * Ringkasan progres dialog
 * ======================================================================== */

export function getDialogueState(
  blueprint: Blueprint,
  options: SelectOptions = {},
): DialogueState {
  const minConfidence = options.minConfidence ?? 0.6;
  const essentials = QUESTION_BANK.filter(
    (n) => n.priority <= ESSENTIAL_MAX_PRIORITY && (!n.askIf || n.askIf(blueprint)),
  );
  const answered = essentials.filter((n) => isFieldKnown(blueprint, n, minConfidence)).length;
  const remaining = essentials.length - answered;
  const essentialComplete = remaining === 0;

  // Bila esensial selesai, tawarkan tier opsional sebagai kelanjutan.
  const nextQuestions = selectNextQuestions(blueprint, {
    ...options,
    includeOptional: options.includeOptional ?? essentialComplete,
  });

  return {
    totalEssential: essentials.length,
    answeredEssential: answered,
    remainingEssential: remaining,
    essentialComplete,
    nextQuestions,
  };
}

/* ===========================================================================
 * Helper
 * ======================================================================== */

/** Apakah field target sudah diketahui dengan cukup yakin? */
function isFieldKnown(blueprint: Blueprint, node: DialogueNode, minConfidence: number): boolean {
  if (node.module === "meta") {
    return hasValue((blueprint.meta as Record<string, any>)[node.field]);
  }
  const mod = blueprint.modules[node.module];
  const value = (mod.data as Record<string, any>)[node.field];
  if (!hasValue(value)) return false;
  const meta = mod.fieldMeta?.[node.field];
  if (meta?.needsConfirmation) return false;
  return (meta?.confidence ?? 0) >= minConfidence;
}

/** Nilai dianggap "ada" bila bukan undefined/null/string kosong/array kosong. */
function hasValue(v: any): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true; // number (termasuk 0) & boolean (termasuk false) dianggap ada
}

/** Hitung status modul berdasarkan field esensial milik modul itu di bank. */
function recomputeModuleStatus(
  blueprint: Blueprint,
  module: BlueprintModuleName,
): "empty" | "partial" | "inferred" | "confirmed" {
  const nodes = QUESTION_BANK.filter((n) => n.module === module);
  if (nodes.length === 0) {
    // Modul tanpa node di bank: simpulkan dari ada/tidaknya data.
    const hasAny = Object.values(blueprint.modules[module].data ?? {}).some(hasValue);
    return hasAny ? "partial" : "empty";
  }
  const known = nodes.filter((n) => isFieldKnown(blueprint, n, 0.6));
  if (known.length === 0) return "empty";
  return known.length === nodes.length ? "confirmed" : "partial";
}

/** Coercion default berdasarkan tipe input. */
function coerceByType(type: DialogueInputType, raw: any): any {
  switch (type) {
    case "boolean":
      if (typeof raw === "boolean") return raw;
      if (typeof raw === "string") return /^(true|ya|yes|1|aktif)$/i.test(raw.trim());
      return Boolean(raw);
    case "number":
      return typeof raw === "number" ? raw : Number(raw);
    case "list":
    case "multiselect":
      if (Array.isArray(raw)) return raw.map((s) => String(s).trim()).filter(Boolean);
      if (typeof raw === "string") {
        return raw
          .split(/[,\n]/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return raw === undefined || raw === null ? [] : [String(raw)];
    default:
      return raw;
  }
}

function toQuestion(node: DialogueNode): DialogueQuestion {
  return {
    id: node.id,
    module: node.module,
    field: node.field,
    priority: node.priority,
    question: node.question,
    why: node.why,
    inputType: node.inputType,
    options: node.options,
  };
}

/** Salinan dalam Blueprint (structuredClone tersedia di Node 18+). */
function cloneBlueprint(bp: Blueprint): Blueprint {
  return typeof structuredClone === "function"
    ? structuredClone(bp)
    : JSON.parse(JSON.stringify(bp));
}
