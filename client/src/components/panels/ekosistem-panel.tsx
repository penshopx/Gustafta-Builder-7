import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen, GraduationCap, FileText, Sparkles, ExternalLink, Download,
  ArrowRight, Bot, Layers, Zap, BookMarked, ChevronRight, Globe, Brain,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface EkosistemPanelProps {
  agent: any;
}

interface ProductCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge: string;
  badgeVariant: "available" | "new" | "bridge";
  actions: { label: string; icon: React.ReactNode; onClick: () => void; primary?: boolean }[];
  stats?: string;
}

export function EkosistemPanel({ agent }: EkosistemPanelProps) {
  const { toast } = useToast();
  const [openingId, setOpeningId] = useState<string | null>(null);

  const { data: kbs = [] } = useQuery<any[]>({
    queryKey: [`/api/knowledge-base/${agent?.id}`],
    enabled: !!agent?.id,
  });
  const { data: miniApps = [] } = useQuery<any[]>({
    queryKey: [`/api/mini-apps/${agent?.id}`],
    enabled: !!agent?.id,
  });

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
        <Bot className="w-12 h-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">Pilih chatbot dari sidebar untuk melihat Ekosistem Kompetensi.</p>
      </div>
    );
  }

  function openProduct(id: string, path: string, newTab = true) {
    setOpeningId(id);
    const url = `/api/agents/${agent.id}/export/${path}`;
    if (newTab) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
    setTimeout(() => setOpeningId(null), 1500);
    toast({ title: "Membuka produk...", description: `Generating ${id} untuk ${agent.name}` });
  }

  function downloadProduct(id: string, path: string, ext: string) {
    setOpeningId(id + "-dl");
    const url = `/api/agents/${agent.id}/export/${path}?inline=0`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(agent.name || "chatbot").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setOpeningId(null), 1500);
    toast({ title: "Mengunduh...", description: `Download ${id} sedang diproses.` });
  }

  const kbCount = Array.isArray(kbs) ? kbs.length : 0;
  const miniAppCount = Array.isArray(miniApps) ? miniApps.length : 0;
  const starterCount = Array.isArray(agent.conversationStarters) ? agent.conversationStarters.length :
    (typeof agent.conversationStarters === "string" ? agent.conversationStarters.split(/\n|,/).filter(Boolean).length : 0);

  const products: ProductCard[] = [
    {
      id: "ebook",
      title: "eBook Kompetensi",
      subtitle: "8 Bab Terstruktur",
      description: "Dokumentasikan keahlian chatbot menjadi buku panduan profesional: Profil, Persona, Kebijakan, Knowledge Base, SOP, Mini Apps, FAQ, dan Lampiran.",
      icon: <BookOpen className="w-6 h-6" />,
      color: "orange",
      badge: "Tersedia",
      badgeVariant: "available",
      stats: `${kbCount} Materi · ${starterCount} FAQ`,
      actions: [
        {
          label: "Buka & Cetak PDF",
          icon: <BookOpen className="w-4 h-4" />,
          onClick: () => openProduct("ebook", "ebook?format=html"),
          primary: true,
        },
        {
          label: "Excel (.xlsx)",
          icon: <Download className="w-4 h-4" />,
          onClick: () => downloadProduct("ebook-xlsx", "ebook?format=xlsx", "xlsx"),
        },
        {
          label: "Teks (.txt)",
          icon: <Download className="w-4 h-4" />,
          onClick: () => downloadProduct("ebook-txt", "ebook?format=txt", "txt"),
        },
      ],
    },
    {
      id: "ecourse",
      title: "eCourse Modul Belajar",
      subtitle: "Platform Pembelajaran Digital",
      description: "Konversi knowledge base chatbot menjadi modul e-learning interaktif: Modul per kategori, sesi per materi, soal latihan dari conversation starters, dan alat bantu praktik.",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "violet",
      badge: "Baru",
      badgeVariant: "new",
      stats: `${kbCount} Sesi · ${Math.min(starterCount, 10)} Latihan`,
      actions: [
        {
          label: "Generate & Buka",
          icon: <GraduationCap className="w-4 h-4" />,
          onClick: () => openProduct("ecourse", "ecourse"),
          primary: true,
        },
        {
          label: "Download HTML",
          icon: <Download className="w-4 h-4" />,
          onClick: () => downloadProduct("ecourse", "ecourse", "html"),
        },
      ],
    },
    {
      id: "docgen",
      title: "Generator Dokumen",
      subtitle: "Template Dokumen Profesional",
      description: "Hasilkan template dokumen kerja yang relevan: SOP, checklist, formulir, laporan, rencana kerja — otomatis disesuaikan dengan domain keahlian chatbot.",
      icon: <FileText className="w-6 h-6" />,
      color: "emerald",
      badge: "Baru",
      badgeVariant: "new",
      stats: `${kbCount} Konten · Template Otomatis`,
      actions: [
        {
          label: "Generate & Buka",
          icon: <FileText className="w-4 h-4" />,
          onClick: () => openProduct("docgen", "docgen"),
          primary: true,
        },
        {
          label: "Download HTML",
          icon: <Download className="w-4 h-4" />,
          onClick: () => downloadProduct("docgen", "docgen", "html"),
        },
      ],
    },
    {
      id: "chaesa",
      title: "Chaesa AI Studio",
      subtitle: "Platform eBook & Ekosistem Lanjutan",
      description: "Transfer chatbot ke Chaesa AI Studio untuk membuat ebook lanjutan, artikel, whitepaper, dan modul pelatihan yang lebih kaya dengan AI prompt generator 24 industri.",
      icon: <BookMarked className="w-6 h-6" />,
      color: "blue",
      badge: "Bridge",
      badgeVariant: "bridge",
      stats: "24 Industri · Multi-Format",
      actions: [
        {
          label: "Export Bundle Chaesa",
          icon: <Download className="w-4 h-4" />,
          onClick: () => downloadProduct("chaesa", "chaesa?download=1", "json"),
          primary: true,
        },
        {
          label: "Buka Chaesa Studio",
          icon: <ExternalLink className="w-4 h-4" />,
          onClick: () => window.open("https://smart-ebook-builder-7-1.replit.app/", "_blank"),
        },
      ],
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; badge: string; icon: string; btn: string; btnHover: string }> = {
    orange: {
      bg: "from-orange-50/50 to-transparent dark:from-orange-950/20",
      border: "border-orange-400/40",
      badge: "bg-orange-500",
      icon: "bg-orange-500/10 text-orange-600",
      btn: "bg-orange-600 hover:bg-orange-700 text-white",
      btnHover: "",
    },
    violet: {
      bg: "from-violet-50/50 to-transparent dark:from-violet-950/20",
      border: "border-violet-400/40",
      badge: "bg-violet-500",
      icon: "bg-violet-500/10 text-violet-600",
      btn: "bg-violet-600 hover:bg-violet-700 text-white",
      btnHover: "",
    },
    emerald: {
      bg: "from-emerald-50/50 to-transparent dark:from-emerald-950/20",
      border: "border-emerald-400/40",
      badge: "bg-emerald-500",
      icon: "bg-emerald-500/10 text-emerald-600",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
      btnHover: "",
    },
    blue: {
      bg: "from-blue-50/50 to-transparent dark:from-blue-950/20",
      border: "border-blue-400/40",
      badge: "bg-blue-500",
      icon: "bg-blue-500/10 text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700 text-white",
      btnHover: "",
    },
  };

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold opacity-80 uppercase tracking-widest mb-3">
            <Zap className="w-3.5 h-3.5" />
            Ekosistem Kompetensi Digital
          </div>
          <h1 className="text-2xl font-extrabold leading-tight mb-2">
            Dari Chatbot, Lahirkan<br />
            <span className="text-yellow-300">Ekosistem Digital</span>
          </h1>
          <p className="text-sm opacity-85 max-w-md mb-4">
            Chatbot adalah fondasi. Transfer kompetensi {agent.name} menjadi ebook, e-course, generator dokumen, dan lebih banyak produk digital yang bekerja 24 jam.
          </p>

          {/* Foundation pill */}
          <div className="inline-flex items-center gap-3 bg-white/15 border border-white/25 rounded-xl px-4 py-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs opacity-70">Sumber: Chatbot</div>
              <div className="font-bold text-sm">{agent.name}</div>
            </div>
            <div className="flex items-center gap-3 ml-2 border-l border-white/20 pl-3 text-xs opacity-75">
              {kbCount > 0 && <span className="flex items-center gap-1"><Brain className="w-3 h-3" />{kbCount} KB</span>}
              {miniAppCount > 0 && <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{miniAppCount} Apps</span>}
              {starterCount > 0 && <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />{starterCount} FAQ</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Flow indicator */}
      <div className="flex items-center justify-center gap-2 py-1">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold px-3">
          <Bot className="w-3.5 h-3.5 text-indigo-500" />
          Transfer ke 4 Produk Digital
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
      </div>

      {/* Product cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {products.map((product) => {
          const c = colorMap[product.color];
          const isLoading = openingId === product.id || openingId === product.id + "-dl";
          return (
            <Card
              key={product.id}
              className={`border bg-gradient-to-br ${c.bg} ${c.border} transition-all hover:shadow-md`}
              data-testid={`card-product-${product.id}`}
            >
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
                    {product.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-foreground text-base">{product.title}</h3>
                      <Badge className={`${c.badge} text-white text-[10px] px-2`}>
                        {product.badge}
                      </Badge>
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground">{product.subtitle}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>

                {/* Stats */}
                {product.stats && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground bg-background/60 rounded-lg px-3 py-1.5 border border-border/50">
                    <Globe className="w-3 h-3" />
                    {product.stats}
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {product.actions.map((action, ai) => (
                    ai === 0 ? (
                      <Button
                        key={ai}
                        onClick={action.onClick}
                        disabled={isLoading}
                        className={`w-full ${c.btn}`}
                        data-testid={`button-${product.id}-primary`}
                      >
                        {isLoading && ai === 0 ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            {action.icon}
                            {action.label}
                            <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                          </span>
                        )}
                      </Button>
                    ) : (
                      <Button
                        key={ai}
                        variant="outline"
                        size="sm"
                        onClick={action.onClick}
                        disabled={isLoading}
                        className="w-full text-xs"
                        data-testid={`button-${product.id}-action-${ai}`}
                      >
                        {action.icon}
                        <span className="ml-1.5">{action.label}</span>
                      </Button>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info section */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          Cara Terbaik Menggunakan Ekosistem
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-orange-500/15 text-orange-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</span>
            <span><strong className="text-foreground">Perkaya Knowledge Base</strong> — Tambahkan materi ke KB chatbot ini, semakin banyak materi semakin kaya semua produk yang dihasilkan.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-violet-500/15 text-violet-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</span>
            <span><strong className="text-foreground">Generate eBook dulu</strong> — Mulai dari eBook sebagai fondasi dokumentasi, lalu transfer ke produk lain.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</span>
            <span><strong className="text-foreground">eCourse untuk Pelatihan</strong> — Gunakan e-course untuk onboarding tim atau pelatihan pelanggan berbasis kompetensi chatbot.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">4</span>
            <span><strong className="text-foreground">Bridge ke Chaesa</strong> — Export bundle ke Chaesa AI Studio untuk membuat ebook lanjutan yang lebih kompleks.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
