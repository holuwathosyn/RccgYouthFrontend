import { createContext, useContext, useEffect, useState } from "react";
import api, { setLocalAccessToken } from "../api/api.js"; // Matches the export above perfectly

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

      // Saves the token to memory for mobile safety
      if (res.data?.accessToken) {
        setLocalAccessToken(res.data.accessToken);
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
  // CHECK AUTH 
  // ======================
  const checkAuth = async () => {
    if (!localStorage.getItem("isLoggedIn")) {
      clearAuthData();
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/admin/me", {
        withCredentials: true,
      });

      if (res.data?.accessToken) {
        setLocalAccessToken(res.data.accessToken);
      }

      setAdmin(res.data.admin || null);
    } catch (error) {
      console.error("Boot auth check failed:", error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL RUN
  // ==========================================
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.config?.url?.includes("/admin/refresh-token")) {
          clearAuthData();
        }
        return Promise.reject(error);
      }
    );

    checkAuth();

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
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
