import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/* ============================================================
   1️⃣ Get ALL Products
============================================================ */
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

/* ============================================================
   2️⃣ BULK ADD PRODUCTS  (must be above /:id)
============================================================ */
router.post("/bulk", upload.any(), async (req, res) => {
  try {
    const products = JSON.parse(req.body.products || "[]");

    if (!products.length) {
      return res.status(400).json({
        success: false,
        message: "No products provided for bulk upload",
      });
    }

    // Group files by images_0, images_1 etc.
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

    // Create products
    for (let i = 0; i < products.length; i++) {
      const p = products[i];

      await Product.create({
        name: p.name,
        price: p.price,
        discountPrice: p.discountPrice || null,
        category: p.category,

        // ⭐ Correct Size Structure
        sizes: Array.isArray(p.sizes)
          ? p.sizes.map((s) => ({
              label: s.label,
              stock: Number(s.stock) || 0,
            }))
          : [],

        description: p.description,
        isFeatured: Boolean(p.isFeatured),
        productCode: p.productCode || "",
        images: groupedImages[`images_${i}`] || [],
      });
    }

    res.status(201).json({
      success: true,
      message: "Bulk products added successfully!",
    });
  } catch (error) {
    console.log("Bulk Add Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ============================================================
   3️⃣ Get Single Product by ID
============================================================ */
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

/* ============================================================
   4️⃣ Update Product (Fully Updated for Age-Based Sizes)
============================================================ */
router.put("/:id", upload.any(), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    /* --------------------------------------------
       ⭐ Remove selected images
    -------------------------------------------- */
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

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {}
      }

      product.images = product.images.filter((img) => {
        if (typeof img === "string") return true;
        return img.public_id !== publicId && !img.url.includes(publicId);
      });
    }

    /* --------------------------------------------
       ⭐ Add new uploaded images
    -------------------------------------------- */
    if (req.files && req.files.length > 0) {
      const newImgs = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename || "",
      }));
      product.images.push(...newImgs);
    }

    /* --------------------------------------------
       ⭐ Update simple fields
    -------------------------------------------- */
    const {
      name,
      price,
      discountPrice,
      category,
      sizes,
      description,
      isFeatured,
      productCode,
    } = req.body;

    if (name) product.name = name;
    if (price) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (category) product.category = category;
    if (description) product.description = description;
    if (productCode) product.productCode = productCode;

    product.isFeatured = isFeatured === "true";

    /* --------------------------------------------
       ⭐ Update Sizes (Age-Based)
       Expecting JSON string from frontend
       Example:
       sizes: '[{"label":"5-6Y","stock":8}]'
    -------------------------------------------- */
    if (sizes) {
      try {
        const parsed = JSON.parse(sizes);

        if (Array.isArray(parsed)) {
          product.sizes = parsed.map((s) => ({
            label: s.label,
            stock: Number(s.stock) || 0,
          }));
        }
      } catch (err) {
        console.log("❌ Size JSON parse error:", err);
      }
    }

    await product.save();

    const responseProduct = {
      ...product._doc,
      images: product.images.map((img) =>
        typeof img === "string" ? { url: img, public_id: "" } : img
      ),
    };

    res.json({
      success: true,
      message: "Product updated successfully!",
      product: responseProduct,
    });
  } catch (error) {
    console.log("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ============================================================
   5️⃣ Delete Product (DB + Cloudinary)
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    // Remove from Cloudinary
    for (const img of product.images) {
      let publicId =
        typeof img === "string"
          ? img.split("/").pop().split(".")[0]
          : img.public_id;

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {}
      }
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
