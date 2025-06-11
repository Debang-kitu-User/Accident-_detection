import React, { useState, useEffect } from 'react';
import Sidebar from '../Home/Sidebar';
import { Flex, Text, Box, Image, Highlight } from '@chakra-ui/react';
import { motion } from 'framer-motion'; // Import motion for animation
import CustomControlsExample from './forms';

const Profile = ({ image }) => {
  // List of quotes
  const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", highlight: "limit" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", highlight: "courage" },
    { text: "Believe you can and you're halfway there.", highlight: "Believe" },
    { text: "The way to get started is to quit talking and begin doing.", highlight: "doing" }
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    // Change quote every 5 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(quoteInterval); // Clean up interval on component unmount
  }, [quotes.length]);

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }} // Stack items vertically on mobile, horizontally on larger screens
      h="100vh"
      w="100%"
      p="5"
      bg="#333533" // Dark gray background for the entire container
    >
      {/* Sidebar */}
      <Flex
        w={{ base: '100%', md: '15vw' }} // Full width on mobile, smaller width on larger screens
        margin={{ base: '0', md: '2vw' }} // No margin on mobile, adjust margin on larger screens
        boxShadow="lg" // Add shadow to differentiate the sidebar
        zIndex="10" // Ensure it stays on top
        bg="#202020" // Dark background for the sidebar
        borderRadius="md" // Slight rounding of the box
        p={4} // Padding around the container
      >
        <Sidebar image={image} />
      </Flex>

      {/* Content Section */}
      <Flex
        direction="column"
        ml={{ base: 0, md: '5vw' }} // No margin on mobile, adjust margin on larger screens
        w={{ base: '100%', md: '50%' }} // Full width on mobile, half width on larger screens
        p={5}
      >
        {/* Profile Photo and Name Section */}
        <Flex alignItems="center" mb={5} w="100%" flexDirection={{ base: 'column', md: 'row' }}>
          {/* Profile Photo */}
          <Box
            w="100px"
            h="100px"
            borderRadius="full"
            overflow="hidden"
            mb={{ base: 4, md: 0 }} // Margin bottom on mobile, none on larger screens
            border="2px solid #ccc"
          >
            <Image
              src={image}
              alt="Profile Photo"
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </Box>

          {/* Name Section */}
          <Flex flexDirection="column" flex="1">
            <Text fontWeight="bold" fontSize="lg" mb={1} color="white">Name:</Text>
            <Box w="100%">
              <CustomControlsExample />
            </Box>
          </Flex>
        </Flex>

        {/* Phone Number Section */}
        <Flex alignItems="flex-start" mb={5} w="100%" flexDirection="column">
          <Text fontWeight="bold" fontSize="lg" mb={1} color="white">Phone Number:</Text>
          <Box w="100%">
            <CustomControlsExample />
          </Box>
        </Flex>
      </Flex>

      {/* Quote Section */}
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        w={{ base: '100%', md: '25vw' }} // Full width on mobile, adjusted width on larger screens
        ml={{ base: 0, md: '2vw' }} // No margin on mobile, adjust margin on larger screens
        p={5}
        bg="#FFD100" // Golden yellow background for the quote section
        borderRadius="md" // Slight rounding of the box
        boxShadow="lg" // Box shadow for elevation
      >
        <motion.div
          key={currentQuote} // Key allows React to track and re-render when the quote changes
          initial={{ opacity: 0, y: 50 }} // Start quote below with 0 opacity
          animate={{ opacity: 1, y: 0 }} // Animate it to full opacity and move up
          exit={{ opacity: 0, y: -50 }} // Exit it by fading out and moving up
          transition={{ duration: 1 }} // Smooth transition duration
        >
          <Text
            fontSize={{ base: 'xl', md: '4xl' }} // Adjust font size for mobile and large screens
            fontWeight="bold"
            textAlign="center"
            lineHeight="1.2"
            color="#202020" // Dark gray text for contrast
          >
            <Highlight
              query={quotes[currentQuote].highlight}
              styles={{ px: '2', py: '1', bg: '#ffee32', borderRadius: 'md' }} // Bright yellow highlight
            >
              {quotes[currentQuote].text}
            </Highlight>
          </Text>
        </motion.div>
      </Flex>
    </Flex>
  );
};

export default Profile;
