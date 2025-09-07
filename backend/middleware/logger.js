const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

  // Log request body for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

// API response logger
const responseLogger = (req, res, next) => {
  const originalSend = res.send;

  res.send = function(data) {
    if (res.statusCode >= 400) {
      console.log('Error Response:', data);
    }

    originalSend.call(this, data);
  };

  next();
};

module.exports = { requestLogger, responseLogger };