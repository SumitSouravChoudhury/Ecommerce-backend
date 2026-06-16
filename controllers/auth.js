const User = require("../models/user");

const { createToken } = require("../services/auth");
const { hashPassword, comparePassword } = require("../utils/encryptPassword");

const handleUserSignup = async (req, res, next) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName)
    return res
      .status(400)
      .json({ success: false, message: "Full Name is required" });
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });

  try {
    await User.create({
      fullName,
      email,
      password: await hashPassword(password),
      role,
    });

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

const handleUserLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Email does not exists" });

    const match = await comparePassword(password, user.password);

    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    const token = createToken(user);

    return res
      .status(200)
      .setHeader("Authorization", `Bearer ${token}`)
      .json({ message: "Signed in successfully", userId: user._id });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleUserSignup, handleUserLogin };
