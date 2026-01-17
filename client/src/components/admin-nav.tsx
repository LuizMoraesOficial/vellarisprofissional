import { Link, useLocation } from "wouter";
import { Package, Settings, MessageSquare, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminNavProps {
  onLogout: () => void;
}

const navItems = [
  { href: "/admin/dashboard", label: "Produtos", icon: Package },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminNav({ onLogout }: AdminNavProps) {
  const [location] = useLocation();

  return (
    <nav className="bg-black/95 backdrop-blur-md border-b border-gold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(43,74%,49%)] to-[hsl(43,74%,35%)] flex items-center justify-center golden-glow">
                  <LayoutDashboard className="w-5 h-5 text-black" />
                </div>
                <div>
                  <span className="font-serif text-lg font-semibold text-white tracking-wide">
                    VELLARIS
                  </span>
                  <span className="block text-xs text-gold tracking-widest">
                    ADMIN
                  </span>
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`gap-2 transition-all duration-300 ${
                        isActive 
                          ? "bg-gold text-black hover:bg-gold/90" 
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                      data-testid={`admin-nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="text-sm text-gray-400 hover:text-gold transition-colors cursor-pointer nav-link-glow">
                Ver Site
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 gap-2"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>

        <div className="md:hidden pb-3 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 whitespace-nowrap ${
                    isActive 
                      ? "bg-gold text-black" 
                      : "text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
