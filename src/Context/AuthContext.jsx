import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // CLEAR AUTH
  // ======================
  const clearAuthData = () => {
    setAdmin(null);
    setAccessToken(null);
    localStorage.removeItem("isLoggedIn");
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

      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
      }

      setAdmin(res.data.admin);
      localStorage.setItem("isLoggedIn", "true");

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
  // CHECK AUTH (CLEAN + RELIABLE)
  // ======================
  const checkAuth = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/me", {
        withCredentials: true,
      });

      setAdmin(res.data.admin || null);

      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
      }

      localStorage.setItem("isLoggedIn", "true");
    } catch (error) {
      console.log("Auth check failed:", error?.response?.data);
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

export const useAuth = () => useContext(AuthContext);