import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Shared Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// ✅ Pages
import Home from "./pages/Home";
import BoysPage from "./pages/BoysPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

const App = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Router>
      {/* 🔹 Common Header — includes Filter button */}
      <Header onFilterToggle={() => setShowFilters((prev) => !prev)} />

      {/* 🔹 Page Routing */}
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          {/* 🏠 Home Page */}
          <Route path="/" element={<Home />} />

          {/* 👦 Boys Collection with Filter */}
          <Route
            path="/boys"
            element={
              <BoysPage
                showFilters={showFilters}
                setShowFilters={setShowFilters}
              />
            }
          />

          {/* 🛒 Cart Page */}
          <Route path="/cart" element={<CartPage />} />

          {/* 💳 Checkout Page */}
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>

      {/* 🔹 Common Footer */}
      <Footer />
    </Router>
  );
};

export default App;
