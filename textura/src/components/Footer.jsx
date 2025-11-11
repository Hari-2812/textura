import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
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

        {/* 🛍️ Shop Section */}
        <div className="footer-section">
          <h3>Shop</h3>
          <p onClick={() => navigate("/boys")}>Boys</p>
          <p onClick={() => navigate("/girls")}>Girls</p>
          <p onClick={() => navigate("/offers")}>Offers</p>
          <p onClick={() => navigate("/wishlist")}>Wishlist</p>
        </div>

        {/* 🌍 Explore Section */}
        <div className="footer-section">
          <h3>Explore</h3>
          <p onClick={() => navigate("/about")}>About Us</p>
          <p onClick={() => navigate("/language")}>Language</p>
          <p onClick={() => navigate("/help")}>Help Center</p>
        </div>

        {/* 🌐 Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter">
              <FaTwitter />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube">
              <FaYoutube />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn">
              <FaLinkedinIn />
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
