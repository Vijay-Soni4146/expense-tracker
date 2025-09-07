const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack);

  // Default error
  let error = {
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500
  };

  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    error.message = 'Duplicate entry found';
    error.statusCode = 400;
  }

  // MySQL connection error
  if (err.code === 'ECONNREFUSED') {
    error.message = 'Database connection failed';
    error.statusCode = 503;
  }

  // Validation error
  if (err.name === 'ValidationError') {
    error.message = 'Validation failed';
    error.statusCode = 400;
    error.errors = err.details;
  }

  res.status(error.statusCode).json(error);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };