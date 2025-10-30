// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { HeaderFuturista } from '@/components/Header';
import { SneakersGrid } from '@/components/SneakersGrid';
import { fetchSneakers, type Sneaker } from '@/services/sneakerService';
import JordanSection from '@/sections/jordan/JordanSection'
import SportGridSection from '@/sections/grid/SportGridSection';
import AllCategoriesSection from '../sections/AllCategoriesSection';
import { Footer } from '@/components/Footer';
import { TrendingSection } from '@/sections/trending/TrendingSection';

// Define el componente que se renderizará para la ruta raíz (/)
function HomePageContent() {
  // Estado para almacenar los datos de las zapatillas
  const [sneakers, setSneakers] = React.useState<Sneaker[]>([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = React.useState(true);
  // Estado para manejar errores
  const [error, setError] = React.useState<string | null>(null);

  // ... (todo tu código de refs y scroll permanece igual) ...
  const headerRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const runningSectionRef = React.useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = React.useRef(false);
  const animationFrameRef = React.useRef<number | null>(null);
  const lastScrollTime = React.useRef(0);
  const lastScrollY = React.useRef(0);
  const scrollVelocity = React.useRef(0);
  const bottomContentRef = React.useRef<HTMLDivElement>(null);

  const easeOutCubic = (t: number) => {
    return 1 - Math.pow(1 - t, 3);
  };

  const smoothScrollTo = React.useCallback((target: number | HTMLElement) => {
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

    const baseDuration = 700;
    const velocityFactor = Math.min(Math.max(Math.abs(scrollVelocity.current), 1), 15);
    const duration = Math.max(350, baseDuration / velocityFactor);

    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo(0, startPosition + distance * easeOutCubic(progress));

      if (timeElapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      } else {
        isScrollingProgrammatically.current = false;
      }
    };

    isScrollingProgrammatically.current = true;
    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, []);

  const handleWheel = React.useCallback((e: WheelEvent) => {
    if (isScrollingProgrammatically.current) {
      e.preventDefault();
      return;
    }
    

    const now = Date.now();
    const currentScrollY = window.scrollY;

    if (lastScrollTime.current) {
      const deltaTime = now - lastScrollTime.current;
      scrollVelocity.current = Math.min(Math.abs(e.deltaY) / (deltaTime || 3) * 0.5, 25);
    }

    lastScrollTime.current = now;
    lastScrollY.current = currentScrollY;

    const scrollDirection = e.deltaY > 1 ? 'down' : e.deltaY < -1 ? 'up' : 'none';

    const headerTop = 0;
    const cardsTop = cardsRef.current?.offsetTop || Infinity;
    const runningSectionTop = runningSectionRef.current?.offsetTop || Infinity;

    const snapBuffer = window.innerHeight * 0.1;

    if (scrollDirection === 'down' && e.deltaY > 5) {
      if (currentScrollY < cardsTop - snapBuffer) {
        e.preventDefault();
        smoothScrollTo(cardsRef.current as HTMLElement);
      } else if (currentScrollY < runningSectionTop - snapBuffer) {
      } else {
      }
    }
    else if (scrollDirection === 'up' && e.deltaY < -5) {
      if (currentScrollY > cardsTop + snapBuffer) {
      } else if (currentScrollY > headerTop + snapBuffer) {
        e.preventDefault();
        smoothScrollTo(headerTop);
      } else {
      }
    }
  }, [smoothScrollTo]);

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (isScrollingProgrammatically.current) {
      e.preventDefault();
      return;
    }

    if (['Space', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.code)) {
      const currentScrollY = window.scrollY;
      const cardsTop = cardsRef.current?.offsetTop || Infinity;
      const runningSectionTop = runningSectionRef.current?.offsetTop || Infinity;

      const snapBuffer = window.innerHeight * 0.1;
      scrollVelocity.current = 5;

      if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
        if (currentScrollY < cardsTop - snapBuffer) {
          e.preventDefault();
          smoothScrollTo(cardsRef.current as HTMLElement);
        } else if (currentScrollY < runningSectionTop - snapBuffer) {
        } else {
        }
      }
      else if (['ArrowUp', 'PageUp'].includes(e.code)) {
        if (currentScrollY > cardsTop + snapBuffer) {
        } else if (currentScrollY > snapBuffer) {
          e.preventDefault();
          smoothScrollTo(0);
        } else {
        }
      }
    }
  }, [smoothScrollTo]);

  React.useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleWheel, handleKeyDown]);

  // Lógica para cargar los datos de las zapatillas
  React.useEffect(() => {
    const getSneakers = async () => {
      try {
        setLoading(true);
        const data = await fetchSneakers();
        setSneakers(data);
      } catch (err) {
        setError('Failed to fetch sneakers. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getSneakers();
  }, []);
  

  return (
    <>
      <div ref={headerRef}>
        <HeaderFuturista />
      </div>

      <div ref={cardsRef}>
        <div className="container mx-auto py-8">
          {loading ? (
            <div className="text-center text-lg text-gray-600">Caricamento scarpe da ginnastica...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-600">{error}</div>
          ) : sneakers.length === 0 ? (
            <div className="text-center text-lg text-gray-600">Nessuna scarpa da ginnastica trovata.</div>
          ) : (
            <SneakersGrid sneakers={sneakers.slice(0, 3)} />
          )}
        </div>
      </div>

      {!loading && !error && sneakers.length > 0 && (
        <>
          <div ref={runningSectionRef} className="w-full min-h-screen bg-white">
            <JordanSection />
          </div>

          <div ref={bottomContentRef} className="h-[100vh] bg-white-100 flex items-center justify-center text-gray-700">
           <AllCategoriesSection />
        </div>
        <div>

          <TrendingSection />
          <Footer />
        </div>
        
        </>
      )}
    </>
  );
}

export const Route = createFileRoute('/')({
  component: HomePageContent,
});