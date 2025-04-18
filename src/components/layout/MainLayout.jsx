import React, { useEffect } from 'react';
import { Box, Drawer, DrawerContent, useDisclosure, useColorModeValue } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';
  
  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname, isOpen, onClose]);
  
  // Dynamic colors based on color mode
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box 
      minH="100vh" 
      bg={bgColor} 
      display="flex" 
      flexDirection="column"
      width="100%" 
    >
      <Navbar onOpen={onOpen} />
      
      {/* Only render Sidebar if not on homepage */}
      {!isHomePage && <Sidebar onClose={onClose} isOpen={isOpen} />}
      
      {/* Only show drawer when not on homepage */}
      {!isHomePage && (
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <Sidebar onClose={onClose} />
          </DrawerContent>
        </Drawer>
      )}
      
      <Box 
        ml={{ base: 0, md: isHomePage ? 0 : 60 }} 
        p={{ base: 4, sm: 6, md: 8 }} 
        pt={{ base: "80px", md: "90px" }} 
        flex="1" 
        width="100%" 
        transition="margin-left 0.3s ease"
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout; 