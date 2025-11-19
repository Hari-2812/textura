import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

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
import DeliveryPartner from "./pages/admin/DeliveryPartner";
import TrackOrder from "./pages/admin/TrackOrdersPage";

import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HelpCenter from "./pages/HelpCenter";
import MyOrders from "./pages/MyOrders";

const AppContent = () => {
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  const hideHeaderFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideHeaderFooter && (
        <Header onFilterToggle={() => setShowFilters((prev) => !prev)} />
      )}

      <main style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/help" element={<HelpCenter />} />

          {/* Delivery */}
          <Route path="/delivery" element={<DeliveryOrders />} />
          <Route path="/delivery-partner" element={<DeliveryPartner />} />
          <Route path="/admin/track-order/:id" element={<TrackOrder />} />

          {/* Protected Routes */}
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
                <BoysPage
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/girls"
            element={
              <ProtectedRoute>
                <GirlsPage
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                />
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
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
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

      {/* Toast Container */}
      <div id="toast-container"></div>

      {!hideHeaderFooter && <Footer />}
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
