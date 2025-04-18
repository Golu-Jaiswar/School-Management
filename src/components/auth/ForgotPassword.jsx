import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Flex,
  Link,
  useToast
} from '@chakra-ui/react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await axios.post('/auth/forgot-password', { email });
      setIsSuccess(true);
      toast({
        title: 'Reset email sent',
        description: 'Check your email for password reset instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
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
          <Heading>Forgot Password</Heading>
          <Text>Enter your email address to receive a password reset link.</Text>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {isSuccess ? (
            <Alert status="success">
              <AlertIcon />
              We've sent a password reset link to your email address.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </FormControl>

              <Button
                mt={4}
                colorScheme="blue"
                isLoading={isSubmitting}
                type="submit"
                width="full"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <Flex justifyContent="space-between" width="full" pt={4}>
            <Link as={RouterLink} to="/login" color="blue.500">
              Back to login
            </Link>
            <Link as={RouterLink} to="/register" color="blue.500">
              Create an account
            </Link>
          </Flex>
        </VStack>
      </Box>
    </Container>
  );
};

export default ForgotPassword; 