import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Bot, Check, X, Zap, Crown, Building2, Sparkles, ArrowRight,
  MessageSquare, Users, Globe, BookOpen, BarChart3, Shield, Headphones
} from "lucide-react";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  priceNote: string;
  icon: typeof Bot;
  popular?: boolean;
  features: { text: string; included: boolean }[];
  cta: string;
  ctaVariant: "default" | "outline" | "secondary";
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    description: "Untuk individu dan usaha kecil yang baru memulai",
    price: "Gratis",
    priceNote: "Selamanya",
    icon: Zap,
    features: [
      { text: "1 Chatbot", included: true },
      { text: "1.000 pesan/bulan", included: true },
      { text: "Knowledge Base: 5 dokumen", included: true },
      { text: "Web Widget", included: true },
      { text: "Branding Gustafta", included: true },
      { text: "Multi-channel (WhatsApp, Telegram)", included: false },
      { text: "Agentic AI Features", included: false },
      { text: "Analytics Dashboard", included: false },
      { text: "Custom Domain", included: false },
      { text: "Priority Support", included: false },
    ],
    cta: "Mulai Gratis",
    ctaVariant: "outline",
  },
  {
    name: "Professional",
    description: "Untuk bisnis yang ingin meningkatkan customer engagement",
    price: "Rp 499.000",
    priceNote: "/bulan",
    icon: Sparkles,
    popular: true,
    features: [
      { text: "5 Chatbot", included: true },
      { text: "10.000 pesan/bulan", included: true },
      { text: "Knowledge Base: 50 dokumen", included: true },
      { text: "Web Widget (No Branding)", included: true },
      { text: "Multi-channel (WhatsApp, Telegram, Discord)", included: true },
      { text: "Agentic AI Features", included: true },
      { text: "Analytics Dashboard", included: true },
      { text: "Custom Domain", included: false },
      { text: "API Access", included: false },
      { text: "Priority Support", included: false },
    ],
    cta: "Berlangganan",
    ctaVariant: "default",
  },
  {
    name: "Business",
    description: "Untuk perusahaan dengan kebutuhan enterprise",
    price: "Rp 1.499.000",
    priceNote: "/bulan",
    icon: Crown,
    features: [
      { text: "20 Chatbot", included: true },
      { text: "50.000 pesan/bulan", included: true },
      { text: "Knowledge Base: Unlimited", included: true },
      { text: "Web Widget (Custom Branding)", included: true },
      { text: "Multi-channel (Semua Platform)", included: true },
      { text: "Agentic AI Features", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Custom Domain", included: true },
      { text: "API Access", included: true },
      { text: "Priority Support", included: true },
    ],
    cta: "Berlangganan",
    ctaVariant: "default",
  },
  {
    name: "Enterprise",
    description: "Solusi khusus untuk korporasi dan organisasi besar",
    price: "Custom",
    priceNote: "Hubungi kami",
    icon: Building2,
    features: [
      { text: "Unlimited Chatbot", included: true },
      { text: "Unlimited pesan", included: true },
      { text: "Knowledge Base: Unlimited", included: true },
      { text: "White-label Solution", included: true },
      { text: "On-premise Option", included: true },
      { text: "Custom AI Training", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "SLA 99.9%", included: true },
      { text: "SSO & Advanced Security", included: true },
      { text: "24/7 Support", included: true },
    ],
    cta: "Hubungi Sales",
    ctaVariant: "secondary",
  },
];

const addOns = [
  {
    name: "Paket Pesan Tambahan",
    description: "10.000 pesan",
    price: "Rp 99.000",
  },
  {
    name: "Chatbot Tambahan",
    description: "Per chatbot/bulan",
    price: "Rp 49.000",
  },
  {
    name: "Knowledge Base Extra",
    description: "50 dokumen tambahan",
    price: "Rp 79.000",
  },
  {
    name: "WhatsApp Business API",
    description: "Setup & integrasi",
    price: "Rp 299.000",
  },
];

