import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Users, CreditCard, FileText, ToggleLeft, ToggleRight,
  CheckCircle2, XCircle, Shield, ArrowLeft, Copy,
  UserCheck, AlertCircle, RefreshCw, Crown, UserCog
} from "lucide-react";

// ---- Types ----
interface AdminMeData {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: string;
  user: any;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingTrialRequests: number;
  activeSubscriptions: number;
}

interface AdminUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  isActive: boolean | null;
  createdAt: string | null;
  subscription: {
    id: number;
    plan: string;
    status: string;
    endDate: string | null;
    chatbotLimit: number;
  } | null;
}

interface AdminSubscription {
  id: number;
  userId: string;
  plan: string;
  status: string;
  amount: number;
  chatbotLimit: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  user: { id: string; email: string | null; firstName: string | null; lastName: string | null } | null;
}

interface TrialRequest {
  id: number;
  name: string;
  phone: string;
  email: string;
  company: string | null;
  useCase: string | null;
  status: string;
  voucherCode: string | null;
  notes: string | null;
  createdAt: string;
}

// ---- Helpers ----
function formatDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function planLabel(plan: string) {
  const map: Record<string, string> = {
    monthly: "1 Bulan", quarterly: "3 Bulan",
    semiannual: "6 Bulan", annual: "12 Bulan", voucher: "Voucher",
  };
  return map[plan] || plan;
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "Aktif", className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
    expired: { label: "Expired", className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" },
    approved: { label: "Disetujui", className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
    rejected: { label: "Ditolak", className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
  };
  const m = map[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.className}`}>{m.label}</span>;
}

function roleBadge(role: string | null) {
  if (role === "superadmin") return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 flex items-center gap-1 w-fit"><Crown className="h-3 w-3" /> Super Admin</span>;
  if (role === "admin") return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 flex items-center gap-1 w-fit"><Shield className="h-3 w-3" /> Admin</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">User</span>;
}

// ---- Main Component ----
export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("users");
  const [approveDialog, setApproveDialog] = useState<{ open: boolean; request: TrialRequest | null }>({ open: false, request: null });
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; request: TrialRequest | null }>({ open: false, request: null });
  const [durationDays, setDurationDays] = useState("14");
  const [rejectNotes, setRejectNotes] = useState("");
  const [subDialog, setSubDialog] = useState<{ open: boolean; sub: AdminSubscription | null }>({ open: false, sub: null });
  const [newStatus, setNewStatus] = useState("active");
  const [newEndDate, setNewEndDate] = useState("");

  // ---- Queries ----
  const { data: meData, isError: meError, isLoading: meLoading } = useQuery<AdminMeData>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const isSuperAdmin = meData?.isSuperAdmin === true;
  const isAdmin = meData?.isAdmin === true;

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAdmin,
  });

  const { data: usersList = [], isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAdmin && activeTab === "users",
  });

  const { data: adminsList = [], isLoading: adminsLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/admins"],
    enabled: isSuperAdmin && activeTab === "admins",
  });

  const { data: subscriptions = [], isLoading: subsLoading } = useQuery<AdminSubscription[]>({
    queryKey: ["/api/admin/subscriptions"],
    enabled: isAdmin && activeTab === "subscriptions",
  });

  const { data: trialList = [], isLoading: trialLoading } = useQuery<TrialRequest[]>({
    queryKey: ["/api/admin/trial-requests"],
    enabled: isAdmin && activeTab === "trials",
  });

  // ---- Mutations ----
  const toggleUserMutation = useMutation({
    mutationFn: (userId: string) => apiRequest("PATCH", `/api/admin/users/${userId}/toggle`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Status pengguna diperbarui." });
    },
    onError: () => toast({ title: "Gagal memperbarui status.", variant: "destructive" }),
  });

  const toggleAdminMutation = useMutation({
    mutationFn: (userId: string) => apiRequest("PATCH", `/api/admin/admins/${userId}/toggle`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admins"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Status admin diperbarui." });
    },
    onError: () => toast({ title: "Gagal memperbarui status admin.", variant: "destructive" }),
  });

  const setRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admins"] });
      toast({ title: "Role pengguna diperbarui." });
    },
    onError: () => toast({ title: "Gagal mengubah role.", variant: "destructive" }),
  });

  const approveTrialMutation = useMutation({
    mutationFn: ({ id, durationDays }: { id: number; durationDays: number }) =>
      apiRequest("POST", `/api/admin/trial-requests/${id}/approve`, { durationDays }),
    onSuccess: async (data: any) => {
      const result = await data.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trial-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setApproveDialog({ open: false, request: null });
      toast({
        title: `Trial disetujui! Kode: ${result.voucherCode}`,
        description: "Salin kode dan kirimkan ke pengguna via WA/Email.",
      });
    },
    onError: () => toast({ title: "Gagal menyetujui trial.", variant: "destructive" }),
  });

  const rejectTrialMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      apiRequest("POST", `/api/admin/trial-requests/${id}/reject`, { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trial-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setRejectDialog({ open: false, request: null });
      setRejectNotes("");
      toast({ title: "Permintaan trial ditolak." });
    },
    onError: () => toast({ title: "Gagal menolak permintaan.", variant: "destructive" }),
  });

  const updateSubMutation = useMutation({
    mutationFn: ({ id, status, endDate }: { id: number; status: string; endDate: string }) =>
      apiRequest("PATCH", `/api/admin/subscriptions/${id}`, { status, endDate: endDate || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setSubDialog({ open: false, sub: null });
      toast({ title: "Langganan diperbarui." });
    },
    onError: () => toast({ title: "Gagal memperbarui langganan.", variant: "destructive" }),
  });

  // ---- Guards ----
  if (meError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-6">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">Login Diperlukan</h1>
          <p className="text-muted-foreground">Silakan login terlebih dahulu untuk mengakses admin panel.</p>
          <a href="/api/login">
            <Button className="gap-2">Masuk ke Gustafta</Button>
          </a>
        </div>
      </div>
    );
  }

  if (meData && !meData.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-6">
          <Shield className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Akses Ditolak</h1>
          <p className="text-muted-foreground">Halaman ini hanya untuk administrator Gustafta.</p>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (meLoading || !meData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Memeriksa akses admin...</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Kode voucher disalin!" });
  };

  const tabCount = isSuperAdmin ? 4 : 3;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" data-testid="button-back-dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2">
                Admin Panel
                {isSuperAdmin ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 flex items-center gap-1 font-medium">
                    <Crown className="h-3 w-3" /> Super Admin
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 flex items-center gap-1 font-medium">
                    <Shield className="h-3 w-3" /> Admin
                  </span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground">Gustafta Platform Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSuperAdmin ? <Crown className="h-4 w-4 text-purple-500" /> : <Shield className="h-4 w-4 text-primary" />}
            <span className="text-sm font-medium hidden sm:block">{meData.user?.email}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card data-testid="stat-total-users">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Pengguna</p>
                  <p className="text-3xl font-bold mt-1">{statsLoading ? "—" : (stats?.totalUsers ?? 0)}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-active-users">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pengguna Aktif</p>
                  <p className="text-3xl font-bold mt-1 text-green-600">{statsLoading ? "—" : (stats?.activeUsers ?? 0)}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-active-subs">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Langganan Aktif</p>
                  <p className="text-3xl font-bold mt-1 text-primary">{statsLoading ? "—" : (stats?.activeSubscriptions ?? 0)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-pending-trials">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Trial Menunggu</p>
                  <p className="text-3xl font-bold mt-1 text-yellow-600">{statsLoading ? "—" : (stats?.pendingTrialRequests ?? 0)}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full max-w-2xl`} style={{ gridTemplateColumns: `repeat(${tabCount}, 1fr)` }}>
            {isSuperAdmin && (
              <TabsTrigger value="admins" className="gap-1.5 text-xs" data-testid="tab-admins">
                <UserCog className="h-3.5 w-3.5" /> Admin
              </TabsTrigger>
            )}
            <TabsTrigger value="users" className="gap-1.5 text-xs" data-testid="tab-users">
              <Users className="h-3.5 w-3.5" /> Pengguna
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="gap-1.5 text-xs" data-testid="tab-subscriptions">
              <CreditCard className="h-3.5 w-3.5" /> Langganan
            </TabsTrigger>
            <TabsTrigger value="trials" className="gap-1.5 text-xs" data-testid="tab-trials">
              <FileText className="h-3.5 w-3.5" /> Trial
              {(stats?.pendingTrialRequests ?? 0) > 0 && (
                <span className="ml-1 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {stats?.pendingTrialRequests}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ========== ADMINS TAB (Super Admin only) ========== */}
          {isSuperAdmin && (
            <TabsContent value="admins" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <UserCog className="h-4 w-4" /> Manajemen Admin
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Atur akun admin. Untuk membuat admin baru, buka tab Pengguna → ubah role ke "Admin".
                      </p>
                    </div>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/admins"] })}
                      data-testid="button-refresh-admins"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {adminsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />)}
                    </div>
                  ) : adminsList.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <UserCog className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                      <p className="text-muted-foreground">Belum ada akun admin.</p>
                      <p className="text-xs text-muted-foreground">Buka tab Pengguna → ubah role user menjadi "Admin" untuk menambah admin.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-muted-foreground">
                            <th className="text-left py-2 pr-4 font-medium">Nama</th>
                            <th className="text-left py-2 pr-4 font-medium">Email</th>
                            <th className="text-left py-2 pr-4 font-medium">Status</th>
                            <th className="text-left py-2 pr-4 font-medium">Bergabung</th>
                            <th className="text-right py-2 font-medium">On/Off</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {adminsList.map((admin) => (
                            <tr key={admin.id} className="hover:bg-muted/30 transition-colors" data-testid={`row-admin-${admin.id}`}>
                              <td className="py-3 pr-4 font-medium">
                                {[admin.firstName, admin.lastName].filter(Boolean).join(" ") || "—"}
                              </td>
                              <td className="py-3 pr-4 text-muted-foreground text-xs">{admin.email || "—"}</td>
                              <td className="py-3 pr-4">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${admin.isActive !== false ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"}`}>
                                  {admin.isActive !== false ? "Aktif" : "Nonaktif"}
                                </span>
                              </td>
                              <td className="py-3 pr-4 text-muted-foreground text-xs">{formatDate(admin.createdAt)}</td>
                              <td className="py-3 text-right">
                                <Button
                                  variant={admin.isActive !== false ? "outline" : "default"}
                                  size="sm"
                                  className={`gap-1 text-xs ${admin.isActive !== false ? "border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" : "bg-green-600 hover:bg-green-700 text-white"}`}
                                  onClick={() => toggleAdminMutation.mutate(admin.id)}
                                  disabled={toggleAdminMutation.isPending}
                                  data-testid={`button-toggle-admin-${admin.id}`}
                                >
                                  {admin.isActive !== false ? (
                                    <><ToggleRight className="h-3.5 w-3.5" /> Nonaktifkan</>
                                  ) : (
                                    <><ToggleLeft className="h-3.5 w-3.5" /> Aktifkan</>
                                  )}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ========== USERS TAB ========== */}
          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Manajemen Pengguna</CardTitle>
                    {!isSuperAdmin && (
                      <p className="text-xs text-muted-foreground mt-1">Aktifkan/nonaktifkan pengguna berdasarkan status pembayaran atau pelanggaran.</p>
                    )}
                  </div>
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] })}
                    data-testid="button-refresh-users"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : usersList.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Belum ada pengguna terdaftar.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left py-2 pr-4 font-medium">Pengguna</th>
                          <th className="text-left py-2 pr-4 font-medium">Role</th>
                          <th className="text-left py-2 pr-4 font-medium">Langganan</th>
                          <th className="text-left py-2 pr-4 font-medium">Status</th>
                          <th className="text-left py-2 pr-4 font-medium">Bergabung</th>
                          <th className="text-right py-2 font-medium">On/Off</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {usersList.map((user) => (
                          <tr key={user.id} className="hover:bg-muted/30 transition-colors" data-testid={`row-user-${user.id}`}>
                            <td className="py-3 pr-4">
                              <div>
                                <p className="font-medium">{[user.firstName, user.lastName].filter(Boolean).join(" ") || "—"}</p>
                                <p className="text-xs text-muted-foreground">{user.email || "—"}</p>
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              {isSuperAdmin && user.role !== "superadmin" ? (
                                <select
                                  value={user.role || "user"}
                                  onChange={(e) => setRoleMutation.mutate({ userId: user.id, role: e.target.value })}
                                  className="text-xs border rounded px-1.5 py-0.5 bg-background"
                                  data-testid={`select-role-${user.id}`}
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                              ) : (
                                roleBadge(user.role)
                              )}
                            </td>
                            <td className="py-3 pr-4">
                              {user.subscription ? (
                                <div>
                                  <p className="font-medium">{planLabel(user.subscription.plan)}</p>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    {statusBadge(user.subscription.status)}
                                    <span className="text-xs text-muted-foreground">
                                      s/d {formatDate(user.subscription.endDate)}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">Tidak berlangganan</span>
                              )}
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.isActive !== false ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"}`}>
                                {user.isActive !== false ? "Aktif" : "Nonaktif"}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground text-xs">{formatDate(user.createdAt)}</td>
                            <td className="py-3 text-right">
                              {user.role === "superadmin" ? (
                                <span className="text-xs text-muted-foreground italic">—</span>
                              ) : (
                                <Button
                                  variant={user.isActive !== false ? "outline" : "default"}
                                  size="sm"
                                  className={`gap-1 text-xs ${user.isActive !== false ? "border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" : "bg-green-600 hover:bg-green-700 text-white"}`}
                                  onClick={() => toggleUserMutation.mutate(user.id)}
                                  disabled={toggleUserMutation.isPending}
                                  data-testid={`button-toggle-user-${user.id}`}
                                >
                                  {user.isActive !== false ? (
                                    <><ToggleRight className="h-3.5 w-3.5" /> Nonaktifkan</>
                                  ) : (
                                    <><ToggleLeft className="h-3.5 w-3.5" /> Aktifkan</>
                                  )}
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========== SUBSCRIPTIONS TAB ========== */}
          <TabsContent value="subscriptions" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Data Langganan</CardTitle>
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/subscriptions"] })}
                    data-testid="button-refresh-subs"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {subsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />)}
                  </div>
                ) : subscriptions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Belum ada data langganan.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left py-2 pr-4 font-medium">Pengguna</th>
                          <th className="text-left py-2 pr-4 font-medium">Paket</th>
                          <th className="text-left py-2 pr-4 font-medium">Harga</th>
                          <th className="text-left py-2 pr-4 font-medium">Status</th>
                          <th className="text-left py-2 pr-4 font-medium">Mulai</th>
                          <th className="text-left py-2 pr-4 font-medium">Berakhir</th>
                          <th className="text-right py-2 font-medium">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {subscriptions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-muted/30 transition-colors" data-testid={`row-sub-${sub.id}`}>
                            <td className="py-3 pr-4">
                              <div>
                                <p className="font-medium">{[sub.user?.firstName, sub.user?.lastName].filter(Boolean).join(" ") || "—"}</p>
                                <p className="text-xs text-muted-foreground">{sub.user?.email || "—"}</p>
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <p className="font-medium">{planLabel(sub.plan)}</p>
                              <p className="text-xs text-muted-foreground">{sub.chatbotLimit} chatbot</p>
                            </td>
                            <td className="py-3 pr-4">
                              {sub.amount > 0 ? `Rp ${sub.amount.toLocaleString("id-ID")}` : "—"}
                            </td>
                            <td className="py-3 pr-4">{statusBadge(sub.status)}</td>
                            <td className="py-3 pr-4 text-muted-foreground text-xs">{formatDate(sub.startDate)}</td>
                            <td className="py-3 pr-4 text-muted-foreground text-xs">{formatDate(sub.endDate)}</td>
                            <td className="py-3 text-right">
                              <Button
                                variant="outline" size="sm" className="text-xs"
                                onClick={() => {
                                  setSubDialog({ open: true, sub });
                                  setNewStatus(sub.status);
                                  setNewEndDate(sub.endDate ? sub.endDate.slice(0, 10) : "");
                                }}
                                data-testid={`button-edit-sub-${sub.id}`}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========== TRIALS TAB ========== */}
          <TabsContent value="trials" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Permintaan Trial</CardTitle>
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/trial-requests"] })}
                    data-testid="button-refresh-trials"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {trialLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />)}
                  </div>
                ) : trialList.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Belum ada permintaan trial.</p>
                ) : (
                  <div className="space-y-3">
                    {trialList.map((req) => (
                      <div
                        key={req.id}
                        className="border rounded-lg p-4 hover:bg-muted/20 transition-colors"
                        data-testid={`card-trial-${req.id}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold">{req.name}</p>
                              {statusBadge(req.status)}
                              <span className="text-xs text-muted-foreground">{formatDate(req.createdAt)}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span>📱 {req.phone}</span>
                              <span>✉️ {req.email}</span>
                              {req.company && <span>🏢 {req.company}</span>}
                            </div>
                            {req.useCase && (
                              <p className="text-sm text-muted-foreground italic mt-1">"{req.useCase}"</p>
                            )}
                            {req.voucherCode && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">Kode voucher:</span>
                                <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded font-bold text-primary">
                                  {req.voucherCode}
                                </code>
                                <Button
                                  variant="ghost" size="icon" className="h-6 w-6"
                                  onClick={() => copyToClipboard(req.voucherCode!)}
                                  data-testid={`button-copy-voucher-${req.id}`}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                            {req.notes && (
                              <p className="text-xs text-muted-foreground mt-1">Catatan: {req.notes}</p>
                            )}
                          </div>

                          {req.status === "pending" && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                className="gap-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                                onClick={() => setApproveDialog({ open: true, request: req })}
                                data-testid={`button-approve-trial-${req.id}`}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Setujui
                              </Button>
                              <Button
                                size="sm" variant="outline"
                                className="gap-1 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
                                onClick={() => setRejectDialog({ open: true, request: req })}
                                data-testid={`button-reject-trial-${req.id}`}
                              >
                                <XCircle className="h-3.5 w-3.5" /> Tolak
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ========== APPROVE DIALOG ========== */}
      <Dialog open={approveDialog.open} onOpenChange={(o) => setApproveDialog({ open: o, request: approveDialog.request })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Setujui Permintaan Trial
            </DialogTitle>
          </DialogHeader>
          {approveDialog.request && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                <p><strong>Nama:</strong> {approveDialog.request.name}</p>
                <p><strong>HP/WA:</strong> {approveDialog.request.phone}</p>
                <p><strong>Email:</strong> {approveDialog.request.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Durasi Trial (hari)</label>
                <Input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  min="1" max="90"
                  data-testid="input-duration-days"
                />
                <p className="text-xs text-muted-foreground mt-1">Default: 14 hari. Voucher berlaku untuk 1 chatbot.</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Setelah disetujui, kode voucher akan digenerate otomatis. Salin dan kirimkan ke pengguna via WA/Email.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialog({ open: false, request: null })}>Batal</Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
              disabled={approveTrialMutation.isPending}
              onClick={() => approveDialog.request && approveTrialMutation.mutate({
                id: approveDialog.request.id,
                durationDays: parseInt(durationDays) || 14,
              })}
              data-testid="button-confirm-approve"
            >
              {approveTrialMutation.isPending ? "Memproses..." : "Setujui & Generate Voucher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== REJECT DIALOG ========== */}
      <Dialog open={rejectDialog.open} onOpenChange={(o) => setRejectDialog({ open: o, request: rejectDialog.request })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Tolak Permintaan Trial
            </DialogTitle>
          </DialogHeader>
          {rejectDialog.request && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p><strong>{rejectDialog.request.name}</strong> — {rejectDialog.request.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Alasan penolakan (opsional)</label>
                <Textarea
                  placeholder="Contoh: Informasi tidak lengkap, mohon hubungi kami kembali..."
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  rows={3}
                  data-testid="input-reject-notes"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectDialog({ open: false, request: null }); setRejectNotes(""); }}>Batal</Button>
            <Button
              variant="destructive" className="gap-2"
              disabled={rejectTrialMutation.isPending}
              onClick={() => rejectDialog.request && rejectTrialMutation.mutate({ id: rejectDialog.request.id, notes: rejectNotes })}
              data-testid="button-confirm-reject"
            >
              {rejectTrialMutation.isPending ? "Memproses..." : "Tolak Permintaan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== EDIT SUBSCRIPTION DIALOG ========== */}
      <Dialog open={subDialog.open} onOpenChange={(o) => setSubDialog({ open: o, sub: subDialog.sub })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Langganan</DialogTitle>
          </DialogHeader>
          {subDialog.sub && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p><strong>{subDialog.sub.user?.email || subDialog.sub.userId}</strong></p>
                <p className="text-muted-foreground">Paket: {planLabel(subDialog.sub.plan)}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 bg-background text-sm"
                  data-testid="select-sub-status"
                >
                  <option value="active">Aktif</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tanggal Berakhir</label>
                <Input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  data-testid="input-sub-end-date"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubDialog({ open: false, sub: null })}>Batal</Button>
            <Button
              disabled={updateSubMutation.isPending}
              onClick={() => subDialog.sub && updateSubMutation.mutate({ id: subDialog.sub.id, status: newStatus, endDate: newEndDate })}
              data-testid="button-save-sub"
            >
              {updateSubMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
