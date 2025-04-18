const express = require('express');
const {
  getStudentProfile,
  updateStudentProfile,
  getStudentFees,
  getStudentFeeById,
  payFee,
  getPaymentHistory,
  getPaymentReceipt
} = require('../controllers/studentController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);
router.use(authorize('student'));

// Profile routes
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);

// Fee routes
router.get('/fees', getStudentFees);
router.get('/fees/:id', getStudentFeeById);
router.post('/fees/:id/pay', payFee);

// Payment routes
router.get('/payments', getPaymentHistory);
router.get('/payments/:id/receipt', getPaymentReceipt);

module.exports = router; 