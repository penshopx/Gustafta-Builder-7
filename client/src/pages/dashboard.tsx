import { useState } from "react";
import { Bot, BookOpen, Plug, MessageSquare, Plus, ChevronDown, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PersonaPanel } from "@/components/panels/persona-panel";
import { KnowledgeBasePanel } from "@/components/panels/knowledge-base-panel";
import { IntegrationsPanel } from "@/components/panels/integrations-panel";
import { ChatConsolePanel } from "@/components/panels/chat-console-panel";
import { AnalyticsPanel } from "@/components/panels/analytics-panel";
import { CreateAgentDialog } from "@/components/dialogs/create-agent-dialog";
import { ChatPopup } from "@/components/chat-popup";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAgents, useActiveAgent, useSetActiveAgent } from "@/hooks/use-agents";
import { cn } from "@/lib/utils";
import type { Agent } from "@shared/schema";

type NavItem = "persona" | "knowledge" | "integrations" | "chat" | "analytics";

const navItems: { id: NavItem; label: string; icon: typeof Bot }[] = [
  { id: "persona", label: "Persona", icon: Bot },
  { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "chat", label: "Chat Console", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState<NavItem>("persona");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: activeAgent } = useActiveAgent();
  const setActiveAgent = useSetActiveAgent();

  const handleAgentSelect = (agent: Agent) => {
    setActiveAgent.mutate(agent.id);
  };

  const renderPanel = () => {
    if (!activeAgent) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">No Chatbot Selected</h2>
              <p className="text-muted-foreground mt-1">Create a new chatbot or select one to get started</p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-first-agent">
              <Plus className="w-4 h-4 mr-2" />
              Create Chatbot
            </Button>
          </div>
        </div>
      );
    }

    switch (activeNav) {
      case "persona":
        return <PersonaPanel agent={activeAgent} />;
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
              <p className="text-xs text-muted-foreground">Chatbot Builder</p>
            </div>
          </div>
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
            </button>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
            data-testid="nav-settings"
          >
            <Settings className="w-4 h-4" />
            Settings
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
                  </>
                ) : (
                  <span className="text-muted-foreground">Select Chatbot</span>
                )}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {agents.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                  No chatbots yet
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
                    <span>{agent.name}</span>
                    {agent.isActive && (
                      <span className="ml-auto text-xs text-primary">Active</span>
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
                Create New Chatbot
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

      {/* Create Agent Dialog */}
      <CreateAgentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}
