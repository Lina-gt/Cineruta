import React from 'react';
import { X, Bookmark, ExternalLink, MapPin, Trash2, Ticket } from 'lucide-react';
import { Cinema } from '../types/cinema';
import { formatDistance } from '../utils/geo';

interface SavedCinemasDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCinemas: Cinema[];
  onRemoveSaved: (cinemaId: string) => void;
  onSelectCinema: (cinema: Cinema) => void;
}

export const SavedCinemasDrawer: React.FC<SavedCinemasDrawerProps> = ({
  isOpen,
  onClose,
  savedCinemas,
  onRemoveSaved,
  onSelectCinema,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-[#131520] border-l border-[#35384c] h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#2b2e40] bg-[#0e1018] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h2 className="font-cinzel text-lg font-bold text-[#f2efe9]">
                Mi Pasaporte Cinéfilo
              </h2>
              <p className="text-xs text-[#8c8981]">
                {savedCinemas.length} {savedCinemas.length === 1 ? 'cine guardado' : 'cines guardados'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1a1c28] text-[#8e8b83] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {savedCinemas.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Ticket className="w-12 h-12 text-[#46443c] mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#b5b2aa] mb-1">
                No tienes cines guardados
              </h3>
              <p className="text-xs text-[#78756d] max-w-xs mx-auto">
                Marca tus salas favoritas haciendo clic en el icono de marcador en cada ficha de cine.
              </p>
            </div>
          ) : (
            savedCinemas.map((cinema) => (
              <div
                key={cinema.id}
                className="p-3.5 rounded-xl bg-[#181a26] border border-[#2c2f42] hover:border-[#8f7435] transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-mono-code text-[10px] text-[#d4af37] tracking-wider uppercase">
                    {cinema.brand} · {cinema.postalCode}
                  </span>
                  <button
                    onClick={() => onRemoveSaved(cinema.id)}
                    className="text-[#7d7a72] hover:text-[#ff8282] p-1"
                    title="Eliminar de guardados"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 
                  onClick={() => {
                    onSelectCinema(cinema);
                    onClose();
                  }}
                  className="font-cinzel text-base font-bold text-[#f7ede1] hover:text-[#ffd97d] cursor-pointer transition-colors"
                >
                  {cinema.name}
                </h4>

                <p className="text-xs text-[#9c9991] flex items-center gap-1 my-1">
                  <MapPin className="w-3 h-3 text-[#d4af37]" />
                  <span>{cinema.address}, {cinema.city}</span>
                </p>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#242738] text-xs">
                  <button
                    onClick={() => {
                      onSelectCinema(cinema);
                      onClose();
                    }}
                    className="text-[#ffd97d] hover:underline font-medium"
                  >
                    Ver cartelera
                  </button>

                  <a
                    href={cinema.carteleraUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#b8b5ad] hover:text-white"
                  >
                    <span>Web oficial</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
