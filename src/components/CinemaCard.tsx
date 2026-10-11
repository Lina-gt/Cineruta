import React from 'react';
import { 
  MapPin, 
  Film, 
  ExternalLink, 
  Navigation, 
  Bookmark, 
  Clock, 
  Accessibility, 
  Car, 
  Glasses, 
  Volume2, 
  Armchair, 
  Languages, 
  Coffee,
  Ticket,
  ChevronRight
} from 'lucide-react';
import { Cinema, MovieShowtime } from '../types/cinema';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../utils/geo';

interface CinemaCardProps {
  cinema: Cinema;
  calculatedDistanceKm?: number;
  userCoords?: { lat: number; lng: number };
  isSaved: boolean;
  onToggleSave: (cinemaId: string) => void;
  onSelectCinema: (cinema: Cinema) => void;
  isSelected?: boolean;
}

export const CinemaCard: React.FC<CinemaCardProps> = ({
  cinema,
  calculatedDistanceKm,
  userCoords,
  isSaved,
  onToggleSave,
  onSelectCinema,
  isSelected,
}) => {
  const directionsUrl = getGoogleMapsDirectionsUrl(cinema.address, cinema.name, userCoords);

  return (
    <article
      className={`relative group bg-[#13151f] border transition-all duration-300 rounded-xl overflow-hidden ${
        isSelected
          ? 'border-[#d4af37] ring-1 ring-[#d4af37]/60 shadow-[0_0_25px_rgba(212,175,55,0.2)]'
          : 'border-[#262939] hover:border-[#8f7435] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Vintage Ticket layout */}
      <div className="flex flex-col md:flex-row">
        
        {/* Left Ticket Stub (Classic Cinema Pass design) */}
        <div className="relative md:w-56 bg-gradient-to-b from-[#181a26] to-[#12131d] p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-[#3a372e]/60">
          
          {/* Ticket notches for vintage physical feel */}
          <div className="hidden md:block ticket-notch-right" />

          <div>
            {/* Ticket header serial number & stamp */}
            <div className="flex items-center justify-between text-[#807c74] font-mono-code text-[10px] tracking-widest pb-2 mb-2 border-b border-[#2a2c3a]">
              <span>PASAPORTE CINE</span>
              <span className="text-[#d4af37] font-semibold">{cinema.postalCode}</span>
            </div>

            {/* Brand / Circuit */}
            <div className="text-xs uppercase tracking-wider font-semibold text-[#c5a059] mb-1">
              {cinema.brand}
            </div>

            {/* Room stats and vintage features */}
            <div className="space-y-1.5 text-xs text-[#a3a099] my-3">
              <div className="flex items-center justify-between">
                <span>Salas activas:</span>
                <span className="font-mono-code font-bold text-[#e6e4df]">{cinema.screens}</span>
              </div>
              {cinema.yearEstablished && (
                <div className="flex items-center justify-between">
                  <span>Inauguración:</span>
                  <span className="font-mono-code text-[#b3b0a7]">{cinema.yearEstablished}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Versión Original:</span>
                <span className={`font-medium ${cinema.hasVOSE ? 'text-[#a1e3a1]' : 'text-[#8b8882]'}`}>
                  {cinema.hasVOSE ? 'Disponible (VOSE)' : 'Solo Doblado'}
                </span>
              </div>
            </div>

            {/* Spectator day note */}
            {cinema.spectatorDay && (
              <div className="mt-3 p-2 rounded bg-[#1f1d18] border border-[#d4af37]/20 text-[11px] text-[#e6cb85]">
                <span className="font-semibold block text-[#ffd97d]">Tarifa Especial:</span>
                <span className="line-clamp-2">{cinema.spectatorDay}</span>
              </div>
            )}
          </div>

          {/* Pricing range */}
          <div className="pt-3 mt-3 border-t border-[#262838] text-[11px] text-[#8e8b84]">
            <span className="block text-[#a8a59e]">{cinema.pricingInfo}</span>
          </div>
        </div>

        {/* Center / Main Ticket Body */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            {/* Top row: distance, city & bookmark */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#9c9991]">
                <span className="font-semibold text-[#d4af37] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {formatDistance(calculatedDistanceKm)}
                </span>
                <span aria-hidden="true" className="text-[#555]">·</span>
                <span>{cinema.city} ({cinema.province})</span>
                <span aria-hidden="true" className="text-[#555]">·</span>
                <span className="font-mono-code text-[#828078]">{cinema.postalCode}</span>
              </div>

              {/* Bookmark save button */}
              <button
                type="button"
                onClick={() => onToggleSave(cinema.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#ffd97d]'
                    : 'bg-[#181a24] border-[#292c3c] text-[#7d7a72] hover:text-[#d4af37]'
                }`}
                title={isSaved ? 'Quitar de guardados' : 'Guardar cine favorito'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#d4af37]' : ''}`} />
              </button>
            </div>

            {/* Cinema Title */}
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f7ede1] mb-1.5 group-hover:text-[#ffd97d] transition-colors">
              {cinema.name}
            </h2>

            {/* Exact street address */}
            <p className="text-xs sm:text-sm text-[#b0ada5] flex items-center gap-1.5 mb-3">
              <span>{cinema.address}</span>
            </p>

            {/* Editorial synopsis */}
            <p className="text-xs sm:text-sm text-[#8c8981] line-clamp-2 mb-4 leading-relaxed">
              {cinema.description}
            </p>

            {/* Services icons unboxed */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#9d9a92] mb-4 pb-3 border-b border-[#202332]">
              {cinema.hasVOSE && (
                <span className="flex items-center gap-1 text-[#e2cb87]" title="Sesiones en versión original">
                  <Languages className="w-3.5 h-3.5 text-[#d4af37]" />
                  VOSE
                </span>
              )}
              {cinema.services.threeD && (
                <span className="flex items-center gap-1" title="Proyección 3D disponible">
                  <Glasses className="w-3.5 h-3.5 text-[#d4af37]" />
                  3D
                </span>
              )}
              {cinema.services.imax && (
                <span className="flex items-center gap-1 text-[#ffd97d] font-semibold" title="Pantalla colosal IMAX">
                  <Film className="w-3.5 h-3.5 text-[#d4af37]" />
                  IMAX
                </span>
              )}
              {cinema.services.atmosSound && (
                <span className="flex items-center gap-1" title="Sonido envolvente Dolby Atmos">
                  <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  Dolby Atmos
                </span>
              )}
              {cinema.services.parking && (
                <span className="flex items-center gap-1" title="Aparcamiento para clientes">
                  <Car className="w-3.5 h-3.5 text-[#d4af37]" />
                  Parking
                </span>
              )}
              {cinema.services.accessible && (
                <span className="flex items-center gap-1" title="Accesible personas con movilidad reducida">
                  <Accessibility className="w-3.5 h-3.5 text-[#d4af37]" />
                  PMR
                </span>
              )}
              {cinema.services.vipSeats && (
                <span className="flex items-center gap-1" title="Butacas reclinables / zona VIP">
                  <Armchair className="w-3.5 h-3.5 text-[#d4af37]" />
                  Butacas VIP
                </span>
              )}
              {cinema.services.barOrCafe && (
                <span className="flex items-center gap-1" title="Cafetería o Bar de cine">
                  <Coffee className="w-3.5 h-3.5 text-[#d4af37]" />
                  Café/Bar
                </span>
              )}
            </div>

            {/* Currently showing billboard sessions preview */}
            {cinema.movies && cinema.movies.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-[#a09d94]">
                  <span className="font-semibold text-[#dedbd4] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d4af37]" />
                    Películas destacadas en cartelera hoy:
                  </span>
                  <span className="text-[11px] text-[#78756d]">Horarios de sesión</span>
                </div>

                <div className="space-y-2">
                  {cinema.movies.slice(0, 2).map((movie) => (
                    <div 
                      key={movie.id}
                      className="p-2.5 rounded-lg bg-[#181a26] border border-[#2b2e40] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-[#f0ede6]">
                            {movie.title}
                          </span>
                          <span className="text-[10px] font-mono-code px-1.5 py-0.2 bg-[#252838] text-[#ffd97d] rounded border border-[#3b3e54]">
                            {movie.format}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#86837c] mt-0.5">
                          <span>{movie.genre}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{movie.durationMinutes} min</span>
                          <span aria-hidden="true"> · </span>
                          <span>{movie.room}</span>
                        </div>
                      </div>

                      {/* Sessions times */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {movie.times.map((time) => (
                          <a
                            key={time}
                            href={cinema.carteleraUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 text-xs font-mono-code bg-[#222535] hover:bg-[#d4af37] hover:text-[#0d0e12] text-[#d6d3cb] border border-[#373a4e] rounded transition-colors"
                            title={`Comprar entrada para las ${time}`}
                          >
                            {time}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#222534] mt-2">
            <button
              type="button"
              onClick={() => onSelectCinema(cinema)}
              className="text-xs sm:text-sm text-[#ffd97d] hover:text-white font-medium flex items-center gap-1 group/btn transition-colors cursor-pointer"
            >
              <span>Ver todas las sesiones y ficha técnica</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-2">
              {/* How to get there (Google Maps) */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#1b1d2a] hover:bg-[#25283a] border border-[#2e3146] text-[#b8b5ad] hover:text-white transition-colors"
                title="Cómo llegar con Google Maps"
              >
                <Navigation className="w-3 h-3 text-[#d4af37]" />
                <span>Cómo llegar</span>
              </a>

              {/* Direct Billboard & Tickets link */}
              <a
                href={cinema.carteleraUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ba9427] hover:from-[#e3be44] hover:to-[#cda532] text-[#0d0e12] shadow-sm transition-all"
                title="Abrir cartelera oficial y compra de entradas"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Cartelera & Entradas</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
