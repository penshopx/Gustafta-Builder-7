import { useState, type FormEvent } from "react";
import { Send, Plus, Trash2, Phone, Users, Radio, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function BroadcastPanel({ agent }: { agent: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [contactForm, setContactForm] = useState({
    phone: "",
    name: "",
  });

  const [broadcastForm, setBroadcastForm] = useState({
    name: "",
    messageTemplate: "",
    scheduleType: "once" as "once" | "daily",
    scheduleTime: "08:00",
    dataSource: "",
    isEnabled: false,
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<any[]>({
    queryKey: [`/api/wa-contacts/${agent.id}`],
  });

  const { data: broadcasts = [], isLoading: broadcastsLoading } = useQuery<any[]>({
    queryKey: [`/api/wa-broadcasts?agentId=${agent.id}`],
  });

  const addContactMutation = useMutation({
    mutationFn: async (data: { phone: string; name: string }) => {
      const res = await apiRequest("POST", "/api/wa-contacts", {
        agentId: agent.id,
        phone: data.phone,
        name: data.name,
        source: "manual",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wa-contacts/${agent.id}`] });
      setContactForm({ phone: "", name: "" });
      toast({ title: "Berhasil", description: "Kontak berhasil ditambahkan" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menambahkan kontak", variant: "destructive" });
    },
  });

  const toggleOptOutMutation = useMutation({
    mutationFn: async ({ id, isOptedOut }: { id: number; isOptedOut: boolean }) => {
      await apiRequest("PATCH", `/api/wa-contacts/${id}`, { isOptedOut: !isOptedOut });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wa-contacts/${agent.id}`] });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/wa-contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wa-contacts/${agent.id}`] });
      toast({ title: "Berhasil", description: "Kontak berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menghapus kontak", variant: "destructive" });
    },
  });

  const createBroadcastMutation = useMutation({
    mutationFn: async (data: typeof broadcastForm) => {
      const res = await apiRequest("POST", "/api/wa-broadcasts", {
        agentId: agent.id,
        name: data.name,
        messageTemplate: data.messageTemplate,
        scheduleType: data.scheduleType,
        scheduleTime: data.scheduleTime,
        dataSource: data.dataSource || null,
        isEnabled: data.isEnabled,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wa-broadcasts?agentId=${agent.id}`] });
      setBroadcastForm({
        name: "",
        messageTemplate: "",
        scheduleType: "once",
        scheduleTime: "08:00",
        dataSource: "",
        isEnabled: false,
      });
      toast({ title: "Berhasil", description: "Broadcast berhasil dibuat" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal membuat broadcast", variant: "destructive" });
    },
  });

  const toggleBroadcastMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: number; isEnabled: boolean }) => {
      await apiRequest("PATCH", `/api/wa-broadcasts/${id}`, { isEnabled: !isEnabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wa-broadcasts?agentId=${agent.id}`] });
    },
  });

  const deleteBroadcastMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/wa-broadcasts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wa-broadcasts?agentId=${agent.id}`] });
      toast({ title: "Berhasil", description: "Broadcast berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menghapus broadcast", variant: "destructive" });
    },
  });

  const sendNowMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/wa-broadcasts/${id}/send-now`);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/wa-broadcasts?agentId=${agent.id}`] });
      toast({ title: "Berhasil", description: data?.message || "Broadcast sedang dikirim" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal mengirim broadcast", variant: "destructive" });
    },
  });

  const handleAddContact = (e: FormEvent) => {
    e.preventDefault();
    if (!contactForm.phone.trim()) return;
    addContactMutation.mutate(contactForm);
  };

  const handleCreateBroadcast = (e: FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.name.trim() || !broadcastForm.messageTemplate.trim()) return;
    createBroadcastMutation.mutate(broadcastForm);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Radio className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            WA Broadcast
          </h2>
          <p className="text-muted-foreground">Kelola kontak dan kirim broadcast WhatsApp</p>
        </div>
      </div>

      <Tabs defaultValue="contacts" data-testid="tabs-broadcast">
        <TabsList data-testid="tabs-list-broadcast">
          <TabsTrigger value="contacts" data-testid="tab-contacts">
            <Phone className="w-4 h-4 mr-2" />
            Kontak WA
          </TabsTrigger>
          <TabsTrigger value="broadcasts" data-testid="tab-broadcasts">
            <Radio className="w-4 h-4 mr-2" />
            Broadcast
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tambah Kontak Manual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddContact} className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Nomor Telepon</Label>
                  <Input
                    id="contact-phone"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="628xxxxxxxxxx"
                    data-testid="input-contact-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Nama</Label>
                  <Input
                    id="contact-name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Nama kontak"
                    data-testid="input-contact-name"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={addContactMutation.isPending || !contactForm.phone.trim()}
                    data-testid="button-add-contact"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {addContactMutation.isPending ? "Menambahkan..." : "Tambah"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Daftar Kontak ({contacts.length})
            </h3>

            {contactsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="h-12 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12">
                <Phone className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Belum ada kontak</p>
              </div>
            ) : (
              contacts.map((contact: any) => (
                <Card key={contact.id} data-testid={`card-contact-${contact.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground" data-testid={`text-contact-phone-${contact.id}`}>
                            {contact.phone}
                          </p>
                          {contact.name && (
                            <span className="text-muted-foreground" data-testid={`text-contact-name-${contact.id}`}>
                              — {contact.name}
                            </span>
                          )}
                          <Badge
                            variant={contact.isOptedOut ? "destructive" : "default"}
                            data-testid={`badge-contact-status-${contact.id}`}
                          >
                            {contact.isOptedOut ? "Opt-Out" : "Aktif"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1" data-testid={`text-contact-source-${contact.id}`}>
                            Sumber: {contact.source || "-"}
                          </span>
                          {contact.lastSeenAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Terakhir: {new Date(contact.lastSeenAt).toLocaleDateString("id-ID")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleOptOutMutation.mutate({ id: contact.id, isOptedOut: contact.isOptedOut })}
                          disabled={toggleOptOutMutation.isPending}
                          data-testid={`button-toggle-optout-${contact.id}`}
                        >
                          {contact.isOptedOut ? (
                            <ToggleLeft className="w-4 h-4 mr-1" />
                          ) : (
                            <ToggleRight className="w-4 h-4 mr-1" />
                          )}
                          {contact.isOptedOut ? "Aktifkan" : "Opt-Out"}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (window.confirm("Apakah Anda yakin ingin menghapus kontak ini?")) {
                              deleteContactMutation.mutate(contact.id);
                            }
                          }}
                          disabled={deleteContactMutation.isPending}
                          data-testid={`button-delete-contact-${contact.id}`}
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

        <TabsContent value="broadcasts" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Buat Broadcast Baru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBroadcast} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="broadcast-name">Nama Broadcast</Label>
                  <Input
                    id="broadcast-name"
                    value={broadcastForm.name}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, name: e.target.value })}
                    placeholder="Nama broadcast"
                    data-testid="input-broadcast-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broadcast-schedule-type">Jadwal</Label>
                  <Select
                    value={broadcastForm.scheduleType}
                    onValueChange={(value: "once" | "daily") => setBroadcastForm({ ...broadcastForm, scheduleType: value })}
                  >
                    <SelectTrigger data-testid="select-broadcast-schedule-type">
                      <SelectValue placeholder="Pilih jadwal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Sekali Kirim</SelectItem>
                      <SelectItem value="daily">Harian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broadcast-schedule-time">Waktu Kirim</Label>
                  <Input
                    id="broadcast-schedule-time"
                    type="time"
                    value={broadcastForm.scheduleTime}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, scheduleTime: e.target.value })}
                    data-testid="input-broadcast-schedule-time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broadcast-data-source">Sumber Data</Label>
                  <Select
                    value={broadcastForm.dataSource || "_custom"}
                    onValueChange={(value) => setBroadcastForm({ ...broadcastForm, dataSource: value === "_custom" ? "" : value })}
                  >
                    <SelectTrigger data-testid="select-broadcast-data-source">
                      <SelectValue placeholder="Pilih sumber data" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_custom">Custom (Manual)</SelectItem>
                      <SelectItem value="tender_daily">Data Tender Harian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="broadcast-message">Template Pesan</Label>
                  <Textarea
                    id="broadcast-message"
                    value={broadcastForm.messageTemplate}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, messageTemplate: e.target.value })}
                    placeholder="Tulis template pesan..."
                    rows={4}
                    data-testid="input-broadcast-message"
                  />
                  <p className="text-xs text-muted-foreground">
                    {"Placeholder: {{name}}, {{date}}, {{tender_list}}, {{count}}"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="broadcast-enabled"
                    checked={broadcastForm.isEnabled}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, isEnabled: e.target.checked })}
                    className="rounded border-input"
                    data-testid="checkbox-broadcast-enabled"
                  />
                  <Label htmlFor="broadcast-enabled">Aktifkan Langsung</Label>
                </div>
                <div className="flex items-end justify-end">
                  <Button
                    type="submit"
                    disabled={createBroadcastMutation.isPending || !broadcastForm.name.trim() || !broadcastForm.messageTemplate.trim()}
                    data-testid="button-create-broadcast"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {createBroadcastMutation.isPending ? "Membuat..." : "Buat Broadcast"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Daftar Broadcast
            </h3>

            {broadcastsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="h-12 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : broadcasts.length === 0 ? (
              <div className="text-center py-12">
                <Radio className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Belum ada broadcast</p>
              </div>
            ) : (
              broadcasts.map((broadcast: any) => (
                <Card key={broadcast.id} data-testid={`card-broadcast-${broadcast.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground" data-testid={`text-broadcast-name-${broadcast.id}`}>
                            {broadcast.name}
                          </p>
                          <Badge
                            variant={broadcast.isEnabled ? "default" : "secondary"}
                            data-testid={`badge-broadcast-status-${broadcast.id}`}
                          >
                            {broadcast.isEnabled ? "Aktif" : "Nonaktif"}
                          </Badge>
                          <Badge variant="outline" data-testid={`badge-broadcast-schedule-${broadcast.id}`}>
                            {broadcast.scheduleType === "daily" ? "Harian" : "Sekali"}
                          </Badge>
                          {broadcast.status && (
                            <Badge variant="secondary" data-testid={`badge-broadcast-run-status-${broadcast.id}`}>
                              {broadcast.status}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Jadwal: {broadcast.scheduleTime || "-"}
                          </span>
                          {broadcast.lastRunAt && (
                            <span className="flex items-center gap-1">
                              Terakhir: {new Date(broadcast.lastRunAt).toLocaleDateString("id-ID")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => sendNowMutation.mutate(broadcast.id)}
                          disabled={sendNowMutation.isPending}
                          data-testid={`button-send-now-${broadcast.id}`}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Kirim Sekarang
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleBroadcastMutation.mutate({ id: broadcast.id, isEnabled: broadcast.isEnabled })}
                          disabled={toggleBroadcastMutation.isPending}
                          data-testid={`button-toggle-broadcast-${broadcast.id}`}
                        >
                          {broadcast.isEnabled ? (
                            <ToggleRight className="w-4 h-4 mr-1" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 mr-1" />
                          )}
                          {broadcast.isEnabled ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (window.confirm("Apakah Anda yakin ingin menghapus broadcast ini?")) {
                              deleteBroadcastMutation.mutate(broadcast.id);
                            }
                          }}
                          disabled={deleteBroadcastMutation.isPending}
                          data-testid={`button-delete-broadcast-${broadcast.id}`}
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
      </Tabs>
    </div>
  );
}