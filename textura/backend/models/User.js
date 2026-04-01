import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String },   // ❌ removed required + unique
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    picture: { type: String, default: "" },
    provider: { type: String, default: "password" },
    isAdmin: { type: Boolean, default: false },

    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    pincode: { type: String, default: "" },
    landmark: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ firebaseUid: 1 });

export default mongoose.model("User", userSchema);
