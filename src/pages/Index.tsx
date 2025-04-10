
import { useState, useEffect } from "react";
import { RSVPForm } from "@/components/RSVPForm";
import { AdminPanel } from "@/components/AdminPanel";
import ConfettiBackground from "@/components/ConfettiBackground";
import { Calendar, Clock, MapPin } from "lucide-react";

const Index = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Data da festa: 17/04/2025 às 19h
    const festDate = new Date("2025-04-17T19:00:00");
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = festDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const CountdownDisplay = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/80 backdrop-blur w-16 h-16 rounded-lg flex items-center justify-center text-festa-blue font-bold text-2xl mb-1 shadow-md">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-festa-cream bg-festa-pattern relative">
      <ConfettiBackground />
      
      <div className="container mx-auto px-4 py-12 z-10 relative">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-festa-blue mb-4 relative">
              <span className="absolute -left-8 top-0 text-3xl text-festa-gold">✦</span>
              Festa de Aniversário
              <span className="absolute -right-8 top-0 text-3xl text-festa-gold">✦</span>
            </h1>
            <p className="text-xl md:text-2xl text-festa-dark/80 font-light">
              Venha comemorar comigo!
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 md:space-x-6 my-8">
            <CountdownDisplay label="dias" value={countdown.days} />
            <CountdownDisplay label="horas" value={countdown.hours} />
            <CountdownDisplay label="min" value={countdown.minutes} />
            <CountdownDisplay label="seg" value={countdown.seconds} />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-12 mb-8 max-w-3xl mx-auto">
            <div className="bg-white/70 backdrop-blur p-4 rounded-lg shadow-sm flex flex-col items-center">
              <Calendar className="h-8 w-8 text-festa-blue mb-2" />
              <h3 className="font-semibold text-festa-blue">Data</h3>
              <p className="text-sm">17 de Abril de 2025</p>
              <p className="text-xs text-gray-500">Quinta-feira</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur p-4 rounded-lg shadow-sm flex flex-col items-center">
              <Clock className="h-8 w-8 text-festa-blue mb-2" />
              <h3 className="font-semibold text-festa-blue">Horário</h3>
              <p className="text-sm">19:00h</p>
              <p className="text-xs text-gray-500">Não se atrase!</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur p-4 rounded-lg shadow-sm flex flex-col items-center">
              <MapPin className="h-8 w-8 text-festa-blue mb-2" />
              <h3 className="font-semibold text-festa-blue">Local</h3>
              <p className="text-sm">Cabana Bit</p>
              <p className="text-xs text-gray-500">Rua Padre Guerra, 1711 - Parquelândia</p>
            </div>
          </div>
          
          <div className="mt-8 mb-16">
            <div className="h-0.5 w-16 bg-festa-gold mx-auto my-8" />
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              É com muita alegria que convido você para celebrar comigo este momento especial. 
              Sua presença é o melhor presente que posso receber!
            </p>
          </div>
        </div>
        
        <div className="mb-12">
          <RSVPForm />
        </div>
        
        <div className="mt-16 text-center">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.246799012024!2d-38.5684968!3d-3.7431647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74c8cfd2409dd%3A0x6a8a5857a02bbe91!2sR.%20Padre%20Guerra%2C%201711%20-%20Parquel%C3%A2ndia%2C%20Fortaleza%20-%20CE!5e0!3m2!1spt-BR!2sbr!4v1712747583957!5m2!1spt-BR!2sbr" 
            width="100%" 
            height="300" 
            style={{ border: 0, borderRadius: '0.5rem' }}
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="shadow-md"
          />
        </div>
        
        <footer className="text-center mt-16 text-sm text-gray-500">
          <p>© 2025 - Todos os direitos reservados</p>
          <p className="mt-1">
            Contato: <a href="mailto:exemplo@email.com" className="underline hover:text-festa-blue">exemplo@email.com</a>
          </p>
        </footer>
      </div>
      
      <AdminPanel />
    </div>
  );
};

export default Index;
