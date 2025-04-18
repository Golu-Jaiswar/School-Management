import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Heading,
  Text,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Flex,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Spinner,
  Select,
  HStack,
  Stack,
  Card,
  CardBody,
  Divider
} from '@chakra-ui/react';
import { SearchIcon, DeleteIcon, ViewIcon, AddIcon } from '@chakra-ui/icons';

const Fees = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [feeTypeFilter, setFeeTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // For delete confirmation
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [feeToDelete, setFeeToDelete] = useState(null);
  
  useEffect(() => {
    fetchFees();
  }, []);
  
  useEffect(() => {
    filterFees();
  }, [searchText, fees, feeTypeFilter, statusFilter]);
  
  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/fees');
      setFees(res.data.data);
      setFilteredFees(res.data.data);
    } catch (err) {
      toast({
        title: 'Error fetching fees',
        description: err.response?.data?.error || 'Failed to load fees data',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filterFees = () => {
    let result = [...fees];
    
    // Apply search text filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        fee => 
          fee.student?.name?.toLowerCase().includes(searchLower) || 
          fee.student?.registrationNumber?.toLowerCase().includes(searchLower) ||
          (fee.feeType?.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply fee type filter
    if (feeTypeFilter) {
      result = result.filter(fee => fee.feeType === feeTypeFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      if (statusFilter === 'paid') {
        result = result.filter(fee => fee.isPaid);
      } else if (statusFilter === 'unpaid') {
        result = result.filter(fee => !fee.isPaid);
      } else if (statusFilter === 'overdue') {
        const today = new Date();
        result = result.filter(fee => !fee.isPaid && new Date(fee.dueDate) < today);
      }
    }
    
    setFilteredFees(result);
  };
  
  const handleSearch = e => {
    setSearchText(e.target.value);
  };
  
  const handleDeleteClick = (fee) => {
    setFeeToDelete(fee);
    onOpen();
  };
  
  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/fees/${feeToDelete._id}`);
      
      toast({
        title: 'Fee deleted successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      
      // Refresh the list
      fetchFees();
      onClose();
    } catch (err) {
      toast({
        title: 'Error deleting fee',
        description: err.response?.data?.error || 'Failed to delete fee',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  const getStatusBadge = (fee) => {
    const today = new Date();
    const dueDate = new Date(fee.dueDate);
    
    if (fee.isPaid) {
      return <Badge colorScheme="green">Paid</Badge>;
    } else if (dueDate < today) {
      return <Badge colorScheme="red">Overdue</Badge>;
    } else {
      return <Badge colorScheme="yellow">Pending</Badge>;
    }
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
  
  if (loading) {
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }
  
  return (
    <Box width="100%">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Fee Records</Heading>
        <Button
          as={RouterLink}
          to="/admin/fees/create"
          colorScheme="blue"
          leftIcon={<AddIcon />}
        >
          Create New Fee
        </Button>
      </Flex>
      
      {/* Filters */}
      <Flex 
        mb={6} 
        direction={{ base: 'column', md: 'row' }}
        gap={3}
        alignItems={{ base: 'stretch', md: 'center' }}
      >
        <InputGroup maxW={{ base: '100%', md: '300px' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search student, fee type or ID"
            value={searchText}
            onChange={handleSearch}
          />
        </InputGroup>
        
        <Select
          placeholder="Filter by Fee Type"
          value={feeTypeFilter}
          onChange={e => setFeeTypeFilter(e.target.value)}
          maxW={{ base: '100%', md: '200px' }}
        >
          <option value="tuition">Tuition Fee</option>
          <option value="hostel">Hostel Fee</option>
          <option value="transport">Transport Fee</option>
          <option value="examination">Examination Fee</option>
          <option value="other">Other Fee</option>
        </Select>
        
        <Select
          placeholder="Filter by Status"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          maxW={{ base: '100%', md: '200px' }}
        >
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="overdue">Overdue</option>
        </Select>
      </Flex>
      
      {/* Mobile View - Cards */}
      <Box display={{ base: "block", md: "none" }}>
        <Stack spacing={4}>
          {filteredFees.length === 0 ? (
            <Text textAlign="center" fontSize="lg" py={6}>
              No fees found
            </Text>
          ) : (
            filteredFees.map(fee => (
              <Card key={fee._id}>
                <CardBody>
                  <Stack spacing={3}>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="bold" textTransform="capitalize">{fee.feeType}</Text>
                      {getStatusBadge(fee)}
                    </Flex>
                    
                    <Text fontWeight="bold" fontSize="xl" textAlign="right">
                      {formatAmount(fee.amount)}
                    </Text>
                    
                    <Divider />
                    
                    <Flex justify="space-between">
                      <Text fontSize="sm" fontWeight="medium">Student:</Text>
                      <Text fontSize="sm">{fee.student?.name || 'Unknown'}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontSize="sm" fontWeight="medium">Registration:</Text>
                      <Text fontSize="sm">{fee.student?.registrationNumber || 'N/A'}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontSize="sm" fontWeight="medium">Due Date:</Text>
                      <Text fontSize="sm">{formatDate(fee.dueDate)}</Text>
                    </Flex>
                    
                    <HStack spacing={2} mt={2}>
                      <Button
                        as={RouterLink}
                        to={`/admin/fees/${fee._id}`}
                        colorScheme="blue"
                        size="sm"
                        flex={1}
                      >
                        View
                      </Button>
                      
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteClick(fee)}
                        flex={1}
                      >
                        Delete
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
              <Th isNumeric>Amount</Th>
              <Th>Due Date</Th>
              <Th>Status</Th>
              <Th width="100px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredFees.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center" py={6}>
                  <Text fontSize="lg">No fees found</Text>
                </Td>
              </Tr>
            ) : (
              filteredFees.map(fee => (
                <Tr key={fee._id}>
                  <Td>
                    <Text fontWeight="medium">{fee.student?.name || 'Unknown'}</Text>
                    <Text fontSize="sm" color="gray.600">{fee.student?.registrationNumber || 'No ID'}</Text>
                  </Td>
                  <Td textTransform="capitalize">{fee.feeType}</Td>
                  <Td isNumeric fontWeight="semibold">
                    {formatAmount(fee.amount)}
                  </Td>
                  <Td>{formatDate(fee.dueDate)}</Td>
                  <Td>{getStatusBadge(fee)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="View fee details"
                        icon={<ViewIcon />}
                        as={RouterLink}
                        to={`/admin/fees/${fee._id}`}
                        size="sm"
                        colorScheme="blue"
                      />
                      <IconButton
                        aria-label="Delete fee"
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(fee)}
                        size="sm"
                        colorScheme="red"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
      
      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Fee
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this fee? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Fees; 