import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Stack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Center,
  Spinner
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { AddIcon, ViewIcon } from '@chakra-ui/icons';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch all students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/students');
      setStudents(res.data.data);
      setLoading(false);
    } catch (err) {
      toast({
        title: 'Error fetching students',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      setLoading(false);
    }
  };

  // Delete student
  const handleDelete = async () => {
    try {
      await axios.delete(`/admin/students/${deleteId}`);
      
      toast({
        title: 'Student deleted',
        description: 'Student has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Refresh student list
      fetchStudents();
      onClose();
    } catch (err) {
      toast({
        title: 'Error deleting student',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Open confirmation modal
  const openDeleteModal = (id) => {
    setDeleteId(id);
    onOpen();
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.registrationNumber && student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box width="100%">
      <Stack spacing={5}>
        <Heading>Student Management</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          <Card>
            <CardHeader>
              <Heading size="md">Add New Student</Heading>
            </CardHeader>
            <CardBody>
              <Text mb={4}>Register a new student in the system with their details.</Text>
              <Button
                as={RouterLink}
                to="/admin/students/new"
                leftIcon={<AddIcon />}
                colorScheme="blue"
                width="100%"
              >
                Add Student
              </Button>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <Heading size="md">View All Students</Heading>
            </CardHeader>
            <CardBody>
              <Text mb={4}>View and manage all registered students in the system.</Text>
              <Button
                as={RouterLink}
                to="/admin/students"
                leftIcon={<ViewIcon />}
                colorScheme="teal"
                width="100%"
              >
                Manage Students
              </Button>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        {/* Recent Students Section */}
        <Card>
          <CardHeader>
            <Heading size="md">Recently Added Students</Heading>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Center py={6}>
                <Spinner size="xl" />
              </Center>
            ) : students.length === 0 ? (
              <Text textAlign="center">No recent students found</Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {students.map(student => (
                  <Box 
                    key={student._id} 
                    p={5} 
                    shadow="md" 
                    borderWidth="1px" 
                    borderRadius="md"
                  >
                    <Text fontWeight="bold">{student.name}</Text>
                    <Text>{student.email}</Text>
                    <Text>{student.registrationNumber || 'N/A'}</Text>
                    <Text>{student.course || 'N/A'}</Text>
                    <Text>{student.semester || 'N/A'}</Text>
                    <HStack spacing={2} mt={2}>
                      <IconButton
                        aria-label="Edit student"
                        icon={<FaEdit />}
                        size="sm"
                        as={RouterLink}
                        to={`/admin/students/${student._id}/edit`}
                      />
                      <IconButton
                        aria-label="Create fee"
                        colorScheme="green"
                        size="sm"
                        as={RouterLink}
                        to={`/admin/students/${student._id}/fees/new`}
                      >
                        + Fee
                      </IconButton>
                      <IconButton
                        aria-label="Delete student"
                        icon={<FaTrash />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => openDeleteModal(student._id)}
                      />
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </CardBody>
        </Card>
      </Stack>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this student? This action cannot be undone.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Students; 