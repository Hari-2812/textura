import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String },   // ❌ removed required + unique
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    picture: { type: String, default: "" },
    provider: { type: String, default: "password" },

    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    pincode: { type: String, default: "" },
    landmark: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
