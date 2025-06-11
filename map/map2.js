import React, { useEffect } from 'react';
import { Box, VStack, Container } from '@chakra-ui/react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Sample city coordinates (latitude, longitude)
const cityCoordinates = {
  "New York": [40.7128, -74.0060],
  "Los Angeles": [34.0522, -118.2437],
  "Chicago": [41.8781, -87.6298],
  "Houston": [29.7604, -95.3698],
  "Miami": [25.7617, -80.1918],
};

// Component to update markers and lines between two cities and zoom out to fit
function UpdateMap({ city1, city2 }) {
  const map = useMap();
  
  useEffect(() => {
    // Clear any existing markers or lines before adding new ones
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    if (city1 && city2) {
      const [lat1, lon1] = cityCoordinates[city1];
      const [lat2, lon2] = cityCoordinates[city2];

      // Add markers for the two cities
      const markerIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41], 
        iconAnchor: [12, 41], 
        popupAnchor: [1, -34], 
      });

      L.marker([lat1, lon1], { icon: markerIcon }).addTo(map).bindPopup(city1).openPopup();
      L.marker([lat2, lon2], { icon: markerIcon }).addTo(map).bindPopup(city2).openPopup();

      // Add a line between the two cities
      L.polyline([[lat1, lon1], [lat2, lon2]], { color: 'blue' }).addTo(map);

      // Use fitBounds to zoom out and show both cities with padding
      const bounds = L.latLngBounds([lat1, lon1], [lat2, lon2]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [city1, city2, map]);

  return null;
}

const LeafletMap = ({ city1, city2 }) => {
  // Calculate the initial map center based on the cities passed
  const center = city1 && city2 
    ? [(cityCoordinates[city1][0] + cityCoordinates[city2][0]) / 2, 
       (cityCoordinates[city1][1] + cityCoordinates[city2][1]) / 2]
    : [39.8283, -98.5795]; // Default to center of the USA if no cities are selected

  return (
    <Box
      w="100%" // Full width to fit the parent container
      h="100%" // Full height to fit the parent container
      borderRadius="md" 
      overflow="hidden"
      boxShadow="lg"
    >
      <style>
        {`
          .leaflet-control-zoom {
            display: none !important;
          }
          .leaflet-control-attribution {
            display: none !important;
          }
        `}
      </style>
      <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=627JVq3a3GiKL5y8FOwi"
          attribution='Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.maptiler.com/copyright">MapTiler</a>'
        />
        <UpdateMap city1={city1} city2={city2} />
      </MapContainer>
    </Box>
  );
};

export default LeafletMap;
