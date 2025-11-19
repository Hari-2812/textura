import React, { useState } from "react";
import "../styles/CheckoutPage.css";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { STATES, DISTRICTS } from "./ProfilePage";

const CheckoutPage = () => {
  const { user, setUser } = useUser();
  const { cartItems, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [upiId, setUpiId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [editData, setEditData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    state: user?.state || "",
    district: user?.district || "",
    pincode: user?.pincode || "",
    landmark: user?.landmark || "",
  });

  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  /* ============================================================
      VALIDATION FUNCTION
  ============================================================ */
  const validateDetails = () => {
    const nameRegex = /^[A-Za-z ]{3,}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!nameRegex.test(editData.name)) {
      alert("Please enter a valid name.");
      return false;
    }

    if (!phoneRegex.test(editData.phone)) {
      alert("Phone number must be 10 digits.");
      return false;
    }

    if (editData.address.length < 10) {
      alert("Please enter a full detailed address.");
      return false;
    }

    if (!STATES.includes(editData.state)) {
      alert("Please select a valid state.");
      return false;
    }

    const districts = DISTRICTS[editData.state] || [];
    if (!districts.includes(editData.district)) {
      alert("Please select a valid district.");
      return false;
    }

    if (!pincodeRegex.test(editData.pincode)) {
      alert("Pincode must be 6 digits.");
      return false;
    }

    return true;
  };

  /* ============================================================
      SAVE PROFILE MODAL DETAILS
  ============================================================ */
  const handleSaveDetails = () => {
    if (!validateDetails()) return;

    const updatedUser = {
      ...user,
      name: editData.name,
      phone: editData.phone,
      address: editData.address,
      state: editData.state,
      district: editData.district,
      pincode: editData.pincode,
      landmark: editData.landmark,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setShowEditModal(false);
    alert("Customer details updated successfully ✅");
  };

  /* ============================================================
      PLACE ORDER
  ============================================================ */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user?.name || !user?.address || !user?.state) {
      alert("Please complete your delivery address before placing the order.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      alert("Please enter your UPI ID.");
      return;
    }

    const orderData = {
      customerName: user.name,
      customerEmail: user.email,
      address: user.address,
      state: user.state,
      district: user.district,
      pincode: user.pincode,
      landmark: user.landmark,
      paymentMethod,
      upiId: paymentMethod === "upi" ? upiId : null,

      items: cartItems.map((item) => ({
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),

      total: cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
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
        const id =
          data.order?.orderId || // backend nested
          data.orderId || // flat fallback
          data.id || // any other naming
          "";

        setOrderId(id);

        setShowSuccess(true);
        clearCart();

        // DO NOT redirect instantly (give users time to see the orderId)
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      } else {
        alert("❌ Order failed. Try again.");
      }
    } catch (error) {
      alert("⚠️ Server error while placing order.");
      console.error(error);
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        <h2 className="checkout-title">🛒 Checkout</h2>

        <div className="checkout-card">
          {/* CUSTOMER DETAILS */}
          <div className="customer-info">
            <h3>Delivery Details</h3>
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone}
            </p>
            <p>
              <strong>Address:</strong> {user?.address}
            </p>
            <p>
              <strong>State:</strong> {user?.state}
            </p>
            <p>
              <strong>District:</strong> {user?.district}
            </p>
            <p>
              <strong>Pincode:</strong> {user?.pincode}
            </p>
            <p>
              <strong>Landmark:</strong> {user?.landmark || "—"}
            </p>

            <button
              className="update-btn"
              onClick={() => setShowEditModal(true)}
            >
              Edit Details
            </button>
          </div>

          {/* PAYMENT SECTION */}
          <div className="payment-method">
            <h3>Payment Method</h3>

            <label className="radio-option">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>

            <label className="radio-option">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI Payment
            </label>

            {paymentMethod === "upi" && (
              <div className="upi-input">
                <input
                  type="text"
                  placeholder="example@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}

            <label className="radio-option">
              <input
                type="radio"
                value="qr"
                checked={paymentMethod === "qr"}
                onChange={() => setPaymentMethod("qr")}
              />
              QR Code Payment
            </label>

            {paymentMethod === "qr" && (
              <div className="qr-box">
                <p>Scan to Pay</p>
                <img src="/assets/qr-demo.png" alt="qr" className="qr-image" />
              </div>
            )}
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="order-success-modal">
          <div className="order-success-box">
            <h2>🎉 Order Placed Successfully!</h2>
            <p>Your Order ID:</p>
            <h3 className="order-id">{orderId}</h3>
            <p>Redirecting...</p>
          </div>
        </div>
      )}

      {/* EDIT DETAILS MODAL */}
      {showEditModal && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Update Delivery Details</h3>

            <input
              type="text"
              placeholder="Full Name"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={editData.phone}
              onChange={(e) =>
                setEditData({ ...editData, phone: e.target.value })
              }
            />

            <textarea
              placeholder="Full Address"
              value={editData.address}
              onChange={(e) =>
                setEditData({ ...editData, address: e.target.value })
              }
            ></textarea>

            {/* STATE */}
            <select
              value={editData.state}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  state: e.target.value,
                  district: "",
                })
              }
            >
              <option value="">Select State</option>
              {STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* DISTRICT */}
            <select
              value={editData.district}
              onChange={(e) =>
                setEditData({ ...editData, district: e.target.value })
              }
              disabled={!editData.state}
            >
              <option value="">Select District</option>
              {editData.state &&
                DISTRICTS[editData.state]?.map((dt) => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
            </select>

            <input
              type="text"
              placeholder="Pincode"
              value={editData.pincode}
              onChange={(e) =>
                setEditData({ ...editData, pincode: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Landmark (optional)"
              value={editData.landmark}
              onChange={(e) =>
                setEditData({ ...editData, landmark: e.target.value })
              }
            />

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
