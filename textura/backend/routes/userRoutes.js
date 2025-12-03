import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import admin from "../firebaseAdmin.js";   // MUST BE ADMIN SDK
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------
   Generate Backend JWT
-------------------------- */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/* ===========================================================
    REGISTER (NO CAPTCHA)
=========================================================== */
router.post("/register", async (req, res) => {
  try {
    const { token, name } = req.body;

    if (!token) return res.status(400).json({ message: "Token missing" });

    // 1️⃣ VERIFY FIREBASE TOKEN
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email_verified)
      return res.status(400).json({ message: "Please verify your email" });

    const { uid, email } = decoded;

    // 2️⃣ FIND USER
    let user = await User.findOne({
      $or: [{ firebaseUid: uid }, { email }],
    });

    // 3️⃣ CREATE USER IF NOT EXIST
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: name || "",
        email,
        provider: decoded.firebase.sign_in_provider || "password",
      });
    }

    // 4️⃣ BACKEND JWT
    const backendToken = generateToken(user._id);

    res.json({ success: true, token: backendToken, user });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

/* ===========================================================
    LOGIN (NO CAPTCHA)
=========================================================== */
router.post("/login", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Token missing" });

    // 1️⃣ VERIFY FIREBASE TOKEN
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email_verified)
      return res.status(400).json({ message: "Please verify your email" });

    const {
      uid,
      email,
      name,
      picture,
      firebase: { sign_in_provider },
    } = decoded;

    // 2️⃣ FIND OR CREATE USER
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || "",
        picture: picture || "",
        provider: sign_in_provider,
      });
    } else {
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        await user.save();
      }
    }

    // 3️⃣ BACKEND JWT
    const backendToken = generateToken(user._id);

    res.json({ success: true, token: backendToken, user });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
});

/* ===========================================================
    PROFILE
=========================================================== */
router.get("/me", protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

/* ===========================================================
    UPDATE PROFILE
=========================================================== */
router.put("/update", protect, async (req, res) => {
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

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;
