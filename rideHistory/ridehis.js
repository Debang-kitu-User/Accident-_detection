import React from 'react';
import Sidebar from '../Home/Sidebar';
import { Box, Flex, Text, Badge, Grid, useBreakpointValue } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function RideCard({ position, price, driverName, rating }) {
  return (
    <Flex
      bgColor="#202020" // Darker gray for card background
      borderRadius="15px"
      boxShadow="0px 6px 15px rgba(85, 85, 85, 0.25)" // Slightly darker shadow for depth
      mb={6}
      overflow="hidden"
      alignItems="center"
      w="100%"
      height="200px"  // Height for a bigger card
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{ transform: 'scale(1.02)', boxShadow: '0px 8px 20px rgba(85, 85, 85, 0.4)' }}  // Hover effect
    >
      {/* Leaflet Map Section */}
      <Box flex="1" height="100%">
        <MapContainer
          center={position} // Position is passed as a prop
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} />
        </MapContainer>
      </Box>

      {/* Info Section */}
      <Flex
        flex="2"
        p={4}  // Adjusted padding for better spacing on smaller screens
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        bg="#333533" // Dark gray background for the info section
      >
        <Text fontSize="lg" fontWeight="bold" color="#D6D6D6"> {/* Light gray for primary text */}
          {driverName}
        </Text>
        <Text fontSize="md" color="#A5A5A5"> {/* Medium gray for secondary text */}
          Fare: <Text as="span" fontWeight="bold" color="#FFD700">${price}</Text> {/* Gold for price */}
        </Text>
        <Badge colorScheme="yellow" fontSize="sm" px={2} py={1} borderRadius="full" bg="#FFD700" color="#202020">
          Rating: {rating} ⭐
        </Badge>
      </Flex>
    </Flex>
  );
}

function SidebarRideCards({ ride }) {
  // Adjusting column count for better responsiveness
  const columnCount = useBreakpointValue({ base: 1, sm: 1, md: 2, lg: 2, xl: 2 }); // Keep two columns for tablet and above

  return (
    <Flex
      w="100%"
      h="100%"
      overflowY="auto"
      p={6}
      bg="#333533"
      flexDirection={{ base: 'column', md: 'row' }} // Stack vertically on mobile, horizontally on medium screens and up
    >
      {/* Sidebar on the left */}
      <Box w={{ base: '100%', md: '20%' }} mb={{ base: 6, md: 0 }} mr={{ md: 6 }}>
        <Sidebar />
      </Box>

      {/* Grid of Ride Cards on the right */}
      <Box flex="1">
        <Grid
          templateColumns={`repeat(${columnCount}, 1fr)`}
          gap={6}
        >
          {ride.map((ride) => (
            <RideCard
              key={ride.id}
              position={ride.position} // Pass position to RideCard
              price={ride.price}
              driverName={ride.driverName}
              rating={ride.rating}
            />
          ))}
        </Grid>
      </Box>
    </Flex>
  );
}

export default SidebarRideCards;
