import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import BoysPage from "./pages/BoysPage";
import GirlsPage from "./pages/GirlsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import LanguagePage from "./pages/LanguagePage";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPassword from "./pages/ForgotPassword";
import OffersPage from "./pages/OffersPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import DeliveryOrders from "./pages/delivery/DeliveryOrders";


import { CartProvider } from "./context/CartContext";
import { UserProvider, useUser } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  // ✅ Hide Header/Footer for admin pages
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* ✅ Show Header/Footer only for user-facing pages */}
      {!isAdminPage && (
        <Header onFilterToggle={() => setShowFilters((prev) => !prev)} />
      )}

      <main style={{ minHeight: "80vh" }}>
        {/* ✅ All routes must be inside <Routes> */}
        <Routes>
          {/* 🧭 Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />} />

          <Route path="/delivery" element={<DeliveryOrders />} />

          {/* 🧭 Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 🧭 Protected User Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/boys"
            element={
              <ProtectedRoute>
                <BoysPage showFilters={showFilters} setShowFilters={setShowFilters} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/girls"
            element={
              <ProtectedRoute>
                <GirlsPage showFilters={showFilters} setShowFilters={setShowFilters} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <OffersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/language"
            element={
              <ProtectedRoute>
                <LanguagePage />
              </ProtectedRoute>
            }
          />

          {/* 🆕 Product details route (✅ Moved inside <Routes>) */}
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
        

      </main>

      {/* ✅ Footer hidden on admin pages */}
      {!isAdminPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
