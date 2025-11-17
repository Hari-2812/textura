import express from "express";
import upload from "../middleware/upload.js"; // your cloudinary upload
import { createOffer } from "../controllers/offerController.js";

const router = express.Router();

// Upload offer image → send email to subscribers
router.post(
  "/send-offer",
  (req, res, next) => {
    // Override Cloudinary folder for offers
    req.folder = "offers";
    next();
  },
  upload.single("image"),
  createOffer
);

export default router;
