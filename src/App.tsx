import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { FilterBar } from './components/FilterBar';
import { CinemaCard } from './components/CinemaCard';
import { CinemaMap } from './components/CinemaMap';
import { CinemaModal } from './components/CinemaModal';
import { SavedCinemasDrawer } from './components/SavedCinemasDrawer';
import { CinemaGuideAi } from './components/CinemaGuideAi';
import { CINEMAS_DATA } from './data/cinemas';
import { resolveLocationFromQuery, POPULAR_CITIES, CityShortcut } from './data/spanishProvinces';
import { calculateDistanceKm } from './utils/geo';
import { Cinema, SearchFilterState } from './types/cinema';
import { Film, Compass, MapPin, Sparkles, AlertCircle } from 'lucide-react';

const INITIAL_FILTERS: SearchFilterState = {
  query: '28004',
  radiusKm: 30,
  chainFilter: 'all',
  onlyVOSE: false,
  onlyIndependent: false,
  onlyMajorChains: false,
  requireParking: false,
  requireAccessible: false,
  require3DOrImax: false,
  requireAtmos: false,
  requireVip: false,
  sortBy: 'distance',
};

export default function App() {
  const [filters, setFilters] = useState<SearchFilterState>(INITIAL_FILTERS);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | undefined>();
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number }>({
    lat: 40.4200,
    lng: -3.7050, // Madrid center by default
  });
  const [locationDisplayName, setLocationDisplayName] = useState<string>('28004 · Madrid');
  const [isLocating, setIsLocating] = useState(false);

  // View state
  const [activeView, setActiveView] = useState<'split' | 'cards' | 'map'>('split');
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAiGuideOpen, setIsAiGuideOpen] = useState(false);

  // Saved cinemas state (persisted in localStorage)
  const [savedCinemaIds, setSavedCinemaIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cineruta_saved_cinemas');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cineruta_saved_cinemas', JSON.stringify(savedCinemaIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedCinemaIds]);

  const toggleSaveCinema = (cinemaId: string) => {
    setSavedCinemaIds((prev) =>
      prev.includes(cinemaId) ? prev.filter((id) => id !== cinemaId) : [...prev, cinemaId]
    );
  };

  // Handle Query Resolution
  useEffect(() => {
    if (!filters.query.trim()) return;

    const resolved = resolveLocationFromQuery(filters.query);
    if (resolved) {
      setCenterCoords({ lat: resolved.lat, lng: resolved.lng });
      setLocationDisplayName(resolved.displayName);
    }
  }, [filters.query]);

  // Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización. Ingresa tu código postal o ciudad manualmente.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setCenterCoords(coords);
        setLocationDisplayName('Tu ubicación actual (GPS)');
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
        alert('No se pudo acceder a tu ubicación actual. Ingresa tu código postal o selecciona una ciudad.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectCity = (city: CityShortcut) => {
    setFilters((prev) => ({ ...prev, query: city.name }));
    setCenterCoords({ lat: city.lat, lng: city.lng });
    setLocationDisplayName(`${city.name} (${city.province})`);
  };

  const handleFilterChange = <K extends keyof SearchFilterState>(
    key: K,
    value: SearchFilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...INITIAL_FILTERS,
      query: prev.query,
      radiusKm: prev.radiusKm,
    }));
  };

  // Compute distances and filter results
  const processedCinemas = useMemo(() => {
    // 1. Calculate distance for all cinemas
    const withDistance = CINEMAS_DATA.map((cinema) => {
      const dist = calculateDistanceKm(
        centerCoords.lat,
        centerCoords.lng,
        cinema.latitude,
        cinema.longitude
      );
      return { cinema, distanceKm: dist };
    });

    // 2. Filter by radius (or if radius is large)
    let filtered = withDistance.filter((item) => item.distanceKm <= filters.radiusKm);

    // If no cinema found within radius, fallback to all but sorted by distance
    const isRadiusEmpty = filtered.length === 0;
    if (isRadiusEmpty) {
      filtered = withDistance;
    }

    // 3. Apply chain filter
    if (filters.chainFilter !== 'all') {
      filtered = filtered.filter((item) => item.cinema.brand === filters.chainFilter);
    }

    // 4. VOSE filter
    if (filters.onlyVOSE) {
      filtered = filtered.filter((item) => item.cinema.hasVOSE);
    }

    // 5. Independent filter
    if (filters.onlyIndependent) {
      filtered = filtered.filter((item) => item.cinema.isIndependent);
    }

    // 6. Services filters
    if (filters.requireParking) {
      filtered = filtered.filter((item) => item.cinema.services.parking);
    }
    if (filters.requireAccessible) {
      filtered = filtered.filter((item) => item.cinema.services.accessible);
    }
    if (filters.require3DOrImax) {
      filtered = filtered.filter((item) => item.cinema.services.threeD || item.cinema.services.imax);
    }
    if (filters.requireAtmos) {
      filtered = filtered.filter((item) => item.cinema.services.atmosSound);
    }
    if (filters.requireVip) {
      filtered = filtered.filter((item) => item.cinema.services.vipSeats);
    }

    // 7. Sort
    filtered.sort((a, b) => {
      if (filters.sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }
      if (filters.sortBy === 'screens') {
        return b.cinema.screens - a.cinema.screens;
      }
      if (filters.sortBy === 'rating') {
        return b.cinema.rating - a.cinema.rating;
      }
      if (filters.sortBy === 'name') {
        return a.cinema.name.localeCompare(b.cinema.name);
      }
      return 0;
    });

    return {
      items: filtered,
      isRadiusEmpty,
    };
  }, [centerCoords, filters]);

  // Saved cinemas array
  const savedCinemas = useMemo(() => {
    return CINEMAS_DATA.filter((c) => savedCinemaIds.includes(c.id));
  }, [savedCinemaIds]);

  return (
    <div className="min-h-screen bg-[#0c0d12] text-[#e8e6e3] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#ffd97d]">
      {/* Header */}
      <Header
        onOpenAiGuide={() => setIsAiGuideOpen(true)}
        savedCount={savedCinemaIds.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        activeLocationName={locationDisplayName}
      />

      {/* Hero with Search and Geolocation */}
      <SearchHero
        query={filters.query}
        onQueryChange={(q) => handleFilterChange('query', q)}
        radiusKm={filters.radiusKm}
        onRadiusChange={(r) => handleFilterChange('radiusKm', r)}
        onSelectCity={handleSelectCity}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        activeLocationName={locationDisplayName}
      />

      {/* Filter and Services Bar */}
      <FilterBar
        filters={filters}
        onChangeFilter={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={processedCinemas.items.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Warning if no cinemas within the requested radius */}
        {processedCinemas.isRadiusEmpty && (
          <div className="mb-6 p-4 rounded-xl bg-[#231a12] border border-[#a66a22] text-[#f7d6a3] flex items-center gap-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#d4af37]" />
            <div>
              <p className="font-semibold">
                No encontramos cines a menos de {filters.radiusKm} km de tu búsqueda.
              </p>
              <p className="text-xs text-[#d8be97] mt-0.5">
                Mostrando los cines más cercanos en las localidades colindantes. Puedes ampliar el radio de búsqueda arriba a 60 km.
              </p>
            </div>
          </div>
        )}

        {/* View mode render */}
        {activeView === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Tickets list (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {processedCinemas.items.map(({ cinema, distanceKm }) => (
                <CinemaCard
                  key={cinema.id}
                  cinema={cinema}
                  calculatedDistanceKm={distanceKm}
                  userCoords={userCoords || centerCoords}
                  isSaved={savedCinemaIds.includes(cinema.id)}
                  onToggleSave={toggleSaveCinema}
                  onSelectCinema={(c) => {
                    setSelectedCinema(c);
                    setIsModalOpen(true);
                  }}
                  isSelected={selectedCinema?.id === cinema.id}
                />
              ))}

              {processedCinemas.items.length === 0 && (
                <div className="text-center py-16 bg-[#13151f] rounded-xl border border-[#2b2e40] p-6">
                  <Film className="w-12 h-12 text-[#635f56] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-[#e6e3da] mb-1">
                    No hay cines que cumplan con todos los filtros
                  </h3>
                  <p className="text-xs text-[#8c8981] max-w-md mx-auto mb-4">
                    Prueba a desmarcar algunos filtros de servicios (como 3D, IMAX o Parking) o restablecer los criterios.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs font-semibold bg-[#d4af37] text-[#0d0e12] rounded-lg"
                  >
                    Restablecer filtros
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Interactive Map (5 cols) */}
            <div className="lg:col-span-5 sticky top-20 h-[650px] hidden lg:block">
              <CinemaMap
                cinemas={processedCinemas.items.map((i) => i.cinema)}
                selectedCinema={selectedCinema}
                onSelectCinema={(c) => setSelectedCinema(c)}
                userCoords={userCoords}
                centerCoords={centerCoords}
              />
            </div>
          </div>
        )}

        {activeView === 'cards' && (
          <div className="space-y-4">
            {processedCinemas.items.map(({ cinema, distanceKm }) => (
              <CinemaCard
                key={cinema.id}
                cinema={cinema}
                calculatedDistanceKm={distanceKm}
                userCoords={userCoords || centerCoords}
                isSaved={savedCinemaIds.includes(cinema.id)}
                onToggleSave={toggleSaveCinema}
                onSelectCinema={(c) => {
                  setSelectedCinema(c);
                  setIsModalOpen(true);
                }}
                isSelected={selectedCinema?.id === cinema.id}
              />
            ))}
          </div>
        )}

        {activeView === 'map' && (
          <div className="h-[75vh] w-full">
            <CinemaMap
              cinemas={processedCinemas.items.map((i) => i.cinema)}
              selectedCinema={selectedCinema}
              onSelectCinema={(c) => {
                setSelectedCinema(c);
                setIsModalOpen(true);
              }}
              userCoords={userCoords}
              centerCoords={centerCoords}
              zoomLevel={14}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button on mobile to view map or advisor */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
        <button
          onClick={() => setIsAiGuideOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ba9427] text-[#0d0e12] shadow-xl flex items-center justify-center border-2 border-[#ffecb3]"
          title="Consultar al Guía Cinéfilo IA"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {/* Cinema Detail Modal */}
      <CinemaModal
        cinema={selectedCinema}
        onClose={() => setIsModalOpen(false)}
        calculatedDistanceKm={
          selectedCinema
            ? calculateDistanceKm(
                centerCoords.lat,
                centerCoords.lng,
                selectedCinema.latitude,
                selectedCinema.longitude
              )
            : undefined
        }
        userCoords={userCoords || centerCoords}
        isSaved={selectedCinema ? savedCinemaIds.includes(selectedCinema.id) : false}
        onToggleSave={toggleSaveCinema}
      />

      {/* Saved Cinemas Drawer */}
      <SavedCinemasDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedCinemas={savedCinemas}
        onRemoveSaved={toggleSaveCinema}
        onSelectCinema={(c) => {
          setSelectedCinema(c);
          setIsModalOpen(true);
        }}
      />

      {/* Cinema Expert AI Guide Dialog */}
      <CinemaGuideAi
        isOpen={isAiGuideOpen}
        onClose={() => setIsAiGuideOpen(false)}
        activeCityOrProvince={locationDisplayName}
        nearbyCinemas={processedCinemas.items.map((i) => i.cinema)}
        onSelectCinemaByName={(name) => {
          const match = CINEMAS_DATA.find((c) =>
            c.name.toLowerCase().includes(name.toLowerCase())
          );
          if (match) {
            setSelectedCinema(match);
            setIsModalOpen(true);
          }
        }}
      />

      {/* Vintage Cinema Footer */}
      <footer className="border-t border-[#232635] bg-[#0a0b10] py-8 px-4 sm:px-6 lg:px-8 text-xs text-[#807d75] mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#d4af37]" />
            <span className="font-cinzel text-sm font-bold text-[#f2efe9]">
              CineRuta España
            </span>
            <span className="text-[#555]">·</span>
            <span>Geolocalizador y Guía de Cartelera</span>
          </div>

          <div className="flex items-center gap-4 text-[#9c9991]">
            <span>Datos de salas actualizados para España</span>
            <span className="text-[#555]">·</span>
            <span className="text-[#d4af37]">Sesión Continua</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
