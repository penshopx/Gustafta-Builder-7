import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCreateSubscription, usePaymentStatus } from "@/hooks/use-subscription";
import { useGustaftaAssistant } from "@/hooks/use-agents";
import { ChatPopup } from "@/components/chat-popup";
import { SharedHeader } from "@/components/shared-header";
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
      { text: "Orchestrator Multi-Agent (7 Specialist)", included: true },
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
      { text: "Orchestrator Multi-Agent (7 Specialist)", included: true },
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
      { text: "Orchestrator Multi-Agent + Custom Specialist", included: true },
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
      { text: "Orchestrator Multi-Agent + Custom Specialist Unlimited", included: true },
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
  {
    name: "Orchestrator Routing",
    description: "Biaya AI classifier (~Rp 1–2/pesan) sudah termasuk dalam paket berbayar",
    price: "Termasuk",
  },
];

const faqs = [
  {
    question: "Bagaimana cara kerja pembayaran?",
    answer: "Pembayaran dilakukan melalui payment gateway lokal Indonesia. Anda bisa bayar via transfer bank, e-wallet, kartu kredit/debit, minimarket, atau QRIS.",
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
    question: "Apakah Orchestrator Multi-Agent menambah biaya?",
    answer: "Orchestrator menggunakan DeepSeek sebagai model classifier AI. Biaya routing sangat kecil (~$0.0001 per pesan atau sekitar Rp 1–2/pesan) dan sudah termasuk dalam semua paket berlangganan.",
  },
  {
    question: "Apa perbedaan Orchestrator Multi-Agent dengan Orkestrator (Big Idea) di hierarki?",
    answer: "Dua hal berbeda: (1) Orkestrator/Big Idea di hierarki = chatbot hub level 3 yang mengarahkan user ke chatbot spesialis lain melalui percakapan. (2) Orchestrator Multi-Agent = sistem routing otomatis di DALAM satu chatbot yang mendeteksi topik pesan dan memilih specialist agent yang tepat untuk menjawab — semuanya transparan dan mulus tanpa perpindahan chatbot.",
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
  const { data: gustaftaAssistant } = useGustaftaAssistant();
  const queryClient = useQueryClient();

  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<"success" | "pending" | "error" | null>(null);

  // Muat Midtrans Snap JS kalau belum ada
  const loadSnapScript = (clientKey: string) => {
    const isSandbox = clientKey.startsWith("SB-");
    const snapUrl = isSandbox
      ? "https://app.sandbox.midtrans.com/snap/snap.js"
      : "https://app.midtrans.com/snap/snap.js";
    if (document.querySelector(`script[src="${snapUrl}"]`)) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = snapUrl;
      script.setAttribute("data-client-key", clientKey);
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap"));
      document.head.appendChild(script);
    });
  };

  const handleSelectPlan = async (planKey: string) => {
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
    setPaymentLoading(true);

    try {
      const result = await createSubscription.mutateAsync({ plan: planKey });

      // Free trial — langsung aktif
      if (!result.snapToken) {
        queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/user"] });
        toast({ title: "Free Trial Aktif!", description: "Selamat menikmati Gustafta selama 14 hari gratis." });
        navigate("/");
        return;
      }

      // Paket berbayar — buka Midtrans Snap popup
      const clientKey = (paymentStatus as any)?.clientKey || "";
      await loadSnapScript(clientKey);

      const snap = (window as any).snap;
      if (!snap) throw new Error("Midtrans Snap tidak tersedia");

      snap.pay(result.snapToken, {
        onSuccess: () => {
          setPaymentResult("success");
          queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/user"] });
          toast({ title: "Pembayaran Berhasil!", description: "Langganan Anda sudah aktif." });
        },
        onPending: () => {
          setPaymentResult("pending");
          toast({
            title: "Menunggu Pembayaran",
            description: "Selesaikan pembayaran sesuai instruksi. Akun akan aktif otomatis.",
          });
        },
        onError: () => {
          setPaymentResult("error");
          toast({ title: "Pembayaran Gagal", description: "Silakan coba lagi.", variant: "destructive" });
        },
        onClose: () => {
          if (!paymentResult) {
            toast({ title: "Pembayaran Dibatalkan", description: "Anda menutup jendela pembayaran." });
          }
        },
      });
    } catch (error: any) {
      toast({
        title: "Gagal Memproses",
        description: error?.message || "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {paymentResult === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background rounded-xl p-8 max-w-sm text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold">Pembayaran Berhasil!</h2>
            <p className="text-muted-foreground text-sm">Langganan Anda sudah aktif. Selamat menggunakan Gustafta!</p>
            <Button className="w-full" onClick={() => { setPaymentResult(null); navigate("/"); }} data-testid="button-go-dashboard">
              Ke Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <SharedHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl font-bold mb-4">Pilih Paket Berlangganan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pilih durasi berlangganan yang sesuai kebutuhan Anda. Semua paket sudah termasuk Agentic AI dan Orchestrator Multi-Agent.
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
                    <th className="text-center p-4 font-medium">1 Bulan</th>
                    <th className="text-center p-4 font-medium bg-primary/5">3 Bulan</th>
                    <th className="text-center p-4 font-medium">6 Bulan</th>
                    <th className="text-center p-4 font-medium">12 Bulan</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Durasi", m1: "30 hari", m3: "90 hari", m6: "180 hari", m12: "365 hari" },
                    { feature: "Jumlah Chatbot", m1: "1", m3: "1", m6: "1", m12: "1" },
                    { feature: "Pesan", m1: "5.000/bln", m3: "5.000/bln", m6: "5.000/bln", m12: "5.000/bln" },
                    { feature: "Knowledge Base", m1: "20 dok", m3: "20 dok", m6: "30 dok", m12: "50 dok" },
                    { feature: "Web Widget", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Ya" },
                    { feature: "Remove Branding", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Custom" },
                    { feature: "WhatsApp", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Ya" },
                    { feature: "Telegram", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Ya" },
                    { feature: "Discord", m1: "-", m3: "-", m6: "Ya", m12: "Ya" },
                    { feature: "Slack", m1: "-", m3: "-", m6: "-", m12: "Ya" },
                    { feature: "Agentic AI", m1: "Ya", m3: "Ya", m6: "Ya", m12: "Ya" },
                    { feature: "Orchestrator Multi-Agent", m1: "7 Specialist", m3: "7 Specialist", m6: "7 + Custom", m12: "7 + Custom ∞" },
                    { feature: "Analytics", m1: "Standard", m3: "Standard", m6: "Advanced", m12: "Advanced" },
                    { feature: "Support", m1: "Email", m3: "Priority Email", m6: "Priority", m12: "Priority + WA" },
                  ].map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-4 font-medium">{row.feature}</td>
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
            Pilih paket dan mulai bangun ekosistem chatbot AI profesional Anda hari ini. Semua paket sudah termasuk Agentic AI dan Orchestrator Multi-Agent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <Zap className="h-4 w-4" />
              Lihat Paket
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
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
              © 2026 Gustafta. AI Project Intelligence Platform.
            </p>
          </div>
        </div>
      </footer>

      {gustaftaAssistant && (
        <ChatPopup agent={gustaftaAssistant} />
      )}
    </div>
  );
}
