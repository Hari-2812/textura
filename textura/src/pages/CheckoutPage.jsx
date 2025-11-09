import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "cod",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  // ✅ Calculate total safely
  const total =
    Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems.reduce(
          (sum, item) =>
            sum + item.quantity * parseInt(item.price.replace(/[₹,]/g, "")),
          0
        )
      : 0;

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Simulated “AI suggestion” for address typing
    if (name === "address" && value.length > 3) {
      setAiSuggestions([
        `${value} Street, Chennai`,
        `${value} Road, Coimbatore`,
        `${value} Nagar, Madurai`,
      ]);
    } else {
      setAiSuggestions([]);
    }
  };

  // ✅ Handle order placement
  const handleOrder = (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      alert("Please fill all details before placing the order!");
      return;
    }

    setShowSuccess(true);
    clearCart();
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="empty-checkout">Your cart is empty 🛒</p>
      ) : (
        <div className="checkout-container">
          {/* LEFT: ADDRESS FORM */}
          <form className="checkout-form" onSubmit={handleOrder}>
            <h3>Delivery Details</h3>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={form.address}
              onChange={handleChange}
            ></textarea>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <ul className="ai-suggestions">
                {aiSuggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setForm({ ...form, address: s });
                      setAiSuggestions([]);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
            >
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>

            <button type="submit" className="place-order-btn glow">
              Place Order
            </button>
          </form>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img src={item.img} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              Total: <strong>₹{total.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <div className="order-success-popup">
          <div className="popup-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
              alt="Success"
            />
            <h3>Order Placed Successfully 🎉</h3>
            <p>Thank you for shopping with Textura!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
