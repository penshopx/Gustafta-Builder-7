import { useState, useRef, useEffect } from "react";
import { BookOpen, Plus, FileText, Link, Type, Trash2, Search, Upload, File, Image as ImageIcon, Pencil, Brain, RefreshCw, Loader2, Settings2, RotateCcw, Power } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useKnowledgeBases, useCreateKnowledgeBase, useDeleteKnowledgeBase, useUploadKnowledgeFile, useUpdateKnowledgeBase, useRagStats, useReprocessRag } from "@/hooks/use-knowledge-base";
import { useUpdateAgent } from "@/hooks/use-agents";
import type { KnowledgeBase } from "@shared/schema";
import type { Agent } from "@shared/schema";

interface KnowledgeBasePanelProps {
  agent: Agent;
}

const typeIcons = {
  text: Type,
  file: FileText,
  url: Link,
};

const typeLabels = {
  text: "Text Content",
  file: "File Upload",
  url: "Web URL",
};

const fileTypeLabels: Record<string, string> = {
  pdf: "PDF",
  ppt: "PowerPoint",
  pptx: "PowerPoint",
  xls: "Excel",
  xlsx: "Excel",
  doc: "Word",
  docx: "Word",
  txt: "Text",
  jpg: "Image",
  jpeg: "Image",
  png: "Image",
  gif: "Image",
  webp: "Image",
  other: "File",
};

const isImageType = (fileType?: string) => {
  return fileType && ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType);
};

