import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SharedHeader } from "@/components/shared-header";
import {
  ShoppingBag,
  Search,
  Bot,
  Star,
  ArrowRight,
  Zap,
  MessageSquare,
  Check,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  avatar: string;
  tagline: string;
  category: string;
  productSlug: string;
  productSummary: string;
  productFeatures: string[];
  monthlyPrice: number;
  trialEnabled: boolean;
  trialDays: number;
  greetingMessage: string;
  brandingName: string;
  brandingLogo: string;
}

function formatPrice(amount: number): string {
  if (amount === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function ProductCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="space-y-2 mb-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-marketplace-title">
                Marketplace Chatbot
              </h1>
            </div>
            <p className="text-muted-foreground text-lg" data-testid="text-marketplace-subtitle">
              Temukan chatbot AI yang tepat untuk kebutuhan Anda
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="relative max-w-md mx-auto w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari chatbot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-products"
              />
            </div>

            {categories.length > 0 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  data-testid="button-category-all"
                >
                  Semua
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16" data-testid="text-empty-state">
              <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Belum ada produk chatbot yang tersedia
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory !== "all"
                  ? "Coba ubah filter pencarian Anda"
                  : "Produk chatbot akan segera hadir"}
              </p>
              <Link href="/">
                <Button variant="outline" data-testid="button-back-home">
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="flex flex-col hover-elevate"
                  data-testid={`card-product-${product.id}`}
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage
                          src={product.avatar || product.brandingLogo || ""}
                          alt={product.name}
                        />
                        <AvatarFallback>
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="font-semibold truncate"
                          data-testid={`text-product-name-${product.id}`}
                        >
                          {product.brandingName || product.name}
                        </h3>
                        {product.category && (
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p
                      className="text-sm text-muted-foreground mb-4 line-clamp-2"
                      data-testid={`text-product-tagline-${product.id}`}
                    >
                      {product.tagline || product.productSummary || product.description}
                    </p>

                    {Array.isArray(product.productFeatures) &&
                      product.productFeatures.length > 0 && (
                        <ul className="space-y-1.5 mb-4 flex-1">
                          {product.productFeatures.slice(0, 4).map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                    <div className="mt-auto pt-4 border-t flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold text-lg"
                          data-testid={`text-product-price-${product.id}`}
                        >
                          {formatPrice(product.monthlyPrice || 0)}
                        </span>
                        {product.monthlyPrice > 0 && (
                          <span className="text-xs text-muted-foreground">/bulan</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {product.trialEnabled && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                            data-testid={`badge-trial-${product.id}`}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Trial {product.trialDays} hari
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Link href={`/chat/${product.id}`}>
                      <Button
                        className="w-full mt-4"
                        data-testid={`button-try-product-${product.id}`}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {product.monthlyPrice === 0 ? "Mulai" : "Coba Sekarang"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
