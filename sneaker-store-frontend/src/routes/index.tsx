// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { HeaderFuturista } from '@/components/Header';
import { SneakersGrid } from '@/components/SneakersGrid';


const sneakersData = [
  {
    id: '1',
    title: 'Nike Air Max 90',
    description: 'Classic silhouette with modern comfort',
    imageUrl:
      'https://uploadthingy.s3.us-west-1.amazonaws.com/vQUHrQS4Gx4DndHjABigi7/image.png',
    price: 135,
    brand: 'Nike',
    size: 'US 9',
    isNew: true,
  },
  {
    id: '2',
    title: 'Adidas Ultraboost',
    description: 'Responsive boost cushioning',
    imageUrl:
      'https://uploadthingy.s3.us-west-1.amazonaws.com/vQUHrQS4Gx4DndHjABigi7/image.png',
    price: 180,
    brand: 'Adidas',
    size: 'US 10',
  },
  {
    id: '3',
    title: 'Jordan 1 Retro High',
    description: 'Iconic basketball silhouette',
    imageUrl:
      'https://uploadthingy.s3.us-west-1.amazonaws.com/vQUHrQS4Gx4DndHjABigi7/image.png',
    price: 170,
    brand: 'Jordan',
    size: 'US 8.5',
    isNew: true,
  },
];

function HomePageContent() {
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = React.useRef(false);
  const animationFrameRef = React.useRef<number | null>(null);
  const lastScrollTime = React.useRef(0);
  const lastScrollY = React.useRef(0);
  const scrollVelocity = React.useRef(0);

  // Función easeOutExpo para un efecto más dramático pero visible
  const easeOutExpo = (t: number) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  // Scroll suave con velocidad adaptativa
  const smoothScrollTo = (target: number | HTMLElement) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startPosition = window.scrollY;
    let targetPosition: number;
    
    if (typeof target === 'number') {
      targetPosition = target;
    } else {
      const rect = target.getBoundingClientRect();
      targetPosition = rect.top + startPosition;
    }

    const distance = targetPosition - startPosition;
    
    // Duración basada en la velocidad del scroll (más rápido = animación más corta)
    const baseDuration = 600; // ms
    const velocityFactor = Math.min(Math.max(Math.abs(scrollVelocity.current), 1), 10);
    const duration = Math.max(300, baseDuration / velocityFactor);
    
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      window.scrollTo(0, startPosition + distance * easeOutExpo(progress));
      
      if (timeElapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      } else {
        isScrollingProgrammatically.current = false;
      }
    };

    isScrollingProgrammatically.current = true;
    animationFrameRef.current = requestAnimationFrame(animateScroll);
  };

  const handleWheel = React.useCallback((e: WheelEvent) => {
    e.preventDefault(); // Bloquea completamente el scroll nativo
    
    const now = Date.now();
    const currentScrollY = window.scrollY;
    
    // Calcular velocidad del scroll (píxeles por milisegundo)
    if (lastScrollTime.current) {
      const deltaY = e.deltaY;
      const deltaTime = now - lastScrollTime.current;
      scrollVelocity.current = Math.abs(deltaY) / (deltaTime || 1);
    }
    
    lastScrollTime.current = now;
    lastScrollY.current = currentScrollY;

    // Determinar dirección
    const scrollDirection = e.deltaY > 0 ? 'down' : 'up';

    // Activar scroll inmediatamente sin debounce
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const cardsOffsetTop = cardsRef.current?.offsetTop || 0;

    // Scroll hacia abajo
    if (scrollDirection === 'down') {
      if (currentScrollY < cardsOffsetTop - 50) { // -50 para activar antes
        if (cardsRef.current) {
          smoothScrollTo(cardsRef.current);
        }
      }
    } 
    // Scroll hacia arriba
    else if (scrollDirection === 'up') {
      if (currentScrollY > headerHeight * 0.3) { // 30% del header para activar
        smoothScrollTo(0);
      }
    }
  }, []);

  React.useEffect(() => {
    // Usamos wheel en lugar de scroll para mejor control
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleWheel]);

  return (
    <>
      <div ref={headerRef}>
        <HeaderFuturista />
      </div>

      <div ref={cardsRef}>
        <div className="container mx-auto py-40">
          <SneakersGrid sneakers={sneakersData} />
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute('/')({
  component: HomePageContent,
});