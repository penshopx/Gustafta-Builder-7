import { useState } from "react";
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
import { useCreateBigIdea } from "@/hooks/use-big-ideas";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, AlertTriangle, Sparkles, Plus, X, GraduationCap } from "lucide-react";

interface CreateBigIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBigIdeaDialog({ open, onOpenChange }: CreateBigIdeaDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"problem" | "idea" | "inspiration" | "mentoring">("problem");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState<string[]>([""]);
  const [targetAudience, setTargetAudience] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  
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
      await createBigIdea.mutateAsync({
        name: name.trim(),
        type,
        description: description.trim(),
        goals: goals.filter(g => g.trim()),
        targetAudience: targetAudience.trim(),
        expectedOutcome: expectedOutcome.trim(),
      });
      
      toast({
        title: "Berhasil",
        description: "Big Idea berhasil dibuat",
      });
      
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat Big Idea",
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
            Buat Big Idea Baru
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Tipe Big Idea</Label>
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
            <Label htmlFor="name">Nama Big Idea *</Label>
            <Input
              id="name"
              placeholder="Contoh: Otomasi Customer Service"
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
              {createBigIdea.isPending ? "Membuat..." : "Buat Big Idea"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
