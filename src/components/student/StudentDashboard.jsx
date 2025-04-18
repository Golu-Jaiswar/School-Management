import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Button,
  Badge,
  useToast,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Divider,
  Spinner,
  Container
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch fees
        const feesRes = await axios.get('/student/fees');
        setFees(feesRes.data.data);
        
        // Fetch payments
        const paymentsRes = await axios.get('/student/payments');
        setPayments(paymentsRes.data.data);
        
        setLoading(false);
      } catch (err) {
        toast({
          title: 'Error fetching data',
          description: err.response?.data?.error || 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Calculate statistics
  const totalFees = fees.reduce((acc, fee) => acc + fee.amount, 0);
  const totalPaid = payments.reduce((acc, payment) => acc + payment.amount, 0);
  const totalPending = totalFees - totalPaid;
  
  const pendingFees = fees.filter(fee => fee.status === 'pending');
  const recentPayments = payments.slice(0, 3); // Get 3 most recent payments

  return (
    <Box width="100%">
      <Heading mb={6}>Dashboard</Heading>
      
      {loading ? (
        <Flex justify="center" my={10}>
          <Spinner size="xl" />
        </Flex>
      ) : (
      <Box width="100%">
        <Heading as="h1" size="xl" mb={6}>
          Welcome, {user?.name}
        </Heading>
        
        <StatGroup mb={8} gap={4} width="100%">
          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="md" bg="white">
            <StatLabel>Total Fees</StatLabel>
            <StatNumber>₹{totalFees.toFixed(2)}</StatNumber>
          </Stat>
          
          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="md" bg="white">
            <StatLabel>Total Paid</StatLabel>
            <StatNumber>₹{totalPaid.toFixed(2)}</StatNumber>
          </Stat>
          
          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="md" bg="white">
            <StatLabel>Pending Amount</StatLabel>
            <StatNumber>₹{totalPending.toFixed(2)}</StatNumber>
          </Stat>
        </StatGroup>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={10} width="100%">
          <Box width="100%">
            <Heading as="h3" size="md" mb={4}>
              Pending Fees
            </Heading>
            
            {pendingFees.length === 0 ? (
              <Text>No pending fees.</Text>
            ) : (
              <SimpleGrid columns={1} spacing={4} width="100%">
                {pendingFees.map(fee => (
                  <Card key={fee._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%">
                    <CardHeader pb={0}>
                      <Flex justify="space-between" align="center">
                        <Heading size="sm">{fee.feeType}</Heading>
                        <Badge colorScheme={
                          fee.status === 'paid' ? 'green' : 
                          fee.status === 'partial' ? 'yellow' : 'red'
                        }>
                          {fee.status}
                        </Badge>
                      </Flex>
                    </CardHeader>
                    
                    <CardBody py={2}>
                      <Text fontSize="xl" fontWeight="bold">₹{fee.amount}</Text>
                      <Text fontSize="sm">Semester: {fee.semester}</Text>
                      <Text fontSize="sm">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</Text>
                    </CardBody>
                    
                    <CardFooter pt={0}>
                      <Button 
                        as={RouterLink}
                        to={`/student/fees/${fee._id}/pay`}
                        colorScheme="blue" 
                        size="sm"
                      >
                        Pay Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            )}
            
            <Button 
              as={RouterLink}
              to="/student/fees"
              mt={4}
              variant="outline"
              colorScheme="blue"
            >
              View All Fees
            </Button>
          </Box>
          
          <Box width="100%">
            <Heading as="h3" size="md" mb={4}>
              Recent Payments
            </Heading>
            
            {recentPayments.length === 0 ? (
              <Text>No payment history.</Text>
            ) : (
              <SimpleGrid columns={1} spacing={4} width="100%">
                {recentPayments.map(payment => (
                  <Card key={payment._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%">
                    <CardHeader pb={0}>
                      <Flex justify="space-between" align="center">
                        <Heading size="sm">{payment.fee?.feeType || 'Fee'}</Heading>
                        <Badge colorScheme="green">
                          {payment.status}
                        </Badge>
                      </Flex>
                    </CardHeader>
                    
                    <CardBody py={2}>
                      <Text fontSize="xl" fontWeight="bold">₹{payment.amount}</Text>
                      <Text fontSize="sm">Date: {new Date(payment.paymentDate).toLocaleDateString()}</Text>
                      <Text fontSize="sm">Method: {payment.paymentMethod}</Text>
                    </CardBody>
                    
                    <CardFooter pt={0}>
                      <Button 
                        as={RouterLink}
                        to={`/student/payments/${payment._id}/receipt`}
                        colorScheme="blue" 
                        size="sm"
                        variant="outline"
                      >
                        View Receipt
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            )}
            
            <Button 
              as={RouterLink}
              to="/student/payments"
              mt={4}
              variant="outline"
              colorScheme="blue"
            >
              View Payment History
            </Button>
          </Box>
        </SimpleGrid>
      </Box>
      )}
    </Box>
  );
};

export default StudentDashboard; 