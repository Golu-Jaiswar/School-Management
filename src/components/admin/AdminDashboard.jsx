import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Card,
  CardHeader,
  CardBody,
  Stack,
  CircularProgress,
  CircularProgressLabel,
  useToast,
  Divider
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { Canvas } from '@react-three/fiber';
import AdminStatsModel from '../3d/AdminStatsModel';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/admin/statistics');
        setStats(res.data.data);
        setLoading(false);
      } catch (err) {
        toast({
          title: 'Error fetching statistics',
          description: err.response?.data?.error || 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  // Calculate percentages for visualization
  const calculatePercentages = () => {
    if (!stats || !stats.feesData) return { paid: 0, partial: 0, pending: 0 };

    const statusMap = stats.feesData.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});

    const paidData = statusMap['paid'] || { count: 0, totalAmount: 0 };
    const partialData = statusMap['partial'] || { count: 0, totalAmount: 0 };
    const pendingData = statusMap['pending'] || { count: 0, totalAmount: 0 };

    const totalAmount = paidData.totalAmount + partialData.totalAmount + pendingData.totalAmount;

    if (totalAmount === 0) return { paid: 0, partial: 0, pending: 0 };

    return {
      paid: (paidData.totalAmount / totalAmount) * 100,
      partial: (partialData.totalAmount / totalAmount) * 100,
      pending: (pendingData.totalAmount / totalAmount) * 100
    };
  };

  const percentages = stats ? calculatePercentages() : { paid: 0, partial: 0, pending: 0 };

  return (
    <Box width="83%">
      <Heading mb={6}>Admin Dashboard</Heading>
      
      {loading ? (
        <Flex justify="center" my={10}>
          <CircularProgress isIndeterminate color="blue.300" />
        </Flex>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={10}>
            <StatCard
              title="Total Students"
              value={stats?.totalStudents || 0}
              helpText="Registered students"
              colorScheme="blue"
            />
            <StatCard
              title="Total Fees"
              value={stats?.totalFees || 0}
              helpText="Fee records"
              colorScheme="green"
            />
            <StatCard
              title="Total Payments"
              value={stats?.totalPayments || 0}
              helpText="Payment transactions"
              colorScheme="purple"
            />
            <StatCard
              title="Total Amount Paid"
              value={`₹${stats?.totalPaid?.toFixed(2) || '0.00'}`}
              helpText="Total revenue"
              colorScheme="teal"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
            <Box width="100%">
              <Card mb={6} width="100%">
                <CardHeader>
                  <Heading size="md">Payment Status Overview</Heading>
                </CardHeader>
                <CardBody>
                  <Stack direction={{ base: "column", md: "row" }} spacing={8} align="center" justify="center">
                    <CircularProgress value={percentages.paid} color="green.400" size="100px">
                      <CircularProgressLabel>{percentages.paid.toFixed(1)}%</CircularProgressLabel>
                    </CircularProgress>
                    <Box>
                      <Text fontWeight="bold" mb={2}>Payment Status</Text>
                      <Stack spacing={2}>
                        <Flex align="center">
                          <Box w={3} h={3} borderRadius="full" bg="green.400" mr={2} />
                          <Text>Paid: {percentages.paid.toFixed(1)}%</Text>
                        </Flex>
                        <Flex align="center">
                          <Box w={3} h={3} borderRadius="full" bg="yellow.400" mr={2} />
                          <Text>Partial: {percentages.partial.toFixed(1)}%</Text>
                        </Flex>
                        <Flex align="center">
                          <Box w={3} h={3} borderRadius="full" bg="red.400" mr={2} />
                          <Text>Pending: {percentages.pending.toFixed(1)}%</Text>
                        </Flex>
                      </Stack>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Button
                  as={RouterLink}
                  to="/admin/students/new"
                  colorScheme="blue"
                  size="lg"
                  height="100px"
                >
                  Add New Student
                </Button>
                <Button
                  as={RouterLink}
                  to="/admin/students"
                  colorScheme="teal"
                  size="lg"
                  height="100px"
                >
                  Manage Students
                </Button>
                <Button
                  as={RouterLink}
                  to="/admin/fees"
                  colorScheme="purple"
                  size="lg"
                  height="100px"
                >
                  Manage Fees
                </Button>
                <Button
                  as={RouterLink}
                  to="/admin/payments"
                  colorScheme="green"
                  size="lg"
                  height="100px"
                >
                  View Payments
                </Button>
              </SimpleGrid>
            </Box>
            
            <Box height="400px" width="100%">
              <ErrorBoundary>
                <Canvas 
                  camera={{ position: [0, 0, 15], fov: 50 }} 
                  gl={{ 
                    preserveDrawingBuffer: true, 
                    antialias: true,
                    powerPreference: 'high-performance'
                  }}
                >
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <AdminStatsModel 
                    stats={{
                      students: stats?.totalStudents || 0,
                      fees: stats?.totalFees || 0, 
                      payments: stats?.totalPayments || 0
                    }}
                  />
                </Canvas>
              </ErrorBoundary>
            </Box>
          </SimpleGrid>
        </>
      )}
    </Box>
  );
};

const StatCard = ({ title, value, helpText, colorScheme }) => {
  return (
    <Stat
      px={4}
      py={5}
      shadow="base"
      borderWidth="1px"
      borderRadius="lg"
      bg={`${colorScheme}.50`}
    >
      <StatLabel fontWeight="medium" isTruncated color={`${colorScheme}.700`}>
        {title}
      </StatLabel>
      <StatNumber fontSize="3xl" fontWeight="bold">
        {value}
      </StatNumber>
      <StatHelpText>{helpText}</StatHelpText>
    </Stat>
  );
};

export default AdminDashboard; 