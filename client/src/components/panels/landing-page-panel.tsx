import { useState, useEffect } from "react";
import { Globe, Copy, Check, ExternalLink, Link } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function LandingPagePanel({ agent }: { agent: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [landingPageUrl, setLandingPageUrl] = useState(agent.landingPageUrl || "");
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    setLandingPageUrl(agent.landingPageUrl || "");
  }, [agent]);

  const updateMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiRequest("PATCH", `/api/agents/${agent.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({ title: "Berhasil", description: "Link landing page berhasil disimpan" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menyimpan link landing page", variant: "destructive" });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      landingPageUrl: landingPageUrl.trim(),
      landingPageEnabled: !!landingPageUrl.trim(),
    });
  };

  const copyUrl = () => {
    if (!landingPageUrl.trim()) return;
    navigator.clipboard.writeText(landingPageUrl.trim());
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    toast({ title: "Disalin!", description: "URL landing page berhasil disalin" });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Landing Page</h2>
            <p className="text-muted-foreground">Link ke halaman landing page chatbot Anda</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} data-testid="button-save-landing">
          {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">URL Landing Page</Label>
            <p className="text-xs text-muted-foreground">
              Masukkan link landing page yang sudah Anda buat (misalnya dari Notion, Carrd, Google Sites, atau platform lain)
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={landingPageUrl}
                  onChange={(e) => setLandingPageUrl(e.target.value)}
                  placeholder="https://contoh.com/landing-page-chatbot-anda"
                  className="pl-10 text-sm"
                  data-testid="input-landing-url"
                />
              </div>
              {landingPageUrl.trim() && (
                <>
                  <Button size="icon" variant="outline" onClick={copyUrl} data-testid="button-copy-landing-url">
                    {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => window.open(landingPageUrl.trim(), "_blank")} data-testid="button-preview-landing">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {landingPageUrl.trim() && (
            <div className="p-3 rounded-md bg-muted/50 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary shrink-0" />
              <a
                href={landingPageUrl.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline truncate"
                data-testid="link-landing-preview"
              >
                {landingPageUrl.trim()}
              </a>
            </div>
          )}

          {!landingPageUrl.trim() && (
            <div className="p-4 rounded-md border border-dashed text-center space-y-2">
              <Globe className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Belum ada landing page. Masukkan URL landing page yang sudah Anda buat di platform lain.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
