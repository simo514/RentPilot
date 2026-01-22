import logger from '../utils/logger.js';

// Handle async errors without try-catch blocks
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error: don't leak error details
    logger.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// Handle specific MongoDB errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return { message, statusCode: 400, isOperational: true };
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${field} = '${value}'. Please use another value.`;
  return { message, statusCode: 400, isOperational: true };
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return { message, statusCode: 400, isOperational: true };
};

// Handle JWT errors
const handleJWTError = () => {
  return { message: 'Invalid token. Please log in again.', statusCode: 401, isOperational: true };
};

const handleJWTExpiredError = () => {
  return { message: 'Your token has expired. Please log in again.', statusCode: 401, isOperational: true };
};

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  if (err.statusCode >= 500) {
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
      error: err,
      stack: err.stack,
    });
  } else {
    logger.warn(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode;
    error.status = err.status;
    error.isOperational = err.isOperational;

    // Handle specific error types
    if (err.name === 'CastError') {
      const handledError = handleCastErrorDB(err);
      error = { ...error, ...handledError };
    }
    
    if (err.code === 11000) {
      const handledError = handleDuplicateFieldsDB(err);
      error = { ...error, ...handledError };
    }
    
    if (err.name === 'ValidationError') {
      const handledError = handleValidationErrorDB(err);
      error = { ...error, ...handledError };
    }
    
    if (err.name === 'JsonWebTokenError') {
      const handledError = handleJWTError();
      error = { ...error, ...handledError };
    }
    
    if (err.name === 'TokenExpiredError') {
      const handledError = handleJWTExpiredError();
      error = { ...error, ...handledError };
    }

    sendErrorProd(error, res);
  }
};

// Handle 404 errors for undefined routes
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  error.status = 'fail';
  error.isOperational = true;
  next(error);
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...', {
      error: err,
      stack: err.stack,
    });
    
    // Give server time to finish pending requests
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });
};

// Handle uncaught exceptions
export const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down immediately...', {
      error: err,
      stack: err.stack,
    });
    
    // Exit immediately for uncaught exceptions
    process.exit(1);
  });
};
