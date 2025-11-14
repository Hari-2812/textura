import mongoose from "mongoose";

const imageSubSchema = new mongoose.Schema(
  {
    url: { type: String },
    public_id: { type: String, default: "" },
  },
  { _id: false }
);

const sizeSubSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },

    discountPrice: { type: Number, default: null },
    discountPercent: { type: Number, default: 0 },

    category: { type: String, required: true },

    // ⭐ FIXED: sizes now supports age + stock
    sizes: {
      type: [sizeSubSchema],
      default: [],
    },

    // Optional overall stock (not used if you use per-size stock)
    stock: { type: Number, default: 10 },

    description: { type: String, default: "" },

    images: { type: [imageSubSchema], required: true, default: [] },

    isFeatured: { type: Boolean, default: false },

    productCode: { type: String, default: "" },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.discountPrice && this.discountPrice < this.price) {
    this.discountPercent = Math.round(
      ((this.price - this.discountPrice) / this.price) * 100
    );
  } else {
    this.discountPercent = 0;
  }
  next();
});

export default mongoose.model("Product", productSchema);
