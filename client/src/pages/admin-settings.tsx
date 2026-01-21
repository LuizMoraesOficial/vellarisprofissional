import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Loader2,
  Image,
  Layout
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import type { SiteSettings } from "@shared/schema";

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const token = localStorage.getItem("adminToken");

  const [formData, setFormData] = useState({
    contactEmail: "",
    contactPhone: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    address: "",
    logoUrl: "",
    heroImage: "",
    heroTitle: "",
    heroSubtitle: "",
  });

  useEffect(() => {
    if (!token) {
      setLocation("/admin");
    }
  }, [token, setLocation]);

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/admin/settings"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        setLocation("/admin");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        contactEmail: settings.contactEmail || "",
        contactPhone: settings.contactPhone || "",
        whatsapp: settings.whatsapp || "",
        instagram: settings.instagram || "",
        facebook: settings.facebook || "",
        youtube: settings.youtube || "",
        tiktok: settings.tiktok || "",
        address: settings.address || "",
        logoUrl: settings.logoUrl || "",
        heroImage: settings.heroImage || "",
        heroTitle: settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<SiteSettings>) => {
      const res = await apiRequest("PUT", "/api/admin/settings", data, {
        Authorization: `Bearer ${token}`,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/public"] });
      toast({
        title: "Sucesso!",
        description: "Configurações salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <AdminNav onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Configurações do Site
          </h1>
          <p className="text-gray-400">
            Gerencie as informações de contato, imagens e conteúdo exibido no site.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gold/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Layout className="w-5 h-5 text-gold" />
                  Banner Principal (Hero)
                </CardTitle>
                <CardDescription>
                  Imagem e textos do banner na página inicial.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroImage" className="text-gray-300 flex items-center gap-2">
                    <Image className="w-4 h-4 text-gold" />
                    URL da Imagem do Banner
                  </Label>
                  <Input
                    id="heroImage"
                    value={formData.heroImage}
                    onChange={(e) => handleChange("heroImage", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20"
                    placeholder="https://exemplo.com/imagem.jpg"
                    data-testid="input-hero-image"
                  />
                  {formData.heroImage && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-700 h-32">
                      <img 
                        src={formData.heroImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroTitle" className="text-gray-300">Título Principal</Label>
                  <Input
                    id="heroTitle"
                    value={formData.heroTitle}
                    onChange={(e) => handleChange("heroTitle", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20"
                    placeholder="Performance profissional para cabelos exigentes"
                    data-testid="input-hero-title"
                  />
                  <p className="text-xs text-gray-500">Use "para" no texto para destacar a segunda parte em dourado</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle" className="text-gray-300">Subtítulo</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={formData.heroSubtitle}
                    onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20 resize-none"
                    placeholder="Tecnologia avançada..."
                    rows={2}
                    data-testid="input-hero-subtitle"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-gold/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-gold" />
                  Logo do Site
                </CardTitle>
                <CardDescription>
                  Logo exibido no cabeçalho do site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl" className="text-gray-300">URL da Logo</Label>
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) => handleChange("logoUrl", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20"
                    placeholder="https://exemplo.com/logo.png (deixe em branco para usar texto)"
                    data-testid="input-logo-url"
                  />
                  {formData.logoUrl && (
                    <div className="mt-2 p-4 rounded-lg bg-gray-800 border border-gray-700 inline-block">
                      <img src={formData.logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-gold/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gold" />
                  Informações de Contato
                </CardTitle>
                <CardDescription>
                  Dados de contato exibidos no site e página de contato.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-gray-300 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gold" />
                      E-mail
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20"
                      placeholder="contato@exemplo.com"
                      data-testid="input-contact-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-gray-300 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold" />
                      Telefone
                    </Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange("contactPhone", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20"
                      placeholder="(11) 99999-9999"
                      data-testid="input-contact-phone"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-gray-300 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gold" />
                    WhatsApp (número completo com DDD e DDI)
                  </Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20"
                    placeholder="5511999999999"
                    data-testid="input-whatsapp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold" />
                    Endereço
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20 resize-none"
                    placeholder="Av. Exemplo, 123 - Cidade, Estado"
                    rows={2}
                    data-testid="input-address"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-gold/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-gold" />
                  Redes Sociais
                </CardTitle>
                <CardDescription>
                  Links para suas redes sociais (deixe em branco para não exibir).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-gray-300 flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => handleChange("instagram", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20"
                      placeholder="https://instagram.com/seuperfil"
                      data-testid="input-instagram"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-gray-300 flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-blue-500" />
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) => handleChange("facebook", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20"
                      placeholder="https://facebook.com/suapagina"
                      data-testid="input-facebook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube" className="text-gray-300 flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-500" />
                      YouTube
                    </Label>
                    <Input
                      id="youtube"
                      value={formData.youtube}
                      onChange={(e) => handleChange("youtube", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20"
                      placeholder="https://youtube.com/@seucanal"
                      data-testid="input-youtube"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok" className="text-gray-300 flex items-center gap-2">
                      <SiTiktok className="w-4 h-4 text-white" />
                      TikTok
                    </Label>
                    <Input
                      id="tiktok"
                      value={formData.tiktok}
                      onChange={(e) => handleChange("tiktok", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20"
                      placeholder="https://tiktok.com/@seuperfil"
                      data-testid="input-tiktok"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-gold text-black hover:bg-gold/90 gap-2 px-8"
                data-testid="button-save-settings"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvar Configurações
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
