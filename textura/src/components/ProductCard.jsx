import React from "react";
import "../styles/ProductCard.css";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // ❤️ Toggle wishlist
  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  // 🔔 Toast Notification
  const showToast = (message) => {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  return (
    <div className="product-card">
      {/* 🖼️ Product Image */}
      <div
        className="product-image-container"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="product-img"
        />

        {/* ❤️ Wishlist Button */}
        <button
          className={`pc-wishlist-btn ${
            isInWishlist(product._id) ? "active" : ""
          }`}
          onClick={toggleWishlist}
        >
          <FaHeart className="pc-wishlist-icon" />
        </button>
      </div>

      {/* 📋 Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
      </div>

      {/* 🛒 Actions */}
      <div className="product-actions">
        <button
          className="add-cart-btn"
          onClick={() => {
            onAddToCart(product);
            showToast(`${product.name} added to cart`);
          }}
        >
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
