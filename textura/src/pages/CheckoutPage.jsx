import React, { useState } from "react";
import "../styles/CheckoutPage.css";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { STATES, DISTRICTS } from "./ProfilePage";

const CheckoutPage = () => {
  const { user, setUser } = useUser();
  const { cartItems, clearCart } = useCart();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [errorMsg, setErrorMsg] = useState(""); // checkout error
  const [modalError, setModalError] = useState(""); // modal error

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
      VALIDATION (FOR MODAL)
  ============================================================ */
  const validateDetails = () => {
    const nameRegex = /^[A-Za-z ]{3,}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!nameRegex.test(editData.name)) {
      setModalError("Please enter a valid full name.");
      return false;
    }

    if (!phoneRegex.test(editData.phone)) {
      setModalError("Phone number must be exactly 10 digits.");
      return false;
    }

    if (editData.address.length < 10) {
      setModalError("Please enter a full detailed address.");
      return false;
    }

    if (!STATES.includes(editData.state)) {
      setModalError("Please select a valid state.");
      return false;
    }

    const districts = DISTRICTS[editData.state] || [];
    if (!districts.includes(editData.district)) {
      setModalError("Please select a valid district.");
      return false;
    }

    if (!pincodeRegex.test(editData.pincode)) {
      setModalError("Pincode must be exactly 6 digits.");
      return false;
    }

    setModalError("");
    return true;
  };

  /* ============================================================
      SAVE DETAILS (INSIDE MODAL)
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

    setModalError("");
    setErrorMsg("Delivery details updated successfully ✓");
    setShowEditModal(false);
  };

  /* ============================================================
      TOTAL
  ============================================================ */
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  /* ============================================================
      GPay Handler (UPI Deep Link)
  ============================================================ */
  const handleGooglePay = async () => {
    if (!user?.name || !user?.address || !user?.state) {
      setErrorMsg("Please complete your delivery details before payment.");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setErrorMsg("");

    // ⚠️ Change UPI ID if needed
    const upiId = "hariprasath2812@oksbi";
    const upiName = "Hari Prasath";

    const upiDeepLink = `upi://pay?pa=${encodeURIComponent(
      upiId
    )}&pn=${encodeURIComponent(
      upiName
    )}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent("Textura Order Payment")}`;

    // This works on MOBILE with UPI apps installed (GPay, PhonePe, Paytm, etc.)
    window.location.href = upiDeepLink;

    // After opening UPI app, assume payment success and place order
    // (No real verification – basic flow as you requested)
    setTimeout(async () => {
      await placeOrder("Google Pay (UPI)");
    }, 2500);
  };

  /* ============================================================
      PLACE ORDER (called after UPI intent)
  ============================================================ */
  const placeOrder = async (paymentMethod) => {
    const orderData = {
      customerName: user.name,
      customerEmail: user.email,
      address: user.address,
      state: user.state,
      district: user.district,
      pincode: user.pincode,
      landmark: user.landmark,
      paymentMethod, // "Google Pay (UPI)"

      items: cartItems.map((item) => ({
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),

      total: totalPrice,
      status: "Pending",
      createdAt: new Date(),
    };

    try {
      const response = await fetch(`${backendUrl}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        const id = data.order?.orderId || data.orderId || data.id || "";
        setOrderId(id);
        setShowSuccess(true);
        clearCart();

        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      } else {
        setErrorMsg("Order failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Server error. Please try again later.");
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        <h2 className="checkout-title">🛒 Checkout</h2>

        <div className="checkout-card">
          {/* CUSTOMER INFO */}
          <div className="customer-info">
            <h3>Delivery Details</h3>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Address:</strong> {user?.address}</p>
            <p><strong>State:</strong> {user?.state}</p>
            <p><strong>District:</strong> {user?.district}</p>
            <p><strong>Pincode:</strong> {user?.pincode}</p>
            <p><strong>Landmark:</strong> {user?.landmark || "—"}</p>

            <button
              className="update-btn"
              onClick={() => setShowEditModal(true)}
            >
              Edit Details
            </button>
          </div>

          {/* TOTAL */}
          <h3 style={{ textAlign: "center", marginBottom: "12px" }}>
            Total Amount: <strong>₹{totalPrice}</strong>
          </h3>

          {/* INLINE ERROR */}
          {errorMsg && <div className="checkout-error-box">{errorMsg}</div>}

          {/* GPay BUTTON */}
          <button className="gpay-btn" onClick={handleGooglePay}>
            <img
              src="/images/gpay-logo.png"
              alt="Google Pay"
              className="gpay-logo"
            />
            Pay with Google Pay
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

            {modalError && (
              <div className="modal-error-box">{modalError}</div>
            )}

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
                onClick={() => {
                  setModalError("");
                  setShowEditModal(false);
                }}
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
