import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Bot, BookOpen, BarChart3, LogIn, LogOut, Menu, CreditCard, LayoutDashboard } from "lucide-react";

interface SharedHeaderProps {
  transparent?: boolean;
}

export function SharedHeader({ transparent }: SharedHeaderProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/documentation", label: "Dokumentasi", icon: BookOpen },
    { href: "/pricing", label: "Harga", icon: BarChart3 },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className={`sticky top-0 z-50 border-b ${transparent ? "bg-background/80" : "bg-background/95"} backdrop-blur`}>
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
            <Bot className="h-7 w-7 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-xl font-bold">Gustafta</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
                data-testid={`button-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
          {isAuthenticated && (
            <Link href="/subscription">
              <Button
                variant={isActive("/subscription") ? "secondary" : "ghost"}
                data-testid="button-nav-subscription"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Langganan
              </Button>
            </Link>
          )}
          <ThemeToggle />
          {isLoading ? (
            <Button disabled>Loading...</Button>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button data-testid="button-go-dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
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
            <a href="/api/login">
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
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full" data-testid="mobile-button-dashboard">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
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
                    <a href="/api/login">
                      <Button className="w-full gap-2" data-testid="mobile-button-login">
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
