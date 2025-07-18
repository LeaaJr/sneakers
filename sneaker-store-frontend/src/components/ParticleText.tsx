// components/ParticleText.tsx
"use client"; // Esto es importante porque usaremos hooks y efectos

import { useRef, useEffect } from 'react';
import styles from '@/styles/ParticleText.module.css'; // Lo crearemos después

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  friction: number;
}

const ParticleText = ({ text = "SNEAKERS STORE" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    // Inicializar partículas basadas en el texto
    const initParticles = () => {
      particlesRef.current = [];
      ctx.font = 'bold 80px "Arial", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const textWidth = ctx.measureText(text).width;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Crear una imagen temporal del texto
      const textImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.fillText(text, centerX, centerY);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Buscar píxeles opacos para crear partículas
      const particleDensity = 4; // Cada cuántos píxeles crear una partícula
      for (let y = 0; y < canvas.height; y += particleDensity) {
        for (let x = 0; x < canvas.width; x += particleDensity) {
          const index = (y * canvas.width + x) * 4;
          if (imageData[index + 3] > 128) { // Si el píxel es visible
            const getParticleColor = (x: number, width: number) => {
  // Degradado de blanco (inicio) a violeta pastel (final)
            const startColor = { r: 255, g: 255, b: 255 }; // Blanco
            const endColor = { r: 175, g: 70, b: 170 }; // Violeta pastel (#AF8CDC)

            const progress = 1 - x / width;
            const r = Math.floor(startColor.r + (endColor.r - startColor.r) * progress);
            const g = Math.floor(startColor.g + (endColor.g - startColor.g) * progress);
            const b = Math.floor(startColor.b + (endColor.b - startColor.b) * progress);

              return `rgba(${r}, ${g}, ${b}, ${0.7 + Math.random() * 0.3})`; // Opacidad variable
};
            particlesRef.current.push({
            x,
            y,
            originX: x,
            originY: y,
            color: getParticleColor(x, canvas.width), 
            size: Math.random() * 2 + 2,
            vx: 0,
            vy: 0,
            friction: 0.85 + Math.random() * 0.1
            });
          }
        }
      }
    };

    // Animación
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (const particle of particles) {
        // Calcular distancia al mouse
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Si el mouse está cerca, aplicar fuerza
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 100;
          particle.vx -= Math.cos(angle) * force * 0.7;
          particle.vy -= Math.sin(angle) * force * 0.7;
        }
        
        // Volver a la posición original
        const ox = particle.originX - particle.x;
        const oy = particle.originY - particle.y;
        particle.vx += ox * 0.05;
        particle.vy += oy * 0.05;
        
        // Aplicar fricción
        particle.vx *= particle.friction;
        particle.vy *= particle.friction;
        
        // Mover partícula
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Dibujar partícula
        ctx.shadowColor = 'rgba(138, 199, 237, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      requestAnimationFrame(animate);
    };

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -100, y: -100 };
    };

    // Configuración inicial
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Iniciar animación
    const animationId = requestAnimationFrame(animate);

    // Limpieza
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [text]);

  return (
<div className={styles.container}>
  <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
   {/* <h1 className={styles.textOverlay}>{text}</h1>  {/* Nueva capa de texto  */}
</div>  
  );
};

export default ParticleText;