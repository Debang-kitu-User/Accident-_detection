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

// Component to update markers, draw lines, and optionally add an extra pin based on provided lat/lng
function UpdateMap({ city1, city2, markerPosition }) {
  const map = useMap();

  useEffect(() => {
    // Clear any existing markers or lines before adding new ones
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Define a common marker icon to use
    const markerIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    // Array to gather all marker coordinates so we can fit bounds accordingly
    const allCoords = [];

    // If two cities are provided, add their markers and connect them with a blue line
    if (city1 && city2 && cityCoordinates[city1] && cityCoordinates[city2]) {
      const [lat1, lon1] = cityCoordinates[city1];
      const [lat2, lon2] = cityCoordinates[city2];

      L.marker([lat1, lon1], { icon: markerIcon })
        .addTo(map)
        .bindPopup(city1)
        .openPopup();

      L.marker([lat2, lon2], { icon: markerIcon })
        .addTo(map)
        .bindPopup(city2)
        .openPopup();

      // Draw a polyline between the two cities
      L.polyline([[lat1, lon1], [lat2, lon2]], { color: 'blue' })
        .addTo(map);

      allCoords.push([lat1, lon1], [lat2, lon2]);
    }

    // If an extra markerPosition is provided, add its marker.
    if (markerPosition && Array.isArray(markerPosition)) {
      const [lat, lng] = markerPosition;
      L.marker([lat, lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(`Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        .openPopup();

      allCoords.push([lat, lng]);
    }

    // If we have any markers, adjust the map to fit them
    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [city1, city2, markerPosition, map]);

  return null;
}

// The App component receives the 'shape' prop to determine whether the map is circular or square.
// An optional 'markerPosition' prop is added to show an extra pin based on latitude and longitude.
const App = ({ city1, city2, shape, markerPosition }) => {
  // Calculate the initial map center based on the cities passed,
  // or default to center of the USA if no cities are selected.
  const center =
    city1 && city2 && cityCoordinates[city1] && cityCoordinates[city2]
      ? [
          (cityCoordinates[city1][0] + cityCoordinates[city2][0]) / 2,
          (cityCoordinates[city1][1] + cityCoordinates[city2][1]) / 2,
        ]
      : [39.8283, -98.5795];

  // Determine the map's width, height, and border radius based on the 'shape' prop
  const mapSize =
    shape === 'circle'
      ? { width: ['150px', '200px', '210px'], height: ['150px', '200px', '210px'], borderRadius: '50%' }
      : { width: '100%', height: '100%', borderRadius: '8px' };

  return (
    <Container maxW="container.md" p={4} h="100%">
      <VStack spacing={4} align="stretch" h="100%">
        <Box
          w="100%"
          h={['300px', '400px', '350px', '250px']} // Height for mobile, tablet, medium screen, large screen
          overflow="hidden"
          boxShadow="lg"
          position="relative"
          {...mapSize}
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
            {/* Pass markerPosition to display an extra pin for specific lat/lng coordinates */}
            <UpdateMap city1={city1} city2={city2} markerPosition={markerPosition} />
          </MapContainer>
        </Box>
      </VStack>
    </Container>
  );
};

export default App;
