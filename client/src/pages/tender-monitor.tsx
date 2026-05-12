import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Search, RefreshCw, ExternalLink, AlertCircle, Building2,
  Flame, Mountain, Zap, Globe, MapPin, Calendar, DollarSign,
  TrendingUp, CheckCircle, Clock, Filter, ChevronRight,
  PlayCircle, Info, Database, Loader2
} from "lucide-react";
import type { TenderSource, Tender } from "@shared/schema";

// ── Constants ────────────────────────────────────────────────────────────────

type SourceType = "all" | "lpse_pusat" | "lpse_provinsi" | "lpse_kabkota" | "bumn" | "asing";
type Sector = "all" | "konstruksi" | "oil_gas" | "pertambangan" | "energi" | "umum" | "multiple";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  all: "Semua Sumber",
  lpse_pusat: "LPSE Pusat",
  lpse_provinsi: "LPSE Provinsi",
  lpse_kabkota: "LPSE Kab/Kota",
  bumn: "BUMN",
  asing: "Perusahaan Asing",
};

const SOURCE_TYPE_COLORS: Record<string, string> = {
  lpse_pusat: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700",
  lpse_provinsi: "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-700",
  lpse_kabkota: "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-700",
  bumn: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-700",
  asing: "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-700",
};

const SECTOR_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  all: { label: "Semua Sektor", icon: Globe, color: "text-foreground", bg: "bg-muted" },
  konstruksi: { label: "Konstruksi", icon: Building2, color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800" },
  oil_gas: { label: "Oil & Gas", icon: Flame, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/40" },
  pertambangan: { label: "Pertambangan", icon: Mountain, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
  energi: { label: "Energi", icon: Zap, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/40" },
  umum: { label: "Umum", icon: Globe, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-900" },
  multiple: { label: "Multi-Sektor", icon: TrendingUp, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
};

const STATUS_COLORS: Record<string, string> = {
  "Pengumuman Tender": "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
  "Pendaftaran & Pengambilan Dokumen": "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  "Pemasukan Dokumen Penawaran": "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
  "Evaluasi Penawaran": "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300",
  "Pengumuman Pemenang": "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
  "Aktif": "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
};

// ── Source Card ───────────────────────────────────────────────────────────────

function SourceCard({
  source,
  onScrape,
  isScraping,
}: {
  source: TenderSource & { sector?: string; sourceType?: string; region?: string; scrapeStatus?: string; totalTenders?: number };
  onScrape: (id: number) => void;
  isScraping: boolean;
}) {
  const st = source.sourceType || "lpse_pusat";
  const sector = source.sector || "konstruksi";
  const SectorIcon = SECTOR_CONFIG[sector]?.icon || Globe;
  const isDemo = st === "bumn" || st === "asing";

  return (
    <Card
      className={`border transition-all hover:shadow-sm ${isScraping ? "opacity-70" : ""}`}
      data-testid={`card-source-${source.id}`}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <Badge className={`text-[10px] px-1.5 py-0 border ${SOURCE_TYPE_COLORS[st] || "bg-gray-100 text-gray-700"}`}>
                {SOURCE_TYPE_LABELS[st] || st}
              </Badge>
              {isDemo && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-600 border-amber-400">
                  Demo
                </Badge>
              )}
            </div>
            <p className="font-medium text-sm truncate">{source.name}</p>
            {source.region && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{source.region}</span>
              </div>
            )}
          </div>
          <div className={`p-1.5 rounded-md shrink-0 ${SECTOR_CONFIG[sector]?.bg || "bg-muted"}`}>
            <SectorIcon className={`w-4 h-4 ${SECTOR_CONFIG[sector]?.color || ""}`} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {source.totalTenders ? (
              <span className="flex items-center gap-0.5">
                <Database className="w-3 h-3" />
                {source.totalTenders} tender
              </span>
            ) : (
              <span className="text-muted-foreground/60">Belum di-scrape</span>
            )}
            {source.lastScrapedAt && (
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {new Date(source.lastScrapedAt).toLocaleDateString("id-ID")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <a href={source.baseUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-source-${source.id}`}>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
            <Button
              size="sm"
              variant={isDemo ? "outline" : "secondary"}
              className="h-6 text-xs px-2"
              onClick={() => onScrape(source.id)}
              disabled={isScraping}
              data-testid={`button-scrape-${source.id}`}
            >
              {isScraping ? <Loader2 className="w-3 h-3 animate-spin" /> : <PlayCircle className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Tender Card ───────────────────────────────────────────────────────────────

function TenderCard({ tender }: { tender: Tender & { sector?: string; sourceType?: string } }) {
  const sector = tender.sector || "konstruksi";
  const sType = tender.sourceType || "lpse_pusat";
  const SectorIcon = SECTOR_CONFIG[sector]?.icon || Globe;
  const isDemo = (tender.rawData as any)?.demo === true;

  const statusColor = STATUS_COLORS[tender.status || ""] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";

  return (
    <Card
      className={`border transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 ${isDemo ? "border-dashed opacity-80" : ""}`}
      data-testid={`card-tender-${tender.id}`}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-md shrink-0 mt-0.5 ${SECTOR_CONFIG[sector]?.bg}`}>
            <SectorIcon className={`w-4 h-4 ${SECTOR_CONFIG[sector]?.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <Badge className={`text-[10px] px-1.5 py-0 border ${SOURCE_TYPE_COLORS[sType] || ""}`}>
                    {SOURCE_TYPE_LABELS[sType] || sType}
                  </Badge>
                  {isDemo && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-500 border-amber-400">
                      Contoh
                    </Badge>
                  )}
                  {tender.status && (
                    <span className={`inline-flex items-center px-1.5 py-0 text-[10px] rounded-sm font-medium ${statusColor}`}>
                      {tender.status.length > 30 ? tender.status.substring(0, 28) + "…" : tender.status}
                    </span>
                  )}
                </div>
                <p className="font-medium text-sm leading-snug">
                  {tender.name.replace("[DEMO] ", "")}
                </p>
              </div>
              {tender.url && (
                <a href={tender.url} target="_blank" rel="noopener noreferrer" data-testid={`link-tender-${tender.id}`}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
              {tender.agency && (
                <div className="flex items-center gap-1 col-span-2">
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{tender.agency}</span>
                </div>
              )}
              {tender.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 shrink-0" />
                  <span className="truncate font-medium text-foreground">{tender.budget}</span>
                </div>
              )}
              {tender.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{tender.location}</span>
                </div>
              )}
              {tender.publishDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span>{tender.publishDate}</span>
                </div>
              )}
              {tender.deadlineDate && (
                <div className="flex items-center gap-1 text-red-500 dark:text-red-400">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>Deadline: {tender.deadlineDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TenderMonitor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeSourceType, setActiveSourceType] = useState<SourceType>("all");
  const [activeSector, setActiveSector] = useState<Sector>("all");
  const [search, setSearch] = useState("");
  const [scrapingIds, setScrapingIds] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<"feed" | "sources">("feed");

  // ── Data Fetching ──────────────────────────────────────────────────────────

  const { data: sources = [], isLoading: sourcesLoading, refetch: refetchSources } = useQuery<TenderSource[]>({
    queryKey: ["/api/tender-sources"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: tenders = [], isLoading: tendersLoading, refetch: refetchTenders } = useQuery<Tender[]>({
    queryKey: ["/api/tenders"],
    queryFn: () => fetch("/api/tenders?limit=200", { credentials: "include" }).then(r => r.ok ? r.json() : []),
    staleTime: 2 * 60 * 1000,
  });

  // ── Scrape Action ─────────────────────────────────────────────────────────

  const scrapeMutation = useMutation({
    mutationFn: (sourceId: number) =>
      apiRequest("POST", `/api/tender-sources/${sourceId}/scrape`, {}),
    onMutate: (sourceId) => {
      setScrapingIds(prev => new Set([...prev, sourceId]));
    },
    onSuccess: async (data: any, sourceId) => {
      setScrapingIds(prev => { const s = new Set(prev); s.delete(sourceId); return s; });
      const result = await data.json().catch(() => ({}));
      toast({
        title: result.success ? "Scraping selesai" : "Scraping parsial",
        description: result.message || "Data tender diperbarui",
        variant: result.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tenders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tender-sources"] });
    },
    onError: (_err, sourceId) => {
      setScrapingIds(prev => { const s = new Set(prev); s.delete(sourceId); return s; });
      toast({ title: "Gagal scraping", variant: "destructive" });
    },
  });

  async function handleScrapeAll() {
    const enabledSources = (sources as any[]).filter(s => s.isEnabled && !s.name?.includes("[TENDER_SOURCES_v1]"));
    toast({ title: "Memulai scraping semua sumber…", description: `${enabledSources.length} sumber akan diproses secara berurutan` });
    for (const src of enabledSources.slice(0, 10)) {
      await scrapeMutation.mutateAsync(src.id);
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // ── Filtering ─────────────────────────────────────────────────────────────

  const visibleSources = useMemo(() => {
    return (sources as any[]).filter(s => {
      if (s.name?.includes("[TENDER_SOURCES_v1]")) return false;
      if (activeSourceType !== "all" && s.sourceType !== activeSourceType) return false;
      if (activeSector !== "all" && s.sector !== activeSector && s.sector !== "multiple") return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.region?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [sources, activeSourceType, activeSector, search]);

  const visibleTenders = useMemo(() => {
    return (tenders as any[]).filter(t => {
      if (activeSourceType !== "all" && t.sourceType !== activeSourceType) return false;
      if (activeSector !== "all" && t.sector !== activeSector) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
          !t.agency?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tenders, activeSourceType, activeSector, search]);

  // ── Stats ─────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const realSources = (sources as any[]).filter(s => !s.name?.includes("[TENDER_SOURCES_v1]"));
    return {
      totalSources: realSources.length,
      lpse: realSources.filter(s => s.sourceType?.startsWith("lpse")).length,
      bumn: realSources.filter(s => s.sourceType === "bumn").length,
      asing: realSources.filter(s => s.sourceType === "asing").length,
      totalTenders: (tenders as any[]).length,
      konstruksi: (tenders as any[]).filter(t => t.sector === "konstruksi").length,
      oil_gas: (tenders as any[]).filter(t => t.sector === "oil_gas").length,
      pertambangan: (tenders as any[]).filter(t => t.sector === "pertambangan").length,
      energi: (tenders as any[]).filter(t => t.sector === "energi").length,
    };
  }, [sources, tenders]);

  const sourceTypes: SourceType[] = ["all", "lpse_pusat", "lpse_provinsi", "lpse_kabkota", "bumn", "asing"];
  const sectors: Sector[] = ["all", "konstruksi", "oil_gas", "pertambangan", "energi"];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h1 className="text-xl font-bold">Tender Monitor</h1>
                <Badge variant="outline" className="text-xs">Multi-Sumber</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                LPSE Pusat · LPSE Daerah Provinsi/Kab-Kota · BUMN · Perusahaan Asing
                · Konstruksi · Oil&Gas · Pertambangan · Energi
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { refetchSources(); refetchTenders(); }}
                data-testid="button-refresh-all"
                className="gap-1.5 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={handleScrapeAll}
                disabled={scrapeMutation.isPending}
                data-testid="button-scrape-all"
                className="gap-1.5 text-xs"
              >
                {scrapeMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
                Scrape Semua
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 flex-wrap text-xs">
            {[
              { label: `${stats.totalSources} Sumber`, icon: Database, color: "text-blue-500" },
              { label: `${stats.lpse} LPSE`, icon: Globe, color: "text-indigo-500" },
              { label: `${stats.bumn} BUMN`, icon: Building2, color: "text-orange-500" },
              { label: `${stats.asing} Asing`, icon: Globe, color: "text-rose-500" },
              { label: "·", icon: null, color: "" },
              { label: `${stats.totalTenders} Tender`, icon: null, color: "font-bold" },
              { label: `${stats.konstruksi} Konstruksi`, icon: Building2, color: "text-slate-500" },
              { label: `${stats.oil_gas} Oil&Gas`, icon: Flame, color: "text-orange-500" },
              { label: `${stats.pertambangan} Tambang`, icon: Mountain, color: "text-amber-500" },
              { label: `${stats.energi} Energi`, icon: Zap, color: "text-yellow-500" },
            ].map((item, i) =>
              item.icon ? (
                <span key={i} className={`flex items-center gap-0.5 ${item.color}`}>
                  <item.icon className="w-3 h-3" />{item.label}
                </span>
              ) : (
                <span key={i} className={`${item.color} text-muted-foreground`}>{item.label}</span>
              )
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              data-testid="input-search-tender"
              placeholder="Cari nama tender, instansi…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 text-sm h-8"
            />
          </div>

          {/* Source Type Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {sourceTypes.map(st => (
              <button
                key={st}
                onClick={() => setActiveSourceType(st)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                  activeSourceType === st
                    ? "bg-foreground text-background border-transparent"
                    : "border-border hover:border-foreground/50"
                }`}
                data-testid={`filter-source-${st}`}
              >
                {SOURCE_TYPE_LABELS[st]}
              </button>
            ))}
          </div>
        </div>

        {/* Sector Filter */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {sectors.map(sec => {
            const cfg = SECTOR_CONFIG[sec];
            const Icon = cfg.icon;
            return (
              <button
                key={sec}
                onClick={() => setActiveSector(sec)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${
                  activeSector === sec
                    ? `${cfg.bg} ${cfg.color} border-current font-medium`
                    : "border-border hover:border-current hover:bg-muted/50"
                }`}
                data-testid={`filter-sector-${sec}`}
              >
                <Icon className="w-3 h-3" />
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* ── Main Tabs ──────────────────────────────────────────────────────── */}
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="feed" data-testid="tab-tender-feed">
              Feed Tender ({visibleTenders.length})
            </TabsTrigger>
            <TabsTrigger value="sources" data-testid="tab-tender-sources">
              Sumber ({visibleSources.length})
            </TabsTrigger>
          </TabsList>

          {/* ── Feed Tab ─────────────────────────────────────────────────────── */}
          <TabsContent value="feed">
            {tenders.length === 0 && !tendersLoading && (
              <EmptyTenderState onScrapeAll={handleScrapeAll} />
            )}

            {tendersLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            )}

            {visibleTenders.length === 0 && tenders.length > 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Tidak ada tender yang cocok dengan filter Anda.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visibleTenders.map(t => (
                <TenderCard key={t.id} tender={t as any} />
              ))}
            </div>
          </TabsContent>

          {/* ── Sources Tab ──────────────────────────────────────────────────── */}
          <TabsContent value="sources">
            {/* Group by source type */}
            {sourceTypes.filter(st => st !== "all").map(st => {
              const grouped = visibleSources.filter((s: any) => s.sourceType === st);
              if (grouped.length === 0) return null;
              return (
                <div key={st} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-sm">{SOURCE_TYPE_LABELS[st]}</h3>
                    <Badge variant="outline" className="text-xs">{grouped.length}</Badge>
                    {(st === "bumn" || st === "asing") && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Portal ini memerlukan akses vendor — data demo ditampilkan
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {grouped.map((s: any) => (
                      <SourceCard
                        key={s.id}
                        source={s}
                        onScrape={(id) => scrapeMutation.mutate(id)}
                        isScraping={scrapingIds.has(s.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {sourcesLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />)}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info banner */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong>Cara kerja Tender Monitor:</strong> LPSE Pusat/Daerah di-scrape otomatis via SPSE API & DataTables.
            Sumber <strong>BUMN & Perusahaan Asing</strong> menampilkan data <em>contoh</em> (portal mereka tertutup untuk umum — vendor harus registrasi di portal masing-masing).
            Klik <strong>Scrape</strong> pada tiap sumber untuk memperbarui. Klik ikon <ExternalLink className="w-3 h-3 inline" /> untuk buka portal asli.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyTenderState({ onScrapeAll }: { onScrapeAll: () => void }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <TrendingUp className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-base mb-2">Belum Ada Data Tender</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
        Tender Monitor sudah mengkonfigurasi <strong>30+ sumber</strong> dari LPSE Pusat/Daerah, BUMN, dan Perusahaan Asing.
        Klik tombol di bawah untuk mulai mengambil data.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button onClick={onScrapeAll} className="gap-2" data-testid="button-start-scrape">
          <PlayCircle className="w-4 h-4" />
          Mulai Scraping Semua Sumber
        </Button>
        <Button variant="outline" onClick={() => window.location.href = "#sources"} className="gap-2">
          <ChevronRight className="w-4 h-4" />
          Lihat Sumber
        </Button>
      </div>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
        {[
          { label: "LPSE Pusat", count: "4 sumber", icon: Globe, color: "text-blue-500" },
          { label: "LPSE Daerah", count: "16 sumber", icon: MapPin, color: "text-indigo-500" },
          { label: "BUMN", count: "8 sumber", icon: Building2, color: "text-orange-500" },
          { label: "Asing", count: "5 sumber", icon: Globe, color: "text-rose-500" },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-3 rounded-lg border bg-card text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
              <p className="font-medium text-xs">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
