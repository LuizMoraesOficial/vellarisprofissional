import { Droplets, Leaf, Shield, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Tecnologia Avançada",
    description: "Fórmulas desenvolvidas com nanotecnologia para máxima absorção e resultados visíveis.",
  },
  {
    icon: Leaf,
    title: "Ingredientes Naturais",
    description: "Extratos botânicos premium e óleos essenciais cuidadosamente selecionados.",
  },
  {
    icon: Shield,
    title: "Proteção Completa",
    description: "Proteção térmica e ambiental para manter seus cabelos saudáveis.",
  },
  {
    icon: Droplets,
    title: "Hidratação Profunda",
    description: "Complexo hidratante que penetra na fibra capilar para resultados duradouros.",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Por que VELLARIS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6">
            Excelência em cada fórmula
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada produto VELLARIS é resultado de anos de pesquisa e desenvolvimento, 
            combinando ciência e natureza.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="text-center p-6"
              data-testid={`benefit-card-${index}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
