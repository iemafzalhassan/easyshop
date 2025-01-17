const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/app');
const connectDB = require('./config/database');
const errorHandler = require('./api/v1/middlewares/error.middleware');

// Create Express app
const app = express();

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan(config.logs));

// API Routes (v1)
app.use('/api/v1/auth', require('./api/v1/routes/auth.routes'));
app.use('/api/v1/products', require('./api/v1/routes/product.routes'));
app.use('/api/v1/shops', require('./api/v1/routes/shop.routes'));

// Error Handling
app.use(errorHandler);

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
