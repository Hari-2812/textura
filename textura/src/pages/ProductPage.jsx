import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductPage.css";
import { products } from "../data/products";
import { FaHeart, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // ✅ Find the product by ID
  const product = products.find((p) => p.id === parseInt(id));

  // ❌ Don't render route here
  // ✅ Show "not found" message if invalid product ID
  if (!product) {
    return (
      <div className="product-not-found">
        <p>Product not found 😕</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="product-page">
      {/* 🔙 Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      {/* 🧾 Product Section */}
      <div className="product-container">
        {/* Left: Image */}
        <div className="product-image">
          <img src={product.img} alt={product.name} />
        </div>

        {/* Right: Details */}
        <div className="product-details">
          <h2>{product.name}</h2>
          <p className="product-category">Category: {product.category}</p>
          <p className="product-price">{product.price}</p>

          <p className="product-desc">
            This premium {product.name} is crafted from soft, durable cotton
            fabric. Perfect for everyday wear — combining comfort, style, and
            breathability. Available in multiple sizes and colors.
          </p>

          <div className="product-actions">
            <button className="add-to-cart" onClick={() => addToCart(product)}>
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="wishlist-btn">
              <FaHeart /> Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
