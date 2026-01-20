import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Sparkles } from "lucide-react";
import type { Product } from "@shared/schema";

const lineInfo: Record<string, { name: string; description: string; color: string; bgColor: string; borderColor: string }> = {
  "fiber-force": {
    name: "Fiber Force",
    description: "Linha de reconstrução profissional para cabelos danificados e quebradiços",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
  "hydra-balance": {
    name: "Hydra Balance",
    description: "Linha de hidratação profunda para cabelos secos e ressecados",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  "nutri-oil": {
    name: "Nutri Oil",
    description: "Linha de nutrição e brilho para cabelos opacos e sem vida",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
};

export default function LineProducts() {
  const [, params] = useRoute("/linha/:line");
  const line = params?.line || "";

  const info = lineInfo[line] || {
    name: "Linha",
    description: "Produtos da linha",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
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

  return (
    <main className="min-h-screen bg-background dark:bg-gray-950">
      <section className={`relative py-20 ${info.bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6 gap-2" data-testid="button-voltar">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Sparkles className={`w-6 h-6 ${info.color}`} />
            <span className={`text-sm font-medium uppercase tracking-widest ${info.color}`}>
              Linha Profissional
            </span>
          </div>

          <h1 className={`font-serif text-4xl sm:text-5xl font-bold mb-4 ${info.color}`}>
            {info.name}
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 text-lg max-w-2xl">
            {info.description}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className={`group overflow-hidden border-2 ${info.borderColor} hover:shadow-lg transition-all duration-300`}
                  data-testid={`card-product-${product.id}`}
                >
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <div className={`absolute inset-0 ${info.bgColor} flex items-center justify-center`}>
                      <span className={`font-serif text-2xl font-bold ${info.color}`}>
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    {product.featured && (
                      <Badge className="absolute top-3 right-3 bg-primary dark:bg-gold text-primary-foreground dark:text-black">
                        <Star className="w-3 h-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-bold text-foreground dark:text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.benefits.slice(0, 3).map((benefit, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className={`${info.borderColor} ${info.color} text-xs`}
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      {product.showPrice && product.price ? (
                        <span className={`text-2xl font-bold ${info.color}`}>
                          R$ {(product.price / 100).toFixed(2).replace(".", ",")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Consulte</span>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Nenhum produto encontrado nesta linha.
              </p>
              <Link href="/produtos">
                <Button className="mt-4" data-testid="button-ver-todos">
                  Ver todos os produtos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
