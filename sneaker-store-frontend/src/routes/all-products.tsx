// src/routes/all-products.tsx

import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { fetchSneakers, fetchAllCategories, type Sneaker, fetchAllBrands, type Brand, type Category } from '@/services/sneakerService'; 
import { Card } from '@/components/Cards';
import { FilterSidebar } from '@/components/FilterSidebar';
import { z } from 'zod';

const productSearchSchema = z.object({
  minPrice: z.number().optional().catch(undefined),
  maxPrice: z.number().optional().catch(undefined),
  categories: z.array(z.string()).optional().catch(undefined),
  brand: z.string().optional().catch(undefined),
});


const AllProductsPageComponent: React.FC = () => {
    const search = Route.useSearch();
    
    console.log('🔍 URL Search Params:', search);

    // 1. Cargamos todas las categorías
    const { data: categories = [], isLoading: loadingCategories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchAllCategories,
    });

    // 2. Cargamos todas las marcas
    const { data: brands = [], isLoading: loadingBrands } = useQuery<Brand[]>({
        queryKey: ['brands'],
        queryFn: fetchAllBrands,
    });

    // 3. Cargamos TODOS los sneakers (sin filtros)
    const { data: allSneakers = [], isLoading: loadingAllSneakers } = useQuery<Sneaker[]>({
        queryKey: ['all-sneakers'],
        queryFn: () => fetchSneakers(), // Sin parámetros para traer todo
    });

    // 4. Mapeo de categorías por ID para acceso rápido
    const categoryMap = useMemo(() => {
        const map = new Map<string, Category>();
        categories.forEach(category => {
            map.set(category.id, category);
        });
        return map;
    }, [categories]);

    // 5. Mapeo de marcas por ID para acceso rápido
    const brandMap = useMemo(() => {
        const map = new Map<string, Brand>();
        brands.forEach(brand => {
            map.set(brand.id, brand);
        });
        return map;
    }, [brands]);

    // 6. Filtrar en el FRONTEND
    const filteredSneakers = useMemo(() => {
        if (!allSneakers.length || !categories.length || !brands.length) {
            return allSneakers;
        }
        
        console.log('🔄 Filtering sneakers in frontend...');
        console.log('Total sneakers:', allSneakers.length);
        console.log('Total categories:', categories.length);
        console.log('Total brands:', brands.length);
        console.log('Active filters:', search);
        
        const result = allSneakers.filter((sneaker: Sneaker) => {
            let passesFilters = true;
            
            // 1. Filtrar por precio
            if (search.minPrice !== undefined) {
                if (sneaker.price < search.minPrice) {
                    console.log(`❌ Sneaker ${sneaker.title} - Price ${sneaker.price} < Min ${search.minPrice}`);
                    return false;
                }
            }
            
            if (search.maxPrice !== undefined) {
                if (sneaker.price > search.maxPrice) {
                    console.log(`❌ Sneaker ${sneaker.title} - Price ${sneaker.price} > Max ${search.maxPrice}`);
                    return false;
                }
            }
            
            // 2. Filtrar por categorías (usando category_id)
            if (search.categories && search.categories.length > 0) {
                // Obtener la categoría del sneaker
                const sneakerCategory = categoryMap.get(sneaker.category_id);
                
                if (!sneakerCategory) {
                    console.log(`❌ Sneaker ${sneaker.title} - No category found for ID: ${sneaker.category_id}`);
                    return false;
                }
                
                if (!search.categories.includes(sneakerCategory.name)) {
                    console.log(`❌ Sneaker ${sneaker.title} - Category "${sneakerCategory.name}" not in selected:`, search.categories);
                    return false;
                }
                
                console.log(`✅ Sneaker ${sneaker.title} - Category match: ${sneakerCategory.name}`);
            }
            
            // 3. Filtrar por marca
            if (search.brand && search.brand !== 'All') {
                // Encontrar la marca por nombre
                const selectedBrand = brands.find(b => b.name === search.brand);
                
                if (!selectedBrand) {
                    console.log(`❌ Sneaker ${sneaker.title} - Brand "${search.brand}" not found`);
                    return false;
                }
                
                if (sneaker.brand_id !== selectedBrand.id) {
                    console.log(`❌ Sneaker ${sneaker.title} - Brand ID mismatch: ${sneaker.brand_id} vs ${selectedBrand.id}`);
                    return false;
                }
                
                console.log(`✅ Sneaker ${sneaker.title} - Brand match: ${search.brand}`);
            }
            
            console.log(`✅ Sneaker ${sneaker.title} - PASSED ALL FILTERS`);
            return true;
        });
        
        console.log(`🎯 Filter result: ${result.length} of ${allSneakers.length} sneakers`);
        return result;
        
    }, [allSneakers, search, categories, brands, categoryMap, brandMap]);

    // 7. Mostrar información de filtrado
    console.log('📦 All sneakers:', allSneakers.length);
    console.log('📦 Filtered sneakers:', filteredSneakers.length);

    // Extraemos nombres de categorías para el sidebar
    const categoryNames = useMemo(() => 
        categories.map(c => c.name), 
        [categories]
    );
    
    // Preparamos marcas para el dropdown
    const availableBrands = useMemo(() => [
        'All',
        ...brands.map(brand => brand.name)
    ], [brands]);

    const isLoading = loadingCategories || loadingBrands || loadingAllSneakers;

    // Contador de filtros activos
    const activeFiltersCount = [
        search.minPrice !== undefined ? 1 : 0,
        search.maxPrice !== undefined ? 1 : 0,
        search.categories?.length || 0,
        search.brand && search.brand !== 'All' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    // Obtener nombres de categorías seleccionadas para mostrar
    const selectedCategoryNames = useMemo(() => {
        if (!search.categories?.length) return [];
        return search.categories;
    }, [search.categories]);

    return (
        <div className="min-h-screen bg-gray-50">
            <FilterSidebar 
              availableCategories={categoryNames} 
              availableBrands={availableBrands} 
            />

            <main className="container mx-auto px-4 py-10 pl-16">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-black text-gray-900 uppercase italic">
                        All Sneakers
                    </h1>
                    
                    <div className="flex items-center gap-4">
                        {!isLoading && (
                            <>
                                <span className="text-gray-600">
                                    Showing {filteredSneakers.length} of {allSneakers.length} sneakers
                                </span>
                                
                                {activeFiltersCount > 0 && (
                                    <span className="bg-[#c91616] text-white text-sm px-3 py-1 rounded-full">
                                        {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Panel de filtros activos */}
                {activeFiltersCount > 0 && !isLoading && (
                    <div className="mb-6 p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-700">Active Filters:</h3>
                            <span className="text-sm text-gray-500">
                                {filteredSneakers.length} results
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {search.minPrice !== undefined && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                                    Min: ${search.minPrice}
                                </span>
                            )}
                            {search.maxPrice !== undefined && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                                    Max: ${search.maxPrice}
                                </span>
                            )}
                            {selectedCategoryNames.map(cat => (
                                <span key={cat} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                                    {cat}
                                </span>
                            ))}
                            {search.brand && search.brand !== 'All' && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center">
                                    Brand: {search.brand}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {isLoading ? (
                   <div className="flex flex-col justify-center items-center h-64">
                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c91616] mb-4"></div>
                       <span className="text-gray-600">Loading sneakers...</span>
                       <span className="text-sm text-gray-400 mt-2">
                           Fetching {loadingCategories ? 'categories' : ''} 
                           {loadingBrands ? ' brands' : ''} 
                           {loadingAllSneakers ? ' sneakers' : ''}
                       </span>
                   </div>
                ) : filteredSneakers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <div className="text-5xl mb-4">😕</div>
                        <p className="text-gray-700 text-lg font-medium mb-2">
                            No sneakers found with the selected filters
                        </p>
                        <p className="text-gray-500 mb-6">
                            Try adjusting your filters or browse all {allSneakers.length} sneakers.
                        </p>
                        
                        {activeFiltersCount > 0 && (
                            <div className="inline-flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">Current filters:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {search.minPrice !== undefined && (
                                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                                            Min: ${search.minPrice}
                                        </span>
                                    )}
                                    {search.maxPrice !== undefined && (
                                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                                            Max: ${search.maxPrice}
                                        </span>
                                    )}
                                    {selectedCategoryNames.map(cat => (
                                        <span key={cat} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                                            {cat}
                                        </span>
                                    ))}
                                    {search.brand && search.brand !== 'All' && (
                                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                                            {search.brand}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredSneakers.map((sneaker: Sneaker) => {
                            // Obtener información de la categoría para debug
                            const category = categoryMap.get(sneaker.category_id);
                            const brand = brandMap.get(sneaker.brand_id);
                            
                            return (
                                <div key={sneaker.id} className="relative">
                                    <Card sneaker={sneaker} />
                                    {/* Info de debug (opcional - quitar después) */}
                                    <div className="text-xs text-gray-500 mt-2">
{/*                                         <div>Price: ${sneaker.price}</div>
                                        <div>Category: {category?.name || 'Unknown'}</div>
                                        <div>Brand: {brand?.name || 'Unknown'}</div> */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};


export const Route = createFileRoute('/all-products')({
  validateSearch: (search) => productSearchSchema.parse(search),
  component: AllProductsPageComponent,
});