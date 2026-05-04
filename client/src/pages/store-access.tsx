import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, MessageSquare, Copy, CheckCircle2, ExternalLink, Smartphone } from "lucide-react";
import { useState } from "react";

interface StoreAccessData {
  order: {
    id: number;
    customerName: string;
    status: string;
    amount: number;
  };
  product: {
    id: number;
    name: string;
    emoji: string;
    color: string;
    description: string;
    agentId: number | null;
  };
  chatUrl: string | null;
  embedCode: string | null;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export default function StoreAccess() {
  const { token } = useParams<{ token: string }>();
  const [copied, setCopied] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery<StoreAccessData>({
    queryKey: ["/api/store/access", token],
    queryFn: async () => {
      const res = await fetch(`/api/store/access/${token}`);
      if (!res.ok) throw new Error("Akses tidak valid");
      return res.json();
    },
    enabled: !!token,
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
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
          >
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Butuh bantuan?</span>
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-16 w-full">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3 bg-white/10" />
            <Skeleton className="h-48 w-full bg-white/10" />
            <Skeleton className="h-32 w-full bg-white/10" />
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold mb-2 text-red-400">Akses Tidak Valid</h1>
            <p className="text-gray-400 mb-6">Link akses tidak ditemukan atau sudah kadaluarsa.</p>
            <a href="/store">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Kembali ke Toko
              </Button>
            </a>
          </div>
        ) : data && data.order.status !== "paid" ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold mb-2 text-yellow-400">Pembayaran Diproses</h1>
            <p className="text-gray-400 mb-6">
              Pembayaran Anda sedang diverifikasi. Halaman ini akan aktif setelah pembayaran berhasil dikonfirmasi (biasanya dalam beberapa menit).
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Butuh bantuan? Hubungi kami di WhatsApp{" "}
              <a href="https://wa.me/6281287941900" className="text-violet-400 hover:underline">
                081287941900
              </a>
            </p>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => window.location.reload()}
            >
              Cek Lagi
            </Button>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Pembayaran Berhasil!</h1>
              <p className="text-gray-400">
                Halo {data.order.customerName}, chatbot Anda sudah siap digunakan.
              </p>
            </div>

            {/* Product Info */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                    style={{ background: `${data.product.color}20`, border: `1px solid ${data.product.color}40` }}
                  >
                    {data.product.emoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{data.product.name}</h2>
                    <p className="text-gray-400 text-sm">{data.product.description}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-400">
                  Pembayaran: <span className="text-white font-semibold">{formatPrice(data.order.amount)}</span>
                  <span className="ml-2 text-green-400">✓ Lunas</span>
                </div>
              </CardContent>
            </Card>

            {/* Chat Access */}
            {data.chatUrl && (
              <Card className="bg-violet-500/10 border-violet-500/30">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-violet-400" />
                    Link Chat Anda
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Simpan link ini untuk mengakses chatbot kapan saja.
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 truncate font-mono">
                      {data.chatUrl}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 flex-shrink-0"
                      onClick={() => handleCopy(data.chatUrl!, "chatUrl")}
                      data-testid="button-copy-chat-url"
                    >
                      {copied === "chatUrl" ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <a href={data.chatUrl} target="_blank" rel="noopener noreferrer" className="block mt-3">
                    <Button className="w-full bg-violet-600 hover:bg-violet-700" data-testid="button-open-chat">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Buka Chatbot Sekarang
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Embed Code */}
            {data.embedCode && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Embed di Website Anda</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Salin kode ini dan tempel di halaman website Anda untuk menampilkan chatbot.
                  </p>
                  <div className="relative">
                    <pre className="bg-gray-800 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap break-all">
                      {data.embedCode}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 border-white/20 text-white hover:bg-white/10"
                      onClick={() => handleCopy(data.embedCode!, "embed")}
                      data-testid="button-copy-embed"
                    >
                      {copied === "embed" ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Support */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400 text-sm mb-3">Ada pertanyaan atau butuh bantuan setup?</p>
                <a href="https://wa.me/6281287941900?text=Halo%2C%20saya%20baru%20beli%20chatbot%20dari%20Gustafta%20Store%20dan%20butuh%20bantuan." target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" data-testid="button-wa-support">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Hubungi WhatsApp Support
                  </Button>
                </a>
              </CardContent>
            </Card>

            <div className="text-center">
              <a href="/store" className="text-sm text-violet-400 hover:underline">
                ← Kembali ke Toko
              </a>
            </div>
          </div>
        ) : null}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-gray-600">
        © 2026 Gustafta. AI Platform Konstruksi Indonesia.
      </footer>
    </div>
  );
}
