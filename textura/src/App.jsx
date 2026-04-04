import React, { Suspense, lazy, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import SkeletonBlock from "./components/SkeletonBlock";

const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const BoysPage = lazy(() => import("./pages/BoysPage"));
const GirlsPage = lazy(() => import("./pages/GirlsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LanguagePage = lazy(() => import("./pages/LanguagePage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const OffersPage = lazy(() => import("./pages/OffersPage"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const DeliveryOrders = lazy(() => import("./pages/delivery/DeliveryOrders"));
const DeliveryPartner = lazy(() => import("./pages/admin/DeliveryPartner"));
const TrackOrder = lazy(() => import("./pages/admin/TrackOrdersPage"));
const BlogDetails = lazy(() => import("./components/BlogDetails"));

const AppFallback = () => (
  <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
    <SkeletonBlock height={36} width="35%" />
    <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
      <SkeletonBlock height={68} />
      <SkeletonBlock height={68} />
      <SkeletonBlock height={68} />
    </div>
  </div>
);

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
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
      {!hideHeaderFooter && (
        <Header onFilterToggle={() => setShowFilters((prev) => !prev)} />
      )}

      <main style={{ minHeight: "80vh" }}>
        <Suspense fallback={<AppFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/admin/track-order/:id" element={<TrackOrder />} />
            <Route path="/delivery" element={<DeliveryOrders />} />
            <Route path="/delivery-partner" element={<DeliveryPartner />} />
            <Route path="/blog/:id" element={<BlogDetails />} />

            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/boys" element={<ProtectedRoute><BoysPage showFilters={showFilters} setShowFilters={setShowFilters} /></ProtectedRoute>} />
            <Route path="/girls" element={<ProtectedRoute><GirlsPage showFilters={showFilters} setShowFilters={setShowFilters} /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path="/offers" element={<ProtectedRoute><OffersPage /></ProtectedRoute>} />
            <Route path="/language" element={<ProtectedRoute><LanguagePage /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>

      {!hideHeaderFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <UserProvider>
        <CartProvider>
          <AppContent />
          <div id="toast-container"></div>
        </CartProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
