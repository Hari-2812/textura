// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { WishlistProvider } from "./context/WishlistContext";
import "./index.css";
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </CartProvider>
  </UserProvider>
);
