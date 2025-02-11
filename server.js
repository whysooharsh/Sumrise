const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));
app.use(express.json());

// Routes
app.use('/post', require('./routes/post'));
app.use('/auth', require('./routes/auth'));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 