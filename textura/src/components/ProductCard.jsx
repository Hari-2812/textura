import React from "react";
import "../styles/ProductCard.css";
import { FaEye, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <article className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
      <div className="product-image-container">
        <img src={product.images?.[0]?.url} alt={product.name} className="product-img" loading="lazy" />

        <button className={`pc-wishlist-btn ${isInWishlist(product._id) ? "active" : ""}`} onClick={toggleWishlist}>
          <FaHeart className="pc-wishlist-icon" />
        </button>

        <div className="quick-view">
          <FaEye /> Quick View
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
      </div>

      <div className="product-actions">
        <button
          className="add-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
            toast.success(`${product.name} added to cart 🛒`);
          }}
        >
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default React.memo(ProductCard);
