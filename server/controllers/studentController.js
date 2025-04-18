const User = require('../models/User');
const Fee = require('../models/Fee');
const Payment = require('../models/Payment');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student)
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student)
exports.updateStudentProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const student = await User.findByIdAndUpdate(
      req.user.id, 
      { name, email },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get student fees
// @route   GET /api/student/fees
// @access  Private (Student)
exports.getStudentFees = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.user.id });
    
    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get student fee by ID
// @route   GET /api/student/fees/:id
// @access  Private (Student)
exports.getStudentFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    
    if (!fee) {
      return res.status(404).json({
        success: false,
        error: 'Fee not found'
      });
    }

    // Make sure student is viewing their own fee
    if (fee.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this fee'
      });
    }

    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Make fee payment
// @route   POST /api/student/fees/:id/pay
// @access  Private (Student)
exports.payFee = async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId } = req.body;
    
    const fee = await Fee.findById(req.params.id);
    
    if (!fee) {
      return res.status(404).json({
        success: false,
        error: 'Fee not found'
      });
    }

    // Make sure student is paying their own fee
    if (fee.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to pay this fee'
      });
    }

    // Create payment
    const payment = await Payment.create({
      student: req.user.id,
      fee: fee._id,
      amount,
      paymentMethod,
      transactionId,
      status: 'completed'
    });

    // Update fee status
    if (amount >= fee.amount) {
      fee.status = 'paid';
    } else if (amount > 0) {
      fee.status = 'partial';
    }
    await fee.save();

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get payment history
// @route   GET /api/student/payments
// @access  Private (Student)
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.id })
      .populate('fee')
      .sort('-paymentDate');
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get payment receipt
// @route   GET /api/student/payments/:id/receipt
// @access  Private (Student)
exports.getPaymentReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('fee')
      .populate('student');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Make sure student is viewing their own payment
    if (payment.student._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this payment'
      });
    }

    // Generate receipt data
    const receiptData = {
      receiptNumber: payment.receiptNumber,
      studentName: payment.student.name,
      registrationNumber: payment.student.registrationNumber,
      feeType: payment.fee.feeType,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      status: payment.status
    };

    res.status(200).json({
      success: true,
      data: receiptData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}; 