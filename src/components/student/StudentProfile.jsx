import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
  Avatar,
  AvatarBadge,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Badge,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  useColorModeValue
} from '@chakra-ui/react';
import { EditIcon, LockIcon } from '@chakra-ui/icons';
import { useAuth } from '../../context/AuthContext';

const StudentProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (isAuthenticated) {
      fetchStudentProfile();
      fetchFees();
      fetchPayments();
    }
  }, [isAuthenticated]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/student/profile');
      setProfile({
        ...res.data.data,
        name: res.data.data.name || user?.name,
        email: res.data.data.email || user?.email
      });
      setLoading(false);
    } catch (err) {
      toast({
        title: 'Error fetching profile',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      setLoading(false);
    }
  };

  const fetchFees = async () => {
    try {
      const res = await axios.get('/student/fees');
      setFees(res.data.data || []);
    } catch (err) {
      console.error('Error fetching fees:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/student/payments');
      setPayments(res.data.data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = async () => {
    try {
      const res = await axios.put('/student/profile', profile);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      setProfile(res.data.data);
      setEditMode(false);
    } catch (err) {
      toast({
        title: 'Update failed',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'New password and confirm password must match',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      await axios.put('/student/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast({
        title: 'Password changed',
        description: 'Your password has been changed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast({
        title: 'Password change failed',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Calculate statistics
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = totalFees - totalPaid;
  const paymentCount = payments.length;

  return (
    <Box width="100%">
      <Heading mb={6}>My Profile</Heading>
      
      {loading ? (
        <Flex justify="center" my={10}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Tabs isLazy variant="enclosed" colorScheme="blue">
          <TabList mb="1em">
            <Tab>Profile Information</Tab>
            <Tab>Account Security</Tab>
            <Tab>Financial Summary</Tab>
          </TabList>
          
          <TabPanels>
            {/* Profile Information Tab */}
            <TabPanel>
              <Box bg={bgColor} p={6} borderRadius="md" boxShadow="md">
                <Flex direction={{ base: 'column', md: 'row' }} align="center" mb={6}>
                  <Box position="relative" mr={{ base: 0, md: 6 }} mb={{ base: 4, md: 0 }}>
                    <Avatar
                      size="2xl"
                      name={profile?.name}
                      bg="blue.500"
                      color="white"
                      border="4px solid"
                      borderColor={borderColor}
                    >
                      <AvatarBadge boxSize="1.25em" bg="green.500" />
                    </Avatar>
                  </Box>
                  
                  <VStack align="start" spacing={2} flex="1">
                    <Heading size="lg">{profile?.name}</Heading>
                    <HStack>
                      <Badge colorScheme="blue" fontSize="0.9em" p={1}>
                        {profile?.course || 'Course Not Set'}
                      </Badge>
                      <Badge colorScheme="green" fontSize="0.9em" p={1}>
                        Semester {profile?.semester || 'Not Set'}
                      </Badge>
                    </HStack>
                    <Text color="gray.500" fontSize="md">{profile?.email}</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      Registration Number: {profile?.registrationNumber || 'Not Assigned'}
                    </Text>
                  </VStack>
                  
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => setEditMode(!editMode)}
                    alignSelf={{ base: 'stretch', md: 'flex-start' }}
                  >
                    {editMode ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                </Flex>
                
                <Divider my={4} />
                
                {editMode ? (
                  <Stack spacing={4}>
                    <FormControl>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        name="name"
                        value={profile?.name || ''}
                        onChange={handleProfileChange}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        value={profile?.email || ''}
                        isReadOnly
                        isDisabled
                        bg="gray.100"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        name="phone"
                        value={profile?.phone || ''}
                        onChange={handleProfileChange}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Address</FormLabel>
                      <Input
                        name="address"
                        value={profile?.address || ''}
                        onChange={handleProfileChange}
                      />
                    </FormControl>
                    
                    <Button
                      colorScheme="blue"
                      mt={4}
                      onClick={saveProfile}
                    >
                      Save Changes
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={4} divider={<Divider />}>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Full Name</Text>
                      <Text>{profile?.name}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Email</Text>
                      <Text>{profile?.email}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Registration Number</Text>
                      <Text>{profile?.registrationNumber || 'Not Assigned'}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Course</Text>
                      <Text>{profile?.course || 'Not Set'}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Semester</Text>
                      <Text>{profile?.semester || 'Not Set'}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Phone Number</Text>
                      <Text>{profile?.phone || 'Not Set'}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Address</Text>
                      <Text>{profile?.address || 'Not Set'}</Text>
                    </Flex>
                  </Stack>
                )}
              </Box>
            </TabPanel>
            
            {/* Account Security Tab */}
            <TabPanel>
              <Box bg={bgColor} p={6} borderRadius="md" boxShadow="md">
                <Heading size="md" mb={4}>Change Password</Heading>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Current Password</FormLabel>
                    <Input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </FormControl>
                  
                  <Button
                    leftIcon={<LockIcon />}
                    colorScheme="blue"
                    mt={4}
                    onClick={changePassword}
                  >
                    Update Password
                  </Button>
                </Stack>
              </Box>
            </TabPanel>
            
            {/* Financial Summary Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">Financial Summary</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<Divider />} spacing={4}>
                      <SimpleGrid columns={2} spacing={4}>
                        <Stat>
                          <StatLabel>Total Fees</StatLabel>
                          <StatNumber>₹{totalFees.toFixed(2)}</StatNumber>
                          <StatHelpText>All time</StatHelpText>
                        </Stat>
                        
                        <Stat>
                          <StatLabel>Total Paid</StatLabel>
                          <StatNumber>₹{totalPaid.toFixed(2)}</StatNumber>
                          <StatHelpText>{paymentCount} payments</StatHelpText>
                        </Stat>
                      </SimpleGrid>
                      
                      <SimpleGrid columns={2} spacing={4}>
                        <Stat>
                          <StatLabel>Pending Amount</StatLabel>
                          <StatNumber>₹{pendingAmount.toFixed(2)}</StatNumber>
                          <StatHelpText color={pendingAmount > 0 ? "red.500" : "green.500"}>
                            {pendingAmount > 0 ? "Due balance" : "Fully paid"}
                          </StatHelpText>
                        </Stat>
                        
                        <Stat>
                          <StatLabel>Payment Completion</StatLabel>
                          <StatNumber>
                            {totalFees > 0 ? 
                              `${((totalPaid / totalFees) * 100).toFixed(1)}%` : 
                              '0%'
                            }
                          </StatNumber>
                          <StatHelpText>Of total fees</StatHelpText>
                        </Stat>
                      </SimpleGrid>
                    </Stack>
                  </CardBody>
                </Card>
                
                <Card bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">Recent Activity</Heading>
                  </CardHeader>
                  <CardBody>
                    {payments.length > 0 ? (
                      <VStack align="stretch" spacing={4} divider={<Divider />}>
                        {payments.slice(0, 5).map(payment => (
                          <HStack key={payment._id} justify="space-between">
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold">{payment.fee?.feeType || 'Fee Payment'}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {new Date(payment.paymentDate).toLocaleDateString()}
                              </Text>
                            </VStack>
                            <Text fontWeight="bold" color="green.500">
                              ₹{payment.amount.toFixed(2)}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    ) : (
                      <Text>No payment activity found</Text>
                    )}
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default StudentProfile; 