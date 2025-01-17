const mongoose = require('mongoose');

const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    connectTimeoutMS: 10000,
  };

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.info('MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Implement retry logic
    if (error.name === 'MongooseServerSelectionError') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
