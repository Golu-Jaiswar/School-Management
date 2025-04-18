const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fee',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount']
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'upi'],
    required: true
  },
  transactionId: {
    type: String
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed'
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate receipt number before saving
PaymentSchema.pre('save', function(next) {
  if (!this.receiptNumber) {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    this.receiptNumber = `RCP-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema); 