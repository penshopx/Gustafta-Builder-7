import { useState } from "react";
import { Bot, ChevronLeft, ChevronRight } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useCreateAgent } from "@/hooks/use-agents";
import { categories, getCategoryById } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "category" | "subcategory" | "details";

export function CreateAgentDialog({ open, onOpenChange }: CreateAgentDialogProps) {
  const { toast } = useToast();
  const createAgent = useCreateAgent();

  const [step, setStep] = useState<Step>("category");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tagline: "",
    category: "",
    subcategory: "",
  });

  const selectedCategory = getCategoryById(formData.category);

  const handleCategorySelect = (categoryId: string) => {
    setFormData({ ...formData, category: categoryId, subcategory: "" });
    setStep("subcategory");
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setFormData({ ...formData, subcategory: subcategoryId });
    setStep("details");
  };

  const handleBack = () => {
    if (step === "subcategory") {
      setStep("category");
    } else if (step === "details") {
      setStep("subcategory");
    }
  };

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
        category: formData.category,
        subcategory: formData.subcategory,
      },
      {
        onSuccess: () => {
          toast({
            title: "Chatbot Created",
            description: `${formData.name} has been created successfully.`,
          });
          onOpenChange(false);
          setFormData({ name: "", description: "", tagline: "", category: "", subcategory: "" });
          setStep("category");
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

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setStep("category");
      setFormData({ name: "", description: "", tagline: "", category: "", subcategory: "" });
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            {step === "category" && "Select Your Department"}
            {step === "subcategory" && selectedCategory?.label}
            {step === "details" && "Create New Chatbot"}
          </DialogTitle>
          <DialogDescription>
            {step === "category" && "Choose a business category for your AI chatbot"}
            {step === "subcategory" && "Select a specific role or profession"}
            {step === "details" && "Configure your chatbot's basic information"}
          </DialogDescription>
        </DialogHeader>

        {step === "category" && (
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors hover-elevate",
                      "text-center"
                    )}
                    data-testid={`category-${category.id}`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-medium leading-tight">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {step === "subcategory" && selectedCategory && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              {selectedCategory.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSubcategorySelect(sub.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border transition-colors hover-elevate text-left"
                  )}
                  data-testid={`subcategory-${sub.id}`}
                >
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{sub.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-4 py-4">
            {selectedCategory && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <selectedCategory.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  {selectedCategory.label} &gt; {selectedCategory.subcategories.find(s => s.id === formData.subcategory)?.label}
                </span>
              </div>
            )}

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
        )}

        <DialogFooter className="gap-2">
          {step !== "category" && (
            <Button variant="outline" onClick={handleBack} data-testid="button-back">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="ghost" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          {step === "details" && (
            <Button
              onClick={handleCreate}
              disabled={createAgent.isPending}
              data-testid="button-confirm-create-agent"
            >
              {createAgent.isPending ? "Creating..." : "Create Chatbot"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
