import React from 'react';
import { Film, Sparkles, Bookmark, Compass, MapPin } from 'lucide-react';

interface HeaderProps {
  onOpenAiGuide: () => void;
  savedCount: number;
  onOpenSaved: () => void;
  activeView: 'split' | 'cards' | 'map';
  setActiveView: (view: 'split' | 'cards' | 'map') => void;
  activeLocationName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAiGuide,
  savedCount,
  onOpenSaved,
  activeView,
  setActiveView,
  activeLocationName,
}) => {
  return (
    <header className="relative border-b border-[#2d2922] bg-[#0f1118]/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      {/* Vintage decorative gold top border stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#805e19] via-[#d4af37] to-[#805e19]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#241e12] to-[#12131a] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner shadow-black">
            <Film className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f7e3af] via-[#d4af37] to-[#b3892c]">
                CINERUTA
              </span>
              <span className="font-mono-code text-[10px] tracking-widest text-[#d4af37]/80 uppercase px-1.5 py-0.5 border border-[#d4af37]/30 rounded">
                ESPAÑA
              </span>
            </div>
            <p className="text-xs text-[#a09e99] flex items-center gap-1.5">
              <span>Guía de Cartelera & Cines Cercanos</span>
              {activeLocationName && (
                <>
                  <span className="text-[#68655e]">·</span>
                  <span className="text-[#d4af37] font-medium flex items-center gap-0.5 truncate max-w-[180px] sm:max-w-[260px]">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {activeLocationName}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* View switcher & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* View Segmented Control */}
          <div className="hidden md:flex items-center p-1 bg-[#161822] border border-[#2e3142] rounded-lg text-xs">
            <button
              onClick={() => setActiveView('split')}
              className={`px-3 py-1.5 rounded transition-all font-medium ${
                activeView === 'split'
                  ? 'bg-[#d4af37] text-[#0d0e12] shadow-sm font-semibold'
                  : 'text-[#a3a19d] hover:text-[#e8e6e3]'
              }`}
            >
              Cartelera y Mapa
            </button>
            <button
              onClick={() => setActiveView('cards')}
              className={`px-3 py-1.5 rounded transition-all font-medium ${
                activeView === 'cards'
                  ? 'bg-[#d4af37] text-[#0d0e12] shadow-sm font-semibold'
                  : 'text-[#a3a19d] hover:text-[#e8e6e3]'
              }`}
            >
              Billetes de Cine
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-3 py-1.5 rounded transition-all font-medium ${
                activeView === 'map'
                  ? 'bg-[#d4af37] text-[#0d0e12] shadow-sm font-semibold'
                  : 'text-[#a3a19d] hover:text-[#e8e6e3]'
              }`}
            >
              Mapa
            </button>
          </div>

          {/* AI Cinema Advisor button */}
          <button
            onClick={onOpenAiGuide}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#241e12] to-[#1e1b15] border border-[#d4af37]/60 text-[#f7e3af] hover:border-[#d4af37] hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all"
            title="Consultar al experto cinematográfico"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">Guía Cinéfilo</span>
            <span className="sm:hidden">Guía</span>
          </button>

          {/* Saved / Favorites ticket button */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-[#161822] border border-[#2e3142] text-[#e8e6e3] hover:border-[#d4af37]/50 transition-all"
            title="Mis cines guardados"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">Guardados</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-[#d4af37] text-[#0d0e12] font-mono-code font-bold text-[10px] rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
