// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { HeaderFuturista } from '@/components/Header';
import { SneakersGrid } from '@/components/SneakersGrid';
// Corrected import: Use 'type' keyword for Sneaker as it's a type
import { fetchSneakers, type Sneaker } from '@/services/sneakerService'; 

// Define el componente que se renderizará para la ruta raíz (/)
function HomePageContent() {
  // Estado para almacenar los datos de las zapatillas
  const [sneakers, setSneakers] = React.useState<Sneaker[]>([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = React.useState(true);
  // Estado para manejar errores
  const [error, setError] = React.useState<string | null>(null);

  // Referencias para los elementos DOM
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);

  // Refs para la lógica de scroll
  const isScrollingProgrammatically = React.useRef(false); // Bandera para controlar scrolls iniciados por código
  const animationFrameRef = React.useRef<number | null>(null); // Para cancelar animaciones previas
  const lastScrollTime = React.useRef(0); // Para calcular la velocidad
  const lastScrollY = React.useRef(0); // Para detectar la dirección
  const scrollVelocity = React.useRef(0); // Velocidad calculada del scroll del usuario

  // Función easeOutCubic para una animación más natural
  const easeOutCubic = (t: number) => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Función para realizar el scroll suave a un objetivo (posición o elemento)
  const smoothScrollTo = React.useCallback((target: number | HTMLElement) => {
    // Si ya hay una animación en curso, la cancelamos para iniciar una nueva
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startPosition = window.scrollY; // Posición actual del scroll
    let targetPosition: number;
    
    // Determina la posición final del scroll
    if (typeof target === 'number') {
      targetPosition = target; // Si es un número, es la posición absoluta
    } else {
      // Si es un elemento, calcula su posición absoluta en el ventana
      const rect = target.getBoundingClientRect();
      targetPosition = rect.top + startPosition; 
    }

    const distance = targetPosition - startPosition; // Distancia a recorrer
    
    // Duración de la animación basada en la velocidad del scroll del usuario
    const baseDuration = 700; // Duración base en milisegundos
    // Factor de velocidad: entre 1 y 15, para que scrolls rápidos resulten en animaciones más cortas
    const velocityFactor = Math.min(Math.max(Math.abs(scrollVelocity.current), 1), 15); 
    // La duración final será inversamente proporcional a la velocidad, con un mínimo de 350ms
    const duration = Math.max(350, baseDuration / velocityFactor); 
    
    let startTime: number | null = null; // Tiempo de inicio de la animación

    // Función que se ejecuta en cada frame de la animación
    const animateScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime; // Establece el tiempo de inicio en el primer frame
      const timeElapsed = currentTime - startTime; // Tiempo transcurrido
      const progress = Math.min(timeElapsed / duration, 1); // Progreso de la animación (0 a 1)
      
      // Calcula la nueva posición usando la función de easing
      window.scrollTo(0, startPosition + distance * easeOutCubic(progress));
      
      // Si la animación no ha terminado, solicita el siguiente frame
      if (timeElapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      } else {
        // Cuando la animación termina, resetea la bandera para permitir nuevos scrolls del usuario
        isScrollingProgrammatically.current = false;
      }
    };

    // Inicia la animación y activa la bandera de scroll programático
    isScrollingProgrammatically.current = true;
    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, []); // Dependencias: ninguna, ya que usa refs y window.scrollY

  // Manejador del evento 'wheel' (scroll con rueda del ratón)
  const handleWheel = React.useCallback((e: WheelEvent) => {
    // Si hay un scroll programático en curso, ignoramos la entrada del usuario para evitar conflictos
    if (isScrollingProgrammatically.current) {
      e.preventDefault(); // Bloquea el scroll nativo si estamos animando
      return;
    }
    
    e.preventDefault(); // Bloquea el scroll nativo para tomar el control total

    const now = Date.now();
    const currentScrollY = window.scrollY;
    
    // Calcula la velocidad del scroll del usuario
    if (lastScrollTime.current) {
      const deltaTime = now - lastScrollTime.current;
      // Usamos el deltaY absoluto y un factor de escala para calcular la velocidad
      scrollVelocity.current = Math.min(Math.abs(e.deltaY) / (deltaTime || 3) * 0.5, 25);
    }
    
    lastScrollTime.current = now;
    lastScrollY.current = currentScrollY;

    // Determina la dirección del scroll
    const scrollDirection = e.deltaY > 1 ? 'down' : e.deltaY < -1 ? 'up' : 'none';

    const headerHeight = headerRef.current?.offsetHeight || 0;
    const cardsOffsetTop = cardsRef.current?.offsetTop || 0;

    // Lógica para scroll hacia ABAJO
    // Si el usuario desplaza hacia abajo y no estamos ya en la sección de cards
    if (scrollDirection === 'down' && currentScrollY < cardsOffsetTop) {
      // Un pequeño umbral para evitar que se active si solo se mueve un pixel
      if (e.deltaY > 5) { // Requiere un movimiento de rueda mínimo para activar
        smoothScrollTo(cardsRef.current as HTMLElement); // Desplaza a la sección de cards
      }
    } 
    // Lógica para scroll hacia ARRIBA
    // Si el usuario desplaza hacia arriba y no estamos ya en la parte superior
    else if (scrollDirection === 'up' && currentScrollY > 0) {
      // Un pequeño umbral para evitar que se active si solo se mueve un pixel
      if (e.deltaY < -5) { // Requiere un movimiento de rueda mínimo para activar
        smoothScrollTo(0); // Desplaza a la parte superior de la página
      }
    }
  }, [smoothScrollTo]); // Depende de smoothScrollTo

  // Manejador del evento 'keydown' (teclas de flecha, espacio, etc.)
  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    // Si hay un scroll programático en curso, ignoramos la entrada del usuario
    if (isScrollingProgrammatically.current) {
      e.preventDefault(); // Bloquea el scroll nativo si estamos animando
      return;
    }

    // Teclas que queremos interceptar para el scroll
    if (['Space', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.code)) {
      e.preventDefault(); // Bloquea el scroll nativo para estas teclas
      
      const currentScrollY = window.scrollY;
      const cardsOffsetTop = cardsRef.current?.offsetTop || 0;
      
      // Establece una velocidad base para el scroll por teclado
      scrollVelocity.current = 5; 

      // Lógica para scroll hacia ABAJO con teclado
      if (['ArrowDown', 'PageDown', 'Space'].includes(e.code) && currentScrollY < cardsOffsetTop) {
        if (cardsRef.current) {
          smoothScrollTo(cardsRef.current);
        }
      } 
      // Lógica para scroll hacia ARRIBA con teclado
      else if (['ArrowUp', 'PageUp'].includes(e.code) && currentScrollY > 0) {
        smoothScrollTo(0);
      }
    }
  }, [smoothScrollTo]); // Depende de smoothScrollTo

  // Efecto para añadir y limpiar los event listeners de scroll y teclado
  React.useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false }); // 'passive: false' es necesario para preventDefault
    window.addEventListener('keydown', handleKeyDown, { passive: false }); // 'passive: false' es necesario para preventDefault
    
    // Función de limpieza que se ejecuta cuando el componente se desmonta
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      // Asegúrate de limpiar cualquier animación pendiente
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleWheel, handleKeyDown]); // Depende de handleWheel y handleKeyDown

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
        <div className="container mx-auto py-40">
          <h2 className="text-3xl font-bold mb-8 text-center">Nuestras Últimas Colecciones</h2>
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

      {/* Añade más contenido debajo para permitir el scroll y probar el snap hacia arriba */}
      <div className="h-[100vh] bg-gray-100 flex items-center justify-center text-gray-700">
        <p className="text-2xl">Desliza hacia arriba para volver al inicio.</p>
      </div>
    </>
  );
}

export const Route = createFileRoute('/')({
  component: HomePageContent,
});
