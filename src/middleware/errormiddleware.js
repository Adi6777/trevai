const normalizeMongooseError = (err) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");

    return {
      statusCode: 400,
      message
    };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";

    return {
      statusCode: 409,
      message: `${field} already exists`
    };
  }

  if (err.name === "CastError") {
    return {
      statusCode: 400,
      message: "Invalid resource id"
    };
  }

  return {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error"
  };
};

const errorHandler = (err, req, res, next) => {
  const normalizedError = normalizeMongooseError(err);
  const isServerError = normalizedError.statusCode >= 500;

  if (isServerError) {
    console.error(err);
  }

  res.status(normalizedError.statusCode).json({
    success: false,
    message: isServerError
      ? "Something went wrong on our end"
      : normalizedError.message
  });
};

module.exports = errorHandler;
