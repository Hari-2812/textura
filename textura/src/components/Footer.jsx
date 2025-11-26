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
          <div className="footer-section company">
            <h3 className="footer-logo" onClick={() => goTo("/")}>Textura</h3>
            <p className="footer-desc">{t("footerTagline")}</p>
          </div>

          <div className="footer-section">
            <h3>{t("shop")}</h3>
            <p onClick={() => goTo("/boys")}>{t("boys")}</p>
            <p onClick={() => goTo("/girls")}>{t("girls")}</p>
            <p onClick={() => goTo("/offers")}>{t("offers")}</p>
            <p onClick={() => goTo("/wishlist")}>{t("wishlist")}</p>
          </div>

          <div className="footer-section">
            <h3>{t("explore")}</h3>
            <p onClick={() => goTo("/about")}>{t("about")}</p>
            <p onClick={() => goTo("/language")}>{t("language")}</p>
            <p onClick={() => goTo("/help")}>{t("help")}</p>
          </div>

          <div className="footer-section">
            <h3>{t("followUs")}</h3>

            <div className="footer-socials">
              <a className="social-icon instagram">
                <FaInstagram />
              </a>
              <a className="social-icon whatsapp">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" />
              </a>
              <a className="social-icon telegram">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" />
              </a>
              <a className="social-icon email" onClick={handleEmailClick}>
                <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Textura Garments | All Rights Reserved</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
