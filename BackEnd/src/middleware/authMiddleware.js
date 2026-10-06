import jwt from "jsonwebtoken";
import AppError from "../utilities/appError.js";

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(new AppError("No token provided", 401));
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return next(new AppError("Invalid token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

export default authMiddleware;