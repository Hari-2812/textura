import React, { useState, useEffect } from "react";
import "./Header.css";
import {
  FaBars,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSearch,
} from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        menuOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".menu-icon")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menuOpen]);

  return (
    <>
      {/* Offer Bar */}
      <div className="offer-bar">
        <p>✨ Festive Sale! Flat 50% Off on Kidswear | Free Shipping Above ₹999 ✨</p>
      </div>

      {/* Header */}
      <header className="header">
        <nav className="navbar">
          {/* Left: Menu + Logo */}
          <div className="navbar-left">
            <div className="menu-icon" onClick={() => setMenuOpen(true)}>
              <FaBars />
            </div>
            <div className="logo">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2769/2769346.png"
                alt="Textura Logo"
              />
              <h1>Textura</h1>
            </div>
          </div>

          {/* Center: Search */}
          <div className="navbar-center">
            <div className="search-container">
              <input type="text" placeholder="Search products..." />
              <FaSearch className="search-icon" />
            </div>
          </div>



          {/* Right: Icons */}
          <div className="navbar-right">
            <div className="nav-item">
              <FaHeart />
              <span>Wishlist</span>
            </div>
            <div className="nav-item">
              <FaUser />
              <span>Account</span>
            </div>
            <div className="nav-item">
              <FaShoppingCart />
              <span>Cart</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <span className="close-btn" onClick={() => setMenuOpen(false)}>
            &times;
          </span>
        </div>
        <ul className="sidebar-links">
          <li>🏠 Home</li>
          <li>🛒 Shop</li>
          <li>📦 My Orders</li>
          <li>❤️ Wishlist</li>
          <li>👤 Profile</li>
          <li>📞 Contact Us</li>
        </ul>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="overlay"></div>}
    </>
  );
};

export default Header;
