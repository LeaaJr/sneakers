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
  const runningSectionRef = React.useRef<HTMLDivElement>(null); // Referencia para RunningSection (para definir el límite del snapping)
  const bottomContentRef = React.useRef<HTMLDivElement>(null); // Referencia para el contenido inferior

  // Refs para la lógica de scroll
  const isScrollingProgrammatically = React.useRef(false);
  const animationFrameRef = React.useRef<number | null>(null);
  const lastScrollTime = React.useRef(0);
  const lastScrollY = React.useRef(0);
  const scrollVelocity = React.useRef(0);

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
    const headerTop = 0; // La parte superior de la página
    const cardsTop = cardsRef.current?.offsetTop || Infinity;
    // El límite inferior de la zona de snapping es justo al inicio de RunningSection
    const snapZoneBottomThreshold = runningSectionRef.current?.offsetTop || Infinity; 

    // Determinar si el scroll actual está dentro de la zona donde queremos snapping
    // Esto es: si estamos por encima del inicio de RunningSection
    const isInSnappingZone = currentScrollY < snapZoneBottomThreshold; 

    if (isInSnappingZone) {
      e.preventDefault(); // Prevenir el scroll nativo SOLO si estamos en la zona de snapping

      if (scrollDirection === 'down' && e.deltaY > 5) { // Umbral para activar scroll hacia abajo
        // Si estamos en el header y nos desplazamos hacia abajo, ir a las cards
        if (currentScrollY < cardsTop - (window.innerHeight * 0.1)) { // Un pequeño buffer para el snap
          smoothScrollTo(cardsRef.current as HTMLElement);
        }
        // Si ya estamos en las cards o un poco más abajo, pero aún en la zona de snapping,
        // y el usuario sigue desplazándose hacia abajo, permitimos que el scroll nativo tome el control
        // para pasar a la siguiente sección (RunningSection), ya que esta es la última sección con snapping.
        // No necesitamos un `smoothScrollTo` aquí, ya que el `preventDefault` no se llamará una vez que salgamos de la zona.
      } else if (scrollDirection === 'up' && e.deltaY < -5) { // Umbral para activar scroll hacia arriba
        // Si estamos en las cards y nos desplazamos hacia arriba, ir al header
        if (currentScrollY > cardsTop + (window.innerHeight * 0.1)) { // Un pequeño buffer para el snap
          smoothScrollTo(cardsRef.current as HTMLElement);
        } else if (currentScrollY > headerTop) { // Si estamos en el header, ir a la parte superior
          smoothScrollTo(headerTop);
        }
      }
    }
    // Si `isInSnappingZone` es falso, `e.preventDefault()` no se llama,
    // y el navegador gestiona el scroll de forma normal para el resto de la página.
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
      const runningSectionTop = runningSectionRef.current?.offsetTop || Infinity; // Límite de la zona de snapping

      const isInSnappingZone = currentScrollY < runningSectionTop;

      if (isInSnappingZone) {
        e.preventDefault(); // Prevenir el scroll nativo SOLO si estamos en la zona de snapping
        scrollVelocity.current = 5; // Velocidad base para teclado

        // Lógica para scroll hacia ABAJO con teclado
        if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
          if (currentScrollY < cardsTop - (window.innerHeight * 0.1)) {
            smoothScrollTo(cardsRef.current as HTMLElement);
          }
        } 
        // Lógica para scroll hacia ARRIBA con teclado
        else if (['ArrowUp', 'PageUp'].includes(e.code)) {
          if (currentScrollY > cardsTop + (window.innerHeight * 0.1)) {
            smoothScrollTo(cardsRef.current as HTMLElement);
          } else if (currentScrollY > 0) {
            smoothScrollTo(0);
          }
        }
      }
      // Si `isInSnappingZone` es falso, `e.preventDefault()` no se llama,
      // y el navegador gestiona el scroll de forma normal para el resto de la página.
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
