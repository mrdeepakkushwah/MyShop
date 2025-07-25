// authRoutes.js
import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  signup,
  loginUser,
  logoutUser,
  updateUserData,
  getUserData,
  getAllUsers,
  ForgetPassword,
  deleteUser,
} from "../controllers/authController.js";
import { getOrdersAdmin } from "../controllers/ordersController.js";

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forget-password",ForgetPassword)
// Protected Routes
router.delete("/admin/delete-user",authenticate,authorizeRoles('admin'),deleteUser);
router.get('/admin/users',authenticate,getAllUsers);
router.get("/me", authenticate, getUserData);
router.put("/update-profile", authenticate, updateUserData);
router.get('/admin/getorders',authenticate,authorizeRoles("admin"),getOrdersAdmin)

export default router;
