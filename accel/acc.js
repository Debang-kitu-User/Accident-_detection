import React, { useState, useEffect, useRef } from 'react';
import { Flex, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Sidebar from '../Home/Sidebar';
import LeafletMap from '../map/newmap';
import emailjs from '@emailjs/browser'; // Import EmailJS

const Dashboard = () => {
  const [data, setData] = useState({
    acceleration: { x: 0, y: 0, z: 0 },
    gps: { latitude: 0, longitude: 0 },
    accidentDetected: false,
    timestamp: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useRef to hold the audio elementnpm install @emailjs/browser

  // useRef to hold the audio element
  const audioRef = useRef(null);

  // useRef to prevent repeated alerts
  const alertSentRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/sensor-data');

        // Content type verification
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/html')) {
          const text = await response.text();
          throw new Error(`Server error: ${text.substring(0, 100)}`);
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const json = await response.json();

        // Data validation and parsing
        setData({
          acceleration: {
            x: Number(json.acceleration?.x) || 0,
            y: Number(json.acceleration?.y) || 0,
            z: Number(json.acceleration?.z) || 0
          },
          gps: {
            latitude: Number(json.gps?.latitude) || 0,
            longitude: Number(json.gps?.longitude) || 0
          },
          accidentDetected: Boolean(json.accidentDetected),
          timestamp: json.timestamp || new Date().toISOString()
        });
        setError(null);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setData(prev => ({
          ...prev,
          accidentDetected: false
        }));
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch and 3-second interval
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Play sound when accidentDetected changes to true
  useEffect(() => {
    if (data.accidentDetected && audioRef.current) {
      audioRef.current.play();
    }
  }, [data.accidentDetected]);

  // Send email and SMS when accidentDetected is true
  useEffect(() => {
  if (data.accidentDetected && !alertSentRef.current) {
    // --- Send Email ---
    const templateParams = {
      subject: "Accident Alert!",
      message: `An accident has been detected at ${new Date(data.timestamp).toLocaleTimeString()}.\nLocation: Lat ${data.gps.latitude}, Lng ${data.gps.longitude}.`
    };

    emailjs.send('service_1kxefhl', 'template_6b11qlz', templateParams, 'KvpqbWuIcTi251cjp')
      .then(result => console.log("Email sent:", result.text))
      .catch(error => console.error("Email error:", error));

    // --- Send SMS ---
    fetch('http://localhost:4000/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: '+919178193263',
        message: `🚨 Accident Alert!\nAn accident has been detected at ${new Date(data.timestamp).toLocaleTimeString()}.Location: Lat ${data.gps.latitude.toFixed(6)}, Lng ${data.gps.longitude.toFixed(6)}`
      })
    })
      .then(res => res.json())
      .then(response => {
        if (response.success) console.log('SMS sent!');
        else console.error('SMS failed:', response.error);
      })
      .catch(err => console.error('SMS error:', err));

    // Set the flag so it doesn’t run again
    alertSentRef.current = true;
  }

  // Reset the flag if accidentDetected becomes false again
  if (!data.accidentDetected) {
    alertSentRef.current = false;
  }
}, [data.accidentDetected, data.timestamp, data.gps, data.acceleration]);



  return (
    <Flex direction="row" h="100vh">
      <Sidebar image={data.profileImage} />
      
      <Flex direction="column" p={5} bg="#f0f2f5" flex="1" overflowY="auto">
        <Heading textAlign="center" mb={8} color="blue.600">
          Real-Time Sensor Dashboard
          {loading && <Spinner size="sm" ml={3} />}
        </Heading>

        {error && (
          <Box bg="orange.100" p={3} mb={4} borderRadius="md">
            <Text color="orange.600">Warning: {error}</Text>
          </Box>
        )}

        <Box w="100%" h={{ base: '300px', lg: '500px' }} mb={8}>
          <LeafletMap 
            position={[data.gps.latitude, data.gps.longitude]}
            style={{ height: '100%', width: '100%' }} 
          />
        </Box>
        
        <Flex wrap="wrap" justifyContent="center" gap={6}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Box bg="white" p={6} borderRadius="md" boxShadow="md" minW="280px">
              <Heading size="md" mb={4} color="blue.500">
                Acceleration (g-force)
              </Heading>
              <Text fontSize="xl" fontWeight="semibold">
                X: {data.acceleration.x.toFixed(2)}<br />
                Y: {data.acceleration.y.toFixed(2)}<br />
                Z: {data.acceleration.z.toFixed(2)}
              </Text>
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Box bg="white" p={6} borderRadius="md" boxShadow="md" minW="280px">
              <Heading size="md" mb={4} color="blue.500">
                GPS Location
              </Heading>
              <Text fontSize="xl" fontWeight="semibold">
                {data.gps.latitude !== 0 ? (
                  <>
                    Lat: {data.gps.latitude.toFixed(6)}<br />
                    Lng: {data.gps.longitude.toFixed(6)}
                  </>
                ) : "Acquiring GPS..."}
              </Text>
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Box
              bg={data.accidentDetected ? "red.100" : "green.100"}
              p={6}
              borderRadius="md"
              boxShadow="md"
              minW="280px"
            >
              <Heading size="md" mb={4} color={data.accidentDetected ? "red.600" : "green.600"}>
                {data.accidentDetected ? "🆘 Emergency Alert!" : "Normal Status"}
              </Heading>
              <Text fontSize="lg">
                {data.accidentDetected ? "Impact detected!" : "All systems normal"}
              </Text>
              {data.timestamp && (
                <Text fontSize="sm" mt={2} color="gray.600">
                  Last update: {new Date(data.timestamp).toLocaleTimeString()}
                </Text>
              )}
            </Box>
          </motion.div>
        </Flex>
      </Flex>

      {/* Hidden audio element for accident alert sound */}
      <audio ref={audioRef} src="https://www.soundjay.com/buttons/sounds/beep-01a.mp3" preload="auto" />
    </Flex>
  );
};

export default Dashboard;
