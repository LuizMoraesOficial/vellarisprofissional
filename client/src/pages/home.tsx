import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/hero-section";
import { ProductLinesSection } from "@/components/product-lines-section";
import { ProductsSection } from "@/components/products-section";
import { BenefitsSection } from "@/components/benefits-section";
import { TestimonialsSection } from "@/components/testimonials-section";

interface HomeSettings {
  featuredProductsSectionEnabled: boolean | null;
}

export default function Home() {
  const { data: settings } = useQuery<HomeSettings>({
    queryKey: ["/api/settings/public"],
    select: (data: any) => ({
      featuredProductsSectionEnabled: data?.featuredProductsSectionEnabled ?? true,
    }),
  });

  const showFeaturedProducts = settings?.featuredProductsSectionEnabled ?? true;

  return (
    <main>
      <HeroSection />
      <ProductLinesSection />
      {showFeaturedProducts && <ProductsSection />}
      <BenefitsSection />
      <TestimonialsSection />
    </main>
  );
}
