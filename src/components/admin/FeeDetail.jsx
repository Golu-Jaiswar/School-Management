import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  Stack,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Switch
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const FeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    isPaid: false,
    paidAmount: 0,
    paidDate: ''
  });
  
  useEffect(() => {
    fetchFeeDetails();
  }, [id]);
  
  const fetchFeeDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/admin/fees/${id}`);
      setFee(res.data.data);
      
      // Initialize form data with current values
      if (res.data.data) {
        setFormData({
          isPaid: res.data.data.isPaid || false,
          paidAmount: res.data.data.paidAmount || res.data.data.amount,
          paidDate: res.data.data.paidDate ? new Date(res.data.data.paidDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch fee details');
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };
  
  const handleUpdateFee = async () => {
    try {
      setUpdateLoading(true);
      
      await axios.put(`/admin/fees/${id}`, formData);
      
      toast({
        title: 'Fee updated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      
      // Refresh fee details
      fetchFeeDetails();
      onClose();
    } catch (err) {
      toast({
        title: 'Failed to update fee',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
      <Flex justify="center" my={10}>
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
  
  const getStatusBadge = () => {
    const today = new Date();
    const dueDate = new Date(fee.dueDate);
    
    if (fee.isPaid) {
      return <Badge colorScheme="green" fontSize="md" p={1}>Paid</Badge>;
    } else if (dueDate < today) {
      return <Badge colorScheme="red" fontSize="md" p={1}>Overdue</Badge>;
    } else {
      return <Badge colorScheme="yellow" fontSize="md" p={1}>Pending</Badge>;
    }
  };
  
  return (
    <Box width="100%">
      <Flex justify="space-between" mb={6}>
        <Heading>Fee Details</Heading>
        <Button
          as={RouterLink}
          to="/admin/fees"
          leftIcon={<ArrowBackIcon />}
          variant="outline"
        >
          Back to Fees
        </Button>
      </Flex>
      
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Fee Information</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Status:</Text>
                  {getStatusBadge()}
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Fee Type:</Text>
                  <Text textTransform="capitalize">{fee.feeType}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Amount:</Text>
                  <Text>{formatAmount(fee.amount)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Semester:</Text>
                  <Text>{fee.semester}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Due Date:</Text>
                  <Text>{formatDate(fee.dueDate)}</Text>
                </Flex>
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
        </GridItem>
        
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Student Information</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{fee.student?.name}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Registration Number:</Text>
                  <Text>{fee.student?.registrationNumber}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{fee.student?.email}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Course:</Text>
                  <Text>{fee.student?.course}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Current Semester:</Text>
                  <Text>{fee.student?.semester}</Text>
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      
      {fee.isPaid && (
        <Card mt={6}>
          <CardHeader>
            <Heading size="md">Payment Information</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              <GridItem>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Paid Amount:</Text>
                  <Text>{formatAmount(fee.paidAmount || fee.amount)}</Text>
                </Flex>
              </GridItem>
              <GridItem>
                <Flex justify="space-between">
                  <Text fontWeight="bold">Payment Date:</Text>
                  <Text>{fee.paidDate ? formatDate(fee.paidDate) : 'N/A'}</Text>
                </Flex>
              </GridItem>
              {fee.paymentMethod && (
                <GridItem>
                  <Flex justify="space-between">
                    <Text fontWeight="bold">Payment Method:</Text>
                    <Text textTransform="capitalize">{fee.paymentMethod.replace('_', ' ')}</Text>
                  </Flex>
                </GridItem>
              )}
              {fee.transactionId && (
                <GridItem>
                  <Flex justify="space-between">
                    <Text fontWeight="bold">Transaction ID:</Text>
                    <Text>{fee.transactionId}</Text>
                  </Flex>
                </GridItem>
              )}
            </Grid>
          </CardBody>
        </Card>
      )}
      
      <Flex justify="flex-end" mt={6}>
        <Button colorScheme="blue" onClick={onOpen}>
          {fee.isPaid ? 'Update Payment Status' : 'Mark as Paid'}
        </Button>
      </Flex>
      
      {/* Update Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{fee.isPaid ? 'Update Payment Status' : 'Mark as Paid'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="isPaid" mb="0">
                  Is Paid?
                </FormLabel>
                <Switch 
                  id="isPaid" 
                  name="isPaid"
                  isChecked={formData.isPaid}
                  onChange={handleChange}
                />
              </FormControl>
              
              {formData.isPaid && (
                <>
                  <FormControl>
                    <FormLabel>Paid Amount</FormLabel>
                    <Input 
                      type="number" 
                      name="paidAmount"
                      value={formData.paidAmount}
                      onChange={handleChange}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Payment Date</FormLabel>
                    <Input 
                      type="date" 
                      name="paidDate"
                      value={formData.paidDate}
                      onChange={handleChange}
                    />
                  </FormControl>
                </>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleUpdateFee}
              isLoading={updateLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FeeDetail; 