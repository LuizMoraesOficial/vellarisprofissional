import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Droplets, Sun } from "lucide-react";

interface PublicSettings {
  fiberForceImage?: string | null;
  hydraBalanceImage?: string | null;
  nutriOilImage?: string | null;
}

const productLines = [
  {
    id: "fiber-force",
    name: "Fiber Force",
    description: "Reconstrução profissional para cabelos danificados e quebradiços. Tecnologia de aminoácidos e queratina.",
    icon: Sparkles,
    gradient: "from-orange-500 via-orange-400 to-amber-500",
    bgGradient: "from-orange-500/20 via-orange-400/10 to-transparent",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-500",
    hoverBorder: "hover:border-orange-400",
    buttonBg: "bg-orange-500 hover:bg-orange-600",
    defaultImage: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600",
    settingsKey: "fiberForceImage" as keyof PublicSettings,
  },
  {
    id: "hydra-balance",
    name: "Hydra Balance",
    description: "Hidratação profunda e equilíbrio para cabelos secos. Ácido hialurônico e aloe vera.",
    icon: Droplets,
    gradient: "from-purple-500 via-purple-400 to-violet-500",
    bgGradient: "from-purple-500/20 via-purple-400/10 to-transparent",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-500",
    hoverBorder: "hover:border-purple-400",
    buttonBg: "bg-purple-500 hover:bg-purple-600",
    defaultImage: "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=600",
    settingsKey: "hydraBalanceImage" as keyof PublicSettings,
  },
  {
    id: "nutri-oil",
    name: "Nutri Oil",
    description: "Nutrição e brilho intenso para cabelos opacos. Óleos de argan, macadâmia e pracaxi.",
    icon: Sun,
    gradient: "from-yellow-500 via-amber-400 to-yellow-400",
    bgGradient: "from-yellow-500/20 via-amber-400/10 to-transparent",
    borderColor: "border-yellow-500/30",
    textColor: "text-yellow-500",
    hoverBorder: "hover:border-yellow-400",
    buttonBg: "bg-yellow-500 hover:bg-yellow-600",
    defaultImage: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600",
    settingsKey: "nutriOilImage" as keyof PublicSettings,
  },
];

export function ProductLinesSection() {
  const { data: settings } = useQuery<PublicSettings>({
    queryKey: ["/api/settings/public"],
  });

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-background via-background to-muted/30 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900/50 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {productLines.map((line) => {
            const Icon = line.icon;
            const imageUrl = settings?.[line.settingsKey] || line.defaultImage;
            
            return (
              <div 
                key={line.id}
                className={`group relative overflow-hidden rounded-2xl border-2 ${line.borderColor} ${line.hoverBorder} bg-card dark:bg-gray-900/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
                data-testid={`card-line-${line.id}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${line.gradient} opacity-20`} />
                  <img 
                    src={imageUrl || line.defaultImage}
                    alt={line.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-card dark:from-gray-900 via-transparent to-transparent`} />
                  <div className={`absolute top-4 left-4 p-3 rounded-xl bg-gradient-to-br ${line.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className={`font-serif text-2xl font-bold ${line.textColor} mb-2`}>
                    {line.name}
                  </h3>
                  
                  <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed mb-6">
                    {line.description}
                  </p>
                  
                  <Link href={`/linha/${line.id}`}>
                    <Button 
                      className={`w-full ${line.buttonBg} text-white font-medium shadow-lg group/btn`}
                      data-testid={`button-line-${line.id}`}
                    >
                      Explorar linha
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${line.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
