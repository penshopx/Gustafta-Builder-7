import { useState } from "react";
import { 
  Bot, BookOpen, Plug, MessageSquare, Plus, ChevronDown, Settings, BarChart3,
  Lightbulb, Wrench, Sparkles, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { AgenticAIPanel } from "@/components/panels/agentic-ai-panel";
import { CreateAgentDialog } from "@/components/dialogs/create-agent-dialog";
import { CreateBigIdeaDialog } from "@/components/dialogs/create-big-idea-dialog";
import { CreateToolboxDialog } from "@/components/dialogs/create-toolbox-dialog";
import { UserProfileDialog } from "@/components/dialogs/user-profile-dialog";
import { ChatPopup } from "@/components/chat-popup";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAgents, useActiveAgent, useSetActiveAgent } from "@/hooks/use-agents";
import { useBigIdeas, useActiveBigIdea, useActivateBigIdea } from "@/hooks/use-big-ideas";
import { useToolboxes, useActiveToolbox, useActivateToolbox } from "@/hooks/use-toolboxes";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import type { Agent, BigIdea, Toolbox } from "@shared/schema";

type NavItem = "persona" | "knowledge" | "integrations" | "chat" | "analytics" | "agentic";

const navItems: { id: NavItem; label: string; icon: typeof Bot }[] = [
  { id: "persona", label: "Persona", icon: Bot },
  { id: "agentic", label: "Agentic AI", icon: Sparkles },
  { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "chat", label: "Chat Console", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState<NavItem>("persona");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bigIdeaDialogOpen, setBigIdeaDialogOpen] = useState(false);
  const [toolboxDialogOpen, setToolboxDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: activeAgent } = useActiveAgent();
  const setActiveAgent = useSetActiveAgent();
  
  const { data: bigIdeas = [] } = useBigIdeas();
  const { data: activeBigIdea } = useActiveBigIdea();
  const activateBigIdea = useActivateBigIdea();
  
  const { data: toolboxes = [] } = useToolboxes(activeBigIdea?.id);
  const { data: activeToolbox } = useActiveToolbox();
  const activateToolbox = useActivateToolbox();
  
  const { data: profile } = useProfile();

  const handleAgentSelect = (agent: Agent) => {
    setActiveAgent.mutate(agent.id);
  };

  const handleBigIdeaSelect = (bigIdea: BigIdea) => {
    activateBigIdea.mutate(bigIdea.id);
  };

  const handleToolboxSelect = (toolbox: Toolbox) => {
    activateToolbox.mutate(toolbox.id);
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-lg px-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Selamat Datang di Gustafta</h2>
              <p className="text-muted-foreground mt-2">
                Mulai dengan membuat Big Idea untuk mendefinisikan masalah atau ide Anda, 
                lalu buat Toolbox dan Chatbot yang cerdas.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => setBigIdeaDialogOpen(true)} variant="outline" data-testid="button-create-first-bigidea">
                <Lightbulb className="w-4 h-4 mr-2" />
                Buat Big Idea
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-first-agent">
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
      case "chat":
        return <ChatConsolePanel agent={activeAgent} />;
      case "analytics":
        return <AnalyticsPanel agent={activeAgent} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sidebar-foreground">Gustafta</h1>
              <p className="text-xs text-muted-foreground">AI Chatbot Builder</p>
            </div>
          </div>
        </div>

        {/* Hierarchy Section */}
        <div className="p-3 border-b border-sidebar-border space-y-2">
          {/* Big Idea Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-3 py-2 h-auto" data-testid="button-bigidea-selector">
                <div className="flex items-center gap-2 min-w-0">
                  <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" />
                  <span className="truncate text-sm">
                    {activeBigIdea?.name || "Pilih Big Idea"}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Big Ideas</DropdownMenuLabel>
              {bigIdeas.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                  Belum ada Big Idea
                </div>
              ) : (
                bigIdeas.map((bi) => (
                  <DropdownMenuItem
                    key={bi.id}
                    onClick={() => handleBigIdeaSelect(bi)}
                    className="gap-2"
                    data-testid={`bigidea-option-${bi.id}`}
                  >
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="truncate">{bi.name}</span>
                    {bi.isActive && <Badge variant="secondary" className="ml-auto text-xs">Aktif</Badge>}
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setBigIdeaDialogOpen(true)} className="gap-2" data-testid="dropdown-create-bigidea">
                <Plus className="w-4 h-4" />
                Buat Big Idea Baru
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Toolbox Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-3 py-2 h-auto" disabled={!activeBigIdea} data-testid="button-toolbox-selector">
                <div className="flex items-center gap-2 min-w-0">
                  <Wrench className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate text-sm">
                    {activeToolbox?.name || "Pilih Toolbox"}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Toolboxes</DropdownMenuLabel>
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
                    data-testid={`toolbox-option-${tb.id}`}
                  >
                    <Wrench className="w-4 h-4 text-blue-500" />
                    <span className="truncate">{tb.name}</span>
                    {tb.isActive && <Badge variant="secondary" className="ml-auto text-xs">Aktif</Badge>}
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setToolboxDialogOpen(true)}
                className="gap-2"
                disabled={!activeBigIdea}
                data-testid="dropdown-create-toolbox"
              >
                <Plus className="w-4 h-4" />
                Buat Toolbox Baru
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              disabled={!activeAgent}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                activeNav === item.id && activeAgent
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                !activeAgent && "opacity-50 cursor-not-allowed"
              )}
              data-testid={`nav-${item.id}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.id === "agentic" && (
                <Badge variant="secondary" className="ml-auto text-xs">New</Badge>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile at bottom */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <button
            onClick={() => setProfileDialogOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
            data-testid="button-user-profile"
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={profile?.avatarUrl} />
              <AvatarFallback className="text-xs">
                {profile?.displayName ? getInitials(profile.displayName) : <User className="w-3 h-3" />}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{profile?.displayName || "Profil"}</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
            data-testid="nav-settings"
          >
            <Settings className="w-4 h-4" />
            Pengaturan
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
          {/* Agent Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 px-3"
                disabled={agentsLoading}
                data-testid="button-agent-switcher"
              >
                {activeAgent ? (
                  <>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {activeAgent.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{activeAgent.name}</span>
                    {activeAgent.orchestratorRole === "orchestrator" && (
                      <Badge variant="secondary" className="text-xs">Orchestrator</Badge>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground">Pilih Chatbot</span>
                )}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Chatbots</DropdownMenuLabel>
              {agents.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                  Belum ada chatbot
                </div>
              ) : (
                agents.map((agent) => (
                  <DropdownMenuItem
                    key={agent.id}
                    onClick={() => handleAgentSelect(agent)}
                    className="gap-2"
                    data-testid={`agent-option-${agent.id}`}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {agent.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{agent.name}</span>
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
                data-testid="dropdown-create-agent"
              >
                <Plus className="w-4 h-4" />
                Buat Chatbot Baru
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              data-testid="button-create-agent-header"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chatbot
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {renderPanel()}
        </div>
      </div>

      {/* Floating Chat Popup */}
      {activeAgent && <ChatPopup agent={activeAgent} />}

      {/* Dialogs */}
      <CreateAgentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <CreateBigIdeaDialog open={bigIdeaDialogOpen} onOpenChange={setBigIdeaDialogOpen} />
      {activeBigIdea && (
        <CreateToolboxDialog 
          open={toolboxDialogOpen} 
          onOpenChange={setToolboxDialogOpen} 
          bigIdea={activeBigIdea}
        />
      )}
      <UserProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
    </div>
  );
}
