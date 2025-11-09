import React from "react";
import { useCart } from "../context/CartContext";
import "../styles/CartPage.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((sum, item) => {
    const itemPrice = parseInt(item.price.replace(/[₹,]/g, "")) * item.quantity;
    return sum + itemPrice;
  }, 0);

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
          {/* Product List */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.img} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>{item.style}</p>
                  <p className="item-price">{item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => removeFromCart(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>
              Total Items: <strong>{cartItems.length}</strong>
            </p>
            <p>
              Total Price: <strong>₹{totalPrice.toLocaleString()}</strong>
            </p>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
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
