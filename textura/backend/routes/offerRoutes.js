import express from "express";
import Offer from "../models/offerModel.js";
import Subscriber from "../models/subscriberModel.js";
import sendEmail from "../utils/sendEmail.js";
import upload from "../middleware/upload.js";

const router = express.Router();

const uploadOfferImage = [
  (req, res, next) => {
    req.folder = "offers";
    next();
  },
  upload.single("image"),
];

const createOfferHandler = async (req, res) => {
  try {
    const { title, description, category, startDate, endDate } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and category are required",
      });
    }

    const image = req.file?.path || null;

    const newOffer = await Offer.create({
      title,
      description,
      category,
      startDate,
      endDate,
      image,
    });

    const subscribers = await Subscriber.find();
    await Promise.all(
      subscribers.map((sub) =>
        sendEmail(
          sub.email,
          `New Offer: ${title}`,
          `${description}\n\nValid from ${startDate || "now"} to ${endDate || "until removed"}`
        )
      )
    );

    const io = req.app.get("io");
    io.emit("offerUpdated", newOffer);

    return res.json({
      success: true,
      message: "Offer posted and subscribers notified",
      offer: newOffer,
    });
  } catch (error) {
    console.log("Error creating offer:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

router.post("/send-offer", uploadOfferImage, createOfferHandler);
router.post("/create", uploadOfferImage, createOfferHandler);

router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
    if (!deletedOffer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    return res.json({ success: true, message: "Offer deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
