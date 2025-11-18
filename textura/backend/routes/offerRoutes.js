import React, { useEffect, useState } from "react";
import "../styles/OffersPage.css";
import axios from "axios";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);

  // 🔄 Fetch offers from backend API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // ✅ You can later replace this URL with your backend API
        const res = await axios.get("/api/offers");
        setOffers(res.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
        // Dummy offers for now
        setOffers([
          {
            id: 1,
            title: "🎉 Diwali Festive Sale!",
            description: "Flat 50% OFF on all Kidswear. Limited time offer.",
            image:
              "https://images.unsplash.com/photo-1600181958243-23154e1b6d4e?auto=format&fit=crop&w=600&q=60",
            validTill: "Nov 20, 2025",
          },
          {
            id: 2,
            title: "👗 New Winter Collection",
            description:
              "Buy 2 get 1 FREE on Jackets, Hoodies, and Sweatshirts.",
            image:
              "https://images.unsplash.com/photo-1600181958243-23154e1b6d4e?auto=format&fit=crop&w=600&q=60",
            validTill: "Dec 31, 2025",
          },
          {
            id: 3,
            title: "🎁 Weekend Bonanza",
            description:
              "Use code WEEKEND20 to get extra 20% off on selected items.",
            image:
              "https://images.unsplash.com/photo-1562158070-622a935f463e?auto=format&fit=crop&w=600&q=60",
            validTill: "Nov 15, 2025",
          },
        ]);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="offers-page">
      <h2 className="offers-title">🔥 Latest Offers & Deals</h2>

      {offers.length === 0 ? (
        <p className="no-offers">No active offers right now. Check back soon!</p>
      ) : (
        <div className="offers-grid">
          {offers.map((offer) => (
            <div className="offer-card" key={offer.id}>
              <img src={offer.image} alt={offer.title} />
              <div className="offer-content">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <span className="offer-valid">Valid till: {offer.validTill}</span>
                <button className="shop-now-btn">Shop Now</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersPage;
