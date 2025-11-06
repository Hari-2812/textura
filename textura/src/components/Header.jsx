import React from "react";

const Header = () => {
  return (
    <header className="header">
      <span className="material-icons menu-icon">menu</span>
      <input
        type="text"
        className="search-bar"
        placeholder="Search products..."
      />
      <div className="icons">
        <span className="material-icons">favorite_border</span>
        <span className="material-icons">shopping_cart</span>
        <span className="material-icons">person_outline</span>
      </div>
    </header>

  );
};

export default Header;
