import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-6">
            Pronto para transformar seus cabelos?
          </h2>
          <p className="text-background/70 text-lg mb-8">
            Entre em contato conosco e descubra como os produtos VELLARIS podem 
            elevar os resultados do seu salão ou cuidados pessoais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contato">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-cta-contato"
              >
                Fale Conosco
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/produtos">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-background/20 text-background"
                data-testid="button-cta-catalogo"
              >
                Ver Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
