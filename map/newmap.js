import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon path issues with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LeafletMap = ({ position, style }) => {
  // Define a default center (e.g., London) if the provided coordinates are [0,0]
  const defaultCenter = [51.505, -0.09];

  // Use useMemo to compute the center only when the position prop changes.
  const { center, validPosition } = useMemo(() => {
    const isValid = position[0] !== 0 || position[1] !== 0;
    return { center: isValid ? position : defaultCenter, validPosition: isValid };
  }, [position]);

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={style}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {validPosition && (
        <Marker position={position}>
          <Popup>
            Latitude: {position[0].toFixed(6)}<br />
            Longitude: {position[1].toFixed(6)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default LeafletMap;
