import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User, CreditCard, Bot, LayoutDashboard, LogOut,
  Calendar, ArrowRight, Zap, CheckCircle2, Clock, XCircle,
  ShoppingBag, HeadphonesIcon
} from "lucide-react";

interface AccountData {
  user: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
    role: string | null;
    createdAt: string | null;
  } | null;
  subscription: {
    id: number;
    plan: string;
    status: string;
    chatbotLimit: number;
    startDate: string | null;
    endDate: string | null;
    amount: number;
  } | null;
  agentCount: number;
  agents: { id: string; name: string; tagline: string | null; category: string | null }[];
}

function planLabel(plan: string) {
  const map: Record<string, string> = {
    monthly: "1 Bulan", quarterly: "3 Bulan",
    semiannual: "6 Bulan", annual: "12 Bulan", voucher: "Trial",
  };
  return map[plan] || plan;
}

function formatDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function SubscriptionStatusBadge({ status }: { status: string }) {
  if (status === "active") return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 font-medium">
      <CheckCircle2 className="h-3 w-3" /> Aktif
    </span>
  );
  if (status === "expired") return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-medium">
      <XCircle className="h-3 w-3" /> Expired
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 font-medium">
      <Clock className="h-3 w-3" /> {status}
    </span>
  );
}

export default function AccountPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data, isLoading } = useQuery<AccountData>({
    queryKey: ["/api/my/account"],
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Memuat informasi akun...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <User className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="text-xl font-bold">Login Diperlukan</h1>
          <a href="/api/login">
            <Button>Masuk ke Gustafta</Button>
          </a>
        </div>
      </div>
    );
  }

  const { user, subscription, agentCount, agents } = data || {};
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Pengguna";
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const daysLeft = subscription?.endDate
    ? Math.max(0, Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <span className="font-bold text-lg text-primary cursor-pointer">Gustafta</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-1.5" data-testid="button-go-dashboard">
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </Button>
            </Link>
            <a href="/api/logout">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" data-testid="button-logout">
                <LogOut className="h-3.5 w-3.5" /> Keluar
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Profile Card */}
        <Card data-testid="card-profile">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-xl font-bold" data-testid="text-fullname">{fullName}</h1>
                <p className="text-muted-foreground text-sm" data-testid="text-email">{user?.email || "—"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Bergabung sejak {formatDate(user?.createdAt || null)}
                </p>
              </div>
              {(user?.role === "admin" || user?.role === "superadmin") && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium">
                  {user.role === "superadmin" ? "Super Admin" : "Admin"}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card data-testid="card-subscription">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" /> Status Langganan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg" data-testid="text-plan">Paket {planLabel(subscription.plan)}</span>
                      <SubscriptionStatusBadge status={subscription.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Limit: <span className="font-medium text-foreground">{subscription.chatbotLimit} chatbot</span>
                    </p>
                  </div>
                  <div className="text-right">
                    {subscription.endDate && (
                      <div>
                        <p className="text-xs text-muted-foreground">Berakhir</p>
                        <p className="text-sm font-medium" data-testid="text-end-date">{formatDate(subscription.endDate)}</p>
                        {subscription.status === "active" && daysLeft !== null && (
                          <p className={`text-xs mt-0.5 font-medium ${daysLeft <= 7 ? "text-red-500" : daysLeft <= 30 ? "text-yellow-600" : "text-green-600"}`}>
                            {daysLeft === 0 ? "Berakhir hari ini!" : `${daysLeft} hari lagi`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar for subscription days */}
                {subscription.startDate && subscription.endDate && subscription.status === "active" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatDate(subscription.startDate)}</span>
                      <span>{formatDate(subscription.endDate)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${Math.max(5, Math.min(100, 100 - (daysLeft || 0) / Math.max(1, (new Date(subscription.endDate).getTime() - new Date(subscription.startDate).getTime()) / (1000 * 60 * 60 * 24)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-1 flex-wrap">
                  <Link href="/subscription">
                    <Button size="sm" variant="outline" className="gap-1.5" data-testid="button-manage-subscription">
                      <CreditCard className="h-3.5 w-3.5" /> Kelola Langganan
                    </Button>
                  </Link>
                  {(subscription.status === "expired" || daysLeft !== null && daysLeft <= 30) && (
                    <Link href="/pricing">
                      <Button size="sm" className="gap-1.5 bg-primary" data-testid="button-renew">
                        <Zap className="h-3.5 w-3.5" /> Perpanjang
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-4">
                  <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Belum berlangganan</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pilih paket untuk mulai membangun chatbot AI Anda.</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Link href="/pricing">
                    <Button size="sm" className="gap-1.5" data-testid="button-see-pricing">
                      <Zap className="h-3.5 w-3.5" /> Lihat Paket Harga
                    </Button>
                  </Link>
                  <Link href="/#trial">
                    <Button size="sm" variant="outline" className="gap-1.5" data-testid="button-request-trial">
                      <Clock className="h-3.5 w-3.5" /> Minta Trial Gratis
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chatbots Card */}
        <Card data-testid="card-chatbots">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" /> Chatbot Saya
                {agentCount !== undefined && agentCount > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{agentCount}</span>
                )}
              </CardTitle>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary" data-testid="button-manage-chatbots">
                  Kelola semua <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {!agents || agents.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <Bot className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
                <div>
                  <p className="text-sm font-medium">Belum ada chatbot</p>
                  <p className="text-xs text-muted-foreground mt-1">Buat chatbot pertama Anda dari Dashboard.</p>
                </div>
                <Link href="/dashboard">
                  <Button size="sm" className="gap-1.5" data-testid="button-create-chatbot">
                    <Bot className="h-3.5 w-3.5" /> Buat Chatbot
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                    data-testid={`card-agent-${agent.id}`}
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{agent.name}</p>
                      {agent.tagline && (
                        <p className="text-xs text-muted-foreground truncate">{agent.tagline}</p>
                      )}
                    </div>
                    <Link href="/dashboard">
                      <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
                {agentCount !== undefined && agentCount > 6 && (
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="w-full gap-1.5 mt-1" data-testid="button-see-all-chatbots">
                      Lihat {agentCount - 6} chatbot lainnya <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/dashboard">
            <Card className="hover:bg-muted/30 transition-colors cursor-pointer" data-testid="card-action-dashboard">
              <CardContent className="pt-5 pb-4">
                <LayoutDashboard className="h-6 w-6 text-primary mb-2" />
                <p className="font-medium text-sm">Buka Dashboard</p>
                <p className="text-xs text-muted-foreground mt-0.5">Kelola & bangun chatbot</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/marketplace">
            <Card className="hover:bg-muted/30 transition-colors cursor-pointer" data-testid="card-action-marketplace">
              <CardContent className="pt-5 pb-4">
                <ShoppingBag className="h-6 w-6 text-indigo-500 mb-2" />
                <p className="font-medium text-sm">Marketplace</p>
                <p className="text-xs text-muted-foreground mt-0.5">Template chatbot siap pakai</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/subscription">
            <Card className="hover:bg-muted/30 transition-colors cursor-pointer" data-testid="card-action-subscription">
              <CardContent className="pt-5 pb-4">
                <CreditCard className="h-6 w-6 text-green-500 mb-2" />
                <p className="font-medium text-sm">Langganan</p>
                <p className="text-xs text-muted-foreground mt-0.5">Lihat & kelola paket</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/documentation">
            <Card className="hover:bg-muted/30 transition-colors cursor-pointer" data-testid="card-action-docs">
              <CardContent className="pt-5 pb-4">
                <HeadphonesIcon className="h-6 w-6 text-orange-500 mb-2" />
                <p className="font-medium text-sm">Bantuan</p>
                <p className="text-xs text-muted-foreground mt-0.5">Panduan & dokumentasi</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Logout */}
        <div className="text-center pb-4">
          <a href="/api/logout">
            <Button variant="ghost" className="gap-2 text-muted-foreground" data-testid="button-logout-bottom">
              <LogOut className="h-4 w-4" /> Keluar dari Gustafta
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
}
