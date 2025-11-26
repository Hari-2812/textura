import React from "react";
import { useCart } from "../context/CartContext";
import "../styles/CartPage.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // 🧮 Calculate total price safely for number or string prices
  const totalPrice = cartItems.reduce((sum, item) => {
    const numericPrice =
      typeof item.price === "string"
        ? parseInt(item.price.replace(/[₹,]/g, ""))
        : Number(item.price);

    return sum + numericPrice * item.quantity;
  }, 0);

  // 🚀 Proceed to Checkout Handler
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("🛒 Your cart is empty! Add some items before proceeding.");
      return;
    }

    // Save cart in localStorage (so CheckoutPage can access it)
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    navigate("/checkout");
  };

  return (
    <section className="cart-page">
      <h2>🛒 Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
          />
          <h3>Your cart is empty!</h3>
          <button onClick={() => navigate("/boys")}>Start Shopping</button>
        </div>
      ) : (
        <div className="cart-container">
          {/* 🧺 Product List */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id || item.id}>
                <img src={item.img} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>{item.style}</p>
                  <p className="item-price">{item.price}</p>

                  <div className="quantity-controls">
                    <button onClick={() => removeFromCart(item._id || item.id)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 📦 Summary Section */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>
              Total Items: <strong>{cartItems.length}</strong>
            </p>
            <p>
              Total Price:{" "}
              <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
            </p>

            {/* Checkout Button */}
            <button className="checkout-btn" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>

            {/* Clear Cart */}
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;
