import { useState, useRef, useEffect } from "react";
import { BookOpen, Plus, FileText, Link, Type, Trash2, Search, Upload, File, Image as ImageIcon, Pencil, Brain, RefreshCw, Loader2, Settings2, RotateCcw, Power, ExternalLink, Youtube, Cloud, Music, Video, Globe } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
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
import { useTaxonomy } from "@/hooks/use-taxonomy";
import type { KnowledgeBase, KnowledgeTaxonomyTreeNode } from "@shared/schema";
import type { Agent } from "@shared/schema";

interface KnowledgeBasePanelProps {
  agent: Agent;
}

const typeIcons: Record<string, any> = {
  text: Type,
  file: FileText,
  url: Globe,
  youtube: Youtube,
  cloud_drive: Cloud,
  video: Video,
  audio: Music,
};

const typeLabels: Record<string, string> = {
  text: "Teks",
  file: "Dokumen",
  url: "URL Web",
  youtube: "YouTube",
  cloud_drive: "Cloud Drive",
  video: "Video",
  audio: "Audio",
};

const typeColors: Record<string, string> = {
  text: "text-primary",
  file: "text-blue-500",
  url: "text-green-500",
  youtube: "text-red-500",
  cloud_drive: "text-sky-500",
  video: "text-purple-500",
  audio: "text-orange-500",
};

