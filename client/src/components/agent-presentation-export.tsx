import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { FileText, Presentation, Download, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Agent } from "@shared/schema";

interface AgentPresentationExportProps {
  agent: Agent;
  formData?: Partial<Agent>;
}

function slugify(name: string) {
  return (name || "chatbot").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function safeText(v: unknown, fallback = "-"): string {
  if (!v) return fallback;
  if (typeof v === "string") return v.trim() || fallback;
  return fallback;
}

function safeArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  if (typeof v === "string") {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p.filter(Boolean).map(String) : []; } catch { return []; }
  }
  return [];
}

const BRAND_COLORS = {
  primary: "5B4FE8",
  dark: "1A1535",
  accent: "A78BFA",
  light: "EDE9FE",
  white: "FFFFFF",
  gray: "6B7280",
  lightGray: "F3F4F6",
  text: "1F2937",
  muted: "9CA3AF",
};

async function generatePPT(agent: Agent, data: Partial<Agent>) {
  const pptxgen = (await import("pptxgenjs")).default;
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = safeText(data.name || agent.name);
  pres.author = "Gustafta AI Platform";

  const name = safeText(data.name || agent.name, "Chatbot");
  const tagline = safeText(data.tagline || (agent as any).tagline, "Asisten AI Cerdas");
  const description = safeText(data.description || agent.description, "Deskripsi belum tersedia.");
  const personality = safeText((data as any).personality || (agent as any).personality, "-");
  const philosophy = safeText((data as any).philosophy || (agent as any).philosophy, "-");
  const greetingMessage = safeText((data as any).greetingMessage || (agent as any).greetingMessage, "-");
  const toneOfVoice = safeText((data as any).toneOfVoice || (agent as any).toneOfVoice, "professional");
  const primaryOutcome = safeText((data as any).primaryOutcome || (agent as any).primaryOutcome, "-");
  const domainCharter = safeText((data as any).domainCharter || (agent as any).domainCharter, "-");
  const offTopicResponse = safeText((data as any).offTopicResponse || (agent as any).offTopicResponse, "-");
  const qualityBar = safeText((data as any).qualityBar || (agent as any).qualityBar, "-");
  const riskCompliance = safeText((data as any).riskCompliance || (agent as any).riskCompliance, "-");
  const productSummary = safeText((data as any).productSummary || (agent as any).productSummary, "-");
  const category = safeText((agent as any).category, "AI Chatbot");
  const expertise = safeArray((data as any).expertise || (agent as any).expertise);
  const starters = safeArray((data as any).conversationStarters || (agent as any).conversationStarters);
  const keyPhrases = safeArray((data as any).keyPhrases || (agent as any).keyPhrases);

  const makeBg = (slide: any) => {
    slide.addShape("rect", { x: 0, y: 0, w: "100%", h: "100%", fill: { color: BRAND_COLORS.dark } });
    slide.addShape("rect", { x: 0, y: 6.8, w: "100%", h: 0.3, fill: { color: BRAND_COLORS.primary } });
  };

  const slideLabel = (slide: any, num: number, total: number) => {
    slide.addText(`${num} / ${total}`, {
      x: 11.5, y: 0.15, w: 1.5, h: 0.3,
      fontSize: 9, color: BRAND_COLORS.muted, align: "right",
    });
    slide.addText("Gustafta AI Platform", {
      x: 0.3, y: 6.9, w: 6, h: 0.25,
      fontSize: 8, color: BRAND_COLORS.muted,
    });
  };

  const TOTAL = 7;

  // ─── Slide 1: Cover ───────────────────────────────────────────────────────
  const s1 = pres.addSlide();
  makeBg(s1);
  s1.addShape("rect", { x: 0, y: 0, w: "100%", h: 7.5, fill: { color: BRAND_COLORS.dark } });
  s1.addShape("rect", { x: 0, y: 0, w: 0.5, h: "100%", fill: { color: BRAND_COLORS.primary } });
  s1.addShape("ellipse", { x: 9, y: -1, w: 5, h: 5, fill: { color: BRAND_COLORS.primary }, line: { color: BRAND_COLORS.primary } });

  s1.addText("PROFIL CHATBOT AI", {
    x: 0.8, y: 1.2, w: 8, h: 0.4,
    fontSize: 11, bold: false, color: BRAND_COLORS.accent,
    charSpacing: 3,
  });
  s1.addText(name, {
    x: 0.8, y: 1.8, w: 9, h: 1.5,
    fontSize: 40, bold: true, color: BRAND_COLORS.white,
    breakLine: true,
  });
  s1.addText(tagline, {
    x: 0.8, y: 3.5, w: 9, h: 0.6,
    fontSize: 16, color: BRAND_COLORS.accent, italic: true,
  });
  s1.addShape("rect", { x: 0.8, y: 4.3, w: 2, h: 0.05, fill: { color: BRAND_COLORS.primary } });
  s1.addText(`Kategori: ${category}`, {
    x: 0.8, y: 4.6, w: 6, h: 0.4,
    fontSize: 12, color: BRAND_COLORS.muted,
  });
  s1.addText("Gustafta AI Platform", {
    x: 0.8, y: 6.9, w: 6, h: 0.3,
    fontSize: 9, color: BRAND_COLORS.muted,
  });

  // ─── Slide 2: Deskripsi & Ringkasan Produk ────────────────────────────────
  const s2 = pres.addSlide();
  makeBg(s2); slideLabel(s2, 2, TOTAL);
  s2.addText("Deskripsi & Ringkasan", { x: 0.4, y: 0.2, w: 12, h: 0.5, fontSize: 22, bold: true, color: BRAND_COLORS.white });
  s2.addShape("rect", { x: 0.4, y: 0.75, w: 1.5, h: 0.04, fill: { color: BRAND_COLORS.primary } });

  s2.addShape("rect", { x: 0.4, y: 1.0, w: 12.2, h: 2.5, fill: { color: "252040" }, line: { color: BRAND_COLORS.primary, pt: 1 } });
  s2.addText("📋 Deskripsi Chatbot", { x: 0.7, y: 1.1, w: 11, h: 0.35, fontSize: 11, bold: true, color: BRAND_COLORS.accent });
  s2.addText(description.substring(0, 500), {
    x: 0.7, y: 1.5, w: 11.7, h: 1.8,
    fontSize: 12, color: BRAND_COLORS.white, breakLine: true, valign: "top",
  });

  s2.addShape("rect", { x: 0.4, y: 3.7, w: 12.2, h: 2.5, fill: { color: "252040" }, line: { color: "7C3AED", pt: 1 } });
  s2.addText("🎯 Ringkasan Produk", { x: 0.7, y: 3.8, w: 11, h: 0.35, fontSize: 11, bold: true, color: "C4B5FD" });
  s2.addText(productSummary.substring(0, 400), {
    x: 0.7, y: 4.2, w: 11.7, h: 1.7,
    fontSize: 12, color: BRAND_COLORS.white, breakLine: true, valign: "top",
  });
  s2.addText(`Primary Outcome: ${primaryOutcome}`, {
    x: 0.7, y: 6.35, w: 11, h: 0.3, fontSize: 10, color: BRAND_COLORS.muted,
  });

  // ─── Slide 3: Kepribadian & Filosofi ─────────────────────────────────────
  const s3 = pres.addSlide();
  makeBg(s3); slideLabel(s3, 3, TOTAL);
  s3.addText("Kepribadian & Filosofi", { x: 0.4, y: 0.2, w: 12, h: 0.5, fontSize: 22, bold: true, color: BRAND_COLORS.white });
  s3.addShape("rect", { x: 0.4, y: 0.75, w: 1.5, h: 0.04, fill: { color: BRAND_COLORS.primary } });

  const half = 5.9;
  s3.addShape("rect", { x: 0.4, y: 1.0, w: half, h: 2.5, fill: { color: "252040" }, line: { color: BRAND_COLORS.primary, pt: 1 } });
  s3.addText("🎭 Kepribadian", { x: 0.6, y: 1.1, w: 5.5, h: 0.35, fontSize: 11, bold: true, color: BRAND_COLORS.accent });
  s3.addText(personality.substring(0, 350), { x: 0.6, y: 1.5, w: 5.5, h: 1.8, fontSize: 11, color: BRAND_COLORS.white, breakLine: true, valign: "top" });

  s3.addShape("rect", { x: 6.5, y: 1.0, w: half, h: 2.5, fill: { color: "252040" }, line: { color: BRAND_COLORS.primary, pt: 1 } });
  s3.addText("💡 Filosofi Komunikasi", { x: 6.7, y: 1.1, w: 5.5, h: 0.35, fontSize: 11, bold: true, color: BRAND_COLORS.accent });
  s3.addText(philosophy.substring(0, 350), { x: 6.7, y: 1.5, w: 5.5, h: 1.8, fontSize: 11, color: BRAND_COLORS.white, breakLine: true, valign: "top" });

  s3.addShape("rect", { x: 0.4, y: 3.7, w: 12.2, h: 1.4, fill: { color: "252040" }, line: { color: "0EA5E9", pt: 1 } });
  s3.addText("👋 Pesan Sambutan", { x: 0.6, y: 3.8, w: 11, h: 0.35, fontSize: 11, bold: true, color: "7DD3FC" });
  s3.addText(greetingMessage.substring(0, 250), { x: 0.6, y: 4.2, w: 11.5, h: 0.8, fontSize: 11, color: BRAND_COLORS.white, breakLine: true, valign: "top" });

  s3.addShape("rect", { x: 0.4, y: 5.3, w: 6, h: 0.7, fill: { color: "252040" }, line: { color: BRAND_COLORS.muted, pt: 1 } });
  s3.addText(`🗣️ Nada Bicara: ${toneOfVoice}`, { x: 0.6, y: 5.4, w: 5.5, h: 0.4, fontSize: 11, color: BRAND_COLORS.white });

  // ─── Slide 4: Keahlian & Domain ───────────────────────────────────────────
  const s4 = pres.addSlide();
  makeBg(s4); slideLabel(s4, 4, TOTAL);
  s4.addText("Keahlian & Domain", { x: 0.4, y: 0.2, w: 12, h: 0.5, fontSize: 22, bold: true, color: BRAND_COLORS.white });
  s4.addShape("rect", { x: 0.4, y: 0.75, w: 1.5, h: 0.04, fill: { color: BRAND_COLORS.primary } });

  s4.addText("⚡ Area Keahlian", { x: 0.4, y: 1.0, w: 12, h: 0.35, fontSize: 13, bold: true, color: BRAND_COLORS.accent });
  if (expertise.length > 0) {
    expertise.slice(0, 9).forEach((exp, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 0.4 + col * 4.2;
      const y = 1.5 + row * 0.65;
      s4.addShape("rect", { x, y, w: 4, h: 0.5, fill: { color: "312E81" }, line: { color: BRAND_COLORS.primary, pt: 1 } });
      s4.addText(`✦  ${exp.substring(0, 45)}`, { x: x + 0.1, y: y + 0.05, w: 3.8, h: 0.4, fontSize: 10, color: BRAND_COLORS.white });
    });
  } else {
    s4.addText("Keahlian belum ditentukan.", { x: 0.4, y: 1.5, w: 12, h: 0.4, fontSize: 11, color: BRAND_COLORS.muted });
  }

  s4.addShape("rect", { x: 0.4, y: 3.75, w: 12.2, h: 2.8, fill: { color: "252040" }, line: { color: "10B981", pt: 1 } });
  s4.addText("🗺️ Domain Charter", { x: 0.6, y: 3.85, w: 11, h: 0.35, fontSize: 11, bold: true, color: "6EE7B7" });
  s4.addText(domainCharter.substring(0, 500), { x: 0.6, y: 4.25, w: 11.5, h: 2.1, fontSize: 11, color: BRAND_COLORS.white, breakLine: true, valign: "top" });

  // ─── Slide 5: Conversation Starters & Key Phrases ────────────────────────
  const s5 = pres.addSlide();
  makeBg(s5); slideLabel(s5, 5, TOTAL);
  s5.addText("Pertanyaan Pembuka & Frasa Kunci", { x: 0.4, y: 0.2, w: 12, h: 0.5, fontSize: 22, bold: true, color: BRAND_COLORS.white });
  s5.addShape("rect", { x: 0.4, y: 0.75, w: 1.5, h: 0.04, fill: { color: BRAND_COLORS.primary } });

  s5.addText("💬 Conversation Starters", { x: 0.4, y: 1.0, w: 12, h: 0.35, fontSize: 13, bold: true, color: BRAND_COLORS.accent });
  if (starters.length > 0) {
    starters.slice(0, 6).forEach((s, i) => {
      const y = 1.5 + i * 0.65;
      s5.addShape("rect", { x: 0.4, y, w: 12.2, h: 0.55, fill: { color: "1E1B3A" }, line: { color: BRAND_COLORS.primary, pt: 1 } });
      s5.addText(`❓  ${s.substring(0, 110)}`, { x: 0.6, y: y + 0.08, w: 11.8, h: 0.4, fontSize: 11, color: BRAND_COLORS.white });
    });
  } else {
    s5.addText("Conversation starters belum ditentukan.", { x: 0.4, y: 1.5, w: 12, h: 0.4, fontSize: 11, color: BRAND_COLORS.muted });
  }

  const kpY = 1.5 + Math.min(starters.length, 6) * 0.65 + 0.3;
  if (keyPhrases.length > 0 && kpY < 6.5) {
    s5.addText("🏷️ Frasa Kunci", { x: 0.4, y: kpY, w: 12, h: 0.35, fontSize: 12, bold: true, color: "FCD34D" });
    const kwRow: { text: string; options: any }[] = keyPhrases.slice(0, 8).flatMap((kp, i) => [
      { text: kp, options: { fontSize: 10, color: BRAND_COLORS.dark, bold: false } },
      ...(i < keyPhrases.length - 1 ? [{ text: "  ·  ", options: { fontSize: 10, color: BRAND_COLORS.muted } }] : []),
    ]);
    s5.addText(kwRow, { x: 0.4, y: kpY + 0.4, w: 12, h: 0.5, fill: { color: "FCD34D" }, shape: "rect" });
  }

  // ─── Slide 6: Kebijakan & Batasan ─────────────────────────────────────────
  const s6 = pres.addSlide();
  makeBg(s6); slideLabel(s6, 6, TOTAL);
  s6.addText("Kebijakan & Batasan", { x: 0.4, y: 0.2, w: 12, h: 0.5, fontSize: 22, bold: true, color: BRAND_COLORS.white });
  s6.addShape("rect", { x: 0.4, y: 0.75, w: 1.5, h: 0.04, fill: { color: BRAND_COLORS.primary } });

  const policies = [
    { icon: "🚫", label: "Respons Off-Topic", text: offTopicResponse, color: "EF4444" },
    { icon: "⭐", label: "Quality Bar", text: qualityBar, color: "F59E0B" },
    { icon: "⚖️", label: "Risk & Compliance", text: riskCompliance, color: "10B981" },
  ];
  policies.forEach((p, i) => {
    const y = 1.0 + i * 1.85;
    s6.addShape("rect", { x: 0.4, y, w: 12.2, h: 1.7, fill: { color: "252040" }, line: { color: p.color, pt: 1 } });
    s6.addText(`${p.icon}  ${p.label}`, { x: 0.6, y: y + 0.1, w: 11, h: 0.35, fontSize: 11, bold: true, color: `${p.color}` });
    s6.addText(p.text.substring(0, 300), { x: 0.6, y: y + 0.5, w: 11.5, h: 1.0, fontSize: 11, color: BRAND_COLORS.white, breakLine: true, valign: "top" });
  });

  // ─── Slide 7: Ringkasan Spesifikasi Teknis ────────────────────────────────
  const s7 = pres.addSlide();
  makeBg(s7); slideLabel(s7, 7, TOTAL);
  s7.addText("Spesifikasi Teknis", { x: 0.4, y: 0.2, w: 12, h: 0.5, fontSize: 22, bold: true, color: BRAND_COLORS.white });
  s7.addShape("rect", { x: 0.4, y: 0.75, w: 1.5, h: 0.04, fill: { color: BRAND_COLORS.primary } });

  const specs = [
    { label: "Nama", value: name },
    { label: "Tagline", value: tagline },
    { label: "Kategori", value: category },
    { label: "Nada Bicara", value: toneOfVoice },
    { label: "Primary Outcome", value: primaryOutcome },
    { label: "Model AI", value: safeText((data as any).aiModel || (agent as any).aiModel, "gpt-4o-mini") },
    { label: "Bahasa", value: safeText((data as any).language || (agent as any).language, "id") },
    { label: "Total Keahlian", value: `${expertise.length} area` },
    { label: "Conversation Starters", value: `${starters.length} pertanyaan` },
    { label: "Frasa Kunci", value: `${keyPhrases.length} frasa` },
  ];
  specs.forEach((sp, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.4 + col * 6.3;
    const y = 1.0 + row * 0.9;
    s7.addShape("rect", { x, y, w: 6, h: 0.75, fill: { color: "1E1B3A" }, line: { color: BRAND_COLORS.primary, pt: 1 } });
    s7.addText(sp.label, { x: x + 0.2, y: y + 0.05, w: 5.5, h: 0.28, fontSize: 9, color: BRAND_COLORS.muted, bold: true });
    s7.addText(sp.value.substring(0, 60), { x: x + 0.2, y: y + 0.35, w: 5.5, h: 0.3, fontSize: 11, color: BRAND_COLORS.white, bold: true });
  });

  s7.addShape("rect", { x: 0.4, y: 5.8, w: 12.2, h: 0.7, fill: { color: BRAND_COLORS.primary } });
  s7.addText(`Dokumen ini dibuat secara otomatis oleh Gustafta AI Platform  ·  ${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}`, {
    x: 0.6, y: 5.9, w: 11.8, h: 0.4, fontSize: 10, color: BRAND_COLORS.white, align: "center",
  });

  const slug = slugify(name);
  await pres.writeFile({ fileName: `${slug}-profil.pptx` });
}

