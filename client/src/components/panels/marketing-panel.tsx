import { useState, useEffect } from "react";
import { Megaphone, Copy, Check, ExternalLink, Link } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function MarketingPanel({ agent }: { agent: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [marketingKitUrl, setMarketingKitUrl] = useState(agent.marketingKitUrl || "");
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    setMarketingKitUrl(agent.marketingKitUrl || "");
  }, [agent]);

  const updateMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiRequest("PATCH", `/api/agents/${agent.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({ title: "Berhasil", description: "Link marketing kit berhasil disimpan" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menyimpan link marketing kit", variant: "destructive" });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      marketingKitUrl: marketingKitUrl.trim(),
    });
  };

  const copyUrl = () => {
    if (!marketingKitUrl.trim()) return;
    navigator.clipboard.writeText(marketingKitUrl.trim());
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    toast({ title: "Disalin!", description: "URL marketing kit berhasil disalin" });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Marketing Kit</h2>
            <p className="text-muted-foreground">Link ke materi marketing chatbot Anda</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} data-testid="button-save-marketing">
          {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">URL Marketing Kit</Label>
            <p className="text-xs text-muted-foreground">
              Masukkan link ke materi marketing yang sudah Anda buat (misalnya Google Drive, Canva, Notion, atau platform lain)
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={marketingKitUrl}
                  onChange={(e) => setMarketingKitUrl(e.target.value)}
                  placeholder="https://drive.google.com/folder/marketing-kit-anda"
                  className="pl-10 text-sm"
                  data-testid="input-marketing-url"
                />
              </div>
              {marketingKitUrl.trim() && (
                <>
                  <Button size="icon" variant="outline" onClick={copyUrl} data-testid="button-copy-marketing-url">
                    {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => window.open(marketingKitUrl.trim(), "_blank")} data-testid="button-preview-marketing">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {marketingKitUrl.trim() && (
            <div className="p-3 rounded-md bg-muted/50 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-primary shrink-0" />
              <a
                href={marketingKitUrl.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline truncate"
                data-testid="link-marketing-preview"
              >
                {marketingKitUrl.trim()}
              </a>
            </div>
          )}

          {!marketingKitUrl.trim() && (
            <div className="p-4 rounded-md border border-dashed text-center space-y-2">
              <Megaphone className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Belum ada marketing kit. Masukkan URL ke materi marketing (ad copy, gambar, video) yang sudah Anda buat.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
