import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  // 🔥 IMPORTANT: WAIT FOR AUTH CHECK FIRST
  if (loading) return null; // or spinner

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}