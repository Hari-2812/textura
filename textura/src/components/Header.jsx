import React, { useState, useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const handleSearchChange = (e) => setSearch(e.target.value);

  return (
    <>
      {/* 🌟 Offer Bar */}
      <div className="offer-bar">
        <p>✨ {t("welcome")} ✨</p>
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
                placeholder={t("searchPlaceholder") || "Search for products..."}
                value={search}
                onChange={handleSearchChange}
              />
              <FaSearch className="search-icon" />
            </div>
          </div>

          {/* Right: Icons */}
          <div className="navbar-right">
            <div className="nav-item">
              <FaHeart />
              <span>{t("wishlist")}</span>
            </div>

            <div className="nav-item" onClick={() => navigate("/cart")}>
              <div className="cart-icon">
                <FaShoppingCart />
                <span className="cart-badge">2</span>
              </div>
              <span>{t("cart")}</span>
            </div>

            <div className="nav-item filter-btn" onClick={onFilterToggle}>
              <FaFilter />
              <span>{t("filter")}</span>
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
            <FiHome className="icon" />
            {t("home")}
          </li>

          <li onClick={() => { navigate("/language"); closeMenu(); }}>
            <FiGlobe className="icon" />
            {t("chooseLanguage")}
          </li>

          <li onClick={() => { navigate("/orders"); closeMenu(); }}>
            <FiPackage className="icon" />
            {t("orders") || "My Orders"}
          </li>

          <li onClick={() => { navigate("/account"); closeMenu(); }}>
            <FiUser className="icon" />
            {t("account") || "My Account"}
          </li>

          <li onClick={() => { navigate("/help"); closeMenu(); }}>
            <FiHelpCircle className="icon" />
            {t("help") || "Help"}
          </li>

          <li onClick={() => { navigate("/about"); closeMenu(); }}>
            <FiInfo className="icon" />
            {t("about")}
          </li>
        </ul>

        <div className="sidebar-footer">
          <p>© 2025 Textura</p>
          <p className="tagline">{t("tagline") || "Style. Comfort. Confidence."}</p>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="overlay" onClick={closeMenu} />}
    </>
  );
};

export default Header;
