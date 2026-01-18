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
import { Badge } from "@/components/ui/badge";
import { useCreateToolbox } from "@/hooks/use-toolboxes";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Plus, X } from "lucide-react";
import type { BigIdea } from "@shared/schema";

interface CreateToolboxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bigIdea: BigIdea;
}

export function CreateToolboxDialog({ open, onOpenChange, bigIdea }: CreateToolboxDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");
  const [capabilities, setCapabilities] = useState<string[]>([""]);
  const [limitations, setLimitations] = useState<string[]>([""]);
  
  const createToolbox = useCreateToolbox();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Nama toolbox wajib diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      await createToolbox.mutateAsync({
        bigIdeaId: bigIdea.id,
        name: name.trim(),
        description: description.trim(),
        purpose: purpose.trim(),
        capabilities: capabilities.filter(c => c.trim()),
        limitations: limitations.filter(l => l.trim()),
      });
      
      toast({
        title: "Berhasil",
        description: "Toolbox berhasil dibuat",
      });
      
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat Toolbox",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPurpose("");
    setCapabilities([""]);
    setLimitations([""]);
  };

  const updateList = (
    list: string[],
    setList: (list: string[]) => void,
    index: number,
    value: string
  ) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const removeFromList = (
    list: string[],
    setList: (list: string[]) => void,
    index: number
  ) => {
    if (list.length > 1) {
      setList(list.filter((_, i) => i !== index));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-500" />
            Buat Toolbox Baru
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Box - Explain what Toolbox is */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Apa itu Toolbox?</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Toolbox adalah kumpulan kemampuan dan tools yang akan digunakan oleh chatbot Anda. 
              Toolbox berasal dari Big Idea dan menentukan apa yang bisa dilakukan chatbot.
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Contoh: Dari Big Idea "Layanan Customer Service", Anda bisa membuat Toolbox untuk 
              "FAQ Handler", "Complaint Resolution", atau "Product Recommendation".
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <Label className="text-xs text-muted-foreground">Dari Big Idea:</Label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{bigIdea.type}</Badge>
              <span className="font-medium">{bigIdea.name}</span>
            </div>
            {bigIdea.description && (
              <p className="text-sm text-muted-foreground mt-2">{bigIdea.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Toolbox *</Label>
            <Input
              id="name"
              placeholder="Contoh: Customer Service Toolbox"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-toolbox-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Jelaskan tentang toolbox ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-testid="input-toolbox-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Tujuan Toolbox</Label>
            <Textarea
              id="purpose"
              placeholder="Tujuan utama dari toolbox ini..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={2}
              data-testid="input-toolbox-purpose"
            />
          </div>

          <div className="space-y-2">
            <Label>Kapabilitas</Label>
            {capabilities.map((cap, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Kapabilitas ${index + 1}`}
                  value={cap}
                  onChange={(e) => updateList(capabilities, setCapabilities, index, e.target.value)}
                  data-testid={`input-toolbox-capability-${index}`}
                />
                {capabilities.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromList(capabilities, setCapabilities, index)}
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
              onClick={() => setCapabilities([...capabilities, ""])}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kapabilitas
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Batasan</Label>
            {limitations.map((lim, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Batasan ${index + 1}`}
                  value={lim}
                  onChange={(e) => updateList(limitations, setLimitations, index, e.target.value)}
                  data-testid={`input-toolbox-limitation-${index}`}
                />
                {limitations.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromList(limitations, setLimitations, index)}
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
              onClick={() => setLimitations([...limitations, ""])}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Batasan
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createToolbox.isPending}
              data-testid="button-create-toolbox"
            >
              {createToolbox.isPending ? "Membuat..." : "Buat Toolbox"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
