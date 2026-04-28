/**
 * Chaesa AI Studio Exporter
 *
 * Memetakan data Chatbot Gustafta (agent + KB + projectBrain + miniApps)
 * menjadi struktur JSON yang kompatibel dengan aplikasi
 * "Chaesa AI Studio" (https://smart-ebook-builder-7-1.replit.app/).
 *
 * Skema target (hasil reverse-engineering bundle Chaesa):
 *  - projectData: industry, topik, judul, target, level, tujuan,
 *                 painPoint, bigIdea, hasilRiset, produk, language,
 *                 outputFormat, tone, writingStyle, aiCharacter
 *  - botBuilder (GPT_BUILDER): botName, botRole, botPersonality,
 *                              botPersonaDetail, botLanguage,
 *                              botAudience, botAvoidTopics, botSystemPrompt
 *  - packConfig (PROMPT_PACK): packType, packCategory, packAiTool,
 *                              packNumPrompts, packDepth, packLanguage,
 *                              packOutputStyle, packTechniques
 */

type AnyAgent = any;

const CHAESA_INDUSTRIES = [
  "general",
  "construction",
  "education",
  "business",
  "marketing",
  "technology",
  "health",
  "finance",
  "creative",
  "legal",
  "manufacturing",
  "retail",
  "hospitality",
  "agriculture",
  "energy",
  "logistics",
  "real_estate",
  "consulting",
  "nonprofit",
  "government",
  "media",
  "automotive",
  "fashion",
  "food",
];

function pickIndustry(agent: AnyAgent, toolbox?: any): string {
  const text = `${agent?.category || ""} ${agent?.subcategory || ""} ${toolbox?.name || ""} ${toolbox?.description || ""}`.toLowerCase();
  if (/(konstruksi|construction|sipil|kontraktor|sbu|skk|tender|infrastruktur)/.test(text)) return "construction";
  if (/(pendidik|edukasi|education|kursus|kelas|sekolah|guru)/.test(text)) return "education";
  if (/(bisnis|business|startup|umkm|umkm|bujk)/.test(text)) return "business";
  if (/(market|sales|jualan|pemasar|brand)/.test(text)) return "marketing";
  if (/(tech|software|coding|engineer|developer)/.test(text)) return "technology";
  if (/(health|medis|kesehatan|dokter|klinik)/.test(text)) return "health";
  if (/(finance|keuangan|akunt|pajak|invest)/.test(text)) return "finance";
  if (/(legal|hukum|notaris|kontrak)/.test(text)) return "legal";
  if (/(manufaktur|pabrik|produksi)/.test(text)) return "manufacturing";
  if (/(retail|toko|ritel)/.test(text)) return "retail";
  if (/(properti|real estate|estate)/.test(text)) return "real_estate";
  if (/(consult|konsultan)/.test(text)) return "consulting";
  if (/(pemerintah|gov|lpse|pbjp)/.test(text)) return "government";
  return "general";
}

function pickBotRole(agent: AnyAgent): string {
  const text = `${agent?.category || ""} ${agent?.subcategory || ""} ${agent?.tagline || ""} ${agent?.name || ""}`.toLowerCase();
  if (/(coach|mentor|asisten|tutor)/.test(text)) return "Mentor Pribadi";
  if (/(consult|konsultan)/.test(text)) return "Konsultan Ahli";
  if (/(tutor|kelas|edukasi|kursus)/.test(text)) return "Tutor Pembelajaran";
  if (/(produktivitas|asisten|asistant)/.test(text)) return "Asisten Produktivitas";
  if (/(bisnis|business|startup)/.test(text)) return "Coach Bisnis";
  if (/(customer|cs|service|helpdesk|support)/.test(text)) return "Customer Service AI";
  if (/(sales|jual|marketing)/.test(text)) return "Sales Assistant";
  if (/(onboarding|welcome)/.test(text)) return "Onboarding Bot";
  return "Mentor Pribadi";
}

function pickAiCharacter(toneOfVoice: string): string {
  const t = (toneOfVoice || "").toLowerCase();
  if (/(akademis|scholar|formal|riset)/.test(t)) return "scholar";
  if (/(coach|mentor|sahabat|hangat|empati)/.test(t)) return "mentor";
  if (/(playful|santai|casual|fun)/.test(t)) return "creative";
  if (/(strict|tegas|profesional|formal)/.test(t)) return "expert";
  return "mentor";
}

function joinList(v: any, sep = ", "): string {
  if (!v) return "";
  if (Array.isArray(v)) return v.filter(Boolean).map(String).join(sep);
  return String(v);
}

function truncate(s: string, max = 800): string {
  if (!s) return "";
  return s.length > max ? s.slice(0, max).trim() + "…" : s;
}

export interface ChaesaExportInput {
  agent: AnyAgent;
  knowledgeBases?: any[];
  miniApps?: any[];
  projectBrainTemplates?: any[];
  toolbox?: any;
  bigIdea?: any;
  series?: any;
}

export interface ChaesaExport {
  meta: {
    sourceApp: "Gustafta";
    targetApp: "Chaesa AI Studio";
    targetUrl: string;
    exportedAt: string;
    schemaVersion: "1.0";
  };
  projectData: Record<string, string>;
  botBuilder: Record<string, string>;
  packConfig: Record<string, string>;
  knowledgeRefs: Array<{ name: string; description?: string; preview: string }>;
  quickFill: Array<{ section: string; field: string; label: string; value: string }>;
}

