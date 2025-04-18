import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Flex, Heading, Stack, Text, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { useAuth } from '../context/AuthContext';
import CollegeModel from './3d/CollegeModel';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.900');

  return (
    <Box w="100%" bg={bgColor}>
      {/* Hero Section */}
      <Box 
        minH={{ base: "60vh", md: "70vh" }}
        px={{ base: 4, sm: 6, md: 10, lg: 16 }}
        py={{ base: 8, sm: 12, md: 16 }}
        width="100%"
      >
        <Flex 
          direction={{ base: "column", lg: "row" }}
          align="center" 
          justify="space-between"
          wrap="wrap"
          maxW="container.xl"
          mx="auto"
        >
          <Stack 
            spacing={{ base: 6, md: 8 }} 
            maxW={{ base: "100%", lg: "45%" }}
            mb={{ base: 10, lg: 0 }}
          >
            <Heading
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="bold"
              lineHeight="shorter"
              color={useColorModeValue('gray.800', 'white')}
            >
              College Fees Management System
            </Heading>
            <Text 
              fontSize={{ base: 'sm', sm: 'md', lg: 'lg' }} 
              color={useColorModeValue('gray.600', 'gray.300')}
              lineHeight="tall"
            >
              A modern platform to manage college fees, payments, and receipts.
              Students can easily track and pay their fees, while administrators
              can manage student records and financial data efficiently.
            </Text>
            <Stack 
              direction={{ base: 'column', sm: 'row' }} 
              spacing={{ base: 3, md: 4 }}
              width={{ base: "100%", sm: "auto" }}
            >
              {isAuthenticated ? (
                <Button
                  as={RouterLink}
                  to={user.role === 'student' ? '/student' : '/admin'}
                  colorScheme="blue"
                  size={{ base: "md", md: "lg" }}
                  width={{ base: "100%", sm: "auto" }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/register"
                    colorScheme="blue"
                    size={{ base: "md", md: "lg" }}
                    width={{ base: "100%", sm: "auto" }}
                  >
                    Get Started
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/login"
                    colorScheme="gray"
                    size={{ base: "md", md: "lg" }}
                    width={{ base: "100%", sm: "auto" }}
                  >
                    Login
                  </Button>
                </>
              )}
            </Stack>
          </Stack>

          <Box
            w={{ base: '100%', md: '50%', lg: "45%" }}
            h={{ base: '250px', sm: '300px', md: '400px' }}
          >
            <ErrorBoundary>
              <Canvas 
                camera={{ position: [0, 0, 15], fov: 60 }} 
                gl={{ 
                  preserveDrawingBuffer: true, 
                  antialias: true,
                  powerPreference: 'high-performance'
                }}
                style={{ height: '100%', width: '100%' }}
              >
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <CollegeModel position={[0, -2, 0]} />
              </Canvas>
            </ErrorBoundary>
          </Box>
        </Flex>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 12, md: 16 }} bg={useColorModeValue('gray.50', 'gray.800')} width="100%">
        <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
          <Heading 
            textAlign="center" 
            mb={{ base: 8, md: 12 }}
            fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
            color={useColorModeValue('gray.800', 'white')}
          >
            Features
          </Heading>
          <Grid 
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} 
            gap={{ base: 6, md: 8 }}
          >
            <GridItem>
              <Feature
                title="Student Portal"
                description="View and pay fees, download receipts, and track payment history."
              />
            </GridItem>
            <GridItem>
              <Feature
                title="Admin Dashboard"
                description="Manage students, create fee structures, and generate reports."
              />
            </GridItem>
            <GridItem>
              <Feature
                title="Secure Payments"
                description="Multiple payment options with secure transaction processing."
              />
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

const Feature = ({ title, description }) => {
  return (
    <Box 
      p={{ base: 5, md: 6 }} 
      shadow="md" 
      borderWidth="1px" 
      borderRadius="md" 
      bg={useColorModeValue('white', 'gray.700')}
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      height="100%"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        shadow: "lg",
      }}
    >
      <Heading 
        fontSize={{ base: "lg", md: "xl" }} 
        mb={{ base: 3, md: 4 }}
        color={useColorModeValue('gray.800', 'white')}
      >
        {title}
      </Heading>
      <Text 
        fontSize={{ base: "sm", md: "md" }} 
        color={useColorModeValue('gray.600', 'gray.300')}
      >
        {description}
      </Text>
    </Box>
  );
};

export default Home; 