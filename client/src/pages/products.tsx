import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Check } from "lucide-react";
import type { Product } from "@shared/schema";

import productImage1 from "@assets/stock_images/luxury_professional__1ebcb013.jpg";
import productImage2 from "@assets/stock_images/luxury_professional__a49a6ff1.jpg";
import productImage3 from "@assets/stock_images/luxury_professional__d85d0739.jpg";

const categories = [
  { id: "all", name: "Todos" },
  { id: "tratamento", name: "Tratamento" },
  { id: "hidratacao", name: "Hidratação" },
  { id: "finalizacao", name: "Finalização" },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price / 100);
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

function ProductCard({ product }: { product: Product }) {
  const images: Record<string, string> = {
    "1": productImage1,
    "2": productImage2,
    "3": productImage3,
    "4": productImage1,
    "5": productImage2,
    "6": productImage3,
  };

  return (
    <Card 
      className="group overflow-visible border-0 bg-card hover-elevate"
      data-testid={`card-product-${product.id}`}
    >
      <div className="aspect-square overflow-hidden bg-muted relative rounded-t-md">
        <img
          src={images[product.id] || productImage1}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
            Destaque
          </Badge>
        )}
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
        
        {product.benefits && product.benefits.length > 0 && (
          <ul className="space-y-1 mb-4">
            {product.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3 w-3 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="font-semibold text-lg">
            {formatPrice(product.price)}
          </span>
          <Button variant="ghost" size="sm" className="group/btn" data-testid={`button-product-details-${product.id}`}>
            Detalhes
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter(
    (product) =>
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory
  );

  return (
    <main className="pt-20 md:pt-24">
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              Catálogo
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6">
              Nossos Produtos
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Linha completa de cuidados capilares profissionais desenvolvida com 
              tecnologia de ponta e ingredientes premium.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`button-category-${category.id}`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-16" data-testid="text-products-error">
              <p className="text-muted-foreground text-lg">
                Erro ao carregar produtos. Tente novamente mais tarde.
              </p>
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16" data-testid="text-products-empty">
              <p className="text-muted-foreground text-lg">
                Nenhum produto encontrado nesta categoria.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
