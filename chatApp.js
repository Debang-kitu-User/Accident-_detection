import React, { useState, useEffect } from 'react';
import { Box, Button, Input, VStack, Text, HStack } from '@chakra-ui/react';
import { io } from 'socket.io-client';

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io('https://sorover.vercel.app');
    setSocket(socketIo);

    // Listen for messages from the server
    socketIo.on('message', ({ user, message }) => {
      setMessages((prevMessages) => [...prevMessages, `${user}: ${message}`]);
    });

    // Clean up socket connection on unmount
    return () => {
      if (socketIo) {
        socketIo.disconnect();
      }
    };
  }, []);

  // Send message to the server
  const sendMessage = () => {
    if (message && socket) {
      socket.emit('sendMessage', message);
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage(''); // Clear message input after sending
    }
  };

  return (
    <Box p={4} bg="#202020" w="100%" h="100%" color="#D6D6D6" borderRadius="md" boxShadow="md">
      <VStack spacing={4} align="stretch" h="100%">
        {/* Messages Box */}
        <Box flex="1" overflowY="scroll" p={2} bg="#333533" borderRadius="md" h="350px" w="100%">
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <Text key={idx} color={msg.startsWith('You:') ? "#ffee32" : "#D6D6D6"}>
                {msg}
              </Text>
            ))
          ) : (
            <Text>No messages yet</Text>
          )}
        </Box>

        {/* Message Input */}
        <HStack>
          <Input
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            bg="#333533"
            color="#D6D6D6"
            flex="1" // Make the input take full width
          />
          <Button colorScheme="yellow" onClick={sendMessage}>
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ChatApp;
