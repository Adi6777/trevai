const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const User = require("../models/user");

const getBearerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
};

const protect = async (req, res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      throw new AppError("Authentication token missing", 401);
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError("JWT secret is not configured", 500);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      throw new AppError("User account no longer exists", 401);
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid authentication token", 401));
    }

    if (error.name === "TokenExpiredError") {
      return next(new AppError("Authentication token expired", 401));
    }

    next(error);
  }
};

module.exports = protect;
