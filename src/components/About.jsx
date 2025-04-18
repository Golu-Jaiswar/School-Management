import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Flex,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  List,
  ListItem,
  ListIcon,
  useColorModeValue
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const About = () => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={10} align="stretch">
        {/* Hero Section */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            About Our Fees Management System
          </Heading>
          <Text fontSize="xl" color="gray.500">
            Simplifying college fee payments for students and administrators
          </Text>
        </Box>

        {/* Mission Section */}
        <Flex direction={{ base: 'column', md: 'row' }} gap={10} alignItems="center">
          <Box flex="1">
            <Image 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80" 
              alt="Students in college"
              borderRadius="lg"
              boxShadow="lg"
            />
          </Box>
          <VStack flex="1" align="start" spacing={5}>
            <Heading as="h2" size="xl">Our Mission</Heading>
            <Text fontSize="lg">
              Our mission is to streamline the fee payment process for educational institutions, making it easier for students 
              to manage their finances and for administrators to track payments efficiently.
            </Text>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Simplify fee payment processes for students
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Provide transparent tracking of all financial transactions
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Reduce administrative overhead for institutions
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Create a paperless, environment-friendly system
              </ListItem>
            </List>
          </VStack>
        </Flex>

        <Divider />

        {/* Features Section */}
        <Box>
          <Heading as="h2" size="xl" mb={6} textAlign="center">
            Key Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Card bg={bgColor} boxShadow="md" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">For Students</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Text>• View all due fees with deadlines</Text>
                  <Text>• Multiple payment options</Text>
                  <Text>• Download payment receipts</Text>
                  <Text>• Fee payment history</Text>
                  <Text>• Email notifications for due dates</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg={bgColor} boxShadow="md" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">For Administrators</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Text>• Create and manage fee structures</Text>
                  <Text>• Track payment status</Text>
                  <Text>• Generate payment reports</Text>
                  <Text>• Manage student records</Text>
                  <Text>• Approve/reject payment requests</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg={bgColor} boxShadow="md" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Technology</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Text>• Modern React.js frontend</Text>
                  <Text>• Secure Node.js backend</Text>
                  <Text>• MongoDB database</Text>
                  <Text>• Responsive design for all devices</Text>
                  <Text>• Real-time payment updates</Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>

        <Divider />

        {/* Team Section */}
        <Box>
          <Heading as="h2" size="xl" mb={6} textAlign="center">
            Our Team
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            {[
              { name: 'Rahul Sharma', role: 'Project Lead' },
              { name: 'Priya Patel', role: 'Frontend Developer' },
              { name: 'Arjun Singh', role: 'Backend Developer' },
              { name: 'Neha Gupta', role: 'UI/UX Designer' }
            ].map((member, index) => (
              <VStack key={index} p={5} bg={bgColor} borderRadius="md" boxShadow="md">
                <Box 
                  w="100px" 
                  h="100px" 
                  borderRadius="full" 
                  bg="blue.500" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  color="white"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </Box>
                <Heading size="md" mt={2}>{member.name}</Heading>
                <Text color="gray.500">{member.role}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
};

export default About; 