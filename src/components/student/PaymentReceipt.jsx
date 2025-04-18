import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  Stack,
  SimpleGrid
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';

const PaymentReceipt = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const receiptRef = useRef(null);
  
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/student/payments/${id}/receipt`);
        setPayment(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch payment details');
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const downloadPDF = async () => {
    if (!receiptRef.current) return;
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`receipt-${id}.pdf`);
      
      toast({
        title: 'Receipt downloaded',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (err) {
      toast({
        title: 'Download failed',
        description: 'Could not generate PDF receipt',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  if (loading || !payment) {
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb={5}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box width="100%">
      <Flex 
        direction={{ base: "column", sm: "row" }} 
        justify="space-between" 
        align={{ base: "stretch", sm: "center" }} 
        mb={5} 
        gap={3}
      >
        <Button 
          leftIcon={<FaArrowLeft />} 
          onClick={() => navigate('/student/payments')}
          variant="outline"
          width={{ base: "100%", sm: "auto" }}
        >
          Back to Payments
        </Button>
        <Button 
          rightIcon={<FaDownload />} 
          colorScheme="blue" 
          onClick={downloadPDF}
          width={{ base: "100%", sm: "auto" }}
        >
          Download Receipt
        </Button>
      </Flex>
      
      <Flex justify="center">
        <Box 
          ref={receiptRef} 
          p={{ base: 4, md: 8 }} 
          borderWidth="1px" 
          borderRadius="lg" 
          boxShadow="lg" 
          bg="white" 
          mb={5}
          maxW="800px"
          w="100%"
        >
          <VStack spacing={5} align="stretch">
            <HStack 
              justify="space-between" 
              align={{ base: "flex-start", sm: "center" }}
              flexDir={{ base: "column", sm: "row" }}
              gap={3}
            >
              <VStack align={{ base: "center", sm: "flex-start" }} spacing={1}>
                <Heading size="md">University Fee Receipt</Heading>
                <Text color="gray.500">Official Payment Receipt</Text>
              </VStack>
              <Image 
                src="https://placehold.co/100x50?text=LOGO"
                alt="University Logo" 
                h="50px"
                fallback={<Box w="100px" h="50px" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="xs" fontWeight="bold">UNIVERSITY</Text>
                </Box>}
              />
            </HStack>
            
            <Divider />
            
            <Stack 
              direction={{ base: "column", sm: "row" }} 
              justify="space-between"
              spacing={4}
            >
              <Box>
                <Text fontWeight="bold">Receipt Number</Text>
                <Text>{payment.receiptNumber || payment._id}</Text>
              </Box>
              <Box textAlign={{ base: "left", sm: "right" }}>
                <Text fontWeight="bold">Payment Date</Text>
                <Text>{formatDate(payment.paymentDate)}</Text>
              </Box>
            </Stack>
            
            <Divider />
            
            <VStack align="stretch" spacing={4}>
              <Heading size="sm">Student Details</Heading>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Name</Text>
                  <Text>{payment.studentName || user?.name}</Text>
                </Box>
                {payment.registrationNumber && (
                  <Box>
                    <Text fontWeight="bold">Registration Number</Text>
                    <Text>{payment.registrationNumber}</Text>
                  </Box>
                )}
                <Box>
                  <Text fontWeight="bold">Email</Text>
                  <Text>{user?.email}</Text>
                </Box>
              </SimpleGrid>
            </VStack>
            
            <Divider />
            
            <VStack align="stretch" spacing={4}>
              <Heading size="sm">Payment Details</Heading>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Fee Type</Text>
                  <Text textTransform="capitalize">{payment.feeType}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Payment Method</Text>
                  <Text textTransform="capitalize">
                    {payment.paymentMethod.replace('_', ' ')}
                  </Text>
                </Box>
                {payment.transactionId && (
                  <Box>
                    <Text fontWeight="bold">Transaction ID</Text>
                    <Text>{payment.transactionId}</Text>
                  </Box>
                )}
                <Box>
                  <Text fontWeight="bold">Amount Paid</Text>
                  <Text fontWeight="semibold" fontSize="lg" color="green.600">₹{payment.amount.toFixed(2)}</Text>
                </Box>
              </SimpleGrid>
            </VStack>
            
            <Divider />
            
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text fontWeight="bold">Payment Status</Text>
                <Text 
                  fontWeight="bold" 
                  color="green.500"
                  bg="green.50"
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  PAID
                </Text>
              </HStack>
            </VStack>
            
            <Divider />
            
            <VStack spacing={2} pt={4}>
              <Text fontSize="sm" color="gray.500" textAlign="center">This is a computer-generated receipt and does not require a signature.</Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">For any queries, please contact the university finance office.</Text>
            </VStack>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default PaymentReceipt; 