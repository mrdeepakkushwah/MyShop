// authRoutes.js
import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  signup,
  loginUser,
  logoutUser,
  updateUserData,
  getUserData,
} from "../controllers/authController.js";

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected Routes
router.get("/me", authenticate, getUserData);
router.put("/update-profile", authenticate, updateUserData);

export default router;
