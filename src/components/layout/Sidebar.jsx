import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  CloseButton,
  VStack,
  Icon,
  useColorModeValue,
  useDisclosure,
  Button,
  Avatar,
  Badge,
  Tooltip,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useBreakpointValue,
  useToast
} from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiDollarSign,
  FiCreditCard,
  FiSettings,
  FiUser,
  FiLogOut,
  FiMenu,
  FiChevronRight,
  FiBell,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const SidebarContent = ({ onClose, ...rest }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const role = user?.role || 'student';
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const isAdmin = role === 'admin';
  const isStudent = role === 'student';
  
  // Public links for non-authenticated users
  const publicLinks = [
    { name: 'Home', icon: FiHome, path: '/' },
    { name: 'About Us', icon: FiFileText, path: '/about' },
    { name: 'Contact Us', icon: FiUsers, path: '/contact' },
  ];
  
  // Define links based on user role
  const adminLinks = [
    { name: 'Dashboard', icon: FiHome, path: '/admin' },
    { name: 'Students', icon: FiUsers, path: '/admin/students' },
    { name: 'Fees', icon: FiFileText, path: '/admin/fees' },
    { name: 'Payments', icon: FiDollarSign, path: '/admin/payments' },
    { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
  ];
  
  const studentLinks = [
    { name: 'Dashboard', icon: FiHome, path: '/student' },
    { name: 'My Fees', icon: FiFileText, path: '/student/fees' },
    { name: 'Payment History', icon: FiDollarSign, path: '/student/payments' },
  ];
  
  // Choose which links to display based on authentication status
  let links;
  if (!isAuthenticated) {
    links = publicLinks;
  } else if (isAdmin) {
    links = adminLinks;
  } else {
    links = studentLinks;
  }
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error logging out',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  return (
    <Box
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      bg={bgColor}
      boxShadow={{ base: 'lg', md: 'sm' }}
      zIndex="dropdown"
      transition="0.3s ease"
      {...rest}
    >
      <Flex h={{ base: "16", md: "20" }} alignItems="center" mx={{ base: "4", md: "8" }} justifyContent="space-between">
        <Flex align="center">
          <Box
            bg="blue.500"
            color="white"
            p={{ base: 0.5, md: 1 }}
            borderRadius="md"
            fontWeight="bold"
            fontSize={{ base: "lg", md: "xl" }}
            width={{ base: "32px", md: "40px" }}
            height={{ base: "32px", md: "40px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mr={{ base: 2, md: 3 }}
          >
            SFM
          </Box>
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color={useColorModeValue('blue.600', 'white')}>
            {isAuthenticated ? (isAdmin ? 'Admin Panel' : 'Student Panel') : 'School Fees'}
          </Text>
        </Flex>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      
      {/* User Profile Summary - Only show for authenticated users */}
      {isAuthenticated && (
        <>
          <Box px={{ base: 3, md: 5 }} pb={{ base: 3, md: 5 }} pt={{ base: 1, md: 2 }}>
            <Flex direction="column" alignItems="center" mb={{ base: 2, md: 4 }}>
              <Avatar 
                size={{ base: "sm", md: "md" }}
                name={user?.name} 
                bg="blue.500" 
                color="white"
                mb={2}
              />
              <Text fontWeight="bold" textAlign="center" noOfLines={1} fontSize={{ base: "sm", md: "md" }}>{user?.name}</Text>
              <Badge colorScheme={isAdmin ? 'purple' : 'green'} mt={1} fontSize={{ base: "xs", md: "sm" }}>
                {role}
              </Badge>
            </Flex>
          </Box>
          
          <Divider mb={{ base: 2, md: 4 }} borderColor={borderColor} />
        </>
      )}
      
      <VStack align="stretch" spacing={{ base: 0.5, md: 1 }} px={{ base: 2, md: 3 }}>
        {links.map((link) => (
          <NavItem 
            key={link.name} 
            icon={link.icon} 
            path={link.path}
            isActive={location.pathname === link.path}
            fontSize={{ base: "sm", md: "md" }}
          >
            {link.name}
          </NavItem>
        ))}
      </VStack>
      
      {/* Only show logout button for authenticated users */}
      {isAuthenticated && (
        <Box position="absolute" bottom={{ base: "3", md: "5" }} width="100%" px={{ base: 3, md: 5 }}>
          <Divider my={{ base: 2, md: 4 }} borderColor={borderColor} />
          <Button
            width="full"
            variant="outline"
            leftIcon={<FiLogOut />}
            borderColor={useColorModeValue('gray.300', 'gray.600')}
            _hover={{
              bg: useColorModeValue('gray.100', 'gray.700'),
              borderColor: useColorModeValue('gray.400', 'gray.500'),
            }}
            size={{ base: "sm", md: "md" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
};

const NavItem = ({ icon, path, children, isActive, fontSize, ...rest }) => {
  const activeColor = useColorModeValue('blue.600', 'blue.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.300');
  const activeBg = useColorModeValue('blue.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const iconColor = isActive ? activeColor : inactiveColor;
  
  return (
    <NavLink to={path} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        py={{ base: 2, md: 3 }}
        px={{ base: 3, md: 4 }}
        mx={{ base: 0.5, md: 1 }}
        borderRadius="md"
        role="group"
        cursor="pointer"
        color={isActive ? activeColor : inactiveColor}
        bg={isActive ? activeBg : 'transparent'}
        _hover={{
          bg: hoverBg,
          color: activeColor,
        }}
        fontWeight={isActive ? "600" : "normal"}
        transition="all 0.2s"
        position="relative"
        fontSize={fontSize}
        {...rest}
      >
        {isActive && (
          <Box
            position="absolute"
            left={0}
            top="50%"
            transform="translateY(-50%)"
            w="3px"
            h="70%"
            bg={activeColor}
            borderRightRadius="md"
          />
        )}
        {icon && (
          <Icon
            mr={{ base: 3, md: 4 }}
            fontSize={{ base: "14px", md: "16px" }}
            as={icon}
            color={iconColor}
            _groupHover={{
              color: activeColor,
            }}
          />
        )}
        <Text>{children}</Text>
        {isActive && (
          <Icon
            as={FiChevronRight}
            ml="auto"
            color={activeColor}
            fontSize={{ base: "14px", md: "16px" }}
          />
        )}
      </Flex>
    </NavLink>
  );
};

const MobileNav = ({ onClose }) => {
  const { user, isAuthenticated } = useAuth();
  return (
    <Box 
      display={{ base: "flex", md: "none" }} 
      flexDir="column" 
      h="full"
    >
      <SidebarContent onClose={onClose} />
    </Box>
  );
};

const Sidebar = ({ onClose, isOpen }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const showSidebar = useBreakpointValue({ base: false, md: true });
  
  // Updated condition to show sidebar on public routes when wrapped with MainLayout
  // Only hide on auth routes
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const shouldShowSidebar = !authRoutes.includes(location.pathname);
  
  if (!shouldShowSidebar) return null;
  
  return (
    <Box>
      {showSidebar && (
        <SidebarContent 
          onClose={onClose} 
          display={{ base: 'none', md: 'block' }} 
        />
      )}
      
      {/* Mobile sidebar - only shown when isOpen is true */}
      {!showSidebar && isOpen && (
        <MobileNav onClose={onClose} />
      )}
    </Box>
  );
};

export default Sidebar; 