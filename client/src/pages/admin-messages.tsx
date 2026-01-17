import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  User, 
  Calendar,
  Trash2,
  Eye,
  Loader2,
  Inbox
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Contact } from "@shared/schema";

export default function AdminMessages() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const token = localStorage.getItem("adminToken");

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (!token) {
      setLocation("/admin");
    }
  }, [token, setLocation]);

  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch("/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        setLocation("/admin");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/contacts/${id}`, undefined, {
        Authorization: `Bearer ${token}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      setDeleteContact(null);
      toast({
        title: "Sucesso!",
        description: "Mensagem excluída com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir mensagem.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Data não disponível";
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <AdminNav onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">
              Mensagens Recebidas
            </h1>
            <p className="text-gray-400">
              Visualize e gerencie os formulários de contato enviados pelo site.
            </p>
          </div>
          {contacts && contacts.length > 0 && (
            <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
              {contacts.length} mensage{contacts.length !== 1 ? "ns" : "m"}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : !contacts || contacts.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Nenhuma mensagem recebida
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Quando alguém enviar um formulário de contato pelo site, as mensagens aparecerão aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <Card 
                key={contact.id} 
                className="bg-gray-900/50 border-gray-800 hover:border-gold/40 transition-all duration-300 group cursor-pointer golden-glow"
                onClick={() => setSelectedContact(contact)}
                data-testid={`card-message-${contact.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20">
                        <User className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-base group-hover:text-gold transition-colors">
                          {contact.name}
                        </CardTitle>
                        <CardDescription className="text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(contact.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                    {contact.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20">
                <MessageSquare className="w-6 h-6 text-gold" />
              </div>
              <div>
                <span className="block">{selectedContact?.name}</span>
                <span className="text-sm font-normal text-gray-400">
                  {selectedContact && formatDate(selectedContact.createdAt)}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-6 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <Mail className="w-5 h-5 text-gold" />
                  <div>
                    <span className="text-xs text-gray-500 block">E-mail</span>
                    <a 
                      href={`mailto:${selectedContact.email}`}
                      className="text-white hover:text-gold transition-colors"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                    <Phone className="w-5 h-5 text-gold" />
                    <div>
                      <span className="text-xs text-gray-500 block">Telefone</span>
                      <a 
                        href={`tel:${selectedContact.phone}`}
                        className="text-white hover:text-gold transition-colors"
                      >
                        {selectedContact.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <span className="text-xs text-gray-500 block mb-2">Mensagem</span>
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {selectedContact.message}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedContact(null);
                    setDeleteContact(selectedContact);
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  data-testid="button-delete-message"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedContact.email}`, "_blank")}
                  className="border-gold/30 text-gold hover:bg-gold/10"
                  data-testid="button-reply-message"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Responder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteContact} onOpenChange={() => setDeleteContact(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir mensagem?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A mensagem de "{deleteContact?.name}" será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteContact && deleteMutation.mutate(deleteContact.id)}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete"
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
    </div>
  );
}
