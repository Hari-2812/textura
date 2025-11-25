import React, { useEffect, useState } from "react";
import "../styles/OffersPage.css";
import axios from "axios";
import io from "socket.io-client";
import { useCart } from "../context/CartContext"; // ⭐ Added

const OffersPage = () => {
  const [offers, setOffers] = useState([]);

  // ⭐ Cart
  const { addToCart } = useCart(); // ⭐ Use cart context

  // ⭐ Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2000);
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

  // ⭐ Fetch Offers
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

  // ⭐ Add to Cart Handler
  const handleAddToCart = (offer) => {
    const item = {
      id: offer._id,
      name: offer.title,
      price: offer.price || 0,
      img: `http://localhost:5000${offer.image}`,
    };

    addToCart(item); // add item to cart
    showToast("✔ Added to Cart!");
  };

  return (
    <section className="offers-page">
      {/* ⭐ Toast */}
      {toast.show && <div className="offer-toast">{toast.message}</div>}

      <h2 className="offers-title">🔥 Latest Offers</h2>

      <div className="offers-container">
        {offers.length === 0 ? (
          <p className="no-offers">No offers available right now.</p>
        ) : (
          offers.map((offer) => (
            <div className="offer-card" key={offer._id}>
              <img
                src={`http://localhost:5000${offer.image}`}
                alt={offer.title}
              />

              <div className="offer-text">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>

                {offer.endDate && (
                  <span className="offer-valid">
                    Valid till: {new Date(offer.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* ⭐ NEW BUTTON */}
              <button
                className="add-cart-btn"
                onClick={() => handleAddToCart(offer)}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default OffersPage;
