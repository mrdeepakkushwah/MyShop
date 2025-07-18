import jwt from "jsonwebtoken";
const { verify } = jwt;

import User from "../models/userModel.js"; // ✅ Corrected import

// 🔐 Authenticate Middleware
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. Token missing." });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Authenticated: ${user.email} (${user.role})`);
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please login again." });
    }
    return res
      .status(403)
      .json({ message: "Invalid or expired token.", error: err.message });
  }
};

// 🔒 Role-based Access Middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

export { authenticate, authorizeRoles };
