// src/components/OfferBar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OfferBar.css";

const OfferBar = () => {
  const navigate = useNavigate();

  const offers = [
    "✨ Festive Sale! Flat 50% Off on Kidswear",
    "🎉 Free Shipping on Orders Above ₹999",
    "💖 New Arrivals for Boys & Girls — Shop Now!",
    "🔥 Extra 10% Off for First-Time Shoppers",
  ];

  const [currentOffer, setCurrentOffer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="offer-bar"
      onClick={() => navigate("/offers")}
      style={{ cursor: "pointer" }} // clickable
    >
      <div key={currentOffer} className="offer-text fade-slide">
        {offers[currentOffer]}
      </div>
    </div>
  );
};

export default OfferBar;
