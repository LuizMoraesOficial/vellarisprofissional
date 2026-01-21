import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import type { ProductLine } from "@shared/schema";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

export function ProductLinesSection() {
  const { data: lines, isLoading } = useQuery<ProductLine[]>({
    queryKey: ["/api/product-lines"],
  });

  const activeLines = lines?.filter(line => line.isActive) || [];

  if (isLoading) {
    return (
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-background via-background to-muted/30 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </section>
    );
  }

  if (activeLines.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-background via-background to-muted/30 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900/50 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        {activeLines.slice(0, 3).map((line, index) => (
          <div 
            key={line.id}
            className="absolute w-72 h-72 rounded-full blur-3xl"
            style={{ 
              backgroundColor: `${line.accentColor}20`,
              top: index === 0 ? '5rem' : index === 1 ? '10rem' : '5rem',
              left: index === 0 ? '2.5rem' : index === 2 ? '33%' : undefined,
              right: index === 1 ? '5rem' : undefined,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-gold/10 text-primary dark:text-gold text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Nossas Linhas Profissionais
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground dark:text-white mt-4">
            Escolha o tratamento ideal
          </h2>
          <p className="text-muted-foreground dark:text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
            Cada linha foi desenvolvida com tecnologia exclusiva para atender necessidades específicas
          </p>
        </div>

        <div className={`grid grid-cols-1 ${activeLines.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : activeLines.length >= 3 ? 'md:grid-cols-3' : 'max-w-md mx-auto'} gap-6 lg:gap-8`}>
          {activeLines.map((line) => {
            const accentColor = line.accentColor || "#D4AF37";
            const textIsLight = isLightColor(accentColor);
            const defaultImage = "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600";
            const imageUrl = line.featuredImage || defaultImage;
            
            return (
              <div 
                key={line.id}
                className="group relative overflow-hidden rounded-md border-2 bg-card dark:bg-gray-900/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                style={{ borderColor: `${accentColor}50` }}
                data-testid={`card-line-${line.slug}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundColor: accentColor }}
                  />
                  <img 
                    src={imageUrl}
                    alt={line.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card dark:from-gray-900 via-transparent to-transparent" />
                  <div 
                    className="absolute top-4 left-4 p-3 rounded-xl shadow-lg"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 
                    className="font-serif text-2xl font-bold mb-2"
                    style={{ color: accentColor }}
                  >
                    {line.name}
                  </h3>
                  
                  <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed mb-6">
                    {line.description}
                  </p>
                  
                  <Link href={`/linha/${line.slug}`}>
                    <Button 
                      className="w-full font-medium shadow-lg group/btn"
                      style={{ 
                        backgroundColor: accentColor, 
                        borderColor: accentColor,
                        color: textIsLight ? '#000' : '#fff'
                      }}
                      data-testid={`button-line-${line.slug}`}
                    >
                      Explorar linha
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>

                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
