const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7); // Extract token after 'Bearer '

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      try {
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
          return res.status(401).json({ message: "User not found." });
        }
        req.user = user;
        next();
      } catch (dbError) {
        return res
          .status(500)
          .json({ message: "Database error.", error: dbError.message });
      }
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token has expired. Please login again." });
      }
      return res
        .status(403)
        .json({ message: "Invalid or expired token.", error: err.message });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token." });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
};

module.exports = { authenticate, adminOnly };
