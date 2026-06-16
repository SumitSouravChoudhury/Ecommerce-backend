const User = require("../models/user");
const { hashPassword } = require("../utils/encryptPassword");

const handleListAllUsers = async (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      User.find({}).select("-password").skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    if (users.length === 0)
      return res.status(404).json({ success: false, message: "No user found" });

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleListUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User id not found" });

    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    next(error);
  }
};

const handleUpdateUserById = async (req, res, next) => {
  const { userId } = req.params;
  const { fullName, email, password, role } = req.body;

  try {
    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (password) updates.password = await hashPassword(password);

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    next(error);
  }
};

const handleDeleteUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User id not found" });

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleListAllUsers,
  handleListUserById,
  handleUpdateUserById,
  handleDeleteUserById,
};
