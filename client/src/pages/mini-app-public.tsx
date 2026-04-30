import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckSquare, Calculator, AlertTriangle, TrendingUp, FileOutput, Wrench, MessageSquare, ExternalLink, ArrowRight, Sparkles, BarChart2, ClipboardList } from "lucide-react";
import { usePublicMiniApp, usePublicMiniAppResult } from "@/hooks/use-mini-apps";
import type { MiniAppType, MiniApp, MiniAppResult } from "@shared/schema";
import { cn } from "@/lib/utils";

const typeIcons: Partial<Record<MiniAppType, typeof CheckSquare>> = {
  checklist: CheckSquare,
  calculator: Calculator,
  risk_assessment: AlertTriangle,
  progress_tracker: TrendingUp,
  document_generator: FileOutput,
  lead_capture_form: MessageSquare,
  scoring_assessment: BarChart2,
  gap_analysis: ClipboardList,
  recommendation_engine: Sparkles,
};

const typeLabels: Partial<Record<MiniAppType, string>> = {
  checklist: "Checklist",
  calculator: "Kalkulator",
  risk_assessment: "Penilaian Risiko",
  progress_tracker: "Pelacak Progres",
  document_generator: "Generator Dokumen",
  lead_capture_form: "Formulir",
  scoring_assessment: "Penilaian & Scoring",
  gap_analysis: "Gap Analysis",
  recommendation_engine: "Rekomendasi",
};

const AI_TYPES: MiniAppType[] = [
  "project_snapshot", "decision_summary", "risk_radar", "issue_log", "action_tracker",
  "change_log", "scoring_assessment", "gap_analysis", "recommendation_engine",
  "nib_status_report", "whatsapp_status_update", "internal_project_report",
  "compliance_matrix", "tender_audit_report", "go_no_go_checklist",
  "pqp_document", "hse_plan", "executive_summary_penawaran", "metode_pelaksanaan",
];

function ChecklistRunner({ config, name }: { config: Record<string, unknown>; name: string }) {
  const items = ((config?.items ?? config?.checklist_items) as string[] | undefined) ?? [];
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const total = items.length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">Belum ada item dalam checklist ini.</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground">{done}/{total} selesai</span>
          <span className="text-sm font-medium">{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <label key={idx} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors" data-testid={`checklist-item-${idx}`}>
            <Checkbox
              checked={!!checked[idx]}
              onCheckedChange={(v) => setChecked(prev => ({ ...prev, [idx]: !!v }))}
              className="mt-0.5"
            />
            <span className={cn("text-sm", checked[idx] && "line-through text-muted-foreground")}>{item}</span>
          </label>
        ))}
      </div>
      {pct === 100 && (
        <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-center">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">Semua item selesai! ✓</p>
        </div>
      )}
    </div>
  );
}

function safeEvalFormula(formula: string, scope: Record<string, number>): number | null {
  const substituted = formula.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (match) =>
    scope[match] !== undefined ? String(scope[match]) : "0"
  );
  if (!/^[\d\s\+\-\*\/\.\(\)]+$/.test(substituted)) return null;
  const tokens = substituted.match(/\d+\.?\d*|\+|-|\*|\/|\(|\)/g);
  if (!tokens) return null;
  let pos = 0;
  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];
  function parseExpr(): number {
    let left = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = consume();
      const right = parseTerm();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }
  function parseTerm(): number {
    let left = parseFactor();
    while (peek() === "*" || peek() === "/") {
      const op = consume();
      const right = parseFactor();
      left = op === "*" ? left * right : right !== 0 ? left / right : 0;
    }
    return left;
  }
  function parseFactor(): number {
    const t = peek();
    if (t === "(") {
      consume();
      const val = parseExpr();
      consume();
      return val;
    }
    if (t === "-") { consume(); return -parseFactor(); }
    return parseFloat(consume() ?? "0");
  }
  try { return parseExpr(); } catch { return null; }
}

