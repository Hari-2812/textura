import express from "express";
import admin from "../../src/firebase.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { token } = req.body;

  try {
    // 🔥 Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    const { uid, email, name, picture, firebase } = decoded;

    // 🔥 Check if user exists in Mongo
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: decoded.name || "",
        email: decoded.email,
        picture: decoded.picture || "",
        provider: decoded.firebase?.sign_in_provider || "email",
      });
    }

    return res.json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    return res.status(401).json({ error: "Invalid Firebase Token" });
  }
});

export default router;

