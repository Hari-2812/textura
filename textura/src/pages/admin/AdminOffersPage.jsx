import React, { useState } from "react";
import "../../styles/AdminOffersPage.css";
import socket from "../../socket"; // FIXED

const AdminOffersPage = () => {
  const [offerData, setOfferData] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⭐ Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type });
    }, 2500);
  };

  const handleChange = (e) => {
    setOfferData({
      ...offerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!offerData.title.trim()) return showToast("Enter a title", "error");
    if (!offerData.description.trim()) return showToast("Enter description", "error");
    if (!offerData.category) return showToast("Select a category", "error");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", offerData.title);
      formData.append("description", offerData.description);
      formData.append("category", offerData.category);
      formData.append("startDate", offerData.startDate);
      formData.append("endDate", offerData.endDate);

      if (image) formData.append("image", image);

      const response = await fetch(
        "http://localhost:5000/api/offers/send-offer",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        showToast("🎉 Offer posted & notifications sent!", "success");

        // Notify all customers in real-time
        socket.emit("newOffer", result.offer);

        // Reset form
        setOfferData({
          title: "",
          description: "",
          category: "",
          startDate: "",
          endDate: "",
        });
        setImage(null);
      } else {
        showToast("Failed to send offer", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong!", "error");
    }

    setLoading(false);
  };

  return (
    <div className="offers-page-container">

      {/* ⭐ Beautiful Toast Popup */}
      <div className={`notify-popup ${toast.show ? "show" : ""} ${toast.type}`}>
        <i className="fa-solid fa-circle-check"></i>
        {toast.message}
      </div>

      <h2>Create New Offer</h2>

      <form className="offer-form" onSubmit={handleSubmit}>
        <label>Offer Title</label>
        <input
          type="text"
          name="title"
          value={offerData.title}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={offerData.description}
          onChange={handleChange}
        ></textarea>

        <label>Category</label>
        <select
          name="category"
          value={offerData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Clothing">Clothing</option>
          <option value="Kids Wear">Kids Wear</option>
          <option value="Mens Wear">Men's Wear</option>
          <option value="Womens Wear">Women's Wear</option>
          <option value="Festival Offer">Festival Offer</option>
          <option value="Season Sale">Season Sale</option>
        </select>

        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={offerData.startDate}
          onChange={handleChange}
        />

        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={offerData.endDate}
          onChange={handleChange}
        />

        <label>Offer Image</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit" className="offer-submit-btn" disabled={loading}>
          {loading ? "Sending Offer..." : "Create Offer"}
        </button>
      </form>
    </div>
  );
};

export default AdminOffersPage;
