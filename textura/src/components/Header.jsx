import React, { useState, useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import {
  FiHome,
  FiGlobe,
  FiPackage,
  FiUser,
  FiHelpCircle,
  FiInfo,
  FiArrowLeft,
} from "react-icons/fi";
import {
  FaBars,
  FaShoppingCart,
  FaSearch,
  FaHeart,
  FaFilter,
} from "react-icons/fa";

const Header = ({ onFilterToggle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartCount } = useCart();

  const user = { name: "Hari Prasath" };

  // Sidebar toggle
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(value)
    );
    setSuggestions(filtered.slice(0, 5));
  };

  const handleSuggestionClick = (product) => {
    setSearch(product.name);
    setSuggestions([]);
    if (product.category === "boys") navigate("/boys");
    if (product.category === "girls") navigate("/girls");
    setShowMobileSearch(false);
  };

  // Profile toggle
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-section")) setShowProfile(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      {/* 🌟 Offer Bar */}
      <div className="offer-bar">
        <p>✨ Festive Sale! Flat 50% Off on Kidswear | Free Shipping Above ₹999 ✨</p>
      </div>

      {/* 🧭 Header */}
      <header className="header">
        <nav className="navbar">
          {/* Left: Menu + Logo */}
          <div className="navbar-left">
            <div className="menu-icon" onClick={toggleMenu}>
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

          {/* Center: Desktop Search */}
          <div className="navbar-center desktop-search">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for T-Shirts, Jeans, Jackets..."
                value={search}
                onChange={handleSearchChange}
              />
              <FaSearch className="search-icon" />
              {suggestions.length > 0 && (
                <ul className="search-suggestions">
                  {suggestions.map((item) => (
                    <li key={item.id} onClick={() => handleSuggestionClick(item)}>
                      <img src={item.img} alt={item.name} />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right: Icons */}
          <div className="navbar-right">
            {/* Wishlist */}
            <div className="nav-item filter-btn">
              <FaHeart />
              <span>{t("wishlist")}</span>
            </div>

            {/* Cart */}
            <div className="nav-item filter-btn" onClick={() => navigate("/cart")}>
              <div className="cart-icon">
                <FaShoppingCart />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span>{t("cart")}</span>
            </div>

            {/* Filter */}
            <div className="nav-item filter-btn" onClick={onFilterToggle}>
              <FaFilter />
              <span>{t("filter")}</span>
            </div>

            {/* Search icon (Mobile only) */}
            <div className="search-toggle-icon" onClick={() => setShowMobileSearch(true)}>
              <FaSearch />
            </div>

            {/* Profile */}
            <div
              className="nav-item profile-section"
              onClick={() => setShowProfile((prev) => !prev)}
            >
              <div className="profile-display">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="User Avatar"
                  className="profile-avatar"
                />
                <span className="profile-username">{user.name}</span>
              </div>

              {showProfile && (
                <div className="profile-dropdown">
                  <p onClick={() => navigate("/orders")}>My Orders</p>
                  <p
                    onClick={() => {
                      alert("Logged out successfully!");
                      setShowProfile(false);
                    }}
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* 📱 Mobile Fullscreen Search Overlay */}
      {showMobileSearch && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-header">
            <FiArrowLeft
              className="back-icon"
              onClick={() => setShowMobileSearch(false)}
            />
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={handleSearchChange}
              autoFocus
            />
          </div>

          {suggestions.length > 0 && (
            <ul className="mobile-search-suggestions">
              {suggestions.map((item) => (
                <li key={item.id} onClick={() => handleSuggestionClick(item)}>
                  <img src={item.img} alt={item.name} />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
