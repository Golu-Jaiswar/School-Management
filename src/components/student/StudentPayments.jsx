import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Flex,
  Spinner,
  Text,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  Stack,
  Divider
} from '@chakra-ui/react';
import { SearchIcon, DownloadIcon } from '@chakra-ui/icons';

const StudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchText, payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/student/payments');
      setPayments(res.data.data || []);
      setFilteredPayments(res.data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch payments');
      toast({
        title: 'Error fetching payments',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      setLoading(false);
    }
  };

  const filterPayments = () => {
    if (!searchText) {
      setFilteredPayments(payments);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = payments.filter(payment => 
      (payment.fee?.feeType && payment.fee.feeType.toLowerCase().includes(searchLower)) ||
      (payment.paymentMethod && payment.paymentMethod.toLowerCase().includes(searchLower)) ||
      (payment.transactionId && payment.transactionId.toLowerCase().includes(searchLower))
    );
    
    setFilteredPayments(filtered);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate statistics
  const totalPayments = payments.length;
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box width="82%">
      <Heading mb={6}>Payment History</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Card>
          <CardHeader pb={0}>
            <Heading size="sm">Total Paid</Heading>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatNumber>{formatAmount(totalPaid)}</StatNumber>
              <StatLabel>{totalPayments} payments made</StatLabel>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader pb={0}>
            <Heading size="sm">Download Options</Heading>
          </CardHeader>
          <CardBody>
            <Stack direction={{ base: "column", sm: "row" }} spacing={4} width="100%">
              <Button leftIcon={<DownloadIcon />} colorScheme="teal" variant="outline" width={{ base: "100%", sm: "auto" }}>
                Download All Receipts
              </Button>
              <Button leftIcon={<DownloadIcon />} colorScheme="blue" variant="outline" width={{ base: "100%", sm: "auto" }}>
                Payment Statement
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Search */}
      <InputGroup maxW={{ base: "100%", md: "md" }} mb={6}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search payments by fee type, method or transaction ID"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </InputGroup>

      {filteredPayments.length === 0 ? (
        <Text textAlign="center" fontSize="lg" py={10}>
          No payment records found.
        </Text>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <Box display={{ base: "block", md: "none" }}>
            <Stack spacing={4}>
              {filteredPayments.map((payment) => (
                <Card key={payment._id}>
                  <CardBody>
                    <Stack spacing={3}>
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="semibold" textTransform="capitalize">
                          {payment.fee?.feeType || 'Unknown'}
                        </Text>
                        <Text fontWeight="bold">{formatAmount(payment.amount)}</Text>
                      </Flex>
                      <Divider />
                      <Flex justify="space-between">
                        <Text fontSize="sm">Date:</Text>
                        <Text fontSize="sm">{formatDate(payment.paymentDate)}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="sm">Method:</Text>
                        <Text fontSize="sm" textTransform="capitalize">
                          {payment.paymentMethod?.replace('_', ' ')}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="sm">Transaction ID:</Text>
                        <Text fontSize="sm" fontFamily="monospace">
                          {payment.transactionId || 'N/A'}
                        </Text>
                      </Flex>
                      <Button
                        as={RouterLink}
                        to={`/student/payments/${payment._id}/receipt`}
                        colorScheme="blue"
                        size="sm"
                        leftIcon={<DownloadIcon />}
                        mt={2}
                      >
                        View Receipt
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Desktop View - Table */}
          <Box display={{ base: "none", md: "block" }} overflowX="auto" width="100%">
            <Table variant="simple" width="100%">
              <Thead>
                <Tr>
                  <Th>Fee Type</Th>
                  <Th isNumeric>Amount</Th>
                  <Th>Payment Date</Th>
                  <Th>Payment Method</Th>
                  <Th>Transaction ID</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPayments.map((payment) => (
                  <Tr key={payment._id}>
                    <Td>
                      <Text fontWeight="semibold" textTransform="capitalize">
                        {payment.fee?.feeType || 'Unknown'}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {payment.fee?.description}
                      </Text>
                    </Td>
                    <Td isNumeric>{formatAmount(payment.amount)}</Td>
                    <Td>{formatDate(payment.paymentDate)}</Td>
                    <Td textTransform="capitalize">
                      {payment.paymentMethod?.replace('_', ' ')}
                    </Td>
                    <Td>
                      <Text fontSize="sm" fontFamily="monospace">
                        {payment.transactionId || 'N/A'}
                      </Text>
                    </Td>
                    <Td>
                      <Button
                        as={RouterLink}
                        to={`/student/payments/${payment._id}/receipt`}
                        colorScheme="blue"
                        size="sm"
                        leftIcon={<DownloadIcon />}
                      >
                        Receipt
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
};

export default StudentPayments; 