type CalcPreset = { name: string; inputs: string[]; formula: string; unit?: string };

function CalculatorRunner({ config }: { config: Record<string, unknown> }) {
  const presets = (config?.presets as CalcPreset[] | undefined) ?? [];
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);

  const preset = presets[selectedPreset];

  const calculate = () => {
    if (!preset) return;
    try {
      const scope: Record<string, number> = {};
      for (const key of (preset.inputs || [])) {
        scope[key] = parseFloat(inputs[key] || "0");
      }
      const val = safeEvalFormula(preset.formula, scope);
      if (val === null) { setResult(null); return; }
      const rules = config?.rules as { round_result?: number } | undefined;
      const rounded = rules?.round_result ? parseFloat(val.toFixed(rules.round_result)) : val;
      setResult(rounded);
    } catch {
      setResult(null);
    }
  };

  if (presets.length === 0) {
    return <p className="text-muted-foreground text-sm">Kalkulator belum dikonfigurasi.</p>;
  }

  return (
    <div className="space-y-4">
      {presets.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <Button
              key={idx}
              variant={selectedPreset === idx ? "default" : "outline"}
              size="sm"
              onClick={() => { setSelectedPreset(idx); setInputs({}); setResult(null); }}
              data-testid={`calc-preset-${idx}`}
            >
              {p.name}
            </Button>
          ))}
        </div>
      )}
      {preset && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">{preset.name}</h4>
          {(preset.inputs || []).map((inputKey: string) => (
            <div key={inputKey} className="space-y-1">
              <Label>{inputKey.replace(/_/g, " ")}</Label>
              <Input
                type="number"
                value={inputs[inputKey] || ""}
                onChange={e => setInputs(prev => ({ ...prev, [inputKey]: e.target.value }))}
                placeholder="0"
                data-testid={`calc-input-${inputKey}`}
              />
            </div>
          ))}
          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Hitung
          </Button>
          {result !== null && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
              <p className="text-2xl font-bold">{result.toLocaleString("id-ID")}</p>
              {preset.unit && <p className="text-sm text-muted-foreground mt-1">{preset.unit}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RiskAssessmentRunner({ config }: { config: Record<string, unknown> }) {
  const categories = (config?.risk_categories as string[] | undefined) ?? ["Safety", "Quality", "Cost", "Schedule"];
  const [likelihood, setLikelihood] = useState(1);
  const [impact, setImpact] = useState(1);
  const [category, setCategory] = useState(categories[0] || "");
  const [description, setDescription] = useState("");

  const score = likelihood * impact;
  const scoring = config?.scoring as { thresholds?: { low_max: number; medium_max: number; high_min: number } } | undefined;
  const thresholds = scoring?.thresholds ?? { low_max: 6, medium_max: 14, high_min: 15 };
  const level = score <= thresholds.low_max ? "Rendah" : score <= thresholds.medium_max ? "Sedang" : "Tinggi";
  const levelColor = score <= thresholds.low_max ? "text-green-600" : score <= thresholds.medium_max ? "text-yellow-600" : "text-red-600";
  const levelBg = score <= thresholds.low_max ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" : score <= thresholds.medium_max ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800" : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Kategori Risiko</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat: string) => (
            <Button key={cat} variant={category === cat ? "default" : "outline"} size="sm" onClick={() => setCategory(cat)} data-testid={`risk-cat-${cat}`}>{cat}</Button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Deskripsi Risiko</Label>
        <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi singkat risiko..." data-testid="risk-description" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Likelihood (1-5)</Label>
          <Input type="number" min={1} max={5} value={likelihood} onChange={e => setLikelihood(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))} data-testid="risk-likelihood" />
        </div>
        <div className="space-y-2">
          <Label>Impact (1-5)</Label>
          <Input type="number" min={1} max={5} value={impact} onChange={e => setImpact(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))} data-testid="risk-impact" />
        </div>
      </div>
      <div className={cn("p-4 rounded-lg border", levelBg)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Skor Risiko (L × I)</p>
            <p className="text-2xl font-bold mt-0.5">{score}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Level</p>
            <p className={cn("text-xl font-bold mt-0.5", levelColor)}>{level}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type Milestone = { name?: string };

function ProgressTrackerRunner({ config }: { config: Record<string, unknown> }) {
  const milestones = (config?.milestones as Milestone[] | undefined) ?? [];
  const [progress, setProgress] = useState<Record<string, number>>({});

  if (milestones.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Masukkan progres paket pekerjaan (0-100%):</p>
        {["Persiapan", "Pekerjaan Utama", "Finishing", "Serah Terima"].map((item) => (
          <div key={item} className="space-y-1">
            <div className="flex justify-between items-center">
              <Label className="text-sm">{item}</Label>
              <span className="text-sm font-medium">{progress[item] || 0}%</span>
            </div>
            <Input type="range" min={0} max={100} value={progress[item] || 0} onChange={e => setProgress(prev => ({ ...prev, [item]: parseInt(e.target.value) }))} data-testid={`progress-${item}`} />
          </div>
        ))}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Rata-rata progres</p>
          <p className="text-2xl font-bold mt-0.5">
            {Math.round(Object.values(progress).reduce((a, b) => a + b, 0) / Math.max(1, Object.values(progress).length))}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {milestones.map((m, idx) => (
        <div key={idx} className="p-3 rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-sm">{m.name || `Milestone ${idx + 1}`}</span>
            <span className="text-sm">{progress[String(idx)] || 0}%</span>
          </div>
          <Input type="range" min={0} max={100} value={progress[String(idx)] || 0} onChange={e => setProgress(prev => ({ ...prev, [String(idx)]: parseInt(e.target.value) }))} data-testid={`milestone-${idx}`} />
        </div>
      ))}
    </div>
  );
}

function SimpleFormRunner({ config, name }: { config: Record<string, unknown>; name: string }) {
  const fields = (config?.fields as string[] | undefined) ?? ["nama", "email", "pesan"];
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckSquare className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="font-semibold">Terima kasih!</h3>
        <p className="text-sm text-muted-foreground mt-1">Data Anda telah diterima.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fields.map((field: string) => (
        <div key={field} className="space-y-1">
          <Label className="capitalize">{field.replace(/_/g, " ")}</Label>
          <Input value={values[field] || ""} onChange={e => setValues(prev => ({ ...prev, [field]: e.target.value }))} placeholder={`Masukkan ${field.replace(/_/g, " ")}...`} data-testid={`form-input-${field}`} />
        </div>
      ))}
      <Button className="w-full" onClick={() => setSubmitted(true)} data-testid="button-submit-form">
        Kirim
      </Button>
    </div>
  );
}

function AIOutputRunner({ miniApp, result, agentId }: { miniApp: MiniApp; result: MiniAppResult | null; agentId: string }) {
  const output = result?.output as Record<string, unknown> | null | undefined;
  const hasOutput = output && (output.result || output.output || output.content);
  const outputText = String(output?.result ?? output?.output ?? output?.content ?? "");

  return (
    <div className="space-y-4">
      {hasOutput ? (
        <div>
          <div className="text-xs text-muted-foreground mb-2">
            Hasil terakhir — {result?.createdAt ? new Date(result.createdAt).toLocaleString("id-ID") : ""}
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
            {outputText}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Belum ada hasil analisis untuk mini app ini.</p>
        </div>
      )}
      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-sm font-medium mb-1">Minta Analisis Baru</p>
        <p className="text-xs text-muted-foreground mb-3">
          Untuk mendapatkan analisis terbaru, chat dengan chatbot dan minta analisis {miniApp.name}.
        </p>
        <Button asChild size="sm" className="w-full" data-testid="button-go-to-chatbot">
          <a href={`/bot/${agentId}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Chat dengan Chatbot
          </a>
        </Button>
      </div>
    </div>
  );
}

function AppRunner({ miniApp, result, agentId }: { miniApp: MiniApp; result: MiniAppResult | null; agentId: string }) {
  const type = miniApp.type;
  const config = (miniApp.config as Record<string, unknown>) || {};

  if (AI_TYPES.includes(type)) {
    return <AIOutputRunner miniApp={miniApp} result={result} agentId={agentId} />;
  }

  switch (type) {
    case "checklist":
    case "go_no_go_checklist":
      return <ChecklistRunner config={{ ...config, items: (config.items as string[] | undefined) ?? [] }} name={miniApp.name} />;
    case "calculator":
      return <CalculatorRunner config={config} />;
    case "risk_assessment":
      return <RiskAssessmentRunner config={config} />;
    case "progress_tracker":
      return <ProgressTrackerRunner config={config} />;
    case "lead_capture_form":
    case "document_generator":
    case "custom":
    default:
      return <SimpleFormRunner config={config} name={miniApp.name} />;
  }
}

export default function MiniAppPublic() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [, navigate] = useLocation();

  const { data, isLoading, error } = usePublicMiniApp(slug);
  const { data: resultData } = usePublicMiniAppResult(slug);

  const miniAppData = data ? (data as { miniApp: MiniApp; agent: { id: string; name: string; avatar?: string; tagline?: string; description?: string } | null }) : null;

  useEffect(() => {
    if (!miniAppData) return;
    const { miniApp, agent } = miniAppData;
    const title = `${miniApp.name} — ${agent?.name ?? "Mini App"}`;
    const description = miniApp.description || `Mini app: ${miniApp.name}`;
    document.title = title;
    const setMeta = (attr: string, value: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${value}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute(attr, value); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    };
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    return () => { document.title = ""; };
  }, [miniAppData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm px-4">
          <h2 className="text-xl font-semibold mb-2">Mini App Tidak Ditemukan</h2>
          <p className="text-muted-foreground text-sm">Link ini mungkin sudah tidak aktif atau tidak valid.</p>
        </div>
      </div>
    );
  }

  const { miniApp, agent } = miniAppData!;
  const TypeIcon = typeIcons[miniApp.type] || Wrench;
  const typeLabel = typeLabels[miniApp.type] || miniApp.type;

  const agentColor = "#6366f1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {agent && (
          <div className="flex items-center gap-3 mb-6 p-3 bg-background/80 rounded-xl border shadow-sm">
            <Avatar className="w-10 h-10 border-2" style={{ borderColor: `${agentColor}40` }}>
              {agent.avatar ? <AvatarImage src={agent.avatar} alt={agent.name} /> : null}
              <AvatarFallback style={{ backgroundColor: `${agentColor}15`, color: agentColor }}>
                {agent.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{agent.name}</p>
              {agent.tagline && <p className="text-xs text-muted-foreground truncate">{agent.tagline}</p>}
            </div>
            <Button variant="ghost" size="sm" asChild className="shrink-0" data-testid="button-visit-chatbot">
              <a href={`/bot/${agent.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Chat
              </a>
            </Button>
          </div>
        )}

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <TypeIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg leading-tight">{miniApp.name}</CardTitle>
                <Badge variant="secondary" className="text-xs mt-1">{typeLabel}</Badge>
              </div>
            </div>
            {miniApp.description && (
              <p className="text-sm text-muted-foreground mt-2">{miniApp.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <AppRunner miniApp={miniApp} result={(resultData?.result as MiniAppResult | null) ?? null} agentId={miniApp.agentId} />
          </CardContent>
        </Card>

        {agent && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Punya pertanyaan lebih lanjut?</p>
            <Button asChild variant="outline" data-testid="button-ask-chatbot">
              <a href={`/bot/${agent.id}`} target="_blank" rel="noopener noreferrer">
                <ArrowRight className="w-4 h-4 mr-2" />
                Tanya Lebih Lanjut ke {agent.name}
              </a>
            </Button>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by <span className="font-medium">Gustafta</span>
        </p>
      </div>
    </div>
  );
}
