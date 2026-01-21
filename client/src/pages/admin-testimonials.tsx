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
  Loader2,
  Save,
  EyeOff,
  MessageSquare,
  Star,
  User
} from "lucide-react";
import type { Testimonial } from "@shared/schema";

interface FormErrors {
  name?: string;
  role?: string;
  content?: string;
}

interface TestimonialFormData {
  name: string;
  role: string;
  content: string;
  rating: number;
  displayOrder: number;
  isActive: boolean;
}

const emptyFormData: TestimonialFormData = {
  name: "",
  role: "",
  content: "",
  rating: 5,
  displayOrder: 0,
  isActive: true,
};

export default function AdminTestimonials() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>(emptyFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const token = localStorage.getItem("adminToken");

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
    }
    
    if (!formData.role.trim()) {
      errors.role = "Cargo/Função é obrigatório";
    }
    
    if (!formData.content.trim()) {
      errors.content = "Depoimento é obrigatório";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (!token) {
      setLocation("/admin");
    }
  }, [token, setLocation]);

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/admin/testimonials", {
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
    mutationFn: async (data: TestimonialFormData) => {
      const response = await fetch("/api/admin/testimonials", {
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Depoimento criado com sucesso!" });
      setIsDialogOpen(false);
      setFormData(emptyFormData);
    },
    onError: (error: Error) => {
      toast({ title: error.message || "Erro ao criar depoimento", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TestimonialFormData }) => {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Depoimento atualizado com sucesso!" });
      setIsDialogOpen(false);
      setEditingTestimonial(null);
      setFormData(emptyFormData);
    },
    onError: (error: Error) => {
      toast({ title: error.message || "Erro ao atualizar depoimento", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Depoimento excluído com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir depoimento", variant: "destructive" });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormErrors({});
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating ?? 5,
      displayOrder: testimonial.displayOrder ?? 0,
      isActive: testimonial.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleNewTestimonial = () => {
    setEditingTestimonial(null);
    setFormErrors({});
    const nextOrder = testimonials ? Math.max(...testimonials.map(t => t.displayOrder || 0), 0) + 1 : 1;
    setFormData({ ...emptyFormData, displayOrder: nextOrder });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({ title: "Por favor, corrija os erros no formulário", variant: "destructive" });
      return;
    }
    
    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este depoimento?")) {
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
              Gerenciar Depoimentos
            </h1>
            <p className="text-gray-400">
              {testimonials?.length || 0} depoimentos cadastrados
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleNewTestimonial} 
                className="bg-gold text-black hover:bg-gold/90 gap-2"
                data-testid="button-add-testimonial"
              >
                <Plus className="h-4 w-4" />
                Novo Depoimento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingTestimonial ? "Editar Depoimento" : "Novo Depoimento"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      placeholder="Ex: Maria Silva"
                      required
                      className={`bg-gray-800 border-gray-700 text-white focus:border-gold ${formErrors.name ? 'border-red-500' : ''}`}
                      data-testid="input-testimonial-name"
                    />
                    {formErrors.name && <p className="text-xs text-red-400">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-300">Cargo/Função</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => {
                        setFormData({ ...formData, role: e.target.value });
                        if (formErrors.role) setFormErrors({ ...formErrors, role: undefined });
                      }}
                      placeholder="Ex: Cabeleireira"
                      required
                      className={`bg-gray-800 border-gray-700 text-white focus:border-gold ${formErrors.role ? 'border-red-500' : ''}`}
                      data-testid="input-testimonial-role"
                    />
                    {formErrors.role && <p className="text-xs text-red-400">{formErrors.role}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-gray-300">Depoimento</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => {
                      setFormData({ ...formData, content: e.target.value });
                      if (formErrors.content) setFormErrors({ ...formErrors, content: undefined });
                    }}
                    placeholder="O que a pessoa disse sobre os produtos..."
                    rows={4}
                    required
                    className={`bg-gray-800 border-gray-700 text-white focus:border-gold resize-none ${formErrors.content ? 'border-red-500' : ''}`}
                    data-testid="input-testimonial-content"
                  />
                  {formErrors.content && <p className="text-xs text-red-400">{formErrors.content}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Avaliação</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 transition-transform hover:scale-110"
                        data-testid={`button-rating-${star}`}
                      >
                        <Star 
                          className={`w-6 h-6 ${star <= formData.rating ? 'text-gold fill-gold' : 'text-gray-600'}`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-gray-400 text-sm">{formData.rating} estrelas</span>
                  </div>
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
                      data-testid="input-testimonial-order"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Ativo</Label>
                    <div className="flex items-center gap-2 h-9">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        data-testid="switch-testimonial-active"
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
                    data-testid="button-save-testimonial"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {editingTestimonial ? "Salvar" : "Criar"}
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
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card 
                key={testimonial.id}
                className="bg-gray-900/50 border-gray-800"
                data-testid={`card-testimonial-${testimonial.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{testimonial.name}</h3>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    {!testimonial.isActive && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                        <EyeOff className="w-3 h-3" />
                        Oculto
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= (testimonial.rating ?? 5) ? 'text-gold fill-gold' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-xs">
                      Ordem: {testimonial.displayOrder}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(testimonial)}
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                        data-testid={`button-edit-testimonial-${testimonial.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(testimonial.id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-gray-800"
                        data-testid={`button-delete-testimonial-${testimonial.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum depoimento cadastrado
              </h3>
              <p className="text-gray-400 mb-4">
                Adicione depoimentos de clientes satisfeitos
              </p>
              <Button 
                onClick={handleNewTestimonial}
                className="bg-gold text-black hover:bg-gold/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Depoimento
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
