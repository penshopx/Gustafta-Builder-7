import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Bot, Sparkles, MessageSquare, Zap, Globe, Shield, 
  BookOpen, BarChart3, Lightbulb, ArrowRight, Check
} from "lucide-react";

export default function Landing() {
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
      description: "Tentukan masalah, ide, inspirasi, atau program mentoring yang ingin Anda selesaikan"
    },
    {
      number: "2", 
      title: "Buat Toolbox",
      description: "Kumpulkan kemampuan dan fitur yang dibutuhkan untuk mencapai Big Idea"
    },
    {
      number: "3",
      title: "Deploy Chatbot",
      description: "Konfigurasi persona, knowledge base, dan integrasikan ke berbagai channel"
    },
  ];

  const categories = [
    "E-Commerce", "Kesehatan", "Pendidikan", "Keuangan", "Properti",
    "Travel", "F&B", "Otomotif", "Legal", "HR", "IT", "Marketing"
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Gustafta</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/documentation">
              <Button variant="ghost" data-testid="button-documentation">
                Dokumentasi
              </Button>
            </Link>
            <ThemeToggle />
            <Link href="/dashboard">
              <Button data-testid="button-go-dashboard">
                Masuk Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI Chatbot Builder Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Bangun Chatbot AI Cerdas untuk Bisnis Anda
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Platform all-in-one untuk membuat, mengonfigurasi, dan deploy chatbot AI 
              dengan persona kustom, knowledge base, dan integrasi multi-channel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2" data-testid="button-start-now">
                  Mulai Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-learn-more">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Didukung 37+ Kategori Bisnis</h2>
            <p className="text-muted-foreground">Solusi chatbot untuk berbagai industri dan profesi</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((category) => (
              <span 
                key={category}
                className="px-4 py-2 rounded-full bg-background border text-sm font-medium"
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

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Fitur Lengkap untuk Chatbot Profesional</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk membangun chatbot AI yang powerful dan scalable
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate">
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

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Cara Kerja Gustafta</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sistem hierarki yang memudahkan Anda membangun chatbot dari ide hingga deployment
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                )}
                <div className="relative bg-background rounded-lg p-6 border text-center">
                  <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Attentive Agentic AI</h2>
                <p className="text-muted-foreground mb-6">
                  Lebih dari sekadar chatbot biasa. Gustafta menggunakan teknologi Agentic AI 
                  yang memiliki kemampuan untuk memahami konteks, belajar dari percakapan, 
                  dan memberikan respons yang lebih manusiawi.
                </p>
                <ul className="space-y-3">
                  {[
                    "Attentive Listening - Memahami maksud pengguna dengan baik",
                    "Context Retention - Mengingat konteks percakapan",
                    "Emotional Intelligence - Merespons dengan empati",
                    "Multi-step Reasoning - Menyelesaikan masalah kompleks",
                    "Proactive Assistance - Memberikan saran proaktif",
                    "Self-Correction - Memperbaiki kesalahan sendiri",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-8 border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">AI Assistant</div>
                    <div className="text-xs text-muted-foreground">Powered by GPT-4</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-background rounded-lg p-3 text-sm">
                    Halo! Saya siap membantu Anda. Ada yang bisa saya bantu hari ini?
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3 text-sm ml-8">
                    Saya ingin tahu produk terlaris bulan ini
                  </div>
                  <div className="bg-background rounded-lg p-3 text-sm">
                    Berdasarkan data penjualan, produk terlaris adalah Widget Pro dengan 1,250 unit terjual. 
                    Apakah Anda ingin melihat detail lengkapnya?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Membangun Chatbot AI Anda?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
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

      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-bold">Gustafta</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 Gustafta. AI Chatbot Builder Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
