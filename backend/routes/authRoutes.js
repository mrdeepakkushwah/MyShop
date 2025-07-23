// authRoutes.js
import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  signup,
  loginUser,
  logoutUser,
  updateUserData,
  getUserData,
  ForgetPassword,
  deleteUser,
} from "../controllers/authController.js";

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forget-password",ForgetPassword)
// Protected Routes
router.delete("/admin/delete-user",authenticate,authorizeRoles('admin'),deleteUser);
router.get('/admin/users',authenticate,getUserData);
router.get("/me", authenticate, getUserData);
router.put("/update-profile", authenticate, updateUserData);

export default router;
