import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, ShoppingCart, MessageSquare, Check, Phone, Smartphone, Star, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { StoreProduct } from "@shared/schema";

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

interface BuyFormData {
  name: string;
  email: string;
  phone: string;
}

export default function Store() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [buyForm, setBuyForm] = useState<BuyFormData>({ name: "", email: "", phone: "" });
  const [showBuyDialog, setShowBuyDialog] = useState(false);

  const { data: products = [], isLoading } = useQuery<StoreProduct[]>({
    queryKey: ["/api/store/products"],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: { productId: number } & BuyFormData) => {
      return apiRequest("POST", "/api/store/order", data);
    },
    onSuccess: async (res: Response) => {
      const data = await res.json();
      const { token } = data;
      if (!token) throw new Error("Tidak ada token pembayaran");
      if (!window.snap) {
        toast({ title: "Error", description: "Midtrans Snap belum dimuat", variant: "destructive" });
        return;
      }
      window.snap.pay(token, {
        onSuccess: () => {
          setShowBuyDialog(false);
          toast({ title: "Pembayaran berhasil!", description: "Cek email Anda untuk link akses chatbot." });
        },
        onPending: () => {
          setShowBuyDialog(false);
          toast({ title: "Menunggu pembayaran", description: "Selesaikan pembayaran Anda dan link akses akan dikirim via email." });
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

  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "Semua" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleBuy = (product: StoreProduct) => {
    setSelectedProduct(product);
    setBuyForm({ name: "", email: "", phone: "" });
    setShowBuyDialog(true);
  };

  const handleSubmitOrder = () => {
    if (!selectedProduct) return;
    if (!buyForm.name.trim() || !buyForm.email.trim()) {
      toast({ title: "Lengkapi data", description: "Nama dan email wajib diisi.", variant: "destructive" });
      return;
    }
    createOrderMutation.mutate({ productId: selectedProduct.id, ...buyForm });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Midtrans Snap Script */}
      <script
        type="text/javascript"
        src="https://app.midtrans.com/snap/snap.js"
        data-client-key={import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "Mid-client-Mlo7Bzvz0l30Xhzt"}
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-gray-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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
      <section className="py-16 px-4 text-center">
        <Badge className="mb-4 bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/20">
          🏗️ Khusus Industri Konstruksi Indonesia
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Beli Chatbot AI Siap Pakai
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg mb-8">
          Pilih chatbot AI spesialisasi konstruksi yang Anda butuhkan. Beli sekali, langsung bisa dipakai — tanpa perlu registrasi platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center max-w-lg mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari chatbot..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500"
              data-testid="input-search-store"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              data-testid={`filter-category-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">Belum ada produk tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onBuy={handleBuy} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center gap-4 mb-2">
          <a href="https://wa.me/6281287941900" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors" data-testid="link-wa-footer-store">
            <Phone className="h-3.5 w-3.5" />
            081287941900
          </a>
        </div>
        <p>© 2026 Gustafta. AI Platform Konstruksi Indonesia.</p>
      </footer>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="bg-gray-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedProduct?.emoji}</span>
              Beli {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Lengkapi data berikut untuk melanjutkan pembayaran. Link akses chatbot akan dikirim ke email Anda.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 mt-2">
              <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                <span className="text-gray-300">Total Pembayaran</span>
                <span className="text-xl font-bold text-violet-400">{formatPrice(selectedProduct.price)}</span>
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
                  <><ShoppingCart className="h-4 w-4 mr-2" /> Bayar Sekarang</>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Pembayaran aman via Midtrans. Mendukung transfer bank, kartu kredit, e-wallet, dan QRIS.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductCard({ product, onBuy }: { product: StoreProduct; onBuy: (p: StoreProduct) => void }) {
  const features = (product.features as string[]) || [];

  return (
    <Card
      className="bg-white/5 border-white/10 hover:border-violet-500/40 hover:bg-white/8 transition-all group overflow-hidden"
      data-testid={`card-store-product-${product.id}`}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `${product.color}20`, border: `1px solid ${product.color}40` }}
          >
            {product.emoji}
          </div>
          <Badge className="bg-white/10 text-gray-300 border-0 text-xs">{product.category}</Badge>
        </div>

        <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-violet-300 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{product.description}</p>

        {features.length > 0 && (
          <ul className="space-y-1.5 mb-5">
            {features.slice(0, 4).map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                <Check className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-white">{formatPrice(product.price)}</span>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs text-gray-400">Akses Seumur Hidup</span>
            </div>
          </div>
          <Button
            onClick={() => onBuy(product)}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            data-testid={`button-buy-product-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Beli Sekarang
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
