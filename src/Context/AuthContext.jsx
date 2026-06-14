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
const [initializing, setInitializing] = useState(true);

// ======================
// LOGIN
// ======================
const login = async (email, password) => {
const res = await api.post(
"/admin/login",
{ email, password },
{ withCredentials: true }
);

const adminData = res.data.admin;

setAdmin(adminData);

// Save admin info locally
localStorage.setItem(
  "admin",
  JSON.stringify(adminData)
);

return res.data;


};

// ======================
// LOGOUT
// ======================
const logout = async () => {
try {
await api.post(
"/admin/logout",
{},
{ withCredentials: true }
);
} catch (error) {
console.log(error);
}

setAdmin(null);
localStorage.removeItem("admin");


};

// ======================
// REFRESH AUTH
// ======================
const refreshAuth = async () => {
try {
const res = await api.get("/admin/me", {
withCredentials: true,
});


  const adminData = res.data.admin;

  setAdmin(adminData);

  localStorage.setItem(
    "admin",
    JSON.stringify(adminData)
  );
} catch (error) {
  // Fallback to localStorage
  const storedAdmin = localStorage.getItem("admin");

  if (storedAdmin) {
    setAdmin(JSON.parse(storedAdmin));
  } else {
    setAdmin(null);
  }
} finally {
  setLoading(false);
  setInitializing(false);
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
initializing,
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
throw new Error(
"useAuth must be used inside AuthProvider"
);
}

return context;
};
