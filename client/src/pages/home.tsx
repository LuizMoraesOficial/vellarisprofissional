import { HeroSection } from "@/components/hero-section";
import { ProductsSection } from "@/components/products-section";
import { BenefitsSection } from "@/components/benefits-section";
import { TestimonialsSection } from "@/components/testimonials-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProductsSection />
      <BenefitsSection />
      <TestimonialsSection />
    </main>
  );
}
