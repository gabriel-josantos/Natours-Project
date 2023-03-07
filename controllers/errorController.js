const AppError = require('../utils/appError');

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  // Aqui o AppError foi usado porque eu quero a propriedade isOperational=true
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err) {
  const message = ` Duplicate field value: ${err.keyValue.name}. Please use another value!`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

function handleJWTError() {
  return new AppError('Invalid token. Please log in again', 401);
}

function handleJWTExpiredError() {
  return new AppError('Your token has expired! Please log in again', 401);
}

function sendErrorDev(err, req, res) {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //Rendered Website
  console.error('Error ❗', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
}

function sendErrorProd(err, req, res) {
  //Operational, trusted errors: send message to client
  // a) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.staus,
        message: err.message,
      });
      //Programming or other unknown error: don't leak error details
    }
    //1) Log error
    console.error('Error ❗', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  // b)  Rendered Website
  if (err.isOperational) {
    console.error('Error ❗', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  //1) Log error
  //Programming or other unknown error: don't leak error details
  console.error('Error ❗', err);
  // 2) Send generic message
  return res.status(500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
}

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
