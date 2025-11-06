import React from "react";

const Header = () => {
  return (
    <header className="header">
      <div className="menu-icon">☰</div>
      <input type="text" className="search-bar" placeholder="Search products..." />
      <div className="icons">
        <span>❤️</span>
        <span>🛒</span>
        <span>👤</span>
      </div>
    </header>
  );
};

export default Header;
