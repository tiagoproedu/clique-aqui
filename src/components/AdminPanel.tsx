
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Key, Clipboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RSVPEntry {
  nome: string;
  email: string;
  status: "sim" | "nao";
  timestamp: string;
}

export function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [rsvpList, setRsvpList] = useState<RSVPEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (authenticated) {
      const data = localStorage.getItem("rsvpList");
      if (data) {
        setRsvpList(JSON.parse(data));
      }
    }
  }, [authenticated]);

  const handleAuth = () => {
    // Senha simples apenas para demonstração - em produção use um sistema seguro
    if (password === "festa2025") {
      setAuthenticated(true);
    } else {
      toast({
        variant: "destructive",
        title: "Senha incorreta",
        description: "Por favor, tente novamente com a senha correta."
      });
    }
  };

  const handleExport = () => {
    const confirmed = window.confirm("Isso irá baixar a lista completa de convidados. Continuar?");
    if (!confirmed) return;

    // Formatar para CSV
    const header = "Nome,Email,Resposta,Data\n";
    const csvData = rsvpList.map(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString('pt-BR');
      return `"${entry.nome}","${entry.email}","${entry.status === 'sim' ? 'Sim' : 'Não'}","${date}"`;
    }).join("\n");
    
    const blob = new Blob([header + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `lista_convidados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Lista exportada",
      description: "A lista de convidados foi exportada com sucesso."
    });
  };

  const copyToClipboard = () => {
    const simCount = rsvpList.filter(entry => entry.status === "sim").length;
    const naoCount = rsvpList.filter(entry => entry.status === "nao").length;
    
    const text = `
    Resumo de Confirmações:
    
    Total de respostas: ${rsvpList.length}
    Confirmados: ${simCount}
    Não irão comparecer: ${naoCount}
    
    Lista de Confirmados:
    ${rsvpList.filter(entry => entry.status === "sim").map(entry => `- ${entry.nome} (${entry.email})`).join('\n')}
    `;
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado para a área de transferência",
        description: "O resumo foi copiado com sucesso."
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="fixed bottom-4 right-4 opacity-50 hover:opacity-100">
          <Key className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Painel de Administração</DialogTitle>
          <DialogDescription>
            Acesse os dados de confirmações para o evento.
          </DialogDescription>
        </DialogHeader>
        
        {!authenticated ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Digite a senha de acesso"
                  className="w-full p-2 border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                />
                <p className="text-xs text-gray-500">
                  Dica: A senha é "festa2025"
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAuth}>Acessar</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="max-h-[400px] overflow-auto">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm font-medium">Total de respostas: {rsvpList.length}</p>
                  <p className="text-sm text-green-600">
                    Confirmados: {rsvpList.filter(entry => entry.status === "sim").length}
                  </p>
                  <p className="text-sm text-blue-600">
                    Não irão: {rsvpList.filter(entry => entry.status === "nao").length}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyToClipboard}
                  >
                    <Clipboard className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </div>
              
              {rsvpList.length > 0 ? (
                <Table>
                  <TableCaption>Lista de confirmações para o evento</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Resposta</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rsvpList.map((entry, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{entry.nome}</TableCell>
                        <TableCell>{entry.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            entry.status === "sim" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {entry.status === "sim" ? "Sim" : "Não"}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(entry.timestamp).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-8 text-gray-500">
                  Nenhuma confirmação registrada ainda.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAuthenticated(false)}>Sair</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
