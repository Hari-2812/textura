import React from "react";
import { NavLink, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

// Import Admin Pages
import AdminDashboard from "./AdminDashboard";
import OrdersPage from "./OrdersPage";
import ProductsList from "./ProductsList";
import EditProduct from "./EditProduct";
import BulkAddProducts from "./BulkAddProducts";

import "../../styles/AdminLayout.css";

const AdminLayout = () => {
  const { logout, user } = useUser();
  const navigate = useNavigate();

  // Protect Admin Access
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  const handleLogout = () => {
    logout();
    alert("Admin logged out successfully!");
    navigate("/admin-login");
  };

  return (
    <div className="admin-layout">
      
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Textura</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">

          <NavLink to="/admin/dashboard" className="sidebar-link">
            📊 Dashboard
          </NavLink>

          <NavLink to="/admin/orders" className="sidebar-link">
            📦 Orders
          </NavLink>

          <NavLink to="/admin/products" className="sidebar-link">
            🛍 Products
          </NavLink>

          <NavLink to="/admin/add-product" className="sidebar-link">
            ➕ Add Product
          </NavLink>

          <NavLink to="/admin/bulk-add" className="sidebar-link">
            📥 Bulk Add
          </NavLink>

        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" />} />

          {/* Product Management */}
          <Route path="products" element={<ProductsList />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="bulk-add" element={<BulkAddProducts />} />
          <Route path="add-product" element={<BulkAddProducts />} />

          {/* Admin Pages */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<OrdersPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;
