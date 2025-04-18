import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';

// Layout components
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import Fees from './components/admin/Fees';
import CreateFee from './components/admin/CreateFee';
import CreateStudent from './components/admin/CreateStudent';
import FeeDetail from './components/admin/FeeDetail';
import AdminStudents from './components/admin/AdminStudents';
import AdminPayments from './components/admin/AdminPayments';

// Student components
import StudentDashboard from './components/student/StudentDashboard';
import StudentFees from './components/student/StudentFees';
import StudentPayments from './components/student/StudentPayments';
import PayFee from './components/student/PayFee';
import PaymentReceipt from './components/student/PaymentReceipt';
import StudentProfile from './components/student/StudentProfile';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

// Other components
import Home from './components/Home';
import NotFound from './components/NotFound';
import About from './components/About';
import ContactUs from './components/ContactUs';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <MainLayout>
                <Home />
              </MainLayout>
            } />
            <Route path="/about" element={
              <MainLayout>
                <About />
              </MainLayout>
            } />
            <Route path="/contact" element={
              <MainLayout>
                <ContactUs />
              </MainLayout>
            } />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/fees" element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <Fees />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/fees/:id" element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <FeeDetail />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/fees/create" element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <CreateFee />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/students" element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <AdminStudents />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/students/new" element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <CreateStudent />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/payments" element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <AdminPayments />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute roles={['student']}>
                <MainLayout>
                  <StudentDashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/fees" element={
              <ProtectedRoute roles={['student']}>
                <MainLayout>
                  <StudentFees />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/fees/:id/pay" element={
              <ProtectedRoute roles={['student']}>
                <MainLayout>
                  <PayFee />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Add a direct route for convenient access */}
            <Route path="/student/pay-fee/:id" element={
              <ProtectedRoute roles={['student']}>
                <MainLayout>
                  <PayFee />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/payments" element={
              <ProtectedRoute roles={['student']}>
                <MainLayout>
                  <StudentPayments />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/payments/:id/receipt" element={
              <ProtectedRoute roles={['student']}>
                <MainLayout>
                  <PaymentReceipt />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute roles={['student']}>
                <MainLayout>
                  <StudentProfile />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
