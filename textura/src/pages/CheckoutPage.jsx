import React, { useState } from "react";
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

  // 🧩 Safely calculate total
  const total =
    Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems.reduce(
          (sum, item) =>
            sum + item.quantity * parseInt(item.price.replace(/[₹,]/g, "")),
          0
        )
      : 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = () => {
    if (!form.name || !form.address || !form.phone) {
      alert("Please fill all details before placing the order!");
      return;
    }
    alert(`🎉 Order placed successfully! Total: ₹${total}`);
    clearCart();
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="empty-checkout">Your cart is empty 🛒</p>
      ) : (
        <>
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <img src={item.img} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary">
            <h3>Total: ₹{total.toLocaleString()}</h3>
            <form className="checkout-form">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="address"
                placeholder="Delivery Address"
                value={form.address}
                onChange={handleChange}
              />
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

              <button type="button" onClick={handleOrder}>
                Place Order
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
