import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Lock, Shield } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setLocation("/admin/dashboard");
    }
  }, [setLocation]);

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/admin/login", { password });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setLocation("/admin/dashboard");
      }
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Senha incorreta",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(43,74%,49%,0.05),transparent_70%)]" />
      
      <Card className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-md border-gray-800 hover:border-gold/30 transition-all duration-500 golden-glow overflow-visible">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 mb-6 golden-glow">
              <Shield className="h-10 w-10 text-gold" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-white mb-2">VELLARIS</h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase">
              Painel Administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold" />
                Senha de Acesso
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-gold focus:ring-gold/20 h-12"
                data-testid="input-admin-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gold text-black hover:bg-gold/90 font-semibold text-base"
              disabled={loginMutation.isPending}
              data-testid="button-admin-login"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs">
              Acesso restrito a administradores autorizados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
