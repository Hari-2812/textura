import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },

    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    picture: { type: String, default: "" },

    // login provider: email / google
    provider: { type: String, default: "email" },

    // ⭐ Your profile fields (unchanged)
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    pincode: { type: String, default: "" },
    landmark: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
