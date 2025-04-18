import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Flex
} from '@chakra-ui/react';

const NotFound = () => {
  return (
    <Container maxW="container.lg" py={20}>
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        align="center" 
        justify="center"
        gap={8}
      >
        <Box flex="1">
          <Image 
            src="https://illustrations.popsy.co/amber/student-idea.svg" 
            alt="404 Not Found" 
            maxH="300px"
          />
        </Box>
        
        <VStack flex="1" align="start" spacing={4}>
          <Heading size="4xl" color="blue.500">404</Heading>
          <Heading size="xl">Page Not Found</Heading>
          <Text fontSize="lg" color="gray.600">
            The page you are looking for doesn't exist or has been moved.
          </Text>
          <Box pt={6}>
            <Button
              as={RouterLink}
              to="/"
              colorScheme="blue"
              size="lg"
            >
              Return to Home
            </Button>
          </Box>
        </VStack>
      </Flex>
    </Container>
  );
};

export default NotFound; 