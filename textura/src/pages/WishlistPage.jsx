import React from "react";
import { useWishlist } from "../context/WishlistContext";
import "../styles/WishlistPage.css";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-page">
      <h2>Your Wishlist ❤️</h2>

      {wishlist.length === 0 ? (
        <p className="empty-wishlist">No items yet — add your favorites!</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <img src={item.img} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.price}</p>
              <button
                className="remove-btn"
                onClick={() => removeFromWishlist(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
