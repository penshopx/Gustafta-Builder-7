import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

export function chooseModel(task: TaskType): RouterChoice {
  switch (task) {
    case "orchestration":
      return { provider: "openai", model: "gpt-4o", reason: "GPT-4o — akurasi routing & logika tertinggi" };
    case "vision":
      return { provider: "openai", model: "gpt-4o", reason: "GPT-4o Vision — analisis gambar terbaik" };
    case "math_rab":
      if (process.env.DEEPSEEK_API_KEY) {
        return { provider: "deepseek", model: "deepseek-chat", reason: "DeepSeek — reasoning matematika chain-of-thought" };
      }
      return { provider: "openai", model: "gpt-4o-mini", reason: "GPT-4o-mini fallback (DeepSeek tidak terkonfigurasi)" };
    case "data_extraction":
      if (process.env.QWEN_API_KEY) {
        return { provider: "qwen", model: "qwen-turbo", reason: "Qwen — structured JSON extraction terbaik" };
      }
      return { provider: "openai", model: "gpt-4o-mini", reason: "GPT-4o-mini fallback (Qwen tidak terkonfigurasi)" };
    case "large_doc":
      if (process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY) {
        return { provider: "gemini", model: "gemini-1.5-flash", reason: "Gemini — context window raksasa untuk dokumen besar" };
      }
      return { provider: "openai", model: "gpt-4o", reason: "GPT-4o fallback (Gemini tidak terkonfigurasi)" };
    default:
      return { provider: "openai", model: "gpt-4o-mini", reason: "GPT-4o-mini — balanced general purpose" };
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
