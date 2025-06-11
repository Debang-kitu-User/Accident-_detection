// NOTE: This login/signup component is currently unused as the app does not require authentication.


// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   VStack,
//   Heading,
//   Text,
//   useToast,
//   keyframes,
//   useBreakpointValue,
//   Alert,
//   AlertIcon,
// } from '@chakra-ui/react';

// import { Link as RouterLink } from 'react-router-dom';
// import { Link } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';

// function LoginPage({ curr, next, user, setUser, name, setName }) {
//   const toast = useToast();
//   const navigate = useNavigate();
  
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const quotes = [
//     "The journey is just as important as the destination.",
//     "Life is a journey, enjoy the ride.",
//     "Every road leads somewhere, choose yours wisely.",
//     "The best way to predict the future is to create it.",
//     "Adventure awaits around every corner."
//   ];

//   const [currentQuote, setCurrentQuote] = useState(0);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setError('');
    
//     // Client-side validation
//     if (!username.trim() || !password.trim()) {
//       setError('Please fill in all fields');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:4000/api/login', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: username.trim(),
//           password: password,
//         }),
//       });

//       const data = await response.json();
//       console.log('Login response:', data);

//       if (response.ok && data.user) {
//         // Store user data in localStorage
//         localStorage.setItem('userImage', data.user.image);
//         localStorage.setItem('userName', data.user.firstName);
//         localStorage.setItem('userId', data.user.id);
//         localStorage.setItem('isLoggedIn', 'true');

//         // Update app state
//         setUser(data.user.image);
//         setName(data.user.firstName);
        
//         toast({
//           title: 'Login successful!',
//           description: `Welcome back, ${data.user.firstName}!`,
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });

//         // Navigate to home
//         if (next) next(true);
//         navigate('/home');
    
//       } else {
//         // Handle error response
//         const errorMessage = data.message || data.error || 'Login failed';
//         setError(errorMessage);
        
//         toast({
//           title: 'Login failed',
//           description: errorMessage,
//           status: 'error',
//           duration: 4000,
//           isClosable: true,
//         });
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       const errorMessage = 'Unable to connect to server. Please check your connection and try again.';
//       setError(errorMessage);
      
//       toast({
//         title: 'Connection Error',
//         description: errorMessage,
//         status: 'error',
//         duration: 4000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Quote rotation effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentQuote((prevQuote) => (prevQuote + 1) % quotes.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [quotes.length]);

//   const slideInBottom = keyframes`
//     0% {
//       opacity: 0;
//       transform: translateY(-100%);
//     }
//     100% {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   `;

//   const isMobile = useBreakpointValue({ base: true, md: false });

//   return (
//     <Box
//       w="100%"
//       h="100vh"
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       bg="black"
//       p={4}
//       overflow="hidden"
//     >
//       <Box
//         w={{ base: "95%", md: "80%", lg: "70%" }}
//         h="100%"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         bg="black"
//         borderRadius="3xl"
//         position="relative"
//       >
//         {/* Sidebar Toggle for Mobile */}
//         {isMobile && (
//           <Button
//             onClick={() => setSidebarVisible(!sidebarVisible)}
//             position="absolute"
//             top="20px"
//             right="20px"
//             bg="transparent"
//             color="#ffd100"
//             _hover={{ bg: 'transparent' }}
//             _active={{ bg: 'transparent' }}
//             fontSize="2xl"
//             zIndex={10}
//           >
//             {sidebarVisible ? '✖️' : '☰'}
//           </Button>
//         )}

//         {/* Left Image Section with Animated Quotes */}
//         {!isMobile && (
//           <Box
//             w="50%"
//             h="93%"
//             display="flex"
//             bgImage="url('/bglogin4.jpg')"
//             backgroundSize="cover"
//             backgroundPosition="center"
//             m="20px"
//             position="relative"
//             color="#ffd100"
//             borderRadius="2xl"
//           >
//             <Text
//               fontSize="3xl"
//               fontWeight="bold"
//               position="absolute"
//               top="40px"
//               left="40px"
//               right="40px"
//               p={4}
//               textAlign="left"
//               animation={`${slideInBottom} 1.5s ease`}
//               textShadow="2px 2px 4px rgba(0,0,0,0.8)"
//               key={currentQuote} // Force re-render for animation
//             >
//               {quotes[currentQuote]}
//             </Text>
//           </Box>
//         )}

