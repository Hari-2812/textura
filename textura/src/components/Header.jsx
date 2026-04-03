import React, { useEffect, useMemo, useState } from "react";
import "../styles/Header.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  FaGlobe,
  FaBars,
  FaMoon,
  FaSun,
  FaTimes,
} from "react-icons/fa";

const Header = ({ onFilterToggle }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { cartCount } = useCart();
  const { user, setUser } = useUser();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, [setUser]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const navLinks = useMemo(
    () => [
      { label: "Home", path: "/" },
      { label: "Boys", path: "/boys" },
      { label: "Girls", path: "/girls" },
      { label: "Offers", path: "/offers" },
      { label: "Contact", path: "/contact" },
    ],
    []
  );

  const isProductPage = location.pathname.includes("/boys") || location.pathname.includes("/girls");

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (value.trim() === "") return setSuggestions([]);

    const filtered = products.filter((p) => p.name.toLowerCase().includes(value));
    setSuggestions(filtered.slice(0, 5));
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
          <button className="menu-icon" onClick={() => setOpenMenu(true)} aria-label="Open menu">
            <FaBars />
          </button>

          <div className="logo" onClick={() => navigate("/")}>
            <img src="https://cdn-icons-png.flaticon.com/512/2769/2769346.png" alt="Textura Logo" />
            <span>Textura</span>
          </div>

          <div className="desktop-links">
            {navLinks.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `header-link ${isActive ? "active" : ""}`}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="navbar-center">
            <div className="search-container">
              <input type="text" placeholder={t("searchPlaceholder")} value={search} onChange={handleSearchChange} />
              <FaSearch className="search-icon" />
              {suggestions.length > 0 && (
                <ul className="search-suggestions">
                  {suggestions.map((item) => (
                    <li key={item.id} onClick={() => navigate(item.category === "boys" ? "/boys" : "/girls")}>
                      <img src={item.img} alt={item.name} />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="navbar-right">
            <button className="nav-icon" onClick={() => navigate("/wishlist")}><FaHeart /></button>
            <button className="nav-icon" onClick={() => navigate("/cart")}><FaShoppingCart />{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</button>
            {isProductPage && <button className="nav-icon" onClick={onFilterToggle}><FaFilter /></button>}
            <button className="nav-icon" onClick={() => navigate("/language")}><FaGlobe /></button>
            <button className="nav-icon" onClick={() => setDarkMode((prev) => !prev)}>{darkMode ? <FaSun /> : <FaMoon />}</button>

            <div className="profile-box" onClick={() => setShowProfile((v) => !v)}>
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="profile-avatar" alt="User profile" />
              {showProfile && (
                <div className="profile-dropdown">
                  <p onClick={() => navigate("/profile")}>Profile</p>
                  <p onClick={() => navigate("/orders")}>Orders</p>
                  <p onClick={handleLogout}>Logout</p>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <div className={`sidebar ${openMenu ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button onClick={() => setOpenMenu(false)}><FaTimes /></button>
        </div>
        <ul className="sidebar-links">
          {navLinks.map((item) => (
            <li key={item.path} onClick={() => { navigate(item.path); setOpenMenu(false); }}>{item.label}</li>
          ))}
          <li onClick={() => { setDarkMode((prev) => !prev); setOpenMenu(false); }}>Switch Theme</li>
          <li onClick={() => { handleLogout(); setOpenMenu(false); }}>Logout</li>
        </ul>
      </div>
      {openMenu && <div className="overlay" onClick={() => setOpenMenu(false)} />}
    </>
  );
};

export default Header;
