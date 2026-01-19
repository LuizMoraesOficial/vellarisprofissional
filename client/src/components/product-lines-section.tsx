import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const productLines = [
  {
    id: "fiber-force",
    name: "Fiber Force",
    description: "Reconstrução profissional",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    textColor: "text-orange-500",
    dotColor: "bg-orange-500",
  },
  {
    id: "hydra-balance",
    name: "Hydra Balance",
    description: "Hidratação profunda",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    textColor: "text-purple-500",
    dotColor: "bg-purple-500",
  },
  {
    id: "nutri-oil",
    name: "Nutri Oil",
    description: "Nutrição e brilho",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    textColor: "text-yellow-500",
    dotColor: "bg-yellow-500",
  },
];

export function ProductLinesSection() {
  return (
    <section className="relative py-16 md:py-24 bg-background dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary dark:text-gold text-sm font-medium uppercase tracking-widest">
            Nossas Linhas
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground dark:text-white mt-3">
            Escolha o tratamento ideal
          </h2>
          <p className="text-muted-foreground dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Cada linha foi desenvolvida para atender necessidades específicas dos cabelos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {productLines.map((line) => (
            <Card 
              key={line.id}
              className={`group relative overflow-hidden border-2 ${line.borderColor} ${line.bgColor} hover:shadow-lg transition-all duration-300`}
              data-testid={`card-line-${line.id}`}
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${line.dotColor}`} />
                  <h3 className={`font-serif text-xl md:text-2xl font-bold ${line.textColor}`}>
                    {line.name}
                  </h3>
                </div>
                
                <p className="text-muted-foreground dark:text-gray-400 mb-6">
                  {line.description}
                </p>
                
                <Link href={`/linha/${line.id}`}>
                  <Button 
                    variant="outline" 
                    className={`w-full group/btn ${line.borderColor} ${line.textColor} hover:${line.bgColor}`}
                    data-testid={`button-line-${line.id}`}
                  >
                    Ver linha
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
