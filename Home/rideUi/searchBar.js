import React, { useState, useCallback } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBarWithDropdown = ({ setCity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const items = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  }, [items]);

  const handleSelectItem = useCallback((item) => {
    setSearchTerm(item);  // This will set the selected city as the value in the input field
    setDropdownVisible(false);
    setCity(item);  // Pass the selected city to the parent component
  }, [setCity]);

  return (
    <VStack spacing={4} align="start" m={4} w="100%">
      <Box w="100%" position="relative">
        <InputGroup w="100%">
          <Input
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={handleSearchChange}
            borderRadius="20px"
            bg="white"
            boxShadow="lg"
            border="1px solid #E2E8F0"
            _focus={{
              borderColor: 'blue.300',
              boxShadow: '0 0 5px rgba(66, 153, 225, 0.5)',
            }}
            aria-label="Search for a city"
            w="100%"
            color="black"  // Ensure selected text is always black for better contrast
          />
          <InputRightElement>
            <Icon as={SearchIcon} color="gray.500" boxSize={5} />
          </InputRightElement>
        </InputGroup>

        {dropdownVisible && searchTerm && (
          <Box
            mt={2}
            border="1px solid #E2E8F0"
            borderRadius="md"
            boxShadow="md"
            bg="white" // Dropdown background
            position="absolute"
            zIndex="popover"
            w="100%"
            maxH="200px"
            overflowY="auto"
          >
            {filteredItems.length > 0 ? (
              <List spacing={1}>
                {filteredItems.map((item, index) => (
                  <ListItem
                    key={index}
                    p={2}
                    cursor="pointer"
                    borderRadius="md"
                    _hover={{ bg: 'blue.500', color: 'white' }} // Hover effect
                    onClick={() => handleSelectItem(item)}  // Set the selected city
                    aria-label={`Select ${item}`}
                    fontSize="sm"
                    color="black" // Ensure list text is black
                  >
                    {item}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text p={2} fontSize="sm" color="gray.500">
                No results found
              </Text>
            )}
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default SearchBarWithDropdown;
