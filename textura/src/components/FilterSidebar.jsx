import React from "react";

const FilterSidebar = ({
  className,
  search,
  setSearch,
  price,
  setPrice,
  style,
  setStyle,
  material,
  setMaterial,
  age,
  setAge,
  rating,
  setRating,
  handleFilter,
}) => {
  return (
    <aside className={className}>
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          value={search}
          placeholder="Search product..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        <select value={price} onChange={(e) => setPrice(e.target.value)}>
          <option value="all">All</option>
          <option value="0-1000">Under ₹1000</option>
          <option value="1000-2000">₹1000 - ₹2000</option>
          <option value="2000-5000">₹2000 - ₹5000</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Style</label>
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="all">All</option>
          <option value="Solid">Solid</option>
          <option value="Printed">Printed</option>
          <option value="Striped">Striped</option>
          <option value="Floral">Floral</option>
          <option value="Casual">Casual</option>
          <option value="Party">Party</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Material</label>
        <select value={material} onChange={(e) => setMaterial(e.target.value)}>
          <option value="all">All</option>
          <option value="Cotton">Cotton</option>
          <option value="Denim">Denim</option>
          <option value="Polyester">Polyester</option>
          <option value="Linen">Linen</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Age Group</label>
        <select value={age} onChange={(e) => setAge(e.target.value)}>
          <option value="all">All</option>
          <option value="4-6">4–6 Years</option>
          <option value="6-10">6–10 Years</option>
          <option value="10-14">10–14 Years</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="all">All</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
        </select>
      </div>

      <button className="apply-filter-btn" onClick={handleFilter}>
        Apply Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
