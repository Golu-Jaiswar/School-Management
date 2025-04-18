const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-fees-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample users data
const userData = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Student User',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
    registrationNumber: 'REG-2023-001',
    course: 'Computer Science',
    semester: 3
  }
];

// Import data into DB
const importData = async () => {
  try {
    // Clear the database first
    await User.deleteMany();
    
    // Create users
    await User.create(userData);
    
    console.log('Data imported successfully');
    process.exit();
  } catch (err) {
    console.error('Error importing data:', err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data deleted successfully');
    process.exit();
  } catch (err) {
    console.error('Error deleting data:', err);
    process.exit(1);
  }
};

// Process command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use the correct command:');
  console.log('node seedData.js -i (to import data)');
  console.log('node seedData.js -d (to delete data)');
  process.exit();
} 