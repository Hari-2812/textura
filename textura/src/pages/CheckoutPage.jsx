import React, { useState } from "react";
import "../styles/CheckoutPage.css";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { user, setUser } = useUser();
  const { cartItems, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [upiId, setUpiId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    address: user?.address || "",
  });

  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user?.name || !user?.address) {
      alert("Please update your profile details before placing the order.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty! Add products before checkout.");
      return;
    }

    // Handle UPI validation
    if (paymentMethod === "upi" && !upiId) {
      alert("Please enter your UPI ID.");
      return;
    }

    // Prepare order data to send to backend
    const orderData = {
  customerName: user.name,
  customerEmail: user.email,
  address: user.address,
  paymentMethod,
  upiId: paymentMethod === "upi" ? upiId : null,

  items: cartItems.map((item) => ({
    name: item.name,
    price: parseInt(item.price.replace(/[₹,]/g, "")),
    quantity: item.quantity, // FIX: use "quantity" not "qty"
  })),

  total: cartItems.reduce(
    (sum, item) =>
      sum +
      parseInt(item.price.replace(/[₹,]/g, "")) * item.quantity,
    0
  ),

  status: "Pending",
  createdAt: new Date(),
};



    try {
      const response = await fetch(`${backendUrl}/api/admin/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Order placed successfully!");
        clearCart();
      } else {
        alert("❌ Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("⚠️ Server error: Could not connect to backend.");
    }
  };

  // 🧠 Handle user info update
  const handleSaveDetails = () => {
    if (!editData.name || !editData.address) {
      alert("Both fields are required.");
      return;
    }

    setUser((prev) => ({ ...prev, name: editData.name, address: editData.address }));
    localStorage.setItem("user", JSON.stringify({ ...user, ...editData }));
    setShowEditModal(false);
    alert("Customer details updated successfully ✅");
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        <h2 className="checkout-title">🛒 Checkout</h2>

        <div className="checkout-card">
          {/* 👤 Customer Info */}
          <div className="customer-info">
            <h3>Customer Details</h3>
            <p>
              <strong>Name:</strong> {user?.name || "Not available"}
            </p>
            <p>
              <strong>Address:</strong> {user?.address || "No address added"}
            </p>

            {(!user?.name || !user?.address) && (
              <button
                className="update-btn"
                onClick={() => setShowEditModal(true)}
              >
                Update Details
              </button>
            )}
          </div>

          {/* 💳 Payment Section */}
          <div className="payment-method">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                />
                UPI Payment
              </label>
            </div>

            {paymentMethod === "upi" && (
              <div className="upi-input">
                <label>Enter your UPI ID</label>
                <input
                  type="text"
                  placeholder="e.g., username@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* 🚀 Place Order */}
          <button onClick={handlePlaceOrder} className="place-order-btn">
            Place Order
          </button>
        </div>
      </div>

      {/* ✏️ Edit Modal */}
      {showEditModal && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Update Customer Details</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <textarea
              placeholder="Enter your delivery address"
              value={editData.address}
              onChange={(e) =>
                setEditData({ ...editData, address: e.target.value })
              }
            ></textarea>
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSaveDetails}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
