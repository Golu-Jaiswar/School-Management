import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Stack,
  useToast,
  FormErrorMessage,
  Text,
  VStack,
  HStack,
  Divider,
  Alert,
  AlertIcon
} from '@chakra-ui/react';

const CreateStudent = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    registrationNumber: '',
    course: '',
    semester: 1,
    phone: '',
    address: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.course) errors.course = 'Course is required';
    if (!formData.semester) errors.semester = 'Semester is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSemesterChange = (valueAsString, valueAsNumber) => {
    // Ensure semester is always a valid number between 1-8
    const semester = isNaN(valueAsNumber) ? 1 : Math.min(Math.max(1, valueAsNumber), 8);
    setFormData({
      ...formData,
      semester
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation error',
        description: 'Please fix the errors in the form',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare student data ensuring proper types
      const studentData = {
        ...formData,
        semester: Number(formData.semester),
        role: 'student'
      };
      
      // If registration number is empty, don't send it to prevent uniqueness validation
      if (!studentData.registrationNumber.trim()) {
        delete studentData.registrationNumber;
      }
      
      // Send the request
      const response = await axios.post('/admin/students', studentData);
      
      toast({
        title: 'Student created',
        description: 'The student account has been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      navigate('/admin/students');
    } catch (err) {
      console.error('Error creating student:', err);
      const errorMessage = err.response?.data?.error || 'An error occurred while creating the student account';
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box width="100%">
      <Heading mb={6}>Create New Student</Heading>
      
      <Text mb={6} color="gray.600">
        Enter student details below to create a new student account
      </Text>
      
      <Box 
        p={8} 
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg"
        bg="white"
      >
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <HStack spacing={4}>
              <FormControl isRequired isInvalid={formErrors.name}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student's full name"
                />
                <FormErrorMessage>{formErrors.name}</FormErrorMessage>
              </FormControl>
            </HStack>
            
            <HStack spacing={4}>
              <FormControl isRequired isInvalid={formErrors.email}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter student's email"
                />
                <FormErrorMessage>{formErrors.email}</FormErrorMessage>
              </FormControl>
              
              <FormControl isRequired isInvalid={formErrors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
                <FormErrorMessage>{formErrors.password}</FormErrorMessage>
              </FormControl>
            </HStack>
            
            <Divider />
            <Text fontWeight="bold">Academic Information</Text>
            
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Registration Number</FormLabel>
                <Input
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Enter registration number (optional)"
                />
                <Text fontSize="xs" color="gray.500">
                  Leave blank to auto-generate or assign later
                </Text>
              </FormControl>
              
              <FormControl isRequired isInvalid={formErrors.course}>
                <FormLabel>Course</FormLabel>
                <Select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Select course"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                </Select>
                <FormErrorMessage>{formErrors.course}</FormErrorMessage>
              </FormControl>
            </HStack>
            
            <HStack spacing={4}>
              <FormControl isRequired isInvalid={formErrors.semester}>
                <FormLabel>Semester</FormLabel>
                <NumberInput 
                  min={1} 
                  max={8} 
                  value={formData.semester}
                  onChange={handleSemesterChange}
                  clampValueOnBlur={true}
                  allowMouseWheel={true}
                  keepWithinRange={true}
                  defaultValue={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{formErrors.semester}</FormErrorMessage>
              </FormControl>
            </HStack>
            
            <Divider />
            <Text fontWeight="bold">Contact Information</Text>
            
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </FormControl>
            </HStack>
            
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </FormControl>
            
            <Button
              mt={6}
              colorScheme="blue"
              isLoading={loading}
              type="submit"
              size="lg"
            >
              Create Student
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default CreateStudent; 