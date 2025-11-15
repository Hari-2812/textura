import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    const parsed = saved ? JSON.parse(saved) : [];

    // ✅ Ensure stored prices become numbers (fix old data)
    return parsed.map((item) => ({
      ...item,
      price: Number(item.price) || 0,
    }));
  });

  // 🔁 Keep localStorage updated
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  /* =====================================================
     🛒 Add product to cart  (FIXED)
     - Normalizes price to number ALWAYS
  ===================================================== */
  const addToCart = (product) => {
    const cleanPrice = Number(product.price) || 0; // IMPORTANT FIX

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id || item._id === product._id
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id || item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          price: cleanPrice, // Store as number
          quantity: 1,
        },
      ];
    });
  };

  /* =====================================================
     ➖ Remove or reduce quantity
  ===================================================== */
  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === id || item._id === id
      );

      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === id || item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      return prev.filter(
        (item) => item.id !== id && item._id !== id
      );
    });
  };

  /* =====================================================
     🔼 Increase quantity (needed for Cart page)
  ===================================================== */
  const increaseQty = (product) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === product.id || item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  /* =====================================================
     🔽 Decrease quantity (but prevent negative)
  ===================================================== */
  const decreaseQty = (product) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === product.id || item._id === product._id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* =====================================================
     🧹 Clear Cart
  ===================================================== */
  const clearCart = () => setCartItems([]);

  /* =====================================================
     🔢 Cart Count for Header
  ===================================================== */
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
