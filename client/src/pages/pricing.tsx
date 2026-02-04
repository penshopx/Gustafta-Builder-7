import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCreateSubscription, usePaymentStatus } from "@/hooks/use-subscription";
import { Loader2 } from "lucide-react";
import { 
  Bot, Check, X, Zap, Crown, Building2, Sparkles, ArrowRight,
  MessageSquare, Users, Globe, BookOpen, BarChart3, Shield, Headphones,
  CreditCard, Wallet, Building, Smartphone, QrCode
} from "lucide-react";

interface PricingTier {
  name: string;
  planKey: string;
  description: string;
  price: string;
  priceNote: string;
  duration?: string;
  savings?: string;
  icon: typeof Bot;
  popular?: boolean;
  features: { text: string; included: boolean }[];
  cta: string;
  ctaVariant: "default" | "outline" | "secondary";
}

const subscriptionTiers: PricingTier[] = [
  {
    name: "Free Trial",
    planKey: "free_trial",
    description: "Coba gratis selama 14 hari dengan materi awareness",
    price: "Gratis",
    priceNote: "14 hari",
    duration: "14 Hari",
    icon: Zap,
    features: [
      { text: "1 Chatbot", included: true },
      { text: "500 pesan", included: true },
      { text: "Materi Awareness", included: true },
      { text: "Knowledge Base: 3 dokumen", included: true },
      { text: "Web Widget", included: true },
      { text: "Multi-channel Integration", included: false },
      { text: "Agentic AI Features", included: false },
      { text: "Analytics Dashboard", included: false },
    ],
    cta: "Mulai Trial Gratis",
    ctaVariant: "outline",
  },
  {
    name: "1 Bulan",
    planKey: "monthly_1",
    description: "Berlangganan bulanan untuk 1 chatbot",
    price: "Rp 199.000",
    priceNote: "/bulan",
    duration: "1 Bulan",
    icon: Sparkles,
    features: [
      { text: "1 Chatbot", included: true },
      { text: "5.000 pesan/bulan", included: true },
      { text: "Knowledge Base: 20 dokumen", included: true },
      { text: "Web Widget (No Branding)", included: true },
      { text: "WhatsApp & Telegram", included: true },
      { text: "Agentic AI Features", included: true },
      { text: "Analytics Dashboard", included: true },
      { text: "Email Support", included: true },
    ],
    cta: "Berlangganan",
    ctaVariant: "default",
  },
  {
    name: "3 Bulan",
    planKey: "monthly_3",
    description: "Hemat 17% dengan berlangganan 3 bulan",
    price: "Rp 499.000",
    priceNote: "/3 bulan",
    duration: "3 Bulan",
    savings: "Hemat Rp 98.000",
    icon: Sparkles,
    popular: true,
    features: [
      { text: "1 Chatbot", included: true },
      { text: "5.000 pesan/bulan", included: true },
      { text: "Knowledge Base: 20 dokumen", included: true },
      { text: "Web Widget (No Branding)", included: true },
      { text: "WhatsApp & Telegram", included: true },
      { text: "Agentic AI Features", included: true },
      { text: "Analytics Dashboard", included: true },
      { text: "Priority Email Support", included: true },
    ],
    cta: "Berlangganan",
    ctaVariant: "default",
  },
  {
    name: "6 Bulan",
    planKey: "monthly_6",
    description: "Hemat 17% dengan berlangganan 6 bulan",
    price: "Rp 999.000",
    priceNote: "/6 bulan",
    duration: "6 Bulan",
    savings: "Hemat Rp 195.000",
    icon: Crown,
    features: [
      { text: "1 Chatbot", included: true },
      { text: "5.000 pesan/bulan", included: true },
      { text: "Knowledge Base: 30 dokumen", included: true },
      { text: "Web Widget (No Branding)", included: true },
      { text: "WhatsApp, Telegram, Discord", included: true },
      { text: "Agentic AI Features", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Priority Support", included: true },
    ],
    cta: "Berlangganan",
    ctaVariant: "default",
  },
  {
    name: "12 Bulan",
    planKey: "monthly_12",
    description: "Hemat 17% dengan berlangganan tahunan",
    price: "Rp 1.999.000",
    priceNote: "/tahun",
    duration: "12 Bulan",
    savings: "Hemat Rp 389.000",
    icon: Crown,
    features: [
      { text: "1 Chatbot", included: true },
      { text: "5.000 pesan/bulan", included: true },
      { text: "Knowledge Base: 50 dokumen", included: true },
      { text: "Web Widget (Custom Branding)", included: true },
      { text: "Semua Multi-channel", included: true },
      { text: "Agentic AI Features", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Priority Support + WhatsApp", included: true },
    ],
    cta: "Berlangganan",
    ctaVariant: "default",
  },
];

const chatbotPackages = [
  {
    name: "5 Chatbot",
    description: "Untuk tim kecil",
    price1m: "Rp 899.000",
    price3m: "Rp 2.399.000",
    price6m: "Rp 4.499.000",
    price12m: "Rp 8.999.000",
  },
  {
    name: "10 Chatbot",
    description: "Untuk bisnis menengah",
    price1m: "Rp 1.699.000",
    price3m: "Rp 4.499.000",
    price6m: "Rp 8.499.000",
    price12m: "Rp 16.999.000",
  },
  {
    name: "20 Chatbot",
    description: "Untuk enterprise",
    price1m: "Rp 2.999.000",
    price3m: "Rp 7.999.000",
    price6m: "Rp 14.999.000",
    price12m: "Rp 29.999.000",
  },
  {
    name: "Unlimited",
    description: "Custom solution",
    price1m: "Custom",
    price3m: "Custom",
    price6m: "Custom",
    price12m: "Custom",
  },
];

const paymentMethods = [
  {
    category: "Transfer Bank",
    icon: Building,
    methods: ["BCA", "BNI", "BRI", "Mandiri", "CIMB Niaga", "Permata", "Bank Lainnya (via Virtual Account)"],
  },
  {
    category: "E-Wallet",
    icon: Wallet,
    methods: ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"],
  },
  {
    category: "Kartu Kredit/Debit",
    icon: CreditCard,
    methods: ["Visa", "Mastercard", "JCB", "American Express"],
  },
  {
    category: "Minimarket",
    icon: Building2,
    methods: ["Indomaret", "Alfamart", "Alfamidi"],
  },
  {
    category: "QRIS",
    icon: QrCode,
    methods: ["Scan QR dari semua aplikasi e-wallet dan mobile banking"],
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
    price: "Rp 149.000",
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
    answer: "Pembayaran dilakukan melalui payment gateway lokal Indonesia. Anda bisa bayar via transfer bank, e-wallet, kartu kredit/debit, minimarket, atau QRIS.",
  },
  {
    question: "Apakah ada periode trial?",
    answer: "Ya! Kami menyediakan free trial 14 hari dengan akses ke materi awareness dan fitur dasar chatbot. Tidak perlu kartu kredit untuk memulai.",
  },
  {
    question: "Bagaimana jika pesan melebihi kuota?",
    answer: "Anda akan mendapat notifikasi saat mendekati limit. Anda bisa membeli paket pesan tambahan atau upgrade ke paket chatbot yang lebih besar.",
  },
  {
    question: "Apakah bisa upgrade atau downgrade paket?",
    answer: "Ya, Anda bisa upgrade kapan saja. Untuk downgrade, perubahan akan berlaku di periode billing berikutnya.",
  },
  {
    question: "Bagaimana dengan keamanan data?",
    answer: "Data Anda dilindungi dengan enkripsi end-to-end dan disimpan di server yang aman. Kami mematuhi standar keamanan industri.",
  },
  {
    question: "Metode pembayaran apa yang tersedia?",
    answer: "Kami menerima transfer bank (BCA, BNI, BRI, Mandiri, dll), e-wallet (GoPay, OVO, DANA, ShopeePay), kartu kredit/debit, pembayaran di minimarket, dan QRIS.",
  },
];

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (planKey: string) => void;
  isLoading?: boolean;
  selectedPlan?: string;
}

function PricingCard({ tier, onSelect, isLoading, selectedPlan }: PricingCardProps) {
  const isCurrentlyLoading = isLoading && selectedPlan === tier.planKey;
  
  return (
    <Card className={`relative flex flex-col ${tier.popular ? "border-primary shadow-lg scale-105" : ""}`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Paling Populer
          </Badge>
        </div>
      )}
      {tier.savings && (
        <div className="absolute -top-3 right-2">
          <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
            {tier.savings}
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
          onClick={() => onSelect(tier.planKey)}
          disabled={isLoading}
          data-testid={`button-plan-${tier.name.toLowerCase().replace(/\s/g, '-')}`}
        >
          {isCurrentlyLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            tier.cta
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const createSubscription = useCreateSubscription();
  const { data: paymentStatus } = usePaymentStatus();
  
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");

  const handleSelectPlan = (planKey: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk berlangganan.",
        variant: "destructive",
      });
      window.location.href = "/api/login";
      return;
    }
    
    setSelectedPlan(planKey);
    setCustomerEmail(user?.email || "");
    setCustomerName(user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "");
    setShowPaymentDialog(true);
  };

  const handleConfirmPayment = async () => {
    if (!customerEmail || !customerName) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Silakan lengkapi nama dan email Anda.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createSubscription.mutateAsync({
        plan: selectedPlan,
        email: customerEmail,
        name: customerName,
      });

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else if (selectedPlan === "free_trial") {
        toast({
          title: "Free Trial Aktif!",
          description: "Selamat! Free trial 14 hari Anda sudah aktif.",
        });
        setShowPaymentDialog(false);
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Gagal Memproses",
        description: "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
            <DialogDescription>
              {selectedPlan === "free_trial" 
                ? "Masukkan data Anda untuk memulai free trial 14 hari."
                : "Masukkan data Anda untuk melanjutkan ke pembayaran."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Nama Lengkap</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                data-testid="input-customer-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email">Email</Label>
              <Input
                id="customer-email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="email@example.com"
                data-testid="input-customer-email"
              />
            </div>
            {!paymentStatus?.paymentConfigured && selectedPlan !== "free_trial" && (
              <div className="p-3 bg-yellow-500/10 rounded-lg text-sm text-yellow-600 dark:text-yellow-400">
                Payment gateway belum dikonfigurasi. Hubungi admin untuk informasi pembayaran.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleConfirmPayment}
              disabled={createSubscription.isPending}
              data-testid="button-confirm-payment"
            >
              {createSubscription.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : selectedPlan === "free_trial" ? (
                "Mulai Free Trial"
              ) : (
                "Lanjut ke Pembayaran"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            {isAuthenticated && (
              <Link href="/subscription">
                <Button variant="ghost" data-testid="button-my-subscription">
                  Langganan Saya
                </Button>
              </Link>
            )}
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
          <h1 className="text-4xl font-bold mb-4">Pilih Paket Berlangganan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mulai dengan free trial 14 hari, lalu pilih durasi berlangganan yang sesuai kebutuhan Anda.
          </p>
        </div>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Paket 1 Chatbot</h2>
            <p className="text-muted-foreground">Pilih durasi berlangganan untuk 1 chatbot</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {subscriptionTiers.map((tier) => (
              <PricingCard 
                key={tier.name} 
                tier={tier} 
                onSelect={handleSelectPlan}
                isLoading={createSubscription.isPending}
                selectedPlan={selectedPlan}
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Paket Multiple Chatbot</h2>
            <p className="text-muted-foreground">Untuk kebutuhan bisnis dengan banyak chatbot</p>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Paket</th>
                    <th className="text-center p-4 font-medium">1 Bulan</th>
                    <th className="text-center p-4 font-medium bg-primary/5">3 Bulan</th>
                    <th className="text-center p-4 font-medium">6 Bulan</th>
                    <th className="text-center p-4 font-medium">12 Bulan</th>
                  </tr>
                </thead>
                <tbody>
                  {chatbotPackages.map((pkg, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-4">
                        <div className="font-medium">{pkg.name}</div>
                        <div className="text-xs text-muted-foreground">{pkg.description}</div>
                      </td>
                      <td className="text-center p-4 font-medium">{pkg.price1m}</td>
                      <td className="text-center p-4 font-medium bg-primary/5">{pkg.price3m}</td>
                      <td className="text-center p-4 font-medium">{pkg.price6m}</td>
                      <td className="text-center p-4 font-medium">{pkg.price12m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Metode Pembayaran</h2>
            <p className="text-muted-foreground">Bayar dengan mudah menggunakan payment gateway lokal Indonesia</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((payment) => (
              <Card key={payment.category}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <payment.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{payment.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {payment.methods.map((method, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Pembayaran diproses melalui payment gateway terpercaya dan tersertifikasi PCI-DSS
          </p>
        </section>

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
            <p className="text-muted-foreground">Detail fitur untuk setiap durasi berlangganan</p>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Fitur</th>
                    <th className="text-center p-4 font-medium">Free Trial</th>
                    <th className="text-center p-4 font-medium">1 Bulan</th>
                    <th className="text-center p-4 font-medium bg-primary/5">3 Bulan</th>
                    <th className="text-center p-4 font-medium">6 Bulan</th>
                    <th className="text-center p-4 font-medium">12 Bulan</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Durasi", trial: "14 hari", m1: "30 hari", m3: "90 hari", m6: "180 hari", m12: "365 hari" },
                    { feature: "Jumlah Chatbot", trial: "1", m1: "1", m3: "1", m6: "1", m12: "1" },
                    { feature: "Pesan", trial: "500", m1: "5.000/bln", m3: "5.000/bln", m6: "5.000/bln", m12: "5.000/bln" },
                    { feature: "Knowledge Base", trial: "3 dok", m1: "20 dok", m3: "20 dok", m6: "30 dok", m12: "50 dok" },
                    { feature: "Materi Awareness", trial: "Ya", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Ya" },
                    { feature: "Web Widget", trial: "Ya", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Ya" },
                    { feature: "Remove Branding", trial: "-", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Custom" },
                    { feature: "WhatsApp", trial: "-", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Ya" },
                    { feature: "Telegram", trial: "-", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Ya" },
                    { feature: "Discord", trial: "-", m1: "-", m3: "-", m6: "Ya", m12: "Ya" },
                    { feature: "Slack", trial: "-", m1: "-", m3: "-", m6: "-", m12: "Ya" },
                    { feature: "Agentic AI", trial: "-", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Ya" },
                    { feature: "Analytics", trial: "Basic", m1: "Standard", m3: "Standard", m6: "Advanced", m12: "Advanced" },
                    { feature: "Support", trial: "Email", m1: "Email", m3: "Priority Email", m6: "Priority", m12: "Priority + WA" },
                  ].map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="text-center p-4">{row.trial === "-" ? <X className="h-4 w-4 mx-auto text-muted-foreground" /> : row.trial}</td>
                      <td className="text-center p-4">{row.m1 === "-" ? <X className="h-4 w-4 mx-auto text-muted-foreground" /> : row.m1}</td>
                      <td className="text-center p-4 bg-primary/5">{row.m3 === "-" ? <X className="h-4 w-4 mx-auto text-muted-foreground" /> : row.m3}</td>
                      <td className="text-center p-4">{row.m6 === "-" ? <X className="h-4 w-4 mx-auto text-muted-foreground" /> : row.m6}</td>
                      <td className="text-center p-4">{row.m12 === "-" ? <X className="h-4 w-4 mx-auto text-muted-foreground" /> : row.m12}</td>
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
          <h2 className="text-2xl font-bold mb-2">Siap Memulai?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Coba gratis selama 14 hari tanpa perlu kartu kredit. Upgrade kapan saja sesuai kebutuhan bisnis Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2" data-testid="button-start-trial">
                <Zap className="h-4 w-4" />
                Mulai Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2" data-testid="button-contact-sales">
              <Headphones className="h-4 w-4" />
              Hubungi Sales
            </Button>
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
