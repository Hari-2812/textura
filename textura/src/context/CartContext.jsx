import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔁 Save to localStorage so it persists
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 🛒 Add to cart OR increase quantity
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // increment quantity if product already exists
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // else add new item
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ➖ Remove one item or decrease quantity
  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing.quantity > 1) {
        // just decrease quantity
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      // remove item completely
      return prev.filter((item) => item.id !== id);
    });
  };

  // 🧹 Clear all
  const clearCart = () => {
    setCartItems([]);
  };

  // 🧮 Total count (for header icon)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
