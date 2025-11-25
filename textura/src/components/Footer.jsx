import React from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const [showEmailPopup, setShowEmailPopup] = React.useState(false);

  // 🔥 Handles email icon click
  const handleEmailClick = (e) => {
    e.preventDefault();

    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

    if (!isMobile) {
      window.open(
        "https://mail.google.com/mail/?view=cm&fs=1&to=Textura0511@gmail.com",
        "_blank"
      );
    } else {
      setShowEmailPopup(true);
    }
  };

  // ⭐ Reusable function: navigate then scroll to top
  const goTo = (path) => {
    navigate(path);
    // wait a tiny bit so the route change happens, then scroll
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 20);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-row">
          {/* 🏢 Company Info */}
          <div className="footer-section company">
            <h3 className="footer-logo" onClick={() => goTo("/")}>
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
            <p onClick={() => goTo("/boys")}>Boys</p>
            <p onClick={() => goTo("/girls")}>Girls</p>
            <p onClick={() => goTo("/offers")}>Offers</p>
            <p onClick={() => goTo("/wishlist")}>Wishlist</p>
          </div>

          {/* 🌍 Explore */}
          <div className="footer-section">
            <h3>Explore</h3>
            <p onClick={() => goTo("/about")}>About Us</p>
            <p onClick={() => goTo("/language")}>Language</p>
            <p onClick={() => goTo("/help")}>Help Center</p>
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
                href="https://api.whatsapp.com/send?phone=919361876698"
                target="_blank"
                rel="noreferrer"
                className="social-icon whatsapp"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                  alt="WhatsApp"
                />
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/YOUR_TELEGRAM"
                target="_blank"
                rel="noreferrer"
                className="social-icon telegram"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png"
                  alt="Telegram"
                />
              </a>

              {/* Email */}
              <a className="social-icon email" onClick={handleEmailClick}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                  alt="Email"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Textura Garments | All Rights Reserved</p>
        </div>
      </footer>

      {/* 🌟 Email Selection Popup (Mobile Only) */}
      {showEmailPopup && (
        <div className="email-popup-overlay">
          <div className="email-popup">
            <h4>Send Email</h4>
            <p>How would you like to open your email?</p>

            <div className="email-popup-buttons">
              <button
                className="email-btn app"
                onClick={() => {
                  window.location.href = "mailto:Textura0511@gmail.com";
                  setShowEmailPopup(false);
                }}
              >
                Gmail App
              </button>

              <button
                className="email-btn browser"
                onClick={() => {
                  window.open(
                    "https://mail.google.com/mail/?view=cm&fs=1&to=Textura0511@gmail.com",
                    "_blank"
                  );
                  setShowEmailPopup(false);
                }}
              >
                Browser
              </button>

              <button
                className="email-btn cancel"
                onClick={() => setShowEmailPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
