import React from 'react';
import { 
  Sparkles, 
  Accessibility, 
  Car, 
  Glasses, 
  Volume2, 
  Armchair, 
  Languages, 
  Film, 
  Layers, 
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { CinemaChain, SearchFilterState } from '../types/cinema';

interface FilterBarProps {
  filters: SearchFilterState;
  onChangeFilter: <K extends keyof SearchFilterState>(key: K, value: SearchFilterState[K]) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilter,
  onResetFilters,
  totalResults,
}) => {
  const chains: { label: string; value: CinemaChain | 'all' }[] = [
    { label: 'Todas las cadenas', value: 'all' },
    { label: 'Independientes', value: 'Independiente' },
    { label: 'Filmotecas', value: 'Filmoteca' },
    { label: 'Yelmo Cines', value: 'Yelmo' },
    { label: 'Cinesa', value: 'Cinesa' },
    { label: 'Kinépolis', value: 'Kinépolis' },
    { label: 'Renoir', value: 'Renoir' },
    { label: 'Golem', value: 'Golem' },
  ];

  const hasActiveFilters = 
    filters.onlyVOSE ||
    filters.onlyIndependent ||
    filters.chainFilter !== 'all' ||
    filters.requireParking ||
    filters.requireAccessible ||
    filters.require3DOrImax ||
    filters.requireAtmos ||
    filters.requireVip;

  return (
    <div className="bg-[#12131b] border-b border-[#252837] py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* Top row: Chains tabs & Sort by */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Chain quick tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            <span className="text-[#86837b] text-xs mr-1 font-medium whitespace-nowrap">
              Cadena:
            </span>
            {chains.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => onChangeFilter('chainFilter', c.value)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                  filters.chainFilter === c.value
                    ? 'bg-[#d4af37] text-[#0d0e12] font-semibold shadow-sm'
                    : 'bg-[#181a26] text-[#b8b5ad] hover:text-[#f0ede6] hover:bg-[#202334] border border-[#2b2e40]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Sort selector & Count */}
          <div className="flex items-center gap-3 ml-auto text-xs">
            <span className="text-[#a8a59e] font-mono-code">
              {totalResults} {totalResults === 1 ? 'cine encontrado' : 'cines encontrados'}
            </span>

            <div className="flex items-center gap-1.5 bg-[#181a26] border border-[#2b2e40] px-2.5 py-1 rounded-lg">
              <span className="text-[#7f7c75]">Ordenar:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => onChangeFilter('sortBy', e.target.value as any)}
                className="bg-transparent text-[#e4e1d9] font-medium focus:outline-none cursor-pointer"
              >
                <option value="distance" className="bg-[#181a26] text-[#e4e1d9]">Más cercanos</option>
                <option value="screens" className="bg-[#181a26] text-[#e4e1d9]">Número de salas</option>
                <option value="rating" className="bg-[#181a26] text-[#e4e1d9]">Mejor valorados</option>
                <option value="name" className="bg-[#181a26] text-[#e4e1d9]">Nombre A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom row: Feature toggles (VOSE, Independent, 3D/IMAX, Parking, Accessible, etc.) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#1d202e]">
          <span className="text-xs text-[#86837b] mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtros:
          </span>

          {/* VOSE filter */}
          <button
            type="button"
            onClick={() => onChangeFilter('onlyVOSE', !filters.onlyVOSE)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.onlyVOSE
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd97d]'
                : 'bg-[#181a26] border border-[#2b2e40] text-[#a09d94] hover:text-[#e8e6e3]'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-[#d4af37]" />
            Versión Original (VOSE)
          </button>

          {/* Independent / Indie */}
          <button
            type="button"
            onClick={() => onChangeFilter('onlyIndependent', !filters.onlyIndependent)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.onlyIndependent
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd97d]'
                : 'bg-[#181a26] border border-[#2b2e40] text-[#a09d94] hover:text-[#e8e6e3]'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-[#d4af37]" />
            Cines Independientes / Autor
          </button>

          {/* 3D / IMAX */}
          <button
            type="button"
            onClick={() => onChangeFilter('require3DOrImax', !filters.require3DOrImax)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.require3DOrImax
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd97d]'
                : 'bg-[#181a26] border border-[#2b2e40] text-[#a09d94] hover:text-[#e8e6e3]'
            }`}
          >
            <Glasses className="w-3.5 h-3.5 text-[#d4af37]" />
            3D / Pantalla IMAX
          </button>

          {/* Dolby Atmos */}
          <button
            type="button"
            onClick={() => onChangeFilter('requireAtmos', !filters.requireAtmos)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.requireAtmos
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd97d]'
                : 'bg-[#181a26] border border-[#2b2e40] text-[#a09d94] hover:text-[#e8e6e3]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
            Dolby Atmos
          </button>

          {/* Parking */}
          <button
            type="button"
            onClick={() => onChangeFilter('requireParking', !filters.requireParking)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.requireParking
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd97d]'
                : 'bg-[#181a26] border border-[#2b2e40] text-[#a09d94] hover:text-[#e8e6e3]'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-[#d4af37]" />
            Con Parking
          </button>

          {/* PMR Accessible */}
          <button
            type="button"
            onClick={() => onChangeFilter('requireAccessible', !filters.requireAccessible)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.requireAccessible
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd97d]'
                : 'bg-[#181a26] border border-[#2b2e40] text-[#a09d94] hover:text-[#e8e6e3]'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5 text-[#d4af37]" />
            Accesibilidad PMR
          </button>

          {/* VIP Seats */}
          <button
            type="button"
            onClick={() => onChangeFilter('requireVip', !filters.requireVip)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.requireVip
                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd97d]'
                : 'bg-[#181a26] border border-[#2b2e40] text-[#a09d94] hover:text-[#e8e6e3]'
            }`}
          >
            <Armchair className="w-3.5 h-3.5 text-[#d4af37]" />
            Butacas VIP / Reclinables
          </button>

          {/* Reset button if any filter active */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-[#a09d94] hover:text-[#ff9888] hover:bg-[#2e1d1d] transition-colors ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Restablecer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
