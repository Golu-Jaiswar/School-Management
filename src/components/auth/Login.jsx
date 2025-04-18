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
  IconButton,
  Flex,
  Alert,
  AlertIcon,
  Spinner
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear any previous error when user starts typing
    if (loginError) setLoginError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      console.log('Submitting login form with email:', email);
      const data = await login(email, password);
      console.log('Login response:', data);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.name}!`,
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
      console.error('Login form submission error:', err);
      setLoginError(
        err.response?.data?.error || 
        authError || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="80vh" width="100vw" align="center" justify="center" marginTop={10}>
      <Box 
        p={8} 
        maxWidth="500px" 
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg"
        bg="white"
        width="100%"
      >
        <Box textAlign="center">
          <Heading>Login</Heading>
          <Text mt={2} color="gray.600">
            Enter your credentials to access your account
          </Text>
        </Box>

        {loginError && (
          <Alert status="error" mt={4} borderRadius={4}>
            <AlertIcon />
            {loginError}
          </Alert>
        )}

        <Box my={8}>
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input 
                  type="email" 
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="your@email.com"
                  isDisabled={isLoading}
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
                    placeholder="Enter your password"
                    isDisabled={isLoading}
                  />
                  <InputRightElement width="4.5rem">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      onClick={() => setShowPassword(!showPassword)}
                      isDisabled={isLoading}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button 
                type="submit" 
                colorScheme="blue" 
                size="lg" 
                fontSize="md"
                isLoading={isLoading}
                loadingText="Logging in..."
                width="full"
                mt={4}
              >
                {isLoading ? <Spinner size="sm" mr={2} /> : null}
                Login
              </Button>
            </Stack>
          </form>
        </Box>

        <Box textAlign="center">
          <Text>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'blue', textDecoration: 'underline' }}>
              Register
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login; 