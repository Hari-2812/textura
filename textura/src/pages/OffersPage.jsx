import React, { useEffect, useState } from "react";
import "../styles/OffersPage.css";
import axios from "axios";
import io from "socket.io-client";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);

  // ⭐ Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  // ⭐ Socket Real-time Updates
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("newOffer", (offer) => {
      setOffers((prev) => [offer, ...prev]);
      showToast("🔥 New Offer Added!");
    });

    return () => socket.disconnect();
  }, []);

  // 🔄 Fetch existing offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/offers");
        setOffers(res.data.offers || []);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="offers-page">

      {/* ⭐ Real-time Toast Popup */}
      <div className={`offer-toast ${toast.show ? "show" : ""}`}>
        {toast.message}
      </div>

      <h2 className="offers-title">🔥 Latest Offers & Deals</h2>

      {offers.length === 0 ? (
        <p className="no-offers">
          No active offers right now. Check back soon!
        </p>
      ) : (
        <div className="offers-grid">
          {offers.map((offer) => (
            <div className="offer-card" key={offer._id}>
              <img
                src={`http://localhost:5000${offer.image}`}
                alt={offer.title}
              />

              <div className="offer-content">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>

                {offer.endDate && (
                  <span className="offer-valid">
                    Valid till: {new Date(offer.endDate).toLocaleDateString()}
                  </span>
                )}

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
