import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImageDefault from "@assets/stock_images/beautiful_woman_long_552a8cae.jpg";

interface PublicSettings {
  heroImage?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
}

export function HeroSection() {
  const { data: settings } = useQuery<PublicSettings>({
    queryKey: ["/api/settings/public"],
  });

  const heroImage = settings?.heroImage || heroImageDefault;
  const heroTitle = settings?.heroTitle || "Performance profissional para cabelos exigentes";
  const heroSubtitle = settings?.heroSubtitle || "Tecnologia avançada, ativos selecionados e performance profissional para resultados de salão.";

  const titleParts = heroTitle.split(" para ");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Mulher com cabelo saudável"
          className="w-full h-full object-cover object-[center_30%] md:object-[center_15%] lg:object-[center_10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              Professional Hair Care
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-tight mb-6">
            {titleParts.length > 1 ? (
              <>
                {titleParts[0]} para
                <span className="block text-primary">{titleParts[1]}</span>
              </>
            ) : (
              heroTitle
            )}
          </h1>

          <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-lg">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/produtos">
              <Button size="lg" className="group" data-testid="button-hero-produtos">
                Conhecer as Linhas
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/sobre">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white" data-testid="button-hero-sobre">
                Nossa Tecnologia
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
