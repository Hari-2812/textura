import React, { useState, useEffect } from "react";
import "../styles/LanguagePage.css";
import { FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം (Malayalam)", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { code: "fr", name: "Français (French)", flag: "🇫🇷" },
];

const LanguagePage = () => {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("preferredLang") || "en"
  );

  // Persist selected language
  useEffect(() => {
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("preferredLang", selectedLang);
  }, [selectedLang, i18n]);

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang.code);
    i18n.changeLanguage(lang.code);
    localStorage.setItem("preferredLang", lang.code);
    alert(`🌐 Language changed to ${lang.name}`);
  };

  return (
    <div className="language-page">
      <div className="language-header">
        <FiGlobe className="lang-icon" />
        <h1>Choose Your Language</h1>
        <p>Select your preferred language for a better experience</p>
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

      <div className="language-footer">
        <p>
          🌏 Your language preference is saved — you can change it anytime from
          the menu.
        </p>
      </div>
    </div>
  );
};

export default LanguagePage;
