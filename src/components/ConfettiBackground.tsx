
import React, { useEffect, useRef } from 'react';

interface ConfettiParticle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'triangle';
}

export const ConfettiBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<ConfettiParticle[]>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Ajustar o tamanho do canvas para preencher a tela
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Cores festivas
    const colors = [
      '#1e3a8a', '#3b82f6', '#d4af37', '#fef9d7', '#ffffff'
    ];
    
    // Formas
    const shapes = ['circle', 'square', 'triangle'];
    
    // Inicializar partículas
    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < 60; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          radius: Math.random() * 5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedY: Math.random() * 1 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 2 - 1,
          shape: shapes[Math.floor(Math.random() * shapes.length)] as 'circle' | 'square' | 'triangle'
        });
      }
    };
    
    initParticles();
    
    // Desenhar partículas
    const drawParticle = (p: ConfettiParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      
      switch(p.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -p.radius);
          ctx.lineTo(p.radius, p.radius);
          ctx.lineTo(-p.radius, p.radius);
          ctx.closePath();
          ctx.fill();
          break;
      }
      
      ctx.restore();
    };
    
    // Atualizar e desenhar
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        
        // Resetar partícula quando sair da tela
        if (p.y > canvas.height + p.radius) {
          p.y = -p.radius;
          p.x = Math.random() * canvas.width;
        }
        
        drawParticle(p);
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ConfettiBackground;
