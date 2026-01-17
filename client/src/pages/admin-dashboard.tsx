import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  LogOut, 
  Package, 
  Loader2,
  Save
} from "lucide-react";
import type { Product } from "@shared/schema";

const categories = ["Tratamento", "Hidratação", "Finalização"];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price / 100);
}

function parsePriceInput(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, "").replace(",", ".");
  return Math.round(parseFloat(cleaned) * 100) || 0;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  benefits: string;
  featured: boolean;
}

const emptyFormData: ProductFormData = {
  name: "",
  description: "",
  category: "Tratamento",
  price: "",
  image: "/products/default.jpg",
  benefits: "",
  featured: false,
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyFormData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLocation("/admin");
    }
  }, [setLocation]);

  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent) => {
      localStorage.removeItem("admin_token");
      setLocation("/admin");
      toast({ title: "Sessão expirada", description: "Faça login novamente", variant: "destructive" });
    };
    
    window.addEventListener("admin-unauthorized" as any, handleUnauthorized);
    return () => window.removeEventListener("admin-unauthorized" as any, handleUnauthorized);
  }, [setLocation, toast]);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleApiResponse = async (response: Response) => {
    if (response.status === 401) {
      localStorage.removeItem("admin_token");
      setLocation("/admin");
      throw new Error("Unauthorized");
    }
    if (!response.ok) throw new Error("Request failed");
    return response.json();
  };

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          category: data.category,
          price: parsePriceInput(data.price),
          image: data.image,
          benefits: data.benefits.split("\n").filter(b => b.trim()),
          featured: data.featured,
        }),
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produto criado com sucesso!" });
      setIsDialogOpen(false);
      setFormData(emptyFormData);
    },
    onError: () => {
      toast({ title: "Erro ao criar produto", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          category: data.category,
          price: parsePriceInput(data.price),
          image: data.image,
          benefits: data.benefits.split("\n").filter(b => b.trim()),
          featured: data.featured,
        }),
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produto atualizado com sucesso!" });
      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData(emptyFormData);
    },
    onError: () => {
      toast({ title: "Erro ao atualizar produto", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produto excluído com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir produto", variant: "destructive" });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: (product.price / 100).toFixed(2).replace(".", ","),
      image: product.image,
      benefits: product.benefits?.join("\n") || "",
      featured: product.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData(emptyFormData);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteMutation.mutate(id);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="font-serif text-xl font-medium">VELLARIS Admin</h1>
            </div>
            <Button variant="ghost" onClick={handleLogout} data-testid="button-admin-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Gerenciar Produtos</h2>
            <p className="text-muted-foreground">
              {products?.length || 0} produtos cadastrados
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewProduct} data-testid="button-add-product">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Shampoo Reparador"
                    required
                    data-testid="input-product-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do produto..."
                    rows={3}
                    required
                    data-testid="input-product-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger data-testid="select-product-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="89,00"
                      required
                      data-testid="input-product-price"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL da Imagem</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/products/shampoo.jpg"
                    data-testid="input-product-image"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefícios (um por linha)</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    placeholder="Hidratação intensa&#10;Brilho natural&#10;Proteção térmica"
                    rows={4}
                    data-testid="input-product-benefits"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    data-testid="switch-product-featured"
                  />
                  <Label htmlFor="featured">Produto em destaque</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isPending}
                    data-testid="button-save-product"
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
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id} className="p-4 border-0 bg-card" data-testid={`admin-product-${product.id}`}>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      {product.featured && (
                        <Badge variant="secondary" className="text-xs">Destaque</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                      data-testid={`button-edit-product-${product.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive"
                      data-testid={`button-delete-product-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum produto cadastrado.</p>
            <Button onClick={handleNewProduct} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar primeiro produto
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
