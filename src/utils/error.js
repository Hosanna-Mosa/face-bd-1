'use strict';

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      message: 'Not Found',
      path: req.originalUrl,
    },
  });
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;

  res.status(status).json({
    success: false,
    error: {
      message,
      details,
    },
  });
}

class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

module.exports = { notFoundHandler, errorHandler, ApiError };


