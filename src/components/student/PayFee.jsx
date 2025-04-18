import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Text,
  Stack,
  Card,
  CardHeader,
  CardBody,
  Alert,
  AlertIcon,
  Divider,
  useToast,
  Center,
  VStack,
  HStack,
  Image,
  Container,
  Flex,
  Spinner,
  Code
} from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { useAuth } from '../../context/AuthContext';
import PaymentModel from '../3d/PaymentModel';

// Handle missing ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.FallbackComponent ? 
        this.props.FallbackComponent({ error: this.state.error }) : 
        <Box p={4} bg="red.100" color="red.800" borderRadius="md">
          <Text>Something went wrong.</Text>
        </Box>;
    }

    return this.props.children;
  }
}

const PayFee = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'credit_card',
    transactionId: ''
  });
  
  useEffect(() => {
    document.title = "Pay Fee";
    console.log("PayFee component mounted with ID:", id);
    console.log("Current user:", user);
    console.log("Current API headers:", axios.defaults.headers.common);

    const fetchFee = async () => {
      try {
        setLoading(true);
        console.log(`Fetching fee with ID: ${id}`);
        // Display API URL being called
        const apiUrl = `/student/fees/${id}`;
        console.log(`API URL: ${apiUrl}`);

        const res = await axios.get(apiUrl);
        console.log("Fee data received:", res.data);
        setFee(res.data.data);
        setPaymentData(prev => ({
          ...prev,
          amount: res.data.data.amount
        }));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching fee details:", err);
        console.error("Response data:", err.response?.data);
        setError(err.response?.data?.error || 'Failed to fetch fee details');
        setLoading(false);
      }
    };

    if (id) {
      fetchFee();
    } else {
      console.error("No fee ID provided");
      setError("No fee ID provided");
      setLoading(false);
    }
  }, [id, user]);

  const handleChange = (e) => {
    console.log(`Updating ${e.target.name} to ${e.target.value}`);
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.name === 'amount' ? parseFloat(e.target.value) : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting payment data:", paymentData);
    setPaymentLoading(true);

    try {
      const response = await axios.post(`/student/fees/${id}/pay`, paymentData);
      console.log("Payment response:", response.data);
      const paymentId = response.data.data._id;
      
      toast({
        title: 'Payment successful',
        description: 'Your fee payment has been processed successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      navigate(`/student/payments/${paymentId}/receipt`);
    } catch (err) {
      console.error("Payment error:", err);
      console.error("Response data:", err.response?.data);
      toast({
        title: 'Payment failed',
        description: err.response?.data?.error || 'An error occurred during payment',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  // Add a fallback component for when WebGL errors occur
  const FallbackComponent = ({ error }) => {
    return (
      <Box 
        height="300px"
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        flexDirection="column"
        bg="gray.50"
        borderRadius="md"
        p={6}
      >
        <Heading size="md" mb={4} color="red.500">3D Visualization Error</Heading>
        <Text textAlign="center">
          We couldn't load the 3D visualization due to a WebGL error.
          <br />
          Please try refreshing the page or using a different browser.
        </Text>
      </Box>
    );
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="50vh" direction="column">
        <Spinner size="xl" mb={4} />
        <Text>Loading fee details...</Text>
        <Text fontSize="sm" color="gray.500">Fee ID: {id}</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Box width="100%">
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
        
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Troubleshooting Information</Heading>
            <Stack spacing={3}>
              <Box>
                <Text fontWeight="bold">Fee ID:</Text>
                <Code>{id || 'Not provided'}</Code>
              </Box>
              <Box>
                <Text fontWeight="bold">User Role:</Text>
                <Code>{user?.role || 'Not authenticated'}</Code>
              </Box>
              <Box>
                <Text fontWeight="bold">API Endpoint:</Text>
                <Code>{`${axios.defaults.baseURL}/student/fees/${id}`}</Code>
              </Box>
              <Divider my={3} />
              <Box>
                <Button as={RouterLink} to="/student/fees" colorScheme="blue">
                  Return to Fees Page
                </Button>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    );
  }

  // Add fallback if fee data wasn't loaded
  if (!fee) {
    return (
      <Box width="100%">
        <Alert status="warning" mb={6}>
          <AlertIcon />
          No fee data was found for ID: {id}
        </Alert>
        
        <Card>
          <CardBody>
            <VStack spacing={4} align="center">
              <Heading size="md">Fee Not Found</Heading>
              <Text>We couldn't find the fee you're looking for. It may have been removed or paid already.</Text>
              <Button as={RouterLink} to="/student/fees" colorScheme="blue">
                View All Fees
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <Box width="100%">
      <Heading mb={6}>Pay Fee</Heading>
      
      <Stack direction={{ base: 'column', lg: 'row' }} spacing={{ base: 6, lg: 10 }} align="flex-start">
        <Box flex="1" w={{ base: "100%", lg: "50%" }}>
          <Card mb={6}>
            <CardHeader>
              <Heading size="md">Fee Details</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <HStack justifyContent="space-between">
                  <Text fontWeight="bold">Fee Type:</Text>
                  <Text textTransform="capitalize">{fee.feeType}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text fontWeight="bold">Semester:</Text>
                  <Text>{fee.semester}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text fontWeight="bold">Amount:</Text>
                  <Text>₹{fee.amount.toFixed(2)}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text fontWeight="bold">Due Date:</Text>
                  <Text>{new Date(fee.dueDate).toLocaleDateString()}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text fontWeight="bold">Status:</Text>
                  <Text color={fee.status === 'paid' ? 'green.500' : 'orange.500'}>
                    {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                  </Text>
                </HStack>
                {fee.description && (
                  <>
                    <Divider />
                    <Box>
                      <Text fontWeight="bold" mb={1}>Description:</Text>
                      <Text>{fee.description}</Text>
                    </Box>
                  </>
                )}
              </Stack>
            </CardBody>
          </Card>
          
          {/* Don't show payment form if already paid */}
          {fee.status === 'paid' ? (
            <Card>
              <CardBody>
                <Alert status="success">
                  <AlertIcon />
                  This fee has already been paid.
                </Alert>
                <Button 
                  mt={4} 
                  as={RouterLink} 
                  to={`/student/payments/${fee.payment}/receipt`}
                  colorScheme="green"
                  width="100%"
                >
                  View Receipt
                </Button>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <Heading size="md">Payment Form</Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <FormControl id="amount" isRequired>
                      <FormLabel>Amount (₹)</FormLabel>
                      <Input
                        type="number"
                        name="amount"
                        value={paymentData.amount}
                        onChange={handleChange}
                        min={1}
                        max={fee.amount}
                      />
                    </FormControl>
                    
                    <FormControl id="paymentMethod" isRequired>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        name="paymentMethod"
                        value={paymentData.paymentMethod}
                        onChange={handleChange}
                      >
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="net_banking">Net Banking</option>
                        <option value="upi">UPI</option>
                        <option value="wallet">Wallet</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl id="transactionId">
                      <FormLabel>Transaction ID (Optional)</FormLabel>
                      <Input
                        name="transactionId"
                        value={paymentData.transactionId}
                        onChange={handleChange}
                        placeholder="For your reference"
                      />
                    </FormControl>
                    
                    <Button
                      mt={4}
                      colorScheme="blue"
                      type="submit"
                      isLoading={paymentLoading}
                      loadingText="Processing Payment"
                      width="100%"
                      size="lg"
                      py={6}
                    >
                      Pay Now
                    </Button>
                  </Stack>
                </form>
              </CardBody>
            </Card>
          )}
        </Box>
        
        <Box flex="1" w={{ base: "100%", lg: "50%" }}>
          {/* Hide 3D model on smaller screens for better performance */}
          <Box display={{ base: "none", md: "block" }} h="400px">
            <Center h="100%">
              <ErrorBoundary FallbackComponent={FallbackComponent}>
                <Canvas 
                  camera={{ position: [0, 0, 10], fov: 50 }} 
                  gl={{ 
                    preserveDrawingBuffer: true, 
                    antialias: true,
                    powerPreference: 'high-performance',
                    failIfMajorPerformanceCaveat: false
                  }}
                  onCreated={({ gl }) => {
                    gl.setClearColor('#f7fafc', 1);
                  }}
                >
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <PaymentModel />
                </Canvas>
              </ErrorBoundary>
            </Center>
          </Box>
          
          {/* Show payment information on mobile */}
          <Box display={{ base: "block", md: "none" }} 
               p={6} 
               border="1px"
               borderColor="gray.200"
               borderRadius="md"
               bg="gray.50"
               mb={4}
          >
            <VStack align="center" spacing={4}>
              <Heading size="sm" textAlign="center">Secure Payment Processing</Heading>
              <Text textAlign="center" fontSize="sm">
                Your payment information is encrypted and secure. We accept multiple payment methods for your convenience.
              </Text>
            </VStack>
          </Box>
          
          <VStack mt={4} spacing={4} align="stretch">
            <Card>
              <CardBody>
                <VStack spacing={4}>
                  <Text fontSize="md" fontWeight="bold" textAlign="center">
                    Accepted Payment Methods
                  </Text>
                  <HStack justify="center" spacing={6} wrap="wrap">
                    <Image 
                      src="https://cdn-icons-png.flaticon.com/512/349/349221.png" 
                      alt="Visa" 
                      boxSize="40px"
                      objectFit="contain"
                    />
                    <Image 
                      src="https://cdn-icons-png.flaticon.com/512/349/349228.png" 
                      alt="MasterCard" 
                      boxSize="40px"
                      objectFit="contain"
                    />
                    <Image 
                      src="https://cdn-icons-png.flaticon.com/512/825/825464.png" 
                      alt="UPI" 
                      boxSize="40px"
                      objectFit="contain"
                    />
                    <Image 
                      src="https://cdn-icons-png.flaticon.com/512/1933/1933844.png" 
                      alt="Net Banking" 
                      boxSize="40px"
                      objectFit="contain"
                    />
                  </HStack>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    All payments are secured and encrypted
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Box>
      </Stack>
    </Box>
  );
};

export default PayFee; 