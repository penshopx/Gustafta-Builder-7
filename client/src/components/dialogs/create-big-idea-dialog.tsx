import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useCreateBigIdea } from "@/hooks/use-big-ideas";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, AlertTriangle, Sparkles, Plus, X, GraduationCap } from "lucide-react";

interface CreateBigIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seriesId?: number | null;
  onCreated?: () => void;
}

export function CreateBigIdeaDialog({ open, onOpenChange, seriesId, onCreated }: CreateBigIdeaDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"problem" | "idea" | "inspiration" | "mentoring">("problem");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState<string[]>([""]);
  const [targetAudience, setTargetAudience] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(seriesId ? String(seriesId) : "none");
  const [selectedCoreId, setSelectedCoreId] = useState<string>("none");

  const { data: allSeries = [] } = useQuery<any[]>({ queryKey: ["/api/series"] });
  const { data: allCores = [] } = useQuery<any[]>({ queryKey: ["/api/cores"] });

  const availableCores = allCores.filter((c: any) => selectedSeriesId !== "none" && c.seriesId === selectedSeriesId);
  
  useEffect(() => {
    setSelectedSeriesId(seriesId ? String(seriesId) : "none");
  }, [seriesId]);

  useEffect(() => {
    setSelectedCoreId("none");
  }, [selectedSeriesId]);
  
  const createBigIdea = useCreateBigIdea();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Nama dan deskripsi wajib diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      const finalSeriesId = selectedSeriesId !== "none" ? selectedSeriesId : undefined;
      const finalCoreId = selectedCoreId !== "none" ? selectedCoreId : undefined;
      const payload = {
        name: name.trim(),
        type,
        description: description.trim(),
        goals: goals.filter(g => g.trim()),
        targetAudience: targetAudience.trim(),
        expectedOutcome: expectedOutcome.trim(),
        sortOrder: 0,
        ...(finalSeriesId ? { seriesId: finalSeriesId } : {}),
        ...(finalCoreId ? { coreId: finalCoreId } : {}),
      };
      console.log("[CreateBigIdea] Sending payload:", JSON.stringify(payload));
      const result = await createBigIdea.mutateAsync(payload);
      console.log("[CreateBigIdea] Success:", JSON.stringify(result));
      onCreated?.();
      
      toast({
        title: "Berhasil",
        description: "Perspektif berhasil dibuat",
      });
      
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error("[CreateBigIdea] Error:", error?.message || error);
      const errorMsg = error?.message || "Gagal membuat Perspektif";
      toast({
        title: "Error",
        description: errorMsg.includes("401") ? "Sesi login habis, silakan login ulang" : `Gagal membuat Perspektif: ${errorMsg}`,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setType("problem");
    setDescription("");
    setGoals([""]);
    setTargetAudience("");
    setExpectedOutcome("");
    setSelectedSeriesId(seriesId ? String(seriesId) : "none");
    setSelectedCoreId("none");
  };

  const addGoal = () => {
    setGoals([...goals, ""]);
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  const typeIcons = {
    problem: <AlertTriangle className="h-5 w-5" />,
    idea: <Lightbulb className="h-5 w-5" />,
    inspiration: <Sparkles className="h-5 w-5" />,
    mentoring: <GraduationCap className="h-5 w-5" />,
  };

  const typeLabels = {
    problem: "Problem - Masalah yang akan diatasi",
    idea: "Idea - Ide untuk mencapai sesuatu",
    inspiration: "Inspiration - Inspirasi untuk inovasi",
    mentoring: "Mentoring - Edukasi dan pendampingan",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Buat Perspektif Baru
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {allSeries.length > 0 && (
            <div className="space-y-2">
              <Label>Tujuan</Label>
              <Select value={selectedSeriesId} onValueChange={setSelectedSeriesId}>
                <SelectTrigger data-testid="select-series">
                  <SelectValue placeholder="Pilih Tujuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa Tujuan</SelectItem>
                  {allSeries.map((s: any) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {availableCores.length > 0 && (
            <div className="space-y-2">
              <Label>Core (opsional - payung strategis)</Label>
              <Select value={selectedCoreId} onValueChange={setSelectedCoreId}>
                <SelectTrigger data-testid="select-core">
                  <SelectValue placeholder="Pilih Core" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa Core</SelectItem>
                  {availableCores.map((c: any) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Tipe Perspektif</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "problem" | "idea" | "inspiration" | "mentoring")}
              className="grid grid-cols-1 gap-3"
            >
              {(["problem", "idea", "inspiration", "mentoring"] as const).map((t) => (
                <Label
                  key={t}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover-elevate ${
                    type === t ? "border-primary bg-primary/5" : ""
                  }`}
                 
                >
                  <RadioGroupItem value={t} />
                  <span className="text-primary">{typeIcons[t]}</span>
                  <span>{typeLabels[t]}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Perspektif *</Label>
            <Input
              id="name"
              placeholder="Contoh: Kepatuhan & Compliance"
              value={name}
              onChange={(e) => setName(e.target.value)}
             
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Textarea
              id="description"
              placeholder="Jelaskan secara detail tentang problem/idea/inspirasi Anda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
             
            />
          </div>

          <div className="space-y-2">
            <Label>Tujuan</Label>
            {goals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Tujuan ${index + 1}`}
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                 
                />
                {goals.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGoal(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addGoal}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tujuan
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audiens</Label>
            <Input
              id="targetAudience"
              placeholder="Contoh: UMKM di Indonesia"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
             
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedOutcome">Hasil yang Diharapkan</Label>
            <Textarea
              id="expectedOutcome"
              placeholder="Jelaskan hasil yang ingin dicapai..."
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              rows={3}
             
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createBigIdea.isPending}
             
            >
              {createBigIdea.isPending ? "Membuat..." : "Buat Perspektif"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
