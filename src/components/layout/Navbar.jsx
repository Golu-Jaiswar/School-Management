import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  HStack,
  Container,
  Image,
  Badge,
  Tooltip
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BellIcon
} from '@chakra-ui/icons';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onOpen }) => {
  const { isOpen: isMenuOpen, onToggle } = useDisclosure();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [scrolled, setScrolled] = useState(false);
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';
  
  // Change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged out successfully',
      status: 'success',
      duration: 2000,
      isClosable: true
    });
    navigate('/');
  };
  
  return (
    <Box
      position="fixed"
      top="0"
      width="100%"
      zIndex="999"
      transition="all 0.3s ease"
    >
      <Flex
        bg={scrolled 
          ? useColorModeValue('white', 'gray.800') 
          : useColorModeValue('white', 'gray.800')
        }
        color={useColorModeValue('gray.600', 'white')}
        minH={{ base: '60px', md: '70px' }}
        py={{ base: 1, md: 2 }}
        px={{ base: 2, md: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        boxShadow={scrolled ? "md" : "sm"}
        transition="all 0.3s ease"
      >
        <Container maxW="8xl" px={{ base: 0, md: 0 }}>
          <Flex align={'center'} justify="space-between" width="100%">
            <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -1, md: -2 }} display={{ base: 'flex', md: 'none' }}>
              {!isHomePage ? (
                <IconButton
                  onClick={onOpen}
                  icon={<HamburgerIcon w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} />}
                  variant={'ghost'}
                  aria-label={'Open Sidebar'}
                  size={{ base: 'sm', md: 'md' }}
                />
              ) : (
                <IconButton
                  onClick={onToggle}
                  icon={isMenuOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} />}
                  variant={'ghost'}
                  aria-label={'Toggle Navigation'}
                  size={{ base: 'sm', md: 'md' }}
                />
              )}
            </Flex>
            
            <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} align="center">
              <HStack spacing={{ base: 1, md: 2 }} as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                <Box
                  bg="blue.500"
                  color="white"
                  p={1}
                  borderRadius="md"
                  fontWeight="bold"
                  fontSize={{ base: "lg", md: "xl" }}
                  width={{ base: "32px", md: "40px" }}
                  height={{ base: "32px", md: "40px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  SFM
                </Box>
                <Text
                  textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                  fontFamily={'heading'}
                  fontWeight="bold"
                  fontSize={{ base: "sm", sm: "md", md: "lg" }}
                  color={useColorModeValue('blue.600', 'white')}
                  display={{ base: 'none', sm: 'block' }}
                >
                  School Fee Management
                </Text>
              </HStack>

              <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                <DesktopNav isAuthenticated={isAuthenticated} user={user} currentPath={location.pathname} />
              </Flex>
            </Flex>

            <Stack
              flex={{ base: 1, md: 0 }}
              justify={'flex-end'}
              direction={'row'}
              spacing={4}
              align="center"
            >
              {isAuthenticated ? (
                <HStack spacing={3}>
                  <Tooltip label="Notifications" hasArrow placement="bottom">
                    <IconButton
                      aria-label="Notifications"
                      icon={<>
                        <BellIcon w={5} h={5} />
                        <Badge
                          position="absolute"
                          top="0"
                          right="0"
                          colorScheme="red"
                          transform="translate(25%, -25%)"
                          borderRadius="full"
                          size="xs"
                        >
                          3
                        </Badge>
                      </>}
                      variant="ghost"
                      colorScheme="blue"
                      size="md"
                    />
                  </Tooltip>
                  
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={'full'}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}
                    >
                      <HStack>
                        <Avatar
                          size={'sm'}
                          name={user?.name}
                          bg="blue.500"
                        />
                        <Text display={{ base: 'none', md: 'block' }} fontWeight="medium">
                          {user?.name?.split(' ')[0]}
                        </Text>
                      </HStack>
                    </MenuButton>
                    <MenuList zIndex={1001}>
                      <Box px={3} py={2} mb={2}>
                        <Text fontWeight="bold">{user?.name}</Text>
                        <Text fontSize="sm" opacity={0.8}>
                          {user?.email}
                        </Text>
                        <Badge mt={2} colorScheme={user?.role === 'admin' ? 'purple' : 'green'}>
                          {user?.role}
                        </Badge>
                      </Box>
                      <MenuDivider />
                      <MenuItem as={RouterLink} to={user?.role === 'admin' ? '/admin' : '/student'} icon={<Icon as={HamburgerIcon} />}>
                        Dashboard
                      </MenuItem>
                      <MenuItem as={RouterLink} to="/profile" icon={<Icon as={HamburgerIcon} />}>
                        Profile
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem onClick={handleLogout} icon={<Icon as={HamburgerIcon} />}>
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    fontSize={'sm'}
                    fontWeight={500}
                    variant={'link'}
                    to={'/login'}
                    color={useColorModeValue('gray.600', 'gray.200')}
                    _hover={{
                      color: useColorModeValue('blue.500', 'blue.300'),
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    as={RouterLink}
                    display={{ base: 'none', sm: 'inline-flex' }}
                    fontSize={'sm'}
                    fontWeight={600}
                    color={'white'}
                    bg={'blue.500'}
                    to={'/register'}
                    _hover={{
                      bg: 'blue.400',
                    }}
                    rounded="md"
                    px={5}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Stack>
          </Flex>
        </Container>
      </Flex>

      {/* Only show collapse menu on homepage */}
      {isHomePage && (
        <Collapse in={isMenuOpen} animateOpacity>
          <Box 
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow="md"
            borderBottomRadius="md"
            borderTop="1px solid"
            borderTopColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <Container maxW="8xl" px={4}>
              <MobileNav isAuthenticated={isAuthenticated} user={user} />
            </Container>
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

const DesktopNav = ({ isAuthenticated, user, currentPath }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkActiveColor = useColorModeValue('blue.600', 'blue.300');
  const linkHoverColor = useColorModeValue('blue.500', 'blue.300');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={1}>
      {NAV_ITEMS
        .filter(item => {
          // Filter nav items based on authentication status and user role
          if (!item.requireAuth && !item.requireRole) return true;
          if (item.requireAuth && !isAuthenticated) return false;
          if (item.requireRole && item.requireRole !== user?.role) return false;
          return true;
        })
        .map((navItem) => {
          const isActive = currentPath === navItem.href || 
                         (navItem.children && navItem.children.some(child => currentPath === child.href));
          
          return (
            <Box key={navItem.label}>
              <Popover trigger={'hover'} placement={'bottom-start'} gutter={0}>
                <PopoverTrigger>
                  <Link
                    p={2}
                    px={4}
                    as={RouterLink}
                    to={navItem.href ?? '#'}
                    fontSize={'sm'}
                    fontWeight={isActive ? 600 : 500}
                    color={isActive ? linkActiveColor : linkColor}
                    position="relative"
                    _hover={{
                      textDecoration: 'none',
                      color: linkHoverColor,
                    }}
                    _after={isActive ? {
                      content: '""',
                      position: 'absolute',
                      bottom: '-5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '2px',
                      borderRadius: 'full',
                      backgroundColor: linkActiveColor,
                    } : {}}
                  >
                    {navItem.label}
                  </Link>
                </PopoverTrigger>

                {navItem.children && (
                  <PopoverContent
                    border={0}
                    boxShadow={'lg'}
                    bg={popoverContentBgColor}
                    p={2}
                    rounded={'md'}
                    minW={'sm'}
                    mt={2}
                  >
                    <Stack>
                      {navItem.children.map((child) => (
                        <DesktopSubNav 
                          key={child.label} 
                          {...child} 
                          isActive={currentPath === child.href}
                        />
                      ))}
                    </Stack>
                  </PopoverContent>
                )}
              </Popover>
            </Box>
          );
        })}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel, isActive }) => {
  const activeColor = useColorModeValue('blue.600', 'blue.300');
  const hoverBg = useColorModeValue('blue.50', 'gray.700');
  
  return (
    <Link
      as={RouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={3}
      rounded={'md'}
      _hover={{ bg: hoverBg }}
      bg={isActive ? hoverBg : 'transparent'}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            color={isActive ? activeColor : undefined}
            fontWeight={isActive ? 600 : 500}
          >
            {label}
          </Text>
          {subLabel && (
            <Text fontSize={'sm'} color={isActive ? activeColor : 'gray.500'}>
              {subLabel}
            </Text>
          )}
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={activeColor} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ isAuthenticated, user }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS
        .filter(item => {
          // Filter nav items based on authentication status and user role
          if (!item.requireAuth && !item.requireRole) return true;
          if (item.requireAuth && !isAuthenticated) return false;
          if (item.requireRole && item.requireRole !== user?.role) return false;
          return true;
        })
        .map((navItem) => (
          <MobileNavItem key={navItem.label} {...navItem} />
        ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link 
                key={child.label} 
                py={2} 
                as={RouterLink}
                to={child.href}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Admin',
    requireAuth: true,
    requireRole: 'admin',
    children: [
      {
        label: 'Dashboard',
        subLabel: 'Overview of fee statistics',
        href: '/admin',
      },
      {
        label: 'Manage Fees',
        subLabel: 'View and manage all fees',
        href: '/admin/fees',
      },
      {
        label: 'Create Fee',
        subLabel: 'Add a new fee',
        href: '/admin/fees/create',
      },
      {
        label: 'Manage Students',
        subLabel: 'View and manage students',
        href: '/admin/students',
      },
      {
        label: 'Add Student',
        subLabel: 'Register a new student',
        href: '/admin/students/new',
      },
    ],
  },
  {
    label: 'Student',
    requireAuth: true,
    requireRole: 'student',
    children: [
      {
        label: 'Dashboard',
        subLabel: 'Student fee overview',
        href: '/student',
      },
      {
        label: 'My Fees',
        subLabel: 'View all your fees',
        href: '/student/fees',
      },
      {
        label: 'Pay Fees',
        subLabel: 'Make fee payments',
        href: '/student/fees',
      },
      {
        label: 'Payment History',
        subLabel: 'View your payment history',
        href: '/student/payments',
      },
    ],
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Help & FAQ',
    href: '/help',
  },
];

export default Navbar; 