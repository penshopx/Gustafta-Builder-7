import { useState, type FormEvent } from "react";
import { Search, Plus, Trash2, RefreshCw, ExternalLink, Database, Globe, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function TenderPanel({ agent }: { agent: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const [sourceForm, setSourceForm] = useState({
    name: "",
    baseUrl: "",
    isEnabled: true,
  });

  const { data: sources = [], isLoading: sourcesLoading } = useQuery<any[]>({
    queryKey: ["/api/tender-sources"],
  });

  const { data: tenders = [], isLoading: tendersLoading } = useQuery<any[]>({
    queryKey: ["/api/tenders?limit=50"],
  });

  const createSourceMutation = useMutation({
    mutationFn: async (data: typeof sourceForm) => {
      const res = await apiRequest("POST", "/api/tender-sources", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tender-sources"] });
      setSourceForm({ name: "", baseUrl: "", isEnabled: true });
      toast({ title: "Berhasil", description: "Sumber tender baru berhasil ditambahkan" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menambahkan sumber tender", variant: "destructive" });
    },
  });

  const scrapeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/tender-sources/${id}/scrape`);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tender-sources"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tenders?limit=50"] });
      toast({ title: "Berhasil", description: data?.message || "Scraping selesai" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Scraping gagal. Coba lagi nanti.", variant: "destructive" });
    },
  });

  const toggleSourceMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: number; isEnabled: boolean }) => {
      await apiRequest("PATCH", `/api/tender-sources/${id}`, { isEnabled: !isEnabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tender-sources"] });
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tender-sources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tender-sources"] });
      toast({ title: "Berhasil", description: "Sumber tender berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menghapus sumber tender", variant: "destructive" });
    },
  });

  const handleSourceSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!sourceForm.name.trim() || !sourceForm.baseUrl.trim()) return;
    createSourceMutation.mutate(sourceForm);
  };

  const filteredTenders = tenders.filter((tender: any) =>
    tender.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatBudget = (budget: number | string | null) => {
    if (!budget) return "-";
    const num = typeof budget === "string" ? parseFloat(budget) : budget;
    if (isNaN(num)) return "-";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Database className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Data Tender INAPROC
          </h2>
          <p className="text-muted-foreground">Kelola sumber dan data tender pengadaan</p>
        </div>
      </div>

      <Tabs defaultValue="sources" data-testid="tabs-tender">
        <TabsList data-testid="tabs-list-tender">
          <TabsTrigger value="sources" data-testid="tab-trigger-sources">
            <Globe className="w-4 h-4 mr-2" />
            Sumber Tender
          </TabsTrigger>
          <TabsTrigger value="tenders" data-testid="tab-trigger-tenders">
            <FileText className="w-4 h-4 mr-2" />
            Data Tender
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground" data-testid="text-info-cloudflare">
                Situs INAPROC menggunakan proteksi Cloudflare. Jika scraping otomatis gagal, Anda bisa menambahkan data tender secara manual.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tambah Sumber Tender
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSourceSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="source-name">Nama Sumber</Label>
                  <Input
                    id="source-name"
                    value={sourceForm.name}
                    onChange={(e) => setSourceForm({ ...sourceForm, name: e.target.value })}
                    placeholder="LPSE Nasional"
                    data-testid="input-source-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-url">URL Dasar</Label>
                  <Input
                    id="source-url"
                    value={sourceForm.baseUrl}
                    onChange={(e) => setSourceForm({ ...sourceForm, baseUrl: e.target.value })}
                    placeholder="https://spse.inaproc.id/nasional"
                    data-testid="input-source-url"
                  />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Checkbox
                    id="source-enabled"
                    checked={sourceForm.isEnabled}
                    onCheckedChange={(checked) => setSourceForm({ ...sourceForm, isEnabled: !!checked })}
                    data-testid="checkbox-source-enabled"
                  />
                  <Label htmlFor="source-enabled" className="cursor-pointer">Aktifkan sumber ini</Label>
                </div>
                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={createSourceMutation.isPending || !sourceForm.name.trim() || !sourceForm.baseUrl.trim()}
                    data-testid="button-add-source"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {createSourceMutation.isPending ? "Menambahkan..." : "Tambah Sumber"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Daftar Sumber
            </h3>

            {sourcesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="h-12 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sources.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Belum ada sumber tender</p>
              </div>
            ) : (
              sources.map((source: any) => (
                <Card key={source.id} data-testid={`card-source-${source.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground" data-testid={`text-source-name-${source.id}`}>
                            {source.name}
                          </p>
                          <Badge
                            variant={source.isEnabled ? "default" : "secondary"}
                            data-testid={`badge-source-status-${source.id}`}
                          >
                            {source.isEnabled ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {source.baseUrl}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {source.totalTenders ?? 0} tender
                          </span>
                          {source.lastScrapedAt && (
                            <span className="flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />
                              Terakhir: {new Date(source.lastScrapedAt).toLocaleDateString("id-ID")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => scrapeMutation.mutate(source.id)}
                          disabled={scrapeMutation.isPending}
                          data-testid={`button-scrape-source-${source.id}`}
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${scrapeMutation.isPending ? "animate-spin" : ""}`} />
                          Scrape Sekarang
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleSourceMutation.mutate({ id: source.id, isEnabled: source.isEnabled })}
                          disabled={toggleSourceMutation.isPending}
                          data-testid={`button-toggle-source-${source.id}`}
                        >
                          {source.isEnabled ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (window.confirm("Apakah Anda yakin ingin menghapus sumber ini?")) {
                              deleteSourceMutation.mutate(source.id);
                            }
                          }}
                          disabled={deleteSourceMutation.isPending}
                          data-testid={`button-delete-source-${source.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="tenders" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground" data-testid="text-tender-count">
              Total: {filteredTenders.length} tender
            </p>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari tender..."
                className="pl-9"
                data-testid="input-search-tender"
              />
            </div>
          </div>

          {tendersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="h-16 bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTenders.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "Tidak ada tender yang cocok" : "Belum ada data tender"}
              </p>
            </div>
          ) : (
            filteredTenders.map((tender: any) => (
              <Card key={tender.id} data-testid={`card-tender-${tender.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground line-clamp-2" data-testid={`text-tender-name-${tender.id}`}>
                        {tender.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1" data-testid={`text-tender-agency-${tender.id}`}>
                        {tender.agency || "-"}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary" data-testid={`badge-tender-budget-${tender.id}`}>
                          {formatBudget(tender.budget)}
                        </Badge>
                        {tender.type && (
                          <Badge variant="outline" data-testid={`badge-tender-type-${tender.id}`}>
                            {tender.type}
                          </Badge>
                        )}
                        {tender.status && (
                          <Badge variant="outline" data-testid={`badge-tender-status-${tender.id}`}>
                            {tender.status}
                          </Badge>
                        )}
                        {tender.publishDate && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(tender.publishDate).toLocaleDateString("id-ID")}
                          </span>
                        )}
                      </div>
                    </div>
                    {tender.url && (
                      <a
                        href={tender.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`link-tender-url-${tender.id}`}
                      >
                        <Button size="icon" variant="ghost">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}