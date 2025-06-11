import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  Text,
  useToast,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react';
import Sidebar from './Sidebar';
import RideType from './rideUi/rideType';
import SearchBarWithDropdown from './rideUi/searchBar';
import LeafletMap from '../map/showmap';

function ParkingApp({ ride, setride }) {
  const images = [
    { id: 1, src: "sedan1.png", alt: 'Image 1', label: 'Sedan', price: 50, weight: 1.2 },
    { id: 2, src: "bike.png", alt: 'Image 2', label: 'Bike', price: 20, weight: 0.8 },
    { id: 3, src: "hatach.png", alt: 'Image 3', label: 'Micro', price: 30, weight: 1.0 },
    { id: 4, src: "PngItem_5047619 (3).png", alt: 'Image 4', label: 'Luxury', price: 80, weight: 1.5 },
  ];

  const [city1, setCity1] = useState('New York');
  const [city2, setCity2] = useState('Los Angeles');
  const [selectedImage, setSelectedImage] = useState(null);
  const [price, setPrice] = useState(0);
  const [showSplitForm, setShowSplitForm] = useState(false);
  const [friends, setFriends] = useState(['']); // Array to store friend names
  const [splitPrice, setSplitPrice] = useState(price);

  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra modal state management
  const toast = useToast();

  function getDistance(city1, city2) {
    const distances = {
      'New York': { 'Los Angeles': 4500, 'Chicago': 1300, 'Houston': 2600, 'Miami': 2100 },
      'Los Angeles': { 'New York': 4500, 'Chicago': 2800, 'Houston': 2300, 'Miami': 4100 },
      'Chicago': { 'New York': 1300, 'Los Angeles': 2800, 'Houston': 1600, 'Miami': 2300 },
      'Houston': { 'New York': 2600, 'Los Angeles': 2300, 'Chicago': 1600, 'Miami': 1900 },
      'Miami': { 'New York': 2100, 'Los Angeles': 4100, 'Chicago': 2300, 'Houston': 1900 }
    };

    return distances[city1]?.[city2] || 0;
  }

  useEffect(() => {
    if (selectedImage && city1 && city2) {
      const distance = getDistance(city1, city2);
      const selectedCar = images.find((image) => image.id === selectedImage);
      const fare = distance * selectedCar.weight;
      setPrice(fare);
      setSplitPrice(fare); // Set initial splitPrice to the full price
    }
  }, [selectedImage, city1, city2]);

  const handleBookRide = () => {
    if (!selectedImage) {
      toast({
        title: "Ride type not selected",
        description: "Please select a ride type before booking.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } else if (!city1 || !city2) {
      toast({
        title: "City not selected",
        description: "Please select both pickup and drop cities.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      // Proceed to book the ride
    }
  };

  const handleAddFriend = () => {
    setFriends([...friends, '']);
  };

  const handleFriendChange = (index, event) => {
    const updatedFriends = [...friends];
    updatedFriends[index] = event.target.value;
    setFriends(updatedFriends);

    // Recalculate split price based on the number of people
    const totalPeople = friends.length + 1; // Including the user
    setSplitPrice(price / totalPeople);
  };

  const handleRemoveFriend = (index) => {
    const updatedFriends = friends.filter((_, i) => i !== index);
    setFriends(updatedFriends);

    // Recalculate split price
    const totalPeople = updatedFriends.length + 1; // Including the user
    setSplitPrice(price / totalPeople);
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      w="100%"
      bgColor="#333533"
      p={4}
    >
      {/* Main Content Box */}
      <Box
        bgColor="#202020"
        borderRadius="20px"
        boxShadow="0px 10px 30px rgba(0, 0, 0, 0.3)"
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        display="flex"
        flexDirection={{ base: 'column', lg: 'row' }}
        w="95vw"
        h="85vh"
        p="4"
        overflowY={{ base: 'scroll', lg: 'unset' }}
        fontFamily="Work Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif"
        color="#D6D6D6"
        fontSize={{ base: '16px', md: '18px', lg: '22px' }} // Responsive font size
        lineHeight="1.64"
        letterSpacing="-0.7px"
        fontWeight="450"
      >
        <Sidebar />

        <Flex padding="5vh" flexDirection="column" bgColor="transparent" flex="1" gap={1}>
          <Text mb={4} fontWeight="550" color="#ffee32">Select ride</Text>

          <Flex
            p="2vh"
            flexDirection="row"
            flexWrap="wrap"
            gap={4}
            align="stretch"
            justifyContent="space-between"
          >
            {images.map((image) => (
              <RideType
                key={image.id}
                image={image.src}
                id={image.id}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                label={image.label}
                price={image.price}
                setPrice={setPrice}
                width="200px"
                height="200px"
              />
            ))}
          </Flex>

          <Flex flexDirection={{ base: 'column', lg: 'row' }} gap={6} mt={4}>
            <Flex flexDirection="column" flex="1.5" gap={4}>
              <Text fontWeight="600" color="#ffee32">Pickup & Drop</Text>
              <SearchBarWithDropdown setCity={setCity1} />
              <SearchBarWithDropdown setCity={setCity2} />
            </Flex>

            <Flex flex="2.5" borderRadius="20px" overflow="hidden" bgColor="#D6D6D6" h={{ base: '300px', lg: '65%' }} ml={{ lg: 6 }} mt={{ base: 4, lg: 0 }}>
              <LeafletMap city1={city1} city2={city2} shape="square" style={{ height: '100%', width: '100%' }} />
            </Flex>
          </Flex>
        </Flex>

        <Flex
          borderRadius="20px"
          backgroundImage="url('/rain.jfif')"
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          w={{ base: '100%', lg: '35%' }}
          h={{ base: '50vh', lg: '100%' }}
          flexDirection="column"
          justifyContent="space-between"
          p={4}
          position="relative"
          mt={{ base: 4, lg: 0 }}
        >
          <Text fontSize="34px" mb={4} color="black">26°C</Text>
          <Text
            fontSize="30px"
            color="#ffee32"
            position="absolute"
            bottom="10px"
            left="10px"
            fontStyle="italic"
          >
            *It's raining, fare may rise
          </Text>
        </Flex>
      </Box>

      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        mt={4}
        mb={4}
      >
        <Flex flexDirection="column" alignItems="flex-start" gap={2}>
          <Text color="#ffee32">Fare: ₹{splitPrice}</Text>
          <Button colorScheme="yellow" onClick={onOpen}>Split Fare</Button>
        </Flex>
        <Link to={selectedImage && city1 && city2 ? "/payment" : "#"}> {/* Conditional link */}
          <Button
            colorScheme="yellow"
            bg="#FFD100"
            _hover={{ bg: "#ffee32" }}
            w="auto"
            fontSize="lg"
            padding="12px"
            onClick={handleBookRide} // Trigger the toast check
          >
            Book Ride
          </Button>
        </Link>
      </Flex>

      {/* Modal for splitting the ride */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Friends to Split Fare</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {friends.map((friend, index) => (
              <Flex key={index} mb={4} alignItems="center">
                <Input
                  placeholder={`Friend ${index + 1} Name`}
                  value={friend}
                  onChange={(e) => handleFriendChange(index, e)}
                  mr={2}
                />
                <Button colorScheme="red" onClick={() => handleRemoveFriend(index)}>
                  Remove
                </Button>
              </Flex>
            ))}
            <Button colorScheme="green" onClick={handleAddFriend}>
              Add Another Friend
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="yellow" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default ParkingApp;
