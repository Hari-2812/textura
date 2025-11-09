import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Home from "./pages/Home";
import BoysPage from "./pages/BoysPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LanguagePage from "./pages/LanguagePage";
import ProfilePage from "./pages/ProfilePage"; // ✅
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext"; // ✅

const App = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <Header onFilterToggle={() => setShowFilters((prev) => !prev)} />

          <main style={{ minHeight: "80vh" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/boys"
                element={
                  <BoysPage
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                  />
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/language" element={<LanguagePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>

          <Footer />
        </CartProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
