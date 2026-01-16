import { Card } from "@/components/ui/card";
import { Award, Users, Globe, Heart } from "lucide-react";
import heroImage from "@assets/stock_images/beautiful_woman_long_18c873be.jpg";

const stats = [
  { value: "10+", label: "Anos de Experiência" },
  { value: "50k+", label: "Clientes Satisfeitos" },
  { value: "100+", label: "Salões Parceiros" },
  { value: "20+", label: "Países" },
];

const values = [
  {
    icon: Award,
    title: "Excelência",
    description: "Comprometimento com a qualidade superior em cada produto que desenvolvemos.",
  },
  {
    icon: Users,
    title: "Parceria",
    description: "Trabalhamos lado a lado com profissionais para criar soluções eficazes.",
  },
  {
    icon: Globe,
    title: "Sustentabilidade",
    description: "Práticas responsáveis que respeitam o meio ambiente e as comunidades.",
  },
  {
    icon: Heart,
    title: "Paixão",
    description: "Amor pelo que fazemos refletido em cada fórmula e resultado.",
  },
];

export default function About() {
  return (
    <main className="pt-20 md:pt-24">
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-sm font-medium uppercase tracking-widest">
                Nossa História
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6">
                Sobre a VELLARIS
              </h1>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  A VELLARIS nasceu da paixão por cabelos saudáveis e da busca pela 
                  excelência em cuidados capilares profissionais. Há mais de uma década, 
                  desenvolvemos fórmulas inovadoras que combinam ciência avançada com 
                  ingredientes naturais.
                </p>
                <p className="text-lg leading-relaxed">
                  Nossa missão é proporcionar aos profissionais da beleza e consumidores 
                  finais produtos que realmente fazem a diferença, transformando cabelos 
                  e elevando a autoestima de milhares de pessoas.
                </p>
                <p className="text-lg leading-relaxed">
                  Cada produto VELLARIS passa por rigorosos testes de qualidade e é 
                  desenvolvido com tecnologia de ponta, garantindo resultados visíveis 
                  desde a primeira aplicação.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-md overflow-hidden">
                <img
                  src={heroImage}
                  alt="Mulher com cabelos saudáveis"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <p className="font-serif text-4xl md:text-5xl font-medium text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-background/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              O que nos move
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium mt-4 mb-6">
              Nossos Valores
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Princípios que guiam cada decisão e produto que criamos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="p-6 border-0 bg-card text-center"
                data-testid={`value-card-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              Nossa Missão
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium mt-4 mb-6">
              Transformar cabelos, elevar autoestima
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Acreditamos que cabelos saudáveis são sinônimo de confiança e bem-estar. 
              Por isso, dedicamos nosso trabalho a desenvolver produtos que não apenas 
              tratam, mas transformam a relação das pessoas com seus cabelos. Cada fórmula 
              é pensada para oferecer resultados reais, duradouros e que façam a diferença 
              no dia a dia de quem utiliza.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
