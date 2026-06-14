import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // LOGIN
  // ======================
  const login = async (email, password) => {
    const res = await api.post(
      "/admin/login",
      { email, password },
      { withCredentials: true }
    );

    setAdmin(res.data.admin); // ✅ update state only
    return res.data;
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = async () => {
    try {
      await api.post("/admin/logout", {}, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }

    setAdmin(null); // ✅ clear state only
  };

  // ======================
  // REFRESH AUTH
  // ======================
  const refreshAuth = async () => {
    try {
      const res = await api.get("/admin/me", {
        withCredentials: true,
      });

      setAdmin(res.data.admin);
    } catch (error) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        refreshAuth,
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