import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: String,
  paymentMethod: String,
  paymentStatus: String,
  amount: Number,
  transactionId: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
