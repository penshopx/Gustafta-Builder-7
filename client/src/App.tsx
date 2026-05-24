import { Switch, Route, useLocation, useParams } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { useMetaPixel } from "@/hooks/use-meta-pixel";
import { useToast } from "@/hooks/use-toast";
import { PremiumPageGuard } from "@/components/premium-page-guard";
import { Brain, Cpu, GraduationCap, Sparkles, Database, HardHat, Bot } from "lucide-react";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Documentation from "@/pages/documentation";
import Pricing from "@/pages/pricing";
import Marketplace from "@/pages/marketplace";
import Subscription from "@/pages/subscription";
import PaymentSuccess from "@/pages/payment-success";
import EmbedChat from "@/pages/embed-chat";
import AgentChat from "@/pages/agent-chat";
import SeriesCatalog from "@/pages/series-catalog";
import SeriesDetail from "@/pages/series-detail";
import SectorLanding from "@/pages/sector-landing";
import ProductLanding from "@/pages/product-landing";
import EkosistemLanding from "@/pages/ekosistem-landing";
import ModulChat from "@/pages/modul-chat";
import PacksPage from "@/pages/packs";
import TenderWizard from "@/pages/tender-wizard";
import DomainsPage from "@/pages/domains";
import AdminPage from "@/pages/admin";
import AccountPage from "@/pages/account";
import MiniAppPublic from "@/pages/mini-app-public";
import LegalLanding from "@/pages/legal-landing";
import LegalChat from "@/pages/legal-chat";
import TemplatesPage from "@/pages/templates";
import StorePage from "@/pages/store";
import StoreAccess from "@/pages/store-access";
import TestTracker from "@/pages/test-tracker";
import ChaesaPage from "@/pages/chaesa";
import PlatformSales from "@/pages/platform-sales";
import EducationPage from "@/pages/education";
import OnboardingPage from "@/pages/onboarding";
import MySubscriptionPage from "@/pages/my-subscription";
import PendingApproval from "@/pages/pending-approval";
import Panduan from "@/pages/panduan";
import PanduanDelivery from "@/pages/panduan-delivery";
import WelcomePage from "@/pages/welcome";
import ReferensiHarga from "@/pages/referensi-harga";
import TenderMonitor from "@/pages/tender-monitor";
import TenderAlertProfile from "@/pages/tender-alert-profile";
import TenderAiChat from "@/pages/tender-ai-chat";
import BujkProfile from "@/pages/bujk-profile";
import WinProbability from "@/pages/win-probability";
import BrainProjectChat from "@/pages/brain-project-chat";
import DataMasterPage from "@/pages/data-master";
import IbTuChat from "@/pages/ib-tu-chat";
import AiTutorChat from "@/pages/ai-tutor-chat";
import TutorBuilder from "@/pages/tutor-builder";
import SbuClawChat from "@/pages/sbu-claw-chat";
import EduCounselChat from "@/pages/edu-counsel-chat";
import TrilogiChat from "@/pages/trilogi-chat";
import WidgetDemo from "@/pages/widget-demo";
import LmsPage from "@/pages/lms";
import LmsCourse from "@/pages/lms-course";
import LmsLesson from "@/pages/lms-lesson";
import ProductTour from "@/pages/product-tour";
import NotFound from "@/pages/not-found";
import { ChaesaWidget } from "@/components/chaesa-widget";
import { MultiClawProvider } from "@/contexts/multiclaw-context";

const WIDGET_EXCLUDED_PATHS = ["/legal", "/embed/", "/chaesa", "/demo/"];

