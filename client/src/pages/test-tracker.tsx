import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  CheckCircle2, XCircle, Clock, ArrowLeft, RotateCcw,
  ChevronDown, ChevronUp, ExternalLink, ClipboardCheck,
  BarChart3, Bot, Info
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const BOTS = [
  { id: 23,  name: "Tender Hub",                      role: "Orchestrator",  color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  { id: 24,  name: "Tender Readiness Checker",         role: "Readiness",     color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { id: 25,  name: "Document Checklist Generator",     role: "Documents",     color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300" },
  { id: 26,  name: "Tender Risk Scoring Engine",       role: "Risk",          color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  { id: 339, name: "Document Compliance Checker",      role: "Compliance",    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
];

const TESTS = [
  {
    id: "T1",
    label: "T1 — ELICIT",
    title: "ELICIT State: Pertanyaan ≤3 field",
    description: "Berikan query ambigu tanpa detail (misal: 'saya mau ikut tender'). Bot harus tanya MAKSIMAL 3 field dalam 1 putaran, lalu lanjutkan analisis.",
    prompt: "Saya mau ikut tender proyek gedung pemerintah.",
    criteria: ["Bot tanya ≤ 3 field dalam satu respons", "Tidak meminta upload dokumen atau data yang tidak relevan", "Bot lanjutkan analisis setelah mendapat jawaban", "Tidak bertanya di putaran berikutnya tanpa analisis"],
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "T2",
    label: "T2 — ANALYZE+REPORT",
    title: "ANALYZE & REPORT: Output 4-persona terstruktur",
    description: "Berikan skenario lengkap. Bot harus output dengan header ▶[XX] per persona (atau ringkasan terstruktur untuk bot non-hub), plus Ringkasan Eksekutif.",
    prompt: "BUJK saya PT Maju Jaya, kualifikasi M2 sub-bidang bangunan gedung. Ingin ikut tender APBN Rp 15 miliar proyek renovasi gedung kantor kementerian. Tenaga ahli: 2 SKK Jenjang 7, 1 SKK Jenjang 6. Pengalaman proyek serupa Rp 12 miliar.",
    criteria: ["Output terstruktur dengan section/header yang jelas", "Setiap aspek dianalisis (kualifikasi, dokumen, risiko, dll)", "Ada Ringkasan Eksekutif atau summary di akhir", "Tidak ada paragraf pendek tanpa substansi"],
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "T3",
    label: "T3 — FALLBACK",
    title: "FALLBACK Mode: Asumsi bertanda",
    description: "Berikan query dengan data sangat minim. Bot harus tetap menganalisis dengan asumsi bertanda [ASUMSI: nilai | basis: regulasi | verifikasi-ke: pihak].",
    prompt: "Mau ikut tender. Kualifikasi saya kecil. Bantu saya.",
    criteria: ["Bot tidak menolak atau meminta lebih banyak data sebelum mulai", "Ada tag [ASUMSI: ...] atau minimal (asumsi: ...) dalam output", "Analisis tetap diberikan meski data sangat minim", "Bot tanya ≤ 3 field SETELAH memberikan analisis awal"],
    badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    id: "T4",
    label: "T4 — CLARIFY+REFINE",
    title: "CLARIFY & REFINE: Update analisis setelah data baru",
    description: "Setelah respons awal, berikan data tambahan. Bot harus memperbarui analisis dan menandai perubahan (✏️ atau kalimat perubahan).",
    prompt: "Lanjutan dari T2 — setelah analisis awal, informasikan: 'Ternyata nilai pengalaman kami hanya Rp 8 miliar, bukan Rp 12 miliar. Dan kami belum punya ISO 9001.'",
    criteria: ["Bot memperbarui analisis berdasarkan data baru", "Perubahan ditandai (✏️, 'diperbarui', atau kalimat eksplisit)", "Bot tidak mengulang seluruh analisis dari awal tanpa konteks", "Implikasi perubahan dijelaskan"],
    badge: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    id: "T5",
    label: "T5 — HANDOVER",
    title: "HANDOVER: Topik di luar domain",
    description: "Tanya sesuatu yang jelas di luar domain Tender/Pengadaan. Bot harus akui batas domain dan arahkan ke sumber yang tepat tanpa mengada-ada.",
    prompt: "Bagaimana cara mengurus perceraian? Dan juga, apa strategi investasi saham yang bagus untuk tahun ini?",
    criteria: ["Bot mengakui topik di luar domain-nya", "Bot menyebutkan domain yang tepat untuk konsultasi (bukan nama chatbot lain)", "Tidak mengada-ada jawaban di luar domain", "Respons tetap sopan dan profesional"],
    badge: "bg-gray-50 text-gray-700 border-gray-200",
  },
  {
    id: "T6",
    label: "T6 — CLOSE",
    title: "CLOSE State: Ringkasan + tindak lanjut",
    description: "Minta bot untuk menutup sesi atau merangkum diskusi. Bot harus memberikan 3 bullet ringkasan + 1 langkah tindak lanjut konkret.",
    prompt: "Tolong rangkum semua yang kita diskusikan dan berikan satu langkah yang harus saya ambil sekarang.",
    criteria: ["Ada minimal 3 bullet point ringkasan", "Ada 1 langkah tindak lanjut yang konkret dan spesifik", "Ringkasan mencakup poin-poin utama diskusi", "Format rapi dan mudah dibaca"],
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "T7",
    label: "T7 — ANTI-PATTERN",
    title: "Anti-Pattern Check: Tidak ada pola terlarang",
    description: "Cek bahwa bot tidak menggunakan pola terlarang. Berikan query umum dan amati respons apakah mengandung anti-pattern.",
    prompt: "Ceritakan apa yang bisa kamu bantu untuk persiapan tender saya secara lengkap.",
    criteria: ["❌ Tidak ada 'minta data minimum' atau 'minimal berikan data'", "❌ Tidak ada instruksi untuk paste data dari chatbot lain", "❌ Tidak ada 'arahkan ke Hub terkait' tanpa alternatif mandiri", "✓ Bot langsung menjelaskan kemampuan dan menawarkan bantuan konkret"],
    badge: "bg-red-50 text-red-700 border-red-200",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type TestStatus = "pending" | "pass" | "fail" | "skip";

interface CellResult {
  status: TestStatus;
  notes: string;
  timestamp?: string;
}

type GridState = Record<string, CellResult>;

const STORAGE_KEY = "gustafta_test_tracker_v1";

function cellKey(botId: number, testId: string) {
  return `${botId}_${testId}`;
}

function defaultGrid(): GridState {
  const g: GridState = {};
  for (const bot of BOTS) {
    for (const test of TESTS) {
      g[cellKey(bot.id, test.id)] = { status: "pending", notes: "" };
    }
  }
  return g;
}

function loadGrid(): GridState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultGrid(), ...JSON.parse(raw) };
  } catch {}
  return defaultGrid();
}

function saveGrid(g: GridState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(g));
}

// ─── Cell Status helpers ──────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: { icon: Clock,        label: "Pending", cls: "text-gray-400",                      bg: "bg-gray-50 dark:bg-gray-800/30",     border: "border-gray-200 dark:border-gray-700" },
  pass:    { icon: CheckCircle2, label: "Pass",    cls: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20",   border: "border-green-300 dark:border-green-700" },
  fail:    { icon: XCircle,      label: "Fail",    cls: "text-red-600 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-900/20",       border: "border-red-300 dark:border-red-700" },
  skip:    { icon: ChevronDown,  label: "Skip",    cls: "text-gray-400",                      bg: "bg-gray-50 dark:bg-gray-800/30",     border: "border-dashed border-gray-300 dark:border-gray-600" },
};

// ─── Components ───────────────────────────────────────────────────────────────

function StatusCycle({ status, onChange }: { status: TestStatus; onChange: (s: TestStatus) => void }) {
  const cycle: TestStatus[] = ["pending", "pass", "fail", "skip"];
  const next = () => onChange(cycle[(cycle.indexOf(status) + 1) % cycle.length]);
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <button
      onClick={next}
      data-testid={`status-cycle-${status}`}
      title={`Status: ${cfg.label} — klik untuk ganti`}
      className={`p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 ${cfg.cls}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

function ProgressBar({ pass, fail, total }: { pass: number; fail: number; total: number }) {
  const pct = Math.round((pass / total) * 100);
  const failPct = Math.round((fail / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{pass}/{total} Pass</span>
        <span className="font-semibold text-gray-700 dark:text-gray-300">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
        <div className="bg-green-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        <div className="bg-red-400 transition-all duration-500" style={{ width: `${failPct}%` }} />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TestTrackerPage() {
  const [grid, setGrid] = useState<GridState>(loadGrid);
  const [selected, setSelected] = useState<{ botId: number; testId: string } | null>(null);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => { saveGrid(grid); }, [grid]);

  const updateCell = useCallback((botId: number, testId: string, patch: Partial<CellResult>) => {
    setGrid(prev => {
      const k = cellKey(botId, testId);
      const updated = { ...prev, [k]: { ...prev[k], ...patch, timestamp: new Date().toISOString() } };
      return updated;
    });
  }, []);

  const resetAll = () => {
    setGrid(defaultGrid());
    setShowReset(false);
  };

  // ── Stats ──
  const allCells = BOTS.flatMap(b => TESTS.map(t => grid[cellKey(b.id, t.id)]));
  const passCount = allCells.filter(c => c.status === "pass").length;
  const failCount = allCells.filter(c => c.status === "fail").length;
  const doneCount = allCells.filter(c => c.status !== "pending").length;
  const total = BOTS.length * TESTS.length;

  const botStats = BOTS.map(bot => {
    const cells = TESTS.map(t => grid[cellKey(bot.id, t.id)]);
    return {
      bot,
      pass: cells.filter(c => c.status === "pass").length,
      fail: cells.filter(c => c.status === "fail").length,
      done: cells.filter(c => c.status !== "pending").length,
    };
  });

  const testStats = TESTS.map(test => {
    const cells = BOTS.map(b => grid[cellKey(b.id, test.id)]);
    return {
      test,
      pass: cells.filter(c => c.status === "pass").length,
      fail: cells.filter(c => c.status === "fail").length,
    };
  });

  // ── Selected cell data ──
  const selCell = selected ? grid[cellKey(selected.botId, selected.testId)] : null;
  const selBot = selected ? BOTS.find(b => b.id === selected.botId) : null;
  const selTest = selected ? TESTS.find(t => t.id === selected.testId) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" data-testid="btn-back">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm leading-tight">Test Tracker — Modul Tender</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">5 bot × 7 skenario · 35 sel evaluasi</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-sm">
              <span className="text-green-600 dark:text-green-400 font-semibold">{passCount}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 dark:text-gray-300">{total}</span>
              <span className="text-gray-400 text-xs ml-1">Pass</span>
            </div>
            {failCount > 0 && (
              <Badge variant="destructive" className="text-xs">{failCount} Fail</Badge>
            )}
            {passCount === total && (
              <Badge className="bg-green-600 text-white text-xs">✓ 35/35 PASS</Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReset(true)}
              data-testid="btn-reset"
              className="text-gray-500 hover:text-red-600"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Sel",   value: total,       cls: "text-gray-700 dark:text-gray-200",       sub: "5 bot × 7 test" },
            { label: "Selesai",     value: doneCount,   cls: "text-blue-600 dark:text-blue-400",       sub: `${total - doneCount} pending` },
            { label: "Pass",        value: passCount,   cls: "text-green-600 dark:text-green-400",     sub: `${Math.round(passCount / total * 100)}%` },
            { label: "Fail",        value: failCount,   cls: "text-red-500 dark:text-red-400",         sub: failCount === 0 ? "Bersih ✓" : "Perlu perbaikan" },
          ].map(card => (
            <div key={card.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.cls}`}>{card.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Overall Progress ── */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Progress Keseluruhan</span>
          </div>
          <ProgressBar pass={passCount} fail={failCount} total={total} />
          {passCount === total && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
              🎉 Semua 35 sel PASS — sistem siap untuk Fase 3!
            </p>
          )}
        </div>

        {/* ── Test Skenario Reference ── */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Skenario Test (T1–T7)</span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {TESTS.map(test => (
              <div key={test.id} className="px-4">
                <button
                  className="w-full flex items-center gap-3 py-3 text-left"
                  onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                  data-testid={`expand-test-${test.id}`}
                >
                  <Badge variant="outline" className={`text-xs font-mono shrink-0 ${test.badge}`}>{test.label}</Badge>
                  <span className="text-sm font-medium flex-1">{test.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {(() => {
                      const ts = testStats.find(s => s.test.id === test.id)!;
                      return (
                        <>
                          <span className="text-xs text-green-600 dark:text-green-400">{ts.pass}✓</span>
                          {ts.fail > 0 && <span className="text-xs text-red-500">{ts.fail}✗</span>}
                        </>
                      );
                    })()}
                    {expandedTest === test.id ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>
                </button>
                {expandedTest === test.id && (
                  <div className="pb-4 space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{test.description}</p>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Prompt yang disarankan:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{test.prompt}"</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Kriteria kelulusan:</p>
                      {test.criteria.map((c, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-gray-400 text-xs mt-0.5 shrink-0">{i + 1}.</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 35-Cell Grid ── */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Bot className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Matriks 35 Sel — Klik sel untuk detail & catatan</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs min-w-[180px]">Bot</th>
                  {TESTS.map(t => (
                    <th key={t.id} className="px-2 py-3 text-center font-mono text-xs text-gray-500 dark:text-gray-400 min-w-[70px]">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs border ${t.badge}`}>{t.id}</span>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center font-medium text-gray-500 dark:text-gray-400 text-xs min-w-[90px]">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {BOTS.map((bot, bi) => {
                  const bs = botStats[bi];
                  return (
                    <tr key={bot.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/bot/${bot.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title={`Buka ${bot.name}`}
                            data-testid={`link-bot-${bot.id}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <div>
                            <p className="font-medium text-xs text-gray-800 dark:text-gray-200 leading-tight">{bot.name}</p>
                            <Badge className={`text-[10px] px-1.5 py-0 mt-0.5 ${bot.color}`}>{bot.role}</Badge>
                          </div>
                        </div>
                      </td>
                      {TESTS.map(test => {
                        const k = cellKey(bot.id, test.id);
                        const cell = grid[k];
                        const cfg = STATUS_CONFIG[cell.status];
                        const isSelected = selected?.botId === bot.id && selected?.testId === test.id;
                        return (
                          <td key={test.id} className="px-2 py-2 text-center">
                            <div
                              className={`relative inline-flex flex-col items-center justify-center w-14 h-14 rounded-xl border cursor-pointer transition-all hover:scale-105 active:scale-95 ${cfg.bg} ${cfg.border} ${isSelected ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}
                              onClick={() => setSelected(isSelected ? null : { botId: bot.id, testId: test.id })}
                              data-testid={`cell-${bot.id}-${test.id}`}
                            >
                              <StatusCycle
                                status={cell.status}
                                onChange={s => updateCell(bot.id, test.id, { status: s })}
                              />
                              {cell.notes && (
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full" title="Ada catatan" />
                              )}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-3 py-3">
                        <div className="space-y-1 min-w-[80px]">
                          <ProgressBar pass={bs.pass} fail={bs.fail} total={TESTS.length} />
                          <p className="text-[10px] text-gray-400 text-center">
                            {bs.pass}/{TESTS.length} Pass
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
                <tr>
                  <td className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Per Skenario</td>
                  {testStats.map(ts => (
                    <td key={ts.test.id} className="px-2 py-2 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">{ts.pass}/5</span>
                        {ts.fail > 0 && <span className="text-xs text-red-500">{ts.fail}✗</span>}
                      </div>
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{passCount}/{total}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
          {Object.entries(STATUS_CONFIG).map(([s, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={s} className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${cfg.cls}`} />
                <span>{cfg.label}</span>
              </div>
            );
          })}
          <span className="ml-2">· Klik ikon untuk siklus status · Klik sel untuk tambah catatan</span>
        </div>
      </div>

      {/* ── Detail Panel (cell selected) ── */}
      {selected && selCell && selBot && selTest && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl z-30 max-h-[55vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-start justify-between mb-3 gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${STATUS_CONFIG[selCell.status].bg} ${STATUS_CONFIG[selCell.status].border}`}>
                  {(() => { const Icon = STATUS_CONFIG[selCell.status].icon; return <Icon className={`w-4.5 h-4.5 ${STATUS_CONFIG[selCell.status].cls}`} />; })()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{selBot.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selTest.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {(["pending","pass","fail","skip"] as TestStatus[]).map(s => {
                  const cfg = STATUS_CONFIG[s];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={s}
                      onClick={() => updateCell(selected.botId, selected.testId, { status: s })}
                      data-testid={`set-status-${s}`}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all
                        ${selCell.status === s
                          ? `${cfg.bg} ${cfg.border} ${cfg.cls}`
                          : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </button>
                  );
                })}
                <button
                  onClick={() => setSelected(null)}
                  className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                  data-testid="btn-close-panel"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Prompt yang diuji:</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 italic">
                  "{selTest.prompt}"
                </div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Kriteria kelulusan:</p>
                <div className="space-y-1">
                  {selTest.criteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="shrink-0 mt-0.5">{i + 1}.</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Catatan evaluator:</p>
                <Textarea
                  placeholder="Catat temuan, detail respons bot, atau alasan Pass/Fail di sini..."
                  value={selCell.notes}
                  onChange={e => updateCell(selected.botId, selected.testId, { notes: e.target.value })}
                  data-testid="input-notes"
                  className="h-28 text-sm resize-none"
                />
                {selCell.timestamp && (
                  <p className="text-[10px] text-gray-400">
                    Terakhir diupdate: {new Date(selCell.timestamp).toLocaleString("id-ID")}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <a
                    href={`/bot/${selected.botId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="btn-open-bot"
                  >
                    <Button size="sm" variant="outline" className="text-xs gap-1.5">
                      <ExternalLink className="w-3 h-3" />
                      Buka Bot
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset Confirmation Dialog ── */}
      <Dialog open={showReset} onOpenChange={setShowReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset semua hasil test?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Semua status dan catatan di 35 sel akan dihapus. Tindakan ini tidak bisa dibatalkan.
          </p>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" onClick={() => setShowReset(false)} className="flex-1">Batal</Button>
            <Button variant="destructive" onClick={resetAll} className="flex-1" data-testid="btn-confirm-reset">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Semua
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
