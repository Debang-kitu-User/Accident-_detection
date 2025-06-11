// // NOTE: This login/signup component is currently unused as the app does not require authentication.

// import React, { useState } from 'react';
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
//   Alert,
//   AlertIcon,
//   Progress,
// } from '@chakra-ui/react';

// import { useNavigate } from 'react-router-dom';
// import { Link as RouterLink } from 'react-router-dom';
// import { Link } from '@chakra-ui/react';

// function SignupPage({ setUser, setName, next }) {
//   const toast = useToast();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: '',
//     username: '',
//     password: '',
//     email: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Password strength checker
//   const getPasswordStrength = (password) => {
//     let strength = 0;
//     if (password.length >= 6) strength += 25;
//     if (password.length >= 8) strength += 25;
//     if (/[A-Z]/.test(password)) strength += 25;
//     if (/[0-9]/.test(password)) strength += 25;
//     return strength;
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     // Clear error when user starts typing
//     if (error) setError('');
//   };

//   const validateForm = () => {
//     const { fullName, username, password, email } = formData;
    
//     if (!fullName.trim()) {
//       setError('Full name is required');
//       return false;
//     }
    
//     if (!email.trim()) {
//       setError('Email is required');
//       return false;
//     }
    
//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError('Please enter a valid email address');
//       return false;
//     }
    
//     if (!username.trim()) {
//       setError('Username is required');
//       return false;
//     }
    
//     if (username.length < 3) {
//       setError('Username must be at least 3 characters long');
//       return false;
//     }
    
//     if (!password) {
//       setError('Password is required');
//       return false;
//     }
    
//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return false;
//     }
    
//     return true;
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     const { fullName, username, password, email } = formData;
//     const defaultImage = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

//     try {
//       const response = await fetch('http://localhost:4000/api/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username: username.trim(),
//           password: password,
//           email: email.trim(),
//           firstName: fullName.trim(),
//           image: defaultImage,
//         }),
//       });

//       const data = await response.json();
//       console.log('Signup response:', data);

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
//           title: 'Account created successfully!',
//           description: `Welcome to the platform, ${data.user.firstName}!`,
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });

//         if (next) next(true);
//         navigate('/home');
//       } else {
//         // Handle error response
//         const errorMessage = data.message || data.error || 'Signup failed';
//         setError(errorMessage);
        
//         toast({
//           title: 'Signup failed',
//           description: errorMessage,
//           status: 'error',
//           duration: 4000,
//           isClosable: true,
//         });
//       }
//     } catch (err) {
//       console.error('Signup error:', err);
//       const errorMessage = 'Unable to connect to server. Please check your connection.';
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

//   const passwordStrength = getPasswordStrength(formData.password);
//   const getStrengthColor = (strength) => {
//     if (strength < 25) return 'red';
//     if (strength < 50) return 'orange';
//     if (strength < 75) return 'yellow';
//     return 'green';
//   };

//   return (
//     <Box
//       w="100%"
//       h="100vh"
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       bg="black"
//       p={4}
//     >
//       <Box
//         p={8}
//         w={{ base: "95%", md: "600px" }}
//         maxH="90vh"
//         bg="black"
//         color="#ffd100"
//         borderRadius="3xl"
//         boxShadow="0 0 15px rgba(128, 128, 128, 0.5)"
//         overflowY="auto"
//       >
//         <VStack spacing={6}>
//           <Heading as="h2" size="lg" color="#ffd100" textAlign="center">
//             Create Your Account
//           </Heading>

//           {error && (
//             <Alert status="error" bg="red.900" color="white" borderRadius="md">
//               <AlertIcon />
//               {error}
//             </Alert>
//           )}

//           <form onSubmit={handleSignup} style={{ width: '100%' }}>
//             <VStack spacing={4} align="flex-start" w="100%">
//               <FormControl isRequired>
//                 <FormLabel color="#ffd100">Full Name</FormLabel>
//                 <Input
//                   type="text"
//                   placeholder="Enter your full name"
//                   focusBorderColor="#ffd100"
//                   bgColor="#d6d6d6"
//                   color="black"
//                   value={formData.fullName}
//                   onChange={(e) => handleInputChange('fullName', e.target.value)}
//                   disabled={isLoading}
//                 />
//               </FormControl>

//               <FormControl isRequired>
//                 <FormLabel color="#ffd100">Email Address</FormLabel>
//                 <Input
//                   type="email"
//                   placeholder="you@example.com"
//                   focusBorderColor="#ffd100"
//                   bgColor="#d6d6d6"
//                   color="black"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   disabled={isLoading}
//                 />
//               </FormControl>

//               <FormControl isRequired>
//                 <FormLabel color="#ffd100">Username</FormLabel>
//                 <Input
//                   type="text"
//                   placeholder="Choose a username"
//                   focusBorderColor="#ffd100"
//                   bgColor="#d6d6d6"
//                   color="black"
//                   value={formData.username}
//                   onChange={(e) => handleInputChange('username', e.target.value)}
//                   disabled={isLoading}
//                 />
//                 <Text fontSize="xs" color="gray.400" mt={1}>
//                   Username must be at least 3 characters long
//                 </Text>
//               </FormControl>

//               <FormControl isRequired>
//                 <FormLabel color="#ffd100">Password</FormLabel>
//                 <Box position="relative">
//                   <Input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     focusBorderColor="#ffd100"
//                     bgColor="#d6d6d6"
//                     color="black"
//                     value={formData.password}
//                     onChange={(e) => handleInputChange('password', e.target.value)}
//                     pr="4.5rem"
//                     disabled={isLoading}
//                   />
//                   <Button
//                     position="absolute"
//                     top="50%"
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
//                 </Box>
                
//                 {formData.password && (
//                   <Box mt={2}>
//                     <Text fontSize="xs" color="gray.400" mb={1}>
//                       Password Strength
//                     </Text>
//                     <Progress 
//                       value={passwordStrength} 
//                       colorScheme={getStrengthColor(passwordStrength)}
//                       size="sm"
//                       borderRadius="md"
//                     />
//                   </Box>
//                 )}
                
//                 <Text fontSize="xs" color="gray.400" mt={1}>
//                   Password must be at least 6 characters long
//                 </Text>
//               </FormControl>

//               <Button
//                 type="submit"
//                 bg="#ffd100"
//                 color="black"
//                 width="100%"
//                 mt={6}
//                 _hover={{ bg: '#e5be00' }}
//                 _disabled={{ bg: '#cccccc', cursor: 'not-allowed' }}
//                 isLoading={isLoading}
//                 loadingText="Creating account..."
//                 fontWeight="bold"
//                 size="lg"
//               >
//                 Create Account
//               </Button>
//             </VStack>
//           </form>

//           <Text fontSize="sm" textAlign="center">
//             Already have an account?{' '}
//             <Link as={RouterLink} to="/" color="#ffd100" fontWeight="bold" textDecoration="underline">
//               Sign in here
//             </Link>
//           </Text>
//         </VStack>
//       </Box>
//     </Box>
//   );
// }

// export default SignupPage;