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
    } finally {
      clearAuthData();
      setLoading(false);
    }
  };

  // ======================
  // CHECK AUTH (FIXED FLOW)
  // ======================
  const checkAuth = async () => {
    setLoading(true);

    try {
      // 1. TRY NORMAL SESSION
      const res = await api.get("/admin/me", {
        withCredentials: true,
      });

      if (res.data?.admin) {
        setAdmin(res.data.admin);
        if (res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
        }
        localStorage.setItem("isLoggedIn", "true");
        return;
      }

      throw new Error("No admin returned");
    } catch (error) {
      try {
        // 2. TRY REFRESH (ONLY IF /ME FAILS)
        const refresh = await api.post(
          "/admin/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = refresh.data?.accessToken;

        if (!newToken) throw new Error("No refresh token");

        setAccessToken(newToken);

        // 3. RETRY /ME AFTER REFRESH
        const retry = await api.get("/admin/me", {
          withCredentials: true,
        });

        setAdmin(retry.data.admin);
        localStorage.setItem("isLoggedIn", "true");
      } catch (err) {
        clearAuthData();
      }
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