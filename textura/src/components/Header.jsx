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
    const [showSearchBar, setShowSearchBar] = useState(false); 
  const [showProfile, setShowProfile] = useState(false); // ✅ profile dropdown toggle
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartCount } = useCart();

  // Dummy user (replace later with real user context)
  const user = { name: "Hari Prasath" };

  // Sidebar toggle
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Auto-close sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        menuOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".menu-icon")
      ) {
        closeMenu();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menuOpen]);

  // Search suggestion logic
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
  };

  // ✅ Close dropdown if clicked outside
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

          {/* Center: Search */}
          <div className="navbar-center">
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
                    <li
                      key={item.id}
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <img src={item.img} alt={item.name} />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* 📱 Mobile Search Bar (Appears when icon clicked) */}
        {showSearchBar && (
          <div className="mobile-search-container">
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={handleSearchChange}
              autoFocus
            />
            {suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <img src={item.img} alt={item.name} />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

          {/* Right: Icons */}
          <div className="navbar-right">
            <div className="nav-item">
              <FaHeart />
              <span>{t("wishlist")}</span>
            </div>

            {/* Cart */}
            <div className="nav-item" onClick={() => navigate("/cart")}>
              <div className="cart-icon">
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </div>
              <span>{t("cart") || "Cart"}</span>
            </div>

            {/* Filter */}
            <div className="nav-item filter-btn" onClick={onFilterToggle}>
              <FaFilter />
              <span>{t("filter") || "Filter"}</span>
            </div>

            {/* ✅ User Profile Section */}
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
                  <p onClick={() => { navigate("/orders"); setShowProfile(false); }}>
                    My Orders
                  </p>
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

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2769/2769346.png"
              alt="Textura Logo"
            />
            <h2>Menu</h2>
          </div>
          <span className="close-btn" onClick={closeMenu}>
            &times;
          </span>
        </div>

        <ul className="sidebar-links">
          <li onClick={() => { navigate("/"); closeMenu(); }}>
            <FiHome className="icon" /> {t("home")}
          </li>
          <li onClick={() => { navigate("/language"); closeMenu(); }}>
            <FiGlobe className="icon" /> {t("chooseLanguage")}
          </li>
          <li onClick={() => { navigate("/orders"); closeMenu(); }}>
            <FiPackage className="icon" /> {t("orders")}
          </li>
          <li onClick={() => { navigate("/help"); closeMenu(); }}>
            <FiHelpCircle className="icon" /> {t("help")}
          </li>
          <li onClick={() => { navigate("/about"); closeMenu(); }}>
            <FiInfo className="icon" /> {t("about")}
          </li>
        </ul>

        <div className="sidebar-footer">
          <p>© 2025 Textura</p>
          <p className="tagline">Style. Comfort. Confidence.</p>
        </div>
      </div>

      {menuOpen && <div className="overlay" onClick={closeMenu} />}
    </>
  );
};

export default Header;
