// src/pages/WishlistPage.jsx
import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import "../styles/WishlistPage.css";

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="wishlist-page">
      <h2>Your Wishlist ❤️</h2>

      {wishlist.length === 0 ? (
        <p className="empty-wishlist">
          No items yet — start adding your favorites!
        </p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <ProductCard
              key={item._id}
              product={item}
              onAddToCart={() => addToCart(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
