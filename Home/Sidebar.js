import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Icon, Link, HStack, VStack, Image, useBreakpointValue } from '@chakra-ui/react';
import { FaHome, FaUserAlt, FaCog, FaBell, FaCar, FaTachometerAlt } from 'react-icons/fa'; // Added FaTachometerAlt for acceleration

export default function Sidebar({ image }) {
  // Determine if the layout should switch to mobile based on screen size
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      w={isMobile ? "100vw" : "5vw"} // Full width on mobile, small width on larger screens
      h={isMobile ? "14vh" : "100%"} // Small height on mobile, full height on larger screens
      bg="black"
      display="flex"
      flexDirection={isMobile ? 'row' : 'column'} // Row on mobile, column on large screens
      borderRadius={20}
      alignItems="center"
      justifyContent="space-between"
      px={isMobile ? 0 : 0} // Add horizontal padding on mobile
      py={isMobile ? 2 : 5} // Vertical padding on large screens
      overflow="hidden"
      boxShadow="0px 4px 20px rgba(0, 0, 0, 0.9)" // More prominent shadow
      zIndex="100" // Ensure the sidebar stays above other content
    >
      {!isMobile && (
        // Vertical layout for larger screens
        <VStack spacing="25px" w="100%">
          <SidebarItem icon={FaHome} label="ParkingApp" />
          <SidebarItem icon={FaBell} label="Notifications" />
          <SidebarItem icon={FaTachometerAlt} label="Acceleration" /> {/* New acceleration icon */}
          <SidebarItem icon={FaCar} label="Settings" />
        </VStack>
      )}

      {isMobile && (
        // Horizontal layout for mobile
        <HStack
          spacing="20px"
          w="100%"
          justifyContent="center"
          minH="200px" // Ensures enough height on mobile
        >
          <SidebarItem icon={FaHome} label="" />
          <SidebarItem icon={FaBell} label="" />
          <SidebarItem icon={FaTachometerAlt} label="acc" /> {/* New acceleration icon */}
          <SidebarItem icon={FaCar} label="Settings" />
          <SidebarItem icon={FaUserAlt} label="Profile" image={image} />
        </HStack>
      )}

      {!isMobile && (
        // Vertical layout for profile section on large screens
        <VStack spacing="25px" w="100%">
          <SidebarItem icon={FaUserAlt} label="Profile" image={image} />
        </VStack>
      )}
    </Box>
  );
}

function SidebarItem({ icon, label, image }) {
  return (
    <Link
      as={RouterLink}
      to={`/${label.toLowerCase()}`}
      w="100%" // Full width for better hover effect
      p={{ base: 1, lg: 3 }} // Adjust padding for mobile and large screens
      bg="black"
      borderRadius="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      transition="background-color 0.3s ease" // Smooth transition
      _hover={{
        bg: "#ffc100", // Hover effect
        textDecoration: "none", // Remove underline on hover
      }}
      role="group"
    >
      {label === "Profile" && image ? (
        <Box
          w="50px" // Set width of profile picture
          h="50px" // Set height of profile picture
          borderRadius="full"
          overflow="hidden"
          border="2px solid white" // Border to make the image stand out
        >
          <Link as={RouterLink} to="/profile">
            <Image
              src={image} // Use the dynamic image passed as a prop
              alt="Profile Picture"
              objectFit="cover"
              w="100%"
              h="100%"
            />
          </Link>
        </Box>
      ) : (
        <Icon
          as={icon}
          w={{ base: 6, lg: 7 }} // Adjust icon size for mobile and large screens
          h={{ base: 6, lg: 7 }} // Add height for consistency
          fontSize="xl"
          color="white"
          _groupHover={{ color: "black" }} // Change icon color on hover
        />
      )}
    </Link>
  );
}
