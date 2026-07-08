import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.status = error.status || 401;
    next(error);
  }
};

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error("Forbidden");
    error.status = 403;
    return next(error);
  }
  return next();
};