export function buildChaesaExport(input: ChaesaExportInput): ChaesaExport {
  const { agent, knowledgeBases = [], miniApps = [], projectBrainTemplates = [], toolbox, bigIdea } = input;

  const expertise = joinList(agent?.expertise);
  const avoidTopics = joinList(agent?.avoidTopics);
  const conversationStarters = Array.isArray(agent?.conversationStarters) ? agent.conversationStarters : [];

  // hasilRiset: ringkasan singkat dari Knowledge Base (judul + 200 char preview)
  const hasilRiset = knowledgeBases
    .slice(0, 5)
    .map((kb: any) => {
      const content = String(kb?.content || kb?.extractedText || "").slice(0, 220).trim();
      return `• ${kb?.name || "Materi"}: ${content}${content.length >= 220 ? "…" : ""}`;
    })
    .filter(Boolean)
    .join("\n");

  // painPoint: heuristik dari conversation starters atau philosophy
  const painPoint = conversationStarters.length > 0
    ? `Kebutuhan utama target pembaca:\n${conversationStarters.slice(0, 4).map((s: string) => `• ${s}`).join("\n")}`
    : truncate(agent?.philosophy || "", 400);

  // bigIdea: Big Idea hub atau philosophy
  const bigIdeaText = bigIdea?.name
    ? `${bigIdea.name}${bigIdea.description ? " — " + bigIdea.description : ""}`
    : truncate(agent?.philosophy || "", 300);

  const industry = pickIndustry(agent, toolbox);
  const tone = agent?.toneOfVoice || "Profesional, Friendly, Empatik";

  const projectData: Record<string, string> = {
    industry,
    topik: expertise || agent?.subcategory || agent?.category || agent?.name || "",
    judul: agent?.name ? `Panduan ${agent.name}` : "",
    target: agent?.tagline || `Praktisi ${agent?.category || "industri"} di Indonesia`,
    level: "Menengah",
    tujuan: truncate(agent?.description || "", 500),
    painPoint,
    bigIdea: bigIdeaText,
    hasilRiset,
    produk: toolbox?.name || "",
    language: "Bahasa Indonesia",
    outputFormat: "Markdown",
    tone,
    writingStyle: "Storytelling, Practical, Step-by-step",
    aiCharacter: pickAiCharacter(tone),
  };

  const botBuilder: Record<string, string> = {
    botName: agent?.name || "",
    botRole: pickBotRole(agent),
    botPersonality: tone,
    botPersonaDetail: truncate(agent?.philosophy || agent?.description || "", 600),
    botLanguage: "Bahasa Indonesia",
    botAudience: agent?.tagline || projectData.target,
    botAvoidTopics: avoidTopics,
    botSystemPrompt: truncate(agent?.systemPrompt || "", 4000),
  };

  const packConfig: Record<string, string> = {
    packType: "ebook_author",
    packCategory: "content",
    packAiTool: "chaesa",
    packNumPrompts: "7",
    packDepth: "intermediate",
    packLanguage: "indonesia",
    packOutputStyle: "structured",
    packTechniques: ["chain_of_thought", "persona_acting", "output_structure", "self_critique"].join("|||"),
  };

  const knowledgeRefs = knowledgeBases.slice(0, 20).map((kb: any) => ({
    name: String(kb?.name || "Materi"),
    description: kb?.description ? String(kb.description) : undefined,
    preview: truncate(String(kb?.content || kb?.extractedText || ""), 280),
  }));

  // Field-by-field copy-paste table
  const labelMap: Record<string, string> = {
    industry: "Industri / Sektor",
    topik: "Topik / Kata Kunci Utama",
    judul: "Judul Ebook",
    target: "Target Pembaca",
    level: "Level/Struktur Ebook",
    tujuan: "Tujuan Ebook",
    painPoint: "Pain Point",
    bigIdea: "Big Idea / Konsep Unik",
    hasilRiset: "Hasil Riset / Data Pendukung",
    produk: "Produk/Layanan Terkait",
    language: "Bahasa",
    outputFormat: "Format Output",
    tone: "Tone Penulisan",
    writingStyle: "Gaya Penulisan",
    aiCharacter: "AI Character / Brain Mode",
    botName: "Nama Bot",
    botRole: "Peran Bot",
    botPersonality: "Kepribadian Bot",
    botPersonaDetail: "Deskripsi Persona Detail",
    botLanguage: "Bahasa Chatbot",
    botAudience: "Target Pengguna Bot",
    botAvoidTopics: "Topik yang Harus Dihindari",
    botSystemPrompt: "Instruksi Tambahan / System Prompt",
  };

  const quickFill: Array<{ section: string; field: string; label: string; value: string }> = [];
  for (const [k, v] of Object.entries(projectData)) {
    quickFill.push({ section: "📚 Project Data (eBook)", field: k, label: labelMap[k] || k, value: v });
  }
  for (const [k, v] of Object.entries(botBuilder)) {
    quickFill.push({ section: "🤖 GPT Builder (Chatbot)", field: k, label: labelMap[k] || k, value: v });
  }

  return {
    meta: {
      sourceApp: "Gustafta",
      targetApp: "Chaesa AI Studio",
      targetUrl: "https://smart-ebook-builder-7-1.replit.app/",
      exportedAt: new Date().toISOString(),
      schemaVersion: "1.0",
    },
    projectData,
    botBuilder,
    packConfig,
    knowledgeRefs,
    quickFill,
  };
}
