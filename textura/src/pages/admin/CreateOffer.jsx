import React, { useState } from "react";
import axios from "axios";
import "../../styles/CreateOffer.css";

const CreateOffer = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    setLoading(true);

    try {
      const response = await axios.post(
        "https://textura-z80b.onrender.com/api/offers/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Offer posted & sent to subscribers!");
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Error creating offer");
    }

    setLoading(false);
  };

  return (
    <div className="create-offer-container">
      <h2>Create New Offer</h2>

      <form onSubmit={handleSubmit} className="offer-form">
        <label>Offer Title</label>
        <input
          type="text"
          placeholder="Offer Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
          placeholder="Write offer details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label>Upload Offer Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit" className="submit-offer-btn" disabled={loading}>
          {loading ? "Sending..." : "Post Offer"}
        </button>
      </form>
    </div>
  );
};

export default CreateOffer;
