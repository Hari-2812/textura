import React, { useState, useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext"; // ✅ added
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
  FaUserCircle,
} from "react-icons/fa";

const Header = ({ onFilterToggle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartCount } = useCart();
  const { user } = useUser(); // ✅ get profile info

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const toggleProfile = () => setShowProfile(!showProfile);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        menuOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".menu-icon")
      ) {
        closeMenu();
      }
      if (!e.target.closest(".profile-menu") && !e.target.closest(".profile-icon")) {
        setShowProfile(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menuOpen]);

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

  return (
    <>
      <div className="offer-bar">
        <p>✨ Festive Sale! Flat 50% Off on Kidswear | Free Shipping Above ₹999 ✨</p>
      </div>

      <header className="header">
        <nav className="navbar">
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
                    <li key={item.id} onClick={() => handleSuggestionClick(item)}>
                      <img src={item.img} alt={item.name} />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="navbar-right">
            <div className="nav-item">
              <FaHeart />
              <span>{t("wishlist")}</span>
            </div>

            <div className="nav-item" onClick={() => navigate("/cart")}>
              <div className="cart-icon">
                <FaShoppingCart />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span>{t("cart") || "Cart"}</span>
            </div>

            <div className="nav-item filter-btn" onClick={onFilterToggle}>
              <FaFilter />
              <span>{t("filter") || "Filter"}</span>
            </div>

            {/* ✅ Account/Profile Icon */}
            <div className="nav-item profile-section" onClick={() => setShowProfile(!showProfile)}>
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
                  <p onClick={() => navigate("/profile")}>My Profile</p>
                  <p onClick={() => navigate("/orders")}>My Orders</p>
                  <p onClick={() => alert("Logged out successfully!")}>Logout</p>
                </div>
              )}
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
          <li onClick={() => { navigate("/profile"); closeMenu(); }}>
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

      {menuOpen && <div className="overlay" onClick={closeMenu} />}
    </>
  );
};

export default Header;
