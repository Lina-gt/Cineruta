import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Cinema } from '../types/cinema';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../utils/geo';

interface CinemaMapProps {
  cinemas: Cinema[];
  selectedCinema: Cinema | null;
  onSelectCinema: (cinema: Cinema) => void;
  userCoords?: { lat: number; lng: number };
  centerCoords: { lat: number; lng: number };
  zoomLevel?: number;
}

export const CinemaMap: React.FC<CinemaMapProps> = ({
  cinemas,
  selectedCinema,
  onSelectCinema,
  userCoords,
  centerCoords,
  zoomLevel = 13,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerCoords.lat, centerCoords.lng],
        zoom: zoomLevel,
        zoomControl: false,
      });

      // Add zoom control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Recenter map when centerCoords changes
  useEffect(() => {
    if (mapInstanceRef.current && centerCoords) {
      mapInstanceRef.current.setView([centerCoords.lat, centerCoords.lng], zoomLevel, {
        animate: true,
      });
    }
  }, [centerCoords.lat, centerCoords.lng, zoomLevel]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // User Location Marker
    if (userCoords) {
      const userHtml = `
        <div style="position: relative; width: 22px; height: 22px;">
          <div style="position: absolute; inset: 0; background: #3b82f6; border-radius: 9999px; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 22px; height: 22px; background: #2563eb; border: 2.5px solid #ffffff; border-radius: 9999px; box-shadow: 0 0 10px rgba(37,99,235,0.8);"></div>
        </div>
      `;
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: userHtml,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .bindTooltip('Tu ubicación actual', { direction: 'top', offset: [0, -12] })
        .addTo(markersLayer);
    }

    // Cinema Markers
    cinemas.forEach((cinema) => {
      const isSelected = selectedCinema?.id === cinema.id;
      const markerColor = isSelected ? '#ffd97d' : cinema.isIndependent ? '#c5a059' : '#e59837';
      const borderColor = isSelected ? '#ffffff' : '#141620';
      const size = isSelected ? 40 : 32;

      const markerHtml = `
        <div style="
          width: ${size}px; 
          height: ${size}px; 
          background: linear-gradient(135deg, ${markerColor}, #9e731b); 
          border: 2px solid ${borderColor}; 
          border-radius: 9999px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.8)${isSelected ? ', 0 0 18px rgba(212,175,55,0.8)' : ''};
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="#0d0e12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"></rect>
            <line x1="7" x2="7" y1="2" y2="22"></line>
            <line x1="17" x2="17" y1="2" y2="22"></line>
            <line x1="2" x2="22" y1="12" y2="12"></line>
            <line x1="2" x2="7" y1="7" y2="7"></line>
            <line x1="2" x2="7" y1="17" y2="17"></line>
            <line x1="17" x2="22" y1="7" y2="7"></line>
            <line x1="17" x2="22" y1="17" y2="17"></line>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'cinema-custom-marker',
        html: markerHtml,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });

      const marker = L.marker([cinema.latitude, cinema.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 0,
      });

      // Direction link
      const directionsUrl = getGoogleMapsDirectionsUrl(cinema.address, cinema.name, userCoords);

      const popupHtml = `
        <div style="font-family: inherit; min-width: 200px; max-width: 240px; color: #f0ede6;">
          <div style="font-size: 10px; font-weight: 700; color: #d4af37; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 2px;">
            ${cinema.brand} · ${cinema.postalCode}
          </div>
          <h3 style="font-size: 14px; font-weight: 700; color: #f7ede1; margin: 0 0 4px 0; line-height: 1.2;">
            ${cinema.name}
          </h3>
          <div style="font-size: 11px; color: #a8a59e; margin-bottom: 6px;">
            ${cinema.address}
          </div>
          <div style="font-size: 11px; color: #d4af37; margin-bottom: 8px;">
            ${cinema.screens} salas ${cinema.hasVOSE ? '· VOSE disponible' : ''}
          </div>
          <div style="display: flex; gap: 6px;">
            <a 
              href="${cinema.carteleraUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              style="
                flex: 1;
                display: inline-block;
                text-align: center;
                background: #d4af37;
                color: #0d0e12;
                font-size: 11px;
                font-weight: 700;
                padding: 5px 8px;
                border-radius: 4px;
                text-decoration: none;
              "
            >
              Cartelera
            </a>
            <a 
              href="${directionsUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              style="
                flex: 1;
                display: inline-block;
                text-align: center;
                background: #25283a;
                color: #e8e6e3;
                border: 1px solid #3d4158;
                font-size: 11px;
                font-weight: 600;
                padding: 5px 8px;
                border-radius: 4px;
                text-decoration: none;
              "
            >
              Ruta
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectCinema(cinema);
      });

      marker.addTo(markersLayer);

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [cinemas, selectedCinema?.id, userCoords]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-[#2b2e40] shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />

      {/* Map floating vintage badge overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-[#12131df0] backdrop-blur-md border border-[#3b382d] px-3 py-1.5 rounded-lg shadow-lg pointer-events-none">
        <span className="font-mono-code text-[11px] text-[#ffd97d] flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
          PLANO CINEMATOGRÁFICO ({cinemas.length} CINES)
        </span>
      </div>
    </div>
  );
};
