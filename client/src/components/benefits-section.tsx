import { useQuery } from "@tanstack/react-query";
import { Droplets, Leaf, Shield, Sparkles, Zap, Heart, Star, Award, Loader2 } from "lucide-react";
import type { Feature } from "@shared/schema";

const iconMap: Record<string, typeof Sparkles> = {
  sparkles: Sparkles,
  leaf: Leaf,
  shield: Shield,
  droplets: Droplets,
  zap: Zap,
  heart: Heart,
  star: Star,
  award: Award,
};

interface BenefitsSettings {
  benefitsSectionTitle: string | null;
  benefitsSectionSubtitle: string | null;
  benefitsSectionLabel: string | null;
}

export function BenefitsSection() {
  const { data: features, isLoading: featuresLoading, isError: featuresError } = useQuery<Feature[]>({
    queryKey: ["/api/features"],
  });

  const { data: settings } = useQuery<BenefitsSettings>({
    queryKey: ["/api/settings/public"],
    select: (data: any) => ({
      benefitsSectionTitle: data.benefitsSectionTitle,
      benefitsSectionSubtitle: data.benefitsSectionSubtitle,
      benefitsSectionLabel: data.benefitsSectionLabel,
    }),
  });

  const sectionLabel = settings?.benefitsSectionLabel || "Por que VELLARIS";
  const sectionTitle = settings?.benefitsSectionTitle || "Excelência em cada fórmula";
  const sectionSubtitle = settings?.benefitsSectionSubtitle || 
    "Cada produto VELLARIS é resultado de anos de pesquisa e desenvolvimento, combinando ciência e natureza.";

  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            {sectionLabel}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {featuresLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : featuresError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Não foi possível carregar os destaques. Tente novamente mais tarde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features?.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Sparkles;
              return (
                <div 
                  key={feature.id} 
                  className="text-center p-6"
                  data-testid={`benefit-card-${index}`}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
