import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useGustaftaAssistant } from "@/hooks/use-agents";
import { useTemplates } from "@/hooks/use-templates";
import { trackLead, trackViewContent } from "@/hooks/use-meta-pixel";
import { ChatPopup } from "@/components/chat-popup";
import { SharedHeader } from "@/components/shared-header";
import { TemplateShowcase } from "@/components/template-showcase";
import { 
  Bot, Sparkles, MessageSquare, Globe, Shield, 
  BookOpen, BarChart3, Lightbulb, ArrowRight, Check,
  Zap, Palette, Code, Cpu, Layers,
  Clock, TrendingUp, Users, Star, CheckCircle2, XCircle, AlertTriangle,
  HeartHandshake, Award, Target, Rocket, Lock, RefreshCw, Play,
  Brain, Blocks, Camera, Plug, ExternalLink, Wrench
} from "lucide-react";

export default function Landing() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: gustaftaAssistant } = useGustaftaAssistant();
  const { data: templatesData } = useTemplates();

  useEffect(() => {
    trackViewContent({ content_name: 'Landing Page', content_category: 'Homepage' });
  }, []);

  const handleLoginClick = () => {
    trackLead({ content_name: 'Login Button Click' });
  };

  const handleStartNowClick = () => {
    trackLead({ content_name: 'Start Now CTA' });
  };

  const handlePricingClick = () => {
    trackViewContent({ content_name: 'Pricing Page', content_category: 'Pricing' });
  };

  const painPoints = [
    {
      icon: Clock,
      problem: "Laporan proyek manual memakan waktu berjam-jam",
      solution: "Generate laporan otomatis dengan AI dari data Project Brain dalam hitungan menit"
    },
    {
      icon: AlertTriangle,
      problem: "Isu proyek sering terlewat dan terlambat di-follow up",
      solution: "Issue Log & Action Tracker otomatis mendeteksi, prioritaskan, dan eskalasi isu"
    },
    {
      icon: TrendingUp,
      problem: "Risiko proyek tidak teridentifikasi sejak dini",
      solution: "Risk Radar AI menganalisis risiko teknis, jadwal, dan biaya secara real-time"
    },
    {
      icon: Users,
      problem: "Informasi proyek tersebar dan sulit diakses tim",
      solution: "Project Brain memusatkan semua data proyek untuk akses tim kapan saja"
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "Project Brain (Otak Proyek)",
      description: "Pusatkan data proyek dengan template CiviloPro - tahap proyek, isu, keputusan, risiko, dan batasan dalam satu tempat"
    },
    {
      icon: Blocks,
      title: "Mini Apps (12 Tools)",
      description: "6 tools dasar (Checklist, Kalkulator, Risk Assessment, Progress Tracker, Doc Generator, Custom) + 6 AI-powered (Issue Log, Action Tracker, Change Log, Snapshot, Decision Summary, Risk Radar)"
    },
    {
      icon: Lightbulb,
      title: "Big Idea \u2192 Toolbox \u2192 Agent",
      description: "Arsitektur hierarkis untuk mengorganisir proyek: dari visi besar ke kategori kerja hingga agen AI spesifik"
    },
    {
      icon: Sparkles,
      title: "Agentic AI",
      description: "AI cerdas dengan kemampuan mendengar aktif, retensi konteks, koreksi diri, dan pemahaman data proyek"
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Upload PDF, PPT, Excel, gambar teknis, atau URL untuk memperkaya pengetahuan agen AI proyek Anda"
    },
    {
      icon: Plug,
      title: "Multi-Channel & Integrasi",
      description: "WhatsApp, Telegram, Discord, Slack, Web Widget, dan REST API untuk komunikasi tim proyek"
    },
  ];

  const advancedFeatures = [
    {
      icon: Camera,
      title: "Project Snapshot AI",
      description: "Ringkasan kondisi proyek otomatis untuk laporan manajemen - status, isu, risiko, dan keputusan terakhir"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Pantau performa agen AI dengan metrik pesan, sesi, engagement, dan peak hours"
    },
    {
      icon: Cpu,
      title: "Multi-Model AI",
      description: "GPT-4o, GPT-3.5, DeepSeek, Claude, atau model custom dengan API endpoint sendiri"
    },
    {
      icon: Palette,
      title: "Widget Customization",
      description: "Kustomisasi tampilan widget chat sesuai branding proyek - warna, posisi, ukuran, dan logo"
    },
    {
      icon: Shield,
      title: "Access Control & Keamanan",
      description: "Token akses per agen, mode publik/privat, kontrol domain, dan enkripsi data proyek"
    },
    {
      icon: Code,
      title: "API & Webhook",
      description: "REST API lengkap dan webhook untuk integrasi dengan sistem manajemen proyek Anda"
    },
  ];

  const testimonials = [
    {
      name: "Ir. Budi Santoso",
      role: "Project Manager, PT Pembangunan Jaya",
      avatar: "BS",
      content: "Project Brain mengubah cara kami mengelola data proyek. Laporan mingguan yang biasa butuh 4 jam sekarang selesai dalam 10 menit.",
      rating: 5
    },
    {
      name: "Sarah Wijaya, ST",
      role: "QA/QC Manager, Konstruksi Mandiri",
      avatar: "SW",
      content: "Issue Log dan Risk Radar sangat membantu tim QC kami. Isu kritis tidak pernah terlewat lagi sejak pakai Gustafta.",
      rating: 5
    },
    {
      name: "Andi Pratama, MT",
      role: "Site Engineer, Infrastruktur Nusantara",
      avatar: "AP",
      content: "Mini Apps untuk checklist dan action tracker mempercepat koordinasi tim di lapangan. Sangat praktis!",
      rating: 5
    },
  ];

  const comparisonData = [
    { feature: "Project Brain (Data Proyek Terpusat)", gustafta: true, others: false },
    { feature: "Mini Apps AI (12 Tools)", gustafta: true, others: false },
    { feature: "Risk Radar & Issue Log Otomatis", gustafta: true, others: false },
    { feature: "Template Konstruksi (CiviloPro)", gustafta: true, others: false },
    { feature: "Hierarki Big Idea \u2192 Toolbox \u2192 Agent", gustafta: true, others: false },
    { feature: "Multi-Channel (WhatsApp, Telegram, dll)", gustafta: "6+ channels", others: "1-2 channels" },
    { feature: "Multi-Model AI (GPT-4, Claude, DeepSeek)", gustafta: true, others: "Limited" },
    { feature: "Analytics & Laporan Otomatis", gustafta: true, others: "Basic" },
  ];

  const faqItems = [
    {
      question: "Apa itu Project Brain dan bagaimana cara kerjanya?",
      answer: "Project Brain (Otak Proyek) adalah fitur untuk memusatkan semua data proyek Anda - mulai dari tahap proyek, isu, keputusan, risiko, hingga batasan. Data ini otomatis digunakan oleh Mini Apps AI untuk menghasilkan laporan, analisis risiko, dan rekomendasi yang kontekstual."
    },
    {
      question: "Apa saja Mini Apps yang tersedia?",
      answer: "Ada 12 Mini Apps: 6 tools dasar (Checklist, Kalkulator, Risk Assessment, Progress Tracker, Document Generator, Custom) dan 6 AI-powered (Issue Log, Action Tracker, Change Log, Project Snapshot, Decision Summary, Risk Radar). Setiap Mini App memiliki konfigurasi JSON yang bisa disesuaikan."
    },
    {
      question: "Apakah cocok untuk proyek konstruksi?",
      answer: "Sangat cocok! Gustafta dilengkapi template CiviloPro khusus untuk civil engineering dan konstruksi - termasuk field untuk tahap proyek, jenis isu teknis, level risiko, dan batasan biaya/waktu."
    },
    {
      question: "Bagaimana struktur Big Idea, Toolbox, dan Agent?",
      answer: "Big Idea adalah level tertinggi (visi/brand proyek), Toolbox adalah kategori kerja di bawahnya, dan Agent adalah agen AI spesifik yang menjalankan tugas. Struktur ini membantu mengorganisir proyek besar dengan banyak aspek."
    },
    {
      question: "Apakah saya perlu keahlian coding?",
      answer: "Tidak! Semua konfigurasi dilakukan melalui antarmuka visual. Project Brain, Mini Apps, dan Persona AI semuanya bisa di-setup tanpa menulis kode apapun."
    },
    {
      question: "Bagaimana dengan keamanan data proyek?",
      answer: "Data proyek Anda aman dengan enkripsi, token akses per agen, mode publik/privat, dan kontrol domain. Anda memiliki kontrol penuh atas siapa yang bisa mengakses data proyek."
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Buat Big Idea & Project Brain",
      description: "Definisikan proyek dan isi data di Otak Proyek dengan template CiviloPro",
      time: "2 menit"
    },
    {
      number: "2", 
      title: "Setup Agent & Mini Apps",
      description: "Konfigurasi agen AI, pilih Mini Apps yang dibutuhkan, dan tambahkan Knowledge Base",
      time: "3 menit"
    },
    {
      number: "3",
      title: "Deploy & Kolaborasi",
      description: "Integrasikan ke WhatsApp/Web dan mulai gunakan bersama tim proyek",
      time: "2 menit"
    },
  ];

  const trustBadges = [
    { icon: Lock, label: "Data Terenkripsi" },
    { icon: RefreshCw, label: "99.9% Uptime" },
    { icon: HeartHandshake, label: "Support 24/7" },
    { icon: Award, label: "ISO Certified" },
  ];

  const categories = [
    "Gedung & Highrise", "Jalan & Jembatan", "Infrastruktur", "Geoteknik",
    "Struktur Baja", "MEP", "EPC", "QS & Estimasi", "HSE", "QA/QC",
    "Manajemen Proyek", "Pengawasan"
  ];

  const stats = [
    { value: "12", label: "Mini Apps Tersedia" },
    { value: "6", label: "AI-Powered Tools" },
    { value: "500+", label: "Proyek Terbantu" },
    { value: "98%", label: "Kepuasan Pengguna" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      {/* ATTENTION: Hero Section with Strong Value Proposition */}
      <section className="relative overflow-hidden py-16 md:py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-pulse">
              <Brain className="h-4 w-4" />
              <span>Project Brain + 12 Mini Apps AI</span>
              <Sparkles className="h-4 w-4" />
            </div>
            
            {/* Main Headline - AIDA Attention */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              AI Project Intelligence
              <br className="hidden md:block" />
              untuk
              <span className="text-primary"> Manajemen Proyek</span>
              <br className="hidden md:block" />
              <span className="text-primary">Konstruksi</span>
            </h1>
            
            {/* Subheadline - Value Proposition */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Pusatkan data proyek di Project Brain, jalankan 12 Mini Apps AI untuk analisis otomatis,
              dan deploy agen cerdas untuk tim Anda. Tanpa coding.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <badge.icon className="h-4 w-4 text-primary" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons - AIDA Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-6" data-testid="button-start-now">
                    <Rocket className="h-5 w-5" />
                    Buka Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <a href="/api/login" onClick={handleStartNowClick} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 text-lg px-8 py-6" data-testid="button-start-now">
                    <Rocket className="h-5 w-5" />
                    Mulai Gratis Sekarang
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
              )}
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-lg px-8 py-6" data-testid="button-watch-demo">
                <Play className="h-5 w-5" />
                Lihat Demo
              </Button>
            </div>
            
            {/* Risk Reversal */}
            <p className="text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 inline mr-1 text-green-500" />
              Gratis untuk memulai. Tidak perlu kartu kredit. Setup dalam 7 menit.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof: Statistics */}
      <section className="py-12 bg-muted/50 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEREST: Pain Points & Solutions (Problem-Agitate-Solve) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Masalah & Solusi</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Tantangan Proyek yang Kami Selesaikan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tim proyek konstruksi menghadapi tantangan yang sama. Gustafta hadir sebagai solusi cerdas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {painPoints.map((item, index) => (
              <Card key={index} className="hover-elevate overflow-visible" data-testid={`card-pain-point-${index}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-destructive" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <p className="font-medium text-destructive">{item.problem}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{item.solution}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Quick Setup */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Cara Kerja</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              3 Langkah Mudah, 7 Menit Saja
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tidak perlu developer, tidak perlu koding. Setup Project Brain dan agen AI untuk tim proyek Anda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative" data-testid={`step-${step.number}`}>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
                )}
                <div className="relative bg-background rounded-xl p-6 border text-center hover-elevate">
                  <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <Badge variant="outline" className="mb-3">{step.time}</Badge>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            {!isAuthenticated && (
              <a href="/api/login" onClick={handleStartNowClick}>
                <Button size="lg" className="gap-2" data-testid="button-try-now">
                  <Target className="h-5 w-5" />
                  Coba Sekarang - Gratis
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Fitur Utama</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Platform Project Intelligence Terlengkap
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dari Project Brain hingga Mini Apps AI - semua yang dibutuhkan tim proyek dalam satu platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate" data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Template Library</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Template Proyek Siap Pakai
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pilih dari {templatesData?.templates.length || 10}+ template CiviloPro untuk berbagai jenis proyek konstruksi.
              Kustomisasi sesuai kebutuhan proyek Anda dalam hitungan menit.
            </p>
          </div>
          
          {templatesData && (
            <TemplateShowcase 
              showCreateButton={false} 
              maxItems={6} 
              compact={true}
            />
          )}

          <div className="text-center mt-10">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2" data-testid="button-explore-templates">
                  <Layers className="h-5 w-5" />
                  Jelajahi Semua Template
                </Button>
              </Link>
            ) : (
              <a href="/api/login">
                <Button size="lg" className="gap-2" data-testid="button-explore-templates-login">
                  <Layers className="h-5 w-5" />
                  Jelajahi Template
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* DESIRE: Testimonials (Social Proof) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Testimoni</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Dipercaya oleh Profesional Konstruksi
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lihat bagaimana Gustafta membantu tim proyek mengelola pekerjaan lebih efisien
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-testimonial-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Perbandingan</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Mengapa Gustafta Lebih Unggul?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bandingkan fitur Gustafta dengan tools manajemen proyek lainnya
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="table-comparison">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Fitur</th>
                        <th className="text-center p-4 font-semibold bg-primary/5">
                          <div className="flex items-center justify-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            Gustafta
                          </div>
                        </th>
                        <th className="text-center p-4 font-semibold text-muted-foreground">Kompetitor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="p-4 text-sm">{row.feature}</td>
                          <td className="p-4 text-center bg-primary/5">
                            {typeof row.gustafta === 'boolean' ? (
                              row.gustafta ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive mx-auto" />
                              )
                            ) : (
                              <span className="text-sm font-medium text-primary">{row.gustafta}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {typeof row.others === 'boolean' ? (
                              row.others ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-muted-foreground">{row.others}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Fitur Lanjutan</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Kemampuan Lebih untuk Tim Proyek
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fitur tambahan untuk monitoring, pelaporan, dan kolaborasi tim yang lebih efektif
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature) => (
              <Card key={feature.title} className="hover-elevate" data-testid={`card-advanced-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-3xl font-bold mb-4">Untuk Berbagai Bidang Konstruksi</h2>
            <p className="text-muted-foreground">Solusi project intelligence untuk semua jenis proyek</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {categories.map((category) => (
              <span 
                key={category}
                className="px-4 py-2 rounded-full bg-background border text-sm font-medium hover-elevate cursor-default"
              >
                {category}
              </span>
            ))}
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              +25 lainnya
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum tentang Gustafta
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full" data-testid="accordion-faq">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left" data-testid={`faq-trigger-${index}`}>
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`faq-content-${index}`}>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Dokumentender Integration Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">
                <Globe className="h-3 w-3 mr-1" />
                Knowledge Partner
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Terhubung dengan Dokumentender
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Akses pengetahuan lengkap tentang keteknikan, konstruksi, pengadaan, dan berbagai bidang lainnya
                melalui platform AI knowledge base Dokumentender.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="hover-elevate" data-testid="card-dokumentender-engineering">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Wrench className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Keteknikan</h3>
                  <p className="text-muted-foreground text-sm">
                    Teknik Sipil, Mesin, Elektro, Lingkungan - standar SNI, ISO, perhitungan teknis, dan referensi lengkap.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate" data-testid="card-dokumentender-construction">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Blocks className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Konstruksi & Pengadaan</h3>
                  <p className="text-muted-foreground text-sm">
                    Metode pelaksanaan, spesifikasi material, RAB, K3, dokumen tender, kontrak, dan peraturan LKPP.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://chat.dokumentender.com" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-dokumentender-external">
                  <ExternalLink className="h-5 w-5" />
                  Buka chat.dokumentender.com
                </Button>
              </a>
              <Link href="/chat/dokumentender">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2" data-testid="button-dokumentender-chat">
                  <MessageSquare className="h-5 w-5" />
                  Chat di Gustafta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - AIDA Action */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 text-center relative">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            <Brain className="h-3 w-3 mr-1" />
            Project Brain + Mini Apps AI
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Siap Mengelola Proyek Lebih Cerdas?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
            Bergabung dengan 500+ profesional konstruksi yang sudah menggunakan Gustafta.
            Setup Project Brain dan mulai gunakan Mini Apps AI hari ini.
          </p>
          
          {/* Value Stack */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>Setup 7 menit</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>12 Mini Apps tersedia</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>Tanpa coding</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6" data-testid="button-cta-dashboard">
                  <Rocket className="h-5 w-5" />
                  Buka Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <a href="/api/login" onClick={handleStartNowClick}>
                <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6" data-testid="button-cta-signup">
                  <Rocket className="h-5 w-5" />
                  Mulai Gratis Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
            )}
            <Link href="/pricing" onClick={handlePricingClick}>
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-cta-pricing">
                Lihat Harga
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Gustafta</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                AI Project Intelligence platform untuk manajemen proyek konstruksi Indonesia.
              </p>
              <div className="flex gap-2">
                {trustBadges.slice(0, 2).map((badge) => (
                  <Badge key={badge.label} variant="outline" className="text-xs">
                    <badge.icon className="h-3 w-3 mr-1" />
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/marketplace" className="hover:text-foreground">Marketplace</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Harga</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Template</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Integrasi</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/documentation" className="hover:text-foreground">Dokumentasi</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">API Reference</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Tutorial</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/documentation" className="hover:text-foreground">Tentang Kami</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Karir</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Kontak</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Gustafta. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/documentation" className="hover:text-foreground">Terms</Link>
              <Link href="/documentation" className="hover:text-foreground">Privacy</Link>
              <Link href="/documentation" className="hover:text-foreground">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      {gustaftaAssistant && (
        <ChatPopup agent={gustaftaAssistant} />
      )}
    </div>
  );
}
