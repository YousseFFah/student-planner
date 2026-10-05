const errorHandling = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Internal Server Error",
    success: false,
  });
};

export default errorHandling;