import axios from "axios";

// ===========================
// BASE API
// ===========================
const api = axios.create({
  baseURL: "https://api-rccgyouthgloryofgod.onrender.com/api",
  withCredentials: true,
});

// ===========================
// REFRESH API
// ===========================
const refreshApi = axios.create({
  baseURL: "https://api-rccgyouthgloryofgod.onrender.com/api",
  withCredentials: true,
});

// ===========================
// MEMORY TOKEN (CRITICAL FOR ANDROID)
// ===========================
let memoryToken = null;

// Named exactly what AuthContext expects
export const setLocalAccessToken = (token) => {
  memoryToken = token;
};

// Automatically attach the token header to EVERY outgoing request
api.interceptors.request.use((config) => {
  if (memoryToken) {
    config.headers.Authorization = `Bearer ${memoryToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ===========================
// REFRESH STATE
// ===========================
let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });

  queue = [];
};

// ===========================
// RESPONSE INTERCEPTOR
// ===========================
api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config;

    // Stop loops if the refresh path itself fails
    if (original.url?.includes("/admin/refresh-token")) {
      return Promise.reject(error);
    }

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    isRefreshing = true;

    try {
      const res = await refreshApi.post("/admin/refresh-token");

      // Check your backend field name: should match what backend returns (newAccessToken)
      const newToken = res.data?.newAccessToken || res.data?.accessToken;

      if (!newToken) {
        throw new Error("No access token returned");
      }

      setLocalAccessToken(newToken);

      isRefreshing = false;
      processQueue(null, newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);

    } catch (err) {
      isRefreshing = false;
      processQueue(err, null);

      setLocalAccessToken(null);
      localStorage.removeItem("isLoggedIn");

      return Promise.reject(err);
    }
  }
);

export default api;
