const express = require("express");
const router = express.Router();
const {authenticate } = require('../middlewares/authMiddleware');
const {
  signup,
  loginUser,
  logoutUser,
  updateUserData,
  getUserData,
} = require('../controllers/authController');

router.post("/signup", signup);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get('/me',authenticate,getUserData)
router.put("/update-profile", authenticate, updateUserData);

module.exports = router;
