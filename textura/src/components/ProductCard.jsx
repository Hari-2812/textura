import React from "react";
import "../styles/ProductCard.css";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const showToast = (msg) => {
    const box = document.getElementById("toast-container");
    const div = document.createElement("div");

    div.className = "toast";
    div.innerText = msg;
    box.appendChild(div);

    setTimeout(() => div.remove(), 2000);
  };

  return (
    <div className="product-card">
      <div
        className="product-image-container"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="product-img"
        />

        <button
          className={`pc-wishlist-btn ${
            isInWishlist(product._id) ? "active" : ""
          }`}
          onClick={toggleWishlist}
        >
          <FaHeart className="pc-wishlist-icon" />
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
      </div>

      <div className="product-actions">
        <button
          className="add-cart-btn"
          onClick={() => {
            onAddToCart(product);
            showToast(`${product.name} added to cart 🛒`);
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
