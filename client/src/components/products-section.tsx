import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { Product } from "@shared/schema";

import productImage1 from "@assets/stock_images/luxury_professional__1ebcb013.jpg";
import productImage2 from "@assets/stock_images/luxury_professional__a49a6ff1.jpg";
import productImage3 from "@assets/stock_images/luxury_professional__d85d0739.jpg";

const featuredProducts: Partial<Product>[] = [
  {
    id: "1",
    name: "Shampoo Reparador",
    description: "Limpeza profunda com tecnologia de reconstrução molecular para cabelos danificados.",
    category: "Tratamento",
    price: 8900,
    image: productImage1,
    benefits: ["Reconstrução molecular", "Limpeza profunda", "Hidratação intensa"],
  },
  {
    id: "2",
    name: "Máscara Nutritiva",
    description: "Tratamento intensivo com queratina hidrolisada e óleos essenciais.",
    category: "Hidratação",
    price: 12900,
    image: productImage2,
    benefits: ["Nutrição profunda", "Brilho intenso", "Maciez prolongada"],
  },
  {
    id: "3",
    name: "Sérum Finalizador",
    description: "Proteção térmica e controle do frizz com tecnologia anti-quebra.",
    category: "Finalização",
    price: 7500,
    image: productImage3,
    benefits: ["Proteção térmica", "Anti-frizz", "Brilho natural"],
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price / 100);
}

interface ProductCardProps {
  product: Partial<Product>;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  return (
    <Card className="group overflow-visible border-0 bg-card hover-elevate" data-testid={`card-product-${product.id}`}>
      <div className="aspect-square overflow-hidden bg-muted rounded-t-md">
        <img
          src={product.image}
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
          <span className="font-semibold text-lg">
            {formatPrice(product.price || 0)}
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

export function ProductsSection() {
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
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
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
