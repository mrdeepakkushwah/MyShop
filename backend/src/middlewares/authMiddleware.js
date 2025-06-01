const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Access denied. Invalid token format." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.warn("User not found for token:", decoded.userId);
      return res
        .status(401)
        .json({ error: "Invalid token or user not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired." });
    }
    return res.status(400).json({ error: "Invalid token." });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
};


const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = { authMiddleware, adminOnly ,authenticate,};
