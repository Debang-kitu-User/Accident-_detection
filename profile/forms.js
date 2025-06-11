import React from 'react';
import {
  Editable,
  EditableInput,
  EditablePreview,
  ButtonGroup,
  IconButton,
  Flex,
  Input,
  useEditableControls,
  Box
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

function CustomControlsExample() {
  /* Custom controls for edit mode */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="flex-end" size="xs" mt={1}>
        <IconButton
          icon={<CheckIcon />}
          {...getSubmitButtonProps()}
          size="xs"
          colorScheme="green"
        />
        <IconButton
          icon={<CloseIcon />}
          {...getCancelButtonProps()}
          size="xs"
          colorScheme="red"
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="flex-end" mt={1}>
        <IconButton size="xs" icon={<EditIcon />} {...getEditButtonProps()} />
      </Flex>
    );
  }

  return (
    <Box w="200px" p={2}>
      <Editable
        textAlign="left"
        defaultValue="Edit Me"
        fontSize="md"
        isPreviewFocusable={false}
        w="100%"
      >
        <EditablePreview
          w="100%"
          p={2}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          color="gray.800" // Dark text color for better contrast
          bg="gray.100" // Light background for contrast
        />
        <Input
          as={EditableInput}
          size="sm"
          w="100%"
          p={2}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          color="gray.800" // Dark text color for better contrast
          bg="white" // White background for clarity in input
        />
        <EditableControls />
      </Editable>
    </Box>
  );
}

export default CustomControlsExample;
