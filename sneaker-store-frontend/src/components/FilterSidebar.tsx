// src/components/FilterSidebar.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';

interface FilterSidebarProps {
  availableCategories: string[];
  availableBrands: string[]; // Estos son nombres de marcas
}

export const FilterSidebar = ({ availableCategories, availableBrands }: FilterSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate({ from: '/all-products' });
  const search = useSearch({ from: '/all-products' });

  // Sincronizamos los valores de la URL con valores por defecto seguros
  const minPrice = search.minPrice !== undefined ? search.minPrice : '';
  const maxPrice = search.maxPrice !== undefined ? search.maxPrice : '';
  const selectedCategories = search.categories || [];
  const selectedBrand = search.brand || 'all';

  // Función para actualizar la URL
  const updateUrl = (newParams: Record<string, any>) => {
    navigate({
      search: (prev: any) => {
        const updated = { 
          ...prev, 
          ...newParams,
          // Si no hay categorías, lo removemos completamente
          categories: newParams.categories?.length ? newParams.categories : undefined,
          // Si es 'all', removemos el filtro de brand
          brand: newParams.brand === 'all' ? undefined : newParams.brand,
          // Si el precio está vacío, lo removemos
          minPrice: newParams.minPrice === '' ? undefined : Number(newParams.minPrice),
          maxPrice: newParams.maxPrice === '' ? undefined : Number(newParams.maxPrice),
        };
        
        // Limpiar undefined values
        Object.keys(updated).forEach(key => {
          if (updated[key] === undefined) {
            delete updated[key];
          }
        });
        
        return updated;
      },
      replace: true,
    });
  };

  const handleMinPriceChange = (value: string) => {
    const numValue = value === '' ? '' : Math.max(0, Number(value));
    updateUrl({ minPrice: numValue });
  };

  const handleMaxPriceChange = (value: string) => {
    const numValue = value === '' ? '' : Math.max(0, Number(value));
    updateUrl({ maxPrice: numValue });
  };

  const toggleCategory = (cat: string) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    updateUrl({ categories: next });
  };

  const handleBrandChange = (brandName: string) => {
    updateUrl({ brand: brandName });
  };

  const resetFilters = () => {
    navigate({ 
      search: {} 
    });
  };

  // Contador de filtros activos
  const activeFiltersCount = [
    search.minPrice !== undefined ? 1 : 0,
    search.maxPrice !== undefined ? 1 : 0,
    search.categories?.length || 0,
    search.brand && search.brand !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Botón Toggle (Cuando está cerrado) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-24 z-[1001] bg-white border border-gray-200 p-2 rounded-r-xl shadow-lg hover:bg-gray-50 transition-all group"
          aria-label="Open filters"
        >
          <ChevronRight size={24} className="text-gray-700" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#c91616] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      )}

      {/* Sidebar Overlay (para móviles) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[999] md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[280px] sm:w-[300px] bg-[#d3d7e3] z-[1000] transition-transform duration-300 ease-in-out transform shadow-2xl overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header del Sidebar */}
        <div className="p-6 flex justify-between items-center border-b border-black/10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-black uppercase tracking-wider">Filter</h2>
            {activeFiltersCount > 0 && (
              <span className="bg-black text-[#d3d7e3] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-black hover:rotate-90 transition-transform"
            aria-label="Close filters"
          >
            <ChevronLeft size={28} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Rango de Precio */}
          <section>
            <h3 className="text-black font-semibold mb-4 text-sm uppercase">Price Range</h3>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-black/70 block mb-1 uppercase">From</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => handleMinPriceChange(e.target.value)}
                  min="0"
                  placeholder="0"
                  className="w-full bg-black/10 border border-black/20 rounded p-2 text-black text-sm focus:bg-transparent focus:text-black outline-none transition-all placeholder-black/40"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-black/70 block mb-1 uppercase">To</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  min="0"
                  placeholder="500"
                  className="w-full bg-black/10 border border-black/20 rounded p-2 text-black text-sm focus:bg-transparent focus:text-black outline-none transition-all placeholder-black/40"
                />
              </div>
            </div>
          </section>

          {/* Categorías Dinámicas */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-black font-semibold text-sm uppercase">Categories</h3>
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => updateUrl({ categories: [] })}
                  className="text-xs text-black/70 hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`p-2 rounded text-xs font-medium transition-all border flex items-center justify-center
                    ${selectedCategories.includes(cat) 
                      ? 'bg-white text-[#c91616] border-black' 
                      : 'bg-transparent text-black border-black/20 hover:bg-black/5'}`}
                >
                  {cat}
                  {selectedCategories.includes(cat) && (
                    <X size={12} className="ml-1" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Marcas (Dropdown dentro de Sidebar) */}
          <section>
            <h3 className="text-black font-semibold mb-4 text-sm uppercase">Brand</h3>
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full bg-black/10 border border-black/20 rounded p-2 text-black text-sm outline-none focus:bg-transparent focus:text-black transition-all"
            >
              {availableBrands.map((brand) => (
                <option key={brand} value={brand} className="text-black">
                  {brand}
                </option>
              ))}
            </select>
          </section>

          {/* Botón Reset */}
              <button
                onClick={resetFilters}
                disabled={activeFiltersCount === 0}
                className={`bg-red-700 w-full py-3 rounded-xl text-sm font-bold border transition-colors duration-300 ease-in-out uppercase tracking-widest mt-10
                  ${activeFiltersCount === 0 
                    ? 'bg-gray-400/20 text-black/50 border-black/10 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600 text-white border-red-600'}`}
              >
                Clean filters
              </button>

          {/* Indicador de filtros activos */}
          {activeFiltersCount > 0 && (
            <div className="text-center">
              <p className="text-black/70 text-sm">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};