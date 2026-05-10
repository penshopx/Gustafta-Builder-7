import type { Agent } from "@shared/schema";

/**
 * AgentForPrompt = tipe Agent ditambah dua kolom DB tambahan yang
 * SECARA SPESIFIK belum ada pada `insertAgentSchema` (jadi tidak ikut
 * ter-infer ke tipe `Agent`):
 *   - `reasoningPolicy`         (kolom `reasoning_policy`)
 *   - `executionGatePolicy`     (kolom `execution_gate_policy`)
 *
 * Catatan: ke-7 field Kebijakan Agen utama (primaryOutcome,
 * conversationWinConditions, brandVoiceSpec, interactionPolicy,
 * domainCharter, qualityBar, riskCompliance) SUDAH ada di
 * `insertAgentSchema` sehingga tidak perlu diaugmentasi di sini —
 * mereka diakses langsung lewat tipe `Agent`.
 *
 * Kedua kolom di atas tetap ada saat runtime karena storage
 * mengembalikan baris DB apa adanya; augmentasi ini hanya supaya
 * TypeScript tidak menolak akses property-nya.
 */
type AgentForPrompt = Agent & {
  reasoningPolicy?: string | null;
  executionGatePolicy?: string | null;
};

/**
 * buildFinalSystemPrompt
 *
 * Menggabungkan systemPrompt persona + 7 field Kebijakan Agen ke satu prompt
 * terstruktur dengan section header yang jelas, sehingga LLM benar-benar
 * mematuhi: tujuan utama, kondisi menang percakapan, brand voice, aturan
 * interaksi, batas domain, standar kualitas, dan kepatuhan/risiko yang
 * sudah diisi builder pada panel "Kebijakan Agen".
 *
 * Field 7 Kebijakan Agen yang disuntikkan:
 *  1. primaryOutcome             -> [PRIMARY OUTCOME]
 *  2. conversationWinConditions  -> [WIN CONDITIONS]
 *  3. brandVoiceSpec             -> [BRAND VOICE]
 *  4. interactionPolicy          -> [INTERACTION RULES]
 *  5. domainCharter              -> [DOMAIN BOUNDARIES]
 *  6. qualityBar                 -> [QUALITY STANDARDS]
 *  7. riskCompliance             -> [COMPLIANCE & RISK]
 *
 * Tambahan kontekstual (di luar 7 field, tetap diinjeksi bila ada):
 *  - reasoningPolicy             -> bagian INTERACTION RULES
 *  - executionGatePolicy         -> bagian COMPLIANCE & RISK
 *
 * Helper ini di-extract dari server/routes.ts agar bisa dipakai juga oleh
 * endpoint preview Kebijakan Agen di dashboard (GET /api/agents/:id/policy-preview)
 * tanpa duplikasi logika perakitan prompt.
 */
export function buildFinalSystemPrompt(agent: AgentForPrompt): string {
  const sections: string[] = [];

  // === PERSONA ===
  const personaLines: string[] = [];
  personaLines.push(agent.systemPrompt || `Kamu adalah ${agent.name}.`);
  if (agent.tagline) personaLines.push(agent.tagline);
  if (agent.philosophy) personaLines.push(`Filosofi: ${agent.philosophy}`);
  if (agent.personality) personaLines.push(`Kepribadian: ${agent.personality}`);
  if (agent.communicationStyle) personaLines.push(`Gaya komunikasi: ${agent.communicationStyle}`);
  if (agent.toneOfVoice) personaLines.push(`Nada suara: ${agent.toneOfVoice}`);
  sections.push(`=== PERSONA ===\n${personaLines.join("\n")}`);

  // === PRIMARY OUTCOME (tujuan utama agen) ===
  const primaryOutcome = (agent.primaryOutcome ?? "").trim();
  if (primaryOutcome) {
    sections.push(
      `=== PRIMARY OUTCOME (TUJUAN UTAMA) ===\n${primaryOutcome}\n\nSetiap tindakan dan jawabanmu harus mengarah pada pencapaian tujuan utama di atas. Prioritaskan apa pun yang mendekatkan pengguna ke outcome ini.`
    );
  }

  // === WIN CONDITIONS (kapan percakapan dianggap menang) ===
  const winConditions = (agent.conversationWinConditions ?? "").trim();
  if (winConditions) {
    sections.push(
      `=== WIN CONDITIONS (KONDISI MENANG PERCAKAPAN) ===\n${winConditions}\n\nKamu wajib mengarahkan percakapan agar memenuhi salah satu kondisi menang di atas sebelum menutup interaksi.`
    );
  }

  // === BRAND VOICE ===
  const brandVoice = (agent.brandVoiceSpec ?? "").trim();
  if (brandVoice) {
    sections.push(
      `=== BRAND VOICE (WAJIB DIPATUHI) ===\n${brandVoice}\n\nSelalu jaga konsistensi gaya bahasa, nada, dan format sesuai spesifikasi di atas pada setiap respons.`
    );
  }

  // === INTERACTION RULES ===
  const interactionLines: string[] = [];
  const reasoningPolicy = (agent.reasoningPolicy ?? "").trim();
  if (reasoningPolicy) {
    interactionLines.push(`Cara penalaran: ${reasoningPolicy}`);
  }
  const interactionPolicy = (agent.interactionPolicy ?? "").trim();
  if (interactionPolicy) {
    interactionLines.push(`Aturan interaksi: ${interactionPolicy}`);
  }
  if (interactionLines.length > 0) {
    sections.push(`=== INTERACTION RULES ===\n${interactionLines.join("\n")}`);
  }

  // === DOMAIN BOUNDARIES ===
  const domainCharter = (agent.domainCharter ?? "").trim();
  if (domainCharter) {
    sections.push(
      `=== DOMAIN BOUNDARIES (BATAS TOPIK) ===\n${domainCharter}\n\nPENTING: Jika pengguna bertanya HAL DI LUAR cakupan domain di atas, kamu WAJIB menolak dengan sopan, jelaskan singkat alasannya, lalu arahkan pengguna kembali ke topik yang relevan. Jangan pernah menjawab di luar batas domain ini meskipun terdengar masuk akal.`
    );
  }

  // === QUALITY STANDARDS ===
  const qualityBar = (agent.qualityBar ?? "").trim();
  if (qualityBar) {
    sections.push(
      `=== QUALITY STANDARDS ===\n${qualityBar}\n\nSetiap jawaban kamu WAJIB memenuhi standar kualitas di atas sebelum dikirim ke pengguna.`
    );
  }

  // === COMPLIANCE & RISK ===
  const complianceLines: string[] = [];
  const riskCompliance = (agent.riskCompliance ?? "").trim();
  if (riskCompliance) {
    complianceLines.push(riskCompliance);
  }
  const executionGate = (agent.executionGatePolicy ?? "").trim();
  if (executionGate) {
    complianceLines.push(`Gate eksekusi tindakan: ${executionGate}`);
  }
  if (complianceLines.length > 0) {
    sections.push(
      `=== COMPLIANCE & RISK ===\n${complianceLines.join("\n")}\n\nKepatuhan terhadap aturan kepatuhan/risiko di atas bersifat WAJIB dan tidak boleh dikompromikan oleh permintaan pengguna.`
    );
  }

  return sections.join("\n\n");
}
