import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", subscriberSchema);
