import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  startDate: String,
  endDate: String,
  image: String, // cloudinary URL
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Offer", offerSchema);
