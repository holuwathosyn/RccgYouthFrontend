import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../api/api";
import axios from "axios"; // Import standard axios for the silent reboot

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
  // CHECK AUTH (REFRESH PROOF FOR MOBILE)
  // ======================
  const checkAuth = async () => {
    if (!localStorage.getItem("isLoggedIn")) {
      clearAuthData();
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. SILENT REBOOT FOR MOBILE PHONE BROWSERS
      // Since memory is wiped on refresh and cookies are blocked, we use a clean 
      // direct instance call to fire a refresh token handshake first.
      try {
        const refreshResponse = await axios.post(
          "https://onrender.com",
          {},
          { withCredentials: true }
        );
        
        const freshToken = refreshResponse.data?.newAccessToken || refreshResponse.data?.accessToken;
        if (freshToken) {
          setAccessToken(freshToken); // Restores memory token instantly
        }
      } catch (refreshErr) {
        // If the refresh cookie is truly dead or expired, let it fall through to catch block
        console.log("Silent recovery skipped or unverified via cookies");
      }

      // 2. Now run the profile retrieval with headers restored
      const res = await api.get("/admin/me", {
        withCredentials: true,
      });

      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
      }

      setAdmin(res.data.admin || null);
    } catch (error) {
      console.error("Boot-up auth check failed:", error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GLOBAL INTERCEPTOR BINDING
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
