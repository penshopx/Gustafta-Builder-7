import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Bot, BookOpen, BarChart3, LogIn, LogOut, Menu, CreditCard, LayoutDashboard, ShoppingBag, Smartphone, Package, Shield, Crown, User, Store, Rocket, TrendingUp, MessageCircle, GraduationCap, Sparkles } from "lucide-react";

const WA_NUMBERS = [
  { display: "081287941900", link: "6281287941900" },
  { display: "082299417818", link: "6282299417818" },
];

interface SharedHeaderProps {
  transparent?: boolean;
}

function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(() => window.__pwaInstallPrompt || null);
  const [installed, setInstalled] = useState(() => window.__pwaInstalled || false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const installedHandler = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);
    if (window.__pwaInstallPrompt && !deferredPrompt) {
      setDeferredPrompt(window.__pwaInstallPrompt);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  if (installed || isStandalone) return null;
  if (!deferredPrompt && !isIOS) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        window.__pwaInstalled = true;
      }
      setDeferredPrompt(null);
      window.__pwaInstallPrompt = undefined;
    } else if (isIOS) {
      setShowIOSGuide(prev => !prev);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={handleInstall}
        className="gap-1.5 text-xs"
        data-testid="button-pwa-install"
      >
        <Smartphone className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </Button>
      {showIOSGuide && (
        <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-popover border rounded-lg shadow-lg z-50 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Install di iPhone/iPad:</p>
          <p>1. Tap tombol Share <span className="font-mono">⬆</span> di Safari</p>
          <p>2. Pilih "Add to Home Screen"</p>
          <p>3. Tap "Add" di pojok kanan atas</p>
        </div>
      )}
    </div>
  );
}

function ContactTopBar() {
  return (
    <div className="hidden md:flex bg-muted/60 border-b text-xs text-muted-foreground px-4 py-1.5 items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 font-medium text-foreground/70">
          <Smartphone className="h-3 w-3" /> Hubungi Kami:
        </span>
        {WA_NUMBERS.map((n) => (
          <a
            key={n.link}
            href={`https://wa.me/${n.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium"
            data-testid={`link-topbar-wa-${n.link}`}
          >
            <MessageCircle className="h-3 w-3 text-green-500" />
            {n.display}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CreditCard className="h-3 w-3" />
        <span>Pembayaran aman via <strong className="text-foreground/70">Scalev.id</strong> — Pembayaran Terverifikasi</span>
      </div>
    </div>
  );
}

export function SharedHeader({ transparent }: SharedHeaderProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const { data: adminData } = useQuery<{ isAdmin: boolean; isSuperAdmin: boolean; role: string }>({
    queryKey: ["/api/admin/me"],
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const navItems = [
    { href: "/platform", label: "Paket Bisnis AI", icon: TrendingUp },
    { href: "/packs", label: "Paket Series Modul", icon: Package },
    { href: "/store", label: "Store", icon: ShoppingBag },
    { href: "/lms", label: "Learning Center", icon: GraduationCap },
    { href: "/tutor-builder", label: "Rakit Tim Agen — Trilogi", icon: Sparkles },
    { href: "/pricing", label: "Paket Berlangganan", icon: BarChart3 },
    { href: "/panduan", label: "Panduan", icon: BookOpen },
  ];

  const isActive = (href: string) => location === href;

  return (
    <div className="sticky top-0 z-50">
      <ContactTopBar />
      <header className={`border-b ${transparent ? "bg-background/80" : "bg-background/95"} backdrop-blur`}>

        {/* ── Baris 1: Logo + Aksi Kanan ── */}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer shrink-0">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold tracking-tight">Gustafta</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">AI Builder</span>
              </div>
            </div>
          </Link>

          {/* Aksi kanan — desktop */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <PWAInstallButton />
            <ThemeToggle />
            {isLoading ? (
              <Button disabled size="sm">Loading...</Button>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                {adminData?.isAdmin && (
                  <Link href="/admin">
                    <Button
                      variant="outline" size="sm"
                      className={`gap-1 text-xs h-8 ${adminData.isSuperAdmin ? "border-purple-400 text-purple-600 dark:text-purple-400" : "border-primary/40 text-primary"}`}
                      data-testid="button-admin-link"
                    >
                      {adminData.isSuperAdmin ? <Crown className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                      {adminData.isSuperAdmin ? "Super Admin" : "Admin"}
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button size="sm" className="gap-1.5 text-xs h-8">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/account" title="Akun Saya">
                  <Avatar className="h-7 w-7 cursor-pointer ring-2 ring-transparent hover:ring-primary/40 transition-all" data-testid="avatar-account-link">
                    <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                    <AvatarFallback className="text-xs">{user?.firstName?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Link>
                <a href="/api/logout">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Keluar">
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            ) : (
              <a href="/api/login">
                <Button size="sm" className="gap-1.5 text-xs h-8">
                  <LogIn className="h-3.5 w-3.5" />
                  Masuk
                </Button>
              </a>
            )}
          </div>

          {/* Aksi kanan — mobile */}
          <div className="flex md:hidden items-center gap-2">
            <PWAInstallButton />
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex items-center gap-2 mb-6">
                  <Bot className="h-6 w-6 text-primary" />
                  <span className="font-bold">Gustafta</span>
                </div>
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={isActive(item.href) ? "secondary" : "ghost"}
                        className="w-full justify-start"
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <Link href="/my-subscription" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={isActive("/my-subscription") || isActive("/subscription") ? "secondary" : "ghost"}
                        className="w-full justify-start"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Paket Saya
                      </Button>
                    </Link>
                  )}
                  <div className="border-t pt-3 mt-1">
                    <Link href="/documentation" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Dokumentasi
                      </Button>
                    </Link>
                  </div>
                  <div className="border-t pt-4 mt-2">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        {adminData?.isAdmin && (
                          <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                            <Button
                              variant="outline"
                              className={`w-full gap-2 ${adminData.isSuperAdmin ? "border-purple-400 text-purple-600 dark:text-purple-400" : "border-primary/40 text-primary"}`}
                              data-testid="button-admin-mobile"
                            >
                              {adminData.isSuperAdmin ? <Crown className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                              {adminData.isSuperAdmin ? "Super Admin Panel" : "Admin Panel"}
                            </Button>
                          </Link>
                        )}
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full gap-2" data-testid="button-account-mobile">
                            <User className="h-4 w-4" />
                            Akun Saya
                          </Button>
                        </Link>
                        <a href="/api/logout">
                          <Button variant="outline" className="w-full gap-2">
                            <LogOut className="h-4 w-4" />
                            Keluar
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <a href="/api/login">
                        <Button className="w-full gap-2">
                          <LogIn className="h-4 w-4" />
                          Masuk
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* ── Baris 2: Nav — desktop only ── */}
        <nav className="hidden md:flex items-center justify-center gap-0.5 border-t border-border/50 h-10 overflow-x-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
                size="sm"
                className="text-xs px-3 h-8 font-medium"
              >
                {item.label}
              </Button>
            </Link>
          ))}
          {isAuthenticated && (
            <Link href="/my-subscription">
              <Button
                variant={isActive("/my-subscription") || isActive("/subscription") ? "secondary" : "ghost"}
                size="sm"
                className="text-xs px-3 h-8 font-medium"
              >
                <Crown className="h-3.5 w-3.5 mr-1" />
                Paket Saya
              </Button>
            </Link>
          )}
        </nav>

      </header>
    </div>
  );
}
