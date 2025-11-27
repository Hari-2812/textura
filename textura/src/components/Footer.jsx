import React from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import "../styles/Footer.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showEmailPopup, setShowEmailPopup] = React.useState(false);

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

  const goTo = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 20);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-row">

          {/* ----- ORIGINAL LEFT SIDE ----- */}
          <div className="footer-section company">
            <h3 className="footer-logo" onClick={() => goTo("/")}>Textura</h3>
            <p className="footer-desc">
              Redefining kids’ fashion — where comfort meets creativity.
              Discover premium quality and modern trends at Textura Garments.
            </p>
          </div>

          <div className="footer-section">
            <h3>Shop</h3>
            <p onClick={() => goTo("/boys")}>Boys</p>
            <p onClick={() => goTo("/girls")}>Girls</p>
            <p onClick={() => goTo("/offers")}>Offers</p>
            <p onClick={() => goTo("/wishlist")}>Wishlist</p>
          </div>

          <div className="footer-section">
            <h3>Explore</h3>
            <p onClick={() => goTo("/about")}>About Us</p>
            <p onClick={() => goTo("/language")}>Language</p>
            <p onClick={() => goTo("/help")}>Help Center</p>
          </div>

          {/* ----- ONLY THIS PART REMAINS UPDATED ----- */}
          <div className="footer-section">
            <h3>Follow Us</h3>

            <div className="footer-socials">
              
              <a className="social-icon instagram" href="#">
                <FaInstagram />
              </a>

              <a
                className="social-icon whatsapp"
                href="https://api.whatsapp.com/send?phone=919361876698"
                target="_blank"
              >
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" />
              </a>

              <a
                className="social-icon telegram"
                href="https://t.me/YOUR_TELEGRAM"
                target="_blank"
              >
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" />
              </a>

              <a className="social-icon email" onClick={handleEmailClick}>
                <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" />
              </a>
            </div>
          </div>
        </div>

        {/* ----- ORIGINAL BOTTOM REMAIN SAME ----- */}
        <div className="footer-bottom">
          <p>© 2025 Textura Garments | All Rights Reserved</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
