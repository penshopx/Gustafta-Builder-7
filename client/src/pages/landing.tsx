import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { trackLead, trackViewContent } from "@/hooks/use-meta-pixel";
import { 
  Bot, Sparkles, MessageSquare, Globe, Shield, 
  BookOpen, BarChart3, Lightbulb, ArrowRight, Check, LogIn, LogOut, Menu, X
} from "lucide-react";

export default function Landing() {
  const { user, isLoading, isAuthenticated } = useAuth();
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

  const steps = [
    {
      number: "1",
      title: "Definisikan Big Idea",
      description: "Tentukan masalah atau ide yang ingin Anda selesaikan"
    },
    {
      number: "2", 
      title: "Buat Toolbox",
      description: "Kumpulkan kemampuan dan fitur yang dibutuhkan"
    },
    {
      number: "3",
      title: "Deploy Chatbot",
      description: "Konfigurasi persona dan integrasikan ke channel"
    },
  ];

  const categories = [
    "E-Commerce", "Kesehatan", "Pendidikan", "Keuangan", "Properti",
    "Travel", "F&B", "Otomotif", "Legal", "HR", "IT", "Marketing"
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

      <section className="relative overflow-hidden py-12 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
              AI Chatbot Builder Platform
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight px-2">
              Bangun Chatbot AI Cerdas untuk Bisnis Anda
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Platform all-in-one untuk membuat dan deploy chatbot AI 
              dengan persona kustom dan integrasi multi-channel
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-start-now">
                    Buka Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <a href="/api/login" onClick={handleStartNowClick} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2" data-testid="button-start-now">
                    Mulai Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              )}
              <Link href="/documentation" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-2" data-testid="button-learn-more">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">Didukung 37+ Kategori Bisnis</h2>
            <p className="text-sm md:text-base text-muted-foreground">Solusi chatbot untuk berbagai industri</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((category) => (
              <span 
                key={category}
                className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-background border text-xs md:text-sm font-medium"
              >
                {category}
              </span>
            ))}
            <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium">
              +25 lainnya
            </span>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">Fitur Lengkap untuk Chatbot Profesional</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk membangun chatbot AI yang powerful
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate">
                <CardContent className="p-4 md:p-6">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                    <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">Cara Kerja Gustafta</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Sistem hierarki yang memudahkan Anda membangun chatbot
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                )}
                <div className="relative bg-background rounded-lg p-4 md:p-6 border text-center">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6">Attentive Agentic AI</h2>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                  Lebih dari sekadar chatbot biasa. Gustafta menggunakan teknologi Agentic AI 
                  yang memahami konteks dan memberikan respons manusiawi.
                </p>
                <ul className="space-y-2 md:space-y-3">
                  {[
                    "Attentive Listening - Memahami maksud pengguna",
                    "Context Retention - Mengingat konteks percakapan",
                    "Emotional Intelligence - Merespons dengan empati",
                    "Multi-step Reasoning - Menyelesaikan masalah kompleks",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2 bg-muted/50 rounded-lg p-4 md:p-8 border">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-medium">AI Assistant</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">Powered by GPT-4</div>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="bg-background rounded-lg p-2 md:p-3 text-xs md:text-sm">
                    Halo! Saya siap membantu Anda. Ada yang bisa saya bantu?
                  </div>
                  <div className="bg-primary/10 rounded-lg p-2 md:p-3 text-xs md:text-sm ml-6 md:ml-8">
                    Saya ingin tahu produk terlaris bulan ini
                  </div>
                  <div className="bg-background rounded-lg p-2 md:p-3 text-xs md:text-sm">
                    Produk terlaris adalah Widget Pro dengan 1,250 unit. Ingin detail lengkap?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Siap Membangun Chatbot AI Anda?</h2>
          <p className="text-primary-foreground/80 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base">
            Mulai gratis dan tingkatkan sesuai kebutuhan bisnis Anda
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="gap-2" data-testid="button-cta-dashboard">
              Mulai Sekarang - Gratis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 md:py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span className="font-bold text-sm md:text-base">Gustafta</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              2024 Gustafta. AI Chatbot Builder Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
