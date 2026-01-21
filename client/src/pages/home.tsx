import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/hero-section";
import { ProductLinesSection } from "@/components/product-lines-section";
import { ProductsSection } from "@/components/products-section";
import { BenefitsSection } from "@/components/benefits-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CustomSectionsList } from "@/components/custom-section";

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
      <CustomSectionsList position="after-hero" />
      <ProductLinesSection />
      <CustomSectionsList position="after-product-lines" />
      {showFeaturedProducts && <ProductsSection />}
      <CustomSectionsList position="before-benefits" />
      <BenefitsSection />
      <CustomSectionsList position="after-benefits" />
      <CustomSectionsList position="before-testimonials" />
      <TestimonialsSection />
    </main>
  );
}
