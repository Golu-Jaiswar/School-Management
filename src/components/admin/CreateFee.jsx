import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Container,
  Divider,
  Textarea,
  Alert,
  AlertIcon,
  Spinner
} from '@chakra-ui/react';

const CreateFee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    studentId: '',
    amount: 0,
    feeType: '',
    semester: 1,
    dueDate: '',
    description: ''
  });
  
  const { studentId, amount, feeType, semester, dueDate, description } = formData;
  
  // Fetch students list if no ID provided
  useEffect(() => {
    if (!id) {
      fetchStudents();
    } else {
      fetchStudentById(id);
    }
  }, [id]);
  
  // Set default due date (30 days from now)
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    setFormData(prev => ({
      ...prev,
      dueDate: date.toISOString().split('T')[0]
    }));
  }, []);
  
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/students');
      setStudents(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch students');
      setLoading(false);
    }
  };
  
  const fetchStudentById = async (studentId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/admin/students/${studentId}`);
      setStudent(res.data.data);
      
      // Set student ID and default semester
      setFormData(prev => ({
        ...prev,
        studentId: res.data.data._id,
        semester: res.data.data.semester || 1
      }));
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch student details');
      setLoading(false);
    }
  };
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // If student selection changes, update semester based on selected student
    if (e.target.name === 'studentId' && e.target.value) {
      const selectedStudent = students.find(s => s._id === e.target.value);
      if (selectedStudent) {
        setFormData(prev => ({
          ...prev,
          semester: selectedStudent.semester || 1
        }));
      }
    }
  };
  
  const handleAmountChange = (value) => {
    setFormData({ ...formData, amount: parseFloat(value) });
  };
  
  const handleSemesterChange = (value) => {
    setFormData({ ...formData, semester: parseInt(value) });
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!studentId && !id) {
      toast({
        title: 'Please select a student',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      const targetStudentId = id || studentId;
      await axios.post(`/admin/students/${targetStudentId}/fees`, {
        amount,
        feeType,
        semester,
        dueDate,
        description
      });
      
      toast({
        title: 'Fee created successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      
      navigate('/admin/fees');
    } catch (err) {
      toast({
        title: 'Failed to create fee',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Box width="100%">
        <Heading mb={6}>Create Fee</Heading>
        
        <Text mb={6} color="gray.600">
          Create a new fee by selecting a student and fee details
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
              {!id && (
                <FormControl id="studentId" isRequired>
                  <FormLabel>Select Student</FormLabel>
                  <Select 
                    name="studentId"
                    value={studentId}
                    onChange={onChange}
                    placeholder="Select a student"
                  >
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.registrationNumber})
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
              
              <FormControl id="feeType" isRequired>
                <FormLabel>Fee Type</FormLabel>
                <Select 
                  name="feeType"
                  value={feeType}
                  onChange={onChange}
                  placeholder="Select fee type"
                >
                  <option value="tuition">Tuition Fee</option>
                  <option value="hostel">Hostel Fee</option>
                  <option value="transport">Transport Fee</option>
                  <option value="examination">Examination Fee</option>
                  <option value="other">Other Fee</option>
                </Select>
              </FormControl>
              
              <FormControl id="amount" isRequired>
                <FormLabel>Amount (₹)</FormLabel>
                <NumberInput 
                  min={0} 
                  value={amount}
                  onChange={handleAmountChange}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl id="semester" isRequired>
                <FormLabel>Semester</FormLabel>
                <NumberInput 
                  min={1} 
                  max={8} 
                  value={semester}
                  onChange={handleSemesterChange}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl id="dueDate" isRequired>
                <FormLabel>Due Date</FormLabel>
                <Input 
                  type="date" 
                  name="dueDate"
                  value={dueDate}
                  onChange={onChange}
                />
              </FormControl>
              
              <FormControl id="description">
                <FormLabel>Description (Optional)</FormLabel>
                <Textarea 
                  name="description"
                  value={description}
                  onChange={onChange}
                  placeholder="Additional information about this fee"
                  resize="vertical"
                  rows={3}
                />
              </FormControl>
              
              <Divider my={4} />
              
              <Flex justify="space-between">
                <Button 
                  onClick={() => navigate('/admin/fees')}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  colorScheme="blue" 
                  isLoading={submitLoading}
                  loadingText="Creating"
                >
                  Create Fee
                </Button>
              </Flex>
            </Stack>
          </form>
        </Box>
      </Box>
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
    <Container maxW="container.md">
      <Box>
        <Heading mb={2}>Create New Fee</Heading>
        {student ? (
          <Text mb={6} color="gray.600">
            Creating fee for student: <strong>{student.name}</strong> ({student.registrationNumber})
          </Text>
        ) : (
          <Text mb={6} color="gray.600">
            Create a new fee by selecting a student and fee details
          </Text>
        )}
        
        <Box 
          p={8} 
          borderWidth={1} 
          borderRadius={8} 
          boxShadow="lg"
          bg="white"
        >
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              {!id && (
                <FormControl id="studentId" isRequired>
                  <FormLabel>Select Student</FormLabel>
                  <Select 
                    name="studentId"
                    value={studentId}
                    onChange={onChange}
                    placeholder="Select a student"
                  >
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.registrationNumber})
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
              
              <FormControl id="feeType" isRequired>
                <FormLabel>Fee Type</FormLabel>
                <Select 
                  name="feeType"
                  value={feeType}
                  onChange={onChange}
                  placeholder="Select fee type"
                >
                  <option value="tuition">Tuition Fee</option>
                  <option value="hostel">Hostel Fee</option>
                  <option value="transport">Transport Fee</option>
                  <option value="examination">Examination Fee</option>
                  <option value="other">Other Fee</option>
                </Select>
              </FormControl>
              
              <FormControl id="amount" isRequired>
                <FormLabel>Amount (₹)</FormLabel>
                <NumberInput 
                  min={0} 
                  value={amount}
                  onChange={handleAmountChange}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl id="semester" isRequired>
                <FormLabel>Semester</FormLabel>
                <NumberInput 
                  min={1} 
                  max={8} 
                  value={semester}
                  onChange={handleSemesterChange}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl id="dueDate" isRequired>
                <FormLabel>Due Date</FormLabel>
                <Input 
                  type="date" 
                  name="dueDate"
                  value={dueDate}
                  onChange={onChange}
                />
              </FormControl>
              
              <FormControl id="description">
                <FormLabel>Description (Optional)</FormLabel>
                <Textarea 
                  name="description"
                  value={description}
                  onChange={onChange}
                  placeholder="Additional information about this fee"
                  resize="vertical"
                  rows={3}
                />
              </FormControl>
              
              <Divider my={4} />
              
              <Flex justify="space-between">
                <Button 
                  onClick={() => navigate('/admin/fees')}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  colorScheme="blue" 
                  isLoading={submitLoading}
                  loadingText="Creating"
                >
                  Create Fee
                </Button>
              </Flex>
            </Stack>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateFee; 