const faqs = [
  {
    question: "Bagaimana cara kerja pembayaran?",
    answer: "Pembayaran dilakukan secara bulanan melalui kartu kredit/debit atau transfer bank. Anda bisa membatalkan kapan saja.",
  },
  {
    question: "Apakah ada periode trial?",
    answer: "Paket Starter gratis selamanya. Untuk paket berbayar, kami menyediakan trial 14 hari dengan akses penuh.",
  },
  {
    question: "Bagaimana jika pesan melebihi kuota?",
    answer: "Anda akan mendapat notifikasi saat mendekati limit. Anda bisa membeli paket pesan tambahan atau upgrade paket.",
  },
  {
    question: "Apakah bisa downgrade paket?",
    answer: "Ya, Anda bisa downgrade kapan saja. Perubahan akan berlaku di periode billing berikutnya.",
  },
  {
    question: "Bagaimana dengan keamanan data?",
    answer: "Data Anda dilindungi dengan enkripsi end-to-end dan disimpan di server yang aman. Kami mematuhi standar keamanan industri.",
  },
];

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <Card className={`relative flex flex-col ${tier.popular ? "border-primary shadow-lg scale-105" : ""}`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Paling Populer
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <tier.icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <CardDescription className="text-sm">{tier.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-center mb-6">
          <span className="text-3xl font-bold">{tier.price}</span>
          <span className="text-muted-foreground text-sm ml-1">{tier.priceNote}</span>
        </div>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              {feature.included ? (
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={feature.included ? "" : "text-muted-foreground"}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={tier.ctaVariant}
          data-testid={`button-plan-${tier.name.toLowerCase()}`}
        >
          {tier.cta}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Bot className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Gustafta</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/documentation">
              <Button variant="ghost" data-testid="button-documentation">
                Dokumentasi
              </Button>
            </Link>
            <ThemeToggle />
            <Link href="/dashboard">
              <Button data-testid="button-go-dashboard">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl font-bold mb-4">Pilih Paket yang Tepat untuk Bisnis Anda</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mulai gratis, tingkatkan sesuai kebutuhan. Semua paket termasuk fitur dasar chatbot AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Add-Ons</h2>
            <p className="text-muted-foreground">Tingkatkan kapasitas sesuai kebutuhan</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {addOns.map((addon) => (
              <Card key={addon.name} className="hover-elevate">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{addon.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{addon.description}</p>
                  <p className="font-bold text-primary">{addon.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Perbandingan Fitur</h2>
            <p className="text-muted-foreground">Detail fitur untuk setiap paket</p>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Fitur</th>
                    <th className="text-center p-4 font-medium">Starter</th>
                    <th className="text-center p-4 font-medium bg-primary/5">Professional</th>
                    <th className="text-center p-4 font-medium">Business</th>
                    <th className="text-center p-4 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Jumlah Chatbot", starter: "1", professional: "5", business: "20", enterprise: "Unlimited" },
                    { feature: "Pesan/bulan", starter: "1.000", professional: "10.000", business: "50.000", enterprise: "Unlimited" },
                    { feature: "Knowledge Base", starter: "5 dok", professional: "50 dok", business: "Unlimited", enterprise: "Unlimited" },
                    { feature: "Web Widget", starter: "Ya", professional: "Ya", business: "Ya", enterprise: "Ya" },
                    { feature: "Remove Branding", starter: "-", professional: "Ya", business: "Ya", enterprise: "Ya" },
                    { feature: "WhatsApp", starter: "-", professional: "Ya", business: "Ya", enterprise: "Ya" },
                    { feature: "Telegram", starter: "-", professional: "Ya", business: "Ya", enterprise: "Ya" },
                    { feature: "Discord", starter: "-", professional: "Ya", business: "Ya", enterprise: "Ya" },
                    { feature: "Slack", starter: "-", professional: "-", business: "Ya", enterprise: "Ya" },
                    { feature: "API Access", starter: "-", professional: "-", business: "Ya", enterprise: "Ya" },
                    { feature: "Agentic AI", starter: "-", professional: "Ya", business: "Ya", enterprise: "Ya" },
                    { feature: "Analytics", starter: "Basic", professional: "Standard", business: "Advanced", enterprise: "Custom" },
                    { feature: "Custom Domain", starter: "-", professional: "-", business: "Ya", enterprise: "Ya" },
                    { feature: "Support", starter: "Email", professional: "Email + Chat", business: "Priority", enterprise: "24/7" },
                  ].map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="text-center p-4">{row.starter === "-" ? <X className="h-4 w-4 mx-auto text-muted-foreground" /> : row.starter}</td>
                      <td className="text-center p-4 bg-primary/5">{row.professional === "-" ? <X className="h-4 w-4 mx-auto text-muted-foreground" /> : row.professional}</td>
                      <td className="text-center p-4">{row.business === "-" ? <X className="h-4 w-4 mx-auto text-muted-foreground" /> : row.business}</td>
                      <td className="text-center p-4">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Pertanyaan Umum</h2>
            <p className="text-muted-foreground">Jawaban untuk pertanyaan yang sering diajukan</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center py-12 bg-muted/30 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Butuh Solusi Khusus?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Tim kami siap membantu Anda menemukan solusi yang tepat untuk kebutuhan bisnis Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" data-testid="button-contact-sales">
              <Headphones className="h-4 w-4" />
              Hubungi Sales
            </Button>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-start-free">
                Mulai Gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t mt-12">
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
