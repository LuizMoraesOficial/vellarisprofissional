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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Leaf,
  Shield,
  Droplets,
  Zap,
  Heart,
  Star,
  Award
} from "lucide-react";
import type { Feature } from "@shared/schema";

const iconOptions = [
  { value: "sparkles", label: "Brilho", icon: Sparkles },
  { value: "leaf", label: "Folha/Natural", icon: Leaf },
  { value: "shield", label: "Escudo/Proteção", icon: Shield },
  { value: "droplets", label: "Gotas/Hidratação", icon: Droplets },
  { value: "zap", label: "Energia", icon: Zap },
  { value: "heart", label: "Coração", icon: Heart },
  { value: "star", label: "Estrela", icon: Star },
  { value: "award", label: "Prêmio", icon: Award },
];

const getIconComponent = (iconName: string) => {
  const found = iconOptions.find(opt => opt.value === iconName);
  return found ? found.icon : Sparkles;
};

interface FormErrors {
  title?: string;
  description?: string;
}

interface FeatureFormData {
  icon: string;
  title: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

const emptyFormData: FeatureFormData = {
  icon: "sparkles",
  title: "",
  description: "",
  displayOrder: 0,
  isActive: true,
};

export default function AdminFeatures() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState<FeatureFormData>(emptyFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const token = localStorage.getItem("adminToken");

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.title.trim()) {
      errors.title = "Título é obrigatório";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Descrição é obrigatória";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (!token) {
      setLocation("/admin");
    }
  }, [token, setLocation]);

  const { data: features, isLoading } = useQuery<Feature[]>({
    queryKey: ["/api/admin/features"],
    queryFn: async () => {
      const response = await fetch("/api/admin/features", {
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
    mutationFn: async (data: FeatureFormData) => {
      const response = await fetch("/api/admin/features", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/features"] });
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
      toast({ title: "Destaque criado com sucesso!" });
      setIsDialogOpen(false);
      setFormData(emptyFormData);
    },
    onError: (error: Error) => {
      toast({ title: error.message || "Erro ao criar destaque", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FeatureFormData }) => {
      const response = await fetch(`/api/admin/features/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/features"] });
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
      toast({ title: "Destaque atualizado com sucesso!" });
      setIsDialogOpen(false);
      setEditingFeature(null);
      setFormData(emptyFormData);
    },
    onError: (error: Error) => {
      toast({ title: error.message || "Erro ao atualizar destaque", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/features/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/features"] });
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
      toast({ title: "Destaque excluído com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir destaque", variant: "destructive" });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setFormErrors({});
    setFormData({
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
      displayOrder: feature.displayOrder ?? 0,
      isActive: feature.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleNewFeature = () => {
    setEditingFeature(null);
    setFormErrors({});
    const nextOrder = features ? Math.max(...features.map(f => f.displayOrder || 0), 0) + 1 : 1;
    setFormData({ ...emptyFormData, displayOrder: nextOrder });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({ title: "Por favor, corrija os erros no formulário", variant: "destructive" });
      return;
    }
    
    if (editingFeature) {
      updateMutation.mutate({ id: editingFeature.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este destaque?")) {
      deleteMutation.mutate(id);
    }
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
              Gerenciar Destaques
            </h1>
            <p className="text-gray-400">
              {features?.length || 0} destaques cadastrados
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleNewFeature} 
                className="bg-gold text-black hover:bg-gold/90 gap-2"
                data-testid="button-add-feature"
              >
                <Plus className="h-4 w-4" />
                Novo Destaque
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingFeature ? "Editar Destaque" : "Novo Destaque"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-gray-300">Ícone</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione um ícone" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="text-white hover:bg-gray-700"
                          >
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4 text-gold" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) setFormErrors({ ...formErrors, title: undefined });
                    }}
                    placeholder="Ex: Tecnologia Avançada"
                    required
                    className={`bg-gray-800 border-gray-700 text-white focus:border-gold ${formErrors.title ? 'border-red-500' : ''}`}
                    data-testid="input-feature-title"
                  />
                  {formErrors.title && <p className="text-xs text-red-400">{formErrors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: undefined });
                    }}
                    placeholder="Descrição do destaque..."
                    rows={3}
                    required
                    className={`bg-gray-800 border-gray-700 text-white focus:border-gold resize-none ${formErrors.description ? 'border-red-500' : ''}`}
                    data-testid="input-feature-description"
                  />
                  {formErrors.description && <p className="text-xs text-red-400">{formErrors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayOrder" className="text-gray-300">Ordem de Exibição</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-feature-order"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Ativo</Label>
                    <div className="flex items-center gap-2 h-9">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        data-testid="switch-feature-active"
                      />
                      <span className="text-gray-400 text-sm">
                        {formData.isActive ? "Visível no site" : "Oculto"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-700 text-gray-300"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-gold text-black hover:bg-gold/90 gap-2"
                    data-testid="button-save-feature"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {editingFeature ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : features && features.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => {
              const IconComponent = getIconComponent(feature.icon);
              return (
                <Card 
                  key={feature.id}
                  className="bg-gray-900/50 border-gray-800"
                  data-testid={`card-feature-${feature.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {feature.title}
                          </h3>
                          {!feature.isActive && (
                            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                              <EyeOff className="w-3 h-3" />
                              Oculto
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {feature.description}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          Ordem: {feature.displayOrder}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(feature)}
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                          data-testid={`button-edit-feature-${feature.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(feature.id)}
                          className="text-gray-400 hover:text-red-400 hover:bg-gray-800"
                          data-testid={`button-delete-feature-${feature.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum destaque cadastrado
              </h3>
              <p className="text-gray-400 mb-4">
                Adicione destaques para mostrar os diferenciais dos produtos
              </p>
              <Button 
                onClick={handleNewFeature}
                className="bg-gold text-black hover:bg-gold/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Destaque
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
