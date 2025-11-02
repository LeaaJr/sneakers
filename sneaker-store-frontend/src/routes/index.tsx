// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { HeaderFuturista } from '@/components/Header';
import { SneakersGrid } from '@/components/SneakersGrid';
import { fetchSneakers, type Sneaker } from '@/services/sneakerService';
import JordanSection from '@/sections/jordan/JordanSection';
import SportGridSection from '@/sections/grid/SportGridSection';
import AllCategoriesSection from '@/sections/AllCategoriesSection';
import { Footer } from '@/components/Footer';
import { TrendingSection } from '@/sections/trending/TrendingSection';

// Componente principal de la página de inicio
function HomePageContent() {
  // ✅ React Query se encarga de loading, error y data
  const {
    data: sneakers = [],
    isLoading,
    error,
  } = useQuery<Sneaker[], Error>({
    queryKey: ['allSneakers'],
    queryFn: fetchSneakers,
  });

  // --- Scroll y animaciones ---
  const headerRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const runningSectionRef = React.useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = React.useRef(false);
  const animationFrameRef = React.useRef<number | null>(null);
  const lastScrollTime = React.useRef(0);
  const scrollVelocity = React.useRef(0);
  const bottomContentRef = React.useRef<HTMLDivElement>(null);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const smoothScrollTo = React.useCallback((target: number | HTMLElement) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const startPosition = window.scrollY;
    const targetPosition =
      typeof target === 'number'
        ? target
        : target.getBoundingClientRect().top + startPosition;

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

  const handleWheel = React.useCallback(
    (e: WheelEvent) => {
      if (isScrollingProgrammatically.current) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      const currentScrollY = window.scrollY;

      if (lastScrollTime.current) {
        const deltaTime = now - lastScrollTime.current;
        scrollVelocity.current = Math.min(
          Math.abs(e.deltaY) / (deltaTime || 3) * 0.5,
          25
        );
      }

      lastScrollTime.current = now;
      const scrollDirection = e.deltaY > 1 ? 'down' : e.deltaY < -1 ? 'up' : 'none';
      const headerTop = 0;
      const cardsTop = cardsRef.current?.offsetTop || Infinity;
      const runningSectionTop = runningSectionRef.current?.offsetTop || Infinity;
      const snapBuffer = window.innerHeight * 0.1;

      // === LÓGICA DE SNAP MODIFICADA ===

      if (scrollDirection === 'down' && e.deltaY > 5) {
        // Snap hacia abajo: Si estamos ANTES del punto de snap de las tarjetas
        if (currentScrollY < cardsTop - snapBuffer) {
          e.preventDefault();
          smoothScrollTo(cardsRef.current as HTMLElement);
        }
        // IMPORTANTE: Una vez que estamos en las tarjetas o más abajo, el scroll sigue normal.
      } else if (scrollDirection === 'up' && e.deltaY < -5) {
        // Snap hacia arriba: Si estamos JUSTO EN las tarjetas o un poco después
        // y queremos volver a la parte superior (0).
        if (currentScrollY >= cardsTop - snapBuffer && currentScrollY < cardsTop + snapBuffer * 2) {
          e.preventDefault();
          smoothScrollTo(headerTop);
        } else if (currentScrollY > headerTop + snapBuffer) {
             // Si el scroll está MÁS ALLÁ del área de snap, lo permitimos
             // a menos que estemos en el rango cardsTop para ir a headerTop
             // Esta parte asegura que desde el resto de la página el scroll funcione
             // o se podría quitar el `else if` y solo dejar la condición del snap de cardsTop a headerTop
             // si se quiere deshabilitar por completo el snap hacia arriba desde el resto de la página.
             // Pero para scroll normal después, *no* queremos prevenir el default fuera del rango.
        }
      }
      // Snap hacia arriba: Solo aplica si estamos cerca o en la posición de las tarjetas.
      const isNearCards = currentScrollY > cardsTop - snapBuffer && currentScrollY < cardsTop + window.innerHeight * 0.5;

      if (scrollDirection === 'up' && e.deltaY < -5 && isNearCards) {
          e.preventDefault();
          smoothScrollTo(headerTop);
      }
      
    },
    [smoothScrollTo]
  );

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
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
          }
        } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
          if (currentScrollY > snapBuffer) {
            e.preventDefault();
            smoothScrollTo(0);
          }
        }
      }
    },
    [smoothScrollTo]
  );

  React.useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleWheel, handleKeyDown]);

  // --- Render ---
  return (
    <>
      <div ref={headerRef}>
        <HeaderFuturista />
      </div>

      <div ref={cardsRef}>
        <div className="container mx-auto py-8">
          {isLoading ? (
            <div className="text-center text-lg text-gray-600">
              Cargando zapatillas...
            </div>
          ) : error ? (
            <div className="text-center text-lg text-red-600">
              Error: {error.message}
            </div>
          ) : sneakers.length === 0 ? (
            <div className="text-center text-lg text-gray-600">
              No se encontraron zapatillas.
            </div>
          ) : (
            <SneakersGrid sneakers={sneakers.slice(0, 3)} />
          )}
        </div>
      </div>

      {!isLoading && !error && sneakers.length > 0 && (
        <>
          <div ref={runningSectionRef} className="w-full min-h-screen bg-white">
            <JordanSection />
          </div>

          <TrendingSection />

          <div
            ref={bottomContentRef}
            className="h-[100vh] bg-white flex items-center justify-center text-gray-700"
          >
            <AllCategoriesSection />
          </div>

          <Footer />
        </>
      )}
    </>
  );
}

// Registrar la ruta con TanStack Router
export const Route = createFileRoute('/')({
  component: HomePageContent,
});
