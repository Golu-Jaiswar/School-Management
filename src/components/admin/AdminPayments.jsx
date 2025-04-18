import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Spinner,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  SimpleGrid,
  useColorModeValue,
  VStack,
  Divider
} from '@chakra-ui/react';
import { SearchIcon, DownloadIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaEye, FaDownload, FaCheck, FaTimes } from 'react-icons/fa';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchText, statusFilter, paymentMethodFilter, dateFilter, payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/payments');
      setPayments(res.data.data);
      setFilteredPayments(res.data.data);
      setLoading(false);
    } catch (err) {
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
    let result = [...payments];
    
    // Apply search filter
    if (searchText) {
      const lowercaseSearch = searchText.toLowerCase();
      result = result.filter(payment => 
        (payment.student?.name && payment.student.name.toLowerCase().includes(lowercaseSearch)) ||
        (payment.student?.email && payment.student.email.toLowerCase().includes(lowercaseSearch)) ||
        (payment.transactionId && payment.transactionId.toLowerCase().includes(lowercaseSearch)) ||
        (payment.fee?.feeType && payment.fee.feeType.toLowerCase().includes(lowercaseSearch))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(payment => payment.status === statusFilter);
    }
    
    // Apply payment method filter
    if (paymentMethodFilter) {
      result = result.filter(payment => payment.paymentMethod === paymentMethodFilter);
    }
    
    // Apply date filter (this week, this month, etc.)
    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (dateFilter === 'today') {
        result = result.filter(payment => {
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate >= today;
        });
      } else if (dateFilter === 'thisWeek') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        result = result.filter(payment => {
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate >= startOfWeek;
        });
      } else if (dateFilter === 'thisMonth') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        result = result.filter(payment => {
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate >= startOfMonth;
        });
      }
    }
    
    setFilteredPayments(result);
  };

  const approvePayment = async (id) => {
    try {
      await axios.put(`/admin/payments/${id}/approve`);
      
      toast({
        title: 'Payment approved',
        description: 'The payment has been approved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Refresh the list
      fetchPayments();
    } catch (err) {
      toast({
        title: 'Error approving payment',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const rejectPayment = async (id) => {
    try {
      await axios.put(`/admin/payments/${id}/reject`);
      
      toast({
        title: 'Payment rejected',
        description: 'The payment has been rejected',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Refresh the list
      fetchPayments();
    } catch (err) {
      toast({
        title: 'Error rejecting payment',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const downloadReceipt = (id) => {
    window.open(`/student/payments/${id}/receipt`, '_blank');
  };
  
  const downloadAllReceipts = () => {
    toast({
      title: 'Downloading all receipts',
      description: 'All receipts are being prepared for download',
      status: 'info',
      duration: 3000,
      isClosable: true
    });
  };
  
  const generateReport = () => {
    toast({
      title: 'Generating report',
      description: 'The payment report is being generated',
      status: 'info',
      duration: 3000,
      isClosable: true
    });
  };

  // Calculate statistics
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPayments = filteredPayments.length;
  const pendingPayments = filteredPayments.filter(payment => payment.status === 'pending').length;
  const approvedPayments = filteredPayments.filter(payment => payment.status === 'approved').length;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get unique payment methods for filter
  const uniquePaymentMethods = [...new Set(payments.map(payment => payment.paymentMethod))].filter(Boolean);

  return (
    <Box width="84%">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Payment Management</Heading>
        <HStack>
          <Button
            leftIcon={<DownloadIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={downloadAllReceipts}
          >
            Download All Receipts
          </Button>
          <Button
            leftIcon={<DownloadIcon />}
            colorScheme="blue"
            onClick={generateReport}
          >
            Generate Report
          </Button>
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Total Amount</StatLabel>
              <StatNumber>{formatAmount(totalAmount)}</StatNumber>
              <StatHelpText>{totalPayments} payments</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Approved Payments</StatLabel>
              <StatNumber>{approvedPayments}</StatNumber>
              <StatHelpText color="green.500">
                {totalPayments > 0 ? ((approvedPayments / totalPayments) * 100).toFixed(1) : 0}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Pending Payments</StatLabel>
              <StatNumber>{pendingPayments}</StatNumber>
              <StatHelpText color="orange.500">
                {totalPayments > 0 ? ((pendingPayments / totalPayments) * 100).toFixed(1) : 0}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Average Payment</StatLabel>
              <StatNumber>
                {totalPayments > 0 ? formatAmount(totalAmount / totalPayments) : formatAmount(0)}
              </StatNumber>
              <StatHelpText>Per transaction</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={6}>
        <InputGroup maxW={{ base: '100%', md: '300px' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by student, fee type or transaction ID"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </InputGroup>
        
        <Select
          placeholder="All Statuses"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          maxW={{ base: '100%', md: '150px' }}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
        
        <Select
          placeholder="All Payment Methods"
          value={paymentMethodFilter}
          onChange={e => setPaymentMethodFilter(e.target.value)}
          maxW={{ base: '100%', md: '200px' }}
        >
          {uniquePaymentMethods.map(method => (
            <option key={method} value={method}>
              {method.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </Select>
        
        <Select
          placeholder="All Dates"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          maxW={{ base: '100%', md: '150px' }}
        >
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
        </Select>
      </Stack>

      {loading ? (
        <Flex justify="center" my={10}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <Box display={{ base: "block", md: "none" }}>
            <Stack spacing={4}>
              {filteredPayments.length === 0 ? (
                <Text textAlign="center" fontSize="lg" py={6}>
                  No payments found
                </Text>
              ) : (
                filteredPayments.map(payment => (
                  <Card key={payment._id}>
                    <CardBody>
                      <Stack spacing={3}>
                        <Flex justify="space-between" align="center">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" textTransform="capitalize">
                              {payment.fee?.feeType || 'Unknown'}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {payment.student?.name || 'Unknown Student'}
                            </Text>
                          </VStack>
                          <Badge
                            colorScheme={
                              payment.status === 'approved' ? 'green' :
                              payment.status === 'rejected' ? 'red' : 'yellow'
                            }
                          >
                            {payment.status}
                          </Badge>
                        </Flex>
                        
                        <Text fontWeight="bold" fontSize="xl" textAlign="right">
                          {formatAmount(payment.amount)}
                        </Text>
                        
                        <Divider />
                        
                        <Flex justify="space-between">
                          <Text fontSize="sm" fontWeight="medium">Date:</Text>
                          <Text fontSize="sm">{formatDate(payment.paymentDate)}</Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontSize="sm" fontWeight="medium">Method:</Text>
                          <Text fontSize="sm" textTransform="capitalize">
                            {payment.paymentMethod?.replace('_', ' ') || 'Unknown'}
                          </Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontSize="sm" fontWeight="medium">Transaction ID:</Text>
                          <Text fontSize="sm" fontFamily="monospace">
                            {payment.transactionId || 'N/A'}
                          </Text>
                        </Flex>
                        
                        <HStack spacing={2} mt={2}>
                          <Button
                            as={RouterLink}
                            to={`/admin/payments/${payment._id}`}
                            colorScheme="blue"
                            size="sm"
                            flex={1}
                          >
                            View
                          </Button>
                          
                          {payment.status === 'pending' && (
                            <>
                              <Button
                                colorScheme="green"
                                size="sm"
                                onClick={() => approvePayment(payment._id)}
                                flex={1}
                              >
                                Approve
                              </Button>
                              <Button
                                colorScheme="red"
                                size="sm"
                                onClick={() => rejectPayment(payment._id)}
                                flex={1}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          
                          <Button
                            colorScheme="teal"
                            size="sm"
                            onClick={() => downloadReceipt(payment._id)}
                            flex={1}
                          >
                            Receipt
                          </Button>
                        </HStack>
                      </Stack>
                    </CardBody>
                  </Card>
                ))
              )}
            </Stack>
          </Box>

          {/* Desktop View - Table */}
          <Box display={{ base: "none", md: "block" }} overflowX="auto" width="100%">
            <Table variant="simple" width="100%">
              <Thead>
                <Tr>
                  <Th>Student</Th>
                  <Th>Fee Type</Th>
                  <Th>Amount</Th>
                  <Th>Payment Method</Th>
                  <Th>Transaction ID</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th width="100px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPayments.length === 0 ? (
                  <Tr>
                    <Td colSpan={8} textAlign="center" py={6}>
                      <Text fontSize="lg">No payments found</Text>
                    </Td>
                  </Tr>
                ) : (
                  filteredPayments.map(payment => (
                    <Tr key={payment._id}>
                      <Td>
                        <Text fontWeight="medium">{payment.student?.name || 'Unknown'}</Text>
                        <Text fontSize="sm" color="gray.600">{payment.student?.email || 'No email'}</Text>
                      </Td>
                      <Td>{payment.fee?.feeType || 'Unknown'}</Td>
                      <Td isNumeric fontWeight="semibold">
                        {formatAmount(payment.amount)}
                      </Td>
                      <Td textTransform="capitalize">
                        {payment.paymentMethod?.replace('_', ' ') || 'Unknown'}
                      </Td>
                      <Td>
                        <Text fontSize="sm" fontFamily="monospace">
                          {payment.transactionId || 'N/A'}
                        </Text>
                      </Td>
                      <Td>{formatDate(payment.paymentDate)}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            payment.status === 'approved' ? 'green' :
                            payment.status === 'rejected' ? 'red' : 'yellow'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label='Actions'
                            icon={<ChevronDownIcon />}
                            variant="outline"
                            size="sm"
                          />
                          <MenuList>
                            <MenuItem 
                              icon={<FaEye />}
                              as={RouterLink}
                              to={`/admin/payments/${payment._id}`}
                            >
                              View Details
                            </MenuItem>
                            <MenuItem 
                              icon={<FaDownload />}
                              onClick={() => downloadReceipt(payment._id)}
                            >
                              Download Receipt
                            </MenuItem>
                            {payment.status === 'pending' && (
                              <>
                                <MenuItem 
                                  icon={<FaCheck />} 
                                  color="green.500"
                                  onClick={() => approvePayment(payment._id)}
                                >
                                  Approve
                                </MenuItem>
                                <MenuItem 
                                  icon={<FaTimes />} 
                                  color="red.500"
                                  onClick={() => rejectPayment(payment._id)}
                                >
                                  Reject
                                </MenuItem>
                              </>
                            )}
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminPayments; 