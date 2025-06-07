const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
};

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token has expired. Please login again." });
      }
      return res.status(403).json({ message: "Invalid or expired token." ,error:err.message});
    }
  }else{
     return res.status(401).json({ message: "Not authorized, no token" });
  }
  
};

module.exports = { adminOnly ,authenticate,};
