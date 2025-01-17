const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://easyshop.com', 'https://admin.easyshop.com']  // Add your production domains
    : ['http://localhost:3000', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
