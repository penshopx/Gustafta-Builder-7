import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Bot, ShoppingCart, Check, Smartphone, Search,
  ChevronLeft, ChevronRight, Crown, Layers,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess?: (result: unknown) => void;
        onPending?: (result: unknown) => void;
        onError?: (result: unknown) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

const DEFAULT_PRICE = 299000;

const CATEGORY_LABELS: Record<string, string> = {
  engineering: "Teknik & Engineering",
  certification: "Sertifikasi & Kompetensi",
  compliance: "Kepatuhan & Regulasi",
  legal: "Hukum",
  property: "Properti",
  digitalization: "Digitalisasi",
  finance: "Keuangan",
  business: "Bisnis",
  construction: "Konstruksi",
  tender: "Pengadaan & Tender",
  operasional: "Operasional",
  services: "Layanan",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

interface AgentProduct {
  id: number;
  name: string;
  category: string;
  tagline: string;
  emoji: string;
  color: string;
  isOrchestrator: boolean;
  price: number;
  agentId: number;
}

interface CatalogResponse {
  items: AgentProduct[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface CategoryCount {
  category: string;
  count: number;
}

interface BuyFormData {
  name: string;
  email: string;
  phone: string;
}

const LIMIT = 24;

export default function Store() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState<AgentProduct | null>(null);
  const [buyForm, setBuyForm] = useState<BuyFormData>({ name: "", email: "", phone: "" });
  const [showBuyDialog, setShowBuyDialog] = useState(false);

  const { data: paymentConfig } = useQuery<{ clientKey: string; paymentConfigured: boolean; isSandbox: boolean }>({
    queryKey: ["/api/subscriptions/status"],
    queryFn: async () => {
      const res = await fetch("/api/subscriptions/status");
      return res.json();
    },
  });

  useEffect(() => {
    const clientKey = paymentConfig?.clientKey;
    if (!clientKey) return;
    if (document.querySelector('script[data-midtrans-snap]')) return;
    const script = document.createElement("script");
    script.src = paymentConfig?.isSandbox
      ? "https://app.sandbox.midtrans.com/snap/snap.js"
      : "https://app.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.setAttribute("data-midtrans-snap", "1");
    document.head.appendChild(script);
  }, [paymentConfig?.clientKey]);

  const catalogParams = new URLSearchParams({
    page: String(page),
    limit: String(LIMIT),
    ...(search ? { search } : {}),
    ...(selectedCategory ? { category: selectedCategory } : {}),
  });

  const { data: catalog, isLoading } = useQuery<CatalogResponse>({
    queryKey: ["/api/store/catalog", page, search, selectedCategory],
    queryFn: async () => {
      const res = await fetch(`/api/store/catalog?${catalogParams}`);
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery<CategoryCount[]>({
    queryKey: ["/api/store/catalog/categories"],
    queryFn: async () => {
      const res = await fetch("/api/store/catalog/categories");
      return res.json();
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: { agentId: number } & BuyFormData) => {
      return apiRequest("POST", "/api/store/order", data);
    },
    onSuccess: async (res: Response) => {
      const data = await res.json();
      const { token } = data;
      if (!token) throw new Error("Tidak ada token pembayaran");
      if (!window.snap) {
        toast({ title: "Error", description: "Payment gateway belum dimuat, coba refresh halaman.", variant: "destructive" });
        return;
      }
      window.snap.pay(token, {
        onSuccess: () => {
          setShowBuyDialog(false);
          toast({ title: "Pembayaran berhasil!", description: "Cek email Anda untuk link akses chatbot." });
        },
        onPending: () => {
          setShowBuyDialog(false);
          toast({ title: "Menunggu pembayaran", description: "Selesaikan pembayaran dan link akses akan dikirim via email." });
        },
        onError: () => {
          toast({ title: "Pembayaran gagal", description: "Silakan coba lagi.", variant: "destructive" });
        },
        onClose: () => {},
      });
    },
    onError: (err: Error) => {
      toast({ title: "Gagal membuat pesanan", description: err.message, variant: "destructive" });
    },
  });

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleBuy = (agent: AgentProduct) => {
    setSelectedAgent(agent);
    setBuyForm({ name: "", email: "", phone: "" });
    setShowBuyDialog(true);
  };

  const handleSubmitOrder = () => {
    if (!selectedAgent) return;
    if (!buyForm.name.trim() || !buyForm.email.trim()) {
      toast({ title: "Lengkapi data", description: "Nama dan email wajib diisi.", variant: "destructive" });
      return;
    }
    createOrderMutation.mutate({ agentId: selectedAgent.agentId, ...buyForm });
  };

  const items = catalog?.items || [];
  const total = catalog?.total || 0;
  const pages = catalog?.pages || 1;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-gray-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">Gustafta</span>
              <span className="ml-2 text-xs text-violet-400 font-medium">STORE</span>
            </div>
          </div>
          <a
            href="https://wa.me/6281287941900"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            data-testid="link-wa-header"
          >
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">081287941900</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-4 text-center border-b border-white/5">
        <Badge className="mb-3 bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/20">
          🏗️ {total > 0 ? `${total.toLocaleString("id-ID")}+ Chatbot AI Siap Pakai` : "Gustafta Store — Chatbot AI Konstruksi Indonesia"}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Beli Chatbot AI Siap Pakai
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto mb-6">
          Pilih chatbot yang Anda butuhkan. Bayar sekali, langsung bisa pakai — tanpa perlu registrasi platform.
        </p>
        <div className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari chatbot..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500"
              data-testid="input-search-store"
            />
          </div>
          <Button onClick={handleSearch} className="bg-violet-600 hover:bg-violet-700" data-testid="button-search">
            Cari
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar: Category Filter */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Kategori</p>
          <div className="space-y-1">
            <button
              onClick={() => handleCategoryChange("")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                selectedCategory === "" ? "bg-violet-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
              data-testid="filter-all"
            >
              <span>Semua</span>
              <span className="text-xs opacity-60">{total.toLocaleString("id-ID")}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => handleCategoryChange(cat.category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                  selectedCategory === cat.category ? "bg-violet-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                data-testid={`filter-cat-${cat.category}`}
              >
                <span className="truncate">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                <span className="text-xs opacity-60 ml-1 flex-shrink-0">{cat.count.toLocaleString("id-ID")}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile category pills */}
        <div className="lg:hidden w-full">
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => handleCategoryChange("")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === "" ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => handleCategoryChange(cat.category)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat.category ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
              >
                {CATEGORY_LABELS[cat.category] || cat.category} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {isLoading ? "Memuat..." : `${total.toLocaleString("id-ID")} chatbot ditemukan`}
              {selectedCategory ? ` · ${CATEGORY_LABELS[selectedCategory] || selectedCategory}` : ""}
              {search ? ` · "${search}"` : ""}
            </p>
            <p className="text-xs text-gray-600">Halaman {page} / {pages}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <div key={i} className="h-52 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Bot className="h-16 w-16 mx-auto mb-4 opacity-20" />
              {search || selectedCategory ? (
                <>
                  <p className="text-lg font-medium text-gray-400 mb-1">Tidak ada chatbot yang cocok</p>
                  <p className="text-sm">Coba kata kunci atau kategori lain</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-white/10 text-gray-400 hover:text-white"
                    onClick={() => { setSearch(""); setSearchInput(""); setSelectedCategory(""); setPage(1); }}
                  >
                    Reset Filter
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-gray-400 mb-1">Belum ada produk yang tersedia</p>
                  <p className="text-sm">Produk chatbot akan segera hadir. Hubungi kami untuk info lebih lanjut.</p>
                  <a
                    href="https://wa.me/6281287941900"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm transition-colors"
                  >
                    <Smartphone className="h-4 w-4" />
                    Hubungi via WhatsApp
                  </a>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((agent) => (
                <AgentCard key={agent.id} agent={agent} onBuy={handleBuy} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                  let p = i + 1;
                  if (pages > 5) {
                    if (page <= 3) p = i + 1;
                    else if (page >= pages - 2) p = pages - 4 + i;
                    else p = page - 2 + i;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${p === page ? "bg-violet-600 text-white" : "text-gray-400 hover:bg-white/10"}`}
                      data-testid={`button-page-${p}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
                data-testid="button-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-600 mt-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <a href="https://wa.me/6281287941900" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors" data-testid="link-wa-footer">
            <Smartphone className="h-3.5 w-3.5" />
            081287941900
          </a>
        </div>
        <p>© 2026 Gustafta. AI Platform Konstruksi Indonesia.</p>
      </footer>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="bg-gray-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base leading-snug">
              <span className="text-2xl flex-shrink-0">{selectedAgent?.emoji}</span>
              <span className="line-clamp-2">{selectedAgent?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              {selectedAgent?.tagline || "Chatbot AI siap pakai untuk industri konstruksi Indonesia."}
            </DialogDescription>
          </DialogHeader>

          {selectedAgent && (
            <div className="space-y-4 mt-1">
              <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                <span className="text-gray-300 text-sm">Total Pembayaran</span>
                <span className="text-xl font-bold text-violet-400">{formatPrice(selectedAgent.price)}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="buy-name" className="text-gray-300 text-sm">Nama Lengkap *</Label>
                  <Input
                    id="buy-name"
                    value={buyForm.name}
                    onChange={(e) => setBuyForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nama Anda"
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    data-testid="input-buy-name"
                  />
                </div>
                <div>
                  <Label htmlFor="buy-email" className="text-gray-300 text-sm">Email *</Label>
                  <Input
                    id="buy-email"
                    type="email"
                    value={buyForm.email}
                    onChange={(e) => setBuyForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="email@anda.com"
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    data-testid="input-buy-email"
                  />
                </div>
                <div>
                  <Label htmlFor="buy-phone" className="text-gray-300 text-sm">No. HP / WhatsApp</Label>
                  <Input
                    id="buy-phone"
                    value={buyForm.phone}
                    onChange={(e) => setBuyForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="08xxx"
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    data-testid="input-buy-phone"
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={createOrderMutation.isPending}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white h-12 text-base font-semibold"
                data-testid="button-confirm-purchase"
              >
                {createOrderMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Memproses...</>
                ) : (
                  <><ShoppingCart className="h-4 w-4 mr-2" /> Bayar {formatPrice(selectedAgent.price)}</>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Pembayaran aman via Midtrans. VA Bank, Kartu Kredit, GoPay, OVO, QRIS.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AgentCard({ agent, onBuy }: { agent: AgentProduct; onBuy: (a: AgentProduct) => void }) {
  const categoryLabel = CATEGORY_LABELS[agent.category] || agent.category;

  return (
    <Card
      className="bg-white/5 border-white/10 hover:border-violet-500/40 hover:bg-white/[0.07] transition-all group"
      data-testid={`card-agent-${agent.id}`}
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${agent.color}18`, border: `1px solid ${agent.color}35` }}
          >
            {agent.emoji}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className="bg-white/8 text-gray-400 border-0 text-xs px-2 py-0">{categoryLabel}</Badge>
            {agent.isOrchestrator && (
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-xs px-2 py-0 flex items-center gap-1">
                <Layers className="h-2.5 w-2.5" />Multi-Agent
              </Badge>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-white text-sm leading-snug mb-1 group-hover:text-violet-300 transition-colors line-clamp-2">
          {agent.name}
        </h3>
        {agent.tagline && (
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{agent.tagline}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-bold text-white text-base">{formatPrice(agent.price)}</span>
          <Button
            size="sm"
            onClick={() => onBuy(agent)}
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-8 px-3 flex-shrink-0"
            data-testid={`button-buy-${agent.id}`}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            Beli
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
