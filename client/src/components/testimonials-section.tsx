import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import testimonialImage from "@assets/stock_images/woman_beautiful_curl_16f98399.jpg";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Cabeleireira Profissional",
    content: "Os produtos VELLARIS transformaram completamente o trabalho no meu salão. Os clientes adoram os resultados!",
    rating: 5,
  },
  {
    name: "Ana Santos",
    role: "Cliente",
    content: "Nunca tive um cabelo tão saudável e brilhante. A diferença é visível desde a primeira aplicação.",
    rating: 5,
  },
  {
    name: "Carla Oliveira",
    role: "Influenciadora de Beleza",
    content: "Qualidade profissional real. Recomendo para quem busca resultados extraordinários.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              Depoimentos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6">
              O que dizem sobre nós
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Profissionais e clientes compartilham suas experiências com os produtos VELLARIS.
            </p>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="p-6 border-0 bg-card"
                  data-testid={`testimonial-card-${index}`}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-[3/4] rounded-md overflow-hidden">
              <img
                src={testimonialImage}
                alt="Cliente satisfeita"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
