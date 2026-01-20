import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Layers, 
  Loader2,
  Save,
  Palette,
  Image,
  Eye,
  EyeOff
} from "lucide-react";
import type { ProductLine } from "@shared/schema";

interface FormErrors {
  slug?: string;
  name?: string;
  description?: string;
  accentColor?: string;
}

interface LineFormData {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  heroImage: string;
  featuredImage: string;
  accentColor: string;
  isActive: boolean;
  displayOrder: number;
}

const emptyFormData: LineFormData = {
  slug: "",
  name: "",
  description: "",
  longDescription: "",
  heroImage: "",
  featuredImage: "",
  accentColor: "#D4AF37",
  isActive: true,
  displayOrder: 0,
};

export default function AdminLines() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingLine, setEditingLine] = useState<ProductLine | null>(null);
  const [formData, setFormData] = useState<LineFormData>(emptyFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const token = localStorage.getItem("adminToken");

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
    }
    
    if (!formData.slug.trim()) {
      errors.slug = "Slug é obrigatório";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = "Slug deve conter apenas letras minúsculas, números e hífens";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Descrição é obrigatória";
    }
    
    if (!formData.accentColor.trim() || !/^#[0-9A-Fa-f]{6}$/.test(formData.accentColor)) {
      errors.accentColor = "Cor deve estar no formato hexadecimal (#RRGGBB)";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (!token) {
      setLocation("/admin");
    }
  }, [token, setLocation]);

  const { data: lines, isLoading } = useQuery<ProductLine[]>({
    queryKey: ["/api/admin/product-lines"],
    queryFn: async () => {
      const response = await fetch("/api/admin/product-lines", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const handleApiResponse = async (response: Response) => {
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
  };

  const createMutation = useMutation({
    mutationFn: async (data: LineFormData) => {
      const response = await fetch("/api/admin/product-lines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: data.slug.toLowerCase().replace(/\s+/g, "-"),
          name: data.name,
          description: data.description,
          longDescription: data.longDescription || null,
          heroImage: data.heroImage || null,
          featuredImage: data.featuredImage || null,
          accentColor: data.accentColor,
          isActive: data.isActive,
          displayOrder: data.displayOrder,
        }),
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/product-lines"] });
      queryClient.invalidateQueries({ queryKey: ["/api/product-lines"] });
      toast({ title: "Linha criada com sucesso!" });
      setIsDialogOpen(false);
      setFormData(emptyFormData);
    },
    onError: (error: Error) => {
      toast({ title: error.message || "Erro ao criar linha", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LineFormData }) => {
      const response = await fetch(`/api/admin/product-lines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: data.slug.toLowerCase().replace(/\s+/g, "-"),
          name: data.name,
          description: data.description,
          longDescription: data.longDescription || null,
          heroImage: data.heroImage || null,
          featuredImage: data.featuredImage || null,
          accentColor: data.accentColor,
          isActive: data.isActive,
          displayOrder: data.displayOrder,
        }),
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/product-lines"] });
      queryClient.invalidateQueries({ queryKey: ["/api/product-lines"] });
      toast({ title: "Linha atualizada com sucesso!" });
      setIsDialogOpen(false);
      setEditingLine(null);
      setFormData(emptyFormData);
    },
    onError: (error: Error) => {
      toast({ title: error.message || "Erro ao atualizar linha", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/product-lines/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/product-lines"] });
      queryClient.invalidateQueries({ queryKey: ["/api/product-lines"] });
      toast({ title: "Linha excluída com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir linha", variant: "destructive" });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const handleEdit = (line: ProductLine) => {
    setEditingLine(line);
    setFormErrors({});
    setFormData({
      slug: line.slug,
      name: line.name,
      description: line.description,
      longDescription: line.longDescription || "",
      heroImage: line.heroImage || "",
      featuredImage: line.featuredImage || "",
      accentColor: line.accentColor,
      isActive: line.isActive ?? true,
      displayOrder: line.displayOrder ?? 0,
    });
    setIsDialogOpen(true);
  };

  const handleNewLine = () => {
    setEditingLine(null);
    setFormErrors({});
    const nextOrder = lines ? Math.max(...lines.map(l => l.displayOrder || 0), 0) + 1 : 1;
    setFormData({ ...emptyFormData, displayOrder: nextOrder });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({ title: "Por favor, corrija os erros no formulário", variant: "destructive" });
      return;
    }
    
    if (editingLine) {
      updateMutation.mutate({ id: editingLine.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta linha? Isso não excluirá os produtos associados.")) {
      deleteMutation.mutate(id);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <AdminNav onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">
              Gerenciar Linhas
            </h1>
            <p className="text-gray-400">
              {lines?.length || 0} linhas de produtos cadastradas
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleNewLine} 
                className="bg-gold text-black hover:bg-gold/90 gap-2"
                data-testid="button-add-line"
              >
                <Plus className="h-4 w-4" />
                Nova Linha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingLine ? "Editar Linha" : "Nova Linha"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nome da Linha</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({ 
                          ...formData, 
                          name,
                          slug: editingLine ? formData.slug : generateSlug(name)
                        });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      placeholder="Ex: Fiber Force"
                      required
                      className={`bg-gray-800 border-gray-700 text-white focus:border-gold ${formErrors.name ? 'border-red-500' : ''}`}
                      data-testid="input-line-name"
                    />
                    {formErrors.name && <p className="text-xs text-red-400">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-gray-300">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => {
                        setFormData({ ...formData, slug: generateSlug(e.target.value) });
                        if (formErrors.slug) setFormErrors({ ...formErrors, slug: undefined });
                      }}
                      placeholder="fiber-force"
                      required
                      className={`bg-gray-800 border-gray-700 text-white focus:border-gold ${formErrors.slug ? 'border-red-500' : ''}`}
                      data-testid="input-line-slug"
                    />
                    {formErrors.slug && <p className="text-xs text-red-400">{formErrors.slug}</p>}
                    {!formErrors.slug && <p className="text-xs text-gray-500">Usado na URL: /linha/{formData.slug || "slug"}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Descrição Curta</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: undefined });
                    }}
                    placeholder="Descrição resumida da linha..."
                    rows={2}
                    required
                    className={`bg-gray-800 border-gray-700 text-white focus:border-gold resize-none ${formErrors.description ? 'border-red-500' : ''}`}
                    data-testid="input-line-description"
                  />
                  {formErrors.description && <p className="text-xs text-red-400">{formErrors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription" className="text-gray-300">Descrição Completa</Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    placeholder="Descrição detalhada para a página da linha..."
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold resize-none"
                    data-testid="input-line-long-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroImage" className="text-gray-300 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Imagem do Banner
                    </Label>
                    <Input
                      id="heroImage"
                      value={formData.heroImage}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="https://example.com/hero.jpg"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-line-hero-image"
                    />
                    {formData.heroImage && (
                      <div className="mt-2 rounded-lg overflow-hidden h-24 bg-gray-800">
                        <img 
                          src={formData.heroImage} 
                          alt="Hero preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="featuredImage" className="text-gray-300 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Imagem de Destaque
                    </Label>
                    <Input
                      id="featuredImage"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                      placeholder="https://example.com/featured.jpg"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-line-featured-image"
                    />
                    {formData.featuredImage && (
                      <div className="mt-2 rounded-lg overflow-hidden h-24 bg-gray-800">
                        <img 
                          src={formData.featuredImage} 
                          alt="Featured preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accentColor" className="text-gray-300 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Cor de Destaque
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        id="accentColor"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-16 h-10 p-1 bg-gray-800 border-gray-700 cursor-pointer"
                        data-testid="input-line-accent-color"
                      />
                      <Input
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        placeholder="#D4AF37"
                        className="flex-1 bg-gray-800 border-gray-700 text-white focus:border-gold"
                      />
                    </div>
                    <div 
                      className="mt-2 h-8 rounded-md" 
                      style={{ backgroundColor: formData.accentColor }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayOrder" className="text-gray-300">Ordem de Exibição</Label>
                    <Input
                      type="number"
                      id="displayOrder"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      min="0"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-line-display-order"
                    />
                    <p className="text-xs text-gray-500">Números menores aparecem primeiro</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    data-testid="switch-line-active"
                  />
                  <Label htmlFor="isActive" className="text-gray-300 flex items-center gap-2">
                    {formData.isActive ? (
                      <>
                        <Eye className="w-4 h-4 text-green-400" />
                        Linha visível no site
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-gray-500" />
                        Linha oculta do site
                      </>
                    )}
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gold text-black hover:bg-gold/90" 
                    disabled={isPending}
                    data-testid="button-save-line"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : lines && lines.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lines.map((line) => (
              <Card 
                key={line.id} 
                className="bg-gray-900/50 border-gray-800 hover:border-gold/40 transition-all duration-300 group golden-glow overflow-hidden"
                data-testid={`admin-line-${line.id}`}
              >
                {line.heroImage && (
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={line.heroImage} 
                      alt={line.name}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                  </div>
                )}
                <CardContent className={`p-5 ${!line.heroImage ? 'pt-5' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: line.accentColor }}
                        />
                        <h3 className="font-semibold text-white group-hover:text-gold transition-colors">
                          {line.name}
                        </h3>
                        {!line.isActive && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400">
                            Oculta
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-mono">/linha/{line.slug}</p>
                    </div>
                    <span 
                      className="text-sm font-medium px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: `${line.accentColor}20`,
                        color: line.accentColor
                      }}
                    >
                      #{line.displayOrder}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {line.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(line)}
                      className="flex-1 text-gray-400 hover:text-white hover:bg-gray-800 gap-2"
                      data-testid={`button-edit-line-${line.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(line.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      data-testid={`button-delete-line-${line.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <Layers className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Nenhuma linha cadastrada
              </h3>
              <p className="text-gray-500 text-center max-w-md mb-4">
                Crie linhas de produtos para organizar seu catálogo.
              </p>
              <Button onClick={handleNewLine} className="bg-gold text-black hover:bg-gold/90 gap-2">
                <Plus className="h-4 w-4" />
                Criar primeira linha
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
