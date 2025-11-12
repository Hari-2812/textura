// backend/models/Order.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, default: "cod" }, // cod or upi
  upiId: { type: String, default: null },
  items: [itemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
