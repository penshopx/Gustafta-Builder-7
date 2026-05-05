import { useState, useEffect } from "react";
import { ShoppingBag, Globe, DollarSign, Shield, Tag, Copy, ExternalLink, Check, Plus, Trash2, Target, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

export function ProductSettingsPanel({ agent }: { agent: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState({
    isListed: agent.isListed ?? false,
    productSlug: agent.productSlug || "",
    productSummary: agent.productSummary || "",
    productFeatures: (agent.productFeatures as string[]) || [],
    productUseCases: agent.productUseCases || "",
    productTargetUser: agent.productTargetUser || "",
    productProblem: agent.productProblem || "",
    monthlyPrice: agent.monthlyPrice ?? 0,
    trialEnabled: agent.trialEnabled ?? true,
    trialDays: agent.trialDays ?? 7,
    messageQuotaDaily: agent.messageQuotaDaily ?? 50,
    messageQuotaMonthly: agent.messageQuotaMonthly ?? 1000,
    guestMessageLimit: agent.guestMessageLimit ?? 10,
    requireRegistration: agent.requireRegistration ?? false,
    brandingName: agent.brandingName || "",
    brandingLogo: agent.brandingLogo || "",
  });

  const set = (key: string, val: any) => setSettings(s => ({ ...s, [key]: val }));

  const [newFeature, setNewFeature] = useState("");
  const [copiedMarketplace, setCopiedMarketplace] = useState(false);
  const [copiedChat, setCopiedChat] = useState(false);

  useEffect(() => {
    setSettings({
      isListed: agent.isListed ?? false,
      productSlug: agent.productSlug || "",
      productSummary: agent.productSummary || "",
      productFeatures: (agent.productFeatures as string[]) || [],
      productUseCases: agent.productUseCases || "",
      productTargetUser: agent.productTargetUser || "",
      productProblem: agent.productProblem || "",
      monthlyPrice: agent.monthlyPrice ?? 0,
      trialEnabled: agent.trialEnabled ?? true,
      trialDays: agent.trialDays ?? 7,
      messageQuotaDaily: agent.messageQuotaDaily ?? 50,
      messageQuotaMonthly: agent.messageQuotaMonthly ?? 1000,
      guestMessageLimit: agent.guestMessageLimit ?? 10,
      requireRegistration: agent.requireRegistration ?? false,
      brandingName: agent.brandingName || "",
      brandingLogo: agent.brandingLogo || "",
    });
  }, [agent.id]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof settings) => {
      const response = await apiRequest("PATCH", `/api/agents/${agent.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Berhasil",
        description: "Pengaturan produk berhasil disimpan",
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal menyimpan pengaturan produk",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(settings);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setSettings({
        ...settings,
        productFeatures: [...settings.productFeatures, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setSettings({
      ...settings,
      productFeatures: settings.productFeatures.filter((_, i) => i !== index),
    });
  };

  const getBaseUrl = () => window.location.origin;

  const getMarketplaceUrl = () => `${getBaseUrl()}/bot/${settings.productSlug || agent.productSlug || agent.id}`;
  const getChatUrl = () => `${getBaseUrl()}/bot/${settings.productSlug || agent.productSlug || agent.id}`;

  const copyMarketplaceUrl = () => {
    navigator.clipboard.writeText(getMarketplaceUrl());
    setCopiedMarketplace(true);
    setTimeout(() => setCopiedMarketplace(false), 2000);
    toast({ title: "Disalin!", description: "URL marketplace berhasil disalin ke clipboard" });
  };

  const copyChatUrl = () => {
    navigator.clipboard.writeText(getChatUrl());
    setCopiedChat(true);
    setTimeout(() => setCopiedChat(false), 2000);
    toast({ title: "Disalin!", description: "URL chat berhasil disalin ke clipboard" });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Pengaturan Produk
            </h2>
            <p className="text-muted-foreground">Konfigurasi monetisasi chatbot Anda</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
         
        >
          {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Pengaturan Publikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <Label>Tampilkan di Marketplace</Label>
                  <p className="text-xs text-muted-foreground">Chatbot akan muncul di katalog publik</p>
                </div>
                <Switch
                  checked={settings.isListed}
                  onCheckedChange={(checked) => setSettings({ ...settings, isListed: checked })}
                 
                />
              </div>

              <div className="space-y-2">
                <Label>Product Slug</Label>
                <Input
                  value={settings.productSlug}
                  onChange={(e) => setSettings({ ...settings, productSlug: e.target.value })}
                  placeholder="nama-produk-unik"
                 
                />
                <p className="text-xs text-muted-foreground">Identifier URL-friendly untuk produk Anda</p>
              </div>

              <div className="space-y-2">
                <Label>Ringkasan Produk</Label>
                <Textarea
                  value={settings.productSummary}
                  onChange={(e) => setSettings({ ...settings, productSummary: e.target.value })}
                  placeholder="Deskripsi singkat tentang chatbot Anda untuk calon pelanggan..."
                  rows={3}
                 
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-primary" />Masalah yang Diselesaikan</Label>
                <Textarea
                  value={settings.productProblem}
                  onChange={(e) => set("productProblem", e.target.value)}
                  placeholder="Contoh: Banyak kontraktor kesulitan memahami persyaratan dokumen tender yang kompleks..."
                  rows={2}
                  data-testid="textarea-product-problem"
                />
                <p className="text-xs text-muted-foreground">Masalah utama yang diselesaikan chatbot ini</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-primary" />Contoh Use Case</Label>
                <Textarea
                  value={settings.productUseCases}
                  onChange={(e) => set("productUseCases", e.target.value)}
                  placeholder="Contoh: Analisis dokumen RKS, cek kelengkapan berkas, hitung estimasi biaya tender..."
                  rows={2}
                  data-testid="textarea-product-use-cases"
                />
                <p className="text-xs text-muted-foreground">Skenario penggunaan nyata chatbot ini</p>
              </div>

              <div className="space-y-2">
                <Label>Target Pengguna</Label>
                <Input
                  value={settings.productTargetUser}
                  onChange={(e) => set("productTargetUser", e.target.value)}
                  placeholder="Contoh: Kontraktor, konsultan pengadaan, staf procurement BUMN"
                  data-testid="input-product-target-user"
                />
                <p className="text-xs text-muted-foreground">Siapa yang paling cocok menggunakan chatbot ini</p>
              </div>

              <div className="space-y-2">
                <Label>Fitur Produk</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Tambahkan fitur..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                   
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={addFeature}
                    disabled={!newFeature.trim()}
                   
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {settings.productFeatures.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.productFeatures.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {feature}
                        <button
                          onClick={() => removeFeature(index)}
                          className="ml-1 hover:text-destructive"
                         
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Pengaturan Harga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Harga Bulanan (IDR)</Label>
                <Input
                  type="number"
                  value={settings.monthlyPrice}
                  onChange={(e) => setSettings({ ...settings, monthlyPrice: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min={0}
                 
                />
                <p className="text-xs text-muted-foreground">
                  Harga saat ini: {formatCurrency(settings.monthlyPrice)}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <Label>Aktifkan Masa Percobaan</Label>
                  <p className="text-xs text-muted-foreground">Pelanggan dapat mencoba sebelum berlangganan</p>
                </div>
                <Switch
                  checked={settings.trialEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, trialEnabled: checked })}
                 
                />
              </div>

              {settings.trialEnabled && (
                <div className="space-y-2">
                  <Label>Durasi Trial (hari)</Label>
                  <Input
                    type="number"
                    value={settings.trialDays}
                    onChange={(e) => setSettings({ ...settings, trialDays: parseInt(e.target.value) || 0 })}
                    placeholder="7"
                    min={1}
                   
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quota Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Pengaturan Kuota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Kuota Pesan Harian</Label>
                <Input
                  type="number"
                  value={settings.messageQuotaDaily}
                  onChange={(e) => setSettings({ ...settings, messageQuotaDaily: parseInt(e.target.value) || 0 })}
                  placeholder="50"
                  min={0}
                 
                />
              </div>

              <div className="space-y-2">
                <Label>Kuota Pesan Bulanan</Label>
                <Input
                  type="number"
                  value={settings.messageQuotaMonthly}
                  onChange={(e) => setSettings({ ...settings, messageQuotaMonthly: parseInt(e.target.value) || 0 })}
                  placeholder="1000"
                  min={0}
                 
                />
              </div>

              <div className="space-y-2">
                <Label>Batas Pesan Gratis (Guest)</Label>
                <Input
                  type="number"
                  value={settings.guestMessageLimit}
                  onChange={(e) => setSettings({ ...settings, guestMessageLimit: parseInt(e.target.value) || 0 })}
                  placeholder="10"
                  min={0}
                  data-testid="input-guest-message-limit"
                />
                <p className="text-xs text-muted-foreground">Jumlah pesan gratis sebelum pengguna diminta mendaftar. Set 0 untuk tanpa batas.</p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <Label>Wajib Registrasi</Label>
                  <p className="text-xs text-muted-foreground">Pengguna akhir harus mendaftar untuk menggunakan chatbot</p>
                </div>
                <Switch
                  checked={settings.requireRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireRegistration: checked })}
                 
                />
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Brand</Label>
                <Input
                  value={settings.brandingName}
                  onChange={(e) => setSettings({ ...settings, brandingName: e.target.value })}
                  placeholder="Nama brand chatbot Anda"
                 
                />
              </div>

              <div className="space-y-2">
                <Label>URL Logo Brand</Label>
                <Input
                  value={settings.brandingLogo}
                  onChange={(e) => setSettings({ ...settings, brandingLogo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                 
                />
                {settings.brandingLogo && (
                  <div className="mt-2 p-2 border rounded-md inline-block">
                    <img
                      src={settings.brandingLogo}
                      alt="Logo preview"
                      className="h-10 w-auto object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                     
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Public Link Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Preview Link Publik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>URL Marketplace</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={getMarketplaceUrl()}
                    readOnly
                    className="text-sm"
                   
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyMarketplaceUrl}
                   
                  >
                    {copiedMarketplace ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL Chat</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={getChatUrl()}
                    readOnly
                    className="text-sm"
                   
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyChatUrl}
                   
                  >
                    {copiedChat ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