const fileTypeLabels: Record<string, string> = {
  pdf: "PDF",
  ppt: "PowerPoint", pptx: "PowerPoint",
  xls: "Excel", xlsx: "Excel",
  doc: "Word", docx: "Word",
  txt: "Text",
  jpg: "Image", jpeg: "Image", png: "Image", gif: "Image", webp: "Image",
  video_mp4: "MP4", video_webm: "WebM", video_mov: "MOV", video_avi: "AVI",
  audio_mp3: "MP3", audio_wav: "WAV", audio_m4a: "M4A", audio_aac: "AAC", audio_ogg: "OGG",
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

  // AI Generate state
  const [aiGenOpen, setAiGenOpen] = useState(false);
  const [aiGenTopic, setAiGenTopic] = useState("");
  const [aiGenDocType, setAiGenDocType] = useState("sop");
  const [aiGenLayer, setAiGenLayer] = useState<"foundational" | "operational" | "case_memory">("operational");
  const [aiGenLoading, setAiGenLoading] = useState(false);
  const [aiGenResult, setAiGenResult] = useState<{ title: string; content: string; layer: string; url?: string } | null>(null);
  const [aiGenPushNotion, setAiGenPushNotion] = useState(false);
  const [aiGenNotionParentId, setAiGenNotionParentId] = useState("");
  const [aiGenNotionPages, setAiGenNotionPages] = useState<Array<{ id: string; title: string }>>([]);
  const [aiGenNotionPagesLoading, setAiGenNotionPagesLoading] = useState(false);
  const [aiGenSaving, setAiGenSaving] = useState(false);
  const [aiGenDetailLevel, setAiGenDetailLevel] = useState<"ringkas" | "standar" | "lengkap">("standar");
  const [aiGenContext, setAiGenContext] = useState("");
  const [aiGenShowContext, setAiGenShowContext] = useState(false);

  // Notion AI inline actions on KB items
  const [kbAiActionItem, setKbAiActionItem] = useState<KnowledgeBase | null>(null);
  const [kbAiActionOpen, setKbAiActionOpen] = useState(false);
  const [kbAiAction, setKbAiAction] = useState("improve");
  const [kbAiActionLanguage, setKbAiActionLanguage] = useState("Bahasa Indonesia");
  const [kbAiActionLoading, setKbAiActionLoading] = useState(false);
  const [kbAiActionResult, setKbAiActionResult] = useState("");
  const [kbAiActionSaving, setKbAiActionSaving] = useState(false);
  const [kbAiActionCustomPrompt, setKbAiActionCustomPrompt] = useState("");
  const [kbAiActionView, setKbAiActionView] = useState<"split" | "result">("split");

  // Notion import AI enhancement
  const [notionImportAiEnhance, setNotionImportAiEnhance] = useState(false);
  const [notionImportAiAction, setNotionImportAiAction] = useState("improve");

  // KB → Notion sync
  const [notionSyncItem, setNotionSyncItem] = useState<KnowledgeBase | null>(null);
  const [notionSyncOpen, setNotionSyncOpen] = useState(false);
  const [notionSyncLoading, setNotionSyncLoading] = useState(false);
  const [notionSyncPages, setNotionSyncPages] = useState<Array<{ id: string; title: string }>>([]);
  const [notionSyncPagesLoading, setNotionSyncPagesLoading] = useState(false);
  const [notionSyncParentId, setNotionSyncParentId] = useState("");
  const [notionSyncFilter, setNotionSyncFilter] = useState("");
  const [notionSyncDone, setNotionSyncDone] = useState<{ url: string; title: string } | null>(null);

  // Notion import state
  const [notionImportOpen, setNotionImportOpen] = useState(false);
  const [notionBrowseTab, setNotionBrowseTab] = useState<"browse" | "search">("browse");
  const [notionSearchQuery, setNotionSearchQuery] = useState("");
  const [notionPages, setNotionPages] = useState<Array<{ id: string; title: string; url: string; lastEdited: string }>>([]);
  const [notionSearchLoading, setNotionSearchLoading] = useState(false);
  const [notionAllPages, setNotionAllPages] = useState<Array<{ id: string; title: string; url: string; lastEdited: string }>>([]);
  const [notionBrowseLoading, setNotionBrowseLoading] = useState(false);
  const [notionBrowseFilter, setNotionBrowseFilter] = useState("");
  const [notionImportingId, setNotionImportingId] = useState<string | null>(null);
  const [notionImportLayer, setNotionImportLayer] = useState<"foundational" | "operational" | "case_memory">("operational");
  const [newItem, setNewItem] = useState({
    name: "",
    type: "text" as "text" | "file" | "url" | "youtube" | "cloud_drive" | "video" | "audio",
    content: "",
    description: "",
    fileName: "",
    fileSize: 0,
    fileType: undefined as string | undefined,
    fileUrl: "",
    knowledgeLayer: "operational" as "foundational" | "operational" | "case_memory",
    // Hierarki + atribusi sumber primer + versioning.
    taxonomyId: null as number | null,
    sourceUrl: "",
    sourceAuthority: "" as "" | "PUPR" | "LKPP" | "DJP" | "BNSP" | "LPJK" | "BSN" | "DJBC" | "Kemnaker" | "BPJS_Ketenagakerjaan" | "JDIH" | "internal" | "lainnya",
    effectiveDate: "",
    isShared: false,
  });
  const [editItem, setEditItem] = useState({
    name: "",
    content: "",
    description: "",
    fileName: "",
    fileSize: 0,
    fileType: undefined as string | undefined,
    fileUrl: "",
    knowledgeLayer: "operational" as "foundational" | "operational" | "case_memory",
  });

  const filteredItems = knowledgeBases.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const docTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg", "image/png", "image/gif", "image/webp",
    ];
    const videoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    const audioTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/aac", "audio/ogg", "audio/m4a", "audio/mp4", "audio/x-m4a"];
    const allowedTypes = [...docTypes, ...videoTypes, ...audioTypes];

    if (!allowedTypes.includes(file.type) && !file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      toast({
        title: "Error",
        description: "Format tidak didukung. Gunakan PDF, Word, Excel, PPT, video (MP4, WebM), atau audio (MP3, WAV, M4A).",
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
        knowledgeLayer: newItem.knowledgeLayer,
        // Field hierarki & atribusi sumber primer (opsional, semua nullable di backend).
        taxonomyId: newItem.taxonomyId ?? undefined,
        sourceUrl: newItem.sourceUrl || undefined,
        sourceAuthority: newItem.sourceAuthority || undefined,
        effectiveDate: newItem.effectiveDate || undefined,
        isShared: newItem.isShared,
      } as any,
      {
        onSuccess: () => {
          toast({
            title: "Knowledge Ditambahkan",
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
            knowledgeLayer: "operational",
            taxonomyId: null,
            sourceUrl: "",
            sourceAuthority: "",
            effectiveDate: "",
            isShared: false,
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
            title: "Berhasil Dihapus",
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
      knowledgeLayer: ((item as any).knowledgeLayer || "operational") as "foundational" | "operational" | "case_memory",
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
          knowledgeLayer: editItem.knowledgeLayer,
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

  const handleOpenAiGen = async () => {
    setAiGenOpen(true);
    setAiGenResult(null);
    setAiGenTopic("");
    if (aiGenNotionPages.length === 0) {
      setAiGenNotionPagesLoading(true);
      try {
        const res = await fetch("/api/notion/pages", { credentials: "include" });
        const data = await res.json();
        const pages = (data.results || []).map((p: any) => {
          const titleProp = Object.values(p.properties || {}).find((v: any) => v.type === "title") as any;
          const title = titleProp?.title?.map((t: any) => t.plain_text).join("") || "(Tanpa Judul)";
          return { id: p.id, title };
        });
        setAiGenNotionPages(pages);
        if (pages.length > 0) setAiGenNotionParentId(pages[0].id);
      } catch {
        // Notion not available - that's ok
      } finally {
        setAiGenNotionPagesLoading(false);
      }
    }
  };

  const handleAiGenerate = async () => {
    if (!aiGenTopic.trim()) {
      toast({ title: "Topik kosong", description: "Masukkan topik dokumen yang ingin di-generate.", variant: "destructive" });
      return;
    }
    setAiGenLoading(true);
    setAiGenResult(null);
    try {
      const res = await apiRequest("POST", "/api/notion/ai-generate", {
        topic: aiGenTopic,
        documentType: aiGenDocType,
        layer: aiGenLayer,
        agentId: agent.id,
        detailLevel: aiGenDetailLevel,
        additionalContext: aiGenContext || undefined,
        notionParentId: aiGenPushNotion && aiGenNotionParentId ? aiGenNotionParentId : undefined,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiGenResult(data);
      if (data.url) {
        toast({ title: "Berhasil di-generate + Push ke Notion", description: `Halaman "${data.title}" dibuat di Notion.` });
      } else {
        toast({ title: "Dokumen berhasil di-generate", description: "Review konten lalu simpan ke Knowledge Base." });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Gagal generate dokumen.", variant: "destructive" });
    } finally {
      setAiGenLoading(false);
    }
  };

  const handleAiGenSaveToKb = () => {
    if (!aiGenResult) return;
    setAiGenSaving(true);
    createKnowledgeBase.mutate(
      {
        agentId: agent.id,
        name: aiGenResult.title,
        type: "text",
        content: aiGenResult.content,
        description: `AI-generated · ${aiGenDocType.replace(/_/g, " ")} · ${aiGenLayer}`,
        knowledgeLayer: aiGenLayer,
      },
      {
        onSuccess: () => {
          toast({ title: "Disimpan ke Knowledge Base", description: `"${aiGenResult.title}" berhasil ditambahkan.` });
          setAiGenSaving(false);
          setAiGenResult(null);
          setAiGenOpen(false);
        },
        onError: () => {
          toast({ title: "Error", description: "Gagal menyimpan ke Knowledge Base.", variant: "destructive" });
          setAiGenSaving(false);
        },
      }
    );
  };

  // KB → Notion AI inline action handlers
  const handleOpenKbAiAction = (item: KnowledgeBase) => {
    setKbAiActionItem(item);
    setKbAiAction("improve");
    setKbAiActionResult("");
    setKbAiActionCustomPrompt("");
    setKbAiActionView("split");
    setKbAiActionOpen(true);
  };

  const handleRunKbAiAction = async () => {
    if (!kbAiActionItem) return;
    setKbAiActionLoading(true);
    setKbAiActionResult("");
    setKbAiActionView("split");
    try {
      const res = await apiRequest("POST", "/api/kb/ai-action", {
        content: kbAiActionItem.content || "",
        action: kbAiAction,
        language: kbAiActionLanguage,
        customPrompt: kbAiAction === "custom" ? kbAiActionCustomPrompt : undefined,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setKbAiActionResult(data.result);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Gagal menjalankan AI action.", variant: "destructive" });
    } finally {
      setKbAiActionLoading(false);
    }
  };

  const handleSaveKbAiAction = (replaceOrAppend: "replace" | "append") => {
    if (!kbAiActionItem || !kbAiActionResult) return;
    setKbAiActionSaving(true);
    const newContent = replaceOrAppend === "replace"
      ? kbAiActionResult
      : (kbAiActionItem.content || "") + "\n\n---\n\n" + kbAiActionResult;
    updateKnowledgeBase.mutate(
      { id: kbAiActionItem.id, data: { content: newContent } },
      {
        onSuccess: () => {
          toast({ title: "Konten diperbarui", description: `"${kbAiActionItem.name}" diperbarui dengan hasil AI.` });
          setKbAiActionSaving(false);
          setKbAiActionOpen(false);
          setKbAiActionResult("");
        },
        onError: () => {
          toast({ title: "Error", description: "Gagal menyimpan.", variant: "destructive" });
          setKbAiActionSaving(false);
        },
      }
    );
  };

  // KB → Notion sync handlers
  const handleOpenNotionSync = async (item: KnowledgeBase) => {
    setNotionSyncItem(item);
    setNotionSyncDone(null);
    setNotionSyncOpen(true);
    if (notionSyncPages.length === 0) {
      setNotionSyncPagesLoading(true);
      try {
        const res = await fetch("/api/notion/pages", { credentials: "include" });
        const data = await res.json();
        const pages = (data.results || []).map((p: any) => {
          const titleProp = Object.values(p.properties || {}).find((v: any) => v.type === "title") as any;
          const title = titleProp?.title?.map((t: any) => t.plain_text).join("") || "(Tanpa Judul)";
          return { id: p.id, title };
        });
        setNotionSyncPages(pages);
        if (pages.length > 0) setNotionSyncParentId(pages[0].id);
      } catch {
        // ok
      } finally {
        setNotionSyncPagesLoading(false);
      }
    }
  };

  const handleRunNotionSync = async () => {
    if (!notionSyncItem || !notionSyncParentId) return;
    setNotionSyncLoading(true);
    try {
      const res = await apiRequest("POST", "/api/notion/export", {
        parentPageId: notionSyncParentId,
        title: notionSyncItem.name,
        content: notionSyncItem.content || `Konten KB: ${notionSyncItem.name}\n\n${notionSyncItem.description || ""}`,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNotionSyncDone({ url: data.url, title: notionSyncItem.name });
      toast({ title: "Berhasil disinkronkan ke Notion", description: `"${notionSyncItem.name}" telah dibuat sebagai halaman Notion.` });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Gagal sinkronisasi ke Notion.", variant: "destructive" });
    } finally {
      setNotionSyncLoading(false);
    }
  };

  const handleNotionSearch = async () => {
    setNotionSearchLoading(true);
    try {
      const res = await apiRequest("POST", "/api/notion/search", {
        query: notionSearchQuery,
        type: "page",
      });
      const data = await res.json();
      const pages = (data.results || []).map((p: any) => {
        const titleProp = Object.values(p.properties || {}).find((v: any) => v.type === "title") as any;
        const title = titleProp?.title?.map((t: any) => t.plain_text).join("") || p.id;
        return {
          id: p.id,
          title,
          url: p.url || "",
          lastEdited: p.last_edited_time ? new Date(p.last_edited_time).toLocaleDateString("id-ID") : "",
        };
      });
      setNotionPages(pages);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Gagal mencari halaman Notion.", variant: "destructive" });
    } finally {
      setNotionSearchLoading(false);
    }
  };

  const handleLoadAllNotionPages = async (force = false) => {
    if (!force && notionAllPages.length > 0) return; // already loaded
    setNotionBrowseLoading(true);
    setNotionAllPages([]);
    try {
      const res = await apiRequest("GET", "/api/notion/pages");
      const data = await res.json();
      const pages = (data.results || []).map((p: any) => {
        const titleProp = Object.values(p.properties || {}).find((v: any) => v.type === "title") as any;
        const title = titleProp?.title?.map((t: any) => t.plain_text).join("") || "(Tanpa Judul)";
        return {
          id: p.id,
          title,
          url: p.url || "",
          lastEdited: p.last_edited_time ? new Date(p.last_edited_time).toLocaleDateString("id-ID") : "",
        };
      });
      setNotionAllPages(pages);
    } catch (e: any) {
      toast({ title: "Error", description: "Gagal memuat daftar halaman Notion.", variant: "destructive" });
    } finally {
      setNotionBrowseLoading(false);
    }
  };

  const handleNotionImportPage = async (page: { id: string; title: string; url: string }) => {
    setNotionImportingId(page.id);
    try {
      const contentRes = await apiRequest("GET", `/api/notion/page/${page.id}/content`);
      const data = await contentRes.json();
      if (data.error) throw new Error(data.error);

      let finalContent = data.content || "(konten kosong)";
      let descSuffix = "";

      // AI enhancement before saving
      if (notionImportAiEnhance && finalContent.length > 50) {
        toast({ title: "Memproses dengan AI...", description: `Sedang ${notionImportAiAction === "improve" ? "memperbaiki" : notionImportAiAction === "summarize" ? "meringkas" : "menerjemahkan"} konten...` });
        try {
          const aiRes = await apiRequest("POST", "/api/kb/ai-action", {
            content: finalContent,
            action: notionImportAiAction,
            language: "Bahasa Indonesia",
          });
          const aiData = await aiRes.json();
          if (aiData.result) {
            finalContent = aiData.result;
            descSuffix = ` · AI-enhanced (${notionImportAiAction})`;
          }
        } catch {
          // fallback to original content if AI fails
        }
      }

      createKnowledgeBase.mutate(
        {
          agentId: agent.id,
          name: data.title || page.title,
          type: "text",
          content: finalContent,
          description: `Import dari Notion — ${page.url}${descSuffix}`,
          knowledgeLayer: notionImportLayer,
        },
        {
          onSuccess: () => {
            toast({ title: "Berhasil Diimpor", description: `"${data.title || page.title}" berhasil ditambahkan ke Knowledge Base.` });
            setNotionImportingId(null);
          },
          onError: () => {
            toast({ title: "Error", description: "Gagal menyimpan konten ke Knowledge Base.", variant: "destructive" });
            setNotionImportingId(null);
          },
        }
      );
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Gagal mengambil konten halaman Notion.", variant: "destructive" });
      setNotionImportingId(null);
    }
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
          {/* AI Generate + Notion Dialog */}
          {(() => {
            const NOTION_ICON = (
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
              </svg>
            );

            const QUICK_TOPICS: Record<string, string[]> = {
              sop: [
                "SOP Persiapan Uji PBJP LKPP Level 1 (H-14 s.d. H-1)",
                "SOP Diagnostik Awal & Tryout 30 Soal PBJP",
                "SOP Latihan Harian 45 Menit PBJP (Konsep → Soal → Review)",
                "SOP Simulasi 90 Menit Uji Kompetensi PBJP",
                "SOP Menyusun HPS Secara Naratif",
                "SOP Menanggapi Sanggah dalam PBJP",
                "SOP Final Review H-1 Uji Kompetensi PBJP",
              ],
              template: [
                "Template Mapping Bukti Portofolio PBJP (Bukti → Kompetensi → Narasi)",
                "Template Error Log Latihan PBJP (Salah Konsep vs Salah Teliti)",
                "Template Narasi Bukti dengan Format STAR Versi Pengadaan",
                "Template Ringkasan Portofolio 1 Halaman PBJP Level 1",
                "Template Evaluasi Dokumen Penawaran",
              ],
              bank_soal: [
                "Bank Soal Prinsip & Etika Pengadaan PBJP (50 soal + pembahasan)",
                "Bank Soal Perencanaan Pengadaan PBJP (50 soal + pembahasan)",
                "Bank Soal Pemilihan Penyedia PBJP (50 soal + pembahasan)",
                "Bank Soal Kontrak & Pelaksanaan PBJP (50 soal + pembahasan)",
                "Paket Tryout Campuran PBJP Level 1 (30 soal)",
              ],
              studi_kasus: [
                "Studi Kasus: Spesifikasi Diskriminatif → Langkah Perbaikan",
                "Studi Kasus: HPS Tidak Wajar → Koreksi & Dokumen",
                "Studi Kasus: Evaluasi Penyedia Bermasalah → BA yang Benar",
                "Studi Kasus: Perubahan Kontrak → Dokumen & Manajemen Risiko",
                "Contoh Jawaban Essay PBJP Baik vs Kurang + Anotasi",
              ],
              checklist: [
                "Checklist Dokumen Perencanaan Pengadaan (siap audit)",
                "Checklist Dokumen Pemilihan Penyedia (siap audit)",
                "Checklist Dokumen Kontrak & Adendum (siap audit)",
                "Checklist Pelaksanaan & Serah Terima (siap audit)",
                "Checklist Kelengkapan Portofolio PBJP Level 1",
              ],
              rubrik: [
                "Rubrik Penilaian Essay PBJP (skor 0–4 per kriteria)",
                "Rubrik Studi Kasus PBJP (Masalah → Aturan → Langkah → Output)",
                "Rubrik Penilaian Portofolio Bukti PBJP Level 1",
              ],
              cheat_sheet: [
                "Cheat Sheet PBJP Level 1 — Semua Materi (1 Halaman)",
                "Cheat Sheet Prinsip & Etika Pengadaan",
                "Cheat Sheet Dokumen Kunci per Tahap Pengadaan",
                "Cheat Sheet Jebakan Umum Peserta PBJP + Solusi",
              ],
              narasi_portofolio: [
                "Narasi Portofolio: Pengalaman Perencanaan Pengadaan (STAR)",
                "Narasi Portofolio: Pengalaman Evaluasi & Pemilihan Penyedia",
                "Narasi Portofolio: Pengalaman Pelaksanaan & Pengawasan Kontrak",
                "Panduan Menulis Narasi Bukti Siap Asesor PBJP",
              ],
              custom: [],
            };

            const chips = QUICK_TOPICS[aiGenDocType] || [];

            // Simple markdown → HTML renderer
            function mdToHtml(md: string): string {
              return md
                .split("\n")
                .map((line) => {
                  if (/^# /.test(line)) return `<h1 style="font-size:14px;font-weight:700;margin:10px 0 4px">${escHtml(line.slice(2))}</h1>`;
                  if (/^## /.test(line)) return `<h2 style="font-size:13px;font-weight:600;margin:8px 0 3px">${escHtml(line.slice(3))}</h2>`;
                  if (/^### /.test(line)) return `<h3 style="font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;opacity:.7;margin:6px 0 2px">${escHtml(line.slice(4))}</h3>`;
                  if (/^\[[ xX]\]\s/.test(line)) {
                    const chk = /^\[x\]/i.test(line);
                    return `<div style="display:flex;gap:5px;font-size:11px;line-height:1.5;margin:2px 0">${chk ? "☑" : "☐"} ${inlineMd(line.slice(4))}</div>`;
                  }
                  if (/^\d+\.\s/.test(line)) return `<div style="font-size:11px;margin-left:12px;line-height:1.5;margin-top:2px">${inlineMd(line)}</div>`;
                  if (/^[•\-\*]\s/.test(line)) return `<div style="font-size:11px;margin-left:12px;line-height:1.5;margin-top:2px">• ${inlineMd(line.slice(2))}</div>`;
                  if (/^> /.test(line)) return `<div style="font-size:11px;border-left:2px solid currentColor;padding-left:8px;opacity:.7;margin:3px 0">${inlineMd(line.slice(2))}</div>`;
                  if (/^-{3,}$/.test(line.trim())) return `<hr style="margin:8px 0;opacity:.2"/>`;
                  if (/^\|.+\|$/.test(line)) {
                    if (/^\|[-:\s|]+\|$/.test(line)) return "";
                    const cells = line.split("|").filter(c => c.trim()).map(c => `<td style="font-size:11px;padding:2px 6px;border:1px solid rgba(128,128,128,.2)">${inlineMd(c.trim())}</td>`).join("");
                    return `<tr>${cells}</tr>`;
                  }
                  if (!line.trim()) return `<div style="height:5px"/>`;
                  return `<p style="font-size:11px;line-height:1.6;margin:2px 0">${inlineMd(line)}</p>`;
                })
                .join("");
            }
            function escHtml(s: string) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
            function inlineMd(s: string) {
              return escHtml(s)
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.+?)\*/g, "<em>$1</em>")
                .replace(/`(.+?)`/g, '<code style="background:rgba(128,128,128,.15);padding:0 3px;border-radius:3px;font-size:10px">$1</code>');
            }

            const wordCount = aiGenResult ? aiGenResult.content.split(/\s+/).filter(Boolean).length : 0;
            const readMin = Math.ceil(wordCount / 200);

            return (
              <Dialog open={aiGenOpen} onOpenChange={(open) => { setAiGenOpen(open); if (!open) { setAiGenResult(null); setAiGenContext(""); setAiGenShowContext(false); } }}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleOpenAiGen} disabled={agent.ragEnabled === false} data-testid="button-ai-gen-kb">
                    ✦ Generate dengan AI
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-2xl max-h-[92vh] flex flex-col gap-0 p-0">
                  {/* Header */}
                  <div className="shrink-0 px-6 pt-6 pb-4 border-b">
                    <DialogTitle className="text-base flex items-center gap-2 mb-1">
                      ✦ Generate Dokumen KB dengan AI
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Pilih tipe dokumen, isi topik, dan AI akan membuat dokumen terstruktur siap-pakai — lalu simpan ke KB dan/atau push ke Notion.
                    </DialogDescription>
                  </div>

                  {/* Scrollable body */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

                    {/* --- Row 1: Tipe Dokumen + Layer --- */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Tipe Dokumen</Label>
                        <Select value={aiGenDocType} onValueChange={(v) => { setAiGenDocType(v); setAiGenTopic(""); }} >
                          <SelectTrigger className="h-9 text-sm" data-testid="select-ai-gen-doctype">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sop">📋 SOP — Prosedur Operasional</SelectItem>
                            <SelectItem value="template">📄 Template / Form</SelectItem>
                            <SelectItem value="bank_soal">📝 Bank Soal + Pembahasan</SelectItem>
                            <SelectItem value="studi_kasus">🔍 Studi Kasus</SelectItem>
                            <SelectItem value="checklist">✅ Checklist Audit</SelectItem>
                            <SelectItem value="rubrik">📊 Rubrik Penilaian</SelectItem>
                            <SelectItem value="cheat_sheet">⚡ Cheat Sheet</SelectItem>
                            <SelectItem value="narasi_portofolio">🎯 Narasi Portofolio (STAR)</SelectItem>
                            <SelectItem value="custom">✏️ Custom (bebas)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Lapisan Knowledge</Label>
                        <Select value={aiGenLayer} onValueChange={(v) => setAiGenLayer(v as any)}>
                          <SelectTrigger className="h-9 text-sm" data-testid="select-ai-gen-layer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="foundational">🔵 Foundational — referensi tetap</SelectItem>
                            <SelectItem value="operational">🟢 Operational — prosedur aktif</SelectItem>
                            <SelectItem value="case_memory">🟣 Case Memory — kasus & preseden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* --- Row 2: Quick topic chips --- */}
                    {chips.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Topik cepat (klik untuk pilih)</Label>
                        <div className="flex flex-wrap gap-1.5">
                          {chips.map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => setAiGenTopic(chip)}
                              className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                                aiGenTopic === chip
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background hover:bg-muted border-border text-foreground"
                              }`}
                              data-testid={`chip-topic-${chips.indexOf(chip)}`}
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* --- Row 3: Topik input --- */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Topik Dokumen <span className="text-destructive">*</span></Label>
                      <Textarea
                        value={aiGenTopic}
                        onChange={(e) => setAiGenTopic(e.target.value)}
                        placeholder={aiGenDocType === "bank_soal"
                          ? "Contoh: Bank Soal Prinsip & Etika Pengadaan PBJP Level 1 (50 soal pilihan ganda + pembahasan)"
                          : aiGenDocType === "studi_kasus"
                          ? "Contoh: Studi Kasus HPS tidak wajar — langkah koreksi dan dokumen yang harus disiapkan"
                          : aiGenDocType === "checklist"
                          ? "Contoh: Checklist dokumen perencanaan pengadaan siap audit internal dan BPKP"
                          : "Deskripsikan topik dokumen yang ingin di-generate secara spesifik..."
                        }
                        rows={2}
                        className="resize-none text-sm"
                        data-testid="textarea-ai-gen-topic"
                      />
                      {aiGenTopic && (
                        <p className="text-xs text-muted-foreground text-right">{aiGenTopic.length} karakter</p>
                      )}
                    </div>

                    {/* --- Row 4: Level detail --- */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Level Detail</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["ringkas", "standar", "lengkap"] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setAiGenDetailLevel(lvl)}
                            className={`rounded-lg border px-3 py-2.5 text-center transition-all cursor-pointer ${
                              aiGenDetailLevel === lvl
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-background hover:bg-muted text-foreground"
                            }`}
                            data-testid={`button-detail-${lvl}`}
                          >
                            <div className="text-sm font-semibold capitalize">{lvl === "ringkas" ? "⚡ Ringkas" : lvl === "standar" ? "📄 Standar" : "📚 Lengkap"}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {lvl === "ringkas" ? "~400 kata, poin utama" : lvl === "standar" ? "~700 kata, siap pakai" : "Sangat detail, semua section"}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* --- Row 5: Konteks tambahan (collapsible) --- */}
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => setAiGenShowContext(!aiGenShowContext)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <span className={`transition-transform ${aiGenShowContext ? "rotate-90" : ""}`}>▶</span>
                        Konteks tambahan (opsional)
                        {aiGenContext && <span className="text-primary">● diisi</span>}
                      </button>
                      {aiGenShowContext && (
                        <Textarea
                          value={aiGenContext}
                          onChange={(e) => setAiGenContext(e.target.value)}
                          placeholder="Contoh: Khusus untuk peserta PBJP yang sudah berpengalaman di pemilihan penyedia.&#10;Contoh: Fokus pada pengadaan langsung nilai < 200 juta.&#10;Contoh: Sesuaikan dengan peraturan terbaru PP 16/2018."
                          rows={3}
                          className="resize-none text-xs"
                          data-testid="textarea-ai-gen-context"
                        />
                      )}
                    </div>

                    {/* --- Row 6: Notion push option --- */}
                    <div className="rounded-lg border p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="flex items-center gap-1.5 text-sm">
                            {NOTION_ICON}
                            Push ke Notion sekaligus
                          </Label>
                          <p className="text-xs text-muted-foreground">Halaman Notion dibuat otomatis saat generate, dengan struktur blok yang rapi.</p>
                        </div>
                        <Switch checked={aiGenPushNotion} onCheckedChange={setAiGenPushNotion} data-testid="switch-ai-gen-push-notion" />
                      </div>
                      {aiGenPushNotion && (
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Simpan sebagai sub-halaman di bawah:</Label>
                          {aiGenNotionPagesLoading ? (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> Memuat halaman Notion...
                            </div>
                          ) : aiGenNotionPages.length === 0 ? (
                            <p className="text-xs text-amber-600 dark:text-amber-400">Tidak ada halaman Notion yang dapat diakses. Pastikan Notion sudah terkoneksi.</p>
                          ) : (
                            <Select value={aiGenNotionParentId} onValueChange={setAiGenNotionParentId}>
                              <SelectTrigger className="h-8 text-sm" data-testid="select-ai-gen-notion-parent">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {aiGenNotionPages.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      )}
                    </div>

                    {/* --- Generate button --- */}
                    <Button
                      onClick={handleAiGenerate}
                      disabled={aiGenLoading || !aiGenTopic.trim()}
                      className="w-full h-10 text-sm font-semibold"
                      data-testid="button-run-ai-gen"
                    >
                      {aiGenLoading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />AI sedang membuat dokumen{aiGenPushNotion ? " + push ke Notion" : ""}...</>
                      ) : aiGenResult ? (
                        <>↺ Generate Ulang</>
                      ) : (
                        <>✦ Generate Dokumen</>
                      )}
                    </Button>

                    {/* --- Result preview --- */}
                    {aiGenResult && (
                      <div className="space-y-3 border rounded-xl overflow-hidden">
                        {/* Result meta header */}
                        <div className="px-4 pt-3 pb-2 bg-muted/30 border-b flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{aiGenResult.title}</p>
                            <div className="flex items-center flex-wrap gap-2 mt-1.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                                aiGenResult.layer === "foundational" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800" :
                                aiGenResult.layer === "case_memory" ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800" :
                                "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                              }`}>{aiGenResult.layer}</span>
                              <span className="text-xs text-muted-foreground">
                                {wordCount.toLocaleString()} kata · ±{readMin} menit baca
                              </span>
                              {aiGenResult.url && (
                                <a
                                  href={aiGenResult.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  {NOTION_ICON} Buka di Notion
                                </a>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 h-7 text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText(aiGenResult!.content);
                              toast({ title: "Disalin!", description: "Konten disalin ke clipboard." });
                            }}
                            data-testid="button-ai-gen-copy"
                          >
                            Salin
                          </Button>
                        </div>

                        {/* Rendered markdown preview */}
                        <div
                          className="px-4 pb-4 max-h-72 overflow-y-auto text-foreground"
                          dangerouslySetInnerHTML={{ __html: mdToHtml(aiGenResult.content) }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="shrink-0 px-6 py-4 border-t flex items-center justify-between gap-3">
                    <Button variant="ghost" size="sm" onClick={() => { setAiGenOpen(false); setAiGenResult(null); setAiGenContext(""); setAiGenShowContext(false); }}>
                      Tutup
                    </Button>
                    {aiGenResult && (
                      <div className="flex items-center gap-2">
                        {!aiGenResult.url && aiGenPushNotion && aiGenNotionParentId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                const r = await apiRequest("POST", "/api/notion/export", {
                                  parentPageId: aiGenNotionParentId,
                                  title: aiGenResult.title,
                                  content: aiGenResult.content,
                                });
                                const d = await r.json();
                                if (d.url) {
                                  setAiGenResult({ ...aiGenResult, url: d.url });
                                  toast({ title: "Berhasil push ke Notion", description: aiGenResult.title });
                                }
                              } catch {
                                toast({ title: "Error", description: "Gagal push ke Notion", variant: "destructive" });
                              }
                            }}
                            data-testid="button-ai-gen-push-notion-manual"
                          >
                            {NOTION_ICON}
                            <span className="ml-1.5">Push ke Notion</span>
                          </Button>
                        )}
                        <Button
                          onClick={handleAiGenSaveToKb}
                          disabled={aiGenSaving || createKnowledgeBase.isPending}
                          size="sm"
                          data-testid="button-ai-gen-save-kb"
                        >
                          {aiGenSaving ? <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />Menyimpan...</> : "Simpan ke Knowledge Base"}
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            );
          })()}

          {/* === KB AI Action Dialog (Notion AI-style inline editing) === */}
          <Dialog open={kbAiActionOpen} onOpenChange={(o) => { setKbAiActionOpen(o); if (!o) { setKbAiActionResult(""); setKbAiActionItem(null); } }}>
            <DialogContent className="sm:max-w-3xl max-h-[92vh] flex flex-col gap-0 p-0">
              <div className="shrink-0 px-6 pt-5 pb-4 border-b">
                <DialogTitle className="text-base flex items-center gap-2">
                  ✦ Aksi AI pada Knowledge Base
                  {kbAiActionItem && <span className="text-sm font-normal text-muted-foreground truncate max-w-xs">— {kbAiActionItem.name}</span>}
                </DialogTitle>
                <DialogDescription className="text-xs mt-1">Pilih aksi AI lalu jalankan. Preview hasil di bawah sebelum menyimpan.</DialogDescription>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-4">
                {/* Action selector */}
                {(() => {
                  const ACTIONS = [
                    { id: "improve", label: "✍️ Perbaiki", desc: "Tingkatkan kualitas tulisan" },
                    { id: "summarize", label: "📋 Ringkas", desc: "Buat ringkasan padat" },
                    { id: "shorten", label: "📏 Persingkat", desc: "Kurangi 50% panjang" },
                    { id: "lengthen", label: "📚 Perluas", desc: "Kembangkan lebih detail" },
                    { id: "explain", label: "💡 Jelaskan", desc: "Sederhanakan bahasa" },
                    { id: "fix_grammar", label: "✅ Tata Bahasa", desc: "Perbaiki ejaan & grammar" },
                    { id: "action_items", label: "☑ Action Items", desc: "Ekstrak daftar tugas" },
                    { id: "continue_writing", label: "▶ Lanjutkan", desc: "Tambah konten baru" },
                    { id: "extract_key_points", label: "🎯 Poin Kunci", desc: "Ekstrak poin utama" },
                    { id: "translate", label: "🌐 Terjemahkan", desc: "Ubah ke bahasa lain" },
                    { id: "custom", label: "✏️ Custom", desc: "Prompt bebas" },
                  ];
                  return (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {ACTIONS.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => { setKbAiAction(a.id); setKbAiActionResult(""); }}
                            title={a.desc}
                            className={`text-xs px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${kbAiAction === a.id ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-border"}`}
                            data-testid={`button-ai-action-${a.id}`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                      {kbAiAction === "translate" && (
                        <div className="flex items-center gap-2">
                          <Label className="text-xs shrink-0">Terjemahkan ke:</Label>
                          <Select value={kbAiActionLanguage} onValueChange={setKbAiActionLanguage}>
                            <SelectTrigger className="h-7 text-xs w-52">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Bahasa Melayu">Bahasa Melayu</SelectItem>
                              <SelectItem value="Japanese">Japanese</SelectItem>
                              <SelectItem value="Arabic">Arabic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {kbAiAction === "custom" && (
                        <Textarea
                          value={kbAiActionCustomPrompt}
                          onChange={(e) => setKbAiActionCustomPrompt(e.target.value)}
                          placeholder="Deskripsikan apa yang ingin dilakukan dengan konten ini..."
                          rows={2}
                          className="text-xs resize-none"
                          data-testid="textarea-ai-action-custom"
                        />
                      )}
                    </div>
                  );
                })()}

                {/* Side-by-side: original | result */}
                <div className="flex-1 overflow-hidden grid grid-cols-2 gap-3 min-h-0">
                  <div className="flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-xs text-muted-foreground">Konten Asli</Label>
                      <span className="text-xs text-muted-foreground">{(kbAiActionItem?.content || "").split(/\s+/).filter(Boolean).length} kata</span>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-muted/30 border rounded-lg p-3">
                      <pre className="text-xs whitespace-pre-wrap leading-relaxed font-sans text-muted-foreground">{kbAiActionItem?.content || "(tidak ada konten)"}</pre>
                    </div>
                  </div>
                  <div className="flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-xs text-muted-foreground">Hasil AI</Label>
                      {kbAiActionResult && <span className="text-xs text-muted-foreground">{kbAiActionResult.split(/\s+/).filter(Boolean).length} kata</span>}
                    </div>
                    <div className="flex-1 overflow-y-auto border rounded-lg p-3 bg-background relative">
                      {kbAiActionLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <p className="text-xs">AI sedang memproses...</p>
                        </div>
                      ) : kbAiActionResult ? (
                        <pre className="text-xs whitespace-pre-wrap leading-relaxed font-sans">{kbAiActionResult}</pre>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <p className="text-xs text-center">Pilih aksi lalu klik "Jalankan AI" untuk melihat hasil di sini</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Run button */}
                <Button
                  onClick={handleRunKbAiAction}
                  disabled={kbAiActionLoading || !kbAiActionItem?.content || (kbAiAction === "custom" && !kbAiActionCustomPrompt.trim())}
                  className="w-full h-9"
                  data-testid="button-run-kb-ai-action"
                >
                  {kbAiActionLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Memproses...</> : "✦ Jalankan AI"}
                </Button>
              </div>

              <div className="shrink-0 px-6 py-4 border-t flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm" onClick={() => setKbAiActionOpen(false)}>Tutup</Button>
                {kbAiActionResult && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(kbAiActionResult); toast({ title: "Disalin!" }); }} data-testid="button-ai-action-copy">
                      Salin Hasil
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSaveKbAiAction("append")} disabled={kbAiActionSaving} data-testid="button-ai-action-append">
                      Tambahkan ke Bawah
                    </Button>
                    <Button size="sm" onClick={() => handleSaveKbAiAction("replace")} disabled={kbAiActionSaving} data-testid="button-ai-action-replace">
                      {kbAiActionSaving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Menyimpan...</> : "Ganti Konten"}
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* === Notion Sync Dialog (KB → Notion) === */}
          <Dialog open={notionSyncOpen} onOpenChange={(o) => { setNotionSyncOpen(o); if (!o) { setNotionSyncItem(null); setNotionSyncDone(null); setNotionSyncFilter(""); } }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
                  </svg>
                  Sinkronkan ke Notion
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Kirim konten KB item ini ke Notion sebagai halaman baru.
                  {notionSyncItem && <span className="block mt-1 font-medium text-foreground">"{notionSyncItem.name}"</span>}
                </DialogDescription>
              </DialogHeader>

              {notionSyncDone ? (
                <div className="py-4 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                    <span className="text-2xl">✓</span>
                  </div>
                  <p className="font-medium text-sm">Berhasil disinkronkan ke Notion!</p>
                  <p className="text-xs text-muted-foreground">"{notionSyncDone.title}" sekarang ada di Notion.</p>
                  <a href={notionSyncDone.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" /> Buka di Notion
                  </a>
                </div>
              ) : (
                <div className="py-3 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Simpan sebagai sub-halaman di bawah:</Label>
                    {notionSyncPagesLoading ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat halaman Notion...
                      </div>
                    ) : notionSyncPages.length === 0 ? (
                      <p className="text-xs text-amber-600">Tidak ada halaman Notion yang dapat diakses.</p>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input
                            placeholder="Filter halaman..."
                            value={notionSyncFilter}
                            onChange={(e) => setNotionSyncFilter(e.target.value)}
                            className="pl-8 h-8 text-sm"
                            data-testid="input-notion-sync-filter"
                          />
                        </div>
                        <div className="max-h-44 overflow-y-auto space-y-0.5 rounded-md border p-1">
                          {notionSyncPages
                            .filter(p => p.title.toLowerCase().includes(notionSyncFilter.toLowerCase()))
                            .map((p) => (
                              <button
                                key={p.id}
                                onClick={() => setNotionSyncParentId(p.id)}
                                data-testid={`option-notion-sync-${p.id}`}
                                className={`w-full text-left text-sm px-2.5 py-1.5 rounded-sm transition-colors truncate ${notionSyncParentId === p.id ? "bg-primary text-primary-foreground" : "hover:bg-muted/60"}`}
                              >
                                {p.title}
                              </button>
                            ))
                          }
                          {notionSyncPages.filter(p => p.title.toLowerCase().includes(notionSyncFilter.toLowerCase())).length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-2">Tidak ada halaman yang cocok.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {notionSyncItem?.content && (
                    <div className="bg-muted/30 border rounded-lg p-3 max-h-40 overflow-y-auto">
                      <p className="text-xs text-muted-foreground mb-1">Preview konten yang akan dikirim:</p>
                      <pre className="text-xs whitespace-pre-wrap font-sans text-foreground leading-relaxed line-clamp-10">{(notionSyncItem.content || "").slice(0, 600)}{(notionSyncItem.content || "").length > 600 ? "..." : ""}</pre>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => { setNotionSyncOpen(false); setNotionSyncItem(null); setNotionSyncDone(null); }}>
                  {notionSyncDone ? "Tutup" : "Batal"}
                </Button>
                {!notionSyncDone && (
                  <Button size="sm" onClick={handleRunNotionSync} disabled={notionSyncLoading || !notionSyncParentId} data-testid="button-run-notion-sync">
                    {notionSyncLoading ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Menyinkronkan...</> : "Sinkronkan ke Notion"}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={notionImportOpen} onOpenChange={(open) => {
            setNotionImportOpen(open);
            if (open) {
              setNotionBrowseTab("browse");
              handleLoadAllNotionPages();
            } else {
              setNotionPages([]);
              setNotionSearchQuery("");
              setNotionBrowseFilter("");
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={agent.ragEnabled === false} data-testid="button-import-notion">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
                </svg>
                Import dari Notion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
                  </svg>
                  Import Halaman dari Notion
                </DialogTitle>
                <DialogDescription>
                  Pilih halaman dari workspace Notion Anda untuk diimpor ke Knowledge Base agen.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">

                {/* Tab switcher */}
                <div className="flex rounded-lg border p-1 gap-1 bg-muted/40">
                  <button
                    onClick={() => setNotionBrowseTab("browse")}
                    data-testid="tab-notion-browse"
                    className={`flex-1 text-sm py-1.5 rounded-md transition-all font-medium ${notionBrowseTab === "browse" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Semua Halaman
                  </button>
                  <button
                    onClick={() => setNotionBrowseTab("search")}
                    data-testid="tab-notion-search"
                    className={`flex-1 text-sm py-1.5 rounded-md transition-all font-medium ${notionBrowseTab === "search" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Cari
                  </button>
                </div>

                {/* Layer selector — shared across both tabs */}
                <div className="space-y-2">
                  <Label>Lapisan Knowledge untuk import ini</Label>
                  <Select
                    value={notionImportLayer}
                    onValueChange={(v) => setNotionImportLayer(v as "foundational" | "operational" | "case_memory")}
                  >
                    <SelectTrigger data-testid="select-notion-import-layer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foundational">Foundational — dokumen dasar & referensi tetap</SelectItem>
                      <SelectItem value="operational">Operational — SOP harian & prosedur aktif</SelectItem>
                      <SelectItem value="case_memory">Case Memory — histori kasus & preseden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* AI Enhancement option — shared */}
                <div className="rounded-lg border p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1.5">✦ Proses dengan AI sebelum simpan</p>
                      <p className="text-xs text-muted-foreground">AI akan memproses konten Notion sebelum masuk ke KB.</p>
                    </div>
                    <Switch checked={notionImportAiEnhance} onCheckedChange={setNotionImportAiEnhance} data-testid="switch-notion-import-ai" />
                  </div>
                  {notionImportAiEnhance && (
                    <Select value={notionImportAiAction} onValueChange={setNotionImportAiAction}>
                      <SelectTrigger className="h-8 text-sm" data-testid="select-notion-import-ai-action">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="improve">✍️ Perbaiki tulisan</SelectItem>
                        <SelectItem value="summarize">📋 Ringkas konten</SelectItem>
                        <SelectItem value="shorten">📏 Persingkat</SelectItem>
                        <SelectItem value="extract_key_points">🎯 Ekstrak poin kunci</SelectItem>
                        <SelectItem value="translate">🌐 Terjemahkan ke Bahasa Indonesia</SelectItem>
                        <SelectItem value="fix_grammar">✅ Perbaiki tata bahasa</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* ── BROWSE TAB ── */}
                {notionBrowseTab === "browse" && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Filter halaman..."
                          value={notionBrowseFilter}
                          onChange={(e) => setNotionBrowseFilter(e.target.value)}
                          className="pl-9"
                          data-testid="input-notion-browse-filter"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleLoadAllNotionPages(true)}
                        disabled={notionBrowseLoading}
                        title="Muat ulang daftar halaman"
                        data-testid="button-notion-refresh"
                      >
                        {notionBrowseLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      </Button>
                    </div>
                    {notionBrowseLoading && (
                      <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Memuat halaman dari Notion...</span>
                      </div>
                    )}
                    {!notionBrowseLoading && (() => {
                      const filtered = notionAllPages.filter(p =>
                        p.title.toLowerCase().includes(notionBrowseFilter.toLowerCase())
                      );
                      return filtered.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                          {notionBrowseFilter ? "Tidak ada halaman yang cocok." : "Workspace Notion kosong atau belum terhubung."}
                        </p>
                      ) : (
                        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                          {notionBrowseFilter === "" && (
                            <p className="text-xs text-muted-foreground px-1 pb-1">{notionAllPages.length} halaman ditemukan</p>
                          )}
                          {filtered.map((page) => (
                            <div key={page.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border hover:bg-muted/50 transition-colors">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{page.title}</p>
                                {page.lastEdited && (
                                  <p className="text-xs text-muted-foreground">{page.lastEdited}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {page.url && (
                                  <a href={page.url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" className="w-7 h-7" data-testid={`button-notion-open-${page.id}`}>
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </Button>
                                  </a>
                                )}
                                <Button
                                  size="sm"
                                  onClick={() => handleNotionImportPage(page)}
                                  disabled={notionImportingId === page.id || createKnowledgeBase.isPending}
                                  data-testid={`button-notion-import-${page.id}`}
                                >
                                  {notionImportingId === page.id ? (
                                    <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />Mengimpor...</>
                                  ) : "Import"}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* ── SEARCH TAB ── */}
                {notionBrowseTab === "search" && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Cari halaman Notion..."
                        value={notionSearchQuery}
                        onChange={(e) => setNotionSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleNotionSearch()}
                        data-testid="input-notion-search"
                      />
                      <Button onClick={handleNotionSearch} disabled={notionSearchLoading} data-testid="button-notion-search">
                        {notionSearchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      </Button>
                    </div>
                    {notionSearchLoading && (
                      <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Mencari di Notion...</span>
                      </div>
                    )}
                    {!notionSearchLoading && notionPages.length === 0 && notionSearchQuery && (
                      <p className="text-sm text-muted-foreground text-center py-4">Tidak ada halaman ditemukan. Coba kata kunci lain.</p>
                    )}
                    {!notionSearchLoading && notionPages.length === 0 && !notionSearchQuery && (
                      <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">Ketik kata kunci lalu tekan Enter atau klik ikon cari.</p>
                    )}
                    {notionPages.length > 0 && (
                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                        {notionPages.map((page) => (
                          <div key={page.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{page.title || "(Tanpa Judul)"}</p>
                              {page.lastEdited && (
                                <p className="text-xs text-muted-foreground">Terakhir diubah: {page.lastEdited}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {page.url && (
                                <a href={page.url} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="icon" className="w-7 h-7" data-testid={`button-notion-open-${page.id}`}>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Button>
                                </a>
                              )}
                              <Button
                                size="sm"
                                onClick={() => handleNotionImportPage(page)}
                                disabled={notionImportingId === page.id || createKnowledgeBase.isPending}
                                data-testid={`button-notion-import-${page.id}`}
                              >
                                {notionImportingId === page.id ? (
                                  <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />Mengimpor...</>
                                ) : "Import"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNotionImportOpen(false)}>
                  Tutup
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            disabled={agent.ragEnabled === false}
            onClick={() => {
              setNewItem({ name: "", type: "file", content: "", description: "", fileName: "", fileSize: 0, fileType: undefined, fileUrl: "", knowledgeLayer: "operational", taxonomyId: null, sourceUrl: "", sourceAuthority: "", effectiveDate: "", isShared: false });
              setDialogOpen(true);
            }}
            data-testid="button-kb-upload-doc"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Dokumen
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={agent.ragEnabled === false} data-testid="button-kb-add">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Knowledge
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Tambah Knowledge</DialogTitle>
              <DialogDescription>
                Tambahkan sumber informasi baru agar chatbot dapat menjawab lebih akurat.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="kb-name">Nama</Label>
                <Input
                  id="kb-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Contoh: FAQ NIB, Syarat OSS, Alur Pendaftaran"
                 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kb-type">Tipe Sumber</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value: "text" | "file" | "url" | "youtube" | "cloud_drive" | "video" | "audio") =>
                    setNewItem({ ...newItem, type: value, content: "", fileName: "", fileSize: 0, fileType: undefined, fileUrl: "" })
                  }
                >
                  <SelectTrigger id="kb-type" data-testid="select-kb-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">📝 Teks / Copy-Paste</SelectItem>
                    <SelectItem value="file">📄 Dokumen (PDF, Word, Excel, PPT)</SelectItem>
                    <SelectItem value="url">🌐 URL Website</SelectItem>
                    <SelectItem value="youtube">▶️ YouTube (otomatis ambil transkrip)</SelectItem>
                    <SelectItem value="cloud_drive">☁️ Google Drive / OneDrive / SharePoint</SelectItem>
                    <SelectItem value="video">🎬 Video (MP4, WebM, MOV — ekstrak audio)</SelectItem>
                    <SelectItem value="audio">🎵 Audio (MP3, WAV, M4A — transkripsi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kb-layer">Lapisan Knowledge</Label>
                <Select
                  value={newItem.knowledgeLayer}
                  onValueChange={(v) => setNewItem({ ...newItem, knowledgeLayer: v as "foundational" | "operational" | "case_memory" })}
                >
                  <SelectTrigger id="kb-layer" data-testid="select-new-knowledge-layer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foundational">Foundational — dokumen dasar & referensi tetap</SelectItem>
                    <SelectItem value="operational">Operational — SOP harian & prosedur aktif</SelectItem>
                    <SelectItem value="case_memory">Case Memory — histori kasus & preseden</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Tentukan di lapisan mana dokumen ini berada dalam hierarki knowledge agen.</p>
              </div>

              {/* === Klasifikasi Hierarki + Atribusi Sumber Primer (opsional) === */}
              <TaxonomyAndSourceFields newItem={newItem} setNewItem={setNewItem} />

              {/* File Upload (Dokumen) */}
              {newItem.type === "file" && (
                <div className="space-y-2">
                  <Label>Upload Dokumen</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {newItem.fileName ? (
                      <div className="space-y-2">
                        <File className="w-10 h-10 mx-auto text-primary" />
                        <p className="font-medium">{newItem.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(newItem.fileSize)} - {fileTypeLabels[newItem.fileType || "other"]}
                        </p>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Ganti File</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Drag & drop atau klik untuk upload</p>
                        <p className="text-xs text-muted-foreground">PDF, Word, Excel, PPT, TXT (Max 50MB)</p>
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadFile.isPending} data-testid="button-kb-pick-file">
                          {uploadFile.isPending ? "Uploading..." : "Pilih Dokumen"}
                        </Button>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden"
                      accept=".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                      onChange={handleFileChange} />
                  </div>
                </div>
              )}

              {/* Video Upload */}
              {(newItem.type === "video" || newItem.type === "audio") && (
                <div className="space-y-2">
                  <Label>{newItem.type === "video" ? "Upload Video" : "Upload Audio"}</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {newItem.fileName ? (
                      <div className="space-y-2">
                        <File className="w-10 h-10 mx-auto text-primary" />
                        <p className="font-medium">{newItem.fileName}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(newItem.fileSize)}</p>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Ganti File</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                        {newItem.type === "video" ? (
                          <>
                            <p className="text-sm text-muted-foreground">Upload video — AI akan mengekstrak & mentranskrip audio</p>
                            <p className="text-xs text-muted-foreground">MP4, WebM, MOV (Max 50MB)</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-muted-foreground">Upload file audio — AI akan mentranskrip ke teks</p>
                            <p className="text-xs text-muted-foreground">MP3, WAV, M4A, AAC (Max 50MB)</p>
                          </>
                        )}
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadFile.isPending} data-testid={`button-kb-pick-${newItem.type}`}>
                          {uploadFile.isPending ? "Uploading..." : `Pilih ${newItem.type === "video" ? "Video" : "Audio"}`}
                        </Button>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden"
                      accept={newItem.type === "video" ? "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" : "audio/mpeg,audio/wav,audio/mp4,audio/ogg,.mp3,.wav,.m4a,.aac,.ogg"}
                      onChange={handleFileChange} />
                  </div>
                  <p className="text-xs text-muted-foreground bg-muted/40 rounded p-2">
                    {newItem.type === "video"
                      ? "AI akan mengekstrak audio dari video lalu mentransripnya. Pastikan video memiliki audio yang jelas."
                      : "AI akan mentranskrip audio menjadi teks menggunakan Speech-to-Text. Pastikan suara jelas dan tidak terlalu berisik."}
                  </p>
                </div>
              )}

              {/* URL Website */}
              {newItem.type === "url" && (
                <div className="space-y-2">
                  <Label htmlFor="kb-content">URL Halaman Web</Label>
                  <Input
                    id="kb-content"
                    value={newItem.content}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    placeholder="https://example.com/halaman-informasi"
                    data-testid="input-kb-url"
                  />
                  <p className="text-xs text-muted-foreground">AI akan scraping isi halaman dan menjadikannya sumber knowledge.</p>
                </div>
              )}

              {/* YouTube URL */}
              {newItem.type === "youtube" && (
                <div className="space-y-2">
                  <Label htmlFor="kb-content">URL YouTube</Label>
                  <Input
                    id="kb-content"
                    value={newItem.content}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... atau https://youtu.be/..."
                    data-testid="input-kb-youtube"
                  />
                  <p className="text-xs text-muted-foreground bg-muted/40 rounded p-2">
                    AI akan otomatis mengambil transkrip/subtitle dari video YouTube. Pastikan video memiliki subtitle (CC) yang tersedia.
                    Mendukung format: <code>youtube.com/watch?v=...</code>, <code>youtu.be/...</code>, <code>youtube.com/shorts/...</code>
                  </p>
                </div>
              )}

              {/* Cloud Drive URL */}
              {newItem.type === "cloud_drive" && (
                <div className="space-y-2">
                  <Label htmlFor="kb-content">Link Google Drive / OneDrive / SharePoint</Label>
                  <Input
                    id="kb-content"
                    value={newItem.content}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    placeholder="https://drive.google.com/file/d/... atau https://1drv.ms/..."
                    data-testid="input-kb-cloud-drive"
                  />
                  <div className="text-xs text-muted-foreground bg-muted/40 rounded p-2 space-y-1">
                    <p>AI akan mengunduh dan memproses file dari cloud storage Anda.</p>
                    <p><strong>Google Drive:</strong> Pastikan file dishare dengan <em>Anyone with the link</em></p>
                    <p><strong>OneDrive:</strong> Gunakan link share publik dari "Copy Link"</p>
                    <p><strong>SharePoint:</strong> Gunakan direct download URL</p>
                  </div>
                </div>
              )}

              {/* Teks biasa */}
              {newItem.type === "text" && (
                <div className="space-y-2">
                  <Label htmlFor="kb-content">Konten Teks</Label>
                  <Textarea
                    id="kb-content"
                    value={newItem.content}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    placeholder="Tempel informasi, SOP, FAQ, atau panduan di sini..."
                    rows={6}
                    data-testid="input-kb-text"
                  />
                  <p className="text-xs text-muted-foreground">Gunakan judul bagian: "Syarat", "Langkah-langkah", "Biaya", "Waktu proses", "Masalah umum".</p>
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

      {/* Knowledge Layer Legend */}
      <Card className="border border-dashed bg-muted/20">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Lapisan Knowledge (Knowledge Layers)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-blue-700 px-2 py-0.5 font-medium">Foundational</span>
              <p className="text-muted-foreground">Dokumen dasar, referensi tetap: regulasi, standar, data produk.</p>
            </div>
            <div className="space-y-1">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-emerald-700 px-2 py-0.5 font-medium">Operational</span>
              <p className="text-muted-foreground">SOP harian, prosedur aktif: panduan kerja, FAQ, template.</p>
            </div>
            <div className="space-y-1">
              <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 dark:bg-violet-950/40 dark:border-violet-800 dark:text-violet-300 text-violet-700 px-2 py-0.5 font-medium">Case Memory</span>
              <p className="text-muted-foreground">Histori kasus & preseden: notulen, keputusan, pembelajaran.</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <p className="text-xs font-medium text-muted-foreground mb-1">Preset Cepat</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setRagChunkSize(600); setRagChunkOverlap(120); setRagTopK(3); }}
                      data-testid="button-preset-hemat"
                    >
                      Hemat
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setRagChunkSize(800); setRagChunkOverlap(200); setRagTopK(5); }}
                      data-testid="button-preset-seimbang"
                    >
                      Seimbang
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setRagChunkSize(1000); setRagChunkOverlap(200); setRagTopK(7); }}
                      data-testid="button-preset-akurat"
                    >
                      Akurat
                    </Button>
                    <span className="text-xs text-muted-foreground">— atau atur manual di bawah</span>
                  </div>
                </div>
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
                  <p className="text-xs text-muted-foreground">Semakin besar = konteks lebih lengkap, tapi risiko meleset naik.</p>
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
                  <p className="text-xs text-muted-foreground">Semakin besar = transisi antar potongan lebih mulus, biaya pemrosesan naik.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Hasil Pencarian (Top-K)</Label>
                    <span className="text-sm font-medium text-muted-foreground">{ragTopK}</span>
                  </div>
                  <Slider
                    value={[ragTopK]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={([v]) => setRagTopK(v)}
                    data-testid="slider-top-k"
                  />
                  <p className="text-xs text-muted-foreground">Jumlah potongan yang disisipkan saat menjawab. Terlalu besar bisa membuat jawaban melebar.</p>
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
            <h3 className="font-semibold text-lg mb-1">Belum ada knowledge</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Tidak ada item yang cocok dengan pencarian"
                : "Tambahkan dokumen/FAQ/SOP agar chatbot bisa menjawab lebih akurat."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setDialogOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Tambah item knowledge
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
                            <Icon className={`w-5 h-5 ${typeColors[item.type] || "text-primary"}`} />
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
                            const layer = (item as any).knowledgeLayer || "operational";
                            const layerConfig: Record<string, { label: string; className: string }> = {
                              foundational: { label: "Foundational", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800" },
                              operational: { label: "Operational", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800" },
                              case_memory: { label: "Case Memory", className: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800" },
                            };
                            const cfg = layerConfig[layer] || layerConfig.operational;
                            return (
                              <Badge variant="outline" className={`shrink-0 text-xs ${cfg.className}`} data-testid={`badge-layer-${item.id}`}>
                                {cfg.label}
                              </Badge>
                            );
                          })()}
                          {/* Status versioning: aktif/dicabut/draft */}
                          {(() => {
                            const status = (item as any).status || "active";
                            if (status === "active") return null;
                            const cfg: Record<string, { label: string; className: string }> = {
                              superseded: { label: "Dicabut", className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800" },
                              draft: { label: "Draft", className: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/40 dark:text-slate-300 dark:border-slate-800" },
                            };
                            const c = cfg[status];
                            if (!c) return null;
                            return (
                              <Badge variant="outline" className={`shrink-0 text-xs ${c.className}`} data-testid={`badge-status-${item.id}`}>
                                {c.label}
                              </Badge>
                            );
                          })()}
                          {/* Atribusi sumber primer (PUPR/LKPP/dst) */}
                          {(item as any).sourceAuthority && (
                            <Badge variant="outline" className="shrink-0 text-xs bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800" data-testid={`badge-authority-${item.id}`}>
                              {String((item as any).sourceAuthority).toUpperCase()}
                            </Badge>
                          )}
                          {(() => {
                            const kbStat = ragStats?.chunksByKb?.find(s => s.kbId === item.id);
                            const isProcessing = item.processingStatus === "processing" || kbStat?.processingStatus === "processing";
                            if (isProcessing) {
                              const processingLabel: Record<string, string> = {
                                youtube: "Mengambil transkrip...",
                                cloud_drive: "Mengunduh file...",
                                video: "Mentranskripsi video...",
                                audio: "Mentranskrip audio...",
                              };
                              return (
                                <Badge variant="outline" className="shrink-0 text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30" data-testid={`badge-processing-${item.id}`}>
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  {processingLabel[item.type] || "Memproses..."}
                                </Badge>
                              );
                            }
                            if (kbStat && kbStat.chunkCount > 0) {
                              return (
                                <Badge variant="outline" className="shrink-0 text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30" data-testid={`badge-chunks-${item.id}`}>
                                  <Brain className="w-3 h-3 mr-1" />
                                  {kbStat.chunkCount} chunks RAG
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
                      {/* Notion AI actions — only for text items with content */}
                      {item.type === "text" && (item.content || "").length > 10 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-medium text-primary"
                            onClick={() => handleOpenKbAiAction(item)}
                            title="Aksi AI Notion — Perbaiki, Ringkas, Terjemahkan, dll."
                            data-testid={`button-kb-ai-action-${item.id}`}
                          >
                            ✦ AI
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handleOpenNotionSync(item)}
                            title="Sinkronkan ke Notion"
                            data-testid={`button-kb-notion-sync-${item.id}`}
                          >
                            <svg className="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
                            </svg>
                          </Button>
                        </>
                      )}
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
            <DialogTitle>Edit Knowledge</DialogTitle>
            <DialogDescription>
              Perbarui informasi item knowledge
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
            <div className="space-y-2">
              <Label htmlFor="edit-kb-layer">Lapisan Knowledge</Label>
              <Select
                value={editItem.knowledgeLayer}
                onValueChange={(v) => setEditItem({ ...editItem, knowledgeLayer: v as "foundational" | "operational" | "case_memory" })}
              >
                <SelectTrigger id="edit-kb-layer" data-testid="select-edit-knowledge-layer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundational">Foundational — dokumen dasar & referensi tetap</SelectItem>
                  <SelectItem value="operational">Operational — SOP harian & prosedur aktif</SelectItem>
                  <SelectItem value="case_memory">Case Memory — histori kasus & preseden</SelectItem>
                </SelectContent>
              </Select>
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

// =====================================================================
// TaxonomyAndSourceFields — sub-komponen untuk metadata KB lanjutan:
// dropdown sektor → subsektor (cascade), atribusi sumber primer,
// tanggal berlaku, dan toggle berbagi antar agen.
// Semua field opsional — KB tetap bisa disimpan tanpa diisi.
// =====================================================================
interface TaxonomyAndSourceFieldsProps {
  newItem: {
    taxonomyId: number | null;
    sourceUrl: string;
    sourceAuthority: "" | "PUPR" | "LKPP" | "DJP" | "BNSP" | "LPJK" | "BSN" | "DJBC" | "Kemnaker" | "BPJS_Ketenagakerjaan" | "JDIH" | "internal" | "lainnya";
    effectiveDate: string;
    isShared: boolean;
    [k: string]: any;
  };
  setNewItem: (updater: any) => void;
}

function TaxonomyAndSourceFields({ newItem, setNewItem }: TaxonomyAndSourceFieldsProps) {
  const { data: taxonomy = [] } = useTaxonomy();

  // Cari sektor & subsektor terpilih dari pohon taksonomi.
  const findSelected = (): { sektorId: number | null; subId: number | null } => {
    if (newItem.taxonomyId == null) return { sektorId: null, subId: null };
    for (const sektor of taxonomy) {
      if (sektor.id === newItem.taxonomyId) return { sektorId: sektor.id, subId: null };
      const sub = sektor.children?.find((c) => c.id === newItem.taxonomyId);
      if (sub) return { sektorId: sektor.id, subId: sub.id };
    }
    return { sektorId: null, subId: null };
  };
  const { sektorId, subId } = findSelected();
  const subsektorOptions: KnowledgeTaxonomyTreeNode[] =
    taxonomy.find((s) => s.id === sektorId)?.children ?? [];

  return (
    <div className="space-y-3 p-3 rounded-md border bg-muted/30">
      <p className="text-xs font-medium text-muted-foreground">Klasifikasi & Sumber Resmi (opsional)</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="kb-sektor" className="text-xs">Sektor</Label>
          <Select
            value={sektorId?.toString() ?? "none"}
            onValueChange={(v) => {
              const id = v === "none" ? null : parseInt(v);
              setNewItem({ ...newItem, taxonomyId: id });
            }}
          >
            <SelectTrigger id="kb-sektor" data-testid="select-kb-sektor">
              <SelectValue placeholder="Pilih sektor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Tanpa Taksonomi —</SelectItem>
              {taxonomy.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="kb-subsektor" className="text-xs">Subsektor</Label>
          <Select
            value={subId?.toString() ?? "none"}
            onValueChange={(v) => {
              if (v === "none") {
                setNewItem({ ...newItem, taxonomyId: sektorId });
              } else {
                setNewItem({ ...newItem, taxonomyId: parseInt(v) });
              }
            }}
            disabled={!sektorId || subsektorOptions.length === 0}
          >
            <SelectTrigger id="kb-subsektor" data-testid="select-kb-subsektor">
              <SelectValue placeholder={sektorId ? "Pilih subsektor" : "Pilih sektor dulu"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Sektor Saja —</SelectItem>
              {subsektorOptions.map((sub) => (
                <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="kb-source-authority" className="text-xs">Sumber Resmi</Label>
          <Select
            value={newItem.sourceAuthority || "none"}
            onValueChange={(v) =>
              setNewItem({ ...newItem, sourceAuthority: v === "none" ? "" : (v as any) })
            }
          >
            <SelectTrigger id="kb-source-authority" data-testid="select-kb-source-authority">
              <SelectValue placeholder="Pilih otoritas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Tidak Ditentukan —</SelectItem>
              <SelectItem value="PUPR">PUPR — Kementerian PUPR</SelectItem>
              <SelectItem value="LKPP">LKPP — Pengadaan Pemerintah</SelectItem>
              <SelectItem value="DJP">DJP — Pajak</SelectItem>
              <SelectItem value="BNSP">BNSP — Sertifikasi Profesi</SelectItem>
              <SelectItem value="LPJK">LPJK — Jasa Konstruksi</SelectItem>
              <SelectItem value="BSN">BSN — Standar Nasional</SelectItem>
              <SelectItem value="DJBC">DJBC — Bea Cukai</SelectItem>
              <SelectItem value="Kemnaker">Kemnaker — Ketenagakerjaan</SelectItem>
              <SelectItem value="BPJS_Ketenagakerjaan">BPJS Ketenagakerjaan</SelectItem>
              <SelectItem value="JDIH">JDIH — Jaringan Dokumentasi Hukum</SelectItem>
              <SelectItem value="internal">Internal Perusahaan</SelectItem>
              <SelectItem value="lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="kb-effective-date" className="text-xs">Tanggal Berlaku</Label>
          <Input
            id="kb-effective-date"
            type="date"
            value={newItem.effectiveDate}
            onChange={(e) => setNewItem({ ...newItem, effectiveDate: e.target.value })}
            data-testid="input-kb-effective-date"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="kb-source-url" className="text-xs">URL Sumber (Pasal/PerLem/UU asli)</Label>
        <Input
          id="kb-source-url"
          type="url"
          placeholder="https://jdih.pu.go.id/..."
          value={newItem.sourceUrl}
          onChange={(e) => setNewItem({ ...newItem, sourceUrl: e.target.value })}
          data-testid="input-kb-source-url"
        />
        <p className="text-xs text-muted-foreground">Tautan ke sumber primer yg akan disitir agen saat menjawab.</p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <Label htmlFor="kb-is-shared" className="text-xs">Bagikan ke agen lain dalam series</Label>
          <p className="text-[11px] text-muted-foreground">KB ini akan ikut tersedia untuk agen lain bila ditandai shared.</p>
        </div>
        <Switch
          id="kb-is-shared"
          checked={newItem.isShared}
          onCheckedChange={(v) => setNewItem({ ...newItem, isShared: v })}
          data-testid="switch-kb-is-shared"
        />
      </div>
    </div>
  );
}
