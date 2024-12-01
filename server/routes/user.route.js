const express = require("express");
const router = express.Router();
const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");

// User Registration
router.post("/register", async (req, res) => {
  try {
    // Check if all required fields are present
console.log(req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(201).json({
        message: "Email and password are required",
        success: false,
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res
        .status(202)
        .json({ message: "User already exists", success: false });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();

    res.status(200).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
      data: error,
      success: false,
    });
  }
});

// User Login
router.post("/login", async (req, res) => {

  
  try {
    const { email, password, panel } = req.body; // Added 'panel' from client

    // check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(202)
        .json({ message: "User does not exist", success: false });
    }

    const userPanel = user.isAdmin ? "admin" : "user";

    // check if the user is logging in as the correct role
    if (userPanel !== panel) {
      return res.status(203).json({
        message: `Unauthorized: Login as ${userPanel}`,
        success: false,
      });
    }

    // check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(201)
        .json({ message: "Invalid password", success: false });
    }

    res.status(200).json({
      message: "Otp VERIFICATION!",
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Fetch User
router.get("/get-user", authMiddleware, async (req, res) => {
  try {
    // Assuming authMiddleware sets req.user
    const userId = req.user.userId; // Adjust based on your authMiddleware implementation
    const user = await User.findById(userId).select("-password"); // Exclude password


    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User info fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Logout
router.post("/logout", (req, res) => {

  // Ensure the name 'token' matches the one set during login
  res.clearCookie("token", {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // Set based on environment
    secure: false,
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully", success: true });
});

module.exports = router;
