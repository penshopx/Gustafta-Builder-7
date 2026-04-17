import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCreateBigIdea } from "@/hooks/use-big-ideas";
import { apiRequest } from "@/lib/queryClient";
import {
  Sparkles, Plus, X, Loader2, Lightbulb, Target, Users, BookOpen,
  ArrowRight, ArrowLeft, CheckCircle2, Youtube, Link2, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  name: string;
  type: "idea" | "inspiration" | "problem" | "mentoring";
  description: string;
  goals: string[];
  targetAudience: string;
  reasoning: string;
  expectedOutcome: string;
}

interface GenerateBigIdeasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seriesId?: number | null;
  onCreated?: () => void;
}

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  idea: { label: "Ide & Inovasi", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30", icon: Lightbulb },
  inspiration: { label: "Inspirasi", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30", icon: Sparkles },
  problem: { label: "Problem Solving", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30", icon: Target },
  mentoring: { label: "Mentoring", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30", icon: Users },
};

export function GenerateBigIdeasDialog({ open, onOpenChange, seriesId, onCreated }: GenerateBigIdeasDialogProps) {
  const [step, setStep] = useState<"input" | "results">("input");
  const [topic, setTopic] = useState("");
  const [referenceText, setReferenceText] = useState("");
  const [urls, setUrls] = useState<string[]>([""]);
  const [count, setCount] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isCreating, setIsCreating] = useState(false);

  const { toast } = useToast();
  const createBigIdea = useCreateBigIdea();

  const addUrl = () => setUrls(prev => [...prev, ""]);
  const removeUrl = (i: number) => setUrls(prev => prev.filter((_, idx) => idx !== i));
  const updateUrl = (i: number, val: string) => setUrls(prev => prev.map((u, idx) => idx === i ? val : u));

  const handleGenerate = async () => {
    const hasContent = referenceText.trim() || urls.some(u => u.trim()) || topic.trim();
    if (!hasContent) {
      toast({ title: "Butuh referensi", description: "Isi minimal satu dari: topik, teks referensi, atau URL", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await apiRequest("POST", "/api/ai/generate-big-ideas", {
        topic: topic.trim() || undefined,
        referenceText: referenceText.trim() || undefined,
        urls: urls.filter(u => u.trim()),
        count,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal generate");
      setSuggestions(data.suggestions || []);
      setSelected(new Set(data.suggestions.map((_: any, i: number) => i)));
      setStep("results");
    } catch (err: any) {
      toast({ title: "Gagal generate", description: err.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSelect = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(suggestions.map((_, i) => i)));
  const clearAll = () => setSelected(new Set());

  const handleCreateSelected = async () => {
    if (selected.size === 0) {
      toast({ title: "Pilih minimal 1 Big Idea", variant: "destructive" });
      return;
    }
    setIsCreating(true);
    const toCreate = suggestions.filter((_, i) => selected.has(i));
    let successCount = 0;
    for (const s of toCreate) {
      try {
        await createBigIdea.mutateAsync({
          name: s.name,
          type: s.type,
          description: s.description,
          goals: s.goals,
          targetAudience: s.targetAudience,
          expectedOutcome: s.expectedOutcome,
          sortOrder: 0,
          monthlyPrice: 0,
          trialEnabled: true,
          trialDays: 7,
          requireRegistration: false,
          seriesId: seriesId ? String(seriesId) : undefined,
        });
        successCount++;
      } catch (e) {
        console.error("Failed to create big idea:", s.name, e);
      }
    }
    setIsCreating(false);
    toast({ title: `${successCount} Big Idea berhasil dibuat!`, description: "Sekarang tambahkan Toolbox di setiap Big Idea." });
    onCreated?.();
    handleClose();
  };

  const handleClose = () => {
    setStep("input");
    setTopic("");
    setReferenceText("");
    setUrls([""]);
    setCount(6);
    setSuggestions([]);
    setSelected(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {step === "input" ? "Generate Big Idea dari Referensi" : `${suggestions.length} Saran Big Idea Ditemukan`}
          </DialogTitle>
          <DialogDescription>
            {step === "input"
              ? "Masukkan referensi (teks, URL, YouTube, atau topik) — AI akan menyarankan Big Idea chatbot terbaik."
              : "Pilih Big Idea yang ingin langsung dibuat di ekosistem Anda."}
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-5 py-2">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-orange-500" />
                Topik / Bidang
              </Label>
              <Input
                placeholder="Contoh: Konstruksi gedung, SKK Sipil, ISO 9001, UMKM retail..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                data-testid="input-topic"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                Teks Referensi
                <span className="text-xs text-muted-foreground font-normal">(paste isi dokumen, modul, atau catatan)</span>
              </Label>
              <Textarea
                placeholder="Paste teks dari PDF, dokumen Word, modul pelatihan, catatan kuliah, artikel, atau konten apapun yang ingin dijadikan dasar saran..."
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                rows={5}
                className="resize-none"
                data-testid="textarea-reference"
              />
              <p className="text-xs text-muted-foreground">AI membaca hingga 8.000 karakter pertama</p>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-green-500" />
                URL Referensi
                <span className="text-xs text-muted-foreground font-normal">(link YouTube, artikel, website)</span>
              </Label>
              {urls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex items-center gap-1.5 flex-1">
                    {url.includes("youtube.com") || url.includes("youtu.be") ? (
                      <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                    ) : (
                      <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <Input
                      placeholder="https://youtube.com/watch?v=... atau https://artikel.com/..."
                      value={url}
                      onChange={(e) => updateUrl(i, e.target.value)}
                      className="flex-1"
                      data-testid={`input-url-${i}`}
                    />
                  </div>
                  {urls.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeUrl(i)} className="shrink-0 h-9 w-9 text-destructive">
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addUrl} className="gap-1.5 text-xs">
                <Plus className="w-3 h-3" />
                Tambah URL
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label>Jumlah Saran yang Dihasilkan</Label>
              <div className="flex gap-2">
                {[4, 6, 8, 10].map(n => (
                  <Button
                    key={n}
                    variant={count === n ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCount(n)}
                    data-testid={`button-count-${n}`}
                  >
                    {n}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleGenerate}
              disabled={isGenerating}
              data-testid="button-generate"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" />AI sedang menganalisis referensi...</>
              ) : (
                <><Sparkles className="w-4 h-4" />Generate Saran Big Idea</>
              )}
            </Button>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep("input")}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Ubah referensi
              </button>
              <div className="flex gap-2 text-xs">
                <button onClick={selectAll} className="text-primary hover:underline">Pilih semua</button>
                <span className="text-muted-foreground">·</span>
                <button onClick={clearAll} className="text-muted-foreground hover:text-foreground hover:underline">Hapus pilihan</button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {suggestions.map((s, i) => {
                const cfg = typeConfig[s.type] || typeConfig.idea;
                const TypeIcon = cfg.icon;
                const isChecked = selected.has(i);
                return (
                  <Card
                    key={i}
                    className={cn(
                      "cursor-pointer transition-all border-2",
                      isChecked ? "border-primary/40 bg-primary/5" : "border-transparent hover:border-border"
                    )}
                    onClick={() => toggleSelect(i)}
                    data-testid={`card-suggestion-${i}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSelect(i)}
                          className="mt-0.5 shrink-0"
                          data-testid={`checkbox-suggestion-${i}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h4 className="font-semibold text-sm leading-tight">{s.name}</h4>
                            <Badge variant="outline" className={cn("text-xs gap-1 shrink-0", cfg.color)}>
                              <TypeIcon className="w-3 h-3" />
                              {cfg.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{s.description}</p>
                          <div className="flex items-start gap-1.5 mb-2">
                            <Users className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-foreground">{s.targetAudience}</span>
                          </div>
                          <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/20">
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                              <span className="font-semibold">Kenapa menarik: </span>{s.reasoning}
                            </p>
                          </div>
                          {s.goals && s.goals.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {s.goals.slice(0, 3).map((g, gi) => (
                                <span key={gi} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                  {g}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => { setStep("input"); handleGenerate(); }}
                disabled={isGenerating || isCreating}
                className="gap-1.5"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Ulang
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleCreateSelected}
                disabled={selected.size === 0 || isCreating}
                data-testid="button-create-selected"
              >
                {isCreating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Membuat {selected.size} Big Idea...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" />Buat {selected.size} Big Idea Terpilih</>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
