// authRoutes.js
const express = require("express");
const { authenticate, authorizeRoles }  = require("../middlewares/authMiddleware.js");
const {
  signup,
  loginUser,
  logoutUser,
  updateUserData,
  getUserData,
  getAllUsers,
  ForgetPassword,
  deleteUser,
}  = require("../controllers/authController.js");
const { AdminUserUpdateById, AdminUseraDeletById }  = require("../controllers/AdminController.js");
const { getOrdersAdmin }  = require("../controllers/ordersController.js");

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
// router.patch("/admin/update-user/:id", authenticate, authorizeRoles("admin"), AdminUserUpdateById);
router.patch(
  "/admin/update-user/:id",
  authenticate,
  authorizeRoles("admin"),
  AdminUserUpdateById
);
router.delete('/admin/delete-user/:id', authenticate, authorizeRoles('admin'), AdminUseraDeletById);

module.exports =  router;
