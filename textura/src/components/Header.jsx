import React, { useState, useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { FiHome, FiPackage, FiHeart, FiPhone, FiInfo } from "react-icons/fi";
import {
  FaBars,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const Header = ({ onFilterToggle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
            <div className="logo" onClick={() => navigate("/")}>
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
            {/* Wishlist */}
            <div className="nav-item">
              <FaHeart />
              <span>Wishlist</span>
            </div>

            {/* Account */}
            <div className="nav-item">
              <FaUser />
              <span>Account</span>
            </div>

            {/* Cart */}
            <div className="nav-item" onClick={() => navigate("/cart")}>
              <FaShoppingCart />
              <span>Cart</span>
            </div>

            {/* Filter (Triggers BoysPage filter popup) */}
            <div className="nav-item filter-btn" onClick={onFilterToggle}>
              <FaFilter />
              <span>Filter</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2769/2769346.png"
              alt="Textura Logo"
            />
            <h2>Textura</h2>
          </div>
          <span className="close-btn" onClick={() => setMenuOpen(false)}>
            &times;
          </span>
        </div>

        <ul className="sidebar-links">
          <li onClick={() => navigate("/")}>
            <FiHome className="icon" />
            Home
          </li>
          <li>
            <FiPackage className="icon" />
            My Orders
          </li>
          <li>
            <FiHeart className="icon" />
            Wishlist
          </li>
          <li>
            <FiPhone className="icon" />
            Contact Us
          </li>
          <li>
            <FiInfo className="icon" />
            About Textura
          </li>
        </ul>

        <div className="sidebar-footer">
          <p>© 2025 Textura</p>
          <p className="tagline">Style. Comfort. Confidence.</p>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Header;
