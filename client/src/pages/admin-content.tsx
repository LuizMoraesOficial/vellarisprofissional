import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  Loader2,
  Save,
  Sparkles,
  MessageSquare,
  Phone,
  Megaphone,
  FileText
} from "lucide-react";
import type { SiteSettings } from "@shared/schema";

export default function AdminContent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const token = localStorage.getItem("adminToken");

  const [benefitsForm, setBenefitsForm] = useState({
    benefitsSectionTitle: "",
    benefitsSectionSubtitle: "",
    benefitsSectionLabel: "",
  });

  const [testimonialsForm, setTestimonialsForm] = useState({
    testimonialsSectionTitle: "",
    testimonialsSectionSubtitle: "",
    testimonialsSectionLabel: "",
    testimonialsSectionImage: "",
  });

  const [ctaForm, setCtaForm] = useState({
    ctaSectionTitle: "",
    ctaSectionSubtitle: "",
  });

  const [contactForm, setContactForm] = useState({
    contactPageTitle: "",
    contactPageSubtitle: "",
    contactPageLabel: "",
    contactPageProfessionalTitle: "",
    contactPageProfessionalText: "",
    contactPageProfessionalEmail: "",
  });

  const [footerForm, setFooterForm] = useState({
    footerDescription: "",
  });

  useEffect(() => {
    if (!token) {
      setLocation("/admin");
    }
  }, [token, setLocation]);

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/admin/settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setBenefitsForm({
        benefitsSectionTitle: settings.benefitsSectionTitle || "",
        benefitsSectionSubtitle: settings.benefitsSectionSubtitle || "",
        benefitsSectionLabel: settings.benefitsSectionLabel || "",
      });
      setTestimonialsForm({
        testimonialsSectionTitle: settings.testimonialsSectionTitle || "",
        testimonialsSectionSubtitle: settings.testimonialsSectionSubtitle || "",
        testimonialsSectionLabel: settings.testimonialsSectionLabel || "",
        testimonialsSectionImage: settings.testimonialsSectionImage || "",
      });
      setCtaForm({
        ctaSectionTitle: settings.ctaSectionTitle || "",
        ctaSectionSubtitle: settings.ctaSectionSubtitle || "",
      });
      setContactForm({
        contactPageTitle: settings.contactPageTitle || "",
        contactPageSubtitle: settings.contactPageSubtitle || "",
        contactPageLabel: settings.contactPageLabel || "",
        contactPageProfessionalTitle: settings.contactPageProfessionalTitle || "",
        contactPageProfessionalText: settings.contactPageProfessionalText || "",
        contactPageProfessionalEmail: settings.contactPageProfessionalEmail || "",
      });
      setFooterForm({
        footerDescription: settings.footerDescription || "",
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<SiteSettings>) => {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setLocation("/admin");
        throw new Error("Unauthorized");
      }
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Request failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/public"] });
      toast({ title: "Configurações salvas com sucesso!" });
      setIsSaving(false);
    },
    onError: (error: Error) => {
      toast({ title: error.message || "Erro ao salvar", variant: "destructive" });
      setIsSaving(false);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const saveBenefits = () => {
    setIsSaving(true);
    updateMutation.mutate(benefitsForm);
  };

  const saveTestimonials = () => {
    setIsSaving(true);
    updateMutation.mutate(testimonialsForm);
  };

  const saveCta = () => {
    setIsSaving(true);
    updateMutation.mutate(ctaForm);
  };

  const saveContact = () => {
    setIsSaving(true);
    updateMutation.mutate(contactForm);
  };

  const saveFooter = () => {
    setIsSaving(true);
    updateMutation.mutate(footerForm);
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <AdminNav onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Gerenciar Conteúdo
          </h1>
          <p className="text-gray-400">
            Edite os textos e títulos das seções do site
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          <Tabs defaultValue="benefits" className="space-y-6">
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="benefits" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Sparkles className="w-4 h-4 mr-2" />
                Destaques
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <MessageSquare className="w-4 h-4 mr-2" />
                Depoimentos
              </TabsTrigger>
              <TabsTrigger value="cta" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Megaphone className="w-4 h-4 mr-2" />
                CTA
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Phone className="w-4 h-4 mr-2" />
                Contato
              </TabsTrigger>
              <TabsTrigger value="footer" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <FileText className="w-4 h-4 mr-2" />
                Rodapé
              </TabsTrigger>
            </TabsList>

            <TabsContent value="benefits">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" />
                    Seção de Destaques (Por que VELLARIS)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Etiqueta</Label>
                    <Input
                      value={benefitsForm.benefitsSectionLabel}
                      onChange={(e) => setBenefitsForm({ ...benefitsForm, benefitsSectionLabel: e.target.value })}
                      placeholder="Ex: Por que VELLARIS"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-benefits-label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Título Principal</Label>
                    <Input
                      value={benefitsForm.benefitsSectionTitle}
                      onChange={(e) => setBenefitsForm({ ...benefitsForm, benefitsSectionTitle: e.target.value })}
                      placeholder="Ex: Excelência em cada fórmula"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-benefits-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Subtítulo</Label>
                    <Textarea
                      value={benefitsForm.benefitsSectionSubtitle}
                      onChange={(e) => setBenefitsForm({ ...benefitsForm, benefitsSectionSubtitle: e.target.value })}
                      placeholder="Descrição da seção..."
                      rows={3}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold resize-none"
                      data-testid="input-benefits-subtitle"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={saveBenefits}
                      disabled={isSaving}
                      className="bg-gold text-black hover:bg-gold/90 gap-2"
                      data-testid="button-save-benefits"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gold" />
                    Seção de Depoimentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Etiqueta</Label>
                    <Input
                      value={testimonialsForm.testimonialsSectionLabel}
                      onChange={(e) => setTestimonialsForm({ ...testimonialsForm, testimonialsSectionLabel: e.target.value })}
                      placeholder="Ex: Depoimentos"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-testimonials-label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Título Principal</Label>
                    <Input
                      value={testimonialsForm.testimonialsSectionTitle}
                      onChange={(e) => setTestimonialsForm({ ...testimonialsForm, testimonialsSectionTitle: e.target.value })}
                      placeholder="Ex: O que dizem sobre nós"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-testimonials-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Subtítulo</Label>
                    <Textarea
                      value={testimonialsForm.testimonialsSectionSubtitle}
                      onChange={(e) => setTestimonialsForm({ ...testimonialsForm, testimonialsSectionSubtitle: e.target.value })}
                      placeholder="Descrição da seção..."
                      rows={3}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold resize-none"
                      data-testid="input-testimonials-subtitle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Imagem de Fundo (URL)</Label>
                    <Input
                      value={testimonialsForm.testimonialsSectionImage}
                      onChange={(e) => setTestimonialsForm({ ...testimonialsForm, testimonialsSectionImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-testimonials-image"
                    />
                    {testimonialsForm.testimonialsSectionImage && (
                      <div className="mt-2 rounded-lg overflow-hidden h-32 bg-gray-800">
                        <img 
                          src={testimonialsForm.testimonialsSectionImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={saveTestimonials}
                      disabled={isSaving}
                      className="bg-gold text-black hover:bg-gold/90 gap-2"
                      data-testid="button-save-testimonials"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cta">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-gold" />
                    Seção de CTA (Call to Action)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Título</Label>
                    <Input
                      value={ctaForm.ctaSectionTitle}
                      onChange={(e) => setCtaForm({ ...ctaForm, ctaSectionTitle: e.target.value })}
                      placeholder="Ex: Pronto para transformar seus cabelos?"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-cta-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Subtítulo</Label>
                    <Textarea
                      value={ctaForm.ctaSectionSubtitle}
                      onChange={(e) => setCtaForm({ ...ctaForm, ctaSectionSubtitle: e.target.value })}
                      placeholder="Texto de apoio..."
                      rows={3}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold resize-none"
                      data-testid="input-cta-subtitle"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={saveCta}
                      disabled={isSaving}
                      className="bg-gold text-black hover:bg-gold/90 gap-2"
                      data-testid="button-save-cta"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gold" />
                    Página de Contato (Fale Conosco)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Etiqueta</Label>
                    <Input
                      value={contactForm.contactPageLabel}
                      onChange={(e) => setContactForm({ ...contactForm, contactPageLabel: e.target.value })}
                      placeholder="Ex: Fale Conosco"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-contact-label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Título Principal</Label>
                    <Input
                      value={contactForm.contactPageTitle}
                      onChange={(e) => setContactForm({ ...contactForm, contactPageTitle: e.target.value })}
                      placeholder="Ex: Entre em Contato"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-contact-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Subtítulo</Label>
                    <Textarea
                      value={contactForm.contactPageSubtitle}
                      onChange={(e) => setContactForm({ ...contactForm, contactPageSubtitle: e.target.value })}
                      placeholder="Texto de introdução..."
                      rows={2}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold resize-none"
                      data-testid="input-contact-subtitle"
                    />
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <h4 className="text-white font-medium mb-4">Seção Para Profissionais</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Título</Label>
                        <Input
                          value={contactForm.contactPageProfessionalTitle}
                          onChange={(e) => setContactForm({ ...contactForm, contactPageProfessionalTitle: e.target.value })}
                          placeholder="Ex: Para Profissionais"
                          className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                          data-testid="input-contact-professional-title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Texto</Label>
                        <Textarea
                          value={contactForm.contactPageProfessionalText}
                          onChange={(e) => setContactForm({ ...contactForm, contactPageProfessionalText: e.target.value })}
                          placeholder="Descrição para profissionais..."
                          rows={3}
                          className="bg-gray-800 border-gray-700 text-white focus:border-gold resize-none"
                          data-testid="input-contact-professional-text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Email para Profissionais</Label>
                        <Input
                          value={contactForm.contactPageProfessionalEmail}
                          onChange={(e) => setContactForm({ ...contactForm, contactPageProfessionalEmail: e.target.value })}
                          placeholder="profissionais@vellaris.com.br"
                          className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                          data-testid="input-contact-professional-email"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={saveContact}
                      disabled={isSaving}
                      className="bg-gold text-black hover:bg-gold/90 gap-2"
                      data-testid="button-save-contact"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="footer">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold" />
                    Rodapé do Site
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Descrição do Rodapé</Label>
                    <Textarea
                      value={footerForm.footerDescription}
                      onChange={(e) => setFooterForm({ ...footerForm, footerDescription: e.target.value })}
                      placeholder="Descrição da empresa no rodapé..."
                      rows={4}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold resize-none"
                      data-testid="input-footer-description"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={saveFooter}
                      disabled={isSaving}
                      className="bg-gold text-black hover:bg-gold/90 gap-2"
                      data-testid="button-save-footer"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