async function generatePDF(agent: Agent, data: Partial<Agent>) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const name = safeText(data.name || agent.name, "Chatbot");
  const tagline = safeText((data as any).tagline || (agent as any).tagline, "Asisten AI Cerdas");
  const description = safeText(data.description || agent.description, "Deskripsi belum tersedia.");
  const personality = safeText((data as any).personality || (agent as any).personality, "-");
  const philosophy = safeText((data as any).philosophy || (agent as any).philosophy, "-");
  const greetingMessage = safeText((data as any).greetingMessage || (agent as any).greetingMessage, "-");
  const toneOfVoice = safeText((data as any).toneOfVoice || (agent as any).toneOfVoice, "professional");
  const primaryOutcome = safeText((data as any).primaryOutcome || (agent as any).primaryOutcome, "-");
  const domainCharter = safeText((data as any).domainCharter || (agent as any).domainCharter, "-");
  const offTopicResponse = safeText((data as any).offTopicResponse || (agent as any).offTopicResponse, "-");
  const qualityBar = safeText((data as any).qualityBar || (agent as any).qualityBar, "-");
  const riskCompliance = safeText((data as any).riskCompliance || (agent as any).riskCompliance, "-");
  const productSummary = safeText((data as any).productSummary || (agent as any).productSummary, "-");
  const category = safeText((agent as any).category, "AI Chatbot");
  const expertise = safeArray((data as any).expertise || (agent as any).expertise);
  const starters = safeArray((data as any).conversationStarters || (agent as any).conversationStarters);

  const W = 210;
  const MARGIN = 18;
  const CONTENT_W = W - MARGIN * 2;
  let y = 0;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkY = (needed = 20) => { if (y + needed > 270) addPage(); };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b] as [number, number, number];
  };

  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, maxWidth);
  };

  const sectionHeader = (title: string, icon = "") => {
    checkY(20);
    doc.setFillColor(...hexToRgb("5B4FE8"));
    doc.roundedRect(MARGIN, y, CONTENT_W, 9, 2, 2, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(`${icon} ${title}`, MARGIN + 4, y + 6.5);
    y += 13;
  };

  const fieldBlock = (label: string, value: string, maxLines = 6) => {
    const lines = wrapText(value, CONTENT_W - 4, 10);
    const visibleLines = lines.slice(0, maxLines);
    const blockH = visibleLines.length * 5 + 10;
    checkY(blockH + 4);
    doc.setFillColor(...hexToRgb("1E1B3A"));
    doc.roundedRect(MARGIN, y, CONTENT_W, blockH, 2, 2, "F");
    doc.setDrawColor(...hexToRgb("5B4FE8"));
    doc.roundedRect(MARGIN, y, CONTENT_W, blockH, 2, 2, "S");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb("A78BFA"));
    doc.text(label.toUpperCase(), MARGIN + 4, y + 6);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(230, 230, 240);
    visibleLines.forEach((line, i) => doc.text(line, MARGIN + 4, y + 10 + i * 5));
    y += blockH + 4;
  };

  // ── Cover page ──────────────────────────────────────────────────────────
  doc.setFillColor(...hexToRgb("1A1535"));
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(...hexToRgb("5B4FE8"));
  doc.rect(0, 0, 5, 297, "F");
  doc.rect(0, 270, W, 5, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...hexToRgb("A78BFA"));
  doc.text("PROFIL CHATBOT AI", MARGIN, 55);

  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  const nameLines = wrapText(name, 170, 32);
  nameLines.slice(0, 3).forEach((ln, i) => doc.text(ln, MARGIN, 70 + i * 16));

  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...hexToRgb("A78BFA"));
  doc.text(tagline.substring(0, 90), MARGIN, 120);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...hexToRgb("9CA3AF"));
  doc.text(`Kategori: ${category}`, MARGIN, 135);
  doc.text(`Primary Outcome: ${primaryOutcome}`, MARGIN, 143);

  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb("6B7280"));
  doc.text(`Dibuat oleh Gustafta AI Platform  ·  ${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}`, MARGIN, 275);

  // ── Page 2: Deskripsi ──────────────────────────────────────────────────
  addPage();
  doc.setFillColor(...hexToRgb("1A1535"));
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(...hexToRgb("5B4FE8"));
  doc.rect(0, 0, 5, 297, "F");

  sectionHeader("Deskripsi Chatbot", "📋");
  fieldBlock("Deskripsi", description, 8);
  sectionHeader("Ringkasan Produk", "🎯");
  fieldBlock("Product Summary", productSummary, 5);
  sectionHeader("Kepribadian & Filosofi", "🎭");
  fieldBlock("Kepribadian", personality, 4);
  fieldBlock("Filosofi Komunikasi", philosophy, 4);
  fieldBlock("Pesan Sambutan", greetingMessage, 3);
  fieldBlock("Nada Bicara", toneOfVoice, 1);

  // ── Page 3: Keahlian ───────────────────────────────────────────────────
  addPage();
  doc.setFillColor(...hexToRgb("1A1535"));
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(...hexToRgb("5B4FE8"));
  doc.rect(0, 0, 5, 297, "F");

  sectionHeader("Area Keahlian", "⚡");
  if (expertise.length > 0) {
    const perRow = 2;
    const colW = (CONTENT_W - 4) / perRow;
    expertise.slice(0, 12).forEach((exp, i) => {
      const col = i % perRow;
      const row = Math.floor(i / perRow);
      if (col === 0 && row > 0) checkY(14);
      const bx = MARGIN + col * (colW + 4);
      const by = y + (col === 0 && i > 0 ? 0 : 0);
      if (col === 0 || i === 0) {
        doc.setFillColor(...hexToRgb("312E81"));
        doc.roundedRect(bx, y, colW, 10, 2, 2, "F");
        doc.setDrawColor(...hexToRgb("5B4FE8"));
        doc.roundedRect(bx, y, colW, 10, 2, 2, "S");
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(230, 230, 240);
        doc.text(`✦  ${exp.substring(0, 38)}`, bx + 3, y + 7);
      } else {
        doc.setFillColor(...hexToRgb("312E81"));
        doc.roundedRect(bx, y - 10, colW, 10, 2, 2, "F");
        doc.setDrawColor(...hexToRgb("5B4FE8"));
        doc.roundedRect(bx, y - 10, colW, 10, 2, 2, "S");
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(230, 230, 240);
        doc.text(`✦  ${exp.substring(0, 38)}`, bx + 3, y - 3);
      }
      if (col === perRow - 1 || i === expertise.length - 1) y += 14;
    });
    y += 4;
  } else {
    doc.setFontSize(11);
    doc.setTextColor(...hexToRgb("9CA3AF"));
    doc.text("Belum ada keahlian yang ditentukan.", MARGIN, y); y += 10;
  }

  sectionHeader("Domain Charter", "🗺️");
  fieldBlock("Domain & Batasan Topik", domainCharter, 7);

  sectionHeader("Conversation Starters", "💬");
  if (starters.length > 0) {
    starters.slice(0, 8).forEach((s) => {
      const lines = wrapText(`• ${s}`, CONTENT_W - 8, 10);
      const blockH = lines.length * 5 + 6;
      checkY(blockH + 4);
      doc.setFillColor(...hexToRgb("1E1B3A"));
      doc.roundedRect(MARGIN, y, CONTENT_W, blockH, 2, 2, "F");
      doc.setDrawColor(...hexToRgb("5B4FE8"));
      doc.roundedRect(MARGIN, y, CONTENT_W, blockH, 2, 2, "S");
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(220, 220, 235);
      lines.forEach((ln, li) => doc.text(ln, MARGIN + 4, y + 5 + li * 5));
      y += blockH + 3;
    });
    y += 2;
  }

  sectionHeader("Kebijakan & Batasan", "⚖️");
  fieldBlock("Respons Off-Topic", offTopicResponse, 3);
  fieldBlock("Quality Bar", qualityBar, 3);
  fieldBlock("Risk & Compliance", riskCompliance, 3);

  const slug = slugify(name);
  doc.save(`${slug}-profil.pdf`);
}

