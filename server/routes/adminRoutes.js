const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  createFee,
  getAllFees,
  getFeeById,
  updateFee,
  deleteFee,
  getAllPayments,
  getPaymentStatistics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// Student routes
router.route('/students')
  .get(getAllStudents)
  .post(createStudent);

router.route('/students/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

router.post('/students/:id/fees', createFee);

// Fee routes
router.route('/fees')
  .get(getAllFees);

router.route('/fees/:id')
  .get(getFeeById)
  .put(updateFee)
  .delete(deleteFee);

// Payment routes
router.get('/payments', getAllPayments);

// Statistics route
router.get('/statistics', getPaymentStatistics);

module.exports = router; 