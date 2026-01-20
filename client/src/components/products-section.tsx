import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { Product } from "@shared/schema";

import productImage1 from "@assets/stock_images/luxury_professional__1ebcb013.jpg";
import productImage2 from "@assets/stock_images/luxury_professional__a49a6ff1.jpg";
import productImage3 from "@assets/stock_images/luxury_professional__d85d0739.jpg";

const defaultImages = [productImage1, productImage2, productImage3];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price / 100);
}

interface ProductCardProps {
  product: Product;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const isValidUrl = product.image?.startsWith("http");
  const imageUrl = isValidUrl ? product.image : defaultImages[index % defaultImages.length];

  return (
    <Card className="group overflow-visible border-0 bg-card hover-elevate" data-testid={`card-product-${product.id}`}>
      <div className="aspect-square overflow-hidden bg-muted rounded-t-md">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <span className="text-xs font-medium text-primary uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="font-serif text-xl font-medium mt-2 mb-2">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          {product.showPrice && product.price ? (
            <span className="font-semibold text-lg">
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">Consulte</span>
          )}
          <Button variant="ghost" size="sm" className="group/btn" data-testid={`button-product-details-${product.id}`}>
            Detalhes
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-card">
      <Skeleton className="aspect-square" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center pt-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </Card>
  );
}

export function ProductsSection() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products?.filter(p => p.featured)?.slice(0, 3) || [];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Nossa Linha
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6">
            Produtos em Destaque
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Desenvolvidos com tecnologia de ponta e ingredientes selecionados para 
            proporcionar resultados profissionais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            products?.slice(0, 3).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/produtos">
            <Button size="lg" variant="outline" data-testid="button-ver-todos-produtos">
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
