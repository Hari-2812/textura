import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import admin, {
  getFirebaseAdminError,
  isFirebaseConfigured,
} from "../firebaseAdmin.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const requireFirebaseAdmin = (res) => {
  if (isFirebaseConfigured && admin) {
    return true;
  }

  res.status(503).json({
    success: false,
    message:
      "Firebase authentication is not configured on the server. Add FIREBASE_SERVICE_ACCOUNT in Render.",
    error: getFirebaseAdminError(),
  });

  return false;
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

router.post("/register", async (req, res) => {
  try {
    if (!requireFirebaseAdmin(res)) return;

    const { token, name } = req.body;

    if (!token) return res.status(400).json({ message: "Token missing" });

    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email_verified) {
      return res.status(400).json({ message: "Please verify your email" });
    }

    const { uid, email } = decoded;

    let user = await User.findOne({
      $or: [{ firebaseUid: uid }, { email }],
    });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: name || "",
        email,
        provider: decoded.firebase.sign_in_provider || "password",
      });
    }

    const backendToken = generateToken(user._id);

    res.json({ success: true, token: backendToken, user });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!requireFirebaseAdmin(res)) return;

    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Token missing" });

    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email_verified) {
      return res.status(400).json({ message: "Please verify your email" });
    }

    const {
      uid,
      email,
      name,
      picture,
      firebase: { sign_in_provider },
    } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || "",
        picture: picture || "",
        provider: sign_in_provider,
      });
    } else if (!user.firebaseUid) {
      user.firebaseUid = uid;
      await user.save();
    }

    const backendToken = generateToken(user._id);

    res.json({ success: true, token: backendToken, user });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

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
