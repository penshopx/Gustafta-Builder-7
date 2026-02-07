import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, BookOpen, Bot, Layers, Globe, Eye, ArrowLeft, ExternalLink, Copy, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Series, BigIdea } from "@shared/schema";

type SeriesForm = {
  name: string;
  slug: string;
  description: string;
  tagline: string;
  coverImage: string;
  color: string;
  category: string;
  tags: string[];
  language: string;
  isPublic: boolean;
  isActive: boolean;
  isFeatured: boolean;
};

const defaultForm: SeriesForm = {
  name: "",
  slug: "",
  description: "",
  tagline: "",
  coverImage: "",
  color: "#6366f1",
  category: "",
  tags: [],
  language: "id",
  isPublic: false,
  isActive: true,
  isFeatured: false,
};

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 60);
}

export function SeriesManagementDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SeriesForm>(defaultForm);
  const [tagsInput, setTagsInput] = useState("");
  const [assignOpen, setAssignOpen] = useState<string | null>(null);

  const { data: allSeries = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/series"],
    enabled: open,
  });

  const { data: bigIdeas = [] } = useQuery<BigIdea[]>({
    queryKey: ["/api/big-ideas"],
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/series", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      toast({ title: "Series berhasil dibuat" });
      resetForm();
    },
    onError: () => toast({ title: "Gagal membuat series", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/series/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      toast({ title: "Series berhasil diperbarui" });
      resetForm();
    },
    onError: () => toast({ title: "Gagal memperbarui series", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/series/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      toast({ title: "Series berhasil dihapus" });
    },
    onError: () => toast({ title: "Gagal menghapus series", variant: "destructive" }),
  });

  const assignBigIdeaMutation = useMutation({
    mutationFn: ({ bigIdeaId, seriesId }: { bigIdeaId: string; seriesId: string | null }) =>
      apiRequest("PATCH", `/api/big-ideas/${bigIdeaId}`, { seriesId: seriesId ?? null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      queryClient.invalidateQueries({ queryKey: ["/api/big-ideas"] });
    },
  });

  const resetForm = () => {
    setForm(defaultForm);
    setTagsInput("");
    setView("list");
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast({ title: "Nama series harus diisi", variant: "destructive" });
      return;
    }
    const payload = {
      ...form,
      slug: form.slug || generateSlug(form.name),
      tags: form.tags.length > 0 ? form.tags : tagsInput.split(",").map(t => t.trim()).filter(Boolean),
    };

    if (view === "edit" && editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (s: any) => {
    setForm({
      name: s.name || "",
      slug: s.slug || "",
      description: s.description || "",
      tagline: s.tagline || "",
      coverImage: s.coverImage || "",
      color: s.color || "#6366f1",
      category: s.category || "",
      tags: s.tags || [],
      language: s.language || "id",
      isPublic: s.isPublic ?? false,
      isActive: s.isActive ?? true,
      isFeatured: s.isFeatured ?? false,
    });
    setTagsInput((s.tags || []).join(", "));
    setEditingId(s.id);
    setView("edit");
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus series ini? Big Ideas yang terkait tidak akan dihapus.")) {
      deleteMutation.mutate(id);
    }
  };

  const getAssignedBigIdeas = (seriesId: string) => {
    return bigIdeas.filter(bi => bi.seriesId === seriesId);
  };

  const getUnassignedBigIdeas = () => {
    return bigIdeas.filter(bi => !bi.seriesId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {view !== "list" && (
              <Button variant="ghost" size="icon" onClick={resetForm} data-testid="button-back-list">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <BookOpen className="w-5 h-5 text-primary" />
            {view === "list" ? "Kelola Chatbot Series" : view === "create" ? "Buat Series Baru" : "Edit Series"}
          </DialogTitle>
          <DialogDescription>
            {view === "list" ? "Kelola paket chatbot terstruktur Anda." : "Isi detail series chatbot."}
          </DialogDescription>
        </DialogHeader>

        {view === "list" && (
          <div className="space-y-4">
            <Button onClick={() => setView("create")} className="w-full" data-testid="button-create-series">
              <Plus className="w-4 h-4 mr-2" />
              Buat Series Baru
            </Button>

            {isLoading && (
              <div className="text-center py-8 text-muted-foreground text-sm">Memuat...</div>
            )}

            {!isLoading && allSeries.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">Belum ada series. Buat yang pertama!</p>
              </div>
            )}

            {allSeries.map((s: any) => {
              const assigned = getAssignedBigIdeas(String(s.id));
              return (
                <Card key={s.id} data-testid={`admin-series-${s.id}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: s.color || "#6366f1" }}
                      >
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm truncate">{s.name}</h3>
                          {s.isPublic && (
                            <Badge variant="secondary" className="text-[10px] no-default-hover-elevate no-default-active-elevate">
                              <Globe className="w-3 h-3 mr-0.5" />
                              Publik
                            </Badge>
                          )}
                          {s.isFeatured && (
                            <Badge variant="secondary" className="text-[10px] bg-amber-500/15 text-amber-600 no-default-hover-elevate no-default-active-elevate">
                              Unggulan
                            </Badge>
                          )}
                          {!s.isActive && (
                            <Badge variant="secondary" className="text-[10px] bg-destructive/10 text-destructive no-default-hover-elevate no-default-active-elevate">
                              Nonaktif
                            </Badge>
                          )}
                        </div>
                        {s.tagline && <p className="text-xs text-muted-foreground truncate">{s.tagline}</p>}
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          <span>{assigned.length} Big Ideas</span>
                          {s.category && <span>{s.category}</span>}
                          <span>/{s.slug}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(s)} data-testid={`button-edit-series-${s.id}`}>
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssignOpen(assignOpen === String(s.id) ? null : String(s.id))}
                        data-testid={`button-assign-bi-${s.id}`}
                      >
                        <Layers className="w-3.5 h-3.5 mr-1" />
                        Big Ideas ({assigned.length})
                      </Button>
                      {s.isPublic && s.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/series/${s.slug}`, "_blank")}
                          data-testid={`button-view-series-${s.id}`}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Lihat
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/series/${s.slug}`);
                          toast({ title: "Link disalin!" });
                        }}
                        data-testid={`button-copy-link-${s.id}`}
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Link
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(String(s.id))} data-testid={`button-delete-series-${s.id}`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {assignOpen === String(s.id) && (
                      <div className="border rounded-lg p-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Big Ideas dalam series ini:</p>
                        {assigned.length === 0 && (
                          <p className="text-xs text-muted-foreground">Belum ada Big Ideas yang ditambahkan.</p>
                        )}
                        {assigned.map(bi => (
                          <div key={bi.id} className="flex items-center justify-between gap-2 py-1">
                            <span className="text-sm truncate">{bi.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => assignBigIdeaMutation.mutate({ bigIdeaId: bi.id, seriesId: null })}
                              className="text-xs shrink-0"
                              data-testid={`button-remove-bi-${bi.id}`}
                            >
                              Hapus
                            </Button>
                          </div>
                        ))}
                        {getUnassignedBigIdeas().length > 0 && (
                          <>
                            <p className="text-xs font-medium text-muted-foreground mt-3 pt-2 border-t">Tambahkan Big Ideas:</p>
                            {getUnassignedBigIdeas().map(bi => (
                              <div key={bi.id} className="flex items-center justify-between gap-2 py-1">
                                <span className="text-sm truncate">{bi.name}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => assignBigIdeaMutation.mutate({ bigIdeaId: bi.id, seriesId: String(s.id) })}
                                  className="text-xs shrink-0"
                                  data-testid={`button-add-bi-${bi.id}`}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Tambah
                                </Button>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {(view === "create" || view === "edit") && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Nama Series *</Label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value, slug: form.slug || generateSlug(e.target.value) });
                }}
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                placeholder="Contoh: Chatbot Bisnis Online"
                data-testid="input-series-name"
              />
            </div>

            <div>
              <Label className="text-sm">Slug (URL)</Label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                placeholder="chatbot-bisnis-online"
                data-testid="input-series-slug"
              />
            </div>

            <div>
              <Label className="text-sm">Tagline</Label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                placeholder="Deskripsi singkat"
                data-testid="input-series-tagline"
              />
            </div>

            <div>
              <Label className="text-sm">Deskripsi</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm min-h-[80px]"
                placeholder="Deskripsi lengkap series..."
                data-testid="input-series-description"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Kategori</Label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                  placeholder="Bisnis, Edukasi, dll"
                  data-testid="input-series-category"
                />
              </div>
              <div>
                <Label className="text-sm">Bahasa</Label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                  data-testid="select-series-language"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                  <option value="ms">Malay</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Warna</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-10 h-9 rounded border cursor-pointer"
                    data-testid="input-series-color"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Cover Image URL</Label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                  placeholder="https://..."
                  data-testid="input-series-cover"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm">Tags (pisahkan dengan koma)</Label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => {
                  setTagsInput(e.target.value);
                  setForm({ ...form, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) });
                }}
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                placeholder="bisnis, online, chatbot"
                data-testid="input-series-tags"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Publik</Label>
                <Switch
                  checked={form.isPublic}
                  onCheckedChange={(checked) => setForm({ ...form, isPublic: checked })}
                  data-testid="switch-series-public"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Aktif</Label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                  data-testid="switch-series-active"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Unggulan</Label>
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(checked) => setForm({ ...form, isFeatured: checked })}
                  data-testid="switch-series-featured"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={resetForm} className="flex-1" data-testid="button-cancel-series">
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-series"
              >
                {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : view === "edit" ? "Perbarui" : "Buat Series"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
