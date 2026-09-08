import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Coordonnees, PharmacieMap } from '../types';

// Correctif nécessaire : Leaflet + Webpack ne trouvent pas les icônes par défaut automatiquement
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const iconPharmacie = (selectionnee: boolean) =>
  L.divIcon({
    className: '',
    html: `<div style="background:${selectionnee ? '#dc2626' : '#16a34a'};width:${selectionnee ? '32px' : '26px'};height:${selectionnee ? '32px' : '26px'};border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;">+</div>`,
    iconSize: [selectionnee ? 32 : 26, selectionnee ? 32 : 26],
    iconAnchor: [selectionnee ? 16 : 13, selectionnee ? 16 : 13],
  });

const iconUtilisateur = L.divIcon({
  className: '',
  html: `<div style="background:#2563eb;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 6px rgba(37,99,235,0.25);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface FitBoundsProps {
  points: Coordonnees[];
}

const FitBounds: React.FC<FitBoundsProps> = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
};

interface RealMapProps {
  pharmacies: PharmacieMap[];
  userPosition: Coordonnees | null;
  selectedPharmacieId?: string | null;
  tracé?: Coordonnees[];
  className?: string;
}

const RealMap: React.FC<RealMapProps> = ({ pharmacies, userPosition, selectedPharmacieId, tracé, className }) => {
  const center: Coordonnees = userPosition || { lat: 14.7, lng: -17.47 };
  const boundsPoints = tracé && tracé.length > 0 ? tracé : userPosition ? [userPosition, ...pharmacies.map((p) => p.position)] : [];

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={12} scrollWheelZoom className={className || 'w-full h-full'}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pharmacies.map((p) => (
        <Marker key={p.id} position={[p.position.lat, p.position.lng]} icon={iconPharmacie(p.id === selectedPharmacieId)}>
          <Popup>
            <strong>{p.nom}</strong>
            <br />
            {p.adresse}
          </Popup>
        </Marker>
      ))}

      {userPosition && (
        <Marker position={[userPosition.lat, userPosition.lng]} icon={iconUtilisateur}>
          <Popup>Votre position</Popup>
        </Marker>
      )}

      {tracé && tracé.length > 0 && (
        <Polyline positions={tracé.map((p) => [p.lat, p.lng])} pathOptions={{ color: '#16a34a', weight: 5, opacity: 0.85 }} />
      )}

      {boundsPoints.length > 0 && <FitBounds points={boundsPoints} />}
    </MapContainer>
  );
};

export default RealMap;