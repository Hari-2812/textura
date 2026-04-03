import React from "react";
import "../../styles/ProductCollectionState.css";

export const ProductGridSkeleton = () => (
  <div className="product-grid-skeleton" aria-hidden="true">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div className="skeleton-card" key={idx}>
        <div className="skeleton-img" />
        <div className="skeleton-line short" />
        <div className="skeleton-line" />
        <div className="skeleton-btn" />
      </div>
    ))}
  </div>
);

const ProductCollectionState = ({ title, description, actionLabel, onAction }) => (
  <div className="product-state-card">
    <h3>{title}</h3>
    <p>{description}</p>
    {actionLabel && (
      <button type="button" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default ProductCollectionState;
