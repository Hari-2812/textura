import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { products } from "../data/products";
import OfferBar from "../components/OfferBar";

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
  FaCompass,
} from "react-icons/fa";

const Header = ({ onFilterToggle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { cartCount } = useCart();
  const { user, setUser } = useUser();

  // ⭐ When user refreshes → load saved user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ⭐ Detect if we are on Boys/Girls/Products page
  const isProductPage =
    location.pathname.includes("/boys") ||
    location.pathname.includes("/girls") ||
    location.pathname.includes("/products");

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".menu-icon")
      ) {
        closeMenu();
      }
      if (
        showProfile &&
        !e.target.closest(".profile-section") &&
        !e.target.closest(".profile-dropdown")
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menuOpen, showProfile]);

  // ⭐ Search Logic
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

  // ⭐ Corrected Logout → clears token & user
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    setUser(null);
    setShowProfile(false);

    navigate("/login");
  };

  return (
    <>
      {/* ⭐ Offer Bar */}
      <OfferBar />

      {/* ⭐ Header */}
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
            </div>
          </div>

          {/* Center Search */}
          <div className="navbar-center">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for T-Shirts, Jeans, Jackets..."
                value={search}
                onChange={handleSearchChange}
              />
              <FaSearch className="search-icon" />

              {/* Search suggestions */}
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

          {/* Right section */}
          <div className="navbar-right">
            <div className="nav-item" onClick={() => navigate("/wishlist")}>
              <FaHeart />
              <span>{t("wishlist")}</span>
            </div>

            <div className="nav-item" onClick={() => navigate("/cart")}>
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              <span>{t("cart")}</span>
            </div>

            {isProductPage ? (
              <div className="nav-item filter-btn" onClick={onFilterToggle}>
                <FaFilter />
                <span>{t("filter")}</span>
              </div>
            ) : (
              <div
                className="nav-item offers-btn"
                onClick={() => navigate("/offers")}
              >
                <FaCompass />
                <span>{t("offers")}</span>
              </div>
            )}

            {/* ⭐ Profile */}
            <div
              className={`nav-item profile-section ${
                showProfile ? "active" : ""
              }`}
              onClick={() => setShowProfile(!showProfile)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="User Avatar"
                className="profile-avatar"
              />

              <span className="profile-username">
                {user?.name || "Guest"}
              </span>

              {showProfile && (
                <div className="profile-dropdown">
                  <p
                    onClick={() => {
                      navigate("/profile");
                      setShowProfile(false);
                    }}
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => {
                      navigate("/orders");
                      setShowProfile(false);
                    }}
                  >
                    My Orders
                  </p>

                  {/* ⭐ LOGOUT BUTTON */}
                  <p onClick={handleLogout}>Logout</p>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ⭐ Mobile Bottom Navigation */}
      <div className="bottom-nav">
        <div
          className={`bottom-nav-item ${
            location.pathname === "/wishlist" ? "active" : ""
          }`}
          onClick={() => navigate("/wishlist")}
        >
          <FaHeart />
          <span>Wishlist</span>
        </div>

        <div
          className={`bottom-nav-item ${
            location.pathname === "/cart" ? "active" : ""
          }`}
          onClick={() => navigate("/cart")}
        >
          <div className="cart-icon">
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <span>Cart</span>
        </div>

        {isProductPage ? (
          <div className="bottom-nav-item" onClick={onFilterToggle}>
            <FaFilter />
            <span>Filter</span>
          </div>
        ) : (
          <div
            className={`bottom-nav-item ${
              location.pathname === "/explore" ? "active" : ""
            }`}
            onClick={() => navigate("/explore")}
          >
            <FaCompass />
            <span>Explore</span>
          </div>
        )}

        <div
          className={`bottom-nav-item ${
            location.pathname === "/profile" ? "active" : ""
          }`}
          onClick={() => navigate("/profile")}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Profile"
            className="profile-avatar-small"
          />
          <span>Profile</span>
        </div>
      </div>

      {/* ⭐ Sidebar */}
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
