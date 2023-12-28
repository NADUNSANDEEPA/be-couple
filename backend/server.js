const express = require('express');
const mongoose = require('mongoose');
const user = require('./routes/user');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 5000;


// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins (not recommended for production)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware to parse JSON in request body
app.use(express.json());


// Connect to MongoDB using the URL from .env
const mongoDBURL = process.env.MONGODB_URL;
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use('/user', user);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
