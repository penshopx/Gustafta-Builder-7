import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessages, useSendMessage } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { MessageContent } from "@/lib/format-message";
import { parseBrainUpdates, BrainChip } from "@/lib/brain-utils";
import type { Agent, Message } from "@shared/schema";

interface DialogGustaftaWidgetProps {
  agent: Agent;
}

export function DialogGustaftaWidget({ agent }: DialogGustaftaWidgetProps) {
  const { data: messages = [], isLoading } = useMessages(agent.id);
  const sendMessage = useSendMessage();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage.mutate(
      { agentId: agent.id, role: "user", content: input.trim(), reasoning: "", sources: [] },
      {
        onSuccess: () => {
          setInput("");
          if (textareaRef.current) textareaRef.current.style.height = "auto";
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const recentMessages = messages.slice(-50);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Chat Window — opens to the right of the button */}
      <div
        className={cn(
          "absolute bottom-16 left-0 w-[360px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-left",
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-900 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
              <img src="/logo-gustafta.png" alt="Gustafta" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">DIALOG GUSTAFTA</h3>
              <p className="text-xs text-white/70">
                {agent.tagline || "Lawan bicara AI profesional"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea className="h-[400px] max-h-[60vh]" ref={scrollRef}>
          <div className="p-4 space-y-4">
            {recentMessages.length === 0 && !isLoading && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 shrink-0">
                  {agent.avatar && agent.avatar.trim() !== "" ? (
                    <AvatarImage src={agent.avatar} alt={agent.name} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="text-xs bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                    <img src="/logo-gustafta.png" alt="" className="w-5 h-5 object-contain" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <span className="text-[10px] text-muted-foreground">{agent.name}</span>
                  <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm bg-muted">
                    {agent.greetingMessage || `Halo! Ada yang bisa saya bantu?`}
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              recentMessages.map((message) => (
                <BubbleGustafta
                  key={message.id}
                  message={message}
                  agentName={agent.name}
                  agentAvatar={agent.avatar}
                />
              ))
            )}

            {sendMessage.isPending && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40">
                    <img src="/logo-gustafta.png" alt="" className="w-5 h-5 object-contain" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-2 h-2 bg-blue-900 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan Anda..."
              className="min-h-[44px] max-h-[100px] resize-none text-sm rounded-xl"
              rows={1}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || sendMessage.isPending}
              className="shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 hover:from-cyan-600 hover:to-blue-800 border-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            💬 Dialog Gustafta — AI lawan bicara profesional
          </p>
        </div>
      </div>

      {/* Floating Button — gradient Gustafta */}
      <div className="relative">
        {!isOpen && (
          <span className="absolute inset-0 w-14 h-14 rounded-full bg-cyan-400/40 animate-ping" style={{ animationDuration: "2s" }} />
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center",
            "bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-900",
            "hover:scale-105 active:scale-95"
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <img src="/logo-gustafta.png" alt="Dialog Gustafta" className="w-10 h-10 object-contain" />
          )}
        </button>
        {/* Label */}
        {!isOpen && (
          <div className="absolute bottom-0 left-16 bg-gradient-to-r from-cyan-500 to-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
            Dialog Gustafta
          </div>
        )}
      </div>

      {/* Unread badge */}
      {!isOpen && recentMessages.length > 0 && (
        <span className="absolute top-0 left-10 w-5 h-5 bg-cyan-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
          {Math.min(recentMessages.length, 9)}
          {recentMessages.length > 9 && "+"}
        </span>
      )}
    </div>
  );
}

function BubbleGustafta({ message, agentName, agentAvatar }: { message: Message; agentName: string; agentAvatar?: string }) {
  const isUser = message.role === "user";
  const { fields: brainFields, cleanContent } = !isUser
    ? parseBrainUpdates(message.content)
    : { fields: [], cleanContent: message.content };

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <Avatar className="w-8 h-8 shrink-0">
        {!isUser && agentAvatar && agentAvatar.trim() !== "" ? (
          <AvatarImage src={agentAvatar} alt={agentName} className="object-cover" />
        ) : null}
        <AvatarFallback
          className={cn(
            "text-xs",
            isUser ? "bg-secondary" : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300"
          )}
        >
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <img src="/logo-gustafta.png" alt="" className="w-5 h-5 object-contain" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 max-w-[75%]">
        <span className={cn("text-[10px] text-muted-foreground", isUser && "text-right")}>
          {isUser ? "Anda" : agentName}
        </span>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words",
            isUser
              ? "bg-gradient-to-br from-cyan-500 to-blue-700 text-white rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          {isUser ? message.content : <MessageContent text={cleanContent} />}
        </div>
        {!isUser && <BrainChip fields={brainFields} />}
      </div>
    </div>
  );
}
