import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Shared Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// ✅ Pages
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Home from "./pages/Home";
import BoysPage from "./pages/BoysPage";
import GirlsPage from "./pages/GirlsPage"; // ✅ Fixed import path
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LanguagePage from "./pages/LanguagePage";
import ProfilePage from "./pages/ProfilePage"; // ✅ Profile page
import ProductPage from "./pages/ProductPage"


// ✅ Context Providers
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

const App = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Router>
      <UserProvider>
        <CartProvider>
          {/* 🌟 Header with Filter Toggle */}
          <Header onFilterToggle={() => setShowFilters((prev) => !prev)} />

          {/* 🧭 Routing */}
          <main style={{ minHeight: "80vh" }}>
            <Routes>
              {/* 🏠 Home */}
              <Route path="/" element={<Home />} />

              {/* 👦 Boys Collection */}
              <Route
                path="/boys"
                element={
                  <BoysPage
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                  />
                }
              />


              {/* 👧 Girls Collection */}
              <Route
                path="/girls"
                element={
                  <GirlsPage
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                  />
                }
              />
              <Route path="/products/:id" element={<ProductPage />} />
              {/* 📄 General Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/language" element={<LanguagePage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* 🛒 Shopping */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </main>

          {/* 🌍 Footer */}
          <Footer />
        </CartProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
