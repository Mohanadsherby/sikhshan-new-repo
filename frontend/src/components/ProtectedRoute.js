import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  // Normalize allowedRoles to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!roles.includes(currentUser.role)) {
    // Logged in but not authorized
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute; 