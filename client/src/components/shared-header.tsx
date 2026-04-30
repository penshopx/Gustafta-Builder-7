import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Bot, BookOpen, BarChart3, LogIn, LogOut, Menu, CreditCard, LayoutDashboard, ShoppingBag, Smartphone, Package, Shield, Crown, User } from "lucide-react";

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
    { href: "/packs", label: "Paket Domain", icon: Package },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { href: "/documentation", label: "Dokumentasi", icon: BookOpen },
    { href: "/pricing", label: "Harga", icon: BarChart3 },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className={`sticky top-0 z-50 border-b ${transparent ? "bg-background/80" : "bg-background/95"} backdrop-blur`}>
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Bot className="h-7 w-7 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-xl font-bold">Gustafta</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
              >
                {item.label}
              </Button>
            </Link>
          ))}
          {isAuthenticated && (
            <Link href="/subscription">
              <Button
                variant={isActive("/subscription") ? "secondary" : "ghost"}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Langganan
              </Button>
            </Link>
          )}
          <PWAInstallButton />
          <ThemeToggle />
          {isLoading ? (
            <Button disabled>Loading...</Button>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              {adminData?.isAdmin && (
                <Link href="/admin">
                  <Button
                    variant="outline" size="sm"
                    className={`gap-1 ${adminData.isSuperAdmin ? "border-purple-400 text-purple-600 dark:text-purple-400" : "border-primary/40 text-primary"}`}
                    data-testid="button-admin-link"
                  >
                    {adminData.isSuperAdmin ? <Crown className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                    {adminData.isSuperAdmin ? "Super Admin" : "Admin"}
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/account" title="Akun Saya">
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/40 transition-all" data-testid="avatar-account-link">
                  <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                  <AvatarFallback>{user?.firstName?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Link>
              <a href="/api/logout">
                <Button variant="ghost" size="icon" title="Keluar">
                  <LogOut className="h-4 w-4" />
                </Button>
              </a>
            </div>
          ) : (
            <a href="/api/login">
              <Button className="gap-2">
                <LogIn className="h-4 w-4" />
                Masuk
              </Button>
            </a>
          )}
        </div>

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
                  <Link href="/subscription" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive("/subscription") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Langganan
                    </Button>
                  </Link>
                )}
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
    </header>
  );
}
