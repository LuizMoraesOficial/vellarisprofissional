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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus,
  Pencil,
  Trash2,
  Loader2,
  LayoutGrid,
  GripVertical,
  Image,
  Video,
  FileText,
  Star,
  Package
} from "lucide-react";
import type { CustomSection, CustomSectionItem } from "@shared/schema";

const sectionTypes = [
  { value: "products", label: "Produtos", icon: Package },
  { value: "gallery", label: "Galeria de Imagens", icon: Image },
  { value: "videos", label: "Vídeos", icon: Video },
  { value: "posts", label: "Posts/Novidades", icon: FileText },
  { value: "highlights", label: "Destaques", icon: Star },
];

const positionOptions = [
  { value: "after-hero", label: "Após o Banner Principal" },
  { value: "after-product-lines", label: "Após as Linhas de Produtos" },
  { value: "before-benefits", label: "Antes dos Benefícios" },
  { value: "after-benefits", label: "Após os Benefícios" },
  { value: "before-testimonials", label: "Antes dos Depoimentos" },
];

interface SectionWithItems extends CustomSection {
  items?: CustomSectionItem[];
}

export default function AdminSections() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const token = localStorage.getItem("adminToken");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
  const [deleteSection, setDeleteSection] = useState<CustomSection | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionWithItems | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomSectionItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<CustomSectionItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "products",
    title: "",
    subtitle: "",
    label: "",
    position: "after-product-lines",
    isActive: true,
  });

  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    image: "",
    videoUrl: "",
    link: "",
    isActive: true,
  });

  useEffect(() => {
    if (!token) {
      setLocation("/admin");
    }
  }, [token, setLocation]);

  const { data: sections, isLoading } = useQuery<CustomSection[]>({
    queryKey: ["/api/admin/custom-sections"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch("/api/admin/custom-sections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        setLocation("/admin");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch sections");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/custom-sections", data, {
        Authorization: `Bearer ${token}`,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/custom-sections"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Sucesso!",
        description: "Seção criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar seção.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const res = await apiRequest("PUT", `/api/admin/custom-sections/${id}`, data, {
        Authorization: `Bearer ${token}`,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/custom-sections"] });
      setIsDialogOpen(false);
      setEditingSection(null);
      resetForm();
      toast({
        title: "Sucesso!",
        description: "Seção atualizada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar seção.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/custom-sections/${id}`, undefined, {
        Authorization: `Bearer ${token}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/custom-sections"] });
      setDeleteSection(null);
      toast({
        title: "Sucesso!",
        description: "Seção excluída com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir seção.",
        variant: "destructive",
      });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async ({ sectionId, data }: { sectionId: string; data: typeof itemFormData }) => {
      const res = await apiRequest("POST", `/api/admin/custom-sections/${sectionId}/items`, data, {
        Authorization: `Bearer ${token}`,
      });
      return res.json();
    },
    onSuccess: () => {
      if (selectedSection) {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/custom-sections", selectedSection.id] });
        refetchSectionDetails(selectedSection.id);
      }
      setIsItemDialogOpen(false);
      resetItemForm();
      toast({
        title: "Sucesso!",
        description: "Item adicionado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao adicionar item.",
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof itemFormData> }) => {
      const res = await apiRequest("PUT", `/api/admin/section-items/${id}`, data, {
        Authorization: `Bearer ${token}`,
      });
      return res.json();
    },
    onSuccess: () => {
      if (selectedSection) {
        refetchSectionDetails(selectedSection.id);
      }
      setIsItemDialogOpen(false);
      setEditingItem(null);
      resetItemForm();
      toast({
        title: "Sucesso!",
        description: "Item atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar item.",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/section-items/${id}`, undefined, {
        Authorization: `Bearer ${token}`,
      });
    },
    onSuccess: () => {
      if (selectedSection) {
        refetchSectionDetails(selectedSection.id);
      }
      setDeleteItem(null);
      toast({
        title: "Sucesso!",
        description: "Item excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir item.",
        variant: "destructive",
      });
    },
  });

  const refetchSectionDetails = async (sectionId: string) => {
    try {
      const res = await fetch(`/api/admin/custom-sections/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedSection(data);
      }
    } catch (error) {
      console.error("Failed to refetch section details");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      type: "products",
      title: "",
      subtitle: "",
      label: "",
      position: "after-product-lines",
      isActive: true,
    });
  };

  const resetItemForm = () => {
    setItemFormData({
      title: "",
      description: "",
      image: "",
      videoUrl: "",
      link: "",
      isActive: true,
    });
  };

  const handleEdit = (section: CustomSection) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      slug: section.slug,
      type: section.type,
      title: section.title,
      subtitle: section.subtitle || "",
      label: section.label || "",
      position: section.position,
      isActive: section.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: CustomSectionItem) => {
    setEditingItem(item);
    setItemFormData({
      title: item.title,
      description: item.description || "",
      image: item.image || "",
      videoUrl: item.videoUrl || "",
      link: item.link || "",
      isActive: item.isActive ?? true,
    });
    setIsItemDialogOpen(true);
  };

  const handleOpenSection = async (section: CustomSection) => {
    try {
      const res = await fetch(`/api/admin/custom-sections/${section.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedSection(data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar detalhes da seção.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSection) {
      updateMutation.mutate({ id: editingSection.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;
    
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data: itemFormData });
    } else {
      createItemMutation.mutate({ sectionId: selectedSection.id, data: itemFormData });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const getSectionTypeIcon = (type: string) => {
    const sectionType = sectionTypes.find(t => t.value === type);
    return sectionType?.icon || LayoutGrid;
  };

  const getSectionTypeLabel = (type: string) => {
    const sectionType = sectionTypes.find(t => t.value === type);
    return sectionType?.label || type;
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <AdminNav onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedSection ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedSection(null)}
                  className="text-gray-400 hover:text-white mb-2"
                  data-testid="button-back-sections"
                >
                  ← Voltar para Seções
                </Button>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">
                  {selectedSection.name}
                </h1>
                <p className="text-gray-400">
                  Gerencie os itens desta seção personalizada.
                </p>
              </div>
              <Button
                onClick={() => {
                  resetItemForm();
                  setEditingItem(null);
                  setIsItemDialogOpen(true);
                }}
                className="bg-gold text-black gap-2"
                data-testid="button-add-item"
              >
                <Plus className="w-4 h-4" />
                Adicionar Item
              </Button>
            </div>

            {selectedSection.items && selectedSection.items.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedSection.items.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-gray-900/50 border-gray-800 hover:border-gold/30 transition-all duration-300"
                    data-testid={`card-item-${item.id}`}
                  >
                    {item.image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-white text-lg" data-testid={`text-item-title-${item.id}`}>{item.title}</CardTitle>
                        <Badge variant={item.isActive ? "default" : "secondary"} data-testid={`badge-item-status-${item.id}`}>
                          {item.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      {item.description && (
                        <CardDescription className="line-clamp-2" data-testid={`text-item-desc-${item.id}`}>
                          {item.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                          className="border-gold/30 text-gold"
                          data-testid={`button-edit-item-${item.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteItem(item)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          data-testid={`button-delete-item-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900/50 border-gray-800 border-amber-500/30">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <LayoutGrid className="w-12 h-12 text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Esta seção ainda não tem itens
                  </h3>
                  <p className="text-gray-400 text-center max-w-md mb-2">
                    A seção só será exibida no site quando tiver pelo menos um item.
                  </p>
                  <p className="text-amber-500/80 text-sm text-center max-w-md mb-6">
                    Adicione itens abaixo para ativar a seção na página inicial.
                  </p>
                  <Button
                    onClick={() => {
                      resetItemForm();
                      setEditingItem(null);
                      setIsItemDialogOpen(true);
                    }}
                    className="bg-gold text-black gap-2"
                    data-testid="button-add-first-item"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Primeiro Item
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">
                  Seções Personalizadas
                </h1>
                <p className="text-gray-400">
                  Crie e gerencie seções personalizadas para a página inicial.
                </p>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingSection(null);
                  setIsDialogOpen(true);
                }}
                className="bg-gold text-black gap-2"
                data-testid="button-add-section"
              >
                <Plus className="w-4 h-4" />
                Nova Seção
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : !sections || sections.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <LayoutGrid className="w-16 h-16 text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Nenhuma seção personalizada
                  </h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">
                    Crie seções personalizadas para adicionar novos tipos de conteúdo à página inicial.
                  </p>
                  <Button
                    onClick={() => {
                      resetForm();
                      setEditingSection(null);
                      setIsDialogOpen(true);
                    }}
                    className="bg-gold text-black gap-2"
                    data-testid="button-add-first-section"
                  >
                    <Plus className="w-4 h-4" />
                    Criar Primeira Seção
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => {
                  const TypeIcon = getSectionTypeIcon(section.type);
                  return (
                    <Card
                      key={section.id}
                      className="bg-gray-900/50 border-gray-800 hover:border-gold/30 transition-all duration-300 cursor-pointer"
                      onClick={() => handleOpenSection(section)}
                      data-testid={`card-section-${section.id}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                              <TypeIcon className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                              <CardTitle className="text-white" data-testid={`text-section-name-${section.id}`}>{section.name}</CardTitle>
                              <CardDescription className="text-xs" data-testid={`text-section-type-${section.id}`}>
                                {getSectionTypeLabel(section.type)}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={section.isActive ? "default" : "secondary"}>
                            {section.isActive ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 text-sm mb-4">{section.title}</p>
                        <div className="flex flex-col gap-3">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSection(section);
                            }}
                            className="w-full bg-gold text-black"
                            data-testid={`button-manage-items-${section.id}`}
                          >
                            <LayoutGrid className="w-4 h-4 mr-2" />
                            Gerenciar Itens
                          </Button>
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(section)}
                              className="border-gold/30 text-gold flex-1"
                              data-testid={`button-edit-section-${section.id}`}
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteSection(section)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              data-testid={`button-delete-section-${section.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingSection ? "Editar Seção" : "Nova Seção Personalizada"}
            </DialogTitle>
            <DialogDescription>
              {editingSection 
                ? "Edite as informações da seção." 
                : "Crie uma nova seção para a página inicial."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Nome da Seção</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: !editingSection ? generateSlug(e.target.value) : formData.slug
                  });
                }}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: Novidades"
                required
                data-testid="input-section-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-300">Tipo de Conteúdo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {sectionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-gray-300">Posição na Página</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione a posição" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {positionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">Título da Seção</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: Confira nossas novidades"
                required
                data-testid="input-section-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-gray-300">Subtítulo (opcional)</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white resize-none"
                placeholder="Descrição breve da seção"
                rows={2}
                data-testid="input-section-subtitle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="label" className="text-gray-300">Label/Tag (opcional)</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: NOVIDADES"
                data-testid="input-section-label"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <div>
                <Label htmlFor="isActive" className="text-gray-200">Seção Ativa</Label>
                <p className="text-xs text-gray-400">Exibir esta seção no site</p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-section-active"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-400"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-gold text-black"
                data-testid="button-save-section"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingSection ? (
                  "Salvar Alterações"
                ) : (
                  "Criar Seção"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingItem ? "Editar Item" : "Novo Item"}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? "Edite as informações do item." 
                : "Adicione um novo item à seção."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleItemSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemTitle" className="text-gray-300">Título</Label>
              <Input
                id="itemTitle"
                value={itemFormData.title}
                onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Título do item"
                required
                data-testid="input-item-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemDescription" className="text-gray-300">Descrição (opcional)</Label>
              <Textarea
                id="itemDescription"
                value={itemFormData.description}
                onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white resize-none"
                placeholder="Descrição do item"
                rows={3}
                data-testid="input-item-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemImage" className="text-gray-300">URL da Imagem (opcional)</Label>
              <Input
                id="itemImage"
                value={itemFormData.image}
                onChange={(e) => setItemFormData({ ...itemFormData, image: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="https://exemplo.com/imagem.jpg"
                data-testid="input-item-image"
              />
              {itemFormData.image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-gray-700 h-32">
                  <img src={itemFormData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {selectedSection?.type === "videos" && (
              <div className="space-y-2">
                <Label htmlFor="itemVideoUrl" className="text-gray-300">URL do Vídeo</Label>
                <Input
                  id="itemVideoUrl"
                  value={itemFormData.videoUrl}
                  onChange={(e) => setItemFormData({ ...itemFormData, videoUrl: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="https://youtube.com/watch?v=..."
                  data-testid="input-item-video"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="itemLink" className="text-gray-300">Link (opcional)</Label>
              <Input
                id="itemLink"
                value={itemFormData.link}
                onChange={(e) => setItemFormData({ ...itemFormData, link: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="https://..."
                data-testid="input-item-link"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <div>
                <Label htmlFor="itemIsActive" className="text-gray-200">Item Ativo</Label>
                <p className="text-xs text-gray-400">Exibir este item na seção</p>
              </div>
              <Switch
                id="itemIsActive"
                checked={itemFormData.isActive}
                onCheckedChange={(checked) => setItemFormData({ ...itemFormData, isActive: checked })}
                data-testid="switch-item-active"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsItemDialogOpen(false)}
                className="text-gray-400"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createItemMutation.isPending || updateItemMutation.isPending}
                className="bg-gold text-black"
                data-testid="button-save-item"
              >
                {(createItemMutation.isPending || updateItemMutation.isPending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingItem ? (
                  "Salvar Alterações"
                ) : (
                  "Adicionar Item"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteSection} onOpenChange={() => setDeleteSection(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir seção?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A seção "{deleteSection?.name}" e todos os seus itens serão excluídos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteSection && deleteMutation.mutate(deleteSection.id)}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete-section"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir item?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O item "{deleteItem?.title}" será excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItem && deleteItemMutation.mutate(deleteItem.id)}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete-item"
            >
              {deleteItemMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
