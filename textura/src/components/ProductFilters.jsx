import React, { useState } from "react";
import "../styles/ProductFilters.css";

const ProductFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    price: "all",
    style: "all",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search products..."
        name="search"
        value={filters.search}
        onChange={handleChange}
      />

      <select name="price" value={filters.price} onChange={handleChange}>
        <option value="all">All Prices</option>
        <option value="0-500">Under ₹500</option>
        <option value="500-1000">₹500 - ₹1000</option>
        <option value="1000-2000">₹1000 - ₹2000</option>
      </select>

      <select name="style" value={filters.style} onChange={handleChange}>
        <option value="all">All Styles</option>
        <option value="Solid">Solid</option>
        <option value="Striped">Striped</option>
        <option value="Printed">Printed</option>
      </select>

      <button onClick={() => onFilterChange(filters)}>Apply</button>
    </div>
  );
};

export default ProductFilters;
