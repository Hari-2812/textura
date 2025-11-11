import React from "react";
import "../styles/ProductCard.css";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="product-card">
      {/* 🖼️ Product Image */}
      <div
        className="product-image-container"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img src={product.img} alt={product.name} className="product-img" />

        <button className="wishlist-btn" onClick={toggleWishlist}>
          <FaHeart
            color={isInWishlist(product.id) ? "red" : "gray"}
            size={18}
          />
        </button>
      </div>

      {/* 📋 Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
      </div>

      {/* 🛒 Actions */}
      <div className="product-actions">
        <button className="add-cart-btn" onClick={() => onAddToCart(product)}>
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
