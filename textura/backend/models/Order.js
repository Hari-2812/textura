import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    customerEmail: String,
    address: String,
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    total: Number,
    status: { type: String, default: "Pending" },
    // 👇 Add this
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Automatically generate readable short orderId (e.g., 1CFC21)
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
