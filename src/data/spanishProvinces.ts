export interface ProvinceInfo {
  code: string;
  name: string;
  capital: string;
  lat: number;
  lng: number;
}

export const SPANISH_PROVINCES: Record<string, ProvinceInfo> = {
  '01': { code: '01', name: 'Álava', capital: 'Vitoria-Gasteiz', lat: 42.8468, lng: -2.6716 },
  '02': { code: '02', name: 'Albacete', capital: 'Albacete', lat: 38.9943, lng: -1.8585 },
  '03': { code: '03', name: 'Alicante', capital: 'Alicante', lat: 38.3452, lng: -0.4810 },
  '04': { code: '04', name: 'Almería', capital: 'Almería', lat: 36.8381, lng: -2.4597 },
  '05': { code: '05', name: 'Ávila', capital: 'Ávila', lat: 40.6567, lng: -4.6812 },
  '06': { code: '06', name: 'Badajoz', capital: 'Badajoz', lat: 38.8794, lng: -6.9706 },
  '07': { code: '07', name: 'Illes Balears', capital: 'Palma de Mallorca', lat: 39.5696, lng: 2.6502 },
  '08': { code: '08', name: 'Barcelona', capital: 'Barcelona', lat: 41.3851, lng: 2.1734 },
  '09': { code: '09', name: 'Burgos', capital: 'Burgos', lat: 42.3440, lng: -3.6969 },
  '10': { code: '10', name: 'Cáceres', capital: 'Cáceres', lat: 39.4753, lng: -6.3723 },
  '11': { code: '11', name: 'Cádiz', capital: 'Cádiz', lat: 36.5298, lng: -6.2925 },
  '12': { code: '12', name: 'Castellón', capital: 'Castelló de la Plana', lat: 39.9864, lng: -0.0513 },
  '13': { code: '13', name: 'Ciudad Real', capital: 'Ciudad Real', lat: 38.9863, lng: -3.9273 },
  '14': { code: '14', name: 'Córdoba', capital: 'Córdoba', lat: 37.8882, lng: -4.7794 },
  '15': { code: '15', name: 'A Coruña', capital: 'A Coruña', lat: 43.3623, lng: -8.4115 },
  '16': { code: '16', name: 'Cuenca', capital: 'Cuenca', lat: 40.0704, lng: -2.1374 },
  '17': { code: '17', name: 'Girona', capital: 'Girona', lat: 41.9794, lng: 2.8214 },
  '18': { code: '18', name: 'Granada', capital: 'Granada', lat: 37.1773, lng: -3.5986 },
  '19': { code: '19', name: 'Guadalajara', capital: 'Guadalajara', lat: 40.6337, lng: -3.1674 },
  '20': { code: '20', name: 'Gipuzkoa', capital: 'Donostia-San Sebastián', lat: 43.3183, lng: -1.9812 },
  '21': { code: '21', name: 'Huelva', capital: 'Huelva', lat: 37.2614, lng: -6.9447 },
  '22': { code: '22', name: 'Huesca', capital: 'Huesca', lat: 42.1401, lng: -0.4089 },
  '23': { code: '23', name: 'Jaén', capital: 'Jaén', lat: 37.7796, lng: -3.7849 },
  '24': { code: '24', name: 'León', capital: 'León', lat: 42.5987, lng: -5.5671 },
  '25': { code: '25', name: 'Lleida', capital: 'Lleida', lat: 41.6176, lng: 0.6200 },
  '26': { code: '26', name: 'La Rioja', capital: 'Logroño', lat: 42.4658, lng: -2.4499 },
  '27': { code: '27', name: 'Lugo', capital: 'Lugo', lat: 43.0125, lng: -7.5558 },
  '28': { code: '28', name: 'Madrid', capital: 'Madrid', lat: 40.4168, lng: -3.7038 },
  '29': { code: '29', name: 'Málaga', capital: 'Málaga', lat: 36.7213, lng: -4.4214 },
  '30': { code: '30', name: 'Murcia', capital: 'Murcia', lat: 37.9922, lng: -1.1307 },
  '31': { code: '31', name: 'Navarra', capital: 'Pamplona', lat: 42.8125, lng: -1.6458 },
  '32': { code: '32', name: 'Ourense', capital: 'Ourense', lat: 42.3358, lng: -7.8639 },
  '33': { code: '33', name: 'Asturias', capital: 'Oviedo', lat: 43.3619, lng: -5.8494 },
  '34': { code: '34', name: 'Palencia', capital: 'Palencia', lat: 42.0095, lng: -4.5288 },
  '35': { code: '35', name: 'Las Palmas', capital: 'Las Palmas de Gran Canaria', lat: 28.1235, lng: -15.4363 },
  '36': { code: '36', name: 'Pontevedra', capital: 'Pontevedra / Vigo', lat: 42.2406, lng: -8.7207 },
  '37': { code: '37', name: 'Salamanca', capital: 'Salamanca', lat: 40.9701, lng: -5.6635 },
  '38': { code: '38', name: 'Santa Cruz de Tenerife', capital: 'Santa Cruz de Tenerife', lat: 28.4636, lng: -16.2518 },
  '39': { code: '39', name: 'Cantabria', capital: 'Santander', lat: 43.4623, lng: -3.8099 },
  '40': { code: '40', name: 'Segovia', capital: 'Segovia', lat: 40.9429, lng: -4.1088 },
  '41': { code: '41', name: 'Sevilla', capital: 'Sevilla', lat: 37.3891, lng: -5.9845 },
  '42': { code: '42', name: 'Soria', capital: 'Soria', lat: 41.7640, lng: -2.4688 },
  '43': { code: '43', name: 'Tarragona', capital: 'Tarragona', lat: 41.1189, lng: 1.2445 },
  '44': { code: '44', name: 'Teruel', capital: 'Teruel', lat: 40.3456, lng: -1.1072 },
  '45': { code: '45', name: 'Toledo', capital: 'Toledo', lat: 39.8628, lng: -4.0273 },
  '46': { code: '46', name: 'Valencia', capital: 'Valencia', lat: 39.4699, lng: -0.3763 },
  '47': { code: '47', name: 'Valladolid', capital: 'Valladolid', lat: 41.6523, lng: -4.7245 },
  '48': { code: '48', name: 'Bizkaia', capital: 'Bilbao', lat: 43.2630, lng: -2.9350 },
  '49': { code: '49', name: 'Zamora', capital: 'Zamora', lat: 41.5033, lng: -5.7446 },
  '50': { code: '50', name: 'Zaragoza', capital: 'Zaragoza', lat: 41.6488, lng: -0.8891 },
  '51': { code: '51', name: 'Ceuta', capital: 'Ceuta', lat: 35.8894, lng: -5.3213 },
  '52': { code: '52', name: 'Melilla', capital: 'Melilla', lat: 35.2923, lng: -2.9381 }
};

