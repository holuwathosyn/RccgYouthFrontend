import { createContext, useContext, useEffect, useState } from "react";
import api, { setLocalAccessToken } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // CLEAR AUTH
  // ======================
  const clearAuthData = () => {
    setAdmin(null);
    setLocalAccessToken(null);
  };

  // ======================
  // LOGIN
  // ======================
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post(
        "/admin/login",
        { email, password },
        { withCredentials: true }
      );

      // backend should return admin only
      setAdmin(res.data.admin);

      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/admin/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error(error);
    } finally {
      clearAuthData();
      setLoading(false);
    }
  };

  // ======================
  // CHECK AUTH (FIXED)
  // ======================
  const checkAuth = async () => {
    setLoading(true);

    try {
      const res = await api.get("/admin/me", {
        withCredentials: true,
      });

      setAdmin(res.data.admin || null);
    } catch (error) {
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // INIT
  // ======================
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};