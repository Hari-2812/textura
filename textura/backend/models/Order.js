import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    customerEmail: String,
    address: String,
    paymentMethod: String,

    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],

    total: Number,

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Picked Up",
        "In Transit",
        "Delivered"
      ],
      default: "Pending",
    },

    orderId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

export default mongoose.model("Order", orderSchema);
