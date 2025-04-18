import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Flex } from '@chakra-ui/react';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <CircularProgress isIndeterminate color="blue.500" />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    // Save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // User doesn't have required role, redirect to appropriate dashboard
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
};

export default ProtectedRoute; 