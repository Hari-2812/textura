import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Offer from "../models/offerModel.js";
import Subscriber from "../models/subscriberModel.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// =============================================
// 🔥 AUTO-CREATE uploads/offers FOLDER
// =============================================
const uploadDir = path.join(process.cwd(), "uploads", "offers");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =============================================
// MULTER IMAGE UPLOAD
// =============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/offers"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// =============================================
// POST: /api/offers/send-offer
// =============================================
router.post("/send-offer", upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, startDate, endDate } = req.body;

    if (!title || !description || !category) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Save image path
    const image = req.file ? `/uploads/offers/${req.file.filename}` : null;

    // Save offer to DB
    const newOffer = await Offer.create({
      title,
      description,
      category,
      startDate,
      endDate,
      image,
    });

    // Send email notifications
    const subscribers = await Subscriber.find();
    subscribers.forEach((sub) => {
      sendEmail(
        sub.email,
        `New Offer: ${title}`,
        `${description}\n\nValid from ${startDate} to ${endDate}`
      );
    });

    // SOCKET.IO BROADCAST
    const io = req.app.get("io");
    io.emit("offerUpdated", newOffer);

    return res.json({
      success: true,
      message: "Offer posted, subscribers notified",
      offer: newOffer,
    });

  } catch (error) {
    console.log("Error creating offer:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// =============================================
// GET ALL OFFERS
// =============================================
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// =============================================
// DELETE OFFER
// =============================================
router.delete("/:id", async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
    if (!deletedOffer) {
      return res.json({ success: false, message: "Offer not found" });
    }

    res.json({ success: true, message: "Offer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
