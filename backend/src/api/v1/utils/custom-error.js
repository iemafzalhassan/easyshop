class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const createCustomError = (message, statusCode) => {
  return new CustomError(message, statusCode);
};

module.exports = {
  CustomError,
  createCustomError
};
