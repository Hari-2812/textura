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
} from "react-icons/fa";

const Header = ({ onFilterToggle }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

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

          {/* RIGHT ICONS */}
          <div className="navbar-right">
            <div className="nav-item" onClick={() => navigate("/wishlist")}>
              <FaHeart />
              <span>Wishlist</span>
            </div>

            <div className="nav-item" onClick={() => navigate("/cart")}>
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              <span>Cart</span>
            </div>

            {isProductPage ? (
              <div className="nav-item" onClick={onFilterToggle}>
                <FaFilter />
                <span>Filter</span>
              </div>
            ) : (
              <div className="nav-item" onClick={() => navigate("/offers")}>
                <FaCompass />
                <span>Offers</span>
              </div>
            )}

            <div
              className="nav-item profile-box"
              onClick={() => setShowProfile(!showProfile)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                className="profile-avatar"
              />
              <span className="profile-username">{user?.name || "Guest"}</span>

              {showProfile && (
                <div className="profile-dropdown">
                  <p onClick={() => navigate("/profile")}>My Profile</p>
                  <p onClick={() => navigate("/orders")}>My Orders</p>
                  <p onClick={handleLogout}>Logout</p>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <div className="bottom-nav">
        <div className="bottom-nav-item" onClick={() => navigate("/wishlist")}>
          <FaHeart />
          <span>Wishlist</span>
        </div>

        <div className="bottom-nav-item" onClick={() => navigate("/cart")}>
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
          <div className="bottom-nav-item" onClick={() => navigate("/offers")}>
            <FaCompass />
            <span>Offers</span>
          </div>
        )}

        <div className="bottom-nav-item" onClick={() => navigate("/profile")}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            className="profile-avatar-small"
          />
          <span>Profile</span>
        </div>
      </div>
    </>
  );
};

export default Header;
