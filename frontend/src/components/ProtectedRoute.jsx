import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loadingSession } = useAuth();

  if (loadingSession) return <div className="p-8">Restoring session...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
