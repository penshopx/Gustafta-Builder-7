import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Wand2, Upload, FileText, BookOpen, Download, Loader2, Check, X,
  AlertCircle, Sparkles, FileCode, FilePlus2, Layers, Calculator, GraduationCap,
  Info, RefreshCw, FileUp, Copy, ExternalLink, BookMarked,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useImportAgent } from "@/hooks/use-export-import";

interface ImportProposal {
  proposal: Record<string, any>;
  knowledgeChunks: Array<{ name: string; type: string; content: string; description?: string }>;
  confidence: number;
  sourceFile: string;
  rawTextLength: number;
  truncated: boolean;
  notes: string[];
}

const FIELD_LABELS: Record<string, string> = {
  name: "Nama Chatbot",
  tagline: "Tagline",
  description: "Deskripsi",
  philosophy: "Filosofi",
  systemPrompt: "Instruksi Peran (System Prompt)",
  greetingMessage: "Sapaan Pembuka",
  conversationStarters: "Pertanyaan Pemicu",
  expertise: "Bidang Keahlian",
  keyPhrases: "Kata Kunci",
  avoidTopics: "Topik Dihindari",
  category: "Kategori",
  subcategory: "Sub-kategori",
  language: "Bahasa",
  toneOfVoice: "Nada Suara",
  responseFormat: "Format Respons",
};

