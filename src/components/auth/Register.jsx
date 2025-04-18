import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  Select,
  Flex
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const { name, email, password, password2, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== password2) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        name,
        email,
        password,
        role
      };

      const data = await register(userData);
      
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 2000,
        isClosable: true
      });

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      toast({
        title: 'Registration failed',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="80vh" align="center" justify="center">
      <Box 
        p={8} 
        maxWidth="500px" 
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg"
        bg="white"
        w="100%"
      >
        <Box textAlign="center">
          <Heading>Register</Heading>
          <Text mt={2} color="gray.600">
            Create a new account
          </Text>
        </Box>

        <Box my={8}>
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input 
                  type="text" 
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Your full name"
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input 
                  type="email" 
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="your@email.com"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Create a password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl id="password2" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  placeholder="Confirm your password"
                />
              </FormControl>

              <FormControl id="role" isRequired>
                <FormLabel>Account Type</FormLabel>
                <Select 
                  name="role"
                  value={role}
                  onChange={onChange}
                >
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </Select>
              </FormControl>

              <Button 
                type="submit" 
                colorScheme="blue" 
                size="lg" 
                fontSize="md"
                isLoading={isLoading}
                loadingText="Registering..."
                width="full"
                mt={4}
              >
                Register
              </Button>
            </Stack>
          </form>
        </Box>

        <Box textAlign="center">
          <Text>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
              Login
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Register; 