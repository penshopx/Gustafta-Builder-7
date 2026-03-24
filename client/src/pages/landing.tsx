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
import { featuredSectors } from "@/lib/sector-content";
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
      problem: "Tim CS kewalahan menjawab pertanyaan yang sama berulang-ulang",
      solution: "Chatbot AI menjawab FAQ otomatis 24/7 - pelanggan mendapat respons instan tanpa antrian"
    },
    {
      icon: AlertTriangle,
      problem: "Informasi bisnis tersebar dan sulit diakses oleh tim maupun pelanggan",
      solution: "Knowledge Base terpusat + chatbot sebagai pintu akses informasi kapan saja"
    },
    {
      icon: TrendingUp,
      problem: "Kehilangan peluang bisnis di luar jam operasional",
      solution: "AI bekerja 24/7 menangkap leads, menjawab pertanyaan, dan melayani pelanggan"
    },
    {
      icon: Users,
      problem: "Biaya operasional tinggi untuk customer service multi-channel",
      solution: "Satu chatbot AI melayani di WhatsApp, web, Telegram, dan channel lainnya sekaligus"
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "Project Brain",
      description: "Pusatkan semua data dan konteks bisnis dalam satu tempat. AI menggunakan data ini untuk memberikan jawaban yang akurat dan kontekstual."
    },
    {
      icon: Blocks,
      title: "Mini Apps (12 Tools)",
      description: "6 tools dasar (Checklist, Kalkulator, Risk Assessment, Progress Tracker, Doc Generator, Custom) + 6 AI-powered tools untuk analisis otomatis."
    },
    {
      icon: Lightbulb,
      title: "Hierarki Terstruktur",
      description: "Organisir chatbot dengan Series (Topik), Big Idea (Brand), Toolbox (Kategori), dan Agent (Chatbot) untuk manajemen yang rapi."
    },
    {
      icon: Sparkles,
      title: "Agentic AI",
      description: "AI cerdas dengan kemampuan mendengar aktif, retensi konteks, koreksi diri, dan pemahaman mendalam tentang bisnis Anda."
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Upload PDF, PPT, Excel, gambar, video, atau URL. AI otomatis memahami dan bisa menjawab berdasarkan dokumen Anda."
    },
    {
      icon: Plug,
      title: "Multi-Channel",
      description: "WhatsApp, Telegram, Discord, Slack, Web Widget, dan REST API. Satu chatbot, semua channel terhubung."
    },
  ];

  const advancedFeatures = [
    {
      icon: Camera,
      title: "Project Snapshot AI",
      description: "Ringkasan kondisi bisnis atau proyek otomatis - status, isu, risiko, dan keputusan terakhir dalam satu laporan"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Pantau performa chatbot dengan metrik pesan, sesi, engagement, dan peak hours secara real-time"
    },
    {
      icon: Cpu,
      title: "Multi-Model AI",
      description: "GPT-4o, GPT-3.5, DeepSeek, Claude, atau model custom dengan API endpoint sendiri sesuai kebutuhan"
    },
    {
      icon: Palette,
      title: "Widget Customization",
      description: "Kustomisasi tampilan widget chat sesuai branding - warna, posisi, ukuran, logo, dan pesan sapaan"
    },
    {
      icon: Shield,
      title: "Access Control & Keamanan",
      description: "Token akses per chatbot, mode publik/privat, kontrol domain, dan enkripsi data untuk keamanan bisnis"
    },
    {
      icon: Code,
      title: "API & Webhook",
      description: "REST API lengkap dan webhook untuk integrasi dengan sistem bisnis, CRM, ERP, atau tools lainnya"
    },
  ];

  const testimonials = [
    {
      name: "Rina Kusuma",
      role: "CEO, Digital Agency Jakarta",
      avatar: "RK",
      content: "Gustafta membantu kami membuat chatbot untuk 15 klien dari berbagai industri. Setup cepat dan fleksibel untuk setiap sektor.",
      rating: 5
    },
    {
      name: "Ahmad Fadli",
      role: "Head of Digital, Retail Company",
      avatar: "AF",
      content: "Chatbot WhatsApp kami menjawab 80% pertanyaan pelanggan otomatis. Tim CS bisa fokus pada kasus yang benar-benar butuh sentuhan manusia.",
      rating: 5
    },
    {
      name: "Dewi Pratiwi",
      role: "Founder, EdTech Startup",
      avatar: "DP",
      content: "Knowledge Base dan Mini Apps sangat powerful. Tutor AI kami sekarang bisa menjawab berdasarkan materi kuliah yang di-upload.",
      rating: 5
    },
  ];

  const comparisonData = [
    { feature: "Project Brain (Data Terpusat)", gustafta: true, others: false },
    { feature: "Mini Apps AI (12 Tools)", gustafta: true, others: false },
    { feature: "Hierarki Series > Big Idea > Toolbox > Agent", gustafta: true, others: false },
    { feature: "Multi-Channel (WhatsApp, Telegram, dll)", gustafta: "6+ channels", others: "1-2 channels" },
    { feature: "Multi-Model AI (GPT-4, Claude, DeepSeek)", gustafta: true, others: "Limited" },
    { feature: "Widget & PWA Customization", gustafta: true, others: "Basic" },
    { feature: "Analytics & Laporan Otomatis", gustafta: true, others: "Basic" },
    { feature: "Monetisasi & Voucher System", gustafta: true, others: false },
  ];

  const faqItems = [
    {
      question: "Apa itu Gustafta?",
      answer: "Gustafta adalah platform AI chatbot builder yang memungkinkan Anda membuat, mengkonfigurasi, dan men-deploy chatbot cerdas untuk bisnis Anda. Cocok untuk berbagai sektor usaha - dari retail, kesehatan, pendidikan, hingga konstruksi dan logistik."
    },
    {
      question: "Apakah saya perlu keahlian coding?",
      answer: "Tidak! Semua konfigurasi dilakukan melalui antarmuka visual yang mudah. Project Brain, Mini Apps, Persona AI, dan Knowledge Base semuanya bisa di-setup tanpa menulis kode apapun."
    },
    {
      question: "Apa itu hierarki Series, Big Idea, Toolbox, dan Agent?",
      answer: "Ini adalah sistem pengorganisasian chatbot Anda. Series adalah topik/paket teratas, Big Idea adalah brand/visi, Toolbox adalah kategori kerja, dan Agent adalah chatbot spesifik. Struktur ini membantu mengelola banyak chatbot secara terorganisir."
    },
    {
      question: "Channel apa saja yang didukung?",
      answer: "Gustafta mendukung WhatsApp, Telegram, Discord, Slack, Web Widget, REST API, dan PWA. Satu chatbot bisa terhubung ke semua channel sekaligus."
    },
    {
      question: "Bagaimana dengan keamanan data?",
      answer: "Data Anda aman dengan enkripsi, token akses per chatbot, mode publik/privat, dan kontrol domain. Anda memiliki kontrol penuh atas siapa yang bisa mengakses chatbot dan data Anda."
    },
    {
      question: "Bisa digunakan untuk sektor usaha apa saja?",
      answer: "Gustafta dirancang untuk semua sektor usaha - retail, kesehatan, pendidikan, keuangan, hukum, properti, hospitality, logistik, marketing, kreatif, dan masih banyak lagi. Setiap chatbot bisa dikustomisasi sesuai kebutuhan industri Anda."
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Buat Big Idea & Chatbot",
      description: "Definisikan brand, isi Knowledge Base dengan dokumen bisnis, dan konfigurasi persona AI",
      time: "3 menit"
    },
    {
      number: "2", 
      title: "Setup Fitur & Mini Apps",
      description: "Pilih Mini Apps yang dibutuhkan, aktifkan Project Brain, dan tambahkan integrasi channel",
      time: "3 menit"
    },
    {
      number: "3",
      title: "Deploy & Mulai Melayani",
      description: "Hubungkan ke WhatsApp, embed di website, atau bagikan link chatbot ke pelanggan",
      time: "1 menit"
    },
  ];

  const trustBadges = [
    { icon: Lock, label: "Data Terenkripsi" },
    { icon: RefreshCw, label: "99.9% Uptime" },
    { icon: HeartHandshake, label: "Support 24/7" },
    { icon: Award, label: "Multi-Sektor" },
  ];

  const stats = [
    { value: "30+", label: "Sektor Usaha" },
    { value: "12", label: "Mini Apps Tersedia" },
    { value: "6+", label: "Channel Terintegrasi" },
    { value: "24/7", label: "AI Selalu Aktif" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <section className="relative overflow-hidden py-16 md:py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-pulse">
              <Bot className="h-4 w-4" />
              <span>AI Chatbot Builder untuk Semua Sektor Usaha</span>
              <Sparkles className="h-4 w-4" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
              Buat Chatbot AI Cerdas
              <br className="hidden md:block" />
              untuk
              <span className="text-primary"> Bisnis Anda</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Platform all-in-one untuk membangun, mengkonfigurasi, dan men-deploy chatbot AI yang memahami bisnis Anda. 
              Untuk semua sektor usaha - tanpa coding.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <badge.icon className="h-4 w-4 text-primary" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-6" data-testid="button-dashboard">
                    <Rocket className="h-5 w-5" />
                    Buka Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <a href="/api/login" onClick={handleStartNowClick} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 text-lg px-8 py-6" data-testid="button-start">
                    <Rocket className="h-5 w-5" />
                    Mulai Gratis Sekarang
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto gap-2 text-lg px-8 py-6" 
                data-testid="button-demo"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play className="h-5 w-5" />
                Lihat Fitur
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 inline mr-1 text-green-500" />
              Gratis untuk memulai. Tidak perlu kartu kredit. Setup dalam 7 menit.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/50 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center" data-testid={`stat-${stat.label}`}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Masalah & Solusi</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Tantangan Bisnis yang Kami Selesaikan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Apapun sektor usaha Anda, tantangan ini pasti familiar. Gustafta hadir sebagai solusi cerdas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {painPoints.map((item, index) => (
              <Card key={index} className="hover-elevate overflow-visible" data-testid={`card-pain-${index}`}>
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

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Cara Kerja</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              3 Langkah Mudah, 7 Menit Saja
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tidak perlu developer, tidak perlu koding. Buat chatbot AI untuk bisnis Anda dalam hitungan menit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
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

      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Fitur Utama</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Platform Chatbot AI Terlengkap
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk membangun chatbot AI profesional dalam satu platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate overflow-visible" data-testid={`card-feature-${feature.title}`}>
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

      <section className="py-16 md:py-24 bg-muted/30" id="sectors">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Sektor Usaha</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4" data-testid="text-sectors-title">
              Untuk Berbagai Sektor Usaha
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Gustafta dirancang fleksibel untuk semua industri. Pilih sektor Anda dan lihat bagaimana AI chatbot bisa membantu bisnis Anda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {featuredSectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <Link key={sector.id} href={`/sector/${sector.id}`}>
                  <Card className="hover-elevate overflow-visible cursor-pointer h-full" data-testid={`card-sector-${sector.id}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className={`h-5 w-5 ${sector.color}`} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm mb-1">{sector.label}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{sector.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                        <span>Pelajari lebih lanjut</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Testimoni</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Dipercaya oleh Berbagai Bisnis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lihat bagaimana Gustafta membantu bisnis dari berbagai sektor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-elevate overflow-visible" data-testid={`card-testimonial-${index}`}>
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

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Perbandingan</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Mengapa Gustafta Lebih Unggul?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bandingkan fitur Gustafta dengan platform chatbot builder lainnya
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
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

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Fitur Lanjutan</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Kemampuan Lebih untuk Bisnis Anda
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fitur tambahan untuk monitoring, pelaporan, dan integrasi yang lebih mendalam
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature) => (
              <Card key={feature.title} className="hover-elevate overflow-visible" data-testid={`card-advanced-${feature.title}`}>
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

      <section className="py-16 md:py-24 bg-muted/30">
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
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left" data-testid={`faq-trigger-${index}`}>
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
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
              <Card className="hover-elevate overflow-visible">
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
              <Card className="hover-elevate overflow-visible">
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
                <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-dokumentender">
                  <ExternalLink className="h-5 w-5" />
                  Buka chat.dokumentender.com
                </Button>
              </a>
              <Link href="/bot/dokumentender">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2" data-testid="button-chat-dokumentender">
                  <MessageSquare className="h-5 w-5" />
                  Chat di Gustafta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 text-center relative">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            <Bot className="h-3 w-3 mr-1" />
            AI Chatbot Builder untuk Semua Sektor
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Siap Membangun Chatbot AI Anda?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
            Bergabung dengan bisnis dari berbagai sektor yang sudah menggunakan Gustafta. 
            Setup chatbot AI dan mulai melayani pelanggan hari ini.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>Setup 7 menit</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>30+ sektor usaha</span>
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
                <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6" data-testid="button-cta-start">
                  <Rocket className="h-5 w-5" />
                  Mulai Gratis Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
            )}
            <Link href="/pricing" onClick={handlePricingClick}>
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Lihat Harga
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Gustafta</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                AI Chatbot Builder platform untuk semua sektor usaha Indonesia.
              </p>
              <div className="flex flex-wrap gap-2">
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
                <li><Link href="/packs" className="hover:text-foreground">Paket Domain</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Harga</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Template</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Integrasi</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sektor Usaha</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {featuredSectors.slice(0, 6).map((sector) => (
                  <li key={sector.id}>
                    <Link href={`/sector/${sector.id}`} className="hover:text-foreground">{sector.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/documentation" className="hover:text-foreground">Dokumentasi</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">API Reference</Link></li>
                <li><Link href="/series" className="hover:text-foreground">Chatbot Series</Link></li>
                <li><Link href="/documentation" className="hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Gustafta. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/documentation" className="hover:text-foreground">Terms</Link>
              <Link href="/documentation" className="hover:text-foreground">Privacy</Link>
              <Link href="/documentation" className="hover:text-foreground">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {gustaftaAssistant && (
        <ChatPopup agent={gustaftaAssistant} />
      )}
    </div>
  );
}
