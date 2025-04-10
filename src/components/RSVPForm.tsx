
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { CalendarCheck, PartyPopper } from "lucide-react";

type RSVPStatus = "sim" | "nao" | "";

export function RSVPForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<RSVPStatus>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !status) {
      toast({
        variant: "destructive",
        title: "Ops! Algo está faltando",
        description: "Por favor, preencha todos os campos para confirmar sua presença."
      });
      return;
    }

    setIsSubmitting(true);

    // Simular envio ao servidor
    setTimeout(() => {
      // Normalmente enviaria para um servidor, mas neste exemplo
      // apenas armazenamos localmente e mostramos confirmação
      const rsvpData = {
        nome,
        email,
        status,
        timestamp: new Date().toISOString()
      };
      
      // Salvar no localStorage para demonstração
      const existingData = localStorage.getItem("rsvpList");
      const parsedData = existingData ? JSON.parse(existingData) : [];
      parsedData.push(rsvpData);
      localStorage.setItem("rsvpList", JSON.stringify(parsedData));
      
      setIsSubmitting(false);
      setSubmitted(true);
      
      toast({
        title: status === "sim" ? "Presença confirmada!" : "Resposta registrada",
        description: status === "sim" 
          ? "Obrigado por confirmar sua presença. Estamos ansiosos para vê-lo no evento!" 
          : "Agradecemos sua resposta. Sentiremos sua falta!",
        className: status === "sim" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200",
      });
    }, 1500);
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            {status === "sim" ? (
              <PartyPopper className="h-6 w-6 text-green-600" />
            ) : (
              <CalendarCheck className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-xl font-bold text-festa-blue">
            {status === "sim" ? "Presença confirmada!" : "Resposta registrada"}
          </CardTitle>
          <CardDescription>
            {status === "sim" 
              ? "Obrigado por confirmar sua presença. Estamos ansiosos para vê-lo no evento!" 
              : "Agradecemos sua resposta. Sentiremos sua falta!"}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            onClick={() => setSubmitted(false)} 
            variant="outline" 
            className="w-full"
          >
            Voltar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-festa-blue">Confirme sua presença</CardTitle>
        <CardDescription>
          Por favor, confirme se você irá comparecer à festa.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu-email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Você irá comparecer?</Label>
            <RadioGroup 
              value={status} 
              onValueChange={(value) => setStatus(value as RSVPStatus)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="sim" />
                <Label htmlFor="sim" className="cursor-pointer">Sim, irei comparecer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="nao" />
                <Label htmlFor="nao" className="cursor-pointer">Não poderei comparecer</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-festa-blue hover:bg-festa-lightblue text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Confirmar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
