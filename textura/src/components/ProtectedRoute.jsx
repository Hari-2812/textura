import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  // ❌ If no user logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Else allow access
  return children;
};

export default ProtectedRoute;