export function AgentPresentationExport({ agent, formData = {} }: AgentPresentationExportProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"ppt" | "pdf" | null>(null);
  const { toast } = useToast();

  const handle = async (type: "ppt" | "pdf") => {
    setLoading(type);
    try {
      const merged = { ...agent, ...formData };
      if (type === "ppt") {
        await generatePPT(agent, formData);
        toast({ title: "PPT berhasil dibuat", description: "File .pptx telah diunduh ke perangkat Anda." });
      } else {
        await generatePDF(agent, formData);
        toast({ title: "PDF berhasil dibuat", description: "File .pdf telah diunduh ke perangkat Anda." });
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Gagal membuat presentasi", description: err?.message || "Terjadi kesalahan", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="shrink-0 border-violet-500/40 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
        data-testid="button-export-presentation"
      >
        <Presentation className="w-4 h-4 mr-1.5" />
        <span className="hidden sm:inline">Export Profil</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Presentation className="w-5 h-5 text-violet-400" />
              Export Profil Chatbot
            </DialogTitle>
            <DialogDescription>
              Unduh profil lengkap <span className="font-semibold text-foreground">{agent.name}</span> sebagai presentasi siap pakai.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <button
              onClick={() => handle("ppt")}
              disabled={loading !== null}
              data-testid="button-export-ppt"
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="p-2.5 rounded-lg bg-orange-500/15 shrink-0">
                {loading === "ppt" ? <Loader2 className="w-6 h-6 text-orange-400 animate-spin" /> : <Presentation className="w-6 h-6 text-orange-400" />}
              </div>
              <div>
                <p className="font-semibold text-foreground">PowerPoint (.pptx)</p>
                <p className="text-xs text-muted-foreground mt-0.5">7 slide profesional: cover, deskripsi, kepribadian, keahlian, starters, kebijakan, spesifikasi teknis</p>
              </div>
            </button>

            <button
              onClick={() => handle("pdf")}
              disabled={loading !== null}
              data-testid="button-export-pdf"
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="p-2.5 rounded-lg bg-red-500/15 shrink-0">
                {loading === "pdf" ? <Loader2 className="w-6 h-6 text-red-400 animate-spin" /> : <FileText className="w-6 h-6 text-red-400" />}
              </div>
              <div>
                <p className="font-semibold text-foreground">PDF Document (.pdf)</p>
                <p className="text-xs text-muted-foreground mt-0.5">Dokumen A4 multi-halaman: semua field, keahlian, conversation starters, dan kebijakan</p>
              </div>
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center pb-1">
            File dihasilkan langsung di browser — tidak perlu koneksi server tambahan
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