//         {/* Right Form Section */}
//         <Box
//           p={8}
//           w={{ base: "100%", md: "50%" }}
//           h="100%"
//           display="flex"
//           flexDir="column"
//           justifyContent="center"
//           bg="black"
//           color="#ffd100"
//           borderRadius="3xl"
//           boxShadow="0 0 15px rgba(128, 128, 128, 0.5)"
//           overflowY="auto"
//         >
//           <VStack spacing={6}>
//             <Heading as="h2" size="lg" color="#ffd100" textAlign="center">
//               Welcome Back
//             </Heading>

//             {error && (
//               <Alert status="error" bg="red.900" color="white" borderRadius="md">
//                 <AlertIcon />
//                 {error}
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} style={{ width: '100%' }}>
//               <VStack spacing={4} align="flex-start" w="100%">
//                 <FormControl id="username" isRequired>
//                   <FormLabel color="#ffd100">Username</FormLabel>
//                   <Input
//                     type="text"
//                     placeholder="Enter your username"
//                     focusBorderColor="#ffd100"
//                     bgColor="#d6d6d6"
//                     color="black"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     disabled={isLoading}
//                   />
//                 </FormControl>

//                 <FormControl id="password" isRequired position="relative">
//                   <FormLabel color="#ffd100">Password</FormLabel>
//                   <Input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     focusBorderColor="#ffd100"
//                     bgColor="#d6d6d6"
//                     color="black"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     pr="4.5rem"
//                     disabled={isLoading}
//                   />
//                   <Button
//                     position="absolute"
//                     top="70%"
//                     right="10px"
//                     transform="translateY(-50%)"
//                     size="sm"
//                     onClick={() => setShowPassword(!showPassword)}
//                     bg="transparent"
//                     _hover={{ bg: 'transparent' }}
//                     _active={{ bg: 'transparent' }}
//                     minW="auto"
//                     h="auto"
//                     p={1}
//                     color="#ffd100"
//                     disabled={isLoading}
//                   >
//                     {showPassword ? '🙈' : '👁️'}
//                   </Button>
//                 </FormControl>

//                 <Button
//                   type="submit"
//                   bg="#ffd100"
//                   color="black"
//                   width="100%"
//                   mt={4}
//                   _hover={{ bg: '#e5be00' }}
//                   _disabled={{ bg: '#cccccc', cursor: 'not-allowed' }}
//                   isLoading={isLoading}
//                   loadingText="Logging in..."
//                   fontWeight="bold"
//                 >
//                   Login
//                 </Button>
//               </VStack>
//             </form>

//             <Text fontSize="sm" color="#ffd100" textAlign="center">
//               Don't have an account?{' '}
//               <Link as={RouterLink} to="/signup" color="#ffd100" fontWeight="bold" textDecoration="underline">
//                 Sign up here
//               </Link>
//             </Text>
//           </VStack>
//         </Box>
//       </Box>

//       {/* Mobile Sidebar */}
//       {isMobile && sidebarVisible && (
//         <Box
//           w="100%"
//           h="100%"
//           position="absolute"
//           top="0"
//           left="0"
//           bg="rgba(0, 0, 0, 0.95)"
//           zIndex="100"
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           p={4}
//           borderRadius="3xl"
//         >
//           <VStack spacing={6}>
//             <Text color="#ffd100" fontSize="2xl" fontWeight="bold" textAlign="center">
//               {quotes[currentQuote]}
//             </Text>
//             <Button 
//               onClick={() => setSidebarVisible(false)} 
//               bg="#ffd100" 
//               color="black"
//               _hover={{ bg: '#e5be00' }}
//               size="lg"
//             >
//               Close
//             </Button>
//           </VStack>
//         </Box>
//       )}
//     </Box>
//   );
// }

// export default LoginPage;