export function KnowledgeBasePanel({ agent }: KnowledgeBasePanelProps) {
  const { toast } = useToast();
  const { data: knowledgeBases = [], isLoading } = useKnowledgeBases(agent.id);
  const createKnowledgeBase = useCreateKnowledgeBase();
  const deleteKnowledgeBase = useDeleteKnowledgeBase();
  const updateKnowledgeBase = useUpdateKnowledgeBase();
  const uploadFile = useUploadKnowledgeFile();
  const { data: ragStats } = useRagStats(agent.id);
  const reprocessRag = useReprocessRag();
  const updateAgent = useUpdateAgent();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [ragSettingsOpen, setRagSettingsOpen] = useState(false);
  const [ragChunkSize, setRagChunkSize] = useState(agent.ragChunkSize ?? 800);
  const [ragChunkOverlap, setRagChunkOverlap] = useState(agent.ragChunkOverlap ?? 200);
  const [ragTopK, setRagTopK] = useState(agent.ragTopK ?? 5);

  useEffect(() => {
    setRagChunkSize(agent.ragChunkSize ?? 800);
    setRagChunkOverlap(agent.ragChunkOverlap ?? 200);
    setRagTopK(agent.ragTopK ?? 5);
  }, [agent.id, agent.ragChunkSize, agent.ragChunkOverlap, agent.ragTopK]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeBase | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    type: "text" as "text" | "file" | "url",
    content: "",
    description: "",
    fileName: "",
    fileSize: 0,
    fileType: undefined as string | undefined,
    fileUrl: "",
  });
  const [editItem, setEditItem] = useState({
    name: "",
    content: "",
    description: "",
    fileName: "",
    fileSize: 0,
    fileType: undefined as string | undefined,
    fileUrl: "",
  });

  const filteredItems = knowledgeBases.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Format file tidak didukung. Gunakan PDF, PPT, Excel, Word, TXT, atau gambar (JPG, PNG, GIF, WebP).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 50MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await uploadFile.mutateAsync(file);
      setNewItem({
        ...newItem,
        name: newItem.name || file.name.replace(/\.[^/.]+$/, ""),
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType,
        fileUrl: result.fileUrl,
        content: result.fileUrl,
      });
      toast({
        title: "Berhasil",
        description: "File berhasil diupload",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupload file",
        variant: "destructive",
      });
    }
  };

  const handleCreate = () => {
    if (!newItem.name || !newItem.content) {
      toast({
        title: "Validation Error",
        description: "Mohon lengkapi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    createKnowledgeBase.mutate(
      {
        agentId: agent.id,
        name: newItem.name,
        type: newItem.type,
        content: newItem.content,
        description: newItem.description,
        fileName: newItem.fileName,
        fileSize: newItem.fileSize,
        fileType: newItem.fileType as any,
        fileUrl: newItem.fileUrl,
        processingStatus: "completed" as const,
        extractedText: "",
      },
      {
        onSuccess: () => {
          toast({
            title: "Knowledge Added",
            description: "Item knowledge base berhasil ditambahkan.",
          });
          setDialogOpen(false);
          setNewItem({
            name: "",
            type: "text",
            content: "",
            description: "",
            fileName: "",
            fileSize: 0,
            fileType: undefined,
            fileUrl: "",
          });
        },
        onError: (error: any) => {
          console.error("KB creation error:", error);
          toast({
            title: "Error",
            description: error?.message || "Gagal menambahkan item knowledge base.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteKnowledgeBase.mutate(
      { id, agentId: agent.id },
      {
        onSuccess: () => {
          toast({
            title: "Deleted",
            description: "Item knowledge base berhasil dihapus.",
          });
        },
      }
    );
  };

  const handleEdit = (item: KnowledgeBase) => {
    setEditingItem(item);
    setEditItem({
      name: item.name,
      content: item.content,
      description: item.description,
      fileName: item.fileName || "",
      fileSize: item.fileSize || 0,
      fileType: item.fileType,
      fileUrl: item.fileUrl || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Format file tidak didukung.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 50MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await uploadFile.mutateAsync(file);
      setEditItem({
        ...editItem,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType,
        fileUrl: result.fileUrl,
        content: result.fileUrl,
      });
      toast({
        title: "Berhasil",
        description: "File berhasil diupload",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupload file",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editItem.name) {
      toast({
        title: "Error",
        description: "Nama tidak boleh kosong.",
        variant: "destructive",
      });
      return;
    }

    updateKnowledgeBase.mutate(
      {
        id: editingItem.id,
        agentId: agent.id,
        data: {
          name: editItem.name,
          content: editItem.content,
          description: editItem.description,
          fileName: editItem.fileName,
          fileSize: editItem.fileSize,
          fileType: editItem.fileType as any,
          fileUrl: editItem.fileUrl,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Berhasil",
            description: "Item knowledge base berhasil diperbarui.",
          });
          setEditDialogOpen(false);
          setEditingItem(null);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Gagal memperbarui item.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Knowledge Base
          </h2>
          <p className="text-muted-foreground mt-1">
            Kelola informasi yang dapat diakses chatbot Anda
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={agent.ragEnabled !== false}
              onCheckedChange={(checked) => {
                updateAgent.mutate({ id: String(agent.id), data: { ragEnabled: checked } });
                toast({ title: checked ? "RAG Diaktifkan" : "RAG Dinonaktifkan", description: checked ? "Knowledge base akan digunakan dalam percakapan" : "Knowledge base tidak akan digunakan dalam percakapan" });
              }}
              data-testid="switch-rag-toggle"
            />
            <Badge variant={agent.ragEnabled !== false ? "default" : "secondary"} className="text-xs">
              {agent.ragEnabled !== false ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={agent.ragEnabled === false}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Knowledge
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Tambah Knowledge Base</DialogTitle>
              <DialogDescription>
                Tambahkan informasi baru untuk referensi chatbot
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="kb-name">Nama</Label>
                <Input
                  id="kb-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="FAQ Produk, Info Perusahaan, dll."
                 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kb-type">Tipe</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value: "text" | "file" | "url") =>
                    setNewItem({ ...newItem, type: value, content: "", fileName: "", fileSize: 0, fileType: undefined, fileUrl: "" })
                  }
                >
                  <SelectTrigger id="kb-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Content</SelectItem>
                    <SelectItem value="file">Upload File (PDF, PPT, Excel, Word)</SelectItem>
                    <SelectItem value="url">Web URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newItem.type === "file" ? (
                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {newItem.fileName ? (
                      <div className="space-y-2">
                        <File className="w-10 h-10 mx-auto text-primary" />
                        <p className="font-medium">{newItem.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(newItem.fileSize)} - {fileTypeLabels[newItem.fileType || "other"]}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Ganti File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Drag & drop atau klik untuk upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, PPT, Excel, Word (Max 50MB)
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadFile.isPending}
                         
                        >
                          {uploadFile.isPending ? "Uploading..." : "Pilih File"}
                        </Button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.txt"
                      onChange={handleFileChange}
                     
                    />
                  </div>
                </div>
              ) : newItem.type === "url" ? (
                <div className="space-y-2">
                  <Label htmlFor="kb-content">URL</Label>
                  <Input
                    id="kb-content"
                    value={newItem.content}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    placeholder="https://..."
                   
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="kb-content">Content</Label>
                  <Textarea
                    id="kb-content"
                    value={newItem.content}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    placeholder="Masukkan konten knowledge..."
                    rows={6}
                   
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="kb-description">Deskripsi (Opsional)</Label>
                <Input
                  id="kb-description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Deskripsi singkat tentang knowledge ini"
                 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createKnowledgeBase.isPending || (newItem.type === "file" && !newItem.fileUrl)}
               
              >
                {createKnowledgeBase.isPending ? "Menambahkan..." : "Tambah Knowledge"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-kb"
        />
      </div>

      {ragStats && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">RAG (Retrieval Augmented Generation)</p>
                  <p className="text-xs text-muted-foreground">
                    {agent.ragEnabled !== false
                      ? `${ragStats.totalChunks} potongan dokumen dari ${ragStats.totalKnowledgeBases} knowledge base`
                      : "RAG dinonaktifkan untuk chatbot ini"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={agent.ragEnabled !== false ? "default" : "secondary"} data-testid="badge-rag-status">
                  {agent.ragEnabled !== false ? "Aktif" : "Nonaktif"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRagSettingsOpen(!ragSettingsOpen)}
                  data-testid="button-toggle-rag-settings"
                >
                  <Settings2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {ragSettingsOpen && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Ukuran Chunk (token)</Label>
                    <span className="text-sm font-medium text-muted-foreground">{ragChunkSize}</span>
                  </div>
                  <Slider
                    value={[ragChunkSize]}
                    min={200}
                    max={2000}
                    step={100}
                    onValueChange={([v]) => setRagChunkSize(v)}
                    data-testid="slider-chunk-size"
                  />
                  <p className="text-xs text-muted-foreground">Ukuran setiap potongan dokumen. Lebih besar = konteks lebih lengkap, lebih kecil = pencarian lebih presisi. Default: 800</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Overlap (token)</Label>
                    <span className="text-sm font-medium text-muted-foreground">{ragChunkOverlap}</span>
                  </div>
                  <Slider
                    value={[ragChunkOverlap]}
                    min={0}
                    max={500}
                    step={50}
                    onValueChange={([v]) => setRagChunkOverlap(v)}
                    data-testid="slider-chunk-overlap"
                  />
                  <p className="text-xs text-muted-foreground">Tumpang tindih antar potongan. Lebih besar = transisi lebih halus. Default: 200</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Hasil Pencarian (Top-K)</Label>
                    <span className="text-sm font-medium text-muted-foreground">{ragTopK}</span>
                  </div>
                  <Slider
                    value={[ragTopK]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={([v]) => setRagTopK(v)}
                    data-testid="slider-top-k"
                  />
                  <p className="text-xs text-muted-foreground">Jumlah potongan paling relevan yang diambil saat menjawab. Lebih banyak = konteks lebih luas. Default: 5</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="default"
                    onClick={() => {
                      updateAgent.mutate(
                        { id: agent.id, data: { ragChunkSize, ragChunkOverlap, ragTopK } },
                        {
                          onSuccess: () => {
                            const chunkSettingsChanged = ragChunkSize !== (agent.ragChunkSize ?? 800) || ragChunkOverlap !== (agent.ragChunkOverlap ?? 200);
                            if (chunkSettingsChanged && knowledgeBases.length > 0) {
                              toast({
                                title: "Pengaturan RAG disimpan",
                                description: "Ukuran chunk berubah. Klik tombol refresh pada setiap knowledge base untuk menerapkan pengaturan baru.",
                                duration: 8000,
                              });
                            } else {
                              toast({ title: "Pengaturan RAG disimpan", description: "Pengaturan berhasil diperbarui." });
                            }
                          },
                          onError: () => toast({ title: "Error", description: "Gagal menyimpan pengaturan.", variant: "destructive" }),
                        }
                      );
                    }}
                    disabled={updateAgent.isPending}
                    data-testid="button-save-rag-settings"
                  >
                    {updateAgent.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Simpan Pengaturan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRagChunkSize(800);
                      setRagChunkOverlap(200);
                      setRagTopK(5);
                    }}
                    data-testid="button-reset-rag-defaults"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Default
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">Belum Ada Knowledge Base</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Tidak ada item yang cocok dengan pencarian"
                : "Tambahkan informasi untuk referensi chatbot Anda"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setDialogOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Item Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const Icon = typeIcons[item.type];
            return (
              <Card key={item.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Show image thumbnail or icon */}
                      {isImageType(item.fileType) && item.fileUrl ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border">
                          <img 
                            src={item.fileUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-primary/10 flex items-center justify-center"><svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {isImageType(item.fileType) ? (
                            <ImageIcon className="w-5 h-5 text-primary" />
                          ) : (
                            <Icon className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <Badge variant="secondary" className="shrink-0">
                            {typeLabels[item.type]}
                          </Badge>
                          {item.fileType && (
                            <Badge variant="outline" className="shrink-0">
                              {fileTypeLabels[item.fileType] || item.fileType.toUpperCase()}
                            </Badge>
                          )}
                          {(() => {
                            const kbStat = ragStats?.chunksByKb?.find(s => s.kbId === item.id);
                            if (!kbStat) return null;
                            if (item.processingStatus === "processing" || kbStat.processingStatus === "processing") {
                              return (
                                <Badge variant="outline" className="shrink-0 text-yellow-600" data-testid={`badge-processing-${item.id}`}>
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  Processing
                                </Badge>
                              );
                            }
                            if (kbStat.chunkCount > 0) {
                              return (
                                <Badge variant="outline" className="shrink-0" data-testid={`badge-chunks-${item.id}`}>
                                  <Brain className="w-3 h-3 mr-1" />
                                  {kbStat.chunkCount} chunks
                                </Badge>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {item.description}
                          </p>
                        )}
                        {item.fileName && (
                          <p className="text-xs text-muted-foreground">
                            {item.fileName} ({formatFileSize(item.fileSize)})
                          </p>
                        )}
                        {isImageType(item.fileType) && item.fileUrl && (
                          <a 
                            href={item.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Lihat gambar ukuran penuh
                          </a>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Ditambahkan {new Date(item.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          reprocessRag.mutate(
                            { id: item.id, agentId: agent.id },
                            {
                              onSuccess: () => toast({ title: "RAG diproses ulang", description: `"${item.name}" sedang diproses untuk pencarian cerdas.` }),
                              onError: () => toast({ title: "Error", description: "Gagal memproses ulang.", variant: "destructive" }),
                            }
                          );
                        }}
                        disabled={reprocessRag.isPending}
                        data-testid={`button-reprocess-${item.id}`}
                      >
                        <RefreshCw className={`w-4 h-4 text-muted-foreground ${reprocessRag.isPending ? "animate-spin" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                        data-testid={`button-edit-kb-${item.id}`}
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        data-testid={`button-delete-kb-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {knowledgeBases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Statistik Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{knowledgeBases.length}</div>
                <div className="text-xs text-muted-foreground">Total Item</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {knowledgeBases.filter((i) => i.type === "text").length}
                </div>
                <div className="text-xs text-muted-foreground">Text</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {knowledgeBases.filter((i) => i.type === "file").length}
                </div>
                <div className="text-xs text-muted-foreground">File</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {knowledgeBases.filter((i) => i.type === "url").length}
                </div>
                <div className="text-xs text-muted-foreground">URL</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Knowledge Base</DialogTitle>
            <DialogDescription>
              Perbarui informasi knowledge base
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-kb-name">Nama</Label>
              <Input
                id="edit-kb-name"
                value={editItem.name}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                placeholder="Nama item"
               
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-kb-description">Deskripsi</Label>
              <Input
                id="edit-kb-description"
                value={editItem.description}
                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                placeholder="Deskripsi singkat"
               
              />
            </div>
            {editingItem?.type === "text" && (
              <div className="space-y-2">
                <Label htmlFor="edit-kb-content">Konten</Label>
                <Textarea
                  id="edit-kb-content"
                  value={editItem.content}
                  onChange={(e) => setEditItem({ ...editItem, content: e.target.value })}
                  rows={6}
                  placeholder="Konten teks"
                 
                />
              </div>
            )}
            {editingItem?.type === "url" && (
              <div className="space-y-2">
                <Label htmlFor="edit-kb-url">URL</Label>
                <Input
                  id="edit-kb-url"
                  value={editItem.content}
                  onChange={(e) => setEditItem({ ...editItem, content: e.target.value })}
                  placeholder="https://example.com"
                 
                />
              </div>
            )}
            {editingItem?.type === "file" && (
              <div className="space-y-2">
                <Label>File Saat Ini</Label>
                {editItem.fileName ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    {isImageType(editItem.fileType) && editItem.fileUrl ? (
                      <img src={editItem.fileUrl} alt={editItem.fileName} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <File className="w-8 h-8 text-primary" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{editItem.fileName}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(editItem.fileSize)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada file</p>
                )}
                <div className="pt-2">
                  <input
                    ref={editFileInputRef}
                    type="file"
                    onChange={handleEditFileChange}
                    className="hidden"
                    accept=".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={uploadFile.isPending}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadFile.isPending ? "Mengupload..." : "Ganti File"}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              disabled={updateKnowledgeBase.isPending}
             
            >
              {updateKnowledgeBase.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
