import { useState, useEffect } from "react";
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

  const redirectToWhatsApp = (message: string) => {
    // Número de WhatsApp conforme mostrado no footer
    const phoneNumber = "5585988241771";
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    // Constrói a URL do WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    
    // Redireciona para o WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const rsvpData = {
      nome,
      email,
      status,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Salvar dados localmente
      const existingDataStr = localStorage.getItem("rsvpList");
      let existingData = [];
      
      try {
        if (existingDataStr) {
          existingData = JSON.parse(existingDataStr);
          if (!Array.isArray(existingData)) {
            existingData = [];
          }
        }
      } catch (error) {
        console.error("Erro ao analisar os dados do localStorage:", error);
        existingData = [];
      }
      
      existingData.push(rsvpData);
      localStorage.setItem("rsvpList", JSON.stringify(existingData));
      
      setIsSubmitting(false);
      setSubmitted(true);
      
      toast({
        title: status === "sim" ? "Presença confirmada!" : "Resposta registrada",
        description: status === "sim" 
          ? "Obrigado por confirmar sua presença. Estamos ansiosos para vê-lo no evento!" 
          : "Agradecemos sua resposta. Sentiremos sua falta!",
        className: status === "sim" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200",
      });

      // Redirecionar para o WhatsApp com mensagem personalizada
      if (status === "sim") {
        const message = `Olá, aqui é ${nome}! Estou confirmando minha presença no aniversário do Tiago. Mal posso esperar para celebrar juntos!`;
        redirectToWhatsApp(message);
      } else {
        const message = `Olá, aqui é ${nome}. Infelizmente não poderei comparecer ao aniversário do Tiago. Desejo uma festa incrível!`;
        redirectToWhatsApp(message);
      }
      
    } catch (error) {
      console.error("Erro ao processar RSVP:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar confirmação",
        description: "Houve um problema ao enviar sua confirmação. Por favor, tente novamente."
      });
      setIsSubmitting(false);
    }
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
