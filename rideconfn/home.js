import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  VStack,
  Textarea,
  HStack,
  useBreakpointValue, // Import Chakra's responsive hook
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons'; 
import LeafletMap from '../map/showmap'; 
import Sidebar from '../Home/Sidebar'; 
import { useLocation } from 'react-router-dom'; 
import ChatApp from '../chatApp';

function PaymentAndDetails({ driverName, carDetails, carNumber, price, isPaymentSuccess, setIsPaymentSuccess, city, setcity }) {
  const [isRideEnded, setIsRideEnded] = useState(false); 
  const [rating, setRating] = useState(0); 
  const [comment, setComment] = useState(''); 
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false); 

  const handleEndRide = () => {
    setIsRideEnded(true);
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmitFeedback = () => {
    const feedback = {
      driverName,
      rating,
      comment,
    };

    setIsFeedbackSubmitted(true); 
  };

  useEffect(() => {
    if (isPaymentSuccess) {
      const newRide = {
        id: city.length + 1, 
        position: [40.7128, -74.0060], 
        price: 20,
        driverName: "binahmed",
        rating: 5,
      };

      setcity([...city, newRide]);
    }
  }, [isPaymentSuccess, city, setcity]);

  return (
    <VStack
      w="100%"
      h="100%"
      bg="#202020" 
      p={4}
      borderRadius="md"
      boxShadow="md"
      spacing={4}
      align="stretch"
      color="#D6D6D6" 
      overflowY="auto" 
    >
      <Box>
        <Text fontSize="xl" fontWeight="bold" color="#ffee32"> 
          Driver: {driverName}
        </Text>
        <Text>Car: {carDetails} - {carNumber}</Text> 
        <Text>Price: ${price}</Text>
      </Box>

      {!isPaymentSuccess && (
        <Button
          colorScheme='yellow'
          w={{ base: "80%", sm: "70%", md: "50%", lg: "30%" }} 
          fontSize={{ base: "sm", md: "md", lg: "lg" }}          
          padding={{ base: "8px", md: "12px" }}                 
          onClick={async () => {
            try {
              setIsPaymentSuccess(true);
            } catch (error) {
              console.error('Error processing payment:', error);
              alert('Payment failed. Please try again.'); 
            }
          }}
        >
          Pay Now
        </Button>
      )}

      {isPaymentSuccess && !isRideEnded && (
        <VStack spacing={4} align="stretch">
          <Box
            w="100%"
            bg="#202020"
            p={4}
            borderRadius="md"
            boxShadow="md"
            textAlign="center"
            color="#D6D6D6"
          >
            <Text fontSize="2xl" fontWeight="bold" color="#ffee32">
              Congratulations!
            </Text>
            <Text fontSize="lg">Your payment was successful.</Text>
          </Box>

          <Button
            colorScheme="yellow"
            onClick={handleEndRide}
            w={{ base: "80%", sm: "70%", md: "50%", lg: "30%" }}  
          >
            End Ride
          </Button>
        </VStack>
      )}

      {isRideEnded && !isFeedbackSubmitted && (
        <VStack spacing={4} align="stretch" h="100%" justify="space-between">
          <Text fontSize="xl" color="#ffee32">Rate Your Ride</Text>

          <HStack justify="center">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                boxSize={8}
                color={star <= rating ? '#FFD700' : '#A5A5A5'}
                cursor="pointer"
                onClick={() => handleStarClick(star)}
              />
            ))}
          </HStack>

          <Textarea
            placeholder="Leave a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            size="sm"
            bg="#333533"
            color="#D6D6D6"
            h="100px"
          />

          <Button
            colorScheme="yellow"
            onClick={handleSubmitFeedback}
            w="50%"  
            alignSelf="center"
          >
            Submit Feedback
          </Button>
        </VStack>
      )}

      {isFeedbackSubmitted && (
        <Box
          w="100%"
          bg="#202020"
          p={4}
          borderRadius="md"
          boxShadow="md"
          textAlign="center"
          color="#D6D6D6"
        >
          <Text fontSize="2xl" fontWeight="bold" color="#ffee32">
            Thank You for Your Feedback!
          </Text>
          <Text fontSize="lg">We appreciate your time.</Text>
        </Box>
      )}
    </VStack>
  );
}

function RideAppLayout({ city, setcity }) {
  const [city1, setCity1] = useState('New York');
  const [city2, setCity2] = useState('Los Angeles');
  const location = useLocation();
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('session_id')) {
      setIsPaymentSuccess(true);
    }
  }, [location]);

  const direction = useBreakpointValue({ base: 'column', md: 'row' }); 
  const flexSide = useBreakpointValue({ base: 1, md: 3 });

  return (
    <Flex
      direction={direction}
      w="100vw"
      h="100vh"
      p={4}
      bgColor="#333533" 
      gap={4} 
    >
      <Flex direction="column" flex={flexSide} gap={4} mr={4}>
        <Box flex="1" borderRadius="md" overflow="hidden" boxShadow="md">
          <Sidebar />
        </Box>
      </Flex>

      <Flex direction="column" flex="3" gap={4} overflowY="auto"> 
        <Box flex="1" borderRadius="md" overflow="hidden" boxShadow="md" bg="#D6D6D6">
          <Box h="100%" w="100%">
            <LeafletMap city1={city1} city2={city2} shape="square" style={{ height: '100%', width: '100%' }} />
          </Box>
        </Box>

        <Box flex="1" borderRadius="md" overflow="hidden" boxShadow="md">
          <PaymentAndDetails
            driverName="John Doe"
            carDetails="Sedan - Toyota Camry"
            carNumber="AB1234"
            price={50}
            isPaymentSuccess={isPaymentSuccess}
            setIsPaymentSuccess={setIsPaymentSuccess}
            city={city}
            setcity={setcity}
          />
        </Box>
      </Flex>

      <Flex direction="column" flex="2" gap={4}>
        <Box flex="2" borderRadius="md" overflow="hidden" boxShadow="md"> 
          <ChatApp />
        </Box>
      </Flex>
    </Flex>
  );
}

export default RideAppLayout;
