import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  profileUpdateSchema,
  userLoginSchema,
  userRegisterSchema,
  validate,
} from "../middleware/validate.js";

const router = express.Router();

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.__v;
  return obj;
};

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

router.post("/register", validate(userRegisterSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      provider: "local",
      isAdmin:
        process.env.ADMIN_EMAIL &&
        normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase(),
    });

    const token = generateToken(user._id);
    return res.status(201).json({ success: true, token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
});

router.post("/login", validate(userLoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    return res.json({ success: true, token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});

router.put("/update", protect, validate(profileUpdateSchema), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          address: req.body.address,
          state: req.body.state,
          district: req.body.district,
          pincode: req.body.pincode,
          landmark: req.body.landmark,
        },
      },
      { new: true }
    );

    res.json({ success: true, user: sanitizeUser(updatedUser) });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

export default router;