export function StudioPanel({ agent }: { agent: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ============ IMPORT STATE ============
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [proposal, setProposal] = useState<ImportProposal | null>(null);
  const [overwriteAll, setOverwriteAll] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});
  const [acceptedFields, setAcceptedFields] = useState<Set<string>>(new Set());
  const [acceptedKbs, setAcceptedKbs] = useState<Set<number>>(new Set());

  const importDocMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/agents/import-document", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Upload gagal (HTTP ${res.status})`);
      }
      return (await res.json()) as ImportProposal;
    },
    onSuccess: (data) => {
      setProposal(data);
      setEditedFields({ ...data.proposal });
      const fieldKeys = Object.keys(data.proposal).filter((k) => {
        const v = data.proposal[k];
        return v !== null && v !== undefined && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== "");
      });
      setAcceptedFields(new Set(fieldKeys));
      setAcceptedKbs(new Set(data.knowledgeChunks.map((_, i) => i)));
      toast({
        title: "Dokumen terbaca",
        description: `${fieldKeys.length} field terdeteksi · ${data.knowledgeChunks.length} potongan materi · keyakinan ${(data.confidence * 100).toFixed(0)}%`,
      });
    },
    onError: (err: any) => {
      toast({ title: "Gagal membaca dokumen", description: err.message, variant: "destructive" });
    },
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      const filteredProposal: Record<string, any> = {};
      acceptedFields.forEach((k) => {
        if (editedFields[k] !== undefined) filteredProposal[k] = editedFields[k];
      });
      const filteredKbs = (proposal?.knowledgeChunks || []).filter((_, i) => acceptedKbs.has(i));
      const res = await apiRequest("POST", `/api/agents/${agent.id}/apply-import`, {
        proposal: filteredProposal,
        knowledgeChunks: filteredKbs,
        mode: overwriteAll ? "overwrite_all" : "fill_empty_only",
      });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Berhasil diterapkan",
        description: `${data.fieldsApplied?.length || 0} field diisi · ${data.knowledgeBasesCreated?.length || 0} materi pengetahuan dibuat`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents", agent.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/knowledge-base", agent.id] });
      setProposal(null);
      setEditedFields({});
      setAcceptedFields(new Set());
      setAcceptedKbs(new Set());
      setUploadedFileName("");
    },
    onError: (err: any) => {
      toast({ title: "Gagal menerapkan", description: err.message, variant: "destructive" });
    },
  });

  const importAgentHook = useImportAgent();

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setProposal(null);
    importDocMutation.mutate(file);
    e.target.value = "";
  };

  const handleJsonPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const config = JSON.parse(text);
      const newAgent = await importAgentHook.mutateAsync({
        config,
        toolboxId: agent.toolboxId || undefined,
      });
      toast({
        title: "Import konfigurasi berhasil",
        description: `Chatbot "${newAgent?.name || "baru"}" telah dibuat di toolbox saat ini.`,
      });
    } catch (err: any) {
      toast({
        title: "Import konfigurasi gagal",
        description: err.message || "Pastikan file JSON konfigurasi valid.",
        variant: "destructive",
      });
    } finally {
      e.target.value = "";
    }
  };

  const toggleField = (key: string) => {
    setAcceptedFields((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleKb = (idx: number) => {
    setAcceptedKbs((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const updateField = (key: string, value: any) => {
    setEditedFields((prev) => ({ ...prev, [key]: value }));
  };

  // ============ CHAESA AI STUDIO EXPORT ============
  const [chaesaOpen, setChaesaOpen] = useState(false);
  const [chaesaBundle, setChaesaBundle] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string>("");

  const fetchChaesaMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/agents/${agent.id}/export/chaesa`, { credentials: "include" });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error || "Gagal mengambil bundle Chaesa");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setChaesaBundle(data);
      setChaesaOpen(true);
    },
    onError: (err: any) => {
      toast({ title: "Gagal", description: err.message, variant: "destructive" });
    },
  });

  const downloadChaesaJson = () => {
    const url = `/api/agents/${agent.id}/export/chaesa?download=1`;
    const a = document.createElement("a");
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({
      title: "Bundle Chaesa diunduh",
      description: "File JSON siap diimpor ke aplikasi Chaesa AI Studio.",
    });
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1500);
    } catch {
      toast({ title: "Gagal menyalin", variant: "destructive" });
    }
  };

  const copyAllChaesa = async () => {
    if (!chaesaBundle) return;
    const lines: string[] = [];
    for (const f of chaesaBundle.quickFill) {
      lines.push(`${f.label}:`);
      lines.push(f.value || "(kosong)");
      lines.push("");
    }
    await copyToClipboard(lines.join("\n").trim(), "all");
    toast({ title: "Seluruh field disalin", description: "Teks bersih, siap tempel ke Chaesa AI Studio." });
  };

  // ============ EBOOK EXPORT ============
  const downloadEbook = (format: "html" | "md" | "txt" | "xlsx" | "csv") => {
    const url = `/api/agents/${agent.id}/export/ebook?format=${format}`;
    if (format === "html") {
      window.open(url, "_blank");
      toast({
        title: "eBook dibuka di tab baru",
        description: "Klik tombol \"Cetak / Simpan PDF\" di pojok kanan atas untuk menyimpan sebagai PDF.",
      });
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    const slug = (agent.name || "ebook").toLowerCase().replace(/\s+/g, "-");
    const ext = format === "md" ? "md" : format;
    a.download = `${slug}-ebook.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    const labels: Record<string, { title: string; desc: string }> = {
      md: { title: "eBook diunduh (Markdown)", desc: "File .md untuk editor markdown / publikasi." },
      txt: { title: "eBook diunduh (Teks bersih)", desc: "File .txt tanpa simbol — siap tempel ke Word / Google Docs." },
      xlsx: { title: "Tabel diunduh (Excel)", desc: "File .xlsx berisi semua field & materi terstruktur dalam beberapa sheet." },
      csv: { title: "Tabel diunduh (CSV)", desc: "File .csv siap impor ke spreadsheet apa pun." },
    };
    const lbl = labels[format];
    if (lbl) toast({ title: lbl.title, description: lbl.desc });
  };

  const downloadConfig = async () => {
    try {
      const res = await fetch(`/api/agents/${agent.id}/export`, { credentials: "include" });
      if (!res.ok) throw new Error("Gagal export");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug = (agent.name || "chatbot").toLowerCase().replace(/\s+/g, "-");
      a.download = `${slug}-config.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Konfigurasi diunduh", description: "File JSON siap diimpor ke chatbot lain." });
    } catch (err: any) {
      toast({ title: "Gagal export konfigurasi", description: err.message, variant: "destructive" });
    }
  };

  // ============ RENDER ============
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl overflow-y-auto max-h-[calc(100vh-80px)]" data-testid="panel-studio">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground" data-testid="text-studio-title">
            Studio Kompetensi
          </h2>
          <p className="text-sm text-muted-foreground">
            Import dokumen jadi konfigurasi chatbot, atau export chatbot menjadi 5 produk kompetensi.
          </p>
        </div>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="import" data-testid="tab-import">
            <FileUp className="w-4 h-4 mr-1.5" /> Import
          </TabsTrigger>
          <TabsTrigger value="export" data-testid="tab-export">
            <Download className="w-4 h-4 mr-1.5" /> Export
          </TabsTrigger>
        </TabsList>

        {/* ============ IMPORT TAB ============ */}
        <TabsContent value="import" className="space-y-4 mt-4">
          <Tabs defaultValue="document" className="w-full">
            <TabsList>
              <TabsTrigger value="document" data-testid="tab-import-document">
                <FileText className="w-4 h-4 mr-1.5" /> Dari Dokumen (PDF/DOCX/XLSX)
              </TabsTrigger>
              <TabsTrigger value="json" data-testid="tab-import-json">
                <FileCode className="w-4 h-4 mr-1.5" /> Dari Konfigurasi JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value="document" className="space-y-4 mt-4">
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      Upload dokumen kompetensi (PDF, DOCX, XLSX, CSV, TXT). AI akan mem-parsing isinya dan
                      mengusulkan field-field chatbot. Anda tinggal periksa, edit, dan terapkan.
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,text/plain"
                      onChange={handleFilePick}
                      className="hidden"
                      data-testid="input-import-document-file"
                    />
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      {uploadedFileName || "Pilih file dokumen untuk diimpor"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Maks 50MB · PDF · DOCX · XLSX · CSV · TXT
                    </p>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={importDocMutation.isPending}
                      data-testid="button-pick-import-file"
                    >
                      {importDocMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Memproses…</>
                      ) : (
                        <><Upload className="w-4 h-4 mr-1.5" /> Pilih File</>
                      )}
                    </Button>
                  </div>

                  {importDocMutation.isPending && (
                    <div className="text-center text-sm text-muted-foreground italic">
                      AI sedang membaca dokumen dan memetakan field… (10-40 detik)
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* PROPOSAL PREVIEW */}
              {proposal && (
                <Card className="border-orange-500/40">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold" data-testid="text-proposal-title">
                            Usulan dari: {proposal.sourceFile}
                          </h3>
                          <Badge variant={proposal.confidence > 0.7 ? "default" : proposal.confidence > 0.4 ? "secondary" : "outline"}>
                            Keyakinan {(proposal.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {Object.keys(proposal.proposal).length} field terdeteksi · {proposal.knowledgeChunks.length} potongan materi · {(proposal.rawTextLength / 1000).toFixed(1)}k karakter dibaca
                          {proposal.truncated && " (dipotong)"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setProposal(null); setUploadedFileName(""); }}
                        data-testid="button-cancel-proposal"
                      >
                        <X className="w-4 h-4 mr-1" /> Batal
                      </Button>
                    </div>

                    {proposal.notes.length > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-medium text-amber-800 dark:text-amber-200">
                          <AlertCircle className="w-3.5 h-3.5" /> Catatan AI
                        </div>
                        <ul className="list-disc ml-5 text-amber-700 dark:text-amber-300">
                          {proposal.notes.map((n, i) => <li key={i}>{n}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Field Chatbot ({acceptedFields.size}/{Object.keys(proposal.proposal).length} dipilih)</Label>
                        <div className="flex items-center gap-2 text-xs">
                          <Switch
                            id="overwrite-mode"
                            checked={overwriteAll}
                            onCheckedChange={setOverwriteAll}
                            data-testid="switch-overwrite-all"
                          />
                          <Label htmlFor="overwrite-mode" className="cursor-pointer">
                            Timpa nilai yang sudah ada
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                        {Object.keys(proposal.proposal).map((key) => {
                          const val = editedFields[key];
                          const isAccepted = acceptedFields.has(key);
                          const isArr = Array.isArray(val);
                          const display = isArr ? val.join("\n") : (val || "");
                          if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === "string" && !val.trim())) return null;
                          return (
                            <div
                              key={key}
                              className={`border rounded-lg p-3 transition-colors ${isAccepted ? "border-orange-400 bg-orange-50/40 dark:bg-orange-950/20" : "border-border bg-muted/30 opacity-60"}`}
                              data-testid={`row-field-${key}`}
                            >
                              <div className="flex items-start gap-2 mb-2">
                                <button
                                  type="button"
                                  onClick={() => toggleField(key)}
                                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isAccepted ? "bg-orange-500 border-orange-500" : "border-muted-foreground"}`}
                                  data-testid={`toggle-field-${key}`}
                                >
                                  {isAccepted && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Label className="text-xs font-semibold">{FIELD_LABELS[key] || key}</Label>
                                    {isArr && <Badge variant="outline" className="text-[10px]">{val.length} item</Badge>}
                                  </div>
                                </div>
                              </div>
                              {isAccepted && (
                                isArr ? (
                                  <Textarea
                                    value={display}
                                    onChange={(e) => updateField(key, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
                                    className="text-xs font-mono min-h-[60px]"
                                    placeholder="Satu item per baris"
                                    data-testid={`input-field-${key}`}
                                  />
                                ) : (display.length > 80 || display.includes("\n")) ? (
                                  <Textarea
                                    value={display}
                                    onChange={(e) => updateField(key, e.target.value)}
                                    className="text-xs min-h-[60px]"
                                    data-testid={`input-field-${key}`}
                                  />
                                ) : (
                                  <Input
                                    value={display}
                                    onChange={(e) => updateField(key, e.target.value)}
                                    className="text-xs"
                                    data-testid={`input-field-${key}`}
                                  />
                                )
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {proposal.knowledgeChunks.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Materi Pengetahuan ({acceptedKbs.size}/{proposal.knowledgeChunks.length} dipilih)
                        </Label>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {proposal.knowledgeChunks.map((kb, i) => {
                            const isAccepted = acceptedKbs.has(i);
                            return (
                              <div
                                key={i}
                                className={`border rounded-lg p-3 ${isAccepted ? "border-orange-400 bg-orange-50/40 dark:bg-orange-950/20" : "border-border bg-muted/30 opacity-60"}`}
                                data-testid={`row-kb-${i}`}
                              >
                                <div className="flex items-start gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleKb(i)}
                                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isAccepted ? "bg-orange-500 border-orange-500" : "border-muted-foreground"}`}
                                    data-testid={`toggle-kb-${i}`}
                                  >
                                    {isAccepted && <Check className="w-3 h-3 text-white" />}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold mb-0.5">{kb.name}</div>
                                    {kb.description && <div className="text-[11px] text-muted-foreground mb-1">{kb.description}</div>}
                                    <div className="text-[11px] text-muted-foreground line-clamp-3">{kb.content.slice(0, 240)}{kb.content.length > 240 && "…"}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t">
                      <div className="text-xs text-muted-foreground mr-auto">
                        Mode: <strong>{overwriteAll ? "Timpa semua nilai" : "Hanya isi field kosong"}</strong>
                      </div>
                      <Button
                        onClick={() => applyMutation.mutate()}
                        disabled={applyMutation.isPending || (acceptedFields.size === 0 && acceptedKbs.size === 0)}
                        data-testid="button-apply-proposal"
                      >
                        {applyMutation.isPending ? (
                          <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Menerapkan…</>
                        ) : (
                          <><Check className="w-4 h-4 mr-1.5" /> Terapkan ke Chatbot Ini</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="json" className="space-y-4 mt-4">
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      Import file <code className="bg-muted px-1 py-0.5 rounded text-xs">config.json</code> hasil
                      export dari chatbot lain. Akan membuat <strong>chatbot baru</strong> di toolbox saat ini.
                    </div>
                  </div>
                  <input
                    ref={jsonInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleJsonPick}
                    className="hidden"
                    data-testid="input-import-json-file"
                  />
                  <Button
                    onClick={() => jsonInputRef.current?.click()}
                    disabled={importAgentHook.isPending}
                    data-testid="button-pick-import-json"
                  >
                    {importAgentHook.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Mengimpor…</>
                    ) : (
                      <><FileCode className="w-4 h-4 mr-1.5" /> Pilih File config.json</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ============ EXPORT TAB ============ */}
        <TabsContent value="export" className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground">
            Pancarkan chatbot ini ke 5 produk ekosistem kompetensi.
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* eBook */}
            <Card className="border-orange-500/40 bg-gradient-to-br from-orange-50/40 to-transparent dark:from-orange-950/20">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">eBook Kompetensi</h3>
                      <Badge className="bg-orange-500 hover:bg-orange-600">Tersedia</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      8 bab terstruktur: Profil, Persona, Kebijakan, Pengetahuan, SOP, Mini Apps, FAQ, Lampiran.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => downloadEbook("html")}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                    data-testid="button-download-ebook-html"
                  >
                    <BookOpen className="w-4 h-4 mr-1.5" /> Buka & Cetak PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadEbook("txt")}
                    title="Teks bersih tanpa simbol — siap tempel ke Word/Docs"
                    data-testid="button-download-ebook-txt"
                  >
                    <Download className="w-4 h-4 mr-1.5" /> .txt
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => downloadEbook("xlsx")}
                    className="flex-1"
                    title="Tabel Excel berisi semua field & materi — banyak sheet"
                    data-testid="button-download-ebook-xlsx"
                  >
                    <Download className="w-4 h-4 mr-1.5" /> Excel (.xlsx)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadEbook("csv")}
                    title="Format CSV universal untuk semua spreadsheet"
                    data-testid="button-download-ebook-csv"
                  >
                    <Download className="w-4 h-4 mr-1.5" /> .csv
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadEbook("md")}
                    title="Markdown asli (dengan simbol formatting)"
                    data-testid="button-download-ebook-md"
                  >
                    <Download className="w-4 h-4 mr-1.5" /> .md
                  </Button>
                </div>
                <div className="text-[11px] text-muted-foreground space-y-1">
                  <p><span className="font-semibold text-orange-700 dark:text-orange-400">PDF / TXT</span> → dokumen rapi (Word, Google Docs). <span className="font-semibold text-emerald-700 dark:text-emerald-400">Excel / CSV</span> → tabel field per sheet.</p>
                </div>
              </CardContent>
            </Card>

            {/* Chaesa AI Studio Bridge */}
            <Card className="border-violet-500/40 bg-gradient-to-br from-violet-50/40 to-transparent dark:from-violet-950/20">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <BookMarked className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">Chaesa AI Studio</h3>
                      <Badge className="bg-violet-500 hover:bg-violet-600">Bridge</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Petakan field chatbot ini ke <span className="font-medium text-violet-700 dark:text-violet-400">Proyek + Asisten Topik + GPT Builder + Mode Config</span> Chaesa AI Studio. Nilai dropdown sudah disesuaikan opsi resmi Chaesa.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => fetchChaesaMutation.mutate()}
                    disabled={fetchChaesaMutation.isPending}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                    data-testid="button-preview-chaesa"
                  >
                    {fetchChaesaMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-1.5" />
                    )}
                    Preview Field
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadChaesaJson}
                    data-testid="button-download-chaesa-json"
                  >
                    <Download className="w-4 h-4 mr-1.5" /> .json
                  </Button>
                </div>
                <div className="rounded-md bg-violet-100/60 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-800/40 p-2.5">
                  <p className="text-[11px] leading-relaxed text-violet-900 dark:text-violet-200">
                    <span className="font-semibold">⚡ Shortcut Auto-Fill:</span> Download eBook (HTML/Markdown) dari card di atas, lalu unggah di Chaesa → <span className="font-medium">Fondasi Ebook → Import</span>. Semua field otomatis terisi tanpa copy-paste manual.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ExternalLink className="w-3 h-3" />
                  <a
                    href="https://smart-ebook-builder-7-1.replit.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-700 dark:text-violet-400 hover:underline"
                    data-testid="link-chaesa-studio"
                  >
                    Buka Chaesa AI Studio →
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Konfigurasi JSON (utility export) */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileCode className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">Konfigurasi (JSON)</h3>
                      <Badge variant="outline">Utility</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Backup/migrasi seluruh setting chatbot ke chatbot lain via tab "Import → JSON".
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={downloadConfig} className="w-full" data-testid="button-download-config">
                  <Download className="w-4 h-4 mr-1.5" /> Download config.json
                </Button>
              </CardContent>
            </Card>

            {/* eCourse — now available */}
            <Card className="border-violet-500/40 bg-gradient-to-br from-violet-50/40 to-transparent dark:from-violet-950/20">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">eCourse Modul Belajar</h3>
                      <Badge className="bg-violet-500 hover:bg-violet-600">Tersedia</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Knowledge Base → Modul, sesi per materi, quiz dari conversation starters.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => { window.open(`/api/agents/${agent.id}/export/ecourse`, "_blank"); }}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                  data-testid="button-open-ecourse"
                >
                  <GraduationCap className="w-4 h-4 mr-1.5" /> Buka eCourse
                </Button>
              </CardContent>
            </Card>

            {/* DocGen — now available */}
            <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-50/40 to-transparent dark:from-emerald-950/20">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <FilePlus2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">Generator Dokumen</h3>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">Tersedia</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Template SOP, checklist, formulir, laporan — otomatis dari domain chatbot.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => { window.open(`/api/agents/${agent.id}/export/docgen`, "_blank"); }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  data-testid="button-open-docgen"
                >
                  <FilePlus2 className="w-4 h-4 mr-1.5" /> Buka Generator Dokumen
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ============ CHAESA AI STUDIO PREVIEW DIALOG ============ */}
      <Dialog open={chaesaOpen} onOpenChange={setChaesaOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-violet-600" />
              Chaesa AI Studio — Field Map
            </DialogTitle>
            <DialogDescription className="text-xs">
              Salin per-field ke form di{" "}
              <a
                href="https://smart-ebook-builder-7-1.replit.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 hover:underline"
              >
                smart-ebook-builder-7-1.replit.app
              </a>
              {" "}atau download bundle JSON untuk arsip/migrasi.
            </DialogDescription>
          </DialogHeader>

          {chaesaBundle ? (
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {chaesaBundle?.meta?.chaesaImportTab && (
                <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-3">
                  <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200" data-testid="text-chaesa-tip">
                    💡 {chaesaBundle.meta.chaesaImportTab}
                  </p>
                </div>
              )}
              {/* Group by section */}
              {Array.from(new Set(chaesaBundle.quickFill.map((f: any) => f.section))).map((sectionRaw) => {
                const section = String(sectionRaw);
                const items = chaesaBundle.quickFill.filter((f: any) => f.section === section);
                return (
                  <div key={section} className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground sticky top-0 bg-background py-1 border-b">
                      {section}
                    </h4>
                    <div className="space-y-2">
                      {items.map((f: any) => (
                        <div
                          key={f.field}
                          className="border border-border rounded-md p-3 bg-muted/30"
                          data-testid={`chaesa-field-${f.field}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-foreground">{f.label}</div>
                              <div className="text-[10px] font-mono text-muted-foreground">{f.field}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 shrink-0"
                              onClick={() => copyToClipboard(f.value, f.field)}
                              data-testid={`button-copy-${f.field}`}
                            >
                              {copiedKey === f.field ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <div className="text-xs text-foreground whitespace-pre-wrap break-words font-mono bg-background/60 rounded px-2 py-1.5 border border-border max-h-32 overflow-y-auto">
                            {f.value || <span className="text-muted-foreground italic">(kosong — isi manual di Chaesa)</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {chaesaBundle.knowledgeRefs?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground sticky top-0 bg-background py-1 border-b">
                    📂 Referensi Knowledge ({chaesaBundle.knowledgeRefs.length})
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Materi-materi ini sudah ter-rangkum di field <code className="text-violet-600">hasilRiset</code>. Jika butuh, upload manual ke Chaesa.
                  </p>
                  <ul className="text-xs space-y-1">
                    {chaesaBundle.knowledgeRefs.slice(0, 10).map((kb: any, i: number) => (
                      <li key={i} className="text-foreground">• {kb.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          <DialogFooter className="border-t pt-3 flex-row gap-2 sm:justify-between">
            <Button variant="outline" onClick={copyAllChaesa} data-testid="button-copy-all-chaesa">
              {copiedKey === "all" ? <Check className="w-4 h-4 mr-1.5 text-green-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
              Salin Semua
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={downloadChaesaJson} data-testid="button-dialog-download-chaesa">
                <Download className="w-4 h-4 mr-1.5" /> Download JSON
              </Button>
              <Button
                onClick={() => window.open("https://smart-ebook-builder-7-1.replit.app/", "_blank")}
                className="bg-violet-600 hover:bg-violet-700 text-white"
                data-testid="button-open-chaesa"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" /> Buka Chaesa
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
