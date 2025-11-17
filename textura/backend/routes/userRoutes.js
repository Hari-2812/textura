import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import admin from "../firebase.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Generate Backend JWT */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

/* ===========================================================
    REGISTER (Firebase Email/Password Signup)
=========================================================== */
router.post("/register", async (req, res) => {
  try {
    const { token, name } = req.body;

    if (!token) return res.status(400).json({ message: "Token missing" });

    // 1️⃣ Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    const { uid, email } = decoded;

    // 2️⃣ Check if user already exists in MongoDB
    let user = await User.findOne({
      $or: [{ firebaseUid: uid }, { email }],
    });

    // 3️⃣ Create new MongoDB user if required
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name,
        email,
        provider: "password",
        password: "FIREBASE_AUTH", // placeholder (never used)
      });
    } else {
      // If existing user has no firebaseUid, attach it
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        await user.save();
      }
    }

    // 4️⃣ Create backend JWT
    const backendToken = generateToken(user._id);

    res.json({
      success: true,
      token: backendToken,
      user,
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ===========================================================
    LOGIN (Google OR Email/Password through Firebase)
=========================================================== */
router.post("/login", async (req, res) => {
  try {
    const { token } = req.body; // Firebase ID Token

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    // 1️⃣ Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    const {
      uid,
      email,
      name,
      picture,
      firebase: { sign_in_provider },
    } = decoded;

    // 2️⃣ Check if user exists by firebaseUid OR email
    let user = await User.findOne({
      $or: [{ firebaseUid: uid }, { email }],
    });

    // 3️⃣ If user does not exist → Create new
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || "",
        picture: picture || "",
        provider: sign_in_provider,
        password: "FIREBASE_AUTH",
      });
    } else {
      // Ensure firebaseUid is saved for old accounts
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        await user.save();
      }
    }

    // 4️⃣ Issue backend JWT
    const backendToken = generateToken(user._id);

    res.json({
      success: true,
      token: backendToken,
      user,
    });

  } catch (err) {
    console.error("Firebase Login Error:", err);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
});

/* ===========================================================
    GET PROFILE
=========================================================== */
router.get("/me", protect, async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load user" });
  }
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
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

export default router;
