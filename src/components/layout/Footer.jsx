import { Box, Container, Stack, SimpleGrid, Text, Link, IconButton, Divider, useColorModeValue, VisuallyHidden, ButtonGroup, Flex } from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const SocialButton = ({ children, label, href, colorScheme }) => {
  return (
    <IconButton
      aria-label={label}
      as="a"
      href={href}
      cursor="pointer"
      rounded="full"
      size={{ base: "sm", md: "md" }}
      variant="ghost"
      colorScheme={colorScheme}
      _hover={{
        bg: `${colorScheme}.500`,
        color: "white",
        transform: "translateY(-2px)",
        boxShadow: "md"
      }}
      transition="all 0.3s ease"
      icon={children}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </IconButton>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const hoverColor = useColorModeValue('blue.500', 'blue.300');
  
  return (
    <Box
      bg={bgColor}
      color={textColor}
      borderTopWidth={1}
      borderStyle="solid"
      borderColor={borderColor}
      mt="auto"
      width="100%"
      display={{ print: 'none' }} // Hide footer when printing
      className="footer"
    >
      <Container as={Stack} maxW="8xl" py={{ base: 6, md: 10 }}>
        <SimpleGrid columns={{ base: 2, sm: 2, md: 4 }} spacing={{ base: 8, md: 10 }}>
          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} mb={{ base: 2, md: 3 }}>Company</Text>
            <Link 
              as={RouterLink} 
              to="/about" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              About Us
            </Link>
            <Link 
              as={RouterLink} 
              to="/contact" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              Contact Us
            </Link>
            <Link 
              as={RouterLink} 
              to="/help" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              Help & FAQ
            </Link>
          </Stack>

          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} mb={{ base: 2, md: 3 }}>For Students</Text>
            <Link 
              as={RouterLink} 
              to="/student" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              Dashboard
            </Link>
            <Link 
              as={RouterLink} 
              to="/student/fees" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              My Fees
            </Link>
            <Link 
              as={RouterLink} 
              to="/student/payments" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              Payment History
            </Link>
          </Stack>

          <Stack align="flex-start" mt={{ base: 0, sm: 0 }}>
            <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} mb={{ base: 2, md: 3 }}>For Administrators</Text>
            <Link 
              as={RouterLink} 
              to="/admin" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              Dashboard
            </Link>
            <Link 
              as={RouterLink} 
              to="/admin/fees" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              Manage Fees
            </Link>
            <Link 
              as={RouterLink} 
              to="/admin/students" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              Manage Students
            </Link>
          </Stack>

          <Stack align="flex-start" mt={{ base: 0, sm: 0 }}>
            <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} mb={{ base: 2, md: 3 }}>Legal</Text>
            <Link 
              as={RouterLink} 
              to="/privacy" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              Privacy Policy
            </Link>
            <Link 
              as={RouterLink} 
              to="/terms" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              Terms of Service
            </Link>
            <Link 
              as={RouterLink} 
              to="/cookies" 
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: hoverColor, textDecoration: "none" }}
              mb={1.5}
            >
              Cookie Policy
            </Link>
          </Stack>
        </SimpleGrid>
      </Container>

      <Divider />

      <Box py={{ base: 4, md: 6 }}>
        <Container
          maxW="8xl"
          px={{ base: 4, md: 6 }}
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            gap={{ base: 4, md: 0 }}
          >
            <Text 
              fontSize={{ base: "sm", md: "md" }}
              textAlign={{ base: "center", md: "left" }}
            >
              © {currentYear} School Fee Management. All rights reserved
            </Text>
            
            <ButtonGroup variant="ghost" spacing={{ base: 2, md: 3 }}>
              <SocialButton label="Twitter" href="#" colorScheme="twitter">
                <FaTwitter />
              </SocialButton>
              <SocialButton label="Facebook" href="#" colorScheme="facebook">
                <FaFacebook />
              </SocialButton>
              <SocialButton label="Instagram" href="#" colorScheme="pink">
                <FaInstagram />
              </SocialButton>
              <SocialButton label="LinkedIn" href="#" colorScheme="linkedin">
                <FaLinkedin />
              </SocialButton>
              <SocialButton label="GitHub" href="#" colorScheme="gray">
                <FaGithub />
              </SocialButton>
            </ButtonGroup>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer; 