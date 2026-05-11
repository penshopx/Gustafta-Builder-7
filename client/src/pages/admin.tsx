import { useState, useEffect } from "react";
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
  UserCheck, AlertCircle, RefreshCw, Crown, UserCog, Wrench, Scale, Database,
  ShoppingBag, Plus, ExternalLink, Package, Trash2, Pencil, MessageCircle, Loader2
} from "lucide-react";

// ---- Types ----
interface AdminMeData {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: string;
  user: any;
}

interface ModulSub {
  id: number;
  bigIdeaId: number | null;
  bigIdeaName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  plan: string;
  status: string;
  amount: number;
  accessToken: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
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

// ---- Welcome WA Template Generator ----
const PLAN_LABEL_WA: Record<string, string> = {
  starter: "Starter", profesional: "Profesional", bisnis: "Bisnis", enterprise: "Enterprise",
  monthly: "1 Bulan", quarterly: "3 Bulan", semiannual: "6 Bulan", annual: "12 Bulan", free: "Free",
};

function makeWelcomeWA(sub: AdminSubscription, appUrl: string): string {
  const name = [sub.user?.firstName, sub.user?.lastName].filter(Boolean).join(" ") || "Kak";
  const plan = PLAN_LABEL_WA[sub.plan] ?? sub.plan;
  return `Halo ${name}! 👋

Selamat, paket Gustafta *${plan}* Anda sudah *AKTIF* 🎉

Silakan langsung mulai:
1. Buka: ${appUrl}
2. Klik "Masuk" — gunakan akun yang sudah Anda daftarkan
3. Pilih "Dashboard" → chatbot siap dikonfigurasi

✅ Yang bisa Anda gunakan sekarang:
• Buat & konfigurasi AI Chatbot
• Akses 131 Hub Orchestrator siap pakai
• Upload knowledge base (7 tipe dokumen)
• Embed chatbot di website Anda
• 45 Mini Apps produktivitas

📖 Panduan langkah-demi-langkah: ${appUrl}/welcome

Butuh bantuan? Hubungi kami:
📱 WA: 081287941900 / 082299417818

Selamat berkreasi! 🚀
— Tim Gustafta`;
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
  const [waDialog, setWaDialog] = useState<{ open: boolean; sub: AdminSubscription | null }>({ open: false, sub: null });
  const [appUrl, setAppUrl] = useState<string>(window.location.origin);

  useEffect(() => {
    fetch("/api/config/app-url")
      .then((r) => r.json())
      .then((d) => { if (d.appUrl) setAppUrl(d.appUrl); })
      .catch(() => {});
  }, []);

  // Store tab state
  const [manualForm, setManualForm] = useState({ name: "", email: "", phone: "", agentId: "" });
  const [manualResult, setManualResult] = useState<{ accessUrl: string; agentName: string } | null>(null);
  const [productForm, setProductForm] = useState({ name: "", description: "", category: "Konstruksi", price: "", agentId: "", emoji: "🤖" });
  const [showProductForm, setShowProductForm] = useState(false);

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

  interface StoreOrder {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amount: number;
    status: string;
    midtransOrderId: string;
    accessToken: string;
    createdAt: string;
  }

  interface StoreProduct {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    agentId: number | null;
    emoji: string;
    isActive: boolean;
    sortOrder: number;
  }

  const { data: modulSubs = [], isLoading: modulSubsLoading, refetch: refetchModulSubs } = useQuery<ModulSub[]>({
    queryKey: ["/api/admin/modul-subs"],
    enabled: isAdmin && activeTab === "modul-subs",
  });

  const [modulSubDialog, setModulSubDialog] = useState<{ open: boolean; sub: ModulSub | null }>({ open: false, sub: null });
  const [modulSubStatus, setModulSubStatus] = useState("active");
  const [modulSubDays, setModulSubDays] = useState("30");
  const [modulWaDialog, setModulWaDialog] = useState<{ open: boolean; sub: ModulSub | null }>({ open: false, sub: null });

  const { data: storeOrders = [], isLoading: storeOrdersLoading, refetch: refetchOrders } = useQuery<StoreOrder[]>({
    queryKey: ["/api/store/admin/orders"],
    queryFn: async () => { const res = await fetch("/api/store/admin/orders"); return res.json(); },
    enabled: isAdmin && activeTab === "store",
  });

  const { data: storeProducts = [], isLoading: storeProductsLoading, refetch: refetchProducts } = useQuery<StoreProduct[]>({
    queryKey: ["/api/store/admin/products"],
    queryFn: async () => { const res = await fetch("/api/store/admin/products"); return res.json(); },
    enabled: isAdmin && activeTab === "store",
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
      const activatedSub = subDialog.sub;
      const activatedStatus = newStatus;
      setSubDialog({ open: false, sub: null });
      toast({ title: "Langganan diperbarui." });
      // Auto-show WA welcome dialog when admin just activated a subscription
      if (activatedStatus === "active" && activatedSub) {
        setTimeout(() => setWaDialog({ open: true, sub: activatedSub }), 300);
      }
    },
    onError: () => toast({ title: "Gagal memperbarui langganan.", variant: "destructive" }),
  });

