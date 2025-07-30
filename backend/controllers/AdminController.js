// backend/controllers/adminController.js
import User from "../models/userModel.js";

// ✅ UPDATE USER
export const AdminUserUpdateById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const io = req.app.get("io"); // 👈 Access Socket.IO
    io.emit("userUpdated", updatedUser); // 🔁 Broadcast update

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE USER
export const AdminUseraDeletById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const io = req.app.get("io");
    io.emit("userDeleted", deletedUser._id); // 🔁 Broadcast deletion

    res.status(200).json({ message: "User deleted", id: deletedUser._id });
  } catch (err) {
    next(err);
  }
};

