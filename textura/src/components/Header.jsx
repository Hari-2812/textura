import React, { useState, useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { products } from "../data/products"; // ✅ Product data for suggestions
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

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartCount } = useCart(); // ✅ Real-time count from context

  // ✅ Sidebar toggle
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // ✅ Auto-close sidebar when clicking outside
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

  // ✅ Handle search input change and filter suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    // Filter products for matching names
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(value)
    );
    setSuggestions(filtered.slice(0, 5)); // show top 5
  };

  // ✅ Handle suggestion click
  const handleSuggestionClick = (product) => {
    setSearch(product.name);
    setSuggestions([]);
    // Navigate based on product category
    if (product.category === "boys") navigate("/boys");
    if (product.category === "girls") navigate("/girls");
  };

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

          {/* Center: Search with suggestions */}
          <div className="navbar-center">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for T-Shirts, Jeans, Jackets..."
                value={search}
                onChange={handleSearchChange}
              />
              <FaSearch className="search-icon" />

              {/* 🔽 Suggestions Dropdown */}
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

          {/* Right: Icons */}
          <div className="navbar-right">
            {/* ❤️ Wishlist */}
            <div className="nav-item">
              <FaHeart />
              <span>{t("wishlist")}</span>
            </div>

            {/* 🛒 Cart Icon with badge */}
            <div className="nav-item" onClick={() => navigate("/cart")}>
              <div className="cart-icon">
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </div>
              <span>{t("cart") || "Cart"}</span>
            </div>

            {/* 🔍 Filter */}
            <div className="nav-item filter-btn" onClick={onFilterToggle}>
              <FaFilter />
              <span>{t("filter") || "Filter"}</span>
            </div>
          </div>
        </nav>
      </header>

      {/* 📱 Sidebar */}
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
          <li onClick={() => { navigate("/account"); closeMenu(); }}>
            <FiUser className="icon" /> {t("account")}
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
          <p className="tagline">
            {t("tagline") || "Style. Comfort. Confidence."}
          </p>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="overlay" onClick={closeMenu} />}
    </>
  );
};

export default Header;
