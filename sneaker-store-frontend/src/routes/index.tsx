// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { HeaderFuturista } from '@/components/Header';
import { SneakersGrid } from '@/components/SneakersGrid';
import { fetchSneakers, type Sneaker } from '@/services/sneakerService';
import JordanSection from '@/sections/jordan/JordanSection';
// SportGridSection y AllCategoriesSection están en el render
import AllCategoriesSection from '@/sections/AllCategoriesSection'; 
import { Footer } from '@/components/Footer';
import { TrendingSection } from '@/sections/trending/TrendingSection';

// --- Definición de Tipos y Rutas ---
interface HomeSearch {
    scrollTo?: 'cards' | 'jordan' | 'trending' | 'categories';
}

export const Route = createFileRoute('/')({
    component: HomePageContent,
    validateSearch: (search): HomeSearch => { // Validamos la búsqueda
        return {
            scrollTo: search.scrollTo as HomeSearch['scrollTo']
        };
    },
});


// Componente principal de la página de inicio
function HomePageContent() {
    // Obtener el parámetro scrollTo de la URL
    const { scrollTo } = Route.useSearch(); 
    
    // ✅ React Query se encarga de loading, error y data
    const {
        data: sneakers = [],
        // ...
        isLoading,
        error,
    } = useQuery<Sneaker[], Error>({
        queryKey: ['allSneakers'],
        queryFn: fetchSneakers,
    });

    // --- Scroll y referencias de sección ---
    const headerRef = React.useRef<HTMLDivElement>(null);
    const cardsRef = React.useRef<HTMLDivElement>(null);
    // Renombramos la referencia original para usarla en JordanSection
    const jordanSectionRef = React.useRef<HTMLDivElement>(null); 
    const trendingSectionRef = React.useRef<HTMLDivElement>(null);
    const categoriesSectionRef = React.useRef<HTMLDivElement>(null); // Ref para AllCategoriesSection

    // Referencias y estados de control para el smooth scroll
    const isScrollingProgrammatically = React.useRef(false);
    const animationFrameRef = React.useRef<number | null>(null);
    const lastScrollTime = React.useRef(0);
    const scrollVelocity = React.useRef(0);


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

    // **NOTA:** He eliminado la variable 'runningSectionTop' de 'handleWheel' y 'handleKeyDown' 
    // porque ya no se usaba después de la lógica de 'snap' entre header y cards.
    // Si la lógica de snap entre las secciones inferiores es importante,
    // se tendría que reintroducir con las nuevas refs (jordanSectionRef, trendingSectionRef).

    // --- Manejo de la rueda (Scroll Snap Logic) ---
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
            const snapBuffer = window.innerHeight * 0.1;

            // ... (Tu lógica de Snap de Rueda se mantiene igual para Header/Cards) ...
            if (scrollDirection === 'down' && e.deltaY > 5) {
                if (currentScrollY < cardsTop - snapBuffer) {
                    e.preventDefault();
                    smoothScrollTo(cardsRef.current as HTMLElement);
                }
            } else if (scrollDirection === 'up' && e.deltaY < -5) {
                if (currentScrollY >= cardsTop - snapBuffer && currentScrollY < cardsTop + snapBuffer * 2) {
                    e.preventDefault();
                    smoothScrollTo(headerTop);
                }
            }

            const isNearCards = currentScrollY > cardsTop - snapBuffer && currentScrollY < cardsTop + window.innerHeight * 0.5;

            if (scrollDirection === 'up' && e.deltaY < -5 && isNearCards) {
                e.preventDefault();
                smoothScrollTo(headerTop);
            }

        },
        [smoothScrollTo]
    );

    // --- Manejo de teclado (Keydown Snap Logic) ---
    const handleKeyDown = React.useCallback(
        (e: KeyboardEvent) => {
            if (isScrollingProgrammatically.current) {
                e.preventDefault();
                return;
            }

            if (['Space', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.code)) {
                const currentScrollY = window.scrollY;
                const cardsTop = cardsRef.current?.offsetTop || Infinity;
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

    // --- Efecto para añadir/quitar Listeners ---
    React.useEffect(() => {
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeyDown, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [handleWheel, handleKeyDown]);


    // --- Efecto para el Scroll Automático (desde Navbar) 🚀 ---
    React.useEffect(() => {
        if (!scrollTo) return; // No hacer nada si no hay parámetro de scroll

        let targetRef: React.RefObject<HTMLDivElement> | null = null;

        switch (scrollTo) {
            case 'cards':
                targetRef = cardsRef;
                break;
            case 'trending':
                targetRef = trendingSectionRef;
                break;
            case 'categories':
                targetRef = categoriesSectionRef;
                break;
            case 'jordan':
                targetRef = jordanSectionRef;
                break;
            default:
                return;
        }

        if (targetRef?.current) {
            // Un pequeño delay para asegurar que el DOM se renderizó y las refs están correctas
            setTimeout(() => {
                smoothScrollTo(targetRef!.current!);
            }, 100);
        }
    }, [scrollTo, smoothScrollTo]); // Se ejecuta cuando 'scrollTo' cambia

    // --- Render ---
    return (
        <>
            <div ref={headerRef}>
                <HeaderFuturista />
            </div>

            {/* 1. SECCIÓN DE SNEAKERS GRID (Destino: 'cards') */}
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
                    {/* 2. JORDAN SECTION (Destino: 'jordan') */}
                    <div ref={jordanSectionRef} className="w-full min-h-screen bg-white">
                        <JordanSection />
                    </div>

                    {/* 3. TRENDING SECTION (Destino: 'trending') */}
                    <div ref={trendingSectionRef}> 
                        <TrendingSection />
                    </div>
                    
                    {/* 4. ALL CATEGORIES SECTION (Destino: 'categories') */}
                    <div
                        ref={categoriesSectionRef} 
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