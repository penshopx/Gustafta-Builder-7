import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { useMetaPixel } from "@/hooks/use-meta-pixel";
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
import NotFound from "@/pages/not-found";
import { ChaesaWidget } from "@/components/chaesa-widget";
import { MultiClawProvider } from "@/contexts/multiclaw-context";

const WIDGET_EXCLUDED_PATHS = ["/legal", "/embed/"];

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/marketplace" component={Marketplace} />
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
