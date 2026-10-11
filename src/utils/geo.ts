import { Cinema } from '../types/cinema';

/**
 * Calculates the great-circle distance between two points on Earth using the Haversine formula (in km).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(km: number | undefined): string {
  if (km === undefined || isNaN(km)) return 'Distancia no disp.';
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function getGoogleMapsDirectionsUrl(
  destinationAddress: string,
  destinationName: string,
  userLocation?: { lat: number; lng: number }
): string {
  const query = encodeURIComponent(`${destinationName}, ${destinationAddress}`);
  if (userLocation) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${query}&travelmode=transit`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getGoogleMapsSearchUrl(address: string, name: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}`)}`;
}
