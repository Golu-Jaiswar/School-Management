import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Textarea,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Divider,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUserAlt, FaRegPaperPlane, FaPen } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Message sent!',
        description: 'Thank you for contacting us. We will get back to you soon.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Our Address',
      content: '123 College Road, Education City, India - 110001'
    },
    {
      icon: FaPhone,
      title: 'Phone Number',
      content: '+91 98765 43210'
    },
    {
      icon: FaEnvelope,
      title: 'Email Address',
      content: 'support@collegefeesmanager.com'
    }
  ];

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={10} align="stretch">
        {/* Hero Section */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Contact Us
          </Heading>
          <Text fontSize="xl" color="gray.500">
            We'd love to hear from you. Get in touch with us.
          </Text>
        </Box>

        {/* Contact Form and Info Section */}
        <Flex 
          direction={{ base: 'column', lg: 'row' }} 
          gap={10}
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="xl"
          borderWidth="1px"
          borderColor={borderColor}
        >
          {/* Contact Information */}
          <VStack flex="1" align="stretch" spacing={8}>
            <Heading size="lg">Get In Touch</Heading>
            <Text>
              Have questions about our fee management system? Need help with your account? 
              Or just want to provide feedback? We're here to help!
            </Text>
            
            <Divider />
            
            <VStack spacing={6} align="stretch">
              {contactInfo.map((info, index) => (
                <HStack key={index} spacing={4}>
                  <Flex
                    w="50px"
                    h="50px"
                    bg="blue.500"
                    color="white"
                    borderRadius="lg"
                    justify="center"
                    align="center"
                  >
                    <Icon as={info.icon} w={5} h={5} />
                  </Flex>
                  <Box>
                    <Heading size="sm">{info.title}</Heading>
                    <Text mt={1}>{info.content}</Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
            
            <Box>
              <Heading size="sm" mb={3}>Operating Hours</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Monday - Friday</Text>
                  <Text>9:00 AM - 5:00 PM</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Saturday</Text>
                  <Text>10:00 AM - 2:00 PM</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Sunday</Text>
                  <Text>Closed</Text>
                </Box>
              </SimpleGrid>
            </Box>
          </VStack>
          
          {/* Contact Form */}
          <VStack 
            flex="1" 
            align="stretch" 
            spacing={6} 
            p={6} 
            bg={useColorModeValue('gray.50', 'gray.800')}
            borderRadius="lg"
          >
            <Heading size="lg">Send Us a Message</Heading>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Your Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaUserAlt} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl isRequired mt={4}>
                  <FormLabel>Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaEnvelope} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl isRequired mt={4}>
                  <FormLabel>Subject</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaPen} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    size="lg"
                    rows={6}
                    resize="vertical"
                  />
                </FormControl>
                
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={isSubmitting}
                  leftIcon={<FaRegPaperPlane />}
                  mt={2}
                >
                  Send Message
                </Button>
              </VStack>
            </form>
          </VStack>
        </Flex>
        
        {/* Map Section */}
        <Box 
          h="400px" 
          borderRadius="lg" 
          overflow="hidden" 
          boxShadow="md"
          borderWidth="1px"
          borderColor={borderColor}
          position="relative"
        >
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="xl"
            fontWeight="bold"
            color="gray.500"
          >
            Google Map would be embedded here
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default ContactUs; 