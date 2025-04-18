const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Register and login routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router; 