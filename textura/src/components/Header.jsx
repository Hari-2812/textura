import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { products } from "../data/products";
import OfferBar from "../components/OfferBar";

import {
  FaShoppingCart,
  FaSearch,
  FaHeart,
  FaFilter,
  FaCompass,
  FaGlobe,
  FaBars,
} from "react-icons/fa";

const Header = ({ onFilterToggle }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { cartCount } = useCart();
  const { user, setUser } = useUser();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const isProductPage =
    location.pathname.includes("/boys") ||
    location.pathname.includes("/girls") ||
    location.pathname.includes("/products");

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (value.trim() === "") return setSuggestions([]);

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

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setUser(null);
    setShowProfile(false);
    navigate("/login");
  };

  return (
    <>
      <OfferBar />

      <header className="header">
        <nav className="navbar">

          {/* LEFT SECTION */}
          <div className="navbar-left">

            {/* MOBILE MENU ICON */}
            <div className="menu-icon" onClick={() => setOpenMenu(true)}>
              <FaBars />
            </div>

            <div className="logo" onClick={() => navigate("/")}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2769/2769346.png"
                alt="Textura Logo"
              />
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="navbar-center">
            <div className="search-container">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
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

          {/* RIGHT ICONS */}
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
              <div className="nav-item" onClick={onFilterToggle}>
                <FaFilter />
                <span>{t("filter")}</span>
              </div>
            ) : (
              <div className="nav-item" onClick={() => navigate("/offers")}>
                <FaCompass />
                <span>{t("offers")}</span>
              </div>
            )}

            <div className="nav-item" onClick={() => navigate("/language")}>
              <FaGlobe />
              <span>{t("language") || "Language"}</span>
            </div>

            <div
              className="nav-item profile-box"
              onClick={() => setShowProfile(!showProfile)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                className="profile-avatar"
              />
              <span className="profile-username">
                {user?.name || t("guest")}
              </span>

              {showProfile && (
                <div className="profile-dropdown">
                  <p onClick={() => navigate("/profile")}>{t("profile")}</p>
                  <p onClick={() => navigate("/orders")}>{t("orders")}</p>
                  <p onClick={handleLogout}>{t("logout")}</p>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* SIDEBAR */}
      <div className={`sidebar ${openMenu ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <span className="close-btn" onClick={() => setOpenMenu(false)}>×</span>
        </div>

        <ul className="sidebar-links">
          <li onClick={() => { navigate("/"); setOpenMenu(false); }}>Home</li>
          <li onClick={() => { navigate("/boys"); setOpenMenu(false); }}>Boys</li>
          <li onClick={() => { navigate("/girls"); setOpenMenu(false); }}>Girls</li>
          {/* <li onClick={() => { navigate("/wishlist"); setOpenMenu(false); }}>Wishlist</li>
          <li onClick={() => { navigate("/cart"); setOpenMenu(false); }}>Cart</li>
          <li onClick={() => { navigate("/offers"); setOpenMenu(false); }}>Offers</li> */}
          <li onClick={() => { navigate("/orders"); setOpenMenu(false); }}>Orders</li>
          {/* <li onClick={() => { navigate("/profile"); setOpenMenu(false); }}>Profile</li> */}
          <li onClick={() => { navigate("/language"); setOpenMenu(false); }}>Language</li>
          <li onClick={() => { handleLogout(); setOpenMenu(false); }}>Logout</li>
        </ul>

      </div>

      {openMenu && <div className="overlay" onClick={() => setOpenMenu(false)} />}

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <div className="bottom-nav-item" onClick={() => navigate("/wishlist")}>
          <FaHeart />
          <span>{t("wishlist")}</span>
        </div>

        <div className="bottom-nav-item" onClick={() => navigate("/cart")}>
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          <span>{t("cart")}</span>
        </div>

        {isProductPage ? (
          <div className="bottom-nav-item" onClick={onFilterToggle}>
            <FaFilter />
            <span>{t("filter")}</span>
          </div>
        ) : (
          <div className="bottom-nav-item" onClick={() => navigate("/offers")}>
            <FaCompass />
            <span>{t("offers")}</span>
          </div>
        )}

        <div className="bottom-nav-item" onClick={() => navigate("/language")}>
          <FaGlobe />
          <span>{t("language") || "Language"}</span>
        </div>

        <div className="bottom-nav-item" onClick={() => navigate("/profile")}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            className="profile-avatar-small"
          />
          <span>{t("profile")}</span>
        </div>
      </div>
    </>
  );
};

export default Header;
