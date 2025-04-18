import React, { useState, useEffect } from 'react';
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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Spinner,
  Card,
  CardBody,
  Divider,
  HStack
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const toast = useToast();
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  // Fetch students data
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students when search text or filters change
  useEffect(() => {
    filterStudents();
  }, [searchText, courseFilter, semesterFilter, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/students');
      setStudents(res.data.data);
      setFilteredStudents(res.data.data);
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

  const filterStudents = () => {
    let result = [...students];
    
    // Apply search filter
    if (searchText) {
      const lowercaseSearch = searchText.toLowerCase();
      result = result.filter(student => 
        (student.name && student.name.toLowerCase().includes(lowercaseSearch)) ||
        (student.email && student.email.toLowerCase().includes(lowercaseSearch)) ||
        (student.registrationNumber && student.registrationNumber.toLowerCase().includes(lowercaseSearch))
      );
    }
    
    // Apply course filter
    if (courseFilter) {
      result = result.filter(student => student.course === courseFilter);
    }
    
    // Apply semester filter
    if (semesterFilter) {
      result = result.filter(student => student.semester === parseInt(semesterFilter));
    }
    
    setFilteredStudents(result);
  };

  const handleDeleteStudent = student => {
    setSelectedStudent(student);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/students/${selectedStudent._id}`);
      
      toast({
        title: 'Student deleted',
        description: 'Student record has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Refresh the list
      fetchStudents();
    } catch (err) {
      toast({
        title: 'Error deleting student',
        description: err.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      onClose();
    }
  };

  // Get unique courses for filter options
  const uniqueCourses = [...new Set(students.map(student => student.course))].filter(Boolean);

  return (
    <Box width="85%">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Manage Students</Heading>
        <Button
          as={RouterLink}
          to="/admin/students/new"
          leftIcon={<AddIcon />}
          colorScheme="blue"
        >
          Add New Student
        </Button>
      </Flex>

      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={6}>
        <InputGroup maxW={{ base: '100%', md: '300px' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by name, email or registration number"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </InputGroup>
        
        <Select
          placeholder="All Courses"
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          maxW={{ base: '100%', md: '200px' }}
        >
          {uniqueCourses.map(course => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </Select>
        
        <Select
          placeholder="All Semesters"
          value={semesterFilter}
          onChange={e => setSemesterFilter(e.target.value)}
          maxW={{ base: '100%', md: '200px' }}
        >
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
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
              {filteredStudents.length === 0 ? (
                <Text textAlign="center" fontSize="lg" py={6}>
                  No students found
                </Text>
              ) : (
                filteredStudents.map(student => (
                  <Card key={student._id}>
                    <CardBody>
                      <Stack spacing={3}>
                        <Text fontWeight="bold" fontSize="lg">{student.name}</Text>
                        <Divider />
                        <Flex justify="space-between">
                          <Text fontSize="sm" fontWeight="medium">Registration No:</Text>
                          <Text fontSize="sm">{student.registrationNumber || 'N/A'}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" fontWeight="medium">Email:</Text>
                          <Text fontSize="sm">{student.email}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" fontWeight="medium">Course:</Text>
                          <Text fontSize="sm">{student.course || 'N/A'}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" fontWeight="medium">Semester:</Text>
                          <Text fontSize="sm">
                            {student.semester ? (
                              <Badge colorScheme="blue">Semester {student.semester}</Badge>
                            ) : (
                              'N/A'
                            )}
                          </Text>
                        </Flex>
                        <HStack spacing={2} mt={2}>
                          <Button 
                            as={RouterLink}
                            to={`/admin/students/${student._id}`}
                            colorScheme="blue"
                            size="sm"
                            flex={1}
                          >
                            View
                          </Button>
                          <Button
                            as={RouterLink}
                            to={`/admin/students/${student._id}/edit`}
                            colorScheme="teal"
                            size="sm"
                            flex={1}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDeleteStudent(student)}
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
                  <Th>Name</Th>
                  <Th>Registration No.</Th>
                  <Th>Email</Th>
                  <Th>Course</Th>
                  <Th>Semester</Th>
                  <Th width="120px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredStudents.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={6}>
                      <Text fontSize="lg">No students found</Text>
                    </Td>
                  </Tr>
                ) : (
                  filteredStudents.map(student => (
                    <Tr key={student._id}>
                      <Td fontWeight="medium">{student.name}</Td>
                      <Td>{student.registrationNumber || 'N/A'}</Td>
                      <Td>{student.email}</Td>
                      <Td>{student.course || 'N/A'}</Td>
                      <Td>
                        {student.semester ? (
                          <Badge colorScheme="blue">Semester {student.semester}</Badge>
                        ) : (
                          'N/A'
                        )}
                      </Td>
                      <Td>
                        <Flex>
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
                                to={`/admin/students/${student._id}`}
                              >
                                View Details
                              </MenuItem>
                              <MenuItem 
                                icon={<FaEdit />}
                                as={RouterLink}
                                to={`/admin/students/${student._id}/edit`}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem 
                                icon={<FaTrash />} 
                                color="red.500"
                                onClick={() => handleDeleteStudent(student)}
                              >
                                Delete
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Student
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
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

export default AdminStudents; 