import React, { useMemo, useState } from "react";
import "./CheckoutPage.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const normalizePrice = (p) => {
  // supports "₹1,299" or 1299
  if (typeof p === "number") return p;
  if (!p) return 0;
  return parseInt(String(p).replace(/[^\d]/g, ""), 10) || 0;
};

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // If you already store profile in localStorage, it will appear here.
  const savedProfile =
    JSON.parse(localStorage.getItem("profile") || "null") || {
      name: "Guest User",
      phone: "+91 98xxxxxxx",
      email: "guest@example.com",
      address: "Add your address in Profile",
    };

  const [payMethod, setPayMethod] = useState("upi"); // upi | card | wallet | cod
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [wallet, setWallet] = useState("phonepe"); // phonepe | paytm | amazon

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + normalizePrice(item.price) * (item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    // small front-end validations
    if (payMethod === "upi" && !upiId.trim()) {
      alert("Please enter a valid UPI ID");
      return;
    }
    if (
      payMethod === "card" &&
      (!card.number || !card.name || !card.expiry || !card.cvv)
    ) {
      alert("Please complete your card details.");
      return;
    }

    alert(`✅ Order placed via ${payMethod.toUpperCase()} for ₹${total.toLocaleString()}`);
    clearCart();
    navigate("/");
  };

  const payCta =
    payMethod === "cod"
      ? "Place Order (COD)"
      : payMethod === "upi"
      ? "Pay & Place Order"
      : payMethod === "card"
      ? "Pay Securely"
      : "Pay from Wallet";

  return (
    <div className="co-wrap">
      <h2 className="co-title">Checkout</h2>

      <div className="co-grid">
        {/* LEFT */}
        <div className="co-left">
          {/* Customer (read-only from profile) */}
          <section className="co-card co-user">
            <div className="co-card-head">
              <h3>Delivery Details</h3>
              <button
                className="co-mini-btn"
                onClick={() => navigate("/account")}
              >
                Edit in Profile
              </button>
            </div>
            <div className="co-user-grid">
              <div>
                <p className="co-label">Name</p>
                <p className="co-val">{savedProfile.name}</p>
              </div>
              <div>
                <p className="co-label">Phone</p>
                <p className="co-val">{savedProfile.phone}</p>
              </div>
              <div className="co-col-span">
                <p className="co-label">Email</p>
                <p className="co-val">{savedProfile.email}</p>
              </div>
              <div className="co-col-span">
                <p className="co-label">Address</p>
                <p className="co-val">{savedProfile.address}</p>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="co-card co-pay">
            <h3>Payment Method</h3>

            <div className="co-pay-tabs">
              <button
                className={`co-tab ${payMethod === "upi" ? "active" : ""}`}
                onClick={() => setPayMethod("upi")}
              >
                UPI
              </button>
              <button
                className={`co-tab ${payMethod === "card" ? "active" : ""}`}
                onClick={() => setPayMethod("card")}
              >
                Card
              </button>
              <button
                className={`co-tab ${payMethod === "wallet" ? "active" : ""}`}
                onClick={() => setPayMethod("wallet")}
              >
                Wallet
              </button>
              <button
                className={`co-tab ${payMethod === "cod" ? "active" : ""}`}
                onClick={() => setPayMethod("cod")}
              >
                COD
              </button>
            </div>

            {payMethod === "upi" && (
              <div className="co-pay-body">
                <label className="co-field">
                  <span>Enter UPI ID</span>
                  <input
                    type="text"
                    placeholder="yourname@oksbi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </label>
                <div className="co-hint">Supports GPay, PhonePe, Paytm UPI.</div>
              </div>
            )}

            {payMethod === "card" && (
              <div className="co-pay-body co-card-grid">
                <label className="co-field co-col-span">
                  <span>Card Number</span>
                  <input
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={(e) =>
                      setCard((s) => ({ ...s, number: e.target.value }))
                    }
                  />
                </label>
                <label className="co-field">
                  <span>Expiry (MM/YY)</span>
                  <input
                    placeholder="08/28"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard((s) => ({ ...s, expiry: e.target.value }))
                    }
                  />
                </label>
                <label className="co-field">
                  <span>CVV</span>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="***"
                    value={card.cvv}
                    onChange={(e) =>
                      setCard((s) => ({ ...s, cvv: e.target.value }))
                    }
                  />
                </label>
                <label className="co-field co-col-span">
                  <span>Name on Card</span>
                  <input
                    placeholder="Hari Prasath"
                    value={card.name}
                    onChange={(e) =>
                      setCard((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                </label>
              </div>
            )}

            {payMethod === "wallet" && (
              <div className="co-pay-body">
                <div className="co-wallets">
                  {["phonepe", "paytm", "amazon"].map((w) => (
                    <label
                      key={w}
                      className={`co-wallet ${wallet === w ? "active" : ""}`}
                      onClick={() => setWallet(w)}
                    >
                      <input
                        type="radio"
                        checked={wallet === w}
                        onChange={() => setWallet(w)}
                      />
                      <span className="co-wallet-name">
                        {w === "phonepe"
                          ? "PhonePe Wallet"
                          : w === "paytm"
                          ? "Paytm Wallet"
                          : "Amazon Pay"}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="co-hint">You’ll be redirected to wallet.</div>
              </div>
            )}

            {payMethod === "cod" && (
              <div className="co-pay-body">
                <div className="co-cod">
                  <p>
                    Pay <strong>cash</strong> to the delivery partner. Additional
                    verification may be required.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT */}
        <aside className="co-right">
          <section className="co-card co-summary">
            <h3>Order Summary</h3>

            {cartItems.length === 0 ? (
              <p className="co-empty">Your cart is empty.</p>
            ) : (
              <>
                <ul className="co-list">
                  {cartItems.map((item) => {
                    const price = normalizePrice(item.price);
                    return (
                      <li className="co-line" key={item.id}>
                        <img src={item.img} alt={item.name} />
                        <div className="co-line-info">
                          <p className="co-name">{item.name}</p>
                          <p className="co-meta">
                            ₹{price.toLocaleString()} × {item.quantity || 1}
                          </p>
                        </div>
                        <div className="co-line-total">
                          ₹{(price * (item.quantity || 1)).toLocaleString()}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="co-totals">
                  <div>
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <div className="co-grand">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button className="co-pay-btn" onClick={handlePlaceOrder}>
                  {payCta}
                </button>
                <p className="co-safe">🔒 100% Secure Payments</p>
              </>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
