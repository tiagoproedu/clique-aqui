
import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, RefreshCw, Settings, Users } from "lucide-react";

type RSVPEntry = {
  nome: string;
  email: string;
  status: string;
  timestamp: string;
};

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rsvpList, setRsvpList] = useState<RSVPEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const { toast } = useToast();

  const correctPassword = "festa2025";

  useEffect(() => {
    // Carregar a URL do webhook do localStorage ao iniciar
    const savedWebhookUrl = localStorage.getItem("webhookUrl");
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
    }
  }, []);

  const loadRSVPData = () => {
    setIsLoading(true);
    try {
      const data = localStorage.getItem("rsvpList");
      if (data) {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          setRsvpList(parsedData);
        } else {
          setRsvpList([]);
          toast({
            variant: "destructive",
            title: "Erro no formato dos dados",
            description: "Os dados salvos não estão no formato esperado."
          });
        }
      } else {
        setRsvpList([]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados das confirmações."
      });
      setRsvpList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticate = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      loadRSVPData();
    } else {
      toast({
        variant: "destructive",
        title: "Senha incorreta",
        description: "A senha fornecida está incorreta. Tente novamente."
      });
    }
  };

  const handleExportCSV = () => {
    if (rsvpList.length === 0) {
      toast({
        variant: "destructive",
        title: "Sem dados para exportar",
        description: "Não há confirmações para exportar."
      });
      return;
    }

    // Criar cabeçalho CSV
    const headers = ["Nome", "Email", "Status", "Data/Hora"];
    
    // Criar linhas CSV
    const rows = rsvpList.map(entry => [
      entry.nome,
      entry.email,
      entry.status === "sim" ? "Confirmado" : "Não comparecerá",
      new Date(entry.timestamp).toLocaleString('pt-BR')
    ]);
    
    // Juntar tudo
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `convidados_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados foram exportados com sucesso."
    });
  };

  const handleSaveWebhook = () => {
    // Validar URL
    if (!webhookUrl || !webhookUrl.trim()) {
      toast({
        variant: "destructive",
        title: "URL inválida",
        description: "Por favor, insira uma URL válida para o webhook."
      });
      return;
    }
    
    // Salvar a URL do webhook no localStorage e compartilhar com o formulário
    localStorage.setItem("webhookUrl", webhookUrl.trim());
    
    // Evento personalizado para notificar outros componentes sobre a mudança
    window.dispatchEvent(new CustomEvent('webhookUpdated', { detail: webhookUrl.trim() }));
    
    toast({
      title: "Configuração salva",
      description: "A URL do webhook foi configurada com sucesso."
    });
    
    setIsWebhookDialogOpen(false);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl || !webhookUrl.trim()) {
      toast({
        variant: "destructive",
        title: "URL inválida",
        description: "Por favor, insira uma URL válida para o webhook."
      });
      return;
    }

    try {
      // Enviar dados de teste para o webhook
      await fetch(webhookUrl.trim(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "no-cors",
        body: JSON.stringify({
          nome: "Teste Webhook",
          email: "teste@example.com",
          status: "teste",
          timestamp: new Date().toISOString()
        })
      });

      toast({
        title: "Teste enviado",
        description: "Um evento de teste foi enviado para o webhook. Verifique o Zapier para confirmar o recebimento."
      });
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast({
        variant: "destructive",
        title: "Erro no teste",
        description: "Não foi possível testar o webhook. Verifique a URL e tente novamente."
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-festa-blue text-white flex items-center justify-center shadow-lg hover:bg-festa-lightblue transition-colors"
        aria-label="Admin Panel"
      >
        <Users size={24} />
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Painel de Administração</SheetTitle>
            <SheetDescription>
              Gerencie as confirmações de presença para sua festa.
            </SheetDescription>
          </SheetHeader>

          {!isAuthenticated ? (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha de administrador"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Digite a senha para acessar o painel de administração.
                </p>
              </div>
              <Button 
                onClick={handleAuthenticate} 
                className="w-full bg-festa-blue hover:bg-festa-lightblue"
              >
                Acessar
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadRSVPData}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>
                
                <div className="space-x-2">
                  <Dialog open={isWebhookDialogOpen} onOpenChange={setIsWebhookDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Configuração de Webhook</DialogTitle>
                        <DialogDescription>
                          Configure a URL do webhook para receber as confirmações.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="webhook-url">URL do Webhook</Label>
                          <Input
                            id="webhook-url"
                            type="url"
                            placeholder="https://hooks.zapier.com/hooks/catch/..."
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                          />
                          <p className="text-xs text-gray-500">
                            Insira a URL do seu webhook Zapier ou similar para receber as confirmações por e-mail ou outro canal.
                          </p>
                        </div>
                      </div>
                      <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between">
                        <Button variant="outline" onClick={handleTestWebhook}>
                          Testar Webhook
                        </Button>
                        <Button onClick={handleSaveWebhook}>Salvar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportCSV}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Lista de confirmações ({rsvpList.length})
                </h3>
                <ScrollArea className="h-[400px]">
                  {rsvpList.length > 0 ? (
                    <Table>
                      <TableCaption>
                        Total de convidados: {rsvpList.length} | 
                        Confirmados: {rsvpList.filter(r => r.status === "sim").length} | 
                        Não comparecerão: {rsvpList.filter(r => r.status === "nao").length}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data/Hora</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rsvpList.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell>{entry.nome}</TableCell>
                            <TableCell>{entry.email}</TableCell>
                            <TableCell>
                              <span 
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  entry.status === "sim" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {entry.status === "sim" ? "Confirmado" : "Não comparecerá"}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(entry.timestamp).toLocaleString('pt-BR')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {isLoading ? (
                        <p>Carregando confirmações...</p>
                      ) : (
                        <p>Nenhuma confirmação recebida ainda.</p>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
