import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  // ✅ IMPORTANT: SHOW LOADING STATE INSTEAD OF NULL
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // 🚫 NOT AUTHENTICATED
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // ✅ AUTHENTICATED
  return children;
}