function MarketplaceRedirect() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const params = useParams<{ agentId?: string }>();
  useEffect(() => {
    const agentId = params?.agentId;
    const oldPath = agentId ? `/marketplace/${agentId}` : "/marketplace";
    toast({
      title: "Link ini sudah berubah",
      description: agentId
        ? `Halaman "${oldPath}" telah dipindahkan ke Store. Mencari produk dengan ID ${agentId}…`
        : `Halaman "${oldPath}" telah dipindahkan ke Store. Anda akan diarahkan otomatis.`,
      duration: 6000,
    });
    const target = agentId ? `/store?search=${encodeURIComponent(agentId)}` : "/store";
    navigate(target, { replace: true });
  }, []);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/marketplace" component={MarketplaceRedirect} />
      <Route path="/marketplace/:agentId" component={MarketplaceRedirect} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/embed/:agentId" component={EmbedChat} />
      <Route path="/bot/:agentId" component={AgentChat} />
      <Route path="/chat/:agentId" component={AgentChat} />
      <Route path="/series" component={SeriesCatalog} />
      <Route path="/series/:slug" component={SeriesDetail} />
      <Route path="/sector/:sectorId" component={SectorLanding} />
      <Route path="/product/:agentId/:product" component={EkosistemLanding} />
      <Route path="/product/:agentId" component={ProductLanding} />
      <Route path="/modul/:bigIdeaId" component={ModulChat} />
      <Route path="/m/:bigIdeaId" component={ModulChat} />
      <Route path="/packs" component={PacksPage} />
      <Route path="/packs/:packId" component={TenderWizard} />
      <Route path="/domains" component={DomainsPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/mini-app/:slug" component={MiniAppPublic} />
      <Route path="/legal" component={LegalLanding} />
      <Route path="/legal/chat" component={LegalChat} />
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/store" component={StorePage} />
      <Route path="/store/access/:token" component={StoreAccess} />
      <Route path="/test-tracker" component={TestTracker} />
      <Route path="/chaesa" component={ChaesaPage} />
      <Route path="/platform" component={PlatformSales} />
      <Route path="/education" component={EducationPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/my-subscription" component={MySubscriptionPage} />
      <Route path="/pending-approval" component={PendingApproval} />
      <Route path="/panduan" component={Panduan} />
      <Route path="/panduan-delivery" component={PanduanDelivery} />
      <Route path="/welcome" component={WelcomePage} />
      <Route path="/referensi-harga" component={ReferensiHarga} />
        <Route path="/tender-monitor" component={TenderMonitor} />
        <Route path="/tender-alert" component={TenderAlertProfile} />
        <Route path="/tender-ai" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="Tendera AI — Multi-Agen Pengadaan"
            description="Sistem 131 hub AI yang menganalisis dokumen tender, menghitung win probability, dan menyiapkan dokumen penawaran secara paralel."
            highlights={["131 hub orchestrator dengan sub-agen paralel","Scorecard 4-dimensi + Win Probability otomatis","Analisis RKS, BOQ, dan persyaratan teknis","Dokumen penawaran siap submit"]}
            icon={<HardHat className="h-12 w-12 text-amber-500" />}
          ><TenderAiChat /></PremiumPageGuard>
        )} />
        <Route path="/bujk-profile" component={BujkProfile} />
        <Route path="/win-probability" component={WinProbability} />
        <Route path="/brain-project" component={BrainProjectChat} />
        <Route path="/data-master" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="Data Master OpenClaw"
            description="Kelola profil BUJK, referensi harga satuan, dan data master konstruksi untuk seluruh tim Anda dalam satu platform terpusat."
            highlights={["Profil BUJK & subklasifikasi SBU lengkap","Referensi harga satuan konstruksi terstandar","Manajemen personel & SKK terpadu","Export data untuk dokumen penawaran"]}
            icon={<Database className="h-12 w-12 text-blue-500" />}
          ><DataMasterPage /></PremiumPageGuard>
        )} />
        <Route path="/ib-tu" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="IB-TU Coordinator — Tata Usaha IB DP"
            description="7 agen spesialis IB Diploma Programme yang mengelola registrasi subjek, IAA, predicted grades, logistik ujian, dan PSP compliance secara paralel."
            highlights={["Validasi kombinasi 6 subjek HL/SL & Group Requirements","Manajemen IAA deadline & akomodasi khusus","Predicted Grades tracker & gap analysis","Draft surat komunikasi bilingual ID/EN"]}
            icon={<GraduationCap className="h-12 w-12 text-emerald-500" />}
          ><IbTuChat /></PremiumPageGuard>
        )} />
        <Route path="/ai-tutor" component={() => (
          <PremiumPageGuard
            feature="ai_tools" requiredPlan="starter"
            title="AI Tutor Adaptif"
            description="Sistem tutor AI multi-agen yang menyesuaikan gaya belajar, mendeteksi learning gap, dan merancang intervention plan personal untuk setiap siswa."
            highlights={["Deteksi learning gap & rancang intervention 14-hari","Analisis akademik hijau/kuning/merah per mata pelajaran","Study habit coaching berbasis data","Pathway ke universitas DN & LN"]}
            icon={<Brain className="h-12 w-12 text-violet-500" />}
          ><AiTutorChat /></PremiumPageGuard>
        )} />
        <Route path="/tutor-builder" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="Rakit Tim Agen — Trilogi OpenClaw"
            description="12 blueprint multi-agen dari 3 domain Trilogi: Dialog (belajar), Kolaborasi (bekerja), dan Kreasi (berkarya). Rakit tim AI Anda sendiri."
            highlights={["12 blueprint siap pakai dari 3 domain","Tutor Sokratik 4-Mode, Tim Rapat Hybrid, Pipeline Konten","Custom team dengan sub-agen paralel","Panel Tim Saya untuk manajemen agen aktif"]}
            icon={<Sparkles className="h-12 w-12 text-pink-500" />}
          ><TutorBuilder /></PremiumPageGuard>
        )} />
        <Route path="/trilogi-chat/:orchestratorId" component={TrilogiChat} />
        <Route path="/sbu-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="SBUClaw — Multi-Agen SBU Konstruksi"
            description="10 agen spesialis yang memandu proses pengurusan SBU Konstruksi end-to-end: mapping subklasifikasi, gap analysis, dokumen, SKK, hingga walkthrough OSS-RBA."
            highlights={["Smart mapping subklasifikasi BS/BG/IL/IM/KO","Checklist dokumen & gap analysis kualifikasi","Draft surat & estimasi biaya + timeline","Walkthrough OSS-RBA & LPJK step-by-step"]}
            icon={<HardHat className="h-12 w-12 text-amber-400" />}
          ><SbuClawChat /></PremiumPageGuard>
        )} />
        <Route path="/edu-counsel" component={() => (
          <PremiumPageGuard
            feature="ai_tools" requiredPlan="starter"
            title="EduCounsel AI — Konseling Akademik"
            description="11 agen spesialis konseling siswa yang bekerja paralel: safety gate, profil siswa, analisis akademik, diagnostik, intervention, coaching, pathway DN/LN, dan dokumentasi BK."
            highlights={["Safety gate wajib di setiap sesi konseling","Analisis akademik 3-level: Hijau/Kuning/Merah","Intervention plan 14-hari personal","Pathway universitas DN & LN + beasiswa"]}
            icon={<Bot className="h-12 w-12 text-blue-400" />}
          ><EduCounselChat /></PremiumPageGuard>
        )} />
        <Route path="/demo/:agentId" component={WidgetDemo} />
        <Route path="/chatbot/:agentId" component={WidgetDemo} />
        <Route path="/lms" component={LmsPage} />
        <Route path="/lms/course/:id/lesson/:lessonId" component={LmsLesson} />
        <Route path="/lms/course/:id" component={LmsCourse} />
        <Route path="/product-tour" component={ProductTour} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const showWidget = !WIDGET_EXCLUDED_PATHS.some(p => location.startsWith(p));

  useMetaPixel();

  return (
    <>
      <Router />
      {showWidget && <ChaesaWidget />}
      <Toaster />
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MultiClawProvider>
            <AppContent />
          </MultiClawProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
