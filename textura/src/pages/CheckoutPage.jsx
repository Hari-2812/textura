import React from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useUser();

  const handlePlaceOrder = () => {
    alert(`✅ Order placed successfully for ${user.name}`);
    clearCart();
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
          <hr />
          <h4>Shipping To:</h4>
          <p>{user.name}</p>
          <p>{user.address}</p>
          <p>{user.phone}</p>
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
