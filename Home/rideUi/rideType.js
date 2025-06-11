import React from 'react';
import { useState } from 'react';
import {
  Box,
  Image,
  Text
} from '@chakra-ui/react';

const RideType = ({ image, id, selectedImage, setSelectedImage, label,price,setPrice }) => {
  return (
    <Box
      margin="2px"
      cursor="pointer"
      bg={selectedImage === id ? 'yellow' : 'white'} // Change background to yellow on click
      w="153.6px" // Adjusted width for appropriate size
      h="65px" // Increased height to accommodate the text
      onClick={() => {setSelectedImage(id)
        setPrice(price)}
      }
      borderRadius="10px" // Rounded edges
      display="flex" // Flexbox for better alignment
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      overflow="hidden" // Ensure the content stays within the box
    >
      <Image
        h="7vh"
        p="5px"
        w="auto" // Maintain aspect ratio
        src={image}
        alt='Ride Type Image'
        objectFit="contain" // Ensures the image fits accurately within the box
        borderRadius='lg' // Rounded image
      />
      {/* Text below the image */}
      <Text mt="1"fontWeight="550" fontSize="sm" color="black">
        {label}
      </Text>
    </Box>
  );
}

export default RideType;
