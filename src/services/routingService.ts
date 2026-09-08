import { Coordonnees, ItineraireResultat } from '../types';

/**
 * Calcule un itinéraire routier réel entre deux points en utilisant OSRM
 * (Open Source Routing Machine), un moteur de calcul d'itinéraire gratuit
 * qui suit les vraies routes — exactement le même principe que Yango/Google Maps,
 * sans avoir besoin de clé API payante.
 */
export const calculerItineraire = async (
  depart: Coordonnees,
  arrivee: Coordonnees
): Promise<ItineraireResultat> => {
  const url = `https://router.project-osrm.org/route/v1/driving/${depart.lng},${depart.lat};${arrivee.lng},${arrivee.lat}?overview=full&geometries=geojson`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Impossible de calculer l'itinéraire.");
  }

  const data = await response.json();
  const route = data.routes?.[0];
  if (!route) {
    throw new Error('Aucun itinéraire trouvé.');
  }

  const tracé: Coordonnees[] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => ({ lat, lng })
  );

  return {
    distanceKm: route.distance / 1000,
    dureeMinutes: route.duration / 60,
    tracé,
  };
};

/**
 * Distance à vol d'oiseau (formule de Haversine), utilisée pour un premier
 * tri rapide des pharmacies avant de calculer l'itinéraire routier précis
 * uniquement pour la plus proche (évite de multiplier les appels réseau).
 */
export const distanceHaversine = (a: Coordonnees, b: Coordonnees): number => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
};

export const genererPositionAleatoireDakar = (bounds: {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}): Coordonnees => ({
  lat: bounds.latMin + Math.random() * (bounds.latMax - bounds.latMin),
  lng: bounds.lngMin + Math.random() * (bounds.lngMax - bounds.lngMin),
});