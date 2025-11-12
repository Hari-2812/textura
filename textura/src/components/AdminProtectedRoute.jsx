// 📁 src/components/AdminProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    alert("Please log in as admin first!");
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    alert("Access denied ❌ Admins only!");
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtectedRoute;
