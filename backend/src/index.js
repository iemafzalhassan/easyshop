const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const routes = require('./api/v1/routes');

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug environment variables
console.log('Environment Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
console.log('Cloudinary Config Present:', {
    cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
    api_key: !!process.env.CLOUDINARY_API_KEY,
    api_secret: !!process.env.CLOUDINARY_API_SECRET
});

// Verify critical environment variables
if (!process.env.MONGODB_URI) {
    console.error('Missing MongoDB URI in environment variables');
    process.exit(1);
}

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing required Cloudinary environment variables');
    process.exit(1);
}

const app = express();

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// MongoDB Connection with retry logic
const connectDB = async (retries = 5) => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
            maxPoolSize: 10,
            minPoolSize: 2,
            connectTimeoutMS: 10000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Test the connection by running a simple query
        await mongoose.connection.db.admin().ping();
        console.log('MongoDB connection test successful');
        
        return conn;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        if (retries > 0) {
            console.log(`Retrying connection... (${retries} attempts remaining)`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectDB(retries - 1);
        } else {
            console.error('Failed to connect to MongoDB after multiple attempts');
            process.exit(1);
        }
    }
};

// Connect to MongoDB
connectDB().then(() => {
    // Apply CORS before other middleware
    app.use(cors(corsOptions));
    
    // Middleware
    app.use(express.json());
    app.use(morgan('dev'));

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('Created uploads directory:', uploadsDir);
    }

    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Routes
    app.use('/api/v1', routes);

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        res.status(statusCode).json({
            status: 'error',
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    });

    // 404 handler - MOVED TO END OF MIDDLEWARE CHAIN
    app.use((req, res) => {
        res.status(404).json({
            status: 'error',
            message: `Route not found: ${req.originalUrl}`
        });
    });

    // Start server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        });
});
