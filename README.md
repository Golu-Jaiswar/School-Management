# College Fees Management System

A full-stack web application for managing college fees, built with React, Node.js, Express, and MongoDB.

## Features

- **Admin Panel**: Create and manage students, fees, and payments
- **Student Portal**: View and pay fees
- **Authentication**: Secure user authentication for both admin and students
- **Dashboard**: Visual reports and statistics
- **Fee Management**: Create, view, update, and delete fee records

## Tech Stack

### Frontend
- React
- Chakra UI 
- React Router
- Axios
- Three.js (for 3D visualizations)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)

## Installation and Setup

### 1. Clone the repository
```
git clone https://github.com/your-username/college-fees-management.git
cd college-fees-management
```

### 2. Install frontend dependencies
```
npm install
```

### 3. Install backend dependencies
```
cd server
npm install
```

### 4. Configure environment variables
Create a `.env` file in the server directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/college-fees-management
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

### 5. Run the application

#### Start the backend server
```
# In the server directory
npm run dev
```

#### Start the frontend development server
```
# In the root directory
npm run dev
```

## Usage

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Default Admin Account
- Email: admin@example.com
- Password: password123

### Default Student Account
- Email: student@example.com
- Password: password123

## License

MIT
