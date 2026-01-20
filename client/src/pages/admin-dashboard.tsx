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
import { queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Package, 
  Loader2,
  Save,
  Star
} from "lucide-react";
import type { Product, ProductLine } from "@shared/schema";

const categories = ["Tratamento", "Hidratação", "Nutrição", "Finalização"];

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
  line: string;
  price: string;
  showPrice: boolean;
  image: string;
  benefits: string;
  featured: boolean;
}

const getEmptyFormData = (defaultLine?: string): ProductFormData => ({
  name: "",
  description: "",
  category: "Tratamento",
  line: defaultLine || "",
  price: "",
  showPrice: true,
  image: "/products/default.jpg",
  benefits: "",
  featured: false,
});

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(getEmptyFormData());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      setLocation("/admin");
    }
  }, [token, setLocation]);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: lines } = useQuery<ProductLine[]>({
    queryKey: ["/api/admin/product-lines"],
    queryFn: async () => {
      const response = await fetch("/api/admin/product-lines", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) return [];
      return response.json();
    },
  });

  const handleApiResponse = async (response: Response) => {
    if (response.status === 401) {
      localStorage.removeItem("adminToken");
      setLocation("/admin");
      throw new Error("Unauthorized");
    }
    if (!response.ok) throw new Error("Request failed");
    return response.json();
  };

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
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
          line: data.line,
          price: data.showPrice && data.price ? parsePriceInput(data.price) : null,
          showPrice: data.showPrice,
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
      setFormData(getEmptyFormData(lines?.[0]?.slug));
    },
    onError: () => {
      toast({ title: "Erro ao criar produto", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
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
          line: data.line,
          price: data.showPrice && data.price ? parsePriceInput(data.price) : null,
          showPrice: data.showPrice,
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
      setFormData(getEmptyFormData(lines?.[0]?.slug));
    },
    onError: () => {
      toast({ title: "Erro ao atualizar produto", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
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
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      line: product.line || "fiber-force",
      price: product.price ? (product.price / 100).toFixed(2).replace(".", ",") : "",
      showPrice: product.showPrice ?? true,
      image: product.image,
      benefits: product.benefits?.join("\n") || "",
      featured: product.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData(getEmptyFormData(lines?.[0]?.slug));
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

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <AdminNav onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">
              Gerenciar Produtos
            </h1>
            <p className="text-gray-400">
              {products?.length || 0} produtos cadastrados
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleNewProduct} 
                className="bg-gold text-black hover:bg-gold/90 gap-2"
                data-testid="button-add-product"
              >
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingProduct ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Nome do Produto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Shampoo Reparador"
                    required
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                    data-testid="input-product-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do produto..."
                    rows={3}
                    required
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold resize-none"
                    data-testid="input-product-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="line" className="text-gray-300">Linha</Label>
                    <Select
                      value={formData.line}
                      onValueChange={(value) => setFormData({ ...formData, line: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-product-line">
                        <SelectValue placeholder="Selecione uma linha" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {lines && lines.length > 0 ? (
                          lines.map((line) => (
                            <SelectItem key={line.id} value={line.slug} className="text-white hover:bg-gray-700">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: line.accentColor }}
                                />
                                {line.name}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-lines" disabled className="text-gray-400">
                            Nenhuma linha cadastrada
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-300">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-product-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-white hover:bg-gray-700">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <Switch
                    id="showPrice"
                    checked={formData.showPrice}
                    onCheckedChange={(checked) => setFormData({ ...formData, showPrice: checked })}
                    data-testid="switch-product-show-price"
                  />
                  <Label htmlFor="showPrice" className="text-gray-300 flex items-center gap-2">
                    Exibir preço do produto
                  </Label>
                </div>

                {formData.showPrice && (
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-gray-300">Preço (R$)</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="89,00"
                      className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                      data-testid="input-product-price"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-gray-300">URL da Imagem</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/products/shampoo.jpg"
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold"
                    data-testid="input-product-image"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits" className="text-gray-300">Benefícios (um por linha)</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    placeholder="Hidratação intensa&#10;Brilho natural&#10;Proteção térmica"
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white focus:border-gold resize-none"
                    data-testid="input-product-benefits"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    data-testid="switch-product-featured"
                  />
                  <Label htmlFor="featured" className="text-gray-300 flex items-center gap-2">
                    <Star className="w-4 h-4 text-gold" />
                    Produto em destaque
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
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="bg-gray-900/50 border-gray-800 hover:border-gold/40 transition-all duration-300 group golden-glow overflow-visible"
                data-testid={`admin-product-${product.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white group-hover:text-gold transition-colors">
                          {product.name}
                        </h3>
                        {product.featured && (
                          <Star className="w-4 h-4 text-gold fill-gold" />
                        )}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                          {product.category}
                        </Badge>
                        {(() => {
                          const productLine = lines?.find(l => l.slug === product.line);
                          return (
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{
                                borderColor: `${productLine?.accentColor || '#D4AF37'}80`,
                                color: productLine?.accentColor || '#D4AF37'
                              }}
                            >
                              {productLine?.name || product.line}
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>
                    {product.showPrice && product.price && (
                      <span className="text-lg font-bold text-gold">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1 text-gray-400 hover:text-white hover:bg-gray-800 gap-2"
                      data-testid={`button-edit-product-${product.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      data-testid={`button-delete-product-${product.id}`}
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
                <Package className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Nenhum produto cadastrado
              </h3>
              <p className="text-gray-500 text-center max-w-md mb-4">
                Comece adicionando seus produtos para exibi-los no site.
              </p>
              <Button onClick={handleNewProduct} className="bg-gold text-black hover:bg-gold/90 gap-2">
                <Plus className="h-4 w-4" />
                Adicionar primeiro produto
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