export interface CityShortcut {
  name: string;
  postalCode: string;
  province: string;
  lat: number;
  lng: number;
}

export const POPULAR_CITIES: CityShortcut[] = [
  { name: 'Madrid', postalCode: '28004', province: 'Madrid', lat: 40.4200, lng: -3.7050 },
  { name: 'Barcelona', postalCode: '08001', province: 'Barcelona', lat: 41.3851, lng: 2.1734 },
  { name: 'Valencia', postalCode: '46001', province: 'Valencia', lat: 39.4699, lng: -0.3763 },
  { name: 'Sevilla', postalCode: '41001', province: 'Sevilla', lat: 37.3891, lng: -5.9845 },
  { name: 'Bilbao', postalCode: '48001', province: 'Bizkaia', lat: 43.2630, lng: -2.9350 },
  { name: 'Málaga', postalCode: '29001', province: 'Málaga', lat: 36.7213, lng: -4.4214 },
  { name: 'Zaragoza', postalCode: '50001', province: 'Zaragoza', lat: 41.6488, lng: -0.8891 },
  { name: 'Santander', postalCode: '39001', province: 'Cantabria', lat: 43.4623, lng: -3.8099 }
];

export function resolveLocationFromQuery(query: string): {
  lat: number;
  lng: number;
  displayName: string;
  province?: string;
  postalCode?: string;
} | null {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  // 1. Check if 5-digit postal code
  const postalMatch = clean.match(/^(\d{5})$/);
  if (postalMatch) {
    const pc = postalMatch[1];
    const prefix = pc.substring(0, 2);
    const prov = SPANISH_PROVINCES[prefix];
    if (prov) {
      return {
        lat: prov.lat,
        lng: prov.lng,
        displayName: `${pc} · ${prov.capital} (${prov.name})`,
        province: prov.name,
        postalCode: pc
      };
    }
  }

  // 2. Check popular cities
  const cityMatch = POPULAR_CITIES.find(c => 
    c.name.toLowerCase() === clean || 
    clean.includes(c.name.toLowerCase())
  );
  if (cityMatch) {
    return {
      lat: cityMatch.lat,
      lng: cityMatch.lng,
      displayName: `${cityMatch.name} (${cityMatch.province})`,
      province: cityMatch.province,
      postalCode: cityMatch.postalCode
    };
  }

  // 3. Check provinces by capital or name
  for (const prov of Object.values(SPANISH_PROVINCES)) {
    if (
      prov.name.toLowerCase().includes(clean) || 
      prov.capital.toLowerCase().includes(clean) ||
      clean.includes(prov.capital.toLowerCase()) ||
      clean.includes(prov.name.toLowerCase())
    ) {
      return {
        lat: prov.lat,
        lng: prov.lng,
        displayName: `${prov.capital} (${prov.name})`,
        province: prov.name,
        postalCode: `${prov.code}001`
      };
    }
  }

  return null;
}
