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
import { useUpdateBigIdea } from "@/hooks/use-big-ideas";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, AlertTriangle, Sparkles, Plus, X, GraduationCap, Pencil } from "lucide-react";
import type { BigIdea } from "@shared/schema";

interface EditBigIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bigIdea: BigIdea;
}

export function EditBigIdeaDialog({ open, onOpenChange, bigIdea }: EditBigIdeaDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"problem" | "idea" | "inspiration" | "mentoring">("problem");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState<string[]>([""]);
  const [targetAudience, setTargetAudience] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("none");
  const [selectedCoreId, setSelectedCoreId] = useState<string>("none");

  const { data: allSeries = [] } = useQuery<any[]>({ queryKey: ["/api/series"] });
  const { data: allCores = [] } = useQuery<any[]>({ queryKey: ["/api/cores"] });
  const availableCores = allCores.filter((c: any) => selectedSeriesId !== "none" && c.seriesId === selectedSeriesId);
  const updateBigIdea = useUpdateBigIdea();
  const { toast } = useToast();

  useEffect(() => {
    if (open && bigIdea) {
      setName(bigIdea.name || "");
      setType((bigIdea.type as any) || "problem");
      setDescription(bigIdea.description || "");
      setGoals(Array.isArray(bigIdea.goals) && (bigIdea.goals as string[]).length > 0 ? (bigIdea.goals as string[]) : [""]);
      setTargetAudience(bigIdea.targetAudience || "");
      setExpectedOutcome(bigIdea.expectedOutcome || "");
      setSelectedSeriesId(bigIdea.seriesId ? String(bigIdea.seriesId) : "none");
      setSelectedCoreId(bigIdea.coreId ? String(bigIdea.coreId) : "none");
    }
  }, [open, bigIdea]);

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
      await updateBigIdea.mutateAsync({
        id: String(bigIdea.id),
        data: {
          name: name.trim(),
          type,
          description: description.trim(),
          goals: goals.filter(g => g.trim()),
          targetAudience: targetAudience.trim(),
          expectedOutcome: expectedOutcome.trim(),
          seriesId: selectedSeriesId !== "none" ? String(selectedSeriesId) : "",
          coreId: selectedCoreId !== "none" ? String(selectedCoreId) : null,
        },
      });

      toast({
        title: "Berhasil",
        description: "Big Idea berhasil diperbarui",
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal memperbarui Big Idea",
        variant: "destructive",
      });
    }
  };

  const addGoal = () => setGoals([...goals, ""]);
  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };
  const removeGoal = (index: number) => {
    if (goals.length > 1) setGoals(goals.filter((_, i) => i !== index));
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
            <Pencil className="h-5 w-5 text-yellow-500" />
            Edit Big Idea
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Series / Topik</Label>
            <Select value={selectedSeriesId} onValueChange={setSelectedSeriesId}>
              <SelectTrigger data-testid="select-series-edit">
                <SelectValue placeholder="Pilih Series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" data-testid="select-series-none">Tanpa Series</SelectItem>
                {allSeries.map((s: any) => (
                  <SelectItem key={s.id} value={String(s.id)} data-testid={`select-series-${s.id}`}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {availableCores.length > 0 && (
            <div className="space-y-2">
              <Label>Core (opsional - payung strategis)</Label>
              <Select value={selectedCoreId} onValueChange={setSelectedCoreId}>
                <SelectTrigger data-testid="select-core-edit">
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
            <Label>Tipe Big Idea</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as any)}
              className="grid grid-cols-1 gap-3"
            >
              {(["problem", "idea", "inspiration", "mentoring"] as const).map((t) => (
                <Label
                  key={t}
                  className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer hover-elevate ${
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
            <Label htmlFor="edit-name">Nama Big Idea *</Label>
            <Input
              id="edit-name"
              placeholder="Contoh: Otomasi Customer Service"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-edit-bigidea-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Deskripsi *</Label>
            <Textarea
              id="edit-description"
              placeholder="Jelaskan secara detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              data-testid="input-edit-bigidea-description"
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
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeGoal(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addGoal} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tujuan
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-targetAudience">Target Audiens</Label>
            <Input
              id="edit-targetAudience"
              placeholder="Contoh: UMKM di Indonesia"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-expectedOutcome">Hasil yang Diharapkan</Label>
            <Textarea
              id="edit-expectedOutcome"
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
              disabled={updateBigIdea.isPending}
              data-testid="button-save-bigidea"
            >
              {updateBigIdea.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
