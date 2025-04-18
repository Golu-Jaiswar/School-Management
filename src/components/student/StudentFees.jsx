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
  Select,
  Stack,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Divider
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [semesterFilter, setASemesterFilter] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchFees();
  }, []);

  useEffect(() => {
    filterFees();
  }, [searchText, statusFilter, semesterFilter, fees]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/student/fees');
      setFees(res.data.data || []);
      setFilteredFees(res.data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch fees');
      toast({
        title: 'Error fetching fees',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      setLoading(false);
    }
  };

  const filterFees = () => {
    let result = [...fees];

    // Search text filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(fee => 
        (fee.feeType && fee.feeType.toLowerCase().includes(searchLower)) ||
        (fee.description && fee.description.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter(fee => fee.status === statusFilter);
    }

    // Semester filter
    if (semesterFilter) {
      result = result.filter(fee => fee.semester === parseInt(semesterFilter));
    }

    setFilteredFees(result);
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

  const getStatusBadge = (status, dueDate) => {
    const today = new Date();
    const dueDateObj = new Date(dueDate);
    
    if (status === 'paid') {
      return <Badge colorScheme="green">Paid</Badge>;
    } else if (status === 'partial') {
      return <Badge colorScheme="yellow">Partial</Badge>;
    } else if (dueDateObj < today) {
      return <Badge colorScheme="red">Overdue</Badge>;
    } else {
      return <Badge colorScheme="orange">Pending</Badge>;
    }
  };

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
    <Box width="100%">
      <Heading mb={6}>My Fees</Heading>

      {/* Filters */}
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={6}>
        <InputGroup maxW={{ base: '100%', md: '300px' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by fee type or description"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </InputGroup>

        <Select
          placeholder="All Statuses"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          maxW={{ base: '100%', md: '200px' }}
        >
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
        </Select>

        <Select
          placeholder="All Semesters"
          value={semesterFilter}
          onChange={(e) => setASemesterFilter(e.target.value)}
          maxW={{ base: '100%', md: '200px' }}
        >
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
        </Select>
      </Stack>

      {filteredFees.length === 0 ? (
        <Text textAlign="center" fontSize="lg" py={10}>
          No fee records found.
        </Text>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <Box display={{ base: "block", md: "none" }}>
            <Stack spacing={4}>
              {filteredFees.map((fee) => (
                <Card key={fee._id}>
                  <CardBody>
                    <Stack spacing={3}>
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="semibold" textTransform="capitalize">{fee.feeType}</Text>
                        <Text fontWeight="bold">{formatAmount(fee.amount)}</Text>
                      </Flex>
                      {fee.description && (
                        <Text fontSize="sm" color="gray.600">{fee.description}</Text>
                      )}
                      <Divider />
                      <Flex justify="space-between">
                        <Text fontSize="sm">Semester:</Text>
                        <Text fontSize="sm">{fee.semester}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="sm">Due Date:</Text>
                        <Text fontSize="sm">{formatDate(fee.dueDate)}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="sm">Status:</Text>
                        {getStatusBadge(fee.status, fee.dueDate)}
                      </Flex>
                      <Box mt={2}>
                        <Button
                          as={RouterLink}
                          to={`/student/fees/${fee._id}/pay`}
                          colorScheme="blue"
                          size="sm"
                          width="100%"
                        >
                          Pay Now
                        </Button>
                        {fee.status === 'paid' && (
                          <Button
                            as={RouterLink}
                            to={`/student/payments/${fee.payment}/receipt`}
                            variant="outline"
                            colorScheme="green"
                            size="sm"
                            width="100%"
                            mt={2}
                          >
                            View Receipt
                          </Button>
                        )}
                      </Box>
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
                  <Th>Semester</Th>
                  <Th>Due Date</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredFees.map((fee) => (
                  <Tr key={fee._id}>
                    <Td>
                      <Text fontWeight="semibold" textTransform="capitalize">{fee.feeType}</Text>
                      {fee.description && (
                        <Text fontSize="sm" color="gray.600">{fee.description}</Text>
                      )}
                    </Td>
                    <Td isNumeric>{formatAmount(fee.amount)}</Td>
                    <Td>{fee.semester}</Td>
                    <Td>{formatDate(fee.dueDate)}</Td>
                    <Td>{getStatusBadge(fee.status, fee.dueDate)}</Td>
                    <Td>
                      <Button
                        as={RouterLink}
                        to={`/student/fees/${fee._id}/pay`}
                        colorScheme="blue"
                        size="sm"
                      >
                        Pay
                      </Button>
                      {fee.status === 'paid' && (
                        <Button
                          as={RouterLink}
                          to={`/student/payments/${fee.payment}/receipt`}
                          variant="outline"
                          colorScheme="green"
                          size="sm"
                          ml={2}
                        >
                          Receipt
                        </Button>
                      )}
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

export default StudentFees; 