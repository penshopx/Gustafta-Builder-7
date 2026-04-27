import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { 
  Bot, BookOpen, Plug, MessageSquare, Plus, ChevronDown, ChevronRight, ArrowLeft, Settings, BarChart3,
  Lightbulb, Wrench, Sparkles, User, PanelLeftClose, PanelLeft, Menu, Home, X, Palette, Network, Brain, Blocks,
  ShoppingBag, Users, Handshake, TrendingUp, Users2, Ticket, Pencil, Trash2, Radio, FileText, FolderOpen, Target, Globe, Megaphone, Loader2, PackageCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { PersonaPanel } from "@/components/panels/persona-panel";
import { KnowledgeBasePanel } from "@/components/panels/knowledge-base-panel";
import { IntegrationsPanel } from "@/components/panels/integrations-panel";
import { ChatConsolePanel } from "@/components/panels/chat-console-panel";
import { AnalyticsPanel } from "@/components/panels/analytics-panel";
import { WidgetPanel } from "@/components/panels/widget-panel";
import { AgenticAIPanel } from "@/components/panels/agentic-ai-panel";
import { PolicyPanel } from "@/components/panels/policy-panel";
import { ProjectBrainPanel } from "@/components/panels/project-brain-panel";
import { MiniAppsPanel } from "@/components/panels/mini-apps-panel";
import { DeliverablesPanel } from "@/components/panels/deliverables-panel";
import { ProductSettingsPanel } from "@/components/panels/product-settings-panel";
import { RevenuPanel } from "@/components/panels/revenue-panel";
import { AffiliatePanel } from "@/components/panels/affiliate-panel";
import { VoucherPanel } from "@/components/panels/voucher-panel";
import { BroadcastPanel } from "@/components/panels/broadcast-panel";
import { TenderPanel } from "@/components/panels/tender-panel";
import { ConversionPanel } from "@/components/panels/conversion-panel";
import { LandingPagePanel } from "@/components/panels/landing-page-panel";
import { MarketingPanel } from "@/components/panels/marketing-panel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreateAgentDialog } from "@/components/dialogs/create-agent-dialog";
import { CreateBigIdeaDialog } from "@/components/dialogs/create-big-idea-dialog";
import { GenerateBigIdeasDialog } from "@/components/dialogs/generate-big-ideas-dialog";
import { CreateToolboxDialog } from "@/components/dialogs/create-toolbox-dialog";
import { EditBigIdeaDialog } from "@/components/dialogs/edit-big-idea-dialog";
import { EditToolboxDialog } from "@/components/dialogs/edit-toolbox-dialog";
import { UserProfileDialog } from "@/components/dialogs/user-profile-dialog";
import { ChatPopup } from "@/components/chat-popup";
import { SeriesManagementDialog } from "@/components/series-management-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAgents, useActiveAgent, useSetActiveAgent, useDeleteAgent } from "@/hooks/use-agents";
import { useBigIdeas, useActiveBigIdea, useActivateBigIdea, useDeleteBigIdea } from "@/hooks/use-big-ideas";
import { useToolboxes, useActiveToolbox, useActivateToolbox, useDeleteToolbox, useOrchestratorToolbox, useCreateToolbox } from "@/hooks/use-toolboxes";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Agent, BigIdea, Toolbox } from "@shared/schema";

type NavItem = "persona" | "policy" | "knowledge" | "integrations" | "widget" | "chat" | "analytics" | "agentic" | "project-brain" | "mini-apps" | "deliverables" | "product-settings" | "revenue" | "affiliates" | "vouchers" | "broadcast" | "tenders" | "conversion" | "landing-page" | "marketing";

