import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
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
import type { CustomSection, CustomSectionItem, Product } from "@shared/schema";

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
  products?: Product[];
}

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function YouTubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  const sendCommand = (func: string, args?: unknown) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args: args || [] }),
        '*'
      );
    }
  };
  
  const togglePlay = () => {
    if (isPaused) {
      sendCommand('playVideo');
      setIsPaused(false);
    } else {
      sendCommand('pauseVideo');
      setIsPaused(true);
    }
  };
  
  const toggleMute = () => {
    if (isMuted) {
      sendCommand('unMute');
      sendCommand('setVolume', [volume]);
      setIsMuted(false);
    } else {
      sendCommand('mute');
      setIsMuted(true);
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    sendCommand('setVolume', [newVolume]);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      sendCommand('unMute');
      setIsMuted(false);
    }
  };
  
  if (!isPlaying) {
    return (
      <div 
        className="aspect-video relative cursor-pointer group"
        onClick={() => setIsPlaying(true)}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="aspect-video relative overflow-hidden bg-black group">
      {/* YouTube iframe with controls hidden */}
      <iframe
        ref={iframeRef}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
        className="absolute w-full h-full"
        style={{ 
          top: '-60px',
          height: 'calc(100% + 120px)',
          pointerEvents: 'none'
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media"
        allowFullScreen={false}
      />
      
      {/* Custom controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <div className="flex items-center gap-4">
          {/* Play/Pause button */}
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            ) : (
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            )}
          </button>
          
          {/* Volume controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              {isMuted || volume === 0 ? (
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>
      </div>
      
      {/* Center play button when paused */}
      {isPaused && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
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
          {section.items.map((item) => {
            const IconComponent = item.icon ? getIconComponent(item.icon) : null;
            return (
              <Card key={item.id} className="overflow-hidden border-0 bg-card hover-elevate" data-testid={`gallery-item-${item.id}`}>
                {IconComponent ? (
                  <div className="p-6 pb-0">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-primary" data-testid={`icon-gallery-${item.id}`} />
                    </div>
                  </div>
                ) : item.image ? (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      data-testid={`img-gallery-${item.id}`}
                    />
                  </div>
                ) : null}
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
            );
          })}
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
                  <YouTubePlayer videoId={videoId} title={item.title} />
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
          {section.items.map((item) => {
            const IconComponent = item.icon ? getIconComponent(item.icon) : null;
            return (
              <Card key={item.id} className="overflow-hidden border-0 bg-card hover-elevate" data-testid={`post-item-${item.id}`}>
                {IconComponent ? (
                  <div className="p-6 pb-0">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-primary" data-testid={`icon-post-${item.id}`} />
                    </div>
                  </div>
                ) : item.image ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      data-testid={`img-post-${item.id}`}
                    />
                  </div>
                ) : null}
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
            );
          })}
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
  const products = section.products || [];
  
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
          {products.map((product) => (
            <Link key={product.id} href={`/produtos/${product.line}/${product.id}`}>
              <Card className="overflow-hidden border-0 bg-card hover-elevate cursor-pointer" data-testid={`product-item-${product.id}`}>
                {product.image && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      data-testid={`img-product-${product.id}`}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-medium mb-2" data-testid={`text-product-title-${product.id}`}>
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`text-product-desc-${product.id}`}>
                    {product.description}
                  </p>
                  <Button variant="ghost" size="sm" data-testid={`product-link-${product.id}`}>
                    Ver detalhes
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


function ParagraphsSection({ section }: { section: SectionWithItems }) {
  return (
    <section className="py-24 bg-background" data-testid={`section-paragraphs-${section.slug}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="space-y-12">
          {section.items.map((item) => (
            <div key={item.id} className="text-center" data-testid={`paragraph-item-${item.id}`}>
              <h3 className="font-serif text-xl sm:text-2xl font-medium mb-4 text-foreground" data-testid={`text-paragraph-title-${item.id}`}>
                {item.title}
              </h3>
              {item.description && (
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl mx-auto" data-testid={`text-paragraph-desc-${item.id}`}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderSectionByType(section: SectionWithItems) {
  if (section.type === "products") {
    if (!section.products || section.products.length === 0) return null;
    return <ProductsCustomSection section={section} />;
  }
  
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
    case "paragraphs":
      return <ParagraphsSection section={section} />;
    default:
      return null;
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
