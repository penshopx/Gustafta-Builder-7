import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Trash2, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useMessages, useSendMessage, useClearMessages } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import type { Agent, Message } from "@shared/schema";

interface ChatConsolePanelProps {
  agent: Agent;
}

export function ChatConsolePanel({ agent }: ChatConsolePanelProps) {
  const { toast } = useToast();
  const { data: messages = [], isLoading } = useMessages(agent.id);
  const sendMessage = useSendMessage();
  const clearMessages = useClearMessages();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage.mutate(
      { agentId: agent.id, role: "user", content: input.trim(), reasoning: "", sources: [] },
      {
        onSuccess: () => {
          setInput("");
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
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

  const handleClear = () => {
    clearMessages.mutate(agent.id, {
      onSuccess: () => {
        toast({
          title: "Chat Cleared",
          description: "All messages have been removed.",
        });
      },
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="p-3 md:p-6 h-full flex flex-col max-w-4xl">
      <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
        <div className="min-w-0">
          <h2 className="text-lg md:text-2xl font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
            <span className="truncate">Chat Console</span>
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden sm:block">
            Full conversation history and testing interface
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={messages.length === 0}
          data-testid="button-clear-chat"
          className="shrink-0"
        >
          <Trash2 className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Clear History</span>
        </Button>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {agent.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {agent.name}
            <span className="text-xs text-muted-foreground font-normal ml-auto">
              {messages.length} messages
            </span>
          </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-1">No Messages Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start a conversation to test your chatbot
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} agentName={agent.name} />
              ))
            )}
            {sendMessage.isPending && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">{agent.name}</div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[44px] max-h-[120px] resize-none"
              rows={1}
              data-testid="input-console-message"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sendMessage.isPending}
              data-testid="button-send-console"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MessageBubble({ message, agentName }: { message: Message; agentName: string }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")} data-testid={`message-${message.id}`}>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={isUser ? "bg-secondary" : "bg-primary/10 text-primary"}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      <div className={cn("flex-1 min-w-0", isUser && "text-right")}>
        <div className="text-xs text-muted-foreground mb-1">
          {isUser ? "You" : agentName}
        </div>
        <div
          className={cn(
            "inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          {message.content}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
