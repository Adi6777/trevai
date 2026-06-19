const User = require("../models/user");
const generateToken = require("../utils/generatetoken");

const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!fullName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required"
      });
    }

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};


const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile
};
