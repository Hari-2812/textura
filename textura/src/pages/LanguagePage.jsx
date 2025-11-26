import React, { useState, useEffect } from "react";
import "../styles/LanguagePage.css";
import { FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
];

const LanguagePage = () => {
  const { i18n } = useTranslation();

  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("preferredLang") || "en"
  );

  // ⭐ Global toast function (same as Add to Cart)
  const showToast = (msg) => {
    const box = document.getElementById("toast-container");
    const div = document.createElement("div");

    div.className = "toast";
    div.innerText = msg;
    box.appendChild(div);

    setTimeout(() => div.remove(), 2500);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang.code);
    i18n.changeLanguage(lang.code);

    localStorage.setItem("preferredLang", lang.code);

    showToast(`🌐 Language changed to: ${lang.name}`);
  };

  return (
    <div className="language-page">
      <div className="language-header">
        <FiGlobe className="lang-icon" />
        <h1>Select Language</h1>
      </div>

      <div className="language-grid">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={`language-card ${
              selectedLang === lang.code ? "selected" : ""
            }`}
            onClick={() => handleLanguageChange(lang)}
          >
            <span className="flag">{lang.flag}</span>
            <h3>{lang.name}</h3>
            {selectedLang === lang.code && (
              <p className="active-label">Selected</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguagePage;
