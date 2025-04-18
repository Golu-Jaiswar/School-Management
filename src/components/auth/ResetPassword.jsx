import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Link,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Verify token validity
    const verifyToken = async () => {
      try {
        await axios.get(`/auth/reset-password/${token}`);
      } catch (err) {
        setIsTokenValid(false);
        setError('This password reset link is invalid or has expired.');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const validatePasswords = () => {
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      await axios.post(`/auth/reset-password/${token}`, {
        password: formData.password
      });
      
      toast({
        title: 'Password reset successful',
        description: 'Your password has been reset. You can now log in with your new password.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'An error occurred. Please try again.',
        status: 'error', 
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4} align="flex-start" w="full">
          <Heading>Reset Password</Heading>
          <Text>Enter your new password below.</Text>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {!isTokenValid ? (
            <VStack spacing={4} w="full">
              <Alert status="error">
                <AlertIcon />
                This password reset link is invalid or has expired.
              </Alert>
              <Link as={RouterLink} to="/forgot-password" color="blue.500">
                Request a new password reset link
              </Link>
            </VStack>
          ) : (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <FormControl id="password" isRequired isInvalid={passwordError !== ''}>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    />
                  </InputRightElement>
                </InputGroup>
                {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
              </FormControl>

              <FormControl id="confirmPassword" isRequired mt={4} isInvalid={passwordError !== '' && formData.password !== formData.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    />
                  </InputRightElement>
                </InputGroup>
                {passwordError && formData.password !== formData.confirmPassword && 
                  <FormErrorMessage>Passwords do not match</FormErrorMessage>}
              </FormControl>

              <Button
                mt={6}
                colorScheme="blue"
                isLoading={isSubmitting}
                type="submit"
                width="full"
              >
                Reset Password
              </Button>
            </form>
          )}

          <Link as={RouterLink} to="/login" color="blue.500" alignSelf="center" mt={4}>
            Back to Login
          </Link>
        </VStack>
      </Box>
    </Container>
  );
};

export default ResetPassword; 