import { HeroSection } from "@/components/hero-section";
import { ProductLinesSection } from "@/components/product-lines-section";
import { ProductsSection } from "@/components/products-section";
import { BenefitsSection } from "@/components/benefits-section";
import { TestimonialsSection } from "@/components/testimonials-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProductLinesSection />
      <ProductsSection />
      <BenefitsSection />
      <TestimonialsSection />
    </main>
  );
}
