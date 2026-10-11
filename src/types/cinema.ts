export interface CinemaService {
  parking: boolean;
  accessible: boolean;
  imax: boolean;
  threeD: boolean;
  atmosSound: boolean;
  barOrCafe: boolean;
  vipSeats: boolean;
  originalVersionOnly: boolean;
}

export type CinemaChain = 
  | 'Yelmo' 
  | 'Cinesa' 
  | 'Kinépolis' 
  | 'Renoir' 
  | 'Golem' 
  | 'mk2' 
  | 'Ocine' 
  | 'Independiente' 
  | 'Filmoteca' 
  | 'Otro';

export interface MovieShowtime {
  id: string;
  title: string;
  director?: string;
  year?: number;
  durationMinutes: number;
  genre: string;
  ratingBadge: string; // e.g. 'TP', '+12', '+16', '+18'
  format: 'VOSE' | 'DOB' | 'VO' | '3D' | 'IMAX VOSE';
  room: string;
  times: string[]; // e.g. ['17:00', '19:30', '22:15']
  posterUrl: string;
  synopsis?: string;
}

export interface Cinema {
  id: string;
  name: string;
  brand: CinemaChain;
  isIndependent: boolean;
  hasVOSE: boolean;
  postalCode: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  screens: number;
  yearEstablished?: number;
  phone: string;
  websiteUrl: string;
  carteleraUrl: string;
  pricingInfo: string;
  spectatorDay: string; // e.g. "Miércoles (Día del Espectador)"
  services: CinemaService;
  description: string;
  movies: MovieShowtime[];
  rating: number; // e.g. 4.8
  reviewCount: number;
  photoUrl: string;
}

export interface SearchFilterState {
  query: string; // Postal code or city
  radiusKm: number;
  chainFilter: CinemaChain | 'all';
  onlyVOSE: boolean;
  onlyIndependent: boolean;
  onlyMajorChains: boolean;
  requireParking: boolean;
  requireAccessible: boolean;
  require3DOrImax: boolean;
  requireAtmos: boolean;
  requireVip: boolean;
  sortBy: 'distance' | 'screens' | 'rating' | 'name';
}
