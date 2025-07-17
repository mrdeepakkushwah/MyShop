const express = require("express");
const router = express.Router();

const {
  authenticate,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const {
  signup,
  loginUser,
  logoutUser,
  updateUserData,
  getUserData,
} = require("../controllers/authController");

// 📌 Public Routes
router.post("/signup", signup);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// 🔐 Protected Routes
router.get("/me", authenticate, getUserData);
router.put("/update-profile", authenticate, updateUserData);

// ✅ Example: Admin-only route (optional, if needed)
// router.get("/admin-only", authenticate, authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Welcome, Admin!" });
// });

module.exports = router;
