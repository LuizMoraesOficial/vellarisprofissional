import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, Sparkles, Check } from "lucide-react";
import type { Product } from "@shared/schema";

import productImage1 from "@assets/stock_images/luxury_professional__1ebcb013.jpg";
import productImage2 from "@assets/stock_images/luxury_professional__a49a6ff1.jpg";
import productImage3 from "@assets/stock_images/luxury_professional__d85d0739.jpg";
import heroImage1 from "@assets/stock_images/beautiful_woman_long_18c873be.jpg";
import heroImage2 from "@assets/stock_images/beautiful_woman_long_552a8cae.jpg";
import heroImage3 from "@assets/stock_images/woman_beautiful_curl_16f98399.jpg";

const defaultProductImages = [productImage1, productImage2, productImage3];

const lineInfo: Record<string, { 
  name: string; 
  description: string; 
  longDescription: string;
  color: string; 
  bgColor: string; 
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  heroImage: string;
  accentColor: string;
}> = {
  "fiber-force": {
    name: "Fiber Force",
    description: "Linha de reconstrução profissional para cabelos danificados e quebradiços",
    longDescription: "Tecnologia avançada de reconstrução que penetra na fibra capilar, restaurando a força e elasticidade dos fios. Ideal para cabelos que passaram por processos químicos intensos.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    gradientFrom: "from-orange-600",
    gradientTo: "to-amber-500",
    heroImage: heroImage1,
    accentColor: "#f97316",
  },
  "hydra-balance": {
    name: "Hydra Balance",
    description: "Linha de hidratação profunda para cabelos secos e ressecados",
    longDescription: "Fórmula exclusiva com ácido hialurônico e pantenol que proporciona hidratação profunda e duradoura, devolvendo a maciez e o brilho natural dos fios.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    gradientFrom: "from-purple-600",
    gradientTo: "to-violet-500",
    heroImage: heroImage2,
    accentColor: "#a855f7",
  },
  "nutri-oil": {
    name: "Nutri Oil",
    description: "Linha de nutrição e brilho para cabelos opacos e sem vida",
    longDescription: "Blend exclusivo de óleos essenciais como argan, macadâmia e pracaxi que nutre profundamente os fios, proporcionando brilho extraordinário e proteção contra danos externos.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-amber-400",
    heroImage: heroImage3,
    accentColor: "#ca8a04",
  },
};

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-64" />
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function LineProducts() {
  const [, params] = useRoute("/linha/:line");
  const line = params?.line || "";

  const info = lineInfo[line] || {
    name: "Linha",
    description: "Produtos da linha",
    longDescription: "",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    gradientFrom: "from-primary",
    gradientTo: "to-primary",
    heroImage: heroImage1,
    accentColor: "#D4AF37",
  };

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { line }],
    queryFn: async () => {
      const res = await fetch(`/api/products?line=${line}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: !!line,
  });

  const getProductImage = (product: Product, index: number) => {
    if (product.image?.startsWith("http")) {
      return product.image;
    }
    return defaultProductImages[index % defaultProductImages.length];
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={info.heroImage} 
            alt={info.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
          <div className={`absolute inset-0 bg-gradient-to-t ${info.gradientFrom}/20 ${info.gradientTo}/10 to-transparent`} />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <Link href="/">
            <Button 
              variant="outline" 
              className="mb-6 gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 w-fit" 
              data-testid="button-voltar"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-white" style={{ color: info.accentColor }} />
            <span className="text-sm font-medium uppercase tracking-widest text-white/80">
              Linha Profissional
            </span>
          </div>

          <h1 
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-white"
            style={{ textShadow: `0 0 40px ${info.accentColor}40` }}
          >
            {info.name}
          </h1>
          
          <p className="text-white/90 text-lg max-w-2xl mb-4">
            {info.description}
          </p>
          
          <p className="text-white/70 text-base max-w-2xl">
            {info.longDescription}
          </p>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                Produtos da Linha
              </h2>
              <p className="text-muted-foreground mt-2">
                {products?.length || 0} produtos disponíveis
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group overflow-visible border-0 bg-background hover-elevate"
                  data-testid={`card-product-${product.id}`}
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-md">
                    <img 
                      src={getProductImage(product, index)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.featured && (
                      <Badge 
                        className="absolute top-4 left-4 gap-1"
                        style={{ backgroundColor: info.accentColor }}
                      >
                        <Star className="w-3 h-3" />
                        Destaque
                      </Badge>
                    )}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: info.accentColor }}
                    />
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {product.benefits && product.benefits.length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {product.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check 
                              className="h-4 w-4 shrink-0" 
                              style={{ color: info.accentColor }}
                            />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      {product.showPrice && product.price ? (
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: info.accentColor }}
                        >
                          R$ {(product.price / 100).toFixed(2).replace(".", ",")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Consulte</span>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="group/btn"
                        data-testid={`button-details-${product.id}`}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-lg">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg mb-4">
                Nenhum produto encontrado nesta linha.
              </p>
              <Link href="/produtos">
                <Button data-testid="button-ver-todos">
                  Ver todos os produtos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-4">
            Conheça Outras Linhas
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore nossa linha completa de produtos profissionais para todos os tipos de cabelo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(lineInfo)
              .filter(([key]) => key !== line)
              .map(([key, value]) => (
                <Link key={key} href={`/linha/${key}`}>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    data-testid={`button-linha-${key}`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: value.accentColor }}
                    />
                    {value.name}
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
