import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/* ============================
   1️⃣ Get All Products
============================ */
router.get("/", async (req, res) => {
  try {
    let products = await Product.find().sort({ createdAt: -1 }).lean();

    products = products.map((p) => ({
      ...p,
      images: p.images.map((img) =>
        typeof img === "string" ? { url: img, public_id: "" } : img
      ),
    }));

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ============================
   2️⃣ Bulk Upload Products
============================ */
router.post("/bulk", upload.any(), async (req, res) => {
  try {
    const products = JSON.parse(req.body.products || "[]");

    if (!products.length) {
      return res.status(400).json({
        success: false,
        message: "No products provided",
      });
    }

    const groupedImages = {};
    req.files.forEach((file) => {
      if (!groupedImages[file.fieldname]) {
        groupedImages[file.fieldname] = [];
      }
      groupedImages[file.fieldname].push({
        url: file.path,
        public_id: file.filename || "",
      });
    });

    for (let i = 0; i < products.length; i++) {
      const p = products[i];

      await Product.create({
        name: p.name,
        price: p.price,
        discountPrice: p.discountPrice || null,
        category: p.category,

        sizes: Array.isArray(p.sizes)
          ? p.sizes.map((s) => ({
              label: s.label || "Default",
              stock: Number(s.stock) || 0,
            }))
          : [],

        description: p.description,
        isFeatured: Boolean(p.isFeatured),
        productCode: p.productCode || "",
        images: groupedImages[`images_${i}`] || [],
      });
    }

    res.json({
      success: true,
      message: "Bulk upload successful",
    });
  } catch (error) {
    console.log("Bulk Add Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ============================
   3️⃣ Get Product by ID
============================ */
router.get("/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.images = product.images.map((img) =>
      typeof img === "string" ? { url: img, public_id: "" } : img
    );

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ============================
   4️⃣ Update Product (MAIN FIX)
============================ */
router.put("/:id", upload.any(), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    /* ⭐ Remove selected images */
    let removeImages = [];
    if (req.body.removeImages) {
      try {
        removeImages = JSON.parse(req.body.removeImages);
      } catch {}
    }

    for (const rem of removeImages) {
      let publicId = rem;

      if (rem.startsWith("http")) {
        const parts = rem.split("/");
        publicId = parts[parts.length - 1].split(".")[0];
      }

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch {}

      product.images = product.images.filter((img) => {
        if (typeof img === "string") return true;
        return img.public_id !== publicId && !img.url.includes(publicId);
      });
    }

    /* ⭐ Add new images */
    if (req.files.length > 0) {
      const newImgs = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename || "",
      }));
      product.images.push(...newImgs);
    }

    /* ⭐ Update basic fields */
    const fields = [
      "name",
      "price",
      "discountPrice",
      "category",
      "description",
      "productCode",
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        product[f] = req.body[f];
      }
    });

    product.isFeatured = req.body.isFeatured === "true";

    /* ⭐ FIXED — SAFE SIZE UPDATE (NO ERRORS EVER) */
    if (req.body.sizes !== undefined) {
      try {
        const parsed = JSON.parse(req.body.sizes);

        if (Array.isArray(parsed)) {
          product.sizes = parsed.map((s) => ({
            label: s.label ? String(s.label) : "Default",
            stock: s.stock ? Number(s.stock) : 0,
          }));
        } else {
          console.log("⚠️ Sizes is not an array. Ignored.");
        }
      } catch (err) {
        console.log("❌ Safe Size Parse Error, skipping sizes update", err);
      }
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully!",
      product,
    });
  } catch (error) {
    console.log("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ============================
   5️⃣ Delete Product
============================ */
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    for (const img of product.images) {
      let publicId =
        typeof img === "string"
          ? img.split("/").pop().split(".")[0]
          : img.public_id;

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch {}
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
