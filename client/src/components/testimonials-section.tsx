import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Star, Loader2 } from "lucide-react";
import testimonialImage from "@assets/stock_images/woman_beautiful_curl_16f98399.jpg";
import type { Testimonial } from "@shared/schema";

interface TestimonialsSettings {
  testimonialsSectionTitle: string | null;
  testimonialsSectionSubtitle: string | null;
  testimonialsSectionLabel: string | null;
  testimonialsSectionImage: string | null;
}

export function TestimonialsSection() {
  const { data: testimonials, isLoading: testimonialsLoading, isError: testimonialsError } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const { data: settings } = useQuery<TestimonialsSettings>({
    queryKey: ["/api/settings/public"],
    select: (data: any) => ({
      testimonialsSectionTitle: data.testimonialsSectionTitle,
      testimonialsSectionSubtitle: data.testimonialsSectionSubtitle,
      testimonialsSectionLabel: data.testimonialsSectionLabel,
      testimonialsSectionImage: data.testimonialsSectionImage,
    }),
  });

  const sectionLabel = settings?.testimonialsSectionLabel || "Depoimentos";
  const sectionTitle = settings?.testimonialsSectionTitle || "O que dizem sobre nós";
  const sectionSubtitle = settings?.testimonialsSectionSubtitle || 
    "Profissionais e clientes compartilham suas experiências com os produtos VELLARIS.";
  const sectionImage = settings?.testimonialsSectionImage || testimonialImage;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              {sectionLabel}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6">
              {sectionTitle}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {sectionSubtitle}
            </p>

            {testimonialsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : testimonialsError ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Não foi possível carregar os depoimentos.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {testimonials?.map((testimonial, index) => (
                  <Card 
                    key={testimonial.id} 
                    className="p-6 border-0 bg-card"
                    data-testid={`testimonial-card-${index}`}
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
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
            )}
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-[3/4] rounded-md overflow-hidden">
              <img
                src={sectionImage}
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
