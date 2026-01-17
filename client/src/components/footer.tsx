import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { SiTiktok } from "react-icons/si";

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
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="font-serif text-2xl font-semibold mb-4">VELLARIS</h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Linha profissional de cuidados capilares para resultados extraordinários. 
              Tecnologia avançada para cabelos saudáveis e brilhantes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Links Rápidos
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/produtos">
                <span className="text-background/70 text-sm hover:text-background cursor-pointer transition-colors" data-testid="link-footer-produtos">
                  Produtos
                </span>
              </Link>
              <Link href="/sobre">
                <span className="text-background/70 text-sm hover:text-background cursor-pointer transition-colors" data-testid="link-footer-sobre">
                  Sobre Nós
                </span>
              </Link>
              <Link href="/contato">
                <span className="text-background/70 text-sm hover:text-background cursor-pointer transition-colors" data-testid="link-footer-contato">
                  Contato
                </span>
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Contato
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-background/70 text-sm">
                <Mail className="h-4 w-4" />
                <span>{settings?.contactEmail || "contato@vellaris.com.br"}</span>
              </div>
              <div className="flex items-center gap-2 text-background/70 text-sm">
                <Phone className="h-4 w-4" />
                <span>{settings?.contactPhone || "+55 (11) 99999-9999"}</span>
              </div>
              {settings?.address && (
                <div className="flex items-center gap-2 text-background/70 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{settings.address}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              {settings?.instagram && (
                <a 
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover-elevate"
                  data-testid="link-instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings?.facebook && (
                <a 
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover-elevate"
                  data-testid="link-facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.youtube && (
                <a 
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover-elevate"
                  data-testid="link-youtube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {settings?.tiktok && (
                <a 
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover-elevate"
                  data-testid="link-tiktok"
                >
                  <SiTiktok className="h-5 w-5" />
                </a>
              )}
              {!settings?.instagram && !settings?.facebook && !settings?.youtube && !settings?.tiktok && (
                <>
                  <a 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover-elevate"
                    data-testid="link-instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover-elevate"
                    data-testid="link-facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/50 text-sm">
              © 2024 VELLARIS Professional. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <span className="text-background/50 text-sm cursor-pointer hover:text-background transition-colors">
                Política de Privacidade
              </span>
              <span className="text-background/50 text-sm cursor-pointer hover:text-background transition-colors">
                Termos de Uso
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
