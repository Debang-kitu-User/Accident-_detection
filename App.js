import React, { useState } from 'react';
import { Flex } from "@chakra-ui/react";
import { Routes, Route, Navigate } from 'react-router-dom';

import ParkingApp from './Home/home';
import Profile from './profile/profile';
import SidebarRideCards from './rideHistory/ridehis';
import RideAppLayout from './rideconfn/home';
import Dashboard from './accel/acc';

function App() {
  const [rides, setRides] = useState([
    { id: 1, position: [40.7128, -74.0060], price: 50, driverName: "John Doe", rating: 4.5 },
    { id: 2, position: [34.0522, -118.2437], price: 20, driverName: "Jane Smith", rating: 4.7 },
    { id: 3, position: [51.5074, -0.1278], price: 30, driverName: "Mike Johnson", rating: 4.2 },
    { id: 4, position: [48.8566, 2.3522], price: 80, driverName: "Lucy Brown", rating: 4.9 },
  ]);

  // Placeholder image/user for now since auth is removed
  const userImage = "https://via.placeholder.com/150";

  return (
    <Flex w="100%" h="100%" p={4} bg="black" justifyContent="center" alignItems="center">
      <Routes>
        {/* Default to /home */}
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/home" element={<ParkingApp image={userImage} ride={rides} setride={setRides} />} />
        <Route path="/profile" element={<Profile image={userImage} />} />
        <Route path="/settings" element={<SidebarRideCards ride={rides} />} />
        <Route path="/payment" element={<RideAppLayout city={rides} setcity={setRides} />} />
        <Route path="/acc" element={<Dashboard />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Flex>
  );
}

export default App;
