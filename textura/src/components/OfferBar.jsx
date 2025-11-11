// src/components/OfferBar.jsx
import React, { useEffect, useState } from "react";
import "../styles/OfferBar.css";

const OfferBar = () => {
  // ✨ Multiple offers to rotate through
  const offers = [
    "✨ Festive Sale! Flat 50% Off on Kidswear",
    "🎉 Free Shipping on Orders Above ₹999",
    "💖 New Arrivals for Boys & Girls — Shop Now!",
    "🔥 Extra 10% Off for First-Time Shoppers",
  ];

  const [currentOffer, setCurrentOffer] = useState(0);

  // 🔁 Change offer every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [offers.length]);

  return (
    <div className="offer-bar">
      {/* 🌀 Smooth sliding animation */}
      <div key={currentOffer} className="offer-text fade-slide">
        {offers[currentOffer]}
      </div>
    </div>
  );
};

export default OfferBar;
