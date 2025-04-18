const User = require('../models/User');
const Fee = require('../models/Fee');
const Payment = require('../models/Payment');

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get student by ID
// @route   GET /api/admin/students/:id
// @access  Private (Admin)
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    
    if (!student || student.role !== 'student') {
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

// @desc    Create student
// @route   POST /api/admin/students
// @access  Private (Admin)
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, registrationNumber, course, semester, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email and password'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Check if registration number is unique if provided
    if (registrationNumber) {
      const regNumberExists = await User.findOne({ registrationNumber });
      if (regNumberExists) {
        return res.status(400).json({
          success: false,
          error: 'Registration number already in use'
        });
      }
    }

    // Type validation for numeric fields
    const semesterValue = parseInt(semester);
    if (isNaN(semesterValue) || semesterValue < 1 || semesterValue > 8) {
      return res.status(400).json({
        success: false,
        error: 'Semester must be a valid number between 1 and 8'
      });
    }

    // Create student with all fields
    const studentData = {
      name,
      email,
      password,
      role: 'student', // Ensure role is always student
      course,
      semester: semesterValue,
      phone,
      address
    };

    // Only add registration number if provided
    if (registrationNumber) {
      studentData.registrationNumber = registrationNumber;
    }

    const student = await User.create(studentData);

    // Remove password from response
    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(201).json({
      success: true,
      data: studentResponse
    });
  } catch (err) {
    console.error('Error creating student:', err);
    
    // Handle validation errors specifically
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    // Handle duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field === 'email' ? 'Email' : 'Registration number'} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      error: err.message || 'Server error'
    });
  }
};

// @desc    Update student
// @route   PUT /api/admin/students/:id
// @access  Private (Admin)
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, registrationNumber, course, semester } = req.body;
    
    const student = await User.findByIdAndUpdate(
      req.params.id, 
      { name, email, registrationNumber, course, semester },
      { new: true, runValidators: true }
    );
    
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

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create fee for student
// @route   POST /api/admin/students/:id/fees
// @access  Private (Admin)
exports.createFee = async (req, res) => {
  try {
    const { amount, feeType, semester, dueDate, description } = req.body;
    
    const student = await User.findById(req.params.id);
    
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const fee = await Fee.create({
      student: student._id,
      amount,
      feeType,
      semester,
      dueDate,
      description,
      createdBy: req.user.id
    });

    res.status(201).json({
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

// @desc    Get all fees
// @route   GET /api/admin/fees
// @access  Private (Admin)
exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student', 'name registrationNumber');
    
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

// @desc    Get fee by ID
// @route   GET /api/admin/fees/:id
// @access  Private (Admin)
exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('student');
    
    if (!fee) {
      return res.status(404).json({
        success: false,
        error: 'Fee not found'
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

// @desc    Update fee
// @route   PUT /api/admin/fees/:id
// @access  Private (Admin)
exports.updateFee = async (req, res) => {
  try {
    const { amount, feeType, semester, dueDate, description, status } = req.body;
    
    const fee = await Fee.findByIdAndUpdate(
      req.params.id, 
      { amount, feeType, semester, dueDate, description, status },
      { new: true, runValidators: true }
    );
    
    if (!fee) {
      return res.status(404).json({
        success: false,
        error: 'Fee not found'
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

// @desc    Delete fee
// @route   DELETE /api/admin/fees/:id
// @access  Private (Admin)
exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    
    if (!fee) {
      return res.status(404).json({
        success: false,
        error: 'Fee not found'
      });
    }

    await fee.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('student', 'name registrationNumber')
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

// @desc    Get payment statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin)
exports.getPaymentStatistics = async (req, res) => {
  try {
    // Total students
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Total fees
    const totalFees = await Fee.countDocuments();
    
    // Total amount due
    const feesData = await Fee.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    // Total payments
    const totalPayments = await Payment.countDocuments();
    
    // Total amount paid
    const paymentData = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalPaid: { $sum: '$amount' }
        }
      }
    ]);

    const statistics = {
      totalStudents,
      totalFees,
      totalPayments,
      feesData,
      totalPaid: paymentData.length > 0 ? paymentData[0].totalPaid : 0
    };

    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}; 