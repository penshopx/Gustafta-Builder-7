import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsSummary } from "@/hooks/use-analytics";
import { MessageSquare, Users, Zap, BarChart3, Clock, TrendingUp } from "lucide-react";
import type { Agent } from "@shared/schema";

interface AnalyticsPanelProps {
  agent: Agent;
}

export function AnalyticsPanel({ agent }: AnalyticsPanelProps) {
  const { data: analytics, isLoading } = useAnalyticsSummary(agent.id);

  const getDayLabels = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const labels: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(days[date.getDay()]);
    }
    return labels;
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  const maxMessages = Math.max(...(analytics?.messagesLast7Days || [1]));

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-analytics-title">Analytics</h2>
          <p className="text-muted-foreground mt-1">Track your chatbot performance and engagement</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-16 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-total-messages">
                        {analytics?.totalMessages || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Messages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <Users className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-total-sessions">
                        {analytics?.totalSessions || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-orange-500/10">
                      <Zap className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-integration-calls">
                        {analytics?.totalIntegrationCalls || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Integration Calls</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  <CardTitle>Messages Last 7 Days</CardTitle>
                </div>
                <CardDescription>Daily message activity for your chatbot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-2" data-testid="chart-messages-7days">
                  {(analytics?.messagesLast7Days || [0, 0, 0, 0, 0, 0, 0]).map((count, index) => {
                    const height = maxMessages > 0 ? (count / maxMessages) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-primary/80 rounded-t-sm transition-all"
                          style={{ height: `${Math.max(height, 4)}%` }}
                          title={`${count} messages`}
                        />
                        <span className="text-xs text-muted-foreground">{getDayLabels()[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <CardTitle>Peak Hours</CardTitle>
                  </div>
                  <CardDescription>When your chatbot is most active</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.topHours && analytics.topHours.length > 0 ? (
                    <div className="space-y-3" data-testid="list-peak-hours">
                      {analytics.topHours.map((item, index) => (
                        <div key={item.hour} className="flex items-center gap-3">
                          <span className="text-sm font-medium w-16">{formatHour(item.hour)}</span>
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${(item.count / analytics.topHours[0].count) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No activity data yet. Start chatting to see peak hours.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                    <CardTitle>Performance Tips</CardTitle>
                  </div>
                  <CardDescription>Suggestions to improve engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3" data-testid="list-performance-tips">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-sm text-muted-foreground">
                        Add conversation starters to help users begin chatting
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-sm text-muted-foreground">
                        Create a welcoming greeting message for new visitors
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-sm text-muted-foreground">
                        Build a knowledge base to improve response accuracy
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-sm text-muted-foreground">
                        Enable integrations to reach users on multiple platforms
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
