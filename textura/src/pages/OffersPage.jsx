import React, { useEffect, useState } from "react";
import "../styles/OffersPage.css";
import axios from "axios";
import socket from "../socket";
import { buildApiUrl, buildBackendUrl } from "../api";
import { useCart } from "../context/CartContext";

const getOfferImage = (image) => {
  if (!image) return "";
  return image.startsWith("http") ? image : buildBackendUrl(image);
};

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const { addToCart } = useCart();
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2000);
  };

  useEffect(() => {
    const handleOfferUpdated = (offer) => {
      setOffers((prev) => [offer, ...prev.filter((item) => item._id !== offer._id)]);
      showToast("🔥 New Offer Added!");
    };

    socket.on("offerUpdated", handleOfferUpdated);

    return () => {
      socket.off("offerUpdated", handleOfferUpdated);
    };
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(buildApiUrl("/offers"));
        setOffers(res.data.offers || []);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  const handleAddToCart = (offer) => {
    addToCart({
      id: offer._id,
      name: offer.title,
      price: offer.price || 0,
      img: getOfferImage(offer.image),
    });

    showToast("✔ Added to Cart!");
  };

  return (
    <section className="offers-page">
      {toast.show && <div className="offer-toast">{toast.message}</div>}

      <h2 className="offers-title">🔥 Latest Offers</h2>

      <div className="offers-container">
        {offers.length === 0 ? (
          <p className="no-offers">No offers available right now.</p>
        ) : (
          offers.map((offer) => (
            <div className="offer-card" key={offer._id}>
              {offer.image && <img src={getOfferImage(offer.image)} alt={offer.title} />}

              <div className="offer-text">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>

                {offer.endDate && (
                  <span className="offer-valid">
                    Valid till: {new Date(offer.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <button className="add-cart-btn" onClick={() => handleAddToCart(offer)}>
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
