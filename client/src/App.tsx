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
import { Brain, Cpu, GraduationCap, Sparkles, Database, HardHat, Bot, Scale, Shield, Award, Leaf, BarChart3, Users, TrendingUp, ShieldAlert, Search, Building2, Wrench, Zap, BookOpen, Landmark } from "lucide-react";
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
import Smk3ClawChat from "@/pages/smk3-claw";
import LkutClawChat from "@/pages/lkut-claw";
import PjbuClawChat from "@/pages/pjbu-claw";
import KeuanganClawChat from "@/pages/keuangan-claw";
import CsmsClawChat from "@/pages/csms-claw";
import SafiraClawChat from "@/pages/safira-claw";
import TenderaClawChat from "@/pages/tendera-claw";
import KonstraTenderClawChat from "@/pages/konstra-tender-claw";
import BgClawChat from "@/pages/bg-claw";
import BsClawChat from "@/pages/bs-claw";
import ImClawChat from "@/pages/im-claw";
import KoClawChat from "@/pages/ko-claw";
import KkClawChat from "@/pages/kk-claw";
import SmapClawChat from "@/pages/smap-claw";
import PancekClawChat from "@/pages/pancek-claw";
import IsoClaw9001Chat from "@/pages/iso-claw-9001";
import IsoClaw14001Chat from "@/pages/iso-claw-14001";
import KonstraClawChat from "@/pages/konstra-claw";
import BrainClawChat from "@/pages/brain-claw";
import EducounselClawChat from "@/pages/educounsel-claw";
import IBTUClawChat from "@/pages/ibtu-claw";
import MigasClawChat from "@/pages/migas-claw";
import DevPropertiClawChat from "@/pages/dev-properti-claw";
import EstateCareClaw from "@/pages/estate-care-claw";
import SkemaClawChat from "@/pages/skema-claw";
import PanduanSBUChat from "@/pages/panduan-sbu";
import EduCounselChat from "@/pages/edu-counsel-chat";
import SkkCoachLanding from "@/pages/skk-coach-landing";
import SkkCoachChat from "@/pages/skk-coach-chat";
import AskomLanding from "@/pages/askom-landing";
import AskomChat from "@/pages/askom-chat";
import AbuClawChat from "@/pages/abu-claw";
import PanduanAskomChat from "@/pages/panduan-askom";
import ScopeSipilChat from "@/pages/scope-sipil";
import ScopeManpelChat from "@/pages/scope-manpel";
import ScopeMekanikalChat from "@/pages/scope-mekanikal";
import SipilClawChat from "@/pages/sipil-claw";
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
        <Route path="/legal/chat" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="LexCom AI — Konsultasi Hukum Indonesia"
            description="17 agen spesialis hukum Indonesia yang siap membantu: pidana, perdata, korporasi, pajak, ketenagakerjaan, pertanahan, HKI, imigrasi, yurisprudensi MA/MK, hingga draft legal opinion formal."
            highlights={["17 agen hukum spesialis + LEX-ORCHESTRATOR","Riset yurisprudensi MA & MK + RAG Knowledge Base","Draft gugatan, legal opinion, somasi, kontrak & MoU","Ekspor dokumen ke PDF & HTML siap pakai"]}
            icon={<Scale className="h-12 w-12 text-purple-500" />}
          ><LegalChat /></PremiumPageGuard>
        )} />
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
        <Route path="/brain-project" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="Brain Project"
            description="Pendamping proyek konstruksi berbasis AI multi-agen — analisis LHP, EVM, NCR, K3, lingkungan, dan klaim FIDIC dalam satu sesi."
            highlights={["6 spesialis paralel: PROXIMA, EVM, MUTU, SAFIRA, ENVIRA, KONTRAK","Output ABD-7: analisis Q-C-T+K3 + Early Warning + Confidence%","Klaim EOT & VO berbasis FIDIC Red/Yellow Book","Review NCR, uji beton, insiden K3, dan laporan lingkungan B3"]}
            icon={<Brain className="h-12 w-12 text-indigo-500" />}
          ><BrainProjectChat /></PremiumPageGuard>
        )} />
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
        <Route path="/skk-coach" component={SkkCoachLanding} />
        <Route path="/skk-coach/chat" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="SKK Coach — Sertifikasi Kompetensi Konstruksi"
            description="5 agen spesialis yang memandu perjalanan SKK Konstruksi Anda: cek kelayakan KKNI, pilih jabatan kerja, checklist dokumen, monitoring perpanjangan, dan analisis ketergantungan SKK-SBU."
            highlights={["Cek kelayakan & jabatan kerja KKNI L1-9","Checklist dokumen per skema SKK","Monitoring perpanjangan & re-sertifikasi","Analisis ketergantungan SKK ↔ SBU BUJK"]}
            icon={<Award className="h-12 w-12 text-emerald-500" />}
          ><SkkCoachChat /></PremiumPageGuard>
        )} />
        <Route path="/askom" component={AskomLanding} />
        <Route path="/askom/chat" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="ASKOM AI — Asesor & Lisensi LSP Konstruksi"
            description="8 agen spesialis ASKOM & LSP yang bekerja paralel: metodologi VRFA/CASR, MUK & FR-APL-01, kode etik asesor, evaluasi portofolio, RPL, hingga jalur karier ASKOM Senior."
            highlights={["Metodologi asesmen VRFA, CASR & 5 Dimensi","MUK & FR-APL-01/02 sebagai titik masuk standar","Kode etik & guardrail anti-manipulasi MUK","RPL & evaluasi portofolio kompetensi"]}
            icon={<Shield className="h-12 w-12 text-blue-500" />}
          ><AskomChat /></PremiumPageGuard>
        )} />
        <Route path="/pjbu-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="PJBUClaw — Personel Manajerial BUJK AI"
            description="5 agen spesialis bekerja paralel: panduan PJBU, PJTBU, PJKBU, SIP-PJBU kontraktor, dan SIP-PJBU konsultan — lengkap dengan kompetensi, persyaratan SKK, dan prosedur pendaftaran LPJK."
            highlights={["Panduan PJBU, PJTBU & PJKBU sesuai PP 14/2021","Persyaratan SKK manajerial per kualifikasi BUJK","Prosedur pendaftaran & update SIP LPJK","Panduan PJBU kontraktor & konsultan berbeda"]}
            icon={<Users className="h-12 w-12 text-violet-500" />}
          ><PjbuClawChat /></PremiumPageGuard>
        )} />
        <Route path="/keuangan-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="KeuanganClaw — Analisis Keuangan & Manajerial BUJK AI"
            description="4 agen spesialis bekerja paralel: analisis rasio keuangan BUJK, panduan manager keuangan & KPI, toolkit manajerial (cash flow, anggaran proyek), dan matriks kompetensi & JD tim keuangan."
            highlights={["Analisis rasio keuangan BUJK + PSAK 34 konstruksi","Cash flow proyeksi & working capital management","KPI keuangan & dashboard monitoring proyek","JD & matriks kompetensi tim keuangan"]}
            icon={<TrendingUp className="h-12 w-12 text-emerald-500" />}
          ><KeuanganClawChat /></PremiumPageGuard>
        )} />
        <Route path="/tendera-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="TenderaClaw — AI Tender Multi-Agent BUJK"
            description="10 agen spesialis tender bekerja paralel: pencari tender LPSE/SIRUP, cek kelaikan SBU/SKK, risk scanner SDP, generator 12 dokumen administrasi LKPP, technical proposal, HPS optimizer, FIDIC analyzer, win probability 7-dimensi, anti-suap SMAP, dan sanggah/banding."
            highlights={["Tender Hunter LPSE/SIRUP/INAPROC real-time","Kelaikan SBU·SKK·KBLI — GO/CONDITIONAL/NO-GO","Risk Scanner SDP/RKS/SSKK — Heat-Map prioritas","Win Probability 7-dimensi + Action Levers"]}
            icon={<TrendingUp className="h-12 w-12 text-blue-500" />}
          ><TenderaClawChat /></PremiumPageGuard>
        )} />
        <Route path="/konstra-tender-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="KonstraTenderClaw — Monitor Tender SIRUP/LKPP AI"
            description="4 agen spesialis SIRUP/LKPP bekerja paralel: pencari & ranking tender real-time, cek kecukupan dokumen Perpres 46/2025, kalkulasi probabilitas menang 4-dimensi, dan action plan 7 hari."
            highlights={["Cari & ranking tender SIRUP LKPP real-time","Cek dokumen sesuai Perpres 46/2025","Probabilitas menang scorecard 4-dimensi","Action plan optimal 7 hari siap submit"]}
            icon={<Search className="h-12 w-12 text-green-500" />}
          ><KonstraTenderClawChat /></PremiumPageGuard>
        )} />
        <Route path="/bg-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="BGClaw — Navigator Ruang Lingkup Pekerjaan Bangunan Gedung"
            description="9 spesialis ruang lingkup BG001–BG009 bekerja paralel: panduan lengkap jenis pekerjaan yang tercakup, batasan teknis, irisan antar subklasifikasi, dan KBLI 2020 berdasarkan Permen PU 6/2025."
            highlights={["9 subklasifikasi BG001–BG009 paralel","Ruang lingkup pekerjaan & batas teknis","Irisan & overlap antar subklasifikasi","KBLI 2020 · Permen PU 6/2025"]}
            icon={<Building2 className="h-12 w-12 text-stone-400" />}
          ><BgClawChat /></PremiumPageGuard>
        )} />
        <Route path="/bs-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="BSClaw — Navigator Ruang Lingkup Pekerjaan Bangunan Sipil"
            description="10 spesialis BS001–BS010 bekerja paralel: jalan raya, jembatan, irigasi, drainase, pelabuhan, pipeline, rel kereta, bandara, pembangkit listrik, dan sipil lainnya — berdasarkan Permen PU 6/2025."
            highlights={["10 subklasifikasi BS001–BS010 paralel","Ruang lingkup infrastruktur sipil lengkap","Irisan teknis antar subklasifikasi BS","KBLI 2020 Kelompok 42xxx · Permen PU 6/2025"]}
            icon={<HardHat className="h-12 w-12 text-sky-400" />}
          ><BsClawChat /></PremiumPageGuard>
        )} />
        <Route path="/im-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="IMClaw — Navigator Ruang Lingkup Pekerjaan Instalasi Mekanikal-Elektrikal"
            description="9 spesialis IM001–IM009 bekerja paralel: listrik gedung, HVAC, plambing, proteksi kebakaran, lift, gas, telekomunikasi/IT, mekanikal pabrik, dan panel surya — berdasarkan Permen PU 6/2025."
            highlights={["9 subklasifikasi IM001–IM009 paralel","Ruang lingkup MEP & utiliti gedung lengkap","Irisan teknis antar subklasifikasi IM","KBLI 2020 Kelompok 43xxx · Permen PU 6/2025"]}
            icon={<Wrench className="h-12 w-12 text-emerald-400" />}
          ><ImClawChat /></PremiumPageGuard>
        )} />
        <Route path="/ko-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="KOClaw — Navigator Ruang Lingkup Pekerjaan Konstruksi Spesialis"
            description="8 spesialis KO001–KO008 bekerja paralel: penyiapan lahan, pondasi dalam, baja, finishing, waterproofing, pengeboran, pengaspalan, dan konstruksi khusus — berdasarkan Permen PU 6/2025."
            highlights={["8 subklasifikasi KO001–KO008 paralel","Ruang lingkup konstruksi spesialis/khusus lengkap","Irisan teknis antar subklasifikasi KO","KBLI 2020 Kelompok 43xxx · Permen PU 6/2025"]}
            icon={<HardHat className="h-12 w-12 text-violet-400" />}
          ><KoClawChat /></PremiumPageGuard>
        )} />
        <Route path="/kk-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="KKClaw — Navigator Ruang Lingkup Jasa Konsultansi Konstruksi"
            description="7 spesialis KK001–KK007 bekerja paralel: perencana arsitektur, struktur/sipil, MEP, lingkungan, pengawas & MK, inspeksi teknis, dan PMO/penilaian — berdasarkan Permen PU 6/2025."
            highlights={["7 subklasifikasi KK001–KK007 paralel","Perencana · Pengawas · MK · PMO · Penilaian","Irisan teknis antar subklasifikasi KK","UU 2/2017 · Permen PU 6/2025"]}
            icon={<Scale className="h-12 w-12 text-rose-400" />}
          ><KkClawChat /></PremiumPageGuard>
        )} />
        <Route path="/csms-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="CSMSClaw — Contractor Safety Management System AI"
            description="12 agen spesialis CSMS bekerja paralel: generator Form 1-7, simulator quiz K3L, risk assessment 5×5, pre-qualification 16 elemen, HSE plan, pre-job activity, WIP monitor, permit to work, stop work authority, KPI K3L, dan final evaluation."
            highlights={["Generator Form CSMS 1-7 + Berita Acara SWA & Kick-off","Risk Assessment 5×5 + 4 aspek konsekuensi","Pre-Qualification 16 elemen + scoring 0/1/2","Final Evaluation: KPI×35% + PJA×20% + WIP×45%"]}
            icon={<ShieldAlert className="h-12 w-12 text-amber-500" />}
          ><CsmsClawChat /></PremiumPageGuard>
        )} />
        <Route path="/safira-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="SafiraClaw — SKK K3 Konstruksi Coach AI"
            description="5 agen spesialis SKK K3 bekerja paralel: katalog K3 Umum & Petugas K3, asesmen mandiri K3 Umum, panduan Ahli K3 Konstruksi Muda/Madya/Utama, K3 Spesialis, dan SMK3 & ISO 45001."
            highlights={["Katalog jabatan SKK K3 Konstruksi lengkap (SKKNI 333/2020)","Asesmen mandiri K3 + simulasi wawancara asesor","Panduan Ahli K3 Muda/Madya/Utama + K3 Spesialis","SMK3 PP 50/2012 & ISO 45001:2018 — unit kompetensi lengkap"]}
            icon={<HardHat className="h-12 w-12 text-red-500" />}
          ><SafiraClawChat /></PremiumPageGuard>
        )} />
        <Route path="/smk3-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="SMK3Claw — IMS & SMK3 Terintegrasi AI"
            description="7 agen spesialis bekerja paralel: gap analysis IMS, audit internal, SMK3 PP 50/2012 (166 kriteria), self-assessment, RKK & P2K3, CSMS pre-qualification builder, dan statistik K3."
            highlights={["Gap analysis IMS terintegrasi SMK3 + ISO 45001 + ISO 14001","Self-assessment SMK3 PP 50/2012 — 166 kriteria","Generator RKK & Program P2K3 per proyek","CSMS Pre-Qualification builder + statistik K3"]}
            icon={<HardHat className="h-12 w-12 text-orange-500" />}
          ><Smk3ClawChat /></PremiumPageGuard>
        )} />
        <Route path="/lkut-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="LKUTClaw — Laporan Kegiatan Usaha Tahunan BUJK AI"
            description="4 agen spesialis LKUT bekerja paralel: panduan LKUT kontraktor, LKUT konsultan, penyusunan laporan lengkap, dan analisis keuangan & rasio BUJK."
            highlights={["Panduan LKUT kontraktor & konsultan sesuai PP 14/2021","Generator format LKUT lengkap siap submit OSS","Analisis rasio keuangan BUJK & indikator pelaporan","Timeline & checklist persiapan LKUT tahunan"]}
            icon={<BarChart3 className="h-12 w-12 text-teal-500" />}
          ><LkutClawChat /></PremiumPageGuard>
        )} />
        <Route path="/iso-claw-9001" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="ISOClaw 9001 — Sistem Manajemen Mutu AI"
            description="6 agen spesialis ISO 9001:2015 bekerja paralel: readiness assessment klausul 4-10, peta proses & quality planning, dokumen mutu & RMPK, audit internal, quality KPI, dan persiapan surveillance."
            highlights={["Gap analysis ISO 9001:2015 klausul 4-10 lengkap","Generator Manual Mutu, Kebijakan, & RMPK Konstruksi","Audit internal + CAPA tracker per klausul","Surveillance prep & re-sertifikasi checklist"]}
            icon={<Award className="h-12 w-12 text-blue-500" />}
          ><IsoClaw9001Chat /></PremiumPageGuard>
        )} />
        <Route path="/iso-claw-14001" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="ISOClaw 14001 — Sistem Manajemen Lingkungan AI"
            description="6 agen spesialis ISO 14001:2015 bekerja paralel: readiness assessment, identifikasi aspek & dampak lingkungan (debu, B3, kebisingan, run-off), dokumen lingkungan, audit internal, env KPI, dan surveillance."
            highlights={["Identifikasi aspek & dampak lingkungan konstruksi","Pengelolaan B3, limbah, dan run-off proyek","Audit internal ISO 14001 klausul 4-10","Env KPI monitoring + surveillance & re-sertifikasi"]}
            icon={<Leaf className="h-12 w-12 text-green-500" />}
          ><IsoClaw14001Chat /></PremiumPageGuard>
        )} />
        <Route path="/smap-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="SMAPClaw — Sistem Manajemen Anti Penyuapan AI"
            description="8 agen spesialis ISO 37001 bekerja paralel: edukasi klausul, gap analysis 4-10, generator kebijakan & SK FKAP, due diligence mitra, bribery risk register, konsultasi kasus gratifikasi, whistleblowing, dan persiapan sertifikasi."
            highlights={["Gap analysis ISO 37001 klausul 4-10 lengkap","Generator kebijakan anti-penyuapan & SK FKAP","Bribery Risk Register P1-P10 untuk proyek konstruksi","Whistleblowing intake dengan kerahasiaan absolut"]}
            icon={<Shield className="h-12 w-12 text-emerald-500" />}
          ><SmapClawChat /></PremiumPageGuard>
        )} />
        <Route path="/pancek-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="PanCEKClaw — Panduan Cegah Korupsi KPK AI"
            description="5 agen spesialis PanCEK KPK bekerja paralel: edukasi 5 pilar, self-assessment 45 kriteria & Indeks Integritas Korporasi, generator 79 indikator JAGA.id, corporate defense Perma 13/2016, dan triple mapping PanCEK ↔ ISO 37001 ↔ UU Tipikor."
            highlights={["Self-assessment 5 Pilar × 45 Kriteria + Indeks IIK","Generator 79 Indikator JAGA.id KPK (6 seksi K/P/D/C/A/R)","Corporate defense dossier Perma 13/2016 Pasal 4(2)","Triple mapping PanCEK ↔ ISO 37001 ↔ UU Tipikor"]}
            icon={<Shield className="h-12 w-12 text-red-500" />}
          ><PancekClawChat /></PremiumPageGuard>
        )} />
        <Route path="/konstra-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="KonstraClaw — Manajemen Proyek Konstruksi AI"
            description="9 agen spesialis manajemen konstruksi bekerja paralel: PM & penjadwalan, teknik & shop drawing, kontrak FIDIC & klaim, K3 & SMK3, mutu & ISO 9001, lingkungan & ISO 14001, peralatan & OEE, supply chain & subkon, dan keuangan proyek PSAK34."
            highlights={["WBS, CPM & schedule recovery proyek konstruksi","Variasi & klaim FIDIC — EOT, VO, loss & expense","OEE alat berat + pengadaan material & subkontraktor","EVM: SPI, CPI, EAC, TCPI + laporan keuangan PSAK34"]}
            icon={<Building2 className="h-12 w-12 text-slate-400" />}
          ><KonstraClawChat /></PremiumPageGuard>
        )} />
        <Route path="/brain-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="BrainClaw — Project Intelligence AI"
            description="6 agen spesialis project intelligence bekerja paralel: project manager & control, earned value management, mutu proyek, K3 lapangan, manajemen lingkungan, dan analisis klaim kontrak."
            highlights={["EVM lengkap: SPI, CPI, EAC, TCPI, VAC per paket","Laporan proyek terpadu: fisik, biaya, K3, mutu, kontrak","Early warning dashboard & action plan 90 hari","Analisis klaim & posisi negosiasi kontrak"]}
            icon={<Brain className="h-12 w-12 text-cyan-400" />}
          ><BrainClawChat /></PremiumPageGuard>
        )} />
        <Route path="/educounsel-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="EducounselClaw — AI Konseling Akademik Sekolah"
            description="11 agen spesialis konseling akademik bekerja paralel: safety gate & eskalasi krisis, profil siswa, analitik akademik, mini-test diagnostik, intervensi 14 hari, study habit coach, jalur PTN, beasiswa luar negeri, komunikasi orang tua, dokumentasi BK, dan matching eskul & portfolio."
            highlights={["Analisis akademik Hijau/Kuning/Merah + intervensi 14-hari","Jalur PTN (SNBT/SNBP) & beasiswa universitas luar negeri","Safety gate krisis + eskalasi ke psikolog sekolah","Laporan BK format DAP & matching 21 eskul + portfolio"]}
            icon={<GraduationCap className="h-12 w-12 text-teal-400" />}
          ><EducounselClawChat /></PremiumPageGuard>
        )} />
        <Route path="/ibtu-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="IBTUClaw — IB Testing Unit AI"
            description="7 agen spesialis IB Testing Unit bekerja paralel: registrar (pendaftaran siswa), sentinel (jadwal & deadline), IAA (internal assessment & integritas akademik), pengawas ujian, manajemen exam IB, komunikasi resmi, dan audit dokumen kepatuhan IBO."
            highlights={["Registrasi & eligibilitas IB DP / MYP / PYP","Jadwal ujian, mock exam & deadline TOK/EE/CAS","Audit dokumen & kepatuhan regulasi IBO","Strategi skor 38+ IB untuk kampus internasional"]}
            icon={<GraduationCap className="h-12 w-12 text-indigo-400" />}
          ><IBTUClawChat /></PremiumPageGuard>
        )} />
        <Route path="/migas-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="MigasClaw — Kompetensi & Perizinan Energi AI"
            description="9 agen spesialis energi bekerja paralel: sertifikasi BUJKM & CSMS SKK Migas, kompetensi teknis Migas (well control & inspeksi), PLTS & BESS (solar & storage), EBT lain (PLTB/PLTP/biomassa), IUP/IUPK Minerba, K3 tambang, gap analysis SKKNI, studi kasus lapangan, dan panduan LSP."
            highlights={["BUJKM & CSMS SKK Migas — dokumen K3LL & pengajuan","IUP/IUPK Minerba — OSS-RBA, CNC, UU Minerba 3/2020","Sertifikasi SKKNI EBT: PLTS/BESS, PLTB, PLTP, biomassa","Gap analysis → rekomendasi jalur LSP Migas/ESDM"]}
            icon={<Zap className="h-12 w-12 text-orange-400" />}
          ><MigasClawChat /></PremiumPageGuard>
        )} />
        <Route path="/dev-properti-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="DevPropertiClaw — AI Developer Real Estate"
            description="10 agen spesialis developer properti bekerja paralel: informasi & master plan proyek, tipe unit & spesifikasi, harga & promo, proses booking & PPJB, simulasi KPR & pembiayaan, legalitas SHM/HGB/PBG, site visit, serah terima & garansi, kerja sama agen, dan FAQ due diligence."
            highlights={["Materi pemasaran: USP, pricing, skrip sales tim lapangan","Legalitas SHM/HGB/PBG — BPHTB, PPh, balik nama","Simulasi KPR & panduan pembiayaan bank rekanan","Program agen & co-marketing — struktur komisi & onboarding"]}
            icon={<Building2 className="h-12 w-12 text-violet-400" />}
          ><DevPropertiClawChat /></PremiumPageGuard>
        )} />
        <Route path="/estate-care-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="EstateCareClaw — AI Konsultan Properti Konsumen"
            description="10 agen spesialis properti konsumen bekerja paralel: panduan cari properti, panduan beli step-by-step, strategi jual & listing, proses closing & PPJB, panduan sewa, kontrak sewa, estimasi harga awal, strategi investasi & rental yield, biaya transaksi, dan glossary properti."
            highlights={["Due diligence sertifikat & legalitas — AJB, PPAT, SHM/HGB","Estimasi pajak penjual: BPHTB, PPh final 2,5%, biaya notaris","Analisis rental yield, ROI, & strategi investasi properti","Hak penyewa vs pemilik — klausul kontrak sewa & sengketa"]}
            icon={<Search className="h-12 w-12 text-emerald-400" />}
          ><EstateCareClaw /></PremiumPageGuard>
        )} />
        <Route path="/skema-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="SkemaClaw — Konsultan Cerdas Sertifikasi BUJK"
            description="9 spesialis regulasi bekerja paralel: kerangka hukum Permen PU 6/2025, kualifikasi & 4 kriteria penilaian, kemampuan keuangan & audit KAP, tenaga kerja konstruksi (PJBU/PJTBU/PJKBU), peralatan & SIMPK, alur sertifikasi LSBU 10 tahap, konversi 349K SBU & KBLI 2025, sistem informasi SIJKT, dan kewajiban BUJK & sanksi administratif."
            highlights={["Konversi 349.239 SBU — peta jalan KBLI 2020 ke KBLI 2025","4 Kriteria Penilaian Kumulatif — K1/K2/K3/Menengah/Besar","Alur sertifikasi LSBU 10 tahap — PKS, surveilans, QR Code SBU","Mode: Konsultasi · Audit · Simulasi · Ujian · Debat · Strategis"]}
            icon={<Scale className="h-12 w-12 text-blue-400" />}
          ><SkemaClawChat /></PremiumPageGuard>
        )} />
        <Route path="/panduan-sbu" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="PanduanSBU — Tanya Jawab Sertifikasi BUJK"
            description="Chatbot ramah untuk semua kalangan — tanya apa saja tentang SBU, kualifikasi perusahaan konstruksi, syarat dokumen, konversi KBLI 2025, dan aturan Permen PU 6/2025. Dijawab langsung, jelas, dan mudah dipahami."
            highlights={["Jawaban langsung tanpa format akademis","Bahasa sederhana — cocok untuk pemilik BUJK & masyarakat umum","Cakupan: SBU, kualifikasi, dokumen, konversi, sanksi, SIJKT","Berbasis Permen PU 6/2025 & materi workshop resmi LPJK"]}
            icon={<BookOpen className="h-12 w-12 text-emerald-400" />}
          ><PanduanSBUChat /></PremiumPageGuard>
        )} />
        <Route path="/abu-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="Konsultan ABU & LSBU — Asesmen Badan Usaha Konstruksi"
            description="8 agen spesialis untuk Asesor Badan Usaha (ABU) dan pengelola LSBU — audit lapangan, penilaian kesesuaian, manajemen asesor, surveilans, banding BUJK, hingga audit LPJK. Adaptif per level karier, koreksi aktif prosedur keliru."
            highlights={["Panduan teknis ABU: peran, kualifikasi & kewenangan asesor BU","Audit lapangan & penilaian kesesuaian BUJK berbasis Permen PU 6/2025","Manajemen asesor, surveilans, banding & penanganan sengketa BUJK","Audit LPJK & perpanjangan lisensi LSBU — tata kelola kelembagaan"]}
            icon={<Landmark className="h-12 w-12 text-slate-400" />}
          ><AbuClawChat /></PremiumPageGuard>
        )} />
        <Route path="/panduan-askom" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="PanduanASKOM — Tanya Jawab Uji Kompetensi SKK"
            description="Chatbot informasi tentang Asesor Kompetensi (ASKOM) dan proses uji kompetensi SKK untuk masyarakat umum. Tanya apa saja: syarat peserta, alur uji, RPL, biaya, hak banding — dijawab langsung, bahasa sederhana."
            highlights={["Apa itu ASKOM & bagaimana proses uji kompetensi SKK","Syarat peserta uji, APL-01/02, dan dokumen yang dibutuhkan","RPL: pengakuan pengalaman kerja tanpa uji ulang","Hak asesi: banding, keberatan, perlindungan data"]}
            icon={<GraduationCap className="h-12 w-12 text-teal-400" />}
          ><PanduanAskomChat /></PremiumPageGuard>
        )} />
        <Route path="/sipil-claw" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="SipilClaw — AI Konsultan Teknik Sipil"
            description="MultiClaw AI dengan 7 spesialis paralel: Struktur, Geoteknik, Jalan, Jembatan, SDA, Material, dan Metode Pelaksanaan. Diskusi teknis mendalam — perhitungan, desain, analisis, berbasis SNI, AASHTO, dan Bina Marga."
            highlights={["Analisis & desain struktur beton/baja berbasis SNI 2847/1729/1726","Geoteknik: kapasitas fondasi, stabilitas lereng, perbaikan tanah","Perkerasan jalan (Bina Marga), jembatan (SNI 1725), hidrologi & SDA","Material & QC lapangan, metode pelaksanaan & K3 konstruksi"]}
            icon={<HardHat className="h-12 w-12 text-blue-400" />}
          ><SipilClawChat /></PremiumPageGuard>
        )} />
        <Route path="/scope-sipil" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="ScopeSipil — Ruang Lingkup SKK Klasifikasi Sipil"
            description="Konsultan ruang lingkup pekerjaan per jabatan kerja SKK Sipil: Gedung, Jalan, Jembatan, SDA, Geoteknik, Terowongan, dan lainnya. Tanya apa yang bisa dikerjakan per jenjang — dari Operator sampai Ahli Utama."
            highlights={["Ruang lingkup per jabatan kerja SKK Sipil (Operator, Teknisi, Ahli)","Batas kewenangan & jenis proyek per jenjang KKNI 2–9","Perbandingan jenjang Muda vs Madya vs Utama per subklasifikasi","Acuan SK Dirjen Bina Konstruksi No. 114/KPTS/Dk/2024"]}
            icon={<HardHat className="h-12 w-12 text-blue-400" />}
          ><ScopeSipilChat /></PremiumPageGuard>
        )} />
        <Route path="/scope-manpel" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="ScopeManpel — Ruang Lingkup SKK Manajemen Pelaksanaan"
            description="Konsultan ruang lingkup pekerjaan per jabatan kerja SKK Manajemen Pelaksanaan: PM, Pelaksana, Pengawas, K3 Konstruksi, dan Manajemen Mutu. Tanya posisi apa yang bisa dijabat dan proyek apa yang bisa dipimpin."
            highlights={["Ruang lingkup PM, Pelaksana & Pengawas per jenjang KKNI","Kewenangan Ahli Muda vs Madya Manajemen Proyek di lapangan","Lingkup K3 Konstruksi: dari RK3K sampai SMKK","Posisi struktural yang bisa dijabat per jabatan kerja"]}
            icon={<Award className="h-12 w-12 text-indigo-400" />}
          ><ScopeManpelChat /></PremiumPageGuard>
        )} />
        <Route path="/scope-mekanikal" component={() => (
          <PremiumPageGuard
            feature="advanced_ai_tools" requiredPlan="profesional"
            title="ScopeMekanikal — Ruang Lingkup SKK Mekanikal"
            description="Konsultan ruang lingkup pekerjaan per jabatan kerja SKK Mekanikal: HVAC & Tata Udara, Plumbing & Pompa, Pemadam Kebakaran, Elevator & Eskalator, hingga Mekanikal Industri. Tanya sistem apa yang boleh dirancang & dipasang per jenjang."
            highlights={["Ruang lingkup HVAC, Plumbing, Fire Protection & Elevator per jenjang","Sistem apa yang boleh dirancang Ahli Muda vs Ahli Madya Mekanikal","Perbedaan kewenangan Teknisi vs Ahli untuk setiap subklasifikasi","Standar acuan: ASHRAE, NFPA, SNI & SK Dirjen 114/2024"]}
            icon={<Wrench className="h-12 w-12 text-amber-400" />}
          ><ScopeMekanikalChat /></PremiumPageGuard>
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
