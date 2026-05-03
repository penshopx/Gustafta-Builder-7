import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, ChevronDown, ChevronUp, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

export type AiConfigLevel = "bigidea" | "toolbox" | "agent-persona" | "agent-policy";

interface AiConfigFillProps {
  level: AiConfigLevel;
  parentContext?: {
    seriesName?: string;
    bigIdeaName?: string;
    toolboxName?: string;
    agentName?: string;
  };
  onFill: (result: Record<string, any>) => void;
  compact?: boolean;
  defaultTopic?: string;
  placeholder?: string;
}

const LEVEL_LABELS: Record<AiConfigLevel, string> = {
  bigidea: "Modul (BigIdea)",
  toolbox: "Chatbot (Toolbox)",
  "agent-persona": "Persona Agen",
  "agent-policy": "Kebijakan Agen",
};

const LEVEL_PLACEHOLDERS: Record<AiConfigLevel, string> = {
  bigidea: "Contoh: Kepatuhan SBU & Klasifikasi Jasa Konstruksi",
  toolbox: "Contoh: Asisten Perizinan SKK Tenaga Ahli",
  "agent-persona": "Contoh: Spesialis hukum konstruksi yang membantu kontraktor",
  "agent-policy": "Contoh: Chatbot kepatuhan regulasi untuk perusahaan konstruksi",
};

export function AiConfigFill({
  level,
  parentContext = {},
  onFill,
  compact = false,
  defaultTopic = "",
  placeholder,
}: AiConfigFillProps) {
  const [expanded, setExpanded] = useState(false);
  const [topic, setTopic] = useState(defaultTopic);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topik diperlukan",
        description: "Masukkan topik atau deskripsi singkat tentang chatbot ini.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const data = await apiRequest("POST", "/api/ai/generate-config", {
        level,
        topic: topic.trim(),
        parentContext,
      });
      if (data?.result && Object.keys(data.result).length > 0) {
        onFill(data.result);
        toast({
          title: "✨ Berhasil di-generate!",
          description: `Field ${LEVEL_LABELS[level]} telah diisi otomatis. Periksa dan sesuaikan seperlunya.`,
        });
        if (!compact) setExpanded(false);
      } else {
        throw new Error("Hasil generate kosong");
      }
    } catch (err: any) {
      toast({
        title: "Gagal generate",
        description: err?.message || "Coba lagi atau isi field secara manual.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (compact) {
    return (
      <div className="flex gap-2">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={placeholder || LEVEL_PLACEHOLDERS[level]}
          className="flex-1 h-8 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          disabled={isGenerating}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="gap-1.5 shrink-0 border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950"
          data-testid="button-ai-config-fill"
        >
          {isGenerating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Wand2 className="h-3.5 w-3.5" />
          )}
          {isGenerating ? "Generate..." : "Generate AI"}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg border transition-all duration-200",
      expanded
        ? "border-violet-300 bg-violet-50/50 dark:border-violet-700 dark:bg-violet-950/20"
        : "border-dashed border-violet-200 dark:border-violet-800 bg-transparent"
    )}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-violet-800 dark:text-violet-200">
              ✨ Isi dengan AI — OpenClaw/MultiClaw
            </p>
            <p className="text-xs text-violet-600 dark:text-violet-400">
              Generate semua field {LEVEL_LABELS[level]} otomatis dari satu topik
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-violet-500 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-violet-500 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-violet-200 dark:border-violet-700 pt-3">
          {Object.values(parentContext).some(Boolean) && (
            <div className="text-xs text-violet-600 dark:text-violet-400 bg-violet-100/60 dark:bg-violet-900/30 rounded px-2 py-1.5">
              <span className="font-medium">Konteks hierarki:</span>{" "}
              {[
                parentContext.seriesName && `Series: ${parentContext.seriesName}`,
                parentContext.bigIdeaName && `Modul: ${parentContext.bigIdeaName}`,
                parentContext.toolboxName && `Chatbot: ${parentContext.toolboxName}`,
                parentContext.agentName && `Agen: ${parentContext.agentName}`,
              ].filter(Boolean).join(" → ")}
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs text-violet-700 dark:text-violet-300 font-medium">
              Topik / Deskripsi Singkat
            </Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={placeholder || LEVEL_PLACEHOLDERS[level]}
              className="border-violet-200 dark:border-violet-700 focus-visible:ring-violet-400"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              disabled={isGenerating}
              data-testid="input-ai-topic"
            />
            <p className="text-xs text-muted-foreground">
              AI akan menggunakan metodologi OpenClaw (pemetaan domain) + MultiClaw (sintesis lintas-domain) untuk mengisi semua field.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white"
            data-testid="button-ai-generate-config"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Orchestrator sedang memproses...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate & Isi Semua Field
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
