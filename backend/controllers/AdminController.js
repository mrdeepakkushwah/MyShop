// backend/controllers/adminController.js
const  User = require("../models/userModel.js");

// ✅ UPDATE USER
const AdminUserUpdateById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE USER
 const AdminUseraDeletById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted", id: deletedUser._id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  AdminUserUpdateById,
  AdminUseraDeletById
}

