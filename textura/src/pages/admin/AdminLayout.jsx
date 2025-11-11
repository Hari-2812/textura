import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import AdminDashboard from "./AdminDashboard";
import OrdersPage from "./OrdersPage";
import PaymentsPage from "./PaymentsPage";
import TrackOrdersPage from "./TrackOrdersPage";
import "../../styles/Admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminTopbar />
        <div className="admin-content">
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="track" element={<TrackOrdersPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
