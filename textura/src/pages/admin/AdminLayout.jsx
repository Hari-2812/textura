import React, { useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useUser } from "../../context/UserContext";

// Pages
import AdminDashboard from "./AdminDashboard";
import OrdersPage from "./OrdersPage";
import ProductsList from "./ProductsList";
import EditProduct from "./EditProduct";
import BulkAddProducts from "./BulkAddProducts";
import AdminOffersPage from "./AdminOffersPage";
import PaymentsPage from "./PaymentsPage";
import TrackOrdersPage from "./TrackOrdersPage";
import DeliveryPartner from "./DeliveryPartner";

import "../../styles/AdminLayout.css";

const AdminLayout = () => {
  const { logout, user } = useUser();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const menuItems = [
    { to: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/admin/orders", icon: "📦", label: "Orders" },
    { to: "/admin/products", icon: "🛍", label: "Products" },
    { to: "/admin/bulk-add", icon: "📥", label: "Bulk Add" },
    { to: "/admin/revenue", icon: "💰", label: "Payments" },
    { to: "/admin/delivery", icon: "🚚", label: "Delivery Status" },
    { to: "/admin/offers", icon: "🎁", label: "Offers" },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>TEXTURA</h2>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item, i) => (
            <NavLink key={i} to={item.to} className="menu-link">
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Orders */}
          <Route path="orders" element={<OrdersPage />} />

          {/* Product CRUD */}
          <Route path="products" element={<ProductsList />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="bulk-add" element={<BulkAddProducts />} />

          {/* FIXED working pages */}
          <Route path="revenue" element={<PaymentsPage />} />
          <Route path="delivery" element={<TrackOrdersPage />} />
          <Route path="partner" element={<DeliveryPartner />} />

          {/* Offers */}
          <Route path="offers" element={<AdminOffersPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;
