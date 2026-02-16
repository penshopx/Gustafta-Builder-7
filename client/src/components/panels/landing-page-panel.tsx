import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Copy, Check, ExternalLink, ChevronDown, ChevronUp, HelpCircle, Shield, Award, Star, AlertTriangle, Quote, Image } from "lucide-react";
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

interface DemoItem {
  title: string;
  description: string;
  imageUrl: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface AuthorityData {
  title: string;
  description: string;
  credentials: string[];
}

export function LandingPagePanel({ agent }: { agent: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [enabled, setEnabled] = useState(agent.landingPageEnabled ?? false);
  const [heroHeadline, setHeroHeadline] = useState(agent.landingHeroHeadline || "");
  const [heroSubheadline, setHeroSubheadline] = useState(agent.landingHeroSubheadline || "");
  const [heroCtaText, setHeroCtaText] = useState(agent.landingHeroCtaText || "Mulai Sekarang");
  const [painPoints, setPainPoints] = useState<string[]>((agent.landingPainPoints as string[]) || []);
  const [solutionText, setSolutionText] = useState(agent.landingSolutionText || "");
  const [benefits, setBenefits] = useState<string[]>((agent.landingBenefits as string[]) || []);
  const [demoItems, setDemoItems] = useState<DemoItem[]>((agent.landingDemoItems as DemoItem[]) || []);
  const [testimonials, setTestimonials] = useState<Testimonial[]>((agent.landingTestimonials as Testimonial[]) || []);
  const [faq, setFaq] = useState<FaqItem[]>((agent.landingFaq as FaqItem[]) || []);
  const [authority, setAuthority] = useState<AuthorityData>(() => {
    const raw = (agent.landingAuthority as AuthorityData) || {};
    return {
      title: raw.title || "",
      description: raw.description || "",
      credentials: raw.credentials || [],
    };
  });
  const [guarantees, setGuarantees] = useState<string[]>((agent.landingGuarantees as string[]) || []);

  const [newPainPoint, setNewPainPoint] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newGuarantee, setNewGuarantee] = useState("");
  const [newCredential, setNewCredential] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("hero");

  useEffect(() => {
    setEnabled(agent.landingPageEnabled ?? false);
    setHeroHeadline(agent.landingHeroHeadline || "");
    setHeroSubheadline(agent.landingHeroSubheadline || "");
    setHeroCtaText(agent.landingHeroCtaText || "Mulai Sekarang");
    setPainPoints((agent.landingPainPoints as string[]) || []);
    setSolutionText(agent.landingSolutionText || "");
    setBenefits((agent.landingBenefits as string[]) || []);
    setDemoItems((agent.landingDemoItems as DemoItem[]) || []);
    setTestimonials((agent.landingTestimonials as Testimonial[]) || []);
    setFaq((agent.landingFaq as FaqItem[]) || []);
    const rawAuth = (agent.landingAuthority as AuthorityData) || {};
    setAuthority({
      title: rawAuth.title || "",
      description: rawAuth.description || "",
      credentials: rawAuth.credentials || [],
    });
    setGuarantees((agent.landingGuarantees as string[]) || []);
  }, [agent]);

  const updateMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiRequest("PATCH", `/api/agents/${agent.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({ title: "Berhasil", description: "Landing page berhasil disimpan" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menyimpan landing page", variant: "destructive" });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      landingPageEnabled: enabled,
      landingHeroHeadline: heroHeadline,
      landingHeroSubheadline: heroSubheadline,
      landingHeroCtaText: heroCtaText,
      landingPainPoints: painPoints,
      landingSolutionText: solutionText,
      landingBenefits: benefits,
      landingDemoItems: demoItems,
      landingTestimonials: testimonials,
      landingFaq: faq,
      landingAuthority: authority,
      landingGuarantees: guarantees,
    });
  };

  const getLandingUrl = () => `${window.location.origin}/product/${agent.id}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(getLandingUrl());
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    toast({ title: "Disalin!", description: "URL landing page berhasil disalin" });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const addToList = (list: string[], setList: (v: string[]) => void, value: string, setValue: (v: string) => void) => {
    if (value.trim()) {
      setList([...list, value.trim()]);
      setValue("");
    }
  };

  const removeFromList = (list: string[], setList: (v: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const SectionHeader = ({ id, icon: Icon, title, count }: { id: string; icon: any; title: string; count?: number }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between gap-2 p-3 text-left"
      data-testid={`button-toggle-${id}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="font-medium">{title}</span>
        {count !== undefined && count > 0 && (
          <Badge variant="secondary" className="text-xs">{count}</Badge>
        )}
      </div>
      {expandedSection === id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Landing Page</h2>
            <p className="text-muted-foreground">Halaman marketing untuk onboarding chatbot Anda</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} data-testid="button-save-landing">
          {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Aktifkan Landing Page</Label>
              <p className="text-xs text-muted-foreground">Landing page publik yang berfungsi sebagai etalase chatbot Anda</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-landing-enabled" />
          </div>

          {enabled && (
            <div className="flex items-center gap-2 pt-2">
              <Input value={getLandingUrl()} readOnly className="text-sm" data-testid="input-landing-url" />
              <Button size="icon" variant="outline" onClick={copyUrl} data-testid="button-copy-landing-url">
                {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button size="icon" variant="outline" onClick={() => window.open(getLandingUrl(), "_blank")} data-testid="button-preview-landing">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {enabled && (
        <div className="space-y-3">
          <Card>
            <SectionHeader id="hero" icon={Star} title="Hero Section" />
            {expandedSection === "hero" && (
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Headline Utama</Label>
                  <Input
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    placeholder="Contoh: Apakah Perusahaan Anda Siap Lolos Tender?"
                    data-testid="input-hero-headline"
                  />
                  <p className="text-xs text-muted-foreground">Hook yang tajam, bukan hype AI. Fokus ke masalah user.</p>
                </div>
                <div className="space-y-2">
                  <Label>Subheadline</Label>
                  <Input
                    value={heroSubheadline}
                    onChange={(e) => setHeroSubheadline(e.target.value)}
                    placeholder="Contoh: Cek kesiapan tender Anda dalam 5 menit"
                    data-testid="input-hero-subheadline"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teks Tombol CTA</Label>
                  <Input
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    placeholder="Mulai Sekarang"
                    data-testid="input-hero-cta"
                  />
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <SectionHeader id="pain" icon={AlertTriangle} title="Problem Agitation (Pain Points)" count={painPoints.length} />
            {expandedSection === "pain" && (
              <CardContent className="space-y-4 pt-0">
                <p className="text-xs text-muted-foreground">Masalah yang membuat calon pengguna merasa &quot;ini relevan untuk saya&quot;</p>
                <div className="flex items-center gap-2">
                  <Input
                    value={newPainPoint}
                    onChange={(e) => setNewPainPoint(e.target.value)}
                    placeholder="Contoh: 70% kontraktor kecil gugur karena dokumen tidak sistematis"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList(painPoints, setPainPoints, newPainPoint, setNewPainPoint); } }}
                    data-testid="input-new-pain-point"
                  />
                  <Button size="icon" variant="outline" onClick={() => addToList(painPoints, setPainPoints, newPainPoint, setNewPainPoint)} disabled={!newPainPoint.trim()} data-testid="button-add-pain-point">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {painPoints.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                    <span className="flex-1 text-sm">{item}</span>
                    <Button size="icon" variant="ghost" onClick={() => removeFromList(painPoints, setPainPoints, i)} data-testid={`button-remove-pain-${i}`}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          <Card>
            <SectionHeader id="solution" icon={FileText} title="Solution Framing" />
            {expandedSection === "solution" && (
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Deskripsi Solusi</Label>
                  <Textarea
                    value={solutionText}
                    onChange={(e) => setSolutionText(e.target.value)}
                    placeholder="Contoh: Chatbot ini bukan sekadar tanya jawab. Ia menganalisis kondisi perusahaan Anda dan menunjukkan gap yang menghambat kelolosan tender."
                    rows={3}
                    data-testid="input-solution-text"
                  />
                  <p className="text-xs text-muted-foreground">Jelaskan bagaimana chatbot menyelesaikan masalah. Tekankan diagnosis personal, rekomendasi spesifik, roadmap tindakan.</p>
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <SectionHeader id="benefits" icon={Star} title="Outcome Benefits" count={benefits.length} />
            {expandedSection === "benefits" && (
              <CardContent className="space-y-4 pt-0">
                <p className="text-xs text-muted-foreground">Fokus pada HASIL, bukan fitur teknis. Tulis apa yang user dapatkan.</p>
                <div className="flex items-center gap-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Contoh: Kurangi risiko gugur administrasi"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList(benefits, setBenefits, newBenefit, setNewBenefit); } }}
                    data-testid="input-new-benefit"
                  />
                  <Button size="icon" variant="outline" onClick={() => addToList(benefits, setBenefits, newBenefit, setNewBenefit)} disabled={!newBenefit.trim()} data-testid="button-add-benefit">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {benefits.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <Star className="w-4 h-4 text-primary shrink-0" />
                    <span className="flex-1 text-sm">{item}</span>
                    <Button size="icon" variant="ghost" onClick={() => removeFromList(benefits, setBenefits, i)} data-testid={`button-remove-benefit-${i}`}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          <Card>
            <SectionHeader id="demo" icon={Image} title="Demo / Preview" count={demoItems.length} />
            {expandedSection === "demo" && (
              <CardContent className="space-y-4 pt-0">
                <p className="text-xs text-muted-foreground">Tampilkan contoh output: screenshot flow chatbot, contoh skor, contoh gap analysis. Orang harus melihat output sebelum beli.</p>
                <Button
                  variant="outline"
                  onClick={() => setDemoItems([...demoItems, { title: "", description: "", imageUrl: "" }])}
                  data-testid="button-add-demo"
                >
                  <Plus className="w-4 h-4 mr-2" /> Tambah Demo Item
                </Button>
                {demoItems.map((item, i) => (
                  <Card key={i} className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-sm font-medium">Demo #{i + 1}</Label>
                      <Button size="icon" variant="ghost" onClick={() => setDemoItems(demoItems.filter((_, idx) => idx !== i))} data-testid={`button-remove-demo-${i}`}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      value={item.title}
                      onChange={(e) => { const updated = [...demoItems]; updated[i] = { ...updated[i], title: e.target.value }; setDemoItems(updated); }}
                      placeholder="Judul demo"
                      data-testid={`input-demo-title-${i}`}
                    />
                    <Input
                      value={item.description}
                      onChange={(e) => { const updated = [...demoItems]; updated[i] = { ...updated[i], description: e.target.value }; setDemoItems(updated); }}
                      placeholder="Deskripsi singkat"
                      data-testid={`input-demo-desc-${i}`}
                    />
                    <Input
                      value={item.imageUrl}
                      onChange={(e) => { const updated = [...demoItems]; updated[i] = { ...updated[i], imageUrl: e.target.value }; setDemoItems(updated); }}
                      placeholder="URL gambar (opsional)"
                      data-testid={`input-demo-image-${i}`}
                    />
                  </Card>
                ))}
              </CardContent>
            )}
          </Card>

          <Card>
            <SectionHeader id="testimonials" icon={Quote} title="Social Proof / Testimoni" count={testimonials.length} />
            {expandedSection === "testimonials" && (
              <CardContent className="space-y-4 pt-0">
                <p className="text-xs text-muted-foreground">Testimoni klien, studi kasus singkat, before/after. Wajib untuk B2B.</p>
                <Button
                  variant="outline"
                  onClick={() => setTestimonials([...testimonials, { name: "", role: "", company: "", quote: "" }])}
                  data-testid="button-add-testimonial"
                >
                  <Plus className="w-4 h-4 mr-2" /> Tambah Testimoni
                </Button>
                {testimonials.map((item, i) => (
                  <Card key={i} className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-sm font-medium">Testimoni #{i + 1}</Label>
                      <Button size="icon" variant="ghost" onClick={() => setTestimonials(testimonials.filter((_, idx) => idx !== i))} data-testid={`button-remove-testimonial-${i}`}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Input
                        value={item.name}
                        onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], name: e.target.value }; setTestimonials(u); }}
                        placeholder="Nama"
                        data-testid={`input-testimonial-name-${i}`}
                      />
                      <Input
                        value={item.role}
                        onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], role: e.target.value }; setTestimonials(u); }}
                        placeholder="Jabatan"
                        data-testid={`input-testimonial-role-${i}`}
                      />
                      <Input
                        value={item.company}
                        onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], company: e.target.value }; setTestimonials(u); }}
                        placeholder="Perusahaan"
                        data-testid={`input-testimonial-company-${i}`}
                      />
                    </div>
                    <Textarea
                      value={item.quote}
                      onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], quote: e.target.value }; setTestimonials(u); }}
                      placeholder="Kutipan testimoni..."
                      rows={2}
                      data-testid={`input-testimonial-quote-${i}`}
                    />
                  </Card>
                ))}
              </CardContent>
            )}
          </Card>

          <Card>
            <SectionHeader id="guarantees" icon={Shield} title="Risk Reversal / Jaminan" count={guarantees.length} />
            {expandedSection === "guarantees" && (
              <CardContent className="space-y-4 pt-0">
                <p className="text-xs text-muted-foreground">Jaminan menurunkan resistance pembelian. Contoh: revisi sampai sesuai, garansi kepuasan, konsultasi awal gratis.</p>
                <div className="flex items-center gap-2">
                  <Input
                    value={newGuarantee}
                    onChange={(e) => setNewGuarantee(e.target.value)}
                    placeholder="Contoh: Revisi sampai sesuai kebutuhan Anda"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList(guarantees, setGuarantees, newGuarantee, setNewGuarantee); } }}
                    data-testid="input-new-guarantee"
                  />
                  <Button size="icon" variant="outline" onClick={() => addToList(guarantees, setGuarantees, newGuarantee, setNewGuarantee)} disabled={!newGuarantee.trim()} data-testid="button-add-guarantee">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {guarantees.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <Shield className="w-4 h-4 text-primary shrink-0" />
                    <span className="flex-1 text-sm">{item}</span>
                    <Button size="icon" variant="ghost" onClick={() => removeFromList(guarantees, setGuarantees, i)} data-testid={`button-remove-guarantee-${i}`}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          <Card>
            <SectionHeader id="authority" icon={Award} title="Authority / Kredensial" count={authority.credentials.length} />
            {expandedSection === "authority" && (
              <CardContent className="space-y-4 pt-0">
                <p className="text-xs text-muted-foreground">Tampilkan kredensial: pengalaman, sertifikasi, proyek yang pernah ditangani. Market ini peduli trust.</p>
                <div className="space-y-2">
                  <Label>Judul</Label>
                  <Input
                    value={authority.title}
                    onChange={(e) => setAuthority({ ...authority, title: e.target.value })}
                    placeholder="Contoh: Didukung oleh Praktisi Konstruksi Berpengalaman"
                    data-testid="input-authority-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    value={authority.description}
                    onChange={(e) => setAuthority({ ...authority, description: e.target.value })}
                    placeholder="Ceritakan latar belakang dan pengalaman yang relevan..."
                    rows={3}
                    data-testid="input-authority-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kredensial / Pencapaian</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newCredential}
                      onChange={(e) => setNewCredential(e.target.value)}
                      placeholder="Contoh: 15+ tahun pengalaman konstruksi"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newCredential.trim()) {
                            setAuthority({ ...authority, credentials: [...authority.credentials, newCredential.trim()] });
                            setNewCredential("");
                          }
                        }
                      }}
                      data-testid="input-new-credential"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        if (newCredential.trim()) {
                          setAuthority({ ...authority, credentials: [...authority.credentials, newCredential.trim()] });
                          setNewCredential("");
                        }
                      }}
                      disabled={!newCredential.trim()}
                      data-testid="button-add-credential"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {authority.credentials.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <Award className="w-4 h-4 text-primary shrink-0" />
                      <span className="flex-1 text-sm">{item}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setAuthority({ ...authority, credentials: authority.credentials.filter((_, idx) => idx !== i) })}
                        data-testid={`button-remove-credential-${i}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <SectionHeader id="faq" icon={HelpCircle} title="FAQ" count={faq.length} />
            {expandedSection === "faq" && (
              <CardContent className="space-y-4 pt-0">
                <p className="text-xs text-muted-foreground">Atasi keberatan umum: keamanan data, jaminan hasil, cocok untuk skala kecil, dst.</p>
                <Button
                  variant="outline"
                  onClick={() => setFaq([...faq, { question: "", answer: "" }])}
                  data-testid="button-add-faq"
                >
                  <Plus className="w-4 h-4 mr-2" /> Tambah FAQ
                </Button>
                {faq.map((item, i) => (
                  <Card key={i} className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-sm font-medium">FAQ #{i + 1}</Label>
                      <Button size="icon" variant="ghost" onClick={() => setFaq(faq.filter((_, idx) => idx !== i))} data-testid={`button-remove-faq-${i}`}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      value={item.question}
                      onChange={(e) => { const u = [...faq]; u[i] = { ...u[i], question: e.target.value }; setFaq(u); }}
                      placeholder="Pertanyaan"
                      data-testid={`input-faq-question-${i}`}
                    />
                    <Textarea
                      value={item.answer}
                      onChange={(e) => { const u = [...faq]; u[i] = { ...u[i], answer: e.target.value }; setFaq(u); }}
                      placeholder="Jawaban"
                      rows={2}
                      data-testid={`input-faq-answer-${i}`}
                    />
                  </Card>
                ))}
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
