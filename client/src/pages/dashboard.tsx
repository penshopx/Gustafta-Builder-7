import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Bot, BookOpen, Plug, MessageSquare, Plus, ChevronDown, Settings, BarChart3,
  Lightbulb, Wrench, Sparkles, User, PanelLeftClose, PanelLeft, Menu, Home, X, Palette, Network, Brain, Blocks,
  ShoppingBag, Users, Handshake, TrendingUp, Users2, Ticket, Pencil, Trash2, Radio, FileText
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
import { useAgents, useActiveAgent, useSetActiveAgent } from "@/hooks/use-agents";
import { useBigIdeas, useActiveBigIdea, useActivateBigIdea, useDeleteBigIdea } from "@/hooks/use-big-ideas";
import { useToolboxes, useActiveToolbox, useActivateToolbox, useDeleteToolbox } from "@/hooks/use-toolboxes";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { Agent, BigIdea, Toolbox } from "@shared/schema";

type NavItem = "persona" | "knowledge" | "integrations" | "widget" | "chat" | "analytics" | "agentic" | "project-brain" | "mini-apps" | "product-settings" | "revenue" | "affiliates" | "vouchers" | "broadcast" | "tenders";

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
  
  const { data: allSeries = [] } = useQuery<any[]>({ queryKey: ["/api/series"] });
  const [activeSeriesId, setActiveSeriesId] = useState<number | null>(null);
  const activeSeries = allSeries.find((s: any) => s.id === activeSeriesId) || null;
  
  const { data: bigIdeas = [] } = useBigIdeas();
  const { data: activeBigIdea } = useActiveBigIdea();
  const activateBigIdea = useActivateBigIdea();

  useEffect(() => {
    if (activeBigIdea?.seriesId && allSeries.length > 0) {
      const seriesIdNum = Number(activeBigIdea.seriesId);
      if (activeSeriesId !== seriesIdNum) {
        setActiveSeriesId(seriesIdNum);
      }
    } else if (activeBigIdea && !activeBigIdea.seriesId) {
      setActiveSeriesId(null);
    }
  }, [activeBigIdea?.id, activeBigIdea?.seriesId, allSeries.length]);
  
  const filteredBigIdeas = activeSeriesId
    ? bigIdeas.filter((bi: any) => Number(bi.seriesId) === activeSeriesId)
    : bigIdeas;

  const handleSeriesSelect = (seriesId: number | null) => {
    setActiveSeriesId(seriesId);
    if (seriesId !== null) {
      const filtered = bigIdeas.filter((bi: any) => Number(bi.seriesId) === seriesId);
      if (activeBigIdea) {
        const belongsToSeries = Number(activeBigIdea.seriesId) === seriesId;
        if (!belongsToSeries && filtered.length > 0) {
          activateBigIdea.mutate(String(filtered[0].id));
        }
      } else if (filtered.length > 0) {
        activateBigIdea.mutate(String(filtered[0].id));
      }
    }
  };
  
  const deleteBigIdea = useDeleteBigIdea();
  
  const { data: toolboxes = [] } = useToolboxes(activeBigIdea?.id);
  const { data: activeToolbox } = useActiveToolbox();
  const activateToolbox = useActivateToolbox();
  const deleteToolbox = useDeleteToolbox();

  const shouldFetchAgents = !!activeToolbox?.id;
  const { data: agents = [], isLoading: agentsLoading } = useAgents(shouldFetchAgents ? activeToolbox.id : undefined);
  const filteredAgents = shouldFetchAgents ? agents : [];

  const { data: profile } = useProfile();

  useEffect(() => {
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
    if (!activeToolbox || filteredAgents.length === 0) return;
    if (!activeAgent) {
      setActiveAgent.mutate(String(filteredAgents[0].id));
    } else {
      const agentBelongs = filteredAgents.some((a) => String(a.id) === String(activeAgent.id));
      if (!agentBelongs) {
        setActiveAgent.mutate(String(filteredAgents[0].id));
      }
    }
  }, [activeToolbox?.id, filteredAgents, activeAgent?.id]);
  
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
      toast({ title: "Berhasil", description: `Big Idea "${bi.name}" berhasil dihapus` });
      setDeleteBigIdeaConfirm(null);
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus Big Idea", variant: "destructive" });
    }
  };

  const handleEditToolbox = (tb: Toolbox) => {
    setEditingToolbox(tb);
    setEditToolboxDialogOpen(true);
  };

  const handleDeleteToolbox = async (tb: Toolbox) => {
    try {
      await deleteToolbox.mutateAsync(String(tb.id));
      toast({ title: "Berhasil", description: `Toolbox "${tb.name}" berhasil dihapus` });
      setDeleteToolboxConfirm(null);
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus Toolbox", variant: "destructive" });
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

  const renderPanel = () => {
    if (!activeAgent) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4 md:space-y-6 max-w-lg">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Selamat Datang di Gustafta</h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Mulai dengan membuat Big Idea atau Chatbot pertama Anda.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => setBigIdeaDialogOpen(true)} variant="outline" className="w-full sm:w-auto">
                <Lightbulb className="w-4 h-4 mr-2" />
                Buat Big Idea
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Buat Chatbot
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
        return <WidgetPanel agent={activeAgent} />;
      case "chat":
        return <ChatConsolePanel agent={activeAgent} />;
      case "project-brain":
        return <ProjectBrainPanel agent={activeAgent} />;
      case "mini-apps":
        return <MiniAppsPanel agent={activeAgent} />;
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

  const SidebarContent = () => (
    <>
      <div className={cn("border-b border-sidebar-border overflow-y-auto shrink-0 max-h-[40vh]", sidebarCollapsed ? "p-2" : "")}>
        {/* Series / Topik Dropdown */}
        <div className={cn(sidebarCollapsed ? "" : "px-3 pt-3 pb-1")}>
          {!sidebarCollapsed && <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-0 mb-1">Series / Topik</p>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(
                "w-full h-auto",
                sidebarCollapsed ? "justify-center p-2" : "justify-between px-3 py-2"
              )}>
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate text-sm">
                      {activeSeries?.name || "Semua Series"}
                    </span>
                  )}
                </div>
                {!sidebarCollapsed && <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Series / Topik</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleSeriesSelect(null)}
                className="gap-2"
                data-testid="menu-series-all"
              >
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span>Semua Series</span>
                {!activeSeriesId && <Badge variant="secondary" className="ml-auto text-xs">Aktif</Badge>}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {allSeries.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                  Belum ada Series
                </div>
              ) : (
                allSeries.map((s: any) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => handleSeriesSelect(s.id)}
                    className="gap-2"
                    data-testid={`menu-series-${s.id}`}
                  >
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <span className="truncate">{s.name}</span>
                    {activeSeriesId === s.id && <Badge variant="secondary" className="ml-auto text-xs">Aktif</Badge>}
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSeriesDialogOpen(true)} className="gap-2" data-testid="menu-series-manage">
                <Settings className="w-4 h-4" />
                Kelola Series
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Big Idea Dropdown */}
        <div className={cn(sidebarCollapsed ? "" : "px-3 pt-2 pb-1")}>
          {!sidebarCollapsed && <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-0 mb-1">Big Idea</p>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(
                "w-full h-auto",
                sidebarCollapsed ? "justify-center p-2" : "justify-between px-3 py-2"
              )}>
                <div className="flex items-center gap-2 min-w-0">
                  <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate text-sm">
                      {activeBigIdea?.name || "Pilih Big Idea"}
                    </span>
                  )}
                </div>
                {!sidebarCollapsed && <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Pilih Big Idea{activeSeries ? ` - ${activeSeries.name}` : ""}</DropdownMenuLabel>
              {filteredBigIdeas.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                  {activeSeriesId ? "Belum ada Big Idea di series ini" : "Belum ada Big Idea"}
                </div>
              ) : (
                filteredBigIdeas.map((bi) => (
                  <DropdownMenuItem
                    key={bi.id}
                    onClick={() => handleBigIdeaSelect(bi)}
                    className="gap-2"
                    data-testid={`menu-bigidea-select-${bi.id}`}
                  >
                    <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" />
                    <span className="truncate">{bi.name}</span>
                    {bi.isActive && <Badge variant="secondary" className="ml-auto text-xs">Aktif</Badge>}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Toolbox Section - only when Big Idea is selected */}
        {activeBigIdea && (
          <>
            {/* Toolbox Dropdown */}
            <div className={cn(sidebarCollapsed ? "" : "px-3 pt-2 pb-1")}>
              {!sidebarCollapsed && <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-0 mb-1">Toolbox</p>}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn(
                    "w-full h-auto",
                    sidebarCollapsed ? "justify-center p-2" : "justify-between px-3 py-2"
                  )}>
                    <div className="flex items-center gap-2 min-w-0">
                      <Wrench className="w-4 h-4 text-blue-500 shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="truncate text-sm">
                          {activeToolbox?.name || "Pilih Toolbox"}
                        </span>
                      )}
                    </div>
                    {!sidebarCollapsed && <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuLabel>Pilih Toolbox</DropdownMenuLabel>
                  {toolboxes.length === 0 ? (
                    <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                      Belum ada Toolbox
                    </div>
                  ) : (
                    toolboxes.map((tb) => (
                      <DropdownMenuItem
                        key={tb.id}
                        onClick={() => handleToolboxSelect(tb)}
                        className="gap-2"
                        data-testid={`menu-toolbox-select-${tb.id}`}
                      >
                        <Wrench className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="truncate">{tb.name}</span>
                        {tb.isActive && <Badge variant="secondary" className="ml-auto text-xs">Aktif</Badge>}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Toolboxes Flat List */}
            {!sidebarCollapsed && (
              <div className="px-3 pt-1 pb-2">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Toolboxes</p>
                <div className="space-y-0.5">
                  {toolboxes.map((tb) => (
                    <div
                      key={tb.id}
                      className={cn(
                        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
                        tb.isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                      onClick={() => handleToolboxSelect(tb)}
                      data-testid={`list-toolbox-${tb.id}`}
                    >
                      <Wrench className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate flex-1 text-sm">{tb.name}</span>
                      {tb.isActive && <Badge variant="secondary" className="text-[10px] shrink-0">Aktif</Badge>}
                      <div className="flex items-center gap-0.5 shrink-0 invisible group-hover:visible">
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
                    </div>
                  ))}
                  <button
                    onClick={() => setToolboxDialogOpen(true)}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                    data-testid="button-add-toolbox"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buat Toolbox Baru</span>
                  </button>
                </div>
              </div>
            )}

          </>
        )}
      </div>

      <nav className={cn("flex-1 min-h-0 space-y-1 overflow-y-auto", sidebarCollapsed ? "p-2" : "p-3")}>
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
              sidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
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

      <div className={cn("border-t border-sidebar-border space-y-1 shrink-0", sidebarCollapsed ? "p-2" : "p-3")}>
        <button
          onClick={() => setProfileDialogOpen(true)}
          className={cn(
            "w-full flex items-center rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
            sidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
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
              sidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
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
            sidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
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
                  ) : (
                    <span className="text-muted-foreground text-sm">Pilih Chatbot</span>
                  )}
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Chatbots{activeToolbox ? ` - ${activeToolbox.name}` : ""}</DropdownMenuLabel>
                {!activeToolbox ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    Pilih Toolbox terlebih dahulu
                  </div>
                ) : filteredAgents.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    Belum ada chatbot di toolbox ini
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
                  Buat Chatbot Baru
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
              New Chatbot
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
          {renderPanel()}
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

      <CreateAgentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <CreateBigIdeaDialog open={bigIdeaDialogOpen} onOpenChange={setBigIdeaDialogOpen} seriesId={activeSeriesId} />
      {activeBigIdea && (
        <CreateToolboxDialog 
          open={toolboxDialogOpen} 
          onOpenChange={setToolboxDialogOpen} 
          bigIdea={activeBigIdea}
        />
      )}
      <UserProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
      <SeriesManagementDialog open={seriesDialogOpen} onOpenChange={setSeriesDialogOpen} />

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
            <AlertDialogTitle>Hapus Big Idea?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus Big Idea "{deleteBigIdeaConfirm?.name}"? 
              Semua Toolbox dan Agent di dalamnya juga akan terpengaruh. Tindakan ini tidak bisa dibatalkan.
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
            <AlertDialogTitle>Hapus Toolbox?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus Toolbox "{deleteToolboxConfirm?.name}"? 
              Semua Agent di dalamnya juga akan terpengaruh. Tindakan ini tidak bisa dibatalkan.
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
    </div>
  );
}
