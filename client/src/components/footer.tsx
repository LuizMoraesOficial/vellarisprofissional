import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { SiTiktok, SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";

interface PublicSettings {
  contactEmail: string;
  contactPhone: string;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  tiktok: string | null;
  address: string | null;
}

export function Footer() {
  const { data: settings } = useQuery<PublicSettings>({
    queryKey: ["/api/settings/public"],
  });

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10 dark:from-transparent dark:via-gold/5 dark:to-gold/10" />
      
      <section className="relative bg-gradient-to-b from-card to-background dark:from-gray-900 dark:to-black py-20 border-t border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(43,74%,49%,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(43,74%,49%,0.05),transparent_40%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-gold/10 border border-primary/20 dark:border-gold/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary dark:text-gold" />
              <span className="text-sm font-medium text-primary dark:text-gold">Transforme seus cabelos</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground dark:text-white mb-4">
              Pronto para transformar seus cabelos?
            </h2>
            <p className="text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Entre em contato conosco e descubra como os produtos VELLARIS podem elevar os resultados do seu salão ou cuidados pessoais.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contato">
                <Button className="bg-primary dark:bg-gold text-primary-foreground dark:text-black hover:bg-primary/90 dark:hover:bg-gold/90 gap-2 px-8 h-12 text-base font-semibold golden-glow">
                  Fale Conosco
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/produtos">
                <Button variant="outline" className="border-border dark:border-gray-700 text-foreground dark:text-white hover:bg-muted dark:hover:bg-gray-800 gap-2 px-8 h-12 text-base">
                  Ver Catálogo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative bg-gradient-to-b from-muted/50 to-muted dark:from-gray-950 dark:to-black">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-gold/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 dark:from-gold dark:to-gold/70 flex items-center justify-center">
                  <span className="text-primary-foreground dark:text-black font-serif font-bold text-lg">V</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground dark:text-white">VELLARIS</h3>
                  <span className="text-xs text-muted-foreground dark:text-gray-500 uppercase tracking-widest">Professional</span>
                </div>
              </div>
              <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed">
                Linha profissional de cuidados capilares para resultados extraordinários. 
                Tecnologia avançada para cabelos saudáveis e brilhantes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-6 text-foreground dark:text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-primary dark:bg-gold rounded-full" />
                Links Rápidos
              </h4>
              <nav className="flex flex-col gap-3">
                <Link href="/produtos">
                  <span className="text-muted-foreground dark:text-gray-400 text-sm hover:text-primary dark:hover:text-gold cursor-pointer transition-colors flex items-center gap-2 group" data-testid="link-footer-produtos">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Produtos
                  </span>
                </Link>
                <Link href="/sobre">
                  <span className="text-muted-foreground dark:text-gray-400 text-sm hover:text-primary dark:hover:text-gold cursor-pointer transition-colors flex items-center gap-2 group" data-testid="link-footer-sobre">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Sobre Nós
                  </span>
                </Link>
                <Link href="/contato">
                  <span className="text-muted-foreground dark:text-gray-400 text-sm hover:text-primary dark:hover:text-gold cursor-pointer transition-colors flex items-center gap-2 group" data-testid="link-footer-contato">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Contato
                  </span>
                </Link>
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-6 text-foreground dark:text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-primary dark:bg-gold rounded-full" />
                Contato
              </h4>
              <div className="flex flex-col gap-4">
                <a 
                  href={`mailto:${settings?.contactEmail || "contato@vellaris.com.br"}`}
                  className="flex items-center gap-3 text-muted-foreground dark:text-gray-400 text-sm hover:text-primary dark:hover:text-gold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-gold/10 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-gold/20 transition-colors">
                    <Mail className="h-4 w-4 text-primary dark:text-gold" />
                  </div>
                  <span>{settings?.contactEmail || "contato@vellaris.com.br"}</span>
                </a>
                <a 
                  href={`tel:${settings?.contactPhone || "+55 (11) 99999-9999"}`}
                  className="flex items-center gap-3 text-muted-foreground dark:text-gray-400 text-sm hover:text-primary dark:hover:text-gold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-gold/10 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-gold/20 transition-colors">
                    <Phone className="h-4 w-4 text-primary dark:text-gold" />
                  </div>
                  <span>{settings?.contactPhone || "+55 (11) 99999-9999"}</span>
                </a>
                {settings?.address && (
                  <div className="flex items-center gap-3 text-muted-foreground dark:text-gray-400 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-gold/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary dark:text-gold" />
                    </div>
                    <span>{settings.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-6 text-foreground dark:text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-primary dark:bg-gold rounded-full" />
                Redes Sociais
              </h4>
              <div className="flex gap-3 flex-wrap">
                {settings?.whatsapp && (
                  <a 
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 w-11 rounded-full bg-green-500/10 dark:bg-green-500/20 border border-green-500/20 dark:border-green-500/30 flex items-center justify-center hover:bg-green-500 hover:border-green-500 transition-all duration-300 group golden-glow"
                    data-testid="link-whatsapp"
                    title="Fale conosco no WhatsApp"
                  >
                    <SiWhatsapp className="h-5 w-5 text-green-500 group-hover:text-white transition-colors" />
                  </a>
                )}
                {settings?.instagram && (
                  <a 
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 w-11 rounded-full bg-pink-500/10 dark:bg-pink-500/20 border border-pink-500/20 dark:border-pink-500/30 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all duration-300 group golden-glow"
                    data-testid="link-instagram"
                  >
                    <Instagram className="h-5 w-5 text-pink-500 group-hover:text-white transition-colors" />
                  </a>
                )}
                {settings?.facebook && (
                  <a 
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 w-11 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center hover:bg-blue-500 hover:border-blue-500 transition-all duration-300 group golden-glow"
                    data-testid="link-facebook"
                  >
                    <Facebook className="h-5 w-5 text-blue-500 group-hover:text-white transition-colors" />
                  </a>
                )}
                {settings?.youtube && (
                  <a 
                    href={settings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 w-11 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 dark:border-red-500/30 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all duration-300 group golden-glow"
                    data-testid="link-youtube"
                  >
                    <Youtube className="h-5 w-5 text-red-500 group-hover:text-white transition-colors" />
                  </a>
                )}
                {settings?.tiktok && (
                  <a 
                    href={settings.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 w-11 rounded-full bg-foreground/10 dark:bg-white/10 border border-foreground/20 dark:border-white/20 flex items-center justify-center hover:bg-foreground dark:hover:bg-white hover:border-foreground dark:hover:border-white transition-all duration-300 group golden-glow"
                    data-testid="link-tiktok"
                  >
                    <SiTiktok className="h-5 w-5 text-foreground dark:text-white group-hover:text-background dark:group-hover:text-black transition-colors" />
                  </a>
                )}
                {!settings?.whatsapp && !settings?.instagram && !settings?.facebook && !settings?.youtube && !settings?.tiktok && (
                  <>
                    <div className="h-11 w-11 rounded-full bg-muted dark:bg-gray-800 border border-border dark:border-gray-700 flex items-center justify-center">
                      <Instagram className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="h-11 w-11 rounded-full bg-muted dark:bg-gray-800 border border-border dark:border-gray-700 flex items-center justify-center">
                      <Facebook className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground dark:text-gray-500 text-sm">
                © 2024 VELLARIS Professional. Todos os direitos reservados.
              </p>
              <div className="flex gap-6">
                <span className="text-muted-foreground dark:text-gray-500 text-sm cursor-pointer hover:text-primary dark:hover:text-gold transition-colors">
                  Política de Privacidade
                </span>
                <span className="text-muted-foreground dark:text-gray-500 text-sm cursor-pointer hover:text-primary dark:hover:text-gold transition-colors">
                  Termos de Uso
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
