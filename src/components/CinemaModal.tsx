import React from 'react';
import { 
  X, 
  MapPin, 
  Film, 
  ExternalLink, 
  Navigation, 
  Bookmark, 
  Clock, 
  Phone, 
  Car, 
  Accessibility, 
  Volume2, 
  Glasses, 
  Armchair, 
  Coffee, 
  Languages, 
  Ticket,
  Calendar,
  Share2
} from 'lucide-react';
import { Cinema } from '../types/cinema';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../utils/geo';

interface CinemaModalProps {
  cinema: Cinema | null;
  onClose: () => void;
  calculatedDistanceKm?: number;
  userCoords?: { lat: number; lng: number };
  isSaved: boolean;
  onToggleSave: (cinemaId: string) => void;
}

export const CinemaModal: React.FC<CinemaModalProps> = ({
  cinema,
  onClose,
  calculatedDistanceKm,
  userCoords,
  isSaved,
  onToggleSave,
}) => {
  if (!cinema) return null;

  const directionsUrl = getGoogleMapsDirectionsUrl(cinema.address, cinema.name, userCoords);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${cinema.name} - Cartelera`,
        text: `Descubre la cartelera y sesiones de ${cinema.name} en ${cinema.city}`,
        url: cinema.carteleraUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(cinema.carteleraUrl);
      alert('¡Enlace a la cartelera copiado al portapapeles!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#141622] border-2 border-[#806b2f] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Vintage gold top bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#9e7626] via-[#ffd97d] to-[#9e7626]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#2b2e40] bg-[#10121c] flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#a39f96] mb-1.5 font-mono-code">
              <span className="text-[#d4af37] font-bold uppercase">{cinema.brand}</span>
              <span>·</span>
              <span>C.P. {cinema.postalCode}</span>
              <span>·</span>
              <span className="text-[#a1e3a1]">
                {formatDistance(calculatedDistanceKm)} de distancia
              </span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f7ede1]">
              {cinema.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#b0ada5] flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{cinema.address}, {cinema.city} ({cinema.province})</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(cinema.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#ffd97d]'
                  : 'bg-[#1b1d2c] border-[#2f334a] text-[#8e8a82] hover:text-[#ffd97d]'
              }`}
              title={isSaved ? 'Quitar de guardados' : 'Guardar cine'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#d4af37]' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-[#1b1d2c] border border-[#2f334a] text-[#8e8a82] hover:text-[#ffd97d] transition-colors"
              title="Compartir cartelera"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#1b1d2c] border border-[#2f334a] text-[#8e8a82] hover:text-white transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Cinema description / editorial notes */}
          <div className="bg-[#181a27] p-4 rounded-xl border border-[#2c3044] text-sm text-[#d4d1c9] leading-relaxed">
            <p>{cinema.description}</p>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#11131c] rounded-lg border border-[#262838]">
              <span className="text-[11px] text-[#7d7a72] block">Salas de proyección</span>
              <span className="text-lg font-bold font-mono-code text-[#ffd97d]">{cinema.screens} salas</span>
            </div>
            <div className="p-3 bg-[#11131c] rounded-lg border border-[#262838]">
              <span className="text-[11px] text-[#7d7a72] block">Versión Original</span>
              <span className="text-sm font-semibold text-[#f0ede6]">
                {cinema.hasVOSE ? 'Subtitulada (VOSE)' : 'Doblada al castellano'}
              </span>
            </div>
            <div className="p-3 bg-[#11131c] rounded-lg border border-[#262838]">
              <span className="text-[11px] text-[#7d7a72] block">Día del Espectador</span>
              <span className="text-sm font-semibold text-[#ffd97d]">{cinema.spectatorDay}</span>
            </div>
            <div className="p-3 bg-[#11131c] rounded-lg border border-[#262838]">
              <span className="text-[11px] text-[#7d7a72] block">Tarifas orientativas</span>
              <span className="text-xs font-semibold text-[#f0ede6] block mt-0.5">{cinema.pricingInfo}</span>
            </div>
          </div>

          {/* Services & Technical Specs */}
          <div>
            <h3 className="text-xs uppercase font-mono-code tracking-wider text-[#a09d94] mb-2.5">
              Servicios y Equipamiento
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${cinema.services.accessible ? 'bg-[#181b28] border-[#34384e] text-[#d6d3cb]' : 'bg-[#111219] border-[#222432] text-[#636058]'}`}>
                <Accessibility className="w-4 h-4 text-[#d4af37]" />
                <span>Accesible PMR</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${cinema.services.parking ? 'bg-[#181b28] border-[#34384e] text-[#d6d3cb]' : 'bg-[#111219] border-[#222432] text-[#636058]'}`}>
                <Car className="w-4 h-4 text-[#d4af37]" />
                <span>Parking propio</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${cinema.services.imax ? 'bg-[#181b28] border-[#34384e] text-[#ffd97d] font-semibold' : 'bg-[#111219] border-[#222432] text-[#636058]'}`}>
                <Film className="w-4 h-4 text-[#d4af37]" />
                <span>Pantalla IMAX</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${cinema.services.threeD ? 'bg-[#181b28] border-[#34384e] text-[#d6d3cb]' : 'bg-[#111219] border-[#222432] text-[#636058]'}`}>
                <Glasses className="w-4 h-4 text-[#d4af37]" />
                <span>Proyección 3D</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${cinema.services.atmosSound ? 'bg-[#181b28] border-[#34384e] text-[#d6d3cb]' : 'bg-[#111219] border-[#222432] text-[#636058]'}`}>
                <Volume2 className="w-4 h-4 text-[#d4af37]" />
                <span>Dolby Atmos</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${cinema.services.vipSeats ? 'bg-[#181b28] border-[#34384e] text-[#d6d3cb]' : 'bg-[#111219] border-[#222432] text-[#636058]'}`}>
                <Armchair className="w-4 h-4 text-[#d4af37]" />
                <span>Butacas VIP</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${cinema.services.barOrCafe ? 'bg-[#181b28] border-[#34384e] text-[#d6d3cb]' : 'bg-[#111219] border-[#222432] text-[#636058]'}`}>
                <Coffee className="w-4 h-4 text-[#d4af37]" />
                <span>Bar / Cafetería</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${cinema.hasVOSE ? 'bg-[#181b28] border-[#34384e] text-[#d6d3cb]' : 'bg-[#111219] border-[#222432] text-[#636058]'}`}>
                <Languages className="w-4 h-4 text-[#d4af37]" />
                <span>VOSE</span>
              </div>
            </div>
          </div>

          {/* Billboard Films & Showtimes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase font-mono-code tracking-wider text-[#ffd97d] flex items-center gap-1.5 font-bold">
                <Ticket className="w-3.5 h-3.5" />
                Cartelera y Sesiones Disponibles Hoy
              </h3>
              <span className="text-xs text-[#807d75]">Haz clic en una sesión para comprar</span>
            </div>

            <div className="space-y-3">
              {cinema.movies.map((movie) => (
                <div 
                  key={movie.id}
                  className="p-4 rounded-xl bg-[#181a27] border border-[#2e3146] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-[#f7ede1]">{movie.title}</h4>
                      <span className="px-2 py-0.5 text-xs font-mono-code bg-[#242738] text-[#ffd97d] border border-[#3c4059] rounded">
                        {movie.format}
                      </span>
                    </div>

                    <div className="text-xs text-[#a09d94]">
                      {movie.director && <span>Dir: {movie.director} · </span>}
                      <span>{movie.genre} · </span>
                      <span>{movie.durationMinutes} minutos · </span>
                      <span className="text-[#ffd97d]">{movie.room}</span>
                    </div>

                    {movie.synopsis && (
                      <p className="text-xs text-[#827f77] line-clamp-2 max-w-xl">
                        {movie.synopsis}
                      </p>
                    )}
                  </div>

                  {/* Showtime badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {movie.times.map((time) => (
                      <a
                        key={time}
                        href={cinema.carteleraUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-mono-code font-bold bg-[#262a3d] hover:bg-[#d4af37] hover:text-[#0d0e12] text-[#dedbd4] border border-[#3e425c] rounded-lg transition-all shadow-sm"
                        title={`Ir a comprar entrada para las ${time}`}
                      >
                        {time}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 sm:p-5 border-t border-[#2b2e40] bg-[#10121c] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-[#8c8981]">
            <a 
              href={`tel:${cinema.phone}`}
              className="flex items-center gap-1 text-[#b5b2a9] hover:text-white"
            >
              <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{cinema.phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#1c1e2b] hover:bg-[#252839] border border-[#313548] text-[#e8e6e3] flex items-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Cómo llegar</span>
            </a>

            <a
              href={cinema.carteleraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ba9427] hover:from-[#e3be44] hover:to-[#cda532] text-[#0d0e12] flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>Cartelera Oficial & Compra</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