  const createManualOrderMutation = useMutation({
    mutationFn: async (data: { agentId: number; name: string; email: string; phone: string }) => {
      const res = await apiRequest("POST", "/api/store/order/manual", data);
      return res.json();
    },
    onSuccess: (data: any) => {
      setManualResult({ accessUrl: data.accessUrl, agentName: data.agentName });
      setManualForm({ name: "", email: "", phone: "", agentId: "" });
      refetchOrders();
      toast({ title: "Link akses berhasil dibuat!", description: `Order manual untuk ${data.agentName} siap dikirim.` });
    },
    onError: (err: any) => toast({ title: "Gagal buat order manual", description: err.message, variant: "destructive" }),
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: object) => {
      const res = await apiRequest("POST", "/api/store/admin/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/store/catalog"] });
      setProductForm({ name: "", description: "", category: "Konstruksi", price: "", agentId: "", emoji: "🤖" });
      setShowProductForm(false);
      toast({ title: "Produk berhasil ditambahkan!" });
    },
    onError: (err: any) => toast({ title: "Gagal tambah produk", description: err.message, variant: "destructive" }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/store/admin/products/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/store/catalog"] });
      toast({ title: "Produk dihapus." });
    },
    onError: () => toast({ title: "Gagal hapus produk.", variant: "destructive" }),
  });

  const updateModulSubMutation = useMutation({
    mutationFn: ({ id, status, durationDays }: { id: number; status: string; durationDays: string }) =>
      apiRequest("PATCH", `/api/admin/modul-subs/${id}`, { status, durationDays: parseInt(durationDays) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/modul-subs"] });
      const activatedSub = modulSubDialog.sub;
      const activatedStatus = modulSubStatus;
      setModulSubDialog({ open: false, sub: null });
      toast({ title: "Subscriber modul diperbarui." });
      if (activatedStatus === "active" && activatedSub) {
        setTimeout(() => setModulWaDialog({ open: true, sub: activatedSub }), 300);
      }
    },
    onError: () => toast({ title: "Gagal memperbarui subscriber.", variant: "destructive" }),
  });

  const toggleProductMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      apiRequest("PATCH", `/api/store/admin/products/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/store/catalog"] });
      toast({ title: "Status produk diperbarui." });
    },
    onError: () => toast({ title: "Gagal ubah status produk.", variant: "destructive" }),
  });

  const seedLexComMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/seed-lexcom", {}),
    onSuccess: async (res: any) => {
      const data = await res.json().catch(() => ({}));
      if (data.skipped) {
        toast({ title: "LexCom sudah ada", description: "Series LexCom sudah tersedia di workspace Anda." });
      } else {
        toast({ title: "LexCom berhasil di-seed!", description: data.message });
        queryClient.invalidateQueries({ queryKey: ["/api/series"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      }
    },
    onError: () => toast({ title: "Gagal seed LexCom", description: "Coba lagi atau cek log server.", variant: "destructive" }),
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

  const tabCount = isSuperAdmin ? 6 : 5;

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
            <TabsTrigger value="modul-subs" className="gap-1.5 text-xs" data-testid="tab-modul-subs">
              <Package className="h-3.5 w-3.5" /> Modul
            </TabsTrigger>
            <TabsTrigger value="store" className="gap-1.5 text-xs" data-testid="tab-store">
              <ShoppingBag className="h-3.5 w-3.5" /> Store
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-1.5 text-xs" data-testid="tab-tools">
              <Wrench className="h-3.5 w-3.5" /> Tools
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
                              <div className="flex items-center justify-end gap-1.5">
                                {sub.status === "active" && (
                                  <Button
                                    variant="outline" size="sm" className="text-xs text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30"
                                    onClick={() => setWaDialog({ open: true, sub })}
                                    data-testid={`button-wa-sub-${sub.id}`}
                                    title="Kirim Welcome WA"
                                  >
                                    <MessageCircle className="h-3 w-3 mr-1" /> WA
                                  </Button>
                                )}
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
                              </div>
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

          {/* ========== MODUL SUBSCRIBERS TAB ========== */}
          <TabsContent value="modul-subs" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" /> Subscriber Paket Modul
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Kelola pelanggan yang berlangganan Paket Series/Modul
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => refetchModulSubs()} data-testid="button-refresh-modul-subs">
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {modulSubsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : modulSubs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Belum ada subscriber modul.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-xs text-muted-foreground">
                          <th className="text-left py-2 pr-3 font-medium">Nama / Email</th>
                          <th className="text-left py-2 pr-3 font-medium">Modul</th>
                          <th className="text-left py-2 pr-3 font-medium">Paket</th>
                          <th className="text-left py-2 pr-3 font-medium">Status</th>
                          <th className="text-left py-2 pr-3 font-medium">Berakhir</th>
                          <th className="text-left py-2 font-medium">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modulSubs.map(sub => (
                          <tr key={sub.id} className="border-b last:border-0 hover:bg-muted/30" data-testid={`row-modul-sub-${sub.id}`}>
                            <td className="py-2.5 pr-3">
                              <p className="font-medium truncate max-w-[140px]">{sub.customerName}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[140px]">{sub.customerEmail}</p>
                              {sub.customerPhone && (
                                <p className="text-xs text-muted-foreground">{sub.customerPhone}</p>
                              )}
                            </td>
                            <td className="py-2.5 pr-3">
                              <p className="text-xs font-medium truncate max-w-[120px]">{sub.bigIdeaName}</p>
                              {sub.bigIdeaId && (
                                <a
                                  href={`/modul/${sub.bigIdeaId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="h-2.5 w-2.5" /> Buka
                                </a>
                              )}
                            </td>
                            <td className="py-2.5 pr-3">
                              <span className="text-xs capitalize">{sub.plan}</span>
                              {sub.amount > 0 && (
                                <p className="text-xs text-muted-foreground">Rp {sub.amount.toLocaleString("id-ID")}</p>
                              )}
                            </td>
                            <td className="py-2.5 pr-3">{statusBadge(sub.status)}</td>
                            <td className="py-2.5 pr-3 text-xs text-muted-foreground">{formatDate(sub.endDate)}</td>
                            <td className="py-2.5">
                              <div className="flex gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs px-2"
                                  onClick={() => {
                                    setModulSubDialog({ open: true, sub });
                                    setModulSubStatus(sub.status);
                                    setModulSubDays("30");
                                  }}
                                  data-testid={`button-edit-modul-sub-${sub.id}`}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                {sub.status === "active" && sub.bigIdeaId && (
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs px-2 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => setModulWaDialog({ open: true, sub })}
                                    data-testid={`button-wa-modul-sub-${sub.id}`}
                                    title="Kirim link akses via WA"
                                  >
                                    WA
                                  </Button>
                                )}
                              </div>
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

          {/* ========== STORE TAB ========== */}
          <TabsContent value="store" className="mt-4">
            <div className="space-y-4">

              {/* ── Kelola Produk ── */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-violet-500" />
                      <CardTitle className="text-base">Kelola Produk Store</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => refetchProducts()} data-testid="button-refresh-products">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-1"
                        onClick={() => setShowProductForm(!showProductForm)}
                        data-testid="button-toggle-product-form">
                        <Plus className="h-4 w-4" /> {showProductForm ? "Tutup Form" : "Tambah Produk"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Form tambah produk */}
                  {showProductForm && (
                    <div className="border border-violet-500/30 rounded-lg p-4 bg-violet-500/5 space-y-3">
                      <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide">Produk Baru</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium mb-1 block text-muted-foreground">Nama Produk *</label>
                          <Input value={productForm.name} onChange={(e) => setProductForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="mis. Tender Readiness Checker" data-testid="input-product-name" />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block text-muted-foreground">Harga (IDR) *</label>
                          <Input type="number" value={productForm.price} onChange={(e) => setProductForm(f => ({ ...f, price: e.target.value }))}
                            placeholder="149000" data-testid="input-product-price" />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block text-muted-foreground">Kategori</label>
                          <Input value={productForm.category} onChange={(e) => setProductForm(f => ({ ...f, category: e.target.value }))}
                            placeholder="Konstruksi" data-testid="input-product-category" />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block text-muted-foreground">Agent ID (opsional)</label>
                          <Input type="number" value={productForm.agentId} onChange={(e) => setProductForm(f => ({ ...f, agentId: e.target.value }))}
                            placeholder="mis. 24" data-testid="input-product-agent-id" />
                          <p className="text-xs text-muted-foreground mt-1">ID chatbot yang dibeli user saat checkout produk ini</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block text-muted-foreground">Emoji</label>
                          <Input value={productForm.emoji} onChange={(e) => setProductForm(f => ({ ...f, emoji: e.target.value }))}
                            placeholder="🤖" data-testid="input-product-emoji" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium mb-1 block text-muted-foreground">Deskripsi</label>
                          <Textarea value={productForm.description} onChange={(e) => setProductForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Deskripsi singkat produk..." rows={2} data-testid="input-product-description" />
                        </div>
                      </div>
                      <Button
                        className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
                        disabled={createProductMutation.isPending || !productForm.name || !productForm.price}
                        onClick={() => createProductMutation.mutate({
                          name: productForm.name,
                          description: productForm.description,
                          category: productForm.category,
                          price: Number(productForm.price),
                          agentId: productForm.agentId ? Number(productForm.agentId) : null,
                          emoji: productForm.emoji || "🤖",
                          isActive: true,
                        })}
                        data-testid="button-save-product">
                        {createProductMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : <><Plus className="h-4 w-4" /> Simpan Produk</>}
                      </Button>
                    </div>
                  )}

                  {/* Daftar produk */}
                  {storeProductsLoading ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">Memuat produk...</div>
                  ) : storeProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p>Belum ada produk. Klik <strong>Tambah Produk</strong> untuk mulai.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {storeProducts.map((p) => (
                        <div key={p.id} className="border rounded-lg p-3 flex items-center justify-between gap-3 flex-wrap"
                          data-testid={`row-product-${p.id}`}>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl flex-shrink-0">{p.emoji}</span>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.category} · Rp {p.price.toLocaleString("id-ID")}
                                {p.agentId ? ` · Agent #${p.agentId}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => toggleProductMutation.mutate({ id: p.id, isActive: !p.isActive })}
                              className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${p.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-muted text-muted-foreground"}`}
                              data-testid={`button-toggle-product-${p.id}`}>
                              {p.isActive ? "Aktif" : "Nonaktif"}
                            </button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => { if (confirm(`Hapus produk "${p.name}"?`)) deleteProductMutation.mutate(p.id); }}
                              data-testid={`button-delete-product-${p.id}`}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Manual Order Form */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-violet-500" />
                    <CardTitle className="text-base">Buat Order Manual</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Untuk pembeli yang sudah bayar via transfer / WA. Masukkan data pembeli dan ID chatbot, sistem akan generate link akses yang bisa langsung dikirim ke pembeli.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {manualResult && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-semibold text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Link akses berhasil dibuat — {manualResult.agentName}
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-white dark:bg-black/30 border rounded px-2 py-1.5 flex-1 break-all">{manualResult.accessUrl}</code>
                        <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(manualResult.accessUrl); toast({ title: "Link disalin!" }); }} data-testid="button-copy-access-url">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <a href={manualResult.accessUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" data-testid="button-open-access-url">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground">Kirim link ini ke pembeli via WhatsApp atau email.</p>
                      <Button size="sm" variant="ghost" onClick={() => setManualResult(null)}>Buat order baru</Button>
                    </div>
                  )}

                  {!manualResult && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1 block text-muted-foreground">Nama Pembeli *</label>
                        <Input value={manualForm.name} onChange={(e) => setManualForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama lengkap" data-testid="input-manual-name" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block text-muted-foreground">Email *</label>
                        <Input type="email" value={manualForm.email} onChange={(e) => setManualForm(f => ({ ...f, email: e.target.value }))} placeholder="email@pembeli.com" data-testid="input-manual-email" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block text-muted-foreground">No. WA / HP</label>
                        <Input value={manualForm.phone} onChange={(e) => setManualForm(f => ({ ...f, phone: e.target.value }))} placeholder="08xxx" data-testid="input-manual-phone" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block text-muted-foreground">ID Chatbot (Agent ID) *</label>
                        <Input type="number" value={manualForm.agentId} onChange={(e) => setManualForm(f => ({ ...f, agentId: e.target.value }))} placeholder="mis. 1281" data-testid="input-manual-agent-id" />
                        <p className="text-xs text-muted-foreground mt-1">Lihat ID di halaman agent di dashboard.</p>
                      </div>
                    </div>
                  )}

                  {!manualResult && (
                    <Button
                      className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
                      disabled={createManualOrderMutation.isPending || !manualForm.name || !manualForm.email || !manualForm.agentId}
                      onClick={() => createManualOrderMutation.mutate({ agentId: Number(manualForm.agentId), name: manualForm.name, email: manualForm.email, phone: manualForm.phone })}
                      data-testid="button-create-manual-order"
                    >
                      {createManualOrderMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</> : <><Plus className="h-4 w-4" /> Generate Link Akses</>}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Orders List */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <CardTitle className="text-base">Semua Order Chatbot</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => refetchOrders()} data-testid="button-refresh-orders">
                      <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {storeOrdersLoading ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">Memuat data...</div>
                  ) : storeOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">Belum ada order masuk.</div>
                  ) : (
                    <div className="space-y-2">
                      {storeOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-3 flex items-center justify-between gap-3 flex-wrap" data-testid={`row-order-${order.id}`}>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground truncate">{order.customerEmail} · {order.customerPhone || "—"}</p>
                            <p className="text-xs text-muted-foreground">{order.midtransOrderId}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.status === "paid" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : order.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" : "bg-muted text-muted-foreground"}`}>
                              {order.status === "paid" ? "Lunas" : order.status === "pending" ? "Pending" : order.status}
                            </span>
                            <Button size="sm" variant="outline" className="h-7 px-2 gap-1 text-xs"
                              onClick={() => { const url = `${window.location.origin}/store/access/${order.accessToken}`; navigator.clipboard.writeText(url); toast({ title: "Link akses disalin!" }); }}
                              data-testid={`button-copy-order-${order.id}`}>
                              <Copy className="h-3 w-3" /> Link
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ========== TOOLS TAB ========== */}
          <TabsContent value="tools" className="mt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-violet-600" />
                    <CardTitle className="text-base">LexCom — AI Hukum Indonesia</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seed Series LexCom ke workspace Anda — 1 Orchestrator (Lex) + 17 Agen Spesialis Hukum, siap dipublikasikan dan dimonetisasi.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-lg border bg-muted/40 p-3">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Structure</div>
                      <ul className="text-sm space-y-1 text-foreground/80">
                        <li>• 1 Series "LexCom"</li>
                        <li>• 3 BigIdeas (domain grup)</li>
                        <li>• 13 Toolboxes (Hub + 12 Spesialis)</li>
                        <li>• 13 Agents (Lex + 12 Spesialis)</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border bg-muted/40 p-3">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">12 Spesialis</div>
                      <ul className="text-sm space-y-0.5 text-foreground/80">
                        <li>🚨 Pidana · ⚖️ Perdata · 🏛️ Litigasi</li>
                        <li>🏢 Korporasi · 👷 Tenaga Kerja</li>
                        <li>🏠 Pertanahan · 💰 Pajak · 💼 Kepailitan</li>
                        <li>📚 Yurisprudensi · ✍️ Drafter</li>
                        <li>🌐 MultiClaw · 💻 OpenClaw</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border bg-muted/40 p-3">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Monetisasi</div>
                      <ul className="text-sm space-y-1 text-foreground/80">
                        <li>✅ Hub (Lex): gratis/publik</li>
                        <li>🔒 12 Spesialis: butuh login</li>
                        <li>💳 PDF Export: premium</li>
                        <li>📄 Legal Opinion: premium</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={() => seedLexComMutation.mutate()}
                      disabled={seedLexComMutation.isPending}
                      className="gap-2 bg-violet-600 hover:bg-violet-700"
                      data-testid="button-seed-lexcom"
                    >
                      <Database className="h-4 w-4" />
                      {seedLexComMutation.isPending ? "Sedang seeding LexCom..." : "Seed LexCom ke Workspace"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Idempotent — aman dijalankan ulang, tidak duplikat jika Series sudah ada.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
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
              {newStatus === "active" && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-md px-3 py-2">
                  <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                  Setelah simpan, template pesan WhatsApp akan otomatis muncul untuk dikirim ke pelanggan.
                </p>
              )}
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

      {/* ========== MODUL SUB EDIT DIALOG ========== */}
      <Dialog open={modulSubDialog.open} onOpenChange={(o) => setModulSubDialog({ open: o, sub: modulSubDialog.sub })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Subscriber Modul</DialogTitle>
          </DialogHeader>
          {modulSubDialog.sub && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium">{modulSubDialog.sub.customerName}</p>
                <p className="text-xs text-muted-foreground">{modulSubDialog.sub.customerEmail}</p>
                <p className="text-xs text-muted-foreground">Modul: {modulSubDialog.sub.bigIdeaName}</p>
                <p className="text-xs text-muted-foreground">Paket: {modulSubDialog.sub.plan}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Status</label>
                <select
                  value={modulSubStatus}
                  onChange={(e) => setModulSubStatus(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 bg-background text-sm"
                  data-testid="select-modul-sub-status"
                >
                  <option value="active">Aktif</option>
                  <option value="pending">Pending (belum bayar)</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
              {modulSubStatus === "active" && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Durasi aktif (hari)</label>
                  <Input
                    type="number"
                    min="1"
                    value={modulSubDays}
                    onChange={(e) => setModulSubDays(e.target.value)}
                    placeholder="30"
                    data-testid="input-modul-sub-days"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Dihitung dari hari ini. Kosongkan untuk 30 hari.</p>
                </div>
              )}
              {modulSubStatus === "active" && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-md px-3 py-2">
                  <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                  Setelah simpan, template WA berisi link akses akan otomatis muncul.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModulSubDialog({ open: false, sub: null })}>Batal</Button>
            <Button
              disabled={updateModulSubMutation.isPending}
              onClick={() => modulSubDialog.sub && updateModulSubMutation.mutate({
                id: modulSubDialog.sub.id,
                status: modulSubStatus,
                durationDays: modulSubDays || "30",
              })}
              data-testid="button-save-modul-sub"
            >
              {updateModulSubMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== MODUL WA DIALOG ========== */}
      <Dialog open={modulWaDialog.open} onOpenChange={(o) => setModulWaDialog({ open: o, sub: modulWaDialog.sub })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              Kirim Link Akses Modul via WA
            </DialogTitle>
          </DialogHeader>
          {modulWaDialog.sub && (() => {
            const sub = modulWaDialog.sub!;
            const accessLink = `${appUrl}/modul/${sub.bigIdeaId}?email=${encodeURIComponent(sub.customerEmail)}`;
            const planMap: Record<string, string> = { trial: "Trial", monthly: "Bulanan", yearly: "Tahunan", lifetime: "Seumur Hidup" };
            const msg = `Halo ${sub.customerName}! 👋

Akses Paket Modul *${sub.bigIdeaName}* Anda sudah *AKTIF* 🎉

Klik link di bawah untuk langsung masuk:
${accessLink}

Paket: *${planMap[sub.plan] ?? sub.plan}*${sub.endDate ? `\nAktif hingga: ${new Date(sub.endDate).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}` : ""}

💡 Bookmark link di atas agar mudah dibuka kapan saja — bahkan dari HP berbeda sekalipun!

Butuh bantuan? Hubungi kami:
📱 WA: 081287941900 / 082299417818

Selamat menggunakan! 🚀
— Tim Gustafta`;
            const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
            return (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <p className="font-medium">{sub.customerName}</p>
                  <p className="text-xs text-muted-foreground">{sub.customerEmail}</p>
                  <p className="text-xs text-muted-foreground">Modul: {sub.bigIdeaName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Link Akses</p>
                  <div className="flex gap-2">
                    <Input value={accessLink} readOnly className="text-xs font-mono" data-testid="input-modul-access-link" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { navigator.clipboard.writeText(accessLink); toast({ title: "Link disalin!" }); }}
                      data-testid="button-copy-modul-link"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Preview Pesan WA</p>
                  <div className="bg-[#dcf8c6] dark:bg-green-900/30 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap text-foreground leading-relaxed max-h-56 overflow-y-auto border border-green-200 dark:border-green-800">
                    {msg}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => { navigator.clipboard.writeText(msg); toast({ title: "Pesan disalin!" }); }}
                    data-testid="button-copy-modul-wa-msg"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Salin Teks
                  </Button>
                  <Button
                    className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.open(waUrl, "_blank")}
                    data-testid="button-open-modul-wa"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Buka WA
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Link berisi email subscriber — mereka langsung masuk tanpa perlu input email ulang.
                </p>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModulWaDialog({ open: false, sub: null })}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== WELCOME WA DIALOG ========== */}
      <Dialog open={waDialog.open} onOpenChange={(o) => setWaDialog({ open: o, sub: waDialog.sub })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              Kirim Welcome WhatsApp
            </DialogTitle>
          </DialogHeader>
          {waDialog.sub && (() => {
            const msg = makeWelcomeWA(waDialog.sub, appUrl);
            const phone = waDialog.sub.user?.email ?? "";
            const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
            return (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <p className="font-medium">{[waDialog.sub.user?.firstName, waDialog.sub.user?.lastName].filter(Boolean).join(" ") || "—"}</p>
                  <p className="text-xs text-muted-foreground">{phone}</p>
                  <p className="text-xs text-muted-foreground">Paket: {PLAN_LABEL_WA[waDialog.sub.plan] ?? waDialog.sub.plan}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Preview Pesan WA</p>
                  <div className="bg-[#dcf8c6] dark:bg-green-900/30 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap text-foreground leading-relaxed max-h-64 overflow-y-auto border border-green-200 dark:border-green-800">
                    {msg}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(msg);
                      toast({ title: "Pesan disalin!", description: "Tempel di WhatsApp Web atau aplikasi WA." });
                    }}
                    data-testid="button-copy-wa-msg"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Salin Teks
                  </Button>
                  <Button
                    className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.open(waUrl, "_blank")}
                    data-testid="button-open-wa"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Buka WA
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  "Buka WA" akan membuka WhatsApp Web dengan pesan sudah terisi. Pilih kontak pelanggan, lalu kirim.
                </p>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setWaDialog({ open: false, sub: null })}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
