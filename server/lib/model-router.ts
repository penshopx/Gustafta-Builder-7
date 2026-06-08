import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * MODEL ROUTER — Cost-Optimized Multi-Provider LLM Routing
 *
 * Priority order per task (cheapest viable first):
 *   general       → Qwen Turbo → DeepSeek Chat → gpt-4o-mini
 *   orchestration → DeepSeek Chat → Qwen Plus → gpt-4o-mini (avoid gpt-4o)
 *   math_rab      → DeepSeek Chat → gpt-4o-mini
 *   data_extract  → Qwen Turbo → gpt-4o-mini
 *   large_doc     → Gemini Flash → Qwen Plus → gpt-4o-mini
 *   vision        → gpt-4o (only reliable multimodal, no alternative)
 *
 * Cost benchmark (approx IDR per 1M tokens, input/output):
 *   gpt-4o        Rp 40k / Rp 160k  ← avoid except vision
 *   gpt-4o-mini   Rp 2.4k / Rp 9.6k ← safe fallback
 *   DeepSeek Chat Rp 4.3k / Rp 17.6k ← smart, good for reasoning
 *   Qwen Turbo    Rp 800  / Rp 2.4k  ← cheapest, fine for general
 *   Qwen Plus     Rp 6.4k / Rp 19.2k ← smarter Qwen
 *   Gemini Flash  ~free quota / low   ← large doc window
 */

export type TaskType =
  | "orchestration"
  | "vision"
  | "math_rab"
  | "data_extraction"
  | "large_doc"
  | "general";

export interface RouterChoice {
  provider: "openai" | "gemini" | "deepseek" | "qwen";
  model: string;
  reason: string;
}

const hasQwen     = () => !!process.env.QWEN_API_KEY;
const hasDeepSeek = () => !!process.env.DEEPSEEK_API_KEY;
const hasGemini   = () => !!(process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY);

export function chooseModel(task: TaskType): RouterChoice {
  switch (task) {

    case "vision":
      return { provider: "openai", model: "gpt-4o", reason: "GPT-4o Vision — satu-satunya yang handal untuk analisis gambar" };

    case "orchestration":
      if (hasDeepSeek())
        return { provider: "deepseek", model: "deepseek-chat", reason: "DeepSeek Chat — reasoning kuat untuk orkestrasi, hemat 95% vs gpt-4o" };
      if (hasQwen())
        return { provider: "qwen", model: "qwen-plus", reason: "Qwen Plus — orkestrasi multi-step yang solid" };
      return { provider: "openai", model: "gpt-4o-mini", reason: "gpt-4o-mini fallback orchestration (set DEEPSEEK_API_KEY untuk hemat)" };

    case "math_rab":
      if (hasDeepSeek())
        return { provider: "deepseek", model: "deepseek-chat", reason: "DeepSeek — chain-of-thought terbaik untuk perhitungan RAB & numerik" };
      if (hasQwen())
        return { provider: "qwen", model: "qwen-plus", reason: "Qwen Plus fallback math" };
      return { provider: "openai", model: "gpt-4o-mini", reason: "gpt-4o-mini fallback math (set DEEPSEEK_API_KEY untuk akurasi lebih)" };

    case "data_extraction":
      if (hasQwen())
        return { provider: "qwen", model: "qwen-turbo", reason: "Qwen Turbo — JSON extraction hemat & cepat" };
      if (hasDeepSeek())
        return { provider: "deepseek", model: "deepseek-chat", reason: "DeepSeek fallback extraction" };
      return { provider: "openai", model: "gpt-4o-mini", reason: "gpt-4o-mini fallback extraction (set QWEN_API_KEY untuk hemat 66%)" };

    case "large_doc":
      if (hasGemini())
        return { provider: "gemini", model: "gemini-1.5-flash", reason: "Gemini Flash — context 1M token untuk dokumen besar, murah" };
      if (hasQwen())
        return { provider: "qwen", model: "qwen-plus", reason: "Qwen Plus fallback large doc" };
      return { provider: "openai", model: "gpt-4o-mini", reason: "gpt-4o-mini fallback large doc (set GEMINI_API_KEY untuk dokumen besar)" };

    case "general":
    default:
      if (hasQwen())
        return { provider: "qwen", model: "qwen-turbo", reason: "Qwen Turbo — general purpose, hemat 66% vs gpt-4o-mini" };
      if (hasDeepSeek())
        return { provider: "deepseek", model: "deepseek-chat", reason: "DeepSeek Chat fallback general" };
      return { provider: "openai", model: "gpt-4o-mini", reason: "gpt-4o-mini fallback general (set QWEN_API_KEY untuk hemat biaya)" };
  }
}

export async function callWithRouter(
  task: TaskType,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options?: { temperature?: number; maxTokens?: number; jsonMode?: boolean }
): Promise<{ text: string; choice: RouterChoice }> {
  const choice = chooseModel(task);
  const temperature = options?.temperature ?? 0.3;
  const maxTokens = options?.maxTokens ?? 2000;

  if (choice.provider === "openai" || choice.provider === "deepseek" || choice.provider === "qwen") {
    let client: OpenAI;
    if (choice.provider === "deepseek") {
      client = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY!,
        baseURL: "https://api.deepseek.com",
      });
    } else if (choice.provider === "qwen") {
      client = new OpenAI({
        apiKey: process.env.QWEN_API_KEY!,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      });
    } else {
      client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    }

    const resp = await client.chat.completions.create({
      model: choice.model,
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
      ...(options?.jsonMode ? { response_format: { type: "json_object" } } : {}),
    });
    return { text: resp.choices[0]?.message?.content ?? "", choice };
  }

  if (choice.provider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
    const genai = new GoogleGenerativeAI(apiKey!);
    const model = genai.getGenerativeModel({ model: choice.model });
    const systemMsg = messages.find(m => m.role === "system")?.content ?? "";
    const userMsg = messages.filter(m => m.role !== "system").map(m => m.content).join("\n");
    const result = await model.generateContent(`${systemMsg}\n\n${userMsg}`);
    return { text: result.response.text(), choice };
  }

  throw new Error(`Unknown provider: ${choice.provider}`);
}

/**
 * Ringkasan provider yang aktif — untuk logging / debug
 */
export function getActiveProviders(): Record<string, boolean> {
  return {
    openai:   !!process.env.OPENAI_API_KEY,
    deepseek: hasDeepSeek(),
    qwen:     hasQwen(),
    gemini:   hasGemini(),
  };
}