const navItems: { id: NavItem; label: string; shortLabel: string; icon: typeof Bot }[] = [
  { id: "persona", label: "Persona", shortLabel: "Persona", icon: Bot },
  { id: "policy", label: "Kebijakan Agen", shortLabel: "Kebijakan", icon: BookOpen },
  { id: "agentic", label: "Agentic AI", shortLabel: "AI", icon: Sparkles },
  { id: "knowledge", label: "Knowledge Base", shortLabel: "KB", icon: BookOpen },
  { id: "project-brain", label: "Otak Proyek", shortLabel: "Brain", icon: Brain },
  { id: "mini-apps", label: "Mini Apps", shortLabel: "Apps", icon: Blocks },
  { id: "deliverables", label: "Deliverables", shortLabel: "Output", icon: PackageCheck },
  { id: "integrations", label: "Integrations", shortLabel: "Integ", icon: Plug },
  { id: "widget", label: "Widget", shortLabel: "Widget", icon: Palette },
  { id: "broadcast", label: "Broadcast WA", shortLabel: "Broadcast", icon: Radio },
  { id: "tenders", label: "Info Tender", shortLabel: "Tender", icon: FileText },
  { id: "conversion", label: "Conversion", shortLabel: "Convert", icon: Target },
  { id: "landing-page", label: "Rangkuman Chatbot", shortLabel: "Rangkuman", icon: Globe },
  { id: "marketing", label: "Brief Marketing", shortLabel: "Brief", icon: Megaphone },
  { id: "product-settings", label: "Monetisasi", shortLabel: "Produk", icon: ShoppingBag },
  { id: "revenue", label: "Revenue & Klien", shortLabel: "Revenue", icon: TrendingUp },
  { id: "affiliates", label: "Afiliasi", shortLabel: "Afiliasi", icon: Users2 },
  { id: "vouchers", label: "Voucher", shortLabel: "Voucher", icon: Ticket },
  { id: "chat", label: "Chat Console", shortLabel: "Chat", icon: MessageSquare },
  { id: "analytics", label: "Analytics", shortLabel: "Stats", icon: BarChart3 },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState<NavItem>("persona");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createAsOrchestrator, setCreateAsOrchestrator] = useState(false);
  const [hubDialogOpen, setHubDialogOpen] = useState(false);
  const [hubName, setHubName] = useState("");
  const [hubDescription, setHubDescription] = useState("");
  const [modulOrchDialogOpen, setModulOrchDialogOpen] = useState(false);
  const [modulOrchName, setModulOrchName] = useState("");
  const [modulOrchDescription, setModulOrchDescription] = useState("");
  const [bigIdeaDialogOpen, setBigIdeaDialogOpen] = useState(false);
  const [generateBigIdeasOpen, setGenerateBigIdeasOpen] = useState(false);
  const [toolboxDialogOpen, setToolboxDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [seriesDialogOpen, setSeriesDialogOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editBigIdeaDialogOpen, setEditBigIdeaDialogOpen] = useState(false);
  const [editingBigIdea, setEditingBigIdea] = useState<BigIdea | null>(null);
  const [editToolboxDialogOpen, setEditToolboxDialogOpen] = useState(false);
  const [editingToolbox, setEditingToolbox] = useState<Toolbox | null>(null);
  const [deleteBigIdeaConfirm, setDeleteBigIdeaConfirm] = useState<BigIdea | null>(null);
  const [deleteToolboxConfirm, setDeleteToolboxConfirm] = useState<Toolbox | null>(null);
  const [deleteAgentConfirm, setDeleteAgentConfirm] = useState<Agent | null>(null);
  const [editSeriesTarget, setEditSeriesTarget] = useState<any | null>(null);
  const [editSeriesName, setEditSeriesName] = useState("");
  const [editSeriesDesc, setEditSeriesDesc] = useState("");
  const [deleteSeriesConfirm, setDeleteSeriesConfirm] = useState<any | null>(null);
  const [editAgentTarget, setEditAgentTarget] = useState<Agent | null>(null);
  const [editAgentName, setEditAgentName] = useState("");
  const [editAgentDesc, setEditAgentDesc] = useState("");
  
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Akses Ditolak",
        description: "Silakan login terlebih dahulu...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);
  
  const { data: activeAgent } = useActiveAgent();
  const setActiveAgent = useSetActiveAgent();
  const agentCreationCooldown = useRef(false);
  const bigIdeaCreationCooldown = useRef(false);
  const toolboxCreationCooldown = useRef(false);
  const forceOrchestratorSelect = useRef(false);
  type HierarchyLevel = 'series' | 'bigIdeas' | 'toolboxes' | 'agents';
  const [navLevel, setNavLevel] = useState<HierarchyLevel>('series');
  const [navInitialized, setNavInitialized] = useState(false);
  
  const { data: allSeries = [] } = useQuery<any[]>({ queryKey: ["/api/series"] });
  const { data: activeDomains = [] } = useQuery<any[]>({ queryKey: ["/api/domains"], select: (d: any[]) => d.filter((x: any) => x.status === "active") });
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);
  const activeSeries = allSeries.find((s: any) => String(s.id) === activeSeriesId) || null;
  
  const { data: bigIdeas = [] } = useBigIdeas();
  const { data: activeBigIdea } = useActiveBigIdea();
  const activateBigIdea = useActivateBigIdea();

  const [localBigIdeaId, setLocalBigIdeaId] = useState<string | undefined>();
  const [localToolboxId, setLocalToolboxId] = useState<string | undefined>();
  const [localAgentId, setLocalAgentId] = useState<string | undefined>();

  // BigIdea yang valid untuk konteks series aktif saat ini (lokal dulu, lalu API)
  const contextBigIdea = (() => {
    if (localBigIdeaId) {
      const local = (bigIdeas as BigIdea[]).find(bi => String(bi.id) === localBigIdeaId);
      if (local && activeSeriesId && String(local.seriesId) === activeSeriesId) return local;
    }
    if (activeBigIdea && activeSeriesId && String(activeBigIdea.seriesId) === activeSeriesId) return activeBigIdea;
    return null;
  })();
  // Alias untuk kompatibilitas kode yang sudah ada
  const activeBigIdeaInCurrentSeries = contextBigIdea;
  const effectiveBigIdeaId = contextBigIdea?.id;
  const effectiveBigIdeaObj = contextBigIdea;

  useEffect(() => {
    if (activeBigIdea?.id && localBigIdeaId && String(activeBigIdea.id) === localBigIdeaId) {
      setLocalBigIdeaId(undefined);
    }
  }, [activeBigIdea?.id, localBigIdeaId]);

  useEffect(() => {
    if (activeBigIdea?.seriesId && allSeries.length > 0) {
      const seriesIdStr = String(activeBigIdea.seriesId);
      if (activeSeriesId !== seriesIdStr) {
        setActiveSeriesId(seriesIdStr);
      }
    } else if (activeBigIdea && !activeBigIdea.seriesId) {
      setActiveSeriesId(null);
    }
  }, [activeBigIdea?.id, activeBigIdea?.seriesId, allSeries.length]);
  
  const filteredBigIdeas = activeSeriesId
    ? bigIdeas.filter((bi: any) => String(bi.seriesId) === activeSeriesId)
    : bigIdeas;

  const updateSeriesMutation = useMutation({
    mutationFn: async ({ id, name, description }: { id: number; name: string; description?: string }) => {
      const res = await apiRequest("PATCH", `/api/series/${id}`, { name, description });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      setEditSeriesTarget(null);
      toast({ title: "Series berhasil diperbarui" });
    },
    onError: () => toast({ title: "Gagal memperbarui", variant: "destructive" }),
  });

  const deleteSeriesMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/series/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      setDeleteSeriesConfirm(null);
      if (activeSeriesId === String(deleteSeriesConfirm?.id)) setActiveSeriesId(null);
      toast({ title: "Series berhasil dihapus" });
    },
    onError: () => toast({ title: "Gagal menghapus", variant: "destructive" }),
  });

  const updateAgentMutation = useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description?: string }) => {
      const res = await apiRequest("PATCH", `/api/agents/${id}`, { name, description });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      setEditAgentTarget(null);
      toast({ title: "Alat Bantu berhasil diperbarui" });
    },
    onError: () => toast({ title: "Gagal memperbarui", variant: "destructive" }),
  });

  const handleSeriesSelect = (seriesId: string | null) => {
    if (bigIdeaCreationCooldown.current) return;
    setActiveSeriesId(seriesId);
    setLocalBigIdeaId(undefined);
    setLocalToolboxId(undefined);
    if (seriesId !== null) {
      const filtered = bigIdeas.filter((bi: any) => String(bi.seriesId) === seriesId);
      if (activeBigIdea) {
        const belongsToSeries = String(activeBigIdea.seriesId) === seriesId;
        if (!belongsToSeries && filtered.length > 0) {
          activateBigIdea.mutate(String(filtered[0].id));
        }
      } else if (filtered.length > 0) {
        activateBigIdea.mutate(String(filtered[0].id));
      }
    }
  };
  
  const deleteBigIdea = useDeleteBigIdea();
  const deleteAgent = useDeleteAgent();
  
  const { data: toolboxes = [] } = useToolboxes(effectiveBigIdeaId);
  const { data: orchestratorHub } = useOrchestratorToolbox(activeSeriesId);
  const { data: activeToolbox } = useActiveToolbox();
  const activateToolbox = useActivateToolbox();
  const deleteToolbox = useDeleteToolbox();
  const createToolboxMutation = useCreateToolbox();

  // Validasi activeToolbox milik series/modul yang aktif
  const activeToolboxInContext = (() => {
    if (!activeToolbox || !activeSeriesId) return null;
    if (activeToolbox.isOrchestrator && String(activeToolbox.seriesId) === activeSeriesId) return activeToolbox;
    if (effectiveBigIdeaId && String(activeToolbox.bigIdeaId) === String(effectiveBigIdeaId)) return activeToolbox;
    return null;
  })();
  const effectiveToolboxId = localToolboxId || activeToolboxInContext?.id;
  const shouldFetchAgents = !!effectiveToolboxId;
  const { data: agents = [], isLoading: agentsLoading } = useAgents(shouldFetchAgents ? effectiveToolboxId : undefined);
  const filteredAgents = shouldFetchAgents ? agents : [];

  const { data: profile } = useProfile();

  useEffect(() => {
    if (activeToolbox?.id && localToolboxId && String(activeToolbox.id) === localToolboxId) {
      setLocalToolboxId(undefined);
    }
  }, [activeToolbox?.id, localToolboxId]);

  useEffect(() => {
    if (activeAgent?.id && localAgentId && String(activeAgent.id) === localAgentId) {
      setLocalAgentId(undefined);
    }
  }, [activeAgent?.id, localAgentId]);

  useEffect(() => {
    if (bigIdeaCreationCooldown.current) return;
    if (toolboxCreationCooldown.current) return;
    if (localToolboxId) return;
    // Hanya auto-select jika BigIdea aktif benar-benar milik series saat ini
    if (!contextBigIdea || toolboxes.length === 0) return;
    // Don't auto-switch if user intentionally navigated into the Series-level Hub
    if (navLevel === 'agents' && activeToolboxInContext?.id && orchestratorHub?.id && String(activeToolboxInContext.id) === String(orchestratorHub.id)) return;
    if (!activeToolboxInContext) {
      activateToolbox.mutate(String(toolboxes[0].id));
    } else {
      const toolboxBelongs = toolboxes.some((tb) => tb.id === activeToolboxInContext.id);
      if (!toolboxBelongs) {
        activateToolbox.mutate(String(toolboxes[0].id));
      }
    }
  }, [contextBigIdea?.id, toolboxes, activeToolboxInContext?.id, orchestratorHub?.id, navLevel]);

  useEffect(() => {
    if (!effectiveToolboxId || filteredAgents.length === 0) return;
    if (agentCreationCooldown.current) return;
    if (toolboxCreationCooldown.current) return;
    if (bigIdeaCreationCooldown.current) return;
    if (navLevel !== 'agents') return;

    if (forceOrchestratorSelect.current) {
      forceOrchestratorSelect.current = false;
      const orchestratorAgent = filteredAgents.find(a => a.isOrchestrator);
      if (orchestratorAgent) {
        if (String(activeAgent?.id) !== String(orchestratorAgent.id)) {
          setLocalAgentId(String(orchestratorAgent.id));
          setActiveAgent.mutate(String(orchestratorAgent.id));
        }
        return;
      }
    }

    // Hanya skip jika orkestrator aktif memang milik context saat ini
    if (activeAgent?.isOrchestrator) {
      const orchestratorBelongs = filteredAgents.some(a => String(a.id) === String(activeAgent.id));
      if (orchestratorBelongs) return;
    }

    // Juga skip jika localAgentId sudah diset (menghindari dobel-select)
    if (localAgentId && filteredAgents.some(a => String(a.id) === localAgentId)) return;

    const pickDefault = () => {
      const orchestratorAgent = filteredAgents.find(a => a.isOrchestrator);
      return orchestratorAgent || filteredAgents[0];
    };

    if (!activeAgent) {
      const def = pickDefault();
      setLocalAgentId(String(def.id));
      setActiveAgent.mutate(String(def.id));
    } else {
      const agentBelongs = filteredAgents.some((a) => String(a.id) === String(activeAgent.id));
      if (!agentBelongs) {
        const def = pickDefault();
        setLocalAgentId(String(def.id));
        setActiveAgent.mutate(String(def.id));
      }
    }
  }, [effectiveToolboxId, filteredAgents, activeAgent?.id, navLevel, localAgentId]);

  useEffect(() => {
    if (navInitialized) return;
    if (allSeries.length === 0) return;
    if (!activeSeriesId) return;
    if (contextBigIdea && activeToolboxInContext && filteredAgents.length > 0) {
      setNavLevel('agents');
      setNavInitialized(true);
    } else if (contextBigIdea && toolboxes.length > 0) {
      setNavLevel('toolboxes');
      setNavInitialized(true);
    } else if (contextBigIdea) {
      setNavLevel('bigIdeas');
      setNavInitialized(true);
    } else {
      setNavLevel('bigIdeas');
      setNavInitialized(true);
    }
  }, [navInitialized, allSeries.length, activeSeriesId, contextBigIdea?.id, activeToolboxInContext?.id, toolboxes.length, filteredAgents.length]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }

  const handleAgentSelect = (agent: Agent) => {
    setLocalAgentId(String(agent.id));
    setActiveAgent.mutate(String(agent.id));
  };

  const handleBigIdeaSelect = (bigIdea: BigIdea) => {
    activateBigIdea.mutate(String(bigIdea.id));
  };

  const handleToolboxSelect = (toolbox: Toolbox) => {
    activateToolbox.mutate(String(toolbox.id));
  };

  const handleEditBigIdea = (bi: BigIdea) => {
    setEditingBigIdea(bi);
    setEditBigIdeaDialogOpen(true);
  };

  const handleDeleteBigIdea = async (bi: BigIdea) => {
    try {
      await deleteBigIdea.mutateAsync(String(bi.id));
      toast({ title: "Berhasil", description: `Modul "${bi.name}" berhasil dihapus` });
      setDeleteBigIdeaConfirm(null);
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus Modul", variant: "destructive" });
    }
  };

  const handleEditToolbox = (tb: Toolbox) => {
    setEditingToolbox(tb);
    setEditToolboxDialogOpen(true);
  };

  const handleDeleteToolbox = async (tb: Toolbox) => {
    try {
      await deleteToolbox.mutateAsync(String(tb.id));
      toast({ title: "Berhasil", description: `Chatbot "${tb.name}" berhasil dihapus` });
      setDeleteToolboxConfirm(null);
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus Chatbot", variant: "destructive" });
    }
  };

  const handleDeleteAgent = async (agent: Agent) => {
    try {
      await deleteAgent.mutateAsync(String(agent.id));
      toast({ title: "Berhasil", description: `Alat Bantu "${agent.name}" berhasil dihapus` });
      setDeleteAgentConfirm(null);
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus Alat Bantu", variant: "destructive" });
    }
  };

  const handleCreateHub = async () => {
    if (!hubName.trim() || !activeSeriesId) return;
    try {
      await createToolboxMutation.mutateAsync({
        seriesId: activeSeriesId,
        isOrchestrator: true,
        name: hubName.trim(),
        description: hubDescription.trim(),
        purpose: "",
        capabilities: [],
        limitations: [],
        sortOrder: 0,
      });
      setHubDialogOpen(false);
      setHubName("");
      setHubDescription("");
      queryClient.invalidateQueries({ queryKey: ["/api/toolboxes/orchestrator"] });
      toast({ title: "Berhasil", description: "Chatbot Orkestrator berhasil dibuat" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Gagal membuat Chatbot Orkestrator", variant: "destructive" });
    }
  };

  const handleCreateModulOrchestrator = async () => {
    if (!modulOrchName.trim() || !activeBigIdeaInCurrentSeries) return;
    let newToolboxId: number | null = null;
    try {
      const newToolbox = await createToolboxMutation.mutateAsync({
        bigIdeaId: activeBigIdeaInCurrentSeries.id,
        seriesId: activeSeriesId || undefined,
        isOrchestrator: false,
        name: modulOrchName.trim(),
        description: modulOrchDescription.trim(),
        purpose: "Orkestrator untuk Modul " + activeBigIdeaInCurrentSeries.name,
        capabilities: [],
        limitations: [],
        sortOrder: 0,
      });
      newToolboxId = newToolbox.id;
      await apiRequest("POST", "/api/agents", {
        name: modulOrchName.trim(),
        description: modulOrchDescription.trim() || `Orkestrator untuk ${activeBigIdeaInCurrentSeries.name}`,
        toolboxId: newToolbox.id,
        bigIdeaId: activeBigIdeaInCurrentSeries.id,
        isOrchestrator: true,
        orchestratorRole: "orchestrator",
        isActive: true,
        isPublic: true,
      });
      setModulOrchDialogOpen(false);
      setModulOrchName("");
      setModulOrchDescription("");
      queryClient.invalidateQueries({ queryKey: ["/api/toolboxes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({ title: "Berhasil", description: "Orkestrator Modul berhasil dibuat" });
    } catch (error: any) {
      if (newToolboxId) {
        try { await apiRequest("DELETE", `/api/toolboxes/${newToolboxId}`); } catch {}
        queryClient.invalidateQueries({ queryKey: ["/api/toolboxes"] });
      }
      toast({ title: "Error", description: error?.message || "Gagal membuat Orkestrator Modul", variant: "destructive" });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const currentToolbox = localToolboxId
    ? ([...toolboxes, orchestratorHub].find(tb => tb && String(tb.id) === localToolboxId) || activeToolboxInContext)
    : activeToolboxInContext;
  const isCurrentToolboxHub = currentToolbox?.isOrchestrator === true;

  // Agent hanya valid jika memang milik filteredAgents toolbox aktif saat ini
  // localAgentId memberi respons instan seperti localToolboxId
  const currentAgent = (() => {
    if (localAgentId) {
      const local = filteredAgents.find(a => String(a.id) === localAgentId);
      if (local) return local;
    }
    if (activeAgent && filteredAgents.some(a => String(a.id) === String(activeAgent.id))) return activeAgent;
    return null;
  })();

  const renderPanel = () => {
    if (!currentAgent) {
      if (filteredAgents.length > 0 || agentsLoading) {
        return (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Memuat...</p>
            </div>
          </div>
        );
      }
      if (isCurrentToolboxHub && currentToolbox) {
        return (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-4 md:space-y-6 max-w-lg">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center">
                <Network className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-foreground">{currentToolbox.name}</h2>
                <p className="text-sm md:text-base text-muted-foreground mt-2">
                  {currentToolbox.description || "Chatbot Orkestrator (HUB) mengoordinasikan semua chatbot spesialis dalam ekosistem ini."}
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  Buat Alat Bantu pertama untuk mulai mengatur persona dan fungsi orkestrasi HUB Anda.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Alat Bantu HUB
                </Button>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
            {/* Welcome header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Selamat Datang di Gustafta</h2>
              <p className="text-sm text-muted-foreground">
                Platform AI Chatbot Builder untuk sektor konstruksi & profesional Indonesia.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Alat Bantu", value: agents?.length || 0, icon: Bot, color: "text-primary" },
                { label: "Modul Aktif", value: bigIdeas?.length || 0, icon: Lightbulb, color: "text-yellow-500" },
                { label: "Domain Aktif", value: activeDomains?.length || 0, icon: Globe, color: "text-green-500" },
                { label: "Series", value: allSeries?.length || 0, icon: FolderOpen, color: "text-blue-500" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border rounded-lg p-3 text-center space-y-1">
                  <stat.icon className={`w-5 h-5 mx-auto ${stat.color}`} />
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Aksi Cepat</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setBigIdeaDialogOpen(true)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-md bg-yellow-500/10 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Buat Modul Baru</p>
                    <p className="text-xs text-muted-foreground">Tambah Modul di hierarki Anda</p>
                  </div>
                </button>
                <button
                  onClick={() => setCreateDialogOpen(true)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Buat Alat Bantu</p>
                    <p className="text-xs text-muted-foreground">Buat Chatbot AI baru</p>
                  </div>
                </button>
                <a href="/domains" className="flex items-center gap-3 p-3 rounded-lg border border-dashed hover:border-green-500 hover:bg-green-500/5 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-green-500/10 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Kelola Domain</p>
                    <p className="text-xs text-muted-foreground">Hubungkan domain kustom</p>
                  </div>
                </a>
                <a href="/packs" className="flex items-center gap-3 p-3 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Paket & Tender</p>
                    <p className="text-xs text-muted-foreground">Tools Wizard untuk tender</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeNav) {
      case "persona":
        return <PersonaPanel agent={currentAgent!} />;
      case "policy":
        return <PolicyPanel agent={currentAgent!} />;
      case "agentic":
        return <AgenticAIPanel />;
      case "knowledge":
        return <KnowledgeBasePanel agent={currentAgent!} />;
      case "integrations":
        return <IntegrationsPanel agent={currentAgent!} />;
      case "widget":
        return <WidgetPanel agent={currentAgent!} bigIdeaId={effectiveBigIdeaId} />;
      case "chat":
        return null;
      case "project-brain":
        return <ProjectBrainPanel agent={currentAgent!} />;
      case "mini-apps":
        return <MiniAppsPanel agent={currentAgent!} />;
      case "deliverables":
        return <DeliverablesPanel agent={currentAgent!} />;
      case "conversion":
        return <ConversionPanel agent={currentAgent!} />;
      case "landing-page":
        return <LandingPagePanel agent={currentAgent!} />;
      case "marketing":
        return <MarketingPanel agent={currentAgent!} />;
      case "product-settings":
        return <ProductSettingsPanel agent={currentAgent!} />;
      case "revenue":
        return <RevenuPanel agent={currentAgent!} />;
      case "affiliates":
        return <AffiliatePanel agent={currentAgent!} />;
      case "vouchers":
        return <VoucherPanel agent={currentAgent!} />;
      case "broadcast":
        return <BroadcastPanel agent={currentAgent!} />;
      case "tenders":
        return <TenderPanel agent={currentAgent!} />;
      case "analytics":
        return <AnalyticsPanel agent={currentAgent!} />;
      default:
        return null;
    }
  };

  const navigateToLevel = (level: HierarchyLevel) => {
    if (level === 'series' || level === 'bigIdeas') {
      setLocalBigIdeaId(undefined);
      setLocalToolboxId(undefined);
    }
    if (level === 'toolboxes') {
      setLocalToolboxId(undefined);
      forceOrchestratorSelect.current = false;
    }
    setNavLevel(level);
  };

  const handleSeriesDrillDown = (seriesId: string | number) => {
    const seriesIdStr = String(seriesId);
    setActiveSeriesId(seriesIdStr);
    setNavLevel('bigIdeas');
    // If the current active big idea belongs to a different series, auto-activate
    // the first big idea of the selected series so dialogs show the correct module
    if (!activeBigIdea || String(activeBigIdea.seriesId) !== seriesIdStr) {
      const firstBigIdea = bigIdeas.find((bi: BigIdea) => String(bi.seriesId) === seriesIdStr);
      if (firstBigIdea) {
        setLocalBigIdeaId(String(firstBigIdea.id));
        setLocalToolboxId(undefined);
        setLocalAgentId(undefined);
        activateBigIdea.mutate(String(firstBigIdea.id));
      }
    }
  };

  const handleBigIdeaDrillDown = (bi: BigIdea) => {
    setLocalBigIdeaId(String(bi.id));
    setLocalToolboxId(undefined);
    setLocalAgentId(undefined);
    handleBigIdeaSelect(bi);
    setNavLevel('toolboxes');
  };

  const handleToolboxDrillDown = (tb: Toolbox) => {
    setLocalToolboxId(String(tb.id));
    setLocalAgentId(undefined);
    handleToolboxSelect(tb);
    queryClient.setQueryData(["/api/agents/active"], null);
    forceOrchestratorSelect.current = !!(tb as any).isOrchestrator || !!(tb as any).hasOrchestrator;
    setNavLevel('agents');
  };

  const SidebarContent = () => (
    <>
      <div className={cn("border-b border-sidebar-border shrink-0 max-h-[45vh] overflow-y-auto", sidebarCollapsed ? "p-2" : "")}>
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-1 py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="Navigasi Hierarki">
                  <FolderOpen className="w-4 h-4 text-purple-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuLabel>Navigasi</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { navigateToLevel('series'); setSidebarCollapsed(false); }} className="gap-2">
                  <FolderOpen className="w-4 h-4 text-purple-500" />
                  <span>Series (L1)</span>
                </DropdownMenuItem>
                {activeSeries && (
                  <DropdownMenuItem onClick={() => { navigateToLevel('bigIdeas'); setSidebarCollapsed(false); }} className="gap-2 pl-6">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="truncate">Big Idea - {activeSeries.name}</span>
                  </DropdownMenuItem>
                )}
                {activeBigIdeaInCurrentSeries && (
                  <DropdownMenuItem onClick={() => { navigateToLevel('toolboxes'); setSidebarCollapsed(false); }} className="gap-2 pl-8">
                    <Wrench className="w-4 h-4 text-blue-500" />
                    <span className="truncate">Chatbot - {activeBigIdeaInCurrentSeries.name}</span>
                  </DropdownMenuItem>
                )}
                {currentToolbox && (
                  <DropdownMenuItem onClick={() => { navigateToLevel('agents'); setSidebarCollapsed(false); }} className="gap-2 pl-10">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="truncate">Alat Bantu - {currentToolbox.name}</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="px-3 pt-3 pb-2">
            {/* Hierarchy level path */}
            <div className="mb-2 space-y-0.5">
              {/* Level 1: Series */}
              <button
                onClick={() => navigateToLevel('series')}
                className={cn(
                  "w-full flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-colors text-left",
                  navLevel === 'series'
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-sidebar-foreground"
                )}
                data-testid="breadcrumb-series"
              >
                <span className="text-[9px] font-bold uppercase tracking-widest shrink-0 w-10 text-right opacity-60">L1</span>
                <FolderOpen className="w-3 h-3 shrink-0" />
                <span className={cn("text-[11px] font-medium truncate", navLevel === 'series' ? "font-semibold" : "")}>
                  {activeSeries ? activeSeries.name : "Pilih Series"}
                </span>
              </button>

              {/* Level 2: Modul — sembunyikan hanya saat di agents level dalam Hub */}
              {activeSeriesId && !(isCurrentToolboxHub && navLevel === 'agents') && (
                <button
                  onClick={() => navigateToLevel('bigIdeas')}
                  className={cn(
                    "w-full flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-colors text-left pl-3",
                    navLevel === 'bigIdeas'
                      ? "bg-blue-500/10 text-blue-500"
                      : (navLevel === 'series' ? "opacity-40 cursor-not-allowed" : "text-muted-foreground hover:text-sidebar-foreground")
                  )}
                  disabled={navLevel === 'series'}
                  data-testid="breadcrumb-modul"
                >
                  <span className="text-[9px] font-bold uppercase tracking-widest shrink-0 w-8 text-right opacity-60">L2</span>
                  <Lightbulb className="w-3 h-3 shrink-0" />
                  <span className={cn("text-[11px] font-medium truncate", navLevel === 'bigIdeas' ? "font-semibold" : "")}>
                    {activeBigIdeaInCurrentSeries ? activeBigIdeaInCurrentSeries.name : "Pilih Modul"}
                  </span>
                </button>
              )}

              {/* Level 3: Chatbot */}
              {activeSeriesId && activeBigIdeaInCurrentSeries && (navLevel === 'toolboxes' || navLevel === 'agents') && !isCurrentToolboxHub && (
                <button
                  onClick={() => navigateToLevel('toolboxes')}
                  className={cn(
                    "w-full flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-colors text-left pl-5",
                    navLevel === 'toolboxes'
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground hover:text-sidebar-foreground"
                  )}
                  data-testid="breadcrumb-chatbot"
                >
                  <span className="text-[9px] font-bold uppercase tracking-widest shrink-0 w-6 text-right opacity-60">L3</span>
                  <Bot className="w-3 h-3 shrink-0" />
                  <span className={cn("text-[11px] font-medium truncate", navLevel === 'toolboxes' ? "font-semibold" : "")}>
                    {currentToolbox ? currentToolbox.name : "Pilih Chatbot"}
                  </span>
                </button>
              )}
              {/* Level 3: Hub (Series-level Orkestrator) */}
              {isCurrentToolboxHub && currentToolbox && navLevel === 'agents' && (
                <div className="flex items-center gap-1.5 rounded px-1.5 py-0.5 pl-5 bg-purple-500/10">
                  <span className="text-[9px] font-bold uppercase tracking-widest shrink-0 w-6 text-right opacity-60 text-purple-500">L3</span>
                  <Network className="w-3 h-3 shrink-0 text-purple-500" />
                  <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 truncate">{currentToolbox.name}</span>
                </div>
              )}

              {/* Level 4: Alat Bantu */}
              {navLevel === 'agents' && (
                <div className="flex items-center gap-1.5 rounded px-1.5 py-0.5 pl-7 bg-green-500/10">
                  <span className="text-[9px] font-bold uppercase tracking-widest shrink-0 w-4 text-right opacity-60 text-green-600">L4</span>
                  <Users className="w-3 h-3 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-[11px] font-semibold text-green-700 dark:text-green-400 truncate">Alat Bantu</span>
                </div>
              )}
            </div>

            {/* Level content */}
            <div className="space-y-0.5">
              {navLevel === 'series' && (
                <>
                  {allSeries.length === 0 ? (
                    <div className="py-3 text-sm text-muted-foreground text-center">
                      Belum ada Series
                    </div>
                  ) : (
                    allSeries.map((s: any) => (
                      <div
                        key={s.id}
                        className={cn(
                          "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
                          activeSeriesId === String(s.id)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                        onClick={() => handleSeriesDrillDown(s.id)}
                        data-testid={`nav-series-${s.id}`}
                      >
                        <FolderOpen className="w-4 h-4 text-purple-500 shrink-0" />
                        <span className="truncate flex-1">{s.name}</span>
                        <div className="flex items-center gap-0.5 invisible group-hover:visible shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-6 h-6"
                            onClick={(e) => { e.stopPropagation(); setEditSeriesTarget(s); setEditSeriesName(s.name); setEditSeriesDesc(s.description || ""); }}
                            data-testid={`button-edit-series-${s.id}`}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-6 h-6"
                            onClick={(e) => { e.stopPropagation(); setDeleteSeriesConfirm(s); }}
                            data-testid={`button-delete-series-${s.id}`}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <button
                    onClick={() => setSeriesDialogOpen(true)}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                    data-testid="button-manage-series"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Kelola Series</span>
                  </button>
                </>
              )}

              {navLevel === 'bigIdeas' && (
                <>
                  <button
                    onClick={() => navigateToLevel('series')}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors mb-1"
                    data-testid="button-back-to-series"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Kembali ke Series</span>
                  </button>
                  {orchestratorHub ? (
                    <div
                      className={cn(
                        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors mb-2 border border-purple-500/30",
                        orchestratorHub.isActive
                          ? "bg-purple-500/15 text-purple-700 dark:text-purple-300"
                          : "text-purple-600/70 dark:text-purple-400/70 hover:bg-purple-500/10"
                      )}
                      onClick={() => handleToolboxDrillDown(orchestratorHub)}
                      data-testid="nav-hub-orchestrator"
                    >
                      <Network className="w-4 h-4 text-purple-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="truncate block">{orchestratorHub.name}</span>
                        <span className="text-[10px] text-purple-500/70">Orkestrator</span>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <div className="invisible group-hover:visible flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={(e) => { e.stopPropagation(); handleEditToolbox(orchestratorHub); }}
                            data-testid="button-edit-hub"
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-destructive"
                            onClick={(e) => { e.stopPropagation(); setDeleteToolboxConfirm(orchestratorHub); }}
                            data-testid="button-delete-hub"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  ) : activeSeriesId ? (
                    <button
                      onClick={() => setHubDialogOpen(true)}
                      className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-purple-500/70 hover:text-purple-600 hover:bg-purple-500/10 transition-colors mb-2 border border-dashed border-purple-500/30"
                      data-testid="button-create-hub"
                    >
                      <Network className="w-4 h-4" />
                      <span>Buat Chatbot Orkestrator</span>
                    </button>
                  ) : null}
                  {(orchestratorHub || activeSeriesId) && (
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-2 py-1">Modul</div>
                  )}
                  {filteredBigIdeas.length === 0 ? (
                    <div className="py-3 text-sm text-muted-foreground text-center">
                      Belum ada Modul
                    </div>
                  ) : (
                    filteredBigIdeas.map((bi) => (
                      <div
                        key={bi.id}
                        className={cn(
                          "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
                          bi.isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                        onClick={() => handleBigIdeaDrillDown(bi)}
                        data-testid={`nav-bigidea-${bi.id}`}
                      >
                        <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" />
                        <span className="truncate flex-1">{bi.name}</span>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <div className="invisible group-hover:visible flex items-center gap-0.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={(e) => { e.stopPropagation(); handleEditBigIdea(bi); }}
                              data-testid={`button-edit-bigidea-${bi.id}`}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-destructive"
                              onClick={(e) => { e.stopPropagation(); setDeleteBigIdeaConfirm(bi); }}
                              data-testid={`button-delete-bigidea-${bi.id}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </div>
                    ))
                  )}
                  <button
                    onClick={() => setBigIdeaDialogOpen(true)}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                    data-testid="button-add-bigidea"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Modul Baru</span>
                  </button>
                  <button
                    onClick={() => setGenerateBigIdeasOpen(true)}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-primary/70 hover:text-primary hover:bg-primary/10 transition-colors border border-dashed border-primary/30"
                    data-testid="button-generate-bigideas"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>✨ Generate dari Referensi</span>
                  </button>
                </>
              )}

              {navLevel === 'toolboxes' && (
                <>
                  <button
                    onClick={() => navigateToLevel('bigIdeas')}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors mb-1"
                    data-testid="button-back-to-bigideas"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Kembali ke Modul</span>
                  </button>
                  {(() => {
                    const orchToolboxes = toolboxes.filter((tb: any) => tb.hasOrchestrator);
                    return orchToolboxes.length > 0 ? (
                      <>
                        {orchToolboxes.map((orchTb: any) => (
                          <div
                            key={orchTb.id}
                            className={cn(
                              "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors mb-1 border border-purple-500/30",
                              "bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/15"
                            )}
                            onClick={() => handleToolboxDrillDown(orchTb)}
                            data-testid={`nav-modul-orchestrator-${orchTb.id}`}
                          >
                            <Network className="w-4 h-4 text-purple-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="truncate block">{orchTb.name}</span>
                              <span className="text-[10px] text-purple-500/70">Orkestrator Modul</span>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <div className="invisible group-hover:visible flex items-center gap-0.5">
                                <Button variant="ghost" size="icon" className="h-5 w-5"
                                  onClick={(e) => { e.stopPropagation(); handleEditToolbox(orchTb); }}
                                  data-testid={`button-edit-modul-orch-${orchTb.id}`}
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                        <div className="mb-1" />
                      </>
                    ) : (
                      <button
                        onClick={() => setModulOrchDialogOpen(true)}
                        className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-purple-500/70 hover:text-purple-600 hover:bg-purple-500/10 transition-colors mb-2 border border-dashed border-purple-500/30"
                        data-testid="button-create-modul-orch"
                      >
                        <Network className="w-4 h-4" />
                        <span>Buat Orkestrator Modul</span>
                      </button>
                    );
                  })()}
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-2 py-1">Chatbot</div>
                  {toolboxes.filter((tb: any) => !tb.hasOrchestrator).length === 0 ? (
                    <div className="py-3 text-sm text-muted-foreground text-center">
                      Belum ada Chatbot
                    </div>
                  ) : (
                    toolboxes.filter((tb: any) => !tb.hasOrchestrator).map((tb: any) => (
                      <div
                        key={tb.id}
                        className={cn(
                          "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
                          tb.isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                        onClick={() => handleToolboxDrillDown(tb)}
                        data-testid={`nav-toolbox-${tb.id}`}
                      >
                        <Wrench className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="truncate flex-1">{tb.name}</span>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <div className="invisible group-hover:visible flex items-center gap-0.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={(e) => { e.stopPropagation(); handleEditToolbox(tb); }}
                              data-testid={`button-edit-toolbox-${tb.id}`}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-destructive"
                              onClick={(e) => { e.stopPropagation(); setDeleteToolboxConfirm(tb); }}
                              data-testid={`button-delete-toolbox-${tb.id}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </div>
                    ))
                  )}
                  <button
                    onClick={() => setToolboxDialogOpen(true)}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                    data-testid="button-add-toolbox"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Chatbot Baru</span>
                  </button>
                </>
              )}

              {navLevel === 'agents' && (
                <>
                  <button
                    onClick={() => {
                      const activeToolboxData = toolboxes.find(t => String(t.id) === effectiveToolboxId) || orchestratorHub;
                      if (activeToolboxData?.isOrchestrator) {
                        navigateToLevel('bigIdeas');
                      } else {
                        navigateToLevel('toolboxes');
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors mb-1"
                    data-testid="button-back-to-toolboxes"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>{orchestratorHub && String(effectiveToolboxId) === String(orchestratorHub.id) ? "Kembali ke Modul" : "Kembali ke Chatbot"}</span>
                  </button>
                  {(() => {
                    const hasOrchAgent = filteredAgents.some((a: any) => a.isOrchestrator);
                    const orchAgents = filteredAgents.filter((a: any) => a.isOrchestrator);
                    const regularAgents = filteredAgents.filter((a: any) => !a.isOrchestrator);
                    return agentsLoading ? (
                      <div className="py-3 text-sm text-muted-foreground text-center">Memuat...</div>
                    ) : (
                      <>
                        {orchAgents.map((agent) => (
                          <div
                            key={agent.id}
                            className={cn(
                              "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors mb-1 border border-purple-500/30",
                              String(agent.id) === String(activeAgent?.id)
                                ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                : "bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/15"
                            )}
                            onClick={() => handleAgentSelect(agent)}
                            data-testid={`nav-agent-${agent.id}`}
                          >
                            <Avatar className="w-5 h-5 shrink-0">
                              <AvatarFallback className="text-[9px] bg-purple-500/10 text-purple-600">
                                <Network className="w-3 h-3" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <span className="truncate block">{agent.name}</span>
                              <span className="text-[10px] text-purple-500/70">Orkestrator</span>
                            </div>
                            <div className="flex gap-0.5 invisible group-hover:visible shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-6 h-6"
                                onClick={(e) => { e.stopPropagation(); setEditAgentTarget(agent as Agent); setEditAgentName(agent.name); setEditAgentDesc((agent as any).description || ""); }}
                                data-testid={`button-edit-agent-${agent.id}`}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-6 h-6"
                                onClick={(e) => { e.stopPropagation(); setDeleteAgentConfirm(agent as Agent); }}
                                data-testid={`button-delete-agent-${agent.id}`}
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {!hasOrchAgent && (
                          <button
                            onClick={() => {
                              setCreateAsOrchestrator(true);
                              setCreateDialogOpen(true);
                            }}
                            className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-purple-500/70 hover:text-purple-600 hover:bg-purple-500/10 transition-colors mb-1 border border-dashed border-purple-500/30"
                            data-testid="button-create-orch-agent"
                          >
                            <Network className="w-4 h-4" />
                            <span>Buat Orkestrator</span>
                          </button>
                        )}
                        {regularAgents.length > 0 && (
                          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-2 py-1">Alat Bantu</div>
                        )}
                        {regularAgents.length === 0 && orchAgents.length === 0 ? (
                          <div className="py-3 text-sm text-muted-foreground text-center">
                            Belum ada Alat Bantu
                          </div>
                        ) : (
                          regularAgents.map((agent) => (
                            <div
                              key={agent.id}
                              className={cn(
                                "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
                                String(agent.id) === String(activeAgent?.id)
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                              )}
                              onClick={() => handleAgentSelect(agent)}
                              data-testid={`nav-agent-${agent.id}`}
                            >
                              <Avatar className="w-5 h-5 shrink-0">
                                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                                  {agent.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate flex-1">{agent.name}</span>
                              <div className="flex gap-0.5 invisible group-hover:visible shrink-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-6 h-6"
                                  onClick={(e) => { e.stopPropagation(); setEditAgentTarget(agent as Agent); setEditAgentName(agent.name); setEditAgentDesc((agent as any).description || ""); }}
                                  data-testid={`button-edit-agent-${agent.id}`}
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-6 h-6"
                                  onClick={(e) => { e.stopPropagation(); setDeleteAgentConfirm(agent as Agent); }}
                                  data-testid={`button-delete-agent-${agent.id}`}
                                >
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </>
                    );
                  })()}
                  <button
                    onClick={() => setCreateDialogOpen(true)}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                    data-testid="button-add-agent-sidebar"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Alat Bantu Baru</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <nav className={cn("flex-1 min-h-0 space-y-0.5 overflow-y-auto", sidebarCollapsed ? "p-2" : "px-3 py-2")}>
        {/* Packs shortcut */}
        <Link
          href="/packs"
          className={cn(
            "w-full flex items-center rounded-md text-sm font-medium transition-colors mb-1",
            sidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
            "text-primary/80 hover:bg-primary/10 hover:text-primary border border-primary/20 bg-primary/5"
          )}
          title={sidebarCollapsed ? "Paket Domain" : undefined}
          data-testid="link-packs-sidebar"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && (
            <span className="flex-1 flex items-center justify-between">
              Paket Domain
              <Badge variant="secondary" className="text-[10px] py-0 ml-1">Pack</Badge>
            </span>
          )}
        </Link>
        <Link
          href="/domains"
          className={cn(
            "w-full flex items-center rounded-md text-sm font-medium transition-colors mb-1",
            sidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
            "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
          title={sidebarCollapsed ? "Manajemen Domain" : undefined}
          data-testid="link-domains-sidebar"
        >
          <Globe className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && (
            <span className="flex-1 flex items-center justify-between">
              Manajemen Domain
              {activeDomains.length > 0 && (
                <Badge variant="default" className="text-[10px] py-0 ml-1 bg-green-600 text-white">
                  {activeDomains.length} aktif
                </Badge>
              )}
            </span>
          )}
        </Link>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveNav(item.id);
              setMobileMenuOpen(false);
            }}
            disabled={!currentAgent}
            className={cn(
              "w-full flex items-center rounded-md text-sm font-medium transition-colors",
              sidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
              activeNav === item.id && currentAgent
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              !currentAgent && "opacity-50 cursor-not-allowed"
            )}
           
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && item.label}
            {!sidebarCollapsed && (item.id === "project-brain" || item.id === "mini-apps") && (
              <Badge variant="secondary" className="ml-auto text-xs">New</Badge>
            )}
          </button>
        ))}
      </nav>

      <div className={cn("border-t border-sidebar-border space-y-0.5 shrink-0", sidebarCollapsed ? "p-2" : "px-3 py-2")}>
        <button
          onClick={() => setProfileDialogOpen(true)}
          className={cn(
            "w-full flex items-center rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
            sidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
          )}
         
          title={sidebarCollapsed ? "Profil" : undefined}
        >
          <Avatar className="w-6 h-6 shrink-0">
            <AvatarImage src={profile?.avatarUrl} />
            <AvatarFallback className="text-xs">
              {profile?.displayName ? getInitials(profile.displayName) : <User className="w-3 h-3" />}
            </AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && <span className="truncate">{profile?.displayName || "Profil"}</span>}
        </button>
        <Link href="/">
          <button
            className={cn(
              "w-full flex items-center rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
              sidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
            )}
           
            title={sidebarCollapsed ? "Beranda" : undefined}
          >
            <Home className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && "Beranda"}
          </button>
        </Link>
        
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            "w-full flex items-center rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
            sidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
          )}
         
          title={sidebarCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-4 h-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 shrink-0" />
              Ciutkan
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      <aside className={cn(
        "hidden md:flex bg-sidebar border-r border-sidebar-border flex-col transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="p-3 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <h1 className="font-semibold text-sidebar-foreground truncate">Gustafta</h1>
                <p className="text-xs text-muted-foreground">AI Chatbot Builder</p>
              </div>
            )}
          </div>
        </div>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-3 md:px-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-sidebar">
                <div className="p-3 border-b border-sidebar-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="font-semibold text-sidebar-foreground">Gustafta</h1>
                      <p className="text-xs text-muted-foreground">AI Chatbot Builder</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col h-[calc(100%-73px)]">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-1 md:gap-2 px-2 md:px-3 max-w-[180px] md:max-w-none"
                  disabled={agentsLoading}
                 
                >
                  {currentAgent ? (
                    <>
                      <Avatar className="w-5 h-5 md:w-6 md:h-6">
                        <AvatarFallback className="text-[10px] md:text-xs bg-primary/10 text-primary">
                          {currentAgent.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm md:text-base truncate">{currentAgent.name}</span>
                      {currentAgent.orchestratorRole === "orchestrator" && (
                        <Badge variant="secondary" className="text-[10px] md:text-xs hidden sm:inline-flex">Orkestrator</Badge>
                      )}
                    </>
                  ) : isCurrentToolboxHub && currentToolbox ? (
                    <>
                      <Avatar className="w-5 h-5 md:w-6 md:h-6">
                        <AvatarFallback className="text-[10px] md:text-xs bg-purple-500/10 text-purple-500">
                          <Network className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm md:text-base truncate">{currentToolbox.name}</span>
                      <Badge variant="secondary" className="text-[10px] md:text-xs hidden sm:inline-flex">HUB</Badge>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-sm">Pilih Alat Bantu</span>
                  )}
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Alat Bantu{currentToolbox ? ` - ${currentToolbox.name}` : ""}</DropdownMenuLabel>
                {!currentToolbox ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    Pilih Chatbot terlebih dahulu
                  </div>
                ) : filteredAgents.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    Belum ada alat bantu di chatbot ini
                  </div>
                ) : (
                  filteredAgents.map((agent) => (
                    <DropdownMenuItem
                      key={agent.id}
                      onClick={() => handleAgentSelect(agent)}
                      className="gap-2"
                     
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className={cn(
                          "text-xs",
                          agent.isOrchestrator ? "bg-purple-500/10 text-purple-600" : "bg-primary/10 text-primary"
                        )}>
                          {agent.isOrchestrator ? (
                            <Network className="w-3 h-3" />
                          ) : (
                            agent.name.substring(0, 2).toUpperCase()
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{agent.name}</span>
                      {agent.isOrchestrator && (
                        <Badge className="text-xs bg-purple-500/20 text-purple-600 border-purple-500/30">Orkestrator</Badge>
                      )}
                      {agent.isActive && (
                        <Badge variant="secondary" className="ml-auto text-xs">Aktif</Badge>
                      )}
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setCreateDialogOpen(true)}
                  className="gap-2"
                 
                >
                  <Plus className="w-4 h-4" />
                  Buat Alat Bantu Baru
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              className="hidden sm:flex"
             
            >
              <Plus className="w-4 h-4 mr-2" />
              Alat Bantu Baru
            </Button>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="icon"
              className="sm:hidden"
             
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto pb-16 md:pb-0">
          {currentAgent && (
            <div style={{ display: activeNav === "chat" ? "block" : "none" }} className="h-full">
              <ChatConsolePanel key={currentAgent.id} agent={currentAgent} />
            </div>
          )}
          {activeNav === "chat" ? (currentAgent ? null : renderPanel()) : renderPanel()}
        </div>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
          <div className="flex items-center justify-around h-14">
            {navItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                disabled={!currentAgent}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-2 py-1 min-w-0 flex-1",
                  activeNav === item.id && currentAgent
                    ? "text-primary"
                    : "text-muted-foreground",
                  !currentAgent && "opacity-50"
                )}
               
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium truncate">{item.shortLabel}</span>
              </button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 px-2 py-1 min-w-0 flex-1",
                    navItems.slice(5).some((item) => activeNav === item.id) ? "text-primary" : "text-muted-foreground"
                  )}
                 
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-[10px] font-medium">More</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mb-2">
                {navItems.slice(5).map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className="gap-2"
                   
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setProfileDialogOpen(true)} className="gap-2">
                  <User className="w-4 h-4" />
                  Profil
                </DropdownMenuItem>
                <Link href="/">
                  <DropdownMenuItem className="gap-2">
                    <Home className="w-4 h-4" />
                    Beranda
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>

      {currentAgent && <ChatPopup agent={currentAgent} />}

      <CreateAgentDialog 
        open={createDialogOpen} 
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setCreateAsOrchestrator(false);
        }}
        forceOrchestrator={createAsOrchestrator}
        bigIdea={contextBigIdea ? { id: contextBigIdea.id, name: contextBigIdea.name } : null}
        toolbox={currentToolbox ? { id: currentToolbox.id, name: currentToolbox.name } : null}
        onCreated={() => {
          agentCreationCooldown.current = true;
          setTimeout(() => { agentCreationCooldown.current = false; }, 3000);
        }}
      />
      <GenerateBigIdeasDialog
        open={generateBigIdeasOpen}
        onOpenChange={setGenerateBigIdeasOpen}
        seriesId={activeSeriesId ? Number(activeSeriesId) : null}
        onCreated={() => setGenerateBigIdeasOpen(false)}
      />
      <CreateBigIdeaDialog 
        open={bigIdeaDialogOpen} 
        onOpenChange={setBigIdeaDialogOpen} 
        seriesId={activeSeriesId ? Number(activeSeriesId) : null}
        onCreated={() => {
          bigIdeaCreationCooldown.current = true;
          setTimeout(() => { bigIdeaCreationCooldown.current = false; }, 3000);
        }}
      />
      <CreateToolboxDialog 
        open={toolboxDialogOpen} 
        onOpenChange={setToolboxDialogOpen} 
        bigIdea={effectiveBigIdeaObj}
        activeSeriesId={activeSeriesId}
        onCreateModule={() => setBigIdeaDialogOpen(true)}
        onCreated={() => {
          toolboxCreationCooldown.current = true;
          setTimeout(() => { toolboxCreationCooldown.current = false; }, 3000);
        }}
      />
      <UserProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
      <SeriesManagementDialog open={seriesDialogOpen} onOpenChange={setSeriesDialogOpen} />

      {/* Dialog Edit Series */}
      <Dialog open={!!editSeriesTarget} onOpenChange={(open) => { if (!open) setEditSeriesTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Series</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-series-name">Nama Series *</Label>
              <Input
                id="edit-series-name"
                value={editSeriesName}
                onChange={(e) => setEditSeriesName(e.target.value)}
                placeholder="Nama series..."
                data-testid="input-edit-series-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-series-desc">Deskripsi</Label>
              <Textarea
                id="edit-series-desc"
                value={editSeriesDesc}
                onChange={(e) => setEditSeriesDesc(e.target.value)}
                placeholder="Deskripsi series..."
                rows={3}
                data-testid="input-edit-series-desc"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditSeriesTarget(null)}>Batal</Button>
              <Button
                onClick={() => updateSeriesMutation.mutate({ id: editSeriesTarget.id, name: editSeriesName, description: editSeriesDesc })}
                disabled={!editSeriesName.trim() || updateSeriesMutation.isPending}
                data-testid="button-save-edit-series"
              >
                {updateSeriesMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi Hapus Series */}
      <AlertDialog open={!!deleteSeriesConfirm} onOpenChange={(open) => { if (!open) setDeleteSeriesConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Series?</AlertDialogTitle>
            <AlertDialogDescription>
              Series "<strong>{deleteSeriesConfirm?.name}</strong>" beserta semua Big Idea dan Toolbox di dalamnya akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteSeriesMutation.mutate(deleteSeriesConfirm!.id)}
              data-testid="button-confirm-delete-series"
            >
              {deleteSeriesMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Edit Alat Bantu (Agent) */}
      <Dialog open={!!editAgentTarget} onOpenChange={(open) => { if (!open) setEditAgentTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Alat Bantu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-agent-name">Nama *</Label>
              <Input
                id="edit-agent-name"
                value={editAgentName}
                onChange={(e) => setEditAgentName(e.target.value)}
                placeholder="Nama alat bantu..."
                data-testid="input-edit-agent-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-agent-desc">Deskripsi</Label>
              <Textarea
                id="edit-agent-desc"
                value={editAgentDesc}
                onChange={(e) => setEditAgentDesc(e.target.value)}
                placeholder="Deskripsi singkat..."
                rows={3}
                data-testid="input-edit-agent-desc"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditAgentTarget(null)}>Batal</Button>
              <Button
                onClick={() => updateAgentMutation.mutate({ id: String(editAgentTarget!.id), name: editAgentName, description: editAgentDesc })}
                disabled={!editAgentName.trim() || updateAgentMutation.isPending}
                data-testid="button-save-edit-agent"
              >
                {updateAgentMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={hubDialogOpen} onOpenChange={(open) => { setHubDialogOpen(open); if (!open) { setHubName(""); setHubDescription(""); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-purple-500" />
              Buat Chatbot Orkestrator
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg space-y-2">
              <h4 className="font-medium text-purple-900 dark:text-purple-100">Apa itu Chatbot Orkestrator?</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Chatbot Orkestrator (HUB) adalah pintu masuk utama ekosistem multi-chatbot. Ia mengarahkan pengguna ke chatbot spesialis yang tepat, menjaga alur prasyarat, dan menyimpan konteks lintas chatbot. Setiap Series hanya memiliki 1 Orkestrator.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hub-name">Nama Orkestrator *</Label>
              <Input id="hub-name" placeholder="Contoh: HUB Regulasi Konstruksi" value={hubName} onChange={(e) => setHubName(e.target.value)} data-testid="input-hub-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hub-desc">Deskripsi</Label>
              <Textarea id="hub-desc" placeholder="Jelaskan peran orkestrator ini..." value={hubDescription} onChange={(e) => setHubDescription(e.target.value)} rows={3} data-testid="input-hub-description" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setHubDialogOpen(false)}>Batal</Button>
              <Button onClick={handleCreateHub} disabled={createToolboxMutation.isPending || !hubName.trim()} data-testid="button-submit-hub">
                {createToolboxMutation.isPending ? "Membuat..." : "Buat Orkestrator"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modulOrchDialogOpen} onOpenChange={(open) => { setModulOrchDialogOpen(open); if (!open) { setModulOrchName(""); setModulOrchDescription(""); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-purple-500" />
              Buat Orkestrator Modul
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg space-y-2">
              <h4 className="font-medium text-purple-900 dark:text-purple-100">Apa itu Orkestrator Modul?</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Orkestrator Modul mengoordinasikan chatbot-chatbot spesialis di dalam satu Modul. Ia menjadi pintu masuk utama dan mengarahkan pengguna ke chatbot yang tepat berdasarkan kebutuhan.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="persp-orch-name">Nama Orkestrator *</Label>
              <Input id="persp-orch-name" placeholder={`Contoh: Orkestrator ${activeBigIdeaInCurrentSeries?.name || 'Modul'}`} value={modulOrchName} onChange={(e) => setModulOrchName(e.target.value)} data-testid="input-modul-orch-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="persp-orch-desc">Deskripsi</Label>
              <Textarea id="persp-orch-desc" placeholder="Jelaskan peran orkestrator modul ini..." value={modulOrchDescription} onChange={(e) => setModulOrchDescription(e.target.value)} rows={3} data-testid="input-modul-orch-description" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModulOrchDialogOpen(false)}>Batal</Button>
              <Button onClick={handleCreateModulOrchestrator} disabled={createToolboxMutation.isPending || !modulOrchName.trim()} data-testid="button-submit-modul-orch">
                {createToolboxMutation.isPending ? "Membuat..." : "Buat Orkestrator"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {editingBigIdea && (
        <EditBigIdeaDialog
          open={editBigIdeaDialogOpen}
          onOpenChange={(open) => {
            setEditBigIdeaDialogOpen(open);
            if (!open) setEditingBigIdea(null);
          }}
          bigIdea={editingBigIdea}
        />
      )}

      {editingToolbox && (
        <EditToolboxDialog
          open={editToolboxDialogOpen}
          onOpenChange={(open) => {
            setEditToolboxDialogOpen(open);
            if (!open) setEditingToolbox(null);
          }}
          toolbox={editingToolbox}
        />
      )}

      <AlertDialog open={!!deleteBigIdeaConfirm} onOpenChange={(open) => { if (!open) setDeleteBigIdeaConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Modul?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus Modul "{deleteBigIdeaConfirm?.name}"? 
              Semua Chatbot dan Alat Bantu di dalamnya juga akan terpengaruh. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-bigidea">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteBigIdeaConfirm && handleDeleteBigIdea(deleteBigIdeaConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-bigidea"
            >
              {deleteBigIdea.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteToolboxConfirm} onOpenChange={(open) => { if (!open) setDeleteToolboxConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Chatbot?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus Chatbot "{deleteToolboxConfirm?.name}"? 
              Semua Alat Bantu di dalamnya juga akan terpengaruh. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-toolbox">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteToolboxConfirm && handleDeleteToolbox(deleteToolboxConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-toolbox"
            >
              {deleteToolbox.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteAgentConfirm} onOpenChange={(open) => { if (!open) setDeleteAgentConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Alat Bantu?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus Alat Bantu "{deleteAgentConfirm?.name}"? 
              Semua pesan dan knowledge base terkait juga akan dihapus. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-agent">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAgentConfirm && handleDeleteAgent(deleteAgentConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-agent"
            >
              {deleteAgent.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
