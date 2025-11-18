import React from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-row">

        {/* 🏢 Company Info */}
        <div className="footer-section company">
          <h3 className="footer-logo" onClick={() => navigate("/")}>
            Textura
          </h3>
          <p className="footer-desc">
            Redefining kids’ fashion — where comfort meets creativity.
            Discover premium quality and modern trends at Textura Garments.
          </p>
        </div>

        {/* 🛍️ Shop */}
        <div className="footer-section">
          <h3>Shop</h3>
          <p onClick={() => navigate("/boys")}>Boys</p>
          <p onClick={() => navigate("/girls")}>Girls</p>
          <p onClick={() => navigate("/offers")}>Offers</p>
          <p onClick={() => navigate("/wishlist")}>Wishlist</p>
        </div>

        {/* 🌍 Explore */}
        <div className="footer-section">
          <h3>Explore</h3>
          <p onClick={() => navigate("/about")}>About Us</p>
          <p onClick={() => navigate("/language")}>Language</p>
          <p onClick={() => navigate("/help")}>Help Center</p>
        </div>

        {/* 🌐 Follow Us */}
        <div className="footer-section">
          <h3>Follow Us</h3>

          <div className="footer-socials">

            {/* Instagram */}
            <a
              href="https://instagram.com/YOUR_INSTAGRAM"
              target="_blank"
              rel="noreferrer"
              className="social-icon instagram"
            >
              <FaInstagram />
            </a>

            {/* WhatsApp */}
            <a
              href="https://api.whatsapp.com/send?phone=919876543210"
              target="_blank"
              rel="noreferrer"
              className="social-icon whatsapp"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" />
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/YOUR_TELEGRAM"
              target="_blank"
              rel="noreferrer"
              className="social-icon telegram"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" alt="Telegram" />
            </a>

            {/* Email */}
            <a
              href="mailto:Textura0511@gmail.com"
              className="social-icon email"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" />
            </a>

          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 Textura Garments | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
