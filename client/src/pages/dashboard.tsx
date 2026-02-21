import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { 
  Bot, BookOpen, Plug, MessageSquare, Plus, ChevronDown, ChevronRight, ArrowLeft, Settings, BarChart3,
  Lightbulb, Wrench, Sparkles, User, PanelLeftClose, PanelLeft, Menu, Home, X, Palette, Network, Brain, Blocks,
  ShoppingBag, Users, Handshake, TrendingUp, Users2, Ticket, Pencil, Trash2, Radio, FileText, FolderOpen, Target, Globe, Megaphone, Loader2
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
import { ProjectBrainPanel } from "@/components/panels/project-brain-panel";
import { MiniAppsPanel } from "@/components/panels/mini-apps-panel";
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
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Agent, BigIdea, Toolbox } from "@shared/schema";

type NavItem = "persona" | "knowledge" | "integrations" | "widget" | "chat" | "analytics" | "agentic" | "project-brain" | "mini-apps" | "product-settings" | "revenue" | "affiliates" | "vouchers" | "broadcast" | "tenders" | "conversion" | "landing-page" | "marketing";

const navItems: { id: NavItem; label: string; shortLabel: string; icon: typeof Bot }[] = [
  { id: "persona", label: "Persona", shortLabel: "Persona", icon: Bot },
  { id: "agentic", label: "Agentic AI", shortLabel: "AI", icon: Sparkles },
  { id: "knowledge", label: "Knowledge Base", shortLabel: "KB", icon: BookOpen },
  { id: "project-brain", label: "Otak Proyek", shortLabel: "Brain", icon: Brain },
  { id: "mini-apps", label: "Mini Apps", shortLabel: "Apps", icon: Blocks },
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
  const [bigIdeaDialogOpen, setBigIdeaDialogOpen] = useState(false);
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
  
  const { data: allSeries = [] } = useQuery<any[]>({ queryKey: ["/api/series"] });
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);
  const activeSeries = allSeries.find((s: any) => String(s.id) === activeSeriesId) || null;
  
  const { data: bigIdeas = [] } = useBigIdeas();
  const { data: activeBigIdea } = useActiveBigIdea();
  const activateBigIdea = useActivateBigIdea();

  const [localBigIdeaId, setLocalBigIdeaId] = useState<string | undefined>();
  const [localToolboxId, setLocalToolboxId] = useState<string | undefined>();

  const effectiveBigIdeaId = localBigIdeaId || activeBigIdea?.id;

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
  
  const { data: toolboxes = [] } = useToolboxes(effectiveBigIdeaId);
  const { data: orchestratorHub } = useOrchestratorToolbox(activeSeriesId);
  const { data: activeToolbox } = useActiveToolbox();
  const activateToolbox = useActivateToolbox();
  const deleteToolbox = useDeleteToolbox();
  const createToolboxMutation = useCreateToolbox();

  const effectiveToolboxId = localToolboxId || activeToolbox?.id;
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
    if (bigIdeaCreationCooldown.current) return;
    if (toolboxCreationCooldown.current) return;
    if (localToolboxId) return;
    if (!activeBigIdea || toolboxes.length === 0) return;
    if (!activeToolbox) {
      activateToolbox.mutate(String(toolboxes[0].id));
    } else {
      const toolboxBelongs = toolboxes.some((tb) => tb.id === activeToolbox.id);
      if (!toolboxBelongs) {
        activateToolbox.mutate(String(toolboxes[0].id));
      }
    }
  }, [activeBigIdea?.id, toolboxes, activeToolbox?.id]);

  useEffect(() => {
    if (!effectiveToolboxId || filteredAgents.length === 0) return;
    if (agentCreationCooldown.current) return;
    if (toolboxCreationCooldown.current) return;
    if (bigIdeaCreationCooldown.current) return;

    if (forceOrchestratorSelect.current) {
      const orchestratorAgent = filteredAgents.find(a => a.isOrchestrator);
      if (orchestratorAgent) {
        forceOrchestratorSelect.current = false;
        if (String(activeAgent?.id) !== String(orchestratorAgent.id)) {
          setActiveAgent.mutate(String(orchestratorAgent.id));
        }
        return;
      }
    }

    if (activeAgent?.isOrchestrator) return;

    const pickDefault = () => {
      const orchestratorAgent = filteredAgents.find(a => a.isOrchestrator);
      return orchestratorAgent || filteredAgents[0];
    };

    if (!activeAgent) {
      setActiveAgent.mutate(String(pickDefault().id));
    } else {
      const agentBelongs = filteredAgents.some((a) => String(a.id) === String(activeAgent.id));
      if (!agentBelongs) {
        setActiveAgent.mutate(String(pickDefault().id));
      }
    }
  }, [effectiveToolboxId, filteredAgents, activeAgent?.id]);

  type HierarchyLevel = 'series' | 'bigIdeas' | 'toolboxes' | 'agents';
  const [navLevel, setNavLevel] = useState<HierarchyLevel>('series');
  const [navInitialized, setNavInitialized] = useState(false);

  useEffect(() => {
    if (navInitialized) return;
    if (allSeries.length === 0) return;
    if (!activeSeriesId) return;
    if (activeBigIdea && activeToolbox && filteredAgents.length > 0) {
      setNavLevel('agents');
      setNavInitialized(true);
    } else if (activeBigIdea && toolboxes.length > 0) {
      setNavLevel('toolboxes');
      setNavInitialized(true);
    } else if (activeBigIdea) {
      setNavLevel('bigIdeas');
      setNavInitialized(true);
    } else {
      setNavLevel('bigIdeas');
      setNavInitialized(true);
    }
  }, [navInitialized, allSeries.length, activeSeriesId, activeBigIdea?.id, activeToolbox?.id, toolboxes.length, filteredAgents.length]);

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
      toast({ title: "Berhasil", description: `Perspektif "${bi.name}" berhasil dihapus` });
      setDeleteBigIdeaConfirm(null);
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus Perspektif", variant: "destructive" });
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

  const deleteAgent = useDeleteAgent();

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const currentToolbox = localToolboxId
    ? [...toolboxes, orchestratorHub].find(tb => tb && String(tb.id) === localToolboxId)
    : activeToolbox;
  const isCurrentToolboxHub = currentToolbox?.isOrchestrator === true;

  const renderPanel = () => {
    if (!activeAgent) {
      if (isCurrentToolboxHub && currentToolbox) {
        if (filteredAgents.length > 0 || agentsLoading) {
          return (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
                <p className="text-sm text-muted-foreground">Memuat persona HUB...</p>
              </div>
            </div>
          );
        }
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
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4 md:space-y-6 max-w-lg">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Selamat Datang di Gustafta</h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Mulai dengan membuat Perspektif atau Chatbot pertama Anda.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => setBigIdeaDialogOpen(true)} variant="outline" className="w-full sm:w-auto">
                <Lightbulb className="w-4 h-4 mr-2" />
                Buat Perspektif
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Buat Alat Bantu
              </Button>
            </div>
          </div>
        </div>
      );
    }

    switch (activeNav) {
      case "persona":
        return <PersonaPanel agent={activeAgent} />;
      case "agentic":
        return <AgenticAIPanel />;
      case "knowledge":
        return <KnowledgeBasePanel agent={activeAgent} />;
      case "integrations":
        return <IntegrationsPanel agent={activeAgent} />;
      case "widget":
        return <WidgetPanel agent={activeAgent} bigIdeaId={effectiveBigIdeaId} />;
      case "chat":
        return null;
      case "project-brain":
        return <ProjectBrainPanel agent={activeAgent} />;
      case "mini-apps":
        return <MiniAppsPanel agent={activeAgent} />;
      case "conversion":
        return <ConversionPanel agent={activeAgent} />;
      case "landing-page":
        return <LandingPagePanel agent={activeAgent} />;
      case "marketing":
        return <MarketingPanel agent={activeAgent} />;
      case "product-settings":
        return <ProductSettingsPanel agent={activeAgent} />;
      case "revenue":
        return <RevenuPanel agent={activeAgent} />;
      case "affiliates":
        return <AffiliatePanel agent={activeAgent} />;
      case "vouchers":
        return <VoucherPanel agent={activeAgent} />;
      case "broadcast":
        return <BroadcastPanel agent={activeAgent} />;
      case "tenders":
        return <TenderPanel agent={activeAgent} />;
      case "analytics":
        return <AnalyticsPanel agent={activeAgent} />;
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
    }
    setNavLevel(level);
  };

  const handleSeriesDrillDown = (seriesId: string | number) => {
    setActiveSeriesId(String(seriesId));
    setNavLevel('bigIdeas');
  };

  const handleBigIdeaDrillDown = (bi: BigIdea) => {
    setLocalBigIdeaId(String(bi.id));
    setLocalToolboxId(undefined);
    handleBigIdeaSelect(bi);
    setNavLevel('toolboxes');
  };

  const handleToolboxDrillDown = (tb: Toolbox) => {
    setLocalToolboxId(String(tb.id));
    handleToolboxSelect(tb);
    queryClient.setQueryData(["/api/agents/active"], null);
    if (tb.isOrchestrator) {
      forceOrchestratorSelect.current = true;
    }
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
                  <span>Tujuan</span>
                </DropdownMenuItem>
                {activeSeries && (
                  <DropdownMenuItem onClick={() => { navigateToLevel('bigIdeas'); setSidebarCollapsed(false); }} className="gap-2 pl-6">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="truncate">Perspektif - {activeSeries.name}</span>
                  </DropdownMenuItem>
                )}
                {activeBigIdea && (
                  <DropdownMenuItem onClick={() => { navigateToLevel('toolboxes'); setSidebarCollapsed(false); }} className="gap-2 pl-8">
                    <Wrench className="w-4 h-4 text-blue-500" />
                    <span className="truncate">Chatbot - {activeBigIdea.name}</span>
                  </DropdownMenuItem>
                )}
                {activeToolbox && (
                  <DropdownMenuItem onClick={() => { navigateToLevel('agents'); setSidebarCollapsed(false); }} className="gap-2 pl-10">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="truncate">Alat Bantu - {activeToolbox.name}</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="px-3 pt-3 pb-2">
            {/* Breadcrumb trail */}
            <div className="flex items-center gap-1 mb-2 flex-wrap">
              <button
                onClick={() => navigateToLevel('series')}
                className={cn(
                  "text-[11px] font-medium uppercase tracking-wider transition-colors",
                  navLevel === 'series' ? "text-sidebar-foreground" : "text-muted-foreground hover:text-sidebar-foreground cursor-pointer"
                )}
                data-testid="breadcrumb-series"
              >
                Tujuan
              </button>
              {activeSeriesId && activeSeries && (
                <>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  <button
                    onClick={() => navigateToLevel('bigIdeas')}
                    className={cn(
                      "text-[11px] font-medium truncate max-w-[80px] transition-colors",
                      navLevel === 'bigIdeas' ? "text-sidebar-foreground" : "text-muted-foreground hover:text-sidebar-foreground cursor-pointer"
                    )}
                    title={activeSeries.name}
                    data-testid="breadcrumb-bigideas"
                  >
                    {activeSeries.name}
                  </button>
                </>
              )}
              {activeBigIdea && navLevel !== 'series' && navLevel !== 'bigIdeas' && (
                <>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  <button
                    onClick={() => navigateToLevel('toolboxes')}
                    className={cn(
                      "text-[11px] font-medium truncate max-w-[70px] transition-colors",
                      navLevel === 'toolboxes' ? "text-sidebar-foreground" : "text-muted-foreground hover:text-sidebar-foreground cursor-pointer"
                    )}
                    title={activeBigIdea.name}
                    data-testid="breadcrumb-toolboxes"
                  >
                    {activeBigIdea.name}
                  </button>
                </>
              )}
              {activeToolbox && navLevel === 'agents' && (
                <>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span
                    className="text-[11px] font-medium text-sidebar-foreground truncate max-w-[70px]"
                    title={activeToolbox.name}
                    data-testid="breadcrumb-agents"
                  >
                    {activeToolbox.name}
                  </span>
                </>
              )}
            </div>

            {/* Level content */}
            <div className="space-y-0.5">
              {navLevel === 'series' && (
                <>
                  {allSeries.length === 0 ? (
                    <div className="py-3 text-sm text-muted-foreground text-center">
                      Belum ada Tujuan
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
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      </div>
                    ))
                  )}
                  <button
                    onClick={() => setSeriesDialogOpen(true)}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                    data-testid="button-manage-series"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Kelola Tujuan</span>
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
                    <span>Kembali ke Tujuan</span>
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
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-2 py-1">Perspektif</div>
                  )}
                  {filteredBigIdeas.length === 0 ? (
                    <div className="py-3 text-sm text-muted-foreground text-center">
                      Belum ada Perspektif
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
                    <span>Buat Perspektif Baru</span>
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
                    <span>Kembali ke Perspektif</span>
                  </button>
                  {toolboxes.length === 0 ? (
                    <div className="py-3 text-sm text-muted-foreground text-center">
                      Belum ada Chatbot
                    </div>
                  ) : (
                    toolboxes.map((tb) => (
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
                    <span>{orchestratorHub && String(effectiveToolboxId) === String(orchestratorHub.id) ? "Kembali ke Perspektif" : "Kembali ke Chatbot"}</span>
                  </button>
                  {agentsLoading ? (
                    <div className="py-3 text-sm text-muted-foreground text-center">Memuat...</div>
                  ) : filteredAgents.length === 0 ? (
                    <div className="py-3 text-sm text-muted-foreground text-center">
                      Belum ada Alat Bantu
                    </div>
                  ) : (
                    filteredAgents.map((agent) => (
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
                          <AvatarFallback className={cn(
                            "text-[9px]",
                            agent.isOrchestrator ? "bg-purple-500/10 text-purple-600" : "bg-primary/10 text-primary"
                          )}>
                            {agent.isOrchestrator ? <Network className="w-3 h-3" /> : agent.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate flex-1">{agent.name}</span>
                        {agent.isOrchestrator && (
                          <Badge className="text-[9px] bg-purple-500/20 text-purple-600 border-purple-500/30 shrink-0">Orch</Badge>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="shrink-0 w-6 h-6 invisible group-hover:visible"
                          onClick={(e) => { e.stopPropagation(); setDeleteAgentConfirm(agent as Agent); }}
                          data-testid={`button-delete-agent-${agent.id}`}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
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
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveNav(item.id);
              setMobileMenuOpen(false);
            }}
            disabled={!activeAgent}
            className={cn(
              "w-full flex items-center rounded-md text-sm font-medium transition-colors",
              sidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
              activeNav === item.id && activeAgent
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              !activeAgent && "opacity-50 cursor-not-allowed"
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
                  {activeAgent ? (
                    <>
                      <Avatar className="w-5 h-5 md:w-6 md:h-6">
                        <AvatarFallback className="text-[10px] md:text-xs bg-primary/10 text-primary">
                          {activeAgent.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm md:text-base truncate">{activeAgent.name}</span>
                      {activeAgent.orchestratorRole === "orchestrator" && (
                        <Badge variant="secondary" className="text-[10px] md:text-xs hidden sm:inline-flex">Orchestrator</Badge>
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
                <DropdownMenuLabel>Alat Bantu{activeToolbox ? ` - ${activeToolbox.name}` : ""}</DropdownMenuLabel>
                {!activeToolbox ? (
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
                        <Badge className="text-xs bg-purple-500/20 text-purple-600 border-purple-500/30">Orchestrator</Badge>
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
          {activeAgent && (
            <div style={{ display: activeNav === "chat" ? "block" : "none" }} className="h-full">
              <ChatConsolePanel key={activeAgent.id} agent={activeAgent} />
            </div>
          )}
          {activeNav === "chat" ? (activeAgent ? null : renderPanel()) : renderPanel()}
        </div>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
          <div className="flex items-center justify-around h-14">
            {navItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                disabled={!activeAgent}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-2 py-1 min-w-0 flex-1",
                  activeNav === item.id && activeAgent
                    ? "text-primary"
                    : "text-muted-foreground",
                  !activeAgent && "opacity-50"
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

      {activeAgent && <ChatPopup agent={activeAgent} />}

      <CreateAgentDialog 
        open={createDialogOpen} 
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setCreateAsOrchestrator(false);
        }}
        forceOrchestrator={createAsOrchestrator}
        onCreated={() => {
          agentCreationCooldown.current = true;
          setTimeout(() => { agentCreationCooldown.current = false; }, 3000);
        }}
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
      {activeBigIdea && (
        <CreateToolboxDialog 
          open={toolboxDialogOpen} 
          onOpenChange={setToolboxDialogOpen} 
          bigIdea={activeBigIdea}
          onCreated={() => {
            toolboxCreationCooldown.current = true;
            setTimeout(() => { toolboxCreationCooldown.current = false; }, 3000);
          }}
        />
      )}
      <UserProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
      <SeriesManagementDialog open={seriesDialogOpen} onOpenChange={setSeriesDialogOpen} />

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
                Chatbot Orkestrator (HUB) adalah pintu masuk utama ekosistem multi-chatbot. Ia mengarahkan pengguna ke chatbot spesialis yang tepat, menjaga alur prasyarat, dan menyimpan konteks lintas chatbot. Setiap Tujuan hanya memiliki 1 Orkestrator.
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
            <AlertDialogTitle>Hapus Perspektif?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus Perspektif "{deleteBigIdeaConfirm?.name}"? 
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
