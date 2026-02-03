import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useGustaftaAssistant } from "@/hooks/use-agents";
import { useTemplates } from "@/hooks/use-templates";
import { trackLead, trackViewContent } from "@/hooks/use-meta-pixel";
import { ChatPopup } from "@/components/chat-popup";
import { TemplateShowcase } from "@/components/template-showcase";
import { 
  Bot, Sparkles, MessageSquare, Globe, Shield, 
  BookOpen, BarChart3, Lightbulb, ArrowRight, Check, LogIn, LogOut, Menu, 
  Zap, Palette, Download, Upload, Code, Cpu, FileJson, Settings2, Layers,
  Clock, TrendingUp, Users, Star, CheckCircle2, XCircle, AlertTriangle,
  HeartHandshake, Award, Target, Rocket, Lock, RefreshCw, Play
} from "lucide-react";

export default function Landing() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: gustaftaAssistant } = useGustaftaAssistant();
  const { data: templatesData } = useTemplates();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      problem: "Butuh waktu berminggu-minggu untuk setup chatbot",
      solution: "Deploy chatbot dalam hitungan menit dengan template siap pakai"
    },
    {
      icon: AlertTriangle,
      problem: "Customer service kewalahan dengan pertanyaan repetitif",
      solution: "Otomatisasi 80% pertanyaan rutin dengan AI cerdas"
    },
    {
      icon: TrendingUp,
      problem: "Kehilangan leads karena respons lambat",
      solution: "Respons instan 24/7 meningkatkan konversi hingga 40%"
    },
    {
      icon: Users,
      problem: "Biaya tim support terus meningkat",
      solution: "Kurangi beban tim hingga 60% dengan asisten AI"
    },
  ];

  const features = [
    {
      icon: Lightbulb,
      title: "Big Idea Framework",
      description: "Mulai dari masalah, ide, inspirasi, atau mentoring - sistem hierarki membantu Anda membangun chatbot yang tepat sasaran"
    },
    {
      icon: Sparkles,
      title: "Attentive Agentic AI",
      description: "Chatbot cerdas dengan kemampuan mendengar aktif, konteks percakapan, dan kecerdasan emosional"
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Upload PDF, PPT, Excel, Word atau tambahkan teks dan URL untuk melatih chatbot Anda"
    },
    {
      icon: Globe,
      title: "Multi-Channel",
      description: "Integrasikan dengan WhatsApp, Telegram, Discord, Slack, Web Widget, dan API"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Pantau performa chatbot dengan metrik pesan, sesi, dan engagement"
    },
    {
      icon: Shield,
      title: "Access Control",
      description: "Token akses, mode publik/privat, dan kontrol domain untuk monetisasi"
    },
  ];

  const advancedFeatures = [
    {
      icon: Layers,
      title: "Template Library",
      description: "10+ template siap pakai untuk berbagai industri - Customer Support, Sales, HR, Education, dan lainnya"
    },
    {
      icon: FileJson,
      title: "Export & Import",
      description: "Ekspor konfigurasi chatbot dalam format JSON dan import ke proyek lain dengan mudah"
    },
    {
      icon: Palette,
      title: "Widget Customization",
      description: "Kustomisasi tampilan widget chat - warna, posisi, ukuran, dan branding sesuai brand Anda"
    },
    {
      icon: Cpu,
      title: "Multi-Model AI",
      description: "Pilih dari GPT-4, GPT-3.5, DeepSeek, Claude, atau gunakan model custom Anda sendiri"
    },
    {
      icon: Code,
      title: "API Access",
      description: "REST API lengkap untuk integrasi dengan sistem Anda - webhook, embed, dan custom integration"
    },
    {
      icon: Settings2,
      title: "Advanced Settings",
      description: "Kontrol penuh: temperature, max tokens, context retention, dan behavior tuning"
    },
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "CEO, TokoBagus.id",
      avatar: "BS",
      content: "Gustafta menghemat 40 jam kerja tim CS kami per minggu. ROI tercapai dalam 2 minggu pertama.",
      rating: 5
    },
    {
      name: "Sarah Wijaya",
      role: "Founder, EduTech Academy",
      avatar: "SW",
      content: "Chatbot kami sekarang menangani 85% pertanyaan siswa secara otomatis. Sangat membantu!",
      rating: 5
    },
    {
      name: "Andi Pratama",
      role: "Marketing Director, PropertyHub",
      avatar: "AP",
      content: "Lead conversion naik 35% sejak menggunakan Gustafta. Setup-nya mudah banget.",
      rating: 5
    },
  ];

  const comparisonData = [
    { feature: "Setup Time", gustafta: "5 menit", others: "2-4 minggu" },
    { feature: "Template Siap Pakai", gustafta: true, others: false },
    { feature: "Multi-Model AI", gustafta: true, others: false },
    { feature: "Knowledge Base", gustafta: true, others: "Limited" },
    { feature: "Multi-Channel", gustafta: "6+ channels", others: "1-2 channels" },
    { feature: "Export/Import", gustafta: true, others: false },
    { feature: "Analytics", gustafta: true, others: "Basic" },
    { feature: "Custom Branding", gustafta: true, others: "Premium only" },
  ];

  const faqItems = [
    {
      question: "Berapa lama waktu yang dibutuhkan untuk membuat chatbot?",
      answer: "Dengan template siap pakai, Anda bisa deploy chatbot dalam 5 menit. Untuk kustomisasi lebih lanjut, biasanya membutuhkan 15-30 menit untuk setup persona, knowledge base, dan integrasi."
    },
    {
      question: "Apakah saya perlu keahlian coding?",
      answer: "Tidak sama sekali! Gustafta dirancang untuk pengguna non-teknis. Semua konfigurasi dilakukan melalui antarmuka visual yang mudah dipahami."
    },
    {
      question: "Model AI apa yang didukung?",
      answer: "Kami mendukung GPT-4o, GPT-4o-mini, GPT-3.5, DeepSeek, Claude, dan Anda juga bisa menggunakan model custom dengan API endpoint sendiri."
    },
    {
      question: "Bagaimana dengan keamanan data?",
      answer: "Data Anda aman. Kami menggunakan enkripsi end-to-end, token akses untuk setiap chatbot, dan Anda memiliki kontrol penuh atas siapa yang bisa mengakses chatbot Anda."
    },
    {
      question: "Bisakah chatbot terintegrasi dengan WhatsApp?",
      answer: "Ya! Gustafta mendukung integrasi dengan WhatsApp, Telegram, Discord, Slack, Web Widget, dan REST API untuk integrasi custom."
    },
    {
      question: "Apakah ada free trial?",
      answer: "Ya, Anda bisa mulai gratis dengan fitur dasar. Upgrade kapan saja untuk akses fitur premium seperti multi-model AI dan unlimited knowledge base."
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Definisikan Big Idea",
      description: "Tentukan masalah atau ide yang ingin Anda selesaikan",
      time: "1 menit"
    },
    {
      number: "2", 
      title: "Pilih Template",
      description: "Gunakan template siap pakai atau buat dari awal",
      time: "2 menit"
    },
    {
      number: "3",
      title: "Deploy & Integrasikan",
      description: "Publish dan hubungkan ke channel favorit Anda",
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
    "E-Commerce", "Kesehatan", "Pendidikan", "Keuangan", "Properti",
    "Travel", "F&B", "Otomotif", "Legal", "HR", "IT", "Marketing"
  ];

  const stats = [
    { value: "10K+", label: "Chatbot Dibuat" },
    { value: "5M+", label: "Pesan Diproses" },
    { value: "500+", label: "Bisnis Terbantu" },
    { value: "98%", label: "Kepuasan Pengguna" },
  ];

  const MobileMenu = () => (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/documentation" onClick={() => setMobileMenuOpen(false)}>
        <Button variant="ghost" className="w-full justify-start" data-testid="mobile-button-documentation">
          <BookOpen className="h-4 w-4 mr-2" />
          Dokumentasi
        </Button>
      </Link>
      <Link href="/pricing" onClick={() => { handlePricingClick(); setMobileMenuOpen(false); }}>
        <Button variant="ghost" className="w-full justify-start" data-testid="mobile-button-pricing">
          <BarChart3 className="h-4 w-4 mr-2" />
          Harga
        </Button>
      </Link>
      <div className="border-t pt-4">
        {isAuthenticated ? (
          <div className="space-y-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full" data-testid="mobile-button-dashboard">
                Dashboard
              </Button>
            </Link>
            <a href="/api/logout">
              <Button variant="outline" className="w-full gap-2" data-testid="mobile-button-logout">
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </a>
          </div>
        ) : (
          <a href="/api/login" onClick={handleLoginClick}>
            <Button className="w-full gap-2" data-testid="mobile-button-login">
              <LogIn className="h-4 w-4" />
              Masuk
            </Button>
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER - Sticky Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-7 w-7 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-xl font-bold">Gustafta</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/documentation">
              <Button variant="ghost" data-testid="button-documentation">
                Dokumentasi
              </Button>
            </Link>
            <Link href="/pricing" onClick={handlePricingClick}>
              <Button variant="ghost" data-testid="button-pricing">
                Harga
              </Button>
            </Link>
            <ThemeToggle />
            {isLoading ? (
              <Button disabled>Loading...</Button>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button data-testid="button-go-dashboard">
                    Dashboard
                  </Button>
                </Link>
                <a href="/api/logout">
                  <Button variant="ghost" size="icon" data-testid="button-logout">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </a>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                  <AvatarFallback>{user?.firstName?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <a href="/api/login" onClick={handleLoginClick}>
                <Button className="gap-2" data-testid="button-login">
                  <LogIn className="h-4 w-4" />
                  Masuk
                </Button>
              </a>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex items-center gap-2 mb-6">
                  <Bot className="h-6 w-6 text-primary" />
                  <span className="font-bold">Gustafta</span>
                </div>
                <MobileMenu />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ATTENTION: Hero Section with Strong Value Proposition */}
      <section className="relative overflow-hidden py-16 md:py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-pulse">
              <Zap className="h-4 w-4" />
              <span>500+ bisnis sudah menggunakan Gustafta</span>
              <Sparkles className="h-4 w-4" />
            </div>
            
            {/* Main Headline - AIDA Attention */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Bangun Chatbot AI dalam
              <span className="text-primary"> 5 Menit</span>,
              <br className="hidden md:block" />
              Tingkatkan Penjualan hingga
              <span className="text-primary"> 40%</span>
            </h1>
            
            {/* Subheadline - Value Proposition */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Platform AI chatbot termudah di Indonesia. Tanpa coding, tanpa ribet.
              Respons pelanggan 24/7 dengan kecerdasan GPT-4.
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
              Gratis selamanya untuk fitur dasar. Tidak perlu kartu kredit.
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
              Apakah Anda Mengalami Masalah Ini?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ribuan bisnis menghadapi tantangan yang sama. Gustafta hadir sebagai solusi.
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
              3 Langkah Mudah, 5 Menit Saja
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tidak perlu developer, tidak perlu koding. Siapapun bisa membuat chatbot profesional.
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
            <Badge variant="secondary" className="mb-4">Fitur Lengkap</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Semua yang Anda Butuhkan dalam Satu Platform
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fitur profesional untuk membangun chatbot AI yang powerful
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
              Mulai dengan Template Siap Pakai
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pilih dari {templatesData?.templates.length || 10}+ template chatbot profesional. 
              Kustomisasi sesuai kebutuhan bisnis Anda dalam hitungan menit.
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
              Dipercaya oleh Ratusan Bisnis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lihat bagaimana Gustafta membantu bisnis lain mencapai tujuan mereka
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
              Bandingkan fitur Gustafta dengan solusi chatbot lainnya
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
            <Badge variant="secondary" className="mb-4">Advanced Features</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Fleksibilitas Penuh untuk Developer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fitur lanjutan untuk kebutuhan kustomisasi yang lebih kompleks
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
            <h2 className="text-xl md:text-3xl font-bold mb-4">Didukung 37+ Kategori Bisnis</h2>
            <p className="text-muted-foreground">Solusi chatbot untuk berbagai industri</p>
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

      {/* Final CTA Section - AIDA Action */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 text-center relative">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            <Zap className="h-3 w-3 mr-1" />
            Limited Time Offer
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Siap Meningkatkan Bisnis Anda?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
            Bergabung dengan 500+ bisnis yang sudah menggunakan Gustafta.
            Mulai gratis hari ini dan lihat perbedaannya.
          </p>
          
          {/* Value Stack */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>Setup 5 menit</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>Tanpa kartu kredit</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span>Gratis selamanya</span>
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
                Platform AI chatbot builder terlengkap untuk bisnis Indonesia.
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
                <li><Link href="/documentation" className="hover:text-foreground">Fitur</Link></li>
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
