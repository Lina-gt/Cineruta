import React, { useState } from 'react';
import { Search, MapPin, Navigation, Compass, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { POPULAR_CITIES, CityShortcut } from '../data/spanishProvinces';

interface SearchHeroProps {
  query: string;
  onQueryChange: (q: string) => void;
  radiusKm: number;
  onRadiusChange: (r: number) => void;
  onSelectCity: (city: CityShortcut) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  activeLocationName: string;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  query,
  onQueryChange,
  radiusKm,
  onRadiusChange,
  onSelectCity,
  onUseCurrentLocation,
  isLocating,
  activeLocationName,
}) => {
  const [inputValue, setInputValue] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onQueryChange(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue('');
    onQueryChange('');
  };

  return (
    <div className="relative py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-[#25221b] bg-gradient-to-b from-[#111219] via-[#0d0e14] to-[#0a0b10] film-grain">
      <div className="max-w-4xl mx-auto text-center">
        {/* Cinema tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1910] border border-[#d4af37]/30 text-[#e6cb85] text-xs font-mono-code mb-4">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
          SESIÓN CONTINUA · GEOLOCALIZADOR DE CINES Y SALAS
        </div>

        <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#f3ede0] mb-3">
          Encuentra tu cine más cercano
        </h1>
        <p className="text-sm sm:text-base text-[#a8a49c] max-w-2xl mx-auto mb-6">
          Ingresa tu <span className="text-[#ffd97d] font-medium">código postal</span> o <span className="text-[#ffd97d] font-medium">ciudad</span> en España. Analizamos las salas, versiones originales VOSE, distancias y enlaces directos a sus carteleras.
        </p>

        {/* Search bar input container */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-5">
          <div className="relative flex items-center bg-[#151722] border-2 border-[#3d3729] focus-within:border-[#d4af37] rounded-xl p-1.5 shadow-2xl transition-all">
            <div className="pl-3 pr-2 text-[#d4af37]">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value.length === 5 && /^\d{5}$/.test(e.target.value)) {
                  onQueryChange(e.target.value);
                }
              }}
              placeholder="Ej. 28004, 08012, 46001, Madrid, Barcelona, Santander..."
              className="w-full bg-transparent text-[#f2efe9] placeholder-[#76736c] text-sm sm:text-base px-2 py-2 focus:outline-none"
            />

            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2 text-xs text-[#8a8780] hover:text-[#f2efe9]"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}

            <button
              type="submit"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#ba9427] hover:from-[#e3be44] hover:to-[#cda532] text-[#0d0e12] font-semibold text-sm rounded-lg transition-all shadow-md active:scale-95"
            >
              Buscar
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1 text-xs text-[#a09e99]">
            {/* Geolocation trigger */}
            <button
              type="button"
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 text-[#d4af37] hover:text-[#f5d887] hover:underline font-medium transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Obteniendo GPS...' : 'Usar mi ubicación actual'}</span>
            </button>

            {/* Radius selector */}
            <div className="inline-flex items-center gap-1.5 ml-auto">
              <span className="text-[#7c7972]">Radio:</span>
              {[5, 15, 30, 60].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => onRadiusChange(km)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    radiusKm === km
                      ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd97d] font-semibold'
                      : 'border border-[#282a36] text-[#8e8b83] hover:text-[#e8e6e3]'
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Popular Spanish Cities Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl mx-auto pt-1">
          <span className="text-xs text-[#7c7972] mr-1 hidden sm:inline">Destinos cinéfilos:</span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => {
                setInputValue(city.name);
                onSelectCity(city);
              }}
              className="px-2.5 py-1 text-xs rounded-md bg-[#161824] border border-[#2d3040] hover:border-[#d4af37]/60 text-[#c7c4bc] hover:text-[#ffd97d] transition-all cursor-pointer"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
