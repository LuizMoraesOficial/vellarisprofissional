import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Leaf, 
  Shield, 
  Droplets, 
  Zap, 
  Heart, 
  Star, 
  Award,
  CheckCircle,
  Gem,
  Crown,
  Flame,
  Sun,
  Moon
} from "lucide-react";
import type { CustomSection, CustomSectionItem } from "@shared/schema";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  leaf: Leaf,
  shield: Shield,
  droplets: Droplets,
  zap: Zap,
  heart: Heart,
  star: Star,
  award: Award,
  "check-circle": CheckCircle,
  gem: Gem,
  crown: Crown,
  flame: Flame,
  sun: Sun,
  moon: Moon,
};

const getIconComponent = (iconName: string) => iconMap[iconName] || Sparkles;

interface SectionWithItems extends CustomSection {
  items: CustomSectionItem[];
}

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function GallerySection({ section }: { section: SectionWithItems }) {
  return (
    <section className="py-24 bg-background" data-testid={`section-gallery-${section.slug}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {section.label && (
            <span className="text-primary text-sm font-medium uppercase tracking-widest" data-testid={`text-section-label-${section.slug}`}>
              {section.label}
            </span>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6" data-testid={`text-section-title-${section.slug}`}>
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid={`text-section-subtitle-${section.slug}`}>
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-0 bg-card hover-elevate" data-testid={`gallery-item-${item.id}`}>
              {item.image && (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    data-testid={`img-gallery-${item.id}`}
                  />
                </div>
              )}
              {(item.title || item.description) && (
                <div className="p-4">
                  {item.title && (
                    <h3 className="font-medium text-lg mb-1" data-testid={`text-gallery-title-${item.id}`}>{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="text-muted-foreground text-sm" data-testid={`text-gallery-desc-${item.id}`}>{item.description}</p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoSection({ section }: { section: SectionWithItems }) {
  return (
    <section className="py-24 bg-muted/30" data-testid={`section-videos-${section.slug}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {section.label && (
            <span className="text-primary text-sm font-medium uppercase tracking-widest" data-testid={`text-section-label-${section.slug}`}>
              {section.label}
            </span>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6" data-testid={`text-section-title-${section.slug}`}>
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid={`text-section-subtitle-${section.slug}`}>
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.items.map((item) => {
            const videoId = item.videoUrl ? extractYouTubeId(item.videoUrl) : null;
            return (
              <Card key={item.id} className="overflow-hidden border-0 bg-card hover-elevate" data-testid={`video-item-${item.id}`}>
                {videoId ? (
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      data-testid={`iframe-video-${item.id}`}
                    />
                  </div>
                ) : item.image ? (
                  <div className="aspect-video relative cursor-pointer">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      data-testid={`img-video-${item.id}`}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  </div>
                ) : null}
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1" data-testid={`text-video-title-${item.id}`}>{item.title}</h3>
                  {item.description && (
                    <p className="text-muted-foreground text-sm" data-testid={`text-video-desc-${item.id}`}>{item.description}</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PostsSection({ section }: { section: SectionWithItems }) {
  return (
    <section className="py-24 bg-background" data-testid={`section-posts-${section.slug}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {section.label && (
            <span className="text-primary text-sm font-medium uppercase tracking-widest" data-testid={`text-section-label-${section.slug}`}>
              {section.label}
            </span>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6" data-testid={`text-section-title-${section.slug}`}>
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid={`text-section-subtitle-${section.slug}`}>
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-0 bg-card hover-elevate" data-testid={`post-item-${item.id}`}>
              {item.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    data-testid={`img-post-${item.id}`}
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-serif text-xl font-medium mb-2" data-testid={`text-post-title-${item.id}`}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4" data-testid={`text-post-desc-${item.id}`}>
                    {item.description}
                  </p>
                )}
                {item.link && (
                  <Button variant="ghost" size="sm" className="p-0" data-testid={`post-link-${item.id}`}>
                    Ler mais
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightsSection({ section }: { section: SectionWithItems }) {
  return (
    <section className="py-24 bg-muted/30" data-testid={`section-highlights-${section.slug}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {section.label && (
            <span className="text-primary text-sm font-medium uppercase tracking-widest" data-testid={`text-section-label-${section.slug}`}>
              {section.label}
            </span>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6" data-testid={`text-section-title-${section.slug}`}>
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid={`text-section-subtitle-${section.slug}`}>
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {section.items.map((item) => {
            const IconComponent = item.icon ? getIconComponent(item.icon) : null;
            return (
              <Card key={item.id} className="text-center p-6 border-0 bg-card hover-elevate" data-testid={`highlight-item-${item.id}`}>
                {IconComponent ? (
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-primary" data-testid={`icon-highlight-${item.id}`} />
                  </div>
                ) : item.image ? (
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      data-testid={`img-highlight-${item.id}`}
                    />
                  </div>
                ) : null}
                <h3 className="font-medium text-lg mb-2" data-testid={`text-highlight-title-${item.id}`}>{item.title}</h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm" data-testid={`text-highlight-desc-${item.id}`}>{item.description}</p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductsCustomSection({ section }: { section: SectionWithItems }) {
  return (
    <section className="py-24 bg-background" data-testid={`section-products-${section.slug}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {section.label && (
            <span className="text-primary text-sm font-medium uppercase tracking-widest" data-testid={`text-section-label-${section.slug}`}>
              {section.label}
            </span>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6" data-testid={`text-section-title-${section.slug}`}>
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid={`text-section-subtitle-${section.slug}`}>
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-0 bg-card hover-elevate" data-testid={`product-item-${item.id}`}>
              {item.image && (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    data-testid={`img-product-${item.id}`}
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-serif text-xl font-medium mb-2" data-testid={`text-product-title-${item.id}`}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm mb-4" data-testid={`text-product-desc-${item.id}`}>
                    {item.description}
                  </p>
                )}
                {item.link && (
                  <Button variant="ghost" size="sm" data-testid={`product-link-${item.id}`}>
                    Ver detalhes
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


function renderSectionByType(section: SectionWithItems) {
  if (!section.items || section.items.length === 0) return null;
  
  switch (section.type) {
    case "gallery":
      return <GallerySection section={section} />;
    case "videos":
      return <VideoSection section={section} />;
    case "posts":
      return <PostsSection section={section} />;
    case "highlights":
      return <HighlightsSection section={section} />;
    case "products":
    default:
      return <ProductsCustomSection section={section} />;
  }
}

interface CustomSectionsListProps {
  position: string;
}

export function CustomSectionsList({ position }: CustomSectionsListProps) {
  const { data: sections, isLoading } = useQuery<SectionWithItems[]>({
    queryKey: ["/api/custom-sections"],
  });

  const filteredSections = sections?.filter(s => s.position === position && s.isActive) || [];

  if (isLoading) return null;
  if (filteredSections.length === 0) return null;

  return (
    <>
      {filteredSections.map((section) => (
        <div key={section.id}>{renderSectionByType(section)}</div>
      ))}
    </>
  );
}
