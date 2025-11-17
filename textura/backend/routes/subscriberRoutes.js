import express from "express";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();

// Subscribe route
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email missing" });
    }

    // Check if already subscribed
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.json({ success: true, message: "Already subscribed" });
    }

    // Create subscriber
    await Subscriber.create({ email });

    res.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
