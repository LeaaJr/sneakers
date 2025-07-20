  // src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { HeaderFuturista } from '@/components/Header';
import { SneakersGrid } from '@/components/SneakersGrid';
import { fetchSneakers, type Sneaker } from '@/services/sneakerService'; 
import RunningSection from '@/sections/running/RunningSection';

// Define el componente que se renderizará para la ruta raíz (/)
function HomePageContent() {
  // Estado para almacenar los datos de las zapatillas
  const [sneakers, setSneakers] = React.useState<Sneaker[]>([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = React.useState(true);
  // Estado para manejar errores
  const [error, setError] = React.useState<string | null>(null);

  // Referencias para los elementos DOM
  const headerRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const runningSectionRef = React.useRef<HTMLDivElement>(null); // Referencia para RunningSection

  // Refs para la lógica de scroll
  const isScrollingProgrammatically = React.useRef(false);
  const animationFrameRef = React.useRef<number | null>(null);
  const lastScrollTime = React.useRef(0);
  const lastScrollY = React.useRef(0);
  const scrollVelocity = React.useRef(0);
  const bottomContentRef = React.useRef<HTMLDivElement>(null); // Referencia para el contenido inferior

  // Función easeOutCubic para una animación más natural
  const easeOutCubic = (t: number) => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Función para realizar el scroll suave a un objetivo (posición o elemento)
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

  // Manejador del evento 'wheel' (scroll con rueda del ratón)
  const handleWheel = React.useCallback((e: WheelEvent) => {
    if (isScrollingProgrammatically.current) {
      e.preventDefault(); // Siempre prevenir si hay un scroll programático en curso
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

    // Obtener posiciones de los elementos
    const headerTop = 0; 
    const cardsTop = cardsRef.current?.offsetTop || Infinity;
    const runningSectionTop = runningSectionRef.current?.offsetTop || Infinity;

    // Definir un pequeño buffer para las zonas de "snap"
    const snapBuffer = window.innerHeight * 0.1; // 10% de la altura de la ventana

    // Lógica para scroll hacia ABAJO
    if (scrollDirection === 'down' && e.deltaY > 5) { // Umbral para activar scroll hacia abajo
      // Si estamos en la parte superior (header) y nos desplazamos hacia abajo
      if (currentScrollY < cardsTop - snapBuffer) {
        e.preventDefault(); // Prevenir scroll nativo
        smoothScrollTo(cardsRef.current as HTMLElement); // Snap a las cards
      } else if (currentScrollY < runningSectionTop - snapBuffer) {
        // Si estamos en la zona de las cards y nos desplazamos hacia abajo,
        // pero aún no hemos llegado a la RunningSection, permitimos el scroll nativo.
        // No llamamos a e.preventDefault() aquí.
      } else {
        // Si ya estamos en RunningSection o más abajo, permitimos el scroll nativo.
      }
    } 
    // Lógica para scroll hacia ARRIBA
    else if (scrollDirection === 'up' && e.deltaY < -5) { // Umbral para activar scroll hacia arriba
      // Si estamos en la RunningSection o más abajo y nos desplazamos hacia arriba,
      // y la parte superior de RunningSection está cerca del viewport,
      // permitimos el scroll nativo hasta que lleguemos a la zona de las cards.
      if (currentScrollY > cardsTop + snapBuffer) {
        // Si estamos por debajo de las cards, y nos movemos hacia arriba, no hacemos snap,
        // dejamos que el scroll nativo nos lleve hasta las cards.
      } else if (currentScrollY > headerTop + snapBuffer) { // Si estamos en la zona de las cards y nos desplazamos hacia arriba
        e.preventDefault(); // Prevenir scroll nativo
        smoothScrollTo(headerTop); // Snap al header
      } else {
        // Si ya estamos en el header o más arriba, permitimos el scroll nativo.
      }
    }
  }, [smoothScrollTo]);

  // Manejador del evento 'keydown' (teclas de flecha, espacio, etc.)
  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (isScrollingProgrammatically.current) {
      e.preventDefault();
      return;
    }

    if (['Space', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.code)) {
      const currentScrollY = window.scrollY;
      const cardsTop = cardsRef.current?.offsetTop || Infinity;
      const runningSectionTop = runningSectionRef.current?.offsetTop || Infinity;

      const snapBuffer = window.innerHeight * 0.1; // 10% de la altura de la ventana
      scrollVelocity.current = 5; // Velocidad base para teclado

      // Lógica para scroll hacia ABAJO con teclado
      if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
        // Si estamos en la parte superior (header) y nos desplazamos hacia abajo
        if (currentScrollY < cardsTop - snapBuffer) {
          e.preventDefault(); // Prevenir scroll nativo
          smoothScrollTo(cardsRef.current as HTMLElement); // Snap a las cards
        } else if (currentScrollY < runningSectionTop - snapBuffer) {
          // Si estamos en la zona de las cards y nos desplazamos hacia abajo,
          // pero aún no hemos llegado a la RunningSection, permitimos el scroll nativo.
        } else {
          // Si ya estamos en RunningSection o más abajo, permitimos el scroll nativo.
        }
      } 
      // Lógica para scroll hacia ARRIBA con teclado
      else if (['ArrowUp', 'PageUp'].includes(e.code)) {
        // Si estamos en la RunningSection o más abajo y nos desplazamos hacia arriba,
        // y la parte superior de RunningSection está cerca del viewport,
        // permitimos el scroll nativo hasta que lleguemos a la zona de las cards.
        if (currentScrollY > cardsTop + snapBuffer) {
          // Si estamos por debajo de las cards, y nos movemos hacia arriba, no hacemos snap,
          // dejamos que el scroll nativo nos lleve hasta las cards.
        } else if (currentScrollY > snapBuffer) { // Si estamos en la zona de las cards y nos desplazamos hacia arriba
          e.preventDefault(); // Prevenir scroll nativo
          smoothScrollTo(0); // Snap al header
        } else {
          // Si ya estamos en el header o más arriba, permitimos el scroll nativo.
        }
      }
    }
  }, [smoothScrollTo]);

  // Efecto para añadir y limpiar los event listeners de scroll y teclado
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
      {/* El HeaderFuturista (sección hero) se renderiza SOLO en la página de inicio */}
      <div ref={headerRef}>
        <HeaderFuturista />
      </div>
      
      {/* Contenedor principal de las cards */}
      <div ref={cardsRef}>
        <div className="container mx-auto py-8"> 
          {loading ? (
            <div className="text-center text-lg text-gray-600">Cargando zapatillas...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-600">{error}</div>
          ) : sneakers.length === 0 ? (
            <div className="text-center text-lg text-gray-600">No se encontraron zapatillas.</div>
          ) : (
            <SneakersGrid sneakers={sneakers} />
          )}
        </div>
      </div>

      {/* Renderiza RunningSection y el contenido adicional SOLO después de que las cards hayan cargado */}
      {!loading && !error && sneakers.length > 0 && (
        <>
          {/* RunningSection con su referencia */}
          <div ref={runningSectionRef} className="w-full min-h-screen bg-white">
            <RunningSection />
          </div>

          {/* Contenido adicional con su referencia */}
          <div ref={bottomContentRef} className="h-[100vh] bg-gray-100 flex items-center justify-center text-gray-700">
            <p className="text-2xl">Desliza hacia arriba para volver al inicio.</p>
          </div>
        </>
      )}
    </>
  );
}

export const Route = createFileRoute('/')({
  component: HomePageContent,
});
