import { useState } from "react";
import { Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateAgent } from "@/hooks/use-agents";

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAgentDialog({ open, onOpenChange }: CreateAgentDialogProps) {
  const { toast } = useToast();
  const createAgent = useCreateAgent();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tagline: "",
  });

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for your chatbot.",
        variant: "destructive",
      });
      return;
    }

    createAgent.mutate(
      {
        name: formData.name.trim(),
        description: formData.description.trim(),
        tagline: formData.tagline.trim(),
      },
      {
        onSuccess: () => {
          toast({
            title: "Chatbot Created",
            description: `${formData.name} has been created successfully.`,
          });
          onOpenChange(false);
          setFormData({ name: "", description: "", tagline: "" });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create chatbot. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            Create New Chatbot
          </DialogTitle>
          <DialogDescription>
            Create a new AI chatbot with custom personality and capabilities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="create-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="create-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Assistant"
              data-testid="input-create-agent-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-tagline">Tagline</Label>
            <Input
              id="create-tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Your helpful AI companion"
              data-testid="input-create-agent-tagline"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-description">Description</Label>
            <Textarea
              id="create-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what your chatbot does..."
              rows={3}
              data-testid="input-create-agent-description"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={createAgent.isPending}
            data-testid="button-confirm-create-agent"
          >
            {createAgent.isPending ? "Creating..." : "Create Chatbot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
