import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set axios defaults when token changes
  useEffect(() => {
    if (token) {
      console.log('Setting auth header with token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('Removing auth header');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Setup interceptor for API base URL
  useEffect(() => {
    // Set base URL for all requests
    axios.defaults.baseURL = 'http://localhost:5000/api';
    
    // Add request interceptor to ensure auth header is set for all requests
    const interceptor = axios.interceptors.request.use(
      (config) => {
        // Get token from state
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          config.headers['Authorization'] = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Clean up interceptor when component unmounts
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const loadUser = async () => {
      if (!token) {
        console.log('No token found, user not authenticated');
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }
      
      try {
        console.log('Attempting to load user with token');
        const res = await axios.get('/auth/me');
        console.log('User data loaded:', res.data);
        
        if (isMounted) {
          setUser(res.data.data);
          setIsAuthenticated(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading user:', err.message);
        if (err.response && err.response.status === 401) {
          console.warn('Authentication token expired or invalid. Logging out.');
        }
        
        if (isMounted) {
          // Clear authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError(err.response?.data?.error || 'Authentication failed');
          setLoading(false);
        }
      }
    };

    loadUser();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/auth/register', userData);
      
      // Store token in localStorage
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Update state
      setToken(newToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      const res = await axios.post('/auth/login', { email, password });
      console.log('Login successful:', res.data);
      
      // Store token in localStorage
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Set token in axios headers immediately
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Update state
      setToken(newToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setLoading(false);
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.get('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove token from axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear errors
  const clearErrors = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 